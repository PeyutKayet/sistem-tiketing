<template>
  <div class="container">
    <!-- PUBLIC TOAST -->
    <div v-if="toastMessage" class="toast-message" :class="toastType === 'success' ? 'toast-success' : 'toast-error'">
      {{ toastMessage }}
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="state-message">
      Mempersiapkan ruang yang aman dan nyaman...
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
          @update-keranjang="updateKeranjang"
        />

        <!-- Tombol Daftar -->
        <button @click="lanjutDaftar" class="btn-register">
          <div class="btn-register-text">DAFTAR SEKARANG ➔</div>
          <small v-if="totalQty > 0" class="btn-register-sub">
            {{ totalQty }} Tiket • {{ totalPrice === 0 ? 'GRATIS' : formatPrice(totalPrice) }}
          </small>
        </button>

        <!-- Tombol Sosial Media -->
        <div class="social-grid">
          <a :href="organizerProfile.link_ig || '#'" target="_blank" class="social-btn">
            <span class="social-text">Instagram</span>
          </a>
          <a :href="formatWaLink(organizerProfile.no_wa)" target="_blank" class="social-btn">
            <span class="social-text">WhatsApp</span>
          </a>
          <a :href="organizerProfile.link_web || '#'" target="_blank" class="social-btn">
            <span class="social-text">Website</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Tampilan Syarat & Ketentuan (S&K) -->
    <div v-else-if="currentStep === 'snk'" class="step-content active step-padded">
      <h3 class="step-title">Syarat & Ketentuan</h3>
      <p class="step-subtitle">Mohon baca dan setujui sebelum melanjutkan</p>
      
      <div class="snk-box">
        {{ eventData.settings?.snk_text || 'Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.' }}
      </div>
      
      <label class="snk-label">
        <input type="checkbox" v-model="isSetujuSnk" class="snk-checkbox">
        Saya menyetujui persyaratan di atas
      </label>

      <div class="action-row">
        <button @click="currentStep = 'home'" class="btn-action btn-secondary">KEMBALI</button>
        <button @click="setujuDanLanjut" class="btn-action btn-primary">LANJUTKAN ➔</button>
      </div>
    </div>

    <!-- Tampilan Form Data Diri (FORM) -->
    <div v-else-if="currentStep === 'form'" class="step-content active step-padded">
      <h3 class="step-title-left">Data Diri Peserta</h3>
      
      <ParticipantForm 
        :daftarPeserta="daftarPeserta" 
        :customFields="customFields" 
        @toast="showToastMsg"
      />

      <!-- Bagian Donasi Standar (Sesuai Form Peserta) -->
      <div v-if="eventData?.settings?.is_donasi_active" class="participant-card donasi-form-card" :class="{'donasi-dim': !isInfaqOn}">
        <div class="donasi-header-flex">
          <div class="donasi-title-wrap">
            <svg class="donasi-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span class="form-section-title" style="margin: 0; font-size: 0.95rem;">{{ eventData.settings.donasi_header || 'Infaq / Donasi' }}</span>
          </div>
          <label v-if="!eventData.settings.is_infaq_wajib" class="switch-small">
            <input type="checkbox" v-model="isInfaqOn" @change="handleToggleInfaq">
            <span class="slider-small round-small"></span>
          </label>
        </div>
        
        <p class="donasi-subtitle">Bantu tebarkan manfaat untuk sesama</p>

        <div v-if="isInfaqOn" class="donasi-form-body">
          <div v-if="hasFixedOptions" class="donasi-chips">
            <button 
              v-for="(opt, idx) in fixedOptionsOnly" 
              :key="idx"
              @click="selectDonasi(opt)"
              class="form-chip"
              :class="{ 'form-chip-active': selectedDonasiOpt === opt }"
            >
              {{ formatPrice(Number(opt)) }}
            </button>
            <button 
              v-if="hasCustomOption"
              @click="selectDonasi('custom')"
              class="form-chip"
              :class="{ 'form-chip-active': selectedDonasiOpt === 'custom' }"
            >
              Lainnya
            </button>
          </div>

          <div v-if="selectedDonasiOpt === 'custom' || (!hasFixedOptions && hasCustomOption)" class="form-input-group">
            <span class="form-input-prefix">Rp</span>
            <input 
              type="text" 
              inputmode="numeric"
              :value="customDonasiValueFormatted"
              @input="updateCustomDonasi"
              class="form-input donasi-input" 
              placeholder="0" 
            />
          </div>
        </div>
      </div>

      <div class="action-row">
        <button @click="kembaliKeSnkAtauHome" class="btn-action btn-secondary">KEMBALI</button>
        <button @click="lanjutBayar" class="btn-action btn-primary">LANJUT BAYAR ➔</button>
      </div>
    </div>

    <!-- Tampilan Pembayaran (BAYAR) -->
    <div v-else-if="currentStep === 'bayar'" class="step-content active step-padded">
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
        @file-upload="handleFileUpload"
        @back="currentStep = 'form'"
        @submit="submitData"
        @toast="showToastMsg"
      />
    </div>

    <!-- Tampilan Sukses (SUKSES) -->
    <div v-else-if="currentStep === 'sukses'" class="step-content active">
      <SuccessStep 
        :eventData="eventData"
        :isFree="grandTotal === 0"
        @kirim-wa="kirimWA"
        @buka-grup="bukaGrupWa"
        @lihat-tiket="() => { window.location.href = `/tiket/${transactionIdGlobal}` }"
      />
    </div>
  </div>

  <!-- PRINTER ANIMATION OVERLAY -->
  <div class="api-loader" :class="{ active: isSubmitting }">
    <div class="printer-wrapper">
      <div class="printer-slot"><div class="printer-slot-inner"><div class="printer-slot-light"></div></div></div>
      <div class="printer-mask">
        <div class="ticket-paper-output">
          <div class="ticket-header-star">★ E-TICKET RESMI ★</div>
          <div class="ticket-header-event">{{ eventData?.nama_event || 'EVENT' }}</div>
          
          <div class="ticket-divider"></div>
          
          <div class="ticket-owner-box">
            <span class="ticket-owner-label">PESERTA</span>
            <span class="ticket-owner-name">{{ daftarPeserta[0]?.jawaban?.nama_lengkap || 'PESERTA' }}</span>
          </div>

          <div class="ticket-trx-box">
             <span class="ticket-trx-id">{{ transactionIdGlobal || 'MEMPROSES...' }}</span>
          </div>

          <div class="ticket-summary-box">
             <span>{{ daftarPeserta.length }} TIKET</span>
             <span class="ticket-status-paid">LUNAS</span>
          </div>
          
          <div class="fake-barcode-area">
             <div class="bar-4"></div><div class="bar-8"></div>
             <div class="bar-4"></div><div class="bar-16"></div>
             <div class="bar-4"></div><div class="bar-4"></div>
             <div class="bar-8"></div><div class="bar-12"></div>
             <div class="bar-4"></div><div class="bar-16"></div>
             <div class="bar-4"></div><div class="bar-8"></div>
             <div class="bar-8"></div><div class="bar-4"></div>
             <div class="bar-16"></div><div class="bar-4"></div>
             <div class="bar-12"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading-badge">
      <div class="loading-dot"></div>
      MENCETAK TIKET...
    </div>
  </div>
