<template>
<div>
  <div id="page-tiket" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title"><Icon name="lucide:ticket" style="margin-right:4px;" /> Tiket <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="useRouter().push('/admin/event/' + selectedEvent.slug)"><Icon name="lucide:arrow-left" style="margin-right:4px;" /> Kembali</button>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:12px;font-weight:600;color:#0a1929;"><Icon name="lucide:edit-3" style="margin-right:4px;" /> Tambah Tiket Baru</h4>
      <div class="row mb-3">
        <div class="col"><label class="form-label">Nama Tiket</label><input type="text" v-model="formBaru.nama" placeholder="VIP" class="form-control" /></div>
        <div class="col">
          <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Harga</span>
            <label style="font-size:11px; cursor:pointer; font-weight:normal; margin:0;"><input type="checkbox" v-model="formBaru.is_gratis" style="margin:0 4px 0 0;" /> Gratis</label>
          </label>
          <div v-if="!formBaru.is_gratis" style="position:relative; display:flex; align-items:center;">
            <span style="position:absolute; left:14px; color:#8a9aa8; font-weight:600;">Rp</span>
            <input type="text" v-model="formBaru.harga" placeholder="0" class="form-control" style="padding-left:42px;" @input="formatRupiahInput" />
          </div>
          <div v-else class="form-control" style="background:#f8fafc; color:#10b981; font-weight:600; text-align:center;">Gratis</div>
          <small v-if="!formBaru.is_gratis" style="font-size:11px; color:#15803d; margin-top:4px; display:block;">✨ Harga tiket masuk ke saldo Anda tanpa biaya tersembunyi. Biaya transaksi ditanggung pembeli.</small>
        </div>
        <div class="col">
          <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Kuota</span>
            <label style="font-size:11px; cursor:pointer; font-weight:normal; margin:0;"><input type="checkbox" v-model="formBaru.is_unlimited" style="margin:0 4px 0 0;" /> Unlimited</label>
          </label>
          <input v-if="!formBaru.is_unlimited" type="number" v-model="formBaru.kuota" placeholder="50" class="form-control" />
          <div v-else class="form-control" style="background:#f8fafc; color:#8a9aa8; text-align:center; font-style:italic;">Tidak Terbatas</div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col" style="flex:1;">
          <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Waktu Penjualan</span>
            <label style="font-size:11px; cursor:pointer; font-weight:normal; margin:0;"><input type="checkbox" v-model="formBaru.is_no_time_limit" style="margin:0 4px 0 0;" /> Bebas (Tanpa Batas)</label>
          </label>
          
          <div v-if="!formBaru.is_no_time_limit" style="display:flex; gap:12px;">
            <div style="flex:1; position:relative; display:flex; align-items:center; cursor:pointer;">
              <Icon name="lucide:calendar-clock" style="position:absolute; left:12px; color:#8a9aa8; font-size:14px; z-index:2; pointer-events:none;" />
              <div class="form-control" style="padding-left:34px; display:flex; align-items:center; font-size:12px;">
                <span v-if="!formBaru.buka" style="color:#8a9aa8;">Waktu Buka...</span>
                <span v-else style="color:#0f172a; font-weight:500;">{{ formatDateTimeKustom(formBaru.buka) }}</span>
              </div>
              <input type="datetime-local" v-model="formBaru.buka" style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:3;" />
            </div>
            <div style="flex:1; position:relative; display:flex; align-items:center; cursor:pointer;">
              <Icon name="lucide:calendar-clock" style="position:absolute; left:12px; color:#8a9aa8; font-size:14px; z-index:2; pointer-events:none;" />
              <div class="form-control" style="padding-left:34px; display:flex; align-items:center; font-size:12px;">
                <span v-if="!formBaru.tutup" style="color:#8a9aa8;">Waktu Tutup...</span>
                <span v-else style="color:#0f172a; font-weight:500;">{{ formatDateTimeKustom(formBaru.tutup) }}</span>
              </div>
              <input type="datetime-local" v-model="formBaru.tutup" style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:3;" />
            </div>
          </div>
          <div v-else class="form-control" style="background:#f8fafc; color:#8a9aa8; text-align:center; font-style:italic; font-size:12px;">
            Tiket bebas dibeli kapan saja tanpa dibatasi waktu buka/tutup.
          </div>
        </div>
      </div>
      <div class="row" style="margin-top:12px;">
        <div class="col" style="display:flex; flex-direction:column; gap:8px;">
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e;">
            <div class="switch-admin" style="margin:0; width:34px;">
              <input type="checkbox" v-model="formBaru.is_hidden" />
              <span class="slider-admin round-admin"></span>
            </div>
            Tiket Privat (Hanya via link)
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e;">
            <div class="switch-admin" style="margin:0; width:34px;">
              <input type="checkbox" v-model="formBaru.is_active" />
              <span class="slider-admin round-admin"></span>
            </div>
            {{ formBaru.is_active !== false ? 'Aktifkan Tiket' : 'Nonaktifkan Tiket' }}
          </label>
        </div>
        <div class="col" style="display:flex;align-items:flex-end;justify-content:flex-end;gap:8px;">
          <button class="btn-primary" @click="simpanTiketBaru" :disabled="isSaving" style="padding:10px 22px;"><Icon name="lucide:save" style="margin-right:4px; font-size:16px;" /> Simpan</button>
          <button class="btn-outline" @click="resetFormBaru" style="padding:10px 22px;"><Icon name="lucide:rotate-ccw" style="margin-right:4px; font-size:16px;" /> Reset</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:10px;font-weight:600;color:#0a1929;"><Icon name="lucide:clipboard-list" style="margin-right:4px;" /> Daftar Tiket</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Harga</th><th>Kuota</th><th>Sisa</th><th>Terjual</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-if="isLoadingTiket"><td colspan="6" style="text-align:center; color:#8a9aa8;"><Icon name="lucide:hourglass" style="margin-right:4px;" /> Memuat data tiket...</td></tr>
            <tr v-else-if="daftarTiket.length === 0"><td colspan="6" style="text-align:center; color:#8a9aa8;">Belum ada tiket.</td></tr>
            <tr v-for="t in daftarTiket" :key="t.id">
              <td>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span :style="{ opacity: t.is_active === false ? 0.5 : 1 }">{{ t.nama_kategori }}</span>
                  <span v-if="t.is_active === false" style="background:#fee2e2; color:#ef4444; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:600;">Nonaktif</span>
                  <span v-if="t.is_hidden" style="background:#f1f5f9; color:#64748b; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:600;"><Icon name="lucide:eye-off" style="font-size:10px; margin-right:2px;" /> Privat</span>
                </div>
              </td>
              <td>{{ formatRupiah(t.harga) }}</td>
              <td>
                <span v-if="t.kuota_maksimal == 0" style="color:#8a9aa8;font-style:italic;">~</span>
                <span v-else>{{ t.kuota_maksimal }}</span>
              </td>
              <td>
                <span v-if="t.kuota_maksimal == 0" style="color:#8a9aa8;font-style:italic;">Tidak Terbatas</span>
                <span v-else>{{ t.kuota_maksimal - t.terjual }}</span>
              </td>
              <td>{{ t.terjual }}</td>
              <td style="display:flex; gap:8px; align-items:center;">
                <!-- Toggle Aktif/Nonaktif -->
                <label class="switch-admin" :title="t.is_active !== false ? 'Nonaktifkan Tiket' : 'Aktifkan Tiket'">
                  <input type="checkbox" :checked="t.is_active !== false" @change="toggleTiketStatus(t)" />
                  <span class="slider-admin round-admin"></span>
                </label>
                
                <div style="width:1px; height:20px; background:#e2e8f0; margin:0 2px;"></div>

                <button v-if="t.is_hidden" class="btn-icon" @click="copySecretLink(t)" title="Copy Link Privat" style="color:var(--primary);"><Icon name="lucide:link" style="margin-right:4px;" /></button>
                <button class="btn-icon" @click="bukaEditTiket(t)" title="Edit"><Icon name="lucide:edit" style="margin-right:4px;" /></button>
                <button v-if="t.terjual === 0" class="btn-icon danger" @click="hapusTiket(t.id)" title="Hapus"><Icon name="lucide:trash-2" /></button>
                <button v-else class="btn-icon" title="Tiket yang sudah terjual tidak bisa dihapus" style="opacity:0.3; cursor:not-allowed;"><Icon name="lucide:trash-2" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:10px;font-weight:600;color:#0a1929;"><Icon name="lucide:bar-chart-2" style="margin-right:6px; color:var(--primary);" /> Statistik Tiket</h4>
      <div class="stats-grid" style="margin:0;">
        <div class="stat-card"><div class="label">Total Tiket</div><div class="value">{{ totalKapasitas }}</div></div>
        <div class="stat-card"><div class="label">Terjual</div><div class="value">{{ totalTerjual }}</div></div>
        <div class="stat-card"><div class="label">Pendapatan</div><div class="value">{{ formatRupiah(totalPendapatan) }}</div></div>
      </div>
    </div>

    <!-- POPUP EDIT TIKET -->
    <div class="wizard-overlay" :class="{ open: showEditPopup }">
      <div class="wizard" style="max-width:540px;padding:28px 32px;height:auto;">
        <button class="close" @click="showEditPopup = false">✖</button>
        <h3 style="margin-bottom:16px;font-weight:600;color:#0a1929;"><Icon name="lucide:edit" style="margin-right:4px;" /> Edit Tiket</h3>
        <label class="form-label">Nama Tiket</label><input type="text" v-model="formEdit.nama" class="form-control" style="margin-bottom:10px;" />
        <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
          <span>Harga</span>
          <label style="font-size:11px; cursor:pointer; font-weight:normal; margin:0;"><input type="checkbox" v-model="formEdit.is_gratis" style="margin:0 4px 0 0;" /> Gratis</label>
        </label>
        <div v-if="!formEdit.is_gratis" style="position:relative; display:flex; align-items:center; margin-bottom:6px;">
          <span style="position:absolute; left:14px; color:#8a9aa8; font-weight:600;">Rp</span>
          <input type="text" v-model="formEdit.harga" placeholder="0" class="form-control" style="padding-left:42px;" @input="formatRupiahInputEdit" />
        </div>
        <div v-else class="form-control" style="background:#f8fafc; color:#10b981; font-weight:600; text-align:center; margin-bottom:10px;">Gratis</div>
        <small v-if="!formEdit.is_gratis" style="font-size:11px; color:#15803d; margin-top:-2px; margin-bottom:10px; display:block;">✨ Harga tiket masuk ke saldo Anda tanpa biaya tersembunyi. Biaya transaksi ditanggung pembeli.</small>
        
        <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
          <span>Kuota</span>
          <label style="font-size:11px; cursor:pointer; font-weight:normal; margin:0;"><input type="checkbox" v-model="formEdit.is_unlimited" style="margin:0 4px 0 0;" /> Unlimited</label>
        </label>
        <input v-if="!formEdit.is_unlimited" type="number" v-model="formEdit.kuota" class="form-control" style="margin-bottom:10px;" />
        <div v-else class="form-control" style="background:#f8fafc; color:#8a9aa8; text-align:center; font-style:italic; margin-bottom:10px;">Tidak Terbatas</div>
        <div class="row mb-3">
        <div class="col" style="flex:1;">
          <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Waktu Penjualan</span>
            <label style="font-size:11px; cursor:pointer; font-weight:normal; margin:0;"><input type="checkbox" v-model="formEdit.is_no_time_limit" style="margin:0 4px 0 0;" /> Bebas (Tanpa Batas)</label>
          </label>
          
          <div v-if="!formEdit.is_no_time_limit" style="display:flex; gap:12px;">
            <div style="flex:1; position:relative; display:flex; align-items:center; cursor:pointer;">
              <Icon name="lucide:calendar-clock" style="position:absolute; left:12px; color:#8a9aa8; font-size:14px; z-index:2; pointer-events:none;" />
              <div class="form-control" style="padding-left:34px; display:flex; align-items:center; font-size:12px;">
                <span v-if="!formEdit.buka" style="color:#8a9aa8;">Waktu Buka...</span>
                <span v-else style="color:#0f172a; font-weight:500;">{{ formatDateTimeKustom(formEdit.buka) }}</span>
              </div>
              <input type="datetime-local" v-model="formEdit.buka" style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:3;" />
            </div>
            <div style="flex:1; position:relative; display:flex; align-items:center; cursor:pointer;">
              <Icon name="lucide:calendar-clock" style="position:absolute; left:12px; color:#8a9aa8; font-size:14px; z-index:2; pointer-events:none;" />
              <div class="form-control" style="padding-left:34px; display:flex; align-items:center; font-size:12px;">
                <span v-if="!formEdit.tutup" style="color:#8a9aa8;">Waktu Tutup...</span>
                <span v-else style="color:#0f172a; font-weight:500;">{{ formatDateTimeKustom(formEdit.tutup) }}</span>
              </div>
              <input type="datetime-local" v-model="formEdit.tutup" style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:3;" />
            </div>
          </div>
          <div v-else class="form-control" style="background:#f8fafc; color:#8a9aa8; text-align:center; font-style:italic; font-size:12px;">
            Tiket bebas dibeli kapan saja tanpa dibatasi waktu buka/tutup.
          </div>
        </div>
      </div>
        
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e; margin-top:16px;">
          <input type="checkbox" v-model="formEdit.is_hidden" style="width:16px; height:16px;" />
          Tiket Privat (Hanya via link)
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e; margin-top:8px;">
          <div class="switch-admin" style="margin:0; width:34px;">
            <input type="checkbox" v-model="formEdit.is_active" />
            <span class="slider-admin round-admin"></span>
          </div>
          {{ formEdit.is_active !== false ? 'Aktifkan Tiket' : 'Nonaktifkan Tiket' }}
        </label>
        <div class="flex" style="margin-top:16px;">
          <button class="btn-primary" @click="simpanEditTiket" :disabled="isSavingEdit" style="padding:10px 32px;"><Icon name="lucide:save" style="margin-right:4px; font-size:16px;" /> Simpan</button>
          <button class="btn-outline" @click="showEditPopup = false"><Icon name="lucide:x" style="margin-right:4px; font-size:16px;" /> Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="loader-container" style="height: 100%; display: flex; align-items: center; justify-content: center;">
    <div style="text-align: center;">
      <div class="spinner" style="margin: 0 auto 12px auto;"></div>
      <div style="font-weight:500; font-size:13px; color:#8a9aa8;">Memuat data event...</div>
    </div>
  </div>
  <div v-else style="padding: 60px 20px; text-align: center; color: #8a9aa8;">
    <Icon name="lucide:file-question" style="font-size:48px; color:#c8d6e8; margin-bottom:12px; display:block; margin-inline:auto;" />
    <div style="font-size:16px; font-weight:600; color:#0a1929; margin-bottom:8px;">Event Tidak Ditemukan</div>
    Event yang Anda cari mungkin sudah dihapus atau URL tidak valid.<br/><br/>
    <button class="btn-primary" @click="useRouter().push('/admin')">Kembali ke Beranda</button>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const { isLoading, selectedEvent, activeTab, supabase, showToast, showConfirm } = useAdmin()

