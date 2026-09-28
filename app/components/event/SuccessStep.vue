<template>
  <div class="success-container">
    <div class="icon-wrapper">
      <svg class="success-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    </div>
    
    <h2 class="success-title">Pendaftaran Berhasil!</h2>
    <p class="success-text">Terima kasih telah mendaftar.</p>

    <!-- Notifikasi Admin / WA -->
    <div class="notification-box">
      <p class="notification-text">Lakukan konfirmasi ke admin agar tiket Anda segera di-approve.</p>
      
      <button @click="$emit('kirim-wa')" class="btn btn-wa">
        <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.125-.339-.153-.889-.356-1.956-1.011-1.39-1.206-2.327-3.08-2.39-3.167-.063-.087-.573-.761-.573-1.451 0-.69.356-1.028.48-1.168.125-.14.271-.175.361-.175.09 0 .179.004.258.008.083.004.195-.031.305.234.114.276.391.958.427 1.03.036.073.06.157.014.248-.045.09-.068.145-.138.227-.07.082-.147.177-.208.244-.067.073-.138.153-.058.291.08.138.358.591.768.961.531.479.972.632 1.109.695.138.063.22.052.302-.041.082-.093.356-.411.451-.552.095-.14.19-.118.315-.072.125.047.795.375.932.443.138.068.23.102.264.159.034.057.034.331-.11.736z"></path></svg>
        KONFIRMASI VIA WHATSAPP
      </button>
    </div>

    <!-- Tombol Grup WA -->
    <button v-if="eventData?.settings?.link_grup_wa" @click="$emit('buka-grup')" class="btn btn-group">
      GABUNG GRUP WHATSAPP PESERTA
    </button>
  </div>
</template>

<script setup>
defineProps({
  eventData: { type: Object, default: () => ({}) }
})

defineEmits(['kirim-wa', 'buka-grup'])
</script>

<style scoped>
.success-container {
  padding: 40px 20px;
  text-align: center;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-wrapper {
  width: 80px;
  height: 80px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.2);
}
.success-icon {
  width: 40px;
  height: 40px;
}
.success-title {
  margin: 0 0 10px 0;
  color: var(--text-main);
  font-size: 1.5rem;
}
.success-text {
  color: var(--text-muted);
  margin: 0 0 30px 0;
}
.notification-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 20px;
}
.notification-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0;
  margin-bottom: 15px;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn-icon {
  width: 18px;
  height: 18px;
}
.btn-wa {
  background: #25D366;
  color: white;
  box-shadow: 0 4px 6px rgba(37, 211, 102, 0.2);
}
.btn-group {
  background: #e2e8f0;
  color: #475569;
  max-width: 320px;
}
</style>
