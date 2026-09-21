<template>
  <header class="topbar">
    <div class="left">
      <div class="greeting">
        Halo, <span>{{ userName }}</span>
        <small>· {{ selectedEvent ? selectedEvent.nama_event : 'belum pilih event' }}</small>
      </div>
    </div>
    <div class="right">
      <div class="notif" style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#1a6a4a; background:#e4f0e8; padding:6px 12px; border-radius:20px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#1a6a4a;"></span>
        <span>Online</span>
      </div>
      <div class="avatar" @click="showDropdown = !showDropdown">{{ userInitials }}</div>
      <!-- DROPDOWN -->
      <div class="user-dropdown" :class="{ show: showDropdown }">
        <div class="name">{{ userName }}</div>
        <div class="email">{{ userEmail }}</div>
        <hr />
        <button class="btn-outline" style="width:100%; margin-bottom:10px; border-radius:12px; font-weight:600;" @click="activeTab = 'settings'; showDropdown = false">
          ⚙️ Pengaturan
        </button>
        <button class="btn-logout" @click="prosesLogout">🚪 Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
const { userName, userInitials, userEmail, selectedEvent, showDropdown, activeTab, prosesLogout } = useAdmin()
</script>
