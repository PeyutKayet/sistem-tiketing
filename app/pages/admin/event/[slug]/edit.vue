<template>
<div>
  <div id="page-edit" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title"><Icon name="lucide:edit" style="margin-right:4px;" /> Edit <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="useRouter().push('/admin/event/' + selectedEvent.slug)"><Icon name="lucide:arrow-left" style="margin-right:4px;" /> Kembali</button>
    </div>

    <div style="display:flex;gap:28px;flex-wrap:wrap;">
      <!-- FORM KIRI -->
      <div style="flex:1.2;min-width:280px;">
        <div class="panel">
          <div class="mb-3">
            <label class="form-label"><Icon name="lucide:image" style="margin-right:4px;" /> Upload Poster Event</label>
            <input type="file" accept="image/*" class="form-file" @change="handlePosterUpload" style="background:#f7faff; padding:10px; border-radius:12px; border:1px dashed #bcc8d8;" />
          </div>

          <div class="row mb-3">
            <div class="col">
              <label class="form-label">Nama Acara</label>
              <input type="text" v-model="formEditEvent.nama" class="form-control" />
            </div>
            <div class="col">
              <label class="form-label">Slug</label>
              <div style="display:flex;gap:8px;">
                <input type="text" v-model="formEditEvent.slug" class="form-control" @input="formEditEvent.slug = formEditEvent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')" />
                <button class="btn-outline btn-sm">📋</button>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label class="form-label">Tanggal</label>
              <input type="date" v-model="formEditEvent.tanggal" class="form-control" />
            </div>
            <div class="col">
              <label class="form-label">Lokasi</label>
              <input type="text" v-model="formEditEvent.lokasi" class="form-control" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Deskripsi</label>
            <textarea rows="2" v-model="formEditEvent.deskripsi" class="form-control"></textarea>
          </div>
        </div>

        <!-- METODE PELAKSANAAN & CHECK-IN -->
        <div class="panel">
          <h4 style="margin-bottom:12px;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;">
            <Icon name="lucide:map-pin" style="font-size:16px;color:var(--primary);" /> Format Acara & Absensi
          </h4>
          
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <label :style="{ flex: 1, border: '1px solid', borderColor: formEditEvent.tipe_event === 'offline' ? 'var(--primary)' : '#e2e8f0', background: formEditEvent.tipe_event === 'offline' ? '#eff6ff' : 'white', borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }">
              <input type="radio" v-model="formEditEvent.tipe_event" value="offline" style="display:none;" />
              <Icon name="lucide:building" :style="{ fontSize: '24px', color: formEditEvent.tipe_event === 'offline' ? 'var(--primary)' : '#94a3b8', marginBottom: '4px' }" />
              <div :style="{ fontSize: '0.8rem', fontWeight: 700, color: formEditEvent.tipe_event === 'offline' ? 'var(--primary)' : '#475569' }">Di Lokasi (Offline)</div>
            </label>
            <label :style="{ flex: 1, border: '1px solid', borderColor: formEditEvent.tipe_event === 'online' ? 'var(--primary)' : '#e2e8f0', background: formEditEvent.tipe_event === 'online' ? '#eff6ff' : 'white', borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }">
              <input type="radio" v-model="formEditEvent.tipe_event" value="online" style="display:none;" />
              <Icon name="lucide:monitor-play" :style="{ fontSize: '24px', color: formEditEvent.tipe_event === 'online' ? 'var(--primary)' : '#94a3b8', marginBottom: '4px' }" />
              <div :style="{ fontSize: '0.8rem', fontWeight: 700, color: formEditEvent.tipe_event === 'online' ? 'var(--primary)' : '#475569' }">Virtual (Online)</div>
            </label>
            <label :style="{ flex: 1, border: '1px solid', borderColor: formEditEvent.tipe_event === 'hybrid' ? 'var(--primary)' : '#e2e8f0', background: formEditEvent.tipe_event === 'hybrid' ? '#eff6ff' : 'white', borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }">
              <input type="radio" v-model="formEditEvent.tipe_event" value="hybrid" style="display:none;" />
              <Icon name="lucide:refresh-cw" :style="{ fontSize: '24px', color: formEditEvent.tipe_event === 'hybrid' ? 'var(--primary)' : '#94a3b8', marginBottom: '4px' }" />
              <div :style="{ fontSize: '0.8rem', fontWeight: 700, color: formEditEvent.tipe_event === 'hybrid' ? 'var(--primary)' : '#475569' }">Hybrid</div>
            </label>
          </div>

          <!-- PENGATURAN OFFLINE -->
          <div v-if="formEditEvent.tipe_event === 'offline' || formEditEvent.tipe_event === 'hybrid'" style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
             <label class="checkbox-item mb-0" style="font-weight: 600;">
               <input type="checkbox" v-model="formEditEvent.is_qr_active" /> <span style="font-size: 0.85rem;">Wajibkan Scan QR Code (Bagi Peserta Di Lokasi)</span>
             </label>
             <div v-if="formEditEvent.is_qr_active" style="margin-left: 24px; margin-top: 10px;">
               <label class="form-label" style="font-size: 0.75rem;">Frekuensi Scan</label>
               <div style="display: flex; gap: 8px;">
                 <select v-model="formEditEvent.sistem_checkin" class="form-control" style="font-size: 0.8rem; padding: 8px;">
                   <option value="scanner">1x Scan Langsung Hangus (Event Biasa)</option>
                   <option value="none">Bebas Scan Berkali-kali (Akses Keluar-Masuk / Bazar)</option>
                   <option value="portal">Scan Dibatasi Kuota Hari (Training / Bootcamp)</option>
                 </select>
                 <input v-if="formEditEvent.sistem_checkin === 'portal'" type="number" v-model="formEditEvent.target_absen" class="form-control" placeholder="Jml hari: 3" style="font-size: 0.8rem; padding: 8px; width: 120px;" />
               </div>
             </div>
          </div>

          <!-- PENGATURAN ONLINE -->
          <div v-if="formEditEvent.tipe_event === 'online' || formEditEvent.tipe_event === 'hybrid'" style="background: #eff6ff; padding: 12px; border-radius: 8px; border: 1px dashed #93c5fd;">
             <label class="checkbox-item mb-0" style="font-weight: 600;">
               <input type="checkbox" v-model="formEditEvent.is_online_absen_active" /> <span style="font-size: 0.85rem; color: #1e40af;">Catat Kehadiran via Portal Absensi (Untuk Peserta Virtual)</span>
             </label>
             <div v-if="formEditEvent.is_online_absen_active" style="margin-left: 24px; margin-top: 10px;">
               <label class="form-label" style="font-size: 0.75rem; color: #1e40af;">Bagikan link ini saat acara berlangsung:</label>
               <input type="text" readonly :value="'https://e-tiket.web.id/absen/' + formEditEvent.slug" class="form-control" style="background: white; font-size: 0.8rem; padding: 8px; color: #1d4ed8; font-weight: 600;" />
               <small style="font-size: 10px; color: #3b82f6; margin-top: 4px; display: block;">Peserta klik link ini > masukkan Email/WA > Absen sukses!</small>
             </div>
          </div>
        </div>

        <!-- FITUR TAMBAHAN PASCADAFTAR -->
        <div class="panel">
          <h4 style="margin-bottom:12px;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;">
            <Icon name="lucide:plug" style="font-size:16px;color:var(--primary);" /> Fitur Tambahan Pendaftaran
          </h4>
          
          <label class="checkbox-item mb-0" style="font-weight: 600;">
            <input type="checkbox" v-model="formEditEvent.is_grup_wa_active" /> <span style="font-size: 0.85rem;">Arahkan Peserta ke Grup Komunitas (WA/Telegram)</span>
          </label>
          <div v-if="formEditEvent.is_grup_wa_active" style="margin-left: 24px; margin-top: 8px; margin-bottom: 12px;">
            <input type="url" v-model="formEditEvent.link_grup_wa" placeholder="Masukkan Link Grup (https://chat.whatsapp...)" class="form-control" style="font-size: 0.85rem;" />
          </div>

          <div style="margin-top: 12px; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
            <label class="checkbox-item mb-0" style="font-weight: 600;">
              <input type="checkbox" v-model="formEditEvent.is_snk_active" /> <span style="font-size: 0.85rem;">Wajibkan Persetujuan Syarat & Ketentuan (S&K)</span>
            </label>
            <div v-if="formEditEvent.is_snk_active" style="margin-left: 24px; margin-top: 8px;">
              <textarea v-model="formEditEvent.snk_text" rows="2" class="form-control" placeholder="Ketik S&K di sini..." style="font-size: 0.85rem;"></textarea>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;"><Icon name="lucide:shield-check" style="font-size:16px;color:var(--primary);" /> Anti Calo</h4>
          <label class="checkbox-item mb-1">
            <input type="checkbox" v-model="formEditEvent.is_anti_calo_email" /> 1 Email = 1 Tiket 
            <span class="text-muted" style="font-size:12px;margin-left:4px;">(Peserta tidak bisa daftar berulang dengan email yang sama)</span>
          </label>
          <label class="checkbox-item mb-1">
            <input type="checkbox" v-model="formEditEvent.is_anti_calo_wa" /> 1 WA = 1 Tiket
          </label>
          <label class="checkbox-item mb-1">
            <input type="checkbox" v-model="formEditEvent.is_wa_konfirm" /> Wajib Konfirmasi Nomor WA Aktif (Akan dikirim OTP)
          </label>
        </div>

        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;"><Icon name="lucide:heart-handshake" style="font-size:16px;color:#d43f34;" /> Fitur Donasi / Infaq</h4>
          <div class="mb-3">
            <label class="checkbox-item">
              <input type="checkbox" v-model="formEditEvent.is_donasi_active" /> Aktifkan Form Donasi Saat Pendaftaran
            </label>
          </div>
          
          <div v-if="formEditEvent.is_donasi_active" style="padding-top: 10px; border-top: 1px dashed #e6edf5;">
            <div class="row">
              <div class="col">
                <label class="form-label">Teks Header Donasi</label>
                <input type="text" v-model="formEditEvent.donasi_header" class="form-control" placeholder="Contoh: Infaq Pembangunan Masjid" />
              </div>
              <div class="col">
                <label class="form-label">Pilihan Nominal (Pisahkan dengan koma)</label>
                <input type="text" v-model="formEditEvent.donasi_options" class="form-control" placeholder="Contoh: 10000, 50000, 100000, custom" />
                <span class="text-muted" style="font-size:11px; display:block; margin-top:4px;">Tulis "custom" jika ingin peserta mengisi nominal sendiri.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;"><Icon name="lucide:message-circle" style="font-size:16px;color:#15803d;" /> Grup Komunikasi</h4>
          <div class="mb-3">
            <label class="checkbox-item">
              <input type="checkbox" v-model="formEditEvent.is_grup_wa_active" /> Sediakan Link Grup WhatsApp Peserta
            </label>
          </div>
          <div v-if="formEditEvent.is_grup_wa_active" style="padding-top: 10px; border-top: 1px dashed #e6edf5;">
            <label class="form-label">Link Grup WA</label>
            <input type="url" v-model="formEditEvent.link_grup_wa" class="form-control" placeholder="https://chat.whatsapp.com/..." />
          </div>
        </div>

        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="margin:0;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;"><Icon name="lucide:file-cog" style="font-size:16px;color:var(--primary);" /> Form Pendaftaran (FormForge)</h4>
          </div>
          <AdminFormBuilder />
        </div>

        <button class="btn-primary" @click="simpanEdit" :disabled="isSavingEdit" style="margin-top:14px;width:100%;padding:14px;font-size:15px;">
          {{ isSavingEdit ? '<Icon name="lucide:hourglass" style="margin-right:4px;" /> Menyimpan...' : '💾 Simpan Perubahan' }}
        </button>
      </div>

      <!-- PREVIEW KANAN -->
      <div class="preview-sticky">
        <div style="font-weight:600;font-size:14px;color:#4a5a6e;margin-bottom:10px;letter-spacing:0.2px;"><Icon name="lucide:eye" style="margin-right:4px;" /> Live Preview E-Tiket</div>
        <div style="background: #0a1929; border-radius: 32px; padding: 14px 12px; box-shadow: 0 24px 56px -16px rgba(0, 0, 0, 0.4); height: 580px; display: flex; flex-direction: column;">
          <div class="hide-scrollbar" style="background: #f8fafc; border-radius: 20px; overflow-y: auto; padding: 14px 16px 18px 16px; flex: 1; font-size: 12px; scrollbar-width: none; -ms-overflow-style: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #8a9aa8; padding-bottom: 4px; border-bottom: 1px solid #f0f4fa; margin-bottom: 6px;">
              <span style="font-weight: 600;">12:30</span>
              <span style="display: flex; gap: 4px; align-items: center;">
                <Icon name="lucide:signal" style="font-size: 12px;" />
                <Icon name="lucide:wifi" style="font-size: 12px;" />
                <Icon name="lucide:battery-medium" style="font-size: 14px;" />
              </span>
            </div>
            <div style="display:flex; justify-content:center; margin-bottom:12px;">
              <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:0.5px;"><Icon name="lucide:ticket" style="margin-right:4px;" /> EVENTHUB TICKET</span>
            </div>
            <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); margin-bottom:12px; border:1px solid #e6edf5;">
              <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 12px;">
                <div style="width: 100%; height: 100px; border-radius: 10px; margin-bottom: 8px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; font-size: 28px; color: rgba(255,255,255,0.7); border: 1px solid #e2e8f0;" 
                  :style="posterPreviewUrl ? { backgroundImage: `url('${posterPreviewUrl}')` } : { background: 'linear-gradient(145deg, var(--primary), #3b82f6)' }">
                  <Icon v-if="!posterPreviewUrl" name="lucide:rocket" />
                </div>
                <p style="font-size: 9px; font-weight: 700; letter-spacing: 0.05em; color: var(--accent-main); text-transform: uppercase; margin-bottom: 2px;">
                  Organizer Name
                </p>
                <h1 style="font-size: 16px; font-weight: 800; color: #0a1929; line-height: 1.2; margin: 0; letter-spacing: -0.5px; text-align: center;">
                  {{ formEditEvent.nama || 'Event Baru' }}
                </h1>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px;">
                <div style="background: #f8fafc; padding: 8px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 10px; font-weight: 600; color: #0a1929; text-align: center;">{{ formEditEvent.tanggal || 'Tgl Menyusul' }}</span>
                </div>
                <div style="background: #f8fafc; padding: 8px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 10px; font-weight: 600; color: #0a1929; text-align: center;">{{ formEditEvent.lokasi || 'Lokasi Menyusul' }}</span>
                </div>
              </div>

              <div style="padding: 10px; margin-bottom: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left;">
                <span style="font-size: 9px; font-weight: 700; color: #8a9aa8; letter-spacing: 1px;">DESKRIPSI EVENT</span>
                <p style="font-size: 10px; color: #0a1929; line-height: 1.3; margin-top: 4px; white-space: pre-wrap;">
                  {{ formEditEvent.deskripsi || 'Deskripsi tidak tersedia.' }}
                </p>
                <div style="margin: 8px 0; height: 1px; background: #e2e8f0;"></div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 9px; font-weight: 700; color: #0a1929;">SISA KUOTA</span>
                  <span style="font-size:9px; font-weight:600; color:#8a9aa8;"><b style="color:#0a1929; font-size:11px; font-weight:800;">100</b> / 100</span>
                </div>
                <div style="width: 100%; height: 5px; background: #e2e8f0; border-radius: 10px; overflow: hidden;">
                  <div style="width: 10%; height: 100%; background: var(--accent-main);"></div>
                </div>
              </div>
              
              <button style="width: 100%; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 600; background: var(--primary); color: white; border: none;">
                DAFTAR SEKARANG ➔
              </button>
            </div>
            
            <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); border:1px solid #e6edf5;">
              <div style="font-weight:700; font-size:11px; color:#0a1929; margin-bottom:8px; display:flex; align-items:center; gap:4px;"><Icon name="lucide:file-text" style="font-size:12px;" /> Form Pendaftaran</div>
              <div v-html="hpPreviewHtml"></div>
              <button style="width:100%; padding:9px; background:#1a3a5c; color:white; border:none; border-radius:40px; font-weight:700; font-size:12px; margin-top:10px; box-shadow:0 4px 12px var(--primary-shadow);"><Icon name="lucide:edit-3" style="margin-right:4px;" /> DAFTAR SEKARANG</button>
            </div>
          </div>
        </div>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AdminFormBuilder from '~/components/admin/AdminFormBuilder.vue'

