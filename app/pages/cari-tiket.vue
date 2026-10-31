<template>
  <div class="cari-wrapper">
    <div class="cari-container">
      
      <!-- Top Header -->
      <div class="top-nav">
        <NuxtLink to="/" class="btn-back">
          <Icon name="lucide:arrow-left" style="font-size: 18px;" />
          <span>Kembali</span>
        </NuxtLink>
        <img src="/logo-tyket.svg" alt="tyket.id" class="logo-img" />
      </div>

      <!-- Hero Section -->
      <div class="hero-card">
        <div class="hero-icon-box">
          <Icon name="lucide:search" style="font-size: 28px; color: var(--primary);" />
        </div>
        <h1 class="hero-title">Cari E-Ticket Saya</h1>
        <p class="hero-subtitle">
          Masukkan Nomor WhatsApp dan Email yang Anda gunakan saat mendaftar untuk mengakses e-tiket resmi Anda.
        </p>

        <!-- Search Form -->
        <form @submit.prevent="handleSearch" class="search-form">
          <div class="input-group">
            <label class="input-label">Nomor WhatsApp</label>
            <div class="input-wrapper">
              <Icon name="lucide:phone" class="input-icon" />
              <input 
                type="tel" 
                v-model="noWa" 
                placeholder="Contoh: 08123456789" 
                required 
                class="form-input"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Alamat Email</label>
            <div class="input-wrapper">
              <Icon name="lucide:mail" class="input-icon" />
              <input 
                type="email" 
                v-model="email" 
                placeholder="Contoh: nama@gmail.com" 
                required 
                class="form-input"
                :disabled="isLoading"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="isLoading" class="btn-loading">
              <Icon name="lucide:loader-2" class="spin" /> Mencari E-Ticket...
            </span>
            <span v-else class="btn-text">
              <Icon name="lucide:ticket" style="font-size: 18px;" /> Temukan Tiket Saya
            </span>
          </button>
        </form>
      </div>

      <!-- State: Error / Not Found -->
      <div v-if="hasSearched && !isLoading && (!orders || orders.length === 0)" class="empty-card">
        <div class="empty-icon-box">
          <Icon name="lucide:ticket-x" style="font-size: 40px; color: #ef4444;" />
        </div>
        <h3 class="empty-title">E-Ticket Tidak Ditemukan</h3>
        <p class="empty-desc">
          Tidak ada tiket yang cocok dengan kombinasi Nomor WhatsApp dan Email tersebut. Pastikan nomor dan email sama persis seperti saat mengisi formulir pendaftaran.
        </p>
        <div class="empty-tips">
          <strong>💡 Tips Bantuan:</strong>
          <ul>
            <li>Periksa apakah nomor HP diawali 08... atau 628...</li>
            <li>Cek typo pada alamat email Anda</li>
            <li>Jika baru selesai transfer manual, tunggu beberapa saat hingga Admin memverifikasi</li>
          </ul>
        </div>
      </div>

      <!-- State: Hasil Ditemukan -->
      <div v-if="orders && orders.length > 0" class="results-wrapper">
        <div class="results-header">
          <h2 class="results-title">
            <Icon name="lucide:check-circle-2" style="color: #16a34a;" />
            Ditemukan {{ totalTicketsCount }} Tiket
          </h2>
          <span class="results-subtitle">{{ orders.length }} Transaksi Terdaftar</span>
        </div>

        <!-- Loop Order -->
        <div v-for="(order, oIdx) in orders" :key="order.order_id" class="order-card">
          <!-- Event Header Bar -->
          <div class="order-event-header">
            <img 
              v-if="order.event?.poster_url" 
              :src="fixPosterUrl(order.event.poster_url)" 
              class="event-mini-poster" 
              alt="Poster" 
            />
            <div class="event-header-info">
              <h3 class="event-name">{{ order.event?.nama_event || 'Event' }}</h3>
              <div class="event-meta">
                <span v-if="order.event?.tanggal_mulai">
                  <Icon name="lucide:calendar" /> {{ formatDate(order.event.tanggal_mulai) }}
                </span>
                <span v-if="order.event?.lokasi">
                  <Icon name="lucide:map-pin" /> {{ order.event.lokasi }}
                </span>
              </div>
            </div>
            <div class="order-badge-pill" :class="order.status_bayar === 'paid' ? 'pill-paid' : 'pill-pending'">
              {{ order.status_bayar === 'paid' ? 'LUNAS' : 'MENUNGGU' }}
            </div>
          </div>

          <!-- List Tiket dalam Order Ini -->
          <div class="ticket-cards-list">
            <div 
              v-for="(t, tIdx) in order.tickets" 
              :key="t.id" 
              :id="'ticketView-' + oIdx + '-' + tIdx"
              class="single-ticket-item"
            >
              <div class="ticket-item-top">
                <div class="ticket-cat-name">{{ t.nama_tiket }}</div>
                <div class="ticket-status-label" :class="order.status_bayar === 'paid' ? 'label-paid' : 'label-pending'">
                  <Icon :name="order.status_bayar === 'paid' ? 'lucide:check-circle' : 'lucide:clock'" />
                  {{ order.status_bayar === 'paid' ? 'E-TICKET RESMI' : 'BELUM LUNAS' }}
                </div>
              </div>

              <div class="ticket-body-content">
                <div class="participant-info">
                  <span class="info-label">NAMA PESERTA</span>
                  <span class="info-value">{{ t.nama_lengkap }}</span>
                </div>

                <!-- QR Barcode Area -->
                <div class="qr-container">
                  <div class="qr-image-box">
                    <img 
                      v-if="qrMap[t.ticket_id]" 
                      :src="qrMap[t.ticket_id]" 
                      alt="QR Code" 
                      class="qr-img" 
                    />
                    <div v-else class="qr-loading">Membuat Barcode...</div>
                  </div>
                  <div class="ticket-code-str">{{ t.ticket_id }}</div>
                  <div v-if="t.is_scanned" class="scanned-badge">
                    <Icon name="lucide:check" /> SUDAH CHECK-IN
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Hubungi Admin & Masuk Grup (Jika Lunas) -->
          <div v-if="order.status_bayar === 'paid'" class="order-cta-box">
            <button 
              v-if="order.event?.organizer_profile?.no_wa" 
              @click="hubungiAdminWa(order)" 
              class="btn-order-wa"
            >
              <div class="cta-left-row">
                <Icon name="lucide:message-circle" class="cta-icon-lg" />
                <div class="cta-text-wrap">
                  <span class="cta-title">{{ order.event?.settings?.link_grup_wa ? 'KABARI ADMIN & MASUK GRUP' : 'KABARI ADMIN PANITIA VIA WA' }}</span>
                  <span class="cta-subtitle">1x Klik Selesai Langsung ke WhatsApp</span>
                </div>
              </div>
              <Icon name="lucide:arrow-right" class="cta-arrow-sm" />
            </button>
          </div>

          <!-- Notice Pending (Menunggu Verifikasi) -->
          <div v-else class="order-pending-box">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <Icon name="lucide:clock" style="color: #d97706; font-size: 18px;" />
              <strong style="font-size: 0.85rem; color: #92400e;">Menunggu Verifikasi Pembayaran</strong>
            </div>
            <p style="font-size: 0.78rem; color: #78350f; margin: 0 0 10px 0; line-height: 1.4;">
              Pembayaran sedang diverifikasi Admin. Kirimkan bukti transfer untuk mempercepat aktivasi:
            </p>
            <button 
              v-if="order.event?.organizer_profile?.no_wa" 
              @click="hubungiAdminWa(order)" 
              class="btn-order-pending-wa"
            >
              <Icon name="lucide:send" />
              <span>Kirim Bukti Pembayaran via WhatsApp</span>
            </button>
          </div>

          <!-- Secondary Action Tools: Buka Halaman Penuh & Unduh Gambar -->
          <div class="order-action-bar">
            <!-- Buka Halaman Tiket Asli -->
            <NuxtLink :to="`/tiket/${order.order_id}`" class="btn-action btn-full-ticket">
              <Icon name="lucide:external-link" />
              <span>Buka Halaman Tiket Penuh</span>
            </NuxtLink>

            <!-- Unduh Semua Gambar Tiket -->
            <button 
              v-if="order.status_bayar === 'paid'" 
              @click="unduhSemuaTiket(oIdx)" 
              class="btn-action btn-download"
              :disabled="isDownloading"
            >
              <Icon name="lucide:download" />
              <span>{{ isDownloading ? 'Memproses Unduhan...' : 'Unduh Gambar Tiket (PNG)' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <footer class="cari-footer">
        <p>&copy; 2026 tyket.id • Sistem Tiketing Aman & Transparan</p>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '#imports'
import QRCode from 'qrcode'

useHead({
  title: 'Cari E-Ticket Saya | tyket.id',
  meta: [
    { name: 'description', content: 'Temukan dan unduh e-ticket resmi tyket.id Anda dengan memasukkan nomor WhatsApp dan email pendaftaran.' }
  ],
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      defer: true
    }
  ]
})

