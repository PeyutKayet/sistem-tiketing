import { d as defineNuxtRouteMiddleware, u as useSupabaseUser, n as navigateTo } from '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue';
import '../nitro/nitro.mjs';
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
import 'vue-router';
import '@vue/shared';
import 'pinia';
import 'fnv1a-64';
import 'object-identity';
import '@iconify/vue';
import 'vue/server-renderer';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/middleware/auth.ts
var auth_default = defineNuxtRouteMiddleware((to, from) => {
	if (!useSupabaseUser().value && (to.path.startsWith("/admin") || to.path.startsWith("/s1u2p3e4r5"))) return navigateTo("/login");
});

export { auth_default as default };
//# sourceMappingURL=auth-CZ3nHg0z.mjs.map