const daftarTiket = ref([])
const isLoadingTiket = ref(false)
const isSaving = ref(false)
const isSavingEdit = ref(false)
const showEditPopup = ref(false)

const formBaru = ref({ nama: '', harga: '', is_gratis: true, kuota: '', is_unlimited: false, is_hidden: false, is_active: true, buka: '', tutup: '', is_no_time_limit: false })
const formEdit = ref({ id: null, nama: '', harga: '', is_gratis: false, kuota: '', is_unlimited: false, is_hidden: false, is_active: true, buka: '', tutup: '', is_no_time_limit: false })

const totalKapasitas = computed(() => daftarTiket.value.reduce((acc, t) => acc + (parseInt(t.kuota_maksimal) || 0), 0))
const totalTerjual = computed(() => daftarTiket.value.reduce((acc, t) => acc + (t.terjual || 0), 0))
const totalPendapatan = computed(() => daftarTiket.value.reduce((acc, t) => acc + ((t.terjual || 0) * (parseInt(t.harga) || 0)), 0))

const formatRupiah = (angka) => {
  if (angka === 0) return 'GRATIS'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const parseRupiah = (val) => {
  if (!val) return '0'
  let str = val.toString().replace(/[^,\d]/g, '')
  let split = str.split(',')
  let sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi)
  if (ribuan) rupiah += (sisa ? '.' : '') + ribuan.join('.')
  return rupiah
}

