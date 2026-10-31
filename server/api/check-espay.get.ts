import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const orderId = query.order_id as string

  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing order_id' })
  }

  // Cek apakah order ini berasal dari simulasi testing payment (in-memory)
  let simOrder = globalThis._simulasiOrders?.get(orderId)
  if (!simOrder && globalThis._simulasiOrders) {
    for (const ord of globalThis._simulasiOrders.values()) {
      if (ord.order_id === orderId || ord.payment?.va_number === orderId) {
        simOrder = ord
        break
      }
    }
  }

  if (simOrder) {
    if (query.simulate_pay === 'true') {
      simOrder.status = 'paid'
      if (simOrder.payment) simOrder.payment.status = 'paid'
      globalThis._simulasiOrders?.set(simOrder.order_id, simOrder)
      if (simOrder.payment?.va_number) {
        globalThis._simulasiOrders?.set(simOrder.payment.va_number, simOrder)
      }
      return {
        status: 'paid',
        order_id: simOrder.order_id,
        ticket_count: 1,
        simulated: true,
        payment: simOrder.payment,
        order: simOrder
      }
    }

    return {
      status: simOrder.status || 'pending',
      order_id: simOrder.order_id,
      ticket_count: 1,
      payment: simOrder.payment,
      order: simOrder,
      created_at: simOrder.created_at
    }
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // 1. Cek status di tabel orders terlebih dahulu (Super cepat via Primary Key Index)
  try {
    const { data: orderRow } = await supabase
      .from('orders')
      .select('id, status_pembayaran, status_dana, total_tagihan, data_transaksi, created_at, paid_at')
      .eq('id', orderId)
      .maybeSingle()

    if (orderRow) {
      if (orderRow.status_pembayaran === 'paid') {
        return {
          status: 'paid',
          order_id: orderId,
          payment: orderRow.data_transaksi || null,
          paid_at: orderRow.paid_at
        }
      }

      if (orderRow.status_pembayaran === 'cancelled') {
        return {
          status: 'cancelled',
          order_id: orderId,
          message: 'Pesanan telah dibatalkan.'
        }
      }

      // Lindungi transaksi cadangan QRIS Tyket: jangan dibatalkan otomatis oleh timer 15 menit
      const isManualBackup = orderRow.data_transaksi?.gateway === 'manual' || 
                             orderRow.data_transaksi?.tipe_gateway === 'manual_tyket' ||
                             orderRow.data_transaksi?.gateway === 'manual_tyket' ||
                             (orderRow as any).metode_pembayaran === 'qris_backup_tyket' ||
                             (orderRow as any).metode_pembayaran === 'manual'

      if (isManualBackup) {
        return {
          status: orderRow.status_pembayaran || 'pending',
          order_id: orderId,
          is_manual: true,
          tipe_gateway: 'manual_tyket',
          payment: orderRow.data_transaksi || null,
          created_at: orderRow.created_at
        }
      }

      // Cek apakah transaksi pending sudah melewati batas 15 menit
      const createdTime = orderRow.created_at ? new Date(orderRow.created_at).getTime() : Date.now()
      const expiresAt = createdTime + 15 * 60 * 1000
      const isExpired = Date.now() > expiresAt

      if (isExpired) {
        await supabase.from('orders').update({ status_pembayaran: 'cancelled' }).eq('id', orderId)
        await supabase.from('peserta').update({ status_bayar: 'cancelled' }).or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`)
        return {
          status: 'expired',
          order_id: orderId,
          message: 'Batas waktu pembayaran (15 menit) telah habis. Pesanan dibatalkan.'
        }
      }

      const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))

      return {
        status: 'pending',
        order_id: orderId,
        payment: orderRow.data_transaksi || null,
        created_at: orderRow.created_at,
        remaining_seconds: remainingSeconds
      }
    }
  } catch (ordCheckErr) {
    console.warn('Pengecekan tabel orders gagal, fallback ke tabel peserta:', ordCheckErr)
  }

  // 2. Fallback: Cari status pesanan di tabel peserta (untuk kompatibilitas data lama)
  const { data: pesertas, error: findErr } = await supabase
    .from('peserta')
    .select('id, status_bayar, data_tambahan, created_at')
    .or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`)

  if (findErr || !pesertas || pesertas.length === 0) {
    return { status: 'not_found' }
  }

  const perwakilan = pesertas[0]
  if (perwakilan.status_bayar === 'paid') {
    return {
      status: 'paid',
      order_id: orderId,
      ticket_count: pesertas.length,
      payment: perwakilan.data_tambahan?.payment || null
    }
  }

  if (perwakilan.status_bayar === 'cancelled') {
    return {
      status: 'cancelled',
      order_id: orderId,
      message: 'Pesanan telah dibatalkan.'
    }
  }

  const isPesertaManual = perwakilan.data_tambahan?.payment?.gateway === 'manual' ||
                          perwakilan.data_tambahan?.payment?.tipe_gateway === 'manual_tyket' ||
                          perwakilan.data_tambahan?.payment?.channel === 'qris_backup_tyket'
  if (isPesertaManual) {
    return {
      status: perwakilan.status_bayar || 'pending',
      order_id: orderId,
      is_manual: true,
      tipe_gateway: 'manual_tyket',
      ticket_count: pesertas.length,
      payment: perwakilan.data_tambahan?.payment || null,
      created_at: perwakilan.created_at
    }
  }

  const createdTime = perwakilan.created_at ? new Date(perwakilan.created_at).getTime() : Date.now()
  const expiresAt = createdTime + 15 * 60 * 1000
  const isExpired = Date.now() > expiresAt

  if (isExpired) {
    const ids = pesertas.map(p => p.id)
    await supabase.from('peserta').update({ status_bayar: 'cancelled' }).in('id', ids)
    return {
      status: 'expired',
      order_id: orderId,
      message: 'Batas waktu pembayaran (15 menit) telah habis. Pesanan dibatalkan.'
    }
  }

  const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))

  return {
    status: 'pending',
    order_id: orderId,
    ticket_count: pesertas.length,
    payment: perwakilan.data_tambahan?.payment || null,
    created_at: perwakilan.created_at,
    remaining_seconds: remainingSeconds
  }
})
