import { serverSupabaseServiceRole } from '#supabase/server'
import { getFonnteConfig } from '../utils/getFonnteConfig'

// In-memory rate limiting map: key -> timestamp (ms)
const resendRateLimitMap = new Map<string, number>()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body || !body.no_wa || !body.ticket_id) {
    throw createError({ statusCode: 400, statusMessage: 'Data tidak lengkap: nomor WA dan ticket_id wajib diisi' })
  }

  // 1. Normalisasi nomor WhatsApp
  let noWa = String(body.no_wa).replace(/\D/g, '')
  if (noWa.startsWith('0')) noWa = '62' + noWa.substring(1)
  
  if (noWa.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor WhatsApp tidak valid' })
  }

  const rateLimitKey = `${noWa}_${body.ticket_id}`
  const now = Date.now()
  const lastSent = resendRateLimitMap.get(rateLimitKey) || 0
  const cooldownMs = 120_000 // 2 menit

  if (now - lastSent < cooldownMs) {
    const sisaDetik = Math.ceil((cooldownMs - (now - lastSent)) / 1000)
    throw createError({ 
      statusCode: 429, 
      statusMessage: `Mohon tunggu ${sisaDetik} detik lagi sebelum meminta kirim ulang tiket via WhatsApp.` 
    })
  }

  // 2. Validasi ke Database: Pastikan tiket benar-benar ada, milik no_wa ini, dan sudah lunas
  const supabase = await serverSupabaseServiceRole(event)
  const waVariants = [noWa]
  if (noWa.startsWith('62')) waVariants.push('0' + noWa.substring(2))

  const { data: pesertas, error: findErr } = await supabase
    .from('peserta')
    .select('id, nama_lengkap, nama_tiket, no_wa, status_bayar, data_tambahan')
    .or(`data_tambahan->>ticket_id.eq.${body.ticket_id},data_tambahan->>order_id.eq.${body.ticket_id}`)
    .in('no_wa', waVariants)
    .limit(1)

  if (findErr || !pesertas || pesertas.length === 0) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: 'Tiket tidak ditemukan atau nomor WhatsApp tidak sesuai dengan data pendaftaran.' 
    })
  }

  const peserta = pesertas[0]
  if (peserta.status_bayar !== 'paid') {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Tiket belum lunas. Hanya tiket yang telah lunas yang dapat dikirimkan.' 
    })
  }

  // 3. Siapkan pesan WhatsApp resmi
  const { fonnteToken } = getFonnteConfig()
  const baseUrl = getRequestURL(event).origin || 'https://tyket.id'
  const orderId = peserta.data_tambahan?.order_id || body.order_id || body.ticket_id
  const tiketUrl = `${baseUrl}/tiket/${orderId}`
  const namaTiket = peserta.nama_tiket || body.nama_tiket || 'Event'
  const namaLengkap = peserta.nama_lengkap || body.nama_lengkap || 'Kak'

  const pesan = `Halo ${namaLengkap},\n\nBerikut adalah tautan e-Tiket resmi Anda untuk acara *${namaTiket}*.\n\nTicket ID: *${body.ticket_id}*\n\nSilakan cek detail tiket dan barcode masuk Anda melalui tautan berikut:\n${tiketUrl}\n\nTerima kasih dan sampai jumpa di lokasi acara! 🙏`

  const formData = new FormData()
  formData.append('target', noWa)
  formData.append('message', pesan)

  try {
    const res = await $fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': fonnteToken },
      body: formData
    })
    
    // Catat waktu pengiriman untuk rate limiter
    resendRateLimitMap.set(rateLimitKey, now)

    return { status: 'success', message: 'Tiket berhasil dikirimkan ke WhatsApp Anda.', data: res }
  } catch (error: any) {
    console.error('[Resend Ticket] Gagal kirim WA Fonnte:', error)
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengirim WhatsApp ke nomor Anda' })
  }
})
