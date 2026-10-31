import { promises as fs } from 'fs'
import { createClient } from '@supabase/supabase-js'
import {
  verifyPaymentReportSignature,
  generatePaymentReportResponseSignature,
  getEspayDatetime,
  getEspayTimestamp
} from '../../utils/espay'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  if (method === 'GET' || method === 'HEAD') {
    return { status: 'ok', service: 'Espay Payment Webhook', timestamp: new Date().toISOString() }
  }

  const config = useRuntimeConfig()
  const espaySignatureKey = config.espaySignatureKey || process.env.ESPAY_SIGNATURE_KEY || 'hme6w1tnjl15bsme'
  const commCode = config.espayCommCode || process.env.ESPAY_COMM_CODE || 'SGWZULKARNAENALMUHAMMADY'

  let body: any = {}
  try {
    body = await readBody(event) || {}
  } catch {
    body = {}
  }
  const query = getQuery(event) || {}
  const payload = { ...query, ...body }

  fs.appendFile(
    'logs/webhook-debug.log',
    `\n[${new Date().toISOString()}] POST /api/webhook/espay\nHeaders: ${JSON.stringify(getHeaders(event))}\nPayload: ${JSON.stringify(payload, null, 2)}\n`
  ).catch(() => {})

  // Deteksi format notifikasi: SNAP BI vs Legacy Espay
  const isSnap = Boolean(
    payload.virtualAccountNo ||
    payload.paymentRequestId ||
    payload.partnerServiceId ||
    getHeader(event, 'x-signature') ||
    getHeader(event, 'channel-id')
  )

  // Parameter dari Espay Payment Notification
  const rqUuid = payload.rq_uuid || payload.inquiryRequestId || payload.paymentRequestId || getHeader(event, 'x-external-id') || ''
  const rqDatetime = payload.rq_datetime || payload.trxDateInit || payload.trxDateTime || getHeader(event, 'x-timestamp') || ''
  const orderId = payload.order_id || 
                  payload.virtualAccountNo || 
                  payload.partnerReferenceNo || 
                  payload.additionalInfo?.partnerReferenceNo || 
                  payload.additionalInfo?.userId || 
                  payload.referenceNo || 
                  payload.va_number || ''
  const receivedSignature = payload.signature || getHeader(event, 'x-signature') || ''
  const paymentRef = payload.payment_ref || 
                     payload.trxId || 
                     payload.additionalInfo?.paymentRef || 
                     payload.additionalInfo?.approvalCode || 
                     payload.additionalInfo?.rrn || 
                     payload.referenceNo || 
                     payload.additionalInfo?.referenceNo || 
                     (rqUuid ? `REF-${rqUuid}` : `REF-${Date.now()}`)
  const paymentDate = payload.payment_date || payload.trx_date || payload.trxDateTime || new Date().toISOString()

  const now = new Date()
  const rsDatetime = getEspayDatetime(now)
  const reconcileDatetime = getEspayTimestamp(now)

  // Helper pencarian order simulasi di in-memory
  function findSimulasiOrder(id: string) {
    if (!globalThis._simulasiOrders || !id) return null
    if (globalThis._simulasiOrders.has(id)) {
      return globalThis._simulasiOrders.get(id)
    }
    for (const ord of globalThis._simulasiOrders.values()) {
      if (ord.order_id === id || 
          ord.payment?.va_number === id || 
          ord.payment?.referenceNo === id ||
          ord.payment?.qr_url === id) {
        return ord
      }
    }
    return null
  }

  const simOrder = findSimulasiOrder(orderId) ||
                   findSimulasiOrder(payload.virtualAccountNo) ||
                   findSimulasiOrder(payload.order_id) ||
                   findSimulasiOrder(payload.partnerReferenceNo) ||
                   findSimulasiOrder(payload.additionalInfo?.partnerReferenceNo) ||
                   findSimulasiOrder(payload.referenceNo) ||
                   findSimulasiOrder(payload.additionalInfo?.referenceNo) ||
                   findSimulasiOrder(payload.va_number)

  // Jika order simulasi in-memory ada, update memory-nya
  if (simOrder) {
    simOrder.status = 'paid'
    if (simOrder.payment) simOrder.payment.status = 'paid'
    globalThis._simulasiOrders.set(simOrder.order_id, simOrder)
    if (simOrder.payment?.va_number) {
      globalThis._simulasiOrders.set(simOrder.payment.va_number, simOrder)
    }
    console.log(`[Espay Webhook] In-memory simulation order ${simOrder.order_id} marked as PAID!`)
  }

  // 1. Verifikasi Signature
  if (!isSnap) {
    // Mode Legacy Espay: signature wajib ada di payload
    const isSignatureValid = verifyPaymentReportSignature({
      signatureKey: espaySignatureKey,
      rq_datetime: rqDatetime,
      order_id: orderId,
      receivedSignature: payload.signature || '',
      rq_uuid: rqUuid
    })

    if (!payload.signature || !isSignatureValid) {
      console.error(`[Espay Webhook] Invalid Legacy Signature for order ${orderId}. Received: ${payload.signature}`)
      const failSig = generatePaymentReportResponseSignature({
        signatureKey: espaySignatureKey,
        rq_uuid: rqUuid,
        rs_datetime: rsDatetime,
        error_code: '0001'
      })

      return {
        rq_uuid: rqUuid,
        rs_datetime: rsDatetime,
        error_code: '0001',
        error_message: 'Invalid Signature',
        signature: failSig,
        order_id: orderId,
        reconcile_id: paymentRef,
        reconcile_datetime: reconcileDatetime
      }
    }
  } else {
    // Mode SNAP BI: Validasi partner/customer code
    const incomingPartner = payload.customerNo || payload.additionalInfo?.memberCode || getHeader(event, 'x-partner-id') || ''
    if (incomingPartner && incomingPartner.trim() !== commCode.trim()) {
      console.warn(`[Espay Webhook] Warning: Partner ID mismatch (${incomingPartner} vs ${commCode})`)
    }
  }

  // 2. Hubungkan ke Supabase dengan Service Role (Bypass RLS)
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)
  const nowIso = new Date().toISOString()

  // 2a. Cari & Update status di tabel orders
  let orderFound = false
  try {
    const { data: ord, error: ordCheckErr } = await supabase
      .from('orders')
      .select('id, data_transaksi')
      .eq('id', orderId)
      .maybeSingle()

    if (ord) {
      orderFound = true
      const updatedTx = {
        ...(ord.data_transaksi || {}),
        espay_payment_data: {
          payment_ref: paymentRef,
          payment_date: paymentDate,
          rq_uuid: rqUuid,
          rq_datetime: rqDatetime,
          paid_at: nowIso
        }
      }

      await supabase
        .from('orders')
        .update({
          status_pembayaran: 'paid',
          status_dana: 'CAIR',
          paid_at: nowIso,
          payment_reference: paymentRef,
          data_transaksi: updatedTx,
          updated_at: nowIso
        })
        .eq('id', orderId)
      console.log(`[Espay Webhook] Tabel orders ${orderId} berhasil diupdate ke status: paid`)
    }
  } catch (ordErr) {
    console.warn('[Espay Webhook] Warning: Update tabel orders terkendala:', ordErr)
  }

  // 2b. Cari tiket peserta berdasarkan order_id atau nomor VA
  let { data: pesertas, error: findErr } = await supabase
    .from('peserta')
    .select('id, data_tambahan')
    .or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`)

  if (!pesertas || pesertas.length === 0) {
    const { data: byVa } = await supabase
      .from('peserta')
      .select('id, data_tambahan')
      .or(`data_tambahan->payment->espay_data->>va_number.eq.${orderId},data_tambahan->payment->>va_number.eq.${orderId}`)
    if (byVa && byVa.length > 0) {
      pesertas = byVa
    }
  }

  // Jika tidak ditemukan di orders, peserta, maupun memory simulasi
  if (!orderFound && (!pesertas || pesertas.length === 0) && !simOrder) {
    console.warn(`[Espay Webhook] Order ID tidak ditemukan di database: ${orderId}`)
    
    if (isSnap) {
      return {
        responseCode: '4042500',
        responseMessage: 'Order ID Not Found'
      }
    }

    const notFoundSig = generatePaymentReportResponseSignature({
      signatureKey: espaySignatureKey,
      rq_uuid: rqUuid,
      rs_datetime: rsDatetime,
      error_code: '0002'
    })

    return {
      rq_uuid: rqUuid,
      rs_datetime: rsDatetime,
      error_code: '0002',
      error_message: 'Order ID Not Found',
      signature: notFoundSig,
      order_id: orderId,
      reconcile_id: paymentRef,
      reconcile_datetime: reconcileDatetime
    }
  }

  // 3. Update Status Pembayaran Tiket Peserta menjadi 'paid' & 'CAIR'
  if (pesertas && pesertas.length > 0) {
    const ids = pesertas.map(p => p.id)
    let hasUpdateError = false

    try {
      for (const p of pesertas) {
        const updatedDt = {
          ...p.data_tambahan,
          payment: {
            ...p.data_tambahan?.payment,
            status: 'paid',
            paid_at: nowIso,
            espay_payment_data: {
              payment_ref: paymentRef,
              payment_date: paymentDate,
              rq_uuid: rqUuid,
              rq_datetime: rqDatetime
            }
          }
        }

        const { error: singleErr } = await supabase
          .from('peserta')
          .update({
            status_bayar: 'paid',
            status_dana: 'CAIR',
            data_tambahan: updatedDt
          })
          .eq('id', p.id)

        if (singleErr) hasUpdateError = true
      }
    } catch (err) {
      hasUpdateError = true
    }

    if (hasUpdateError) {
      await supabase
        .from('peserta')
        .update({
          status_bayar: 'paid',
          status_dana: 'CAIR'
        })
        .in('id', ids)
    }

    console.log(`[Espay Webhook] Sukses melunaskan ${ids.length} tiket peserta untuk order ${orderId} (Payment Ref: ${paymentRef})`)
  }

  // 4. Balas dengan Response Sukses sesuai spesifikasi Espay
  if (isSnap) {
    return {
      responseCode: '2002500',
      responseMessage: 'Success',
      virtualAccountData: {
        partnerServiceId: payload.partnerServiceId || ' Espay',
        customerNo: payload.customerNo || commCode,
        virtualAccountNo: orderId,
        paymentRequestId: payload.paymentRequestId || rqUuid
      }
    }
  }

  const successSig = generatePaymentReportResponseSignature({
    signatureKey: espaySignatureKey,
    rq_uuid: rqUuid,
    rs_datetime: rsDatetime,
    error_code: '0000'
  })

  return {
    rq_uuid: rqUuid,
    rs_datetime: rsDatetime,
    error_code: '0000',
    error_message: 'Success',
    signature: successSig,
    order_id: orderId,
    reconcile_id: paymentRef,
    reconcile_datetime: reconcileDatetime
  }
})
