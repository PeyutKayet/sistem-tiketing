<template>
  <aside class="sidebar">
    <div class="logo">🎟️ Event<span>Hub</span></div>
    <nav>
      <div class="menu-label">Menu</div>
      <a :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
        <span class="icon">🏠</span> <span>Home</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'event' }" @click="selectedEvent && (activeTab = 'event')">
        <span class="icon">📋</span> <span>Event</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'edit' }" @click="selectedEvent && (activeTab = 'edit')">
        <span class="icon">✏️</span> <span>Edit</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'tiket' }" @click="selectedEvent && (activeTab = 'tiket')">
        <span class="icon">🎟️</span> <span>Tiket</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'peserta' }" @click="selectedEvent && (activeTab = 'peserta')">
        <span class="icon">👥</span> <span>Peserta</span>
      </a>
      <a :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
        <span class="icon">⚙️</span> <span>Settings</span>
      </a>
    </nav>
    <div class="bottom">
      <a><span class="icon">💬</span> <span>Bantuan</span></a>
    </div>
  </aside>
</template>

<script setup>
const { activeTab, selectedEvent } = useAdmin()
</script>
