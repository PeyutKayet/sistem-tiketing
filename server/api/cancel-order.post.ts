import { serverSupabaseServiceRole } from '#supabase/server'
import { verifyOrderCancelToken } from '../utils/adminToken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const orderId = body?.order_id
  const cancelToken = body?.cancel_token

  if (!orderId || typeof orderId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Parameter order_id wajib diisi' })
  }

  if (!cancelToken || typeof cancelToken !== 'string') {
    throw createError({ statusCode: 403, statusMessage: 'Token keamanan pembatalan (cancel_token) wajib disertakan' })
  }

  // Verifikasi keaslian token pembatalan pesanan (HMAC-SHA256)
  const isValid = verifyOrderCancelToken(orderId, cancelToken)
  if (!isValid) {
    throw createError({ statusCode: 403, statusMessage: 'Akses ditolak: Token pembatalan pesanan tidak valid' })
  }

  const supabase = await serverSupabaseServiceRole(event)

  // Cari dan pastikan transaksi masih 'pending' sebelum dibatalkan
  const { data: pesertas, error: findErr } = await supabase
    .from('peserta')
    .select('id, status_bayar')
    .eq('data_tambahan->>order_id', orderId)

  if (findErr) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal mencari pesanan: ' + findErr.message })
  }

  if (!pesertas || pesertas.length === 0) {
    return { success: true, message: 'Pesanan tidak ditemukan atau sudah dibersihkan' }
  }

  // Jika sudah 'paid', tolak pembatalan
  const alreadyPaid = pesertas.some(p => p.status_bayar === 'paid')
  if (alreadyPaid) {
    throw createError({ statusCode: 400, statusMessage: 'Pesanan sudah dibayar, tidak dapat dibatalkan.' })
  }

  // Update status menjadi 'cancelled'
  const ids = pesertas.map(p => p.id)
  const { error: updateErr } = await supabase
    .from('peserta')
    .update({ status_bayar: 'cancelled' })
    .in('id', ids)

  if (updateErr) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal membatalkan pesanan: ' + updateErr.message })
  }

  return {
    success: true,
    message: 'Pesanan berhasil dibatalkan.',
    order_id: orderId,
    cancelled_count: ids.length
  }
})