const noWa = ref('')
const email = ref('')
const isLoading = ref(false)
const hasSearched = ref(false)
const orders = ref([])
const qrMap = ref({})
const isDownloading = ref(false)

const totalTicketsCount = computed(() => {
  if (!orders.value) return 0
  return orders.value.reduce((acc, o) => acc + (o.tickets?.length || 0), 0)
})

const fixPosterUrl = (url) => {
  if (!url) return 'https://placehold.co/400x200/F8FAFC/64748B?text=POSTER+EVENT'
  return url.replace('http://192.168.1.7:8000', 'https://supabase.tyket.id').replace('http://localhost:8000', 'https://supabase.tyket.id')
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const generateQRCodesForOrders = async () => {
  for (const order of orders.value) {
    for (const t of order.tickets) {
      const code = t.ticket_id
      if (code && !qrMap.value[code]) {
        try {
          const url = await QRCode.toDataURL(code, {
            width: 240,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' }
          })
          qrMap.value[code] = url
        } catch (e) {
          console.error('QR code generation error:', e)
        }
      }
    }
  }
}

const handleSearch = async () => {
  if (!noWa.value || !email.value) return
  isLoading.value = true
  hasSearched.value = true

  try {
    const res = await $fetch('/api/search-tickets', {
      method: 'POST',
      body: {
        no_wa: noWa.value.trim(),
        email: email.value.trim()
      }
    })

    if (res && res.success) {
      orders.value = res.orders || []
      await generateQRCodesForOrders()
    } else {
      orders.value = []
    }
  } catch (err) {
    orders.value = []
    const msg = err.data?.statusMessage || err.message || 'Gagal mencari tiket.'
    if (window.Swal) {
      window.Swal.fire({ icon: 'error', title: 'Pencarian Gagal', text: msg, confirmButtonColor: '#EF4444' })
    }
  } finally {
    isLoading.value = false
  }
}

const unduhSemuaTiket = async (orderIndex) => {
  isDownloading.value = true
  try {
    if (!window.html2canvas) {
      if (window.Swal) window.Swal.fire('Mohon Tunggu', 'Komponen pembuat gambar sedang dimuat, coba sesaat lagi.', 'info')
      isDownloading.value = false
      return
    }

    const order = orders.value[orderIndex]
    if (!order) return

    for (let i = 0; i < order.tickets.length; i++) {
      const el = document.getElementById(`ticketView-${orderIndex}-${i}`)
      if (!el) continue

      const canvas = await window.html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFFFF'
      })

      const link = document.createElement('a')
      link.download = `Tiket-${order.tickets[i].nama_lengkap}-${order.tickets[i].ticket_id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      await new Promise(r => setTimeout(r, 400))
    }
  } catch (err) {
    console.error('Gagal unduh gambar tiket:', err)
    if (window.Swal) window.Swal.fire('Gagal', 'Gagal memproses gambar tiket.', 'error')
  } finally {
    isDownloading.value = false
  }
}

const hubungiAdminWa = (order) => {
  let noAdmin = order.event?.organizer_profile?.no_wa
  if (!noAdmin) return
  noAdmin = noAdmin.replace(/\D/g, '')
  if (noAdmin.startsWith('0')) noAdmin = '62' + noAdmin.substring(1)

  const domain = window.location.origin
  const namaEvent = order.event?.nama_event || 'Event'
  const orderId = order.order_id
  const namaPeserta = order.tickets?.[0]?.nama_lengkap || ''
  const groupUrl = order.event?.settings?.link_grup_wa || ''

  let rawText = ''
  if (order.status_bayar === 'paid') {
    rawText = `Halo Admin Panitia,\nSaya sudah menyelesaikan pendaftaran acara *${namaEvent}*:\n` +
      (namaPeserta ? `• Nama: *${namaPeserta}*\n` : '') +
      `• Order ID: *${orderId}*\n` +
      `• Link E-Ticket: ${domain}/tiket/${orderId}\n\n`
      
    if (groupUrl) {
      rawText += `👉 Tautan Masuk Grup WhatsApp Peserta:\n${groupUrl}\n\n` +
        `Mohon dicatat dan di-approve di grup ya min. Terima kasih! 🙏`
    } else {
      rawText += `Mohon dicatat dan dikonfirmasi kehadiran saya. Terima kasih! 🙏`
    }
  } else {
    rawText = `Halo Admin Panitia,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${namaEvent}*.\n\n` +
      (namaPeserta ? `• Nama: *${namaPeserta}*\n` : '') +
      `• Order ID: *${orderId}*\n` +
      `• Link Tiket: ${domain}/tiket/${orderId}\n\n` +
      `Berikut saya lampirkan bukti transfer pembayaran saya. Mohon bantuannya untuk diverifikasi. Terima kasih! 🙏`
  }

  window.open(`https://api.whatsapp.com/send?phone=${noAdmin}&text=${encodeURIComponent(rawText)}`, '_blank')
}
</script>

<style scoped>
.cari-wrapper {
  min-height: 100vh;
  background: var(--bg-main, #f8fafc);
  padding: 16px 14px 40px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.cari-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

/* Top Nav */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary, #0f172a);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 12px;
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.logo-img {
  height: 32px;
  width: auto;
}

/* Hero Form Card */
.hero-card {
  background: white;
  border-radius: 20px;
  padding: 24px 20px;
  border: 1px solid var(--border-soft, #e2e8f0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  text-align: center;
  margin-bottom: 24px;
}

.hero-icon-box {
  width: 56px;
  height: 56px;
  background: rgba(252, 235, 156, 0.5);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.hero-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
  line-height: 1.45;
  margin: 0 0 20px;
}

/* Form */
.search-form {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 18px;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 38px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 0.9rem;
  outline: none;
  background: #f8fafc;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary, #0f172a);
  background: white;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: var(--primary, #0f172a);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  transition: transform 0.15s ease;
}

.btn-submit:active {
  transform: scale(0.98);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-card {
  background: white;
  border-radius: 18px;
  padding: 24px 20px;
  border: 1px dashed #f87171;
  background: #fef2f2;
  text-align: center;
  margin-bottom: 24px;
}

.empty-icon-box {
  margin-bottom: 10px;
}

.empty-title {
  color: #b91c1c;
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0 0 6px;
}

.empty-desc {
  font-size: 0.8rem;
  color: #991b1b;
  margin: 0 0 16px;
  line-height: 1.45;
}

.empty-tips {
  background: white;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #475569;
  text-align: left;
  border: 1px solid #fee2e2;
}

.empty-tips ul {
  margin: 6px 0 0 18px;
  padding: 0;
  line-height: 1.5;
}

/* Results */
.results-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.results-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.results-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  font-weight: 600;
}

/* Order Card */
.order-card {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-soft, #e2e8f0);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.order-event-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.event-mini-poster {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.event-header-info {
  flex: 1;
  min-width: 0;
}

.event-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.7rem;
  color: var(--text-muted, #64748b);
  font-weight: 600;
}

.event-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.order-badge-pill {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.pill-paid {
  background: #dcfce7;
  color: #16a34a;
}

.pill-pending {
  background: #fef9c3;
  color: #ca8a04;
}

/* Ticket List */
.ticket-cards-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.single-ticket-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.ticket-item-top {
  background: var(--primary, #0f172a);
  color: white;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ticket-cat-name {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.ticket-status-label {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-paid {
  background: rgba(34, 197, 94, 0.25);
  color: #4ade80;
}

.label-pending {
  background: rgba(234, 179, 8, 0.25);
  color: #fde047;
}

.ticket-body-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.participant-info {
  text-align: center;
}

.info-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 2px;
}

.info-value {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-main, #0f172a);
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.qr-image-box {
  width: 140px;
  height: 140px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-loading {
  font-size: 0.75rem;
  color: #94a3b8;
}

.ticket-code-str {
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1px;
}

.scanned-badge {
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Action Bar & CTA */
.order-cta-box {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid var(--border-soft, #e2e8f0);
}

.btn-order-wa {
  width: 100%;
  background: #25D366;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 11px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.28);
  transition: all 0.2s ease;
  font-family: inherit;
  text-align: left;
}

.btn-order-wa:hover {
  background: #20BA56;
  transform: translateY(-1px);
}

.btn-order-wa:active {
  transform: scale(0.98);
}

.cta-left-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.cta-icon-lg {
  font-size: 1.35rem;
  flex-shrink: 0;
}

.cta-text-wrap {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
}

.cta-title {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cta-subtitle {
  font-size: 0.7rem;
  opacity: 0.92;
  font-weight: 600;
}

.cta-arrow-sm {
  font-size: 1.1rem;
  flex-shrink: 0;
  opacity: 0.85;
}

/* Pending Box */
.order-pending-box {
  background: #fffbeb;
  border-top: 1.5px solid #fcd34d;
  padding: 14px 16px;
  text-align: left;
}

.btn-order-pending-wa {
  width: 100%;
  background: #D97706;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.82rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(217, 119, 6, 0.25);
  transition: all 0.2s ease;
}

.btn-order-pending-wa:hover {
  background: #B45309;
}

/* Secondary Action Bar */
.order-action-bar {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid var(--border-soft, #e2e8f0);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-action {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: transform 0.1s ease;
  box-sizing: border-box;
}

.btn-action:active {
  transform: scale(0.98);
}

.btn-download {
  background: var(--accent-yellow, #FCEB9C);
  color: var(--primary, #0f172a);
  border: 1px solid rgba(252, 235, 156, 0.8);
}

.btn-full-ticket {
  background: white;
  color: var(--primary, #0f172a);
  border: 1px solid #cbd5e1;
}

/* Footer */
.cari-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>
