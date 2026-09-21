<template>
  <div id="page-settings">
    <h2 class="page-title" style="margin-bottom:18px;">⚙️ Settings</h2>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">🔐 Akun Admin</h4>
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
        {{ isSavingPass ? '⏳ Menyimpan...' : '💾 Simpan Password' }}
      </button>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">🏢 Profil Organizer (Publik)</h4>
      <p style="font-size:13px; color:#8a9aa8; margin-bottom:14px;">Informasi ini akan tampil di halaman pendaftaran event sebagai kontak penyelenggara.</p>
      <div class="row mb-3">
        <div class="col">
          <label class="form-label" style="margin-bottom:4px;">Nama Organizer</label>
          <input type="text" v-model="profil.nama_organizer" class="form-control" placeholder="Contoh: EventHub Organizer" />
        </div>
        <div class="col">
          <label class="form-label" style="margin-bottom:4px;">No. WhatsApp Utama</label>
          <input type="text" v-model="profil.no_wa" class="form-control" placeholder="Contoh: 6281234567890" />
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
      <button class="btn-primary" @click="simpanProfilOrganizer" :disabled="isSavingProfil">
        {{ isSavingProfil ? '⏳ Menyimpan...' : '💾 Simpan Profil' }}
      </button>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">🔑 Akses Crew (Scanner QR)</h4>
      <div class="flex" style="flex-wrap:wrap;align-items:center;">
        <label style="font-weight:500;font-size:14px;">PIN Global:</label>
        <input :type="showPin ? 'text' : 'password'" v-model="profil.pin_scanner" class="filter-control" style="width:140px;" />
        <button class="btn-outline" @click="showPin = !showPin">👁️</button>
        <button class="btn-primary" @click="simpanProfilOrganizer" :disabled="isSavingProfil">💾 Simpan</button>
      </div>
      <div style="margin-top:10px;">
        <label class="form-label">📲 Link Scanner</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <code style="background:#f0f4fa;padding:10px 18px;border-radius:40px;font-size:12px;word-break:break-all;font-family:Inter;">{{ scannerLink }}</code>
          <button class="btn-outline" @click="copyText(scannerLink, 'Link Scanner')">📋 Salin</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;">🎨 Preferensi</h4>
      <div class="flex" style="flex-wrap:wrap;align-items:center;">
        <label style="display:flex;align-items:center;gap:8px;font-weight:400;font-size:14px;">
          <input type="checkbox" style="width:18px;height:18px;" /> ☾ Mode Gelap
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-weight:400;font-size:14px;">
          🌐 Bahasa 
          <select class="filter-control"><option>Indonesia</option><option>English</option></select>
        </label>
        <button class="btn-primary">💾 Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { userEmail, currentUser, supabase, showToast, organizerProfile, muatProfilOrganizer } = useAdmin()

const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
const scannerLink = computed(() => `${baseUrl}/scanner?email=${encodeURIComponent(userEmail.value)}`)

const pass = ref({ old: '', new: '', confirm: '' })
const isSavingPass = ref(false)

const profil = ref({ nama_organizer: '', no_wa: '', link_ig: '', link_web: '', pin_scanner: '123456' })
const isSavingProfil = ref(false)
const showPin = ref(false)

watch(organizerProfile, (val) => {
  if (val) {
    profil.value = {
      nama_organizer: val.nama_organizer || '',
      no_wa: val.no_wa || '',
      link_ig: val.link_ig || '',
      link_web: val.link_web || '',
      pin_scanner: val.pin_scanner || '123456'
    }
  }
}, { immediate: true })

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
      id: currentUser.value.id,
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
