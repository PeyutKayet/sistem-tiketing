<template>
  <div>
    <!-- OVERLAY 1: GENERIC MEMPROSES (Loading Data) -->
    <div v-if="isSubmitting && !isPrinting" class="glass-overlay">
      <div class="modern-spinner-box">
        <div class="spinner-ring"></div>
        <div class="spinner-core"></div>
        <h3 class="spinner-title">MEMPROSES</h3>
        <p class="spinner-subtitle">Mengamankan kuota tiket Anda...</p>
      </div>
    </div>

    <!-- OVERLAY 2: TICKET PRINTER ANIMATION (A1 Classic White Wallet) -->
    <div v-if="isPrinting" class="overlay style-a">
      <div class="backdrop-blur"></div>
      <div class="wallet-wrapper">
        <div class="wallet-slot"></div>
        <div class="wallet-mask">
          <div class="ticket-card t-classic">
            <div class="t-header-row">
              <div class="t-event-info">
                <div class="t-event-name">{{ eventData?.nama_event || 'EVENT' }}</div>
                <div class="t-event-date">{{ eventDate }} • {{ eventTime }}</div>
              </div>
              <span class="t-badge">BOOKING PASS</span>
            </div>
            
            <div class="t-divider"></div>
            
            <div class="t-guest-row">
              <div class="t-guest-col">
                <div class="t-label">NAMA PESERTA</div>
                <div class="t-value">{{ pesertaName }}</div>
              </div>
              <div class="t-guest-col text-right">
                <div class="t-label">KATEGORI</div>
                <div class="t-value">{{ categoryName }}</div>
              </div>
            </div>

            <div class="t-barcode-section">
              <div class="barcode-lines"></div>
              <div class="t-trx-number">{{ transactionId || 'TRX-MEMPROSES...' }}</div>
            </div>

            <div class="t-divider-dashed"></div>
            
            <div class="t-footer">
              <span class="t-qty">{{ ticketCount }} x TIKET</span>
              <span class="t-status">MEMPROSES</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-status"><span class="loading-dot"></span> Mencatat pesanan...</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isSubmitting: Boolean,
  isPrinting: Boolean,
  eventData: Object,
  daftarPeserta: Array,
  transactionId: String
})

const pesertaName = computed(() => {
  return props.daftarPeserta && props.daftarPeserta.length > 0
    ? (props.daftarPeserta[0]?.jawaban?.nama_lengkap || 'PESERTA')
    : 'PESERTA'
})

const categoryName = computed(() => {
  return props.daftarPeserta && props.daftarPeserta.length > 0
    ? (props.daftarPeserta[0]?.namaTiket || 'REGULER')
    : 'REGULER'
})

const ticketCount = computed(() => {
  return props.daftarPeserta ? props.daftarPeserta.length : 0
})

