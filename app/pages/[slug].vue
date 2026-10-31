<template>
  <div class="container">
    <!-- PUBLIC TOAST -->
    <div v-if="toastMessage" class="toast-message" :class="toastType === 'success' ? 'toast-success' : 'toast-error'">
      {{ toastMessage }}
    </div>

    <!-- State Loading: Skeleton Event Detail Mewah & Modern -->
    <div v-if="isEventLoading" class="step-content active step-home">
      <div class="glass glass-home">
        <!-- Brand Loading Badge -->
        <div class="skeleton-badge-wrap">
          <div class="skeleton-brand-badge">
            <span class="skeleton-dot-pulse"></span>
            <span class="skeleton-badge-text">Memuat detail event...</span>
          </div>
        </div>

        <!-- Poster Box -->
        <div class="skeleton-item skeleton-poster-box"></div>

        <!-- Title Bars -->
        <div class="skeleton-item skeleton-title-line"></div>
        <div class="skeleton-item skeleton-title-line-short"></div>

        <!-- Meta Grid (Date & Location) -->
        <div class="skeleton-meta-grid">
          <div class="skeleton-item skeleton-meta-pill"></div>
          <div class="skeleton-item skeleton-meta-pill"></div>
        </div>

        <!-- Card EO & Description -->
        <div class="skeleton-card-block">
          <div class="skeleton-eo-row">
            <div class="skeleton-item skeleton-avatar-circle"></div>
            <div class="skeleton-eo-text">
              <div class="skeleton-item skeleton-eo-sub"></div>
              <div class="skeleton-item skeleton-eo-main"></div>
            </div>
          </div>
          <div class="skeleton-item skeleton-divider"></div>
          <div class="skeleton-item skeleton-desc-heading"></div>
          <div class="skeleton-item skeleton-desc-line"></div>
          <div class="skeleton-item skeleton-desc-line"></div>
          <div class="skeleton-item skeleton-desc-line-short"></div>
        </div>

        <!-- Tickets Shimmer -->
        <div class="skeleton-tickets-container">
          <div v-for="n in 2" :key="'skel-tkt-' + n" class="skeleton-ticket-item">
            <div class="skeleton-tkt-left">
              <div class="skeleton-item skeleton-tkt-title"></div>
              <div class="skeleton-item skeleton-tkt-price"></div>
            </div>
            <div class="skeleton-item skeleton-tkt-action"></div>
          </div>
        </div>

        <!-- Button Shimmer -->
        <div class="skeleton-item skeleton-btn-main"></div>
      </div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="state-message error-text">
      {{ error }}
    </div>

    <!-- Tampilan Landing Page Event (HOME) -->
    <div v-else-if="currentStep === 'home'" class="step-content active step-home">
      <div class="glass glass-home">
        
        <EventHeader 
          :eventData="eventData"
          :organizerProfile="organizerProfile"
          :totalMaksimalKuota="totalMaksimalKuota"
          :totalSisaKuota="totalSisaKuota"
          :persentaseTerisi="persentaseTerisi"
        />

        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          :isLoading="isTicketsLoading"
          @update-keranjang="updateKeranjang"
        />

        <!-- Tombol Daftar -->
        <button 
          @click="lanjutDaftar" 
          class="btn-register" 
          :disabled="isTicketsLoading || tickets.length === 0"
        >
          <div class="btn-register-text">
            <template v-if="isTicketsLoading">MEMUAT TIKET...</template>
            <template v-else-if="tickets.length === 0">TIKET BELUM TERSEDIA</template>
            <template v-else>DAFTAR SEKARANG &rarr;</template>
          </div>
          <ClientOnly>
            <small v-if="totalQty > 0 && !isTicketsLoading && tickets.length > 0" class="btn-register-sub">
              {{ totalQty }} Tiket • {{ totalPrice === 0 ? 'GRATIS' : formatPrice(totalPrice) }}
            </small>
          </ClientOnly>
        </button>

        <!-- Tombol Sosial Media (Hanya tampil jika EO mengisi linknya) -->
        <div v-if="organizerProfile.link_ig || organizerProfile.no_wa || organizerProfile.link_web" class="social-grid">
          <a v-if="organizerProfile.link_ig" :href="organizerProfile.link_ig" target="_blank" rel="noopener noreferrer" class="social-btn">
            <Icon name="mdi:instagram" size="1.2rem" style="color: #64748b;" />
            <span class="social-text">Instagram</span>
          </a>
          <a v-if="organizerProfile.no_wa" :href="formatWaLink(organizerProfile.no_wa)" target="_blank" rel="noopener noreferrer" class="social-btn">
            <Icon name="mdi:whatsapp" size="1.2rem" style="color: #64748b;" />
            <span class="social-text">WhatsApp</span>
          </a>
          <a v-if="organizerProfile.link_web" :href="organizerProfile.link_web" target="_blank" rel="noopener noreferrer" class="social-btn">
            <Icon name="lucide:globe" size="1.2rem" style="color: #64748b;" />
            <span class="social-text">Website</span>
          </a>
        </div>

        <!-- Tautan Cek Tiket Bagi Yang Sudah Mendaftar (Discreet & Minimal) -->
        <div class="footer-check-ticket">
          <NuxtLink to="/cari-tiket" class="link-check-ticket">
            Sudah mendaftar? Cek tiket di sini
          </NuxtLink>
        </div>

        <!-- Watermark Platform Branding (Sleek & Professional) -->
        <div class="platform-watermark">
          <NuxtLink to="/" class="watermark-link" title="Buat sistem tiket event Anda di tyket.id">
            <span>Ditenagai oleh</span>
            <img src="/logo-tyket.svg" alt="tyket.id" class="watermark-logo" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Tampilan Syarat & Ketentuan (S&K) -->
    <div v-else-if="currentStep === 'snk'" class="step-content active step-padded">
      <CheckoutStepper :currentStep="currentStep" :hasSurvey="hasB2BSurvey" />
      <h3 class="step-title">Syarat & Ketentuan</h3>
      <p class="step-subtitle">Mohon baca dan setujui sebelum melanjutkan</p>
      
      <div class="snk-box">
        {{ eventData.settings?.snk_text || 'Syarat dan ketentuan berlaku mengikuti kebijakan panitia dan tyket.id.' }}
      </div>
      
      <label class="snk-label">
        <input type="checkbox" v-model="isSetujuSnk" class="snk-checkbox">
        Saya menyetujui persyaratan di atas
      </label>

      <div class="action-row">
        <button @click="currentStep = 'home'" class="btn-action btn-secondary">KEMBALI</button>
        <button @click="setujuDanLanjut" class="btn-action btn-primary">LANJUTKAN &rarr;</button>
      </div>
    </div>

    <!-- Tampilan Form Data Diri (FORM) -->
    <div v-else-if="currentStep === 'form'" class="step-content active step-padded">
      <CheckoutStepper :currentStep="currentStep" :hasSurvey="hasB2BSurvey" />
      <h3 class="step-title-left">Data Diri Peserta</h3>
      
      <ParticipantForm 
        :daftarPeserta="daftarPeserta" 
        :customFields="customFields" 
        @toast="showToastMsg"
      />

      <!-- Bagian Donasi Standar (Hanya jika bukan event survey B2B, karena di B2B ditaruh di akhir survey) -->
      <DonationForm 
        v-if="!hasB2BSurvey"
        :eventData="eventData" 
        v-model:isInfaqOn="isInfaqOn" 
        :donasiAmount="donasiAmount" @update:donasiAmount="setDonasiAmount" 
      />

      <div class="legal-disclaimer">
        Dengan menekan tombol di bawah, Anda menyetujui <a href="/terms" target="_blank">Syarat & Ketentuan</a> serta <a href="/privacy" target="_blank">Kebijakan Privasi</a> tyket.id.
      </div>

      <div class="action-row">
        <button @click="kembaliKeSnkAtauHome" class="btn-action btn-secondary">KEMBALI</button>
        <button @click="lanjutBayar" class="btn-action btn-primary">
          {{ hasB2BSurvey ? 'LANJUT KE KUESIONER &rarr;' : (isTrulyFree ? 'SELESAIKAN DAFTAR &rarr;' : 'LANJUT BAYAR &rarr;') }}
        </button>
      </div>
    </div>

    <!-- Tampilan Kuesioner Khusus B2B (SURVEI) -->
    <div v-else-if="currentStep === 'survei'" class="step-content active step-padded">
      <CheckoutStepper :currentStep="currentStep" :hasSurvey="hasB2BSurvey" />

      <B2BSurveyStep 
        :eventData="eventData" 
        :primaryParticipant="primaryParticipant" 
        :isTrulyFree="isTrulyFree" 
        :isSubmitting="isSubmitting"
        @back="currentStep = 'form'"
        @complete="handleSurveyComplete"
        @toast="showToastMsg"
      >
        <template #donation>
          <DonationForm 
            :eventData="eventData" 
            v-model:isInfaqOn="isInfaqOn" 
            :donasiAmount="donasiAmount" 
            @update:donasiAmount="setDonasiAmount" 
          />
        </template>
      </B2BSurveyStep>
    </div>

    <!-- Tampilan Pembayaran (BAYAR) -->
    <div v-else-if="currentStep === 'bayar'" class="step-content active step-padded">
      <CheckoutStepper v-if="!activePaymentResult" :currentStep="currentStep" :hasSurvey="hasB2BSurvey" />
      <CheckoutPayment 
        :grandTotal="grandTotal"
        :totalQty="totalQty"
        :totalPrice="totalPrice"
        :adminFee="adminFee"
        :kodeUnik="kodeUnik"
        :donasiAmount="donasiAmount"
        :buktiBayarPreview="buktiBayarPreview"
        :uploadError="uploadError"
        :isSubmitting="isSubmitting"
        :daftarPeserta="daftarPeserta"
        :isEspayActive="isEspayActiveCalculated"
        :isEmergencyBackup="isEmergencyBackup"
        :emergencyMessage="emergencyMessage"
        :espayMethods="eventData?.settings?.espay_methods"
        :eventData="eventData"
        :initialPaymentResult="activePaymentResult"
        @file-upload="handleFileUpload"
        @back="currentStep = hasB2BSurvey ? 'survei' : 'form'"
        @submit="submitData"
        @toast="showToastMsg"
        @request-espay="handleEspayPayment"
        @payment-success="handlePaymentSuccess"
        @reset-payment="handleResetPayment"
        @cancel-order="handleCancelOrder"
      />
    </div>

    <!-- Tampilan Sukses (SUKSES) -->
    <div v-else-if="currentStep === 'sukses'" class="step-content active">
      <SuccessStep 
        :eventData="eventData"
        :isFree="isTrulyFree"
        :isPaid="isPaymentGatewayPaid"
        @kirim-wa="kirimWA"
        @buka-grup="bukaGrupWa"
        @lihat-tiket="goToTicket"
      />
    </div>
  </div>


  <!-- OVERLAYS -->
  <TicketPrinterOverlay 
    :isSubmitting="isSubmitting" 
    :isPrinting="isPrinting" 
    :eventData="eventData" 
    :daftarPeserta="daftarPeserta" 
    :transactionId="transactionIdGlobal" 
  />
