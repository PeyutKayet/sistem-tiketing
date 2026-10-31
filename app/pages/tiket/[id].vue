<template>
  <div class="ticket-wrapper">
    <div class="ticket-container">
    <ClientOnly>
      <div v-if="loading" class="state-msg">⏳ Mengambil Data Tiket...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>
      
      <div v-else class="content-box">
        <!-- Status Pembayaran (Hanya muncul jika Pending) -->
        <div v-if="tiketData[0].status_bayar === 'pending' && !isBypassLock" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px;">
          <div class="status-badge pending" style="margin-bottom: 0;">
            ⏳ MENUNGGU PEMBAYARAN
          </div>
          
          <button 
            @click="refreshStatus(false)" 
            :disabled="isRefreshing"
            title="Cek Status Pembayaran"
            class="refresh-btn"
            :class="{ 'is-loading': isRefreshing }"
          >
            <span class="icon">🔄</span>
          </button>
        </div>
        <p v-if="cooldownMessage" style="font-size: 0.75rem; color: #ef4444; margin-bottom: 20px; font-weight: 600;">{{ cooldownMessage }}</p>
        
        <!-- Judul Halaman -->
        <h2 class="page-title">
          <Icon name="lucide:ticket" style="color: var(--primary);" /> E-Ticket Anda
        </h2>

        <!-- AREA TIKET (Hanya muncul penuh jika lunas atau tiket gratis) -->
        <div v-if="tiketData[0].status_bayar === 'paid' || isBypassLock" class="ticket-scroll-container">
          <!-- Elemen ini yang akan di-screenshot -->
          <div v-for="(tiket, index) in tiketData" :key="index" :id="'ticketCard-' + index" class="ticket-card-wrapper" style="margin-bottom: 25px;">
            <div class="ticket-card">
              <!-- Header (Kategori) -->
              <div class="ticket-header">
                 <div>
                   <div class="ticket-category">{{ tiket.nama_tiket }}</div>
                   <div v-if="tiketData.length > 1" class="ticket-count-badge">Tiket #{{ index + 1 }} dari {{ tiketData.length }}</div>
                 </div>
                 <div class="ticket-label" style="display:flex; align-items:center;"><Icon name="lucide:check-circle-2" style="font-size:14px; margin-right:4px; margin-bottom:1px;" /> LUNAS</div>
              </div>

              <!-- Pemisah Melengkung (Sobekan) -->
              <div class="ticket-divider">
                  <div class="dash"></div>
              </div>

              <!-- Body Utama -->
              <div class="ticket-body">
                 <div class="ticket-details">
                    <div class="detail-box" style="margin-bottom: 15px;">
                       <span class="detail-label">NAMA PESERTA</span>
                       <span class="detail-value nama">{{ tiket.nama_lengkap }}</span>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-box">
                           <span class="detail-label">EVENT</span>
                           <span class="detail-value event">{{ tiket.event?.nama_event }}</span>
                        </div>

                        <div class="detail-box" style="text-align: right;">
                           <span class="detail-label">TANGGAL</span>
                           <span class="detail-value date">{{ new Date(tiket.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) }}</span>
                        </div>
                    </div>
                 </div>

                 <!-- QR Code & ID -->
                 <div v-if="tiket.event?.settings?.is_qr_active !== false" class="ticket-qr-section">
                     <div class="qr-box">
                         <img 
                           v-if="qrMap[tiket.data_tambahan?.ticket_id || ticketId]" 
                           :src="qrMap[tiket.data_tambahan?.ticket_id || ticketId]" 
                           alt="QR Code" 
                         />
                         <div v-else style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #8a9aa8;">
                           Membuat Barcode...
                         </div>
                     </div>
                     <div class="ticket-id">{{ tiket.data_tambahan?.ticket_id || ticketId }}</div>

                     <!-- Tombol Unduh Satuan jika lebih dari 1 tiket -->
                     <button 
                       v-if="tiketData.length > 1" 
                       type="button" 
                       @click="unduhSatuTiket(index)" 
                       class="btn-download-single"
                     >
                       <Icon name="lucide:download" style="font-size:13px;" />
                       <span>Simpan Tiket Ini (PNG)</span>
                     </button>
                 </div>
                 <div v-else class="ticket-qr-section" style="padding-bottom: 20px;">
                     <div class="ticket-id" style="font-size: 1.2rem; margin-top: 10px;">{{ tiket.data_tambahan?.ticket_id || ticketId }}</div>
                     <button 
                       v-if="tiketData.length > 1" 
                       type="button" 
                       @click="unduhSatuTiket(index)" 
                       class="btn-download-single"
                     >
                       <Icon name="lucide:download" style="font-size:13px;" />
                       <span>Simpan Tiket Ini (PNG)</span>
                     </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tiketData[0].status_bayar === 'pending' && isBypassLock" class="state-msg" style="margin-bottom: 20px; padding: 14px; border-radius: 12px; background: #FFFBEB; border: 1px dashed #FCD34D; color: #D97706; font-size: 0.85rem; text-align: center;">
          Tiket Anda sudah aktif! Tim kami sedang memverifikasi transfer donasi/infaq Anda.
        </div>

        <div v-else-if="tiketData[0].status_bayar === 'pending'" class="locked-box">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
          <p style="margin-bottom: 6px; font-weight: 700; color: #1e293b;">Menunggu Verifikasi Pembayaran</p>
          <p style="margin-bottom: 12px; font-size: 0.82rem; color: #64748b;">
            E-Ticket akan otomatis aktif di halaman ini setelah transfer Anda diverifikasi oleh Admin.
          </p>
        </div>

        <!-- Tombol Simpan E-Ticket Bersih di Bawah Kartu -->
        <div v-if="tiketData[0].status_bayar === 'paid' || isBypassLock" class="ticket-inline-actions">
           <button @click="unduhTiket" :disabled="isDownloading" class="btn btn-secondary-download">
             <span v-if="isDownloading" style="display:flex; align-items:center; gap:8px;"><Icon name="lucide:loader-2" class="spin" /> Memproses Gambar...</span>
             <span v-else style="display:flex; align-items:center; gap:8px;">
               <Icon name="lucide:download" /> 
               {{ tiketData.length > 1 ? `Unduh Semua Tiket (${tiketData.length} PNG)` : 'Unduh Gambar E-Ticket (PNG)' }}
             </span>
           </button>
        </div>

        <!-- KARTU AJAKAN EO (VIRAL FLYWHEEL) -->
        <div v-if="tiketData[0].status_bayar === 'paid' || isBypassLock" class="viral-eo-card">
          <div class="viral-eo-badge">
            <Icon name="lucide:sparkles" style="font-size: 13px; color: #d97706;" />
            <span>Punya Komunitas atau Acara?</span>
          </div>
          <p class="viral-eo-text">
            Bikin formulir pendaftaran, pembayaran QRIS, dan tiket barcode otomatis di <b>tyket.id</b>
          </p>
          <NuxtLink to="/admin" class="viral-eo-btn">
            <span>Coba Buat Event Gratis</span>
            <Icon name="lucide:arrow-right" style="font-size: 13px;" />
          </NuxtLink>
        </div>

      </div>

      <!-- STICKY FLOATING BOTTOM BAR (MENEMPEL DI JEMPOL, 0 EFFORT SCROLL) -->
      <div v-if="!loading && tiketData && tiketData.length > 0 && organizerData?.no_wa" class="floating-cta-bar">
        <div class="floating-cta-inner">
          <!-- JIKA LUNAS / GRATIS -->
          <button v-if="tiketData[0].status_bayar === 'paid' || isBypassLock" @click="kabariAdmin" class="btn-floating-wa">
            <div class="cta-left">
              <div class="cta-icon-circle">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.32 13.86 15.12 13.28 14.9 13.19C14.67 13.11 14.5 13.06 14.34 13.31C14.18 13.56 13.71 14.11 13.56 14.27C13.42 14.44 13.27 14.46 13.03 14.34C12.78 14.21 11.74 13.87 10.5 12.77C9.54 11.91 8.89 10.86 8.77 10.65C8.65 10.45 8.76 10.33 8.88 10.22C8.99 10.11 9.13 9.93 9.26 9.78C9.39 9.63 9.43 9.53 9.5 9.36C9.6 9.2 9.56 9.06 9.5 8.94C9.43 8.81 8.86 7.42 8.53 7.33Z"/>
                </svg>
              </div>
              <div class="cta-text-wrap">
                <span class="cta-title">{{ linkGrupWa ? 'KABARI ADMIN & MASUK GRUP' : 'KABARI ADMIN PANITIA VIA WA' }}</span>
                <span class="cta-subtitle">1x Klik Langsung Terhubung ke WhatsApp</span>
              </div>
            </div>
            <Icon name="lucide:arrow-right" class="cta-arrow" />
          </button>

          <!-- JIKA MENUNGGU VERIFIKASI (MANUAL TRANSFER PENDING) -->
          <button v-else-if="tiketData[0].status_bayar === 'pending'" @click="kabariAdmin" class="btn-floating-wa btn-floating-pending">
            <div class="cta-left">
              <div class="cta-icon-circle">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.32 13.86 15.12 13.28 14.9 13.19C14.67 13.11 14.5 13.06 14.34 13.31C14.18 13.56 13.71 14.11 13.56 14.27C13.42 14.44 13.27 14.46 13.03 14.34C12.78 14.21 11.74 13.87 10.5 12.77C9.54 11.91 8.89 10.86 8.77 10.65C8.65 10.45 8.76 10.33 8.88 10.22C8.99 10.11 9.13 9.93 9.26 9.78C9.39 9.63 9.43 9.53 9.5 9.36C9.6 9.2 9.56 9.06 9.5 8.94C9.43 8.81 8.86 7.42 8.53 7.33Z"/>
                </svg>
              </div>
              <div class="cta-text-wrap">
                <span class="cta-title">KIRIM BUKTI TRANSFER KE ADMIN</span>
                <span class="cta-subtitle">Percepat Verifikasi Tiket Anda via WA</span>
              </div>
            </div>
            <Icon name="lucide:arrow-right" class="cta-arrow" />
          </button>
        </div>
      </div>

      <template #fallback>
        <div class="state-msg">⏳ Mengambil Data Tiket...</div>
      </template>
    </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '#imports'