</template>


<script setup>

import { ref, onMounted, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { useImageCompress } from '~/composables/useImageCompress'
import { formatPrice } from '~/utils/format'
import EventHeader from '~/components/event/EventHeader.vue'
import TicketList from '~/components/event/TicketList.vue'
import ParticipantForm from '~/components/event/ParticipantForm.vue'
import CheckoutPayment from '~/components/event/CheckoutPayment.vue'
import SuccessStep from '~/components/event/SuccessStep.vue'
import { useRoute } from 'vue-router'

const toastMessage = ref('')
const toastType = ref('')
const showToastMsg = (msg, type = 'error') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

const route = useRoute()
const slug = route.params.slug

const supabase = useSupabaseClient()

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return ''
  return url.replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
}

// === SEO & OPEN GRAPH (Berjalan di Server-Side) ===
const { data: seoData } = await useAsyncData(`seo-${slug}`, async () => {
  const { data } = await supabase.from('event').select('nama_event, deskripsi, poster_url').eq('slug', slug).single()
  return data
})

if (seoData.value) {
  // Potong deskripsi jika terlalu panjang untuk SEO
  const plainDesc = seoData.value.deskripsi ? seoData.value.deskripsi.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : `Daftar sekarang untuk acara ${seoData.value.nama_event}!`
  
  useSeoMeta({
    title: seoData.value.nama_event,
    ogTitle: seoData.value.nama_event,
    description: plainDesc,
    ogDescription: plainDesc,
    ogImage: fixPosterUrl(seoData.value.poster_url),
    twitterCard: 'summary_large_image',
  })
}
// ================================================

