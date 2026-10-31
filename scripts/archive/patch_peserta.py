import re

with open('app/pages/admin/event/[slug]/peserta.vue', 'r') as f:
    content = f.read()

# 1. Add <select> in UI
ui_filter = """      <select v-model="filterTiket" class="filter-control">
        <option value="semua">Semua Tiket</option>
        <option v-for="t in daftarTiketOption" :key="t.id" :value="t.id">{{ t.nama_kategori }}</option>
      </select>"""

content = content.replace(
    '<select v-model="filterHadir" class="filter-control">\n        <option value="semua">Semua Kehadiran</option>\n        <option value="hadir">Hadir</option>\n        <option value="belum">Belum</option>\n      </select>',
    f'<select v-model="filterHadir" class="filter-control">\n        <option value="semua">Semua Kehadiran</option>\n        <option value="hadir">Hadir</option>\n        <option value="belum">Belum</option>\n      </select>\n{ui_filter}'
)

# 2. Add filterTiket ref and daftarTiketOption logic
script_vars = """const filterHadir = ref('semua')
const filterTiket = ref('semua')
const perPage = ref(20)

const daftarTiketOption = ref([])
watch(selectedEvent, async (newVal) => {
  if (newVal) {
    const { data } = await supabase.from('kategori_tiket').select('id, nama_kategori').eq('event_id', newVal.id)
    if (data) daftarTiketOption.value = data
  }
}, { immediate: true })"""

content = content.replace("const filterHadir = ref('semua')\nconst perPage = ref(20)", script_vars)

# 3. Update reloadData args
content = content.replace(
    'muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, perPage.value)',
    'muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, filterTiket.value, perPage.value)'
)

# 4. Update watch array
content = content.replace(
    'watch([pesertaPage, searchQuery, filterStatus, filterHadir, perPage], () => {',
    'watch([pesertaPage, searchQuery, filterStatus, filterHadir, filterTiket, perPage], () => {'
)

# 5. Update downloadCSVPeserta logic
csv_logic = """      if (filterStatus.value !== 'semua') req = req.eq('status_bayar', filterStatus.value)
      if (filterHadir.value === 'hadir') req = req.eq('is_scanned', true)
      else if (filterHadir.value === 'belum') req = req.eq('is_scanned', false)
      if (filterTiket.value !== 'semua') req = req.eq('kategori_id', filterTiket.value)"""

content = content.replace(
    "      if (filterStatus.value !== 'semua') req = req.eq('status_bayar', filterStatus.value)\n      if (filterHadir.value === 'hadir') req = req.eq('is_scanned', true)\n      else if (filterHadir.value === 'belum') req = req.eq('is_scanned', false)",
    csv_logic
)

with open('app/pages/admin/event/[slug]/peserta.vue', 'w') as f:
    f.write(content)
