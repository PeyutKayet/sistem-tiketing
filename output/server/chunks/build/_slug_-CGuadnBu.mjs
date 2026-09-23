import { t as components_default } from './components-C44pW9aw.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMEM7jHo.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, mergeProps, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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
import '@iconify/utils/lib/css/icon';

//#region app/pages/absen/[slug].vue
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		useRoute();
		const eventData = ref(null);
		const isLoadingData = ref(true);
		const identifier = ref("");
		const isProcessing = ref(false);
		const checkinStatus = ref("idle");
		const errorMessage = ref("");
		const pesertaName = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ style: {
				"min-height": "100vh",
				"background": "#f8fafc",
				"padding": "20px",
				"font-family": "'Inter', sans-serif",
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"justify-content": "center"
			} }, _attrs))} data-v-3588904c>`);
			if (isLoadingData.value) {
				_push(`<div style="${ssrRenderStyle({ "text-align": "center" })}" data-v-3588904c>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:loader",
					style: {
						"font-size": "40px",
						"color": "var(--primary)",
						"animation": "spin 1s linear infinite"
					}
				}, null, _parent));
				_push(`<p style="${ssrRenderStyle({
					"margin-top": "10px",
					"color": "var(--text-muted)",
					"font-weight": "600"
				})}" data-v-3588904c>Memuat Portal Absensi...</p></div>`);
			} else if (!eventData.value || !eventData.value.settings?.is_online_absen_active) {
				_push(`<div style="${ssrRenderStyle({
					"background": "white",
					"padding": "40px 20px",
					"border-radius": "16px",
					"text-align": "center",
					"max-width": "400px",
					"width": "100%",
					"box-shadow": "0 4px 20px rgba(0,0,0,0.05)"
				})}" data-v-3588904c>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:x-circle",
					style: {
						"font-size": "60px",
						"color": "#ef4444",
						"margin-bottom": "15px"
					}
				}, null, _parent));
				_push(`<h2 style="${ssrRenderStyle({
					"margin": "0 0 10px",
					"color": "#0f172a",
					"font-weight": "800"
				})}" data-v-3588904c>Portal Tidak Aktif</h2><p style="${ssrRenderStyle({
					"margin": "0",
					"color": "#64748b",
					"font-size": "0.9rem",
					"line-height": "1.5"
				})}" data-v-3588904c>Portal absensi online tidak ditemukan atau belum diaktifkan oleh panitia acara ini.</p></div>`);
			} else {
				_push(`<div style="${ssrRenderStyle({
					"background": "white",
					"padding": "30px 20px",
					"border-radius": "16px",
					"max-width": "400px",
					"width": "100%",
					"box-shadow": "0 4px 20px rgba(0,0,0,0.05)"
				})}" data-v-3588904c><div style="${ssrRenderStyle({
					"text-align": "center",
					"margin-bottom": "25px",
					"border-bottom": "1px dashed #e2e8f0",
					"padding-bottom": "20px"
				})}" data-v-3588904c><div style="${ssrRenderStyle({
					"width": "60px",
					"height": "60px",
					"background": "#eff6ff",
					"border-radius": "16px",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"margin": "0 auto 12px",
					"border": "1px solid #bfdbfe"
				})}" data-v-3588904c>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check-circle-2",
					style: {
						"font-size": "32px",
						"color": "var(--primary)"
					}
				}, null, _parent));
				_push(`</div><h3 style="${ssrRenderStyle({
					"margin": "0 0 5px",
					"color": "#0f172a",
					"font-weight": "800",
					"font-size": "1.2rem",
					"line-height": "1.3"
				})}" data-v-3588904c>${ssrInterpolate(eventData.value.nama_event)}</h3><p style="${ssrRenderStyle({
					"margin": "0",
					"color": "#64748b",
					"font-size": "0.8rem",
					"font-weight": "600"
				})}" data-v-3588904c>PORTAL KEHADIRAN VIRTUAL</p></div>`);
				if (checkinStatus.value === "idle") _push(`<div data-v-3588904c><p style="${ssrRenderStyle({
					"font-size": "0.85rem",
					"color": "#475569",
					"text-align": "center",
					"margin": "0 0 15px",
					"line-height": "1.5"
				})}" data-v-3588904c> Masukkan <strong data-v-3588904c>Email</strong> atau <strong data-v-3588904c>No. WhatsApp</strong> yang Anda gunakan saat pendaftaran. </p><div style="${ssrRenderStyle({ "margin-bottom": "15px" })}" data-v-3588904c><input type="text"${ssrRenderAttr("value", identifier.value)} placeholder="Email / 628123..." style="${ssrRenderStyle({
					"width": "100%",
					"box-sizing": "border-box",
					"padding": "14px 16px",
					"border-radius": "10px",
					"border": "1px solid #cbd5e1",
					"font-size": "0.9rem",
					"outline": "none",
					"transition": "border-color 0.2s"
				})}" data-v-3588904c></div><button${ssrIncludeBooleanAttr(isProcessing.value || !identifier.value) ? " disabled" : ""} style="${ssrRenderStyle({
					"width": "100%",
					"padding": "14px",
					"border-radius": "10px",
					"font-weight": "700",
					"background": "var(--primary)",
					"color": "white",
					"border": "none",
					"cursor": "pointer",
					"transition": "background 0.2s",
					"font-size": "0.95rem"
				})}" data-v-3588904c>${ssrInterpolate(isProcessing.value ? "MEMPROSES..." : "REKAM KEHADIRAN")}</button></div>`);
				else if (checkinStatus.value === "success") {
					_push(`<div style="${ssrRenderStyle({
						"text-align": "center",
						"padding": "10px 0"
					})}" data-v-3588904c><div style="${ssrRenderStyle({
						"width": "70px",
						"height": "70px",
						"background": "#F0FDF4",
						"color": "#16A34A",
						"border-radius": "50%",
						"display": "flex",
						"align-items": "center",
						"justify-content": "center",
						"margin": "0 auto 15px",
						"box-shadow": "0 0 0 4px #DCFCE7"
					})}" data-v-3588904c>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:check",
						style: { "font-size": "36px" }
					}, null, _parent));
					_push(`</div><h2 style="${ssrRenderStyle({
						"margin": "0 0 8px",
						"font-weight": "800",
						"color": "#16A34A",
						"font-size": "1.4rem"
					})}" data-v-3588904c>Absen Berhasil!</h2><p style="${ssrRenderStyle({
						"color": "#475569",
						"font-size": "0.85rem",
						"margin": "0 0 20px",
						"line-height": "1.5"
					})}" data-v-3588904c> Terima kasih, <strong data-v-3588904c>${ssrInterpolate(pesertaName.value)}</strong>.<br data-v-3588904c>Kehadiran Anda telah tercatat. </p><button style="${ssrRenderStyle({
						"padding": "10px 20px",
						"border-radius": "8px",
						"font-weight": "600",
						"background": "#e2e8f0",
						"color": "#475569",
						"border": "none",
						"cursor": "pointer",
						"font-size": "0.8rem"
					})}" data-v-3588904c> Absen Peserta Lain </button></div>`);
				} else if (checkinStatus.value === "error") {
					_push(`<div style="${ssrRenderStyle({
						"text-align": "center",
						"padding": "10px 0"
					})}" data-v-3588904c><div style="${ssrRenderStyle({
						"width": "70px",
						"height": "70px",
						"background": "#FEF2F2",
						"color": "#DC2626",
						"border-radius": "50%",
						"display": "flex",
						"align-items": "center",
						"justify-content": "center",
						"margin": "0 auto 15px",
						"box-shadow": "0 0 0 4px #FEE2E2"
					})}" data-v-3588904c>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:x",
						style: { "font-size": "36px" }
					}, null, _parent));
					_push(`</div><h2 style="${ssrRenderStyle({
						"margin": "0 0 8px",
						"font-weight": "800",
						"color": "#DC2626",
						"font-size": "1.2rem"
					})}" data-v-3588904c>Gagal Memproses</h2><p style="${ssrRenderStyle({
						"color": "#475569",
						"font-size": "0.85rem",
						"margin": "0 0 20px",
						"line-height": "1.5"
					})}" data-v-3588904c>${ssrInterpolate(errorMessage.value)}</p><button style="${ssrRenderStyle({
						"padding": "12px 20px",
						"border-radius": "8px",
						"font-weight": "600",
						"background": "#DC2626",
						"color": "white",
						"border": "none",
						"cursor": "pointer",
						"font-size": "0.85rem",
						"width": "100%"
					})}" data-v-3588904c> COBA LAGI </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/absen/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-3588904c"]]);

export { _slug__default as default };
//# sourceMappingURL=_slug_-CGuadnBu.mjs.map