import QRCode from 'qrcode'

useHead({
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      defer: true
    }
  ]
})

const route = useRoute()
const ticketId = route.params.id // Mengambil ID dari URL (misal: TRX-KOP-123)

const loading = ref(true)
const error = ref('')
const tiketData = ref(null)
const isDownloading = ref(false)
const qrMap = ref({})

const generateAllQRCodes = async () => {
  if (!tiketData.value || tiketData.value.length === 0) return
  for (const t of tiketData.value) {
    const code = t.data_tambahan?.ticket_id || ticketId
    if (code && !qrMap.value[code]) {
      try {
        const url = await QRCode.toDataURL(code, {
          width: 240,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        })
        qrMap.value[code] = url
      } catch (e) {
        console.error('Error generating QR code:', e)
      }
    }
  }
}

const isBypassLock = computed(() => {
  return tiketData.value?.[0]?.kategori_tiket?.harga === 0 && tiketData.value?.[0]?.event?.settings?.is_infaq_wajib !== true
})

const supabase = useSupabaseClient()

const linkGrupWa = computed(() => {
  return tiketData.value?.[0]?.event?.settings?.link_grup_wa || null
})

const bukaGrupWa = () => {
  if (linkGrupWa.value) {
    window.open(linkGrupWa.value, '_blank')
  }
}

