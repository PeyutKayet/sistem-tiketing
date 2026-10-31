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
          <div class="thumb" :style="ev.poster_url ? { backgroundImage: `url('${fixPosterUrl(ev.poster_url)}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}">
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
            <div class="thumb gray" :style="ev.poster_url ? { backgroundImage: `url('${fixPosterUrl(ev.poster_url)}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}">
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
              <span class="status-badge archived"><Icon name="lucide:archive" style="margin-right:4px;" /> Diarsipkan</span>
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
  showWizard, wizardStepNow, formEvent, formTiketBaru, wizardTiketList, formForgeItems, muatDaftarPeserta,
  muatDaftarEvent, currentUser // Kita keluarkan muatDaftarEvent & currentUser dari state
} = useAdmin()

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return ''
  return url.replace('http://192.168.1.7:8000', 'https://supabase.tyket.id').replace('http://localhost:8000', 'https://supabase.tyket.id')
}

// Data dimuat oleh layout utama (admin.vue)

const router = useRouter()
const pilihEvent = (ev) => {
  router.push('/admin/event/' + ev.slug)
}

const bukaWizard = () => {
  formEvent.value = { 
    nama: '', slug: '', tanggal: '', lokasi: '', deskripsi: '', link_maps: '',
    tipe_event: 'offline', sistem_checkin: 'scanner', target_absen: 0, link_online: '', is_qr_active: true, is_online_absen_active: false,
    is_snk_active: false, snk_text: 'Syarat dan ketentuan berlaku mengikuti kebijakan panitia dan tyket.id.',
    is_anti_calo_email: false, is_anti_calo_wa: false, is_wa_konfirm: false,
    is_limit_tiket_active: true, max_tiket_per_transaksi: 1,
    is_donasi_active: false, donasi_header: '', donasi_options: '', is_donasi_custom: false,
    is_grup_wa_active: false, link_grup_wa: '',
    poster_file: null, poster_preview: null 
  }
  formTiketBaru.value = { nama: '', harga: '', is_gratis: true, kuota: '', is_unlimited: false, is_hidden: false, is_active: true, buka: '', tutup: '', is_no_time_limit: false }
  wizardTiketList.value = []
  
  // Reset FormForge Items to the 3 mandatory default fields
  formForgeItems.value = [
      { id: 'ff_default_nama', type: 'short_text', label: 'Nama Lengkap', field_key: 'nama_lengkap', x: 0, y: 0, width: 12, height: 2, required: true, undeletable: true, unduplicable: true, is_mandatory: true },
      { id: 'ff_default_email', type: 'short_text', label: 'Email', field_key: 'email', x: 0, y: 2, width: 6, height: 2, required: true, undeletable: true, unduplicable: true, is_mandatory: true },
      { id: 'ff_default_wa', type: 'phone_wa', label: 'No. WhatsApp', field_key: 'no_wa', x: 6, y: 2, width: 6, height: 2, required: true, undeletable: true, unduplicable: true, is_mandatory: true },
      { id: 'ff_default_domisili', type: 'domisili_api', label: 'Kota Domisili', field_key: 'domisili', x: 0, y: 4, width: 12, height: 2, required: true, undeletable: false, unduplicable: false, is_mandatory: false }
  ];
  if (typeof window !== 'undefined' && window._ffInstance) window._ffInstance.init(formForgeItems.value)
  
  wizardStepNow.value = 1
  showWizard.value = true
}
</script>

