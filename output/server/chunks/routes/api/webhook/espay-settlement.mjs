import { d as defineEventHandler, w as getMethod, r as readBody, a as createError, x as getEspayDatetime, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const espaySettlement = defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET" || method === "HEAD") {
    return { status: "ok", service: "Espay Settlement Webhook", timestamp: (/* @__PURE__ */ new Date()).toISOString() };
  }
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request: Empty Body" });
  }
  const rqUuid = body.rq_uuid || "";
  body.rq_datetime || "";
  const commCode = body.comm_code || "";
  const rsDatetime = getEspayDatetime(/* @__PURE__ */ new Date());
  const config = useRuntimeConfig();
  const expectedCommCode = config.espayCommCode || process.env.ESPAY_COMM_CODE;
  if (expectedCommCode && commCode && commCode !== expectedCommCode) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden: Invalid merchant code" });
  }
  let settlementData = [];
  try {
    if (typeof body.data === "string") {
      settlementData = JSON.parse(body.data);
    } else if (Array.isArray(body.data)) {
      settlementData = body.data;
    }
  } catch (err) {
    console.warn("[Espay Settlement] Gagal parse data settlement:", err);
  }
  console.log(`[Espay Settlement] Menerima notifikasi settlement (${settlementData.length} transaksi) dari ${commCode}`);
  for (const item of settlementData) {
    console.log(`[Espay Settlement] TX: ${item.tx_id}, Amount: ${item.settlement_amount}, Fee: ${item.settlement_fee}, Date: ${item.settlement_date}`);
  }
  return {
    rq_uuid: rqUuid,
    rs_datetime: rsDatetime,
    error_code: "0000",
    error_message: "Success"
  };
});

export { espaySettlement as default };
//# sourceMappingURL=espay-settlement.mjs.map
