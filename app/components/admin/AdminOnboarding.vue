<template>
  <div class="wizard-overlay" :class="{ open: showOnboarding }" style="z-index: 10000;">
    <div class="wizard" style="max-width:480px; padding:32px; text-align:center; height: auto;">
      <h2 style="margin-bottom:8px; color:#0a1929;">Selamat Datang! 🎉</h2>
      <p style="color:#8a9aa8; font-size:14px; margin-bottom:24px;">Sebelum mulai membuat event, yuk lengkapi profil organizer kamu. Data ini akan tampil otomatis di setiap halaman pendaftaran.</p>

      <div class="mb-3" style="text-align:left;">
        <label class="form-label">Nama Organizer <span style="color:#d43f34">*</span></label>
        <input type="text" v-model="form.nama" class="form-control" placeholder="Contoh: EventHub Organizer">
      </div>

      <div class="mb-3" style="text-align:left;">
        <label class="form-label">No. WhatsApp Utama</label>
        <input type="text" v-model="form.wa" class="form-control" placeholder="Contoh: 6281234567890">
      </div>

      <div class="mb-3" style="text-align:left;">
        <label class="form-label">PIN Akses Scanner</label>
        <input type="text" v-model="form.pin" class="form-control" placeholder="123456">
        <div style="font-size:11px; color:#8a9aa8; margin-top:4px;">PIN rahasia ini digunakan volunteer untuk login ke sistem Scanner QR.</div>
      </div>

      <button class="btn-primary" @click="simpan" :disabled="loading" style="width:100%; padding:14px; font-size:15px; margin-top:16px;">
        {{ loading ? '<Icon name="lucide:hourglass" style="margin-right:4px;" /> Menyimpan...' : '<Icon name="lucide:send" style="margin-right:4px;" /> Simpan & Mulai' }}
      </button>
      <button class="btn-outline" @click="showOnboarding = false" style="width:100%; border:none; margin-top:8px;">Nanti Saja (Lewati)</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { showOnboarding, currentUser, supabase, showToast, muatProfilOrganizer } = useAdmin()

const form = ref({ nama: '', wa: '', pin: '123456' })
const loading = ref(false)

const simpan = async () => {
  if (!form.value.nama) {
    showToast('Nama Organizer wajib diisi!', 'error')
    return
  }
  loading.value = true
  try {
    const payload = {
      id: currentUser.value.id,
      nama_organizer: form.value.nama,
      no_wa: form.value.wa,
      pin_scanner: form.value.pin || '123456',
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('organizer_profile').upsert(payload)
    if (error) throw error
    
    showToast('Profil berhasil disimpan! Selamat datang!', 'success')
    showOnboarding.value = false
    await muatProfilOrganizer()
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.mb-3 { margin-bottom: 16px; }
.form-label { font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.3px; }
</style>
