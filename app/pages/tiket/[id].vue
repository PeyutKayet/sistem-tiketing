<template>
  <div class="ticket-wrapper">
    <div class="ticket-container">
      
      <div v-if="loading" class="state-msg">⏳ Mengambil Data Tiket...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>
      
      <div v-else class="content-box">
        <!-- Status Pembayaran -->
        <!-- Status Pembayaran (Hanya muncul jika Pending) -->
        <div v-if="tiketData.status_bayar === 'pending' && !isBypassLock" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px;">
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
          <Icon name="lucide:ticket" style="color: #2563EB;" /> E-Ticket Anda
        </h2>

        <!-- AREA TIKET (Hanya muncul penuh jika lunas atau tiket gratis) -->
        <div v-if="tiketData.status_bayar === 'paid' || isBypassLock" class="ticket-card-wrapper" style="margin-bottom: 25px;">
          <!-- Elemen ini yang akan di-screenshot -->
          <div id="ticketCard" class="ticket-card">
            <!-- Header (Kategori) -->
            <div class="ticket-header">
               <div class="ticket-category">{{ tiketData.nama_tiket }}</div>
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
                     <span class="detail-value nama">{{ tiketData.nama_lengkap }}</span>
                  </div>
                  
                  <div class="detail-row">
                      <div class="detail-box">
                         <span class="detail-label">EVENT</span>
                         <span class="detail-value event">{{ tiketData.event?.nama_event }}</span>
                      </div>

                      <div class="detail-box" style="text-align: right;">
                         <span class="detail-label">TANGGAL</span>
                         <span class="detail-value date">{{ new Date(tiketData.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) }}</span>
                      </div>
                  </div>
               </div>

               <!-- QR Code & ID -->
               <div v-if="tiketData.event?.settings?.is_qr_active !== false" class="ticket-qr-section">
                   <div class="qr-box">
                       <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tiketData.data_tambahan?.ticket_id || ticketId}`" alt="QR Code" crossorigin="anonymous" />
                   </div>
                   <div class="ticket-id">{{ tiketData.data_tambahan?.ticket_id || ticketId }}</div>
               </div>
               <div v-else class="ticket-qr-section" style="padding-bottom: 20px;">
                   <div class="ticket-id" style="font-size: 1.2rem; margin-top: 10px;">{{ tiketData.data_tambahan?.ticket_id || ticketId }}</div>
               </div>
            </div>
          </div>
        </div>
        <div v-if="tiketData.status_bayar === 'pending' && isBypassLock" class="state-msg" style="margin-bottom: 25px; padding: 15px; border-radius: 12px; background: #FFFBEB; border: 1px dashed #FCD34D; color: #D97706; font-size: 0.85rem; text-align: center;">
          Tiket Anda sudah aktif! Terima kasih atas sedekah Infaq Anda, tim kami sedang memverifikasi transfer donasi Anda.
        </div>

        <div v-else-if="tiketData.status_bayar === 'pending'" class="locked-box">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
          <p style="margin-bottom: 20px;">Data dan bukti transfer Anda sedang <strong>ditinjau oleh Admin</strong>. E-Ticket akan otomatis terbuka di halaman ini setelah diverifikasi.</p>
          
          <div v-if="organizerData" style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
            <a v-if="organizerData.no_wa" :href="formatWaLink(organizerData.no_wa)" target="_blank" class="social-link wa" title="Hubungi WhatsApp Admin">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <a v-if="organizerData.link_ig" :href="organizerData.link_ig" target="_blank" class="social-link ig" title="Instagram Resmi">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a v-if="organizerData.link_web" :href="organizerData.link_web" target="_blank" class="social-link web" title="Website Resmi">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>
          </div>
        </div>

        <!-- Tombol Tambahan -->
        <div class="action-buttons">
           <button v-if="tiketData.status_bayar === 'paid' || isBypassLock" @click="unduhTiket" :disabled="isDownloading" class="btn btn-download">
             <span v-if="isDownloading" style="display:flex; align-items:center; gap:8px;"><Icon name="lucide:loader-2" class="spin" /> Memproses...</span>
             <span v-else style="display:flex; align-items:center; gap:8px;"><Icon name="lucide:download" /> Simpan E-Ticket</span>
           </button>
           
           <button v-if="(tiketData.status_bayar === 'paid' || isBypassLock) && linkGrupWa" @click="bukaGrupWa" class="btn btn-wa">
             <Icon name="lucide:message-circle" style="font-size:1.2rem; margin-right:4px;" /> Bergabung ke Grup WhatsApp
           </button>

           <button v-if="organizerData?.no_wa" @click="kabariAdmin" class="btn" style="background: #e2e8f0; color: #475569;">
             <Icon name="lucide:send" style="font-size:1.2rem; margin-right:4px;" /> Kabari Admin via WA
           </button>
        </div>

      </div>

      <!-- PROMO FOOTER -->
      <div v-if="!loading" class="promo-footer">
        Punya acara sendiri? <NuxtLink to="/login" class="promo-link">Buat Sistem Tiket</NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '#imports'

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

const isBypassLock = computed(() => {
  return tiketData.value?.kategori_tiket?.harga === 0 && tiketData.value?.event?.settings?.is_infaq_wajib !== true
})

const supabase = useSupabaseClient()

const linkGrupWa = computed(() => {
  return tiketData.value?.event?.settings?.link_grup_wa || null
})

const bukaGrupWa = () => {
  if (linkGrupWa.value) {
    window.open(linkGrupWa.value, '_blank')
  }
}

const kabariAdmin = () => {
  if (!organizerData.value?.no_wa) return
  const noAdmin = organizerData.value.no_wa
  const domain = window.location.origin
  
  let rawText = ''
  if (isBypassLock.value) {
    rawText = `Hai Admin,\nSaya sudah mendaftar untuk acara *${tiketData.value?.event?.nama_event || 'Event'}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${ticketId}\n\nTerima kasih! 🙏`
  } else {
    rawText = `Hai Admin,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${tiketData.value?.event?.nama_event || 'Event'}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${ticketId}\n\nSaya akan cek link tersebut secara berkala sampai dikonfirmasi. Terima kasih! 🙏`
  }
  
  window.open(`https://api.whatsapp.com/send?phone=${noAdmin}&text=${encodeURIComponent(rawText)}`, "_blank")
}

