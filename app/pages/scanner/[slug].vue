<template>
  <div style="background: #000; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif;">
    
    <!-- Mobile App Container -->
    <div style="width: 100%; max-width: 480px; min-height: 100vh; background: #0f172a; color: white; display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
      
      <!-- Header -->
      <div style="padding: 15px 20px; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155;">
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">Scanner Panitia</h3>
          <p style="margin: 4px 0 0; font-size: 0.75rem; color: #94a3b8;">{{ eventData ? eventData.nama_event : 'Memuat event...' }}</p>
        </div>
        <button @click="$router.back()" style="background: transparent; border: 1px solid #475569; color: white; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
          Tutup
        </button>
      </div>

      <!-- Peringatan QR Tidak Aktif -->
      <div v-if="eventData && !eventData.settings?.is_qr_active" style="padding: 40px 20px; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <Icon name="lucide:alert-triangle" style="font-size: 60px; color: #f59e0b; margin-bottom: 15px;" />
        <h2 style="margin: 0 0 10px; font-weight: 800;">Fitur E-Ticket Nonaktif</h2>
        <p style="color: #cbd5e1; font-size: 0.9rem;">Event ini tidak menggunakan sistem QR Code scanner.</p>
      </div>

      <!-- PIN Lock Screen -->
      <div v-else-if="!isUnlocked" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: #1e293b; padding: 30px 20px; border-radius: 16px; width: 100%; max-width: 320px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <Icon name="lucide:lock" style="font-size: 48px; color: var(--primary); margin-bottom: 15px;" />
          <h2 style="margin: 0 0 10px; font-weight: 800; font-size: 1.2rem;">Masukkan PIN Scanner</h2>
          <p style="color: #94a3b8; font-size: 0.8rem; margin: 0 0 20px; line-height: 1.4;">Minta PIN dari pengelola event untuk menyalakan kamera.</p>
          
          <input type="password" v-model="inputPin" @keyup.enter="verifyPin" placeholder="******" style="width: 100%; box-sizing: border-box; text-align: center; font-size: 1.5rem; letter-spacing: 10px; padding: 12px; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; margin-bottom: 15px;" />
          
          <button @click="verifyPin" :disabled="isVerifying" style="width: 100%; padding: 14px; border-radius: 10px; background: var(--primary); color: white; border: none; font-weight: 700; font-size: 1rem; cursor: pointer;">
            {{ isVerifying ? 'MEMERIKSA...' : 'BUKA SCANNER' }}
          </button>
          <p v-if="pinError" style="color: #ef4444; font-size: 0.8rem; margin: 10px 0 0;">{{ pinError }}</p>
        </div>
      </div>

      <!-- Scanner Area -->
      <div v-else style="flex: 1; display: flex; flex-direction: column; position: relative; background: #000;">
        
        <!-- Video Container -->
        <div id="reader" style="width: 100%; flex: 1; background: black; display: flex; align-items: center; justify-content: center;"></div>
        
        <!-- Overlay Result Panel -->
        <div v-if="scanResult" :style="{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: scanResult.success ? 'rgba(22, 163, 74, 0.95)' : 'rgba(220, 38, 38, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 10 }">
          
          <Icon :name="scanResult.success ? 'lucide:check-circle' : 'lucide:x-circle'" style="font-size: 80px; color: white; margin-bottom: 20px;" />
          <h2 style="margin: 0 0 10px; font-size: 1.8rem; font-weight: 900; text-align: center;">
            {{ scanResult.title }}
          </h2>
          
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; width: 100%; text-align: center; margin-bottom: 30px;">
            <p style="margin: 0 0 5px; font-size: 0.85rem; opacity: 0.8;">Nama Peserta:</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 800;">{{ scanResult.pesertaName || '-' }}</p>
            <p style="margin: 10px 0 0; font-size: 0.8rem;">{{ scanResult.message }}</p>
          </div>

          <button @click="resumeScanner" style="padding: 15px 30px; font-size: 1rem; font-weight: 800; border-radius: 50px; border: none; background: white; color: #0f172a; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); width: 100%;">
            SCAN TIKET BERIKUTNYA
          </button>
        </div>

        <!-- Control Bar -->
        <div style="padding: 12px 16px; background: #1e293b; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid #334155;">
          <button @click="toggleCamera" style="padding: 8px 12px; border-radius: 10px; background: #334155; color: white; border: none; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.8rem;">
            <Icon name="lucide:switch-camera" style="font-size: 16px;" />
            Kamera
          </button>
          
          <!-- Toggle Mode Cepat (Auto-Scan) -->
          <button @click="isFastMode = !isFastMode" :style="{ padding: '8px 12px', borderRadius: '10px', background: isFastMode ? '#16a34a' : '#475569', color: 'white', border: isFastMode ? '1px solid #22c55e' : '1px solid #64748b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s ease' }">
            <Icon :name="isFastMode ? 'lucide:zap' : 'lucide:zap-off'" style="font-size: 16px;" />
            <span>{{ isFastMode ? 'Mode Cepat (1.5s)' : 'Mode Biasa' }}</span>
          </button>

          <div style="font-size: 0.7rem; color: #94a3b8; text-align: right; line-height: 1.2;">
            <span style="opacity:0.7">Sistem:</span><br/>
            <strong style="color: white;">{{ modeText }}</strong>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
