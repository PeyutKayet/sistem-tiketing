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
          <label class="form-label">Harga</label>
          <div style="position:relative; display:flex; align-items:center;">
            <span style="position:absolute; left:14px; color:#8a9aa8; font-weight:600;">Rp</span>
            <input type="text" v-model="formBaru.harga" placeholder="0" class="form-control" style="padding-left:42px;" @input="formatRupiahInput" />
          </div>
        </div>
        <div class="col"><label class="form-label">Kuota</label><input type="number" v-model="formBaru.kuota" placeholder="50" class="form-control" /></div>
      </div>
      <div class="row">
        <div class="col"><label class="form-label">Buka</label><input type="datetime-local" v-model="formBaru.buka" class="form-control" /></div>
        <div class="col"><label class="form-label">Tutup</label><input type="datetime-local" v-model="formBaru.tutup" class="form-control" /></div>
        <div class="col" style="display:flex;align-items:flex-end;gap:8px;">
          <button class="btn-primary" @click="simpanTiketBaru" :disabled="isSaving" style="padding:10px 22px;">💾 Simpan</button>
          <button class="btn-outline" @click="resetFormBaru" style="padding:10px 22px;">🔄 Reset</button>
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
              <td>{{ t.nama_kategori }}</td>
              <td>{{ formatRupiah(t.harga) }}</td>
              <td>{{ t.kuota_maksimal }}</td>
              <td>{{ t.kuota_maksimal - t.terjual }}</td>
              <td>{{ t.terjual }}</td>
              <td>
                <button class="btn-icon" @click="bukaEditTiket(t)" title="Edit"><Icon name="lucide:edit" style="margin-right:4px;" /></button>
                <button class="btn-icon danger" @click="hapusTiket(t.id)" title="Hapus">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <h4 style="margin-bottom:10px;font-weight:600;color:#0a1929;">📊 Statistik Tiket</h4>
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
        <label class="form-label">Harga</label>
        <div style="position:relative; display:flex; align-items:center; margin-bottom:10px;">
          <span style="position:absolute; left:14px; color:#8a9aa8; font-weight:600;">Rp</span>
          <input type="text" v-model="formEdit.harga" placeholder="0" class="form-control" style="padding-left:42px;" @input="formatRupiahInputEdit" />
        </div>
        <label class="form-label">Kuota</label><input type="number" v-model="formEdit.kuota" class="form-control" style="margin-bottom:10px;" />
        <div class="row">
          <div class="col"><label class="form-label">Buka</label><input type="datetime-local" v-model="formEdit.buka" class="form-control" /></div>
          <div class="col"><label class="form-label">Tutup</label><input type="datetime-local" v-model="formEdit.tutup" class="form-control" /></div>
        </div>
        <div class="flex" style="margin-top:16px;">
          <button class="btn-primary" @click="simpanEditTiket" :disabled="isSavingEdit" style="padding:10px 32px;">💾 Simpan</button>
          <button class="btn-outline" @click="showEditPopup = false">❌ Batal</button>
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

const formBaru = ref({ nama: '', harga: '', kuota: '', buka: '', tutup: '' })
const formEdit = ref({ id: null, nama: '', harga: '', kuota: '', buka: '', tutup: '' })

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

const resetFormBaru = () => { formBaru.value = { nama: '', harga: '', kuota: '', buka: '', tutup: '' } }

const muatDaftarTiket = async () => {
  if (!selectedEvent.value) return
  isLoadingTiket.value = true
  try {
    const { data: tiketData, error } = await supabase.from('kategori_tiket').select('*').eq('event_id', selectedEvent.value.id).order('created_at', { ascending: true })
    if (error) throw error
    
    const { data: pesertaData } = await supabase.from('peserta').select('nama_tiket').eq('event_id', selectedEvent.value.id).eq('status_bayar', 'paid')
    
    daftarTiket.value = (tiketData || []).map(t => {
      const terjual = (pesertaData || []).filter(p => p.nama_tiket === t.nama_kategori).length
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
  if (!formBaru.value.nama || !formBaru.value.kuota) {
    showToast('Nama dan Kuota wajib diisi!', 'error')
    return
  }
  isSaving.value = true
  try {
    const hargaRaw = parseInt(formBaru.value.harga.replace(/\./g, '')) || 0
    const payload = {
      event_id: selectedEvent.value.id,
      nama_kategori: formBaru.value.nama,
      harga: hargaRaw,
      kuota_maksimal: parseInt(formBaru.value.kuota),
      tanggal_mulai_penjualan: formBaru.value.buka ? formBaru.value.buka + ':00' : null,
      tanggal_selesai_penjualan: formBaru.value.tutup ? formBaru.value.tutup + ':00' : null
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
    harga: t.harga ? t.harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0",
    kuota: t.kuota_maksimal,
    buka: t.tanggal_mulai_penjualan ? t.tanggal_mulai_penjualan.substring(0, 16) : '',
    tutup: t.tanggal_selesai_penjualan ? t.tanggal_selesai_penjualan.substring(0, 16) : ''
  }
  showEditPopup.value = true
}

const simpanEditTiket = async () => {
  isSavingEdit.value = true
  try {
    const hargaRaw = parseInt(formEdit.value.harga.replace(/\./g, '')) || 0
    const payload = {
      nama_kategori: formEdit.value.nama,
      harga: hargaRaw,
      kuota_maksimal: parseInt(formEdit.value.kuota),
      tanggal_mulai_penjualan: formEdit.value.buka ? formEdit.value.buka + ':00' : null,
      tanggal_selesai_penjualan: formEdit.value.tutup ? formEdit.value.tutup + ':00' : null
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
