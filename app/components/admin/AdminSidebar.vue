<template>
  <aside class="sidebar">
    <div class="logo"><Icon name="lucide:ticket" style="color:var(--primary); font-size:24px; margin-right:4px;" /> Event<span>Hub</span></div>
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
      
      <div class="menu-label mt-4">Pengaturan</div>
      <NuxtLink to="/admin/settings" exact-active-class="router-link-active">
        <Icon name="lucide:settings" class="icon" /> <span>Settings</span>
      </NuxtLink>
    </nav>
    <div class="bottom">
      <a><Icon name="lucide:message-circle-question" class="icon" /> <span>Bantuan</span></a>
    </div>
  </aside>
</template>

<script setup>
const { selectedEvent } = useAdmin()
</script>
