<template>
<div>
  <div id="page-peserta" v-if="selectedEvent">
    <div class="page-header">
      <h2 class="page-title"><Icon name="lucide:users" style="margin-right:4px;" /> Peserta <span>{{ selectedEvent.nama_event }}</span></h2>
      <button class="btn-outline" @click="useRouter().push('/admin/event/' + selectedEvent.slug)"><Icon name="lucide:arrow-left" style="margin-right:4px;" /> Kembali ke Event</button>
    </div>

    <div class="stats-grid" style="margin:0 0 18px 0;">
      <div class="stat-card"><div class="label">Total</div><div class="value">{{ totalPeserta }}</div></div>
      <div class="stat-card"><div class="label">Lunas</div><div class="value">{{ totalLunas }}</div></div>
      <div class="stat-card"><div class="label">Pending</div><div class="value">{{ totalPending }}</div></div>
      <div class="stat-card"><div class="label">Hadir</div><div class="value">{{ totalHadir }} <span style="font-size: 14px; font-weight: normal; color: #8a9aa8;">({{ persenHadir }}%)</span></div></div>
    </div>

    <div class="flex" style="margin-bottom:14px;flex-wrap:wrap;">
      <div style="position:relative; flex:1; min-width:180px;">
        <Icon name="lucide:search" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#8a9aa8; font-size:16px; pointer-events:none;" />
        <input type="text" v-model="searchQuery" placeholder="Cari Nama / Email / WA" class="filter-control" style="width:100%; padding-left:40px; box-sizing:border-box;" />
      </div>
      <select v-model="filterStatus" class="filter-control">
        <option value="semua">Semua Status</option>
        <option value="paid">Lunas</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Dibatalkan</option>
      </select>
      <select v-model="filterHadir" class="filter-control">
        <option value="semua">Semua Kehadiran</option>
        <option value="hadir">Hadir</option>
        <option value="belum">Belum</option>
      </select>
      <select v-model="filterTiket" class="filter-control">
        <option value="semua">Semua Tiket</option>
        <option v-for="t in daftarTiketOption" :key="t.id" :value="t.id">{{ t.nama_kategori }}</option>
      </select>
      <button class="btn-success" @click="downloadCSVPeserta"><Icon name="lucide:download" style="margin-right:4px;" /> CSV Peserta</button>
      <button class="btn-outline" @click="downloadCSVKeuangan" :disabled="isDownloadingKeuangan" style="background:#fff;"><Icon name="lucide:file-spreadsheet" style="margin-right:4px; color:#0284c7;" /> {{ isDownloadingKeuangan ? 'Menyiapkan...' : 'Rekap Keuangan CSV' }}</button>
    </div>

    <div class="table-wrap">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; min-width: 600px;">
        <thead style="background: #f7faff; border-bottom: 1px solid #e6edf5; text-align: left;">
          <tr>
            <th style="padding: 8px 12px;">Nama</th>
            <th style="padding: 8px 12px;">Email</th>
            <th style="padding: 8px 12px;">WhatsApp</th>
            <th style="padding: 8px 12px;">Tiket</th>
            <th style="padding: 8px 12px;">Status</th>
            <th style="padding: 8px 12px;">Aksi</th>
          </tr>
        </thead>
        <tbody :style="{ opacity: isLoadingPeserta ? 0.4 : 1, transition: 'opacity 0.2s ease-in-out', pointerEvents: isLoadingPeserta ? 'none' : 'auto' }">
          <tr v-if="isLoadingPeserta && daftarPeserta.length === 0">
            <td colspan="6" style="padding: 12px;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <div class="skeleton" style="height:24px; width:100%; border-radius:6px;"></div>
                <div class="skeleton" style="height:24px; width:100%; border-radius:6px;"></div>
                <div class="skeleton" style="height:24px; width:100%; border-radius:6px;"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="daftarPeserta.length === 0 && !isLoadingPeserta">
            <td colspan="6" style="text-align: center; padding: 20px; color: #8a9aa8;">Tidak ada data peserta yang cocok.</td>
          </tr>
          <tr v-for="p in daftarPeserta" :key="p.id" :class="{'row-cancelled': p.status_bayar === 'cancelled'}" style="border-bottom: 1px solid #f0f4fa; transition: background 0.2s;">
            <td style="padding: 8px 12px; font-weight: 500;" :style="p.status_bayar === 'cancelled' ? 'text-decoration: line-through; color: #94a3b8;' : ''">{{ p.nama_lengkap }}</td>
            <td style="padding: 8px 12px;">
              <span :style="p.status_bayar === 'cancelled' ? 'text-decoration: line-through; color: #94a3b8;' : ''">{{ p.email }}</span>
            </td>
            <td style="padding: 8px 12px;">
              <div style="display:flex; align-items:center; gap:6px;" :style="p.status_bayar === 'cancelled' ? 'opacity: 0.5; pointer-events: none;' : ''">
                <span :style="p.status_bayar === 'cancelled' ? 'text-decoration: line-through; color: #94a3b8;' : ''">{{ p.no_wa }}</span>
                <a v-if="p.no_wa" :href="formatWaLink(p.no_wa)" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; color:#16a34a; text-decoration:none; transition:0.2s;" title="Hubungi via WhatsApp">
                  <Icon name="mdi:whatsapp" style="font-size:16px;" />
                </a>
              </div>
            </td>
            <td style="padding: 8px 12px;" :style="p.status_bayar === 'cancelled' ? 'text-decoration: line-through; color: #94a3b8;' : ''">{{ p.nama_tiket }}</td>
            <td style="padding: 8px 12px;">
              <div class="custom-dropdown-container">
                <div 
                  class="status-badge-trigger"
                  :class="{
                    'active': p.status_bayar === 'paid',
                    'pending': p.status_bayar === 'pending',
                    'cancelled': p.status_bayar === 'cancelled'
                  }"
                  @click.stop="toggleDropdown(p.id)"
                >
                  {{ p.status_bayar === 'paid' ? 'Lunas' : (p.status_bayar === 'cancelled' ? 'Batal' : 'Pending') }}
                  <Icon name="lucide:chevron-down" style="font-size: 14px; margin-left: 4px;" />
                </div>
                
                <div v-if="activeDropdown === p.id" class="custom-dropdown-menu">
                  <div class="dropdown-item" @click.stop="ubahStatusPeserta(p.id, 'paid', p.nama_lengkap); activeDropdown = null">Lunas</div>
                  <div class="dropdown-item" @click.stop="ubahStatusPeserta(p.id, 'pending', p.nama_lengkap); activeDropdown = null">Pending</div>
                  <div class="dropdown-item" @click.stop="ubahStatusPeserta(p.id, 'cancelled', p.nama_lengkap); activeDropdown = null">Batal</div>
                </div>
              </div>
            </td>
            <td style="padding: 8px 12px; display: flex; gap: 6px; align-items: center;">
              <button @click="bukaDetail(p)" class="btn-outline btn-sm" style="padding: 4px 8px; font-size: 11px;"><Icon name="lucide:eye" style="margin-right:2px;" /> Detail</button>
              <button v-if="p.status_bayar === 'paid' && !p.is_scanned" @click="setHadir(p.id)" class="btn-primary btn-sm" style="padding: 4px 8px; font-size: 11px;"><Icon name="lucide:map-pin" style="margin-right:2px;" /> Check-in</button>
              <span v-if="p.is_scanned" style="color: #1a6a4a; font-weight: bold; font-size: 11px;">Hadir <Icon name="lucide:check" /></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- PAGINATION CONTROLS -->
    <div id="infoDataPeserta" class="flex" style="justify-content:space-between; align-items:center; margin-top:14px; flex-wrap:wrap; gap: 10px;">
      <div style="display:flex; align-items:center; gap: 12px;">
        <span class="text-muted" style="font-size: 14px;">Total Ditemukan: {{ pesertaTotalData }} peserta</span>
        <div style="display:flex; align-items:center; gap: 6px; border-left: 1px solid #e6edf5; padding-left: 12px;">
          <span style="font-size: 13px; color: #8a9aa8;">Tampilkan:</span>
          <select v-model="perPage" class="filter-control" style="padding: 4px 8px; font-size: 13px; height: auto;">
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
      <div style="display:flex; gap: 8px; align-items: center;">
        <button class="btn-outline btn-sm" :disabled="pesertaPage <= 1" @click="pesertaPage--"><Icon name="lucide:arrow-left" /></button>
        <span style="font-size: 14px; font-weight: 500;">Halaman {{ pesertaPage }} dari {{ totalPages }}</span>
        <button class="btn-outline btn-sm" :disabled="pesertaPage >= totalPages" @click="pesertaPage++"><Icon name="lucide:arrow-right" /></button>
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

    <!-- MODAL DETAIL PESERTA -->
    <div v-if="pesertaDetailData" class="modal-overlay" @click.self="tutupDetail">
      <div class="modal-content" style="max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; border-radius: 12px; background: white; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom: 1px solid #e6edf5; padding-bottom: 12px; position: sticky; top: -24px; background: white; z-index: 10; padding-top: 24px;">
          <h3 style="margin:0; font-size:18px; color:#0a1929;"><Icon name="lucide:user" style="margin-right:6px;" /> Detail Peserta</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <button v-if="!isEditing" @click="isEditing = true" class="btn-outline btn-sm" style="padding: 4px 10px;"><Icon name="lucide:edit" style="margin-right:4px;"/> Edit Data</button>
            <button v-if="isEditing" @click="isEditing = false" class="btn-outline btn-sm" style="padding: 4px 10px; color: #64748b;"><Icon name="lucide:x" style="margin-right:4px;"/> Batal</button>
            <button v-if="isEditing" @click="simpanEdit" class="btn-primary btn-sm" style="padding: 4px 10px;"><Icon name="lucide:save" style="margin-right:4px;"/> Simpan</button>
            <button @click="tutupDetail" style="background:none; border:none; font-size:20px; cursor:pointer; color:#8a9aa8; margin-left: 8px;"><Icon name="lucide:x" /></button>
          </div>
        </div>
        
        <div style="display:flex; gap: 24px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display:grid; grid-template-columns: 120px 1fr; gap: 12px; font-size:14px; margin-bottom: 16px; align-items: center;">
              <div style="color:#64748b; font-weight:600;">Nama Lengkap</div>
              <div style="color:#0f172a; font-weight:700;">
                <input v-if="isEditing" v-model="pesertaDetailData.nama_lengkap" class="filter-control" style="width: 100%; padding: 6px; font-size: 13px;" />
                <span v-else>{{ pesertaDetailData.nama_lengkap }}</span>
              </div>
              
              <div style="color:#64748b; font-weight:600;">Email</div>
              <div style="color:#0f172a;">
                <input v-if="isEditing" v-model="pesertaDetailData.email" class="filter-control" style="width: 100%; padding: 6px; font-size: 13px;" />
                <span v-else>{{ pesertaDetailData.email }}</span>
              </div>
              
              <div style="color:#64748b; font-weight:600;">No. WhatsApp</div>
              <div style="color:#0f172a;">
                <input v-if="isEditing" v-model="pesertaDetailData.no_wa" class="filter-control" style="width: 100%; padding: 6px; font-size: 13px;" />
                <span v-else>{{ pesertaDetailData.no_wa }}</span>
              </div>
              
              <div v-if="pesertaDetailData.data_tambahan && (pesertaDetailData.data_tambahan.lat || domisiliText !== '-')" style="color:#64748b; font-weight:600;">Domisili GPS</div>
              <div v-if="pesertaDetailData.data_tambahan && (pesertaDetailData.data_tambahan.lat || domisiliText !== '-')" style="color:#0f172a;">
                <span v-if="domisiliLoading" style="color:#8a9aa8;"><Icon name="lucide:loader-2" class="spin" style="margin-right:4px;" /> Melacak lokasi...</span>
                <span v-else>{{ domisiliText }}</span>
                <a v-if="pesertaDetailData.data_tambahan.lat && !isEditing" :href="`https://www.google.com/maps?q=${pesertaDetailData.data_tambahan.lat},${pesertaDetailData.data_tambahan.lon}`" target="_blank" style="margin-left:6px; color:var(--primary); font-size:12px; text-decoration:none;">(Buka Map)</a>
              </div>
              
              <div style="color:#64748b; font-weight:600;">Jenis Tiket</div>
              <div style="color:#0f172a; font-weight:700; color:var(--primary);">
                <div v-if="isEditing" style="position:relative; display:flex; align-items:center;">
                  <input :value="pesertaDetailData.nama_tiket" disabled class="filter-control" style="width: 100%; padding: 6px 30px 6px 6px; font-size: 13px; background-color: #f8fafc; color: #94a3b8; cursor: not-allowed; border: 1px solid #e2e8f0;" />
                  <Icon name="lucide:lock" size="14" style="position:absolute; right:8px; color:#cbd5e1;" />
                </div>
                <span v-else>{{ pesertaDetailData.nama_tiket }}</span>
              </div>

              <div style="color:#64748b; font-weight:600;">Order ID</div>
              <div style="color:#0f172a; font-family:monospace; font-weight:600; font-size:13px;">
                {{ pesertaDetailData.order_id || pesertaDetailData.data_tambahan?.order_id || '-' }}
              </div>

              <div style="color:#64748b; font-weight:600;">Harga Tiket</div>
              <div style="color:#0f172a; font-weight:700;">
                Rp {{ Number(pesertaDetailData.kategori_tiket?.harga || 0).toLocaleString('id-ID') }}
              </div>
              
              <div style="color:#64748b; font-weight:600;">Status Bayar</div>
              <div>
                <span v-if="pesertaDetailData.status_bayar === 'paid'" class="status-badge active" style="margin:0;">Lunas</span>
                <span v-else-if="pesertaDetailData.status_bayar === 'cancelled'" class="status-badge off" style="margin:0; background: #fee2e2; color: #991b1b;">Batal</span>
                <span v-else class="status-badge off" style="margin:0; background: #fdf0e4; color: #b8681a;">Pending</span>
              </div>

              <div style="color:#64748b; font-weight:600;">Status Hadir</div>
              <div style="color:#0f172a;">{{ pesertaDetailData.is_scanned ? 'Hadir (Checked-in)' : 'Belum Hadir' }}</div>
            </div>

            <div v-if="pesertaDetailData.data_tambahan && Object.keys(pesertaDetailData.data_tambahan).length > 0" style="background:#f8fafc; padding:16px; border-radius:12px; border:1px solid #e2e8f0;">
              <h4 style="margin:0 0 12px 0; font-size:13px; color:#475569; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Formulir Tambahan</h4>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <template v-for="(val, key) in pesertaDetailData.data_tambahan" :key="key">
                  <div v-if="!['lat', 'lon', 'payment', 'order_id', 'order id'].includes(key)" style="display:flex; flex-direction:column; gap:4px;">
                    <div style="display:flex; align-items:center; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">
                      {{ formatKey(key) }}
                      <button v-if="(key === 'ticket_id' || key === 'ticket id' || key === 'ticketId') && !isEditing" @click="kirimTiketWA" class="btn-primary btn-sm" style="margin-left: 8px; padding: 2px 8px; font-size: 10px; display:inline-flex; align-items:center;" :disabled="isSendingWA">
                        <Icon name="lucide:send" size="12" style="margin-right:4px;" /> {{ isSendingWA ? 'Mengirim...' : 'Kirim WA' }}
                      </button>
                    </div>
                    
                    <!-- EDIT MODE -->
                    <div v-if="isEditing">
                      <!-- Field yang bisa diedit -->
                      <input v-if="typeof val !== 'object' && !isUrl(val) && !isImageUrl(val) && !['ticket_id', 'ticket id', 'order_id', 'order id', 'infaqNominal'].includes(key)" v-model="pesertaDetailData.data_tambahan[key]" class="filter-control" style="width:100%; padding: 6px; font-size: 13px; border: 1px solid var(--primary); background-color: #fff;" />
                      
                      <!-- Field Teks/Angka yang Terkunci -->
                      <div v-else-if="typeof val !== 'object' && !isUrl(val) && !isImageUrl(val)" style="position:relative; display:flex; align-items:center;">
                        <input :value="formatValue(val, key)" disabled class="filter-control" style="width:100%; padding: 6px 30px 6px 6px; font-size: 13px; background-color: #f8fafc; color: #94a3b8; cursor: not-allowed; border: 1px solid #e2e8f0;" />
                        <Icon name="lucide:lock" size="14" style="position:absolute; right:8px; color:#cbd5e1;" />
                      </div>
                      
                      <!-- Field Objek (seperti Payment) Terkunci -->
                      <div v-else-if="typeof val === 'object' && val !== null" style="position:relative; display:flex; align-items:center;">
                        <input :value="formatValue(val, key)" disabled class="filter-control" style="width:100%; padding: 6px 30px 6px 6px; font-size: 13px; background-color: #f8fafc; color: #94a3b8; cursor: not-allowed; border: 1px solid #e2e8f0;" />
                        <Icon name="lucide:lock" size="14" style="position:absolute; right:8px; color:#cbd5e1;" />
                      </div>

                      <!-- Link/Gambar (Tidak bisa diubah teksnya) -->
                      <div v-else style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; color:#94a3b8; background:#f1f5f9; padding:4px 8px; border-radius:4px; border:1px solid #e2e8f0; cursor:not-allowed; display:inline-flex; align-items:center;"><Icon name="lucide:lock" size="12" style="margin-right:4px;" /> File/Tautan Terkunci</span>
                      </div>
                    </div>

                    <!-- VIEW MODE -->
                    <div v-else>
                      <div v-if="isImageUrl(val)">
                        <a :href="val" target="_blank" class="btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:6px; font-size:12px; text-decoration:none; color:var(--primary); border-color:var(--primary); background:#f8fafc;"><Icon name="lucide:image" size="14" /> Lihat Gambar</a>
                      </div>
                      <div v-else-if="isUrl(val)">
                        <a :href="val" target="_blank" class="btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:6px; font-size:12px; text-decoration:none; color:#10b981; border-color:#a7f3d0; background:#ecfdf5;"><Icon name="lucide:link" size="14" /> Buka Tautan</a>
                      </div>
                      <div v-else style="color:#0f172a; font-size:14px; font-weight:500; background:white; padding:8px 12px; border-radius:8px; border:1px solid #e2e8f0;">
                        {{ formatValue(val, key) }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          
          <div style="width: 250px; flex-shrink: 0;">
            <h4 style="margin:0 0 8px 0; font-size:13px; color:#475569; text-transform:uppercase; letter-spacing:0.5px;">Bukti Transfer</h4>
            <div v-if="pesertaDetailData.bukti_bayar_url && pesertaDetailData.bukti_bayar_url !== 'Tidak ada file' && pesertaDetailData.bukti_bayar_url.startsWith('http')">
              <a :href="pesertaDetailData.bukti_bayar_url" target="_blank" title="Klik untuk melihat ukuran penuh">
                <img :src="pesertaDetailData.bukti_bayar_url" style="width:100%; border-radius:8px; border:1px solid #e2e8f0; object-fit:cover; max-height: 350px; background:#f1f5f9;" alt="Bukti Transfer" />
              </a>
            </div>
            <div v-else style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; height: 150px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:13px;">
              Tidak ada bukti transfer
            </div>
          </div>
        </div>
        
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { isLoading, 
  selectedEvent, activeTab, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, 
  isLoadingPeserta, daftarPeserta, supabase, muatDaftarPeserta, showConfirm, showToast,
  pesertaPage, pesertaTotalData
} = useAdmin()

const activeDropdown = ref(null)
const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const closeDropdown = (e) => {
  if (!e.target.closest('.custom-dropdown-container')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const searchQuery = ref('')
const filterStatus = ref('semua')
const filterHadir = ref('semua')
const filterTiket = ref('semua')
const perPage = ref(20)

const daftarTiketOption = ref([])
watch(selectedEvent, async (newVal) => {
  if (newVal) {
    const { data } = await supabase.from('kategori_tiket').select('id, nama_kategori').eq('event_id', newVal.id)
    if (data) daftarTiketOption.value = data
  }
}, { immediate: true })

const pesertaDetailData = ref(null)
const domisiliLoading = ref(false)
const domisiliText = ref('')
const isEditing = ref(false)

const bukaDetail = async (p) => {
  // Gunakan JSON parse/stringify agar data tidak langsung terubah (copy by value)
  pesertaDetailData.value = JSON.parse(JSON.stringify(p))
  domisiliText.value = '-'
  isEditing.value = false
  
  if (p.data_tambahan && p.data_tambahan.lat && p.data_tambahan.lon) {
    domisiliLoading.value = true
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${p.data_tambahan.lat}&lon=${p.data_tambahan.lon}&format=json`)
      const data = await res.json()
      if (data && data.display_name) {
        let address = data.address
        let area = address.city || address.town || address.village || address.county || ''
        let province = address.state || ''
        domisiliText.value = (area ? area + ', ' : '') + province || data.display_name
      } else {
        domisiliText.value = 'Lokasi tidak ditemukan'
      }
    } catch (e) {
      domisiliText.value = 'Gagal memuat alamat'
    } finally {
      domisiliLoading.value = false
    }
  }
}
const tutupDetail = () => {
  pesertaDetailData.value = null
  isEditing.value = false
}

const simpanEdit = async () => {
  const p = pesertaDetailData.value
  showConfirm('Simpan Perubahan', 'Simpan perubahan data peserta ini?', 'Simpan', 'success', async () => {
    try {
      const { error } = await supabase.from('peserta').update({
        nama_lengkap: p.nama_lengkap,
        email: p.email,
        no_wa: p.no_wa,
        nama_tiket: p.nama_tiket,
        data_tambahan: p.data_tambahan
      }).eq('id', p.id)
      
      if (error) throw error
      showToast('Data berhasil disimpan!', 'success')
      isEditing.value = false
      await reloadData() // Refresh list
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    }
  })
}

const isSendingWA = ref(false)
const isDownloadingKeuangan = ref(false)
const kirimTiketWA = () => {
  const p = pesertaDetailData.value
  if (!p || !p.no_wa) {
    showToast('Nomor WhatsApp peserta tidak tersedia', 'warning')
    return
  }
  
  const ticketId = p.data_tambahan?.ticket_id || p.id
  const orderId = p.data_tambahan?.order_id || p.id
  
  let noWa = p.no_wa.replace(/\D/g, '')
  if (noWa.startsWith('0')) noWa = '62' + noWa.substring(1)
  
  const tiketUrl = `https://tyket.id/tiket/${orderId}`
  const pesan = `Halo ${p.nama_lengkap || 'Kak'},\n\nBerikut adalah e-Tiket Anda untuk event ${p.nama_tiket || ''}.\n\nTicket ID: *${ticketId}*\n\nSilakan cek detail tiket dan barcode Anda melalui tautan berikut:\n${tiketUrl}\n\nTerima kasih!`
  
  const waUrl = `https://api.whatsapp.com/send?phone=${noWa}&text=${encodeURIComponent(pesan)}`
  window.open(waUrl, '_blank')
}

const isUrl = (str) => {
  if (typeof str !== 'string') return false
  return str.startsWith('http://') || str.startsWith('https://')
}
const isImageUrl = (str) => {
  if (!isUrl(str)) return false
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(str) || str.includes('/storage/v1/object/public/')
}
const formatKey = (key) => {
  if (key === 'infaqNominal') return 'Jumlah Transfer'
  return key.replace(/_/g, ' ')
}
const formatValue = (val, key) => {
  if (key === 'infaqNominal' && !isNaN(val)) {
    return `Rp ${Number(val).toLocaleString('id-ID')}`
  }
  if (typeof val === 'object' && val !== null) {
    if (val.gateway) return `💳 Pembayaran Digital`
    return '-'
  }
  return val
}

const totalPages = computed(() => Math.ceil(pesertaTotalData.value / perPage.value) || 1)

const formatWaLink = (no) => {
  if (!no) return '#'
  let num = String(no).replace(/\D/g, '')
  if (num.startsWith('0')) num = '62' + num.substring(1)
  return `https://api.whatsapp.com/send?phone=${num}`
}


const reloadData = () => {
  muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, filterTiket.value, perPage.value)
}

let timeoutSearch = null
watch([pesertaPage, searchQuery, filterStatus, filterHadir, filterTiket, perPage], () => {
  if (pesertaPage.value > totalPages.value) pesertaPage.value = 1
  
  clearTimeout(timeoutSearch)
  timeoutSearch = setTimeout(() => {
    reloadData()
  }, 500)
})

const downloadCSVPeserta = async () => {
  if (pesertaTotalData.value === 0) {
    showToast('Tidak ada data peserta untuk diunduh.', 'warning')
    return
  }
  showToast('Menyiapkan file CSV...', 'success')
  
  try {
    let semuaData = []
    const limit = 1000
    let offset = 0
    let hasMore = true

    while (hasMore) {
      let req = supabase.from('peserta').select('nama_lengkap, email, no_wa, nama_tiket, status_bayar, is_scanned, data_tambahan, order_id, kategori_tiket (harga)').eq('event_id', selectedEvent.value.id)
      
      if (searchQuery.value) {
        req = req.or(`nama_lengkap.ilike.%${searchQuery.value}%,email.ilike.%${searchQuery.value}%,no_wa.ilike.%${searchQuery.value}%`)
      }
      if (filterStatus.value !== 'semua') req = req.eq('status_bayar', filterStatus.value)
      if (filterHadir.value === 'hadir') req = req.eq('is_scanned', true)
      else if (filterHadir.value === 'belum') req = req.eq('is_scanned', false)
      if (filterTiket.value !== 'semua') req = req.eq('kategori_id', filterTiket.value)

      const { data, error } = await req.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
      if (error) throw error

      if (data && data.length > 0) {
        semuaData = semuaData.concat(data)
        offset += limit
        if (data.length < limit) {
          hasMore = false // End of data
        }
      } else {
        hasMore = false
      }
    }

    // Kumpulkan kolom dinamis dari data_tambahan (Kecualikan data internal sistem seperti payment gateway & GPS)
    const internalKeys = ['payment', 'order_id', 'order id', 'lat', 'lon', 'ticket_id', 'ticket id', 'ticketId', 'infaqNominal']
    let extraKeys = new Set()
    semuaData.forEach(p => {
      if (p.data_tambahan && typeof p.data_tambahan === 'object') {
        Object.keys(p.data_tambahan).forEach(k => {
          if (!internalKeys.includes(k)) {
            extraKeys.add(k)
          }
        })
      }
    })
    const extraHeaders = Array.from(extraKeys)

    let csvContent = "data:text/csv;charset=utf-8,Nama Lengkap,Email,WhatsApp,Tiket,Harga Tiket,Infaq Donasi,Order ID,Status Bayar,Status Hadir"
    if (extraHeaders.length > 0) {
      csvContent += "," + extraHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(",")
    }
    csvContent += "\n"

    // Set untuk melacak order_id yang sudah diatribusikan infaqnya (MENCEGAH INFAQ BENGKAK PADA MULTI-TIKET)
    const seenOrdersForInfaq = new Set()

    semuaData.forEach(p => {
      // Gunakan kutip ganda untuk mencegah bentrok koma di dalam teks
      const nama = `"${(p.nama_lengkap || '').replace(/"/g, '""')}"`
      const email = `"${(p.email || '').replace(/"/g, '""')}"`
      const wa = `"${(p.no_wa || '').replace(/"/g, '""')}"`
      const tiket = `"${(p.nama_tiket || 'Tiket').replace(/"/g, '""')}"`
      const hargaTiket = p.kategori_tiket?.harga !== undefined ? p.kategori_tiket.harga : 0
      const statusBayar = p.status_bayar === 'paid' ? 'Lunas' : (p.status_bayar === 'cancelled' ? 'Batal' : 'Pending')
      const hadir = p.is_scanned ? 'Hadir' : 'Belum'
      
      const orderId = p.order_id || p.data_tambahan?.order_id || ''
      let infaq = 0
      if (orderId) {
        if (!seenOrdersForInfaq.has(orderId)) {
          seenOrdersForInfaq.add(orderId)
          infaq = Number(p.data_tambahan?.infaqNominal || 0)
        } else {
          infaq = 0 // Tiket ke-2 dst dalam 1 order dicatat 0 agar SUM di Excel tidak berlipat ganda
        }
      } else {
        infaq = Number(p.data_tambahan?.infaqNominal || 0)
      }

      const safeOrderId = `"${String(orderId).replace(/"/g, '""')}"`
      let row = `${nama},${email},${wa},${tiket},${hargaTiket},${infaq},${safeOrderId},${statusBayar},${hadir}`

      // Masukkan data tambahan formulir kustom
      extraHeaders.forEach(k => {
        let val = p.data_tambahan ? p.data_tambahan[k] : ''
        if (val === null || val === undefined) val = ''
        if (typeof val === 'object') {
           try { val = JSON.stringify(val) } catch(e) { val = String(val) }
        }
        val = `"${String(val).replace(/"/g, '""')}"`
        row += `,${val}`
      })

      csvContent += `${row}\n`
    })
    const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Data_Peserta_${selectedEvent.value.nama_event.replace(/ /g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('File CSV Peserta berhasil diunduh!', 'success')
  } catch (err) {
    showToast('Gagal menyiapkan CSV Peserta: ' + err.message, 'error')
  }
}

const downloadCSVKeuangan = async () => {
  if (!selectedEvent.value?.id) return
  isDownloadingKeuangan.value = true
  showToast('Menyiapkan Rekap Keuangan CSV...', 'success')

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('event_id', selectedEvent.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!orders || orders.length === 0) {
      showToast('Belum ada data transaksi/order untuk diunduh.', 'warning')
      return
    }

    let csvContent = "data:text/csv;charset=utf-8,Order ID,Tanggal Transaksi,Waktu Lunas,Nama Pemesan,Email,WhatsApp,Subtotal Tiket,Infaq Donasi,Biaya Admin,Biaya Gateway,Total Tagihan,Metode Pembayaran,Status Pembayaran,Status Dana\n"

    orders.forEach(o => {
      const orderId = `"${(o.id || '').replace(/"/g, '""')}"`
      const tgl = `"${o.created_at ? new Date(o.created_at).toLocaleString('id-ID') : '-'}"`
      const tglLunas = `"${o.paid_at ? new Date(o.paid_at).toLocaleString('id-ID') : '-'}"`
      const nama = `"${(o.pembeli_nama || '').replace(/"/g, '""')}"`
      const email = `"${(o.pembeli_email || '').replace(/"/g, '""')}"`
      const wa = `"${(o.pembeli_wa || '').replace(/"/g, '""')}"`
      const subtotal = o.subtotal_tiket || 0
      const infaq = o.nominal_infaq || 0
      const admin = o.biaya_admin || 0
      const gateway = o.biaya_gateway || 0
      const total = o.total_tagihan || 0
      const metode = `"${(o.metode_pembayaran || '-').replace(/"/g, '""')}"`
      const statusBayar = o.status_pembayaran === 'paid' ? 'Lunas' : (o.status_pembayaran === 'cancelled' ? 'Batal' : (o.status_pembayaran === 'expired' ? 'Kedaluwarsa' : 'Pending'))
      const statusDana = o.status_dana || 'PENDING'

      csvContent += `${orderId},${tgl},${tglLunas},${nama},${email},${wa},${subtotal},${infaq},${admin},${gateway},${total},${metode},${statusBayar},${statusDana}\n`
    })

    const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Rekap_Keuangan_${selectedEvent.value.nama_event.replace(/ /g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('File Rekap Keuangan CSV berhasil diunduh!', 'success')
  } catch (err) {
    showToast('Gagal mengunduh Rekap Keuangan: ' + err.message, 'error')
  } finally {
    isDownloadingKeuangan.value = false
  }
}

const ubahStatusPeserta = (id, statusBaru, namaLengkap) => {
  let labelStatus = statusBaru === 'paid' ? 'LUNAS' : (statusBaru === 'cancelled' ? 'DIBATALKAN' : 'PENDING');
  showConfirm('Ubah Status Tiket', `Yakin ingin mengubah status tiket ${namaLengkap} menjadi ${labelStatus}?`, 'Ya, Ubah', 'success', async () => {
    try {
      const { error } = await supabase.from('peserta').update({ 
        status_bayar: statusBaru
      }).eq('id', id)
      if (error) throw error
      showToast(`Status berhasil diubah menjadi ${labelStatus}!`, 'success')
      await muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, filterTiket.value, perPage.value)
    } catch (err) { 
      showToast('Gagal update status: ' + err.message, 'error') 
      await muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, filterTiket.value, perPage.value) // revert dropdown
    }
  }, async () => {
    // on cancel, just reload to revert the select value visually
    await muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, filterTiket.value, perPage.value)
  })
}

const setHadir = (id) => {
  showConfirm('Check-in Peserta', 'Verifikasi kehadiran: Proses Check-in peserta ini?', 'Ya, Check-in', 'success', async () => {
    try {
      const { error } = await supabase.from('peserta').update({ is_scanned: true }).eq('id', id)
      if (error) throw error
      showToast('Check-in berhasil!', 'success')
      await muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, filterTiket.value, perPage.value)
    } catch (err) { showToast('Gagal check-in: ' + err.message, 'error') }
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 25, 41, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-cancelled {
  background-color: #fef2f2 !important;
}

.custom-dropdown-container {
  position: relative;
  display: inline-block;
}

.status-badge-trigger {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}
.status-badge-trigger:hover {
  filter: brightness(0.95);
}
.status-badge-trigger.active { background-color: #d1fae5; color: #16a34a; }
.status-badge-trigger.pending { background-color: #fdf0e4; color: #b8681a; }
.status-badge-trigger.cancelled { background-color: #fee2e2; color: #991b1b; }

.custom-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  min-width: 120px;
  z-index: 50;
  overflow: hidden;
  animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: background 0.15s;
}
.dropdown-item:hover {
  background: #f8fafc;
  color: #0f172a;
}
</style>
