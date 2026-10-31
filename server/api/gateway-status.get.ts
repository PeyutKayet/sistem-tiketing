import { serverSupabaseServiceRole } from '#supabase/server'

export default defineCachedEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseServiceRole(event)
    const { data, error } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'payment_gateway')
      .maybeSingle()

    if (error || !data) {
      return {
        is_emergency_backup: false,
        emergency_message: 'Sistem pembayaran otomatis sedang dalam pemeliharaan. Silakan transfer manual.'
      }
    }

    return {
      is_emergency_backup: data.value?.is_emergency_backup === true,
      emergency_message: data.value?.emergency_message || 'Sistem pembayaran otomatis sedang dalam pemeliharaan. Silakan transfer manual.'
    }
  } catch (err) {
    return {
      is_emergency_backup: false,
      emergency_message: ''
    }
  }
}, {
  maxAge: 30, // Cache 30 detik
  name: 'gateway-status-cache'
})