// Pastikan npm install html5-qrcode sudah dijalankan
import { Html5Qrcode } from 'html5-qrcode'

definePageMeta({
  layout: false // Halaman ini berdiri sendiri tanpa sidebar admin agar full screen di HP
})

const route = useRoute()
const supabase = useSupabaseClient()

const slug = route.params.slug
const eventData = ref(null)

const html5QrCode = ref(null)
const facingMode = ref('environment') // 'environment' = belakang, 'user' = depan
const isScanning = ref(false)

const isFastMode = ref(false)
let autoResumeTimer = null

const isUnlocked = ref(false)
const inputPin = ref('')
const pinError = ref('')
const isVerifying = ref(false)

const scanResult = ref(null) // null | { success: bool, title: string, message: string, pesertaName: string }

const modeText = computed(() => {
  if (!eventData.value) return 'Memuat...'
  const m = eventData.value.settings?.sistem_checkin || 'scanner'
  if (m === 'none') return 'Tanpa Batas (Bebas Masuk)'
  if (m === 'portal') return 'Multi-Hari (Berulang)'
  return '1x Datang (Tiket Hangus)'
})

// Audio Feedback
const playBeep = (success) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.type = success ? 'sine' : 'sawtooth'
    osc.frequency.setValueAtTime(success ? 800 : 200, ctx.currentTime)
    osc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + (success ? 0.1 : 0.3))
  } catch(e) {}
}

onMounted(async () => {
  try {
    const { data, error } = await supabase.from('event').select('*').eq('slug', slug).single()
    if (error) throw error
    eventData.value = data
  } catch (err) {
    console.error('Error memuat event:', err)
  }
})

const verifyPin = async () => {
  if (!inputPin.value) {
    pinError.value = 'Masukkan PIN terlebih dahulu!'
    return
  }
  if (!eventData.value?.id) {
    pinError.value = 'Data event belum siap, coba sesaat lagi.'
    return
  }

  isVerifying.value = true
  pinError.value = ''
  try {
    const res = await $fetch('/api/verify-scanner-pin', {
      method: 'POST',
      body: {
        event_id: eventData.value.id,
        pin: inputPin.value.trim()
      }
    })

    if (res && res.valid) {
      isUnlocked.value = true
      if (eventData.value?.settings?.is_qr_active !== false) {
        setTimeout(() => {
          initScanner()
        }, 300)
      }
    }
  } catch (err) {
    pinError.value = err.data?.statusMessage || err.message || 'PIN yang Anda masukkan salah!'
    setTimeout(() => { pinError.value = '' }, 3500)
  } finally {
    isVerifying.value = false
  }
}

onBeforeUnmount(async () => {
  if (autoResumeTimer) {
    clearTimeout(autoResumeTimer)
    autoResumeTimer = null
  }
  if (html5QrCode.value && html5QrCode.value.isScanning) {
    await html5QrCode.value.stop()
  }
})

const initScanner = async () => {
  html5QrCode.value = new Html5Qrcode("reader")
  startCamera()
}

const startCamera = async () => {
  try {
    await html5QrCode.value.start(
      { facingMode: facingMode.value },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess,
      onScanFailure
    )
    isScanning.value = true
  } catch (err) {
    console.error("Gagal menyalakan kamera:", err)
    if (window.Swal) window.Swal.fire('Gagal', 'Gagal menyalakan kamera. Pastikan izin kamera diberikan di browser Anda.', 'error')
    else alert("Gagal menyalakan kamera. Pastikan izin kamera diberikan.")
  }
}

const toggleCamera = async () => {
  if (html5QrCode.value && isScanning.value) {
    await html5QrCode.value.stop()
    isScanning.value = false
  }
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  startCamera()
}

const onScanFailure = (error) => {
  // Hanya log di console atau abaikan, ini berjalan terus setiap frame yang tidak ada QR
}

const onScanSuccess = async (decodedText, decodedResult) => {
  // Hentikan scanner sementara saat memproses
  if (html5QrCode.value && isScanning.value) {
    await html5QrCode.value.pause(true)
  }
  
  const qrData = decodedText.trim()
  
  try {
    const res = await $fetch('/api/scan', {
      method: 'POST',
      body: {
        event_id: eventData.value.id,
        qr_data: qrData,
        pin: inputPin.value
      }
    })

    playBeep(res.success)
    scanResult.value = res

    // Jika Mode Cepat aktif dan scan sukses, otomatis lanjut scan dalam 1.5 detik
    if (res.success && isFastMode.value) {
      if (autoResumeTimer) clearTimeout(autoResumeTimer)
      autoResumeTimer = setTimeout(() => {
        resumeScanner()
      }, 1500)
    }

  } catch (err) {
    playBeep(false)
    scanResult.value = {
      success: false,
      title: 'TIDAK VALID',
      message: err.data?.statusMessage || err.message || 'Gagal membaca tiket.',
      pesertaName: 'Tidak Diketahui'
    }
  }
}

const resumeScanner = () => {
  if (autoResumeTimer) {
    clearTimeout(autoResumeTimer)
    autoResumeTimer = null
  }
  scanResult.value = null
  if (html5QrCode.value) {
    html5QrCode.value.resume()
  }
}

</script>

<style>
/* Perbaikan tampilan bawaan html5-qrcode */
#reader {
  border: none !important;
}
#reader video {
  object-fit: cover !important;
}
</style>
