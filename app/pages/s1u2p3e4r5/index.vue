<template>
  <div class="master-layout">
    <div v-if="loadingAuth" class="loader-container">
      <p class="pulse-text">Memeriksa Kredensial Super Admin...</p>
    </div>

    <div v-else-if="!isAuthorized" class="auth-error">
      <div class="error-box">
        <h1>Akses Ditolak</h1>
        <p>Kamu tidak memiliki izin untuk mengakses Ruang Master.</p>
        <NuxtLink to="/" class="btn-primary">Kembali ke Beranda</NuxtLink>
      </div>
    </div>

    <div v-else class="master-container">
      <header class="master-header">
        <div class="header-titles">
          <h1>Ruang Master (Super Admin)</h1>
          <p>Pusat Kendali Pencairan Dana (Settlement & Withdrawal)</p>
        </div>
        <div class="header-badge">
          <span class="badge-success">Authorized: {{ masterEmail }}</span>
        </div>
      </header>

      <div class="tabs">
        <button 
          @click="activeTab = 'settlement'" 
          :class="['tab-btn', activeTab === 'settlement' ? 'active' : '']"
        >
          ⏱️ Dana Tertunda (Settlement)
        </button>
        <button 
          @click="activeTab = 'withdrawal'" 
          :class="['tab-btn', activeTab === 'withdrawal' ? 'active' : '']"
        >
          💸 Antrean Penarikan (Withdrawals)
        </button>
      </div>

      <!-- TAB 1: SETTLEMENT -->
      <section v-if="activeTab === 'settlement'" class="master-card">
        <div class="card-header flex-between">
          <div>
            <h2>Antrean Dana Mengendap (PENDING)</h2>
            <p class="subtitle">Tiket lunas yang uangnya belum dicairkan ke Saldo EO.</p>
          </div>
          <button 
            @click="prosesPencairanMassal" 
            :disabled="selectedPeserta.length === 0 || isProcessing"
            class="btn-action"
          >
            Cairkan {{ selectedPeserta.length }} Transaksi Terpilih
          </button>
        </div>

        <div v-if="loadingData" class="empty-state">Memuat data transaksi...</div>
        <div v-else-if="pendingTransactions.length === 0" class="empty-state box-dashed">
          <p>Bagus! Tidak ada dana yang nyangkut/pending saat ini.</p>
        </div>
        <div v-else class="table-container">
          <table class="master-table">
            <thead>
              <tr>
                <th width="40"><input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" class="cb-custom"></th>
                <th>TANGGAL</th>
                <th>NAMA EVENT</th>
                <th>PESERTA & TIKET</th>
                <th class="text-right">NOMINAL (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in pendingTransactions" :key="t.id">
                <td><input type="checkbox" :value="t.id" v-model="selectedPeserta" class="cb-custom"></td>
                <td class="text-sm text-muted">{{ formatDate(t.created_at) }}</td>
                <td class="font-bold">{{ t.event?.nama_event || '-' }}</td>
                <td>
                  <div class="font-bold">{{ t.nama_lengkap }}</div>
                  <div class="text-xs text-muted">{{ t.nama_tiket }}</div>
                </td>
                <td class="text-right font-bold text-green">
                  Rp {{ formatRupiah(t.kategori_tiket?.harga || 0) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right font-bold">Total Nominal Terpilih:</td>
                <td class="text-right font-black text-blue">Rp {{ formatRupiah(totalSelectedNominal) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- TAB 2: WITHDRAWALS -->
      <section v-if="activeTab === 'withdrawal'" class="master-card">
        <h2>Antrean Penarikan (Withdrawals)</h2>
        <p class="subtitle" style="margin-bottom: 24px;">Daftar EO yang merequest pencairan dana ke rekening mereka.</p>

        <div v-if="loadingData" class="empty-state">Memuat data penarikan...</div>
        <div v-else-if="withdrawalRequests.length === 0" class="empty-state box-dashed">
          <p>Bagus! Tidak ada antrean penarikan dana hari ini.</p>
        </div>
        <div v-else class="withdrawal-list">
          <div v-for="w in withdrawalRequests" :key="w.id" class="withdrawal-item">
            <div class="w-info">
              <div class="w-meta">
                <span class="badge-warning">REQUEST</span>
                <span class="text-muted text-sm">{{ formatDate(w.created_at) }}</span>
              </div>
              <h3>{{ w.organizer_profile?.nama_organizer || 'EO Tidak Dikenal' }}</h3>
              <p class="text-sm text-muted" style="margin-top: 8px;">Tujuan Transfer:</p>
              <div class="bank-box">
                <strong>{{ w.bank_tujuan }} - {{ w.rekening_tujuan }}</strong>
                <p>a.n. {{ w.atas_nama }}</p>
              </div>
            </div>
            
            <div class="w-action text-right">
              <p class="text-sm text-muted">Nominal Pencairan</p>
              <h2 class="text-green amount">Rp {{ formatRupiah(w.nominal) }}</h2>
              <button 
                @click="tandaiSelesai(w.id)" 
                :disabled="isProcessing"
                class="btn-success mt-2"
              >
                ✅ Tandai Sudah Ditransfer
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// ======= KONFIGURASI KEAMANAN =======
const MASTER_EMAIL = 'master@eventhub.com' // Ganti dengan email super admin yang sebenarnya nanti
// ====================================

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const loadingAuth = ref(true)
const isAuthorized = ref(false)
const masterEmail = ref(MASTER_EMAIL)

const activeTab = ref('settlement')
const loadingData = ref(false)
const isProcessing = ref(false)

const pendingTransactions = ref([])
const selectedPeserta = ref([])
const withdrawalRequests = ref([])

onMounted(async () => {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser || authUser.email !== MASTER_EMAIL) {
    isAuthorized.value = false
    loadingAuth.value = false
    return
  }
  
  isAuthorized.value = true
  loadingAuth.value = false
  await muatData()
})

const muatData = async () => {
  loadingData.value = true
  try {
    const { data: pData, error: pErr } = await supabase
      .from('peserta')
      .select(`id, nama_lengkap, nama_tiket, created_at, kategori_tiket (harga), event (nama_event)`)
      .eq('status_bayar', 'paid')
      .eq('status_dana', 'PENDING')
      .order('created_at', { ascending: true })
      .limit(200) // BATAS AMAN SERVER HOMELAB 
    
    if (pErr) console.error(pErr)
    else pendingTransactions.value = pData || []

    const { data: wData, error: wErr } = await supabase
      .from('penarikan_dana')
      .select(`id, nominal, bank_tujuan, rekening_tujuan, atas_nama, created_at, status, organizer_profile (nama_organizer)`)
      .eq('status', 'REQUEST')
      .order('created_at', { ascending: true })
      .limit(100) // BATAS AMAN
    
    if (wErr) console.error(wErr)
    else withdrawalRequests.value = wData || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingData.value = false
  }
}

const isAllSelected = computed(() => pendingTransactions.value.length > 0 && selectedPeserta.value.length === pendingTransactions.value.length)
const toggleSelectAll = (e) => {
  if (e.target.checked) selectedPeserta.value = pendingTransactions.value.map(t => t.id)
  else selectedPeserta.value = []
}
const totalSelectedNominal = computed(() => pendingTransactions.value.filter(t => selectedPeserta.value.includes(t.id)).reduce((sum, t) => sum + (t.kategori_tiket?.harga || 0), 0))

const prosesPencairanMassal = async () => {
  if (selectedPeserta.value.length === 0) return
  if (!confirm(`Yakin ingin mencairkan ${selectedPeserta.value.length} transaksi ini ke saldo EO?`)) return

  isProcessing.value = true
  try {
    // FIX PERFORMA: Gunakan filter .in() untuk 1x request ke server
    // (Bukan Promise.all() yang membuat ratusan koneksi paralel dan bikin server down)
    const { error } = await supabase
      .from('peserta')
      .update({ status_dana: 'CAIR' })
      .in('id', selectedPeserta.value)
      
    if (error) throw error

    alert('Berhasil dicairkan ke saldo EO!')
    selectedPeserta.value = []
    await muatData()
  } catch (err) { alert('Gagal mencairkan: ' + err.message) } finally { isProcessing.value = false }
}

const tandaiSelesai = async (id) => {
  if (!confirm('Apakah kamu sudah men-transfer uang ini ke rekening EO? Yakin tandai selesai?')) return
  isProcessing.value = true
  try {
    const { error } = await supabase.from('penarikan_dana').update({ status: 'SELESAI' }).eq('id', id)
    if (error) throw error
    alert('Berhasil ditandai Selesai!')
    await muatData()
  } catch (err) { alert('Gagal menandai selesai: ' + err.message) } finally { isProcessing.value = false }
}

const formatRupiah = (angka) => Number(angka).toLocaleString('id-ID')
const formatDate = (dateString) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.master-layout { min-height: 100vh; background: var(--bg-light); padding: 20px; font-family: 'Poppins', sans-serif; }
.loader-container, .auth-error { display: flex; justify-content: center; align-items: center; height: 80vh; }
.error-box { background: #fee2e2; color: #b91c1c; padding: 30px; border-radius: 16px; text-align: center; max-width: 400px; margin: 0 auto; }
.error-box h1 { margin-top: 0; font-size: 24px; }
.btn-primary { display: inline-block; background: var(--primary); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }

.master-container { max-width: 1000px; margin: 0 auto; }
.master-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--border-soft); padding-bottom: 20px; margin-bottom: 24px; }
.header-titles h1 { font-size: 28px; margin: 0 0 4px 0; color: var(--primary); }
.subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
.badge-success { background: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.tabs { display: flex; gap: 12px; margin-bottom: 24px; }
.tab-btn { padding: 10px 20px; background: white; border: 1px solid var(--border-soft); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; color: var(--text-muted); transition: 0.2s; }
.tab-btn:hover { background: #f1f5f9; }
.tab-btn.active { background: var(--accent-main); color: white; border-color: var(--accent-main); box-shadow: var(--shadow-sm); }

.master-card { background: white; border-radius: 16px; padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-soft); }
.flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-action { background: var(--accent-main); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-action:not(:disabled):hover { background: #1d4ed8; }

.empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
.box-dashed { border: 2px dashed var(--border-soft); border-radius: 12px; background: #f8fafc; }

.table-container { overflow-x: auto; }
.master-table { width: 100%; border-collapse: collapse; text-align: left; }
.master-table th { background: #f1f5f9; padding: 12px; font-size: 13px; color: var(--text-muted); border-bottom: 2px solid var(--border-soft); }
.master-table td { padding: 16px 12px; border-bottom: 1px solid var(--border-soft); vertical-align: middle; }
.master-table tbody tr:hover { background: #f8fafc; }
.cb-custom { width: 18px; height: 18px; cursor: pointer; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 13px; }
.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.font-black { font-weight: 900; }
.text-green { color: #16a34a; }
.text-blue { color: var(--accent-main); font-size: 18px; }

.withdrawal-list { display: flex; flex-direction: column; gap: 16px; }
.withdrawal-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid var(--border-soft); border-radius: 12px; background: #f8fafc; transition: 0.2s; }
.withdrawal-item:hover { border-color: var(--accent-main); }
.badge-warning { background: #fef3c7; color: #b45309; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; letter-spacing: 1px; margin-right: 8px; }
.w-info h3 { margin: 8px 0 0 0; font-size: 18px; }
.bank-box { background: white; padding: 12px; border: 1px solid var(--border-soft); border-radius: 8px; margin-top: 8px; display: inline-block; }
.bank-box p { margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted); }
.amount { margin: 4px 0 8px 0; font-size: 24px; }
.btn-success { background: #10b981; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-success:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-success:not(:disabled):hover { background: #059669; }
.mt-2 { margin-top: 8px; }

@media(max-width: 768px) {
  .withdrawal-item { flex-direction: column; align-items: flex-start; }
  .w-action { text-align: left; margin-top: 16px; width: 100%; }
}
</style>
