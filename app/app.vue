<template>
  <div>
    <!-- NuxtPage ini yang akan me-render folder pages/ otomatis -->
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  title: 'EventHub Discover',
  meta: [
    { name: 'theme-color', content: '#0C387A' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap' },
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
  ],
  script: [
    { src: 'https://unpkg.com/lucide@latest', defer: true },
    { src: 'https://cdn.jsdelivr.net/npm/sweetalert2@11', defer: true }
  ]
})
</script>

<style>
/* Global Styling Basic dari index.html */
:root {
  --primary: #0F172A;
  --accent-main: #2563EB;
  --bg-light: #F8FAFC;
  --card-light: #FFFFFF;
  --text-main: #1E293B;
  --text-muted: #64748B;
  --border-soft: #E2E8F0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.025);
  --transition: 0.25s ease-in-out;
}

body { 
  font-family: 'Poppins', sans-serif; 
  background: var(--bg-light); 
  margin: 0; 
  color: var(--text-main); 
  -webkit-tap-highlight-color: transparent;
}
* { box-sizing: border-box; }
</style>