</template>


<script setup>

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { useImageCompress } from '~/composables/useImageCompress'
import { formatPrice } from '~/utils/format'
import EventHeader from '~/components/event/EventHeader.vue'
import TicketList from '~/components/event/TicketList.vue'
import ParticipantForm from '~/components/event/ParticipantForm.vue'
import CheckoutPayment from '~/components/event/CheckoutPayment.vue'
import CheckoutStepper from '~/components/event/CheckoutStepper.vue'
import SuccessStep from '~/components/event/SuccessStep.vue'
import DonationForm from '~/components/event/DonationForm.vue'
import TicketPrinterOverlay from '~/components/event/TicketPrinterOverlay.vue'
import { useEventCheckout } from '~/composables/useEventCheckout'
import { useRoute } from 'vue-router'

const toastMessage = ref('')
const toastType = ref('')
const showToastMsg = (msg, type = 'error') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

const route = useRoute()
const printAudio = ref(null)

onMounted(() => {
  if (typeof window !== 'undefined') {
    printAudio.value = new Audio('/printer.mp3')
    printAudio.value.preload = 'auto'
    printAudio.value.load()
  }
})
const slug = route.params.slug

const supabase = useSupabaseClient()

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return ''
  let fixed = url.replace('http://192.168.1.7:8000', 'https://supabase.tyket.id').replace('http://localhost:8000', 'https://supabase.tyket.id')
  
  // WA Crawler seringkali menolak gambar jika URL-nya tidak diakhiri dengan ekstensi gambar yang jelas.
  // Supabase Storage sering tidak pakai ekstensi, jadi kita akali dengan menambah parameter dummy.
  if (!fixed.match(/\.(jpg|jpeg|png|webp)($|\?)/i)) {
    fixed += (fixed.includes('?') ? '&' : '?') + 'wa_trick=.jpg'
  }
  
  return fixed
}

// === SEO & OPEN GRAPH (Berjalan di Server-Side) ===
const { data: seoData } = await useAsyncData(`seo-${slug}`, async () => {
  try {
    return await $fetch(`/api/seo/${slug}`)
  } catch (e) {
    return null
  }
}, {
  lazy: true
})

if (seoData.value) {
  // Potong deskripsi jika terlalu panjang untuk SEO
  const plainDesc = seoData.value.deskripsi ? seoData.value.deskripsi.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : `Daftar sekarang untuk acara ${seoData.value.nama_event}!`
  const organizerName = seoData.value.organizer_profile?.nama_organizer || 'tyket.id'
  const finalDesc = `Penyelenggara: ${organizerName} | ${plainDesc}`
  const currentUrl = `https://tyket.id/${slug}`
  
  useSeoMeta({
    title: seoData.value.nama_event,
    ogTitle: seoData.value.nama_event,
    description: finalDesc,
    ogDescription: finalDesc,
    ogImage: fixPosterUrl(seoData.value.poster_url),
    ogImageType: 'image/jpeg',
    ogType: 'website',
    ogUrl: currentUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: seoData.value.nama_event,
    twitterDescription: finalDesc,
    twitterImage: fixPosterUrl(seoData.value.poster_url)
  })

  useHead({
    link: [
      { rel: 'preload', as: 'image', href: '/qris.webp', type: 'image/webp' }
    ]
  })
}
// ================================================

useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/qris.webp', type: 'image/webp' }
  ]
})

const { ticketCache, getTickets, invalidateTicketCache } = useEventTicketCache()

const selectedPreview = useState('selected_event_preview', () => null)

// Cek apakah ada data preloaded (dari klik event di index.vue atau dari SSR seoData)
const initialEvent = (selectedPreview.value && selectedPreview.value.slug === slug)
  ? selectedPreview.value
  : (seoData.value ? { ...seoData.value, slug } : null)

// Cek apakah tiket sudah ter-cache (dari prefetch touch/hover di index.vue)
const cachedInitialTickets = (initialEvent?.id && ticketCache.value[initialEvent.id]?.tickets) || null

const eventData = ref(initialEvent)
const organizerProfile = ref(initialEvent?.organizer_profile || {})
const isEventLoading = ref(!initialEvent)
const isTicketsLoading = ref(!cachedInitialTickets)
const tickets = ref(cachedInitialTickets ? [...cachedInitialTickets] : [])
const error = ref(null)

const isEmergencyBackup = ref(false)
const emergencyMessage = ref('')

const isEspayActiveCalculated = computed(() => {
  if (isEmergencyBackup.value) return false
  return eventData.value?.settings?.is_espay_active !== false
})

const hasB2BSurvey = computed(() => {
  return eventData.value?.settings?.b2b_survey?.active === true
})

const primaryParticipant = computed(() => {
  if (!daftarPeserta.value || daftarPeserta.value.length === 0) return null
  const p = daftarPeserta.value[0]
  return {
    nama: p.jawaban?.nama_lengkap || p.nama || '',
    email: p.jawaban?.email || p.email || '',
    phone: p.jawaban?.no_wa || p.phone || ''
  }
})

const { compressImageFile } = useImageCompress()

// --- STATE KERANJANG TIKET & UI ---
const currentStep = ref('home')
const isSetujuSnk = ref(false)


const isInfaqOn = ref(true)
const daftarPeserta = ref([])

const customFields = computed(() => {
  const fields = eventData.value?.settings?.pertanyaan_kustom
  if (!fields || fields.length === 0) {
    return [
      { field_key: 'nama_lengkap', label: 'Nama Lengkap', required: true, width: 12, type: 'short_text' },
      { field_key: 'email', label: 'Email', required: true, width: 6, type: 'email' },
      { field_key: 'no_wa', label: 'No. WhatsApp', required: true, width: 6, type: 'phone_wa' }
    ]
  }
  return [...fields].sort((a, b) => a.y - b.y || a.x - b.x)
})

const kodeUnik = ref(0)
onMounted(() => {
  kodeUnik.value = Math.floor(Math.random() * 399) + 101
})

const adminFee = 2000

const maxTicketsLimit = computed(() => {
  if (eventData.value?.settings?.is_limit_tiket_active) {
    return eventData.value?.settings?.max_tiket_per_transaksi || 1
  }
  return 0 // 0 means unlimited
})

const { keranjang, donasiAmount, totalQty, totalPrice, grandTotal, updateKeranjang, setEventSlug, syncWithAvailableTickets } = useCart(tickets, kodeUnik, adminFee, showToastMsg, maxTicketsLimit)
setEventSlug(slug)
if (cachedInitialTickets) {
  syncWithAvailableTickets(tickets.value)
}
const setDonasiAmount = (val) => donasiAmount.value = val

// Sinkronisasi keranjang dari daftarPeserta (misal setelah refresh F5 atau kembali antar-langkah)
const ensureCartSynced = () => {
  if (daftarPeserta.value && daftarPeserta.value.length > 0) {
    let needsSync = false
    const reconstructedCart = {}
    for (const p of daftarPeserta.value) {
      if (p.tiketId) {
        reconstructedCart[String(p.tiketId)] = (reconstructedCart[String(p.tiketId)] || 0) + 1
      }
    }
    for (const id in reconstructedCart) {
      if (keranjang.value[id] !== reconstructedCart[id]) {
        needsSync = true
        break
      }
    }
    if (needsSync || Object.keys(keranjang.value).length === 0) {
      keranjang.value = reconstructedCart
    }
  }
}

// Cek mutlak apakah pendaftaran benar-benar gratis (harga tiket di DB adalah Rp 0 dan tanpa donasi)
const isTrulyFree = computed(() => {
  if (donasiAmount.value > 0) return false
  if (totalPrice.value > 0) return false
  if (!daftarPeserta.value || daftarPeserta.value.length === 0) return false
  const hasPaidTicket = daftarPeserta.value.some(p => {
    const t = tickets.value.find(tkt => String(tkt.id) === String(p.tiketId))
    return t ? Number(t.harga) > 0 : (Number(p.hargaTiket) > 0)
  })
  if (hasPaidTicket) return false
  return true
})

import { watch } from 'vue'
watch(currentStep, (newVal) => {
  if (newVal === 'form' || newVal === 'bayar') {
    ensureCartSynced()
    if (daftarPeserta.value.length === 0 && !activePaymentResult.value) {
      currentStep.value = 'home'
      return
    }
    if (eventData.value?.settings?.is_infaq_wajib) {
      isInfaqOn.value = true
    }
  }
})

// --- KOMPUTASI PROGRESS BAR ---
const totalMaksimalKuota = computed(() => {
  return tickets.value.reduce((sum, t) => t.is_unlimited ? sum : sum + (t.kuota_maksimal || 0), 0)
})

const totalSisaKuota = computed(() => {
  return tickets.value.reduce((sum, t) => t.is_unlimited ? sum : sum + (t.sisa_kuota || 0), 0)
})

const persentaseTerisi = computed(() => {
  if (totalMaksimalKuota.value === 0) return 0
  const terjual = totalMaksimalKuota.value - totalSisaKuota.value
  const persen = (terjual / totalMaksimalKuota.value) * 100
  return persen > 100 ? 100 : persen
})

