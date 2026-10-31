import re

file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

# Make lanjutBayar async
content = content.replace("const lanjutBayar = () => {", "const lanjutBayar = async () => {")

lanjut_logic = """  if (isValid) {
    // --- LAKUKAN PENGECEKAN ANTI CALO SEBELUM KE HALAMAN BAYAR MANUAL ---
    document.querySelector('.api-loader')?.classList.add('active')
    try {
      const payloadPeserta = daftarPeserta.value.map(p => ({
        email: p.jawaban['email'] || '',
        no_wa: p.jawaban['no_wa'] || ''
      }))
      await $fetch('/api/check-calo', {
        method: 'POST',
        body: { event_id: eventData.value.id, peserta: payloadPeserta }
      })
    } catch (err) {
      document.querySelector('.api-loader')?.classList.remove('active')
      const msg = err.data?.statusMessage || err.data?.message || err.message
      if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Ditolak', text: msg, confirmButtonColor: '#E85D5E' })
      else alert('Pendaftaran Ditolak: ' + msg)
      return // STOP DI SINI JIKA KENA ANTI CALO
    }
    document.querySelector('.api-loader')?.classList.remove('active')

    if (totalPrice.value === 0 && donasiAmount.value === 0) {"""

content = content.replace(
    "  if (isValid) {\n    if (totalPrice.value === 0 && donasiAmount.value === 0) {",
    lanjut_logic
)

with open(file, 'w') as f:
    f.write(content)
