<template>
  <div>
    <!-- NuxtPage ini yang akan me-render folder pages/ otomatis -->
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  title: 'tyket.id',
  meta: [
    { name: 'theme-color', content: '#0C387A' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  script: [
    { src: 'https://cdn.jsdelivr.net/npm/sweetalert2@11', defer: true }
  ]
})
</script>

<style>
@import '~/assets/css/main.css';
</style>
