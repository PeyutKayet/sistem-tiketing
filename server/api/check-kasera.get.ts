import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const orderId = query.order_id

  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing order_id' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // 1. Cari transaksi di DB kita
  const { data: pesertas, error: findErr } = await supabase
    .from('peserta')
    .select('id, status_bayar, data_tambahan')
    .eq('data_tambahan->>order_id', orderId)

  if (findErr || !pesertas || pesertas.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  // Gunakan data dari peserta pertama untuk pengecekan status (asumsi semua tiket dalam 1 order statusnya sama)
  const perwakilan = pesertas[0]

  // Jika di DB kita sudah paid, tidak usah hit Kasera
  if (perwakilan.status_bayar === 'paid') {
    return { status: 'already_paid' }
  }

  // Jika transaksi tidak menggunakan kasera
  if (perwakilan.data_tambahan?.payment?.gateway !== 'kasera') {
    return { status: 'not_kasera_transaction' }
  }

  const ids = pesertas.map(p => p.id)

  // 2. Tanya ke Kasera
  try {
    const kaseraRes: any = await $fetch(`https://pay.kasera.id/v1/transactions?external_id=${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.kaseraApiKey}`
      }
    })

    // Asumsi: response kasera berisi array atau object dengan field status
    // Struktur respons spesifik Kasera perlu dicek di dokumentasi aslinya
    const statusData = Array.isArray(kaseraRes) ? kaseraRes[0] : kaseraRes

    if (statusData && statusData.status === 'succeeded') {
      // Update DB
      await supabase
        .from('peserta')
        .update({ status_bayar: 'paid' })
        .in('id', ids)
      
      return { status: 'success', payment_status: 'paid' }
    } else {
      return { status: 'pending', payment_status: statusData?.status || 'pending' }
    }

  } catch (error: any) {
    console.error('Gagal sinkronisasi dengan Kasera:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengecek status' })
  }
})