const formatRupiahInput = (e) => { formBaru.value.harga = parseRupiah(e.target.value) }
const formatRupiahInputEdit = (e) => { formEdit.value.harga = parseRupiah(e.target.value) }

const formatDateTimeKustom = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { 
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date).replace(/\./g, ':');
}
const resetFormBaru = () => { formBaru.value = { nama: '', harga: '', is_gratis: true, kuota: '', is_unlimited: false, is_hidden: false, is_active: true, buka: '', tutup: '', is_no_time_limit: false } }

const muatDaftarTiket = async () => {
  if (!selectedEvent.value) return
  isLoadingTiket.value = true
  try {
    const { data: tiketData, error } = await supabase.from('kategori_tiket').select('*').eq('event_id', selectedEvent.value.id).order('created_at', { ascending: true })
    if (error) throw error
    
    const { data: salesData } = await supabase.rpc('get_ticket_sales', { p_event_id: selectedEvent.value.id })
    
    daftarTiket.value = (tiketData || []).map(t => {
      const sales = salesData?.find(s => s.kategori_id === t.id)
      const terjual = sales ? sales.terjual : 0
      return { ...t, terjual }
    })
  } catch (err) {
    showToast('Gagal memuat tiket: ' + err.message, 'error')
  } finally {
    isLoadingTiket.value = false
  }
}

