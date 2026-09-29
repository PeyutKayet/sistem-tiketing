<template>
  <div>
    <!-- Total Tagihan dengan Rincian -->
    <div class="billing-card">
      <small class="billing-header">Total Tagihan</small>
      
      <div class="billing-total-row">
        <h2 class="billing-total-amount">{{ formatPrice(grandTotal) }}</h2>
        <button @click="copyNominal" class="btn-copy" title="Salin Nominal">
           <svg class="icon-copy" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>

      <div class="billing-details">
        <div class="billing-detail-item">
          <span>Tiket ({{ totalQty }}x)</span>
          <span>{{ formatPrice(totalPrice) }}</span>
        </div>
        <div v-if="donasiAmount > 0" class="billing-detail-subitem" style="color: var(--text-main); font-weight: 600; opacity: 1;">
          <span>Infaq / Donasi</span>
          <span>+{{ formatPrice(donasiAmount) }}</span>
        </div>
        <div class="billing-detail-subitem">
          <span>Biaya Layanan</span>
          <span>{{ formatPrice(adminFee) }}</span>
        </div>
        <div class="billing-detail-subitem">
          <span>Kode Unik</span>
          <span>+{{ kodeUnik }}</span>
        </div>
      </div>
    </div>

    <!-- Kotak QRIS -->
    <div class="qris-card">
      <p class="qris-title">SCAN QRIS UNTUK MEMBAYAR</p>
      
            <!-- Gambar QRIS Diperkecil -->
      <img loading="lazy" src="/qris.webp" alt="QRIS Pembayaran" class="qris-image" />
      
      <a href="/qris.webp" download="QRIS_Pembayaran.webp" class="btn-download-qris">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download QRIS
      </a>

      
      <div class="qris-warning">
        <p class="warning-title">⚠️ PASTIKAN NOMINAL SESUAI</p>
        <p class="warning-desc">Termasuk 3 digit kode unik di belakang</p>
      </div>
    </div>

    <!-- Upload Bukti -->
    <div class="upload-section">
      <label class="upload-label">Upload Bukti Pembayaran <span class="required-mark">*</span></label>
      
      <div class="upload-box" :class="{ 'error-shake': uploadError }">
        
        <div v-if="!buktiBayarPreview" class="upload-placeholder">
          <p class="upload-placeholder-title">Klik untuk pilih foto struk</p>
          <p class="upload-placeholder-desc">Format JPG/PNG • Maks. 5MB</p>
        </div>
        
        <img v-else :src="buktiBayarPreview" alt="Preview Bukti" class="upload-preview-image">
        
        <input type="file" accept="image/*" @change="$emit('file-upload', $event)" class="upload-input">
      </div>
    </div>

    <div class="action-buttons">
      <button @click="$emit('back')" class="btn btn-secondary">KEMBALI</button>
      <button @click="$emit('submit')" :disabled="isSubmitting" class="btn btn-primary" :class="{ 'btn-loading': isSubmitting }">
        {{ isSubmitting ? 'MEMPROSES...' : 'DAFTAR SEKARANG ✔️' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  grandTotal: { type: Number, required: true },
  totalQty: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  adminFee: { type: Number, required: true },
  kodeUnik: { type: Number, required: true },
  donasiAmount: { type: Number, default: 0 },
  buktiBayarPreview: { type: String, default: '' },
  uploadError: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false }
})

const emit = defineEmits(['file-upload', 'back', 'submit', 'toast'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

const copyNominal = async () => {
  try {
    await navigator.clipboard.writeText(props.grandTotal.toString())
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Swal) {
      // @ts-ignore
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil Disalin!',
        text: `Nominal Rp ${props.grandTotal.toLocaleString('id-ID')} telah disalin.`,
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      emit('toast', 'Nominal berhasil disalin!', 'success')
    }
  } catch (err) {
    emit('toast', 'Gagal menyalin nominal', 'error')
  }
}
</script>

<style scoped>
/* Billing Card */
.billing-card {
  background: var(--bg-light);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}
.billing-header {
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-align: center;
  display: block;
}
.billing-total-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 8px 0 15px;
}
.billing-total-amount {
  color: var(--text-main);
  margin: 0;
  font-size: 1.8rem;
  font-weight: 900;
}
.btn-copy {
  background: white;
  border: 1px solid var(--border-soft);
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.icon-copy {
  width: 16px;
  height: 16px;
}
.billing-details {
  border-top: 1px dashed var(--border-soft);
  padding-top: 12px;
}
.billing-detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.billing-detail-subitem {
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  color: var(--text-muted);
  opacity: 0.8;
  margin-bottom: 3px;
}

/* QRIS Card */
.qris-card {
  background: var(--card-light);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 15px 20px;
  text-align: center;
  margin-bottom: 15px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qris-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 10px;
  letter-spacing: 0.5px;
}
.qris-image {
  width: 100%;
  max-width: 150px;
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  margin-bottom: 10px;
  box-shadow: var(--shadow-sm);
}
.qris-warning {
  background: #FFFBEB;
  border: 1px dashed #FCD34D;
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
}
.warning-title {
  font-size: 0.7rem;
  color: #D97706;
  margin: 0;
  font-weight: 800;
}
.warning-desc {
  font-size: 0.65rem;
  color: var(--text-main);
  margin: 4px 0 0;
  font-weight: 600;
}

/* Upload Section */
.upload-section {
  margin-bottom: 12px;
}
.upload-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}
.required-mark {
  color: #ef4444;
}
.upload-box {
  border: 2px dashed var(--border-soft);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: var(--bg-light);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.error-shake {
  border-color: #ef4444;
  background: #fef2f2;
}
.upload-placeholder {
  pointer-events: none;
}
.upload-placeholder-title {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.upload-placeholder-desc {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}
.upload-preview-image {
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}
.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}
.btn {
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
  background: #10b981;
  color: white;
}
.btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-download-qris {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-download-qris:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}
.icon-download {
  width: 14px;
  height: 14px;
}

</style>
