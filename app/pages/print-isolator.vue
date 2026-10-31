<template>
  <div class="isolator-container">
    <audio ref="printAudioRef" src="/printer.mp3" preload="auto"></audio>

    <div class="controls-panel">
      <h2>Koleksi Animasi Tiket</h2>
      <p class="subtitle">Eksplorasi gaya Wallet (A) dan simpan gaya VIP (C).</p>
      
      <div class="btn-group">
        <button @click="play('A1')" class="btn">A1: Classic White Wallet</button>
        <button @click="play('A2')" class="btn">A2: Frosted Glass Wallet</button>
        <button @click="play('A3')" class="btn">A3: Dark Neon Wallet</button>
        <button @click="play('A4')" class="btn" style="background:#8b5cf6">A4: Mechanical Sync</button>
        <button @click="play('C')" class="btn btn-outline">C: VIP Pass (Cadangan)</button>
        <button @click="play('none')" class="btn btn-reset">Tutup</button>
      </div>
    </div>

    <!-- ==============================================
         STYLE A1: CLASSIC WHITE WALLET
         ============================================== -->
    <div v-if="activeStyle === 'A1'" class="overlay style-a">
      <div class="backdrop-blur"></div>
      <div class="wallet-wrapper">
        <div class="wallet-slot"></div>
        <div class="wallet-mask">
          <div class="ticket-card t-classic">
            <div class="t-header-row">
              <div class="t-event-info">
                <div class="t-event-name">KONSER GALAXY 2026</div>
                <div class="t-event-date">14 Nov 2026 • 19:00 WIB</div>
              </div>
              <span class="t-badge">BOOKING PASS</span>
            </div>
            
            <div class="t-divider"></div>
            
            <div class="t-guest-row">
              <div class="t-guest-col">
                <div class="t-label">NAMA PESERTA</div>
                <div class="t-value">Budi Santoso</div>
              </div>
              <div class="t-guest-col text-right">
                <div class="t-label">KATEGORI</div>
                <div class="t-value">VIP FESTIVAL</div>
              </div>
            </div>

            <div class="t-barcode-section">
              <div class="barcode-lines"></div>
              <div class="t-trx-number">TRX-GLX-X9B21</div>
            </div>

            <div class="t-divider-dashed"></div>
            
            <div class="t-footer">
              <span class="t-qty">1 x TIKET</span>
              <span class="t-status">MEMPROSES</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-status"><span class="loading-dot"></span> Mencatat pesanan...</div>
    </div>

    <!-- ==============================================
         STYLE A2: FROSTED GLASS WALLET
         ============================================== -->
    <div v-if="activeStyle === 'A2'" class="overlay style-a">
      <div class="backdrop-gradient-blue"></div>
      <div class="wallet-wrapper">
        <div class="wallet-slot glass-slot"></div>
        <div class="wallet-mask">
          <div class="ticket-card t-glass">
            <div class="glass-reflection"></div>
            <div class="t-header-row">
              <div class="t-event-info">
                <div class="t-event-name glass-text">KONSER GALAXY 2026</div>
                <div class="t-event-date glass-subtext">14 Nov 2026 • 19:00 WIB</div>
              </div>
              <span class="t-badge glass-badge">BOOKING PASS</span>
            </div>
            
            <div class="t-divider glass-divider"></div>
            
            <div class="t-guest-row">
              <div class="t-guest-col">
                <div class="t-label glass-label">NAMA PESERTA</div>
                <div class="t-value glass-text">Budi Santoso</div>
              </div>
              <div class="t-guest-col text-right">
                <div class="t-label glass-label">KATEGORI</div>
                <div class="t-value glass-text">VIP FESTIVAL</div>
              </div>
            </div>

            <div class="t-barcode-section">
              <div class="barcode-lines glass-barcode"></div>
              <div class="t-trx-number glass-subtext">TRX-GLX-X9B21</div>
            </div>

            <div class="t-divider-dashed glass-divider-dashed"></div>
            
            <div class="t-footer">
              <span class="t-qty glass-label">1 x TIKET</span>
              <span class="t-status glass-status">MEMPROSES</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-status"><span class="loading-dot"></span> Mencatat pesanan...</div>
    </div>

    <!-- ==============================================
         STYLE A3: DARK NEON WALLET
         ============================================== -->
    <div v-if="activeStyle === 'A3'" class="overlay style-a">
      <div class="backdrop-dark"></div>
      <div class="wallet-wrapper">
        <div class="wallet-slot neon-slot"></div>
        <div class="wallet-mask">
          <div class="ticket-card t-dark-neon">
            <div class="t-header-row">
              <div class="t-event-info">
                <div class="t-event-name neon-text">KONSER GALAXY 2026</div>
                <div class="t-event-date neon-subtext">14 Nov 2026 • 19:00 WIB</div>
              </div>
              <span class="t-badge neon-badge">BOOKING PASS</span>
            </div>
            
            <div class="t-divider neon-divider"></div>
            
            <div class="t-guest-row">
              <div class="t-guest-col">
                <div class="t-label neon-label">NAMA PESERTA</div>
                <div class="t-value neon-text">Budi Santoso</div>
              </div>
              <div class="t-guest-col text-right">
                <div class="t-label neon-label">KATEGORI</div>
                <div class="t-value neon-text">VIP FESTIVAL</div>
              </div>
            </div>

            <div class="t-barcode-section">
              <div class="barcode-lines neon-barcode"></div>
              <div class="t-trx-number neon-subtext">TRX-GLX-X9B21</div>
            </div>

            <div class="t-divider-dashed neon-divider-dashed"></div>
            
            <div class="t-footer">
              <span class="t-qty neon-label">1 x TIKET</span>
              <span class="t-status neon-status">MEMPROSES</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-status dark-status"><span class="loading-dot neon-dot"></span> Mencatat pesanan...</div>
    </div>

    <!-- ==============================================
         STYLE A4: MECHANICAL SYNC (EXPERIMENTAL)
         ============================================== -->
    <div v-if="activeStyle === 'A4'" class="overlay style-a">
      <div class="backdrop-blur"></div>
      <div class="wallet-wrapper">
        <div class="wallet-slot"></div>
        <div class="wallet-mask">
          <div class="ticket-card t-classic t-mechanical">
            <div class="t-header-row">
              <div class="t-event-info">
                <div class="t-event-name">KONSER GALAXY 2026</div>
                <div class="t-event-date">14 Nov 2026 • 19:00 WIB</div>
              </div>
              <span class="t-badge">BOOKING PASS</span>
            </div>
            
            <div class="t-divider"></div>
            
            <div class="t-guest-row">
              <div class="t-guest-col">
                <div class="t-label">NAMA PESERTA</div>
                <div class="t-value">Budi Santoso</div>
              </div>
              <div class="t-guest-col text-right">
                <div class="t-label">KATEGORI</div>
                <div class="t-value">VIP FESTIVAL</div>
              </div>
            </div>

            <div class="t-barcode-section">
              <div class="barcode-lines"></div>
              <div class="t-trx-number">TRX-GLX-X9B21</div>
            </div>

            <div class="t-divider-dashed"></div>
            
            <div class="t-footer">
              <span class="t-qty">1 x TIKET</span>
              <span class="t-status">MEMPROSES</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-status"><span class="loading-dot"></span> Mencetak pesanan...</div>
    </div>

    <!-- ==============================================
         STYLE C: VIP PASS (Disimpan untuk Cadangan)
         ============================================== -->
    <div v-if="activeStyle === 'C'" class="overlay style-c">
      <div class="backdrop-gradient"></div>
      <div class="vip-wrapper">
        <div class="vip-card">
          <div class="vip-lanyard"></div>
          <div class="vip-clip"></div>
          <div class="vip-hole"></div>
          
          <div class="v-content">
            <div class="v-header">
              <span class="v-badge">VIP GUEST</span>
              <span class="v-event">KONSER GALAXY 2026</span>
            </div>
            
            <div class="v-middle">
              <div class="v-access-box">ALL ACCESS</div>
              <div class="v-qr-code">
                <div class="qr-pattern"></div>
                <div class="qr-eye top-left"></div>
                <div class="qr-eye top-right"></div>
                <div class="qr-eye bottom-left"></div>
              </div>
            </div>

            <div class="v-footer">
              <div class="v-name">Budi Santoso</div>
              <div class="v-trx-row">
                <span class="v-trx">ID: GLX-X9B21</span>
                <span class="v-status">VALID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeStyle = ref('none')
