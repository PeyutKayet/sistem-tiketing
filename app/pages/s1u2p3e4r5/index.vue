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
          @click="activeTab = 'backup'" 
          :class="['tab-btn', activeTab === 'backup' ? 'active' : '']"
        >
          🛡️ Antrean QRIS Cadangan
          <span v-if="backupOrders.length > 0" class="tab-badge-count">{{ backupOrders.length }}</span>
        </button>
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
        <button 
          @click="activeTab = 'gateway'" 
          :class="['tab-btn', activeTab === 'gateway' ? 'active' : '']"
        >
          <svg class="tab-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Kendali Gateway & Darurat
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

      <!-- TAB 3: GATEWAY & EMERGENCY FAILOVER -->
      <section v-if="activeTab === 'gateway'" class="master-card">
        <div class="card-header flex-between">
          <div>
            <h2>Master Kill-Switch & Gateway Failover</h2>
            <p class="subtitle">Pusat kendali darurat jika payment gateway ESPay mengalami gangguan atau pemeliharaan.</p>
          </div>
          <div class="gateway-live-status">
            <span v-if="gatewaySettings.is_emergency_backup" class="badge-danger-glow">
              <span class="status-dot-red"></span>
              MODE DARURAT AKTIF (TRANSFER MANUAL)
            </span>
            <span v-else class="badge-success-glow">
              <span class="status-dot-green"></span>
              GATEWAY NORMAL (ESPAY DIRECT ONLINE)
            </span>
          </div>
        </div>

        <div class="gateway-control-panel">
          <!-- Status Banner -->
          <div :class="['gateway-banner', gatewaySettings.is_emergency_backup ? 'banner-emergency' : 'banner-normal']">
            <div class="banner-icon-box">
              <svg v-if="gatewaySettings.is_emergency_backup" class="banner-svg icon-alert" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <svg v-else class="banner-svg icon-shield" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="banner-info">
              <h3>{{ gatewaySettings.is_emergency_backup ? 'Seluruh Checkout Dialihkan ke Transfer Manual' : 'Sistem Pembayaran Otomatis Berjalan Normal' }}</h3>
              <p>
                {{ gatewaySettings.is_emergency_backup 
                  ? 'Saat ini semua halaman pendaftaran tiket tidak akan memanggil API ESPay. Peserta akan diminta melakukan transfer manual ke rekening panitia dan mengupload bukti transfer.' 
                  : 'Peserta dapat membayar instan secara langsung menggunakan QRIS atau Virtual Account Mandiri, BRI, dan BNI melalui ESPay Direct API.' }}
              </p>
            </div>
          </div>

          <!-- Master Switch Card -->
          <div class="switch-card">
            <div class="switch-row">
              <div class="switch-desc">
                <h4>Aktifkan Failover Darurat (Manual Transfer Backup)</h4>
                <p>Nyalakan saklar ini HANYA jika server ESPay down, timeout, atau sedang ada maintenance darurat dari pihak bank.</p>
              </div>
              <div class="switch-action">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    :checked="gatewaySettings.is_emergency_backup" 
                    @change="handleToggleGateway($event.target.checked)"
                    :disabled="isUpdatingGateway"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- Pesan Informasi Publik -->
            <div class="emergency-msg-box">
              <label class="input-label">Pesan Pemberitahuan untuk Peserta (Tampil di Halaman Checkout):</label>
              <textarea 
                v-model="gatewaySettings.emergency_message" 
                rows="2" 
                class="form-textarea-custom"
                placeholder="Contoh: Sistem pembayaran otomatis sedang dalam pemeliharaan berkala..."
              ></textarea>
              <div class="msg-footer">
                <span class="text-xs text-muted">Terakhir diubah oleh: <strong>{{ gatewaySettings.updated_by || '-' }}</strong> ({{ gatewaySettings.updated_at ? formatDate(gatewaySettings.updated_at) : 'Belum pernah' }})</span>
                <button 
                  @click="simpanPesanGateway" 
                  :disabled="isUpdatingGateway" 
                  class="btn-save-msg"
                >
                  <span v-if="isUpdatingGateway">Menyimpan...</span>
                  <span v-else>Simpan Perubahan Pesan</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Sandbox Simulator Tester Card -->
          <div class="simulator-card">
            <div class="simulator-card-content">
              <div class="simulator-icon-box">
                <svg class="simulator-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div class="simulator-text">
                <h4>Simulasi Pembayaran Tiket (Sandbox Tester)</h4>
                <p>Uji coba alur pembelian tiket asli dari QRIS hingga Virtual Account Espay secara otomatis (tanpa perlu mengisi data) dan simulasikan penerbitan E-Tiket lunas secara instan.</p>
              </div>
            </div>
            <div class="simulator-action">
              <NuxtLink to="/espay-testing" class="btn-open-simulator">
                <span>⚡ Buka Simulator Tiket</span>
                <svg class="btn-arrow-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 4: ANTREAN QRIS CADANGAN TYKET.ID -->
      <section v-if="activeTab === 'backup'" class="master-card">
        <div class="card-header flex-between">
          <div>
            <h2>Antrean Pembayaran QRIS Cadangan (Tyket.id)</h2>
            <p class="subtitle">Pesanan yang masuk lewat sistem cadangan saat gateway bermasalah. Cocokkan nominal + 3 digit kode unik di mutasi rekening Tyket.id.</p>
          </div>
          <button 
            @click="muatBackupOrders" 
            :disabled="loadingBackup"
            class="btn-refresh-backup"
            title="Muat Ulang Data Antrean"
          >
            <span v-if="loadingBackup">Memuat...</span>
            <span v-else class="btn-refresh-content">
              <svg class="tab-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Segarkan Antrean
            </span>
          </button>
        </div>

        <div v-if="loadingBackup" class="empty-state">Memuat antrean transaksi cadangan...</div>
        <div v-else-if="backupOrders.length === 0" class="empty-state box-dashed">
          <p class="font-bold">Bagus! Tidak ada antrean pembayaran cadangan pending.</p>
          <p class="text-sm text-muted mt-2">Semua transaksi cadangan sudah terverifikasi atau seluruh transaksi berjalan normal lewat payment gateway.</p>
        </div>
        <div v-else class="table-container">
          <table class="master-table">
            <thead>
              <tr>
                <th>WAKTU</th>
                <th>ORDER ID & EVENT</th>
                <th>PEMESAN</th>
                <th class="text-right">TOTAL TRANSFER</th>
                <th class="text-center">BUKTI STRUK</th>
                <th class="text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in backupOrders" :key="order.id">
                <td class="text-sm text-muted">
                  {{ formatDate(order.created_at) }}
                </td>
                <td>
                  <div class="order-id-badge">
                    <code>{{ order.id }}</code>
                  </div>
                  <div class="font-bold text-sm mt-1">{{ order.nama_event }}</div>
                  <div class="text-xs text-muted">{{ order.ticket_names }} ({{ order.ticket_count }}x tiket)</div>
                </td>
                <td>
                  <div class="font-bold">{{ order.pembeli_nama }}</div>
                  <div class="text-xs text-muted">WA: {{ order.pembeli_wa }}</div>
                  <div class="text-xs text-muted">{{ order.pembeli_email }}</div>
                </td>
                <td class="text-right">
                  <div class="font-black text-green text-lg">
                    Rp {{ formatRupiah(order.total_tagihan) }}
                  </div>
                  <div v-if="order.kode_unik" class="text-xs text-muted">
                    Kode Unik: <strong class="text-orange">+{{ order.kode_unik }}</strong>
                  </div>
                </td>
                <td class="text-center">
                  <div v-if="order.bukti_bayar_url" class="proof-thumb-box" @click="openProofModal(order)">
                    <img :src="order.bukti_bayar_url" alt="Struk" class="proof-thumb" />
                    <span class="proof-thumb-label">🔍 Lihat Foto</span>
                  </div>
                  <div v-else class="text-xs text-muted italic">
                    Belum ada bukti
                  </div>
                </td>
                <td class="text-center">
                  <div class="action-btn-group">
                    <button 
                      @click="prosesAksiOrder(order, 'verify')" 
                      :disabled="isProcessingOrder === order.id"
                      class="btn-action-verify"
                      title="Verifikasi pembayaran dan terbitkan e-ticket peserta"
                    >
                      <span v-if="isProcessingOrder === order.id">Memproses...</span>
                      <span v-else>✅ Verifikasi & Terbitkan</span>
                    </button>
                    <button 
                      @click="prosesAksiOrder(order, 'reject')" 
                      :disabled="isProcessingOrder === order.id"
                      class="btn-action-reject"
                      title="Tolak pesanan ini"
                    >
                      ❌ Tolak
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- MODAL PRATINJAU BUKTI TRANSFER -->
    <div v-if="activeProofModal" class="modal-backdrop" @click="closeProofModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Bukti Transfer Pembayaran</h3>
            <p class="modal-subtitle">Order ID: <code>{{ activeProofModal.id }}</code> • {{ activeProofModal.pembeli_nama }}</p>
          </div>
          <button @click="closeProofModal" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-nominal-bar">
            <span>Nominal Tagihan + Kode Unik:</span>
            <strong class="font-black text-green text-lg">Rp {{ formatRupiah(activeProofModal.total_tagihan) }}</strong>
          </div>
          <div class="modal-image-wrapper">
            <img :src="activeProofModal.bukti_bayar_url" alt="Bukti Transfer Penuh" class="modal-full-img" />
          </div>
        </div>
        <div class="modal-footer">
          <a :href="activeProofModal.bukti_bayar_url" target="_blank" class="btn-open-external">
            Buka Foto Asli di Tab Baru ↗
          </a>
          <div class="modal-action-buttons">
            <button 
              @click="prosesAksiOrder(activeProofModal, 'reject'); closeProofModal();" 
              class="btn-modal-reject"
            >
              Tolak Pesanan
            </button>
            <button 
              @click="prosesAksiOrder(activeProofModal, 'verify'); closeProofModal();" 
              class="btn-modal-verify"
            >
              ✅ Verifikasi & Terbitkan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// ======= KONFIGURASI KEAMANAN =======
