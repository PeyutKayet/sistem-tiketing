import { t as components_default } from './components-D4ypgbct.mjs';
import { f as useHead$1, u as useSupabaseUser, C as ClientOnly, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { _ as _virtual_public__2Flogo_tyket_default } from './_virtual_public-9BLckDHy.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, watchEffect, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrRenderDynamicModel, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'nostics';
import 'nostics/formatters/ansi';
import '@vue/shared';
import 'pinia';
import 'fnv1a-64';
import 'object-identity';
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
			title: "tyket.id — Login Organizer Creator",
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
		const countryCode = ref("62");
		ref("");
		ref("");
		const phoneNumberRaw = ref("");
		const phoneNumberDisplay = computed({
			get: () => phoneNumberRaw.value,
			set: (val) => {
				let clean = val.replace(/\D/g, "");
				if (clean.startsWith("0")) clean = clean.substring(1);
				if (countryCode.value === "62" && clean.startsWith("62")) clean = clean.substring(2);
				phoneNumberRaw.value = clean;
			}
		});
		computed(() => `${countryCode.value}${phoneNumberRaw.value}`);
		const email = ref("");
		const password = ref("");
		const showPassword = ref(false);
		const isLoadingBtn = ref(null);
		const msg = ref("");
		const msgColor = ref("#d43f34");
		const rememberMe = ref(true);
		ref(false);
		ref(false);
		watchEffect(() => {
			if (user.value) router.push("/admin");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			const _component_Icon = components_default;
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "page",
				id: "page"
			}, _attrs))} data-v-1eaff581><section class="scene" id="scene" data-v-1eaff581><div class="scene-bg" data-v-1eaff581><div class="quote-box" data-v-1eaff581><div class="quote-text" data-v-1eaff581>Create<br data-v-1eaff581>Manage<br data-v-1eaff581>Celebrate</div><div class="quote-line" data-v-1eaff581></div></div><div class="abstract-graphic t1" data-v-1eaff581><div class="t-title" data-v-1eaff581>VIP Access</div><div class="t-line" data-v-1eaff581></div><div class="t-row" data-v-1eaff581><span data-v-1eaff581>GUEST</span><span data-v-1eaff581>Ahmad Muhsin</span></div>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`<div class="t-row" data-v-1eaff581${_scopeId}><span data-v-1eaff581${_scopeId}>DATE</span><span data-v-1eaff581${_scopeId}>— — —</span></div><div class="t-row" style="${ssrRenderStyle({ "margin-top": "-6px" })}" data-v-1eaff581${_scopeId}><span data-v-1eaff581${_scopeId}>TIME</span><span data-v-1eaff581${_scopeId}>--:--:--</span></div>`);
				else return [createVNode("div", { class: "t-row" }, [createVNode("span", null, "DATE"), createVNode("span", null, "— — —")]), createVNode("div", {
					class: "t-row",
					style: { "margin-top": "-6px" }
				}, [createVNode("span", null, "TIME"), createVNode("span", null, "--:--:--")])];
			}) }, _parent));
			_push(`<div class="t-barcode" data-v-1eaff581></div></div><div class="abstract-graphic t2" data-v-1eaff581><div class="s-title" data-v-1eaff581>Tiket Terjual</div><div class="s-value" data-v-1eaff581>1,248</div><div class="s-bars" data-v-1eaff581><div class="bar" style="${ssrRenderStyle({
				"height": "30%",
				"background": "rgba(255,255,255,0.4)"
			})}" data-v-1eaff581></div><div class="bar" style="${ssrRenderStyle({
				"height": "60%",
				"background": "rgba(255,255,255,0.6)"
			})}" data-v-1eaff581></div><div class="bar" style="${ssrRenderStyle({
				"height": "40%",
				"background": "rgba(255,255,255,0.8)"
			})}" data-v-1eaff581></div><div class="bar" style="${ssrRenderStyle({
				"height": "80%",
				"background": "rgba(255,255,255,0.9)"
			})}" data-v-1eaff581></div><div class="bar" style="${ssrRenderStyle({
				"height": "100%",
				"background": "white"
			})}" data-v-1eaff581></div></div></div></div></section><section class="login-card" data-v-1eaff581><div class="logo" data-v-1eaff581><img${ssrRenderAttr("src", _virtual_public__2Flogo_tyket_default)} alt="tyket.id Logo" style="${ssrRenderStyle({
				"height": "80px",
				"width": "auto",
				"object-fit": "contain",
				"display": "block",
				"margin": "0 auto 5px"
			})}" data-v-1eaff581><small data-v-1eaff581>ORGANIZER CREATOR</small></div>`);
			if (!isRegister.value) _push(`<h1 data-v-1eaff581>Selamat Datang!</h1>`);
			else _push(`<h1 data-v-1eaff581>Buat Akun Organizer Creator</h1>`);
			if (!isRegister.value) _push(`<p class="subtitle" data-v-1eaff581> Masuk untuk mengelola event Anda di<br data-v-1eaff581>dashboard Organizer Creator. </p>`);
			else _push(`<p class="subtitle" data-v-1eaff581> Bergabunglah bersama ribuan penyelenggara event lainnya. </p>`);
			_push(`<form data-v-1eaff581>`);
			if (isRegister.value) {
				_push(`<div class="field" data-v-1eaff581><span class="icon" data-v-1eaff581>`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:user" }, null, _parent));
				_push(`</span><input type="text"${ssrRenderAttr("value", fullName.value)} placeholder="Nama Lengkap / Panggilan" required data-v-1eaff581></div>`);
			} else _push(`<!---->`);
			if (isRegister.value) {
				_push(`<div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "6px",
					"margin-bottom": "16px"
				})}" data-v-1eaff581><div class="field" style="${ssrRenderStyle({
					"width": "75px",
					"margin-bottom": "0"
				})}" data-v-1eaff581><span class="icon" style="${ssrRenderStyle({ "left": "12px" })}" data-v-1eaff581>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:plus",
					style: { "width": "16px" }
				}, null, _parent));
				_push(`</span><input type="tel"${ssrRenderAttr("value", countryCode.value)} placeholder="62" style="${ssrRenderStyle({ "padding": "0 5px 0 32px" })}" required data-v-1eaff581></div><div class="field" style="${ssrRenderStyle({
					"flex": "1",
					"margin-bottom": "0"
				})}" data-v-1eaff581><span class="icon" style="${ssrRenderStyle({ "left": "12px" })}" data-v-1eaff581>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:phone",
					style: { "width": "18px" }
				}, null, _parent));
				_push(`</span><input type="tel"${ssrRenderAttr("value", phoneNumberDisplay.value)} placeholder="81234567890" style="${ssrRenderStyle({ "padding": "0 10px 0 42px" })}" required data-v-1eaff581></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="field" data-v-1eaff581><span class="icon" data-v-1eaff581>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:mail" }, null, _parent));
			_push(`</span><input type="email"${ssrRenderAttr("value", email.value)} placeholder="Email" required data-v-1eaff581></div><div class="field" data-v-1eaff581><span class="icon" data-v-1eaff581>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:lock" }, null, _parent));
			_push(`</span><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} placeholder="Password" required data-v-1eaff581><button type="button" class="toggle" aria-label="Tampilkan password" data-v-1eaff581>${ssrInterpolate(showPassword.value ? "◉" : "◌")}</button></div>`);
			if (!isRegister.value) _push(`<div class="row" data-v-1eaff581><label class="remember" data-v-1eaff581><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(rememberMe.value) ? ssrLooseContain(rememberMe.value, null) : rememberMe.value) ? " checked" : ""} data-v-1eaff581> Ingat saya </label><a href="#" data-v-1eaff581>Lupa password?</a></div>`);
			else _push(`<!---->`);
			_push(`<button class="btn" type="submit"${ssrIncludeBooleanAttr(isLoadingBtn.value) ? " disabled" : ""} data-v-1eaff581>`);
			if (!isRegister.value) _push(`<!--[-->${ssrInterpolate(isLoadingBtn.value === "login" ? "Memproses..." : "Masuk ➔")}<!--]-->`);
			else _push(`<!--[-->${ssrInterpolate(isLoadingBtn.value === "register" ? "Mendaftarkan..." : "Daftar Sekarang ➔")}<!--]-->`);
			_push(`</button><div class="divider" data-v-1eaff581>atau</div>`);
			if (!isRegister.value) _push(`<button class="signup" type="button" data-v-1eaff581><svg style="${ssrRenderStyle({
				"width": "18px",
				"height": "18px",
				"margin-right": "4px"
			})}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1eaff581><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" data-v-1eaff581></path></svg> Buat Akun Baru </button>`);
			else _push(`<button class="signup" type="button" data-v-1eaff581> Kembali ke Login </button>`);
			_push(`<div style="${ssrRenderStyle({
				"text-align": "center",
				"margin-top": "16px",
				"font-size": "12px",
				"color": "#64748b",
				"font-weight": "500"
			})}" data-v-1eaff581><svg style="${ssrRenderStyle({
				"width": "12px",
				"height": "12px",
				"display": "inline",
				"vertical-align": "middle",
				"margin-right": "4px"
			})}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1eaff581><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-1eaff581></path></svg> Aman, nyaman, dan profesional. </div><div id="msg" style="${ssrRenderStyle({ color: msgColor.value })}" data-v-1eaff581>${ssrInterpolate(msg.value)}</div></form><div class="legal-disclaimer" style="${ssrRenderStyle({
				"text-align": "center",
				"font-size": "11px",
				"color": "#94a3b8",
				"margin-top": "24px",
				"line-height": "1.5"
			})}" data-v-1eaff581> Dengan melanjutkan, Anda menyetujui <br data-v-1eaff581>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/terms",
				target: "_blank",
				style: {
					"color": "var(--primary)",
					"text-decoration": "none"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Syarat &amp; Ketentuan`);
					else return [createTextVNode("Syarat & Ketentuan")];
				}),
				_: 1
			}, _parent));
			_push(` dan `);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/privacy",
				target: "_blank",
				style: {
					"color": "var(--primary)",
					"text-decoration": "none"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Kebijakan Privasi`);
					else return [createTextVNode("Kebijakan Privasi")];
				}),
				_: 1
			}, _parent));
			_push(` kami. </div><div class="footer" data-v-1eaff581> © 2026 tyket.id. Semua hak dilindungi. </div></section></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-1eaff581"]]);

export { login_default as default };
//# sourceMappingURL=login-ByIaepaS.mjs.map
