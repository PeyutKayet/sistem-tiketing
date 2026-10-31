import { serverSupabaseServiceRole } from '#supabase/server'

// Simple in-memory rate limiter: maks 6 request per 60 detik per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 })
    return true
  }
  if (record.count >= 6) {
    return false
  }
  record.count++
  return true
}

export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!checkRateLimit(clientIp)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak percobaan pencarian. Mohon tunggu 1 menit sebelum mencoba lagi.'
    })
  }

  const body = await readBody(event)
  const rawWa = body?.no_wa ? String(body.no_wa).trim() : ''
  const rawEmail = body?.email ? String(body.email).trim().toLowerCase() : ''

  if (!rawWa || !rawEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Harap masukkan Nomor WhatsApp dan Alamat Email pendaftaran dengan lengkap.'
    })
  }

  // Normalisasi nomor WhatsApp
  const digits = rawWa.replace(/\D/g, '')
  if (digits.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor WhatsApp tidak valid.' })
  }

  const waVariants: string[] = [digits]
  if (digits.startsWith('0')) {
    waVariants.push('62' + digits.substring(1))
  } else if (digits.startsWith('62')) {
    waVariants.push('0' + digits.substring(2))
  } else {
    waVariants.push('62' + digits)
    waVariants.push('0' + digits)
  }

  const supabase = await serverSupabaseServiceRole(event)

  // Query peserta yang cocok dengan nomor WA dan Email
  const { data: pesertas, error: findErr } = await supabase
    .from('peserta')
    .select(`
      id,
      event_id,
      kategori_id,
      nama_lengkap,
      email,
      no_wa,
      nama_tiket,
      status_bayar,
      is_scanned,
      scanned_at,
      bukti_bayar_url,
      data_tambahan,
      created_at,
      event:event_id (
        id,
        nama_event,
        slug,
        lokasi,
        tanggal_mulai,
        poster_url,
        settings,
        organizer_id,
        organizer_profile:organizer_id (
          nama_organizer,
          no_wa,
          link_ig,
          link_web,
          logo_url
        )
      ),
      kategori:kategori_id (
        id,
        nama_kategori,
        harga
      )
    `)
    .in('no_wa', waVariants)
    .ilike('email', rawEmail)
    .neq('status_bayar', 'cancelled')
    .order('created_at', { ascending: false })

  if (findErr) {
    console.error('[Search Tickets] Supabase Error:', findErr)
    throw createError({ statusCode: 500, statusMessage: `Gagal mencari tiket: ${findErr.message}` })
  }

  if (!pesertas || pesertas.length === 0) {
    return {
      success: true,
      found: false,
      message: 'Tiket tidak ditemukan. Pastikan Nomor WhatsApp dan Email yang Anda masukkan sama persis dengan saat pendaftaran.',
      orders: []
    }
  }

  // Kelompokkan data per order_id
  const orderMap = new Map<string, any>()

  for (const p of pesertas) {
    const orderId = p.order_id || p.data_tambahan?.order_id || `TRX-${p.id}`
    if (!orderMap.has(orderId)) {
      orderMap.set(orderId, {
        order_id: orderId,
        event: p.event,
        created_at: p.created_at,
        status_bayar: p.status_bayar,
        bukti_bayar_url: p.bukti_bayar_url,
        tickets: []
      })
    }

    const orderObj = orderMap.get(orderId)
    orderObj.tickets.push({
      id: p.id,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      no_wa: p.no_wa,
      nama_tiket: p.nama_tiket,
      ticket_id: p.data_tambahan?.ticket_id || `TIK-${p.id}`,
      kategori: p.kategori,
      is_scanned: p.is_scanned || false,
      scanned_at: p.scanned_at || null
    })
  }

  const orders = Array.from(orderMap.values())

  return {
    success: true,
    found: true,
    total_tickets: pesertas.length,
    orders
  }
})
