import { d as defineEventHandler, c as checkSuperAdmin, r as readBody, a as createError, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const masterUpdatePeserta_post = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  const body = await readBody(event);
  if (!body || !body.ids || !Array.isArray(body.ids)) {
    throw createError({ statusCode: 400, statusMessage: "Missing ids array" });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data, error } = await supabase.from("peserta").update({ status_dana: "CAIR" }).in("id", body.ids).select();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  return { success: true, count: (data == null ? void 0 : data.length) || 0 };
});

export { masterUpdatePeserta_post as default };
//# sourceMappingURL=master-update-peserta.post.mjs.map
