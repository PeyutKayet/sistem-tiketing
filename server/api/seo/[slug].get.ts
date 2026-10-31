import { serverSupabaseServiceRole } from '#supabase/server'

export default defineCachedEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  const publicUrl = process.env.SUPABASE_URL || 'https://supabase.e-tiket.web.id'

  // Fungsi untuk mencoba fetch ke suatu baseUrl (bisa internal HTTP atau eksternal HTTPS)
  const tryFetchEvent = async (baseUrl) => {
    try {
      const res = await fetch(`${baseUrl}/rest/v1/event?slug=eq.${slug}&select=id,nama_event,deskripsi,poster_url,tanggal_mulai,lokasi,organizer_id,settings`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        signal: AbortSignal.timeout(2500)
      })
      if (res.ok) {
        const json = await res.json()
        return json.length > 0 ? json[0] : null
      }
    } catch (e) {
      return null
    }
    return null
  }

  const tryFetchOrganizer = async (baseUrl, orgId) => {
    try {
      const res = await fetch(`${baseUrl}/rest/v1/organizer_profile?id=eq.${orgId}&select=nama_organizer,no_wa,link_ig,link_web,logo_url`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        signal: AbortSignal.timeout(2500)
      })
      if (res.ok) {
        const json = await res.json()
        return json.length > 0 ? json[0] : null
      }
    } catch (e) {
      return null
    }
    return null
  }

  try {
    const targetUrl = publicUrl || 'https://supabase.e-tiket.web.id'
    const eventData = await tryFetchEvent(targetUrl)
    if (!eventData) return null

    // Fetch nama_organizer jika ada organizer_id
    if (eventData.organizer_id) {
      eventData.organizer_profile = await tryFetchOrganizer(targetUrl, eventData.organizer_id)
    }

    return eventData
  } catch (err) {
    console.error('SEO API Fatal Error:', err)
    return null
  }
}, {
  maxAge: 60 * 5, // Cache 5 menit
  name: 'seo-data',
  getKey: (event) => getRouterParam(event, 'slug') || 'default'
})
