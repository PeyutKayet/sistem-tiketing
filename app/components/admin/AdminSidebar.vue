<template>
  <aside class="sidebar">
    <div class="logo"><img src="/logo-tyket.svg" alt="tyket.id Logo" style="height: 38px; width: auto; object-fit: contain;" /></div>
    <nav>
      <div class="menu-label">Menu Utama</div>
      <NuxtLink to="/admin" exact-active-class="router-link-active">
        <Icon name="lucide:home" class="icon" /> <span>Home</span>
      </NuxtLink>
      <NuxtLink :to="selectedEvent ? '/admin/event/' + selectedEvent.slug : ''" :class="{ disabled: !selectedEvent }" exact-active-class="router-link-active">
        <Icon name="lucide:calendar-days" class="icon" /> <span>Event</span>
      </NuxtLink>
      <NuxtLink :to="selectedEvent ? '/admin/event/' + selectedEvent.slug + '/edit' : ''" :class="{ disabled: !selectedEvent }" exact-active-class="router-link-active">
        <Icon name="lucide:edit" class="icon" /> <span>Edit</span>
      </NuxtLink>
      <NuxtLink :to="selectedEvent ? '/admin/event/' + selectedEvent.slug + '/tiket' : ''" :class="{ disabled: !selectedEvent }" exact-active-class="router-link-active">
        <Icon name="lucide:ticket" class="icon" /> <span>Tiket</span>
      </NuxtLink>
      <NuxtLink :to="selectedEvent ? '/admin/event/' + selectedEvent.slug + '/peserta' : ''" :class="{ disabled: !selectedEvent }" exact-active-class="router-link-active">
        <Icon name="lucide:users" class="icon" /> <span>Peserta</span>
      </NuxtLink>
      
      <div class="menu-label mt-4">Keuangan & Profil</div>
      <NuxtLink to="/admin/dompet" exact-active-class="router-link-active">
        <Icon name="lucide:wallet" class="icon" /> <span>Dompet</span>
      </NuxtLink>
      <NuxtLink to="/admin/settings" exact-active-class="router-link-active">
        <Icon name="lucide:settings" class="icon" /> <span>Settings</span>
      </NuxtLink>
    </nav>
    <div class="bottom">
      <a><Icon name="lucide:message-circle-question" class="icon" /> <span>Bantuan</span></a>
      <div style="margin-top: 10px; font-size: 9px; color: #94a3b8; display: flex; justify-content: center; gap: 5px; align-items: center; white-space: nowrap;">
        <NuxtLink to="/terms" target="_blank" style="color: #94a3b8; text-decoration: none;">Syarat & Ketentuan</NuxtLink> <span>•</span>
        <NuxtLink to="/privacy" target="_blank" style="color: #94a3b8; text-decoration: none;">Privasi</NuxtLink>
      </div>
    </div>
  
  </aside>
</template>

<script setup>
const { selectedEvent } = useAdmin()
</script>
