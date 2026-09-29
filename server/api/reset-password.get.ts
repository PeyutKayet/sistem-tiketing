import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  
  const { data, error } = await supabase.auth.admin.updateUserById(
    '2452e4e7-6db3-449b-8d52-03f2a7ff5d22',
    { password: 'PasswordBaru123!' }
  )
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true, email: data.user.email, message: 'Password berhasil direset menjadi: PasswordBaru123!' }
})
