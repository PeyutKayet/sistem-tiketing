<template>
  <div class="confirm-overlay" :class="{ open: confirmData.show }">
    <div class="confirm-box">
      <div class="icon">{{ confirmData.type === 'danger' ? '⚠️' : '❓' }}</div>
      <h3>{{ confirmData.title }}</h3>
      <p>{{ confirmData.message }}</p>
      <div class="btn-row">
        <button class="btn-outline" @click="closeConfirm">Batal</button>
        <button class="btn-primary" :style="{ background: confirmData.type === 'danger' ? '#d43f34' : '#1a6a4a' }" @click="handleConfirm">
          {{ confirmData.actionText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { confirmData, closeConfirm } = useAdmin()

const handleConfirm = () => {
  if (confirmData.value.callback) {
    confirmData.value.callback()
  }
  closeConfirm()
}
</script>

<style scoped>
.confirm-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10, 25, 41, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10000;
  justify-content: center;
  align-items: center;
  padding: 24px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.confirm-overlay.open {
  display: flex;
  opacity: 1;
}
.confirm-box {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 380px;
  padding: 32px;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(20px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
}
.confirm-overlay.open .confirm-box { transform: translateY(0) scale(1); }
.confirm-box .icon { font-size: 48px; margin-bottom: 16px; display: inline-block; }
.confirm-box h3 { font-size: 18px; font-weight: 700; color: #0a1929; margin-bottom: 10px; letter-spacing: -0.3px; }
.confirm-box p { font-size: 14px; color: #4a5a6e; margin-bottom: 28px; line-height: 1.6; }
.confirm-box .btn-row { display: flex; gap: 12px; justify-content: center; }
.confirm-box .btn-row button { flex: 1; padding: 12px 0; font-size: 14px; }
</style>