watch(selectedEvent, () => {
  if (selectedEvent.value) muatDaftarTiket()
}, { immediate: true })

const simpanTiketBaru = async () => {
  if (!formBaru.value.nama) {
    showToast('Nama tiket wajib diisi!', 'error')
    return
  }
  if (!formBaru.value.is_gratis && (!formBaru.value.harga || parseInt(formBaru.value.harga.replace(/\./g, '')) === 0)) {
    showToast('Harga tiket berbayar wajib diisi dan lebih dari 0!', 'error')
    return
  }
  if (!formBaru.value.is_unlimited && !formBaru.value.kuota) {
    showToast('Kuota wajib diisi jika tidak unlimited!', 'error')
    return
  }
  if (!formBaru.value.is_no_time_limit) {
    if (!formBaru.value.buka || !formBaru.value.tutup) {
      showToast('Waktu buka dan tutup wajib diisi jika ada batas waktu!', 'error')
      return
    }
    if (new Date(formBaru.value.tutup) < new Date(formBaru.value.buka)) {
      showToast('Waktu tutup tidak boleh sebelum waktu buka!', 'error')
      return
    }
  }
  isSaving.value = true
  try {
    const hargaRaw = formBaru.value.is_gratis ? 0 : (parseInt(formBaru.value.harga.replace(/\./g, '')) || 0)
    const kuotaVal = formBaru.value.is_unlimited ? 0 : parseInt(formBaru.value.kuota)
    const payload = {
      event_id: selectedEvent.value.id,
      nama_kategori: formBaru.value.nama,
      harga: hargaRaw,
      kuota_maksimal: kuotaVal,
      is_active: formBaru.value.is_active !== false,
      is_hidden: formBaru.value.is_hidden,
      secret_token: formBaru.value.is_hidden ? Math.random().toString(36).substring(2, 10) : null,
      tanggal_mulai_penjualan: (!formBaru.value.is_no_time_limit && formBaru.value.buka) ? formBaru.value.buka + ':00' : null,
      tanggal_selesai_penjualan: (!formBaru.value.is_no_time_limit && formBaru.value.tutup) ? formBaru.value.tutup + ':00' : null
    }
    const { error } = await supabase.from('kategori_tiket').insert([payload])
    if (error) throw error
    
    showToast('Tiket baru berhasil ditambahkan!', 'success')
    resetFormBaru()
    await muatDaftarTiket()
  } catch (err) {
    showToast('Gagal menyimpan tiket: ' + err.message, 'error')
  } finally {
    isSaving.value = false
  }
}

