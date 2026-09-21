<template>
  <div class="hp">
    <div class="screen" style="background: #f8fafc;">
      <!-- Status bar -->
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #8a9aa8; padding-bottom: 4px; border-bottom: 1px solid #f0f4fa; margin-bottom: 6px;">
        <span style="display:flex; gap:4px; align-items:center;"><Icon name="lucide:battery-medium" style="font-size:12px;" /> <Icon name="lucide:signal" style="font-size:12px;" /></span>
        <span style="font-weight:600;">12:30</span>
      </div>
      
      <!-- Brand tag -->
      <div style="display:flex; justify-content:center; margin-bottom:12px;">
        <span style="background:#eef3f9; color:var(--primary); padding:4px 12px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:0.5px; display:flex; align-items:center; gap:4px;">
          <Icon name="lucide:ticket" style="font-size:10px;" /> EVENTHUB
        </span>
      </div>
      
      <!-- Event Card -->
      <div style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); margin-bottom:12px; border:1px solid #e6edf5;">
        <div style="height:120px; border-radius:10px; margin-bottom:12px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; font-size: 28px; color:white; overflow:hidden;" 
             :style="formEvent.poster_preview ? { backgroundImage: `url('${formEvent.poster_preview}')` } : { background: 'linear-gradient(145deg, var(--primary), #3b82f6)' }">
          <Icon v-if="!formEvent.poster_preview" name="lucide:image" style="opacity: 0.5; font-size: 32px;" />
        </div>
        <div style="font-size:16px; font-weight:800; text-align:center; color:#0a1929; letter-spacing:-0.3px;">{{ formEvent.nama || 'Event Baru' }}</div>
        <div style="font-size:10px; color:#1a6a4a; background:#e4f0e8; padding:4px 8px; border-radius:6px; text-align:center; font-weight:600; margin:8px auto 0 auto; width:fit-content; display:flex; align-items:center; gap:6px;">
          <span><Icon name="lucide:calendar" style="font-size:10px;" /> {{ formEvent.tanggal || 'Tgl' }}</span>
          <span style="color:#a8cabb;">|</span>
          <span><Icon name="lucide:map-pin" style="font-size:10px;" /> {{ formEvent.lokasi || 'Lokasi' }}</span>
        </div>
        <div v-if="step === 1 || step === 4" style="text-align:center; margin-top:8px; font-size:11px; color:#4a5a6e; line-height:1.5;">
          {{ formEvent.deskripsi || 'Deskripsi acara kamu akan tampil di sini...' }}
        </div>
      </div>

      <!-- Ticket Selection (Step 2 & 4) -->
      <div v-if="step === 2 || step === 4" style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); border:1px solid #e6edf5; margin-bottom:12px;">
        <div style="font-weight:700; font-size:11px; color:#0a1929; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <Icon name="lucide:ticket" style="color:var(--primary); font-size:14px;" /> Pilih Tiket
        </div>
        <div v-if="wizardTiketList.length === 0" style="color:#8a9aa8;font-size:11px;text-align:center;padding:10px 0;">Tiket belum tersedia</div>
        <div v-for="(t, i) in wizardTiketList" :key="i" style="border:1px solid #e6edf5; border-radius:8px; padding:8px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:11px; font-weight:700; color:#0a1929;">{{ t.nama }}</div>
            <div style="font-size:10px; color:var(--primary); font-weight:600;">{{ formatRupiah(t.harga) }}</div>
          </div>
          <div style="font-size:9px; background:#f0f4fa; padding:2px 6px; border-radius:4px; color:#4a5a6e;">Tersisa {{ t.kuota }}</div>
        </div>
      </div>

      <!-- Form Builder Preview (Step 3 & 4) -->
      <div v-if="step === 3 || step === 4" style="background:#ffffff; border-radius:16px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03); border:1px solid #e6edf5;">
        <div v-if="step === 3" style="font-weight:700; font-size:11px; color:#0a1929; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <Icon name="lucide:file-text" style="color:var(--primary); font-size:14px;" /> Form Peserta
        </div>
        <div v-html="hpPreviewHtml"></div>
        <button v-if="step === 3 || step === 4" style="width:100%; padding:10px; background:#1a3a5c; color:white; border:none; border-radius:40px; font-weight:600; font-size:11px; margin-top:12px; box-shadow:0 4px 12px var(--primary-shadow); display:flex; justify-content:center; align-items:center; gap:6px;">
          <Icon name="lucide:check-square" style="font-size:14px;" /> DAFTAR SEKARANG
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  step: { type: Number, default: 1 },
  formEvent: { type: Object, required: true },
  wizardTiketList: { type: Array, default: () => [] },
  hpPreviewHtml: { type: String, default: '' }
})

const formatRupiah = (val) => {
  if (!val) return 'Gratis'
  const num = parseInt(val.toString().replace(/[^0-9]/g, ''), 10)
  if (num === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}
</script>
