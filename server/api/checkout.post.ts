import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // body.peserta is an array of participants
  if (!body || !body.peserta || !body.peserta.length || !body.event_id || !body.kategori_id) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Missing required data' })
  }

  const supabase = await serverSupabaseClient(event)
  const config = useRuntimeConfig()

  // 1. Ambil Settingan Event
  const { data: eventData, error: eventErr } = await supabase
    .from('event')
    .select('settings, nama_event')
    .eq('id', body.event_id)
    .single()

  if (eventErr || !eventData) {
    throw createError({ statusCode: 404, statusMessage: 'Event tidak ditemukan' })
  }

  // 2. Ambil Harga Kategori Tiket
  const { data: kategori, error: katErr } = await supabase
    .from('kategori_tiket')
    .select('harga, nama_kategori')
    .eq('id', body.kategori_id)
    .single()

  if (katErr || !kategori) {
    throw createError({ statusCode: 404, statusMessage: 'Kategori tiket tidak ditemukan' })
  }

  const isKaseraActive = eventData.settings?.is_kasera_active === true
  
  // Total harga tiket = harga tiket * jumlah peserta
  const hargaTiketTotal = Number(kategori.harga) * body.peserta.length
  const uniqueOrderId = `TRX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
  
  let finalResponse = {
    status: 'success',
    order_id: uniqueOrderId,
    checkout_url: ''
  }

  let adminFee = 0
  let gatewayFee = 0
  let totalAmount = hargaTiketTotal

  // 3. Percabangan Logika Pembayaran
  if (isKaseraActive) {
    // --- LOGIKA KASERA ---
    adminFee = 2000 // Admin fee per pesanan
    const netAmount = hargaTiketTotal + adminFee
    totalAmount = Math.ceil((netAmount + 250) / (1 - 0.007))
    gatewayFee = totalAmount - netAmount

    try {
      const kaseraPayload = {
        amount: totalAmount,
        description: `Tiket ${eventData.nama_event} (${body.peserta.length} Pax)`,
        external_id: uniqueOrderId,
        merchant_ref: uniqueOrderId,
        customer: {
          // Ambil nama dari peserta pertama sebagai perwakilan
          name: body.peserta[0].nama_lengkap,
          email: (body.peserta[0].email && body.peserta[0].email.includes('@')) ? body.peserta[0].email : 'no-reply@e-tiket.web.id',
          phone: body.peserta[0].no_wa ? (body.peserta[0].no_wa.startsWith('+') ? body.peserta[0].no_wa : '+' + body.peserta[0].no_wa) : ''
        },
        return_url: `http://localhost:3000/tiket/${uniqueOrderId}`
      }

      const kaseraRes: any = await $fetch('https://pay.kasera.id/v1/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.kaseraApiKey}`,
          'Idempotency-Key': uniqueOrderId
        },
        body: kaseraPayload
      })

      finalResponse.checkout_url = kaseraRes.checkout_url

    } catch (error: any) {
      const kaseraData = error.response?._data
      console.error('Kasera Error Lengkap:', kaseraData || error.message)
      const detailError = kaseraData ? JSON.stringify(kaseraData) : error.message
      throw createError({ statusCode: 500, statusMessage: `Gagal Kasera: ${detailError}` })
    }
  } else {
    // --- LOGIKA MANUAL (Kirim WA) ---
    const fonnteToken = config.fonnteToken || 'JM3pexhRKQu9h5DHQ7Cg' 
    const adminPhone = config.adminPhone || '6285156575710'
    const adminVerifyUrl = 'https://saas.e-tiket.web.id/admin-verify'
    
    const pesanAdmin = `🚨 *PESANAN BARU MASUK*\nEvent: ${eventData.nama_event}\nOrder ID: ${uniqueOrderId}\nTotal Transfer: *Rp ${hargaTiketTotal.toLocaleString('id-ID')}*\n\nCek & Verifikasi disini:\n${adminVerifyUrl}?id=${uniqueOrderId}`

    const formData = new FormData()
    formData.append('target', adminPhone)
    formData.append('message', pesanAdmin)

    $fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': fonnteToken },
      body: formData
    }).catch(e => console.error("Fonnte WA Error", e))
  }

  // 4. Siapkan Array Data Peserta untuk di-insert
  const payloadSupabase = body.peserta.map((p: any) => {
    let dataTambahan = {
      ...p.data_tambahan, // Custom form fields, etc.
      ticket_id: p.ticket_id, // e.g. KOP-260924-XXXX
      order_id: uniqueOrderId, // Grouping ID for Kasera
      payment: {
        gateway: isKaseraActive ? 'kasera' : 'manual',
        admin_fee: adminFee,
        gateway_fee: gatewayFee,
        total_amount: totalAmount
      }
    }

    if (isKaseraActive) {
      dataTambahan.payment.checkout_url = finalResponse.checkout_url
    }

    return {
      event_id: body.event_id,
      kategori_id: body.kategori_id,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      no_wa: p.no_wa,
      nama_tiket: kategori.nama_kategori,
      status_bayar: 'pending',
      bukti_bayar_url: body.bukti_bayar_url || null, // Untuk logika manual
      data_tambahan: dataTambahan
    }
  })

  // 5. Simpan ke Database
  const { error: insertErr } = await supabase
    .from('peserta')
    .insert(payloadSupabase)

  if (insertErr) {
    console.error('Insert DB Error:', insertErr)
    throw createError({ statusCode: 500, statusMessage: 'Gagal menyimpan pesanan ke database' })
  }

  return finalResponse
})
