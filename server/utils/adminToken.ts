import crypto from 'node:crypto'

function getSecretKey(): string {
  const config = useRuntimeConfig()
  return config.supabaseServiceKey || config.espaySignatureKey || 'tyket-admin-secret-salt-2026'
}

/**
 * Generate HMAC-SHA256 token untuk verifikasi pesanan oleh admin
 */
export function generateAdminVerifyToken(orderId: string): string {
  const secret = getSecretKey()
  return crypto.createHmac('sha256', secret).update(`verify:${orderId}`).digest('hex')
}

/**
 * Validasi HMAC-SHA256 token secara aman terhadap timing-attack
 */
export function verifyAdminToken(orderId: string, token: string): boolean {
  if (!orderId || !token) return false
  const expected = generateAdminVerifyToken(orderId)
  
  // Pastikan panjang string sama persis (mencegah parsing hex parsial)
  if (token.length !== expected.length) return false

  try {
    const bufExpected = Buffer.from(expected, 'hex')
    const bufReceived = Buffer.from(token, 'hex')
    if (bufExpected.length !== bufReceived.length) return false
    return crypto.timingSafeEqual(bufExpected, bufReceived)
  } catch {
    return false
  }
}

/**
 * Generate HMAC-SHA256 token untuk pembatalan pesanan oleh user yang checkout
 */
export function generateOrderCancelToken(orderId: string): string {
  const secret = getSecretKey()
  return crypto.createHmac('sha256', secret).update(`cancel:${orderId}`).digest('hex')
}

/**
 * Validasi HMAC-SHA256 token pembatalan pesanan secara aman
 */
export function verifyOrderCancelToken(orderId: string, token: string): boolean {
  if (!orderId || !token) return false
  const expected = generateOrderCancelToken(orderId)
  if (token.length !== expected.length) return false
  try {
    const bufExpected = Buffer.from(expected, 'hex')
    const bufReceived = Buffer.from(token, 'hex')
    if (bufExpected.length !== bufReceived.length) return false
    return crypto.timingSafeEqual(bufExpected, bufReceived)
  } catch {
    return false
  }
}

