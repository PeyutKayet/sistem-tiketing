<template>
  <div v-if="selectedEvent">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
      <h2 style="font-size: 22px; font-weight: 600; margin: 0;">👥 Peserta - {{ selectedEvent.nama_event }}</h2>
      <button class="btn-outline" @click="activeTab = 'event'">🔙 Kembali ke Event</button>
    </div>

    <div class="stats-grid" style="margin-bottom: 18px;">
      <div class="stat-card"><div class="label">Total</div><div class="value">{{ totalPeserta }}</div></div>
      <div class="stat-card"><div class="label">Lunas</div><div class="value">{{ totalLunas }}</div></div>
      <div class="stat-card"><div class="label">Pending</div><div class="value">{{ totalPending }}</div></div>
      <div class="stat-card"><div class="label">Hadir</div><div class="value">{{ totalHadir }} <span style="font-size: 14px; font-weight: normal; color: #8a9aa8;">({{ persenHadir }}%)</span></div></div>
    </div>

    <div style="background: #fff; border-radius: 18px; border: 1px solid #e6edf5; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
      <div v-if="isLoadingPeserta" style="padding: 40px; text-align: center; color: #8a9aa8;">Memuat data peserta...</div>
      
      <div v-else style="overflow-x: auto;">
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
            <tr v-if="daftarPeserta.length === 0">
              <td colspan="6" style="text-align: center; padding: 30px; color: #8a9aa8;">Belum ada peserta yang mendaftar.</td>
            </tr>
            <tr v-for="p in daftarPeserta" :key="p.id" style="border-bottom: 1px solid #f0f4fa;">
              <td style="padding: 14px 20px; font-weight: 500;">{{ p.nama_lengkap }}</td>
              <td style="padding: 14px 20px;">{{ p.email }}<br><small style="color: #8a9aa8;">{{ p.no_wa }}</small></td>
              <td style="padding: 14px 20px;">{{ p.nama_tiket }}</td>
              <td style="padding: 14px 20px;">
                <span v-if="p.status_bayar === 'lunas'" class="status-badge active" style="margin:0;">Lunas</span>
                <span v-else class="status-badge off" style="margin:0; background: #fdf0e4; color: #b8681a;">Pending</span>
              </td>
              <td style="padding: 14px 20px;">
                <a v-if="p.bukti_bayar_url" :href="p.bukti_bayar_url" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">Lihat</a>
                <span v-else>-</span>
              </td>
              <td style="padding: 14px 20px; display: flex; gap: 8px;">
                <button v-if="p.status_bayar === 'pending'" @click="setLunas(p.id)" style="padding: 6px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">✅ Set Lunas</button>
                <button v-if="p.status_bayar === 'lunas' && !p.status_hadir" @click="setHadir(p.id)" style="padding: 6px 12px; background: #1a6a4a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">📍 Check-in</button>
                <span v-if="p.status_hadir" style="color: #1a6a4a; font-weight: bold; font-size: 12px;">Hadir ✔️</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { 
  selectedEvent, activeTab, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, 
  isLoadingPeserta, daftarPeserta, supabase, muatDaftarPeserta
} = useAdmin()

const setLunas = async (id) => {
  if (!confirm('Yakin ingin menandai peserta ini sudah LUNAS?')) return
  try {
    const { error } = await supabase.from('peserta').update({ status_bayar: 'lunas' }).eq('id', id)
    if (error) throw error
    await muatDaftarPeserta()
  } catch (err) { alert('Gagal update status: ' + err.message) }
}

const setHadir = async (id) => {
  if (!confirm('Proses Check-in untuk peserta ini?')) return
  try {
    const { error } = await supabase.from('peserta').update({ status_hadir: true }).eq('id', id)
    if (error) throw error
    await muatDaftarPeserta()
  } catch (err) { alert('Gagal check-in: ' + err.message) }
}
</script>
