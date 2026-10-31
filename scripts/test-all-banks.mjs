import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

const apiUrl = process.env.ESPAY_API_URL || 'https://sandbox-api.espay.id'
const commCode = process.env.ESPAY_COMM_CODE || 'SGWZULKARNAENALMUHAMMADY'
const signatureKey = process.env.ESPAY_SIGNATURE_KEY || 'nuz0vue4r5pkfg7t'

function getEspayDatetime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}

function generateSendInvoiceSignature(params) {
  const { signatureKey, rq_uuid, rq_datetime, order_id, amount, ccy = 'IDR', comm_code } = params
  const rawString = `##${signatureKey}##${rq_uuid}##${rq_datetime}##${order_id}##${amount}##${ccy}##${comm_code}##SENDINVOICE##`.toUpperCase()
  return crypto.createHash('sha256').update(rawString).digest('hex')
}

async function testBank(bankCode, bankName) {
  const totalAmount = '10000.00'
  const rqUuid = `UUID-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  const rqDatetime = getEspayDatetime()
  const orderId = `TEST-${bankCode}-${Date.now()}`

  const signature = generateSendInvoiceSignature({
    signatureKey,
    rq_uuid: rqUuid,
    rq_datetime: rqDatetime,
    order_id: orderId,
    amount: totalAmount,
    ccy: 'IDR',
    comm_code: commCode
  })

  const formBody = new URLSearchParams()
  formBody.append('rq_uuid', rqUuid)
  formBody.append('rq_datetime', rqDatetime)
  formBody.append('order_id', orderId)
  formBody.append('amount', totalAmount)
  formBody.append('ccy', 'IDR')
  formBody.append('comm_code', commCode)
  formBody.append('remark1', '08123456789')
  formBody.append('remark2', 'Test Peserta')
  formBody.append('remark3', 'test@tyket.id')
  formBody.append('update', 'N')
  formBody.append('bank_code', bankCode)
  formBody.append('va_expired', '60')
  formBody.append('signature', signature)

  const startTime = Date.now()
  try {
    const res = await fetch(`${apiUrl}/rest/merchantpg/sendinvoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString()
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    const rawText = await res.text()
    console.log(`[${bankCode}] ${bankName.padEnd(20)} | Durasi: ${duration}s | HTTP ${res.status} | Res: ${rawText}`)
  } catch (err) {
    console.error(`[${bankCode}] ${bankName.padEnd(20)} | Error: ${err.message}`)
  }
}

async function main() {
  console.log('Testing SendInvoice across all bank channels...')
  const banks = [
    { code: '008', name: 'Bank Mandiri' },
    { code: '013', name: 'Bank Permata' },
    { code: '002', name: 'Bank BRI' },
    { code: '009', name: 'Bank BNI' },
    { code: '014', name: 'Bank BCA' },
    { code: '022', name: 'CIMB Niaga' },
    { code: '011', name: 'Bank Danamon' },
    { code: '016', name: 'Maybank' },
    { code: '000', name: 'Espay Aggregator' }
  ]

  for (const b of banks) {
    await testBank(b.code, b.name)
  }
}

main()
