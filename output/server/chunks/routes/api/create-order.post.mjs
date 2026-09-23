import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';

const createOrder_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.transactionId) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request: Missing required data" });
  }
  const config = useRuntimeConfig();
  const fonnteToken = config.fonnteToken || "JM3pexhRKQu9h5DHQ7Cg";
  const adminPhone = config.adminPhone || "6285156575710";
  const adminVerifyUrl = "https://saas.e-tiket.web.id/admin-verify";
  const pesanAdmin = `\u{1F6A8} *PESANAN BARU MASUK*
Event: ${body.namaEvent || "Event"}
Order ID: ${body.transactionId}
Total Transfer: *Rp ${Number(body.infaqNominal || 0).toLocaleString("id-ID")}*

Cek & Verifikasi disini:
${adminVerifyUrl}?id=${body.transactionId}`;
  const formData = new FormData();
  formData.append("target", adminPhone);
  formData.append("message", pesanAdmin);
  $fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: { "Authorization": fonnteToken },
    body: formData
  }).catch((error) => {
    console.error("Gagal kirim WA di background:", error);
  });
  return { status: "success" };
});

export { createOrder_post as default };
//# sourceMappingURL=create-order.post.mjs.map