const generateFormPeserta = () => {
  daftarPeserta.value = []
  for (const id in keranjang.value) {
    const qty = keranjang.value[id]
    if (qty > 0) {
      const tiket = tickets.value.find(t => String(t.id) === String(id))
      for (let i = 0; i < qty; i++) {
        // Siapkan objek jawaban kosong
        const jawabanKosong = {}
        const extraData = {} // untuk menampung country code dsb
        
        customFields.value.forEach(f => { 
          if (f.type === 'checkboxes') {
            jawabanKosong[f.field_key] = []
          } else {
            jawabanKosong[f.field_key] = '' 
          }
          if (f.type === 'phone_wa') {
            extraData['_cc_' + f.field_key] = '62'
          }
        })
        
        daftarPeserta.value.push({
          ...extraData,
          tiketId: tiket.id,
          namaTiket: tiket.nama_kategori,
          hargaTiket: tiket.harga,
          jawaban: jawabanKosong
        })
      }
    }
  }
  currentStep.value = 'form'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const lanjutDaftar = () => {
  if (tickets.value.length === 0) {
    showToastMsg('Belum ada tiket yang tersedia untuk event ini.')
    return
  }
  if (totalQty.value === 0) {
    if (window.Swal) {
      window.Swal.fire({ icon: 'warning', title: 'Pilih Tiket', text: 'Silakan tentukan jumlah tiket yang ingin dibeli terlebih dahulu.', confirmButtonColor: '#0C387A' })
    } else {
      showToastMsg('Silakan pilih tiket terlebih dahulu.')
    }
    return
  }
  
  const isSnkActive = !!eventData.value.settings?.is_snk_active
  if (isSnkActive) {
    currentStep.value = 'snk'
  } else {
    generateFormPeserta()
  }
}

const setujuDanLanjut = () => {
  if (!isSetujuSnk.value) {
    if (window.Swal) {
      window.Swal.fire({ icon: 'warning', title: 'Belum Setuju', text: 'Mohon centang persetujuan terlebih dahulu.', confirmButtonColor: '#E85D5E' })
    } else {
      showToastMsg('Mohon centang persetujuan terlebih dahulu.')
    }
    return
  }
  generateFormPeserta()
}

const kembaliKeSnkAtauHome = () => {
  const isSnkActive = !!eventData.value?.settings?.is_snk_active
  currentStep.value = isSnkActive ? 'snk' : 'home'
}

const lanjutBayar = async () => {
  if (!daftarPeserta.value || daftarPeserta.value.length === 0) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'warning',
        title: 'Tiket Belum Dipilih',
        text: 'Data peserta kosong atau sesi telah berakhir. Silakan pilih tiket kembali.',
        confirmButtonColor: '#0C387A'
      })
    } else {
      showToastMsg('Data peserta kosong. Silakan pilih tiket terlebih dahulu.')
    }
    currentStep.value = 'home'
    return
  }

  let isValid = true
  for (const [index, peserta] of daftarPeserta.value.entries()) {
    for (const field of customFields.value) {
      if (field.type === 'header') continue // Header tidak perlu divalidasi
      
      let answer = peserta.jawaban[field.field_key]
      let isEmpty = false
      
      if (field.type === 'checkboxes') {
        isEmpty = !answer || answer.length === 0
      } else if (field.type === 'terms') {
        isEmpty = answer !== true
      } else {
        isEmpty = !answer
      }

      if (field.required && isEmpty) {
        if (window.Swal) {
          window.Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: `Mohon lengkapi "${field.label}" untuk Peserta Ke-${index + 1}`, confirmButtonColor: '#0C387A' })
        } else {
          showToastMsg(`Mohon lengkapi "${field.label}" untuk Peserta Ke-${index + 1}`)
        }
        isValid = false
        return
      }

      // Validasi Format Email (Bisa jadi type 'email' atau 'short_text' dengan key 'email')
      const isEmailField = field.type === 'email' || field.field_key === 'email' || ((field.type === 'short_text' || !field.type) && /^(email|alamat\s*email)$/i.test(field.label?.trim()))
      if (isEmailField && !isEmpty) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(answer)) {
          if (window.Swal) {
            window.Swal.fire({ icon: 'warning', title: 'Format Email Salah', text: `Mohon ketikkan format email yang benar pada "${field.label}" untuk Peserta Ke-${index + 1}`, confirmButtonColor: '#E85D5E' })
          } else {
            showToastMsg(`Format email salah pada "${field.label}"`)
          }
          isValid = false
          return
        }
      }

      // Validasi Nomor WhatsApp minimal 8 angka
      const isPhoneField = field.type === 'phone_wa' || field.field_key === 'no_wa' || field.field_key === 'whatsapp' || field.field_key === 'no_hp' || /^(no\.?\s*(wa|whatsapp|hp)|nomor\s*(wa|whatsapp|hp)|whatsapp)$/i.test(field.label?.trim())
      if (isPhoneField && !isEmpty) {
        const cleanNumber = answer.toString().replace(/\D/g, '')
        if (cleanNumber.length < 8) {
          if (window.Swal) {
            window.Swal.fire({ icon: 'warning', title: 'Nomor WA Tidak Valid', text: `Nomor WhatsApp pada "${field.label}" untuk Peserta Ke-${index + 1} minimal 8 angka.`, confirmButtonColor: '#E85D5E' })
          } else {
            showToastMsg(`Nomor WA pada "${field.label}" minimal 8 angka`)
          }
          isValid = false
          return
        }
      }
    }
  }

  if (isValid && eventData.value?.settings?.is_infaq_wajib && donasiAmount.value <= 0) {
    isValid = false
    if (window.Swal) window.Swal.fire({ icon: 'warning', title: 'Infaq Wajib', text: 'Mohon isi nominal infaq terbaik Anda.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Mohon isi nominal infaq!')
  }
  
  if (isValid) {
    // Jika event memiliki kuesioner B2B khusus (seperti Khazilmu), alihkan ke step survei terlebih dahulu
    if (hasB2BSurvey.value) {
      currentStep.value = 'survei'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const isAntiCaloActive = eventData.value?.settings?.is_anti_calo_email || eventData.value?.settings?.is_anti_calo_wa
    
    if (isAntiCaloActive) {
      // --- LAKUKAN PENGECEKAN ANTI CALO ---
      isSubmitting.value = true
      isPrinting.value = false
      try {
        const payloadPeserta = daftarPeserta.value.map(p => {
          let rawWa = p.jawaban['no_wa'] || ''
          if (rawWa && !rawWa.startsWith('62')) {
            if (rawWa.startsWith('0')) rawWa = '62' + rawWa.substring(1)
            else rawWa = '62' + rawWa
          }
          return {
            email: p.jawaban['email'] || '',
            no_wa: rawWa
          }
        })
        await $fetch('/api/check-calo', {
          method: 'POST',
          body: { event_id: eventData.value.id, peserta: payloadPeserta }
        })
      } catch (err) {
        isSubmitting.value = false
        const msg = err.data?.statusMessage || err.data?.message || err.message
        if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Ditolak', text: msg, confirmButtonColor: '#E85D5E' })
        return // STOP DI SINI JIKA KENA ANTI CALO
      }
      isSubmitting.value = false
    }

    ensureCartSynced()

    if (isTrulyFree.value) {
      // Tiket Gratis! Langsung eksekusi submit tanpa perlu langkah pembayaran
      isPrinting.value = true
      submitData()
    } else {
      // Pembayaran (ESPay Direct API atau Transfer Manual)
      currentStep.value = 'bayar'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// Handler saat kuesioner B2B selesai diisi
const handleSurveyComplete = async (surveyPayload) => {
  if (daftarPeserta.value && daftarPeserta.value.length > 0) {
    daftarPeserta.value.forEach(p => {
      p.jawaban = {
        ...p.jawaban,
        ...surveyPayload
      }
    })
  }

  // Cek Infaq Wajib jika aktif
  if (eventData.value?.settings?.is_infaq_wajib && donasiAmount.value <= 0) {
    if (window.Swal) window.Swal.fire({ icon: 'warning', title: 'Infaq Wajib', text: 'Mohon isi nominal infaq terbaik Anda.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Mohon isi nominal infaq!')
    return
  }

  // Jalankan Anti-Calo jika aktif
  const isAntiCaloActive = eventData.value?.settings?.is_anti_calo_email || eventData.value?.settings?.is_anti_calo_wa
  if (isAntiCaloActive) {
    isSubmitting.value = true
    isPrinting.value = false
    try {
      const payloadPeserta = daftarPeserta.value.map(p => {
        let rawWa = p.jawaban['no_wa'] || ''
        if (rawWa && !rawWa.startsWith('62')) {
          if (rawWa.startsWith('0')) rawWa = '62' + rawWa.substring(1)
          else rawWa = '62' + rawWa
        }
        return {
          email: p.jawaban['email'] || '',
          no_wa: rawWa
        }
      })
      await $fetch('/api/check-calo', {
        method: 'POST',
        body: { event_id: eventData.value.id, peserta: payloadPeserta }
      })
    } catch (err) {
      isSubmitting.value = false
      const msg = err.data?.statusMessage || err.data?.message || err.message
      if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Ditolak', text: msg, confirmButtonColor: '#E85D5E' })
      return
    }
    isSubmitting.value = false
  }

  ensureCartSynced()

  if (isTrulyFree.value) {
    // Tiket Gratis (Rp 0 & Infaq Rp 0)! Langsung eksekusi submit dan terbitkan tiket
    isPrinting.value = true
    submitData()
  } else {
    // Ada Infaq / Pembayaran -> Masuk ke layar pembayaran QRIS
    currentStep.value = 'bayar'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}


const {
  isSubmitting,
  isPrinting,
  buktiBayarFile,
  buktiBayarPreview,
  uploadError,
  transactionIdGlobal,
  processEspaySubmit,
  processManualSubmit
} = useEventCheckout()

const activePaymentResult = ref(null)
const isPaymentGatewayPaid = ref(false)

const handleResetPayment = () => {
  activePaymentResult.value = null
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`tyket_active_payment_${slug}`)
    const url = new URL(window.location.href)
    url.searchParams.delete('order_id')
    window.history.replaceState({}, '', url.toString())
  }
}

const handleCancelOrder = (orderId) => {
  activePaymentResult.value = null
  transactionIdGlobal.value = ''
  daftarPeserta.value = []
  keranjang.value = {}
  donasiAmount.value = 0
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`tyket_active_payment_${slug}`)
    const url = new URL(window.location.href)
    url.searchParams.delete('order_id')
    window.history.replaceState({}, '', url.toString())
  }
  currentStep.value = 'home'
  showToastMsg('Pesanan berhasil dibatalkan. Kuota tiket telah dikembalikan.', 'info')
}

const handleEspayPayment = async ({ paymentMethod, onSuccess, onError }) => {
  try {
    const res = await processEspaySubmit({
      donasiAmount: donasiAmount.value,
      eventData: eventData.value,
      daftarPeserta: daftarPeserta.value,
      customFields: customFields.value,
      tickets: tickets.value,
      kodeUnik: kodeUnik.value,
      supabase,
      $fetch,
      paymentMethod
    })

    // Simpan session transaksi aktif agar tahan saat browser di-refresh
    activePaymentResult.value = res
    transactionIdGlobal.value = res.order_id
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`tyket_active_payment_${slug}`, JSON.stringify({
        order_id: res.order_id,
        paymentResult: {
          ...res,
          amount: res.amount !== undefined ? res.amount : totalPrice.value,
          ticket_count: res.ticket_count || totalQty.value || (daftarPeserta.value ? daftarPeserta.value.length : 1),
          donasi_amount: res.donasi_amount !== undefined ? res.donasi_amount : donasiAmount.value,
          admin_fee: res.admin_fee || 2000,
          fee: res.fee
        },
        daftarPeserta: daftarPeserta.value,
        keranjang: keranjang.value,
        donasiAmount: donasiAmount.value
      }))
      const url = new URL(window.location.href)
      url.searchParams.set('order_id', res.order_id)
      window.history.replaceState({}, '', url.toString())
    }

    if (onSuccess) onSuccess(res)
  } catch (err) {
    if (onError) onError(err)
    const errorMsg = err.data?.statusMessage || err.data?.message || err.message || ''

    // Jika error adalah validasi peserta/kuota/anti-calo, tampilkan pesan error spesifik
    const isValidationErr = errorMsg.includes('Sistem Anti-Calo') || 
                            errorMsg.includes('kuota') || 
                            errorMsg.includes('tidak mencukupi') || 
                            errorMsg.includes('1 Email') || 
                            errorMsg.includes('1 No WA')

    if (isValidationErr) {
      if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Ditolak', text: errorMsg, confirmButtonColor: '#E85D5E' })
      else showToastMsg(errorMsg, 'error')
      return
    }

    // Auto-Failover: Jika gateway ESPay mengalami gangguan/timeout/down, alihkan ke QRIS Cadangan Tyket.id
    console.warn('[Auto-Failover] ESPay gagal, mengalihkan ke mode QRIS cadangan Tyket.id:', errorMsg)
    activePaymentResult.value = null
    isEmergencyBackup.value = true
    emergencyMessage.value = 'Layanan pembayaran otomatis sedang gangguan/pemeliharaan berkala. Pembayaran dialihkan ke QRIS Resmi Tyket.id.'

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`tyket_active_payment_${slug}`)
      const url = new URL(window.location.href)
      url.searchParams.delete('order_id')
      window.history.replaceState({}, '', url.toString())
    }

    if (window.Swal) {
      window.Swal.fire({
        icon: 'info',
        title: 'Pengalihan Pembayaran Cadangan',
        text: 'Layanan pembayaran bank otomatis sedang gangguan atau pemeliharaan berkala. Pembayaran Anda langsung dialihkan ke QRIS Resmi Tyket.id.',
        confirmButtonColor: '#0c387a',
        confirmButtonText: 'Lanjutkan Bayar via QRIS'
      })
    } else {
      showToastMsg('Pembayaran dialihkan ke QRIS Cadangan Tyket.id', 'info')
    }
  }
}