// Gunakan default statis jika tanggal event tidak diset agar desain tidak kosong
const eventDate = computed(() => {
  if (props.eventData?.tanggal_mulai) {
    const d = new Date(props.eventData.tanggal_mulai)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return 'SEGERA'
})
const eventTime = computed(() => {
  if (props.eventData?.waktu_mulai) {
    return props.eventData.waktu_mulai.substring(0, 5) + ' WIB'
  }
  return 'WIB'
})
</script>

<style scoped>
/* =========================================
   GENERIC LOADING OVERLAY (Profesional)
   ========================================= */
.glass-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 99999; display: flex; align-items: center; justify-content: center; }
.modern-spinner-box { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px 50px; border-radius: 24px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
.spinner-ring { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-top-color: var(--primary, #3b82f6); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 24px; position: relative; }
.spinner-core { position: absolute; width: 12px; height: 12px; background: var(--primary, #3b82f6); border-radius: 50%; top: 58px; box-shadow: 0 0 15px var(--primary, #3b82f6); animation: pulse-core 2s ease-in-out infinite; }
.spinner-title { margin: 0; font-weight: 700; color: white; font-size: 1.1rem; letter-spacing: 0.5px; }
.spinner-subtitle { margin: 6px 0 0; font-size: 0.85rem; color: #94a3b8; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse-core { 0%, 100% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }


/* =========================================
   A1: CLASSIC WHITE WALLET OVERLAY
   ========================================= */
.overlay { position: fixed; inset: 0; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; perspective: 1200px; }
.backdrop-blur { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

.wallet-wrapper { position: relative; width: 320px; height: 420px; display: flex; justify-content: center; z-index: 10; }
.wallet-slot { position: absolute; bottom: 0; width: 320px; height: 24px; background: linear-gradient(to bottom, #1e293b, #020617); border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.3); z-index: 30; }
.wallet-mask { position: absolute; bottom: 12px; width: 280px; height: 380px; overflow: hidden; z-index: 5; border-radius: 20px; }

.ticket-card { 
  width: 100%; height: 100%; border-radius: 20px; padding: 32px 24px; 
  display: flex; flex-direction: column; position: relative;
  transform: translateY(100%) scale(0.95); opacity: 1;
  animation: printerChoreo 3.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
  animation-delay: 0s;
}

@keyframes printerChoreo { 
  0%   { transform: translateY(100%) scale(0.95); } 
  
  /* Keluar awal (Header tiket) */
  15%  { transform: translateY(75%) scale(0.96); } 
  25%  { transform: translateY(75%) scale(0.96); } 
  
  /* Keluar panjang (Isi tiket) */
  60%  { transform: translateY(20%) scale(0.98); } 
  75%  { transform: translateY(20%) scale(0.98); } 
  
  /* Keluar sedikit (Barcode) */
  90%  { transform: translateY(5%) scale(0.99); } 
  95%  { transform: translateY(5%) scale(0.99); } 
  
  /* Final Cekrek */
  100% { transform: translateY(0) scale(1); } 
}

/* LAYOUT TIKET (Shared) */
.t-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.t-event-info { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.t-event-name { font-size: 16px; font-weight: 800; line-height: 1.2; letter-spacing: -0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.t-event-date { font-size: 11px; font-weight: 600; }
.t-badge { font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 100px; letter-spacing: 1px; white-space: nowrap; }
.t-divider { width: 100%; height: 1px; margin-bottom: 20px; }
.t-divider-dashed { width: 100%; border-top: 1px dashed; margin: 20px 0; opacity: 0.3; }
.t-guest-row { display: flex; justify-content: space-between; margin-bottom: 24px; }
.t-guest-col { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.text-right { text-align: right; }
.t-label { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; }
.t-value { font-size: 16px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
.t-barcode-section { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto 0; }
.barcode-lines { width: 85%; height: 35px; margin-bottom: 6px; }
.t-trx-number { font-family: monospace; font-size: 12px; font-weight: 600; letter-spacing: 2px; }
.t-footer { display: flex; justify-content: space-between; align-items: center; }
.t-qty { font-size: 12px; font-weight: 700; }
.t-status { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px; }

/* WARNA (Classic White) */
.t-classic { background: #ffffff; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); color: #0f172a; font-family: system-ui, -apple-system, sans-serif;}
.t-classic .t-event-date { color: #64748b; }
.t-classic .t-badge { background: #f1f5f9; color: #475569; }
.t-classic .t-divider { background: #e2e8f0; }
.t-classic .t-divider-dashed { border-color: #94a3b8; }
.t-classic .t-label { color: #94a3b8; }
.t-classic .barcode-lines { background: repeating-linear-gradient(90deg, #0f172a 0, #0f172a 2px, transparent 2px, transparent 4px, #0f172a 4px, #0f172a 6px, transparent 6px, transparent 9px); opacity: 0.8; }
.t-classic .t-trx-number { color: #475569; }
.t-classic .t-qty { color: #64748b; }
.t-classic .t-status { color: var(--primary); background: rgba(18, 56, 96, 0.1); }

/* STATUS POPUP */
.loading-status { position: absolute; bottom: 40px; background: white; padding: 12px 24px; border-radius: 100px; font-weight: 600; font-size: 0.9rem; color: #0f172a; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1s; opacity: 0; transform: translateY(20px); z-index: 40; font-family: system-ui, -apple-system, sans-serif;}
.loading-dot { width: 8px; height: 8px; background: var(--accent-yellow); border-radius: 50%; box-shadow: 0 0 10px var(--accent-yellow); }
@keyframes popIn { to { opacity: 1; transform: translateY(0); } }
</style>
