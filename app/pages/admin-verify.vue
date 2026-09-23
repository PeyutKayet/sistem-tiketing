<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <!-- State: Loading -->
      <div v-if="loading && !orderData" class="state-box loading">
        <div class="spinner"></div>
        <p>Memuat Data Pesanan...</p>
      </div>
      
      <!-- State: Error -->
      <div v-else-if="error" class="state-box error">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p>{{ error }}</p>
      </div>
      
      <!-- State: Data Ready -->
      <div v-else-if="orderData" class="content-box">
        <div class="header-section">
          <div class="badge-admin">MODE ADMIN</div>
          <h2 class="title">Verifikasi Pesanan</h2>
          <p class="trx-id">{{ orderData.idPesanan }}</p>
        </div>

        <div class="image-section">
          <img v-if="buktiUrl" :src="buktiUrl" class="img-preview" alt="Bukti Transfer" @error="handleImgError">
          <div v-else class="img-preview empty">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p>Bukti transfer tidak diunggah</p>
          </div>
          <a v-if="showManualLink" :href="orderData.linkBukti" target="_blank" class="manual-link">
            Buka Foto Manual ➔
          </a>
        </div>

        <div class="receipt-box">
          <div class="receipt-row">
            <span class="lbl">Nama Pendaftar</span> 
            <span class="val">{{ orderData.namaSiswa }}</span>
          </div>
          <div class="receipt-row">
            <span class="lbl">Event</span> 
            <span class="val">{{ orderData.kelas }}</span>
          </div>
          <div class="receipt-row">
            <span class="lbl">Kategori Tiket</span> 
            <span class="val badge-ticket">{{ orderData.paket }}</span>
          </div>
          <div class="receipt-row">
            <span class="lbl">Waktu Pemesanan</span> 
            <span class="val date-text">{{ orderData.waktu }}</span>
          </div>
          <div class="receipt-row total">
            <span class="lbl">Total Transfer</span> 
            <span class="val amount">{{ formatPrice(orderData.totalBayar) }}</span>
          </div>
        </div>
        
        <div class="status-section">
          <span class="lbl">Status Pembayaran:</span>
          <div class="status-pill" :class="isPaid ? 'paid' : 'pending'">
            <svg v-if="isPaid" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <svg v-else fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {{ orderData.status }}
          </div>
        </div>

        <button @click="konfirmasiPesanan" :disabled="isPaid || isSubmitting" class="btn-confirm" :class="{ 'btn-success': isPaid }">
          <span v-if="isPaid">Pesanan Sudah Dikonfirmasi</span>
          <span v-else-if="isSubmitting">Memproses...</span>
          <span v-else>KONFIRMASI PEMBAYARAN</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.query.id

const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const orderData = ref(null)
const showManualLink = ref(false)

const buktiUrl = computed(() => {
  return orderData.value?.linkBukti || null
})

const isPaid = computed(() => orderData.value?.status?.toLowerCase() === 'paid')

const handleImgError = (e) => {
  e.target.src = "https://via.placeholder.com/400x300.png?text=Pratinjau+Diblokir+Browser"
  showManualLink.value = true
}

const formatPrice = (price) => {
  if (!price) return 'Rp 0'
  const p = typeof price === 'string' ? parseInt(price.toString().replace(/\D/g, '')) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p || 0)
}

const supabase = useSupabaseClient()

const loadData = async () => {
  if (!orderId) {
    error.value = "Akses ditolak. ID Pesanan tidak valid."
    loading.value = false
    return
  }
  
  try {
    const { data: pesertaData, error: sbErr } = await supabase
      .from('peserta')
      .select('*, event(nama_event)')
      .eq('data_tambahan->>order_id', orderId)
      .limit(1)
      .single()

    if (sbErr) {
      error.value = "Pesanan tidak ditemukan di database."
    } else if (pesertaData) {
      orderData.value = {
        idPesanan: orderId,
        namaSiswa: pesertaData.nama_lengkap,
        kelas: pesertaData.event?.nama_event || 'Event',
        paket: pesertaData.nama_tiket || '-',
        waktu: new Date(pesertaData.created_at).toLocaleString('id-ID'),
        totalBayar: pesertaData.data_tambahan?.infaqNominal || 0,
        status: pesertaData.status_bayar === 'paid' ? 'Paid' : 'Pending',
        linkBukti: pesertaData.bukti_bayar_url,
        email: pesertaData.email
      }
    }
  } catch (err) {
    console.error(err)
    error.value = "Terjadi kesalahan jaringan."
  } finally {
    loading.value = false
  }
}