const bukaEditTiket = (t) => {
  formEdit.value = {
    id: t.id,
    nama: t.nama_kategori,
    is_gratis: t.harga == 0,
    harga: t.harga ? t.harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "",
    is_unlimited: t.kuota_maksimal == 0,
    kuota: t.kuota_maksimal == 0 ? '' : t.kuota_maksimal,
    is_active: t.is_active !== false,
    is_hidden: !!t.is_hidden,
    secret_token: t.secret_token || '',
    buka: t.tanggal_mulai_penjualan ? t.tanggal_mulai_penjualan.substring(0, 16) : '',
    tutup: t.tanggal_selesai_penjualan ? t.tanggal_selesai_penjualan.substring(0, 16) : '',
    is_no_time_limit: !t.tanggal_mulai_penjualan && !t.tanggal_selesai_penjualan
  }
  showEditPopup.value = true
}

const simpanEditTiket = async () => {
  if (!formEdit.value.nama) {
    showToast('Nama tiket wajib diisi!', 'error')
    return
  }
  if (!formEdit.value.is_gratis && (!formEdit.value.harga || parseInt(formEdit.value.harga.replace(/\./g, '')) === 0)) {
    showToast('Harga tiket berbayar wajib diisi dan lebih dari 0!', 'error')
    return
  }
  if (!formEdit.value.is_unlimited && !formEdit.value.kuota) {
    showToast('Kuota wajib diisi jika tidak unlimited!', 'error')
    return
  }
  if (!formEdit.value.is_no_time_limit) {
    if (!formEdit.value.buka || !formEdit.value.tutup) {
      showToast('Waktu buka dan tutup wajib diisi jika ada batas waktu!', 'error')
      return
    }
    if (new Date(formEdit.value.tutup) < new Date(formEdit.value.buka)) {
      showToast('Waktu tutup tidak boleh sebelum waktu buka!', 'error')
      return
    }
  }
  isSavingEdit.value = true
  try {
    const hargaRaw = formEdit.value.is_gratis ? 0 : (parseInt(formEdit.value.harga.toString().replace(/\./g, '')) || 0)
    const kuotaVal = formEdit.value.is_unlimited ? 0 : parseInt(formEdit.value.kuota)
    const payload = {
      nama_kategori: formEdit.value.nama,
      harga: hargaRaw,
      kuota_maksimal: kuotaVal,
      is_active: formEdit.value.is_active !== false,
      is_hidden: formEdit.value.is_hidden,
      secret_token: formEdit.value.is_hidden ? (formEdit.value.secret_token || Math.random().toString(36).substring(2, 10)) : null,
      tanggal_mulai_penjualan: (!formEdit.value.is_no_time_limit && formEdit.value.buka) ? formEdit.value.buka + ':00' : null,
      tanggal_selesai_penjualan: (!formEdit.value.is_no_time_limit && formEdit.value.tutup) ? formEdit.value.tutup + ':00' : null
    }
    const { error } = await supabase.from('kategori_tiket').update(payload).eq('id', formEdit.value.id)
    if (error) throw error
    
    showToast('Tiket berhasil diupdate!', 'success')
    showEditPopup.value = false
    await muatDaftarTiket()
  } catch (err) {
    showToast('Gagal update tiket: ' + err.message, 'error')
  } finally {
    isSavingEdit.value = false
  }
}
const copySecretLink = (t) => {
  const url = `${window.location.origin}/${selectedEvent.value.slug}?secret=${t.secret_token}`
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link privat berhasil disalin!', 'success')
  }).catch(() => {
    showToast('Gagal menyalin link.', 'error')
  })
}



