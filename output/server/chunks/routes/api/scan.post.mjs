import { d as defineEventHandler, r as readBody, a as createError, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const scanPinAttemptMap = /* @__PURE__ */ new Map();
const scan_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!body || !body.event_id || !body.qr_data || !body.pin) {
    throw createError({ statusCode: 400, statusMessage: "Data tidak lengkap." });
  }
  const rateLimitKey = `scan_pin_${body.event_id}`;
  const now = Date.now();
  const attempt = scanPinAttemptMap.get(rateLimitKey);
  if (attempt && attempt.lockedUntil > now) {
    const sisa = Math.ceil((attempt.lockedUntil - now) / 1e3);
    throw createError({
      statusCode: 429,
      statusMessage: `Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara (${sisa} detik lagi).`
    });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data: eventData, error: eventErr } = await supabase.from("event").select("id, organizer_id, settings").eq("id", body.event_id).single();
  if (eventErr || !eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event tidak ditemukan." });
  }
  const { data: orgData } = await supabase.from("organizer_profile").select("pin_scanner").eq("id", eventData.organizer_id).single();
  const correctPin = orgData == null ? void 0 : orgData.pin_scanner;
  if (!correctPin || correctPin === "123456") {
    throw createError({ statusCode: 403, statusMessage: "PIN Scanner belum dikonfigurasi kustom oleh penyelenggara." });
  }
  if (body.pin !== correctPin) {
    const currentCount = (attempt && attempt.lockedUntil <= now ? 0 : (attempt == null ? void 0 : attempt.count) || 0) + 1;
    if (currentCount >= 5) {
      scanPinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: now + 12e4 });
      throw createError({
        statusCode: 429,
        statusMessage: "Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara selama 2 menit."
      });
    } else {
      scanPinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: 0 });
      throw createError({ statusCode: 403, statusMessage: `PIN Scanner tidak valid. (Sisa percobaan: ${5 - currentCount})` });
    }
  }
  scanPinAttemptMap.delete(rateLimitKey);
  let peserta = null;
  const { data: ticketMatches } = await supabase.from("peserta").select("*").eq("event_id", eventData.id).eq("data_tambahan->>ticket_id", body.qr_data).limit(1);
  if (ticketMatches && ticketMatches.length > 0) {
    peserta = ticketMatches[0];
  } else {
    const { data: orderMatches } = await supabase.from("peserta").select("*").eq("event_id", eventData.id).eq("data_tambahan->>order_id", body.qr_data).order("id", { ascending: true });
    if (orderMatches && orderMatches.length > 0) {
      peserta = orderMatches.find((p) => !p.is_scanned) || orderMatches[0];
    }
  }
  if (!peserta) {
    throw createError({ statusCode: 404, statusMessage: "Tiket ini BUKAN untuk event ini, atau QR Code palsu." });
  }
  if (peserta.status_bayar !== "paid") {
    throw createError({ statusCode: 400, statusMessage: `Tiket belum lunas (Status: ${peserta.status_bayar})` });
  }
  const checkinMode = ((_a = eventData.settings) == null ? void 0 : _a.sistem_checkin) || "scanner";
  let responseData = {
    success: false,
    title: "",
    message: "",
    pesertaName: peserta.nama_lengkap
  };
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  if (checkinMode === "scanner") {
    if (peserta.is_scanned) {
      responseData.success = false;
      responseData.title = "DITOLAK!";
      responseData.message = "Tiket ini sudah pernah di-scan dan di-check-in sebelumnya.";
    } else {
      const { data: updatedRows, error: updateErr } = await supabase.from("peserta").update({ is_scanned: true, scanned_at: nowIso }).eq("id", peserta.id).eq("is_scanned", false).select("id");
      if (updateErr || !updatedRows || updatedRows.length === 0) {
        responseData.success = false;
        responseData.title = "DITOLAK!";
        responseData.message = "Tiket ini baru saja di-scan di pintu lain.";
      } else {
        try {
          await supabase.from("riwayat_absen").insert({ peserta_id: peserta.id, metode: "scanner_gate", waktu_absen: nowIso });
        } catch (e) {
        }
        responseData.success = true;
        responseData.title = "AKSES DITERIMA";
        responseData.message = "Check-in berhasil dicatat.";
      }
    }
  } else if (checkinMode === "none") {
    if (!peserta.is_scanned) {
      await supabase.from("peserta").update({ is_scanned: true, scanned_at: nowIso }).eq("id", peserta.id);
    }
    try {
      await supabase.from("riwayat_absen").insert({ peserta_id: peserta.id, metode: "scanner_free_access", waktu_absen: nowIso });
    } catch (e) {
    }
    responseData.success = true;
    responseData.title = "SILAKAN MASUK";
    responseData.message = "Akses tanpa batas keluar-masuk (Pameran).";
  } else if (checkinMode === "portal") {
    if (!peserta.is_scanned) {
      await supabase.from("peserta").update({ is_scanned: true, scanned_at: nowIso }).eq("id", peserta.id);
    }
    try {
      await supabase.from("riwayat_absen").insert({ peserta_id: peserta.id, metode: "portal_multi_hari", waktu_absen: nowIso });
    } catch (e) {
    }
    responseData.success = true;
    responseData.title = "AKSES MULTI-HARI";
    responseData.message = "Log kehadiran berhasil dicatat.";
  }
  return responseData;
});

export { scan_post as default };
//# sourceMappingURL=scan.post.mjs.map
