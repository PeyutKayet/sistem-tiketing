<template>
  <div id="toastContainer">
    <div v-for="toast in toastList" :key="toast.id" class="toast-msg" :class="[toast.type, { show: toast.show }]">
      <span style="font-size:16px;">
        {{ toast.type === 'error' ? '❌' : (toast.type === 'warning' ? '⚠️' : '✅') }}
      </span>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
const { toastList } = useAdmin()
</script>

<style scoped>
#toastContainer {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
}
.toast-msg {
  background: #ffffff;
  color: #0a1929;
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 32px -8px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  border-left: 4px solid var(--primary);
  transform: translateX(120%);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: 'Inter', sans-serif;
  pointer-events: auto;
}
.toast-msg.show { transform: translateX(0); }
.toast-msg.success { border-left-color: #1a6a4a; }
.toast-msg.error { border-left-color: #d43f34; }
.toast-msg.warning { border-left-color: #b8681a; }
</style>
