import re

with open('app/pages/admin/event/[slug]/peserta.vue', 'r') as f:
    content = f.read()

old_csv_block = """    let req = supabase.from('peserta').select('nama_lengkap, email, no_wa, nama_tiket, status_bayar, is_scanned').eq('event_id', selectedEvent.value.id)
    if (searchQuery.value) {
      req = req.or(`nama_lengkap.ilike.%${searchQuery.value}%,email.ilike.%${searchQuery.value}%,no_wa.ilike.%${searchQuery.value}%`)
    }
    if (filterStatus.value !== 'semua') req = req.eq('status_bayar', filterStatus.value)
    if (filterHadir.value === 'hadir') req = req.eq('is_scanned', true)
    else if (filterHadir.value === 'belum') req = req.eq('is_scanned', false)

    const { data: semuaData, error } = await req.order('created_at', { ascending: false })
    if (error) throw error

    let csvContent = "data:text/csv;charset=utf-8,Nama Lengkap,Email,WhatsApp,Tiket,Status Bayar,Status Hadir\\n"
    semuaData.forEach(p => {
      const nama = (p.nama_lengkap || '').replace(/,/g, ' ')
      const email = (p.email || '').replace(/,/g, ' ')
      const wa = (p.no_wa || '').replace(/,/g, ' ')
      const tiket = (p.nama_tiket || 'Tiket').replace(/,/g, ' ')
      const statusBayar = p.status_bayar || 'pending'
      const hadir = p.is_scanned ? 'Hadir' : 'Belum'
      csvContent += `${nama},${email},${wa},${tiket},${statusBayar},${hadir}\\n`
    })
    const encodedUri = encodeURI(csvContent)"""

new_csv_block = """    let req = supabase.from('peserta').select('nama_lengkap, email, no_wa, nama_tiket, status_bayar, is_scanned, data_tambahan').eq('event_id', selectedEvent.value.id)
    if (searchQuery.value) {
      req = req.or(`nama_lengkap.ilike.%${searchQuery.value}%,email.ilike.%${searchQuery.value}%,no_wa.ilike.%${searchQuery.value}%`)
    }
    if (filterStatus.value !== 'semua') req = req.eq('status_bayar', filterStatus.value)
    if (filterHadir.value === 'hadir') req = req.eq('is_scanned', true)
    else if (filterHadir.value === 'belum') req = req.eq('is_scanned', false)

    const { data: semuaData, error } = await req.order('created_at', { ascending: false })
    if (error) throw error

    // Kumpulkan semua kolom dinamis dari data_tambahan
    let extraKeys = new Set()
    semuaData.forEach(p => {
      if (p.data_tambahan && typeof p.data_tambahan === 'object') {
        Object.keys(p.data_tambahan).forEach(k => extraKeys.add(k))
      }
    })
    const extraHeaders = Array.from(extraKeys)

    let csvContent = "data:text/csv;charset=utf-8,Nama Lengkap,Email,WhatsApp,Tiket,Status Bayar,Status Hadir"
    if (extraHeaders.length > 0) {
      // Hilangkan spasi atau underscore pada header jika ingin lebih rapi, tapi kita biarkan aslinya dulu
      csvContent += "," + extraHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(",")
    }
    csvContent += "\\n"

    semuaData.forEach(p => {
      // Gunakan kutip ganda untuk mencegah bentrok koma di dalam teks
      const nama = `"${(p.nama_lengkap || '').replace(/"/g, '""')}"`
      const email = `"${(p.email || '').replace(/"/g, '""')}"`
      const wa = `"${(p.no_wa || '').replace(/"/g, '""')}"`
      const tiket = `"${(p.nama_tiket || 'Tiket').replace(/"/g, '""')}"`
      const statusBayar = p.status_bayar || 'pending'
      const hadir = p.is_scanned ? 'Hadir' : 'Belum'
      
      let row = `${nama},${email},${wa},${tiket},${statusBayar},${hadir}`

      // Masukkan data tambahan
      extraHeaders.forEach(k => {
        let val = p.data_tambahan ? p.data_tambahan[k] : ''
        if (val === null || val === undefined) val = ''
        if (typeof val === 'object') {
           try { val = JSON.stringify(val) } catch(e) { val = String(val) }
        }
        val = `"${String(val).replace(/"/g, '""')}"`
        row += `,${val}`
      })

      csvContent += `${row}\\n`
    })
    const encodedUri = encodeURI(csvContent)"""

if old_csv_block in content:
    content = content.replace(old_csv_block, new_csv_block)
    with open('app/pages/admin/event/[slug]/peserta.vue', 'w') as f:
        f.write(content)
    print("Berhasil")
else:
    print("Gagal menemukan block")
