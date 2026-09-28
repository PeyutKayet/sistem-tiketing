<template>
  <div id="page-dompet">
    <div class="page-header">
      <h2 class="page-title"><Icon name="lucide:wallet" style="margin-right:4px;" /> Dompet & Pendapatan</h2>
      <button class="btn-outline" @click="router.push('/admin')"><Icon name="lucide:arrow-left" style="margin-right:4px;" /> Kembali ke Dasbor</button>
    </div>

    <!-- Alert Belum Isi Rekening -->
    <div v-if="!hasBankInfo && !loading" class="alert-box mb-18">
      <div style="display:flex; gap:12px; align-items:flex-start;">
        <Icon name="lucide:alert-triangle" style="color: #b45309; font-size:24px; margin-top:2px;" />
        <div>
          <h4 style="margin:0 0 4px 0; color:#b45309; font-size:15px;">Informasi Rekening Belum Lengkap!</h4>
          <p style="margin:0; font-size:13px; color:#b45309; line-height:1.5;">Kamu harus mengisi data Rekening Bank terlebih dahulu sebelum bisa melakukan penarikan dana.</p>
          <button class="btn-primary" style="margin-top:12px; padding:6px 16px; font-size:13px;" @click="router.push('/admin/settings?highlight=rekening')">Lengkapi Rekening Sekarang</button>
        </div>
      </div>
    </div>

    <!-- Kartu Saldo -->
    <div class="saldo-cards">
      <!-- Saldo Tersedia -->
      <div class="card-saldo primary">
        <div class="saldo-header">
          <span>Saldo Tersedia</span>
          <Icon name="lucide:check-circle" />
        </div>
        <div class="saldo-amount">Rp {{ formatRupiah(saldoTersedia) }}</div>
        <p class="saldo-desc">Uang yang sudah cair dan siap kamu tarik kapan saja.</p>
        
        <div class="withdraw-section">
          <label>Tarik ke Rekening:</label>
          <div class="input-group" :class="{'shake-error border-danger': isErrorShake}">
            <span class="currency">Rp</span>
            <input 
              type="number" 
              v-model="nominalTarik" 
              placeholder="0"
              class="input-withdraw"
              :disabled="!hasBankInfo || isSubmitting"
            />
            <button 
              class="btn-withdraw" 
              @click="ajukanPenarikan"
              :disabled="!hasBankInfo || isSubmitting || nominalTarik <= 0"
            >
              <template v-if="isSubmitting"><Icon name="lucide:loader-2" class="spin" /></template>
              <template v-else>Tarik Dana</template>
            </button>
          </div>
          <div v-if="isErrorShake" class="error-msg">Ups! Nominal melebihi Saldo Tersedia.</div>
          
          <div v-if="hasBankInfo" class="bank-info-mini">
            <Icon name="lucide:landmark" style="margin-right:4px;" /> 
            {{ organizerProfile.bank_nama }} - {{ organizerProfile.bank_rekening }} ({{ organizerProfile.bank_atas_nama }})
          </div>
        </div>
      </div>

      <!-- Saldo Tertunda -->
      <div class="card-saldo warning">
        <div class="saldo-header">
          <span>Saldo Tertunda</span>
          <Icon name="lucide:clock" />
        </div>
        <div class="saldo-amount">Rp {{ formatRupiah(saldoTertunda) }}</div>
        <p class="saldo-desc">Uang dari pembeli yang belum diselesaikan (Settlement) oleh Sistem Pusat. Sedang dalam proses pengecekan.</p>
      </div>
    </div>

    <!-- Tabel Riwayat Penarikan -->
    <div class="panel" style="margin-top: 24px;">
      <h4 style="margin-bottom:16px;font-weight:600;color:#0a1929;"><Icon name="lucide:history" style="margin-right:6px; color: var(--primary);" /> Riwayat Penarikan Dana</h4>
      
      <div v-if="loading" style="text-align:center; padding:20px; color:#8a9aa8;">Memuat data...</div>
      <div v-else-if="riwayatPenarikan.length === 0" style="text-align:center; padding:40px 20px; color:#8a9aa8; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;">
        Belum ada riwayat penarikan dana.
      </div>
      <div v-else class="table-responsive">
        <table class="table" style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
              <th style="padding:12px; font-size:13px; color:#64748b; font-weight:600;">Tanggal</th>
              <th style="padding:12px; font-size:13px; color:#64748b; font-weight:600;">Nominal</th>
              <th style="padding:12px; font-size:13px; color:#64748b; font-weight:600;">Rekening Tujuan</th>
              <th style="padding:12px; font-size:13px; color:#64748b; font-weight:600;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in riwayatPenarikan" :key="r.id" style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:12px; font-size:13px; color:#475569;">{{ formatDate(r.created_at) }}</td>
              <td style="padding:12px; font-size:14px; font-weight:700; color:#0f172a;">Rp {{ formatRupiah(r.nominal) }}</td>
              <td style="padding:12px;">
                <div style="font-size:13px; font-weight:600; color:#0f172a;">{{ r.bank_tujuan }} - {{ r.rekening_tujuan }}</div>
                <div style="font-size:12px; color:#64748b;">a.n {{ r.atas_nama }}</div>
              </td>
              <td style="padding:12px;">
                <span v-if="r.status === 'REQUEST'" class="badge badge-warning">Diproses</span>
                <span v-else-if="r.status === 'SELESAI'" class="badge badge-success">Selesai</span>
                <span v-else-if="r.status === 'DITOLAK'" class="badge badge-danger">Ditolak</span>
                <span v-else class="badge">{{ r.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const loading = ref(true)
const isSubmitting = ref(false)
const organizerProfile = ref({})

// Data Saldo & Riwayat
const totalPemasukanCair = ref(0)
const totalPemasukanTertunda = ref(0)
const riwayatPenarikan = ref([])

// Form Penarikan
const nominalTarik = ref('')
const isErrorShake = ref(false)

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  await muatData()
})

