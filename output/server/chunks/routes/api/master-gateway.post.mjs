import { d as defineEventHandler, c as checkSuperAdmin, r as readBody, a as createError, m as serverSupabaseClient, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const masterGateway_post = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  const body = await readBody(event);
  if (typeof (body == null ? void 0 : body.is_emergency_backup) !== "boolean") {
    throw createError({ statusCode: 400, statusMessage: "Field is_emergency_backup (boolean) wajib disertakan" });
  }
  const supabaseUserClient = await serverSupabaseClient(event);
  const { data: { user } } = await supabaseUserClient.auth.getUser();
  const updatedByEmail = (user == null ? void 0 : user.email) || "master@tyket.id";
  const emergencyMessage = body.emergency_message || "Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.";
  const supabase = await serverSupabaseServiceRole(event);
  const payloadValue = {
    is_emergency_backup: body.is_emergency_backup,
    emergency_message: emergencyMessage,
    updated_by: updatedByEmail,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { data, error } = await supabase.from("platform_settings").upsert({
    key: "payment_gateway",
    value: payloadValue,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select().single();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Gagal memperbarui status gateway: " + error.message });
  }
  return {
    success: true,
    data: (data == null ? void 0 : data.value) || payloadValue
  };
});

export { masterGateway_post as default };
//# sourceMappingURL=master-gateway.post.mjs.map
