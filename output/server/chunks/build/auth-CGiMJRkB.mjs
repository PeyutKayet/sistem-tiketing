import { d as defineNuxtRouteMiddleware, u as useSupabaseUser, n as navigateTo } from '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';
import 'vue-router';
import '@supabase/ssr';
import '@iconify/vue';
import 'vue/server-renderer';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/middleware/auth.ts
var auth_default = defineNuxtRouteMiddleware((to, from) => {
	if (!useSupabaseUser().value && to.path.startsWith("/admin")) return navigateTo("/login");
});

export { auth_default as default };
//# sourceMappingURL=auth-CGiMJRkB.mjs.map
