import { a as useHead$1, u as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMEM7jHo.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, watchEffect, mergeProps, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderDynamicModel, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
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
import '@supabase/ssr';
import '@iconify/vue';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/pages/login.vue
var _sfc_main = {
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "EventHub — Login Organizer",
			bodyAttrs: { style: "margin:0; background: #f1f5f9; overflow: hidden;" }
		});
		const router = useRouter();
		useSupabaseClient();
		const user = useSupabaseUser();
		const email = ref("");
		const password = ref("");
		const showPassword = ref(false);
		const isLoadingBtn = ref(null);
		const msg = ref("");
		const msgColor = ref("#d43f34");
		const isLookingAway = ref(false);
		const isSuccess = ref(false);
		watchEffect(() => {
			if (user.value) router.push("/admin");
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "page",
				id: "page"
			}, _attrs))} data-v-6c6a05bb><section id="scene" class="${ssrRenderClass([{ "looking-away": isLookingAway.value }, "scene"])}" data-v-6c6a05bb><div class="scene-bg" data-v-6c6a05bb><div class="quote-box" data-v-6c6a05bb><div class="quote-mark" data-v-6c6a05bb>&quot;</div><div class="quote-text" data-v-6c6a05bb>Create<br data-v-6c6a05bb>Manage<br data-v-6c6a05bb>Celebrate</div><div class="quote-line" data-v-6c6a05bb></div></div><div class="pedestal p1" data-v-6c6a05bb></div><div class="pedestal p2" data-v-6c6a05bb></div><div class="pedestal p3" data-v-6c6a05bb></div><div class="pedestal p4" data-v-6c6a05bb></div><div class="sphere s1" data-v-6c6a05bb></div><div class="sphere s2" data-v-6c6a05bb></div><div class="plant left" data-v-6c6a05bb><svg viewBox="0 0 100 100" fill="#94a3b8" data-v-6c6a05bb><path d="M50 100 C50 100 0 80 0 40 C0 0 50 0 50 0 C50 0 100 80 100 40 C100 0 50 0 50 0 Z" opacity="0.5" data-v-6c6a05bb></path></svg></div><div class="plant right" data-v-6c6a05bb><svg viewBox="0 0 100 100" fill="#cbd5e1" data-v-6c6a05bb><path d="M50 100 C50 100 20 80 20 50 C20 20 50 20 50 20 C50 20 80 80 80 50 C80 20 50 20 50 20 Z" opacity="0.7" data-v-6c6a05bb></path></svg></div></div><!--[-->`);
			ssrRenderList(4, (i) => {
				_push(`<div class="${ssrRenderClass("camera-rig c" + i)}" data-v-6c6a05bb><div class="stand-pole" data-v-6c6a05bb></div><div class="stand-base" data-v-6c6a05bb></div><div class="camera-body" data-v-6c6a05bb><div class="lens" data-v-6c6a05bb><div class="${ssrRenderClass([{ "success-glow": isSuccess.value }, "lens-inner"])}" data-v-6c6a05bb></div><div class="beam" data-v-6c6a05bb></div></div></div></div>`);
			});
			_push(`<!--]--></section><section class="login-card" data-v-6c6a05bb><div class="logo" data-v-6c6a05bb><span class="event" data-v-6c6a05bb>EVENT</span><span class="hub" data-v-6c6a05bb>HUB</span><small data-v-6c6a05bb>ORGANIZER</small></div><h1 data-v-6c6a05bb>Selamat Datang Kembali!</h1><p class="subtitle" data-v-6c6a05bb> Masuk untuk melanjutkan pengelolaan event<br data-v-6c6a05bb> bersama EventHub. </p><form data-v-6c6a05bb><div class="field" data-v-6c6a05bb><span class="icon" data-v-6c6a05bb>✉</span><input type="email"${ssrRenderAttr("value", email.value)} placeholder="Email atau Username" required data-v-6c6a05bb></div><div class="field" data-v-6c6a05bb><span class="icon" data-v-6c6a05bb>🔒</span><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} placeholder="Password" required data-v-6c6a05bb><button type="button" class="toggle" aria-label="Tampilkan password" data-v-6c6a05bb>${ssrInterpolate(showPassword.value ? "◉" : "◌")}</button></div><div class="row" data-v-6c6a05bb><label class="remember" data-v-6c6a05bb><input type="checkbox" data-v-6c6a05bb> Ingat saya </label><a href="#" data-v-6c6a05bb>Lupa password?</a></div><button class="btn" type="submit"${ssrIncludeBooleanAttr(isLoadingBtn.value === "login") ? " disabled" : ""} data-v-6c6a05bb>${ssrInterpolate(isLoadingBtn.value === "login" ? "Memproses..." : "Masuk ➔")}</button><div class="divider" data-v-6c6a05bb>atau</div><button class="signup" type="button"${ssrIncludeBooleanAttr(isLoadingBtn.value === "register") ? " disabled" : ""} data-v-6c6a05bb><svg style="${ssrRenderStyle({
				"width": "18px",
				"height": "18px",
				"margin-right": "4px"
			})}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6c6a05bb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" data-v-6c6a05bb></path></svg> ${ssrInterpolate(isLoadingBtn.value === "register" ? "Mendaftarkan..." : "Buat Akun Baru")}</button><div style="${ssrRenderStyle({
				"text-align": "center",
				"margin-top": "16px",
				"font-size": "12px",
				"color": "#64748b",
				"font-weight": "500"
			})}" data-v-6c6a05bb><svg style="${ssrRenderStyle({
				"width": "12px",
				"height": "12px",
				"display": "inline",
				"vertical-align": "middle",
				"margin-right": "4px"
			})}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6c6a05bb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-6c6a05bb></path></svg> Aman, nyaman, dan profesional. </div><div id="msg" style="${ssrRenderStyle({ color: msgColor.value })}" data-v-6c6a05bb>${ssrInterpolate(msg.value)}</div></form><div class="footer" data-v-6c6a05bb> © 2026 EventHub Project. Semua hak dilindungi. </div></section></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-6c6a05bb"]]);

export { login_default as default };
//# sourceMappingURL=login-CCaWOyc5.mjs.map
