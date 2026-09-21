<template>
<div>
  <div id="page-event" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title"><Icon name="lucide:clipboard-list" style="margin-right:4px;" /> <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="useRouter().push('/admin')"><Icon name="lucide:arrow-left" style="margin-right:4px;" /> Kembali</button>
    </div>

    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h4 style="font-weight:600;color:#0a1929;margin:0;"><Icon name="lucide:edit-3" style="margin-right:4px;" /> Informasi Acara</h4>
        <button class="btn-icon" style="background:#f0f4fa; font-size: 13px; padding: 6px 12px;" @click="useRouter().push('/admin/event/' + selectedEvent.slug + '/edit')" title="Edit Informasi"><Icon name="lucide:edit" style="margin-right:4px;" /> Edit</button>
      </div>
      <div class="row">
        <div class="col" style="flex:0 0 150px;">
          <div class="poster-lg" :style="{ backgroundImage: selectedEvent.poster_url ? `url('${selectedEvent.poster_url}')` : 'none' }">{{ selectedEvent.poster_url ? '' : '<Icon name="lucide:rocket" />' }}</div>
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
                <button class="btn-outline btn-sm" @click="copyText(selectedEvent.slug, 'Slug URL')"><Icon name="lucide:clipboard-list" style="margin-right:4px;" /> Copy</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label class="form-label"><Icon name="lucide:calendar" style="margin-right:4px;" /> Tanggal</label>
              <div class="value" style="font-weight:400;">{{ formatDate(selectedEvent.tanggal_mulai) }}</div>
            </div>
            <div class="col">
              <label class="form-label"><Icon name="lucide:map-pin" style="margin-right:4px;" /> Lokasi</label>
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
        <h4 style="font-weight:600;color:#0a1929;margin:0;"><Icon name="lucide:ticket" style="margin-right:4px;" /> Kategori Tiket</h4>
        <button class="btn-icon" style="background:#f0f4fa; font-size: 13px; padding: 6px 12px;" @click="useRouter().push('/admin/event/' + selectedEvent.slug + '/tiket')" title="Edit Tiket"><Icon name="lucide:edit" style="margin-right:4px;" /> Edit</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Harga</th><th>Kuota</th><th>Terjual</th><th>Sisa</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-if="isLoadingDaftarTiket"><td colspan="6" style="text-align:center; color:#8a9aa8;"><Icon name="lucide:hourglass" style="margin-right:4px;" /> Memuat data tiket...</td></tr>
            <tr v-else-if="daftarTiket.length === 0"><td colspan="6" style="text-align:center; color:#8a9aa8;">Belum ada tiket.</td></tr>
            <tr v-for="t in daftarTiket" :key="t.id">
              <td>{{ t.nama_kategori }}</td>
              <td>{{ formatRupiah(t.harga) }}</td>
              <td>{{ t.kuota_maksimal }}</td>
              <td>{{ t.terjual }}</td>
              <td>{{ t.kuota_maksimal - t.terjual }}</td>
              <td><button class="btn-icon" @click="useRouter().push('/admin/event/' + selectedEvent.slug + '/tiket')" title="Edit Tiket"><Icon name="lucide:edit" style="margin-right:4px;" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="font-weight:600;color:#0a1929;margin:0;"><Icon name="lucide:users" style="margin-right:4px;" /> Statistik Peserta</h4>
        <button class="btn-icon" style="background:#f0f4fa; font-size: 13px; padding: 6px 12px;" @click="useRouter().push('/admin/event/' + selectedEvent.slug + '/peserta')" title="Lihat Peserta">Lihat <Icon name="lucide:arrow-right" style="margin-left:4px;" /></button>
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
        <label class="form-label"><Icon name="lucide:link" style="margin-right:4px;" /> Link Pendaftaran & Akses</label>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:6px;">
          
          <div style="font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#4a5a6e; width:90px;"><Icon name="lucide:ticket" style="margin-right:4px;" /> Event:</span>
            <span style="background:#f0f4fa; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; color:#1a4a7a; flex: 1; min-width: 200px;">{{ baseUrl }}/{{ selectedEvent.slug }}</span>
            <button class="btn-outline btn-sm" @click="copyText(`${baseUrl}/${selectedEvent.slug}`, 'Link Pendaftaran')"><Icon name="lucide:clipboard-list" style="margin-right:4px;" /> Salin</button>
            <button class="btn-primary btn-sm" style="padding:4px 10px;" @click="kirimWaVolunteer(`${baseUrl}/${selectedEvent.slug}`)"><Icon name="lucide:send" style="margin-right:4px;" /> Kirim</button>
          </div>

          <div v-if="selectedEvent.sistem_checkin === 'scanner' || !selectedEvent.sistem_checkin" style="font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#4a5a6e; width:90px;"><Icon name="lucide:smartphone" style="margin-right:4px;" /> Scanner:</span>
            <span style="background:#e4f0e8; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; color:#1a6a4a; flex: 1; min-width: 200px;">{{ baseUrl }}/scanner?event={{ selectedEvent.slug }}</span>
            <button class="btn-outline btn-sm" @click="copyText(`${baseUrl}/scanner?event=${selectedEvent.slug}`, 'Link Scanner')"><Icon name="lucide:clipboard-list" style="margin-right:4px;" /> Salin</button>
            <button class="btn-primary btn-sm" style="padding:4px 10px;" @click="kirimWaVolunteer(`${baseUrl}/scanner?event=${selectedEvent.slug}`)"><Icon name="lucide:send" style="margin-right:4px;" /> Kirim</button>
          </div>

          <div v-if="selectedEvent.sistem_checkin === 'portal'" style="font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#4a5a6e; width:90px;"><Icon name="lucide:monitor" style="margin-right:4px;" /> Absen:</span>
            <span style="background:#fdf0e4; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; color:#b8681a; flex: 1; min-width: 200px;">{{ baseUrl }}/absen/{{ selectedEvent.slug }}</span>
            <button class="btn-outline btn-sm" @click="copyText(`${baseUrl}/absen/${selectedEvent.slug}`, 'Link Absen')"><Icon name="lucide:clipboard-list" style="margin-right:4px;" /> Salin</button>
            <button class="btn-primary btn-sm" style="padding:4px 10px;" @click="kirimWaVolunteer(`${baseUrl}/absen/${selectedEvent.slug}`)"><Icon name="lucide:send" style="margin-right:4px;" /> Kirim</button>
          </div>

        </div>
      </div>
      <div class="flex" style="flex-direction:column; gap:10px; align-items:flex-end;">
        <button class="btn-primary" @click="useRouter().push('/admin/event/' + selectedEvent.slug + '/edit')"><Icon name="lucide:edit" style="margin-right:4px;" /> Edit Event</button>
        <button class="btn-outline" :class="{ 'danger': !isArchived }" @click="toggleArsip">
          <template v-if="isArchived">
            <Icon name="lucide:archive-restore" style="margin-right:4px;" /> Batal Arsip
          </template>
          <template v-else>
            <Icon name="lucide:archive" style="margin-right:4px;" /> Arsipkan
          </template>
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="loader-container" style="height: 100%; display: flex; align-items: center; justify-content: center;">
    <div style="text-align: center;">
      <div class="spinner" style="margin: 0 auto 12px auto;"></div>
      <div style="font-weight:500; font-size:13px; color:#8a9aa8;">Memuat data event...</div>
    </div>
  </div>
  <div v-else style="padding: 60px 20px; text-align: center; color: #8a9aa8;">
    <Icon name="lucide:file-question" style="font-size:48px; color:#c8d6e8; margin-bottom:12px; display:block; margin-inline:auto;" />
    <div style="font-size:16px; font-weight:600; color:#0a1929; margin-bottom:8px;">Event Tidak Ditemukan</div>
    Event yang Anda cari mungkin sudah dihapus atau URL tidak valid.<br/><br/>
    <button class="btn-primary" @click="useRouter().push('/admin')">Kembali ke Beranda</button>
  </div>
</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { isLoading, selectedEvent, activeTab, formatDate, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, showToast, showConfirm, supabase, muatDaftarEvent, currentUser } = useAdmin()

const baseUrl = ref('')
onMounted(() => {
  baseUrl.value = window.location.origin
})
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
  const message = `Halo Volunteer! <Icon name="lucide:rocket" />\n\nBerikut adalah link akses untuk tugas event kita:\n${linkText}\n\nMohon dijaga kerahasiaan link ini ya. Semangat!`
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
