import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import handler from '../../webhook/espay-inquiry.mjs';
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

const inquiry = defineEventHandler(async (event) => {
  return handler(event);
});

export { inquiry as default };
//# sourceMappingURL=inquiry.mjs.map
