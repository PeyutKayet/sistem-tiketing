<template>
  <div class="wizard-overlay" :class="{ open: showWizard }">
    <div class="wizard">
      <button class="close" @click="tutupWizard">✖</button>

      <div class="step-indicator">
        <span :class="{ active: wizardStepNow === 1, completed: wizardStepNow > 1 }">
          <span class="num">{{ wizardStepNow > 1 ? '✓' : '1' }}</span> Informasi
        </span>
        <span :class="{ active: wizardStepNow === 2, completed: wizardStepNow > 2 }">
          <span class="num">{{ wizardStepNow > 2 ? '✓' : '2' }}</span> Tiket
        </span>
        <span :class="{ active: wizardStepNow === 3, completed: wizardStepNow > 3 }">
          <span class="num">{{ wizardStepNow > 3 ? '✓' : '3' }}</span> Form
        </span>
        <span :class="{ active: wizardStepNow === 4, completed: wizardStepNow > 4 }">
          <span class="num">{{ wizardStepNow > 4 ? '✓' : '4' }}</span> Publikasi
        </span>
      </div>

      <!-- STEP 1 -->
      <div class="wiz-step" :class="{ active: wizardStepNow === 1 }">
        <div class="wiz-grid">
          <div class="left">
            <div style="padding-bottom: 20px; border-bottom: 1px dashed #cbd5e1; margin-bottom: 20px;">
              <h4 style="margin-bottom:16px;font-weight:600;color:#0a1929;font-size:15px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:info" style="color:var(--primary);" /> Informasi Dasar</h4>
              
              <div class="row mb-3">
                <div class="col" style="flex:2;">
                  <label class="form-label">Nama Acara <span style="color:#d43f34">*</span></label>
                  <input type="text" v-model="formEvent.nama" placeholder="Contoh: Tech Summit 2026" class="form-control" @input="generateSlug" />
                </div>
                <div class="col" style="flex:1;">
                  <label class="form-label">Upload Poster</label>
                  <input type="file" accept="image/*" class="form-file" @change="handlePosterUpload" style="background:#f7faff; padding:6px; border-radius:8px; border:1px dashed #bcc8d8; font-size:12px;" />
                </div>
              </div>
              
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label">Slug URL</label>
                  <input type="text" v-model="formEvent.slug" placeholder="contoh-tech-summit" class="form-control" @input="formEvent.slug = formEvent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')" />
                </div>
                <div class="col">
                  <label class="form-label">Tanggal</label>
                  <input type="date" v-model="formEvent.tanggal" class="form-control" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Deskripsi</label>
                <textarea v-model="formEvent.deskripsi" rows="2" class="form-control" placeholder="Deskripsikan acara kamu di sini..."></textarea>
              </div>
              <div class="row mb-0">
                <div class="col">
                  <label class="form-label">Lokasi Acara</label>
                  <input type="text" v-model="formEvent.lokasi" placeholder="Contoh: Jakarta Convention Center" class="form-control" />
                </div>
                <div class="col">
                  <label class="form-label">Link Maps (Opsional)</label>
                  <input type="url" v-model="formEvent.link_maps" placeholder="https://maps.app.goo.gl/..." class="form-control" />
                </div>
              </div>
            </div>

            <button @click="showAdvancedSettings = !showAdvancedSettings" style="width: 100%; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; color: #4a5a6e; font-weight: 600; font-size: 13px; cursor: pointer; margin-bottom: 20px; transition: 0.2s;">
              <span style="display:flex; align-items:center; gap:8px;"><Icon name="lucide:settings-2" style="font-size:16px; color:var(--primary);" /> Pengaturan Lanjutan (Opsional)</span>
              <Icon :name="showAdvancedSettings ? 'lucide:chevron-up' : 'lucide:chevron-down'" style="font-size:18px;" />
            </button>

            <div v-show="showAdvancedSettings" style="animation: slideDown 0.3s ease; padding: 16px; background: #f8fafc; border-radius: 16px; border: 1px solid #e6edf5;">
              <div style="padding-bottom: 20px; border-bottom: 1px dashed #cbd5e1; margin-bottom: 20px;">
                <h4 style="margin-bottom:16px;font-weight:600;color:#0a1929;font-size:14px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:sliders-horizontal" style="color:#4a5a6e; font-size:14px;" /> Pengaturan Sistem</h4>
                <div class="row mb-0" style="gap: 12px;">
                  <div class="col" style="min-width: 120px;">
                    <label class="form-label" style="font-size:11px;">Tipe Event</label>
                    <select v-model="formEvent.tipe_event" class="form-control" style="font-size:12px; padding:6px 10px;"><option value="offline">Offline</option><option value="online">Online</option></select>
                  </div>
                  <div class="col" style="min-width: 120px;">
                    <label class="form-label" style="font-size:11px;">Sistem Check-in</label>
                    <select v-model="formEvent.sistem_checkin" class="form-control" style="font-size:12px; padding:6px 10px;"><option value="scanner">QR Scanner (1x Datang)</option><option value="portal">Portal Absen (Multi-hari)</option></select>
                  </div>
                  <div class="col" style="min-width: 120px;">
                    <label class="form-label" style="font-size:11px;">Target Absen (Bila Portal)</label>
                    <input type="number" v-model="formEvent.target_absen" class="form-control" placeholder="Isi 0 jika Scanner" style="font-size:12px; padding:6px 10px;" />
                  </div>
                </div>
              </div>

              <div>
                <h4 style="margin-bottom:16px;font-weight:600;color:#0a1929;font-size:14px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:puzzle" style="color:#d43f34; font-size:14px;" /> Fitur Tambahan & Keamanan</h4>
                <div class="row" style="gap: 16px;">
                  <div class="col">
                    <div class="mb-3">
                      <label class="checkbox-item" style="font-weight:600; font-size:12px;"><input type="checkbox" v-model="formEvent.is_donasi_active" /> <Icon name="lucide:heart-handshake" class="mr-1" style="font-size:14px;color:#d43f34;" /> Donasi / Infaq</label>
                      <div v-if="formEvent.is_donasi_active" style="padding-top: 8px; margin-left:24px;">
                        <input type="text" v-model="formEvent.donasi_header" class="form-control mb-1" placeholder="Header: Infaq Masjid" style="padding: 6px 10px; font-size: 11px;" />
                        <input type="text" v-model="formEvent.donasi_options" class="form-control" placeholder="Nominal: 10000, 50000, custom" style="padding: 6px 10px; font-size: 11px;" />
                      </div>
                    </div>
                    <div>
                      <label class="checkbox-item" style="font-weight:600; font-size:12px;"><input type="checkbox" v-model="formEvent.is_grup_wa_active" /> <Icon name="lucide:message-circle" class="mr-1" style="font-size:14px;color:#15803d;" /> Grup WhatsApp</label>
                      <div v-if="formEvent.is_grup_wa_active" style="padding-top: 8px; margin-left:24px;">
                        <input type="url" v-model="formEvent.link_grup_wa" class="form-control" placeholder="https://chat.whatsapp.com/..." style="padding: 6px 10px; font-size: 11px;" />
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-3">
                      <label class="checkbox-item mb-1" style="font-weight:600; font-size:12px;"><input type="checkbox" v-model="formEvent.is_snk_active" /> <Icon name="lucide:file-text" class="mr-1" style="font-size:14px;color:#8a9aa8;" /> Syarat & Ketentuan</label>
                      <textarea v-if="formEvent.is_snk_active" v-model="formEvent.snk_text" rows="2" class="form-control" placeholder="Ketik syarat dan ketentuan..." style="margin-left: 24px; width:calc(100% - 24px); padding: 6px 10px; font-size: 11px; resize: none;"></textarea>
                    </div>
                    <div>
                      <label style="font-weight:600; font-size:12px; color:#0a1929; display:flex; align-items:center; gap:4px; margin-bottom:8px;"><Icon name="lucide:shield-check" style="font-size:14px;color:var(--primary);" /> Anti Calo</label>
                      <div class="flex" style="flex-wrap:wrap; gap:8px; margin-left:24px;">
                        <label class="checkbox-item" style="font-size: 11px;"><input type="checkbox" v-model="formEvent.is_anti_calo_email" /> 1 Email = 1 Tiket</label>
                        <label class="checkbox-item" style="font-size: 11px;"><input type="checkbox" v-model="formEvent.is_anti_calo_wa" /> 1 WA = 1 Tiket</label>
                        <label class="checkbox-item" style="font-size: 11px;"><input type="checkbox" v-model="formEvent.is_wa_konfirm" /> OTP WA</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="right">
            <AdminMobilePreview :step="1" :formEvent="formEvent" :wizardTiketList="wizardTiketList" :hpPreviewHtml="hpPreviewHtml" />
          </div>
        </div>
      </div>

      <!-- STEP 2: TIKET -->
      <div class="wiz-step" :class="{ active: wizardStepNow === 2 }">
        <div class="wiz-grid">
          <div class="left">
            <h4 style="margin-bottom:16px;font-weight:600;color:#0a1929;font-size:15px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:ticket" style="color:var(--primary);" /> Kelola Tiket</h4>
            
            <div style="background: #ffffff; border: 1px solid #e6edf5; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); margin-bottom: 24px;">
              <h5 style="margin-bottom:16px;font-weight:600;color:#4a5a6e;font-size:13px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:plus-square" style="font-size:14px;" /> Tambah Tiket Baru</h5>
              <div class="row mb-3">
                <div class="col" style="flex:2;">
                  <label class="form-label" style="font-size:11px;">Nama Tiket</label>
                  <input type="text" v-model="formTiketBaru.nama" placeholder="Contoh: VIP / Early Bird" class="form-control" style="font-size:12px;" />
                </div>
                <div class="col" style="flex:1;">
                  <label class="form-label" style="font-size:11px;">Kuota</label>
                  <input type="number" v-model="formTiketBaru.kuota" placeholder="Contoh: 100" class="form-control" style="font-size:12px;" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label" style="font-size:11px;">Harga (Biarkan 0 jika Gratis)</label>
                  <div style="position:relative; display:flex; align-items:center;">
                    <span style="position:absolute; left:14px; color:#8a9aa8; font-weight:600; font-size:12px;">Rp</span>
                    <input type="text" v-model="formTiketBaru.harga" placeholder="0" class="form-control" style="padding-left:42px; font-size:12px;" @input="formatRupiahInput" />
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col"><label class="form-label" style="font-size:11px;">Penjualan Dibuka</label><input type="datetime-local" v-model="formTiketBaru.buka" class="form-control" style="font-size:12px;" /></div>
                <div class="col"><label class="form-label" style="font-size:11px;">Penjualan Ditutup</label><input type="datetime-local" v-model="formTiketBaru.tutup" class="form-control" style="font-size:12px;" /></div>
              </div>
              <div class="flex" style="gap:10px; margin-top:8px;">
                <button class="btn-primary" style="padding:8px 20px; font-weight:600; display:flex; align-items:center; gap:6px; font-size:12px;" @click="tambahTiketSimulasi"><Icon name="lucide:plus-circle" style="font-size:16px;" /> Tambah Tiket</button>
                <button class="btn-outline" style="padding:8px 20px; display:flex; align-items:center; gap:6px; font-size:12px;" @click="resetFormTiket"><Icon name="lucide:rotate-ccw" style="font-size:16px;" /> Reset</button>
              </div>
            </div>
            
            <div style="background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e6edf5;">
              <h5 style="margin-bottom:12px;font-weight:600;color:#4a5a6e;font-size:13px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:list" style="font-size:14px;" /> Daftar Tiket Tersimpan</h5>
              <div v-if="wizardTiketList.length === 0" style="color:#8a9aa8; font-style:italic; text-align:center; padding:20px 0; font-size:12px;">Belum ada tiket yang ditambahkan.</div>
              <div v-for="(t, i) in wizardTiketList" :key="i" style="background: #ffffff; display: flex; justify-content: space-between; align-items:center; padding: 12px 16px; border: 1px solid #e6edf5; border-radius: 12px; margin-bottom: 8px; font-size: 13px; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                <div>
                  <div style="font-weight:700; color:#0a1929; margin-bottom:4px;">{{ t.nama }}</div>
                  <div style="font-size:11px; color:#8a9aa8;"><Icon name="lucide:users" style="font-size:12px;vertical-align:text-bottom;margin-right:2px;" /> Kuota: <span style="font-weight:600;color:#4a5a6e;">{{ t.kuota }}</span></div>
                </div>
                <div style="display:flex; align-items:center; gap:16px;">
                  <div style="font-weight:700; color:var(--primary); background:#eef3f9; padding:4px 10px; border-radius:8px; font-size:12px;">{{ formatRupiah(t.harga) }}</div>
                  <button style="background:none; border:none; color:#d43f34; cursor:pointer; display:flex; align-items:center; padding:6px; border-radius:6px; transition:0.2s;" @click="hapusTiketSimulasi(i)" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='none'"><Icon name="lucide:trash-2" style="font-size:16px;" /></button>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <AdminMobilePreview :step="2" :formEvent="formEvent" :wizardTiketList="wizardTiketList" :hpPreviewHtml="hpPreviewHtml" />
          </div>
        </div>
      </div>

      <!-- STEP 3: FORM BUILDER -->
      <div class="wiz-step" :class="{ active: wizardStepNow === 3 }">
        <div class="wiz-grid">
          <div class="left" style="display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <AdminFormBuilder v-if="wizardStepNow === 3" />
          </div>
          <div class="right">
            <AdminMobilePreview :step="3" :formEvent="formEvent" :wizardTiketList="wizardTiketList" :hpPreviewHtml="hpPreviewHtml" />
          </div>
        </div>
      </div>

      <!-- STEP 4: SUMMARY -->
      <div class="wiz-step" :class="{ active: wizardStepNow === 4 }">
        <div class="wiz-grid">
          <div class="left">
            <h4 style="margin-bottom:20px;font-weight:600;color:#0a1929;font-size:16px;display:flex;align-items:center;gap:6px;"><Icon name="lucide:check-circle" style="color:#15803d;" /> Ringkasan Event</h4>
            
            <div style="background: linear-gradient(to right, #ffffff, #f7faff); border-radius:16px; padding:20px; border:1px solid #e6edf5; margin-bottom:16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <div style="font-size:18px; font-weight:700; color:#0a1929; margin-bottom:10px; letter-spacing:-0.3px;">{{ formEvent.nama || 'Event Baru' }}</div>
              <div class="text-muted" style="font-size:13px; display:flex; gap:16px; flex-wrap:wrap; font-weight:500;">
                <span style="display:flex;align-items:center;gap:4px;"><Icon name="lucide:calendar" style="font-size:14px;color:#8a9aa8;" /> <span style="color:#4a5a6e;">{{ formEvent.tanggal || 'Tanggal Belum Diatur' }}</span></span>
                <span style="display:flex;align-items:center;gap:4px;"><Icon name="lucide:map-pin" style="font-size:14px;color:#8a9aa8;" /> <span style="color:#4a5a6e;">{{ formEvent.lokasi || 'Lokasi Belum Diatur' }}</span></span>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
              <div style="background:#ffffff; border-radius:14px; padding:16px; border:1px solid #e6edf5; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
                <div style="font-size:12px; font-weight:600; color:#8a9aa8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; display:flex; align-items:center; gap:4px;"><Icon name="lucide:ticket" style="font-size:14px;" /> Kategori Tiket</div>
                <div class="text-muted" style="font-size:13px; line-height:1.7;">
                  <div v-if="wizardTiketList.length === 0">Belum ada tiket</div>
                  <div v-for="t in wizardTiketList" :key="t.nama">• {{ t.nama }} ({{ formatRupiah(t.harga) }})</div>
                </div>
              </div>
              <div style="background:#ffffff; border-radius:14px; padding:16px; border:1px solid #e6edf5; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
                <div style="font-size:12px; font-weight:600; color:#8a9aa8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; display:flex; align-items:center; gap:4px;"><Icon name="lucide:file-text" style="font-size:14px;" /> Pertanyaan Kustom</div>
                <div class="text-muted" style="font-size:13px; line-height:1.7;">
                  <div v-if="formForgeItems.length === 0">Belum ada pertanyaan</div>
                  <div v-for="q in formForgeItems" :key="q.id">• {{ q.label }}</div>
                </div>
              </div>
            </div>

            <div style="background:#ffffff; border-radius:14px; padding:16px; border:1px solid #e6edf5; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
              <div style="font-size:12px; font-weight:600; color:#8a9aa8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; display:flex; align-items:center; gap:4px;"><Icon name="lucide:settings-2" style="font-size:14px;" /> Fitur Aktif</div>
              <div class="text-muted" style="font-size:13px; font-weight:500; color:#0a1929; display:flex; gap:12px; flex-wrap:wrap;">
                <span><Icon name="lucide:check-circle-2" style="font-size:14px;color:var(--primary);margin-right:2px;vertical-align:text-bottom;" /> {{ formEvent.tipe_event }}</span>
                <span><Icon name="lucide:check-circle-2" style="font-size:14px;color:var(--primary);margin-right:2px;vertical-align:text-bottom;" /> {{ formEvent.sistem_checkin }}</span>
              </div>
            </div>
            
            <div style="margin-top:24px;">
              <label style="font-size:12px; font-weight:600; color:#8a9aa8; text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:4px;"><Icon name="lucide:link" style="font-size:14px;" /> Link Publikasi</label>
              <div style="background:#e4edf8; padding:12px 18px; border-radius:12px; font-size:13px; font-family:monospace; color:#1a4a7a; border:1px dashed #b8c8d8;">
                {{ baseUrl }}/<strong style="color:#0a1929;">{{ formEvent.slug || 'slug-event' }}</strong>
              </div>
            </div>
          </div>
          <div class="right">
            <AdminMobilePreview :step="4" :formEvent="formEvent" :wizardTiketList="wizardTiketList" :hpPreviewHtml="hpPreviewHtml" />
          </div>
        </div>
      </div>

      <div class="nav-buttons">
        <button class="btn-outline" :style="{ visibility: wizardStepNow === 1 ? 'hidden' : 'visible' }" @click="wizardStepNow--" style="display:flex; align-items:center; gap:6px;"><Icon name="lucide:arrow-left" style="font-size:16px;" /> Kembali</button>
        <button class="btn-primary" @click="goNext" :disabled="isSavingEvent" style="display:flex; align-items:center; gap:6px;">
          <template v-if="wizardStepNow === 4">
            <template v-if="isSavingEvent"><Icon name="lucide:loader" style="font-size:16px; animation: spin 1s linear infinite;" /> Menyimpan...</template>
            <template v-else><Icon name="lucide:rocket" style="font-size:16px;" /> Publikasikan</template>
          </template>
          <template v-else>
            Lanjut <Icon name="lucide:arrow-right" style="font-size:16px;" />
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminFormBuilder from '~/components/admin/AdminFormBuilder.vue'

