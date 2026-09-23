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

  // Kirim WhatsApp secara asynchronous (Fire & Forget) agar UI tidak lemot menunggu Fonnte
  $fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': fonnteToken },
    body: { target: adminPhone, message: pesanAdmin }
  }).catch((error: any) => {
    console.error("Gagal kirim WA di background:", error)
  })

  // Langsung kembalikan respons sukses ke UI
  return { status: 'success' }
})
