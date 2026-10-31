import { serverSupabaseServiceRole } from '#supabase/server'

// Rate limiting untuk mencegah brute force PIN (max 5 percobaan salah per event)
const scanPinAttemptMap = new Map<string, { count: number; lockedUntil: number }>()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.event_id || !body.qr_data || !body.pin) {
    throw createError({ statusCode: 400, statusMessage: 'Data tidak lengkap.' })
  }

  const rateLimitKey = `scan_pin_${body.event_id}`
  const now = Date.now()
  const attempt = scanPinAttemptMap.get(rateLimitKey)

  // Cek apakah sedang dalam masa lockout akibat salah 5x berturut-turut
  if (attempt && attempt.lockedUntil > now) {
    const sisa = Math.ceil((attempt.lockedUntil - now) / 1000)
    throw createError({ 
      statusCode: 429, 
      statusMessage: `Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara (${sisa} detik lagi).` 
    })
  }

  const supabase = await serverSupabaseServiceRole(event)

  // 1. Validasi Event & PIN Organizer
  const { data: eventData, error: eventErr } = await supabase
    .from('event')
    .select('id, organizer_id, settings')
    .eq('id', body.event_id)
    .single()

  if (eventErr || !eventData) {
    throw createError({ statusCode: 404, statusMessage: 'Event tidak ditemukan.' })
  }

  const { data: orgData } = await supabase
    .from('organizer_profile')
    .select('pin_scanner')
    .eq('id', eventData.organizer_id)
    .single()

  const correctPin = orgData?.pin_scanner
  if (!correctPin || correctPin === '123456') {
    throw createError({ statusCode: 403, statusMessage: 'PIN Scanner belum dikonfigurasi kustom oleh penyelenggara.' })
  }
  
  if (body.pin !== correctPin) {
    const currentCount = (attempt && attempt.lockedUntil <= now ? 0 : (attempt?.count || 0)) + 1
    if (currentCount >= 5) {
      scanPinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: now + 120_000 }) // lock 2 menit
      throw createError({ 
        statusCode: 429, 
        statusMessage: 'Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara selama 2 menit.' 
      })
    } else {
      scanPinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: 0 })
      throw createError({ statusCode: 403, statusMessage: `PIN Scanner tidak valid. (Sisa percobaan: ${5 - currentCount})` })
    }
  }

  // Jika PIN benar, bersihkan counter percobaan
  scanPinAttemptMap.delete(rateLimitKey)

  // 2. Cari Tiket Peserta (Utamakan ticket_id unik, jika order_id ambil tiket yang belum scan)
  let peserta: any = null
  const { data: ticketMatches } = await supabase
    .from('peserta')
    .select('*')
    .eq('event_id', eventData.id)
    .eq('data_tambahan->>ticket_id', body.qr_data)
    .limit(1)

  if (ticketMatches && ticketMatches.length > 0) {
    peserta = ticketMatches[0]
  } else {
    const { data: orderMatches } = await supabase
      .from('peserta')
      .select('*')
      .eq('event_id', eventData.id)
      .eq('data_tambahan->>order_id', body.qr_data)
      .order('id', { ascending: true })

    if (orderMatches && orderMatches.length > 0) {
      peserta = orderMatches.find(p => !p.is_scanned) || orderMatches[0]
    }
  }

  if (!peserta) {
    throw createError({ statusCode: 404, statusMessage: 'Tiket ini BUKAN untuk event ini, atau QR Code palsu.' })
  }

  if (peserta.status_bayar !== 'paid') {
    throw createError({ statusCode: 400, statusMessage: `Tiket belum lunas (Status: ${peserta.status_bayar})` })
  }

  const checkinMode = eventData.settings?.sistem_checkin || 'scanner'

  // 3. Logika Update & Response
  let responseData = {
    success: false,
    title: '',
    message: '',
    pesertaName: peserta.nama_lengkap
  }

  const nowIso = new Date().toISOString()

  if (checkinMode === 'scanner') {
    // 1x Datang (Hangus)
    if (peserta.is_scanned) {
      responseData.success = false
      responseData.title = 'DITOLAK!'
      responseData.message = 'Tiket ini sudah pernah di-scan dan di-check-in sebelumnya.'
    } else {
      // ATOMIC CONDITIONAL UPDATE: Mencegah Race Condition Double Entry di gerbang berbeda
      const { data: updatedRows, error: updateErr } = await supabase
        .from('peserta')
        .update({ is_scanned: true, scanned_at: nowIso })
        .eq('id', peserta.id)
        .eq('is_scanned', false)
        .select('id')

      if (updateErr || !updatedRows || updatedRows.length === 0) {
        responseData.success = false
        responseData.title = 'DITOLAK!'
        responseData.message = 'Tiket ini baru saja di-scan di pintu lain.'
      } else {
        try {
          await supabase.from('riwayat_absen').insert({ peserta_id: peserta.id, metode: 'scanner_gate', waktu_absen: nowIso })
        } catch (e) {}
        responseData.success = true
        responseData.title = 'AKSES DITERIMA'
        responseData.message = 'Check-in berhasil dicatat.'
      }
    }
  } else if (checkinMode === 'none') {
    // Tanpa Batas Keluar Masuk
    if (!peserta.is_scanned) {
      await supabase.from('peserta').update({ is_scanned: true, scanned_at: nowIso }).eq('id', peserta.id)
    }
    try {
      await supabase.from('riwayat_absen').insert({ peserta_id: peserta.id, metode: 'scanner_free_access', waktu_absen: nowIso })
    } catch (e) {}
    responseData.success = true
    responseData.title = 'SILAKAN MASUK'
    responseData.message = 'Akses tanpa batas keluar-masuk (Pameran).'
  } else if (checkinMode === 'portal') {
    // Multi Hari
    if (!peserta.is_scanned) {
      await supabase.from('peserta').update({ is_scanned: true, scanned_at: nowIso }).eq('id', peserta.id)
    }
    try {
      await supabase.from('riwayat_absen').insert({ peserta_id: peserta.id, metode: 'portal_multi_hari', waktu_absen: nowIso })
    } catch (e) {}
    responseData.success = true
    responseData.title = 'AKSES MULTI-HARI'
    responseData.message = 'Log kehadiran berhasil dicatat.'
  }

  return responseData
})