const { 
  showWizard, wizardStepNow, formEvent, formTiketBaru, wizardTiketList, 
  isSavingEvent, currentUser, supabase, muatDaftarEvent, showToast, formForgeItems 
} = useAdmin()

const showAdvancedSettings = ref(false)
const baseUrl = ref('')
onMounted(() => {
  baseUrl.value = window.location.origin
})
const hpPreviewHtml = ref('<div style="color:#8a9aa8;font-size:11px;text-align:center;padding:10px 0;">Memuat preview...</div>')

const escapeHtml = (text) => {
  if (!text) return ''
  const div = document.createElement('div'); div.textContent = text; return div.innerHTML 
}

const updatePreviewFromItems = () => {
  let html = '<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: 20px; gap: 4px; width: 100%;">';
  const sorted = [...formForgeItems.value].sort((a, b) => a.y - b.y || a.x - b.x);
  
  if (sorted.length === 0) {
      html = '<div style="grid-column: 1 / -1; color:#8a9aa8; font-size:10px; text-align:center; padding:10px 0;">Belum ada field tambahan</div>';
  } else {
      for (const item of sorted) {
          html += `<div style="grid-column: ${item.x + 1} / span ${item.width}; grid-row: ${item.y + 1} / span ${item.height}; min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: transparent;">`;
          if (item.type === 'header') {
              html += `<div style="font-size:11px; font-weight:700; color:#0a1929; margin-top:0; border-bottom:1px solid #e6edf5; padding-bottom:2px; word-wrap:break-word; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}</div>`;
          } else {
              html += `<label style="font-size:8px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}${item.required ? ' <span style="color:#d43f34">*</span>' : ''}</label>`;
          }
          if (item.type === 'header') {} 
          else if (item.type === 'short_text') html += `<input type="text" placeholder="Ketik isian..." style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" disabled/>`
          else if (item.type === 'date' || item.type === 'time') html += `<input type="${item.type}" style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" disabled/>`
          else if (item.type === 'paragraph') html += `<textarea placeholder="..." style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; resize:none; box-sizing: border-box;" disabled></textarea>`
          else if (item.type === 'dropdown') {
              const opts = item.options || ['Opsi 1'];
              html += `<select style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" disabled><option value="">Pilih...</option>`;
              opts.forEach(o => html += `<option>${escapeHtml(o)}</option>`); html += `</select>`;
          } else if (item.type === 'multiple_choice' || item.type === 'checkboxes') {
              const type = item.type === 'multiple_choice' ? 'radio' : 'checkbox';
              const opts = item.options || ['Opsi 1'];
              html += `<div style="display:flex; flex-direction:column; gap:4px; font-size:9px; color:#4a5a6e; overflow:auto; height:100%; padding-right: 4px;">`;
              opts.forEach(o => html += `<label style="display:flex; align-items:center; gap:3px;"><input type="${type}" disabled style="margin:0; width:10px; height:10px;" /> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(o)}</span></label>`);
              html += `</div>`;
          } else if (item.type === 'linear_scale') {
              const count = item.scaleCount || 5;
              html += `<div style="display:flex; flex-wrap:wrap; gap:4px; font-size:8px; overflow:hidden; height:100%; align-content: flex-start;">`;
              for (let i = 1; i <= count; i++) html += `<span style="background:#e6edf5; padding:2px 6px; border-radius:10px; color:#4a5a6e;">${i}</span>`;
              html += `</div>`;
          } else if (item.type === 'file_upload') {
              html += `<div style="border:1px dashed #c8d6e8; background:#fafcfe; border-radius:6px; padding:6px; text-align:center; font-size:9px; color:#8a9aa8; height:100%; display:flex; align-items:center; justify-content:center; box-sizing: border-box;">Upload File</div>`;
          } else if (item.type === 'terms') {
              html += `<div style="flex:1; display:flex; flex-direction:column; min-height:0; overflow:hidden;">
                          <div style="font-size:7px; color:#8a9aa8; background:#f0f4fa; padding:4px; border-radius:4px; margin-bottom:4px; overflow-y:auto; line-height:1.4; flex:1;">${escapeHtml(item.termsText)}</div>
                          <label style="display:flex; align-items:flex-start; gap:4px; font-size:8px; color:#4a5a6e;"><input type="checkbox" disabled style="margin:0; width:10px; height:10px;" /> Setuju</label>
                        </div>`;
          } else if (['multiple_choice_grid', 'checkbox_grid'].includes(item.type)) {
              html += `<div style="width:100%; height:100%; background:#fafcfe; border:1px solid #e6edf5; border-radius:6px; padding:2px; box-sizing: border-box; font-size:7px; text-align:center; color:#8a9aa8;">Grid View</div>`;
          } else {
              html += `<input type="text" placeholder="..." disabled style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" />`;
          }
          html += `</div>`;
      }
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

const parseRupiah = (val) => {
  if (!val) return '0'
  let str = val.toString().replace(/[^,\d]/g, '')
  let split = str.split(',')
  let sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi)
  if (ribuan) rupiah += (sisa ? '.' : '') + ribuan.join('.')
  return rupiah
}

const formatRupiahInput = (e) => { formTiketBaru.value.harga = parseRupiah(e.target.value) }

const formatRupiah = (angka) => {
  if (angka === 0) return 'GRATIS'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const generateSlug = () => {
  formEvent.value.slug = formEvent.value.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const handlePosterUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran poster maksimal 2MB!', 'error')
    e.target.value = ''
    return
  }
  formEvent.value.poster_file = file
  const reader = new FileReader()
  reader.onload = (ev) => { formEvent.value.poster_preview = ev.target.result }
  reader.readAsDataURL(file)
}

const tutupWizard = () => { showWizard.value = false }

const tambahTiketSimulasi = () => {
  const { nama, harga, kuota, buka, tutup } = formTiketBaru.value
  if (!nama || !kuota) return showToast('Nama dan Kuota wajib diisi!', 'error')
  
  const hargaRaw = parseInt(harga.replace(/\./g, '')) || 0
  wizardTiketList.value.push({
    nama,
    harga: hargaRaw,
    kuota: parseInt(kuota),
    buka: buka ? buka + ':00' : null,
    tutup: tutup ? tutup + ':00' : null
  })
  resetFormTiket()
}

const resetFormTiket = () => { formTiketBaru.value = { nama: '', harga: '', kuota: '', buka: '', tutup: '' } }
const hapusTiketSimulasi = (index) => { wizardTiketList.value.splice(index, 1) }

const goNext = async () => {
  if (wizardStepNow.value < 4) {
    if (wizardStepNow.value === 3) updatePreviewFromItems() // Ensure HP view syncs before step 4
    wizardStepNow.value++
    return
  }

  isSavingEvent.value = true
  try {
    let posterUrl = null
    if (formEvent.value.poster_file) {
      const fileExt = formEvent.value.poster_file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const { error: uploadErr } = await supabase.storage.from('posters').upload(fileName, formEvent.value.poster_file)
      if (uploadErr) throw uploadErr
      posterUrl = supabase.storage.from('posters').getPublicUrl(fileName).data.publicUrl
    }

    const payload = {
      organizer_id: currentUser.value.id,
      nama_event: formEvent.value.nama || 'Event Tanpa Nama',
      slug: formEvent.value.slug || `event-${Date.now()}`,
      tanggal_mulai: formEvent.value.tanggal || null,
      lokasi: formEvent.value.lokasi || '',
      deskripsi: formEvent.value.deskripsi || '',
      sistem_checkin: formEvent.value.sistem_checkin || 'scanner',
      target_absen: parseInt(formEvent.value.target_absen) || 0,
      status: 'published',
      poster_url: posterUrl,
      settings: {
        tipe_event: formEvent.value.tipe_event,
        pertanyaan_kustom: formForgeItems.value,
        is_donasi_active: formEvent.value.is_donasi_active,
        donasi_header: formEvent.value.donasi_header,
        donasi_options: formEvent.value.donasi_options,
        link_grup_wa: formEvent.value.is_grup_wa_active ? formEvent.value.link_grup_wa : '',
        is_anti_calo_email: formEvent.value.is_anti_calo_email,
        is_anti_calo_wa: formEvent.value.is_anti_calo_wa,
        is_wa_konfirm: formEvent.value.is_wa_konfirm,
        link_maps: formEvent.value.link_maps,
        is_snk_active: formEvent.value.is_snk_active,
        snk_text: formEvent.value.snk_text
      }
    }

    const { data: insertData, error: insertErr } = await supabase.from('event').insert([payload]).select()
    if (insertErr) throw insertErr

    const eventIdBaru = insertData[0].id

    if (wizardTiketList.value.length > 0) {
      const payloadTiket = wizardTiketList.value.map(t => ({
        event_id: eventIdBaru,
        nama_kategori: t.nama,
        harga: t.harga,
        kuota_maksimal: t.kuota,
        tanggal_mulai_penjualan: t.buka,
        tanggal_selesai_penjualan: t.tutup
      }))
      const { error: tiketErr } = await supabase.from('kategori_tiket').insert(payloadTiket)
      if (tiketErr) throw tiketErr
    }

    showToast('Event dan Tiket berhasil dipublikasikan!', 'success')
    tutupWizard()
    await muatDaftarEvent(currentUser.value.id)
  } catch (error) {
    showToast('Gagal menyimpan event: ' + error.message, 'error')
  } finally {
    isSavingEvent.value = false
  }
}
</script>
