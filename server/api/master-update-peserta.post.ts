import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang boleh akses
  await checkSuperAdmin(event)

  const body = await readBody(event)
  
  if (!body || !body.ids || !Array.isArray(body.ids)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ids array' })
  }

  const supabase = await serverSupabaseServiceRole(event)
  
  const { data, error } = await supabase
    .from('peserta')
    .update({ status_dana: 'CAIR' })
    .in('id', body.ids)
    .select()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, count: data?.length || 0 }
})
