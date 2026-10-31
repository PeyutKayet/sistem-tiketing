import { d as defineEventHandler, c as checkSuperAdmin, s as serverSupabaseServiceRole, a as createError, g as generateAdminVerifyToken } from '../../nitro/nitro.mjs';
import 'node:crypto';
import '@supabase/supabase-js';
import '@supabase/ssr';
import 'crypto';
import 'fs';
import 'path';
import 'qrcode';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';

const adminBackupOrders_get = defineEventHandler(async (event) => {
  var _a;
  await checkSuperAdmin(event);
  const supabase = await serverSupabaseServiceRole(event);
  const { data: orders, error: ordersError } = await supabase.from("orders").select(`
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
    `).eq("status_pembayaran", "pending").or("metode_pembayaran.eq.qris_backup_tyket,metode_pembayaran.eq.manual,data_transaksi->>tipe_gateway.eq.manual_tyket").order("created_at", { ascending: false }).limit(200);
  if (ordersError) {
    console.error("[admin-backup-orders] Gagal memuat orders:", ordersError);
    throw createError({ statusCode: 500, statusMessage: ordersError.message });
  }
  if (!orders || orders.length === 0) {
    return { backupOrders: [] };
  }
  const orderIds = orders.map((o) => o.id);
  const { data: pesertaRows, error: pesertaError } = await supabase.from("peserta").select("id, order_id, nama_lengkap, email, no_wa, nama_tiket, bukti_bayar_url, data_tambahan").or(`order_id.in.(${orderIds.join(",")}),data_tambahan->>order_id.in.(${orderIds.join(",")})`);
  if (pesertaError) {
    console.warn("[admin-backup-orders] Gagal memuat peserta:", pesertaError);
  }
  const pesertaByOrder = /* @__PURE__ */ new Map();
  if (pesertaRows) {
    for (const p of pesertaRows) {
      const oid = p.order_id || ((_a = p.data_tambahan) == null ? void 0 : _a.order_id);
      if (oid) {
        if (!pesertaByOrder.has(oid)) pesertaByOrder.set(oid, []);
        pesertaByOrder.get(oid).push(p);
      }
    }
  }
  const formattedOrders = orders.map((o) => {
    var _a2, _b, _c, _d;
    const pList = pesertaByOrder.get(o.id) || [];
    const firstP = pList[0] || {};
    const buktiBayarUrl = ((_a2 = pList.find((p) => p.bukti_bayar_url)) == null ? void 0 : _a2.bukti_bayar_url) || o.payment_reference || null;
    const verifyToken = generateAdminVerifyToken(o.id);
    return {
      id: o.id,
      event_id: o.event_id,
      nama_event: ((_b = o.event) == null ? void 0 : _b.nama_event) || "Event",
      pembeli_nama: o.pembeli_nama || firstP.nama_lengkap || "Peserta",
      pembeli_email: o.pembeli_email || firstP.email || "-",
      pembeli_wa: o.pembeli_wa || firstP.no_wa || "-",
      total_tagihan: o.total_tagihan,
      subtotal_tiket: o.subtotal_tiket,
      nominal_infaq: o.nominal_infaq,
      kode_unik: ((_c = o.data_transaksi) == null ? void 0 : _c.kode_unik) || 0,
      metode_pembayaran: o.metode_pembayaran,
      tipe_gateway: ((_d = o.data_transaksi) == null ? void 0 : _d.tipe_gateway) || "manual_tyket",
      status_pembayaran: o.status_pembayaran,
      bukti_bayar_url: buktiBayarUrl,
      ticket_count: pList.length || 1,
      ticket_names: pList.map((p) => p.nama_tiket).filter(Boolean).join(", ") || "-",
      created_at: o.created_at,
      verify_token: verifyToken
    };
  });
  return { backupOrders: formattedOrders };
});

export { adminBackupOrders_get as default };
//# sourceMappingURL=admin-backup-orders.get.mjs.map
