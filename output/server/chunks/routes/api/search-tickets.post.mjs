import { d as defineEventHandler, n as getRequestIP, a as createError, r as readBody, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const rateLimitMap = /* @__PURE__ */ new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1e3 });
    return true;
  }
  if (record.count >= 6) {
    return false;
  }
  record.count++;
  return true;
}
const searchTickets_post = defineEventHandler(async (event) => {
  var _a, _b;
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  if (!checkRateLimit(clientIp)) {
    throw createError({
      statusCode: 429,
      statusMessage: "Terlalu banyak percobaan pencarian. Mohon tunggu 1 menit sebelum mencoba lagi."
    });
  }
  const body = await readBody(event);
  const rawWa = (body == null ? void 0 : body.no_wa) ? String(body.no_wa).trim() : "";
  const rawEmail = (body == null ? void 0 : body.email) ? String(body.email).trim().toLowerCase() : "";
  if (!rawWa || !rawEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: "Harap masukkan Nomor WhatsApp dan Alamat Email pendaftaran dengan lengkap."
    });
  }
  const digits = rawWa.replace(/\D/g, "");
  if (digits.length < 8) {
    throw createError({ statusCode: 400, statusMessage: "Nomor WhatsApp tidak valid." });
  }
  const waVariants = [digits];
  if (digits.startsWith("0")) {
    waVariants.push("62" + digits.substring(1));
  } else if (digits.startsWith("62")) {
    waVariants.push("0" + digits.substring(2));
  } else {
    waVariants.push("62" + digits);
    waVariants.push("0" + digits);
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data: pesertas, error: findErr } = await supabase.from("peserta").select(`
      id,
      event_id,
      kategori_id,
      nama_lengkap,
      email,
      no_wa,
      nama_tiket,
      status_bayar,
      is_scanned,
      scanned_at,
      bukti_bayar_url,
      data_tambahan,
      created_at,
      event:event_id (
        id,
        nama_event,
        slug,
        lokasi,
        tanggal_mulai,
        poster_url,
        settings,
        organizer_id,
        organizer_profile:organizer_id (
          nama_organizer,
          no_wa,
          link_ig,
          link_web,
          logo_url
        )
      ),
      kategori:kategori_id (
        id,
        nama_kategori,
        harga
      )
    `).in("no_wa", waVariants).ilike("email", rawEmail).neq("status_bayar", "cancelled").order("created_at", { ascending: false });
  if (findErr) {
    console.error("[Search Tickets] Supabase Error:", findErr);
    throw createError({ statusCode: 500, statusMessage: `Gagal mencari tiket: ${findErr.message}` });
  }
  if (!pesertas || pesertas.length === 0) {
    return {
      success: true,
      found: false,
      message: "Tiket tidak ditemukan. Pastikan Nomor WhatsApp dan Email yang Anda masukkan sama persis dengan saat pendaftaran.",
      orders: []
    };
  }
  const orderMap = /* @__PURE__ */ new Map();
  for (const p of pesertas) {
    const orderId = p.order_id || ((_a = p.data_tambahan) == null ? void 0 : _a.order_id) || `TRX-${p.id}`;
    if (!orderMap.has(orderId)) {
      orderMap.set(orderId, {
        order_id: orderId,
        event: p.event,
        created_at: p.created_at,
        status_bayar: p.status_bayar,
        bukti_bayar_url: p.bukti_bayar_url,
        tickets: []
      });
    }
    const orderObj = orderMap.get(orderId);
    orderObj.tickets.push({
      id: p.id,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      no_wa: p.no_wa,
      nama_tiket: p.nama_tiket,
      ticket_id: ((_b = p.data_tambahan) == null ? void 0 : _b.ticket_id) || `TIK-${p.id}`,
      kategori: p.kategori,
      is_scanned: p.is_scanned || false,
      scanned_at: p.scanned_at || null
    });
  }
  const orders = Array.from(orderMap.values());
  return {
    success: true,
    found: true,
    total_tickets: pesertas.length,
    orders
  };
});

export { searchTickets_post as default };
//# sourceMappingURL=search-tickets.post.mjs.map