const kabariAdmin = () => {
  if (!organizerData.value?.no_wa) return
  let hp = organizerData.value.no_wa.replace(/\D/g, '')
  if (hp.startsWith('0')) hp = '62' + hp.substring(1)
  const domain = window.location.origin
  const namaPeserta = tiketData.value?.[0]?.nama_lengkap || ''
  const namaEvent = tiketData.value?.[0]?.event?.nama_event || 'Event'
  const groupUrl = linkGrupWa.value || ''
  
  let rawText = ''
  if (isBypassLock.value || tiketData.value?.[0]?.status_bayar === 'paid') {
    rawText = `Halo Admin Panitia,\nSaya sudah menyelesaikan pendaftaran acara *${namaEvent}*:\n` +
      (namaPeserta ? `• Nama: *${namaPeserta}*\n` : '') +
      `• Order ID: *${ticketId}*\n` +
      `• Link E-Ticket: ${domain}/tiket/${ticketId}\n\n`
      
    if (groupUrl) {
      rawText += `👉 Tautan Masuk Grup WhatsApp Peserta:\n${groupUrl}\n\n` +
        `Mohon dicatat dan di-approve di grup ya min. Terima kasih! 🙏`
    } else {
      rawText += `Mohon dicatat dan dikonfirmasi kehadiran saya. Terima kasih! 🙏`
    }
  } else {
    rawText = `Halo Admin Panitia,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${namaEvent}*.\n\n` +
      (namaPeserta ? `• Nama: *${namaPeserta}*\n` : '') +
      `• Order ID: *${ticketId}*\n` +
      `• Link Tiket: ${domain}/tiket/${ticketId}\n\n` +
      `Berikut saya lampirkan bukti transfer pembayaran saya. Mohon bantuannya untuk diverifikasi. Terima kasih! 🙏`
  }
  
  window.open(`https://api.whatsapp.com/send?phone=${hp}&text=${encodeURIComponent(rawText)}`, "_blank")
}

