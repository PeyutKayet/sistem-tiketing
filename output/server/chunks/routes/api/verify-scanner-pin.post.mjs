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

const pinAttemptMap = /* @__PURE__ */ new Map();
const verifyScannerPin_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.event_id || !body.pin) {
    throw createError({ statusCode: 400, statusMessage: "Event ID dan PIN wajib diisi." });
  }
  const rateLimitKey = `pin_${body.event_id}`;
  const now = Date.now();
  const attempt = pinAttemptMap.get(rateLimitKey);
  if (attempt && attempt.lockedUntil > now) {
    const sisa = Math.ceil((attempt.lockedUntil - now) / 1e3);
    throw createError({
      statusCode: 429,
      statusMessage: `Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara (${sisa} detik lagi).`
    });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data: eventData, error: eventErr } = await supabase.from("event").select("id, organizer_id").eq("id", body.event_id).single();
  if (eventErr || !eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event tidak ditemukan." });
  }
  const { data: orgData, error: orgErr } = await supabase.from("organizer_profile").select("pin_scanner").eq("id", eventData.organizer_id).single();
  if (orgErr || !orgData) {
    throw createError({ statusCode: 404, statusMessage: "Profil penyelenggara tidak ditemukan." });
  }
  const correctPin = orgData.pin_scanner;
  if (!correctPin || correctPin === "123456") {
    throw createError({
      statusCode: 403,
      statusMessage: "Penyelenggara belum mengatur PIN Scanner kustom. Silakan atur PIN 6 digit di Pengaturan Dashboard Admin."
    });
  }
  if (body.pin !== correctPin) {
    const currentCount = (attempt && attempt.lockedUntil <= now ? 0 : (attempt == null ? void 0 : attempt.count) || 0) + 1;
    if (currentCount >= 5) {
      pinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: now + 12e4 });
      throw createError({
        statusCode: 429,
        statusMessage: "Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara selama 2 menit."
      });
    } else {
      pinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: 0 });
      throw createError({ statusCode: 403, statusMessage: `PIN Scanner tidak valid. (Sisa percobaan: ${5 - currentCount})` });
    }
  }
  pinAttemptMap.delete(rateLimitKey);
  return { valid: true };
});

export { verifyScannerPin_post as default };
//# sourceMappingURL=verify-scanner-pin.post.mjs.map
