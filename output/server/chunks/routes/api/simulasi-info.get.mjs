import { d as defineEventHandler, p as getEspayPrivateKey, q as getEspayPublicKey, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const simulasiInfo_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const privateKey = getEspayPrivateKey();
  const publicKey = getEspayPublicKey();
  const commCode = config.espayCommCode || "SGWZULKARNAENALMUHAMMADY";
  const clientId = config.espaySnapClientId || commCode;
  let registeredChannels = null;
  let merchantInfoError = null;
  if (config.espayApiKey) {
    try {
      const form = new URLSearchParams();
      form.append("key", config.espayApiKey);
      const res = await $fetch(`${config.espayApiUrl || "https://sandbox-api.espay.id"}/rest/merchant/merchantinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
      });
      registeredChannels = res;
    } catch (e) {
      merchantInfoError = e.message;
    }
  }
  return {
    apiUrl: config.espayApiUrl || "https://sandbox-api.espay.id",
    commCode,
    clientId,
    apiKey: config.espayApiKey ? `${config.espayApiKey.substring(0, 8)}...` : null,
    sampleMerchant: "SGWYESSISHOP",
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey ? privateKey.length : 0,
    hasPublicKey: !!publicKey,
    hasSignatureKey: !!config.espaySignatureKey,
    registeredChannels,
    merchantInfoError,
    inquiryCallbackPath: "/api/webhook/espay-inquiry",
    paymentCallbackPath: "/api/webhook/espay",
    settlementCallbackPath: "/api/webhook/espay-settlement",
    portalInquiryUrlNotice: "Pastikan disimpan di Portal Merchant Sandbox Espay",
    activeMode: "Sandbox Direct API (disableFallback: true)"
  };
});

export { simulasiInfo_get as default };
//# sourceMappingURL=simulasi-info.get.mjs.map