const unduhTiket = async () => {
  isDownloading.value = true
  try {
    if (!window.html2canvas) {
      if (window.Swal) window.Swal.fire('Mohon Tunggu', 'Fitur unduh sedang dimuat, coba beberapa detik lagi.', 'info')
      isDownloading.value = false
      return
    }

    for (let i = 0; i < tiketData.value.length; i++) {
      const el = document.getElementById('ticketCard-' + i)
      if (!el) continue

      const canvas = await window.html2canvas(el, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: '#F8FAFC' 
      })
      
      const link = document.createElement('a')
      link.download = `Tiket-${tiketData.value[i].nama_lengkap}-${i+1}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      // Kasih jeda sedikit supaya browser tidak freeze jika tiket banyak
      await new Promise(r => setTimeout(r, 500))
    }
  } catch (err) {
    console.error('Gagal unduh tiket', err)
    if (window.Swal) window.Swal.fire('Gagal', 'Gagal mengunduh tiket. Pastikan browser Anda mendukung.', 'error')
  } finally {
    isDownloading.value = false
  }
}

const unduhSatuTiket = async (index) => {
  try {
    if (!window.html2canvas) {
      if (window.Swal) window.Swal.fire('Mohon Tunggu', 'Fitur unduh sedang dimuat, coba beberapa detik lagi.', 'info')
      return
    }

    const el = document.getElementById('ticketCard-' + index)
    if (!el) return

    const canvas = await window.html2canvas(el, { 
      scale: 3, 
      useCORS: true, 
      backgroundColor: '#F8FAFC' 
    })
    
    const link = document.createElement('a')
    link.download = `Tiket-${tiketData.value[index]?.nama_lengkap || 'Peserta'}-${index+1}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Gagal unduh tiket satuan', err)
  }
}

const formatWaLink = (no) => {
  if (!no) return '#'
  let hp = no.replace(/\D/g, '')
  if (hp.startsWith('0')) hp = '62' + hp.substring(1)
  return `https://wa.me/${hp}`
}

const isRefreshing = ref(false)
const cooldownMessage = ref('')
let lastRefreshTime = 0
let autoPollCount = 0

const refreshStatus = async (isSilent = false) => {
  const now = Date.now()
  if (!isSilent && now - lastRefreshTime < 30000) {
    const sisaDetik = Math.ceil((30000 - (now - lastRefreshTime)) / 1000)
    cooldownMessage.value = `Tunggu ${sisaDetik} detik lagi untuk merefresh.`
    return
  }
  
  isRefreshing.value = true
  cooldownMessage.value = ''
  if (!isSilent) lastRefreshTime = now

  try {
    const orderIdInduk = tiketData.value[0]?.order_id || tiketData.value[0]?.data_tambahan?.order_id || ticketId
    if (!orderIdInduk) throw new Error('Order ID tidak ditemukan')
    
    const response = await $fetch(`/api/check-espay?order_id=${orderIdInduk}`)
    if (response && response.status === 'paid') {
      response.payment_status = 'paid'
    }
    
    if (response.payment_status === 'paid' || response.status === 'already_paid' || response.status === 'paid') {
      tiketData.value.forEach(t => t.status_bayar = 'paid')
      generateAllQRCodes()
      if (!isSilent && window.Swal) window.Swal.fire('Berhasil!', 'Pembayaran berhasil dikonfirmasi! Tiketmu sudah aktif.', 'success')
      isRefreshing.value = false
    } else {
      // Jika pembayaran belum lunas
      if (isSilent && autoPollCount < 8) {
        // Coba lagi secara rahasia setiap 3 detik (maksimal 8 kali = 24 detik)
        autoPollCount++
        setTimeout(() => refreshStatus(true), 3000)
      } else {
        isRefreshing.value = false
        if (!isSilent && window.Swal) window.Swal.fire('Tertunda', 'Pembayaran belum diterima oleh sistem pusat. Coba beberapa saat lagi.', 'warning')
      }
    }
  } catch (err) {
    console.error('Gagal mengecek status:', err)
    isRefreshing.value = false
    if (!isSilent && window.Swal) window.Swal.fire('Kesalahan', 'Terjadi kesalahan saat mengecek status atau pesanan bukan dari gateway pusat.', 'error')
  }
}

