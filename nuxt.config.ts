// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxtjs/supabase', '@nuxt/image'],
  supabase: {
    redirect: false
  },
  image: {
    domains: ['placehold.co', 'supabase.e-tiket.web.id']
  },
  runtimeConfig: {
    fonnteToken: process.env.FONNTE_TOKEN,
    adminPhone: process.env.ADMIN_PHONE,
    kaseraApiKey: process.env.KASERA_API_KEY,
    kaseraWebhookSecret: process.env.KASERA_WEBHOOK_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY
  },
  vite: {
    server: {
      allowedHosts: true
    }
  },
  routeRules: {
    '/admin/**': { ssr: false },
    '/admin': { ssr: false },
    '/login': { ssr: false }
  }
})