const goToTicket = async () => {
  if (transactionIdGlobal.value) {
    await navigateTo(`/tiket/${transactionIdGlobal.value}`)
  }
}

const handlePaymentSuccess = async (orderId) => {
  transactionIdGlobal.value = orderId
  isPaymentGatewayPaid.value = true

  // Hapus sesi aktif dari sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`tyket_active_payment_${slug}`)
  }

  // Mainkan suara printer tiket
  if (printAudio.value) {
    try {
      printAudio.value.currentTime = 0
      printAudio.value.play().catch(e => console.log('Autoplay sound blocked:', e))
    } catch (e) {}
  }

  // Tampilkan animasi cetak tiket (TicketPrinterOverlay)
  isPrinting.value = true
  isSubmitting.value = true

  // PRELOAD DATA TIKET & GENERATE BARCODE DI LATAR BELAKANG
  // Sambil menunggu animasi struk keluar (~2.4s), kita siapkan data dan QR code
  const preloadTicketData = async () => {
    try {
      const { data, error: sbErr } = await supabase
        .from('peserta')
        .select('*, event(nama_event, settings, organizer_id), kategori_tiket(harga)')
        .or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`)
        .order('id', { ascending: true })

      if (!sbErr && data && data.length > 0) {
        const QRCode = (await import('qrcode')).default
        const qrMap = {}
        for (const t of data) {
          const code = t.data_tambahan?.ticket_id || orderId
          if (code && !qrMap[code]) {
            try {
              qrMap[code] = await QRCode.toDataURL(code, {
                width: 240,
                margin: 1,
                color: { dark: '#0f172a', light: '#ffffff' }
              })
            } catch (e) {}
          }
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`tyket_preloaded_${orderId}`, JSON.stringify({
            data,
            qrMap,
            timestamp: Date.now()
          }))
        }
      }
    } catch (e) {
      console.warn('Preload tiket di background gagal, fallback ke fetch normal:', e)
    }
  }

  // Jalankan preload data dan tunggu animasi printer & audio selesai secara sinkron
  await Promise.all([
    preloadTicketData(),
    new Promise(resolve => {
      let isDone = false
      const finish = () => {
        if (!isDone) {
          isDone = true
          resolve()
        }
      }
      if (printAudio.value) {
        printAudio.value.onended = finish
      }
      setTimeout(finish, 3350)
    })
  ])

  isPrinting.value = false
  isSubmitting.value = false

  // Langsung navigasi via SPA Router (tanpa reload browser / kedipan putih)
  await navigateTo(`/tiket/${orderId}`)
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Ukuran Terlalu Besar', text: 'Maksimal 5 MB.' })
    else showToastMsg('Ukuran foto maksimal 5 MB!')
    event.target.value = '' 
    return
  }
  uploadError.value = false
  if (file.type.startsWith('image/')) {
    try {
      buktiBayarFile.value = await compressImageFile(file, 800, 0.6)
      buktiBayarPreview.value = URL.createObjectURL(buktiBayarFile.value)
    } catch (e) {
      showToastMsg('Gagal memproses gambar struk')
    }
  } else {
    buktiBayarFile.value = file
    buktiBayarPreview.value = URL.createObjectURL(file)
  }
}

const submitData = async () => {
  const startTime = Date.now()
  try {
    const res = await processManualSubmit({
      eventData: eventData.value,
      daftarPeserta: daftarPeserta.value,
      customFields: customFields.value,
      tickets: tickets.value,
      supabase,
      $fetch,
      printAudio: printAudio.value,
      grandTotal: grandTotal.value,
      totalPrice: totalPrice.value,
      kodeUnik: kodeUnik.value,
      donasiAmount: donasiAmount.value,
      adminFee,
      startTime
    })
    
    isPrinting.value = false
    isSubmitting.value = false
    if (eventData.value?.id) {
      invalidateTicketCache(eventData.value.id)
    }
    if (res.isFree) {
      window.isRedirecting = true
      await navigateTo(`/tiket/${res.transactionId}`)
    } else {
      currentStep.value = 'sukses'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Gagal', text: err.message, confirmButtonColor: '#E85D5E' })
    else showToastMsg('Gagal: ' + err.message)
  }
}

const kirimWA = () => {
  let noAdmin = organizerProfile.value?.no_wa || "62800000000"
  noAdmin = noAdmin.replace(/\D/g, '')
  if (noAdmin.startsWith('0')) noAdmin = '62' + noAdmin.substring(1)
  
  const domain = window.location.origin
  const namaEvent = eventData.value?.nama_event || 'Event'
  const namaPeserta = daftarPeserta.value?.[0]?.nama_lengkap || ''
  const groupUrl = eventData.value?.settings?.link_grup_wa || ''
  
  let rawText = ''
  if (isTrulyFree.value || isPaymentGatewayPaid.value) {
    rawText = `Halo Admin Panitia,\nSaya sudah menyelesaikan pendaftaran acara *${namaEvent}*:\n` +
      (namaPeserta ? `• Nama: *${namaPeserta}*\n` : '') +
      `• Order ID: *${transactionIdGlobal.value}*\n` +
      `• Link E-Ticket: ${domain}/tiket/${transactionIdGlobal.value}\n\n`
      
    if (groupUrl) {
      rawText += `👉 Tautan Masuk Grup WhatsApp Peserta:\n${groupUrl}\n\n` +
        `Mohon dicatat dan di-approve di grup ya min. Terima kasih! 🙏`
    } else {
      rawText += `Mohon dicatat dan dikonfirmasi kehadiran saya. Terima kasih! 🙏`
    }
  } else {
    rawText = `Halo Admin Panitia,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${namaEvent}*.\n\n` +
      (namaPeserta ? `• Nama: *${namaPeserta}*\n` : '') +
      `• Order ID: *${transactionIdGlobal.value}*\n` +
      `• Link Tiket: ${domain}/tiket/${transactionIdGlobal.value}\n\n` +
      `Berikut saya lampirkan bukti transfer pembayaran saya. Mohon bantuannya untuk diverifikasi. Terima kasih! 🙏`
  }
  
  window.open(`https://api.whatsapp.com/send?phone=${noAdmin}&text=${encodeURIComponent(rawText)}`, "_blank")
}

const bukaGrupWa = () => {
  const link = eventData.value?.settings?.link_grup_wa
  if (link) window.open(link, "_blank")
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Segera Hadir'
  return new Date(dateStr).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})
}