const loading = ref(true)
const error = ref(null)
const eventData = ref(null)
const organizerProfile = ref({})
const tickets = ref([])

const { compressImageFile } = useImageCompress()

// --- STATE KERANJANG TIKET & UI ---
const currentStep = ref('home')
const isSetujuSnk = ref(false)

const isInfaqOn = ref(true) // Otomatis menyala di awal
const selectedDonasiOpt = ref('')
const customDonasiValue = ref(0)
const customDonasiValueFormatted = ref('')

const parsedDonasiOptions = computed(() => {
  if (!eventData.value?.settings?.donasi_options) return []
  return eventData.value.settings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

const fixedOptionsOnly = computed(() => {
  return parsedDonasiOptions.value.filter(opt => opt !== 'custom')
})

const hasFixedOptions = computed(() => {
  return fixedOptionsOnly.value.length > 0
})

const hasCustomOption = computed(() => {
  return parsedDonasiOptions.value.includes('custom')
})

// Fungsi untuk memilih otomatis nominal saat form dirender pertama kali
const initDefaultDonasi = () => {
  if (!eventData.value?.settings?.is_donasi_active) return
  const opts = parsedDonasiOptions.value
  if (opts.length > 0) {
    // Selalu prioritaskan opsi fixed pertama, kalau tidak ada baru 'custom'
    const firstOpt = hasFixedOptions.value ? fixedOptionsOnly.value[0] : 'custom'
    selectedDonasiOpt.value = firstOpt
    if (firstOpt !== 'custom') {
      donasiAmount.value = Number(firstOpt)
    } else {
      donasiAmount.value = customDonasiValue.value || 0
    }
  }
}

// Panggil inisialisasi setiap kali pindah ke step 'form' (bisa via watch, atau saat tombol lanjut ditekan)
import { watch } from 'vue'
watch(currentStep, (newVal) => {
  if (newVal === 'form') {
    if (eventData.value?.settings?.is_infaq_wajib) {
      isInfaqOn.value = true
    }
    if (donasiAmount.value === 0 && isInfaqOn.value) {
      initDefaultDonasi()
    }
  }
})

const handleToggleInfaq = () => {
  if (isInfaqOn.value) {
    // Jika dihidupkan lagi, pilih opsi pertama atau opsi yang tersimpan
    initDefaultDonasi()
  } else {
    // Jika dimatikan, paksa donasi jadi 0
    donasiAmount.value = 0
  }
}

const selectDonasi = (opt) => {
  selectedDonasiOpt.value = opt
  if (opt !== 'custom') {
    donasiAmount.value = Number(opt)
  } else {
    donasiAmount.value = customDonasiValue.value || 0
  }
}

const updateCustomDonasi = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  if (val) {
    customDonasiValueFormatted.value = Number(val).toLocaleString('id-ID')
    customDonasiValue.value = Number(val)
  } else {
    customDonasiValueFormatted.value = ''
    customDonasiValue.value = 0
  }

  if (selectedDonasiOpt.value === 'custom') {
    donasiAmount.value = customDonasiValue.value
  }
}

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
  return fields
})

const kodeUnik = ref(0)
onMounted(() => {
  kodeUnik.value = Math.floor(Math.random() * 399) + 101
})

const adminFee = 2000

const { keranjang, donasiAmount, totalQty, totalPrice, grandTotal, updateKeranjang } = useCart(tickets, kodeUnik, adminFee, showToastMsg)

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

