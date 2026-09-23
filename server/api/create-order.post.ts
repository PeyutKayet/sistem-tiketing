export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validasi sederhana
  if (!body || !body.transactionId) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Missing required data' })
  }
  
  // Ambil token dari environment variables (atau default fallback jika env kosong)
  const config = useRuntimeConfig()
  const fonnteToken = config.fonnteToken || 'JM3pexhRKQu9h5DHQ7Cg' 
  const adminPhone = config.adminPhone || '6285156575710'
  const adminVerifyUrl = 'https://saas.e-tiket.web.id/admin-verify'
  
  const pesanAdmin = `🚨 *PESANAN BARU MASUK*\nEvent: ${body.namaEvent || 'Event'}\nOrder ID: ${body.transactionId}\nTotal Transfer: *Rp ${Number(body.infaqNominal || 0).toLocaleString('id-ID')}*\n\nCek & Verifikasi disini:\n${adminVerifyUrl}?id=${body.transactionId}`

  // Fonnte API mewajibkan format form-data (bukan JSON standar)
  const formData = new FormData()
  formData.append('target', adminPhone)
  formData.append('message', pesanAdmin)

  // Kirim WhatsApp secara asynchronous (Fire & Forget)
  $fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': fonnteToken },
    body: formData
  }).then((res: any) => {
    console.log("Response Fonnte:", res)
  }).catch((error: any) => {
    console.error("Gagal kirim WA di background. Response:", error.response?._data || error.message)
  })

  // Langsung kembalikan respons sukses ke UI
  return { status: 'success' }
})
