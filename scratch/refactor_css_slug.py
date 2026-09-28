import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# I will replace the template and add styles to <style scoped>
new_template = """<template>
  <div class="container">
    <!-- PUBLIC TOAST -->
    <div v-if="toastMessage" class="toast-message" :class="toastType === 'success' ? 'toast-success' : 'toast-error'">
      {{ toastMessage }}
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="state-message">
      Mempersiapkan ruang yang aman dan nyaman...
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="state-message error-text">
      {{ error }}
    </div>

    <!-- Tampilan Landing Page Event (HOME) -->
    <div v-else-if="currentStep === 'home'" class="step-content active step-home">
      <div class="glass glass-home">
        
        <EventHeader 
          :eventData="eventData"
          :organizerProfile="organizerProfile"
          :totalMaksimalKuota="totalMaksimalKuota"
          :totalSisaKuota="totalSisaKuota"
          :persentaseTerisi="persentaseTerisi"
        />

        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          @update-keranjang="updateKeranjang"
        />

        <!-- Tombol Daftar -->
        <button @click="lanjutDaftar" class="btn-register">
          <div class="btn-register-text">DAFTAR SEKARANG ➔</div>
          <small v-if="totalQty > 0" class="btn-register-sub">
            {{ totalQty }} Tiket • {{ totalPrice === 0 ? 'GRATIS' : formatPrice(totalPrice) }}
          </small>
        </button>

        <!-- Tombol Sosial Media -->
        <div class="social-grid">
          <a :href="organizerProfile.link_ig || '#'" target="_blank" class="social-btn">
            <span class="social-text">Instagram</span>
          </a>
          <a :href="formatWaLink(organizerProfile.no_wa)" target="_blank" class="social-btn">
            <span class="social-text">WhatsApp</span>
          </a>
          <a :href="organizerProfile.link_web || '#'" target="_blank" class="social-btn">
            <span class="social-text">Website</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Tampilan Syarat & Ketentuan (S&K) -->
    <div v-else-if="currentStep === 'snk'" class="step-content active step-padded">
      <h3 class="step-title">Syarat & Ketentuan</h3>
      <p class="step-subtitle">Mohon baca dan setujui sebelum melanjutkan</p>
      
      <div class="snk-box">
        {{ eventData.settings?.snk_text || 'Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.' }}
      </div>
      
      <label class="snk-label">
        <input type="checkbox" v-model="isSetujuSnk" class="snk-checkbox">
        Saya menyetujui persyaratan di atas
      </label>

      <div class="action-row">
        <button @click="currentStep = 'home'" class="btn-action btn-secondary">KEMBALI</button>
        <button @click="setujuDanLanjut" class="btn-action btn-primary">LANJUTKAN ➔</button>
      </div>
    </div>

    <!-- Tampilan Form Data Diri (FORM) -->
    <div v-else-if="currentStep === 'form'" class="step-content active step-padded">
      <h3 class="step-title-left">Data Diri Peserta</h3>
      
      <ParticipantForm 
        :daftarPeserta="daftarPeserta" 
        :customFields="customFields" 
        @toast="showToastMsg"
      />

      <div class="action-row">
        <button @click="kembaliKeSnkAtauHome" class="btn-action btn-secondary">KEMBALI</button>
        <button @click="lanjutBayar" class="btn-action btn-primary">LANJUT BAYAR ➔</button>
      </div>
    </div>

    <!-- Tampilan Pembayaran (BAYAR) -->
    <div v-else-if="currentStep === 'bayar'" class="step-content active step-padded">
      <CheckoutPayment 
        :grandTotal="grandTotal"
        :totalQty="totalQty"
        :totalPrice="totalPrice"
        :adminFee="adminFee"
        :kodeUnik="kodeUnik"
        :buktiBayarPreview="buktiBayarPreview"
        :uploadError="uploadError"
        :isSubmitting="isSubmitting"
        @file-upload="handleFileUpload"
        @back="currentStep = 'form'"
        @submit="submitData"
        @toast="showToastMsg"
      />
    </div>

    <!-- Tampilan Sukses (SUKSES) -->
    <div v-else-if="currentStep === 'sukses'" class="step-content active">
      <SuccessStep 
        :eventData="eventData"
        @kirim-wa="kirimWA"
        @buka-grup="bukaGrupWa"
      />
    </div>
  </div>

  <!-- PRINTER ANIMATION OVERLAY -->
  <div class="api-loader" :class="{ active: isSubmitting }">
    <div class="printer-wrapper">
      <div class="printer-slot"><div class="printer-slot-inner"><div class="printer-slot-light"></div></div></div>
      <div class="printer-mask">
        <div class="ticket-paper-output">
          <div class="ticket-header-star">★ E-TICKET RESMI ★</div>
          <div class="ticket-header-event">{{ eventData?.nama_event || 'EVENT' }}</div>
          
          <div class="ticket-divider"></div>
          
          <div class="ticket-owner-box">
            <span class="ticket-owner-label">PESERTA</span>
            <span class="ticket-owner-name">{{ daftarPeserta[0]?.jawaban?.nama_lengkap || 'PESERTA' }}</span>
          </div>

          <div class="ticket-trx-box">
             <span class="ticket-trx-id">{{ transactionIdGlobal || 'MEMPROSES...' }}</span>
          </div>

          <div class="ticket-summary-box">
             <span>{{ daftarPeserta.length }} TIKET</span>
             <span class="ticket-status-paid">LUNAS</span>
          </div>
          
          <div class="fake-barcode-area">
             <div class="bar-4"></div><div class="bar-8"></div>
             <div class="bar-4"></div><div class="bar-16"></div>
             <div class="bar-4"></div><div class="bar-4"></div>
             <div class="bar-8"></div><div class="bar-12"></div>
             <div class="bar-4"></div><div class="bar-16"></div>
             <div class="bar-4"></div><div class="bar-8"></div>
             <div class="bar-8"></div><div class="bar-4"></div>
             <div class="bar-16"></div><div class="bar-4"></div>
             <div class="bar-12"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading-badge">
      <div class="loading-dot"></div>
      MENCETAK TIKET...
    </div>
  </div>
</template>"""

