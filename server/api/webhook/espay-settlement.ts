import { getEspayDatetime } from '../../utils/espay'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  if (method === 'GET' || method === 'HEAD') {
    return { status: 'ok', service: 'Espay Settlement Webhook', timestamp: new Date().toISOString() }
  }

  const body = await readBody(event)

  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Empty Body' })
  }

  const rqUuid = body.rq_uuid || ''
  const rqDatetime = body.rq_datetime || ''
  const commCode = body.comm_code || ''
  const rsDatetime = getEspayDatetime(new Date())

  const config = useRuntimeConfig()
  const expectedCommCode = config.espayCommCode || process.env.ESPAY_COMM_CODE
  if (expectedCommCode && commCode && commCode !== expectedCommCode) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Invalid merchant code' })
  }

  // Data settlement dari Espay (bisa berupa JSON string atau array)
  let settlementData: any[] = []
  try {
    if (typeof body.data === 'string') {
      settlementData = JSON.parse(body.data)
    } else if (Array.isArray(body.data)) {
      settlementData = body.data
    }
  } catch (err) {
    console.warn('[Espay Settlement] Gagal parse data settlement:', err)
  }

  console.log(`[Espay Settlement] Menerima notifikasi settlement (${settlementData.length} transaksi) dari ${commCode}`)

  // Log detail settlement
  for (const item of settlementData) {
    console.log(`[Espay Settlement] TX: ${item.tx_id}, Amount: ${item.settlement_amount}, Fee: ${item.settlement_fee}, Date: ${item.settlement_date}`)
  }

  // Respon sukses ke server Espay sesuai spesifikasi
  return {
    rq_uuid: rqUuid,
    rs_datetime: rsDatetime,
    error_code: '0000',
    error_message: 'Success'
  }
})
