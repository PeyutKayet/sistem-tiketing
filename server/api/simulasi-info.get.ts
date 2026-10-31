import { getEspayPrivateKey, getEspayPublicKey } from '../utils/espay'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const privateKey = getEspayPrivateKey()
  const publicKey = getEspayPublicKey()
  const commCode = config.espayCommCode || 'SGWZULKARNAENALMUHAMMADY'
  const clientId = (config as any).espaySnapClientId || commCode

  let registeredChannels: any = null
  let merchantInfoError: string | null = null

  if (config.espayApiKey) {
    try {
      const form = new URLSearchParams()
      form.append('key', config.espayApiKey)
      const res: any = await $fetch(`${config.espayApiUrl || 'https://sandbox-api.espay.id'}/rest/merchant/merchantinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: form.toString()
      })
      registeredChannels = res
    } catch (e: any) {
      merchantInfoError = e.message
    }
  }

  return {
    apiUrl: config.espayApiUrl || 'https://sandbox-api.espay.id',
    commCode,
    clientId,
    apiKey: config.espayApiKey ? `${config.espayApiKey.substring(0, 8)}...` : null,
    sampleMerchant: 'SGWYESSISHOP',
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey ? privateKey.length : 0,
    hasPublicKey: !!publicKey,
    hasSignatureKey: !!config.espaySignatureKey,
    registeredChannels,
    merchantInfoError,
    inquiryCallbackPath: '/api/webhook/espay-inquiry',
    paymentCallbackPath: '/api/webhook/espay',
    settlementCallbackPath: '/api/webhook/espay-settlement',
    portalInquiryUrlNotice: 'Pastikan disimpan di Portal Merchant Sandbox Espay',
    activeMode: 'Sandbox Direct API (disableFallback: true)'
  }
})
