<template>
  <div id="gridEventContainer">
    <div class="grid-event-header">
      <h1>EventHub Discover v2</h1>
      <p>Temukan dan ikuti berbagai event menarik yang sedang berlangsung!</p>
    </div>

    <!-- State Loading -->
    <div v-if="loading" style="text-align:center; padding: 40px;">Mencari event seru...</div>
    
    <!-- State Error -->
    <div v-else-if="error" style="text-align:center; color:#ef4444; padding: 40px;">Gagal memuat event: {{ error }}</div>
    
    <!-- State Kosong -->
    <div v-else-if="events.length === 0" style="text-align:center; color:var(--text-muted); padding: 40px;">
      Saat ini belum ada event aktif yang tersedia.
    </div>
    
    <!-- Render Grid -->
    <div v-else class="event-cards-wrapper">
      <NuxtLink 
        v-for="ev in events" 
        :key="ev.id" 
        :to="`/${ev.slug}`" 
        class="event-card"
      >
        <img :src="ev.poster_url || 'https://placehold.co/400x200/F8FAFC/64748B?text=POSTER+EVENT'" class="event-card-img" :alt="ev.nama_event">
        <div class="event-card-body">
          <h3 class="event-card-title">{{ ev.nama_event }}</h3>
          <div class="event-card-meta-wrap">
            <div class="event-card-meta">
              <i>📅</i> <!-- Bisa diganti lucide-vue nanti -->
              <span>{{ formatDate(ev.tanggal_mulai) }}</span>
            </div>
            <div class="event-card-meta">
              <i>📍</i>
              <span class="truncate-lokasi">{{ ev.lokasi || 'Lokasi Menyusul' }}</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const supabase = useSupabaseClient()

const events = ref([])
const loading = ref(true)
const error = ref(null)

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
      .limit(20)

    if (err) throw err

    events.value = data || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
    await nextTick()
    if (window.lucide) window.lucide.createIcons()
  }
})
</script>

<style scoped>
#gridEventContainer { width: 100%; max-width: 1000px; padding: 20px; margin: 0 auto; }
.grid-event-header { text-align: center; margin-bottom: 40px; margin-top: 20px; }
.grid-event-header h1 { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin: 0 0 10px 0; }
.grid-event-header p { color: var(--text-muted); margin: 0; font-size: 0.95rem; font-weight: 500; }
.event-cards-wrapper { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.event-card { background: var(--card-light); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border-soft); cursor: pointer; transition: var(--transition); text-decoration: none; display: flex; flex-direction: column; }
.event-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--accent-main); }
.event-card-img { width: 100%; height: 180px; object-fit: cover; background: var(--bg-light); border-bottom: 1px solid var(--border-soft); }
.event-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.event-card-title { font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
.event-card-meta-wrap { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
.event-card-meta { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
.truncate-lokasi { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
</style>