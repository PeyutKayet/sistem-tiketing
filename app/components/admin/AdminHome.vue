<template>
  <div id="page-home">
    <div v-if="isLoading" class="loader-container">
      <div class="spinner"></div>
      <div style="font-weight:500; font-size:13px;">Mengambil data event...</div>
    </div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Event Aktif</div>
          <div class="value">{{ eventAktif.length }}</div>
          <div class="sub">Sedang berjalan / akan datang</div>
        </div>
        <div class="stat-card">
          <div class="label">Event Selesai</div>
          <div class="value">{{ eventSelesai.length }}</div>
          <div class="sub">Event yang sudah lewat</div>
        </div>
        <div class="stat-card">
          <div class="label">Event Diarsipkan</div>
          <div class="value">{{ eventArsip.length }}</div>
          <div class="sub">Disembunyikan dari utama</div>
        </div>
      </div>

      <!-- EVENT AKTIF -->
      <div class="section-header">
        <h3 style="display:flex; align-items:center; gap:8px;"><Icon name="lucide:target" style="color:var(--primary);" /> Event Aktif</h3>
        <div class="flex" style="gap:10px;">
          <button class="btn-outline" @click="showArsip = !showArsip" style="display:flex; align-items:center; gap:6px;">
            <Icon name="lucide:archive" /> {{ showArsip ? 'Sembunyikan Arsip' : 'Lihat Arsip' }}
          </button>
          <button class="action" @click="bukaWizard" style="display:flex; align-items:center; gap:6px;"><Icon name="lucide:plus" /> Buat Event Baru</button>
        </div>
      </div>
      
      <div v-if="eventAktif.length === 0" style="text-align:center; padding: 40px; color: #8a9aa8; background: #ffffff; border-radius: 12px; border: 1px dashed #c8d6e8; margin-bottom: 24px;">
        <Icon name="lucide:inbox" style="font-size:32px; color:#c8d6e8; margin-bottom:12px; display:block; margin-inline:auto;" />
        Belum ada event aktif. Klik <b>Buat Event Baru</b> untuk memulai.
      </div>
      
      <div class="event-grid">
        <div v-for="ev in eventAktif" :key="ev.id" class="event-card" @click="pilihEvent(ev)">
          <div class="thumb" :style="{ backgroundImage: ev.poster_url ? `url('${ev.poster_url}')` : 'none' }">
            <Icon v-if="!ev.poster_url" name="lucide:rocket" style="color:rgba(255,255,255,0.7); font-size:48px;" />
          </div>
          <div class="body">
            <div class="title">{{ ev.nama_event }}</div>
            <div class="meta" style="display:flex; align-items:center; gap:12px;">
              <span style="display:flex; align-items:center; gap:4px;"><Icon name="lucide:calendar" style="font-size:14px;" /> {{ formatDate(ev.tanggal_mulai) }}</span>
              <span style="display:flex; align-items:center; gap:4px;"><Icon name="lucide:map-pin" style="font-size:14px;" /> {{ ev.lokasi || 'Online' }}</span>
            </div>
            <span class="status-badge active">● Aktif</span>
          </div>
        </div>
      </div>

      <!-- EVENT SELESAI -->
      <div v-if="eventSelesai.length > 0">
        <div class="section-header">
          <h3 style="display:flex; align-items:center; gap:8px;"><Icon name="lucide:flag" /> Event Selesai</h3>
        </div>
        <div class="event-grid">
          <div v-for="ev in eventSelesai" :key="ev.id" class="event-card finished" @click="pilihEvent(ev)">
            <div class="thumb gray" :style="{ backgroundImage: ev.poster_url ? `url('${ev.poster_url}')` : 'none' }">
              <Icon v-if="!ev.poster_url" name="lucide:check-circle" style="color:rgba(255,255,255,0.7); font-size:48px;" />
              <span class="badge-selesai">SELESAI</span>
            </div>
            <div class="body">
              <div class="title">{{ ev.nama_event }}</div>
              <div class="meta" style="display:flex; align-items:center; gap:12px;">
                <span style="display:flex; align-items:center; gap:4px;"><Icon name="lucide:calendar" style="font-size:14px;" /> {{ formatDate(ev.tanggal_mulai) }}</span>
                <span style="display:flex; align-items:center; gap:4px;"><Icon name="lucide:map-pin" style="font-size:14px;" /> {{ ev.lokasi || 'Online' }}</span>
              </div>
              <span class="status-badge off">● Selesai</span>
            </div>
          </div>
        </div>
      </div>

      <!-- LACI ARSIP -->
      <div v-if="showArsip" style="margin-top:24px; padding-top:24px; border-top:1px dashed #cbd5e1;">
        <div class="section-header">
          <h3 style="color:#64748b; display:flex; align-items:center; gap:8px;"><Icon name="lucide:archive" /> Laci Arsip</h3>
        </div>
        <div v-if="eventArsip.length === 0" style="text-align:center; color:#8a9aa8; padding: 20px;">
          <Icon name="lucide:inbox" style="font-size:24px; color:#c8d6e8; margin-bottom:8px; display:block; margin-inline:auto;" />
          Tidak ada event diarsipkan.
        </div>
        <div class="event-grid">
          <div v-for="ev in eventArsip" :key="ev.id" class="event-card archived" @click="pilihEvent(ev)">
            <div class="thumb gray">
              <Icon name="lucide:folder-closed" style="color:rgba(255,255,255,0.7); font-size:48px;" />
            </div>
            <div class="body">
              <div class="title">{{ ev.nama_event }}</div>
              <div class="meta" style="display:flex; align-items:center; gap:12px;">
                <span style="display:flex; align-items:center; gap:4px;"><Icon name="lucide:calendar" style="font-size:14px;" /> {{ formatDate(ev.tanggal_mulai) }}</span>
                <span style="display:flex; align-items:center; gap:4px;"><Icon name="lucide:map-pin" style="font-size:14px;" /> {{ ev.lokasi || 'Online' }}</span>
              </div>
              <span class="status-badge archived">📦 Diarsipkan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue' // Tambahkan import Vue hooks

const {
  isLoading, eventAktif, eventSelesai, eventArsip,
  showArsip, formatDate, selectedEvent, activeTab,
  showWizard, wizardStepNow, formEvent, wizardTiketList, muatDaftarPeserta,
  muatDaftarEvent, currentUser // Kita keluarkan muatDaftarEvent & currentUser dari state
} = useAdmin()

// Tarik data otomatis saat halaman dimuat
onMounted(() => {
  if (currentUser.value?.id) {
    muatDaftarEvent(currentUser.value.id)
  }
})

// Berjaga-jaga jika ID user sedikit telat dimuat (reaktivitas Nuxt/Supabase)
watch(() => currentUser.value?.id, (newId) => {
  if (newId) muatDaftarEvent(newId)
})

const pilihEvent = async (ev) => {
  selectedEvent.value = ev
  await muatDaftarPeserta()
  activeTab.value = 'event'
}

const bukaWizard = () => {
  formEvent.value = { nama: '', slug: '', tanggal: '', lokasi: '', deskripsi: '', poster_file: null, poster_preview: null }
  wizardTiketList.value = []
  if (window.FormForge) window.FormForge.setItems([])
  wizardStepNow.value = 1
  showWizard.value = true
}
</script>
