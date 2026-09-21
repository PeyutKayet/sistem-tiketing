<template>
  <header class="topbar">
    <div class="left">
      <div class="greeting">
        Halo, <span>{{ userName }}</span>
        <small>· {{ activeTab === 'home' ? 'belum pilih event' : (selectedEvent ? selectedEvent.nama_event : 'belum pilih event') }}</small>
      </div>
    </div>
    <div class="right">
      <div class="notif" id="networkIndicator" :style="{ background: isOnline ? '#e4f0e8' : '#fde8e6', color: isOnline ? '#1a6a4a' : '#d43f34' }" style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:6px 12px; border-radius:20px; opacity:1; cursor:default;" :title="isOnline ? 'Status: Online' : 'Status: Offline'">
        <span id="networkDot" style="display:inline-block; width:8px; height:8px; border-radius:50%; transition:0.3s;" :style="{ background: isOnline ? '#1a6a4a' : '#d43f34', boxShadow: isOnline ? '0 0 6px rgba(26, 106, 74, 0.4)' : '0 0 6px rgba(212, 63, 52, 0.4)' }"></span>
        <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
      </div>
      <div class="avatar" @click="showDropdown = !showDropdown">{{ userInitials }}</div>
      <!-- DROPDOWN -->
      <div class="user-dropdown" :class="{ show: showDropdown }">
        <div class="name">{{ userName }}</div>
        <div class="email">{{ userEmail }}</div>
        <hr />
        <button class="btn-outline" style="width:100%; margin-bottom:10px; border-radius:12px; font-weight:600; display:flex; justify-content:center; gap:8px;" @click="activeTab = 'settings'; showDropdown = false">
          ⚙️ Buka Pengaturan
        </button>
        <button class="btn-logout" style="display:flex; justify-content:center; gap:8px;" @click="handleLogout">🚪 Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
const { userName, userInitials, userEmail, selectedEvent, showDropdown, activeTab, prosesLogout, isOnline, showConfirm } = useAdmin()

const handleLogout = () => {
  showDropdown.value = false
  showConfirm('Konfirmasi Logout', 'Yakin ingin mengakhiri sesi dan keluar dari aplikasi?', 'Ya, Logout', 'danger', prosesLogout)
}
</script>
