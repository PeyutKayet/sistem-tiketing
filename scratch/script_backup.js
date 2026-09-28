<script setup>
import { ref, onMounted, computed } from 'vue'
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

const handlePhoneInput = (peserta, fieldKey) => {
  let val = peserta.jawaban[fieldKey] || ''
  // Hapus semua selain angka
  val = val.replace(/\D/g, '')
  // Hapus 0 atau 62 di depan karena sudah ada di kotak country code
  if (val.startsWith('0')) {
    val = val.substring(1)
  } else if (val.startsWith('62')) {
    val = val.substring(2)
  }
  peserta.jawaban[fieldKey] = val
}

const handleCustomUpload = async (event, peserta, fieldKey) => {
  const file = event.target.files[0]
  if (!file) {
    peserta.jawaban[fieldKey] = null
    return
  }
  
  if (file.type.startsWith('image/')) {
    try {
      const compressedFile = await compressImageFile(file, 800, 0.6) // Maks 800px, kualitas 60% (~50-100KB)
      peserta.jawaban[fieldKey] = compressedFile
    } catch (e) {
      console.error('Compression error', e)
      showToastMsg('Gagal mengompres gambar')
    }
  } else {
    // Jika bukan gambar (misal PDF), batasi maksimal 3MB
    if (file.size > 3 * 1024 * 1024) {
      if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Terlalu Besar', text: 'Ukuran PDF maksimal 3MB', confirmButtonColor: '#E85D5E' })
      else showToastMsg('Ukuran PDF maksimal 3MB')
      event.target.value = ''
      return
    }
    peserta.jawaban[fieldKey] = file
  }
}

// Fungsi kompresi gambar mengembalikan objek File
const compressImageFile = (file, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = event => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas to Blob failed'))
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' })
          resolve(newFile)
        }, 'image/jpeg', quality)
      }
      img.onerror = error => reject(error)
    }
    reader.onerror = error => reject(error)
  })
}



// --- STATE KERANJANG TIKET & UI ---
const keranjang = ref({})
const currentStep = ref('home')
const isSetujuSnk = ref(false)
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

const totalQty = computed(() => {
  return Object.values(keranjang.value).reduce((sum, qty) => sum + qty, 0)
})

const totalPrice = computed(() => {
  let total = 0
  for (const id in keranjang.value) {
    const qty = keranjang.value[id]
    const tiket = tickets.value.find(t => String(t.id) === String(id))
    if (tiket && qty > 0) {
      total += (qty * tiket.harga)
    }
  }
  return total
})

const kodeUnik = ref(0)
onMounted(() => {
  kodeUnik.value = Math.floor(Math.random() * 399) + 101
})

const adminFee = 2000

const grandTotal = computed(() => {
  if (totalPrice.value === 0) return 0
  return totalPrice.value + adminFee + kodeUnik.value
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

// --- FORMAT LINK WA ---
const formatWaLink = (noWa) => {
  if (!noWa || noWa === '62800000000') return '#'
  let noWaBersih = String(noWa).replace(/\D/g, '')
  if (noWaBersih.startsWith('0')) noWaBersih = '62' + noWaBersih.substring(1)
  return `https://wa.me/${noWaBersih}`
}

const updateKeranjang = (tiketId, change, sisaKuota) => {
  let currentQty = keranjang.value[tiketId] || 0
  let newQty = currentQty + change

  if (newQty < 0) newQty = 0
  if (newQty > sisaKuota) {
    if (window.Swal) {
      window.Swal.fire({ icon: 'warning', title: 'Kuota Terbatas', text: `Sisa tiket hanya ${sisaKuota}.`, confirmButtonColor: '#0C387A' })
    } else {
      showToastMsg(`Sisa tiket hanya ${sisaKuota}.`)
    }
    newQty = sisaKuota
  }

  keranjang.value[tiketId] = newQty
}

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

const copyNominal = async () => {
  try {
    await navigator.clipboard.writeText(grandTotal.value.toString())
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil Disalin!',
        text: `Nominal Rp ${grandTotal.value.toLocaleString('id-ID')} telah disalin.`,
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      showToastMsg('Nominal berhasil disalin!')
    }
  } catch (err) {
    showToastMsg('Gagal menyalin nominal')
  }
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
  
  if (isValid) {
    if (totalPrice.value === 0) {
      // Tiket Gratis! Langsung eksekusi submit tanpa perlu langkah pembayaran
      submitData()
    } else if (eventData.value?.settings?.is_kasera_active) {
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

    if (checkoutRes.checkout_url) {
      window.location.href = checkoutRes.checkout_url
    } else {
      throw new Error('Gagal mendapatkan link pembayaran Kasera')
    }

  } catch (err) {
    console.error(err)
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Checkout Gagal', text: err.message, confirmButtonColor: '#E85D5E' })
    else alert('Checkout Gagal: ' + err.message)
  } finally {
    isSubmitting.value = false
    document.querySelector('.api-loader')?.classList.remove('active')
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
  if (totalPrice.value > 0 && !buktiBayarFile.value) {
    uploadError.value = true
    if (window.Swal) window.Swal.fire({ icon: 'warning', title: 'Struk Belum Ada', text: 'Harap upload foto struk transfer terlebih dahulu.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Harap upload foto struk transfer!')
    return
  }

  isSubmitting.value = true
  
  try {
    // 0. Gabungkan kode negara (CC) dan nomor HP sebelum dikirim
    const processedPeserta = daftarPeserta.value.map(p => {
      let finalJawaban = { ...p.jawaban }
      for (const field of customFields.value) {
        if (field.type === 'phone_wa' && p['_cc_' + field.field_key]) {
          // Gabungkan +62 dan 812...
          finalJawaban[field.field_key] = p['_cc_' + field.field_key] + (finalJawaban[field.field_key] || '')
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
        dataTambahanJSON: { ...dataTambahanJSON, infaqNominal: grandTotal.value },
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
      infaqNominal: grandTotal.value, 
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
          status_bayar: 'pending'
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

      // 4. Pindah ke halaman sukses
      currentStep.value = 'sukses'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } else {
      throw new Error(response.message || 'Gagal memproses pendaftaran')
    }
  } catch (err) {
    console.error(err)
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Gagal', text: err.message, confirmButtonColor: '#E85D5E' })
    else showToastMsg('Gagal: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const kirimWA = () => {
  const noAdmin = organizerProfile.value?.no_wa || "62800000000"
  const domain = window.location.origin
  
  const rawText = `Hai Admin,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${eventData.value?.nama_event || 'Event'}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${transactionIdGlobal.value}\n\nSaya akan cek link tersebut secara berkala sampai dikonfirmasi. Terima kasih! 🙏`
  
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
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
</style>
