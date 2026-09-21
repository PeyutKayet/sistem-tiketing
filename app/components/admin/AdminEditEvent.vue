<template>
  <div id="page-edit" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title">✏️ Edit <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="activeTab = 'event'">🔙 Kembali</button>
    </div>

    <div style="display:flex;gap:28px;flex-wrap:wrap;">
      <!-- FORM KIRI -->
      <div style="flex:1.2;min-width:280px;">
        <div class="panel">
          <div class="mb-3">
            <label class="form-label">🖼️ Upload Poster Event</label>
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
            <label class="form-label" style="color: #0a1929;">📜 Syarat & Ketentuan (S&K)</label>
            <label class="checkbox-item mb-1">
              <input type="checkbox" v-model="formEditEvent.is_snk_active" /> Gunakan S&K Pendaftaran
            </label>
            <textarea v-if="formEditEvent.is_snk_active" v-model="formEditEvent.snk_text" rows="3" class="form-control" placeholder="Ketik syarat dan ketentuan di sini..." style="margin-top: 8px;"></textarea>
          </div>
        </div>

        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">🛡️ Anti Calo</h4>
          <div class="flex" style="flex-wrap:wrap;">
            <label class="checkbox-item"><input type="checkbox" v-model="formEditEvent.is_anti_calo_email" /> 1 Email = 1 Tiket</label>
            <label class="checkbox-item"><input type="checkbox" v-model="formEditEvent.is_anti_calo_wa" /> 1 WA = 1 Tiket</label>
            <label class="checkbox-item"><input type="checkbox" v-model="formEditEvent.is_wa_konfirm" /> Konfirmasi WA</label>
          </div>
        </div>

        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">💖 Fitur Donasi / Infaq</h4>
          <div class="mb-3">
            <label class="checkbox-item">
              <input type="checkbox" v-model="formEditEvent.is_donasi_active" /> Aktifkan Form Donasi di Pendaftaran
            </label>
          </div>
          <div v-if="formEditEvent.is_donasi_active" style="padding-top: 10px; border-top: 1px dashed #e6edf5;">
            <div class="row mb-3">
              <div class="col">
                <label class="form-label">Header Donasi (Bisa pakai tag HTML)</label>
                <input type="text" v-model="formEditEvent.donasi_header" class="form-control" placeholder="Contoh: <b>Infaq Pembangunan Masjid</b>" />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label class="form-label">Opsi Nominal (Pisahkan dengan koma)</label>
                <input type="text" v-model="formEditEvent.donasi_options" class="form-control" placeholder="Contoh: 10000, 20000, 50000, custom" />
                <small class="text-muted" style="font-size: 11px;">Ketik "custom" jika ingin user bisa mengisi nominal bebas.</small>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">💬 Grup Komunikasi</h4>
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
              <h4 style="margin:0;font-weight:600;color:#0a1929;">📋 Form Pendaftaran (FormForge)</h4>
          </div>
          <AdminFormBuilder />
        </div>

        <button class="btn-primary" @click="simpanEdit" :disabled="isSavingEdit" style="margin-top:14px;width:100%;padding:14px;font-size:15px;">
          {{ isSavingEdit ? '⏳ Menyimpan...' : '💾 Simpan Perubahan' }}
        </button>
      </div>

      <!-- PREVIEW KANAN -->
      <div class="preview-sticky">
        <div style="font-weight:600;font-size:14px;color:#4a5a6e;margin-bottom:10px;letter-spacing:0.2px;">👀 Live Preview E-Tiket</div>
        <div style="background: #0a1929; border-radius: 32px; padding: 14px 12px; box-shadow: 0 24px 56px -16px rgba(0, 0, 0, 0.4); height: 580px; display: flex; flex-direction: column;">
          <div style="background: #f8fafc; border-radius: 20px; overflow-y: auto; padding: 14px 16px 18px 16px; flex: 1; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #8a9aa8; padding-bottom: 4px; border-bottom: 1px solid #f0f4fa; margin-bottom: 6px;">
              <span>🔋 📶</span><span>12:30</span>
            </div>
            <div style="display:flex; justify-content:center; margin-bottom:12px;">
              <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:0.5px;">🎟️ EVENTHUB TICKET</span>
            </div>
            <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); margin-bottom:12px; border:1px solid #e6edf5;">
              <div style="height:120px; border-radius:10px; margin-bottom:12px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; font-size: 28px;" 
                :style="{ backgroundImage: posterPreviewUrl ? `url('${posterPreviewUrl}')` : 'none', background: posterPreviewUrl ? 'none' : 'linear-gradient(145deg, var(--primary), #3b82f6)' }">
                {{ posterPreviewUrl ? '' : '🚀' }}
              </div>
              <div style="font-size:16px; font-weight:800; text-align:center; color:#0a1929; letter-spacing:-0.3px;">{{ formEditEvent.nama || 'Event Baru' }}</div>
              <div style="font-size:10px; color:#1a6a4a; background:#e4f0e8; padding:4px 8px; border-radius:6px; text-align:center; font-weight:600; margin:8px auto 0 auto; width:fit-content;">
                📅 {{ formEditEvent.tanggal || 'Tgl' }} · 📍 {{ formEditEvent.lokasi || 'Lokasi' }}
              </div>
              <div style="text-align:center; margin-top:8px; font-size:11px; color:#4a5a6e;">{{ formEditEvent.deskripsi || 'Deskripsi acara...' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AdminFormBuilder from '~/components/admin/AdminFormBuilder.vue'

const { selectedEvent, formEditEvent, isSavingEdit, activeTab, supabase, showToast, currentUser, muatDaftarEvent, formForgeItems } = useAdmin()

const posterFile = ref(null)
const posterPreviewUrl = ref(null)

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
    
    posterPreviewUrl.value = val.poster_url || null
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
    selectedEvent.value = { ...selectedEvent.value, ...payload }
  } catch (err) {
    showToast('Gagal menyimpan perubahan: ' + err.message, 'error')
  } finally {
    isSavingEdit.value = false
  }
}
</script>
