<template>
  <div class="ticket-wrapper">
    <div class="ticket-container">
      
      <div v-if="loading" class="state-msg">⏳ Mengambil Data Tiket...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>
      
      <div v-else class="content-box">
        <!-- Status Pembayaran -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px;">
          <div class="status-badge" :class="tiketData.status_bayar === 'paid' ? 'paid' : 'pending'" style="margin-bottom: 0;">
            {{ tiketData.status_bayar === 'paid' ? '✅ LUNAS' : '⏳ MENUNGGU PEMBAYARAN' }}
          </div>
          
          <button 
            v-if="tiketData.status_bayar === 'pending'"
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
        
        <h2 class="event-title">{{ tiketData.event?.nama_event || 'Event' }}</h2>
        <p class="ticket-type">E-Ticket Preview</p>

        <!-- AREA TIKET (Hanya muncul penuh jika lunas) -->
        <div v-if="tiketData.status_bayar === 'paid'" class="ticket-card-wrapper" style="margin-bottom: 25px;">
          <!-- Elemen ini yang akan di-screenshot -->
          <div id="ticketCard" class="ticket-card">
            <!-- Left Stub -->
            <div class="stub">
               <div class="cutout"></div>
               <div class="stub-text">{{ tiketData.nama_tiket }}</div>
               <div class="perforated"></div>
            </div>

            <!-- Right Body -->
            <div class="body">
               <div class="info-group">
                  <div class="nama">{{ tiketData.nama_lengkap }}</div>
                  
                  <div class="event-info">
                     <div class="nama-event">{{ tiketData.event?.nama_event }}</div>
                     <div class="tanggal">{{ new Date(tiketData.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) }}</div>
                  </div>

                  <div class="ticket-id">{{ tiketData.data_tambahan?.ticket_id || ticketId }}</div>
               </div>

               <!-- QR CODE -->
               <div class="qr-box">
                   <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tiketData.data_tambahan?.ticket_id || ticketId}`" alt="QR Code" crossorigin="anonymous" />
               </div>
            </div>
          </div>
        </div>
        
        <div v-else class="locked-box">
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
           <button v-if="tiketData.status_bayar === 'paid'" @click="unduhTiket" :disabled="isDownloading" class="btn btn-download">
             <span v-if="isDownloading">⏳ Memproses...</span>
             <span v-else>📥 Unduh E-Ticket (Gambar)</span>
           </button>
           
           <button v-if="tiketData.status_bayar === 'paid' && linkGrupWa" @click="bukaGrupWa" class="btn btn-wa">
             💬 Masuk Grup WhatsApp Event
           </button>
        </div>

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

const supabase = useSupabaseClient()

const linkGrupWa = computed(() => {
  return tiketData.value?.event?.settings?.link_grup_wa || null
})

const bukaGrupWa = () => {
  if (linkGrupWa.value) {
    window.open(linkGrupWa.value, '_blank')
  }
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
      backgroundColor: '#ffffff' 
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
      .select('*, event(nama_event, settings, organizer_id)')
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
  justify-content: center;
  align-items: flex-start;
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
}

.state-msg { color: var(--text-muted); font-weight: 700; text-align: center; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.state-msg.error { color: #ef4444; }

.status-badge { padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-block; margin-bottom: 20px; letter-spacing: 0.5px; }
.status-badge.paid { background: #DCFCE7; color: #16A34A; }
.status-badge.pending { background: #FEF9C3; color: #CA8A04; }

.event-title { margin: 0 0 5px 0; color: var(--primary); font-weight: 900; font-size: 1.5rem; line-height: 1.3; letter-spacing: -0.5px; }
.ticket-type { margin: 0 0 25px; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; }

.ticket-card-wrapper {
  overflow-x: auto; /* Agar tidak terpotong di HP super kecil */
  padding: 10px;
  margin: 0 -10px; /* Kompensasi padding */
}

/* DESAIN TIKET PERSIS SEPERTI GAMBAR */
.ticket-card {
  display: flex;
  width: 100%;
  min-width: 420px; /* Memaksa landscape */
  background: white;
  border-radius: 16px;
  border: 1px solid var(--border-soft);
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
}

.stub {
  background: var(--accent);
  color: white;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.stub .cutout {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: white; /* Background container luar card */
  border-radius: 50%;
  box-shadow: inset -1px 0 0 var(--border-soft);
  z-index: 10;
}

.stub-text {
  transform: rotate(-90deg);
  font-weight: 900;
  letter-spacing: 3px;
  font-size: 1.2rem;
  white-space: nowrap;
}

.perforated {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-image: radial-gradient(circle, white 2px, transparent 2.5px);
  background-size: 10px 10px;
  background-position: center;
  z-index: 10;
}

.body {
  flex: 1;
  padding: 25px 25px 25px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: white;
}

.info-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 25px;
}

.nama {
  font-weight: 900;
  font-size: 1.3rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-info {
  display: flex;
  flex-direction: column;
}

.nama-event {
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 4px;
}

.tanggal {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.ticket-id {
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--primary);
  letter-spacing: 1px;
}

.qr-box {
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 10px;
  background: white;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

.qr-box img {
  width: 110px;
  height: 110px;
  display: block;
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
</style>