const muatData = async () => {
  loading.value = true
  try {
    const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !authUser) throw new Error('Gagal memuat sesi user')

    // 1. Ambil Profil EO (Gunakan maybeSingle agar tidak error 406 jika belum ada data)
    const { data: orgData, error: orgErr } = await supabase
      .from('organizer_profile')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()
    
    if (orgErr) throw orgErr
    organizerProfile.value = orgData || {}

    // 2. Ambil Riwayat Penarikan Dana (Jika sudah punya profil)
    if (orgData) {
      const { data: wdData, error: wdErr } = await supabase
        .from('penarikan_dana')
        .select('*')
        .eq('organizer_id', orgData.id)
        .order('created_at', { ascending: false })
      
      if (wdErr) throw wdErr
      riwayatPenarikan.value = wdData || []
    } else {
      riwayatPenarikan.value = []
    }

    // 3. Hitung Saldo Pakai RPC Supabase (Sangat Cepat & Ringan!)
    const { data: balances, error: balErr } = await supabase.rpc('get_eo_balances', {
      eo_id: authUser.id
    })
    
    if (balErr) throw balErr

    // Hasilnya langsung angka dari database, browser tidak perlu pusing hitung ribuan row
    totalPemasukanCair.value = balances.saldo_tersedia + balances.total_ditarik // Untuk backwards compatibility dengan computed
    totalPemasukanTertunda.value = balances.saldo_tertunda

  } catch (err) {
    console.error('Gagal memuat dompet:', err.message)
    alert('Gagal memuat dompet: ' + err.message)
  } finally {
    loading.value = false
  }
}

const hasBankInfo = computed(() => {
  return organizerProfile.value.bank_nama && organizerProfile.value.bank_rekening && organizerProfile.value.bank_atas_nama
})

const totalSudahDitarik = computed(() => {
  // Hitung semua penarikan yang tidak ditolak (berarti sudah ditarik atau sedang antre ditarik)
  return riwayatPenarikan.value
    .filter(r => r.status !== 'DITOLAK')
    .reduce((sum, r) => sum + Number(r.nominal), 0)
})

const saldoTersedia = computed(() => {
  // Saldo Tersedia = Total Pemasukan Cair - Total Uang Yang Sudah Direquest/Selesai Ditarik
  return Math.max(0, totalPemasukanCair.value - totalSudahDitarik.value)
})

