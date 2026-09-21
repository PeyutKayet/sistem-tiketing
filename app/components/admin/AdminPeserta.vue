<template>
  <div id="page-peserta" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title">👥 Peserta <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="activeTab = 'event'">🔙 Kembali ke Event</button>
    </div>

    <div class="stats-grid" style="margin:0 0 18px 0;">
      <div class="stat-card"><div class="label">Total</div><div class="value">{{ totalPeserta }}</div></div>
      <div class="stat-card"><div class="label">Lunas</div><div class="value">{{ totalLunas }}</div></div>
      <div class="stat-card"><div class="label">Pending</div><div class="value">{{ totalPending }}</div></div>
      <div class="stat-card"><div class="label">Hadir</div><div class="value">{{ totalHadir }} <span style="font-size: 14px; font-weight: normal; color: #8a9aa8;">({{ persenHadir }}%)</span></div></div>
    </div>

    <div class="flex" style="margin-bottom:14px;flex-wrap:wrap;">
      <input type="text" v-model="searchQuery" placeholder="🔍 Cari Nama / Email / WA" class="filter-control" style="flex:1;min-width:180px;" />
      <select v-model="filterStatus" class="filter-control">
        <option value="semua">Semua Status</option>
        <option value="lunas">Lunas</option>
        <option value="pending">Pending</option>
      </select>
      <select v-model="filterHadir" class="filter-control">
        <option value="semua">Semua Kehadiran</option>
        <option value="hadir">Hadir</option>
        <option value="belum">Belum</option>
      </select>
      <button class="btn-success" @click="downloadCSVPeserta">📥 Download CSV</button>
    </div>

    <div class="table-wrap">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; min-width: 600px;">
        <thead style="background: #f7faff; border-bottom: 1px solid #e6edf5; text-align: left;">
          <tr>
            <th style="padding: 14px 20px;">Nama</th>
            <th style="padding: 14px 20px;">Email & WA</th>
            <th style="padding: 14px 20px;">Tiket</th>
            <th style="padding: 14px 20px;">Status</th>
            <th style="padding: 14px 20px;">Bukti</th>
            <th style="padding: 14px 20px;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoadingPeserta">
            <td colspan="6" style="padding: 20px;">
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div class="skeleton" style="height:40px; width:100%; border-radius:8px;"></div>
                <div class="skeleton" style="height:40px; width:100%; border-radius:8px;"></div>
                <div class="skeleton" style="height:40px; width:100%; border-radius:8px;"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredPeserta.length === 0">
            <td colspan="6" style="text-align: center; padding: 30px; color: #8a9aa8;">Tidak ada data peserta yang cocok.</td>
          </tr>
          <tr v-for="p in filteredPeserta" :key="p.id" style="border-bottom: 1px solid #f0f4fa;">
            <td style="padding: 14px 20px; font-weight: 500;">{{ p.nama_lengkap }}</td>
            <td style="padding: 14px 20px;">{{ p.email }}<br><small style="color: #8a9aa8;">{{ p.no_wa }}</small></td>
            <td style="padding: 14px 20px;">{{ p.nama_tiket }}</td>
            <td style="padding: 14px 20px;">
              <span v-if="p.status_bayar === 'lunas'" class="status-badge active" style="margin:0;">Lunas</span>
              <span v-else class="status-badge off" style="margin:0; background: #fdf0e4; color: #b8681a;">Pending</span>
            </td>
            <td style="padding: 14px 20px;">
              <a v-if="p.bukti_bayar_url && p.bukti_bayar_url !== 'Tidak ada file' && p.bukti_bayar_url.startsWith('http')" :href="p.bukti_bayar_url" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">Lihat</a>
              <span v-else>-</span>
            </td>
            <td style="padding: 14px 20px; display: flex; gap: 8px;">
              <button v-if="p.status_bayar === 'pending'" @click="setLunas(p.id)" class="btn-primary btn-sm" style="padding: 6px 12px; font-size: 12px;">✅ Set Lunas</button>
              <button v-if="p.status_bayar === 'lunas' && !p.status_hadir" @click="setHadir(p.id)" class="btn-success btn-sm" style="padding: 6px 12px; font-size: 12px;">📍 Check-in</button>
              <span v-if="p.status_hadir" style="color: #1a6a4a; font-weight: bold; font-size: 12px;">Hadir ✔️</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="infoDataPeserta" class="flex" style="justify-content:space-between;margin-top:14px;flex-wrap:wrap;">
      <span class="text-muted">Menampilkan {{ filteredPeserta.length }} peserta</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { 
  selectedEvent, activeTab, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, 
  isLoadingPeserta, daftarPeserta, supabase, muatDaftarPeserta, showConfirm, showToast
} = useAdmin()

const searchQuery = ref('')
const filterStatus = ref('semua')
const filterHadir = ref('semua')

const filteredPeserta = computed(() => {
  return daftarPeserta.value.filter(p => {
    let lolosSearch = true
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const str = `${p.nama_lengkap || ''} ${p.email || ''} ${p.no_wa || ''}`.toLowerCase()
      lolosSearch = str.includes(q)
    }
    
    let lolosStatus = true
    if (filterStatus.value !== 'semua') lolosStatus = p.status_bayar === filterStatus.value

    let lolosHadir = true
    if (filterHadir.value === 'hadir') lolosHadir = p.status_hadir === true
    else if (filterHadir.value === 'belum') lolosHadir = !p.status_hadir

    return lolosSearch && lolosStatus && lolosHadir
  })
})

const downloadCSVPeserta = () => {
  if (daftarPeserta.value.length === 0) {
    showToast('Tidak ada data peserta untuk diunduh.', 'warning')
    return
  }
  let csvContent = "data:text/csv;charset=utf-8,Nama Lengkap,Email,WhatsApp,Tiket,Status Bayar,Status Hadir\n"
  daftarPeserta.value.forEach(p => {
    const nama = (p.nama_lengkap || '').replace(/,/g, ' ')
    const email = (p.email || '').replace(/,/g, ' ')
    const wa = (p.no_wa || '').replace(/,/g, ' ')
    const tiket = (p.nama_tiket || 'Tiket').replace(/,/g, ' ')
    const statusBayar = p.status_bayar || 'pending'
    const hadir = p.status_hadir ? 'Hadir' : 'Belum'
    csvContent += `${nama},${email},${wa},${tiket},${statusBayar},${hadir}\n`
  })
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `Data_Peserta_${selectedEvent.value.nama_event.replace(/ /g, '_')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('File CSV berhasil diunduh!', 'success')
}

const setLunas = (id) => {
  showConfirm('Ubah Status', 'Yakin ingin ubah status peserta ini menjadi LUNAS?', 'Ya, Lunas', 'success', async () => {
    try {
      const { error } = await supabase.from('peserta').update({ status_bayar: 'lunas' }).eq('id', id)
      if (error) throw error
      showToast('Status berhasil diubah menjadi Lunas!', 'success')
      await muatDaftarPeserta()
    } catch (err) { showToast('Gagal update status: ' + err.message, 'error') }
  })
}

const setHadir = (id) => {
  showConfirm('Check-in Peserta', 'Verifikasi kehadiran: Proses Check-in peserta ini?', 'Ya, Check-in', 'success', async () => {
    try {
      const { error } = await supabase.from('peserta').update({ status_hadir: true }).eq('id', id)
      if (error) throw error
      showToast('Check-in berhasil!', 'success')
      await muatDaftarPeserta()
    } catch (err) { showToast('Gagal check-in: ' + err.message, 'error') }
  })
}
</script>
