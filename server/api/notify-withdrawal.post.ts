import { serverSupabaseClient } from '#supabase/server'
import { getFonnteConfig } from '../utils/getFonnteConfig'

// Rate limit map: userId -> timestamp (ms)
const withdrawalRateLimitMap = new Map<string, number>()

export default defineEventHandler(async (event) => {
  // 1. Wajib login (autentikasi organizer)
  const supabase = await serverSupabaseClient(event)
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Silakan login terlebih dahulu.' })
  }

  const body = await readBody(event)
  if (!body || !body.nominal || !body.nama_organizer) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required data' })
  }

  // 2. Rate limiting (maksimal 1 notifikasi per 60 detik per organizer)
  const now = Date.now()
  const lastSent = withdrawalRateLimitMap.get(user.id) || 0
  if (now - lastSent < 60_000) {
    return { status: 'success', message: 'Notifikasi sebelumnya sudah terkirim.' }
  }
  withdrawalRateLimitMap.set(user.id, now)

  // 3. Kirim notifikasi WA ke admin
  const { fonnteToken, adminPhone } = getFonnteConfig()
  const pesan = `🚨 *NOTIFIKASI PENARIKAN DANA* 🚨\n\nOrganizer: *${body.nama_organizer}*\nTelah mengajukan penarikan dana sebesar:\n*Rp ${Number(body.nominal).toLocaleString('id-ID')}*\n\nSilakan cek detail dan proses penarikan di panel Super Admin.`

  const formData = new FormData()
  formData.append('target', adminPhone)
  formData.append('message', pesan)

  try {
    $fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': fonnteToken },
      body: formData
    }).catch(e => console.error('[Notify Withdrawal] Gagal kirim WA Fonnte:', e))
    
    return { status: 'success', adminPhone: adminPhone }
  } catch (error) {
    return { status: 'success', adminPhone: adminPhone }
  }
})
