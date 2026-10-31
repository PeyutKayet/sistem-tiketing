<template>
  <div id="gridEventContainer">
    <div class="grid-event-header-compact">
      <div class="header-texts">
        <img src="/logo-tyket.svg" alt="tyket.id Logo" class="brand-logo" />
        <p>Temukan event menarik!</p>
      </div>
      <div class="header-cta-wrapper">
        <span class="header-cta-hint">Punya acara?</span>
        <NuxtLink to="/admin" class="header-cta-btn">
          <img src="/favicon.svg" alt="tyket.id" class="header-cta-icon" />
          <span>Buat Event</span>
        </NuxtLink>
      </div>
    </div>

    <!-- State Loading: Skeleton UI -->
    <ClientOnly>
      <div v-if="loading" class="event-cards-wrapper">
        <div v-for="i in 4" :key="'skel'+i" class="event-card skeleton-card">
          <div class="skeleton-img"></div>
          <div class="event-card-body">
            <div class="skeleton-text skeleton-title"></div>
            <div class="event-card-meta-wrap">
              <div class="skeleton-text skeleton-meta"></div>
              <div class="skeleton-text skeleton-meta"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- State Error -->
      <div v-else-if="error" style="text-align:center; padding: 60px 20px; background: #fef2f2; border-radius: 20px; border: 1px dashed #f87171;">
        <Icon name="lucide:alert-circle" style="font-size: 48px; color: #ef4444; margin-bottom: 12px;" />
        <h3 style="margin: 0 0 8px; color: #b91c1c;">Gagal Memuat Data</h3>
        <p style="margin: 0; color: #dc2626;">{{ error }}</p>
      </div>
      
      <!-- State Kosong -->
      <div v-else-if="events.length === 0" style="text-align:center; padding: 60px 20px; background: #f8fafc; border-radius: 20px; border: 1px dashed #cbd5e1;">
        <Icon name="lucide:calendar-off" style="font-size: 48px; color: #94a3b8; margin-bottom: 12px;" />
        <h3 style="margin: 0 0 8px; color: #475569;">Belum Ada Event</h3>
        <p style="margin: 0; color: #64748b;">Saat ini belum ada event aktif yang tersedia. Coba kembali lagi nanti!</p>
      </div>
      
      <!-- Render Grid -->
      <div v-else class="event-cards-wrapper">
        <NuxtLink 
          v-for="ev in events" 
          :key="ev.id" 
          :to="`/${ev.slug}`" 
          class="event-card"
          @click="onSelectEvent(ev)"
          @mouseenter="onPrefetchEvent(ev)"
          @touchstart.passive="onPrefetchEvent(ev)"
        >
          <img 
            :src="fixPosterUrl(ev.poster_url)" 
            class="event-card-img" 
            :alt="ev.nama_event"
            loading="lazy"
          />
          <div class="event-card-body">
            <h3 class="event-card-title">{{ ev.nama_event }}</h3>
            <div class="event-card-meta-wrap">
              <div class="event-card-meta">
                <Icon name="lucide:calendar" style="color: var(--primary);" />
                <span>{{ formatDate(ev.tanggal_mulai) }}</span>
              </div>
              <div class="event-card-meta">
                <Icon name="lucide:map-pin" style="color: #ef4444;" />
                <span class="truncate-lokasi">{{ ev.lokasi || 'Lokasi Menyusul' }}</span>
              </div>
            </div>
            <div v-if="ev.organizer_profile?.nama_organizer" class="event-card-eo-wrap">
              <img :src="ev.organizer_profile?.logo_url ? fixPosterUrl(ev.organizer_profile.logo_url) : `https://ui-avatars.com/api/?name=${encodeURIComponent(ev.organizer_profile.nama_organizer)}&background=0F172A&color=fff&rounded=true&size=32`" class="event-card-eo-logo" alt="EO" />
              <span class="event-card-eo-name">{{ ev.organizer_profile.nama_organizer }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <template #fallback>
        <div class="event-cards-wrapper">
          <div v-for="i in 4" :key="'fall'+i" class="event-card skeleton-card">
            <div class="skeleton-img"></div>
            <div class="event-card-body">
              <div class="skeleton-text skeleton-title"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
    
    <!-- FOOTER TYKET.ID -->
    <footer class="app-footer">
      <div class="footer-links">
        <NuxtLink to="/cari-tiket">Cari Tiket Saya</NuxtLink>
        <span class="dot-separator">•</span>
        <NuxtLink to="/terms">Syarat & Ketentuan</NuxtLink>
        <span class="dot-separator">•</span>
        <NuxtLink to="/privacy">Kebijakan Privasi</NuxtLink>
      </div>
      <div class="footer-contact">
        <div class="contact-details">
          <a href="mailto:support.tyketid@gmail.com" class="contact-span">
            <Icon name="lucide:mail" />
            <span>support.tyketid@gmail.com</span>
          </a>
          <a href="https://wa.me/6285156575710" target="_blank" rel="noopener noreferrer" class="contact-span">
            <Icon name="lucide:phone" />
            <span>+62 851-5657-5710</span>
          </a>
        </div>
      </div>
      <div class="footer-copyright">
        &copy; 2026 tyket.id. Hak Cipta Dilindungi.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const supabase = useSupabaseClient()
const { prefetchTickets } = useEventTicketCache()

const events = ref([])
const loading = ref(true)
const error = ref(null)

const selectedPreview = useState('selected_event_preview', () => null)
const onSelectEvent = (ev) => {
  selectedPreview.value = ev
}

// Prefetch data tiket dan cache poster di memori saat hover/touch
const prefetchedEventIds = new Set()
const onPrefetchEvent = (ev) => {
  if (!ev?.id || prefetchedEventIds.has(ev.id)) return
  prefetchedEventIds.add(ev.id)

  // 1. Prefetch data tiket & kuota ke cache
  prefetchTickets(ev.id)

  // 2. Pre-cache gambar poster ke memory browser
  if (ev.poster_url && typeof window !== 'undefined') {
    const img = new Image()
    img.src = fixPosterUrl(ev.poster_url)
  }
}

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return 'https://placehold.co/400x200/F8FAFC/64748B?text=POSTER+EVENT'
  return url.replace('http://192.168.1.7:8000', 'https://supabase.tyket.id').replace('http://localhost:8000', 'https://supabase.tyket.id')
}

