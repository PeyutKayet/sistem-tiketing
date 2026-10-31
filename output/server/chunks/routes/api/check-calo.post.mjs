import { d as defineEventHandler, r as readBody, s as serverSupabaseServiceRole, a as createError } from '../../nitro/nitro.mjs';
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

const checkCalo_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const body = await readBody(event);
  if (!body || !body.event_id || !body.peserta) {
    return { success: true };
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data: eventData } = await supabase.from("event").select("settings").eq("id", body.event_id).single();
  if (!eventData || !((_a = eventData.settings) == null ? void 0 : _a.is_anti_calo_email) && !((_b = eventData.settings) == null ? void 0 : _b.is_anti_calo_wa)) {
    return { success: true };
  }
  const emails = body.peserta.map((p) => p.email).filter(Boolean);
  const was = body.peserta.map((p) => p.no_wa).filter(Boolean);
  if (((_c = eventData.settings) == null ? void 0 : _c.is_anti_calo_email) && new Set(emails).size !== emails.length) {
    throw createError({ statusCode: 400, statusMessage: "Sistem Anti-Calo: 1 Email hanya untuk 1 tiket." });
  }
  if (((_d = eventData.settings) == null ? void 0 : _d.is_anti_calo_wa) && new Set(was).size !== was.length) {
    throw createError({ statusCode: 400, statusMessage: "Sistem Anti-Calo: 1 No WA hanya untuk 1 tiket." });
  }
  const checks = [];
  if (((_e = eventData.settings) == null ? void 0 : _e.is_anti_calo_email) && emails.length > 0) {
    checks.push(
      supabase.from("peserta").select("id, email, status_bayar, created_at").eq("event_id", body.event_id).neq("status_bayar", "cancelled").in("email", emails).then(async ({ data }) => {
        if (data && data.length > 0) {
          const expiredIds = [];
          let hasActiveViolation = false;
          for (const row of data) {
            if (row.status_bayar === "paid") {
              hasActiveViolation = true;
              break;
            }
            const isRecent = new Date(row.created_at).getTime() > Date.now() - 15 * 60 * 1e3;
            if (isRecent) {
              hasActiveViolation = true;
              break;
            } else {
              expiredIds.push(row.id);
            }
          }
          if (expiredIds.length > 0) {
            supabase.from("peserta").update({ status_bayar: "cancelled" }).in("id", expiredIds).then(() => {
            });
          }
          if (hasActiveViolation) {
            throw createError({ statusCode: 400, statusMessage: "Sistem Anti-Calo: Email tersebut sudah terdaftar atau memiliki tagihan aktif." });
          }
        }
      })
    );
  }
  if (((_f = eventData.settings) == null ? void 0 : _f.is_anti_calo_wa) && was.length > 0) {
    checks.push(
      supabase.from("peserta").select("id, no_wa, status_bayar, created_at").eq("event_id", body.event_id).neq("status_bayar", "cancelled").in("no_wa", was).then(async ({ data }) => {
        if (data && data.length > 0) {
          const expiredIds = [];
          let hasActiveViolation = false;
          for (const row of data) {
            if (row.status_bayar === "paid") {
              hasActiveViolation = true;
              break;
            }
            const isRecent = new Date(row.created_at).getTime() > Date.now() - 15 * 60 * 1e3;
            if (isRecent) {
              hasActiveViolation = true;
              break;
            } else {
              expiredIds.push(row.id);
            }
          }
          if (expiredIds.length > 0) {
            supabase.from("peserta").update({ status_bayar: "cancelled" }).in("id", expiredIds).then(() => {
            });
          }
          if (hasActiveViolation) {
            throw createError({ statusCode: 400, statusMessage: "Sistem Anti-Calo: Nomor WhatsApp tersebut sudah terdaftar atau memiliki tagihan aktif." });
          }
        }
      })
    );
  }
  await Promise.all(checks);
  return { success: true };
});

export { checkCalo_post as default };
//# sourceMappingURL=check-calo.post.mjs.map