// Fungsi memuat tiket secepat kilat (Non-blocking langsung render begitu data tiba)
const fetchTicketsForEvent = async (eventId) => {
  try {
    const tktData = await getTickets(eventId, route.query.secret)

    if (tktData && tktData.length > 0) {
      tickets.value = tktData
      syncWithAvailableTickets(tickets.value)
    } else {
      tickets.value = []
      syncWithAvailableTickets([])
    }
  } catch (err) {
    console.error('Gagal memuat tiket:', err)
    tickets.value = []
    syncWithAvailableTickets([])
  } finally {
    // LANGSUNG MATIKAN SKELETON TIKET BEGITU DATA TIKET TIBA!
    isTicketsLoading.value = false
  }

  // === AUTO-SELECT TIKET DARI URL QUERY (?tiket=... atau ?ticket=...) ===
  const targetQuery = route.query.tiket || route.query.ticket
  if (targetQuery && typeof targetQuery === 'string') {
    const queryStr = targetQuery.toLowerCase().trim()
    const targetQty = parseInt(route.query.qty) || 1

    const foundTicket = tickets.value.find(t => 
      String(t.id) === queryStr || 
      (t.nama_kategori && t.nama_kategori.toLowerCase().includes(queryStr))
    )

    if (foundTicket && foundTicket.sisa_kuota > 0) {
      const qtyToSelect = Math.min(targetQty, foundTicket.sisa_kuota)
      updateKeranjang(foundTicket.id, qtyToSelect, foundTicket.sisa_kuota)

      if (route.query.direct !== 'false') {
        isSetujuSnk.value = true
        generateFormPeserta()
      } else {
        setTimeout(() => {
          showToastMsg(`Tiket "${foundTicket.nama_kategori}" terpilih otomatis.`, 'success')
        }, 300)
      }
    }
  }
}

