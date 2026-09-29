<template>
  <div id="page-settings">
    <h2 class="page-title" style="margin-bottom:18px;"><Icon name="lucide:settings" style="margin-right:4px;" /> Settings</h2>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;"><Icon name="lucide:user-cog" style="margin-right:6px; color: var(--primary);" /> Akun Admin</h4>
      <div style="margin-bottom:14px;"><label class="form-label">Email</label><div style="font-weight:500;font-size:15px;">{{ userEmail }}</div></div>
      
      <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
        <div>
          <label class="form-label" style="margin-bottom:4px;">Password Lama</label>
          <input type="password" v-model="pass.old" class="form-control" placeholder="Masukkan password lama" />
        </div>
        <div>
          <label class="form-label" style="margin-bottom:4px;">Password Baru</label>
          <input type="password" v-model="pass.new" class="form-control" placeholder="Minimal 6 karakter" />
        </div>
        <div>
          <label class="form-label" style="margin-bottom:4px;">Konfirmasi Password</label>
          <input type="password" v-model="pass.confirm" class="form-control" placeholder="Ulangi password baru" />
        </div>
      </div>

      <button class="btn-primary" style="margin-top:16px;" @click="ubahPassword" :disabled="isSavingPass">
        <template v-if="isSavingPass"><Icon name="lucide:loader-2" class="spin" style="margin-right:4px;" /> Menyimpan...</template><template v-else><Icon name="lucide:save" style="margin-right:4px;" /> Simpan Password</template>
      </button>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;"><Icon name="lucide:building" style="margin-right:6px; color: var(--primary);" /> Profil Organizer (Publik)</h4>
      <p style="font-size:13px; color:#8a9aa8; margin-bottom:14px;">Informasi ini akan tampil di halaman pendaftaran event sebagai kontak penyelenggara.</p>
      
      <div class="row mb-3">
        <div class="col" style="flex: 1;">
          <label class="form-label" style="margin-bottom:8px; display:block;">Logo Organizer</label>
          <div v-if="profil.logo_url" style="display:flex; align-items:center; gap:12px; background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #e6edf5; width: fit-content;">
            <img :src="fixPosterUrl(profil.logo_url)" style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px; background: white; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);" />
            <div>
              <div style="font-size:12px; font-weight:600; color:#0a1929; margin-bottom:4px;">Logo Tersimpan</div>
              <button class="btn-outline danger btn-sm" @click="hapusLogo" style="font-size: 11px; padding: 6px 12px;"><Icon name="lucide:trash-2" style="margin-right:4px;" /> Hapus Logo</button>
            </div>
          </div>
          <div v-else style="background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #e6edf5; display: flex; flex-direction: column; gap: 8px; max-width: 300px;">
            <span style="font-size:11px; color:#4a5a6e;">Pilih gambar logo untuk diunggah (Maks 2MB)</span>
            <input type="file" class="form-control" accept="image/*" @change="uploadLogo" :disabled="isUploadingLogo" style="font-size: 12px;" />
            <div v-if="isUploadingLogo" style="font-size: 11px; color: var(--primary); display: flex; align-items: center; gap: 4px;"><Icon name="lucide:loader-2" class="spin" /> Mengunggah...</div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <label class="form-label" style="margin-bottom:4px;">Nama Organizer</label>
          <input type="text" v-model="profil.nama_organizer" class="form-control" placeholder="Contoh: EventHub Organizer" />
        </div>
        <div class="col">
          <label class="form-label" style="margin-bottom:4px;">No. WhatsApp Utama</label>
          <div style="display:flex; align-items:stretch; background:var(--bg-main); border:1px solid var(--border-soft); border-radius:12px; overflow:hidden;">
            <input type="text" :value="wa_cc" @input="handleCCChange" class="form-control" style="width:70px; text-align:center; font-weight:600; border:none; border-right: 1px solid var(--border-soft); border-radius:0; background:var(--card-light);" placeholder="62" />
            <input type="tel" :value="displayWa" @input="handleWaInput" class="form-control" style="border:none; border-radius:0; flex-grow:1; box-shadow:none; padding-left:12px;" placeholder="81234567890" />
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <label class="form-label" style="margin-bottom:4px;">Link Instagram</label>
          <input type="url" v-model="profil.link_ig" class="form-control" placeholder="https://instagram.com/..." />
        </div>
        <div class="col">
          <label class="form-label" style="margin-bottom:4px;">Link Website</label>
          <input type="url" v-model="profil.link_web" class="form-control" placeholder="https://..." />
        </div>
      </div>

      <div id="bank-section" :class="{'highlight-pulse': isHighlightBank}" style="margin: 24px 0 16px; border-top: 1px dashed #e2e8f0; padding-top: 16px; padding: 16px; border-radius: 12px; transition: 0.3s;">
        <h4 style="margin-bottom:12px;font-weight:600;color:#0a1929;"><Icon name="lucide:landmark" style="margin-right:6px; color: var(--primary);" /> Rekening Pencairan Dana</h4>
        <div class="row mb-3" style="gap:12px; display:flex; flex-wrap: wrap;">
          <div class="col" style="flex:1; min-width: 150px;">
            <label class="form-label" style="margin-bottom:4px;">Nama Bank</label>
            <input type="text" v-model="profil.bank_nama" class="form-control" placeholder="BCA / Mandiri / BNI" />
          </div>
          <div class="col" style="flex:1; min-width: 150px;">
            <label class="form-label" style="margin-bottom:4px;">Nomor Rekening</label>
            <input type="text" v-model="profil.bank_rekening" class="form-control" placeholder="1234567890" />
          </div>
          <div class="col" style="flex:1; min-width: 150px;">
            <label class="form-label" style="margin-bottom:4px;">Atas Nama</label>
            <input type="text" v-model="profil.bank_atas_nama" class="form-control" placeholder="Nama Pemilik Rekening" />
          </div>
        </div>
      </div>

      <button class="btn-primary" @click="simpanProfilOrganizer" :disabled="isSavingProfil">
        <template v-if="isSavingProfil"><Icon name="lucide:loader-2" class="spin" style="margin-right:4px;" /> Menyimpan...</template><template v-else><Icon name="lucide:save" style="margin-right:4px;" /> Simpan Profil</template>
      </button>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;"><Icon name="lucide:key" style="margin-right:6px; color: var(--primary);" /> Akses Crew (Scanner QR)</h4>
      <div class="flex" style="flex-wrap:wrap;align-items:center;">
        <label style="font-weight:500;font-size:14px;">PIN Global:</label>
        <input :type="showPin ? 'text' : 'password'" v-model="profil.pin_scanner" class="filter-control" style="width:140px;" />
        <button class="btn-outline" @click="showPin = !showPin"><Icon name="lucide:eye" /></button>
        <button class="btn-primary" @click="simpanProfilOrganizer" :disabled="isSavingProfil"><Icon name="lucide:save" style="margin-right:4px;" /> Simpan</button>
      </div>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;"><Icon name="lucide:palette" style="margin-right:6px; color: var(--primary);" /> Preferensi</h4>
      <div class="flex" style="flex-wrap:wrap;align-items:center;">
        <label style="display:flex;align-items:center;gap:8px;font-weight:400;font-size:14px;">
          <input type="checkbox" style="width:18px;height:18px;" /> <Icon name="lucide:moon" style="margin-right:4px;" /> Mode Gelap
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-weight:400;font-size:14px;">
          <Icon name="lucide:globe" style="margin-right:4px;" /> Bahasa 
          <select class="filter-control"><option>Indonesia</option><option>English</option></select>
        </label>
        <button class="btn-primary"><Icon name="lucide:save" style="margin-right:4px;" /> Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { userEmail, currentUser, supabase, showToast, organizerProfile, muatProfilOrganizer } = useAdmin()

