import { d as defineEventHandler, r as readBody, a as createError, v as verifyAdminToken, c as checkSuperAdmin, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const adminVerifyOrder_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orderId = body == null ? void 0 : body.orderId;
  const token = body == null ? void 0 : body.token;
  const action = (body == null ? void 0 : body.action) || "verify";
  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: "Data verifikasi tidak lengkap (Missing orderId)." });
  }
  let isAuthorized = false;
  if (token) {
    isAuthorized = verifyAdminToken(orderId, token);
  }
  if (!isAuthorized) {
    try {
      await checkSuperAdmin(event);
      isAuthorized = true;
    } catch (e) {
    }
  }
  if (!isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: "Akses ditolak: Token verifikasi tidak valid atau Anda bukan Super Admin." });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data: pesertas, error: findErr } = await supabase.from("peserta").select("id, status_bayar, data_tambahan").or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`);
  if (findErr || !pesertas || pesertas.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Pesanan tidak ditemukan di database." });
  }
  const ids = pesertas.map((p) => p.id);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  if (action === "reject") {
    const { error: cancelErr } = await supabase.from("peserta").update({ status_bayar: "cancelled" }).in("id", ids);
    if (cancelErr) {
      throw createError({ statusCode: 500, statusMessage: `Gagal membatalkan pesanan: ${cancelErr.message}` });
    }
    try {
      const { data: currOrder } = await supabase.from("orders").select("data_transaksi").eq("id", orderId).maybeSingle();
      await supabase.from("orders").update({
        status_pembayaran: "cancelled",
        updated_at: nowIso,
        data_transaksi: {
          ...(currOrder == null ? void 0 : currOrder.data_transaksi) || {},
          cancelled_by: "admin_tyket",
          cancelled_at: nowIso
        }
      }).eq("id", orderId);
    } catch (ordErr) {
      console.warn("[Admin Verify Order] Gagal update status cancel di tabel orders:", ordErr);
    }
    return {
      success: true,
      orderId,
      action: "reject",
      ticketCount: ids.length,
      message: "Pesanan telah berhasil ditolak/dibatalkan."
    };
  }
  const { error: updateErr } = await supabase.from("peserta").update({
    status_bayar: "paid",
    status_dana: "CAIR"
  }).in("id", ids);
  if (updateErr) {
    console.error("[Admin Verify Order] DB Update error:", updateErr);
    throw createError({ statusCode: 500, statusMessage: `Gagal memperbarui status pesanan: ${updateErr.message}` });
  }
  try {
    const { data: currOrder } = await supabase.from("orders").select("data_transaksi").eq("id", orderId).maybeSingle();
    const updatedDt = {
      ...(currOrder == null ? void 0 : currOrder.data_transaksi) || {},
      verified_by: "admin_tyket",
      verified_at: nowIso
    };
    await supabase.from("orders").update({
      status_pembayaran: "paid",
      status_dana: "CAIR",
      paid_at: nowIso,
      updated_at: nowIso,
      data_transaksi: updatedDt
    }).eq("id", orderId);
  } catch (ordErr) {
    console.warn("[Admin Verify Order] Gagal update status di tabel orders:", ordErr);
  }
  return {
    success: true,
    orderId,
    action: "verify",
    ticketCount: ids.length,
    message: "Pembayaran berhasil diverifikasi. Barcode E-Ticket peserta telah aktif."
  };
});

export { adminVerifyOrder_post as default };
//# sourceMappingURL=admin-verify-order.post.mjs.map
