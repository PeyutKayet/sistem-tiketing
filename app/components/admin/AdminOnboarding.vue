<template>
  <div class="wizard-overlay" :class="{ open: showOnboarding }" style="z-index: 10000;">
    <div class="wizard" style="max-width:480px; padding:32px; text-align:center; height: auto;">
      <h2 style="margin-bottom:8px; color:#0a1929;">Selamat Datang! 🎉</h2>
      <p style="color:#8a9aa8; font-size:14px; margin-bottom:24px;">Sebelum mulai membuat event, yuk lengkapi profil organizer kamu. Data ini akan tampil otomatis di setiap halaman pendaftaran.</p>

      <div class="mb-3" style="text-align:left;">
        <label class="form-label">Nama Organizer <span style="color:#d43f34">*</span></label>
        <input type="text" v-model="form.nama" class="form-control" placeholder="Contoh: Nama EO / BEM Kampus">
      </div>

      <div class="mb-3" style="text-align:left;">
        <label class="form-label">No. WhatsApp Utama</label>
        <div style="display:flex; gap:8px;">
          <input type="text" v-model="form.wa_cc" class="form-control" style="width:70px; text-align:center; padding: 10px 4px;" placeholder="62">
          <input type="text" v-model="waDisplay" class="form-control" style="flex:1;" placeholder="81234567890">
        </div>
      </div>

      <div class="mb-3" style="text-align:left;">
        <label class="form-label">PIN Akses Scanner <span style="color:#d43f34">*</span></label>
        <input
          type="text"
          v-model="form.pin"
          class="form-control"
          :style="form.pin && pinError ? 'border-color:#d43f34;' : ''"
          placeholder="Buat PIN 6 digit angka (bukan 123456)"
          maxlength="6"
          inputmode="numeric"
          @input="form.pin = form.pin.replace(/\D/g, '')"
        >
        <div v-if="form.pin && pinError" style="font-size:11px; color:#d43f34; margin-top:4px;">⚠️ {{ pinError }}</div>
        <div v-else style="font-size:11px; color:#8a9aa8; margin-top:4px;">PIN rahasia ini digunakan volunteer untuk login ke sistem Scanner QR.</div>
      </div>

      <button class="btn-primary" @click="simpan" :disabled="loading || !isFormValid" style="width:100%; padding:14px; font-size:15px; margin-top:16px;">
        {{ loading ? 'Menyimpan...' : 'Simpan & Mulai' }}
      </button>
      <button 
        v-if="canSkip" 
        class="btn-outline" 
        @click="showOnboarding = false" 
        style="width:100%; border:none; margin-top:8px;"
      >
        Nanti Saja (Lewati)
      </button>
      <div v-else style="font-size:11px; color:#ef4444; margin-top:12px; font-weight:600; line-height:1.4;">
        🛡️ Demi keamanan gerbang acara Anda, wajib membuat PIN Scanner 6 digit kustom sebelum memulai.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { showOnboarding, currentUser, organizerProfile, supabase, showToast, muatProfilOrganizer } = useAdmin()

// PIN default dikosongkan — user wajib buat sendiri
const form = ref({ nama: '', wa_cc: '62', wa_raw: '', pin: '' })
const loading = ref(false)

const canSkip = computed(() => {
  const currentPin = organizerProfile.value?.pin_scanner
  const currentName = organizerProfile.value?.nama_organizer
  return Boolean(currentName && currentPin && currentPin !== '123456')
})

const waDisplay = computed({
  get: () => form.value.wa_raw,
  set: (val) => {
    let clean = val.replace(/\D/g, '')
    if (clean.startsWith('0')) clean = clean.substring(1)
    if (form.value.wa_cc === '62' && clean.startsWith('62')) clean = clean.substring(2)
    form.value.wa_raw = clean
  }
})

// Validasi PIN: wajib 6 digit angka dan tidak boleh 123456 / kombinasi mudah ditebak
const pinError = computed(() => {
  const pin = form.value.pin
  if (!pin) return 'PIN wajib diisi.'
  if (pin.length !== 6) return 'PIN harus tepat 6 digit angka.'
  if (pin === '123456' || pin === '654321') return 'PIN terlalu mudah ditebak, gunakan kombinasi angka lain.'
  if (/^(\d)\1{5}$/.test(pin)) return 'PIN tidak boleh angka kembar (misal 000000 atau 111111).'
  return ''
})

// Form valid jika nama terisi dan PIN lolos validasi
const isFormValid = computed(() => {
  return form.value.nama.trim() !== '' && pinError.value === ''
})

watch(() => [currentUser.value, organizerProfile.value], () => {
  const u = currentUser.value
  const org = organizerProfile.value
  if (org && org.nama_organizer && !form.value.nama) {
    form.value.nama = org.nama_organizer
  } else if (u && u.user_metadata && !form.value.nama) {
    form.value.nama = u.user_metadata.full_name || ''
  }

  if (org && org.no_wa && !form.value.wa_raw) {
    let phone = String(org.no_wa).replace(/\D/g, '')
    if (phone.startsWith('62')) {
      form.value.wa_cc = '62'
      phone = phone.substring(2)
    } else if (phone.startsWith('0')) {
      phone = phone.substring(1)
    }
    form.value.wa_raw = phone
  } else if (u && u.user_metadata && !form.value.wa_raw && u.user_metadata.phone) {
    let phone = String(u.user_metadata.phone).replace(/\D/g, '')
    if (phone.startsWith('62')) {
      form.value.wa_cc = '62'
      phone = phone.substring(2)
    } else if (phone.startsWith('0')) {
      phone = phone.substring(1)
    }
    form.value.wa_raw = phone
  }
}, { immediate: true })

const simpan = async () => {
  if (!form.value.nama) {
    showToast('Nama Organizer wajib diisi!', 'error')
    return
  }
  if (pinError.value) {
    showToast(pinError.value, 'error')
    return
  }
  loading.value = true
  try {
    const payload = {
      id: currentUser.value.id,
      nama_organizer: form.value.nama,
      no_wa: `${form.value.wa_cc}${form.value.wa_raw}`,
      pin_scanner: form.value.pin, // PIN dari input user, bukan hardcode
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
