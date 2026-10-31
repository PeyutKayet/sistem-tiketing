// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxt/icon',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  supabase: {
    redirect: false,
    useSsrCookies: false
  },
  image: {
    domains: ['placehold.co', 'supabase.tyket.id', 'supabase.e-tiket.web.id']
  },
  runtimeConfig: {
    fonnteToken: process.env.FONNTE_TOKEN,
    adminPhone: process.env.ADMIN_PHONE,
    espayCommCode: process.env.ESPAY_COMM_CODE || 'SGWZULKARNAENALMUHAMMADY',
    espaySignatureKey: process.env.ESPAY_SIGNATURE_KEY || 'hme6w1tnjl15bsme',
    espayApiKey: process.env.ESPAY_API_KEY || '6cff837260703d1fb50b5a59f4904c9d',
    espayPrivateKey: process.env.ESPAY_PRIVATE_KEY || '',
    espayPublicKey: process.env.ESPAY_PUBLIC_KEY || '',
    espayApiUrl: process.env.ESPAY_API_URL || 'https://sandbox-api.espay.id',
    espaySnapClientId: process.env.ESPAY_SNAP_CLIENT_ID || '',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    supabase: {
      url: process.env.SUPABASE_URL || 'https://supabase.e-tiket.web.id',
      serviceKey: process.env.SUPABASE_SERVICE_KEY
    },
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY
      }
    }
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