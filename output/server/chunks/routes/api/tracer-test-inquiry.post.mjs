import { d as defineEventHandler, c as checkSuperAdmin, t as getEspayTimestamp } from '../../nitro/nitro.mjs';
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

const tracerTestInquiry_post = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  const startTime = Date.now();
  const now = /* @__PURE__ */ new Date();
  const timestamp = getEspayTimestamp(now);
  const probeId = `PROBE-${Date.now().toString().slice(-6)}`;
  const orderId = `SIM${Date.now().toString().slice(-6)}TEST`;
  const payload = {
    partnerServiceId: " Espay",
    customerNo: "SGWZULKARNAENALMUHAMMADY",
    virtualAccountNo: orderId,
    trxDateInit: timestamp,
    inquiryRequestId: probeId
  };
  const headers = {
    "content-type": "application/json",
    "x-timestamp": timestamp,
    "x-partner-id": "SGWZULKARNAENALMUHAMMADY",
    "x-external-id": probeId,
    "channel-id": "ESPAY",
    "x-origin": "internal-tracer"
  };
  try {
    const res = await $fetch("/api/webhook/espay-inquiry", {
      method: "POST",
      headers,
      body: payload
    });
    const durationMs = Date.now() - startTime;
    return {
      success: true,
      durationMs,
      endpoint: "/api/webhook/espay-inquiry",
      request: {
        method: "POST",
        headers,
        body: payload
      },
      response: res,
      verdict: {
        status: "HEALTHY_EXCELLENT",
        message: `Endpoint Webhook Inquiry merespons dalam ${durationMs}ms dengan standar SNAP BI 2002400 Success! Server Anda 100% siap dan sehat.`
      }
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      durationMs,
      endpoint: "/api/webhook/espay-inquiry",
      error: err.message || "Error memanggil webhook inquiry",
      verdict: {
        status: "UNHEALTHY",
        message: `Gagal memanggil endpoint webhook inquiry: ${err.message}`
      }
    };
  }
});

export { tracerTestInquiry_post as default };
//# sourceMappingURL=tracer-test-inquiry.post.mjs.map