// Fungsi format tanggal manual yang 100% tahan banting dari Hydration Mismatch
const formatDate = (dateStr) => {
  if (!dateStr) return 'Tanggal Menyusul'
  const d = new Date(dateStr)
  
  const hari = d.getDate()
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const bulan = namaBulan[d.getMonth()]
  const tahun = d.getFullYear()
  
  return `${hari} ${bulan} ${tahun}`
}

onMounted(async () => {
  const hariIni = new Date()
  hariIni.setHours(0,0,0,0)

  try {
    const { data, error: err } = await supabase
      .from('event')
      .select('id, slug, nama_event, deskripsi, tanggal_mulai, lokasi, poster_url, status, organizer_id')
      .neq('is_archived', true)
      .eq('status', 'published')
      .gte('tanggal_mulai', hariIni.toISOString())
      .order('tanggal_mulai', { ascending: true })
      .limit(20)

    if (err) throw err

    // LANGSUNG TAMPILKAN KARTU EVENT KE LAYAR PENGUNJUNG (HILANGKAN SKELETON)
    events.value = data || []
    loading.value = false

    // Tarik profil organizer secara non-blocking di background
    if (data && data.length > 0) {
      const orgIds = [...new Set(data.map(e => e.organizer_id).filter(id => id))]
      if (orgIds.length > 0) {
        supabase
          .from('organizer_profile')
          .select('id, nama_organizer, logo_url, no_wa, link_ig, link_web')
          .in('id', orgIds)
          .then(({ data: orgData }) => {
            if (orgData) {
              const orgMap = {}
              orgData.forEach(org => orgMap[org.id] = org)
              events.value.forEach(e => {
                if (orgMap[e.organizer_id]) {
                  e.organizer_profile = orgMap[e.organizer_id]
                }
              })
            }
          })
          .catch(e => console.warn('Gagal memuat profil organizer:', e))
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
#gridEventContainer { 
  width: 100%; 
  max-width: 480px; 
  padding: 15px; 
  margin: 0 auto; 
  background: var(--bg-light); 
  min-height: 100vh; 
  overflow-x: hidden;
  box-sizing: border-box;
}
.grid-event-header-compact { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  margin-top: 5px; 
  margin-bottom: 20px; 
  gap: 12px; 
}
.header-texts { flex: 1; min-width: 0; }
.brand-logo { height: 38px; width: auto; object-fit: contain; margin-bottom: 2px; display: block; }
.header-texts p { color: var(--text-muted); margin: 0; font-size: 0.75rem; font-weight: 500; }
.header-cta-wrapper { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.header-cta-hint { font-size: 0.65rem; font-weight: 600; color: var(--text-muted, #5C738A); letter-spacing: 0.2px; }
.header-cta-btn { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-yellow); border: 1px solid rgba(252, 235, 156, 0.8); color: var(--primary); padding: 7px 13px; border-radius: 20px; text-decoration: none; font-size: 0.72rem; font-weight: 800; transition: all 0.2s ease; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 10px rgba(252, 235, 156, 0.3); flex-shrink: 0; }
.header-cta-btn:hover { background: #FCEB9C; transform: translateY(-2px); box-shadow: 0 6px 14px rgba(252, 235, 156, 0.5); }
.header-cta-btn:active { transform: scale(0.95); }
.header-cta-icon { width: 14px; height: 14px; object-fit: contain; }
.event-cards-wrapper { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; width: 100%; box-sizing: border-box; }
.event-card { background: var(--card-light); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid var(--border-soft); cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: flex; flex-direction: column; min-width: 0; box-sizing: border-box; }
.event-card:active { transform: scale(0.98); }
.event-card-img { width: 100%; height: 130px; object-fit: cover; background: var(--bg-light); border-bottom: 1px solid var(--border-soft); }
.event-card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.event-card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin: 0 0 6px 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
.event-card-meta-wrap { display: flex; flex-direction: column; gap: 4px; margin-top: auto; }
.event-card-meta { display: flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: var(--text-muted); }
.truncate-lokasi { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }

/* EO Info Styles */
.event-card-eo-wrap { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-soft); }
.event-card-eo-logo { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-soft); }
.event-card-eo-name { font-size: 0.68rem; font-weight: 700; color: var(--accent-main); text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Skeleton Loading Animation */
.skeleton-card { background: #fff; cursor: default; }
.skeleton-card:hover { transform: none; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-color: var(--border-soft); }
.skeleton-img { width: 100%; height: 130px; background: #e2e8f0; animation: pulse 1.5s infinite ease-in-out; }
.skeleton-text { background: #e2e8f0; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
.skeleton-title { height: 24px; width: 80%; margin-bottom: 20px; }
.skeleton-meta { height: 16px; width: 60%; margin-bottom: 8px; }
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}



/* Footer Styles */
.app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--border-soft); text-align: center; }
.footer-links { margin-bottom: 8px; display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 0.7rem; }
.footer-links a { color: var(--primary); text-decoration: none; font-weight: 600; }
.footer-links a:hover { text-decoration: underline; }
.dot-separator { color: #cbd5e1; font-size: 0.55rem; }
.footer-contact { margin-bottom: 8px; }
.contact-details { display: flex; flex-direction: row; justify-content: center; flex-wrap: wrap; gap: 8px; }
.contact-details .contact-span { display: inline-flex; align-items: center; gap: 4px; color: #94a3b8; font-size: 0.65rem; font-weight: 500; text-decoration: none; transition: color 0.2s; }
.contact-details .contact-span:hover { color: var(--primary); }
.footer-copyright { color: #94a3b8; font-size: 0.6rem; }
</style>
