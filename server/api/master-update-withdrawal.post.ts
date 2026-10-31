import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang boleh akses
  await checkSuperAdmin(event)

  const body = await readBody(event)
  
  if (!body || !body.id || !body.status) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id or status' })
  }

  const supabase = await serverSupabaseServiceRole(event)
  
  const { data, error } = await supabase
    .from('penarikan_dana')
    .update({ status: body.status })
    .eq('id', body.id)
    .select()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, data }
})
