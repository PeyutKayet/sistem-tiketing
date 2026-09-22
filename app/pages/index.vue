<template>
  <div id="gridEventContainer">
    <div class="grid-event-header">
      <h1>EventHub Discover v2</h1>
      <p>Temukan dan ikuti berbagai event menarik yang sedang berlangsung!</p>
    </div>

    <!-- State Loading: Skeleton UI -->
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
      >
        <NuxtImg 
          :src="fixPosterUrl(ev.poster_url)" 
          class="event-card-img" 
          :alt="ev.nama_event"
          loading="lazy"
          format="webp"
          fit="cover"
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
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()

const events = ref([])
const loading = ref(true)
const error = ref(null)

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return 'https://placehold.co/400x200/F8FAFC/64748B?text=POSTER+EVENT'
  return url.replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Tanggal Menyusul'
  return new Date(dateStr).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})
}

onMounted(async () => {
  const hariIni = new Date()
  hariIni.setHours(0,0,0,0)

  try {
    const { data, error: err } = await supabase
      .from('event')
      .select('id, slug, nama_event, tanggal_mulai, lokasi, poster_url, status')
      .neq('is_archived', true)
      .neq('status', 'finished')
      .gte('tanggal_mulai', hariIni.toISOString())
      .order('tanggal_mulai', { ascending: true })
      .limit(20)

    if (err) throw err

    events.value = data || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
#gridEventContainer { width: 100%; max-width: 480px; padding: 15px; margin: 0 auto; background: var(--bg-main); min-height: 100vh; }
.grid-event-header { text-align: center; margin-bottom: 25px; margin-top: 10px; }
.grid-event-header h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -1px; margin: 0 0 6px 0; color: var(--text-main); }
.grid-event-header p { color: var(--text-muted); margin: 0; font-size: 0.85rem; font-weight: 500; }
.event-cards-wrapper { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.event-card { background: var(--card-light); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid var(--border-soft); cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: flex; flex-direction: column; }
.event-card:active { transform: scale(0.98); }
.event-card-img { width: 100%; height: 130px; object-fit: cover; background: var(--bg-light); border-bottom: 1px solid var(--border-soft); }
.event-card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.event-card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin: 0 0 6px 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
.event-card-meta-wrap { display: flex; flex-direction: column; gap: 4px; margin-top: auto; }
.event-card-meta { display: flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: var(--text-muted); }
.truncate-lokasi { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }

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
</style>