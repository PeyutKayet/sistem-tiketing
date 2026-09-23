export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // GANTI DENGAN DATA ASLI KAMU NANTI
  const fonnteToken = 'JM3pexhRKQu9h5DHQ7Cg' 
  const adminPhone = '6285156575710'
  const adminVerifyUrl = 'https://saas.e-tiket.web.id/admin-verify'
  
  const pesanAdmin = `🚨 *PESANAN BARU MASUK*\nEvent: ${body.namaEvent}\nOrder ID: ${body.transactionId}\nTotal Transfer: *Rp ${Number(body.infaqNominal).toLocaleString('id-ID')}*\n\nCek & Verifikasi disini:\n${adminVerifyUrl}?id=${body.transactionId}`

  try {
    // Memanggil API Fonnte dari backend agar token rahasia aman
    await $fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': fonnteToken },
      body: { target: adminPhone, message: pesanAdmin }
    })
    return { status: 'success' }
  } catch (error: any) {
    console.error("Gagal kirim WA:", error)
    return { status: 'error', message: error.message }
  }
})
