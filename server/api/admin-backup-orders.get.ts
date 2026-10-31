import { serverSupabaseServiceRole } from '#supabase/server'
import { checkSuperAdmin } from '../utils/checkSuperAdmin'
import { generateAdminVerifyToken } from '../utils/adminToken'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang boleh mengakses antrean cadangan ini
  await checkSuperAdmin(event)

  const supabase = await serverSupabaseServiceRole(event)

  // 1. Ambil pesanan yang berstatus pending dengan tipe manual / backup
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      event_id,
      pembeli_nama,
      pembeli_email,
      pembeli_wa,
      subtotal_tiket,
      nominal_infaq,
      biaya_admin,
      biaya_gateway,
      total_tagihan,
      status_pembayaran,
      status_dana,
      metode_pembayaran,
      payment_reference,
      data_transaksi,
      created_at,
      event:event_id (id, nama_event)
    `)
    .eq('status_pembayaran', 'pending')
    .or("metode_pembayaran.eq.qris_backup_tyket,metode_pembayaran.eq.manual,data_transaksi->>tipe_gateway.eq.manual_tyket")
    .order('created_at', { ascending: false })
    .limit(200)

  if (ordersError) {
    console.error('[admin-backup-orders] Gagal memuat orders:', ordersError)
    throw createError({ statusCode: 500, statusMessage: ordersError.message })
  }

  if (!orders || orders.length === 0) {
    return { backupOrders: [] }
  }

  const orderIds = orders.map(o => o.id)

  // 2. Ambil data peserta yang terkait untuk bukti bayar dan nama tiket
  const { data: pesertaRows, error: pesertaError } = await supabase
    .from('peserta')
    .select('id, order_id, nama_lengkap, email, no_wa, nama_tiket, bukti_bayar_url, data_tambahan')
    .or(`order_id.in.(${orderIds.join(',')}),data_tambahan->>order_id.in.(${orderIds.join(',')})`)

  if (pesertaError) {
    console.warn('[admin-backup-orders] Gagal memuat peserta:', pesertaError)
  }

  const pesertaByOrder = new Map<string, any[]>()
  if (pesertaRows) {
    for (const p of pesertaRows) {
      const oid = p.order_id || p.data_tambahan?.order_id
      if (oid) {
        if (!pesertaByOrder.has(oid)) pesertaByOrder.set(oid, [])
        pesertaByOrder.get(oid)!.push(p)
      }
    }
  }

  // 3. Format hasil data agar siap disajikan di antrean Super Admin
  const formattedOrders = orders.map(o => {
    const pList = pesertaByOrder.get(o.id) || []
    const firstP = pList[0] || {}
    const buktiBayarUrl = pList.find(p => p.bukti_bayar_url)?.bukti_bayar_url || o.payment_reference || null
    const verifyToken = generateAdminVerifyToken(o.id)

    return {
      id: o.id,
      event_id: o.event_id,
      nama_event: (o.event as any)?.nama_event || 'Event',
      pembeli_nama: o.pembeli_nama || firstP.nama_lengkap || 'Peserta',
      pembeli_email: o.pembeli_email || firstP.email || '-',
      pembeli_wa: o.pembeli_wa || firstP.no_wa || '-',
      total_tagihan: o.total_tagihan,
      subtotal_tiket: o.subtotal_tiket,
      nominal_infaq: o.nominal_infaq,
      kode_unik: o.data_transaksi?.kode_unik || 0,
      metode_pembayaran: o.metode_pembayaran,
      tipe_gateway: o.data_transaksi?.tipe_gateway || 'manual_tyket',
      status_pembayaran: o.status_pembayaran,
      bukti_bayar_url: buktiBayarUrl,
      ticket_count: pList.length || 1,
      ticket_names: pList.map(p => p.nama_tiket).filter(Boolean).join(', ') || '-',
      created_at: o.created_at,
      verify_token: verifyToken
    }
  })

  return { backupOrders: formattedOrders }
})
