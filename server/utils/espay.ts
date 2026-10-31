import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import QRCode from 'qrcode'

// Format ISO 8601 dengan timezone offset +07:00
export function getEspayTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}+07:00`
}

// Format Datetime biasa: YYYY-MM-DD HH:mm:ss
export function getEspayDatetime(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}

// Helper untuk membaca private key (bisa dari string env atau file .pem)
export function getEspayPrivateKey(): string {
  const config = useRuntimeConfig()
  if (config.espayPrivateKey && config.espayPrivateKey.includes('BEGIN')) {
    return config.espayPrivateKey.replace(/\\n/g, '\n')
  }

  const filePath = path.resolve(process.cwd(), process.env.ESPAY_PRIVATE_KEY_PATH || 'server/certs/espay-private.pem')
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8')
  }
  return ''
}

// Helper untuk membaca public key
export function getEspayPublicKey(): string {
  const config = useRuntimeConfig()
  if (config.espayPublicKey && config.espayPublicKey.includes('BEGIN')) {
    return config.espayPublicKey.replace(/\\n/g, '\n')
  }

  const filePath = path.resolve(process.cwd(), process.env.ESPAY_PUBLIC_KEY_PATH || 'server/certs/espay-public.pub')
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8')
  }
  return ''
}

// ─────────────────────────────────────────────────────────────
// 1. SIGNATURE UNIVERSAL (HASH-BASED SHA-256)
// ─────────────────────────────────────────────────────────────

// Signature untuk Send Invoice Virtual Account (Merchant -> Espay)
export function generateSendInvoiceSignature(params: {
  signatureKey: string
  rq_uuid: string
  rq_datetime: string
  order_id: string
  amount: string | number
  ccy?: string
  comm_code: string
}): string {
  const { signatureKey, rq_uuid, rq_datetime, order_id, amount, ccy = 'IDR', comm_code } = params
  const rawString = `##${signatureKey}##${rq_uuid}##${rq_datetime}##${order_id}##${amount}##${ccy}##${comm_code}##SENDINVOICE##`.toUpperCase()
  return crypto.createHash('sha256').update(rawString).digest('hex')
}

// Validasi Signature Payment Notification Webhook (Espay -> Merchant)
export function verifyPaymentReportSignature(params: {
  signatureKey: string
  rq_datetime: string
  order_id: string
  receivedSignature: string
  rq_uuid?: string
}): boolean {
  const { signatureKey, rq_datetime, order_id, receivedSignature, rq_uuid } = params
  if (!receivedSignature) return false

  // Format Standar: ##KEY##rq_datetime##order_id##PAYMENTREPORT##
  const rawString1 = `##${signatureKey}##${rq_datetime}##${order_id}##PAYMENTREPORT##`.toUpperCase()
  const expected1 = crypto.createHash('sha256').update(rawString1).digest('hex')
  if (expected1.toLowerCase() === receivedSignature.toLowerCase()) return true

  // Format Alternatif Espay: ##KEY##rq_uuid##rq_datetime##order_id##PAYMENTREPORT##
  if (rq_uuid) {
    const rawString2 = `##${signatureKey}##${rq_uuid}##${rq_datetime}##${order_id}##PAYMENTREPORT##`.toUpperCase()
    const expected2 = crypto.createHash('sha256').update(rawString2).digest('hex')
    if (expected2.toLowerCase() === receivedSignature.toLowerCase()) return true
  }

  return false
}

// Signature Response Payment Notification Webhook (Merchant -> Espay)
export function generatePaymentReportResponseSignature(params: {
  signatureKey: string
  rq_uuid: string
  rs_datetime: string
  error_code: string
}): string {
  const { signatureKey, rq_uuid, rs_datetime, error_code } = params
  const rawString = `##${signatureKey}##${rq_uuid}##${rs_datetime}##${error_code}##PAYMENTREPORT-RS##`.toUpperCase()
  return crypto.createHash('sha256').update(rawString).digest('hex')
}

