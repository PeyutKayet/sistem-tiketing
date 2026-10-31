import { d as defineEventHandler, c as checkSuperAdmin, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const masterGateway_get = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  try {
    const supabase = await serverSupabaseServiceRole(event);
    const { data, error } = await supabase.from("platform_settings").select("*").eq("key", "payment_gateway").maybeSingle();
    if (error) throw error;
    const val = (data == null ? void 0 : data.value) || {};
    return {
      is_emergency_backup: val.is_emergency_backup === true,
      emergency_message: val.emergency_message || "Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.",
      updated_by: val.updated_by || "master@tyket.id",
      updated_at: (data == null ? void 0 : data.updated_at) || val.updated_at || null
    };
  } catch (err) {
    return {
      is_emergency_backup: false,
      emergency_message: "Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.",
      updated_by: "system",
      updated_at: null,
      error: err.message
    };
  }
});

export { masterGateway_get as default };
//# sourceMappingURL=master-gateway.get.mjs.map
