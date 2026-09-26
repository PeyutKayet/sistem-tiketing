import { d as defineEventHandler, e as readRawBody, c as createError, b as getHeader, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import require$$1 from 'crypto';
import { createClient } from '@supabase/supabase-js';
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

const kasera_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const rawBody = await readRawBody(event, "utf-8");
  if (!rawBody) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  }
  const signature = getHeader(event, "Kasera-Signature-V1");
  if (!signature) {
    throw createError({ statusCode: 401, statusMessage: "Missing signature" });
  }
  const parts = signature.split(",");
  const t = Number(parts[0].slice(2));
  if (!Number.isFinite(t)) {
    throw createError({ statusCode: 401, statusMessage: "Invalid signature timestamp" });
  }
  if (Math.abs(Date.now() / 1e3 - t) > 300) {
    throw createError({ statusCode: 401, statusMessage: "Signature expired" });
  }
  const expectedHex = require$$1.createHmac("sha256", config.kaseraWebhookSecret).update(t + "." + rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expectedHex);
  const isValid = parts.slice(1).filter((p) => p.startsWith("v1=")).some((p) => {
    const sig = Buffer.from(p.slice(3));
    return sig.length === expectedBuffer.length && require$$1.timingSafeEqual(sig, expectedBuffer);
  });
  if (!isValid) {
    console.error("Invalid Kasera-Signature-V1");
    throw createError({ statusCode: 401, statusMessage: "Invalid signature" });
  }
  const payload = JSON.parse(rawBody);
  if (payload.type === "payment.paid" && payload.data.status === "succeeded") {
    const orderId = payload.data.external_id;
    const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
    const { data: pesertas, error: findErr } = await supabase.from("peserta").select("id").eq("data_tambahan->>order_id", orderId);
    if (findErr || !pesertas || pesertas.length === 0) {
      console.error("Pesanan tidak ditemukan untuk order_id:", orderId);
      return { status: "ignored", message: "Order not found" };
    }
    const ids = pesertas.map((p) => p.id);
    const { error: updateErr } = await supabase.from("peserta").update({ status_bayar: "paid" }).in("id", ids);
    if (updateErr) {
      console.error("Gagal update status DB:", updateErr);
      throw createError({ statusCode: 500, statusMessage: "Database error" });
    }
    console.log(`Berhasil melunaskan pesanan ${orderId} otomatis via Kasera Webhook`);
    return { status: "success" };
  }
  return { status: "ignored" };
});

export { kasera_post as default };
//# sourceMappingURL=kasera.post.mjs.map
