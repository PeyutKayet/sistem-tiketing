import { d as defineEventHandler, r as readBody, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
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

const checkWa_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.no_wa) {
    return { used: false };
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { data, error } = await supabase.from("organizer_profile").select("id").eq("no_wa", body.no_wa).single();
  if (data) {
    return { used: true };
  }
  return { used: false };
});

export { checkWa_post as default };
//# sourceMappingURL=check-wa.post.mjs.map