// ─────────────────────────────────────────────────────────────
// 2. SIGNATURE SNAP ASYMMETRIC (SHA256withRSA) UNTUK QRIS
// ─────────────────────────────────────────────────────────────

export function generateSnapAsymmetricSignature(params: {
  httpMethod: string
  relativeUrl: string
  requestBody: object | string
  timestamp: string
  privateKeyPem: string
}): string {
  const { httpMethod, relativeUrl, requestBody, timestamp, privateKeyPem } = params

  // 1. Minify JSON
  const bodyString = typeof requestBody === 'string' ? JSON.stringify(JSON.parse(requestBody)) : JSON.stringify(requestBody)

  // 2. SHA-256 dari minified body -> hex lowercase
  const bodyHash = crypto.createHash('sha256').update(bodyString).digest('hex').toLowerCase()

  // 3. StringToSign = HTTPMethod + ":" + RelativeUrl + ":" + Lowercase(HexEncode(SHA-256(MinifyJson(RequestBody)))) + ":" + Timestamp
  const stringToSign = `${httpMethod.toUpperCase()}:${relativeUrl}:${bodyHash}:${timestamp}`

  // 4. SHA256withRSA + Base64
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(stringToSign)
  return signer.sign(privateKeyPem, 'base64')
}

// ─────────────────────────────────────────────────────────────
// 2b. SNAP BI ACCESS TOKEN (OAuth B2B)
// ─────────────────────────────────────────────────────────────

export interface SnapTokenResult {
  success: boolean
  accessToken?: string
  expiresIn?: number
  errorMessage?: string
  debug?: any
}

/**
 * Mendapatkan SNAP BI Access Token (Bearer) dari Espay.
 * Wajib dipanggil sebelum setiap request QRIS.
 * Signature untuk endpoint ini menggunakan Asymmetric (SHA256withRSA).
 */
export async function getEspaySnapAccessToken(): Promise<SnapTokenResult> {
  const config = useRuntimeConfig()
  const apiUrl = config.espayApiUrl || 'https://sandbox-api.espay.id'
  const clientId = (config as any).espaySnapClientId || config.espayCommCode
  const privateKey = getEspayPrivateKey()

  if (!privateKey) {
    console.warn('[Espay SNAP] Private key tidak ditemukan. SNAP OAuth tidak bisa dijalankan.')
    return {
      success: false,
      errorMessage: 'Private key tidak ditemukan di server/certs/espay-private.pem',
      debug: {
        step: 'OAuth B2B Access Token',
        error: 'Private key missing on server'
      }
    }
  }

  const now = new Date()
  const timestamp = getEspayTimestamp(now)
  const relativeUrl = '/api/v1.0/access-token/b2b'

  // Signature untuk access-token/b2b: SHA256withRSA dari (clientId + "|" + timestamp)
  const stringToSign = `${clientId}|${timestamp}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(stringToSign)
  const signature = signer.sign(privateKey, 'base64')

  const debugInfo: any = {
    step: '1. OAuth B2B Access Token',
    url: `${apiUrl}${relativeUrl}`,
    method: 'POST',
    headersSent: {
      'Content-Type': 'application/json',
      'X-CLIENT-KEY': clientId,
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature ? `${signature.substring(0, 30)}...` : '(kosong)'
    },
    bodySent: {
      grantType: 'client_credentials'
    },
    stringToSign,
    httpStatus: null,
    responseRaw: null,
    responseCode: null,
    responseMessage: null
  }

  try {
    const response: any = await $fetch(`${apiUrl}${relativeUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CLIENT-KEY': clientId,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature
      },
      body: {
        grantType: 'client_credentials'
      }
    })

    debugInfo.httpStatus = 200
    debugInfo.responseRaw = response
    debugInfo.responseCode = response.responseCode
    debugInfo.responseMessage = response.responseMessage

    if (response.responseCode === '2007300' && response.accessToken) {
      return {
        success: true,
        accessToken: response.accessToken,
        expiresIn: response.expiresIn || 900,
        debug: debugInfo
      }
    }

    console.warn('[Espay SNAP] Gagal mendapat access token:', response.responseMessage || response.responseCode)
    return {
      success: false,
      errorMessage: response.responseMessage || `responseCode: ${response.responseCode}`,
      debug: debugInfo
    }
  } catch (err: any) {
    const rawData = err.response?._data || null
    const msg = rawData?.responseMessage || err.message || 'Gagal menghubungi Espay OAuth'
    console.warn('[Espay SNAP] OAuth error:', msg)
    debugInfo.httpStatus = err.statusCode || err.status || 500
    debugInfo.responseRaw = rawData || err.message
    debugInfo.responseCode = rawData?.responseCode || err.statusCode || 'ERROR'
    debugInfo.responseMessage = msg
    return { success: false, errorMessage: msg, debug: debugInfo }
  }
}

