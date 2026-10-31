import { d as defineEventHandler, r as readBody, a as createError, b as verifyOrderCancelToken, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const cancelOrder_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orderId = body == null ? void 0 : body.order_id;
  const cancelToken = body == null ? void 0 : body.cancel_token;
  if (!orderId || typeof orderId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Parameter order_id wajib diisi" });
  }
  if (!cancelToken || typeof cancelToken !== "string") {
    throw createError({ statusCode: 403, statusMessage: "Token keamanan pembatalan (cancel_token) wajib disertakan" });
  }
  const isValid = verifyOrderCancelToken(orderId, cancelToken);
  if (!isValid) {
    throw createError({ statusCode: 403, statusMessage: "Akses ditolak: Token pembatalan pesanan tidak valid" });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data: pesertas, error: findErr } = await supabase.from("peserta").select("id, status_bayar").eq("data_tambahan->>order_id", orderId);
  if (findErr) {
    throw createError({ statusCode: 500, statusMessage: "Gagal mencari pesanan: " + findErr.message });
  }
  if (!pesertas || pesertas.length === 0) {
    return { success: true, message: "Pesanan tidak ditemukan atau sudah dibersihkan" };
  }
  const alreadyPaid = pesertas.some((p) => p.status_bayar === "paid");
  if (alreadyPaid) {
    throw createError({ statusCode: 400, statusMessage: "Pesanan sudah dibayar, tidak dapat dibatalkan." });
  }
  const ids = pesertas.map((p) => p.id);
  const { error: updateErr } = await supabase.from("peserta").update({ status_bayar: "cancelled" }).in("id", ids);
  if (updateErr) {
    throw createError({ statusCode: 500, statusMessage: "Gagal membatalkan pesanan: " + updateErr.message });
  }
  return {
    success: true,
    message: "Pesanan berhasil dibatalkan.",
    order_id: orderId,
    cancelled_count: ids.length
  };
});

export { cancelOrder_post as default };
//# sourceMappingURL=cancel-order.post.mjs.map
