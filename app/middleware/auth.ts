export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  if (!user.value && (to.path.startsWith('/admin') || to.path.startsWith('/s1u2p3e4r5'))) {
    return navigateTo('/login')
  }
})