const unduhTiket = async () => {
  const el = document.getElementById('ticketCard')
  if (!el) return
  
  isDownloading.value = true
  try {
    if (!window.html2canvas) {
      alert("Fitur unduh sedang dimuat, coba beberapa detik lagi.")
      return
    }
    const canvas = await window.html2canvas(el, { 
      scale: 3, // Resolusi tinggi
      useCORS: true, 
      backgroundColor: '#F8FAFC' 
    })
    
    const link = document.createElement('a')
    link.download = `Tiket-${tiketData.value.nama_lengkap}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Gagal unduh tiket', err)
    alert('Gagal mengunduh tiket. Pastikan browser Anda mendukung.')
  } finally {
    isDownloading.value = false
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
    const orderIdInduk = tiketData.value.data_tambahan?.order_id
    if (!orderIdInduk) throw new Error('Order ID tidak ditemukan')
    
    const response = await $fetch(`/api/check-kasera?order_id=${orderIdInduk}`)
    
    if (response.payment_status === 'paid' || response.status === 'already_paid') {
      tiketData.value.status_bayar = 'paid'
      if (!isSilent) alert('Pembayaran berhasil dikonfirmasi! Tiketmu sudah aktif.')
      isRefreshing.value = false
    } else {
      // Jika pembayaran belum lunas
      if (isSilent && autoPollCount < 4) {
        // Coba lagi secara rahasia setiap 3 detik (maksimal 4 kali)
        autoPollCount++
        setTimeout(() => refreshStatus(true), 3000)
      } else {
        isRefreshing.value = false
        if (!isSilent) alert('Pembayaran belum diterima oleh Kasera. Coba beberapa saat lagi.')
      }
    }
  } catch (err) {
    console.error('Gagal mengecek status:', err)
    isRefreshing.value = false
    if (!isSilent) alert('Terjadi kesalahan saat mengecek status atau pesanan bukan dari Kasera.')
  }
}

const organizerData = ref(null)

let realtimeChannel = null

onMounted(async () => {
  try {
    const { data, error: sbErr } = await supabase
      .from('peserta')
      .select('*, event(nama_event, settings, organizer_id), kategori_tiket(harga)')
      .eq('data_tambahan->>order_id', ticketId)
      .limit(1)
      .single()

    if (sbErr) throw sbErr
    
    if (data) {
      tiketData.value = data
      
      if (data.event?.organizer_id) {
        const { data: org } = await supabase
          .from('organizer_profile')
          .select('no_wa, link_ig, link_web')
          .eq('id', data.event.organizer_id)
          .maybeSingle()
        if (org) organizerData.value = org
      }

      // 1. Cek parameter URL dari balikan Kasera
      if (route.query.status === 'succeeded' && tiketData.value.status_bayar === 'pending') {
        // Cek secara diam-diam tanpa alert
        refreshStatus(true)
      }

      // 2. Berlangganan Supabase Realtime agar ter-update ajaib
      if (tiketData.value.status_bayar === 'pending') {
        realtimeChannel = supabase
          .channel('tiket-lunas-listener')
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'peserta',
              filter: `id=eq.${tiketData.value.id}` 
            },
            (payload) => {
              if (payload.new.status_bayar === 'paid') {
                tiketData.value.status_bayar = 'paid'
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
  --primary: #0F172A;
  --accent: #2563EB;
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
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
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
  color: #2563EB;
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

/* Promo Link Minimalis */
.promo-footer {
  margin-top: 30px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}
.promo-footer .promo-link {
  color: var(--primary);
  font-weight: 800;
  text-decoration: underline;
  text-decoration-color: #CBD5E1;
  text-underline-offset: 3px;
  margin-left: 4px;
  transition: 0.2s;
}
.promo-footer .promo-link:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
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

.action-buttons { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
.btn { width: 100%; padding: 16px; border-radius: 14px; border: none; font-weight: 800; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 0.9rem; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-download { background: var(--primary); color: white; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2); }
.btn-download:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(15, 23, 42, 0.3); }
.btn-download:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-wa { background: #25D366; color: white; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.2); }
.btn-wa:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(37, 211, 102, 0.3); }

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
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
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