const MASTER_EMAIL = 'master@tyket.id' // Ganti dengan email super admin yang sebenarnya nanti
// ====================================

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const loadingAuth = ref(true)
const isAuthorized = ref(false)
const masterEmail = ref(MASTER_EMAIL)

const activeTab = ref('backup')
const loadingData = ref(false)
const isProcessing = ref(false)

const pendingTransactions = ref([])
const selectedPeserta = ref([])
const withdrawalRequests = ref([])

// State untuk Antrean QRIS Cadangan
const backupOrders = ref([])
const loadingBackup = ref(false)
const isProcessingOrder = ref(null)
const activeProofModal = ref(null)

const gatewaySettings = ref({
  is_emergency_backup: false,
  emergency_message: '',
  updated_by: '',
  updated_at: null
})
const isUpdatingGateway = ref(false)

onMounted(async () => {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    isAuthorized.value = false
    loadingAuth.value = false
    return
  }

  let saValid = authUser.email === MASTER_EMAIL
  if (!saValid) {
    const { data: saRow } = await supabase.from('super_admins').select('user_id').eq('user_id', authUser.id).maybeSingle()
    if (saRow) saValid = true
  }

  if (!saValid) {
    isAuthorized.value = false
    loadingAuth.value = false
    return
  }
  
  isAuthorized.value = true
  masterEmail.value = authUser.email
  loadingAuth.value = false
  await Promise.all([muatData(), muatGatewayData(), muatBackupOrders()])
})

