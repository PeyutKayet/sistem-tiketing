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
        <h3>🎯 Event Aktif</h3>
        <div class="flex" style="gap:10px;">
          <button class="btn-outline" @click="showArsip = !showArsip">
            📂 {{ showArsip ? 'Sembunyikan Arsip' : 'Lihat Arsip' }}
          </button>
          <button class="action" @click="bukaWizard">+ Buat Event Baru</button>
        </div>
      </div>
      
      <div v-if="eventAktif.length === 0" style="text-align:center; padding: 40px; color: #8a9aa8; background: #ffffff; border-radius: 12px; border: 1px dashed #c8d6e8; margin-bottom: 24px;">
        Belum ada event aktif. Klik <b>+ Buat Event Baru</b> untuk memulai.
      </div>
      
      <div class="event-grid">
        <div v-for="ev in eventAktif" :key="ev.id" class="event-card" @click="pilihEvent(ev)">
          <div class="thumb" :style="{ backgroundImage: ev.poster_url ? `url('${ev.poster_url}')` : 'none' }">
            {{ !ev.poster_url ? '🚀' : '' }}
          </div>
          <div class="body">
            <div class="title">{{ ev.nama_event }}</div>
            <div class="meta">📅 {{ formatDate(ev.tanggal_mulai) }} · 📍 {{ ev.lokasi || 'Online' }}</div>
            <span class="status-badge active">● Aktif</span>
          </div>
        </div>
      </div>

      <!-- EVENT SELESAI -->
      <div v-if="eventSelesai.length > 0">
        <div class="section-header">
          <h3>🏁 Event Selesai</h3>
        </div>
        <div class="event-grid">
          <div v-for="ev in eventSelesai" :key="ev.id" class="event-card finished" @click="pilihEvent(ev)">
            <div class="thumb gray" :style="{ backgroundImage: ev.poster_url ? `url('${ev.poster_url}')` : 'none' }">
              {{ !ev.poster_url ? '📚' : '' }}
              <span class="badge-selesai">SELESAI</span>
            </div>
            <div class="body">
              <div class="title">{{ ev.nama_event }}</div>
              <div class="meta">📅 {{ formatDate(ev.tanggal_mulai) }} · 📍 {{ ev.lokasi || 'Online' }}</div>
              <span class="status-badge off">● Selesai</span>
            </div>
          </div>
        </div>
      </div>

      <!-- LACI ARSIP -->
      <div v-if="showArsip" style="margin-top:24px; padding-top:24px; border-top:1px dashed #cbd5e1;">
        <div class="section-header">
          <h3 style="color:#64748b;">📦 Laci Arsip</h3>
        </div>
        <div v-if="eventArsip.length === 0" style="text-align:center; color:#8a9aa8; padding: 20px;">
          Tidak ada event diarsipkan.
        </div>
        <div class="event-grid">
          <div v-for="ev in eventArsip" :key="ev.id" class="event-card archived" @click="pilihEvent(ev)">
            <div class="thumb gray">📁</div>
            <div class="body">
              <div class="title">{{ ev.nama_event }}</div>
              <div class="meta">📅 {{ formatDate(ev.tanggal_mulai) }} · 📍 {{ ev.lokasi || 'Online' }}</div>
              <span class="status-badge archived">📦 Diarsipkan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  isLoading, eventAktif, eventSelesai, eventArsip,
  showArsip, formatDate, selectedEvent, activeTab,
  showWizard, wizardStepNow, formEvent, wizardTiketList, muatDaftarPeserta
} = useAdmin()

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