const toggleTiketStatus = async (t) => {
  const newStatus = t.is_active === false ? true : false
  try {
    const { error } = await supabase.from('kategori_tiket').update({ is_active: newStatus }).eq('id', t.id)
    if (error) throw error
    t.is_active = newStatus
    showToast(`Tiket berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`, 'success')
  } catch (err) {
    showToast('Gagal mengubah status: ' + err.message, 'error')
  }
}

const hapusTiket = (id) => {
  showConfirm('Hapus Tiket', 'Yakin ingin menghapus tiket ini?', 'Ya, Hapus', 'danger', async () => {
    try {
      const { error } = await supabase.from('kategori_tiket').delete().eq('id', id)
      if (error) throw error
      showToast('Tiket berhasil dihapus!', 'success')
      await muatDaftarTiket()
    } catch (err) {
      showToast('Gagal menghapus tiket: ' + err.message, 'error')
    }
  })
}
</script>
<style scoped>
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
  z-index: 5;
}

.switch-admin {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}
.switch-admin input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-admin .slider-admin {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.switch-admin .slider-admin:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
}
.switch-admin input:checked + .slider-admin {
  background-color: #10b981;
}
.switch-admin input:checked + .slider-admin:before {
  transform: translateX(14px);
}
.switch-admin .slider-admin.round-admin {
  border-radius: 20px;
}
.switch-admin .slider-admin.round-admin:before {
  border-radius: 50%;
}
</style>

