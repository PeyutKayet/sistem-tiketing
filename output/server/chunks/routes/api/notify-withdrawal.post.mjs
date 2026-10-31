import { d as defineEventHandler, m as serverSupabaseClient, a as createError, r as readBody, j as getFonnteConfig } from '../../nitro/nitro.mjs';
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

const withdrawalRateLimitMap = /* @__PURE__ */ new Map();
const notifyWithdrawal_post = defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized: Silakan login terlebih dahulu." });
  }
  const body = await readBody(event);
  if (!body || !body.nominal || !body.nama_organizer) {
    throw createError({ statusCode: 400, statusMessage: "Missing required data" });
  }
  const now = Date.now();
  const lastSent = withdrawalRateLimitMap.get(user.id) || 0;
  if (now - lastSent < 6e4) {
    return { status: "success", message: "Notifikasi sebelumnya sudah terkirim." };
  }
  withdrawalRateLimitMap.set(user.id, now);
  const { fonnteToken, adminPhone } = getFonnteConfig();
  const pesan = `\u{1F6A8} *NOTIFIKASI PENARIKAN DANA* \u{1F6A8}

Organizer: *${body.nama_organizer}*
Telah mengajukan penarikan dana sebesar:
*Rp ${Number(body.nominal).toLocaleString("id-ID")}*

Silakan cek detail dan proses penarikan di panel Super Admin.`;
  const formData = new FormData();
  formData.append("target", adminPhone);
  formData.append("message", pesan);
  try {
    $fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { "Authorization": fonnteToken },
      body: formData
    }).catch((e) => console.error("[Notify Withdrawal] Gagal kirim WA Fonnte:", e));
    return { status: "success", adminPhone };
  } catch (error) {
    return { status: "success", adminPhone };
  }
});

export { notifyWithdrawal_post as default };
//# sourceMappingURL=notify-withdrawal.post.mjs.map