const { isLoading, selectedEvent, formEditEvent, isSavingEdit, activeTab, supabase, showToast, currentUser, muatDaftarEvent, formForgeItems } = useAdmin()

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return ''
  return url.replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
}

const posterFile = ref(null)
const posterPreviewUrl = ref(null)
const hpPreviewHtml = ref('<div style="color:#8a9aa8;font-size:11px;text-align:center;padding:10px 0;">Memuat preview...</div>')

const escapeHtml = (text) => {
  if (!text) return ''
  const div = document.createElement('div'); div.textContent = text; return div.innerHTML 
}

const updatePreviewFromItems = () => {
  let html = `
    <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
      <span style="font-size: 9px; color: #8a9aa8; font-weight: 700;">🎟️ TIKET:</span>
      <span style="font-size: 10px; font-weight: 800; color: var(--accent-main); background: #eff6ff; padding: 4px 8px; border-radius: 6px;">VIP / Reguler</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 8px; width: 100%;">
  `;
  
  const sorted = [...formForgeItems.value].sort((a, b) => a.y - b.y || a.x - b.x);
  
  for (const item of sorted) {
      html += `<div style="grid-column: span ${item.width || 12}; min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: transparent;">`;
      
      if (item.type === 'header') {
          html += `<div style="font-size:11px; font-weight:700; color:#0a1929; margin-top:4px; border-bottom:1px solid #e6edf5; padding-bottom:2px; word-wrap:break-word; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}</div>`;
      } else {
          html += `<label style="font-size:9px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}${item.required ? ' <span style="color:#d43f34">*</span>' : ''}</label>`;
      }
      
      if (item.type === 'header') {} 
      else if (item.type === 'short_text' || item.type === 'phone_wa' || item.type === 'currency_rp') {
          html += `<input type="text" placeholder="${item.field_key === 'nama_lengkap' ? 'Budi Santoso' : item.field_key === 'email' ? 'budi@email.com' : item.type === 'phone_wa' ? '08123456789' : 'Jawaban singkat...'}" style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled/>`
      }
      else if (item.type === 'date' || item.type === 'time') {
          html += `<input type="${item.type}" style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled/>`
      }
      else if (item.type === 'paragraph') {
          html += `<textarea placeholder="Jawaban panjang..." style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; resize:none; box-sizing: border-box; min-height: 40px;" disabled></textarea>`
      }
      else if (item.type === 'dropdown') {
          html += `<select style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled><option value="">Pilih Opsi ▼</option></select>`;
      }
      else if (item.type === 'multiple_choice' || item.type === 'checkboxes') {
          html += `<div style="display:flex; flex-direction:column; gap:6px; font-size:10px; color:#4a5a6e; padding: 4px 0;">`;
          const isCheckbox = item.type === 'checkboxes';
          (item.options || ['Opsi 1']).forEach(o => html += `<label style="display:flex; align-items:center; gap:6px; cursor:default;"><input type="${isCheckbox ? 'checkbox' : 'radio'}" disabled style="margin:0; width:12px; height:12px; accent-color:var(--primary);" /> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(o)}</span></label>`);
          html += `</div>`;
      }
      else if (item.type === 'linear_scale') {
          const maxScale = item.scaleCount || 5;
          html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 8px;">
                     <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:bold; color:#64748b;">
                       <span>1</span>
                       <div style="display:flex; flex:1; justify-content:space-between; padding:0 8px;">`;
          for(let i=1; i<=maxScale; i++) {
              html += `<input type="radio" disabled style="margin:0; width:12px; height:12px; accent-color:var(--primary);" />`;
          }
          html += `    </div>
                       <span>${maxScale}</span>
                     </div>
                   </div>`;
      }
      else if (item.type === 'terms') {
          const termsText = item.termsText || 'Saya menyetujui semua syarat dan ketentuan yang berlaku.';
          html += `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; max-height: 60px; overflow-y: hidden; font-size: 8px; line-height: 1.4; color: #8a9aa8; margin-bottom: 6px; white-space: pre-wrap;">${escapeHtml(termsText)}</div>
          <label style="display:flex; align-items:center; gap:6px; cursor:default; font-size:9px;"><input type="checkbox" disabled style="margin:0; width:12px; height:12px; accent-color:var(--primary);" /> Saya menyetujui</label>`;
      }
      else if (item.type === 'file_upload') {
          html += `<div style="border:1px dashed #c8d6e8; background:#fafcfe; border-radius:6px; padding:12px; text-align:center; font-size:10px; color:#8a9aa8; display:flex; align-items:center; justify-content:center; box-sizing: border-box;">📎 Klik untuk Upload</div>`;
      }
      else if (item.type === 'domisili_api') {
          html += `<select style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled><option value="">Pilih Provinsi / Kota ▼</option></select>`;
      }
      else {
          html += `<input type="text" placeholder="Jawaban..." disabled style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" />`;
      }
      html += `</div>`;
  }
  
  html += '</div>';
  hpPreviewHtml.value = html;
}

