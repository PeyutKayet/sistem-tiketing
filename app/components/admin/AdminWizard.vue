<template>
  <div class="wizard-overlay" :class="{ open: showWizard }">
    <div class="wizard">
      <button class="close" @click="tutupWizard">✖</button>

      <div class="step-indicator">
        <span :class="{ active: wizardStepNow === 1, completed: wizardStepNow > 1 }"><span class="num">{{ wizardStepNow > 1 ? '✓' : '1' }}</span> Informasi</span>
        <span :class="{ active: wizardStepNow === 2, completed: wizardStepNow > 2 }"><span class="num">{{ wizardStepNow > 2 ? '✓' : '2' }}</span> Tiket</span>
        <span :class="{ active: wizardStepNow === 3, completed: wizardStepNow > 3 }"><span class="num">{{ wizardStepNow > 3 ? '✓' : '3' }}</span> Form</span>
        <span :class="{ active: wizardStepNow === 4, completed: wizardStepNow > 4 }"><span class="num">{{ wizardStepNow > 4 ? '✓' : '4' }}</span> Publikasi</span>
      </div>

      <!-- STEP 1: INFORMASI DASAR -->
      <div v-show="wizardStepNow === 1" class="wiz-step active">
        <div style="display: flex; gap: 32px; flex-wrap: wrap; flex: 1; min-height: 0;">
          <div style="flex: 1.2; min-width: 280px; overflow-y: auto; padding-right: 12px;">
            <h4 style="margin-bottom:16px;font-weight:700;color:#0a1929;">📝 Informasi Dasar</h4>
            
            <div style="margin-bottom: 16px;">
              <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">🖼️ Upload Poster Event</label>
              <input type="file" accept="image/*" @change="handlePosterUpload" style="width: 100%; padding: 10px; border-radius: 12px; border: 1px dashed #bcc8d8; background: #f7faff;" />
            </div>

            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
              <div style="flex: 1;">
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Nama Acara</label>
                <input type="text" v-model="formEvent.nama" @input="generateSlug" placeholder="Tech Summit 2026" class="form-control" />
              </div>
              <div style="flex: 1;">
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Slug URL</label>
                <input type="text" v-model="formEvent.slug" placeholder="tech-summit-2026" class="form-control" />
              </div>
            </div>

            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
              <div style="flex: 1;">
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Tanggal</label>
                <input type="date" v-model="formEvent.tanggal" class="form-control" />
              </div>
              <div style="flex: 1;">
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Lokasi</label>
                <input type="text" v-model="formEvent.lokasi" placeholder="Jakarta" class="form-control" />
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Deskripsi</label>
              <textarea v-model="formEvent.deskripsi" rows="2" class="form-control" placeholder="Deskripsi acara..."></textarea>
            </div>
          </div>

          <div style="flex: 0 0 290px;">
            <div style="background: #0a1929; border-radius: 32px; padding: 14px 12px; box-shadow: 0 24px 56px -16px rgba(0,0,0,0.4); height: 500px; display: flex; flex-direction: column;">
              <div style="background: #f8fafc; border-radius: 20px; padding: 14px; flex: 1; overflow-y: auto;">
                <div style="display:flex; justify-content:center; margin-bottom:12px;">
                  <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700;">🎟️ EVENTHUB TICKET</span>
                </div>
                <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); border:1px solid #e6edf5;">
                  <div style="height:120px; border-radius:10px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:28px; background: linear-gradient(145deg, #2563eb, #3b82f6); background-size: cover; background-position: center;" :style="{ backgroundImage: formEvent.poster_preview ? `url(${formEvent.poster_preview})` : 'none' }">
                    {{ formEvent.poster_preview ? '' : '🚀' }}
                  </div>
                  <div style="font-size:16px; font-weight:800; text-align:center; color:#0a1929;">
                    {{ formEvent.nama || 'Tech Summit 2026' }}
                  </div>
                  <div style="font-size:10px; color:#1a6a4a; background:#e4f0e8; padding:4px 8px; border-radius:6px; text-align:center; font-weight:600; margin:8px auto; width:fit-content;">
                    📅 {{ formEvent.tanggal ? formatDate(formEvent.tanggal) : '20 Mar 2026' }} · 📍 {{ formEvent.lokasi || 'Jakarta' }}
                  </div>
                  <div style="text-align:center; margin-top:8px; font-size:11px; color:#4a5a6e; line-height:1.5;">
                    {{ formEvent.deskripsi || 'Deskripsi acara akan tampil di sini...' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 2: TIKET & HARGA -->
      <div v-show="wizardStepNow === 2" class="wiz-step active">
        <div style="display: flex; gap: 32px; flex-wrap: wrap; flex: 1; min-height: 0;">
          <div style="flex: 1.2; min-width: 280px; overflow-y: auto; padding-right: 12px;">
            <h4 style="margin-bottom:12px;font-weight:600;color:#0a1929;">🎟️ Tiket & Harga</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Nama Tiket</label>
                <input type="text" v-model="formTiketBaru.nama" placeholder="VIP" class="form-control" />
              </div>
              <div>
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Harga</label>
                <div style="position:relative; display:flex; align-items:center;">
                  <span style="position:absolute; left:14px; color:#8a9aa8; font-weight:600;">Rp</span>
                  <input type="text" v-model="formTiketBaru.harga" placeholder="0" class="form-control" style="padding-left:42px;" @input="formatHargaInput" />
                </div>
              </div>
              <div>
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Kuota</label>
                <input type="number" v-model="formTiketBaru.kuota" placeholder="50" class="form-control" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Buka</label>
                <input type="datetime-local" v-model="formTiketBaru.buka" class="form-control" />
              </div>
              <div>
                <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Tutup</label>
                <input type="datetime-local" v-model="formTiketBaru.tutup" class="form-control" />
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 24px;">
              <button class="btn-primary" style="padding:8px 20px; border:none;" @click="tambahTiketSimulasi">💾 Tambahkan</button>
              <button class="btn-outline" @click="resetFormTiket">🔄 Reset</button>
            </div>
            <div style="background: #f7faff; border-radius: 14px; padding: 12px 16px; border: 1px solid #e6edf5;">
              <div v-if="wizardTiketList.length === 0" style="color:#8a9aa8; font-size:13px; font-style:italic; text-align:center;">
                Belum ada tiket yang ditambahkan.
              </div>
              <div v-for="(t, index) in wizardTiketList" :key="index" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e6edf5;">
                <span style="font-size: 14px; font-weight: 600;">{{ t.nama }}</span>
                <span style="font-size: 13px; color: #4a5a6e;">{{ formatRupiah(t.harga) }} · Kuota {{ t.kuota }}</span>
                <button class="btn-outline" style="padding: 4px 8px; font-size: 12px; border-color: #f0c8c8; color: #b83228;" @click="hapusTiketSimulasi(index)">🗑️</button>
              </div>
            </div>
          </div>

          <div style="flex: 0 0 290px;">
            <div style="background: #0a1929; border-radius: 32px; padding: 14px 12px; box-shadow: 0 24px 56px -16px rgba(0,0,0,0.4); height: 500px; display: flex; flex-direction: column;">
              <div style="background: #f8fafc; border-radius: 20px; padding: 14px; flex: 1; overflow-y: auto;">
                <div style="display:flex; justify-content:center; margin-bottom:12px;">
                  <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700;">🎟️ EVENTHUB TICKET</span>
                </div>
                <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); margin-bottom:12px; border:1px solid #e6edf5;">
                  <div style="height:120px; border-radius:10px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:28px; background: linear-gradient(145deg, #2563eb, #3b82f6); background-size: cover; background-position: center;" :style="{ backgroundImage: formEvent.poster_preview ? `url(${formEvent.poster_preview})` : 'none' }">
                    {{ formEvent.poster_preview ? '' : '🚀' }}
                  </div>
                  <div style="font-size:16px; font-weight:800; text-align:center; color:#0a1929;">
                    {{ formEvent.nama || 'Tech Summit 2026' }}
                  </div>
                  <div style="font-size:10px; color:#1a6a4a; background:#e4f0e8; padding:4px 8px; border-radius:6px; text-align:center; font-weight:600; margin:8px auto; width:fit-content;">
                    📅 {{ formEvent.tanggal ? formatDate(formEvent.tanggal) : '20 Mar 2026' }} · 📍 {{ formEvent.lokasi || 'Jakarta' }}
                  </div>
                </div>

                <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); border:1px solid #e6edf5;">
                  <div style="font-weight:700; font-size:11px; color:#0a1929; margin-bottom:8px; display:flex; align-items:center; gap:4px;"><span>🎟️</span> Pilih Tiket</div>
                  <div v-if="wizardTiketList.length === 0" style="color:#8a9aa8;font-size:11px;text-align:center;padding:10px 0;">Tiket belum tersedia</div>
                  <div v-else>
                    <div v-for="(t, idx) in wizardTiketList" :key="idx" style="background: #f7faff; border-radius: 8px; padding: 6px 12px; margin-bottom: 4px; border: 1px solid #e6edf5; font-size: 11px;">
                      ○ {{ t.nama }} &nbsp; {{ formatRupiah(t.harga) }} &nbsp; <span style="color:#8a9aa8;">📊 Sisa {{ t.kuota }}</span>
                    </div>
                  </div>
                  <button style="width:100%; padding:9px; background:#1a6a4a; color:white; border:none; border-radius:40px; font-weight:700; font-size:12px; margin-top:12px;">🛒 Beli Tiket</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 3: FORM BUILDER DRAG & DROP -->
      <div v-show="wizardStepNow === 3" class="wiz-step active">
        <div style="display: flex; gap: 32px; flex-wrap: wrap; flex: 1; min-height: 0;" id="ff-shared-builder-ui">
          <div style="flex: 1.2; min-width: 280px; overflow-y: auto; padding-right: 12px; display: flex; flex-direction: column; gap: 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4 style="margin-bottom:4px;font-weight:600;color:#0a1929;">📋 Form Builder</h4>
                    <p style="font-size:13px;color:#8a9aa8;margin:0;">Tarik elemen ke kanvas untuk membangun form.</p>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn-outline" id="ff-resetGridBtn" style="font-size:12px; padding:6px 12px;">🔄 Reset</button>
                    <button class="btn-outline" id="ff-clearCanvasBtn" style="font-size:12px; padding:6px 12px; border-color:#f0c8c8; color:#b83228;">🗑️ Kosongkan</button>
                </div>
            </div>

            <!-- Panel Tombol Drag -->
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; background: #ffffff; padding: 10px; border-radius: 12px; border: 1px solid #e6edf5;">
                <button class="btn-outline ff-field-type-btn" data-type="short_text" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><span style="font-size:14px;">A</span> <span style="font-size:9px; font-weight:600;">Short Text</span></button>
                <button class="btn-outline ff-field-type-btn" data-type="paragraph" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><span style="font-size:14px;">📝</span> <span style="font-size:9px; font-weight:600;">Paragraph</span></button>
                <button class="btn-outline ff-field-type-btn" data-type="multiple_choice" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><span style="font-size:14px;">🔘</span> <span style="font-size:9px; font-weight:600;">M. Choice</span></button>
                <button class="btn-outline ff-field-type-btn" data-type="checkboxes" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><span style="font-size:14px;">☑️</span> <span style="font-size:9px; font-weight:600;">Checkboxes</span></button>
                <button class="btn-outline ff-field-type-btn" data-type="dropdown" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><span style="font-size:14px;">▼</span> <span style="font-size:9px; font-weight:600;">Dropdown</span></button>
                <button class="btn-outline ff-field-type-btn" data-type="header" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><span style="font-size:14px;">H</span> <span style="font-size:9px; font-weight:600;">Header</span></button>
            </div>

            <!-- Kanvas Drag & Drop -->
            <div id="ff-canvasWrapper" style="background: #fafcfe; border-radius: 16px; border: 2px dashed #c8d6e8; padding: 20px; flex: 1; min-height: 250px; position: relative; overflow: auto; background-image: radial-gradient(circle, #e6edf5 1px, transparent 1px); background-size: 20px 20px;">
                <div id="ff-gridContainer" style="position: relative; width: 100%; min-height: 400px; transition: min-height 0.2s ease;">
                    <div id="ff-dropPreview" style="position: absolute; border: 2px dashed var(--primary); border-radius: 12px; background: rgba(37, 99, 235, 0.1); pointer-events: none; z-index: 50; opacity: 0; visibility: hidden; transition: 0.15s;"></div>
                </div>
            </div>
            
            <div style="font-size:11px; font-weight:500; color:#8a9aa8; display:flex; gap:16px; justify-content:center;">
                <span>🤚 Drag to move</span>
                <span>📐 Resize from corner</span>
                <span>✏️ Click to edit</span>
            </div>
          </div>

          <!-- KANAN: LIVE PREVIEW HP -->
          <div style="flex: 0 0 290px;">
            <div style="background: #0a1929; border-radius: 32px; padding: 14px 12px; box-shadow: 0 24px 56px -16px rgba(0,0,0,0.4); height: 500px; display: flex; flex-direction: column;">
              <div style="background: #f8fafc; border-radius: 20px; padding: 14px; flex: 1; overflow-y: auto;">
                <div style="display:flex; justify-content:center; margin-bottom:12px;">
                  <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700;">🎟️ EVENTHUB TICKET</span>
                </div>
                
                <div class="form-preview" style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); border:1px solid #e6edf5;">
                  <div id="wizardFormCustomPreview">
                      <!-- FormBuilder Items otomatis kerender di sini via JS -->
                  </div>
                  <button style="width:100%; padding:9px; background:#1a6a4a; color:white; border:none; border-radius:40px; font-weight:700; font-size:12px; margin-top:12px;">📝 DAFTAR SEKARANG</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 4: SUMMARY & PUBLISH -->
      <div v-show="wizardStepNow === 4" class="wiz-step active">
        <div style="text-align: center; max-width: 500px; margin: 0 auto; padding: 20px 0;">
          <div style="font-size: 48px; margin-bottom: 16px;">🚀</div>
          <h3 style="font-size: 24px; font-weight: 700; color: #0a1929; margin-bottom: 8px;">Siap Diterbangkan!</h3>
          <p style="font-size: 14px; color: #4a5a6e; line-height: 1.6; margin-bottom: 24px;">
            Event <b>{{ formEvent.nama || 'Baru' }}</b> dengan {{ wizardTiketList.length }} kategori tiket sudah siap dipublikasikan.
          </p>
          <div style="background: #f7faff; border-radius: 16px; padding: 16px; border: 1px solid #e6edf5; text-align: left; font-size: 13px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#8a9aa8;">URL Event:</span>
              <span style="font-weight:600; color:#2563eb;">/{{ formEvent.slug || 'belum-ada-slug' }}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#8a9aa8;">Tanggal:</span>
              <span style="font-weight:600; color:#0a1929;">{{ formEvent.tanggal ? formatDate(formEvent.tanggal) : '-' }}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#8a9aa8;">Tiket & Form:</span>
              <span style="font-weight:600; color:#0a1929;">{{ wizardTiketList.length }} Tiket, Drag & Drop Form Terisi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tombol Navigasi Bawah -->
      <div class="nav-buttons">
        <button class="btn-outline" v-show="wizardStepNow > 1" @click="wizardStepNow--">⬅️ Kembali</button>
        <div style="flex:1"></div>
        <button class="btn-primary" @click="wizardStepNow++" v-if="wizardStepNow < 4">Lanjut ➡️</button>
        <button class="btn-primary" @click="simpanEventBaru" :disabled="isSavingEvent" v-else>
          {{ isSavingEvent ? '⏳ Mempublikasikan...' : '🚀 Publikasikan Event!' }}
        </button>
      </div>
    </div>
  </div>

  <!-- ===== FORM BUILDER PROPERTY MODAL ===== -->
  <div class="wizard-overlay" id="ffPropertyModalOverlay" style="z-index: 1000;">
      <div class="wizard" style="max-width:540px; padding:28px 32px; height:auto; min-height:300px; display:block;">
          <button class="close" onclick="document.getElementById('ffPropertyModalOverlay').classList.remove('open')">✖</button>
          <h3 style="margin-bottom:16px;font-weight:600;color:#0a1929;">✏️ Edit Form Field</h3>
          <div id="ffPropertyContent">
              <!-- Konten dinamis properties akan di-render di sini oleh JS -->
          </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const {
  showWizard, wizardStepNow, formEvent, formTiketBaru, wizardTiketList, isSavingEvent,
  formatDate, currentUser, supabase, muatDaftarEvent
} = useAdmin()