const organizerData = ref(null)

let realtimeChannel = null

onMounted(async () => {
  try {
    let data = null

    // 0. Cek data preloaded dari sesi checkout / bayar
    if (typeof window !== 'undefined') {
      try {
        const cachedStr = sessionStorage.getItem(`tyket_preloaded_${ticketId}`)
        if (cachedStr) {
          const parsed = JSON.parse(cachedStr)
          if (parsed.data && parsed.data.length > 0) {
            data = parsed.data
            tiketData.value = data
            if (parsed.qrMap) {
              qrMap.value = { ...parsed.qrMap }
            }
            loading.value = false
            sessionStorage.removeItem(`tyket_preloaded_${ticketId}`)
          }
        }
      } catch (cacheErr) {
        console.warn('Gagal membaca preloaded ticket cache:', cacheErr)
      }
    }

    // Jika belum ada data dari cache (misal dibuka langsung dari link bookmark / WA)
    if (!data) {
      const { data: sbData, error: sbErr } = await supabase
        .from('peserta')
        .select('*, event(nama_event, settings, organizer_id), kategori_tiket(harga)')
        .or(`order_id.eq.${ticketId},data_tambahan->>order_id.eq.${ticketId}`)
        .order('id', { ascending: true })

      if (sbErr) throw sbErr
      data = sbData
      if (data) {
        tiketData.value = data || []
        await generateAllQRCodes()
      }
    }
    
    if (data && data.length > 0) {
      // Pastikan semua QR code ter-generate jika ada yang belum
      generateAllQRCodes()
      
      if (data[0]?.event?.organizer_id) {
        const { data: org } = await supabase
          .from('organizer_profile')
          .select('no_wa, link_ig, link_web')
          .eq('id', data[0].event.organizer_id)
          .maybeSingle()
        if (org) organizerData.value = org
      }

      // 1. Cek parameter URL status pembayaran
      if ((route.query.status === 'succeeded' || route.query.status === 'paid') && tiketData.value[0]?.status_bayar === 'pending') {
        // Cek secara diam-diam tanpa alert
        refreshStatus(true)
      }

      // 2. Berlangganan Supabase Realtime agar ter-update ajaib
      if (tiketData.value[0]?.status_bayar === 'pending') {
        const orderIdTarget = tiketData.value[0]?.order_id || tiketData.value[0]?.data_tambahan?.order_id || ticketId
        realtimeChannel = supabase
          .channel(`tiket-lunas-listener-${ticketId}`)
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'orders',
              filter: `id=eq.${orderIdTarget}` 
            },
            (payload) => {
              if (payload.new.status_pembayaran === 'paid') {
                tiketData.value.forEach(t => t.status_bayar = 'paid')
                generateAllQRCodes()
              }
            }
          )
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'peserta',
              filter: `order_id=eq.${orderIdTarget}` 
            },
            (payload) => {
              if (payload.new.status_bayar === 'paid') {
                tiketData.value.forEach(t => t.status_bayar = 'paid')
                generateAllQRCodes()
              }
            }
          )
          .subscribe()
      }
      
    } else {
      error.value = "❌ Tiket tidak ditemukan. Pastikan URL sudah benar."
    }
  } catch (err) {
    console.error(err)
    error.value = "❌ Gagal memuat data tiket. Silakan refresh halaman."
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
</style>

<style scoped>
.ticket-wrapper {

  --bg-color: #F8FAFC;
  --text-main: #1E293B;
  --text-muted: #64748B;
  --border-soft: #E2E8F0;

  font-family: 'Nunito', sans-serif;
  background: var(--bg-color);
  min-height: 100vh;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
}

.ticket-container {
  width: 100%;
  max-width: 500px;
}

.content-box {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.1);
  padding: 30px;
  text-align: center;
  border: 1px solid var(--border-soft);
  box-sizing: border-box;
  width: 100%;
}