const printAudioRef = ref(null)

const play = (style) => {
  activeStyle.value = 'none'
  
  if (style !== 'none') {
    setTimeout(() => {
      activeStyle.value = style
      
      // Mainkan suara
      if (printAudioRef.value) {
        printAudioRef.value.currentTime = 0
        printAudioRef.value.play().catch(e => console.warn(e))
      }

      // Animasi naik 2.5 detik. Kita tutup setelah 3.5 detik 
      // agar ada "jeda stop" selama 1 detik penuh di akhir sebelum menghilang.
      setTimeout(() => {
        activeStyle.value = 'none'
        if (printAudioRef.value) {
          printAudioRef.value.pause()
        }
      }, 3500)

    }, 50)
  }
}
</script>

<style scoped>
/* GENERAL STYLES */
.isolator-container { min-height: 100vh; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
.controls-panel { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; max-width: 400px; z-index: 10; position: relative; }
h2 { margin: 0 0 5px; color: #0f172a; font-size: 1.5rem; letter-spacing: -0.5px; }
.subtitle { color: #64748b; font-size: 0.9rem; margin-bottom: 25px; line-height: 1.4; }
.btn-group { display: flex; flex-direction: column; gap: 10px; }
.btn { padding: 14px 20px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: #f1f5f9; color: #334155; }
.btn:hover { background: #e2e8f0; transform: translateY(-1px); }
.btn-outline { background: transparent; border: 2px solid #e2e8f0; color: #475569; margin-top: 10px; }
.btn-reset { background: #fee2e2; color: #ef4444; }
.btn-reset:hover { background: #fecaca; }

/* OVERLAY BASICS */
.overlay { position: fixed; inset: 0; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; perspective: 1200px; }
.backdrop-blur { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); animation: fadeIn 0.4s ease-out; }
.backdrop-gradient-blue { position: absolute; inset: 0; background: linear-gradient(135deg, #0f172a, #1e3a8a); animation: fadeIn 0.4s ease-out; }
.backdrop-dark { position: absolute; inset: 0; background: #020617; animation: fadeIn 0.4s ease-out; }
.backdrop-gradient { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(2, 6, 23, 1) 100%); animation: fadeIn 0.4s ease-out; }

@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

/* ==============================================
   WALLET ANIMATION CORE (Dipakai A1, A2, A3)
   ============================================== */
.wallet-wrapper { position: relative; width: 320px; height: 420px; display: flex; justify-content: center; z-index: 10; }
.wallet-slot { position: absolute; bottom: 0; width: 320px; height: 24px; background: linear-gradient(to bottom, #1e293b, #020617); border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.3); z-index: 30; }
.wallet-mask { position: absolute; bottom: 12px; width: 280px; height: 380px; overflow: hidden; z-index: 5; border-radius: 20px; }

.ticket-card { 
  width: 100%; height: 100%; border-radius: 20px; padding: 32px 24px; 
  display: flex; flex-direction: column; position: relative;
  transform: translateY(100%) scale(0.95); opacity: 1; /* Selalu solid, tidak pudar */
  /* Diubah ke linear agar pergerakannya benar-benar konstan/pelan dari awal sampai akhir */
  animation: walletSlide 2.5s linear forwards; 
  animation-delay: 0.1s;
}

@keyframes walletSlide { 
  0% { transform: translateY(100%) scale(0.95); } 
  100% { transform: translateY(0) scale(1); } 
}

/* ==============================================
   TICKET SHARED LAYOUT (Dipakai A1, A2, A3)
   ============================================== */
.t-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.t-event-info { display: flex; flex-direction: column; gap: 4px; }
.t-event-name { font-size: 16px; font-weight: 800; line-height: 1.2; letter-spacing: -0.5px; }
.t-event-date { font-size: 11px; font-weight: 600; }
.t-badge { font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 100px; letter-spacing: 1px; white-space: nowrap; }

.t-divider { width: 100%; height: 1px; margin-bottom: 20px; }
.t-divider-dashed { width: 100%; border-top: 1px dashed; margin: 20px 0; opacity: 0.3; }

.t-guest-row { display: flex; justify-content: space-between; margin-bottom: 24px; }
.t-guest-col { display: flex; flex-direction: column; gap: 4px; }
.text-right { text-align: right; }
.t-label { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; }
.t-value { font-size: 16px; font-weight: 800; }

.t-barcode-section { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto 0; }
.barcode-lines { width: 85%; height: 35px; margin-bottom: 6px; }
.t-trx-number { font-family: monospace; font-size: 12px; font-weight: 600; letter-spacing: 2px; }

.t-footer { display: flex; justify-content: space-between; align-items: center; }
.t-qty { font-size: 12px; font-weight: 700; }
.t-status { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px; }

/* ==============================================
   A1: CLASSIC WHITE WALLET
   ============================================== */
.t-classic { background: #ffffff; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); color: #0f172a; }
.t-classic .t-event-date { color: #64748b; }
.t-classic .t-badge { background: #f1f5f9; color: #475569; }
.t-classic .t-divider { background: #e2e8f0; }
.t-classic .t-divider-dashed { border-color: #94a3b8; }
.t-classic .t-label { color: #94a3b8; }
.t-classic .barcode-lines { background: repeating-linear-gradient(90deg, #0f172a 0, #0f172a 2px, transparent 2px, transparent 4px, #0f172a 4px, #0f172a 6px, transparent 6px, transparent 9px); opacity: 0.8; }
.t-classic .t-trx-number { color: #475569; }
.t-classic .t-qty { color: #64748b; }
.t-classic .t-status { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }

/* ==============================================
   A2: FROSTED GLASS WALLET
   ============================================== */
.glass-slot { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px); box-shadow: none; }
.t-glass { background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 30px 60px rgba(0,0,0,0.2); color: white; }
.glass-reflection { position: absolute; top: 0; left: 0; right: 0; height: 100px; background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%); border-radius: 20px 20px 0 0; pointer-events: none; }
.t-glass .glass-text { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.t-glass .glass-subtext { color: rgba(255,255,255,0.8); }
.t-glass .glass-badge { background: rgba(255,255,255,0.2); color: #ffffff; }
.t-glass .glass-divider { background: rgba(255,255,255,0.2); }
.t-glass .glass-divider-dashed { border-color: white; }
.t-glass .glass-label { color: rgba(255,255,255,0.7); }
.t-glass .glass-barcode { background: repeating-linear-gradient(90deg, #fff 0, #fff 2px, transparent 2px, transparent 4px, #fff 4px, #fff 6px, transparent 6px, transparent 9px); opacity: 0.9; }
.t-glass .glass-status { background: rgba(255,255,255,0.2); color: #fff; }

/* ==============================================
   A3: DARK NEON WALLET
   ============================================== */
.neon-slot { background: #000; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(59, 130, 246, 0.4); border-top: 1px solid #3b82f6; }
.t-dark-neon { background: #0f172a; border: 1px solid #1e293b; box-shadow: inset 0 0 0 1px #3b82f6, 0 20px 40px rgba(0,0,0,0.8); color: #f8fafc; }
.t-dark-neon .neon-text { color: #f8fafc; }
.t-dark-neon .neon-subtext { color: #94a3b8; }
.t-dark-neon .neon-badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.5); }
.t-dark-neon .neon-divider { border-top: 1px dashed #334155; height: 0; background: transparent; }
.t-dark-neon .neon-divider-dashed { border-color: #334155; }
.t-dark-neon .neon-label { color: #64748b; }
.t-dark-neon .neon-barcode { background: repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 2px, transparent 2px, transparent 4px, #3b82f6 4px, #3b82f6 6px, transparent 6px, transparent 9px); opacity: 0.7; }
.t-dark-neon .neon-status { color: #020617; background: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }

/* ==============================================
   A4: MECHANICAL SYNC (EXPERIMENTAL)
   ============================================== */
.t-mechanical {
  /* Animasi koreografi: bergerak halus lalu jeda, sesuai ritme mesin printer nyata */
  animation: printerChoreo 3.2s cubic-bezier(0.4, 0, 0.2, 1) forwards !important; 
  animation-delay: 0.1s !important;
}

@keyframes printerChoreo { 
  0%   { transform: translateY(100%); } 
  
  /* Keluar awal (Header tiket) */
  15%  { transform: translateY(75%); } 
  25%  { transform: translateY(75%); } /* Berhenti baca data */
  
  /* Keluar panjang (Isi tiket) */
  60%  { transform: translateY(20%); } 
  75%  { transform: translateY(20%); } /* Berhenti sebentar */
  
  /* Keluar sedikit (Barcode) */
  90%  { transform: translateY(5%); } 
  95%  { transform: translateY(5%); } /* Jeda sebelum potong kertas */
  
  /* Final Cekrek */
  100% { transform: translateY(0); } 
}

/* STATUS POPUP */
.loading-status { position: absolute; bottom: 40px; background: white; padding: 12px 24px; border-radius: 100px; font-weight: 600; font-size: 0.9rem; color: #0f172a; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1s; opacity: 0; transform: translateY(20px); z-index: 40; }
.dark-status { background: #1e293b; color: white; border: 1px solid #334155; }
.loading-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 10px #3b82f6; }
.neon-dot { background: #60a5fa; box-shadow: 0 0 10px #60a5fa; }
@keyframes popIn { to { opacity: 1; transform: translateY(0); } }


/* ==============================================
   STYLE C: VIP PASS (DIAMBIL DARI YANG LAMA)
   ============================================== */
.vip-wrapper { position: relative; z-index: 10; perspective: 1200px; padding-top: 60px; }
.vip-card { width: 280px; height: 420px; background: #111111; background-image: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.5) 100%); border-radius: 12px; position: relative; padding: 40px 20px 24px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15); transform: rotateX(60deg) rotateY(10deg) translateZ(-100px) translateY(100px) scale(0.8); opacity: 0; animation: cardFlip 1.4s cubic-bezier(0.2, 0.8, 0.2, 1.1) forwards; animation-delay: 0.1s; }
@keyframes cardFlip { 0% { transform: rotateX(60deg) rotateY(10deg) translateZ(-100px) translateY(100px) scale(0.8); opacity: 0; } 100% { transform: rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0) scale(1); opacity: 1; } }
.vip-lanyard { position: absolute; top: -140px; left: 50%; transform: translateX(-50%); width: 22px; height: 150px; background: repeating-linear-gradient(90deg, #1e293b, #0f172a 4px, #1e293b 8px); z-index: -2; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
.vip-clip { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); width: 24px; height: 35px; background: linear-gradient(to bottom, #94a3b8, #cbd5e1); border-radius: 4px; z-index: -1; box-shadow: inset 0 2px 4px white, 0 4px 6px rgba(0,0,0,0.4); border: 1px solid #64748b; }
.vip-hole { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 44px; height: 10px; background: #000; border-radius: 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.1); }
.v-content { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
.v-header { text-align: center; margin-top: 10px; }
.v-badge { display: inline-block; font-size: 11px; font-weight: 900; color: #111; background: linear-gradient(to right, #fbbf24, #f59e0b); padding: 4px 12px; border-radius: 4px; letter-spacing: 2px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3); }
.v-event { display: block; font-size: 15px; font-weight: 800; color: #e2e8f0; letter-spacing: 1px; line-height: 1.3; }
.v-middle { display: flex; flex-direction: column; align-items: center; margin: auto 0; }
.v-access-box { font-size: 24px; font-weight: 900; color: rgba(255,255,255,0.05); text-transform: uppercase; letter-spacing: 8px; margin-bottom: 16px; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 8px 0; width: 100%; text-align: center; }
.v-qr-code { width: 130px; height: 130px; background: #ffffff; padding: 6px; border-radius: 8px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
.qr-pattern { width: 100%; height: 100%; background-image: radial-gradient(#000 35%, transparent 35%); background-size: 8px 8px; opacity: 0.85; }
.qr-eye { position: absolute; width: 28px; height: 28px; border: 4px solid #000; background: white; border-radius: 4px; }
.qr-eye::after { content: ''; position: absolute; top: 4px; left: 4px; right: 4px; bottom: 4px; background: #000; border-radius: 2px; }
.qr-eye.top-left { top: 6px; left: 6px; }
.qr-eye.top-right { top: 6px; right: 6px; }
.qr-eye.bottom-left { bottom: 6px; left: 6px; }
.v-footer { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 16px; text-align: left; }
.v-name { font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 8px; letter-spacing: 0.5px; }
.v-trx-row { display: flex; justify-content: space-between; align-items: center; }
.v-trx { font-family: monospace; color: #94a3b8; font-size: 13px; font-weight: 600; }
.v-status { color: #10b981; font-weight: 800; font-size: 11px; letter-spacing: 1px; display: flex; align-items: center; gap: 4px; }
.v-status::before { content: ''; display: block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }

</style>
