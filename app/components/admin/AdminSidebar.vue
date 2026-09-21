<template>
  <aside class="sidebar">
    <div class="logo"><Icon name="lucide:ticket" style="color:var(--primary); font-size:24px; margin-right:4px;" /> Event<span>Hub</span></div>
    <nav>
      <div class="menu-label">Menu Utama</div>
      <a :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
        <Icon name="lucide:home" class="icon" /> <span>Home</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'event' }" @click="selectedEvent && (activeTab = 'event')">
        <Icon name="lucide:calendar-days" class="icon" /> <span>Event</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'edit' }" @click="selectedEvent && (activeTab = 'edit')">
        <Icon name="lucide:edit" class="icon" /> <span>Edit</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'tiket' }" @click="selectedEvent && (activeTab = 'tiket')">
        <Icon name="lucide:ticket" class="icon" /> <span>Tiket</span>
      </a>
      <a :class="{ disabled: !selectedEvent, active: activeTab === 'peserta' }" @click="selectedEvent && (activeTab = 'peserta')">
        <Icon name="lucide:users" class="icon" /> <span>Peserta</span>
      </a>
      
      <div class="menu-label mt-4">Pengaturan</div>
      <a :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
        <Icon name="lucide:settings" class="icon" /> <span>Settings</span>
      </a>
    </nav>
    <div class="bottom">
      <a><Icon name="lucide:message-circle-question" class="icon" /> <span>Bantuan</span></a>
    </div>
  </aside>
</template>

<script setup>
const { activeTab, selectedEvent } = useAdmin()
</script>
