import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // 1. Dapatkan Raw Body & Signature
  const rawBody = await readRawBody(event, 'utf-8')
  if (!rawBody) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const signature = getHeader(event, 'Kasera-Signature-V1')
  if (!signature) {
    throw createError({ statusCode: 401, statusMessage: 'Missing signature' })
  }

  // 2. Validasi HMAC-SHA256 (Kasera-Signature-V1)
  const parts = signature.split(",")
  const t = Number(parts[0].slice(2)) // "t=<unix>"
  
  if (!Number.isFinite(t)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature timestamp' })
  }
  
  // Tolak jika lebih dari 5 menit (300 detik) untuk cegah Replay Attack
  if (Math.abs(Date.now() / 1000 - t) > 300) {
    throw createError({ statusCode: 401, statusMessage: 'Signature expired' })
  }

  const expectedHex = crypto
    .createHmac('sha256', config.kaseraWebhookSecret)
    .update(t + "." + rawBody)
    .digest('hex')

  const expectedBuffer = Buffer.from(expectedHex)

  const isValid = parts
    .slice(1)
    .filter((p) => p.startsWith("v1="))
    .some((p) => {
      const sig = Buffer.from(p.slice(3))
      return (
        sig.length === expectedBuffer.length &&
        crypto.timingSafeEqual(sig, expectedBuffer)
      )
    })

  if (!isValid) {
    console.error('Invalid Kasera-Signature-V1')
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  const payload = JSON.parse(rawBody)

  // 3. Logika Update jika Pembayaran Sukses
  if (payload.type === 'payment.paid' && payload.data.status === 'succeeded') {
    const orderId = payload.data.external_id

    // SANGAT PENTING: Gunakan standard supabase js, bukan serverSupabaseClient (karena webhook ga punya cookie)
    const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

    // Cari ID peserta berdasarkan order_id yang ada di dalam JSONB data_tambahan
    const { data: pesertas, error: findErr } = await supabase
      .from('peserta')
      .select('id')
      .eq('data_tambahan->>order_id', orderId)

    if (findErr || !pesertas || pesertas.length === 0) {
      console.error('Pesanan tidak ditemukan untuk order_id:', orderId)
      return { status: 'ignored', message: 'Order not found' }
    }

    // Ambil semua ID peserta dalam pesanan tersebut
    const ids = pesertas.map(p => p.id)

    // Update status_bayar jadi 'paid' untuk semua ID tersebut
    const { error: updateErr } = await supabase
      .from('peserta')
      .update({ status_bayar: 'paid' })
      .in('id', ids)

    if (updateErr) {
      console.error('Gagal update status DB:', updateErr)
      throw createError({ statusCode: 500, statusMessage: 'Database error' })
    }

    console.log(`Berhasil melunaskan pesanan ${orderId} otomatis via Kasera Webhook`)
    return { status: 'success' }
  }

  return { status: 'ignored' }
})