const route = useRoute()
const isHighlightBank = ref(false)

const baseUrl = ref('')
const isLoadingProfil = ref(true)

const scannerLink = computed(() => `${baseUrl.value}/scanner?email=${encodeURIComponent(userEmail.value)}`)
const pass = ref({ old: '', new: '', confirm: '' })
const isSavingPass = ref(false)
const profil = ref({ nama_organizer: '', no_wa: '', link_ig: '', link_web: '', pin_scanner: '123456', logo_url: '' })
const isSavingProfil = ref(false)
const showPin = ref(false)
const isUploadingLogo = ref(false)

const wa_cc = ref('62')
const handleCCChange = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  e.target.value = val // paksa DOM langsung berubah
  wa_cc.value = val
  let clean = displayWa.value
  profil.value.no_wa = clean ? wa_cc.value + clean : ''
}

const handleWaInput = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  if (val.startsWith('0')) val = val.substring(1)
  if (val.startsWith(wa_cc.value)) val = val.substring(wa_cc.value.length)
  e.target.value = val // paksa DOM langsung berubah
  profil.value.no_wa = val ? wa_cc.value + val : ''
}

const displayWa = computed(() => {
  let raw = profil.value.no_wa || ''
  raw = raw.replace(/\D/g, '')
  if (raw.startsWith(wa_cc.value)) return raw.substring(wa_cc.value.length)
  if (raw.startsWith('0')) return raw.substring(1)
  return raw
})

