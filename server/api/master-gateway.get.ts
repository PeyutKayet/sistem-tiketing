import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang berhak akses
  await checkSuperAdmin(event)

  try {
    const supabase = await serverSupabaseServiceRole(event)
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('key', 'payment_gateway')
      .maybeSingle()

    if (error) throw error

    const val = data?.value || {}
    return {
      is_emergency_backup: val.is_emergency_backup === true,
      emergency_message: val.emergency_message || 'Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.',
      updated_by: val.updated_by || 'master@tyket.id',
      updated_at: data?.updated_at || val.updated_at || null
    }
  } catch (err: any) {
    return {
      is_emergency_backup: false,
      emergency_message: 'Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.',
      updated_by: 'system',
      updated_at: null,
      error: err.message
    }
  }
})