const generateSlug = () => { formEvent.value.slug = formEvent.value.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }

const handlePosterUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { alert('Ukuran poster maksimal 2MB!'); event.target.value = ''; return }
  formEvent.value.poster_file = file
  const reader = new FileReader()
  reader.onload = (e) => { formEvent.value.poster_preview = e.target.result }
  reader.readAsDataURL(file)
}

const formatHargaInput = (e) => {
  let val = e.target.value.replace(/[^,\d]/g, '')
  let parts = val.split(',')
  let sisa = parts[0].length % 3
  let rupiah = parts[0].substr(0, sisa)
  let ribuan = parts[0].substr(sisa).match(/\d{3}/gi)
  if (ribuan) rupiah += (sisa ? '.' : '') + ribuan.join('.')
  formTiketBaru.value.harga = rupiah
}

const formatRupiah = (angka) => {
  if (angka === 0) return 'GRATIS'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const resetFormTiket = () => { formTiketBaru.value = { nama: '', harga: '', kuota: '', buka: '', tutup: '' } }

const tambahTiketSimulasi = () => {
  if (!formTiketBaru.value.nama || !formTiketBaru.value.kuota) { alert('Nama dan Kuota tiket wajib diisi!'); return }
  const hargaRaw = parseInt(formTiketBaru.value.harga.replace(/\./g, '')) || 0
  wizardTiketList.value.push({ nama: formTiketBaru.value.nama, harga: hargaRaw, kuota: parseInt(formTiketBaru.value.kuota) || 0, buka: formTiketBaru.value.buka, tutup: formTiketBaru.value.tutup })
  resetFormTiket()
}
const hapusTiketSimulasi = (index) => { wizardTiketList.value.splice(index, 1) }

const tutupWizard = () => { showWizard.value = false }

const simpanEventBaru = async () => {
  isSavingEvent.value = true
  try {
    const userId = currentUser.value.id
    let finalPosterUrl = null

    if (formEvent.value.poster_file) {
      const file = formEvent.value.poster_file
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const { data: uploadData, error: uploadErr } = await supabase.storage.from('posters').upload(fileName, file)
      if (uploadErr) throw uploadErr
      const { data: urlData } = supabase.storage.from('posters').getPublicUrl(fileName)
      finalPosterUrl = urlData.publicUrl
    }

    const defaultFields = [
      { field_key: 'nama_lengkap', label: 'Nama Lengkap', type: 'short_text', required: true, width: 12 },
      { field_key: 'email', label: 'Email', type: 'short_text', required: true, width: 6 },
      { field_key: 'no_wa', label: 'No. WhatsApp', type: 'phone_wa', required: true, width: 6 }
    ]
    const customFields = window.FormForge ? window.FormForge.getItems() : []
    const finalFields = [...defaultFields, ...customFields]

    const payloadEvent = {
      organizer_id: userId,
      nama_event: formEvent.value.nama || 'Event Baru Tanpa Nama',
      slug: formEvent.value.slug || `event-${Date.now()}`,
      tanggal_mulai: formEvent.value.tanggal || null,
      lokasi: formEvent.value.lokasi || '',
      deskripsi: formEvent.value.deskripsi || '',
      sistem_checkin: 'scanner',
      status: 'published',
      poster_url: finalPosterUrl,
      settings: {
        tipe_event: 'offline',
        pertanyaan_kustom: finalFields,
        is_snk_active: true,
      }
    }

    const { data: insertData, error: insertErr } = await supabase.from('event').insert([payloadEvent]).select()
    if (insertErr) throw insertErr
    const eventIdBaru = insertData[0].id

    if (wizardTiketList.value.length > 0) {
      const payloadTiket = wizardTiketList.value.map(t => {
        return {
          event_id: eventIdBaru,
          nama_kategori: t.nama,
          harga: t.harga,
          kuota_maksimal: t.kuota,
          tanggal_mulai_penjualan: t.buka ? t.buka + ':00' : null,
          tanggal_selesai_penjualan: t.tutup ? t.tutup + ':00' : null
        }
      })
      const { error: tiketErr } = await supabase.from('kategori_tiket').insert(payloadTiket)
      if (tiketErr) throw tiketErr
    }

    alert('✅ Keren! Event berhasil dipublikasikan!')
    tutupWizard()
    await muatDaftarEvent(userId)

  } catch (err) {
    alert('❌ Gagal menyimpan ke Database: ' + err.message)
  } finally {
    isSavingEvent.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.FormForge = (function() {
      const GRID_COLUMNS = 12;
      const MIN_ITEM_WIDTH = 1;
      const MAX_ITEM_WIDTH = 12;
      const MIN_ITEM_HEIGHT = 1;
      const MAX_ITEM_HEIGHT = 6;
      const MIN_ROWS = 10;

      function getDefaultItems() { return []; }

      let items = getDefaultItems();
      let nextId = 1;
      let selectedId = null;

      const gridContainer = document.getElementById('ff-gridContainer');
      const dropPreview = document.getElementById('ff-dropPreview');
      const propertyOverlay = document.getElementById('ffPropertyModalOverlay');
      const propertyContent = document.getElementById('ffPropertyContent');
      
      const FIELD_LABELS = {
          short_text: 'Short Text', paragraph: 'Paragraph', multiple_choice: 'Multiple Choice',
          checkboxes: 'Checkboxes', dropdown: 'Dropdown', header: 'Header'
      };
      
      function generateId() { return 'ff_item_' + (nextId++); }
      function getRect(item) { return { x: item.x, y: item.y, w: item.width, h: item.height }; }
      function rectsOverlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
      function getMaxRow() {
          let maxY = 0;
          for (const item of items) maxY = Math.max(maxY, item.y + item.height);
          return Math.max(maxY, MIN_ROWS);
      }
      function getSelectedItem() { return items.find(it => it.id === selectedId) || null; }
      function slugify(text) { return text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') : 'field'; }
      function escapeHtml(text) { 
          if (!text) return '';
          const div = document.createElement('div'); div.textContent = text; return div.innerHTML; 
      }

      function renderGrid() {
          if(!gridContainer) return;
          const containerRect = gridContainer.getBoundingClientRect();
          const cellW = containerRect.width / GRID_COLUMNS;
          const cellH = cellW;
          const maxRow = getMaxRow();

          gridContainer.style.minHeight = (maxRow * cellH + 20) + 'px';
          gridContainer.style.height = (maxRow * cellH + 20) + 'px';

          gridContainer.querySelectorAll('.ff-grid-item').forEach(el => el.remove());

          for (const item of items) {
              const div = document.createElement('div');
              div.className = 'ff-grid-item' + (item.id === selectedId ? ' selected' : '');
              div.style.position = 'absolute';
              div.style.background = '#fff';
              div.style.border = '1px solid ' + (item.id === selectedId ? '#2563eb' : '#e6edf5');
              div.style.borderRadius = '8px';
              div.style.padding = '8px';
              div.style.boxShadow = item.id === selectedId ? '0 0 0 3px rgba(37,99,235,0.2)' : '0 2px 4px rgba(0,0,0,0.05)';
              div.style.cursor = 'grab';
              div.style.display = 'flex';
              div.style.flexDirection = 'column';
              div.dataset.id = item.id;

              div.style.left = (item.x * cellW + 2) + 'px';
              div.style.top = (item.y * cellH + 2) + 'px';
              div.style.width = (item.width * cellW - 4) + 'px';
              div.style.height = (item.height * cellH - 4) + 'px';

              div.innerHTML = `
                  <div style="font-size:12px; font-weight:600; display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                          ${item.required ? '<span style="color:#d43f34;">*</span>' : ''} ${escapeHtml(item.label)}
                      </span>
                      <span style="display:flex; gap:4px;">
                          <span class="edit-btn" style="cursor:pointer; font-size:14px;">✏️</span>
                          ${item.undeletable ? '' : '<span class="delete-btn" style="cursor:pointer; font-size:14px;">🗑️</span>'}
                      </span>
                  </div>
                  <div style="font-size:10px; color:#8a9aa8; background:#f0f4fa; padding:4px; border-radius:4px; margin-top:auto;">${item.type}</div>
                  <div class="ff-resize-handle" style="position:absolute; bottom:2px; right:2px; width:15px; height:15px; cursor:nwse-resize; background:linear-gradient(135deg, transparent 50%, #8a9aa8 50%); border-radius:0 0 6px 0;"></div>
              `;

              div.addEventListener('mousedown', onItemMouseDown);
              div.addEventListener('click', onItemClick);

              div.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); selectedId = item.id; renderGrid(); renderPreview(); openPropertyModal(); });
              if (!item.undeletable) {
                  div.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteItem(item.id); });
              }
              div.querySelector('.ff-resize-handle').addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); startResize(item.id, e); });

              gridContainer.appendChild(div);
          }
      }

      function renderPreview() {
          let html = '<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: 20px; gap: 4px; width: 100%;">';
          const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
          
          if (sorted.length === 0) {
              html = '<div style="grid-column: 1 / -1; color:#8a9aa8; font-size:10px; text-align:center; padding:10px 0;">Belum ada field tambahan</div>';
          } else {
              for (const item of sorted) {
                  html += `<div style="grid-column: ${item.x + 1} / span ${item.width}; grid-row: ${item.y + 1} / span ${item.height}; min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: transparent;">`;
                  
                  if (item.type === 'header') {
                      html += `<div style="font-size:11px; font-weight:700; color:#0a1929; margin-top:0; border-bottom:1px solid #e6edf5; padding-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}</div>`;
                  } else {
                      html += `<label style="font-size:8px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:3px; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">
                          ${escapeHtml(item.label)}${item.required ? ' <span style="color:#d43f34">*</span>' : ''}
                      </label>`;
                  }
                      
                  if (item.type === 'header') {
                  } else if (item.type === 'short_text') {
                      html += `<input type="text" placeholder="Ketik isian..." disabled style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;" />`;
                  } else if (item.type === 'paragraph') {
                      html += `<textarea placeholder="Ketik teks panjang..." disabled style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; resize:none; box-sizing: border-box;"></textarea>`;
                  } else if (item.type === 'dropdown') {
                      const opts = item.options || ['Opsi 1', 'Opsi 2'];
                      html += `<select disabled style="width:100%; height:100%; padding:4px 6px; border:1px solid #e6edf5; border-radius:6px; font-size:9px; background:#fafcfe; box-sizing: border-box;"><option value="">Pilih opsi...</option>`;
                      opts.forEach(o => html += `<option>${escapeHtml(o)}</option>`);
                      html += `</select>`;
                  } else if (item.type === 'multiple_choice' || item.type === 'checkboxes') {
                      const inputType = item.type === 'multiple_choice' ? 'radio' : 'checkbox';
                      const opts = item.options || ['Opsi 1', 'Opsi 2'];
                      html += `<div style="display:flex; flex-direction:column; gap:4px; font-size:9px; color:#4a5a6e; overflow:auto; height:100%; padding-right: 4px;">`;
                      opts.forEach(o => {
                          html += `<label style="display:flex; align-items:center; gap:3px; flex-shrink: 0;"><input type="${inputType}" disabled style="margin:0; width:10px; height:10px; flex-shrink: 0;" /> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(o)}</span></label>`;
                      });
                      html += `</div>`;
                  }
                  html += `</div>`;
              }
          }
          html += '</div>';
          
          const targets = ['wizardFormCustomPreview'];
          targets.forEach(id => {
              const el = document.getElementById(id);
              if (el) el.innerHTML = html;
          });
      }

      function addItem(type, x, y) {
          let w = (['paragraph', 'header'].includes(type)) ? 12 : 6;
          const item = { id: generateId(), type: type, label: FIELD_LABELS[type] || 'Field', field_key: slugify(FIELD_LABELS[type]), x: x||0, y: y||0, width: w, height: 2, required: false };
          items.push(item); selectedId = item.id;
          renderGrid(); renderPreview(); openPropertyModal();
      }
      function deleteItem(id) { 
          items = items.filter(it => it.id !== id); 
          if(selectedId===id) { selectedId=null; propertyOverlay.classList.remove('open'); } 
          renderGrid(); renderPreview(); 
      }
      function updateItem(id, updates) {
          const item = items.find(it => it.id === id); if(!item) return;
          Object.assign(item, updates); renderGrid(); renderPreview();
      }

      function openPropertyModal() {
          propertyOverlay.classList.add('open');
          const item = getSelectedItem();
          if(!item) { propertyContent.innerHTML = '<div style="color:#8a9aa8; text-align:center;">Pilih field dulu</div>'; return; }
          
          let html = `
              <div style="margin-bottom:12px;">
                  <label style="font-size:12px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:4px;">${item.type === 'header' ? 'Teks Header' : 'Label / Pertanyaan'}</label>
                  <input type="text" id="ffPropLabel" value="${escapeHtml(item.label)}" style="width:100%; padding:8px 12px; border:1px solid #d6e0ea; border-radius:8px;" />
              </div>`;

          if (item.type !== 'header') {
              html += `
              <div style="margin-bottom:12px;">
                  <label style="font-size:12px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:4px;">Field Key (ID Database)</label>
                  <input type="text" id="ffPropKey" value="${escapeHtml(item.field_key)}" style="width:100%; padding:8px 12px; border:1px solid #d6e0ea; border-radius:8px;" />
              </div>
              <div style="margin-bottom:12px;">
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600; font-size:13px; color:#0a1929;">
                      <input type="checkbox" id="ffPropReq" ${item.required ? 'checked' : ''} style="width:16px; height:16px; accent-color:#2563eb;" /> Wajib diisi (Required)
                  </label>
              </div>`;
          }

          if (['multiple_choice', 'checkboxes', 'dropdown'].includes(item.type)) {
              const opts = item.options || ['Opsi 1', 'Opsi 2'];
              item.options = opts;
              html += `
              <div style="margin-top:16px;">
                  <label style="font-size:12px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:4px;">Pilihan Opsi</label>
                  <div id="ffOptionsList" style="display:flex; flex-direction:column; gap:6px;">`;
              opts.forEach((opt, idx) => {
                  html += `
                      <div style="display:flex; gap:6px; align-items:center;">
                          <input type="text" value="${escapeHtml(opt)}" class="ff-opt-input" data-index="${idx}" style="flex:1; padding:6px 10px; border:1px solid #d6e0ea; border-radius:6px; font-size:12px;" />
                          <button class="ff-opt-del" data-index="${idx}" style="background:#fde8e6; color:#b83228; border:1px solid #f0c8c8; border-radius:6px; padding:4px 8px; cursor:pointer;">🗑️</button>
                      </div>`;
              });
              html += `
                  </div>
                  <button id="ffOptAdd" style="margin-top:8px; padding:6px 12px; background:white; border:1px solid #d6e0ea; border-radius:6px; font-size:12px; cursor:pointer;">+ Tambah Opsi</button>
              </div>`;
          }

          propertyContent.innerHTML = html;

          document.getElementById('ffPropLabel').addEventListener('input', function() {
              const newKey = item.field_key === slugify(item.label) ? slugify(this.value) : item.field_key;
              updateItem(item.id, { label: this.value, field_key: newKey });
              if (document.getElementById('ffPropKey') && item.field_key === slugify(item.label)) document.getElementById('ffPropKey').value = newKey;
          });
          if (document.getElementById('ffPropKey')) {
              document.getElementById('ffPropKey').addEventListener('input', function() { updateItem(item.id, { field_key: this.value }); });
          }
          if (document.getElementById('ffPropReq')) {
              document.getElementById('ffPropReq').addEventListener('change', function() { updateItem(item.id, { required: this.checked }); });
          }
          
          if (['multiple_choice', 'checkboxes', 'dropdown'].includes(item.type)) {
              document.querySelectorAll('.ff-opt-input').forEach(input => {
                  input.addEventListener('input', function() { item.options[this.dataset.index] = this.value; renderGrid(); renderPreview(); });
              });
              document.querySelectorAll('.ff-opt-del').forEach(btn => {
                  btn.addEventListener('click', function() {
                      if(item.options.length > 1) { item.options.splice(this.dataset.index, 1); renderGrid(); renderPreview(); openPropertyModal(); }
                  });
              });
              document.getElementById('ffOptAdd').addEventListener('click', function() {
                  item.options.push('Opsi ' + (item.options.length + 1)); renderGrid(); renderPreview(); openPropertyModal();
              });
          }
      }

      function recalcWaterfall() {
          items.sort((a, b) => a.y - b.y || a.x - b.x);
          let needsRecheck = true;
          while(needsRecheck) {
              needsRecheck = false;
              for(let i=0; i<items.length; i++) {
                  for(let j=0; j<i; j++) {
                      if(rectsOverlap(getRect(items[i]), getRect(items[j]))) {
                          items[i].y = items[j].y + items[j].height;
                          needsRecheck = true;
                      }
                  }
              }
              if(needsRecheck) items.sort((a, b) => a.y - b.y || a.x - b.x);
          }
      }

      let dragState = null;
      function onItemMouseDown(e) {
          const itemEl = e.target.closest('.ff-grid-item');
          if (!itemEl || e.target.closest('.ff-resize-handle') || e.target.closest('span[style*="cursor:pointer"]')) return;
          e.preventDefault();
          const item = items.find(it => it.id === itemEl.dataset.id);
          if (!item) return;
          
          const rect = gridContainer.getBoundingClientRect();
          const cellW = rect.width / GRID_COLUMNS;
          dragState = {
              id: item.id, startX: item.x, startY: item.y,
              offX: (e.clientX - (item.x * cellW + rect.left)) / cellW,
              offY: (e.clientY - (item.y * cellW + rect.top)) / cellW,
              dragging: false
          };
          document.addEventListener('mousemove', onDragMove);
          document.addEventListener('mouseup', onDragEnd);
      }
      function onDragMove(e) {
          if (!dragState) return;
          const rect = gridContainer.getBoundingClientRect();
          const cellW = rect.width / GRID_COLUMNS;
          const col = Math.round((e.clientX - rect.left - dragState.offX * cellW) / cellW);
          const row = Math.round((e.clientY - rect.top - dragState.offY * cellW) / cellW);
          
          const item = items.find(it => it.id === dragState.id);
          item._dragX = Math.max(0, Math.min(col, GRID_COLUMNS - item.width));
          item._dragY = Math.max(0, row);

          if(!dragState.dragging) {
              dragState.dragging = true;
              gridContainer.querySelector(`[data-id="${item.id}"]`).style.opacity = '0.5';
          }
          
          dropPreview.style.left = (item._dragX * cellW + 2) + 'px';
          dropPreview.style.top = (item._dragY * cellW + 2) + 'px';
          dropPreview.style.width = (item.width * cellW - 4) + 'px';
          dropPreview.style.height = (item.height * cellW - 4) + 'px';
          dropPreview.style.visibility = 'visible'; dropPreview.style.opacity = '1';

          const el = gridContainer.querySelector(`[data-id="${item.id}"]`);
          if(el) {
              el.style.left = (item._dragX * cellW + 2) + 'px';
              el.style.top = (item._dragY * cellW + 2) + 'px';
          }
      }
      function onDragEnd(e) {
          if (!dragState) return;
          const item = items.find(it => it.id === dragState.id);
          if (item) {
              item.x = item._dragX !== undefined ? item._dragX : item.x;
              item.y = item._dragY !== undefined ? item._dragY : item.y;
              delete item._dragX; delete item._dragY;
              recalcWaterfall();
          }
          dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0';
          dragState = null;
          document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd);
          renderGrid(); renderPreview();
      }

      let resizeState = null;
      function startResize(id, e) {
          const item = items.find(it => it.id === id); if(!item) return;
          const rect = gridContainer.getBoundingClientRect();
          resizeState = { id, startX: e.clientX, startY: e.clientY, startW: item.width, startH: item.height, cellW: rect.width / GRID_COLUMNS };
          document.addEventListener('mousemove', onResizeMove); document.addEventListener('mouseup', onResizeEnd);
      }
      function onResizeMove(e) {
          if (!resizeState) return;
          const dx = (e.clientX - resizeState.startX) / resizeState.cellW;
          const dy = (e.clientY - resizeState.startY) / resizeState.cellW;
          const item = items.find(it => it.id === resizeState.id);
          let newW = Math.max(MIN_ITEM_WIDTH, Math.min(MAX_ITEM_WIDTH, Math.round(resizeState.startW + dx)));
          let newH = Math.max(MIN_ITEM_HEIGHT, Math.min(MAX_ITEM_HEIGHT, Math.round(resizeState.startH + dy)));
          
          item._resW = newW; item._resH = newH;
          
          dropPreview.style.left = (item.x * resizeState.cellW + 2) + 'px';
          dropPreview.style.top = (item.y * resizeState.cellW + 2) + 'px';
          dropPreview.style.width = (newW * resizeState.cellW - 4) + 'px';
          dropPreview.style.height = (newH * resizeState.cellW - 4) + 'px';
          dropPreview.style.visibility = 'visible'; dropPreview.style.opacity = '1';

          const el = gridContainer.querySelector(`[data-id="${item.id}"]`);
          if(el) { el.style.width = (newW * resizeState.cellW - 4) + 'px'; el.style.height = (newH * resizeState.cellW - 4) + 'px'; }
      }
      function onResizeEnd(e) {
          if (!resizeState) return;
          const item = items.find(it => it.id === resizeState.id);
          if (item) {
              item.width = item._resW !== undefined ? item._resW : item.width;
              item.height = item._resH !== undefined ? item._resH : item.height;
              delete item._resW; delete item._resH;
              recalcWaterfall();
          }
          dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0';
          resizeState = null;
          document.removeEventListener('mousemove', onResizeMove); document.removeEventListener('mouseup', onResizeEnd);
          renderGrid(); renderPreview();
      }

      let sideDrag = null;
      document.querySelectorAll('.ff-field-type-btn').forEach(btn => {
          btn.addEventListener('mousedown', e => {
              const type = btn.dataset.type;
              const clone = document.createElement('div');
              clone.textContent = FIELD_LABELS[type] || type;
              clone.style.position = 'fixed'; clone.style.background = '#fff'; clone.style.border = '2px solid #2563eb'; clone.style.padding = '8px 16px'; clone.style.borderRadius = '8px'; clone.style.fontWeight = 'bold'; clone.style.zIndex = '10000'; clone.style.pointerEvents = 'none';
              clone.style.left = e.clientX + 'px'; clone.style.top = e.clientY + 'px';
              document.body.appendChild(clone);
              sideDrag = { type, clone, dragging: false };
              document.addEventListener('mousemove', onSideMove); document.addEventListener('mouseup', onSideEnd);
              e.preventDefault();
          });
      });
      function onSideMove(e) {
          if(!sideDrag) return;
          sideDrag.clone.style.left = e.clientX + 'px'; sideDrag.clone.style.top = e.clientY + 'px';
          
          const rect = gridContainer.getBoundingClientRect();
          if(!rect) return;
          const isOver = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
          if(isOver) {
              const cellW = rect.width / GRID_COLUMNS;
              const col = Math.max(0, Math.min(GRID_COLUMNS - 6, Math.round((e.clientX - rect.left) / cellW)));
              const row = Math.max(0, Math.round((e.clientY - rect.top) / cellW));
              
              dropPreview.style.left = (col * cellW + 2) + 'px'; dropPreview.style.top = (row * cellW + 2) + 'px';
              dropPreview.style.width = (6 * cellW - 4) + 'px'; dropPreview.style.height = (2 * cellW - 4) + 'px';
              dropPreview.style.visibility = 'visible'; dropPreview.style.opacity = '1';
          } else {
              dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0';
          }
      }
      function onSideEnd(e) {
          if(!sideDrag) return;
          const rect = gridContainer.getBoundingClientRect();
          if(!rect) { sideDrag.clone.remove(); sideDrag = null; return; }
          const isOver = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
          if(isOver) {
              const cellW = rect.width / GRID_COLUMNS;
              const col = Math.max(0, Math.min(GRID_COLUMNS - 6, Math.round((e.clientX - rect.left) / cellW)));
              const row = Math.max(0, Math.round((e.clientY - rect.top) / cellW));
              addItem(sideDrag.type, col, row);
          }
          sideDrag.clone.remove(); dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0';
          document.removeEventListener('mousemove', onSideMove); document.removeEventListener('mouseup', onSideEnd);
          sideDrag = null;
      }

      function onItemClick(e) {
          const itemEl = e.target.closest('.ff-grid-item');
          if (!itemEl || e.target.closest('span[style*="cursor:pointer"]') || e.target.closest('.ff-resize-handle')) return;
          selectedId = itemEl.dataset.id;
          renderGrid(); renderPreview(); openPropertyModal();
      }

      const resetBtn = document.getElementById('ff-resetGridBtn');
      if (resetBtn) resetBtn.addEventListener('click', () => { items = getDefaultItems(); nextId = 1; selectedId = null; renderGrid(); renderPreview(); });
      const clearBtn = document.getElementById('ff-clearCanvasBtn');
      if (clearBtn) clearBtn.addEventListener('click', () => { if(confirm('Hapus semua form tambahan?')) { items = []; selectedId = null; renderGrid(); renderPreview(); } });

      return {
          getItems: () => items,
          setItems: (newItems) => { 
              items = newItems || [];
              recalcWaterfall(); renderGrid(); renderPreview(); 
          },
          refresh: () => { renderGrid(); renderPreview(); }
      };
    })();
  }
})
</script>