onMounted(async () => {
  // 1. Jalankan cek status failover gateway di background tanpa memblokir render
  $fetch('/api/gateway-status').then(gwStatus => {
    if (gwStatus) {
      isEmergencyBackup.value = gwStatus.is_emergency_backup === true
      emergencyMessage.value = gwStatus.emergency_message || ''
    }
  }).catch(e => console.warn('Gagal memuat status gateway:', e))

  // 2. JIKA ID EVENT SUDAH TERSEDIA (DARI INDEX ATAU SSR), LANGSUNG TARIK TIKET SEKARANG JUGA!
  if (eventData.value?.id) {
    fetchTicketsForEvent(eventData.value.id)
  }

  try {
    // 3. Tarik data event
    const { data: evData, error: evErr } = await supabase
      .from('event')
      .select('id, nama_event, poster_url, tanggal_mulai, lokasi, deskripsi, organizer_id, settings')
      .eq('slug', slug)
      .single()

    if (evErr) {
      if (!eventData.value?.id) throw evErr
    } else if (evData) {
      eventData.value = { ...eventData.value, ...evData }
      // Jika tadi tiket belum ditarik karena ID belum ada, tarik sekarang!
      if (isTicketsLoading.value && tickets.value.length === 0) {
        fetchTicketsForEvent(evData.id)
      }
    }

    // 4. Tarik profil organizer jika ada dan belum lengkap
    const currentOrgId = eventData.value?.organizer_id
    if (currentOrgId && !organizerProfile.value?.no_wa) {
      const { data: orgData } = await supabase
        .from('organizer_profile')
        .select('nama_organizer, no_wa, link_ig, link_web, logo_url')
        .eq('id', currentOrgId)
        .maybeSingle()
      if (orgData) {
        organizerProfile.value = { ...organizerProfile.value, ...orgData }
      }
    }

      // === AUTO RESTORE PEMBAYARAN JIKA HALAMAN DI-REFRESH (F5) ===
      if (typeof window !== 'undefined') {
        const savedSessionStr = sessionStorage.getItem(`tyket_active_payment_${slug}`)
        const urlOrderId = route.query.order_id
        
        if (savedSessionStr || urlOrderId) {
          let savedData = null
          try {
            if (savedSessionStr) savedData = JSON.parse(savedSessionStr)
          } catch (e) {}

          const orderIdToCheck = (typeof urlOrderId === 'string' ? urlOrderId : null) || savedData?.order_id

          // Jika session sebelumnya adalah QRIS Demo / simulator usang, bersihkan dan alihkan ke mode backup
          if (
            savedData?.paymentResult?.isSimulator || 
            savedData?.paymentResult?.qr_image?.includes('QRIS DEMO') || 
            savedData?.paymentResult?.qr_image?.includes('QRIS%20DEMO')
          ) {
            sessionStorage.removeItem(`tyket_active_payment_${slug}`)
            activePaymentResult.value = null
            isEmergencyBackup.value = true
            emergencyMessage.value = 'Layanan pembayaran otomatis sedang gangguan/pemeliharaan berkala. Pembayaran dialihkan ke QRIS Resmi Tyket.id.'
            const url = new URL(window.location.href)
            url.searchParams.delete('order_id')
            window.history.replaceState({}, '', url.toString())
            if (savedData.daftarPeserta && Array.isArray(savedData.daftarPeserta)) {
              daftarPeserta.value = savedData.daftarPeserta
            }
            if (savedData.keranjang && Object.keys(savedData.keranjang).length > 0) {
              keranjang.value = { ...savedData.keranjang }
            }
            currentStep.value = 'bayar'
            return
          }

          if (orderIdToCheck) {
            try {
              const checkRes = await $fetch(`/api/check-espay?order_id=${orderIdToCheck}`)
              if (checkRes && checkRes.status === 'paid') {
                sessionStorage.removeItem(`tyket_active_payment_${slug}`)
                window.location.href = `/tiket/${orderIdToCheck}`
                return
              } else if (checkRes && (checkRes.status === 'expired' || checkRes.status === 'cancelled')) {
                sessionStorage.removeItem(`tyket_active_payment_${slug}`)
                const url = new URL(window.location.href)
                url.searchParams.delete('order_id')
                window.history.replaceState({}, '', url.toString())
                showToastMsg('Pesanan sebelumnya telah kedaluwarsa atau dibatalkan.', 'info')
              } else if (savedData && savedData.paymentResult) {
                activePaymentResult.value = {
                  ...savedData.paymentResult,
                  ...(checkRes?.remaining_seconds !== undefined ? { remaining_seconds: checkRes.remaining_seconds } : {})
                }
                transactionIdGlobal.value = orderIdToCheck
                if (savedData.daftarPeserta && Array.isArray(savedData.daftarPeserta)) {
                  daftarPeserta.value = savedData.daftarPeserta
                }
                if (savedData.keranjang && Object.keys(savedData.keranjang).length > 0) {
                  keranjang.value = { ...savedData.keranjang }
                } else if (daftarPeserta.value && daftarPeserta.value.length > 0) {
                  ensureCartSynced()
                }
                if (savedData.donasiAmount !== undefined) {
                  donasiAmount.value = Number(savedData.donasiAmount)
                } else if (savedData.paymentResult?.donasi_amount !== undefined) {
                  donasiAmount.value = Number(savedData.paymentResult.donasi_amount)
                }
                currentStep.value = 'bayar'
              } else if (checkRes && checkRes.payment) {
                activePaymentResult.value = {
                  order_id: orderIdToCheck,
                  total_amount: checkRes.payment.total_amount,
                  amount: checkRes.payment.amount || (checkRes.payment.total_amount - (checkRes.payment.gateway_fee || 0) - (checkRes.payment.admin_fee || 2000)),
                  ticket_count: checkRes.payment.ticket_count || checkRes.ticket_count || 1,
                  admin_fee: checkRes.payment.admin_fee || 2000,
                  fee: checkRes.payment.gateway_fee || 0,
                  donasi_amount: checkRes.payment.donasi_amount || 0,
                  payment_type: checkRes.payment.espay_data?.payment_type || 'qris',
                  va_number: checkRes.payment.espay_data?.va_number,
                  bank_name: checkRes.payment.espay_data?.bank_name
                }
                transactionIdGlobal.value = orderIdToCheck
                if (savedData?.daftarPeserta && Array.isArray(savedData.daftarPeserta)) {
                  daftarPeserta.value = savedData.daftarPeserta
                  ensureCartSynced()
                }
                currentStep.value = 'bayar'
              }
            } catch (sessionErr) {
              console.warn('Gagal memverifikasi status pembayaran saat refresh:', sessionErr)
            }
          }
        }
      }
  } catch (err) {
    if (!eventData.value) {
      error.value = "Gagal memuat event dari sistem. Silakan periksa URL Anda."
    }
    console.error(err)
  } finally {
    isEventLoading.value = false
    isTicketsLoading.value = false
  }
})
</script>

<style scoped>
.container { 
  width: 100%; 
  max-width: 480px; 
  background: var(--card-light); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); 
  border: 1px solid var(--border-soft); 
  border-radius: 24px; 
  overflow-x: hidden; 
  position: relative; 
  margin: 40px auto;
  min-height: 100vh;
  box-sizing: border-box;
}
.step-content { opacity: 1; padding: 24px 20px; box-sizing: border-box; width: 100%; }
.glass { background: white; border-radius: 16px; padding: 2rem 1.5rem; text-align: center; position: relative; overflow: hidden; border: none; width: 100%; box-sizing: border-box; }

