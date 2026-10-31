import { l as defineCachedEventHandler, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const gatewayStatus_get = defineCachedEventHandler(async (event) => {
  var _a, _b;
  try {
    const supabase = await serverSupabaseServiceRole(event);
    const { data, error } = await supabase.from("platform_settings").select("value").eq("key", "payment_gateway").maybeSingle();
    if (error || !data) {
      return {
        is_emergency_backup: false,
        emergency_message: "Sistem pembayaran otomatis sedang dalam pemeliharaan. Silakan transfer manual."
      };
    }
    return {
      is_emergency_backup: ((_a = data.value) == null ? void 0 : _a.is_emergency_backup) === true,
      emergency_message: ((_b = data.value) == null ? void 0 : _b.emergency_message) || "Sistem pembayaran otomatis sedang dalam pemeliharaan. Silakan transfer manual."
    };
  } catch (err) {
    return {
      is_emergency_backup: false,
      emergency_message: ""
    };
  }
}, {
  maxAge: 30,
  // Cache 30 detik
  name: "gateway-status-cache"
});

export { gatewayStatus_get as default };
//# sourceMappingURL=gateway-status.get.mjs.map
