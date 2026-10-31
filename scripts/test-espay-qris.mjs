import crypto from 'crypto'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const apiUrl = process.env.ESPAY_API_URL || 'https://sandbox-api.espay.id'
const commCode = process.env.ESPAY_COMM_CODE || 'SGWZULKARNAENALMUHAMMADY'

function getEspayTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}+07:00`
}

function generateSnapAsymmetricSignature(httpMethod, relativeUrl, bodyString, timestamp, privateKeyPem) {
  const bodyHash = crypto.createHash('sha256').update(bodyString).digest('hex').toLowerCase()
  const stringToSign = `${httpMethod.toUpperCase()}:${relativeUrl}:${bodyHash}:${timestamp}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(stringToSign)
  return signer.sign(privateKeyPem, 'base64')
}

async function getSnapAccessToken(privateKeyPem, commCode, apiUrl) {
  const timestamp = getEspayTimestamp(new Date())
  const clientId = commCode
  const stringToSign = `${clientId}|${timestamp}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(stringToSign)
  const signature = signer.sign(privateKeyPem, 'base64')

  console.log('\n[Step 1/2] Meminta SNAP Access Token...')
  const res = await fetch(`${apiUrl}/api/v1.0/access-token/b2b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CLIENT-KEY': clientId,
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature
    },
    body: JSON.stringify({ grantType: 'client_credentials' })
  })
  const rawText = await res.text()
  console.log(`OAuth Status: ${res.status} | Response: ${rawText}`)
  try {
    const json = JSON.parse(rawText)
    if (json.accessToken) {
      console.log('✅ Access Token berhasil didapat!')
      return { accessToken: json.accessToken, timestamp }
    }
    console.error('❌ Access Token gagal:', json.responseMessage || json.responseCode)
    return null
  } catch {
    console.error('❌ OAuth response bukan JSON valid:', rawText)
    return null
  }
}

async function testQris(label, productCodeVal) {
  const keyPath = 'server/certs/espay-private.pem'
  const privateKeyPem = fs.readFileSync(keyPath, 'utf-8')

  // Step 1: OAuth
  const tokenData = await getSnapAccessToken(privateKeyPem, commCode, apiUrl)
  if (!tokenData) {
    console.error(`[${label}] Gagal mendapat token. Skip test QRIS.`)
    return
  }
  const { accessToken, timestamp: oauthTimestamp } = tokenData

  const now = new Date()
  const timestamp = getEspayTimestamp(now)
  const externalId = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`
  const orderId = `INV${Date.now()}${Math.floor(10 + Math.random() * 90)}`
  const relativeUrl = '/api/v1.0/qr/qr-mpm-generate'

  const payload = {
    partnerReferenceNo: orderId,
    merchantId: commCode,
    amount: {
      value: '10000.00',
      currency: 'IDR'
    },
    feeType: '1',
    additionalInfo: {
      productCode: productCodeVal,
      isStatic: false
    }
  }

  const bodyString = JSON.stringify(payload)
  const bodyHash = crypto.createHash('sha256').update(bodyString).digest('hex').toLowerCase()
  const stringToSign = `POST:${relativeUrl}:${accessToken}:${bodyHash}:${timestamp}`
  const hmacSignature = crypto.createHmac('sha512', accessToken).update(stringToSign).digest('base64')

  console.log(`\n[Step 2/2] ${label} (productCode: ${productCodeVal}) — Generate QRIS...`)
  console.log(`Payload: ${bodyString}`)

  const start = Date.now()
  try {
    const res = await fetch(`${apiUrl}${relativeUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': hmacSignature,
        'X-EXTERNAL-ID': externalId,
        'X-PARTNER-ID': commCode,
        'CHANNEL-ID': 'ESPAY'
      },
      body: bodyString
    })

    const duration = ((Date.now() - start) / 1000).toFixed(2)
    const rawText = await res.text()
    console.log(`Durasi: ${duration}s | Status: ${res.status} ${res.statusText}`)
    try {
      const json = JSON.parse(rawText)
      console.log('Response JSON:', JSON.stringify(json, null, 2))
      if (json.responseCode === '2004700' || json.qrContent || json.qrUrl) {
        console.log(`\n🎉🎉🎉 ALHAMDULILLAH! BERHASIL GENERATE QRIS RESMI ESPAY! 🎉🎉🎉`)
        if (json.qrContent) console.log('EMVCo QR Content:', json.qrContent)
        if (json.qrUrl) console.log('QR Image URL:', json.qrUrl)
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
  console.log('MEMULAI PENGUJIAN FINAL SNAP QRIS')
  console.log('====================================================')

  // Coba 1: productCode = "QRIS"
  await testQris('1. Standar SNAP', 'QRIS')

  // Coba 2: productCode = "QRISPLUS"
  await testQris('2. Produk Portal', 'QRISPLUS')

  // Coba 3: productCode = "008" (Bank Code Mandiri/QRIS)
  await testQris('3. Kode Bank', '008')
}

main()
