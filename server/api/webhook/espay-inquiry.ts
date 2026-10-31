import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { getEspayDatetime, getEspayTimestamp } from '../../utils/espay'

function getEspayTrxDate(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const dd = pad(date.getDate())
  const MM = pad(date.getMonth() + 1)
  const yyyy = date.getFullYear()
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${dd}/${MM}/${yyyy} ${HH}:${mm}:${ss}`
}

import { promises as fs } from 'fs'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const headers = getHeaders(event)
  const url = getRequestURL(event)

  const logEntry = `\n[${new Date().toISOString()}] ${method} ${url.pathname}\nHeaders: ${JSON.stringify(headers)}\n`
  fs.appendFile('logs/webhook-debug.log', logEntry).catch(() => {})

  if (method === 'GET' || method === 'HEAD') {
    return { status: 'ok', service: 'Espay Inquiry Webhook', timestamp: new Date().toISOString() }
  }

  const config = useRuntimeConfig()
  const espaySignatureKey = config.espaySignatureKey || process.env.ESPAY_SIGNATURE_KEY || 'hme6w1tnjl15bsme'
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'X-TIMESTAMP', getEspayTimestamp(new Date()))
  
  let body: any = {}
  try {
    body = await readBody(event) || {}
  } catch {
    body = {}
  }
  const query = getQuery(event) || {}
  const payload = { ...query, ...body }

  fs.appendFile('logs/webhook-debug.log', `Payload: ${JSON.stringify(payload, null, 2)}\n`).catch(() => {})

  // Deteksi format: SNAP vs Legacy
  const isSnap = Boolean(payload.virtualAccountNo || payload.inquiryRequestId)
  const orderId = payload.virtualAccountNo || payload.order_id || ''
  const rqUuid = payload.inquiryRequestId || payload.rq_uuid || ''
  const rqDatetime = payload.trxDateInit || payload.rq_datetime || ''
  const customerNo = payload.customerNo || config.espayCommCode || process.env.ESPAY_COMM_CODE || 'SGWZULKARNAENALMUHAMMADY'
  const partnerServiceId = payload.partnerServiceId || ' Espay'

  // Verifikasi signature inbound dari Espay (Legacy VA Inquiry)
  if (!isSnap && payload.signature) {
    const rawWithUuid = `##${espaySignatureKey}##${rqUuid}##${rqDatetime}##${orderId}##INQUIRY##`.toUpperCase()
    const rawWithoutUuid = `##${espaySignatureKey}##${rqDatetime}##${orderId}##INQUIRY##`.toUpperCase()
    const sig1 = crypto.createHash('sha256').update(rawWithUuid).digest('hex')
    const sig2 = crypto.createHash('sha256').update(rawWithoutUuid).digest('hex')

    const isSigMatch = sig1.toLowerCase() === (payload.signature || '').toLowerCase() || sig2.toLowerCase() === (payload.signature || '').toLowerCase()
    if (!isSigMatch) {
      console.warn('[Espay Inquiry] Signature tidak cocok dari Espay:', payload.signature)
      fs.appendFile('logs/webhook-debug.log', `[SIGNATURE_MISMATCH] Got: ${payload.signature} | Expected: ${sig1} or ${sig2}\n`).catch(() => {})
    }
  }

  console.log('[Espay Inquiry Incoming]:', JSON.stringify(payload, null, 2))

  const now = new Date()
  const rsDatetime = getEspayDatetime(now)
  const trxDate = getEspayTrxDate(now)

  // Helper pencarian order simulasi
  function findSimulasiOrder(id: string) {
    if (!globalThis._simulasiOrders || !id) return null
    if (globalThis._simulasiOrders.has(id)) {
      return globalThis._simulasiOrders.get(id)
    }
    for (const ord of globalThis._simulasiOrders.values()) {
      if (ord.order_id === id || ord.payment?.va_number === id) {
        return ord
      }
    }
    return null
  }

  const simOrder = findSimulasiOrder(orderId) ||
                   findSimulasiOrder(payload.virtualAccountNo) ||
                   findSimulasiOrder(payload.order_id) ||
                   findSimulasiOrder(payload.va_number)

  // 1. Tangani Order Pengujian (TEST, UJI, ORDER, SIM, atau yang terdaftar di memory simulasi) Secara Instan (< 10ms)
  const isTestOrder = Boolean(simOrder) ||
                      orderId.toUpperCase().startsWith('TEST') ||
                      orderId.toUpperCase().startsWith('UJI') ||
                      orderId.toUpperCase().startsWith('ORDER') ||
                      orderId.toUpperCase().startsWith('SIM')

  if (isTestOrder) {
    const testAmount = simOrder?.payment?.total_amount
      ? Number(simOrder.payment.total_amount).toFixed(2)
      : '10000.00'
    const testCustName = simOrder?.customer?.nama_lengkap || 'Penguji Sandbox'
    const testEmail = simOrder?.customer?.email || 'uji@tyket.id'
    const testPhone = simOrder?.customer?.no_wa || '6281234567890'
    console.log(`[Espay Inquiry] Auto-responding SUCCESS for test order: ${orderId} (Amount: ${testAmount}, CustName: ${testCustName}, isSnap: ${isSnap})`)
    
    if (isSnap) {
      const snapResponse = {
        responseCode: '2002400',
        responseMessage: 'Success',
        virtualAccountData: {
          partnerServiceId: partnerServiceId,
          customerNo: customerNo,
          virtualAccountNo: orderId,
          virtualAccountName: testCustName,
          virtualAccountEmail: testEmail,
          virtualAccountPhone: testPhone,
          inquiryRequestId: rqUuid,
          totalAmount: {
            value: testAmount,
            currency: 'IDR'
          },
          billDetails: [
            {
              billDescription: {
                english: 'Invoice Tyket',
                indonesia: 'Tagihan Tyket'
              }
            }
          ],
          additionalInfo: {
            transactionDate: getEspayTimestamp(now)
          }
        }
      }
      return snapResponse
    } else {
      const successRaw = `##${espaySignatureKey}##${rqUuid}##${rsDatetime}##${orderId}##0000##INQUIRY-RS##`.toUpperCase()
      const successSig = crypto.createHash('sha256').update(successRaw).digest('hex')
      const legacyResponse = {
        rq_uuid: rqUuid,
        rs_datetime: rsDatetime,
        order_id: orderId,
        error_code: '0000',
        error_message: 'Success',
        signature: successSig,
        amount: testAmount,
        ccy: 'IDR',
        description: 'Pengujian Tiket Sandbox',
        trx_date: trxDate,
        customer_name: testCustName
      }
      return legacyResponse
    }
  }

  // 2. Untuk Order Asli: Cari di Supabase
  try {
    const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL || 'https://supabase.e-tiket.web.id'
    const supabaseKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    let { data: pesertas, error: findErr } = await supabase
      .from('peserta')
      .select('id, nama_lengkap, status_bayar, data_tambahan')
      .eq('data_tambahan->>order_id', orderId)

    if (!pesertas || pesertas.length === 0) {
      const { data: byVa } = await supabase
        .from('peserta')
        .select('id, nama_lengkap, status_bayar, data_tambahan')
        .or(`data_tambahan->payment->espay_data->>va_number.eq.${orderId},data_tambahan->payment->>va_number.eq.${orderId}`)
      if (byVa && byVa.length > 0) {
        pesertas = byVa
      }
    }

    if (findErr || !pesertas || pesertas.length === 0) {
      console.warn(`[Espay Inquiry] Order Not Found di DB: ${orderId}`)

      // Jika di lingkungan Sandbox, berikan tagihan simulasi otomatis (ambil nominal order simulasi aktif jika ada)
      const isSandbox = (config.espayApiUrl || '').includes('sandbox')
      if (isSandbox) {
        let fallbackAmount = '10000.00'
        let fallbackCustName = 'Penguji Sandbox Tyket'
        if (globalThis._simulasiOrders && globalThis._simulasiOrders.size > 0) {
          const allSims = Array.from(globalThis._simulasiOrders.values())
          const lastPending = allSims.reverse().find(o => o.status === 'pending' || o.payment?.total_amount)
          if (lastPending && lastPending.payment?.total_amount) {
            fallbackAmount = Number(lastPending.payment.total_amount).toFixed(2)
            fallbackCustName = lastPending.customer?.nama_lengkap || fallbackCustName
          }
        }

        console.log(`[Espay Inquiry Sandbox] Memberikan respon tagihan simulasi otomatis untuk: ${orderId} (Amount: ${fallbackAmount})`)
        if (isSnap) {
          return {
            responseCode: '2002400',
            responseMessage: 'Success',
            virtualAccountData: {
              partnerServiceId: partnerServiceId,
              customerNo: customerNo,
              virtualAccountNo: orderId,
              virtualAccountName: fallbackCustName,
              virtualAccountEmail: 'uji@tyket.id',
              virtualAccountPhone: '6281234567890',
              inquiryRequestId: rqUuid,
              totalAmount: {
                value: fallbackAmount,
                currency: 'IDR'
              },
              billDetails: [
                {
                  billDescription: {
                    english: 'Invoice Tyket',
                    indonesia: 'Tagihan Tyket'
                  }
                }
              ],
              additionalInfo: {
                transactionDate: getEspayTimestamp(now)
              }
            }
          }
        } else {
          const successRaw = `##${espaySignatureKey}##${rqUuid}##${rsDatetime}##${orderId}##0000##INQUIRY-RS##`.toUpperCase()
          const successSig = crypto.createHash('sha256').update(successRaw).digest('hex')
          return {
            rq_uuid: rqUuid,
            rs_datetime: rsDatetime,
            order_id: orderId,
            error_code: '0000',
            error_message: 'Success',
            signature: successSig,
            amount: fallbackAmount,
            ccy: 'IDR',
            description: 'Simulasi Tagihan Tyket Sandbox',
            trx_date: trxDate,
            customer_name: fallbackCustName
          }
        }
      }

      if (isSnap) {
        return {
          responseCode: '4042412',
          responseMessage: 'Bill not found',
          virtualAccountData: {
            partnerServiceId: partnerServiceId,
            customerNo: customerNo,
            virtualAccountNo: orderId,
            inquiryRequestId: rqUuid
          }
        }
      } else {
        const notFoundRaw = `##${espaySignatureKey}##${rqUuid}##${rsDatetime}##${orderId}##0002##INQUIRY-RS##`.toUpperCase()
        const notFoundSig = crypto.createHash('sha256').update(notFoundRaw).digest('hex')
        return {
          rq_uuid: rqUuid,
          rs_datetime: rsDatetime,
          order_id: orderId,
          error_code: '0002',
          error_message: 'Order Not Found',
          signature: notFoundSig
        }
      }
    }

    const perwakilan = pesertas[0]

    // Cek jika order sudah pernah dibayar (mencegah double-payment)
    if (perwakilan.status_bayar === 'paid') {
      console.log(`[Espay Inquiry] Order sudah lunas: ${orderId}`)
      if (isSnap) {
        return {
          responseCode: '4042414',
          responseMessage: 'Bill already paid',
          virtualAccountData: {
            partnerServiceId: partnerServiceId,
            customerNo: customerNo,
            virtualAccountNo: orderId,
            inquiryRequestId: rqUuid
          }
        }
      } else {
        const paidRaw = `##${espaySignatureKey}##${rqUuid}##${rsDatetime}##${orderId}##0003##INQUIRY-RS##`.toUpperCase()
        const paidSig = crypto.createHash('sha256').update(paidRaw).digest('hex')
        return {
          rq_uuid: rqUuid,
          rs_datetime: rsDatetime,
          order_id: orderId,
          error_code: '0003',
          error_message: 'Bill already paid',
          signature: paidSig
        }
      }
    }

    // Cek jika order sudah dibatalkan atau kedaluwarsa
    if (perwakilan.status_bayar === 'cancelled') {
      console.log(`[Espay Inquiry] Order sudah dibatalkan: ${orderId}`)
      if (isSnap) {
        return {
          responseCode: '4042419',
          responseMessage: 'Bill expired',
          virtualAccountData: {
            partnerServiceId: partnerServiceId,
            customerNo: customerNo,
            virtualAccountNo: orderId,
            inquiryRequestId: rqUuid
          }
        }
      } else {
        const expRaw = `##${espaySignatureKey}##${rqUuid}##${rsDatetime}##${orderId}##0004##INQUIRY-RS##`.toUpperCase()
        const expSig = crypto.createHash('sha256').update(expRaw).digest('hex')
        return {
          rq_uuid: rqUuid,
          rs_datetime: rsDatetime,
          order_id: orderId,
          error_code: '0004',
          error_message: 'Bill expired',
          signature: expSig
        }
      }
    }

    const paymentInfo = perwakilan.data_tambahan?.payment || {}
    const totalAmount = Number(paymentInfo.total_amount || 0).toFixed(2)
    const customerName = perwakilan.nama_lengkap || 'Peserta Event'

    if (isSnap) {
      return {
        responseCode: '2002400',
        responseMessage: 'Success',
        virtualAccountData: {
          partnerServiceId: partnerServiceId,
          customerNo: customerNo,
          virtualAccountNo: orderId,
          virtualAccountName: customerName,
          virtualAccountEmail: perwakilan.email || 'customer@tyket.id',
          virtualAccountPhone: (() => {
            const raw = (perwakilan.no_wa || '081234567890').replace(/[^0-9]/g, '')
            return raw.startsWith('0') ? `62${raw.substring(1)}` : (raw.startsWith('62') ? raw : `62${raw}`)
          })(),
          inquiryRequestId: rqUuid,
          totalAmount: {
            value: totalAmount,
            currency: 'IDR'
          },
          billDetails: [
            {
              billDescription: {
                english: `Ticket ${perwakilan.data_tambahan?.nama_event || 'Event'}`.substring(0, 18),
                indonesia: `Tiket ${perwakilan.data_tambahan?.nama_event || 'Event'}`.substring(0, 18)
              }
            }
          ],
          additionalInfo: {
            transactionDate: getEspayTimestamp(now)
          }
        }
      }
    } else {
      const successRaw = `##${espaySignatureKey}##${rqUuid}##${rsDatetime}##${orderId}##0000##INQUIRY-RS##`.toUpperCase()
      const successSig = crypto.createHash('sha256').update(successRaw).digest('hex')
      return {
        rq_uuid: rqUuid,
        rs_datetime: rsDatetime,
        order_id: orderId,
        error_code: '0000',
        error_message: 'Success',
        signature: successSig,
        amount: totalAmount,
        ccy: 'IDR',
        description: `Tiket ${perwakilan.data_tambahan?.nama_event || 'Event'} (${pesertas.length} Pax)`,
        trx_date: trxDate,
        customer_name: customerName
      }
    }
  } catch (err: any) {
    console.error('[Espay Inquiry Error]:', err)
    if (isSnap) {
      return {
        responseCode: '5002400',
        responseMessage: 'General Error'
      }
    }
    return {
      rq_uuid: rqUuid,
      rs_datetime: rsDatetime,
      order_id: orderId,
      error_code: '0099',
      error_message: 'Internal Error'
    }
  }
})