onMounted(() => {
  window.addEventListener('ff-updated', updatePreviewFromItems)
})

onUnmounted(() => {
  window.removeEventListener('ff-updated', updatePreviewFromItems)
})

watch(selectedEvent, (val) => {
  if (val) {
    const s = val.settings || {}
    formEditEvent.value = {
      nama: val.nama_event,
      slug: val.slug,
      tanggal: val.tanggal_mulai ? val.tanggal_mulai.substring(0, 10) : '',
      lokasi: val.lokasi,
      deskripsi: val.deskripsi,
      tipe_event: s.tipe_event || 'offline',
      is_qr_active: s.is_qr_active !== false,
      is_online_absen_active: s.is_online_absen_active || false,
      sistem_checkin: val.sistem_checkin || 'scanner',
      target_absen: val.target_absen || 0,
      is_snk_active: s.is_snk_active !== false,
      snk_text: s.snk_text || 'Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.',
      is_anti_calo_email: s.is_anti_calo_email || false,
      is_anti_calo_wa: s.is_anti_calo_wa || false,
      is_wa_konfirm: s.is_wa_konfirm || false,
      is_donasi_active: s.is_donasi_active || false,
      donasi_header: s.donasi_header || '',
      donasi_options: s.donasi_options || '',
      is_grup_wa_active: s.link_grup_wa && s.link_grup_wa.length > 5,
      link_grup_wa: s.link_grup_wa || ''
    }
    
    // Load FormForge Items
    if (s.pertanyaan_kustom && Array.isArray(s.pertanyaan_kustom)) {
      formForgeItems.value = s.pertanyaan_kustom
    } else {
      formForgeItems.value = getDefaultItems()
    }
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.renderGrid) {
        window.items = formForgeItems.value
        window.renderGrid()
      }
      updatePreviewFromItems()
    }, 500)
    
    posterPreviewUrl.value = fixPosterUrl(val.poster_url) || null
    posterFile.value = null
  }
}, { immediate: true })

const handlePosterUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran poster maksimal 2MB!', 'error')
    e.target.value = ''
    return
  }
  posterFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { posterPreviewUrl.value = ev.target.result }
  reader.readAsDataURL(file)
}

const simpanEdit = async () => {
  isSavingEdit.value = true
  try {
    let finalPosterUrl = selectedEvent.value.poster_url
    if (posterFile.value) {
      const fileExt = posterFile.value.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const { error: uploadErr } = await supabase.storage.from('posters').upload(fileName, posterFile.value)
      if (uploadErr) throw uploadErr
      finalPosterUrl = supabase.storage.from('posters').getPublicUrl(fileName).data.publicUrl
    }

    const oldSettings = selectedEvent.value.settings || {}
    const newSettings = {
      ...oldSettings,
      tipe_event: formEditEvent.value.tipe_event,
      is_qr_active: formEditEvent.value.is_qr_active,
      is_online_absen_active: formEditEvent.value.is_online_absen_active,
      pertanyaan_kustom: formForgeItems.value,
      is_anti_calo_email: formEditEvent.value.is_anti_calo_email,
      is_anti_calo_wa: formEditEvent.value.is_anti_calo_wa,
      is_wa_konfirm: formEditEvent.value.is_wa_konfirm,
      is_donasi_active: formEditEvent.value.is_donasi_active,
      donasi_header: formEditEvent.value.donasi_header,
      donasi_options: formEditEvent.value.donasi_options,
      link_grup_wa: formEditEvent.value.is_grup_wa_active ? formEditEvent.value.link_grup_wa : '',
      is_snk_active: formEditEvent.value.is_snk_active,
      snk_text: formEditEvent.value.snk_text
    }

    const payload = {
      nama_event: formEditEvent.value.nama,
      slug: formEditEvent.value.slug,
      tanggal_mulai: formEditEvent.value.tanggal || null,
      lokasi: formEditEvent.value.lokasi,
      deskripsi: formEditEvent.value.deskripsi,
      sistem_checkin: formEditEvent.value.is_qr_active ? formEditEvent.value.sistem_checkin : 'none',
      target_absen: formEditEvent.value.is_qr_active && formEditEvent.value.sistem_checkin === 'portal' ? (parseInt(formEditEvent.value.target_absen) || 0) : 0,
      poster_url: finalPosterUrl,
      settings: newSettings
    }

    const { error } = await supabase.from('event').update(payload).eq('id', selectedEvent.value.id)
    if (error) throw error

    showToast('Perubahan berhasil disimpan!', 'success')
    await muatDaftarEvent(currentUser.value.id)
    // auto-updated via muatDaftarEvent
  } catch (err) {
    showToast('Gagal menyimpan perubahan: ' + err.message, 'error')
  } finally {
    isSavingEdit.value = false
  }
}
</script>
<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>
