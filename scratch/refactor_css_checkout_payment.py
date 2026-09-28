new_content = """<template>
  <div>
    <h3 class="section-title">Rincian Pembayaran</h3>

    <!-- Summary Box -->
    <div class="summary-box">
      <div class="summary-item">
        <span class="summary-label">Tiket ({{ totalQty }}x)</span>
        <span class="summary-value">{{ formatPrice(totalPrice) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Biaya Layanan</span>
        <span class="summary-value">{{ formatPrice(adminFee) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Kode Unik</span>
        <span class="summary-value">+{{ kodeUnik }}</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-total">
        <span class="summary-label-total">Total Tagihan</span>
        <span class="summary-value-total">{{ formatPrice(grandTotal) }}</span>
      </div>
    </div>

    <!-- Payment Instruction Box -->
    <div class="payment-instruction">
      <div class="instruction-header">
        <svg class="instruction-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="instruction-title">Penting</span>
      </div>
      <p class="instruction-text">
        Pastikan transfer sesuai hingga <b>3 DIGIT TERAKHIR</b> (Rp {{ formatPrice(grandTotal).replace('Rp', '').trim() }}) untuk mempercepat verifikasi otomatis.
      </p>
    </div>

    <!-- Rekening / QRIS Info -->
    <div class="account-box">
      <div class="account-header">Bank Transfer / QRIS</div>
      
      <div class="account-detail">
        <span class="account-label">Bank</span>
        <span class="account-value">BSI (Bank Syariah Indonesia)</span>
      </div>
      <div class="account-detail">
        <span class="account-label">No. Rekening</span>
        <div class="account-value-copy">
          <b>7288636154</b>
          <button @click="copyRekening" class="copy-btn">
            Salin
          </button>
        </div>
      </div>
      <div class="account-detail">
        <span class="account-label">Atas Nama</span>
        <span class="account-value">PT Sinergi Pagi Nusantara</span>
      </div>
    </div>

    <!-- Upload Bukti Transfer -->
    <div class="upload-section">
      <span class="upload-label">Upload Bukti Transfer <span class="required-mark">*</span></span>
      <div class="upload-box" :class="{ 'upload-error': uploadError }">
        <input type="file" @change="$emit('file-upload', $event)" accept="image/*" class="upload-input" id="buktiBayar" />
        <label for="buktiBayar" class="upload-area">
          <div v-if="buktiBayarPreview" class="upload-preview-container">
            <img :src="buktiBayarPreview" alt="Preview Bukti" class="upload-preview-image" />
            <div class="upload-change-overlay">Ganti Foto</div>
          </div>
          <div v-else class="upload-placeholder">
            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <div class="upload-instruction">Klik untuk upload struk</div>
            <div class="upload-hint">Format JPG/PNG (Maks 5MB)</div>
          </div>
        </label>
      </div>
    </div>

    <!-- Actions -->
    <div class="action-buttons">
      <button @click="$emit('back')" class="btn btn-secondary">KEMBALI</button>
      <button @click="$emit('submit')" :disabled="isSubmitting" class="btn btn-primary" :class="{ 'btn-loading': isSubmitting }">
        {{ isSubmitting ? 'MEMPROSES...' : 'SAYA SUDAH TRANSFER ➔' }}
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
  buktiBayarPreview: { type: String, default: '' },
  uploadError: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false }
})

const emit = defineEmits(['file-upload', 'back', 'submit', 'toast'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

const copyRekening = async () => {
  try {
    await navigator.clipboard.writeText('7288636154')
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Swal) {
      // @ts-ignore
      window.Swal.fire({
        icon: 'success',
        title: 'Tersalin!',
        text: 'Nomor rekening berhasil disalin.',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      emit('toast', 'Rekening berhasil disalin!', 'success')
    }
  } catch (err) {
    emit('toast', 'Gagal menyalin rekening', 'error')
  }
}
</script>

<style scoped>
.section-title {
  margin-top: 0;
  text-align: center;
  color: var(--text-main);
  margin-bottom: 1.5rem;
}

/* Summary Box */
.summary-box {
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.summary-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.summary-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}
.summary-divider {
  height: 1px;
  background: var(--border-soft);
  margin: 10px 0;
}
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-label-total {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.summary-value-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
}

/* Payment Instruction */
.payment-instruction {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
}
.instruction-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1d4ed8;
  margin-bottom: 4px;
}
.instruction-icon {
  width: 18px;
  height: 18px;
}
.instruction-title {
  font-size: 0.8rem;
  font-weight: 800;
}
.instruction-text {
  margin: 0;
  font-size: 0.75rem;
  color: #1e3a8a;
  line-height: 1.4;
}

/* Account Box */
.account-box {
  background: white;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}
.account-header {
  background: var(--bg-light);
  padding: 10px 15px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-soft);
  text-transform: uppercase;
}
.account-detail {
  padding: 12px 15px;
  border-bottom: 1px dashed var(--border-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.account-detail:last-child {
  border-bottom: none;
}
.account-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.account-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  text-align: right;
}
.account-value-copy {
  display: flex;
  align-items: center;
  gap: 8px;
}
.copy-btn {
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
}

/* Upload Section */
.upload-section {
  text-align: left;
  margin-bottom: 20px;
}
.upload-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.required-mark {
  color: #ef4444;
}
.upload-box {
  position: relative;
  background: var(--bg-light);
  border: 2px dashed var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: 0.2s;
}
.upload-error {
  border-color: #ef4444;
  background: #fef2f2;
}
.upload-input {
  display: none;
}
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  cursor: pointer;
  width: 100%;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.upload-icon {
  width: 32px;
  height: 32px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.upload-instruction {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}
.upload-hint {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
}
.upload-preview-container {
  width: 100%;
  position: relative;
}
.upload-preview-image {
  width: 100%;
  display: block;
  object-fit: contain;
  max-height: 250px;
}
.upload-change-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,0.6);
  color: white;
  text-align: center;
  padding: 8px 0;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 8px;
}
.btn {
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s;
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
.btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
"""

with open('app/components/event/CheckoutPayment.vue', 'w') as f:
    f.write(new_content)