const lanjutBayar = () => {
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
    }
  }

  if (isValid && eventData.value?.settings?.is_infaq_wajib && donasiAmount.value <= 0) {
    isValid = false
    if (window.Swal) window.Swal.fire({ icon: 'warning', title: 'Infaq Wajib', text: 'Mohon isi nominal infaq terbaik Anda.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Mohon isi nominal infaq!')
  }
  
  if (isValid) {
    if (totalPrice.value === 0 && donasiAmount.value === 0) {
      // Tiket Gratis! Langsung eksekusi submit tanpa perlu langkah pembayaran
      submitData()
    } else if (eventData.value?.settings?.is_kasera_active && grandTotal.value >= 10000) {
      // Bayar pakai Kasera! Skip halaman upload bukti
      submitDataKasera()
    } else {
      // Pembayaran Manual
      currentStep.value = 'bayar'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// --- LOGIKA SUBMIT KASERA ---
const submitDataKasera = async () => {
  isSubmitting.value = true
  // Munculkan UI loading (bisa meminjam UI loading milik submitData biasa)
  document.querySelector('.api-loader')?.classList.add('active')

  try {
    // -- DOUBLE CHECK KUOTA TIKET --
    if (tickets.value.length > 0 && !tickets.value[0].is_unlimited) {
      const { count, error: countErr } = await supabase
        .from('peserta')
        .select('*', { count: 'exact', head: true })
        .eq('kategori_id', tickets.value[0].id)
      
      if (!countErr && count !== null) {
        const sisaSekarang = tickets.value[0].kuota_maksimal - count
        if (sisaSekarang < daftarPeserta.value.length) {
          throw new Error(`Maaf, sisa kuota tiket ini hanya ${sisaSekarang > 0 ? sisaSekarang : 0}. Pesanan ditolak untuk mencegah oversold.`)
        }
      }
    }
    // -- END DOUBLE CHECK --

    let arrPeserta = JSON.parse(JSON.stringify(daftarPeserta.value))
    const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
    const dNow = new Date()
    const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2)
    const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2)

    const processedPeserta = arrPeserta.map(p => {
      let finalJawaban = { ...p.jawaban }
      // Gabungkan kode negara
      for (const field of customFields.value) {
        if (field.type === 'phone_wa' && p['_cc_' + field.field_key]) {
          finalJawaban[field.field_key] = p['_cc_' + field.field_key] + (finalJawaban[field.field_key] || '')
        }
        if (field.type === 'domisili_api' && p['_lat_' + field.field_key]) {
          finalJawaban['lat'] = p['_lat_' + field.field_key]
          finalJawaban['lon'] = p['_lon_' + field.field_key]
        }
      }
      return {
        ...p,
        namaAnak: finalJawaban['nama_lengkap'] || p.jawaban['namaLengkap'] || 'Peserta',
        email: finalJawaban['email'] || '-',
        hp: finalJawaban['no_wa'] || '-',
        dataTambahanJSON: finalJawaban
      }
    })

    const payloadBackend = {
      event_id: eventData.value.id,
      kategori_id: arrPeserta[0].tiketId, // Di sini aslinya bernama tiketId
      peserta: processedPeserta.map((p, index) => {
        let randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
        return {
          nama_lengkap: p.namaAnak,
          email: p.email,
          no_wa: p.hp,
          ticket_id: `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`,
          data_tambahan: p.dataTambahanJSON
        }
      })
    }

    const checkoutRes = await $fetch('/api/checkout', {
      method: 'POST',
      body: payloadBackend
    })

    let isRedirecting = false
    if (checkoutRes.checkout_url) {
      isRedirecting = true
      window.location.href = checkoutRes.checkout_url
    } else {
      throw new Error('Gagal mendapatkan link pembayaran Kasera')
    }

  } catch (err) {
    console.error(err)
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Checkout Gagal', text: err.message, confirmButtonColor: '#E85D5E' })
    else alert('Checkout Gagal: ' + err.message)
  } finally {
    if (typeof isRedirecting === 'undefined' || !isRedirecting) {
      isSubmitting.value = false
      document.querySelector('.api-loader')?.classList.remove('active')
    }
  }
}

// --- LOGIKA UPLOAD & SUBMIT ---
const buktiBayarFile = ref(null)
const buktiBayarPreview = ref('')
const uploadError = ref(false)
const isSubmitting = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 5 * 1024 * 1024) {
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Ukuran Terlalu Besar', text: 'Maksimal 5 MB. Silakan kompres foto struk Anda.', confirmButtonColor: '#E85D5E' })
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
      console.error(e)
      showToastMsg('Gagal memproses gambar struk')
    }
  } else {
    buktiBayarFile.value = file
    buktiBayarPreview.value = URL.createObjectURL(file)
  }
}

