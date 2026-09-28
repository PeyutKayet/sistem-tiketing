import re

with open('app/pages/admin/event/[slug]/tiket.vue', 'r') as f:
    content = f.read()

# 1. HTML Replace
content = content.replace(
    'Sembunyikan Tiket (Tiket Privat / Direct Link)',
    'Jadikan Tiket Privat (Hanya via Link Khusus)'
)
content = content.replace(
    'Tiket Aktif (Hapus centang untuk membekukan tiket)',
    'Buka Penjualan (Tampilkan tiket & izinkan pembelian)'
)

old_aksi = """<td style="display:flex; gap:4px; align-items:center;">
                <button v-if="t.is_hidden" class="btn-icon" @click="copySecretLink(t)" title="Copy Link Privat" style="color:var(--primary);"><Icon name="lucide:link" style="margin-right:4px;" /></button>
                <button class="btn-icon" @click="bukaEditTiket(t)" title="Edit"><Icon name="lucide:edit" style="margin-right:4px;" /></button>
                <button v-if="t.terjual === 0" class="btn-icon danger" @click="hapusTiket(t.id)" title="Hapus"><Icon name="lucide:trash-2" /></button>
                <button v-else class="btn-icon" title="Tiket yang sudah terjual tidak bisa dihapus" style="opacity:0.3; cursor:not-allowed;"><Icon name="lucide:trash-2" /></button>
              </td>"""

new_aksi = """<td style="display:flex; gap:8px; align-items:center;">
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
              </td>"""

content = content.replace(old_aksi, new_aksi)


# 2. Add Function
new_func = """
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

const hapusTiket = (id) => {"""
content = content.replace('const hapusTiket = (id) => {', new_func)

# 3. Add CSS
css = """
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
"""
content = content.replace('</style>', css)

with open('app/pages/admin/event/[slug]/tiket.vue', 'w') as f:
    f.write(content)