const saldoTertunda = computed(() => {
  return totalPemasukanTertunda.value
})

const ajukanPenarikan = async () => {
  const nominal = Number(nominalTarik.value)
  
  if (nominal <= 0) return

  // Validasi: Kalau nominal lebih besar dari saldo, getarkan kotaknya!
  if (nominal > saldoTersedia.value) {
    isErrorShake.value = true
    setTimeout(() => { isErrorShake.value = false }, 800) // matikan animasi setelah 800ms
    return
  }

  if (!confirm(`Yakin ingin menarik dana sebesar Rp ${formatRupiah(nominal)} ke rekening ${organizerProfile.value.bank_nama}?`)) return

  isSubmitting.value = true
  try {
    // Gunakan RPC Server-side agar aman dari Double-Spend
    const { data: rpcRes, error } = await supabase.rpc('ajukan_penarikan', {
      eo_id: organizerProfile.value.id,
      req_nominal: nominal,
      b_nama: organizerProfile.value.bank_nama,
      b_rek: organizerProfile.value.bank_rekening,
      b_atas_nama: organizerProfile.value.bank_atas_nama
    })

    if (error) throw error

    alert('Request penarikan berhasil dikirim! Silakan tunggu proses transfer dari Super Admin.')
    nominalTarik.value = ''
    await muatData()
  } catch (err) {
    alert('Gagal request penarikan: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const formatRupiah = (angka) => Number(angka).toLocaleString('id-ID')
const formatDate = (dateString) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
#page-dompet { padding: 20px 0; max-width: 900px; margin: 0 auto; }
.mb-18 { margin-bottom: 18px; }

.alert-box { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; }

.saldo-cards { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 24px; }
@media(max-width: 768px) { .saldo-cards { grid-template-columns: 1fr; } }

.card-saldo { border-radius: 16px; padding: 24px; position: relative; overflow: hidden; box-shadow: var(--shadow-sm); }
.card-saldo.primary { background: var(--primary); color: white; }
.card-saldo.warning { background: white; border: 1px solid var(--border-soft); }

.saldo-header { display: flex; justify-content: space-between; align-items: center; font-size: 15px; font-weight: 600; opacity: 0.9; margin-bottom: 12px; }
.card-saldo.primary .saldo-header { color: #cbd5e1; }
.card-saldo.warning .saldo-header { color: var(--text-muted); }

.saldo-amount { font-size: 36px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
.card-saldo.warning .saldo-amount { color: var(--text-main); }

.saldo-desc { font-size: 13px; line-height: 1.5; opacity: 0.8; margin: 0; }
.card-saldo.warning .saldo-desc { color: var(--text-muted); }

.withdraw-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
.withdraw-section label { display: block; font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px; }

.input-group { display: flex; align-items: stretch; background: rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); transition: 0.2s; }
.input-group:focus-within { border-color: var(--accent-main); box-shadow: 0 0 0 3px rgba(37,99,235,0.3); }
.currency { padding: 12px 16px; font-weight: 700; color: white; background: rgba(255,255,255,0.05); }
.input-withdraw { flex: 1; background: transparent; border: none; color: white; font-size: 18px; font-weight: 700; padding: 10px; outline: none; }
.input-withdraw::placeholder { color: rgba(255,255,255,0.3); }
.btn-withdraw { background: var(--accent-main); color: white; border: none; padding: 0 24px; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.2s; }
.btn-withdraw:hover:not(:disabled) { background: #1d4ed8; }
.btn-withdraw:disabled { opacity: 0.6; cursor: not-allowed; }

.bank-info-mini { margin-top: 12px; font-size: 12px; color: #94a3b8; display: flex; align-items: center; }

/* ERROR SHAKE ANIMATION */
.shake-error { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; border-color: #ef4444 !important; background: rgba(239, 68, 68, 0.1); }
.error-msg { color: #fca5a5; font-size: 12px; margin-top: 8px; font-weight: 600; }
.border-danger { border-color: #ef4444 !important; }

@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* Badges */
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.badge-warning { background: #fef3c7; color: #b45309; }
.badge-success { background: #d1fae5; color: #065f46; }
.badge-danger { background: #fee2e2; color: #b91c1c; }
</style>