@media (max-width: 480px) {
  .container {
    margin: 0 auto;
    border-radius: 0;
    border: none;
    box-shadow: none;
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
  .step-content { padding: 20px 16px; }
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent-main) !important;
  box-shadow: 0 0 0 4px rgba(28, 84, 144, 0.15) !important;
  outline: none;
}


/* Refactored CSS Classes */
.toast-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  animation: slideDown 0.3s ease-out;
  color: #fff;
}
.toast-success { background: #1a6a4a; }
.toast-error { background: #d43f34; }

.state-message {
  padding: 50px;
  text-align: center;
  color: var(--text-main);
}
.error-text { color: #ef4444; }

/* SKELETON MODERN SHIMMER UI */
.skeleton-badge-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}
.skeleton-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 14px;
}
.skeleton-dot-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary, #0C387A);
  animation: pulseDot 1.2s infinite ease-in-out;
}
.skeleton-badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.3px;
}
@keyframes pulseDot {
  0% { transform: scale(0.85); opacity: 0.5; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(0.85); opacity: 0.5; }
}

.skeleton-item {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite linear;
  border-radius: 8px;
}
@keyframes skeletonShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-poster-box {
  width: 100%;
  aspect-ratio: 3 / 1;
  border-radius: 12px;
  margin-bottom: 16px;
}
.skeleton-title-line {
  height: 24px;
  width: 80%;
  margin: 0 auto 8px auto;
  border-radius: 6px;
}
.skeleton-title-line-short {
  height: 18px;
  width: 50%;
  margin: 0 auto 16px auto;
  border-radius: 6px;
}
.skeleton-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}
.skeleton-meta-pill {
  height: 40px;
  border-radius: 10px;
}
.skeleton-card-block {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;
}
.skeleton-eo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.skeleton-avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}
.skeleton-eo-text {
  flex: 1;
}
.skeleton-eo-sub {
  height: 10px;
  width: 40%;
  margin-bottom: 6px;
}
.skeleton-eo-main {
  height: 14px;
  width: 70%;
}
.skeleton-divider {
  height: 1px;
  width: 100%;
  margin: 14px 0;
  background: #e2e8f0;
}
.skeleton-desc-heading {
  height: 12px;
  width: 30%;
  margin-bottom: 10px;
}
.skeleton-desc-line {
  height: 12px;
  width: 100%;
  margin-bottom: 6px;
}
.skeleton-desc-line-short {
  height: 12px;
  width: 65%;
}
.skeleton-tickets-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.skeleton-ticket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
}
.skeleton-tkt-left {
  flex: 1;
}
.skeleton-tkt-title {
  height: 16px;
  width: 55%;
  margin-bottom: 6px;
}
.skeleton-tkt-price {
  height: 14px;
  width: 35%;
}
.skeleton-tkt-action {
  width: 76px;
  height: 32px;
  border-radius: 8px;
}
.skeleton-btn-main {
  height: 48px;
  width: 100%;
  border-radius: 12px;
}

.step-home { padding: 6px; }
.glass-home { margin-top: 0px; padding: 1rem 1rem 0.5rem 1rem; }

/* Tautan Cek Tiket Minimalis */
.footer-check-ticket {
  text-align: center;
  margin-top: 10px;
  padding-top: 0;
}
.link-check-ticket {
  font-size: 0.65rem;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
  display: inline-block;
  opacity: 0.8;
}
.link-check-ticket:hover {
  color: var(--primary, #0C387A);
  text-decoration: underline;
  opacity: 1;
}

/* Watermark Platform Branding */
.platform-watermark {
  margin-top: 6px;
  padding-top: 0;
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.watermark-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}
.watermark-link:hover {
  opacity: 1;
}
.watermark-link span {
  font-size: 0.62rem;
  color: var(--text-muted, #64748b);
  font-weight: 500;
  letter-spacing: 0.2px;
}
.watermark-logo {
  height: 15px;
  width: auto;
  object-fit: contain;
  display: inline-block;
  vertical-align: middle;
}

.btn-register {
  margin-top: 0;
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.85rem;
  flex-direction: column;
  line-height: 1.2;
  width: 100%;
  background: var(--primary);
  color: var(--accent-yellow);
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn-register-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
.btn-register-sub {
  font-size: 0.6rem;
  font-weight: 600;
  opacity: 0.9;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  width: 100%;
}
.social-btn {
  background: #ffffff;
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  border: 1px solid #e2e8f0;
  transition: 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  min-width: 0;
  overflow: hidden;
}
.social-btn:active {
  background: #f1f5f9;
  transform: scale(0.98);
}
.social-text {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.step-padded { padding: 12px 15px; }

.step-title {
  margin-top: 0;
  color: var(--primary);
  text-align: center;
}
.step-title-left {
  margin-top: 0;
}
.step-subtitle {
  font-size: 0.8rem;
  text-align: center;
  color: var(--text-muted);
  margin-top: -5px;
}

.snk-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  max-height: 250px;
  overflow-y: auto;
  font-size: 0.6rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 10px;
  white-space: pre-wrap;
}
.snk-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.6rem; opacity: 0.75;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
}
.snk-checkbox {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.action-row {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}
.btn-action {
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.btn-secondary {
  flex: 3;
  background: #e2e8f0;
  color: #475569;
}
.btn-primary {
  flex: 7;
  background: var(--primary);
  color: var(--accent-yellow);
}

.ticket-header-star {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 4px;
  text-align: center;
}
.ticket-header-event {
  font-size: 9px;
  font-weight: 800;
  color: var(--text-muted);
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
}
.ticket-divider {
  width: 100%;
  border-top: 2px dashed #cbd5e1;
  margin-bottom: 16px;
}
.ticket-owner-box {
  width: 100%;
  text-align: center;
}
.ticket-owner-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
  display: block;
  margin-bottom: 2px;
}
.ticket-owner-name {
  font-size: 14px;
  font-weight: 900;
  color: var(--text-main);
  text-transform: uppercase;
}
.ticket-trx-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  padding: 6px 0;
  border-top: 1px dashed #cbd5e1;
  border-bottom: 1px dashed #cbd5e1;
}
.ticket-trx-id {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-main);
  font-family: monospace;
  letter-spacing: 2px;
}
.ticket-summary-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  font-size: 10px;
  font-weight: 900;
  color: var(--text-muted);
  border-top: 1px dotted #cbd5e1;
  padding-top: 8px;
}
.ticket-status-paid { color: var(--primary); }

.bar-4 { width: 4px; }
.bar-8 { width: 8px; }
.bar-12 { width: 12px; }
.bar-16 { width: 16px; }









/* CSS untuk Switch Toggle ala iOS */






















.legal-disclaimer {
  font-size: 0.6rem; opacity: 0.75;
  color: var(--text-muted, #64748b);
  text-align: center;
  margin: 16px 0;
  line-height: 1.4;
  padding: 0 10px;
}
.legal-disclaimer a {
  color: var(--primary, #0C387A);
  font-weight: 600;
  text-decoration: underline;
}
</style>
