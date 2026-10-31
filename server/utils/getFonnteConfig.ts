import type { H3Event } from 'h3'

/**
 * Mengambil konfigurasi Fonnte dari environment variables.
 * Jika env tidak tersedia, server akan langsung throw error
 * agar masalah konfigurasi ketahuan sejak awal — bukan diam-diam
 * menggunakan token hardcoded yang bocor ke codebase.
 */
export function getFonnteConfig(_event?: H3Event) {
  const config = useRuntimeConfig()

  const fonnteToken = config.fonnteToken as string | undefined
  const adminPhone = config.adminPhone as string | undefined

  if (!fonnteToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Konfigurasi server tidak lengkap: FONNTE_TOKEN belum diset di environment variables.'
    })
  }

  if (!adminPhone) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Konfigurasi server tidak lengkap: ADMIN_PHONE belum diset di environment variables.'
    })
  }

  return { fonnteToken, adminPhone }
}
