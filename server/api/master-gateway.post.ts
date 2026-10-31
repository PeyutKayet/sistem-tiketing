import { serverSupabaseServiceRole, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang berhak akses
  await checkSuperAdmin(event)

  const body = await readBody(event)
  if (typeof body?.is_emergency_backup !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'Field is_emergency_backup (boolean) wajib disertakan' })
  }

  const supabaseUserClient = await serverSupabaseClient(event)
  const { data: { user } } = await supabaseUserClient.auth.getUser()
  const updatedByEmail = user?.email || 'master@tyket.id'

  const emergencyMessage = body.emergency_message || 'Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.'

  const supabase = await serverSupabaseServiceRole(event)
  
  const payloadValue = {
    is_emergency_backup: body.is_emergency_backup,
    emergency_message: emergencyMessage,
    updated_by: updatedByEmail,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('platform_settings')
    .upsert({
      key: 'payment_gateway',
      value: payloadValue,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui status gateway: ' + error.message })
  }

  return {
    success: true,
    data: data?.value || payloadValue
  }
})
