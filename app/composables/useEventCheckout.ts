import { ref } from 'vue'

export const useEventCheckout = () => {
  const isSubmitting = ref(false)
  const isPrinting = ref(false)
  const buktiBayarFile = ref(null)
  const buktiBayarPreview = ref('')
  const uploadError = ref(false)
  const transactionIdGlobal = ref('')
  const linkBuktiGlobal = ref('')
  const orderIdsGlobal = ref([])

  // ─────────────────────────────────────────────
  // HELPER 1: Cek sisa kuota tiket di DB
  // ─────────────────────────────────────────────
  const checkKuotaTiket = async (supabase: any, tickets: any[], jumlahPeserta: number) => {
    if (tickets.length === 0 || tickets[0].is_unlimited) return
    const { count, error: countErr } = await supabase
      .from('peserta')
      .select('*', { count: 'exact', head: true })
      .eq('kategori_id', tickets[0].id)
      .neq('status_bayar', 'cancelled')
    if (!countErr && count !== null) {
      const sisaSekarang = tickets[0].kuota_maksimal - count
      if (sisaSekarang < jumlahPeserta) {
        throw new Error(`Maaf, sisa kuota tiket ini hanya ${sisaSekarang > 0 ? sisaSekarang : 0}. Pesanan ditolak.`)
      }
    }
  }

  // ─────────────────────────────────────────────
  // HELPER 2: Proses & gabungkan data jawaban form peserta
  // (menangani field phone_wa + country code, domisili GPS, dll)
  // ─────────────────────────────────────────────
  const buildArrPeserta = (daftarPeserta: any[], customFields: any[], donasiAmount: number) => {
    // Langkah 1: gabungkan country code ke field phone_wa
    const processedPeserta = daftarPeserta.map((p: any) => {
      let finalJawaban = { ...p.jawaban }
      for (const field of customFields) {
        if (field.type === 'phone_wa' && p['_cc_' + field.field_key]) {
          finalJawaban[field.field_key] = p['_cc_' + field.field_key] + (finalJawaban[field.field_key] || '')
        }
        if (field.type === 'domisili_api' && p['_lat_' + field.field_key]) {
          finalJawaban['lat'] = p['_lat_' + field.field_key]
          finalJawaban['lon'] = p['_lon_' + field.field_key]
        }
      }
      return { ...p, jawaban: finalJawaban }
    })

    // Langkah 2: petakan ke struktur yang siap dikirim ke DB
    return processedPeserta.map((p: any) => {
      const { nama_lengkap, email, no_wa, domisili, ...dataTambahanJSON } = p.jawaban

      let emailVal = email
      let noWaVal = no_wa
      let namaLengkapVal = nama_lengkap

      // Override dengan field bertipe khusus jika ada
      for (const field of customFields) {
        if (field.type === 'email' && p.jawaban[field.field_key]) emailVal = p.jawaban[field.field_key]
        if (field.type === 'phone_wa' && p.jawaban[field.field_key]) noWaVal = p.jawaban[field.field_key]
        if (field.field_key === 'nama_lengkap' && p.jawaban[field.field_key]) namaLengkapVal = p.jawaban[field.field_key]
      }

      return {
        namaAnak: namaLengkapVal || '-',
        usia: '-',
        domisili: domisili || '-',
        followMunira: 'Tidak',
        hp: noWaVal ? noWaVal.replace(/\D/g, '') : (no_wa ? no_wa.replace(/\D/g, '') : '-'),
        email: emailVal || '-',
        latitude: '',
        longitude: '',
        dataTambahanJSON: { ...dataTambahanJSON, infaqNominal: donasiAmount },
        kategori_id: p.tiketId,
        namaTiket: p.namaTiket
      }
    })
  }

  // ─────────────────────────────────────────────
  // HELPER 3: Upload bukti bayar + file custom ke Supabase Storage
  // ─────────────────────────────────────────────
  const uploadAllFiles = async (supabase: any, eventData: any, transactionId: string, arrPeserta: any[]) => {
    let urlBukti = ''

    // Upload bukti bayar (struk transfer)
    if (buktiBayarFile.value) {
      // @ts-ignore
      const ext = buktiBayarFile.value.name.split('.').pop()
      const pathBukti = `${eventData?.nama_event || 'Event'}/Bukti Transfer/${transactionId}.${ext}`
      const { error: err1 } = await supabase.storage.from('berkas').upload(pathBukti, buktiBayarFile.value)
      if (err1) throw new Error('Gagal mengupload Bukti Transfer: ' + err1.message)
      urlBukti = supabase.storage.from('berkas').getPublicUrl(pathBukti).data.publicUrl
    }

    // Upload file custom per peserta (jika ada field tipe file di form)
    for (const p of arrPeserta) {
      for (const key in p.dataTambahanJSON) {
        if (p.dataTambahanJSON[key] instanceof File) {
          const file = p.dataTambahanJSON[key]
          const ext = file.name.split('.').pop()
          const pathCustom = `${eventData?.nama_event || 'Event'}/${key}/${transactionId}_${p.namaAnak || 'Peserta'}.${ext}`
          const { error: err2 } = await supabase.storage.from('berkas').upload(pathCustom, file)
          if (err2) throw new Error('Gagal mengupload file: ' + err2.message)
          p.dataTambahanJSON[key] = supabase.storage.from('berkas').getPublicUrl(pathCustom).data.publicUrl
        }
      }
    }

    return urlBukti
  }

  // ─────────────────────────────────────────────
  // HELPER 4: Insert peserta ke tabel Supabase
  // ─────────────────────────────────────────────
  const insertPesertaToDB = async (
    supabase: any,
    eventData: any,
    arrPeserta: any[],
    transactionId: string,
    prefixDynamic: string,
    urlBukti: string,
    grandTotal: number,
    adminFee: number,
    isFree: boolean = false
  ) => {
    const dNow = new Date()
    const dateStr = dNow.getFullYear().toString().slice(-2) + ('0' + (dNow.getMonth() + 1)).slice(-2) + ('0' + dNow.getDate()).slice(-2)
    const timeStr = ('0' + dNow.getHours()).slice(-2) + ('0' + dNow.getMinutes()).slice(-2)

    const payloadSupabase = arrPeserta.map((p: any) => {
      const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
      const ticketIdDynamic = `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`

      const finalDataTambahan = {
        ...p.dataTambahanJSON,
        ticket_id: ticketIdDynamic,
        order_id: transactionId,
        payment: {
          gateway: 'manual',
          admin_fee: adminFee,
          gateway_fee: 0,
          total_amount: grandTotal
        }
      }

      return {
        event_id: eventData.id,
        kategori_id: p.kategori_id,
        nama_lengkap: p.namaAnak,
        email: p.email,
        no_wa: p.hp,
        nama_tiket: p.namaTiket,
        bukti_bayar_url: urlBukti,
        data_tambahan: finalDataTambahan,
        status_bayar: isFree ? 'paid' : 'pending'
      }
    })

    const { data: sbData, error: sbError } = await supabase
      .from('peserta')
      .insert(payloadSupabase)
      .select()

    if (sbError) throw sbError

    if (sbData && sbData.length > 0) {
      orderIdsGlobal.value = sbData.map((row: any) => `${row.data_tambahan.ticket_id}-${row.id}`)
    }
  }


  // ─────────────────────────────────────────────
  // PROSES ESPAY: Checkout via Direct API (QRIS / VA)
  // ─────────────────────────────────────────────
  const processEspaySubmit = async (params: any) => {
    const { donasiAmount, eventData, daftarPeserta, customFields, tickets, supabase, $fetch, paymentMethod, kodeUnik } = params

    isSubmitting.value = true

    try {
      await checkKuotaTiket(supabase, tickets, daftarPeserta.length)

      let arrPeserta = JSON.parse(JSON.stringify(daftarPeserta))
      const prefixDynamic = eventData.nama_event ? eventData.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
      const dNow = new Date()
      const dateStr = dNow.getFullYear().toString().slice(-2) + ('0' + (dNow.getMonth() + 1)).slice(-2) + ('0' + dNow.getDate()).slice(-2)
      const timeStr = ('0' + dNow.getHours()).slice(-2) + ('0' + dNow.getMinutes()).slice(-2)

      const processedPeserta = arrPeserta.map((p: any) => {
        let finalJawaban = { ...p.jawaban }
        for (const field of customFields) {
          if (field.type === 'phone_wa' && p['_cc_' + field.field_key]) {
            finalJawaban[field.field_key] = p['_cc_' + field.field_key] + (finalJawaban[field.field_key] || '')
          }
          if (field.type === 'domisili_api' && p['_lat_' + field.field_key]) {
            finalJawaban['lat'] = p['_lat_' + field.field_key]
            finalJawaban['lon'] = p['_lon_' + field.field_key]
          }
        }
        return {
          ...p,
          namaAnak: finalJawaban['nama_lengkap'] || p.jawaban['namaLengkap'] || 'Peserta',
          email: finalJawaban['email'] || '-',
          hp: (function() {
            let rawWa = finalJawaban['no_wa'] || '-'
            if (rawWa !== '-' && !rawWa.startsWith('62')) {
              if (rawWa.startsWith('0')) rawWa = '62' + rawWa.substring(1)
              else rawWa = '62' + rawWa
            }
            return rawWa
          })(),
          dataTambahanJSON: { ...finalJawaban, infaqNominal: donasiAmount }
        }
      })

      const payloadBackend = {
        event_id: eventData.id,
        kategori_id: arrPeserta[0].tiketId,
        payment_method: paymentMethod || 'qris',
        kode_unik: kodeUnik || 0,
        peserta: processedPeserta.map((p: any) => {
          const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
          return {
            kategori_id: p.tiketId,
            nama_tiket: p.namaTiket,
            nama_lengkap: p.namaAnak,
            email: p.email,
            no_wa: p.hp,
            ticket_id: `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`,
            data_tambahan: p.dataTambahanJSON
          }
        })
      }

      const checkoutRes: any = await $fetch('/api/checkout', { method: 'POST', body: payloadBackend })

      if (checkoutRes && checkoutRes.status === 'success') {
        transactionIdGlobal.value = checkoutRes.order_id
        isSubmitting.value = false
        return checkoutRes
      } else {
        throw new Error(checkoutRes?.message || 'Gagal membuat pembayaran ESPay')
      }

    } catch (err: any) {
      isSubmitting.value = false
      throw err
    }
  }

  // ─────────────────────────────────────────────
  // PROSES MANUAL: Checkout manual (upload bukti + notif WA admin)
  // Dipecah jadi langkah kecil agar mudah dibaca dan dimaintain
  // ─────────────────────────────────────────────
  const processManualSubmit = async (params: any) => {
    const { eventData, daftarPeserta, customFields, tickets, supabase, $fetch, printAudio, grandTotal, totalPrice, kodeUnik, donasiAmount, adminFee, startTime } = params

    if (!daftarPeserta || daftarPeserta.length === 0) {
      throw new Error('Data peserta tidak boleh kosong.')
    }

    // Validasi: wajib upload bukti kalau ada yang harus dibayar
    if (grandTotal > 0 && !buktiBayarFile.value) {
      uploadError.value = true
      throw new Error('Harap upload foto struk transfer terlebih dahulu.')
    }

    isSubmitting.value = true
    isPrinting.value = true
    if (printAudio) { printAudio.currentTime = 0; printAudio.play().catch((e: any) => console.warn(e)) }

    try {
      // LANGKAH 1: Cek kuota tiket
      await checkKuotaTiket(supabase, tickets, daftarPeserta.length)

      // LANGKAH 2: Olah data peserta dari form
      const arrPeserta = buildArrPeserta(daftarPeserta, customFields, donasiAmount)

      // LANGKAH 2.5: Validasi keaslian tiket gratis berdasarkan data tiket di DB
      const isGenuinelyFree = arrPeserta.every((p: any) => {
        const ticketObj = tickets.find((t: any) => String(t.id) === String(p.kategori_id))
        return ticketObj ? Number(ticketObj.harga) === 0 : false
      }) && Number(donasiAmount || 0) === 0

      // Jika tiket berbayar: wajib upload bukti bayar dan grandTotal harus > 0
      if (!isGenuinelyFree) {
        if (grandTotal <= 0) {
          throw new Error('Total tagihan tidak valid untuk tiket berbayar. Silakan ulangi pendaftaran.')
        }
        if (!buktiBayarFile.value) {
          uploadError.value = true
          throw new Error('Harap upload foto struk transfer terlebih dahulu.')
        }
      }

      // LANGKAH 3: Buat transaction ID unik
      const prefixDynamic = eventData.nama_event ? eventData.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
      const transactionId = `TRX-${prefixDynamic}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      transactionIdGlobal.value = transactionId

      // LANGKAH 4: Upload semua file (bukti bayar + file custom) ke Storage
      const urlBukti = await uploadAllFiles(supabase, eventData, transactionId, arrPeserta)
      linkBuktiGlobal.value = urlBukti

      // LANGKAH 5: Eksekusi pendaftaran aman lewat backend /api/checkout
      const dNow = new Date()
      const dateStr = dNow.getFullYear().toString().slice(-2) + ('0' + (dNow.getMonth() + 1)).slice(-2) + ('0' + dNow.getDate()).slice(-2)
      const timeStr = ('0' + dNow.getHours()).slice(-2) + ('0' + dNow.getMinutes()).slice(-2)

      const payloadBackend = {
        event_id: eventData.id,
        kategori_id: arrPeserta[0].kategori_id,
        payment_method: 'manual',
        kode_unik: kodeUnik || 0,
        bukti_bayar_url: urlBukti || null,
        peserta: arrPeserta.map((p: any) => {
          const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
          return {
            kategori_id: p.kategori_id,
            nama_tiket: p.namaTiket,
            nama_lengkap: p.namaAnak,
            email: p.email,
            no_wa: p.hp,
            ticket_id: `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`,
            data_tambahan: p.dataTambahanJSON
          }
        })
      }

      const checkoutRes: any = await $fetch('/api/checkout', {
        method: 'POST',
        body: payloadBackend
      })

      if (!checkoutRes || checkoutRes.status !== 'success') {
        throw new Error(checkoutRes?.statusMessage || checkoutRes?.message || 'Gagal memproses pendaftaran manual.')
      }

      const finalOrderId = checkoutRes.order_id || transactionId
      transactionIdGlobal.value = finalOrderId

      // LANGKAH 6: Tunggu minimal 3.5 detik (untuk animasi printer tiket)
      const elapsed = Date.now() - startTime
      if (elapsed < 3500) {
        await new Promise(r => setTimeout(r, 3500 - elapsed))
      }

      return { isFree: isGenuinelyFree, transactionId: finalOrderId }

    } catch (err: any) {
      isSubmitting.value = false
      isPrinting.value = false
      throw err
    }
  }

  return {
    isSubmitting,
    isPrinting,
    buktiBayarFile,
    buktiBayarPreview,
    uploadError,
    transactionIdGlobal,
    processEspaySubmit,
    processManualSubmit
  }
}
