import { t as components_default } from './components-CJE4y65R.mjs';
import { a as useHead$1, u as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BNBp86SD.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, watchEffect, mergeProps, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrRenderDynamicModel, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import './asyncData-ClgIs2MV.mjs';
import 'nostics';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import 'nostics/formatters/ansi';
import '@supabase/ssr';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/pages/login.vue
var _sfc_main = {
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "EventHub — Login Organizer",
			bodyAttrs: {
				class: "login-body-style",
				style: "margin:0; background: #f1f5f9;"
			}
		});
		const router = useRouter();
		useSupabaseClient();
		const user = useSupabaseUser();
		const isRegister = ref(false);
		const fullName = ref("");
		const phone = ref("");
		const email = ref("");
		const password = ref("");
		const showPassword = ref(false);
		const isLoadingBtn = ref(null);
		const msg = ref("");
		const msgColor = ref("#d43f34");
		ref(false);
		ref(false);
		watchEffect(() => {
			if (user.value) router.push("/admin");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "page",
				id: "page"
			}, _attrs))} data-v-4e64808a><section class="scene" id="scene" data-v-4e64808a><div class="scene-bg" data-v-4e64808a><div class="quote-box" data-v-4e64808a><div class="quote-mark" data-v-4e64808a>&quot;</div><div class="quote-text" data-v-4e64808a>Create<br data-v-4e64808a>Manage<br data-v-4e64808a>Celebrate</div><div class="quote-line" data-v-4e64808a></div></div><div class="abstract-graphic t1" data-v-4e64808a><div class="t-title" data-v-4e64808a>VIP Access</div><div class="t-line" data-v-4e64808a></div><div class="t-row" data-v-4e64808a><span data-v-4e64808a>GUEST</span><span data-v-4e64808a>Ahmad Muhsin</span></div><div class="t-row" data-v-4e64808a><span data-v-4e64808a>DATE</span><span data-v-4e64808a>24 Oct 2026</span></div><div class="t-barcode" data-v-4e64808a></div></div><div class="abstract-graphic t2" data-v-4e64808a><div class="s-title" data-v-4e64808a>Tiket Terjual</div><div class="s-value" data-v-4e64808a>1,248</div><div class="s-bars" data-v-4e64808a><div class="bar" style="${ssrRenderStyle({
				"height": "30%",
				"background": "rgba(255,255,255,0.4)"
			})}" data-v-4e64808a></div><div class="bar" style="${ssrRenderStyle({
				"height": "60%",
				"background": "rgba(255,255,255,0.6)"
			})}" data-v-4e64808a></div><div class="bar" style="${ssrRenderStyle({
				"height": "40%",
				"background": "rgba(255,255,255,0.8)"
			})}" data-v-4e64808a></div><div class="bar" style="${ssrRenderStyle({
				"height": "80%",
				"background": "rgba(255,255,255,0.9)"
			})}" data-v-4e64808a></div><div class="bar" style="${ssrRenderStyle({
				"height": "100%",
				"background": "white"
			})}" data-v-4e64808a></div></div></div></div></section><section class="login-card" data-v-4e64808a><div class="logo" data-v-4e64808a><span class="event" data-v-4e64808a>EVENT</span><span class="hub" data-v-4e64808a>HUB</span><small data-v-4e64808a>ORGANIZER</small></div>`);
			if (!isRegister.value) _push(`<h1 data-v-4e64808a>Selamat Datang!</h1>`);
			else _push(`<h1 data-v-4e64808a>Buat Akun Organizer</h1>`);
			if (!isRegister.value) _push(`<p class="subtitle" data-v-4e64808a> Masuk untuk melanjutkan pengelolaan event<br data-v-4e64808a>bersama EventHub. </p>`);
			else _push(`<p class="subtitle" data-v-4e64808a> Bergabunglah bersama ribuan penyelenggara event lainnya. </p>`);
			_push(`<form data-v-4e64808a>`);
			if (isRegister.value) {
				_push(`<div class="field" data-v-4e64808a><span class="icon" data-v-4e64808a>`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:user" }, null, _parent));
				_push(`</span><input type="text"${ssrRenderAttr("value", fullName.value)} placeholder="Nama Lengkap Organizer" required data-v-4e64808a></div>`);
			} else _push(`<!---->`);
			if (isRegister.value) {
				_push(`<div class="field" data-v-4e64808a><span class="icon" data-v-4e64808a>`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:phone" }, null, _parent));
				_push(`</span><input type="tel"${ssrRenderAttr("value", phone.value)} placeholder="Nomor WhatsApp" required data-v-4e64808a></div>`);
			} else _push(`<!---->`);
			_push(`<div class="field" data-v-4e64808a><span class="icon" data-v-4e64808a>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:mail" }, null, _parent));
			_push(`</span><input type="email"${ssrRenderAttr("value", email.value)} placeholder="Email" required data-v-4e64808a></div><div class="field" data-v-4e64808a><span class="icon" data-v-4e64808a>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:lock" }, null, _parent));
			_push(`</span><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} placeholder="Password" required data-v-4e64808a><button type="button" class="toggle" aria-label="Tampilkan password" data-v-4e64808a>${ssrInterpolate(showPassword.value ? "◉" : "◌")}</button></div>`);
			if (!isRegister.value) _push(`<div class="row" data-v-4e64808a><label class="remember" data-v-4e64808a><input type="checkbox" data-v-4e64808a> Ingat saya </label><a href="#" data-v-4e64808a>Lupa password?</a></div>`);
			else _push(`<!---->`);
			_push(`<button class="btn" type="submit"${ssrIncludeBooleanAttr(isLoadingBtn.value) ? " disabled" : ""} data-v-4e64808a>`);
			if (!isRegister.value) _push(`<!--[-->${ssrInterpolate(isLoadingBtn.value === "login" ? "Memproses..." : "Masuk ➔")}<!--]-->`);
			else _push(`<!--[-->${ssrInterpolate(isLoadingBtn.value === "register" ? "Mendaftarkan..." : "Daftar Sekarang ➔")}<!--]-->`);
			_push(`</button><div class="divider" data-v-4e64808a>atau</div>`);
			if (!isRegister.value) _push(`<button class="signup" type="button" data-v-4e64808a><svg style="${ssrRenderStyle({
				"width": "18px",
				"height": "18px",
				"margin-right": "4px"
			})}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-4e64808a><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" data-v-4e64808a></path></svg> Buat Akun Baru </button>`);
			else _push(`<button class="signup" type="button" data-v-4e64808a> Kembali ke Login </button>`);
			_push(`<div style="${ssrRenderStyle({
				"text-align": "center",
				"margin-top": "16px",
				"font-size": "12px",
				"color": "#64748b",
				"font-weight": "500"
			})}" data-v-4e64808a><svg style="${ssrRenderStyle({
				"width": "12px",
				"height": "12px",
				"display": "inline",
				"vertical-align": "middle",
				"margin-right": "4px"
			})}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-4e64808a><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-4e64808a></path></svg> Aman, nyaman, dan profesional. </div><div id="msg" style="${ssrRenderStyle({ color: msgColor.value })}" data-v-4e64808a>${ssrInterpolate(msg.value)}</div></form><div class="footer" data-v-4e64808a> © 2026 EventHub Project. Semua hak dilindungi. </div></section></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-4e64808a"]]);

export { login_default as default };
//# sourceMappingURL=login-Cc7pBSFh.mjs.map
