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

  console.log(`\n--- Pengujian Bank: ${bankName} (${bankCode}) ---`)
  console.log(`Order ID: ${orderId}`)
  console.log('Mengirim request ke Espay...')

  const startTime = Date.now()
  try {
    const res = await fetch(`${apiUrl}/rest/merchantpg/sendinvoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString()
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    const rawText = await res.text()
    console.log(`Durasi respons: ${duration} detik | Status HTTP: ${res.status} ${res.statusText}`)
    try {
      const json = JSON.parse(rawText)
      console.log('Response JSON:', JSON.stringify(json, null, 2))
      if (json.va_number) {
        console.log(`\n🎉>>> BERHASIL! NOMOR VA: ${json.va_number} <<<🎉\n`)
      }
    } catch {
      console.log('Response Raw:', rawText)
    }
  } catch (err) {
    console.error('Request Error:', err.message)
  }
}

async function main() {
  console.log('====================================================')
  console.log('PENGUJIAN VIRTUAL ACCOUNT DENGAN WEBHOOK SNAP INQUIRY')
  console.log('====================================================')

  await testBank('008', 'Mandiri VA')
  await testBank('013', 'Permata VA')
}

main()