const orderIdsGlobal = ref([])
const linkBuktiGlobal = ref('')
const transactionIdGlobal = ref('')

const submitData = async () => {
  const startTime = Date.now()
  if (grandTotal.value > 0 && !buktiBayarFile.value) {
    uploadError.value = true
    if (window.Swal) window.Swal.fire({ icon: 'warning', title: 'Struk Belum Ada', text: 'Harap upload foto struk transfer terlebih dahulu.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Harap upload foto struk transfer!')
    return
  }

  isSubmitting.value = true
  
  try {
    // -- DOUBLE CHECK KUOTA TIKET --
    if (tickets.value.length > 0 && !tickets.value[0].is_unlimited) {
      const { count, error: countErr } = await supabase
        .from('peserta')
        .select('*', { count: 'exact', head: true })
        .eq('kategori_id', tickets.value[0].id)
      
      if (!countErr && count !== null) {
        const sisaSekarang = tickets.value[0].kuota_maksimal - count
        if (sisaSekarang < daftarPeserta.value.length) {
          throw new Error(`Maaf, sisa kuota tiket ini hanya ${sisaSekarang > 0 ? sisaSekarang : 0}. Pesanan ditolak untuk mencegah oversold.`)
        }
      }
    }
    // -- END DOUBLE CHECK --

    // 0. Gabungkan kode negara (CC) dan nomor HP sebelum dikirim
    const processedPeserta = daftarPeserta.value.map(p => {
      let finalJawaban = { ...p.jawaban }
      for (const field of customFields.value) {
        if (field.type === 'phone_wa' && p['_cc_' + field.field_key]) {
          // Gabungkan +62 dan 812...
          finalJawaban[field.field_key] = p['_cc_' + field.field_key] + (finalJawaban[field.field_key] || '')
        }
        if (field.type === 'domisili_api' && p['_lat_' + field.field_key]) {
          finalJawaban['lat'] = p['_lat_' + field.field_key]
          finalJawaban['lon'] = p['_lon_' + field.field_key]
        }
      }
      return { ...p, jawaban: finalJawaban }
    })

    // 1. Siapkan payload untuk Google Script
    const arrPeserta = processedPeserta.map(p => {
      const { nama_lengkap, email, no_wa, domisili, ...dataTambahanJSON } = p.jawaban
      
      let emailVal = email
      let noWaVal = no_wa
      let namaLengkapVal = nama_lengkap
      
      for (const field of customFields.value) {
        if (field.type === 'email' && p.jawaban[field.field_key]) emailVal = p.jawaban[field.field_key]
        if (field.type === 'phone_wa' && p.jawaban[field.field_key]) noWaVal = p.jawaban[field.field_key]
        if (field.field_key === 'nama_lengkap' && p.jawaban[field.field_key]) namaLengkapVal = p.jawaban[field.field_key]
      }

      return {
        namaAnak: namaLengkapVal || "-",
        usia: "-",
        domisili: domisili || "-",
        followMunira: "Tidak",
        hp: noWaVal ? noWaVal.replace(/\D/g, '') : (no_wa ? no_wa.replace(/\D/g, '') : "-"),
        email: emailVal || "-",
        latitude: "",
        longitude: "",
        dataTambahanJSON: { ...dataTambahanJSON, infaqNominal: donasiAmount.value },
        kategori_id: p.tiketId,
        namaTiket: p.namaTiket
      }
    })

    const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
    const transactionId = `TRX-${prefixDynamic}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    transactionIdGlobal.value = transactionId
    
    const emailVal = arrPeserta[0]?.email || "-"
    
    // --- UPLOAD KE SUPABASE STORAGE ---
    let urlBukti = ""
    if (buktiBayarFile.value) {
      const ext = buktiBayarFile.value.name.split('.').pop()
      const pathBukti = `${eventData.value?.nama_event || 'Event'}/Bukti Transfer/${transactionId}.${ext}`
      const { error: err1 } = await supabase.storage.from('berkas').upload(pathBukti, buktiBayarFile.value)
      if (err1) throw new Error("Gagal mengupload Bukti Transfer: " + err1.message)
      urlBukti = supabase.storage.from('berkas').getPublicUrl(pathBukti).data.publicUrl
    }
    
    // Upload file custom dari form builder
    for (let p of arrPeserta) {
      for (let key in p.dataTambahanJSON) {
        if (p.dataTambahanJSON[key] instanceof File) {
          let file = p.dataTambahanJSON[key]
          let ext = file.name.split('.').pop()
          // Menggunakan 'key' (nama form) sebagai nama sub-folder
          let pathCustom = `${eventData.value?.nama_event || 'Event'}/${key}/${transactionId}_${p.namaAnak || 'Peserta'}.${ext}`
          const { error: err2 } = await supabase.storage.from('berkas').upload(pathCustom, file)
          if (err2) throw new Error("Gagal mengupload file: " + err2.message)
          // Timpa object File dengan URL public
          p.dataTambahanJSON[key] = supabase.storage.from('berkas').getPublicUrl(pathCustom).data.publicUrl
        }
      }
    }

    const dataPayload = {
      action: 'create_order',
      transactionId: transactionId,
      namaEvent: eventData.value?.nama_event || "Event Umum",
      peserta: arrPeserta,
      email: emailVal,
      infoDari: "-",
      kodeUnik: kodeUnik.value,
      infaqNominal: donasiAmount.value, 
      kodePrefix: eventData.value?.settings?.Kode_Prefix || "EVT"
    }

    // 2. Tembak API Nuxt Backend (Kirim Notif WA Fonnte)
    const res = await fetch('/api/create-order', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit', // Abaikan cookie agar backend tidak memverifikasi user (menghindari timeout Supabase)
      body: JSON.stringify(dataPayload) 
    })
    
    if (!res.ok) {
      throw new Error(`Pendaftaran tertunda (Error ${res.status}). Pastikan API tersedia.`)
    }
    
    const response = await res.json()

    // Lanjutkan walau notif WA gagal (atau bisa di-throw error jika wajib)
    if (response.status === 'success' || response.status === 'error') {
      linkBuktiGlobal.value = urlBukti // Gunakan URL dari Supabase
      
      // 3. Insert ke Supabase
      const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
      const dNow = new Date()
      const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2)
      const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2)

      const payloadSupabase = arrPeserta.map((p, index) => {
        let randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
        let ticketIdDynamic = `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`
        
        let finalDataTambahan = p.dataTambahanJSON
        
        finalDataTambahan.ticket_id = ticketIdDynamic
        finalDataTambahan.order_id = transactionId

        return {
          event_id: eventData.value.id,
          kategori_id: p.kategori_id,
          nama_lengkap: p.namaAnak,
          email: p.email,
          no_wa: p.hp,
          nama_tiket: p.namaTiket,
          bukti_bayar_url: linkBuktiGlobal.value,
          data_tambahan: finalDataTambahan,
          status_bayar: grandTotal.value === 0 ? 'paid' : 'pending'
        }
      })

      const { data: sbData, error: sbError } = await supabase
        .from('peserta')
        .insert(payloadSupabase)
        .select()

      if (sbError) throw sbError
      
      if (sbData && sbData.length > 0) {
        orderIdsGlobal.value = sbData.map(row => `${row.data_tambahan.ticket_id}-${row.id}`)
      }

      // Pastikan animasi printer selesai (animasi butuh 3.5 detik)
      const elapsed = Date.now() - startTime
      if (elapsed < 3500) {
        await new Promise(r => setTimeout(r, 3500 - elapsed))
      }

      // 4. Pindah ke halaman sukses atau tiket
      if (totalPrice.value === 0) {
        window.isRedirecting = true
        window.location.href = `/tiket/${transactionIdGlobal.value}`
      } else {
        currentStep.value = 'sukses'
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      
    } else {
      throw new Error(response.message || 'Gagal memproses pendaftaran')
    }
  } catch (err) {
    console.error(err)
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Gagal', text: err.message, confirmButtonColor: '#E85D5E' })
    else showToastMsg('Gagal: ' + err.message)
  } finally {
    if (!window.isRedirecting) {
      isSubmitting.value = false
    }
  }
}

const kirimWA = () => {
  let noAdmin = organizerProfile.value?.no_wa || "62800000000"
  noAdmin = noAdmin.replace(/\D/g, '')
  if (noAdmin.startsWith('0')) noAdmin = '62' + noAdmin.substring(1)
  
  const domain = window.location.origin
  
  let rawText = ''
  if (grandTotal.value === 0) {
    rawText = `Hai Admin,\nSaya sudah mendaftar untuk acara *${eventData.value?.nama_event || 'Event'}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${transactionIdGlobal.value}\n\nTerima kasih! 🙏`
  } else {
    rawText = `Hai Admin,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${eventData.value?.nama_event || 'Event'}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${transactionIdGlobal.value}\n\nSaya akan cek link tersebut secara berkala sampai dikonfirmasi. Terima kasih! 🙏`
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

onMounted(async () => {
  try {
    const { data: evData, error: evErr } = await supabase.from('event').select('id, nama_event, poster_url, tanggal_mulai, lokasi, deskripsi, organizer_id, settings').eq('slug', slug).single()
    if (evErr) throw evErr
    eventData.value = evData

    if (evData.organizer_id) {
      const { data: orgData } = await supabase.from('organizer_profile').select('nama_organizer, no_wa, link_ig, link_web').eq('id', evData.organizer_id).maybeSingle()
      if (orgData) organizerProfile.value = orgData
    }

    let tktQuery = supabase.from('kategori_tiket')
      .select('id, nama_kategori, harga, kuota_maksimal')
      .eq('event_id', evData.id)
      .eq('is_active', true)

    if (route.query.secret && typeof route.query.secret === 'string') {
      tktQuery = tktQuery.or(`is_hidden.eq.false,secret_token.eq.${route.query.secret}`)
    } else {
      tktQuery = tktQuery.eq('is_hidden', false)
    }

    const { data: tktData, error: tktErr } = await tktQuery
    if (tktErr) throw tktErr

    const { data: pesertaData } = await supabase.from('peserta').select('kategori_id').eq('event_id', evData.id)

    if (tktData && pesertaData) {
      tickets.value = tktData.map(t => {
        const terjual = pesertaData.filter(p => p.kategori_id === t.id).length
        const isUnlimited = t.kuota_maksimal == 0
        const sisa = isUnlimited ? 999999 : t.kuota_maksimal - terjual
        return { ...t, is_unlimited: isUnlimited, sisa_kuota: sisa < 0 ? 0 : sisa }
      })
    } else if (tktData) {
      tickets.value = tktData
    }
  } catch (err) {
    error.value = "Gagal memuat event dari sistem. Silakan periksa URL Anda."
    console.error(err)
  } finally {
    loading.value = false
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
  overflow: hidden; 
  position: relative; 
  margin: 40px auto;
  min-height: 100vh;
}
.step-content { opacity: 1; padding: 24px 20px; }
.glass { background: white; border-radius: 16px; padding: 2rem 1.5rem; text-align: center; position: relative; overflow: hidden; border: none; }

@media (max-width: 480px) {
  .container {
    margin: 0 auto;
    border-radius: 0;
    border: none;
    box-shadow: none;
    min-height: 100vh;
  }
  .step-content { padding: 20px 16px; }
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent-main) !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
  outline: none;
}


/* =========================================
   CSS ANIMASI PRINTER
   ========================================= */
.api-loader { 
  position: fixed; 
  inset: 0; 
  background: rgba(15, 23, 42, 0.95); 
  backdrop-filter: blur(8px); 
  z-index: 99999; 
  display: none; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
}

.api-loader::before { 
  content: ''; 
  position: absolute; 
  inset: 0; 
  opacity: 0.1; 
  pointer-events: none; 
  background-image: radial-gradient(circle, #fff 1px, transparent 1px); 
  background-size: 40px 40px; 
}

.api-loader.active { display: flex; }

.printer-wrapper { 
  position: relative; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  height: 330px; 
}

.printer-slot { width: 320px; height: 32px; background: #1E293B; border: 4px solid #0F172A; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); position: relative; z-index: 30; display: flex; justify-content: center; align-items: center; }
.printer-slot-inner { width: 85%; height: 100%; background: #020617; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; border-radius: 4px; }
.printer-slot-light { width: 90%; height: 4px; background: var(--accent-main); box-shadow: 0 0 10px var(--accent-main); opacity: 0.8; border-radius: 2px; }

@keyframes viberateMotor { 0% { transform: translate(1px, 0); } 100% { transform: translate(-1px, 0.5px); } }
.api-loader.active .printer-slot { animation: viberateMotor 0.1s infinite alternate; }

@keyframes cetakKertas { 0% { height: 0px; } 100% { height: 280px; } }
.printer-mask { width: 250px; height: 0px; overflow: hidden; position: relative; top: -6px; z-index: 5; display: flex; justify-content: center; }
.api-loader.active .printer-mask { animation: cetakKertas 3.5s linear forwards; }

.ticket-paper-output { width: 100%; height: 280px; background: white; border-left: 4px solid var(--primary); border-right: 4px solid var(--primary); border-bottom: 4px solid var(--primary); padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; position: relative; padding-bottom: 40px; }
.ticket-paper-output::after { content: ''; position: absolute; bottom: -12px; left: -4px; width: calc(100% + 8px); height: 16px; background-repeat: repeat-x; background-image: linear-gradient(135deg, white 25%, transparent 25%), linear-gradient(225deg, white 25%, transparent 25%); background-size: 16px 16px; z-index: 10; }

.fake-barcode-area { margin-top: 24px; width: 100%; height: 48px; background: white; display: flex; gap: 2px; align-items: flex-end; justify-content: center; }
.fake-barcode-area div { height: 100%; background: var(--primary); }

.loading-badge { position: absolute; bottom: 40px; background: var(--card-light); color: var(--text-main); padding: 12px 32px; border-radius: 9999px; font-weight: 900; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); font-size: 1rem; letter-spacing: 1px; z-index: 40; border: 3px solid var(--border-soft); }
.loading-dot { width: 12px; height: 12px; background: var(--accent-main); border-radius: 50%; animation: pulseIcon 1.5s infinite; }
@keyframes pulseIcon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes scaleIn { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }

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

.step-home { padding: 6px; }
.glass-home { margin-top: 0px; padding: 1rem 1rem 0.5rem 1rem; }

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
  color: white;
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
  font-size: 0.65rem;
  font-weight: 600;
  opacity: 0.9;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
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
}
.social-text {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
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
  font-size: 0.7rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 10px;
  white-space: pre-wrap;
}
.snk-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
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
  color: white;
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




















/* Donasi Form (Matching ParticipantForm) */
.donasi-form-card {
  margin-top: 15px;
  margin-bottom: 25px;
  transition: opacity 0.3s;
}
.donasi-dim {
  opacity: 0.6;
}
.donasi-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.donasi-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
}
.donasi-svg {
  width: 16px;
  height: 16px;
}
.donasi-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 4px 0 12px 24px;
}
.donasi-form-body {
  margin-left: 24px;
  margin-top: 10px;
}
.donasi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.form-chip {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  background: var(--bg-light);
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.form-chip:hover {
  background: #f1f5f9;
}
.form-chip-active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}
.form-input-group {
  display: flex;
  align-items: center;
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  overflow: hidden;
  max-width: 250px;
}
.form-input-prefix {
  padding: 10px 12px;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 700;
  font-size: 0.85rem;
  border-right: 1px solid var(--border-soft);
}
.donasi-input {
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Small Switch Toggle */
.switch-small {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.switch-small input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-small .slider-small {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.switch-small .slider-small:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}
.switch-small input:checked + .slider-small {
  background-color: var(--primary);
}
.switch-small input:checked + .slider-small:before {
  transform: translateX(16px);
}
.switch-small .slider-small.round-small {
  border-radius: 20px;
}
.switch-small .slider-small.round-small:before {
  border-radius: 50%;
}

</style>