onMounted(async () => {
  baseUrl.value = window.location.origin
  
  // Ambil data SECARA LANGSUNG dari Supabase (Bypass global state)
  try {
    isLoadingProfil.value = true
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase.from('organizer_profile').select('*').eq('id', user.id).maybeSingle()
      if (error) {
        console.warn('Gagal menarik profil:', error.message)
      } else if (data) {
        let loadedWa = data.no_wa || ''
        if (loadedWa.startsWith('62')) {
          wa_cc.value = '62'
        } else {
          // just leave it as 62, or extract if needed. Since our system expects 62 by default:
          // We can try to extract CC if we implement a complex parser, but assuming mostly '62' or local
        }
        
        profil.value = {
          nama_organizer: data.nama_organizer || '',
          no_wa: loadedWa,
          link_ig: data.link_ig || '',
          link_web: data.link_web || '',
          pin_scanner: data.pin_scanner || '123456',
          logo_url: data.logo_url || '',
          bank_nama: data.bank_nama || '',
          bank_rekening: data.bank_rekening || '',
          bank_atas_nama: data.bank_atas_nama || ''
        }
      }
    }
  } catch (err) {
    console.error('Error langsung settings:', err)
  } finally {
    isLoadingProfil.value = false
  }

  // Logika Highlight & Scroll
  if (route.query.highlight === 'rekening') {
    setTimeout(() => {
      const bankSec = document.getElementById('bank-section')
      if (bankSec) {
        bankSec.scrollIntoView({ behavior: 'smooth', block: 'center' })
        isHighlightBank.value = true
        // Matikan efek highlight setelah 3 detik
        setTimeout(() => { isHighlightBank.value = false }, 3000)
      }
    }, 500)
  }
})

const fixPosterUrl = (url) => {
  if (!url) return ''
  return url.replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
}

const uploadLogo = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran logo maksimal 2MB!', 'error')
    e.target.value = ''
    return
  }
  
  isUploadingLogo.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Upload file to Supabase storage 'logos'
    const { error: uploadErr } = await supabase.storage.from('logos').upload(fileName, file)
    if (uploadErr) throw uploadErr
    
    // Get public URL
    const publicUrl = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl
    profil.value.logo_url = publicUrl
    
    // Auto save profile
    await simpanProfilOrganizer()
  } catch(err) {
    showToast('Gagal mengunggah logo: ' + err.message, 'error')
  } finally {
    isUploadingLogo.value = false
    e.target.value = ''
  }
}

const hapusLogo = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus logo organizer?')) return
  profil.value.logo_url = ''
  await simpanProfilOrganizer()
}

const ubahPassword = async () => {
  if (!pass.value.old || !pass.value.new || !pass.value.confirm) return showToast('Harap isi semua kolom password!', 'error')
  if (pass.value.new !== pass.value.confirm) return showToast('Password baru tidak cocok!', 'error')
  if (pass.value.new.length < 6) return showToast('Password minimal 6 karakter!', 'error')

  isSavingPass.value = true
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: userEmail.value, password: pass.value.old })
    if (signInError) throw new Error('Password lama salah!')

    const { error: updateError } = await supabase.auth.updateUser({ password: pass.value.new })
    if (updateError) throw updateError
    
    showToast('Password berhasil diubah!', 'success')
    pass.value = { old: '', new: '', confirm: '' }
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSavingPass.value = false
  }
}

const simpanProfilOrganizer = async () => {
  isSavingProfil.value = true
  try {
    const payload = {
      id: currentUser.value?.id || currentUser.value?.sub,
      ...profil.value,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('organizer_profile').upsert(payload)
    if (error) throw error
    showToast('Profil Organizer berhasil disimpan!', 'success')
    await muatProfilOrganizer()
  } catch (err) {
    showToast('Gagal menyimpan profil: ' + err.message, 'error')
  } finally {
    isSavingProfil.value = false
  }
}

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast(label + ' berhasil disalin!', 'success')
  } catch (err) {
    showToast('Gagal menyalin: ' + err, 'error')
  }
}
</script>

<style scoped>
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.highlight-pulse {
  animation: glowRed 1.5s ease-in-out 2;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid #ef4444 !important;
}

@keyframes glowRed {
  0%, 100% { box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
  50% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
}
</style>

