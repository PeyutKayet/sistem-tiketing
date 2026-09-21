<template>
  <div v-if="selectedEvent">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
      <h2 style="font-size: 22px; font-weight: 600; margin: 0;">📋 {{ selectedEvent.nama_event }}</h2>
      <button class="btn-outline" @click="activeTab = 'home'">🔙 Kembali</button>
    </div>

    <div style="display: flex; gap: 28px; flex-wrap: wrap;">
      <!-- PANEL KIRI: INFO & PINTASAN -->
      <div style="flex: 1.2; min-width: 280px;">
        <div style="background: #fff; border-radius: 18px; border: 1px solid #e6edf5; padding: 24px; margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
            <h4 style="font-weight:600; margin:0;">📝 Informasi Acara</h4>
            <button class="btn-outline" style="padding: 4px 12px;" @click="activeTab = 'edit'">✏️ Edit</button>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="font-size: 12px; color: #8a9aa8; display: block; margin-bottom: 4px;">Status</label>
              <span class="status-badge active" style="margin:0;">● Aktif</span>
            </div>
            <div>
              <label style="font-size: 12px; color: #8a9aa8; display: block; margin-bottom: 4px;">Slug URL</label>
              <div style="font-size: 14px; font-weight: 500;">/{{ selectedEvent.slug }}</div>
            </div>
            <div>
              <label style="font-size: 12px; color: #8a9aa8; display: block; margin-bottom: 4px;">Tanggal</label>
              <div style="font-size: 14px; font-weight: 500;">{{ formatDate(selectedEvent.tanggal_mulai) }}</div>
            </div>
            <div>
              <label style="font-size: 12px; color: #8a9aa8; display: block; margin-bottom: 4px;">Lokasi</label>
              <div style="font-size: 14px; font-weight: 500;">{{ selectedEvent.lokasi || 'Menyusul' }}</div>
            </div>
          </div>

          <div>
            <label style="font-size: 12px; color: #8a9aa8; display: block; margin-bottom: 4px;">Deskripsi</label>
            <p style="font-size: 14px; color: #4a5a6e; line-height: 1.5; margin: 0;">{{ selectedEvent.deskripsi || '-' }}</p>
          </div>
        </div>

        <!-- PINTASAN MENU KELOLA -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: #fff; border-radius: 18px; border: 1px solid #e6edf5; padding: 20px; text-align: center; cursor: pointer; transition: 0.2s;" @click="activeTab = 'tiket'">
            <div style="font-size: 24px; margin-bottom: 8px;">🎟️</div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px;">Kelola Tiket</h4>
            <p style="margin: 0; font-size: 12px; color: #8a9aa8;">Atur harga & kuota</p>
          </div>
          <div style="background: #fff; border-radius: 18px; border: 1px solid #e6edf5; padding: 20px; text-align: center; cursor: pointer; transition: 0.2s;" @click="activeTab = 'peserta'">
            <div style="font-size: 24px; margin-bottom: 8px;">👥</div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px;">Data Peserta</h4>
            <p style="margin: 0; font-size: 12px; color: #8a9aa8;">Validasi & Check-in</p>
          </div>
        </div>
      </div>

      <!-- PANEL KANAN: LIVE PREVIEW (IFRAME) -->
      <div style="flex: 0 0 320px; display: flex; flex-direction: column; align-items: center;">
        <div style="font-weight:600; font-size:14px; color:#4a5a6e; margin-bottom:12px;">👀 Live Preview Halaman</div>
        <div style="background: #0a1929; border-radius: 36px; padding: 12px; box-shadow: 0 24px 56px -16px rgba(0,0,0,0.4); width: 100%; height: 650px; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: center; margin-bottom: 8px;">
            <div style="width: 60px; height: 6px; background: #1e293b; border-radius: 4px;"></div>
          </div>
          <div style="background: #ffffff; border-radius: 24px; flex: 1; overflow: hidden; position: relative;">
            <iframe 
              :src="`/${selectedEvent.slug}`" 
              style="width: 100%; height: 100%; border: none;"
              title="Live Preview"
            ></iframe>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 10px;">
            <div style="width: 100px; height: 4px; background: #1e293b; border-radius: 2px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { selectedEvent, activeTab, formatDate } = useAdmin()
</script>