const konfirmasiPesanan = async () => {
  isSubmitting.value = true
  try {
    const { error: updateErr } = await supabase
      .from('peserta')
      .update({ status_bayar: 'paid' })
      .eq('data_tambahan->>order_id', orderId)

    if (updateErr) throw updateErr
    
    if (window.Swal) {
      window.Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Pembayaran dikonfirmasi. Barcode E-Ticket telah aktif.', confirmButtonColor: '#10B981' })
    } else {
      alert("Berhasil! Pembayaran dikonfirmasi.")
    }
    
    orderData.value.status = "Paid"
  } catch (err) {
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Gagal', text: 'Jaringan terputus.', confirmButtonColor: '#EF4444' })
    else alert("Jaringan terputus.")
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
</style>

<style scoped>
.admin-wrapper {
  --primary: #0F172A;
  --accent: #2563EB;
  --bg-color: #F8FAFC;
  --text-main: #1E293B;
  --text-muted: #64748B;
  --border-soft: #E2E8F0;
  
  font-family: 'Nunito', sans-serif;
  background-color: var(--bg-color);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 15px;
}

.admin-container { 
  width: 100%; 
  max-width: 480px; 
}

.state-box {
  background: white;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
  border: 1px solid var(--border-soft);
}
.state-box.loading p { color: var(--text-muted); font-weight: 700; margin-top: 15px; }
.state-box.error p { color: #ef4444; font-weight: 700; margin-top: 15px; }
.state-box.error svg { width: 48px; height: 48px; color: #ef4444; margin: 0 auto; }
.spinner { width: 36px; height: 36px; border: 4px solid var(--border-soft); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.content-box {
  background: white;
  border-radius: 24px;
  padding: 30px 24px;
  box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.1);
  border: 1px solid var(--border-soft);
}

.header-section { text-align: center; margin-bottom: 25px; }
.badge-admin { display: inline-block; background: #FEF3C7; color: #D97706; font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 10px; }
.title { color: var(--primary); font-weight: 900; font-size: 1.6rem; margin: 0 0 4px; letter-spacing: -0.5px; }
.trx-id { color: var(--text-muted); font-size: 0.85rem; font-weight: 700; font-family: monospace; letter-spacing: 0.5px; margin: 0; background: var(--bg-color); display: inline-block; padding: 4px 12px; border-radius: 6px; border: 1px solid var(--border-soft); }

.image-section { margin-bottom: 25px; text-align: center; }
.img-preview { width: 100%; height: auto; max-height: 400px; object-fit: contain; border-radius: 16px; border: 2px solid var(--border-soft); background: var(--bg-color); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.img-preview.empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; color: var(--text-muted); }
.img-preview.empty svg { width: 40px; height: 40px; margin-bottom: 10px; opacity: 0.5; }
.img-preview.empty p { margin: 0; font-size: 0.85rem; font-weight: 600; }
.manual-link { display: inline-block; margin-top: 10px; color: var(--accent); font-weight: 700; font-size: 0.8rem; text-decoration: none; padding: 6px 12px; background: #eff6ff; border-radius: 8px; }

.receipt-box { background: var(--bg-color); border: 1px dashed #CBD5E1; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
.receipt-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.85rem; }
.receipt-row:last-child { margin-bottom: 0; }
.receipt-row.total { border-top: 1px dashed #CBD5E1; padding-top: 12px; margin-top: 12px; align-items: flex-end; }
.lbl { color: var(--text-muted); font-weight: 600; }
.val { color: var(--text-main); font-weight: 800; text-align: right; max-width: 60%; word-break: break-word; }
.badge-ticket { background: #E0E7FF; color: #4338CA; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
.date-text { font-size: 0.75rem; color: var(--text-muted); }
.amount { color: var(--primary); font-size: 1.4rem; font-weight: 900; line-height: 1; }

.status-section { display: flex; justify-content: space-between; align-items: center; background: white; border: 1px solid var(--border-soft); border-radius: 12px; padding: 12px 16px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.status-pill { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
.status-pill.pending { background: #FEF9C3; color: #CA8A04; }
.status-pill.pending svg { width: 14px; height: 14px; }
.status-pill.paid { background: #DCFCE7; color: #16A34A; }
.status-pill.paid svg { width: 16px; height: 16px; }

.btn-confirm { width: 100%; padding: 16px; border-radius: 14px; font-size: 0.9rem; font-weight: 800; border: none; cursor: pointer; transition: 0.2s; color: white; background: var(--accent); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); letter-spacing: 0.5px; }
.btn-confirm:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35); }
.btn-confirm:disabled { cursor: not-allowed; opacity: 0.7; transform: none; }
.btn-confirm.btn-success { background: #10B981; box-shadow: none; pointer-events: none; }
</style>
