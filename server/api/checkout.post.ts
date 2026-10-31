import type { CheckoutPayload, Peserta } from '~/types/index'
import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { generateAdminVerifyToken, generateOrderCancelToken } from '../utils/adminToken'

export default defineEventHandler(async (event) => {
  const body = await readBody<CheckoutPayload>(event)
  
  // body.peserta is an array of participants
  if (!body || !body.peserta || !body.peserta.length || !body.event_id || !body.kategori_id) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Missing required data' })
  }

  const supabase = await serverSupabaseServiceRole(event) // Gunakan service role agar bisa bypass RLS saat ngecek data sensitif (anti calo)
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

  // 2. Ambil Harga & Detail Kategori Tiket untuk semua tiket yang dipesan
  const rawCatIds = body.peserta.map((p: any) => p.kategori_id || body.kategori_id).filter(Boolean)
  const categoryIds = Array.from(new Set(rawCatIds.map((id: any) => Number(id))))

  if (categoryIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Kategori tiket tidak valid' })
  }

  const { data: categories, error: katErr } = await supabase
    .from('kategori_tiket')
    .select('*')
    .in('id', categoryIds)

  if (katErr) {
    console.error('Database katErr:', katErr)
    throw createError({ statusCode: 500, statusMessage: `Gagal membaca kategori tiket: ${katErr.message}` })
  }

  if (!categories || categories.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Kategori tiket tidak ditemukan' })
  }

  // Pastikan kategori milik event yang sesuai
  const validCategories = categories.filter((c: any) => String(c.event_id) === String(body.event_id))
  if (validCategories.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Kategori tiket tidak cocok dengan event ini' })
  }

  const categoryMap = new Map<number, any>()
  for (const c of validCategories) {
    categoryMap.set(Number(c.id), c)
  }

  // Hitung jumlah tiket yang diminta per kategori & cek status aktif/jadwal
  const requestedQtyPerCategory: Record<number, number> = {}
  const now = Date.now()

  for (const p of body.peserta) {
    const katId = Number(p.kategori_id || body.kategori_id)
    const kat = categoryMap.get(katId)
    if (!kat) {
      throw createError({ statusCode: 404, statusMessage: `Kategori tiket ID ${katId} tidak ditemukan untuk event ini.` })
    }
    if (kat.is_active === false) {
      throw createError({ statusCode: 400, statusMessage: `Penjualan tiket "${kat.nama_kategori}" sedang dinonaktifkan.` })
    }
    if (kat.tanggal_mulai_penjualan && now < new Date(kat.tanggal_mulai_penjualan).getTime()) {
      throw createError({ statusCode: 400, statusMessage: `Penjualan tiket "${kat.nama_kategori}" belum dibuka.` })
    }
    if (kat.tanggal_selesai_penjualan && now > new Date(kat.tanggal_selesai_penjualan).getTime()) {
      throw createError({ statusCode: 400, statusMessage: `Penjualan tiket "${kat.nama_kategori}" sudah ditutup.` })
    }
    requestedQtyPerCategory[katId] = (requestedQtyPerCategory[katId] || 0) + 1
  }

  // Validasi Kuota Server-Side (Mencegah overselling saat war tiket)
  // Kuota unlimited jika kuota_maksimal == 0 atau null
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  for (const [katIdStr, qtyDiminta] of Object.entries(requestedQtyPerCategory)) {
    const katId = Number(katIdStr)
    const kat = categoryMap.get(katId)
    const isUnlimited = !kat?.kuota_maksimal || Number(kat.kuota_maksimal) <= 0
    if (kat && !isUnlimited) {
      const { count: terpakai, error: countErr } = await supabase
        .from('peserta')
        .select('*', { count: 'exact', head: true })
        .eq('kategori_id', katId)
        .or(`status_bayar.eq.paid,and(status_bayar.eq.pending,created_at.gt.${fifteenMinsAgo})`)

      if (countErr) {
        console.warn('Count error on quota check:', countErr)
      } else if (typeof terpakai === 'number') {
        const sisa = Math.max(0, (Number(kat.kuota_maksimal) || 0) - terpakai)
        if (qtyDiminta > sisa) {
          throw createError({
            statusCode: 400,
            statusMessage: sisa === 0
              ? `Mohon maaf, kuota tiket "${kat.nama_kategori}" sudah habis terjual.`
              : `Mohon maaf, tiket "${kat.nama_kategori}" hanya tersisa ${sisa} tiket lagi.`
          })
        }
      }
    }
  }

  
  

  // Anti-Calo Check (Hanya cek duplikat di dalam request)
  console.log("Anti-calo config:", eventData.settings?.is_anti_calo_email, eventData.settings?.is_anti_calo_wa)
  if (eventData.settings?.is_anti_calo_email || eventData.settings?.is_anti_calo_wa) {
    const emails = body.peserta.map((p: any) => p.email).filter(Boolean);
    const was = body.peserta.map((p: any) => p.no_wa).filter(Boolean);
    
    // Check internal duplicates in the request first
    if (eventData.settings?.is_anti_calo_email && new Set(emails).size !== emails.length) {
      throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 Email hanya untuk 1 tiket.' })
    }
    if (eventData.settings?.is_anti_calo_wa && new Set(was).size !== was.length) {
      throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 No WA hanya untuk 1 tiket.' })
    }
  }

  // Master Emergency Failover Check (Super Admin Global Kill-Switch)
  let isGlobalEmergency = false
  try {
    const { data: settingData } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'payment_gateway')
      .maybeSingle()
    if (settingData?.value?.is_emergency_backup === true) {
      isGlobalEmergency = true
    }
  } catch (err) {
    console.warn('Gagal membaca platform_settings, fallback ke normal:', err)
  }

  // Jika emergency backup aktif atau user memilih transfer manual, matikan Espay dan alihkan ke manual
  const requestedMethod = ((body as any).payment_method || '').toLowerCase()
  const isBackupMethod = requestedMethod === 'qris_backup_tyket' || requestedMethod === 'manual'
  const isEspayActive = !isGlobalEmergency && !isBackupMethod && (eventData.settings?.is_espay_active !== false)

  // Jika sistem sedang dalam mode darurat global, jangan izinkan pembuatan transaksi online otomatis ESPay.
  // Client akan otomatis diarahkan ke mode transfer manual cadangan QRIS Tyket.
  if (isGlobalEmergency && !isBackupMethod) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Layanan pembayaran bank otomatis sedang dalam pemeliharaan berkala. Pembayaran dialihkan ke QRIS Resmi Tyket.id.'
    })
  }
  
  // Ambil donasi/infaq dari peserta pertama (jika ada)
  const infaqNominal = Number(body.peserta[0]?.data_tambahan?.infaqNominal || 0)
  
  // Total harga tiket = jumlah harga riil per peserta + infaq
  const totalPureTicketPrice = body.peserta.reduce((acc: number, p: any) => {
    const kat = categoryMap.get(Number(p.kategori_id || body.kategori_id))
    return acc + Number(kat?.harga || 0)
  }, 0)
  const hargaTiketTotal = totalPureTicketPrice + infaqNominal
  const uniqueOrderId = `TRX${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  
  const chosenMethod = isEspayActive ? (((body as any).payment_method || 'qris').toLowerCase()) : 'qris_backup_tyket'
  const gatewayType = isEspayActive ? 'espay' : 'manual_tyket'

  let adminFee = 0
  let gatewayFee = 0
  let totalAmount = hargaTiketTotal
  let securityCode = 0

  if (isEspayActive && hargaTiketTotal > 0) {
    securityCode = Number(body.kode_unik || 0) > 0 ? Number(body.kode_unik) : (Math.floor(Math.random() * 399) + 101)
    adminFee = 2000 + securityCode // Biaya Platform Tyket.id + Security Code
    const netAmount = hargaTiketTotal + adminFee

    if (chosenMethod === 'qris') {
      const gross = Math.ceil(netAmount / (1 - 0.007104))
      gatewayFee = gross - netAmount
      totalAmount = gross
    } else if (chosenMethod.includes('bni')) {
      gatewayFee = 3330
      totalAmount = netAmount + gatewayFee
    } else {
      gatewayFee = 2775
      totalAmount = netAmount + gatewayFee
    }
  } else if (hargaTiketTotal > 0) {
    securityCode = Number(body.kode_unik || 0) > 0 ? Number(body.kode_unik) : (Math.floor(Math.random() * 399) + 101)
    adminFee = 2000
    totalAmount = hargaTiketTotal + adminFee + securityCode
  }

  let finalResponse: any = {
    status: 'success',
    order_id: uniqueOrderId,
    cancel_token: generateOrderCancelToken(uniqueOrderId),
    gateway: gatewayType,
    tipe_gateway: gatewayType,
    kode_unik: securityCode,
    total_amount: totalAmount,
    is_free: hargaTiketTotal === 0,
    checkout_url: ''
  }

  // 4. Siapkan Array Data Peserta untuk di-insert ke Database (Pre-insert status: pending)
  const payloadSupabase = body.peserta.map((p: Peserta) => {
    const kat = categoryMap.get(Number(p.kategori_id || body.kategori_id)) || categories[0]
    let dataTambahan = {
      ...p.data_tambahan,
      ticket_id: p.ticket_id,
      order_id: uniqueOrderId,
      nama_event: eventData.nama_event,
      payment: {
        gateway: gatewayType,
        tipe_gateway: gatewayType,
        channel: chosenMethod,
        kode_unik: securityCode,
        admin_fee: adminFee,
        gateway_fee: gatewayFee,
        total_amount: totalAmount,
        espay_data: null
      }
    }

    return {
      event_id: body.event_id,
      kategori_id: kat.id,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      no_wa: p.no_wa,
      nama_tiket: kat.nama_kategori,
      status_bayar: hargaTiketTotal === 0 ? 'paid' : 'pending',
      status_dana: hargaTiketTotal === 0 ? 'CAIR' : 'PENDING',
      order_id: uniqueOrderId,
      bukti_bayar_url: body.bukti_bayar_url || null,
      data_tambahan: dataTambahan
    }
  })

  // 4b. Siapkan Data Order (Tabel orders)
  const orderPayload = {
    id: uniqueOrderId,
    event_id: body.event_id,
    pembeli_nama: body.peserta[0]?.nama_lengkap || 'Peserta',
    pembeli_email: body.peserta[0]?.email || 'no-reply@tyket.id',
    pembeli_wa: body.peserta[0]?.no_wa || '',
    subtotal_tiket: totalPureTicketPrice,
    nominal_infaq: infaqNominal,
    biaya_admin: adminFee,
    biaya_gateway: gatewayFee,
    total_tagihan: totalAmount,
    status_pembayaran: hargaTiketTotal === 0 ? 'paid' : 'pending',
    status_dana: hargaTiketTotal === 0 ? 'CAIR' : 'PENDING',
    metode_pembayaran: chosenMethod,
    payment_reference: null,
    data_transaksi: {
      gateway: gatewayType,
      tipe_gateway: gatewayType,
      channel: chosenMethod,
      kode_unik: securityCode,
      admin_fee: adminFee,
      gateway_fee: gatewayFee
    }
  }

  // 5. Simpan Pesanan ke Database Terlebih Dahulu (Mengunci Kuota, Anti-Calo, dan Simpan Orders secara Atomik)
  let insertErr: any = null
  try {
    const rpcRes = await supabase.rpc('checkout_tiket_atomic', {
      p_event_id: body.event_id,
      p_is_anti_calo_email: eventData.settings?.is_anti_calo_email === true,
      p_is_anti_calo_wa: eventData.settings?.is_anti_calo_wa === true,
      p_peserta_data: payloadSupabase,
      p_order_data: orderPayload
    })
    insertErr = rpcRes.error
  } catch (err: any) {
    insertErr = err
  }

  // Fallback direct insert jika RPC belum terpasang atau beda signature
  if (insertErr && !insertErr.message?.includes('Sistem Anti-Calo') && !insertErr.message?.includes('kuota') && !insertErr.message?.includes('tidak mencukupi')) {
    console.warn('RPC checkout_tiket_atomic gagal (' + insertErr.message + '), fallback ke direct insert tabel orders & peserta...')
    try {
      await supabase.from('orders').upsert(orderPayload)
    } catch (ordErr) {
      console.warn('Fallback direct insert orders gagal (mungkin tabel belum ada):', ordErr)
    }
    const directRes = await supabase.from('peserta').insert(payloadSupabase)
    insertErr = directRes.error
  }

  if (insertErr) {
    console.error('Insert DB Error:', insertErr)
    const errorMsg = insertErr.message || insertErr.details || (typeof insertErr === 'string' ? insertErr : JSON.stringify(insertErr))
    if (errorMsg.includes('Sistem Anti-Calo') || errorMsg.includes('kuota') || errorMsg.includes('tidak mencukupi')) {
      throw createError({ statusCode: 400, statusMessage: errorMsg })
    }
    throw createError({ statusCode: 500, statusMessage: `Gagal menyimpan pesanan ke database: ${errorMsg}` })
  }

  // 6. Percabangan Logika Pembayaran (Data sudah aman di database!)
  if (isEspayActive && hargaTiketTotal > 0) {
    const customer = {
      name: body.peserta[0].nama_lengkap || 'Peserta',
      email: (body.peserta[0].email && body.peserta[0].email.includes('@')) ? body.peserta[0].email : 'no-reply@tyket.id',
      phone: body.peserta[0].no_wa ? String(body.peserta[0].no_wa).replace(/\D/g, '') : '08123456789'
    }
    const netAmount = hargaTiketTotal + adminFee

    if (chosenMethod === 'qris') {
      const qrisRes = await requestEspayQris({
        orderId: uniqueOrderId,
        amount: netAmount,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        disableFallback: true
      })

      if (!qrisRes.success) {
        // Rollback status pesanan jika gateway gagal
        await supabase.from('peserta').update({ status_bayar: 'cancelled' }).eq('data_tambahan->>order_id', uniqueOrderId)
        await supabase.from('orders').update({ status_pembayaran: 'cancelled' }).eq('id', uniqueOrderId)
        throw createError({ statusCode: 503, statusMessage: `Layanan QRIS otomatis sedang gangguan: ${qrisRes.errorMessage}` })
      }

      gatewayFee = qrisRes.fee || gatewayFee
      totalAmount = qrisRes.totalAmount || totalAmount

      // Update tabel orders dengan gateway fee riil & payment reference
      try {
        await supabase.from('orders').update({
          biaya_gateway: gatewayFee,
          total_tagihan: totalAmount,
          payment_reference: qrisRes.qrContent || null,
          data_transaksi: {
            gateway: 'espay',
            channel: 'qris',
            admin_fee: adminFee,
            gateway_fee: gatewayFee,
            total_amount: totalAmount,
            validity_period: qrisRes.validityPeriod
          }
        }).eq('id', uniqueOrderId)
      } catch (ordUpdErr) {
        console.warn('Gagal sinkron orders QRIS:', ordUpdErr)
      }

      finalResponse = {
        ...finalResponse,
        payment_type: 'qris',
        qr_image: qrisRes.qrImage,
        qr_url: qrisRes.qrUrl,
        qr_content: qrisRes.qrContent,
        validity_period: qrisRes.validityPeriod,
        ticket_count: body.peserta.length,
        ticket_price_per_item: body.peserta.length === 1 ? Number(categories[0]?.harga || 0) : null,
        amount: totalPureTicketPrice,
        donasi_amount: infaqNominal,
        admin_fee: adminFee,
        security_code: securityCode,
        fee: gatewayFee,
        total_amount: totalAmount
      }
    } else if (chosenMethod.startsWith('va')) {
      let bankCode = '008' // Default Mandiri
      if (chosenMethod.includes('bca')) bankCode = '014'
      else if (chosenMethod.includes('bri')) bankCode = '002'
      else if (chosenMethod.includes('mandiri')) bankCode = '008'
      else if (chosenMethod.includes('bni')) bankCode = '009'

      const vaRes = await requestEspayVirtualAccount({
        orderId: uniqueOrderId,
        amount: netAmount,
        bankCode,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        disableFallback: true
      })

      if (!vaRes.success) {
        // Rollback status pesanan jika gateway gagal
        await supabase.from('peserta').update({ status_bayar: 'cancelled' }).eq('data_tambahan->>order_id', uniqueOrderId)
        await supabase.from('orders').update({ status_pembayaran: 'cancelled' }).eq('id', uniqueOrderId)

        const isChannelNotActive = vaRes.errorMessage?.includes('0118') || 
                                   vaRes.errorMessage?.includes('BIN') || 
                                   vaRes.errorMessage?.includes('belum diaktifkan') ||
                                   vaRes.errorMessage?.includes('tidak aktif')

        if (isChannelNotActive) {
          throw createError({ 
            statusCode: 400, 
            statusMessage: `Metode ${bankCode === '009' ? 'BNI Virtual Account' : 'pembayaran ini'} belum diaktifkan pada akun Sandbox Espay. Silakan pilih Bank lain (Mandiri, BRI, BCA) atau QRIS.` 
          })
        }

        throw createError({ statusCode: 503, statusMessage: `Layanan Virtual Account sedang gangguan: ${vaRes.errorMessage}` })
      }

      gatewayFee = vaRes.fee || gatewayFee
      totalAmount = vaRes.totalAmount || totalAmount

      // Update tabel orders dengan nomor VA dan gateway fee riil
      try {
        await supabase.from('orders').update({
          biaya_gateway: gatewayFee,
          total_tagihan: totalAmount,
          payment_reference: vaRes.vaNumber || null,
          data_transaksi: {
            gateway: 'espay',
            channel: chosenMethod,
            admin_fee: adminFee,
            gateway_fee: gatewayFee,
            total_amount: totalAmount,
            va_number: vaRes.vaNumber,
            bank_name: vaRes.bankName,
            bank_code: vaRes.bankCode,
            expired: vaRes.expired
          }
        }).eq('id', uniqueOrderId)
      } catch (ordUpdErr) {
        console.warn('Gagal sinkron orders VA:', ordUpdErr)
      }

      finalResponse = {
        ...finalResponse,
        payment_type: 'va',
        va_number: vaRes.vaNumber,
        bank_code: vaRes.bankCode,
        bank_name: vaRes.bankName,
        expired: vaRes.expired,
        ticket_count: body.peserta.length,
        ticket_price_per_item: body.peserta.length === 1 ? Number(categories[0]?.harga || 0) : null,
        amount: totalPureTicketPrice,
        donasi_amount: infaqNominal,
        admin_fee: adminFee,
        security_code: securityCode,
        fee: gatewayFee,
        total_amount: totalAmount
      }

      // Update data_tambahan peserta di Supabase dengan nomor VA resmi dari Espay
      try {
        const { data: currentRows } = await supabase
          .from('peserta')
          .select('id, data_tambahan')
          .eq('data_tambahan->>order_id', uniqueOrderId)

        if (currentRows && currentRows.length > 0) {
          for (const row of currentRows) {
            const updatedDt = {
              ...row.data_tambahan,
              payment: {
                ...row.data_tambahan?.payment,
                admin_fee: adminFee,
                gateway_fee: gatewayFee,
                total_amount: totalAmount,
                espay_data: {
                  va_number: vaRes.vaNumber || null,
                  bank_name: vaRes.bankName || null,
                  bank_code: vaRes.bankCode || null,
                  payment_type: 'va'
                }
              }
            }
            await supabase.from('peserta').update({ data_tambahan: updatedDt }).eq('id', row.id)
          }
        }
      } catch (updErr) {
        console.warn('Gagal update data_tambahan dengan nomor VA:', updErr)
      }
    }
  } else if (isBackupMethod && hargaTiketTotal > 0) {
    // --- LOGIKA PEMBAYARAN CADANGAN QRIS TYKET (Kirim Notifikasi WA ke Super Admin Tyket) ---
    // Dipicu HANYA saat peserta menekan tombol "DAFTAR SEKARANG" dengan bukti pembayaran terunggah
    try {
      const { fonnteToken, adminPhone } = getFonnteConfig()
      const verifyToken = generateAdminVerifyToken(uniqueOrderId)
      const adminVerifyUrl = `${getRequestURL(event).origin}/admin-verify?id=${uniqueOrderId}&token=${verifyToken}`
      
      const pesanAdmin = `🚨 *NOTIFIKASI PEMBAYARAN CADANGAN (QRIS TYKET)*\n` +
        `Event: *${eventData.nama_event}*\n` +
        `Order ID: \`${uniqueOrderId}\`\n` +
        `Nama Pemesan: *${body.peserta[0]?.nama_lengkap || 'Peserta'}*\n` +
        `Nomor WhatsApp: *${body.peserta[0]?.no_wa || '-'}*\n` +
        `Kode Unik: *${securityCode}*\n` +
        `Total Masuk: *Rp ${totalAmount.toLocaleString('id-ID')}*\n` +
        (body.bukti_bayar_url ? `Foto Struk: ${body.bukti_bayar_url}\n\n` : `\n`) +
        `Cek mutasi QRIS Tyket lalu klik untuk verifikasi:\n${adminVerifyUrl}`

      const formData = new FormData()
      formData.append('target', adminPhone)
      formData.append('message', pesanAdmin)
      if (body.bukti_bayar_url) {
        formData.append('url', body.bukti_bayar_url)
      }

      $fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': fonnteToken },
        body: formData
      }).catch(e => console.error("Fonnte WA Error", e))
    } catch (fonnteErr) {
      console.error("Gagal inisialisasi Fonnte config:", fonnteErr)
    }
  }

  return finalResponse
})
