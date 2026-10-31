<template>
  <div class="event-header">
    <div class="header-poster-section">
      <img loading="lazy" :src="fixPosterUrl(eventData?.poster_url) || 'https://placehold.co/900x900/F8FAFC/64748B?text=POSTER+EVENT'" alt="Poster Event" class="poster-image" />
      <h1 class="event-title">
        {{ eventData?.nama_event }}
      </h1>
    </div>

    <!-- Info Tanggal & Lokasi -->
    <div class="info-grid">
      <div class="info-card">
        <ClientOnly>
          <span class="info-text">{{ formatDate(eventData?.tanggal_mulai) }}</span>
          <template #fallback>
            <span class="info-text">Memuat...</span>
          </template>
        </ClientOnly>
      </div>
      <div class="info-card">
        <span class="info-text">{{ eventData?.lokasi || 'Lokasi Menyusul' }}</span>
      </div>
    </div>

    <!-- Deskripsi & Progress Bar Kuota -->
    <div class="pricing-status-card">
      <div v-if="organizerProfile?.nama_organizer" class="organizer-mini-card">
        <img :src="organizerProfile?.logo_url ? fixPosterUrl(organizerProfile.logo_url) : `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerProfile.nama_organizer)}&background=0F172A&color=fff&rounded=true&size=40`" alt="Logo" class="eo-logo-mini" />
        <div class="organizer-mini-info">
          <span class="mini-label">Penyelenggara</span>
          <span class="mini-name">{{ organizerProfile.nama_organizer }}</span>
        </div>
      </div>
      
      <div v-if="organizerProfile?.nama_organizer" class="divider"></div>

      <span class="section-label">DESKRIPSI EVENT</span>
      <p class="description-text">
        {{ eventData?.deskripsi || 'Deskripsi tidak tersedia.' }}
      </p>
      
      <div v-if="totalMaksimalKuota > 0">
        <div class="divider"></div>
        
        <div class="quota-info">
          <span class="quota-label">SISA KUOTA</span>
          <span class="quota-count"><b>{{ totalSisaKuota }}</b> / {{ totalMaksimalKuota }}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: persentaseTerisi + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  eventData: { type: Object, default: () => ({}) },
  organizerProfile: { type: Object, default: () => ({}) },
  totalMaksimalKuota: { type: Number, default: 0 },
  totalSisaKuota: { type: Number, default: 0 },
  persentaseTerisi: { type: Number, default: 0 }
})

const fixPosterUrl = (url) => {
  if (!url) return ''
  return url
    .replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
    .replace('http://localhost:8000', 'https://supabase.e-tiket.web.id')
}

const formatDate = (dateString) => {
  if (!dateString) return 'TBA'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.header-poster-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.75rem;
}
.poster-image {
  width: 90%;
  max-width: 320px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  background-color: #f8fafc;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
}
.event-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.5px;
}
.organizer-mini-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.eo-logo-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-soft);
}
.organizer-mini-info {
  display: flex;
  flex-direction: column;
}
.mini-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}
.mini-name {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-main);
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  width: 100%;
}
.info-card {
  background: var(--bg-light);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  border: 1px solid var(--border-soft);
  min-width: 0;
  overflow: hidden;
}
.info-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-main);
  text-align: center;
  word-break: break-word;
}
.pricing-status-card {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: var(--card-light);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  text-align: left;
  overflow: hidden;
}
.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
}
.description-text {
  font-size: 0.7rem;
  color: var(--text-main);
  line-height: 1.3;
  margin-top: 2px;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.divider {
  margin: 8px 0;
  height: 1px;
  background: var(--border-soft);
}
.quota-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.quota-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-main);
}
.quota-count {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
}
.quota-count b {
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 800;
}
.progress-bar-container {
  width: 100%;
  height: 5px;
  background: var(--border-soft);
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--accent-main);
  transition: width 1.5s ease-in-out;
}
</style>
