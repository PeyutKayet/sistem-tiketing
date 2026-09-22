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

          <div class="row mb-0">
            <div class="col">
              <label class="form-label">Link Maps</label>
              <input type="url" v-model="formEditEvent.link_maps" placeholder="https://maps.app.goo.gl/..." class="form-control" />
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="row mb-3">
            <div class="col">
              <label class="form-label">Tipe Event</label>
              <select v-model="formEditEvent.tipe_event" class="form-control">
                <option value="offline">Offline</option><option value="online">Online</option>
              </select>
            </div>
            <div class="col">
              <label class="form-label">Sistem Check-in</label>
              <select v-model="formEditEvent.sistem_checkin" class="form-control">
                <option value="scanner">QR Scanner (1x Datang)</option><option value="portal">Portal Absen (Multi-hari)</option>
              </select>
            </div>
            <div class="col">
              <label class="form-label">Target Absen</label>
              <input type="number" v-model="formEditEvent.target_absen" class="form-control" placeholder="0 untuk Scanner" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Link Online</label>
            <input type="url" v-model="formEditEvent.link_online" class="form-control" />
          </div>
          
          <div style="padding-top: 14px; border-top: 1px dashed #e6edf5;">
            <label class="form-label" style="color: #0a1929;"><Icon name="lucide:file-text" style="margin-right:4px;" /> Syarat & Ketentuan (S&K)</label>
            <label class="checkbox-item mb-1">
              <input type="checkbox" v-model="formEditEvent.is_snk_active" /> Gunakan S&K Pendaftaran
            </label>
            <textarea v-if="formEditEvent.is_snk_active" v-model="formEditEvent.snk_text" rows="3" class="form-control" placeholder="Ketik syarat dan ketentuan di sini..." style="margin-top: 8px;"></textarea>
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
          <div style="background: #f8fafc; border-radius: 20px; overflow-y: auto; padding: 14px 16px 18px 16px; flex: 1; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #8a9aa8; padding-bottom: 4px; border-bottom: 1px solid #f0f4fa; margin-bottom: 6px;">
              <span>🔋 📶</span><span>12:30</span>
            </div>
            <div style="display:flex; justify-content:center; margin-bottom:12px;">
              <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:0.5px;"><Icon name="lucide:ticket" style="margin-right:4px;" /> EVENTHUB TICKET</span>
            </div>
            <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); margin-bottom:12px; border:1px solid #e6edf5;">
              <div style="height:120px; border-radius:10px; margin-bottom:12px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; font-size: 28px;" 
                :style="posterPreviewUrl ? { backgroundImage: `url('${posterPreviewUrl}')` } : { background: 'linear-gradient(145deg, var(--primary), #3b82f6)' }">
                {{ posterPreviewUrl ? '' : '<Icon name="lucide:rocket" />' }}
              </div>
              <div style="font-size:16px; font-weight:800; text-align:center; color:#0a1929; letter-spacing:-0.3px;">{{ formEditEvent.nama || 'Event Baru' }}</div>
              <div style="font-size:10px; color:#1a6a4a; background:#e4f0e8; padding:4px 8px; border-radius:6px; text-align:center; font-weight:600; margin:8px auto 0 auto; width:fit-content;">
                <Icon name="lucide:calendar" style="margin-right:4px;" /> {{ formEditEvent.tanggal || 'Tgl' }} · <Icon name="lucide:map-pin" style="margin-right:4px;" /> {{ formEditEvent.lokasi || 'Lokasi' }}
              </div>
              <div style="text-align:center; margin-top:8px; font-size:11px; color:#4a5a6e;">{{ formEditEvent.deskripsi || 'Deskripsi acara...' }}</div>
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
          else if (item.type === 'short_text') html += `<input type="text" placeholder="..." style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" disabled/>`
          else if (item.type === 'date' || item.type === 'time') html += `<input type="${item.type}" style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" disabled/>`
          else if (item.type === 'paragraph') html += `<textarea placeholder="..." style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; resize:none; box-sizing: border-box;" disabled></textarea>`
          else if (item.type === 'dropdown') {
              html += `<select style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" disabled><option value="">Pilih...</option></select>`;
          } else if (item.type === 'multiple_choice' || item.type === 'checkboxes') {
              html += `<div style="display:flex; flex-direction:column; gap:4px; font-size:9px; color:#4a5a6e; overflow:auto; height:100%; padding-right: 4px;">`;
              (item.options || ['Opsi 1']).forEach(o => html += `<label style="display:flex; align-items:center; gap:3px;"><input type="radio" disabled style="margin:0; width:10px; height:10px;" /> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(o)}</span></label>`);
              html += `</div>`;
          } else if (item.type === 'file_upload') {
              html += `<div style="border:1px dashed #c8d6e8; background:#fafcfe; border-radius:6px; padding:6px; text-align:center; font-size:9px; color:#8a9aa8; height:100%; display:flex; align-items:center; justify-content:center; box-sizing: border-box;">📎 Upload</div>`;
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

watch(selectedEvent, (val) => {
  if (val) {
    const s = val.settings || {}
    formEditEvent.value = {
      nama: val.nama_event,
      slug: val.slug,
      tanggal: val.tanggal_mulai ? val.tanggal_mulai.substring(0, 10) : '',
      lokasi: val.lokasi,
      deskripsi: val.deskripsi,
      link_maps: s.link_maps || '',
      tipe_event: s.tipe_event || 'offline',
      sistem_checkin: val.sistem_checkin || 'scanner',
      target_absen: val.target_absen || 0,
      link_online: val.link_meeting || '',
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
    formForgeItems.value = s.pertanyaan_kustom || []
    setTimeout(() => updatePreviewFromItems(), 50)
    
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
      pertanyaan_kustom: formForgeItems.value,
      is_anti_calo_email: formEditEvent.value.is_anti_calo_email,
      is_anti_calo_wa: formEditEvent.value.is_anti_calo_wa,
      is_wa_konfirm: formEditEvent.value.is_wa_konfirm,
      is_donasi_active: formEditEvent.value.is_donasi_active,
      donasi_header: formEditEvent.value.donasi_header,
      donasi_options: formEditEvent.value.donasi_options,
      link_grup_wa: formEditEvent.value.is_grup_wa_active ? formEditEvent.value.link_grup_wa : '',
      link_maps: formEditEvent.value.link_maps,
      is_snk_active: formEditEvent.value.is_snk_active,
      snk_text: formEditEvent.value.snk_text
    }

    const payload = {
      nama_event: formEditEvent.value.nama,
      slug: formEditEvent.value.slug,
      tanggal_mulai: formEditEvent.value.tanggal || null,
      lokasi: formEditEvent.value.lokasi,
      deskripsi: formEditEvent.value.deskripsi,
      sistem_checkin: formEditEvent.value.sistem_checkin,
      target_absen: parseInt(formEditEvent.value.target_absen) || 0,
      link_meeting: formEditEvent.value.link_online,
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
