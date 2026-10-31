<template>
  <div class="success-container">
    <div class="icon-wrapper">
      <svg class="success-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    </div>
    
    <h2 class="success-title">
      {{ (isPaid || isFree) ? 'Pembayaran Berhasil & E-Ticket Terbit!' : 'Pendaftaran Berhasil!' }}
    </h2>
    <p class="success-text">
      Terima kasih telah mendaftar di <strong>{{ eventData?.nama_event || 'acara ini' }}</strong>.
    </p>

    <!-- AKSI UTAMA (JIKA SUDAH LUNAS / GRATIS) -->
    <div v-if="isPaid || isFree" class="success-actions-box">
      <!-- TOMBOL UTAMA 1 PINTU: KABARI ADMIN & MASUK GRUP WA -->
      <button @click="$emit('kirim-wa')" class="btn btn-wa-primary">
        <div class="btn-wa-inner">
          <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.125-.339-.153-.889-.356-1.956-1.011-1.39-1.206-2.327-3.08-2.39-3.167-.063-.087-.573-.761-.573-1.451 0-.69.356-1.028.48-1.168.125-.14.271-.175.361-.175.09 0 .179.004.258.008.083.004.195-.031.305.234.114.276.391.958.427 1.03.036.073.06.157.014.248-.045.09-.068.145-.138.227-.07.082-.147.177-.208.244-.067.073-.138.153-.058.291.08.138.358.591.768.961.531.479.972.632 1.109.695.138.063.22.052.302-.041.082-.093.356-.411.451-.552.095-.14.19-.118.315-.072.125.047.795.375.932.443.138.068.23.102.264.159.034.057.034.331-.11.736z"></path></svg>
          <div class="btn-text-block">
            <span class="btn-title">{{ eventData?.settings?.link_grup_wa ? 'KABARI ADMIN & MASUK GRUP' : 'KABARI ADMIN PANITIA VIA WA' }}</span>
            <span class="btn-sub">1x Klik Selesai Langsung ke WhatsApp</span>
          </div>
        </div>
      </button>

      <!-- TOMBOL SEKUNDER: LIHAT & SIMPAN TIKET -->
      <button @click="$emit('lihat-tiket')" class="btn btn-ticket-secondary">
        <svg class="btn-icon-sec" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Lihat E-Ticket Resmi Saya</span>
        <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
    </div>

    <!-- STATE MENUNGGU VERIFIKASI (TRANSFER MANUAL PENDING) -->
    <div v-else class="pending-container">
      <div class="pending-notice">
        <p class="pending-text">
          Pesanan Anda telah dicatat. Silakan lakukan transfer dan kirimkan bukti pembayaran ke Admin agar E-Ticket segera diverifikasi.
        </p>
      </div>
      <button @click="$emit('kirim-wa')" class="btn btn-pending-wa">
        <svg class="btn-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        <span>KIRIM BUKTI PEMBAYARAN KE ADMIN</span>
      </button>
    </div>

    <div v-if="isPaid || isFree" class="ticket-reminder">
      <em>💡 Simpan link tiket Anda untuk ditunjukkan saat hadir di lokasi event.</em>
    </div>
  </div>
</template>

<script setup>
defineProps({
  eventData: { type: Object, default: () => ({}) },
  isFree: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false }
})

defineEmits(['kirim-wa', 'buka-grup', 'lihat-tiket'])
</script>

<style scoped>
.success-container {
  padding: 32px 18px;
  text-align: center;
  background: white;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 420px;
  margin: 0 auto;
}
.icon-wrapper {
  width: 72px;
  height: 72px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 18px -2px rgba(22, 163, 74, 0.22);
}
.success-icon {
  width: 38px;
  height: 38px;
}
.success-title {
  margin: 0 0 8px 0;
  color: var(--text-main, #0f172a);
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.3;
}
.success-text {
  color: var(--text-muted, #64748b);
  font-size: 0.9rem;
  margin: 0 0 24px 0;
  line-height: 1.45;
}

.success-actions-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
  box-sizing: border-box;
}

.btn:active {
  transform: scale(0.98);
}

.btn-wa-primary {
  background: #25D366;
  color: white;
  padding: 14px 18px;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
}
.btn-wa-primary:hover {
  background: #20BA56;
  transform: translateY(-1px);
}
.btn-wa-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}
.btn-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.btn-icon-sec {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.btn-text-block {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.btn-title {
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.3px;
}
.btn-sub {
  font-size: 0.72rem;
  opacity: 0.92;
  font-weight: 600;
}

.btn-ticket-secondary {
  background: #F1F5F9;
  color: #1E293B;
  border: 1px solid #CBD5E1;
  padding: 12px 16px;
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
}
.btn-ticket-secondary:hover {
  background: #E2E8F0;
}

/* PENDING STATE */
.pending-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.pending-notice {
  background: #FFFBEB;
  border: 1px dashed #FCD34D;
  padding: 14px 16px;
  border-radius: 12px;
  text-align: left;
}
.pending-text {
  font-size: 0.84rem;
  color: #92400E;
  margin: 0;
  line-height: 1.45;
}
.btn-pending-wa {
  background: #D97706;
  color: white;
  padding: 13px 18px;
  font-size: 0.86rem;
  font-weight: 800;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
}
.btn-pending-wa:hover {
  background: #B45309;
}

.ticket-reminder {
  font-size: 0.76rem;
  color: #64748b;
  line-height: 1.4;
  margin-top: 4px;
}
</style>
