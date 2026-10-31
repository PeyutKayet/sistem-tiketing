import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.no_wa) {
    return { used: false }
  }

  const supabase = await serverSupabaseServiceRole(event)
  
  // Cek apakah nomor WA sudah ada di database organizer_profile
  const { data, error } = await supabase
    .from('organizer_profile')
    .select('id')
    .eq('no_wa', body.no_wa)
    .single()

  if (data) {
    return { used: true }
  }

  return { used: false }
})