const getAuthHeaders = async () => {
  try {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.access_token) {
      return { Authorization: `Bearer ${data.session.access_token}` }
    }
  } catch (e) {
    console.warn('Gagal membaca token sesi Supabase:', e)
  }
  return {}
}

const muatData = async () => {
  loadingData.value = true
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch('/api/master-data', { headers })
    pendingTransactions.value = res.pendingTransactions || []
    withdrawalRequests.value = res.withdrawalRequests || []
  } catch (err) {
    console.error('Gagal memuat master data:', err)
  } finally {
    loadingData.value = false
  }
}

const muatBackupOrders = async () => {
  loadingBackup.value = true
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch('/api/admin-backup-orders', { headers })
    backupOrders.value = res?.backupOrders || []
  } catch (err) {
    console.error('Gagal memuat antrean cadangan:', err)
  } finally {
    loadingBackup.value = false
  }
}

const openProofModal = (order) => {
  activeProofModal.value = order
}

const closeProofModal = () => {
  activeProofModal.value = null
}

const prosesAksiOrder = async (order, action = 'verify') => {
  if (!order) return
  const isVerify = action === 'verify'
  const title = isVerify ? 'Verifikasi & Terbitkan Tiket?' : 'Tolak Pesanan Ini?'
  const text = isVerify 
    ? `Pastikan dana Rp ${formatRupiah(order.total_tagihan)} sudah masuk ke mutasi rekening Tyket.id. Tiket peserta akan langsung aktif (LUNAS).`
    : `Yakin ingin menolak pesanan ${order.id}? Pesanan dan tiket peserta akan dibatalkan.`
  
  let confirmed = false
  if (window.Swal) {
    const res = await window.Swal.fire({
      title,
      text,
      icon: isVerify ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: isVerify ? 'Ya, Verifikasi' : 'Ya, Tolak',
      confirmButtonColor: isVerify ? '#10B981' : '#EF4444',
      cancelButtonText: 'Batal'
    })
    confirmed = res.isConfirmed
  } else {
    confirmed = confirm(`${title}\n${text}`)
  }

  if (!confirmed) return

  isProcessingOrder.value = order.id
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch('/api/admin-verify-order', {
      method: 'POST',
      headers,
      body: {
        orderId: order.id,
        token: order.verify_token,
        action
      }
    })

    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: isVerify ? 'Berhasil Diverifikasi!' : 'Pesanan Dibatalkan',
        text: res.message || 'Status pesanan berhasil diperbarui.',
        timer: 2000,
        showConfirmButton: false
      })
    }
    await Promise.all([muatBackupOrders(), muatData()])
  } catch (err) {
    const errorMsg = err.data?.statusMessage || err.message || 'Terjadi kesalahan sistem.'
    if (window.Swal) {
      window.Swal.fire({ icon: 'error', title: 'Gagal', text: errorMsg, confirmButtonColor: '#EF4444' })
    } else {
      alert('Gagal: ' + errorMsg)
    }
  } finally {
    isProcessingOrder.value = null
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
  
  if (window.Swal) {
    const res = await window.Swal.fire({
      title: 'Cairkan Saldo?',
      text: `Yakin ingin mencairkan ${selectedPeserta.value.length} transaksi ini ke saldo EO?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Cairkan'
    })
    if (!res.isConfirmed) return
  } else {
    if (!confirm(`Yakin ingin mencairkan ${selectedPeserta.value.length} transaksi ini ke saldo EO?`)) return
  }

  isProcessing.value = true
  try {
    // Panggil backend API agar kebal RLS
    const headers = await getAuthHeaders()
    await $fetch('/api/master-update-peserta', {
      method: 'POST',
      headers,
      body: { ids: selectedPeserta.value }
    })
    
    if (window.Swal) window.Swal.fire('Berhasil!', 'Berhasil dicairkan ke saldo EO!', 'success')
    selectedPeserta.value = []
    await muatData()
  } catch (err) { 
    if (window.Swal) window.Swal.fire('Gagal', err.message, 'error')
  } finally { isProcessing.value = false }
}

const tandaiSelesai = async (id) => {
  if (window.Swal) {
    const res = await window.Swal.fire({
      title: 'Tandai Selesai?',
      text: 'Apakah kamu sudah men-transfer uang ini ke rekening EO?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Selesai'
    })
    if (!res.isConfirmed) return
  } else {
    if (!confirm('Apakah kamu sudah men-transfer uang ini ke rekening EO? Yakin tandai selesai?')) return
  }

  isProcessing.value = true
  try {
    const headers = await getAuthHeaders()
    await $fetch('/api/master-update-withdrawal', {
      method: 'POST',
      headers,
      body: { id: id, status: 'SELESAI' }
    })
    if (window.Swal) window.Swal.fire('Berhasil!', 'Berhasil ditandai Selesai!', 'success')
    await muatData()
  } catch (err) { 
    if (window.Swal) window.Swal.fire('Gagal', err.message, 'error')
  } finally { 
    isProcessing.value = false 
  }
}

const formatRupiah = (angka) => Number(angka).toLocaleString('id-ID')
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const muatGatewayData = async () => {
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch('/api/master-gateway', { headers })
    if (res) {
      gatewaySettings.value = {
        is_emergency_backup: res.is_emergency_backup === true,
        emergency_message: res.emergency_message || '',
        updated_by: res.updated_by || '',
        updated_at: res.updated_at || null
      }
    }
  } catch (err) {
    console.error('Gagal memuat status gateway:', err)
  }
}

const handleToggleGateway = async (newValue) => {
  const actionText = newValue 
    ? 'MENGAKTIFKAN MODE DARURAT (Transfer Manual). Seluruh transaksi online otomatis ESPay akan dialihkan ke Transfer Manual.' 
    : 'MEMATIKAN MODE DARURAT. Sistem pembayaran akan kembali NORMAL menggunakan ESPay Direct API (QRIS & VA).'

  let confirmed = false
  if (window.Swal) {
    const res = await window.Swal.fire({
      title: newValue ? 'Aktifkan Mode Darurat?' : 'Kembali ke Normal?',
      text: actionText,
      icon: newValue ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: newValue ? 'Ya, Aktifkan Darurat' : 'Ya, Kembali Normal',
      confirmButtonColor: newValue ? '#DC2626' : '#10B981'
    })
    confirmed = res.isConfirmed
  } else {
    confirmed = confirm(`Konfirmasi: ${actionText}`)
  }

  if (!confirmed) {
    // Kembalikan saklar toggle
    gatewaySettings.value.is_emergency_backup = !newValue
    return
  }

  isUpdatingGateway.value = true
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch('/api/master-gateway', {
      method: 'POST',
      headers,
      body: {
        is_emergency_backup: newValue,
        emergency_message: gatewaySettings.value.emergency_message
      }
    })
    gatewaySettings.value.is_emergency_backup = newValue
    if (res?.data) {
      gatewaySettings.value.updated_by = res.data.updated_by
      gatewaySettings.value.updated_at = res.data.updated_at
    }
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil Diubah',
        text: newValue ? 'Mode Darurat aktif! Semua transaksi checkout sekarang dialihkan ke manual.' : 'Sistem kembali Normal! ESPay Direct API aktif.'
      })
    }
  } catch (err) {
    gatewaySettings.value.is_emergency_backup = !newValue
    if (window.Swal) window.Swal.fire('Gagal', err.message, 'error')
    else alert('Gagal: ' + err.message)
  } finally {
    isUpdatingGateway.value = false
  }
}

const simpanPesanGateway = async () => {
  isUpdatingGateway.value = true
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch('/api/master-gateway', {
      method: 'POST',
      headers,
      body: {
        is_emergency_backup: gatewaySettings.value.is_emergency_backup,
        emergency_message: gatewaySettings.value.emergency_message
      }
    })
    if (res?.data) {
      gatewaySettings.value.updated_by = res.data.updated_by
      gatewaySettings.value.updated_at = res.data.updated_at
    }
    if (window.Swal) window.Swal.fire('Tersimpan', 'Pesan pemberitahuan checkout berhasil disimpan.', 'success')
  } catch (err) {
    if (window.Swal) window.Swal.fire('Gagal', err.message, 'error')
    else alert('Gagal: ' + err.message)
  } finally {
    isUpdatingGateway.value = false
  }
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
.btn-action:not(:disabled):hover { background: var(--primary-hover); }

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

/* TAB 3 GATEWAY STYLES */
.tab-icon-svg { width: 16px; height: 16px; display: inline-block; vertical-align: -2px; margin-right: 4px; }
.gateway-live-status { display: flex; align-items: center; }
.badge-danger-glow { display: inline-flex; align-items: center; gap: 8px; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.badge-success-glow { display: inline-flex; align-items: center; gap: 8px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.status-dot-red { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444; }
.status-dot-green { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; }

.gateway-control-panel { display: flex; flex-direction: column; gap: 20px; }
.gateway-banner { display: flex; gap: 16px; padding: 20px; border-radius: 14px; border: 1px solid; }
.banner-normal { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
.banner-emergency { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
.banner-icon-box { flex-shrink: 0; }
.banner-svg { width: 32px; height: 32px; }
.icon-alert { color: #dc2626; }
.icon-shield { color: #16a34a; }
.banner-info h3 { margin: 0 0 6px 0; font-size: 17px; font-weight: 700; color: inherit; }
.banner-info p { margin: 0; font-size: 13.5px; line-height: 1.5; color: inherit; opacity: 0.9; }

.switch-card { border: 1px solid var(--border-soft); border-radius: 14px; padding: 20px; background: #ffffff; }
.switch-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border-soft); }
.switch-desc h4 { margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #0f172a; }
.switch-desc p { margin: 0; font-size: 13px; color: var(--text-muted); max-width: 650px; }

/* TOGGLE SWITCH */
.toggle-switch { position: relative; display: inline-block; width: 56px; height: 30px; cursor: pointer; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 30px; }
.toggle-slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
input:checked + .toggle-slider { background-color: #ef4444; }
input:focus + .toggle-slider { box-shadow: 0 0 1px #ef4444; }
input:checked + .toggle-slider:before { transform: translateX(26px); }

.emergency-msg-box { margin-top: 18px; }
.input-label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px; }
.form-textarea-custom { width: 100%; border: 1px solid var(--border-soft); border-radius: 8px; padding: 10px 12px; font-family: inherit; font-size: 13.5px; color: #1e293b; resize: vertical; box-sizing: border-box; }
.form-textarea-custom:focus { outline: none; border-color: var(--accent-main); }
.msg-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.btn-save-msg { background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-save-msg:hover:not(:disabled) { background: #1e293b; }
.btn-save-msg:disabled { opacity: 0.6; cursor: not-allowed; }

/* SIMULATOR QUICK LINK CARD */
.simulator-card { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px; border-radius: 14px; background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 1px solid #bfdbfe; margin-top: 4px; }
.simulator-card-content { display: flex; gap: 16px; align-items: center; }
.simulator-icon-box { width: 44px; height: 44px; border-radius: 12px; background: #1e40af; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(30, 64, 175, 0.25); }
.simulator-svg { width: 24px; height: 24px; }
.simulator-text h4 { margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #1e3a8a; }
.simulator-text p { margin: 0; font-size: 13px; color: #475569; line-height: 1.45; max-width: 620px; }
.btn-open-simulator { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; background: #1e3a8a; color: white; border-radius: 10px; font-size: 13.5px; font-weight: 700; text-decoration: none; transition: 0.2s; white-space: nowrap; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.25); }
.btn-open-simulator:hover { background: #1d4ed8; transform: translateY(-1px); }
.btn-arrow-svg { width: 16px; height: 16px; }

@media(max-width: 768px) {
  .simulator-card { flex-direction: column; align-items: flex-start; }
  .btn-open-simulator { width: 100%; justify-content: center; }
}

/* TAB 4: BACKUP QUEUE STYLES */
.tab-badge-count {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 12px;
  margin-left: 6px;
  display: inline-block;
  line-height: 1.2;
}

.btn-refresh-backup {
  background: white;
  border: 1px solid var(--border-soft);
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-refresh-backup:hover:not(:disabled) {
  background: #f1f5f9;
  color: var(--primary);
}

.btn-refresh-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.order-id-badge code {
  background: #f1f5f9;
  color: #1e293b;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
}

.text-orange {
  color: #ea580c;
  font-weight: 800;
}

.proof-thumb-box {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  background: #f8fafc;
  transition: 0.2s;
}

.proof-thumb-box:hover {
  border-color: var(--accent-main);
  transform: scale(1.04);
}

.proof-thumb {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 6px;
}

.proof-thumb-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--accent-main);
}

.action-btn-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.btn-action-verify {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-action-verify:hover:not(:disabled) {
  background: #059669;
}

.btn-action-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action-reject {
  background: transparent;
  color: #ef4444;
  border: 1px solid #fecaca;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-action-reject:hover:not(:disabled) {
  background: #fee2e2;
}

/* MODAL PRATINJAU BUKTI STRUK */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-dialog {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);
}

.modal-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.modal-subtitle {
  margin: 3px 0 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.btn-close-modal {
  background: none;
  border: none;
  font-size: 26px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.btn-close-modal:hover {
  color: #0f172a;
}

.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
  text-align: center;
}

.modal-nominal-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
}

.modal-image-wrapper {
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  padding: 8px;
}

.modal-full-img {
  max-width: 100%;
  max-height: 52vh;
  object-fit: contain;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid var(--border-soft);
  background: #f8fafc;
  gap: 12px;
}

.btn-open-external {
  font-size: 12px;
  color: var(--accent-main);
  text-decoration: none;
  font-weight: 600;
}

.btn-open-external:hover {
  text-decoration: underline;
}

.modal-action-buttons {
  display: flex;
  gap: 8px;
}

.btn-modal-reject {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-modal-reject:hover {
  background: #fecaca;
}

.btn-modal-verify {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-modal-verify:hover {
  background: #059669;
}
</style>