.state-msg { color: var(--text-muted); font-weight: 700; text-align: center; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.state-msg.error { color: #ef4444; }

.status-badge { padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-block; margin-bottom: 20px; letter-spacing: 0.5px; }
.status-badge.paid { background: #DCFCE7; color: #16A34A; }
.status-badge.pending { background: #FEF9C3; color: #CA8A04; }

.page-title { margin: 0 0 20px 0; font-size: 1.25rem; font-weight: 900; color: var(--primary); display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: -0.5px; }

.event-title { margin: 0 0 5px 0; color: var(--primary); font-weight: 900; font-size: 1.5rem; line-height: 1.3; letter-spacing: -0.5px; }
.ticket-type { margin: 0 0 25px; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; }

.ticket-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* DESAIN TIKET PREMIUM BOARDING PASS */
.ticket-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  position: relative;
  filter: drop-shadow(0 15px 35px rgba(0,0,0,0.08));
  box-sizing: border-box;
}

.ticket-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: white;
  padding: 20px 20px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ticket-category {
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.ticket-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  background: rgba(255,255,255,0.2);
  padding: 5px 12px;
  border-radius: 12px;
}

.ticket-divider {
  height: 0;
  background: white;
  position: relative;
}
.ticket-divider .dash {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 0;
  border-top: 2px dashed #CBD5E1;
  z-index: 10;
}
.ticket-divider::before, .ticket-divider::after {
  content: '';
  position: absolute;
  top: -12px;
  width: 24px;
  height: 24px;
  background: var(--bg-color);
  border-radius: 50%;
  z-index: 5;
}
.ticket-divider::before { left: -12px; box-shadow: inset -3px 0 8px rgba(0,0,0,0.03); }
.ticket-divider::after { right: -12px; box-shadow: inset 3px 0 8px rgba(0,0,0,0.03); }

.ticket-body {
  background: white;
  padding: 20px 20px 25px;
  border-radius: 0 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;
}
.detail-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
}
.detail-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.detail-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #94A3B8;
  letter-spacing: 1px;
}
.detail-value {
  font-size: 1rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.3;
}
.detail-value.event {
  font-size: 0.95rem;
}
.detail-value.nama {
  font-size: 1.25rem;
  color: var(--primary);
  text-transform: uppercase;
}

.ticket-qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.qr-box {
  padding: 10px;
  background: white;
  border: 2px solid #F1F5F9;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.03);
}
.qr-box img {
  width: 110px;
  height: 110px;
  display: block;
}
.ticket-id {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #475569;
  background: #F1F5F9;
  padding: 4px 14px;
  border-radius: 10px;
}

.ticket-count-badge {
  font-size: 0.7rem;
  opacity: 0.85;
  font-weight: 700;
  margin-top: 2px;
  letter-spacing: 0.5px;
}

.btn-download-single {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}
.btn-download-single:hover {
  background: #f1f5f9;
  color: var(--primary);
  border-color: var(--primary);
}
.btn-download-single:active {
  transform: scale(0.96);
}

/* Kartu Ajakan EO (Viral Flywheel) */
.viral-eo-card {
  margin-top: 24px;
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  border: 1px solid #DBEAFE;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}
.viral-eo-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #FEF3C7;
  color: #92400E;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
}
.viral-eo-text {
  font-size: 0.78rem;
  color: #334155;
  margin: 0;
  line-height: 1.45;
  max-width: 320px;
}
.viral-eo-text b {
  color: var(--primary, #0C387A);
}
.viral-eo-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--primary, #0C387A);
  color: var(--accent-yellow, #FCEB9C);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 2px;
  box-shadow: 0 4px 12px rgba(12, 56, 122, 0.15);
  touch-action: manipulation;
}
.viral-eo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(12, 56, 122, 0.25);
}
.viral-eo-btn:active {
  transform: scale(0.97);
}

/* Elemen Lainnya */
.locked-box { background: #F8FAFC; padding: 40px 20px; border-radius: 16px; border: 1px dashed #CBD5E1; margin-bottom: 25px; color: var(--text-muted); }
.locked-box svg { width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.6; }
.locked-box p { margin: 0; font-size: 0.85rem; font-weight: 600; line-height: 1.5; }

.social-link { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: white; transition: 0.2s; }
.social-link:hover { transform: translateY(-2px); }
.social-link svg { width: 20px; height: 20px; margin: 0; opacity: 1; }
.social-link.wa { background: #25D366; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2); }
.social-link.ig { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); box-shadow: 0 4px 10px rgba(220, 39, 67, 0.2); }
.social-link.web { background: var(--primary); box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2); }

/* TICKET INLINE ACTIONS */
.ticket-inline-actions {
  margin-top: 15px;
  margin-bottom: 5px;
}
.btn-secondary-download {
  width: 100%;
  background: #F1F5F9;
  color: #334155;
  border: 1px solid #CBD5E1;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
}
.btn-secondary-download:hover:not(:disabled) {
  background: #E2E8F0;
  color: #0F172A;
}
.btn-secondary-download:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* STICKY FLOATING BOTTOM BAR (MENEMPEL DI JEMPOL, 0 EFFORT SCROLL) */
.floating-cta-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.08);
  animation: slideUpFloating 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpFloating {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.floating-cta-inner {
  max-width: 440px;
  margin: 0 auto;
}
.btn-floating-wa {
  width: 100%;
  background: linear-gradient(135deg, #128C7E 0%, #075E54 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(7, 94, 84, 0.38), 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Nunito', sans-serif;
  text-align: left;
}
.btn-floating-wa:hover {
  background: linear-gradient(135deg, #0e786c 0%, #054840 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(7, 94, 84, 0.48), 0 3px 8px rgba(0, 0, 0, 0.1);
}
.btn-floating-wa:active {
  transform: scale(0.98);
}
.btn-floating-pending {
  background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
  box-shadow: 0 6px 20px rgba(180, 83, 9, 0.38), 0 2px 6px rgba(0, 0, 0, 0.08);
}
.btn-floating-pending:hover {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  box-shadow: 0 8px 24px rgba(180, 83, 9, 0.48), 0 3px 8px rgba(0, 0, 0, 0.1);
}
.cta-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.cta-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  color: #075E54;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.btn-floating-pending .cta-icon-circle {
  color: #B45309;
}
.cta-text-wrap {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
  flex: 1;
}
.cta-title {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.1px;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  word-break: break-word;
}
.cta-subtitle {
  font-size: 0.72rem;
  color: #DCFCE7;
  font-weight: 600;
  line-height: 1.2;
  margin-top: 1px;
}
.btn-floating-pending .cta-subtitle {
  color: #FEF3C7;
}
.cta-arrow {
  font-size: 1.2rem;
  flex-shrink: 0;
  color: #ffffff;
  opacity: 0.95;
  transition: transform 0.2s ease;
  margin-left: 4px;
}
.btn-floating-wa:hover .cta-arrow {
  transform: translateX(3px);
}

.content-box {
  padding-bottom: 80px; /* Ruang agar tidak tertutup floating bar */
}

/* Scrollbar styling untuk card yang overflow di HP kecil */
.ticket-card-wrapper::-webkit-scrollbar { height: 6px; }
.ticket-card-wrapper::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }

/* Refresh Button Styling */
.refresh-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(18, 56, 96, 0.2);
}
.refresh-btn:hover {
  transform: scale(1.05);
}
.refresh-btn.is-loading {
  opacity: 0.7;
  transform: scale(0.95);
}
.refresh-btn.is-loading .icon {
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* KHUSUS HP KECIL (iPhone SE, dll) - BISA MASUK 1 LAYAR TANPA SCROLL */
@media(max-width: 500px) {
  .ticket-wrapper { padding: 10px 10px; }
  .content-box { padding: 15px 15px; border-radius: 20px; }
  .status-badge { margin-bottom: 15px; padding: 4px 12px; }
  .page-title { margin-bottom: 15px; font-size: 1.15rem; }
  .ticket-card-wrapper { margin-bottom: 15px; padding: 0; }
  
  .ticket-header { padding: 15px 20px; }
  .ticket-body { padding: 15px 20px 20px; gap: 15px; }
  .ticket-details { gap: 0; }
  .detail-row { gap: 10px; }
  .detail-value { font-size: 0.95rem; }
  .detail-value.nama { font-size: 1.15rem; }
  .detail-value.event { font-size: 0.9rem; }
  
  .ticket-qr-section { gap: 10px; }
  .qr-box { padding: 8px; border-radius: 10px; }
  .qr-box img { width: 95px; height: 95px; }
  .ticket-id { font-size: 0.9rem; padding: 4px 10px; }
  
  .action-buttons { gap: 8px; margin-top: 5px; }
  .btn { padding: 12px; font-size: 0.85rem; border-radius: 12px; }
}
</style>
