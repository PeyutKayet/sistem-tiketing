const testPayload = {
  partnerServiceId: " Espay",
  customerNo: "SGWZULKARNAENALMUHAMMADY",
  virtualAccountNo: "TEST-008-1792486031156",
  trxDateInit: "2026-10-20T15:47:20+07:00",
  inquiryRequestId: "cd7c0b0c-e0e9-4dbc-9dde-a7b8f2ede9d3"
}

async function testLocal() {
  console.log('Testing http://localhost:3000/api/webhook/espay-inquiry directly...')
  const start = Date.now()
  try {
    const res = await fetch('http://localhost:3000/api/webhook/espay-inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TIMESTAMP': '2026-10-20T15:47:20+07:00',
        'X-PARTNER-ID': 'SGWZULKARNAENALMUHAMMADY',
        'CHANNEL-ID': 'ESPAY'
      },
      body: JSON.stringify(testPayload)
    })
    console.log(`Status: ${res.status} ${res.statusText} in ${Date.now() - start}ms`)
    const data = await res.json()
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Local test failed:', err.message)
  }
}

async function testTunnel() {
  const tunnelUrl = process.argv[2] || 'https://chancellor-sum-ice-yang.trycloudflare.com'
  console.log(`\nTesting ${tunnelUrl}/api/webhook/espay-inquiry via Tunnel...`)
  const start = Date.now()
  try {
    const res = await fetch(`${tunnelUrl}/api/webhook/espay-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TIMESTAMP': '2026-10-20T15:47:20+07:00',
        'X-PARTNER-ID': 'SGWZULKARNAENALMUHAMMADY',
        'CHANNEL-ID': 'ESPAY'
      },
      body: JSON.stringify(testPayload)
    })
    console.log(`Status: ${res.status} ${res.statusText} in ${Date.now() - start}ms`)
    const data = await res.json()
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Tunnel test failed:', err.message)
  }
}

async function main() {
  await testLocal()
  await testTunnel()
}

main()