# Replace the template
new_file_content = re.sub(r'<template>.*?</template>', new_template, content, flags=re.DOTALL)

# Add extra CSS classes to <style scoped>
extra_styles = """
/* Refactored CSS Classes */
.toast-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  animation: slideDown 0.3s ease-out;
  color: #fff;
}
.toast-success { background: #1a6a4a; }
.toast-error { background: #d43f34; }

.state-message {
  padding: 50px;
  text-align: center;
  color: var(--text-main);
}
.error-text { color: #ef4444; }

.step-home { padding: 6px; }
.glass-home { margin-top: 0px; padding: 1rem 1rem 0.5rem 1rem; }

.btn-register {
  margin-top: 0;
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.85rem;
  flex-direction: column;
  line-height: 1.2;
  width: 100%;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn-register-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
.btn-register-sub {
  font-size: 0.65rem;
  font-weight: 600;
  opacity: 0.9;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}
.social-btn {
  background: #ffffff;
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  border: 1px solid #e2e8f0;
  transition: 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.social-text {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.step-padded { padding: 12px 15px; }

.step-title {
  margin-top: 0;
  color: var(--primary);
  text-align: center;
}
.step-title-left {
  margin-top: 0;
}
.step-subtitle {
  font-size: 0.8rem;
  text-align: center;
  color: var(--text-muted);
  margin-top: -5px;
}

.snk-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  max-height: 250px;
  overflow-y: auto;
  font-size: 0.7rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 10px;
  white-space: pre-wrap;
}
.snk-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
}
.snk-checkbox {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.action-row {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}
.btn-action {
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.btn-secondary {
  flex: 3;
  background: #e2e8f0;
  color: #475569;
}
.btn-primary {
  flex: 7;
  background: var(--primary);
  color: white;
}

.ticket-header-star {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 4px;
  text-align: center;
}
.ticket-header-event {
  font-size: 9px;
  font-weight: 800;
  color: var(--text-muted);
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
}
.ticket-divider {
  width: 100%;
  border-top: 2px dashed #cbd5e1;
  margin-bottom: 16px;
}
.ticket-owner-box {
  width: 100%;
  text-align: center;
}
.ticket-owner-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
  display: block;
  margin-bottom: 2px;
}
.ticket-owner-name {
  font-size: 14px;
  font-weight: 900;
  color: var(--text-main);
  text-transform: uppercase;
}
.ticket-trx-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  padding: 6px 0;
  border-top: 1px dashed #cbd5e1;
  border-bottom: 1px dashed #cbd5e1;
}
.ticket-trx-id {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-main);
  font-family: monospace;
  letter-spacing: 2px;
}
.ticket-summary-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  font-size: 10px;
  font-weight: 900;
  color: var(--text-muted);
  border-top: 1px dotted #cbd5e1;
  padding-top: 8px;
}
.ticket-status-paid { color: var(--primary); }

.bar-4 { width: 4px; }
.bar-8 { width: 8px; }
.bar-12 { width: 12px; }
.bar-16 { width: 16px; }

</style>
"""

new_file_content = new_file_content.replace('</style>', extra_styles)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(new_file_content)
