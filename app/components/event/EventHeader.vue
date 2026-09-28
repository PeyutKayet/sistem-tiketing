<template>
  <div class="event-header">
    <!-- Poster & Judul -->
    <div class="header-poster-section">
      <img loading="lazy" :src="fixPosterUrl(eventData?.poster_url) || 'https://placehold.co/900x300/F8FAFC/64748B?text=POSTER+EVENT'" alt="Poster Event" class="poster-image" />
      <p class="organizer-name">
        {{ organizerProfile?.nama_organizer || 'EventHub Organizer' }}
      </p>
      <h1 class="event-title">
        {{ eventData?.nama_event }}
      </h1>
    </div>

    <!-- Info Tanggal & Lokasi -->
    <div class="info-grid">
      <div class="info-card">
        <span class="info-text">{{ formatDate(eventData?.tanggal_mulai) }}</span>
      </div>
      <div class="info-card">
        <span class="info-text">{{ eventData?.lokasi || 'Lokasi Menyusul' }}</span>
      </div>
    </div>

    <!-- Deskripsi & Progress Bar Kuota -->
    <div class="pricing-status-card">
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
  return url.replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
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
  width: 100%;
  aspect-ratio: 3 / 1;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
}
.organizer-name {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--accent-main);
  text-transform: uppercase;
  margin-bottom: 0.1rem;
}
.event-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.5px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
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
}
.info-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-main);
  text-align: center;
}
.pricing-status-card {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: var(--card-light);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  text-align: left;
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
