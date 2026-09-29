import { t as components_default } from './components-CJE4y65R.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { u as useAdmin } from './useAdmin-C8ifkcan.mjs';
import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderDynamicModel } from 'vue/server-renderer';
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
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import './asyncData-ClgIs2MV.mjs';
import '@iconify/utils/lib/css/icon';
import './useSupabaseClient-BNBp86SD.mjs';

//#region app/pages/admin/settings.vue
var _sfc_main = {
	__name: "settings",
	__ssrInlineRender: true,
	setup(__props) {
		const { userEmail} = useAdmin();
		useRoute();
		const isHighlightBank = ref(false);
		const baseUrl = ref("");
		ref(true);
		computed(() => `${baseUrl.value}/scanner?email=${encodeURIComponent(userEmail.value)}`);
		const pass = ref({
			old: "",
			new: "",
			confirm: ""
		});
		const isSavingPass = ref(false);
		const profil = ref({
			nama_organizer: "",
			no_wa: "",
			link_ig: "",
			link_web: "",
			pin_scanner: "123456",
			logo_url: ""
		});
		const isSavingProfil = ref(false);
		const showPin = ref(false);
		const isUploadingLogo = ref(false);
		const wa_cc = ref("62");
		const displayWa = computed(() => {
			let raw = profil.value.no_wa || "";
			raw = raw.replace(/\D/g, "");
			if (raw.startsWith(wa_cc.value)) return raw.substring(wa_cc.value.length);
			if (raw.startsWith("0")) return raw.substring(1);
			return raw;
		});
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "page-settings" }, _attrs))} data-v-eadbe6a7><h2 class="page-title" style="${ssrRenderStyle({ "margin-bottom": "18px" })}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:settings",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Settings</h2><div class="panel" data-v-eadbe6a7><h4 style="${ssrRenderStyle({
				"margin-bottom": "8px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:user-cog",
				style: {
					"margin-right": "6px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Akun Admin</h4><div style="${ssrRenderStyle({ "margin-bottom": "14px" })}" data-v-eadbe6a7><label class="form-label" data-v-eadbe6a7>Email</label><div style="${ssrRenderStyle({
				"font-weight": "500",
				"font-size": "15px"
			})}" data-v-eadbe6a7>${ssrInterpolate(unref(userEmail))}</div></div><div style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"gap": "12px",
				"max-width": "320px"
			})}" data-v-eadbe6a7><div data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Password Lama</label><input type="password"${ssrRenderAttr("value", pass.value.old)} class="form-control" placeholder="Masukkan password lama" data-v-eadbe6a7></div><div data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Password Baru</label><input type="password"${ssrRenderAttr("value", pass.value.new)} class="form-control" placeholder="Minimal 6 karakter" data-v-eadbe6a7></div><div data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Konfirmasi Password</label><input type="password"${ssrRenderAttr("value", pass.value.confirm)} class="form-control" placeholder="Ulangi password baru" data-v-eadbe6a7></div></div><button class="btn-primary" style="${ssrRenderStyle({ "margin-top": "16px" })}"${ssrIncludeBooleanAttr(isSavingPass.value) ? " disabled" : ""} data-v-eadbe6a7>`);
			if (isSavingPass.value) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:loader-2",
					class: "spin",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Menyimpan...<!--]-->`);
			} else {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:save",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Simpan Password<!--]-->`);
			}
			_push(`</button></div><div class="panel" data-v-eadbe6a7><h4 style="${ssrRenderStyle({
				"margin-bottom": "8px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:building",
				style: {
					"margin-right": "6px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Profil Organizer (Publik)</h4><p style="${ssrRenderStyle({
				"font-size": "13px",
				"color": "#8a9aa8",
				"margin-bottom": "14px"
			})}" data-v-eadbe6a7>Informasi ini akan tampil di halaman pendaftaran event sebagai kontak penyelenggara.</p><div class="row mb-3" data-v-eadbe6a7><div class="col" style="${ssrRenderStyle({ "flex": "1" })}" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({
				"margin-bottom": "8px",
				"display": "block"
			})}" data-v-eadbe6a7>Logo Organizer</label>`);
			if (profil.value.logo_url) {
				_push(`<div style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "12px",
					"background": "#f8fafc",
					"padding": "12px",
					"border-radius": "12px",
					"border": "1px solid #e6edf5",
					"width": "fit-content"
				})}" data-v-eadbe6a7><img${ssrRenderAttr("src", fixPosterUrl(profil.value.logo_url))} style="${ssrRenderStyle({
					"width": "80px",
					"height": "80px",
					"object-fit": "contain",
					"border-radius": "8px",
					"background": "white",
					"border": "1px solid #e2e8f0",
					"box-shadow": "0 2px 8px rgba(0,0,0,0.05)"
				})}" data-v-eadbe6a7><div data-v-eadbe6a7><div style="${ssrRenderStyle({
					"font-size": "12px",
					"font-weight": "600",
					"color": "#0a1929",
					"margin-bottom": "4px"
				})}" data-v-eadbe6a7>Logo Tersimpan</div><button class="btn-outline danger btn-sm" style="${ssrRenderStyle({
					"font-size": "11px",
					"padding": "6px 12px"
				})}" data-v-eadbe6a7>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:trash-2",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Hapus Logo</button></div></div>`);
			} else {
				_push(`<div style="${ssrRenderStyle({
					"background": "#f8fafc",
					"padding": "12px",
					"border-radius": "12px",
					"border": "1px solid #e6edf5",
					"display": "flex",
					"flex-direction": "column",
					"gap": "8px",
					"max-width": "300px"
				})}" data-v-eadbe6a7><span style="${ssrRenderStyle({
					"font-size": "11px",
					"color": "#4a5a6e"
				})}" data-v-eadbe6a7>Pilih gambar logo untuk diunggah (Maks 2MB)</span><input type="file" class="form-control" accept="image/*"${ssrIncludeBooleanAttr(isUploadingLogo.value) ? " disabled" : ""} style="${ssrRenderStyle({ "font-size": "12px" })}" data-v-eadbe6a7>`);
				if (isUploadingLogo.value) {
					_push(`<div style="${ssrRenderStyle({
						"font-size": "11px",
						"color": "var(--primary)",
						"display": "flex",
						"align-items": "center",
						"gap": "4px"
					})}" data-v-eadbe6a7>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:loader-2",
						class: "spin"
					}, null, _parent));
					_push(` Mengunggah...</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`</div></div><div class="row mb-3" data-v-eadbe6a7><div class="col" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Nama Organizer</label><input type="text"${ssrRenderAttr("value", profil.value.nama_organizer)} class="form-control" placeholder="Contoh: EventHub Organizer" data-v-eadbe6a7></div><div class="col" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>No. WhatsApp Utama</label><div style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "stretch",
				"background": "var(--bg-main)",
				"border": "1px solid var(--border-soft)",
				"border-radius": "12px",
				"overflow": "hidden"
			})}" data-v-eadbe6a7><input type="text"${ssrRenderAttr("value", wa_cc.value)} class="form-control" style="${ssrRenderStyle({
				"width": "70px",
				"text-align": "center",
				"font-weight": "600",
				"border": "none",
				"border-right": "1px solid var(--border-soft)",
				"border-radius": "0",
				"background": "var(--card-light)"
			})}" placeholder="62" data-v-eadbe6a7><input type="tel"${ssrRenderAttr("value", displayWa.value)} class="form-control" style="${ssrRenderStyle({
				"border": "none",
				"border-radius": "0",
				"flex-grow": "1",
				"box-shadow": "none",
				"padding-left": "12px"
			})}" placeholder="81234567890" data-v-eadbe6a7></div></div></div><div class="row mb-3" data-v-eadbe6a7><div class="col" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Link Instagram</label><input type="url"${ssrRenderAttr("value", profil.value.link_ig)} class="form-control" placeholder="https://instagram.com/..." data-v-eadbe6a7></div><div class="col" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Link Website</label><input type="url"${ssrRenderAttr("value", profil.value.link_web)} class="form-control" placeholder="https://..." data-v-eadbe6a7></div></div><div id="bank-section" class="${ssrRenderClass({ "highlight-pulse": isHighlightBank.value })}" style="${ssrRenderStyle({
				"margin": "24px 0 16px",
				"border-top": "1px dashed #e2e8f0",
				"padding-top": "16px",
				"padding": "16px",
				"border-radius": "12px",
				"transition": "0.3s"
			})}" data-v-eadbe6a7><h4 style="${ssrRenderStyle({
				"margin-bottom": "12px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:landmark",
				style: {
					"margin-right": "6px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Rekening Pencairan Dana</h4><div class="row mb-3" style="${ssrRenderStyle({
				"gap": "12px",
				"display": "flex",
				"flex-wrap": "wrap"
			})}" data-v-eadbe6a7><div class="col" style="${ssrRenderStyle({
				"flex": "1",
				"min-width": "150px"
			})}" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Nama Bank</label><input type="text"${ssrRenderAttr("value", profil.value.bank_nama)} class="form-control" placeholder="BCA / Mandiri / BNI" data-v-eadbe6a7></div><div class="col" style="${ssrRenderStyle({
				"flex": "1",
				"min-width": "150px"
			})}" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Nomor Rekening</label><input type="text"${ssrRenderAttr("value", profil.value.bank_rekening)} class="form-control" placeholder="1234567890" data-v-eadbe6a7></div><div class="col" style="${ssrRenderStyle({
				"flex": "1",
				"min-width": "150px"
			})}" data-v-eadbe6a7><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-eadbe6a7>Atas Nama</label><input type="text"${ssrRenderAttr("value", profil.value.bank_atas_nama)} class="form-control" placeholder="Nama Pemilik Rekening" data-v-eadbe6a7></div></div></div><button class="btn-primary"${ssrIncludeBooleanAttr(isSavingProfil.value) ? " disabled" : ""} data-v-eadbe6a7>`);
			if (isSavingProfil.value) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:loader-2",
					class: "spin",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Menyimpan...<!--]-->`);
			} else {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:save",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Simpan Profil<!--]-->`);
			}
			_push(`</button></div><div class="panel" data-v-eadbe6a7><h4 style="${ssrRenderStyle({
				"margin-bottom": "8px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:key",
				style: {
					"margin-right": "6px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Akses Crew (Scanner QR)</h4><div class="flex" style="${ssrRenderStyle({
				"flex-wrap": "wrap",
				"align-items": "center"
			})}" data-v-eadbe6a7><label style="${ssrRenderStyle({
				"font-weight": "500",
				"font-size": "14px"
			})}" data-v-eadbe6a7>PIN Global:</label><input${ssrRenderAttr("type", showPin.value ? "text" : "password")}${ssrRenderDynamicModel(showPin.value ? "text" : "password", profil.value.pin_scanner, null)} class="filter-control" style="${ssrRenderStyle({ "width": "140px" })}" data-v-eadbe6a7><button class="btn-outline" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:eye" }, null, _parent));
			_push(`</button><button class="btn-primary"${ssrIncludeBooleanAttr(isSavingProfil.value) ? " disabled" : ""} data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:save",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Simpan</button></div></div><div class="panel" data-v-eadbe6a7><h4 style="${ssrRenderStyle({
				"margin-bottom": "8px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:palette",
				style: {
					"margin-right": "6px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Preferensi</h4><div class="flex" style="${ssrRenderStyle({
				"flex-wrap": "wrap",
				"align-items": "center"
			})}" data-v-eadbe6a7><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"font-weight": "400",
				"font-size": "14px"
			})}" data-v-eadbe6a7><input type="checkbox" style="${ssrRenderStyle({
				"width": "18px",
				"height": "18px"
			})}" data-v-eadbe6a7> `);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:moon",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Mode Gelap </label><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"font-weight": "400",
				"font-size": "14px"
			})}" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:globe",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Bahasa <select class="filter-control" data-v-eadbe6a7><option data-v-eadbe6a7>Indonesia</option><option data-v-eadbe6a7>English</option></select></label><button class="btn-primary" data-v-eadbe6a7>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:save",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Simpan</button></div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var settings_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-eadbe6a7"]]);

export { settings_default as default };
//# sourceMappingURL=settings-B5vfj2pN.mjs.map
