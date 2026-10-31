import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

const MASTER_EMAIL = 'master@tyket.id'

export async function checkSuperAdmin(event: H3Event): Promise<void> {
  const adminClient = await serverSupabaseServiceRole(event)

  // 1. Dapatkan user yang sedang login (prioritas dari Bearer token di header untuk kestabilan ngrok)
  let user: any = null

  const authHeader = getHeader(event, 'authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: jwtData, error: jwtErr } = await adminClient.auth.getUser(token)
      if (!jwtErr && jwtData?.user) {
        user = jwtData.user
      }
    } catch (e) {
      console.warn('[checkSuperAdmin] Gagal verifikasi Bearer token:', e)
    }
  }

  // 1b. Fallback ke cookie session jika header Authorization tidak ada
  if (!user) {
    try {
      const supabase = await serverSupabaseClient(event)
      const { data, error: authError } = await supabase.auth.getUser()
      if (!authError && data?.user) {
        user = data.user
      }
    } catch (e) {
      // Cookie session error / missing
    }
  }

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Sesi login tidak ditemukan. Silakan login kembali.'
    })
  }

  // 2. Loloskan jika login menggunakan master email resmi (sinkron dengan s1u2p3e4r5)
  const masterEmailEnv = process.env.MASTER_EMAIL || MASTER_EMAIL
  if (user.email && (user.email.toLowerCase() === MASTER_EMAIL.toLowerCase() || user.email.toLowerCase() === masterEmailEnv.toLowerCase())) {
    return
  }

  // 3. Cek apakah user_id ada di tabel super_admins (Service Role bypass RLS)
  const { data: superAdmin, error: saError } = await adminClient
    .from('super_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!saError && superAdmin) {
    return
  }

  console.warn(`[checkSuperAdmin 403] Akses ditolak untuk user: ${user.email} (ID: ${user.id}). saError:`, saError?.message)

  throw createError({
    statusCode: 403,
    statusMessage: `Forbidden: Akses hanya untuk Super Admin. Akun ${user.email} belum terdaftar di tabel super_admins.`
  })
}