// ─────────────────────────────────────────────────────────────
// 3. API CLIENTS: QRIS & VIRTUAL ACCOUNT
// ─────────────────────────────────────────────────────────────

export interface EspayQrisResult {
  success: boolean
  qrUrl?: string
  qrContent?: string
  qrImage?: string
  referenceNo?: string
  partnerReferenceNo?: string
  isSimulator?: boolean
  validityPeriod?: string
  amount?: number
  fee?: number
  totalAmount?: number
  errorMessage?: string
  debug?: any
}

export async function requestEspayQris(params: {
  orderId: string
  amount: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  merchantId?: string
  disableFallback?: boolean
}): Promise<EspayQrisResult> {
  const config = useRuntimeConfig()
  const apiUrl = config.espayApiUrl || 'https://sandbox-api.espay.id'
  const commCode = params.merchantId || config.espayCommCode || 'SGWZULKARNAENALMUHAMMADY'
  const privateKey = getEspayPrivateKey()

  // Hitung MDR QRIS: 0.64% + PPN 11% = 0.7104% (0.007104)
  // Gunakan rumus Gross agar fee tidak menggerus saldo bersih merchant/EO
  const totalAmount = Math.ceil(params.amount / (1 - 0.007104))
  const fee = totalAmount - params.amount

  const now = new Date()
  const timestamp = getEspayTimestamp(now)
  const validityDate = new Date(now.getTime() + 60 * 60 * 1000) // Berlaku 1 jam
  const validityPeriod = getEspayTimestamp(validityDate)
  const externalId = crypto.randomUUID()
  const relativeUrl = '/api/v1.0/qr/qr-mpm-generate'

  const requestBody = {
    partnerReferenceNo: params.orderId,
    merchantId: commCode,
    amount: {
      value: totalAmount.toFixed(2),
      currency: 'IDR'
    },
    additionalInfo: {
      productCode: 'QRIS'
    },
    validityPeriod: validityPeriod
  }

  // Jika private key belum ada
  if (!privateKey) {
    const errDebug = {
      step: 'PrivateKey Check',
      error: 'File server/certs/espay-private.pem tidak ditemukan atau kosong.'
    }
    return {
      success: false,
      errorMessage: 'Private key belum dipasang di server (server/certs/espay-private.pem)',
      debug: errDebug
    }
  }

  // Generate Asymmetric Signature (SHA256withRSA) sesuai dokumentasi resmi SNAP Espay:
  // 1. Minify Request Body
  // 2. SHA-256 dari minified body -> lowercase hex
  // 3. StringToSign = HTTPMethod + ":" + RelativeUrl + ":" + bodyHash + ":" + Timestamp
  // 4. X-SIGNATURE = base64Encode(SHA256withRSA(PrivateKey, StringToSign))
  const bodyString = JSON.stringify(requestBody)
  const bodyHash = crypto.createHash('sha256').update(bodyString).digest('hex').toLowerCase()
  const stringToSign = `POST:${relativeUrl}:${bodyHash}:${timestamp}`

  const signer = crypto.createSign('RSA-SHA256')
  signer.update(stringToSign)
  const asymmetricSignature = signer.sign(privateKey, 'base64')

  const headersSent = {
    'Content-Type': 'application/json',
    'X-TIMESTAMP': timestamp,
    'X-SIGNATURE': asymmetricSignature,
    'X-EXTERNAL-ID': externalId,
    'X-PARTNER-ID': commCode,
    'CHANNEL-ID': 'ESPAY'
  }

  const sampleHeaders = {
    'Method': 'POST /api/v1.0/qr/qr-mpm-generate HTTP/1.1',
    'Content-Type': 'application/json',
    'X-TIMESTAMP': '2026-03-24T12:00:00+07:00',
    'X-SIGNATURE': '<Base64_SHA256withRSA_Signature>',
    'X-EXTERNAL-ID': '20260324120000123456',
    'X-PARTNER-ID': 'SGWYESSISHOP',
    'CHANNEL-ID': 'ESPAY'
  }

  const sampleRequest = {
    partnerReferenceNo: 'ORDER001',
    amount: {
      value: '10000.00',
      currency: 'IDR'
    },
    additionalInfo: {
      productCode: 'QRIS'
    },
    validityPeriod: '2026-03-24T12:15:00+07:00'
  }

  const debugInfo: any = {
    step: 'QRIS MPM Generate (Direct Asymmetric Signature)',
    url: `${apiUrl}${relativeUrl}`,
    method: 'POST',
    commCode,
    timestamp,
    bodyHash,
    stringToSign,
    sampleHeaders,
    headersSent: {
      ...headersSent,
      'X-SIGNATURE': asymmetricSignature ? `${asymmetricSignature.substring(0, 35)}...` : '(kosong)'
    },
    sampleRequest,
    signatureFull: asymmetricSignature,
    bodySent: requestBody,
    httpStatus: null,
    responseRaw: null,
    responseCode: null,
    responseMessage: null
  }

  console.log('[Espay QRIS Request] === SAMPLE HEADERS (DOCS) ===\n', sampleHeaders)
  console.log('[Espay QRIS Request] === ACTUAL HEADERS SENT ===\n', headersSent)
  console.log('[Espay QRIS Request] === SAMPLE REQUEST (DOCS) ===\n', sampleRequest)
  console.log('[Espay QRIS Request] === ACTUAL REQUEST BODY ===\n', requestBody)

  try {
    const response: any = await $fetch(`${apiUrl}${relativeUrl}`, {
      method: 'POST',
      headers: headersSent,
      body: requestBody,
      timeout: 10000
    })

    debugInfo.httpStatus = 200
    debugInfo.responseRaw = response
    debugInfo.responseCode = response.responseCode
    debugInfo.responseMessage = response.responseMessage

    if (response.responseCode === '2004700' || response.qrContent || response.qrUrl) {
      let qrImage = response.qrImage ? (response.qrImage.startsWith('data:') ? response.qrImage : `data:image/png;base64,${response.qrImage}`) : ''
      if (!qrImage && response.qrContent) {
        try {
          qrImage = await QRCode.toDataURL(response.qrContent, { width: 300, margin: 2 })
        } catch (qrErr) {
          console.warn('[Espay QRIS] Gagal generate QR image dari qrContent:', qrErr)
        }
      }

      return {
        success: true,
        isSimulator: false,
        qrUrl: response.qrUrl,
        qrContent: response.qrContent,
        qrImage,
        referenceNo: response.referenceNo || response.additionalInfo?.referenceNo,
        partnerReferenceNo: response.partnerReferenceNo || response.additionalInfo?.partnerReferenceNo || params.orderId,
        validityPeriod,
        amount: params.amount,
        fee,
        totalAmount,
        debug: debugInfo
      }
    } else {
      return {
        success: false,
        errorMessage: response.responseMessage || `Gagal generate QRIS (Kode: ${response.responseCode})`,
        debug: debugInfo
      }
    }
  } catch (err: any) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')
    const is522 = err.statusCode === 522 || err.message?.includes('522')
    const errData = err.response?._data || null
    let msg = errData?.responseMessage || err.message || 'Gagal menghubungi server Espay QRIS'
    if (is522) {
      msg = 'Server Espay sedang offline/gangguan (HTTP 522 Connection Timed Out)'
    } else if (isTimeout) {
      msg = 'Request Timeout (10 detik): Server Espay tidak memberikan respons dalam 10 detik.'
    }
    console.warn(`[Espay] Error respon dari Espay: ${msg}`)

    debugInfo.httpStatus = err.statusCode || err.status || (isTimeout ? 408 : 500)
    debugInfo.responseRaw = isTimeout ? 'Client Timeout 10000ms exceeded' : (errData || err.message)
    debugInfo.responseCode = isTimeout ? 'TIMEOUT_10S' : (errData?.responseCode || err.statusCode || 'ERROR')
    debugInfo.responseMessage = msg

    return {
      success: false,
      errorMessage: msg,
      debug: debugInfo
    }
  }
}

