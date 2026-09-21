import { createClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  // Wait for the session
  const { data: { session } } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access /admin, redirect to /login
  if (!session && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})
