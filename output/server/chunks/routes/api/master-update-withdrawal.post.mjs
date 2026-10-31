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

const masterUpdateWithdrawal_post = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  const body = await readBody(event);
  if (!body || !body.id || !body.status) {
    throw createError({ statusCode: 400, statusMessage: "Missing id or status" });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data, error } = await supabase.from("penarikan_dana").update({ status: body.status }).eq("id", body.id).select();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  return { success: true, data };
});

export { masterUpdateWithdrawal_post as default };
//# sourceMappingURL=master-update-withdrawal.post.mjs.map
