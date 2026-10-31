import { d as defineEventHandler, r as readBody, a as createError, j as getFonnteConfig } from '../../nitro/nitro.mjs';
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

const createOrder_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.transactionId) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request: Missing required data" });
  }
  const totalTransfer = Number(body.grandTotal || body.infaqNominal || 0);
  if (totalTransfer > 0) {
    const { fonnteToken, adminPhone } = getFonnteConfig();
    const adminVerifyUrl = "https://tyket.id/admin-verify";
    const pesanAdmin = `\u{1F6A8} *PESANAN BARU MASUK*
Event: ${body.namaEvent || "Event"}
Order ID: ${body.transactionId}
Total Transfer: *Rp ${totalTransfer.toLocaleString("id-ID")}*

Cek & Verifikasi disini:
${adminVerifyUrl}?id=${body.transactionId}`;
    const formData = new FormData();
    formData.append("target", adminPhone);
    formData.append("message", pesanAdmin);
    $fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { "Authorization": fonnteToken },
      body: formData
    }).then((res) => {
      console.log("Response Fonnte:", res);
    }).catch((error) => {
      var _a;
      console.error("Gagal kirim WA di background. Response:", ((_a = error.response) == null ? void 0 : _a._data) || error.message);
    });
  }
  return { status: "success" };
});

export { createOrder_post as default };
//# sourceMappingURL=create-order.post.mjs.map
