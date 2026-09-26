<template>
  <div style="min-height: 100vh; background: #f8fafc; padding: 20px; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    
    <!-- Loader -->
    <div v-if="isLoadingData" style="text-align: center;">
      <Icon name="lucide:loader" style="font-size: 40px; color: var(--primary); animation: spin 1s linear infinite;" />
      <p style="margin-top: 10px; color: var(--text-muted); font-weight: 600;">Memuat Portal Absensi...</p>
    </div>
    
    <!-- Not Found / Inactive -->
    <div v-else-if="!eventData || !eventData.settings?.is_online_absen_active" style="background: white; padding: 40px 20px; border-radius: 16px; text-align: center; max-width: 400px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <Icon name="lucide:x-circle" style="font-size: 60px; color: #ef4444; margin-bottom: 15px;" />
      <h2 style="margin: 0 0 10px; color: #0f172a; font-weight: 800;">Portal Tidak Aktif</h2>
      <p style="margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.5;">Portal absensi online tidak ditemukan atau belum diaktifkan oleh panitia acara ini.</p>
    </div>

    <!-- Active Portal -->
    <div v-else style="background: white; padding: 30px 20px; border-radius: 16px; max-width: 400px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      
      <!-- Event Header -->
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
        <div style="width: 60px; height: 60px; background: #eff6ff; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; border: 1px solid #bfdbfe;">
          <Icon name="lucide:check-circle-2" style="font-size: 32px; color: var(--primary);" />
        </div>
        <h3 style="margin: 0 0 5px; color: #0f172a; font-weight: 800; font-size: 1.2rem; line-height: 1.3;">{{ eventData.nama_event }}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.8rem; font-weight: 600;">PORTAL KEHADIRAN VIRTUAL</p>
      </div>

      <!-- Form Absensi -->
      <div v-if="checkinStatus === 'idle'">
        <p style="font-size: 0.85rem; color: #475569; text-align: center; margin: 0 0 15px; line-height: 1.5;">
          Masukkan <strong>Email</strong> atau <strong>No. WhatsApp</strong> yang Anda gunakan saat pendaftaran.
        </p>

        <div style="margin-bottom: 15px;">
          <input type="text" v-model="identifier" placeholder="Email / 628123..." style="width: 100%; box-sizing: border-box; padding: 14px 16px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none; transition: border-color 0.2s;" />
        </div>

        <button @click="prosesAbsen" :disabled="isProcessing || !identifier" style="width: 100%; padding: 14px; border-radius: 10px; font-weight: 700; background: var(--primary); color: white; border: none; cursor: pointer; transition: background 0.2s; font-size: 0.95rem;">
          {{ isProcessing ? 'MEMPROSES...' : 'REKAM KEHADIRAN' }}
        </button>
      </div>

      <!-- Success State -->
      <div v-else-if="checkinStatus === 'success'" style="text-align: center; padding: 10px 0;">
        <div style="width: 70px; height: 70px; background: #F0FDF4; color: #16A34A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 0 0 4px #DCFCE7;">
          <Icon name="lucide:check" style="font-size: 36px;" />
        </div>
        <h2 style="margin:0 0 8px; font-weight: 800; color: #16A34A; font-size: 1.4rem;">Absen Berhasil!</h2>
        <p style="color: #475569; font-size: 0.85rem; margin: 0 0 20px; line-height: 1.5;">
          Terima kasih, <strong>{{ pesertaName }}</strong>.<br/>Kehadiran Anda telah tercatat.
        </p>
        <button @click="resetForm" style="padding: 10px 20px; border-radius: 8px; font-weight: 600; background: #e2e8f0; color: #475569; border: none; cursor: pointer; font-size: 0.8rem;">
          Absen Peserta Lain
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="checkinStatus === 'error'" style="text-align: center; padding: 10px 0;">
        <div style="width: 70px; height: 70px; background: #FEF2F2; color: #DC2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 0 0 4px #FEE2E2;">
          <Icon name="lucide:x" style="font-size: 36px;" />
        </div>
        <h2 style="margin:0 0 8px; font-weight: 800; color: #DC2626; font-size: 1.2rem;">Gagal Memproses</h2>
        <p style="color: #475569; font-size: 0.85rem; margin: 0 0 20px; line-height: 1.5;">{{ errorMessage }}</p>
        <button @click="resetForm" style="padding: 12px 20px; border-radius: 8px; font-weight: 600; background: #DC2626; color: white; border: none; cursor: pointer; font-size: 0.85rem; width: 100%;">
          COBA LAGI
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const supabase = useSupabaseClient()
const route = useRoute()

const eventData = ref(null)
const isLoadingData = ref(true)

const identifier = ref('')
const isProcessing = ref(false)
const checkinStatus = ref('idle') // idle | success | error
const errorMessage = ref('')
const pesertaName = ref('')

onMounted(async () => {
  const slug = route.params.slug
  try {
    const { data, error } = await supabase.from('event').select('*').eq('slug', slug).single()
    if (error) throw error
    eventData.value = data
  } catch (err) {
    console.error('Event tidak ditemukan')
  } finally {
    isLoadingData.value = false
  }
})

const prosesAbsen = async () => {
  if (!identifier.value) return
  isProcessing.value = true
  errorMessage.value = ''
  
  try {
    const idValue = identifier.value.trim()
    
    // Cari peserta berdasarkan email atau no_wa
    const { data: peserta, error } = await supabase
      .from('peserta')
      .select('*')
      .eq('event_id', eventData.value.id)
      .or(`email.eq.${idValue},no_wa.eq.${idValue}`)
      
    if (error || !peserta || peserta.length === 0) {
      throw new Error('Data tidak ditemukan. Pastikan Email / WA Anda terdaftar di acara ini.')
    }
    
    // Ambil peserta pertama (asumsi unique)
    const p = peserta[0]
    
    if (p.status_bayar !== 'paid') {
      throw new Error(`Pembayaran tiket Anda masih berstatus "${p.status_bayar}". Tidak bisa melakukan absensi.`)
    }
    
    if (p.is_scanned) {
      throw new Error('Anda sudah melakukan absensi sebelumnya.')
    }
    
    // Update status hadir
    const { error: updateErr } = await supabase
      .from('peserta')
      .update({ is_scanned: true })
      .eq('id', p.id)
      
    if (updateErr) throw updateErr
    
    pesertaName.value = p.nama_lengkap
    checkinStatus.value = 'success'
    
  } catch (err) {
    errorMessage.value = err.message
    checkinStatus.value = 'error'
  } finally {
    isProcessing.value = false
  }
}

const resetForm = () => {
  identifier.value = ''
  checkinStatus.value = 'idle'
  errorMessage.value = ''
  pesertaName.value = ''
}
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
input:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
