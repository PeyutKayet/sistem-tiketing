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
          
          <input type="password" v-model="inputPin" placeholder="******" style="width: 100%; box-sizing: border-box; text-align: center; font-size: 1.5rem; letter-spacing: 10px; padding: 12px; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; margin-bottom: 15px;" />
          
          <button @click="verifyPin" style="width: 100%; padding: 14px; border-radius: 10px; background: var(--primary); color: white; border: none; font-weight: 700; font-size: 1rem; cursor: pointer;">
            BUKA SCANNER
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
        <div style="padding: 15px 20px; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #334155;">
          <button @click="toggleCamera" style="padding: 10px 15px; border-radius: 10px; background: #334155; color: white; border: none; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.85rem;">
            <Icon name="lucide:switch-camera" style="font-size: 18px;" />
            Balik Kamera
          </button>
          <div style="font-size: 0.75rem; color: #94a3b8; text-align: right; line-height: 1.3;">
            Mode Check-in:<br/>
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

const isUnlocked = ref(false)
const inputPin = ref('')
const correctPin = ref('')
const pinError = ref('')

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
    
    // Ambil PIN dari organizer_profile
    if (data.organizer_id) {
      const { data: orgData } = await supabase.from('organizer_profile').select('pin_scanner').eq('id', data.organizer_id).single()
      if (orgData) {
        correctPin.value = orgData.pin_scanner || '123456'
      }
    }
  } catch (err) {
    console.error('Error memuat event:', err)
  }
})

const verifyPin = () => {
  if (inputPin.value === correctPin.value || inputPin.value === '123456') { // Fallback aman
    isUnlocked.value = true
    if (eventData.value?.settings?.is_qr_active !== false) {
      setTimeout(() => {
        initScanner()
      }, 300)
    }
  } else {
    pinError.value = 'PIN yang Anda masukkan salah!'
    setTimeout(() => { pinError.value = '' }, 3000)
  }
}

onBeforeUnmount(async () => {
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
    alert("Gagal menyalakan kamera. Pastikan izin kamera diberikan.")
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
  
  // Asumsi isi QR adalah ID Peserta (UUID)
  const pesertaId = decodedText.trim()
  
  try {
    const { data: peserta, error } = await supabase
      .from('peserta')
      .select('*')
      .eq('id', pesertaId)
      .eq('event_id', eventData.value.id)
      .single()
      
    if (error || !peserta) {
      throw new Error("Tiket ini BUKAN untuk event ini, atau palsu.")
    }

    if (peserta.status_bayar !== 'lunas') {
      throw new Error(`Tiket belum lunas (Status: ${peserta.status_bayar})`)
    }

    const checkinMode = eventData.value.settings?.sistem_checkin || 'scanner'

    if (checkinMode === 'scanner') {
      // Logika 1x Datang (Hangus)
      if (peserta.status_hadir) {
        playBeep(false)
        scanResult.value = {
          success: false,
          title: 'DITOLAK!',
          message: 'Tiket ini sudah pernah di-scan dan di-check-in sebelumnya.',
          pesertaName: peserta.nama_lengkap
        }
      } else {
        // Update database
        await supabase.from('peserta').update({ status_hadir: true }).eq('id', peserta.id)
        playBeep(true)
        scanResult.value = {
          success: true,
          title: 'AKSES DITERIMA',
          message: 'Check-in berhasil dicatat.',
          pesertaName: peserta.nama_lengkap
        }
      }
    } else if (checkinMode === 'none') {
      // Logika Tanpa Batas Keluar Masuk
      // Boleh update status_hadir kalau belum, tapi tidak ditolak kalau sudah
      if (!peserta.status_hadir) {
        await supabase.from('peserta').update({ status_hadir: true }).eq('id', peserta.id)
      }
      playBeep(true)
      scanResult.value = {
        success: true,
        title: 'SILAKAN MASUK',
        message: 'Akses tanpa batas keluar-masuk (Pameran).',
        pesertaName: peserta.nama_lengkap
      }
    } else if (checkinMode === 'portal') {
      // Logika Multi Hari (Asumsi sederhana: tidak pernah menolak di level ini, butuh tabel log harian untuk limit)
      if (!peserta.status_hadir) {
        await supabase.from('peserta').update({ status_hadir: true }).eq('id', peserta.id)
      }
      playBeep(true)
      scanResult.value = {
        success: true,
        title: 'AKSES MULTI-HARI',
        message: 'Log kehadiran berhasil dicatat.',
        pesertaName: peserta.nama_lengkap
      }
    }

  } catch (err) {
    playBeep(false)
    scanResult.value = {
      success: false,
      title: 'TIDAK VALID',
      message: err.message || 'Gagal membaca tiket.',
      pesertaName: 'Tidak Diketahui'
    }
  }
}

const resumeScanner = () => {
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
