import { d as defineEventHandler, r as readBody, a as createError, s as serverSupabaseServiceRole, j as getFonnteConfig, k as getRequestURL } from '../../nitro/nitro.mjs';
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

const resendRateLimitMap = /* @__PURE__ */ new Map();
const resendTicket_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!body || !body.no_wa || !body.ticket_id) {
    throw createError({ statusCode: 400, statusMessage: "Data tidak lengkap: nomor WA dan ticket_id wajib diisi" });
  }
  let noWa = String(body.no_wa).replace(/\D/g, "");
  if (noWa.startsWith("0")) noWa = "62" + noWa.substring(1);
  if (noWa.length < 8) {
    throw createError({ statusCode: 400, statusMessage: "Nomor WhatsApp tidak valid" });
  }
  const rateLimitKey = `${noWa}_${body.ticket_id}`;
  const now = Date.now();
  const lastSent = resendRateLimitMap.get(rateLimitKey) || 0;
  const cooldownMs = 12e4;
  if (now - lastSent < cooldownMs) {
    const sisaDetik = Math.ceil((cooldownMs - (now - lastSent)) / 1e3);
    throw createError({
      statusCode: 429,
      statusMessage: `Mohon tunggu ${sisaDetik} detik lagi sebelum meminta kirim ulang tiket via WhatsApp.`
    });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const waVariants = [noWa];
  if (noWa.startsWith("62")) waVariants.push("0" + noWa.substring(2));
  const { data: pesertas, error: findErr } = await supabase.from("peserta").select("id, nama_lengkap, nama_tiket, no_wa, status_bayar, data_tambahan").or(`data_tambahan->>ticket_id.eq.${body.ticket_id},data_tambahan->>order_id.eq.${body.ticket_id}`).in("no_wa", waVariants).limit(1);
  if (findErr || !pesertas || pesertas.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Tiket tidak ditemukan atau nomor WhatsApp tidak sesuai dengan data pendaftaran."
    });
  }
  const peserta = pesertas[0];
  if (peserta.status_bayar !== "paid") {
    throw createError({
      statusCode: 400,
      statusMessage: "Tiket belum lunas. Hanya tiket yang telah lunas yang dapat dikirimkan."
    });
  }
  const { fonnteToken } = getFonnteConfig();
  const baseUrl = getRequestURL(event).origin || "https://tyket.id";
  const orderId = ((_a = peserta.data_tambahan) == null ? void 0 : _a.order_id) || body.order_id || body.ticket_id;
  const tiketUrl = `${baseUrl}/tiket/${orderId}`;
  const namaTiket = peserta.nama_tiket || body.nama_tiket || "Event";
  const namaLengkap = peserta.nama_lengkap || body.nama_lengkap || "Kak";
  const pesan = `Halo ${namaLengkap},

Berikut adalah tautan e-Tiket resmi Anda untuk acara *${namaTiket}*.

Ticket ID: *${body.ticket_id}*

Silakan cek detail tiket dan barcode masuk Anda melalui tautan berikut:
${tiketUrl}

Terima kasih dan sampai jumpa di lokasi acara! \u{1F64F}`;
  const formData = new FormData();
  formData.append("target", noWa);
  formData.append("message", pesan);
  try {
    const res = await $fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { "Authorization": fonnteToken },
      body: formData
    });
    resendRateLimitMap.set(rateLimitKey, now);
    return { status: "success", message: "Tiket berhasil dikirimkan ke WhatsApp Anda.", data: res };
  } catch (error) {
    console.error("[Resend Ticket] Gagal kirim WA Fonnte:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengirim WhatsApp ke nomor Anda" });
  }
});

export { resendTicket_post as default };
//# sourceMappingURL=resend-ticket.post.mjs.map