export interface EspayVaResult {
  success: boolean
  isSimulator?: boolean
  vaNumber?: string
  bankCode?: string
  bankName?: string
  expired?: string
  amount?: number
  fee?: number
  totalAmount?: number
  errorMessage?: string
  debug?: any
}

export async function requestEspayVirtualAccount(params: {
  orderId: string
  amount: number
  bankCode: string // '008' (Mandiri), '002' (BRI), '009' (BNI)
  customerName: string
  customerEmail?: string
  customerPhone: string
  merchantId?: string
  disableFallback?: boolean
}): Promise<EspayVaResult> {
  const config = useRuntimeConfig()
  const commCode = params.merchantId || process.env.ESPAY_COMM_CODE || config.espayCommCode || 'SGWZULKARNAENALMUHAMMADY'
  const signatureKey = (commCode === 'SGWZULKARNAENALMUHAMMADY') ? 'hme6w1tnjl15bsme' : (process.env.ESPAY_SIGNATURE_KEY || config.espaySignatureKey || 'hme6w1tnjl15bsme')
  const apiUrl = process.env.ESPAY_API_URL || config.espayApiUrl || 'https://sandbox-api.espay.id'

  // Fee VA sesuai PKS (+ PPN 11%):
  // Mandiri: 2500 + 275 (PPN 11%) = 2775
  // BRI: 2500 + 275 (PPN 11%) = 2775
  // BCA: 2500 + 275 (PPN 11%) = 2775
  // BNI: 3000 + 330 (PPN 11%) = 3330
  let fee = 2775
  let bankName = 'Virtual Account'
  if (params.bankCode === '009') {
    fee = 3330
    bankName = 'BNI Virtual Account'
  } else if (params.bankCode === '008') {
    fee = 2775
    bankName = 'Mandiri Virtual Account'
  } else if (params.bankCode === '002') {
    fee = 2775
    bankName = 'BRI Virtual Account (BRIVA)'
  } else if (params.bankCode === '014') {
    fee = 2775
    bankName = 'BCA Virtual Account'
  }

  const totalAmount = params.amount + fee
  const formattedAmount = totalAmount.toFixed(2)
  const rqUuid = crypto.randomUUID()
  const rqDatetime = getEspayDatetime(new Date())

  // Format dan Sanitasi Parameter sesuai Spesifikasi Resmi Espay Direct API Send Invoice:
  // 1. order_id: Format Alfanumerik (A-Z dan 0-9), max 32 karakter
  const cleanOrderId = (params.orderId || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) || `ORDER${Date.now()}`

  // 2. remark1 (No Handphone): Hanya angka, max 17 karakter
  const cleanPhone = (params.customerPhone || '08123456789').replace(/[^0-9]/g, '').substring(0, 17) || '08123456789'

  // 3. remark2 (Nama): Format Alfanumerik dan Spasi, max 30 karakter.
  // PENTING: Espay menolak karakter spesial seperti tanda kurung '()', koma, titik dsb.
  const cleanCustomerName = (params.customerName || 'Peserta Event')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 30) || 'Peserta'

  // 4. remark3 (Email): Max 50 karakter
  const cleanEmail = (params.customerEmail || 'peserta@tyket.id').trim().substring(0, 50)

  const signature = generateSendInvoiceSignature({
    signatureKey,
    rq_uuid: rqUuid,
    rq_datetime: rqDatetime,
    order_id: cleanOrderId,
    amount: formattedAmount,
    ccy: 'IDR',
    comm_code: commCode
  })

  const formBody = new URLSearchParams()
  formBody.append('rq_uuid', rqUuid)
  formBody.append('rq_datetime', rqDatetime)
  formBody.append('order_id', cleanOrderId)
  formBody.append('amount', formattedAmount)
  formBody.append('ccy', 'IDR')
  formBody.append('comm_code', commCode)
  formBody.append('remark1', cleanPhone)
  formBody.append('remark2', cleanCustomerName)
  formBody.append('remark3', cleanEmail)
  formBody.append('update', 'N')
  formBody.append('bank_code', params.bankCode)
  formBody.append('va_expired', '15') // Sinkron dengan sistem hold tiket (15 menit)
  formBody.append('signature', signature)
  const postBody = formBody.toString()
  const postLength = Buffer.byteLength(postBody)
  let hostHeader = 'sandbox-api.espay.id'
  try {
    hostHeader = new URL(apiUrl).host
  } catch (e) {}

  const headersSent = {
    'Method': 'POST /rest/merchantpg/sendinvoice HTTP/1.1',
    'Host': hostHeader,
    'Connection': 'keep-alive',
    'Content-Length': String(postLength),
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': '*/*'
  }

  const sampleHeaders = {
    'Method': 'POST /rest/merchantpg/sendinvoice HTTP/1.1',
    'Host': 'sandbox-api.espay.id',
    'Connection': 'keep-alive',
    'Content-Length': '250',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': '*/*'
  }

  const sampleRequest = {
    'rq_uuid': 'abcbd39734-ed32-490d-98c4-e91bcd91037b',
    'rq_datetime': '2024-04-30 17:48:24',
    'order_id': 'ORDER001',
    'amount': '890000.00',
    'ccy': 'IDR',
    'comm_code': 'SGWYESSISHOP',
    'remark1': '082138802290',
    'remark2': 'TravelAja OTA Web Tiara Iyay',
    'remark3': 'test@gmail.com',
    'update': 'N',
    'bank_code': '014',
    'va_expired': '30',
    'signature': 'd4787b96b6ee30036e42cf54bbf346559a8200feb0ce81a1df74231759990e31'
  }

  const debugInfo: any = {
    step: 'Send Invoice (Virtual Account)',
    url: `${apiUrl}/rest/merchantpg/sendinvoice`,
    method: 'POST',
    sampleHeaders,
    headersSent,
    sampleRequest,
    formDataSent: {
      rq_uuid: rqUuid,
      rq_datetime: rqDatetime,
      order_id: cleanOrderId,
      amount: formattedAmount,
      ccy: 'IDR',
      comm_code: commCode,
      remark1: cleanPhone,
      remark2: cleanCustomerName,
      remark3: cleanEmail,
      update: 'N',
      bank_code: params.bankCode,
      va_expired: '15',
      signature: signature
    },
    rawStringToSign: `##${signatureKey}##${rqUuid}##${rqDatetime}##${cleanOrderId}##${formattedAmount}##IDR##${commCode}##SENDINVOICE##`,
    webhookEndpoints: {
      inquiryCallbackPath: '/api/webhook/espay-inquiry',
      paymentCallbackPath: '/api/webhook/espay',
      settlementCallbackPath: '/api/webhook/espay-settlement',
      description: 'Espay Sandbox memanggil Callback Inquiry ke URL yang terdaftar di Portal Merchant Sandbox Anda saat request Send Invoice diproses.'
    },
    httpStatus: null,
    responseRaw: null,
    errorCode: null,
    errorMessage: null
  }

  console.log('[Espay VA Request] === SAMPLE HEADERS (DOCS) ===\n', sampleHeaders)
  console.log('[Espay VA Request] === ACTUAL HEADERS SENT ===\n', headersSent)
  console.log('[Espay VA Request] === SAMPLE REQUEST (DOCS) ===\n', sampleRequest)
  console.log('[Espay VA Request] === ACTUAL FORM DATA SENT ===\n', debugInfo.formDataSent)

  try {
    const response: any = await $fetch(`${apiUrl}/rest/merchantpg/sendinvoice`, {
      method: 'POST',
      headers: {
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'Content-Length': String(postLength)
      },
      body: postBody,
      timeout: 10000
    })

    let parsed: any = response
    if (typeof response === 'string') {
      try {
        parsed = JSON.parse(response)
      } catch {
        parsed = response
      }
    }

    const errCode = parsed?.error_code || ''
    const errMsg = parsed?.error_message || ''
    const vaNum = parsed?.va_number || ''

    debugInfo.httpStatus = 200
    debugInfo.responseRaw = parsed
    debugInfo.errorCode = errCode
    debugInfo.errorMessage = errMsg

    if (errCode === '0000' || errCode === '0' || vaNum) {
      return {
        success: true,
        vaNumber: vaNum,
        bankCode: params.bankCode,
        bankName,
        expired: parsed?.expired || '60 menit',
        amount: params.amount,
        fee,
        totalAmount,
        debug: debugInfo
      }
    } else {
      let errorMsg = errMsg || `Error code: ${errCode}`
      if (errCode === '0031' || errCode === '31') {
        errorMsg = 'Error 31: Gagal komunikasi dengan Mitra (Timeout 10s). Server Espay tidak dapat menghubungi Webhook Callback Inquiry Anda. Pastikan URL Callback di portal Espay aktif dan dapat diakses publik.'
      } else if (errCode === '0118' || errCode === '118') {
        errorMsg = 'Error 0118: Channel pembayaran ini belum diaktifkan (BIN belum terdaftar di sandbox Espay).'
      }

      return {
        success: false,
        errorMessage: errorMsg,
        debug: debugInfo
      }
    }
  } catch (err: any) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')
    const is522 = err.statusCode === 522 || err.message?.includes('522')
    const errData = err.response?._data
    let msg = errData?.error_message || err.message || 'Gagal menghubungi server Espay Virtual Account'
    if (is522) {
      msg = 'Server Espay sedang offline/gangguan (HTTP 522 Connection Timed Out)'
    } else if (isTimeout) {
      msg = 'Request Timeout (10 detik): Server Espay tidak memberikan respons dalam 10 detik.'
    }
    console.warn(`[Espay] Error respon VA dari Espay: ${msg}`)

    debugInfo.httpStatus = err.statusCode || err.status || (isTimeout ? 408 : 500)
    debugInfo.responseRaw = isTimeout ? 'Client Timeout 10000ms exceeded' : (errData || err.message)
    debugInfo.errorCode = isTimeout ? 'TIMEOUT_10S' : (errData?.error_code || err.statusCode || 'ERROR')
    debugInfo.errorMessage = msg

    return {
      success: false,
      errorMessage: msg,
      debug: debugInfo
    }
  }
}
