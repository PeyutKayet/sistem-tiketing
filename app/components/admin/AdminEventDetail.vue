<template>
  <div id="page-event" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title">📋 <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="activeTab = 'home'">🔙 Kembali</button>
    </div>

    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h4 style="font-weight:600;color:#0a1929;margin:0;">📝 Informasi Acara</h4>
        <button class="btn-icon" style="background:#f0f4fa; font-size: 13px; padding: 6px 12px;" @click="activeTab = 'edit'" title="Edit Informasi">✏️ Edit</button>
      </div>
      <div class="row">
        <div class="col" style="flex:0 0 150px;">
          <div class="poster-lg" :style="{ backgroundImage: selectedEvent.poster_url ? `url('${selectedEvent.poster_url}')` : 'none' }">{{ selectedEvent.poster_url ? '' : '🚀' }}</div>
          <div style="margin-top:10px;">
            <span class="status-badge active" style="display:flex; align-items:center;" v-if="selectedEvent.status !== 'archived' && !selectedEvent.is_archived && selectedEvent.status !== 'finished'">
              <span style="display:inline-block; width:8px; height:8px; background:#1a6a4a; border-radius:50%; margin-right:6px; animation: pulseGlow 1.5s infinite alternate;"></span> Aktif
            </span>
            <span class="status-badge off" v-else-if="selectedEvent.status === 'finished'">Selesai</span>
            <span class="status-badge archived" v-else>Diarsipkan</span>
          </div>
        </div>
        <div class="col">
          <div class="row">
            <div class="col">
              <label class="form-label">Nama Acara</label>
              <div class="value">{{ selectedEvent.nama_event }}</div>
            </div>
            <div class="col">
              <label class="form-label">Slug</label>
              <div style="display:flex;gap:12px;align-items:center;font-weight:400;">
                <span>{{ selectedEvent.slug }}</span>
                <button class="btn-outline btn-sm" @click="copyText(selectedEvent.slug, 'Slug URL')">📋 Copy</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label class="form-label">📅 Tanggal</label>
              <div class="value" style="font-weight:400;">{{ formatDate(selectedEvent.tanggal_mulai) }}</div>
            </div>
            <div class="col">
              <label class="form-label">📍 Lokasi</label>
              <div class="value" style="font-weight:400;">{{ selectedEvent.lokasi || 'Online / Belum diset' }}</div>
            </div>
          </div>
          <div>
            <label class="form-label">Deskripsi</label>
            <div class="desc">{{ selectedEvent.deskripsi || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="font-weight:600;color:#0a1929;margin:0;">🎟️ Kategori Tiket</h4>
        <button class="btn-icon" style="background:#f0f4fa; font-size: 13px; padding: 6px 12px;" @click="activeTab = 'tiket'" title="Edit Tiket">✏️ Edit</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Harga</th><th>Kuota</th><th>Terjual</th><th>Sisa</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-if="isLoadingDaftarTiket"><td colspan="6" style="text-align:center; color:#8a9aa8;">⏳ Memuat data tiket...</td></tr>
            <tr v-else-if="daftarTiket.length === 0"><td colspan="6" style="text-align:center; color:#8a9aa8;">Belum ada tiket.</td></tr>
            <tr v-for="t in daftarTiket" :key="t.id">
              <td>{{ t.nama_kategori }}</td>
              <td>{{ formatRupiah(t.harga) }}</td>
              <td>{{ t.kuota_maksimal }}</td>
              <td>{{ t.terjual }}</td>
              <td>{{ t.kuota_maksimal - t.terjual }}</td>
              <td><button class="btn-icon" @click="activeTab = 'tiket'" title="Edit Tiket">✏️</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="font-weight:600;color:#0a1929;margin:0;">👥 Statistik Peserta</h4>
        <button class="btn-icon" style="background:#f0f4fa; font-size: 13px; padding: 6px 12px;" @click="activeTab = 'peserta'" title="Lihat Peserta">Lihat ➡️</button>
      </div>
      <div class="stats-grid" style="margin:0;">
        <div class="stat-card"><div class="label">Total</div><div class="value">{{ totalPeserta }}</div></div>
        <div class="stat-card"><div class="label">Lunas</div><div class="value">{{ totalLunas }}</div></div>
        <div class="stat-card"><div class="label">Pending</div><div class="value">{{ totalPending }}</div></div>
        <div class="stat-card"><div class="label">Hadir</div><div class="value">{{ totalHadir }} <span style="font-size:14px; font-weight:normal; color:#8a9aa8;">({{ persenHadir }}%)</span></div></div>
      </div>
    </div>

    <div class="panel flex" style="justify-content:space-between; align-items:flex-start;">
      <div style="flex:1;">
        <label class="form-label">🔗 Link Pendaftaran & Akses</label>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:6px;">
          
          <div style="font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#4a5a6e; width:90px;">🎟️ Event:</span>
            <span style="background:#f0f4fa; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; color:#1a4a7a; flex: 1; min-width: 200px;">{{ baseUrl }}/{{ selectedEvent.slug }}</span>
            <button class="btn-outline btn-sm" @click="copyText(`${baseUrl}/${selectedEvent.slug}`, 'Link Pendaftaran')">📋 Salin</button>
            <button class="btn-primary btn-sm" style="padding:4px 10px;" @click="kirimWaVolunteer(`${baseUrl}/${selectedEvent.slug}`)">🚀 Kirim</button>
          </div>

          <div v-if="selectedEvent.sistem_checkin === 'scanner' || !selectedEvent.sistem_checkin" style="font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#4a5a6e; width:90px;">📲 Scanner:</span>
            <span style="background:#e4f0e8; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; color:#1a6a4a; flex: 1; min-width: 200px;">{{ baseUrl }}/scanner?event={{ selectedEvent.slug }}</span>
            <button class="btn-outline btn-sm" @click="copyText(`${baseUrl}/scanner?event=${selectedEvent.slug}`, 'Link Scanner')">📋 Salin</button>
            <button class="btn-primary btn-sm" style="padding:4px 10px;" @click="kirimWaVolunteer(`${baseUrl}/scanner?event=${selectedEvent.slug}`)">🚀 Kirim</button>
          </div>

          <div v-if="selectedEvent.sistem_checkin === 'portal'" style="font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#4a5a6e; width:90px;">🖥️ Absen:</span>
            <span style="background:#fdf0e4; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; color:#b8681a; flex: 1; min-width: 200px;">{{ baseUrl }}/absen/{{ selectedEvent.slug }}</span>
            <button class="btn-outline btn-sm" @click="copyText(`${baseUrl}/absen/${selectedEvent.slug}`, 'Link Absen')">📋 Salin</button>
            <button class="btn-primary btn-sm" style="padding:4px 10px;" @click="kirimWaVolunteer(`${baseUrl}/absen/${selectedEvent.slug}`)">🚀 Kirim</button>
          </div>

        </div>
      </div>
      <div class="flex" style="flex-direction:column; gap:10px; align-items:flex-end;">
        <button class="btn-primary" @click="activeTab = 'edit'">✏️ Edit Event</button>
        <button class="btn-outline" :class="{ 'danger': !isArchived }" @click="toggleArsip">
          {{ isArchived ? '📤 Batal Arsip' : '📦 Arsipkan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { selectedEvent, activeTab, formatDate, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, showToast, showConfirm, supabase, muatDaftarEvent, currentUser } = useAdmin()

const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
const isArchived = computed(() => selectedEvent.value && (selectedEvent.value.status === 'archived' || selectedEvent.value.is_archived))

const daftarTiket = ref([])
const isLoadingDaftarTiket = ref(false)

const formatRupiah = (angka) => {
  if (angka === 0) return 'GRATIS'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const muatTiketStatistik = async () => {
  if (!selectedEvent.value) return
  isLoadingDaftarTiket.value = true
  try {
    const { data, error } = await supabase.from('kategori_tiket').select('*').eq('event_id', selectedEvent.value.id)
    if (error) throw error
    
    const { data: peserta } = await supabase.from('peserta').select('nama_tiket').eq('event_id', selectedEvent.value.id).eq('status_bayar', 'lunas')
    
    daftarTiket.value = (data || []).map(t => {
      const terjual = (peserta || []).filter(p => p.nama_tiket === t.nama_kategori).length
      return { ...t, terjual }
    })
  } catch (err) {
    showToast('Gagal memuat tiket: ' + err.message, 'error')
  } finally {
    isLoadingDaftarTiket.value = false
  }
}

watch(selectedEvent, () => {
  if (selectedEvent.value) muatTiketStatistik()
}, { immediate: true })

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast(label + ' berhasil disalin!', 'success')
  } catch (err) {
    showToast('Gagal menyalin: ' + err, 'error')
  }
}

const kirimWaVolunteer = (linkText) => {
  const message = `Halo Volunteer! 🚀\n\nBerikut adalah link akses untuk tugas event kita:\n${linkText}\n\nMohon dijaga kerahasiaan link ini ya. Semangat!`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank')
  showToast('Membuka WhatsApp...', 'success')
}

const toggleArsip = () => {
  const newIsArchived = !isArchived.value
  const title = newIsArchived ? 'Arsipkan Event' : 'Buka Arsip'
  const msg = newIsArchived ? 'Event akan disembunyikan dari halaman utama. Lanjutkan?' : 'Event akan dimunculkan kembali ke halaman utama. Lanjutkan?'
  const btn = newIsArchived ? 'Ya, Arsipkan' : 'Ya, Kembalikan'
  
  showConfirm(title, msg, btn, newIsArchived ? 'danger' : 'success', async () => {
    try {
      const { error } = await supabase.from('event').update({ is_archived: newIsArchived }).eq('id', selectedEvent.value.id)
      if (error) throw error
      showToast(newIsArchived ? 'Event berhasil diarsipkan!' : 'Event dikembalikan dari arsip!', 'success')
      await muatDaftarEvent(currentUser.value.id)
      selectedEvent.value.is_archived = newIsArchived
    } catch (err) {
      showToast('Gagal mengubah status: ' + err.message, 'error')
    }
  })
}
</script>
