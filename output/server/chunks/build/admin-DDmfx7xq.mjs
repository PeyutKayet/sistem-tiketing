import { t as components_default } from './components-D4ypgbct.mjs';
import { f as useHead$1, u as useSupabaseUser, g as useRouter, h as useRoute, C as ClientOnly, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { _ as _virtual_public__2Flogo_tyket_default } from './_virtual_public-9BLckDHy.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { u as useAdmin } from './useAdmin-6B6OnmW9.mjs';
import { _ as _sfc_main$8 } from './AdminFormBuilder-BD2yXrfJ.mjs';
import { mergeProps, unref, withCtx, createVNode, createTextVNode, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain, ssrRenderList } from 'vue/server-renderer';
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
import 'vue-router';
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

//#region app/components/admin/AdminSidebar.vue
var _sfc_main$7 = {
	__name: "AdminSidebar",
	__ssrInlineRender: true,
	setup(__props) {
		const { selectedEvent } = useAdmin();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_Icon = components_default;
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "sidebar" }, _attrs))}><div class="logo"><img${ssrRenderAttr("src", _virtual_public__2Flogo_tyket_default)} alt="tyket.id Logo" style="${ssrRenderStyle({
				"height": "38px",
				"width": "auto",
				"object-fit": "contain"
			})}"></div><nav><div class="menu-label">Menu Utama</div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/admin",
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:home",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Home</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:home",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Home")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: unref(selectedEvent) ? "/admin/event/" + unref(selectedEvent).slug : "",
				class: { disabled: !unref(selectedEvent) },
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:calendar-days",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Event</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:calendar-days",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Event")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: unref(selectedEvent) ? "/admin/event/" + unref(selectedEvent).slug + "/edit" : "",
				class: { disabled: !unref(selectedEvent) },
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:edit",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Edit</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:edit",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Edit")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: unref(selectedEvent) ? "/admin/event/" + unref(selectedEvent).slug + "/tiket" : "",
				class: { disabled: !unref(selectedEvent) },
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:ticket",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Tiket</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:ticket",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Tiket")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: unref(selectedEvent) ? "/admin/event/" + unref(selectedEvent).slug + "/peserta" : "",
				class: { disabled: !unref(selectedEvent) },
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:users",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Peserta</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:users",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Peserta")
					];
				}),
				_: 1
			}, _parent));
			_push(`<div class="menu-label mt-4">Keuangan &amp; Profil</div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/admin/dompet",
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:wallet",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Dompet</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:wallet",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Dompet")
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/admin/settings",
				"exact-active-class": "router-link-active"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:settings",
							class: "icon"
						}, null, _parent, _scopeId));
						_push(` <span${_scopeId}>Settings</span>`);
					} else return [
						createVNode(_component_Icon, {
							name: "lucide:settings",
							class: "icon"
						}),
						createTextVNode(),
						createVNode("span", null, "Settings")
					];
				}),
				_: 1
			}, _parent));
			_push(`</nav><div class="bottom"><a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:message-circle-question",
				class: "icon"
			}, null, _parent));
			_push(` <span>Bantuan</span></a><div style="${ssrRenderStyle({
				"margin-top": "10px",
				"font-size": "9px",
				"color": "#94a3b8",
				"display": "flex",
				"justify-content": "center",
				"gap": "5px",
				"align-items": "center",
				"white-space": "nowrap"
			})}">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/terms",
				target: "_blank",
				style: {
					"color": "#94a3b8",
					"text-decoration": "none"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Syarat &amp; Ketentuan`);
					else return [createTextVNode("Syarat & Ketentuan")];
				}),
				_: 1
			}, _parent));
			_push(` <span>•</span>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/privacy",
				target: "_blank",
				style: {
					"color": "#94a3b8",
					"text-decoration": "none"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Privasi`);
					else return [createTextVNode("Privasi")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></aside>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminSidebar.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
//#endregion
//#region app/components/admin/AdminTopbar.vue
var _sfc_main$6 = {
	__name: "AdminTopbar",
	__ssrInlineRender: true,
	setup(__props) {
		const { userName, userEmail, selectedEvent, showDropdown, isOnline} = useAdmin();
		const route = useRoute();
		useRouter();
		useSupabaseClient();
		useSupabaseUser();
		const localOrgName = ref("");
		const isLoadingName = ref(true);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "topbar" }, _attrs))}><div class="left"><div class="greeting"> Halo, `);
			if (isLoadingName.value) _push(`<span class="skeleton" style="${ssrRenderStyle({
				"display": "inline-block",
				"width": "100px",
				"height": "18px",
				"border-radius": "4px",
				"vertical-align": "middle"
			})}"></span>`);
			else _push(`<span style="${ssrRenderStyle({ "text-transform": "capitalize" })}">${ssrInterpolate(localOrgName.value || unref(userName))}</span>`);
			_push(`<small>· ${ssrInterpolate(unref(route).path === "/admin" ? "Beranda" : unref(selectedEvent) ? unref(selectedEvent).nama_event : unref(route).path.includes("settings") ? "Pengaturan" : unref(route).path.includes("dompet") ? "Dompet & Keuangan" : "Loading...")}</small></div></div><div class="right"><div class="notif" id="networkIndicator" style="${ssrRenderStyle([{
				background: unref(isOnline) ? "#e4f0e8" : "#fde8e6",
				color: unref(isOnline) ? "#1a6a4a" : "#d43f34"
			}, {
				"display": "flex",
				"align-items": "center",
				"gap": "6px",
				"font-size": "12px",
				"font-weight": "600",
				"padding": "6px 12px",
				"border-radius": "20px",
				"opacity": "1",
				"cursor": "default"
			}])}"${ssrRenderAttr("title", unref(isOnline) ? "Status: Online" : "Status: Offline")}><span id="networkDot" style="${ssrRenderStyle([{
				"display": "inline-block",
				"width": "8px",
				"height": "8px",
				"border-radius": "50%",
				"transition": "0.3s"
			}, {
				background: unref(isOnline) ? "#1a6a4a" : "#d43f34",
				boxShadow: unref(isOnline) ? "0 0 6px rgba(26, 106, 74, 0.4)" : "0 0 6px rgba(212, 63, 52, 0.4)"
			}])}"></span><span>${ssrInterpolate(unref(isOnline) ? "Online" : "Offline")}</span></div><div class="avatar" style="${ssrRenderStyle({ "text-transform": "uppercase" })}">`);
			if (isLoadingName.value) _push(`<span class="skeleton" style="${ssrRenderStyle({
				"display": "block",
				"width": "100%",
				"height": "100%",
				"border-radius": "50%"
			})}"></span>`);
			else _push(`<span>${ssrInterpolate((localOrgName.value || unref(userName))?.substring(0, 2))}</span>`);
			_push(`</div><div class="${ssrRenderClass([{ show: unref(showDropdown) }, "user-dropdown"])}"><div class="name" style="${ssrRenderStyle({ "text-transform": "capitalize" })}">`);
			if (isLoadingName.value) _push(`<span>Memuat...</span>`);
			else _push(`<span>${ssrInterpolate(localOrgName.value || unref(userName))}</span>`);
			_push(`</div><div class="email">${ssrInterpolate(unref(userEmail))}</div><hr><button class="btn-outline" style="${ssrRenderStyle({
				"width": "100%",
				"margin-bottom": "8px",
				"border-radius": "12px",
				"font-weight": "600",
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"gap": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:wallet" }, null, _parent));
			_push(` Dompet &amp; Keuangan </button><button class="btn-outline" style="${ssrRenderStyle({
				"width": "100%",
				"margin-bottom": "10px",
				"border-radius": "12px",
				"font-weight": "600",
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"gap": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:settings" }, null, _parent));
			_push(` Buka Pengaturan </button><button class="btn-logout" style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"gap": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:log-out" }, null, _parent));
			_push(` Logout </button></div></div></header>`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminTopbar.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region app/components/admin/AdminMobilePreview.vue
var _sfc_main$5 = {
	__name: "AdminMobilePreview",
	__ssrInlineRender: true,
	props: {
		step: {
			type: Number,
			default: 1
		},
		formEvent: {
			type: Object,
			required: true
		},
		wizardTiketList: {
			type: Array,
			default: () => []
		},
		hpPreviewHtml: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const formatRupiah = (val) => {
			if (!val) return "Gratis";
			const num = parseInt(val.toString().replace(/[^0-9]/g, ""), 10);
			if (num === 0) return "Gratis";
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				maximumFractionDigits: 0
			}).format(num);
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hp" }, _attrs))}><div class="screen" style="${ssrRenderStyle({ "background": "#f8fafc" })}"><div style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "space-between",
				"font-size": "10px",
				"color": "#8a9aa8",
				"padding-bottom": "4px",
				"border-bottom": "1px solid #f0f4fa",
				"margin-bottom": "6px"
			})}"><span style="${ssrRenderStyle({
				"display": "flex",
				"gap": "4px",
				"align-items": "center"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:battery-medium",
				style: { "font-size": "12px" }
			}, null, _parent));
			_push(` `);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:signal",
				style: { "font-size": "12px" }
			}, null, _parent));
			_push(`</span><span style="${ssrRenderStyle({ "font-weight": "600" })}">12:30</span></div><div style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "center",
				"margin-bottom": "12px"
			})}"><span style="${ssrRenderStyle({
				"background": "#eef3f9",
				"color": "var(--primary)",
				"padding": "4px 12px",
				"border-radius": "20px",
				"font-size": "9px",
				"font-weight": "700",
				"letter-spacing": "0.5px",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:ticket",
				style: { "font-size": "10px" }
			}, null, _parent));
			_push(` TYKET.ID PASS </span></div><div style="${ssrRenderStyle({
				"background": "#ffffff",
				"border-radius": "16px",
				"padding": "12px",
				"box-shadow": "0 4px 12px rgba(0,0,0,0.03)",
				"margin-bottom": "12px",
				"border": "1px solid #e6edf5"
			})}"><div style="${ssrRenderStyle([{
				"height": "120px",
				"border-radius": "10px",
				"margin-bottom": "12px",
				"background-size": "cover",
				"background-position": "center",
				"display": "flex",
				"align-items": "center",
				"justify-content": "center",
				"font-size": "28px",
				"color": "white",
				"overflow": "hidden"
			}, __props.formEvent.poster_preview ? { backgroundImage: `url('${__props.formEvent.poster_preview}')` } : { background: "linear-gradient(145deg, var(--primary), var(--primary-hover))" }])}">`);
			if (!__props.formEvent.poster_preview) _push(ssrRenderComponent(_component_Icon, {
				name: "lucide:image",
				style: {
					"opacity": "0.5",
					"font-size": "32px"
				}
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div><div style="${ssrRenderStyle({
				"font-size": "16px",
				"font-weight": "800",
				"text-align": "center",
				"color": "#0a1929",
				"letter-spacing": "-0.3px"
			})}">${ssrInterpolate(__props.formEvent.nama || "Event Baru")}</div><div style="${ssrRenderStyle({
				"font-size": "10px",
				"color": "#1a6a4a",
				"background": "#e4f0e8",
				"padding": "4px 8px",
				"border-radius": "6px",
				"text-align": "center",
				"font-weight": "600",
				"margin": "8px auto 0 auto",
				"width": "fit-content",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}"><span>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:calendar",
				style: { "font-size": "10px" }
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.formEvent.tanggal || "Tgl")}</span><span style="${ssrRenderStyle({ "color": "#a8cabb" })}">|</span><span>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:map-pin",
				style: { "font-size": "10px" }
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.formEvent.lokasi || "Lokasi")}</span></div>`);
			if (__props.step === 1 || __props.step === 4) _push(`<div style="${ssrRenderStyle({
				"text-align": "center",
				"margin-top": "8px",
				"font-size": "11px",
				"color": "#4a5a6e",
				"line-height": "1.5"
			})}">${ssrInterpolate(__props.formEvent.deskripsi || "Deskripsi acara kamu akan tampil di sini...")}</div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (__props.step === 2 || __props.step === 4) {
				_push(`<div style="${ssrRenderStyle({
					"background": "#ffffff",
					"border-radius": "16px",
					"padding": "12px",
					"box-shadow": "0 4px 12px rgba(0,0,0,0.03)",
					"border": "1px solid #e6edf5",
					"margin-bottom": "12px"
				})}"><div style="${ssrRenderStyle({
					"font-weight": "700",
					"font-size": "11px",
					"color": "#0a1929",
					"margin-bottom": "8px",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: {
						"color": "var(--primary)",
						"font-size": "14px"
					}
				}, null, _parent));
				_push(` Pilih Tiket </div>`);
				if (__props.wizardTiketList.filter((t) => !t.is_hidden && t.is_active !== false).length === 0) _push(`<div style="${ssrRenderStyle({
					"color": "#8a9aa8",
					"font-size": "11px",
					"text-align": "center",
					"padding": "10px 0"
				})}">Tiket belum tersedia</div>`);
				else _push(`<!---->`);
				_push(`<!--[-->`);
				ssrRenderList(__props.wizardTiketList.filter((t) => !t.is_hidden && t.is_active !== false), (t, i) => {
					_push(`<div style="${ssrRenderStyle({
						"border": "1px solid #e6edf5",
						"border-radius": "8px",
						"padding": "8px",
						"margin-bottom": "6px",
						"display": "flex",
						"justify-content": "space-between",
						"align-items": "center"
					})}"><div><div style="${ssrRenderStyle({
						"font-size": "11px",
						"font-weight": "700",
						"color": "#0a1929"
					})}">${ssrInterpolate(t.nama)}</div><div style="${ssrRenderStyle({
						"font-size": "10px",
						"color": "var(--primary)",
						"font-weight": "600"
					})}">${ssrInterpolate(formatRupiah(t.harga))}</div></div><div style="${ssrRenderStyle({
						"font-size": "9px",
						"background": "#f0f4fa",
						"padding": "2px 6px",
						"border-radius": "4px",
						"color": "#4a5a6e"
					})}">Tersisa ${ssrInterpolate(t.kuota)}</div></div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			if (__props.step === 3 || __props.step === 4) {
				_push(`<div style="${ssrRenderStyle({
					"background": "#ffffff",
					"border-radius": "16px",
					"padding": "12px",
					"box-shadow": "0 4px 12px rgba(0,0,0,0.03)",
					"border": "1px solid #e6edf5"
				})}">`);
				if (__props.step === 3) {
					_push(`<div style="${ssrRenderStyle({
						"font-weight": "700",
						"font-size": "11px",
						"color": "#0a1929",
						"margin-bottom": "8px",
						"display": "flex",
						"align-items": "center",
						"gap": "6px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:file-text",
						style: {
							"color": "var(--primary)",
							"font-size": "14px"
						}
					}, null, _parent));
					_push(` Form Peserta </div>`);
				} else _push(`<!---->`);
				_push(`<div>${__props.hpPreviewHtml ?? ""}</div>`);
				if (__props.step === 3 || __props.step === 4) {
					_push(`<button style="${ssrRenderStyle({
						"width": "100%",
						"padding": "10px",
						"background": "#1a3a5c",
						"color": "white",
						"border": "none",
						"border-radius": "40px",
						"font-weight": "600",
						"font-size": "11px",
						"margin-top": "12px",
						"box-shadow": "0 4px 12px var(--primary-shadow)",
						"display": "flex",
						"justify-content": "center",
						"align-items": "center",
						"gap": "6px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:check-square",
						style: { "font-size": "14px" }
					}, null, _parent));
					_push(` DAFTAR SEKARANG </button>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminMobilePreview.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region app/components/admin/AdminWizard.vue
var _sfc_main$4 = {
	__name: "AdminWizard",
	__ssrInlineRender: true,
	setup(__props) {
		const { showWizard, wizardStepNow, formEvent, formTiketBaru, wizardTiketList, isSavingEvent, formForgeItems } = useAdmin();
		const showAdvancedSettings = ref(false);
		const baseUrl = ref("");
		const hpPreviewHtml = ref("<div style=\"color:#8a9aa8;font-size:11px;text-align:center;padding:10px 0;\">Memuat preview...</div>");
		const formatTanggalKustom = (dateStr) => {
			if (!dateStr) return "";
			const date = new Date(dateStr);
			return new Intl.DateTimeFormat("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			}).format(date);
		};
		const formatDateTimeKustom = (dateStr) => {
			if (!dateStr) return "";
			const date = new Date(dateStr);
			return new Intl.DateTimeFormat("id-ID", {
				weekday: "short",
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			}).format(date).replace(/\./g, ":");
		};
		const formatRupiah = (angka) => {
			if (angka === 0) return "GRATIS";
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(angka);
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			const _component_AdminMobilePreview = _sfc_main$5;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["wizard-overlay", { open: unref(showWizard) }] }, _attrs))} data-v-769a087a><div class="wizard" data-v-769a087a><button class="close" data-v-769a087a>✖</button><div class="step-indicator" data-v-769a087a><span class="${ssrRenderClass({
				active: unref(wizardStepNow) === 1,
				completed: unref(wizardStepNow) > 1
			})}" data-v-769a087a><span class="num" data-v-769a087a>${ssrInterpolate(unref(wizardStepNow) > 1 ? "✓" : "1")}</span> Informasi </span><span class="${ssrRenderClass({
				active: unref(wizardStepNow) === 2,
				completed: unref(wizardStepNow) > 2
			})}" data-v-769a087a><span class="num" data-v-769a087a>${ssrInterpolate(unref(wizardStepNow) > 2 ? "✓" : "2")}</span> Tiket </span><span class="${ssrRenderClass({
				active: unref(wizardStepNow) === 3,
				completed: unref(wizardStepNow) > 3
			})}" data-v-769a087a><span class="num" data-v-769a087a>${ssrInterpolate(unref(wizardStepNow) > 3 ? "✓" : "3")}</span> Form </span><span class="${ssrRenderClass({
				active: unref(wizardStepNow) === 4,
				completed: unref(wizardStepNow) > 4
			})}" data-v-769a087a><span class="num" data-v-769a087a>${ssrInterpolate(unref(wizardStepNow) > 4 ? "✓" : "4")}</span> Publikasi </span></div><div class="${ssrRenderClass([{ active: unref(wizardStepNow) === 1 }, "wiz-step"])}" data-v-769a087a><div class="wiz-grid" data-v-769a087a><div class="left" data-v-769a087a><div style="${ssrRenderStyle({
				"padding-bottom": "20px",
				"border-bottom": "1px dashed #cbd5e1",
				"margin-bottom": "20px"
			})}" data-v-769a087a><h4 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929",
				"font-size": "15px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:info",
				style: { "color": "var(--primary)" }
			}, null, _parent));
			_push(` Informasi Dasar</h4><div class="row mb-3" data-v-769a087a><div class="col" style="${ssrRenderStyle({ "flex": "2" })}" data-v-769a087a><label class="form-label" data-v-769a087a>Nama Acara <span style="${ssrRenderStyle({ "color": "#d43f34" })}" data-v-769a087a>*</span></label><input type="text"${ssrRenderAttr("value", unref(formEvent).nama)} placeholder="Contoh: Tech Summit 2026" class="form-control" data-v-769a087a></div><div class="col" style="${ssrRenderStyle({ "flex": "1" })}" data-v-769a087a><label class="form-label" data-v-769a087a>Upload Poster</label><div style="${ssrRenderStyle({
				"position": "relative",
				"display": "flex",
				"align-items": "center",
				"justify-content": "center",
				"height": "41px",
				"border": "1px dashed #cbd5e1",
				"border-radius": "12px",
				"background": "#f8fafc",
				"cursor": "pointer",
				"overflow": "hidden",
				"transition": "0.2s"
			})}" onmouseover="this.style.borderColor=&#39;var(--primary)&#39;; this.style.background=&#39;#eff6ff&#39;" onmouseout="this.style.borderColor=&#39;#cbd5e1&#39;; this.style.background=&#39;#f8fafc&#39;" data-v-769a087a><input type="file" accept="image/*" style="${ssrRenderStyle({
				"position": "absolute",
				"inset": "0",
				"opacity": "0",
				"cursor": "pointer"
			})}" data-v-769a087a>`);
			if (unref(formEvent).poster_preview) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check-circle-2",
					style: {
						"color": "#10b981",
						"margin-right": "6px",
						"font-size": "16px"
					}
				}, null, _parent));
				_push(`<span style="${ssrRenderStyle({
					"font-size": "12px",
					"font-weight": "600",
					"color": "#065f46"
				})}" data-v-769a087a>Terpasang</span><!--]-->`);
			} else {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:upload-cloud",
					style: {
						"color": "#64748b",
						"margin-right": "6px",
						"font-size": "16px"
					}
				}, null, _parent));
				_push(`<span style="${ssrRenderStyle({
					"font-size": "12px",
					"font-weight": "600",
					"color": "#64748b"
				})}" data-v-769a087a>Pilih Poster</span><!--]-->`);
			}
			_push(`</div></div></div><div class="row mb-3" data-v-769a087a><div class="col" data-v-769a087a><label class="form-label" data-v-769a087a>Slug URL <span style="${ssrRenderStyle({ "color": "#d43f34" })}" data-v-769a087a>*</span></label><input type="text"${ssrRenderAttr("value", unref(formEvent).slug)} placeholder="contoh-tech-summit" class="form-control" data-v-769a087a></div><div class="col" data-v-769a087a><label class="form-label" data-v-769a087a>Tanggal <span style="${ssrRenderStyle({ "color": "#d43f34" })}" data-v-769a087a>*</span></label><div style="${ssrRenderStyle({
				"position": "relative",
				"display": "flex",
				"align-items": "center",
				"cursor": "pointer"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:calendar-days",
				style: {
					"position": "absolute",
					"left": "14px",
					"color": "#8a9aa8",
					"font-size": "16px",
					"z-index": "2",
					"pointer-events": "none"
				}
			}, null, _parent));
			_push(`<div class="form-control" style="${ssrRenderStyle({
				"padding-left": "40px",
				"display": "flex",
				"align-items": "center"
			})}" data-v-769a087a>`);
			if (!unref(formEvent).tanggal) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-769a087a>Pilih tanggal acara...</span>`);
			else _push(`<span style="${ssrRenderStyle({
				"color": "#0f172a",
				"font-weight": "500"
			})}" data-v-769a087a>${ssrInterpolate(formatTanggalKustom(unref(formEvent).tanggal))}</span>`);
			_push(`</div><input type="date"${ssrRenderAttr("value", unref(formEvent).tanggal)} style="${ssrRenderStyle({
				"position": "absolute",
				"inset": "0",
				"width": "100%",
				"height": "100%",
				"opacity": "0",
				"cursor": "pointer",
				"z-index": "3"
			})}" data-v-769a087a></div></div></div><div class="mb-3" data-v-769a087a><label class="form-label" data-v-769a087a>Deskripsi</label><textarea rows="2" class="form-control" placeholder="Deskripsikan acara kamu di sini..." data-v-769a087a>${ssrInterpolate(unref(formEvent).deskripsi)}</textarea></div><div class="row mb-0" data-v-769a087a><div class="col" data-v-769a087a><label class="form-label" data-v-769a087a>Lokasi Acara <span style="${ssrRenderStyle({ "color": "#d43f34" })}" data-v-769a087a>*</span></label><div style="${ssrRenderStyle({
				"position": "relative",
				"display": "flex",
				"align-items": "center"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:map-pin",
				style: {
					"position": "absolute",
					"left": "14px",
					"color": "#8a9aa8",
					"font-size": "16px"
				}
			}, null, _parent));
			_push(`<input type="text"${ssrRenderAttr("value", unref(formEvent).lokasi)} placeholder="Contoh: Jakarta (Ketik &#39;Online&#39; jika virtual)" class="form-control" style="${ssrRenderStyle({ "padding-left": "40px" })}" data-v-769a087a></div></div><div class="col" data-v-769a087a><label class="form-label" data-v-769a087a>Link Maps (Opsional)</label><input type="url"${ssrRenderAttr("value", unref(formEvent).link_maps)} placeholder="https://maps.app.goo.gl/..." class="form-control" data-v-769a087a></div></div></div><div style="${ssrRenderStyle({
				"background": "#ffffff",
				"border": "1px solid #e6edf5",
				"border-radius": "16px",
				"padding": "20px",
				"box-shadow": "0 2px 8px rgba(0,0,0,0.02)",
				"margin-bottom": "20px"
			})}" data-v-769a087a><h4 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929",
				"font-size": "14px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:sliders-horizontal",
				style: {
					"color": "#4a5a6e",
					"font-size": "14px"
				}
			}, null, _parent));
			_push(` Pengaturan Sistem</h4><div style="${ssrRenderStyle({
				"display": "flex",
				"gap": "16px",
				"margin-bottom": "16px"
			})}" data-v-769a087a><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"cursor": "pointer"
			})}" data-v-769a087a><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formEvent).tipe_event, "offline")) ? " checked" : ""} value="offline" style="${ssrRenderStyle({
				"width": "16px",
				"height": "16px"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "13px",
				"font-weight": "600",
				"color": "#475569"
			})}" data-v-769a087a>Offline</div></label><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"cursor": "pointer"
			})}" data-v-769a087a><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formEvent).tipe_event, "online")) ? " checked" : ""} value="online" style="${ssrRenderStyle({
				"width": "16px",
				"height": "16px"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "13px",
				"font-weight": "600",
				"color": "#475569"
			})}" data-v-769a087a>Online</div></label><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"cursor": "pointer"
			})}" data-v-769a087a><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formEvent).tipe_event, "hybrid")) ? " checked" : ""} value="hybrid" style="${ssrRenderStyle({
				"width": "16px",
				"height": "16px"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "13px",
				"font-weight": "600",
				"color": "#475569"
			})}" data-v-769a087a>Hybrid</div></label></div>`);
			if (unref(formEvent).tipe_event === "offline" || unref(formEvent).tipe_event === "hybrid") {
				_push(`<div style="${ssrRenderStyle({
					"background": "#f8fafc",
					"padding": "12px",
					"border-radius": "8px",
					"border": "1px dashed #cbd5e1"
				})}" data-v-769a087a><label class="checkbox-item mb-0" style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_qr_active) ? ssrLooseContain(unref(formEvent).is_qr_active, null) : unref(formEvent).is_qr_active) ? " checked" : ""} data-v-769a087a> <span style="${ssrRenderStyle({ "font-size": "12px" })}" data-v-769a087a>Wajib Scan QR Code (Gunakan E-Ticket)</span></label>`);
				if (unref(formEvent).is_qr_active) {
					_push(`<div style="${ssrRenderStyle({
						"margin-left": "24px",
						"margin-top": "10px"
					})}" data-v-769a087a><label class="form-label" style="${ssrRenderStyle({ "font-size": "11px" })}" data-v-769a087a>Frekuensi Scan</label><div style="${ssrRenderStyle({
						"display": "flex",
						"gap": "8px"
					})}" data-v-769a087a><select class="form-control" style="${ssrRenderStyle({
						"font-size": "12px",
						"padding": "6px 10px"
					})}" data-v-769a087a><option value="scanner" data-v-769a087a${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).sistem_checkin) ? ssrLooseContain(unref(formEvent).sistem_checkin, "scanner") : ssrLooseEqual(unref(formEvent).sistem_checkin, "scanner")) ? " selected" : ""}>1x Scan Saja (Tiket Hangus)</option><option value="none" data-v-769a087a${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).sistem_checkin) ? ssrLooseContain(unref(formEvent).sistem_checkin, "none") : ssrLooseEqual(unref(formEvent).sistem_checkin, "none")) ? " selected" : ""}>Bebas Berkali-kali (Akses Keluar-Masuk / Bazar)</option><option value="portal" data-v-769a087a${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).sistem_checkin) ? ssrLooseContain(unref(formEvent).sistem_checkin, "portal") : ssrLooseEqual(unref(formEvent).sistem_checkin, "portal")) ? " selected" : ""}>Scan Dibatasi Kuota Hari (Training / Multi-hari)</option></select>`);
					if (unref(formEvent).sistem_checkin === "portal") _push(`<input type="number"${ssrRenderAttr("value", unref(formEvent).target_absen)} class="form-control" placeholder="Jml hari: 3" style="${ssrRenderStyle({
						"font-size": "12px",
						"padding": "6px 10px",
						"width": "120px"
					})}" data-v-769a087a>`);
					else _push(`<!---->`);
					_push(`</div></div>`);
				} else _push(`<div style="${ssrRenderStyle({
					"margin-left": "24px",
					"margin-top": "6px",
					"font-size": "11px",
					"color": "#8a9aa8"
				})}" data-v-769a087a> Tiket peserta tetap akan dikirim, namun tidak akan memuat QR Code. Cocok untuk event bebas/santai. </div>`);
				_push(`</div>`);
			} else _push(`<!---->`);
			if (unref(formEvent).tipe_event === "online" || unref(formEvent).tipe_event === "hybrid") _push(`<div style="${ssrRenderStyle({
				"background": "#eff6ff",
				"padding": "12px",
				"border-radius": "8px",
				"border": "1px dashed #bfdbfe",
				"margin-top": "12px"
			})}" data-v-769a087a><label class="checkbox-item mb-0" style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_online_absen_active) ? ssrLooseContain(unref(formEvent).is_online_absen_active, null) : unref(formEvent).is_online_absen_active) ? " checked" : ""} data-v-769a087a> <span style="${ssrRenderStyle({
				"font-size": "12px",
				"color": "#1e3a8a"
			})}" data-v-769a087a>Sistem Absensi Online (Link Khusus Pembeli)</span></label></div>`);
			else _push(`<!---->`);
			_push(`</div><button style="${ssrRenderStyle({
				"width": "100%",
				"background": "#f8fafc",
				"border": "1px dashed #cbd5e1",
				"border-radius": "12px",
				"padding": "12px 16px",
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"color": "#4a5a6e",
				"font-weight": "600",
				"font-size": "13px",
				"cursor": "pointer",
				"margin-bottom": "20px",
				"transition": "0.2s"
			})}" data-v-769a087a><span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:settings-2",
				style: {
					"font-size": "16px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Pengaturan Lanjutan (Opsional)</span>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: showAdvancedSettings.value ? "lucide:chevron-up" : "lucide:chevron-down",
				style: { "font-size": "18px" }
			}, null, _parent));
			_push(`</button><div style="${ssrRenderStyle([{
				"animation": "slideDown 0.3s ease",
				"padding": "16px",
				"background": "#f8fafc",
				"border-radius": "16px",
				"border": "1px solid #e6edf5"
			}, showAdvancedSettings.value ? null : { display: "none" }])}" data-v-769a087a><div data-v-769a087a><h4 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929",
				"font-size": "14px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:puzzle",
				style: {
					"color": "#d43f34",
					"font-size": "14px"
				}
			}, null, _parent));
			_push(` Fitur Tambahan &amp; Keamanan</h4><div class="row" style="${ssrRenderStyle({ "gap": "16px" })}" data-v-769a087a><div class="col" data-v-769a087a><div class="mb-3" data-v-769a087a><label class="checkbox-item" style="${ssrRenderStyle({
				"font-weight": "600",
				"font-size": "12px"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_donasi_active) ? ssrLooseContain(unref(formEvent).is_donasi_active, null) : unref(formEvent).is_donasi_active) ? " checked" : ""} data-v-769a087a> `);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:heart-handshake",
				class: "mr-1",
				style: {
					"font-size": "14px",
					"color": "#d43f34"
				}
			}, null, _parent));
			_push(` Donasi / Infaq</label>`);
			if (unref(formEvent).is_donasi_active) _push(`<div style="${ssrRenderStyle({
				"padding-top": "8px",
				"margin-left": "24px"
			})}" data-v-769a087a><input type="text"${ssrRenderAttr("value", unref(formEvent).donasi_header)} class="form-control mb-1" placeholder="Header: Infaq Masjid" style="${ssrRenderStyle({
				"padding": "6px 10px",
				"font-size": "11px"
			})}" data-v-769a087a><input type="text"${ssrRenderAttr("value", unref(formEvent).donasi_options)} class="form-control mb-1" placeholder="Nominal: 10000, 50000" style="${ssrRenderStyle({
				"padding": "6px 10px",
				"font-size": "11px"
			})}" data-v-769a087a><label class="checkbox-item" style="${ssrRenderStyle({
				"font-size": "11px",
				"margin-top": "4px"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_donasi_custom) ? ssrLooseContain(unref(formEvent).is_donasi_custom, null) : unref(formEvent).is_donasi_custom) ? " checked" : ""} data-v-769a087a> Izinkan nominal custom </label></div>`);
			else _push(`<!---->`);
			_push(`</div><div data-v-769a087a><label class="checkbox-item" style="${ssrRenderStyle({
				"font-weight": "600",
				"font-size": "12px"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_grup_wa_active) ? ssrLooseContain(unref(formEvent).is_grup_wa_active, null) : unref(formEvent).is_grup_wa_active) ? " checked" : ""} data-v-769a087a> `);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:message-circle",
				class: "mr-1",
				style: {
					"font-size": "14px",
					"color": "#15803d"
				}
			}, null, _parent));
			_push(` Grup WhatsApp</label>`);
			if (unref(formEvent).is_grup_wa_active) _push(`<div style="${ssrRenderStyle({
				"padding-top": "8px",
				"margin-left": "24px"
			})}" data-v-769a087a><input type="url"${ssrRenderAttr("value", unref(formEvent).link_grup_wa)} class="form-control" placeholder="https://chat.whatsapp.com/..." style="${ssrRenderStyle({
				"padding": "6px 10px",
				"font-size": "11px"
			})}" data-v-769a087a></div>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="col" data-v-769a087a><div class="mb-3" data-v-769a087a><label class="checkbox-item mb-1" style="${ssrRenderStyle({
				"font-weight": "600",
				"font-size": "12px"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_snk_active) ? ssrLooseContain(unref(formEvent).is_snk_active, null) : unref(formEvent).is_snk_active) ? " checked" : ""} data-v-769a087a> `);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:file-text",
				class: "mr-1",
				style: {
					"font-size": "14px",
					"color": "#8a9aa8"
				}
			}, null, _parent));
			_push(` Syarat &amp; Ketentuan</label>`);
			if (unref(formEvent).is_snk_active) _push(`<textarea rows="2" class="form-control" placeholder="Ketik syarat dan ketentuan..." style="${ssrRenderStyle({
				"margin-left": "24px",
				"width": "calc(100% - 24px)",
				"padding": "6px 10px",
				"font-size": "11px",
				"resize": "none"
			})}" data-v-769a087a>${ssrInterpolate(unref(formEvent).snk_text)}</textarea>`);
			else _push(`<!---->`);
			_push(`</div><div data-v-769a087a><label style="${ssrRenderStyle({
				"font-weight": "600",
				"font-size": "12px",
				"color": "#0a1929",
				"display": "flex",
				"align-items": "center",
				"gap": "4px",
				"margin-bottom": "8px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:shield-check",
				style: {
					"font-size": "14px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Anti Calo</label><div class="flex" style="${ssrRenderStyle({
				"flex-wrap": "wrap",
				"gap": "8px",
				"margin-left": "24px"
			})}" data-v-769a087a><label class="checkbox-item" style="${ssrRenderStyle({ "font-size": "11px" })}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_anti_calo_email) ? ssrLooseContain(unref(formEvent).is_anti_calo_email, null) : unref(formEvent).is_anti_calo_email) ? " checked" : ""} data-v-769a087a> 1 Email = 1 Tiket</label><label class="checkbox-item" style="${ssrRenderStyle({ "font-size": "11px" })}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_anti_calo_wa) ? ssrLooseContain(unref(formEvent).is_anti_calo_wa, null) : unref(formEvent).is_anti_calo_wa) ? " checked" : ""} data-v-769a087a> 1 No. WhatsApp = 1 Tiket</label></div></div><div style="${ssrRenderStyle({
				"margin-top": "12px",
				"border-top": "1px dashed #e2e8f0",
				"padding-top": "12px"
			})}" data-v-769a087a><label class="checkbox-item mb-0" style="${ssrRenderStyle({
				"font-weight": "600",
				"font-size": "12px"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEvent).is_limit_tiket_active) ? ssrLooseContain(unref(formEvent).is_limit_tiket_active, null) : unref(formEvent).is_limit_tiket_active) ? " checked" : ""} data-v-769a087a> <span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "4px",
				"color": "#0a1929"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:shopping-cart",
				style: {
					"font-size": "14px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Batasi Pembelian Tiket</span></label>`);
			if (unref(formEvent).is_limit_tiket_active) _push(`<div class="flex" style="${ssrRenderStyle({
				"align-items": "center",
				"gap": "8px",
				"margin-left": "24px",
				"margin-top": "8px"
			})}" data-v-769a087a><input type="number"${ssrRenderAttr("value", unref(formEvent).max_tiket_per_transaksi)} class="form-control" style="${ssrRenderStyle({
				"width": "80px",
				"padding": "4px 8px",
				"font-size": "11px"
			})}" placeholder="1" data-v-769a087a><span style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#8a9aa8"
			})}" data-v-769a087a>Max tiket per checkout</span></div>`);
			else _push(`<!---->`);
			_push(`</div></div></div></div></div></div><div class="right" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_AdminMobilePreview, {
				step: 1,
				formEvent: unref(formEvent),
				wizardTiketList: unref(wizardTiketList),
				hpPreviewHtml: hpPreviewHtml.value
			}, null, _parent));
			_push(`</div></div></div><div class="${ssrRenderClass([{ active: unref(wizardStepNow) === 2 }, "wiz-step"])}" data-v-769a087a><div class="wiz-grid" data-v-769a087a><div class="left" data-v-769a087a><h4 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929",
				"font-size": "15px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:ticket",
				style: { "color": "var(--primary)" }
			}, null, _parent));
			_push(` Kelola Tiket</h4><div style="${ssrRenderStyle({
				"background": "#ffffff",
				"border": "1px solid #e6edf5",
				"border-radius": "16px",
				"padding": "20px",
				"box-shadow": "0 2px 8px rgba(0,0,0,0.02)",
				"margin-bottom": "24px"
			})}" data-v-769a087a><h5 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#4a5a6e",
				"font-size": "13px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:plus-square",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Tambah Tiket Baru</h5><div class="row mb-3" data-v-769a087a><div class="col" style="${ssrRenderStyle({ "flex": "2" })}" data-v-769a087a><label class="form-label" style="${ssrRenderStyle({ "font-size": "11px" })}" data-v-769a087a>Nama Tiket</label><input type="text"${ssrRenderAttr("value", unref(formTiketBaru).nama)} placeholder="Contoh: VIP / Early Bird" class="form-control" style="${ssrRenderStyle({ "font-size": "12px" })}" data-v-769a087a></div><div class="col" style="${ssrRenderStyle({ "flex": "1" })}" data-v-769a087a><label class="form-label" style="${ssrRenderStyle({
				"font-size": "11px",
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center"
			})}" data-v-769a087a><span data-v-769a087a>Kuota</span><label style="${ssrRenderStyle({
				"cursor": "pointer",
				"font-weight": "normal",
				"margin": "0"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formTiketBaru).is_unlimited) ? ssrLooseContain(unref(formTiketBaru).is_unlimited, null) : unref(formTiketBaru).is_unlimited) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-769a087a> Unlimited</label></label>`);
			if (!unref(formTiketBaru).is_unlimited) _push(`<input type="number"${ssrRenderAttr("value", unref(formTiketBaru).kuota)} placeholder="Contoh: 100" class="form-control" style="${ssrRenderStyle({ "font-size": "12px" })}" data-v-769a087a>`);
			else _push(`<div class="form-control" style="${ssrRenderStyle({
				"background": "#f8fafc",
				"color": "#8a9aa8",
				"text-align": "center",
				"font-style": "italic",
				"font-size": "12px"
			})}" data-v-769a087a>Tidak Terbatas</div>`);
			_push(`</div></div><div class="row mb-3" data-v-769a087a><div class="col" data-v-769a087a><label class="form-label" style="${ssrRenderStyle({
				"font-size": "11px",
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center"
			})}" data-v-769a087a><span data-v-769a087a>Harga</span><label style="${ssrRenderStyle({
				"cursor": "pointer",
				"font-weight": "normal",
				"margin": "0"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formTiketBaru).is_gratis) ? ssrLooseContain(unref(formTiketBaru).is_gratis, null) : unref(formTiketBaru).is_gratis) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-769a087a> Gratis</label></label>`);
			if (!unref(formTiketBaru).is_gratis) _push(`<div style="${ssrRenderStyle({
				"position": "relative",
				"display": "flex",
				"align-items": "center"
			})}" data-v-769a087a><span style="${ssrRenderStyle({
				"position": "absolute",
				"left": "14px",
				"color": "#8a9aa8",
				"font-weight": "600",
				"font-size": "12px"
			})}" data-v-769a087a>Rp</span><input type="text"${ssrRenderAttr("value", unref(formTiketBaru).harga)} placeholder="0" class="form-control" style="${ssrRenderStyle({
				"padding-left": "42px",
				"font-size": "12px"
			})}" data-v-769a087a></div>`);
			else _push(`<div class="form-control" style="${ssrRenderStyle({
				"background": "#f8fafc",
				"color": "#10b981",
				"font-weight": "600",
				"text-align": "center",
				"font-size": "12px"
			})}" data-v-769a087a>Gratis</div>`);
			_push(`</div></div><div class="row mb-3" data-v-769a087a><div class="col" style="${ssrRenderStyle({ "flex": "1" })}" data-v-769a087a><label class="form-label" style="${ssrRenderStyle({
				"font-size": "11px",
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center"
			})}" data-v-769a087a><span data-v-769a087a>Waktu Penjualan Tiket</span><label style="${ssrRenderStyle({
				"cursor": "pointer",
				"font-weight": "normal",
				"margin": "0"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formTiketBaru).is_no_time_limit) ? ssrLooseContain(unref(formTiketBaru).is_no_time_limit, null) : unref(formTiketBaru).is_no_time_limit) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-769a087a> Bebas (Tanpa Batas Waktu)</label></label>`);
			if (!unref(formTiketBaru).is_no_time_limit) {
				_push(`<div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "12px"
				})}" data-v-769a087a><div style="${ssrRenderStyle({
					"flex": "1",
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"cursor": "pointer"
				})}" data-v-769a087a>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:calendar-clock",
					style: {
						"position": "absolute",
						"left": "12px",
						"color": "#8a9aa8",
						"font-size": "14px",
						"z-index": "2",
						"pointer-events": "none"
					}
				}, null, _parent));
				_push(`<div class="form-control" style="${ssrRenderStyle({
					"padding-left": "34px",
					"display": "flex",
					"align-items": "center",
					"font-size": "12px"
				})}" data-v-769a087a>`);
				if (!unref(formTiketBaru).buka) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-769a087a>Waktu Buka...</span>`);
				else _push(`<span style="${ssrRenderStyle({
					"color": "#0f172a",
					"font-weight": "500"
				})}" data-v-769a087a>${ssrInterpolate(formatDateTimeKustom(unref(formTiketBaru).buka))}</span>`);
				_push(`</div><input type="datetime-local"${ssrRenderAttr("value", unref(formTiketBaru).buka)} style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"width": "100%",
					"height": "100%",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "3"
				})}" data-v-769a087a></div><div style="${ssrRenderStyle({
					"flex": "1",
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"cursor": "pointer"
				})}" data-v-769a087a>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:calendar-clock",
					style: {
						"position": "absolute",
						"left": "12px",
						"color": "#8a9aa8",
						"font-size": "14px",
						"z-index": "2",
						"pointer-events": "none"
					}
				}, null, _parent));
				_push(`<div class="form-control" style="${ssrRenderStyle({
					"padding-left": "34px",
					"display": "flex",
					"align-items": "center",
					"font-size": "12px"
				})}" data-v-769a087a>`);
				if (!unref(formTiketBaru).tutup) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-769a087a>Waktu Tutup...</span>`);
				else _push(`<span style="${ssrRenderStyle({
					"color": "#0f172a",
					"font-weight": "500"
				})}" data-v-769a087a>${ssrInterpolate(formatDateTimeKustom(unref(formTiketBaru).tutup))}</span>`);
				_push(`</div><input type="datetime-local"${ssrRenderAttr("value", unref(formTiketBaru).tutup)} style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"width": "100%",
					"height": "100%",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "3"
				})}" data-v-769a087a></div></div>`);
			} else _push(`<div class="form-control" style="${ssrRenderStyle({
				"background": "#f8fafc",
				"color": "#8a9aa8",
				"text-align": "center",
				"font-style": "italic",
				"font-size": "12px"
			})}" data-v-769a087a> Tiket bebas dibeli kapan saja tanpa dibatasi waktu buka/tutup. </div>`);
			_push(`</div></div><div class="row mb-3" data-v-769a087a><div class="col" data-v-769a087a><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"font-size": "12px",
				"cursor": "pointer",
				"color": "#4a5a6e",
				"font-weight": "600"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formTiketBaru).is_hidden) ? ssrLooseContain(unref(formTiketBaru).is_hidden, null) : unref(formTiketBaru).is_hidden) ? " checked" : ""} style="${ssrRenderStyle({
				"width": "16px",
				"height": "16px"
			})}" data-v-769a087a> Sembunyikan Tiket (Tiket Privat / Direct Link) </label><div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#8a9aa8",
				"margin-top": "4px",
				"margin-left": "24px"
			})}" data-v-769a087a>Tiket tidak akan muncul di halaman publik, hanya bisa diakses via link rahasia.</div></div></div><div class="row mb-3" data-v-769a087a><div class="col" data-v-769a087a><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"font-size": "12px",
				"cursor": "pointer",
				"color": "#4a5a6e",
				"font-weight": "600"
			})}" data-v-769a087a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formTiketBaru).is_active) ? ssrLooseContain(unref(formTiketBaru).is_active, null) : unref(formTiketBaru).is_active) ? " checked" : ""} style="${ssrRenderStyle({
				"width": "16px",
				"height": "16px",
				"accent-color": "#10b981"
			})}" data-v-769a087a> Tiket Aktif (Bisa Dibeli) </label><div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#8a9aa8",
				"margin-top": "4px",
				"margin-left": "24px"
			})}" data-v-769a087a>Hapus centang untuk menonaktifkan tiket sepenuhnya (Tidak akan terlihat &amp; tidak bisa dibeli).</div></div></div><div class="flex" style="${ssrRenderStyle({
				"gap": "10px",
				"margin-top": "8px"
			})}" data-v-769a087a><button class="btn-primary" style="${ssrRenderStyle({
				"padding": "8px 20px",
				"font-weight": "600",
				"display": "flex",
				"align-items": "center",
				"gap": "6px",
				"font-size": "12px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:plus-circle",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` Tambah Tiket</button><button class="btn-outline" style="${ssrRenderStyle({
				"padding": "8px 20px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px",
				"font-size": "12px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:rotate-ccw",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` Reset</button></div></div><div style="${ssrRenderStyle({
				"background": "#f8fafc",
				"border-radius": "16px",
				"padding": "20px",
				"border": "1px solid #e6edf5"
			})}" data-v-769a087a><h5 style="${ssrRenderStyle({
				"margin-bottom": "12px",
				"font-weight": "600",
				"color": "#4a5a6e",
				"font-size": "13px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:list",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Daftar Tiket Tersimpan</h5>`);
			if (unref(wizardTiketList).length === 0) _push(`<div style="${ssrRenderStyle({
				"color": "#8a9aa8",
				"font-style": "italic",
				"text-align": "center",
				"padding": "20px 0",
				"font-size": "12px"
			})}" data-v-769a087a>Belum ada tiket yang ditambahkan.</div>`);
			else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(wizardTiketList), (t, i) => {
				_push(`<div style="${ssrRenderStyle({
					"background": "#ffffff",
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"padding": "12px 16px",
					"border": "1px solid #e6edf5",
					"border-radius": "12px",
					"margin-bottom": "8px",
					"font-size": "13px",
					"box-shadow": "0 1px 4px rgba(0,0,0,0.02)"
				})}" data-v-769a087a><div data-v-769a087a><div style="${ssrRenderStyle({
					"font-weight": "700",
					"color": "#0a1929",
					"margin-bottom": "4px",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-769a087a>${ssrInterpolate(t.nama)} `);
				if (t.is_active === false) _push(`<span style="${ssrRenderStyle({
					"background": "#fee2e2",
					"color": "#ef4444",
					"font-size": "10px",
					"padding": "2px 6px",
					"border-radius": "4px",
					"font-weight": "600"
				})}" data-v-769a087a>Nonaktif</span>`);
				else _push(`<!---->`);
				if (t.is_hidden) {
					_push(`<span style="${ssrRenderStyle({
						"background": "#f1f5f9",
						"color": "#64748b",
						"font-size": "10px",
						"padding": "2px 6px",
						"border-radius": "4px",
						"font-weight": "600"
					})}" data-v-769a087a>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:eye-off",
						style: {
							"font-size": "10px",
							"margin-right": "2px"
						}
					}, null, _parent));
					_push(` Privat</span>`);
				} else _push(`<!---->`);
				_push(`</div><div style="${ssrRenderStyle({
					"font-size": "11px",
					"color": "#8a9aa8"
				})}" data-v-769a087a>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:users",
					style: {
						"font-size": "12px",
						"vertical-align": "text-bottom",
						"margin-right": "2px"
					}
				}, null, _parent));
				_push(` Kuota: <span style="${ssrRenderStyle({
					"font-weight": "600",
					"color": "#4a5a6e"
				})}" data-v-769a087a>${ssrInterpolate(t.kuota == 0 ? "Tidak Terbatas" : t.kuota)}</span></div></div><div style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "16px"
				})}" data-v-769a087a><div style="${ssrRenderStyle({
					"font-weight": "700",
					"color": "var(--primary)",
					"background": "#eef3f9",
					"padding": "4px 10px",
					"border-radius": "8px",
					"font-size": "12px"
				})}" data-v-769a087a>${ssrInterpolate(formatRupiah(t.harga))}</div><button style="${ssrRenderStyle({
					"background": "none",
					"border": "none",
					"color": "#d43f34",
					"cursor": "pointer",
					"display": "flex",
					"align-items": "center",
					"padding": "6px",
					"border-radius": "6px",
					"transition": "0.2s"
				})}" onmouseover="this.style.background=&#39;#fee2e2&#39;" onmouseout="this.style.background=&#39;none&#39;" data-v-769a087a>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:trash-2",
					style: { "font-size": "16px" }
				}, null, _parent));
				_push(`</button></div></div>`);
			});
			_push(`<!--]--></div></div><div class="right" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_AdminMobilePreview, {
				step: 2,
				formEvent: unref(formEvent),
				wizardTiketList: unref(wizardTiketList),
				hpPreviewHtml: hpPreviewHtml.value
			}, null, _parent));
			_push(`</div></div></div><div class="${ssrRenderClass([{ active: unref(wizardStepNow) === 3 }, "wiz-step"])}" data-v-769a087a><div class="wiz-grid" data-v-769a087a><div class="left" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"gap": "16px",
				"min-width": "0"
			})}" data-v-769a087a>`);
			if (unref(wizardStepNow) === 3) _push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
			else _push(`<!---->`);
			_push(`</div><div class="right" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_AdminMobilePreview, {
				step: 3,
				formEvent: unref(formEvent),
				wizardTiketList: unref(wizardTiketList),
				hpPreviewHtml: hpPreviewHtml.value
			}, null, _parent));
			_push(`</div></div></div><div class="${ssrRenderClass([{ active: unref(wizardStepNow) === 4 }, "wiz-step"])}" data-v-769a087a><div class="wiz-grid" data-v-769a087a><div class="left" data-v-769a087a><h4 style="${ssrRenderStyle({
				"margin-bottom": "20px",
				"font-weight": "600",
				"color": "#0a1929",
				"font-size": "16px",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:check-circle",
				style: { "color": "#15803d" }
			}, null, _parent));
			_push(` Ringkasan Event</h4><div style="${ssrRenderStyle({
				"background": "linear-gradient(to right, #ffffff, #f7faff)",
				"border-radius": "16px",
				"padding": "20px",
				"border": "1px solid #e6edf5",
				"margin-bottom": "16px",
				"box-shadow": "0 2px 8px rgba(0,0,0,0.02)"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "18px",
				"font-weight": "700",
				"color": "#0a1929",
				"margin-bottom": "10px",
				"letter-spacing": "-0.3px"
			})}" data-v-769a087a>${ssrInterpolate(unref(formEvent).nama || "Event Baru")}</div><div class="text-muted" style="${ssrRenderStyle({
				"font-size": "13px",
				"display": "flex",
				"gap": "16px",
				"flex-wrap": "wrap",
				"font-weight": "500"
			})}" data-v-769a087a><span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:calendar",
				style: {
					"font-size": "14px",
					"color": "#8a9aa8"
				}
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({ "color": "#4a5a6e" })}" data-v-769a087a>${ssrInterpolate(unref(formEvent).tanggal || "Tanggal Belum Diatur")}</span></span><span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:map-pin",
				style: {
					"font-size": "14px",
					"color": "#8a9aa8"
				}
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({ "color": "#4a5a6e" })}" data-v-769a087a>${ssrInterpolate(unref(formEvent).lokasi || "Lokasi Belum Diatur")}</span></span></div></div><div style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "1fr 1fr",
				"gap": "16px",
				"margin-bottom": "16px"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"background": "#ffffff",
				"border-radius": "14px",
				"padding": "16px",
				"border": "1px solid #e6edf5",
				"box-shadow": "0 1px 4px rgba(0,0,0,0.01)"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "12px",
				"font-weight": "600",
				"color": "#8a9aa8",
				"text-transform": "uppercase",
				"letter-spacing": "0.5px",
				"margin-bottom": "10px",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:ticket",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Kategori Tiket</div><div class="text-muted" style="${ssrRenderStyle({
				"font-size": "13px",
				"line-height": "1.7"
			})}" data-v-769a087a>`);
			if (unref(wizardTiketList).length === 0) _push(`<div data-v-769a087a>Belum ada tiket</div>`);
			else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(wizardTiketList), (t) => {
				_push(`<div data-v-769a087a>• ${ssrInterpolate(t.nama)} (${ssrInterpolate(formatRupiah(t.harga))})</div>`);
			});
			_push(`<!--]--></div></div><div style="${ssrRenderStyle({
				"background": "#ffffff",
				"border-radius": "14px",
				"padding": "16px",
				"border": "1px solid #e6edf5",
				"box-shadow": "0 1px 4px rgba(0,0,0,0.01)"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "12px",
				"font-weight": "600",
				"color": "#8a9aa8",
				"text-transform": "uppercase",
				"letter-spacing": "0.5px",
				"margin-bottom": "10px",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:file-text",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Pertanyaan Kustom</div><div class="text-muted" style="${ssrRenderStyle({
				"font-size": "13px",
				"line-height": "1.7"
			})}" data-v-769a087a>`);
			if (unref(formForgeItems).length === 0) _push(`<div data-v-769a087a>Belum ada pertanyaan</div>`);
			else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(formForgeItems), (q) => {
				_push(`<div data-v-769a087a>• ${ssrInterpolate(q.label)}</div>`);
			});
			_push(`<!--]--></div></div></div><div style="${ssrRenderStyle({
				"background": "#ffffff",
				"border-radius": "14px",
				"padding": "16px",
				"border": "1px solid #e6edf5",
				"box-shadow": "0 1px 4px rgba(0,0,0,0.01)"
			})}" data-v-769a087a><div style="${ssrRenderStyle({
				"font-size": "12px",
				"font-weight": "600",
				"color": "#8a9aa8",
				"text-transform": "uppercase",
				"letter-spacing": "0.5px",
				"margin-bottom": "10px",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:settings-2",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Fitur Aktif</div><div class="text-muted" style="${ssrRenderStyle({
				"font-size": "13px",
				"font-weight": "500",
				"color": "#0a1929",
				"display": "flex",
				"gap": "12px",
				"flex-wrap": "wrap"
			})}" data-v-769a087a><span data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:check-circle-2",
				style: {
					"font-size": "14px",
					"color": "var(--primary)",
					"margin-right": "2px",
					"vertical-align": "text-bottom"
				}
			}, null, _parent));
			_push(` ${ssrInterpolate(unref(formEvent).tipe_event)}</span><span data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:check-circle-2",
				style: {
					"font-size": "14px",
					"color": "var(--primary)",
					"margin-right": "2px",
					"vertical-align": "text-bottom"
				}
			}, null, _parent));
			_push(` ${ssrInterpolate(unref(formEvent).sistem_checkin)}</span></div></div><div style="${ssrRenderStyle({ "margin-top": "24px" })}" data-v-769a087a><label style="${ssrRenderStyle({
				"font-size": "12px",
				"font-weight": "600",
				"color": "#8a9aa8",
				"text-transform": "uppercase",
				"margin-bottom": "8px",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:link",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Link Publikasi</label><div style="${ssrRenderStyle({
				"background": "#e4edf8",
				"padding": "12px 18px",
				"border-radius": "12px",
				"font-size": "13px",
				"font-family": "monospace",
				"color": "#1a4a7a",
				"border": "1px dashed #b8c8d8",
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center"
			})}" data-v-769a087a><span data-v-769a087a>${ssrInterpolate(baseUrl.value)}/<strong style="${ssrRenderStyle({ "color": "#0a1929" })}" data-v-769a087a>${ssrInterpolate(unref(formEvent).slug || "slug-event")}</strong></span><button class="btn-icon" style="${ssrRenderStyle({
				"background": "white",
				"padding": "4px 8px",
				"border-radius": "6px",
				"border": "1px solid #cbd5e1",
				"font-size": "12px",
				"cursor": "pointer"
			})}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:copy",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Copy</button></div></div></div><div class="right" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_AdminMobilePreview, {
				step: 4,
				formEvent: unref(formEvent),
				wizardTiketList: unref(wizardTiketList),
				hpPreviewHtml: hpPreviewHtml.value
			}, null, _parent));
			_push(`</div></div></div><div class="nav-buttons" data-v-769a087a><button class="btn-outline" style="${ssrRenderStyle([{ visibility: unref(wizardStepNow) === 1 ? "hidden" : "visible" }, {
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			}])}" data-v-769a087a>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:arrow-left",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` Kembali</button><button class="btn-primary"${ssrIncludeBooleanAttr(unref(isSavingEvent)) ? " disabled" : ""} style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}" data-v-769a087a>`);
			if (unref(wizardStepNow) === 4) {
				_push(`<!--[-->`);
				if (unref(isSavingEvent)) {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:loader",
						style: {
							"font-size": "16px",
							"animation": "spin 1s linear infinite"
						}
					}, null, _parent));
					_push(` Menyimpan...<!--]-->`);
				} else {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:rocket",
						style: { "font-size": "16px" }
					}, null, _parent));
					_push(` Publikasikan<!--]-->`);
				}
				_push(`<!--]-->`);
			} else {
				_push(`<!--[--> Lanjut `);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-right",
					style: { "font-size": "16px" }
				}, null, _parent));
				_push(`<!--]-->`);
			}
			_push(`</button></div></div></div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminWizard.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var AdminWizard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-769a087a"]]);
//#endregion
//#region app/components/admin/AdminOnboarding.vue
var _sfc_main$3 = {
	__name: "AdminOnboarding",
	__ssrInlineRender: true,
	setup(__props) {
		const { showOnboarding, currentUser, organizerProfile} = useAdmin();
		const form = ref({
			nama: "",
			wa_cc: "62",
			wa_raw: "",
			pin: ""
		});
		const loading = ref(false);
		const canSkip = computed(() => {
			const currentPin = organizerProfile.value?.pin_scanner;
			const currentName = organizerProfile.value?.nama_organizer;
			return Boolean(currentName && currentPin && currentPin !== "123456");
		});
		const waDisplay = computed({
			get: () => form.value.wa_raw,
			set: (val) => {
				let clean = val.replace(/\D/g, "");
				if (clean.startsWith("0")) clean = clean.substring(1);
				if (form.value.wa_cc === "62" && clean.startsWith("62")) clean = clean.substring(2);
				form.value.wa_raw = clean;
			}
		});
		const pinError = computed(() => {
			const pin = form.value.pin;
			if (!pin) return "PIN wajib diisi.";
			if (pin.length !== 6) return "PIN harus tepat 6 digit angka.";
			if (pin === "123456" || pin === "654321") return "PIN terlalu mudah ditebak, gunakan kombinasi angka lain.";
			if (/^(\d)\1{5}$/.test(pin)) return "PIN tidak boleh angka kembar (misal 000000 atau 111111).";
			return "";
		});
		const isFormValid = computed(() => {
			return form.value.nama.trim() !== "" && pinError.value === "";
		});
		watch(() => [currentUser.value, organizerProfile.value], () => {
			const u = currentUser.value;
			const org = organizerProfile.value;
			if (org && org.nama_organizer && !form.value.nama) form.value.nama = org.nama_organizer;
			else if (u && u.user_metadata && !form.value.nama) form.value.nama = u.user_metadata.full_name || "";
			if (org && org.no_wa && !form.value.wa_raw) {
				let phone = String(org.no_wa).replace(/\D/g, "");
				if (phone.startsWith("62")) {
					form.value.wa_cc = "62";
					phone = phone.substring(2);
				} else if (phone.startsWith("0")) phone = phone.substring(1);
				form.value.wa_raw = phone;
			} else if (u && u.user_metadata && !form.value.wa_raw && u.user_metadata.phone) {
				let phone = String(u.user_metadata.phone).replace(/\D/g, "");
				if (phone.startsWith("62")) {
					form.value.wa_cc = "62";
					phone = phone.substring(2);
				} else if (phone.startsWith("0")) phone = phone.substring(1);
				form.value.wa_raw = phone;
			}
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: ["wizard-overlay", { open: unref(showOnboarding) }],
				style: { "z-index": "10000" }
			}, _attrs))} data-v-0e36aa21><div class="wizard" style="${ssrRenderStyle({
				"max-width": "480px",
				"padding": "32px",
				"text-align": "center",
				"height": "auto"
			})}" data-v-0e36aa21><h2 style="${ssrRenderStyle({
				"margin-bottom": "8px",
				"color": "#0a1929"
			})}" data-v-0e36aa21>Selamat Datang! 🎉</h2><p style="${ssrRenderStyle({
				"color": "#8a9aa8",
				"font-size": "14px",
				"margin-bottom": "24px"
			})}" data-v-0e36aa21>Sebelum mulai membuat event, yuk lengkapi profil organizer kamu. Data ini akan tampil otomatis di setiap halaman pendaftaran.</p><div class="mb-3" style="${ssrRenderStyle({ "text-align": "left" })}" data-v-0e36aa21><label class="form-label" data-v-0e36aa21>Nama Organizer <span style="${ssrRenderStyle({ "color": "#d43f34" })}" data-v-0e36aa21>*</span></label><input type="text"${ssrRenderAttr("value", form.value.nama)} class="form-control" placeholder="Contoh: Nama EO / BEM Kampus" data-v-0e36aa21></div><div class="mb-3" style="${ssrRenderStyle({ "text-align": "left" })}" data-v-0e36aa21><label class="form-label" data-v-0e36aa21>No. WhatsApp Utama</label><div style="${ssrRenderStyle({
				"display": "flex",
				"gap": "8px"
			})}" data-v-0e36aa21><input type="text"${ssrRenderAttr("value", form.value.wa_cc)} class="form-control" style="${ssrRenderStyle({
				"width": "70px",
				"text-align": "center",
				"padding": "10px 4px"
			})}" placeholder="62" data-v-0e36aa21><input type="text"${ssrRenderAttr("value", waDisplay.value)} class="form-control" style="${ssrRenderStyle({ "flex": "1" })}" placeholder="81234567890" data-v-0e36aa21></div></div><div class="mb-3" style="${ssrRenderStyle({ "text-align": "left" })}" data-v-0e36aa21><label class="form-label" data-v-0e36aa21>PIN Akses Scanner <span style="${ssrRenderStyle({ "color": "#d43f34" })}" data-v-0e36aa21>*</span></label><input type="text"${ssrRenderAttr("value", form.value.pin)} class="form-control" style="${ssrRenderStyle(form.value.pin && pinError.value ? "border-color:#d43f34;" : "")}" placeholder="Buat PIN 6 digit angka (bukan 123456)" maxlength="6" inputmode="numeric" data-v-0e36aa21>`);
			if (form.value.pin && pinError.value) _push(`<div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#d43f34",
				"margin-top": "4px"
			})}" data-v-0e36aa21>⚠️ ${ssrInterpolate(pinError.value)}</div>`);
			else _push(`<div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#8a9aa8",
				"margin-top": "4px"
			})}" data-v-0e36aa21>PIN rahasia ini digunakan volunteer untuk login ke sistem Scanner QR.</div>`);
			_push(`</div><button class="btn-primary"${ssrIncludeBooleanAttr(loading.value || !isFormValid.value) ? " disabled" : ""} style="${ssrRenderStyle({
				"width": "100%",
				"padding": "14px",
				"font-size": "15px",
				"margin-top": "16px"
			})}" data-v-0e36aa21>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan & Mulai")}</button>`);
			if (canSkip.value) _push(`<button class="btn-outline" style="${ssrRenderStyle({
				"width": "100%",
				"border": "none",
				"margin-top": "8px"
			})}" data-v-0e36aa21> Nanti Saja (Lewati) </button>`);
			else _push(`<div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#ef4444",
				"margin-top": "12px",
				"font-weight": "600",
				"line-height": "1.4"
			})}" data-v-0e36aa21> 🛡️ Demi keamanan gerbang acara Anda, wajib membuat PIN Scanner 6 digit kustom sebelum memulai. </div>`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminOnboarding.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var AdminOnboarding_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-0e36aa21"]]);
//#endregion
//#region app/components/admin/AdminConfirm.vue
var _sfc_main$2 = {
	__name: "AdminConfirm",
	__ssrInlineRender: true,
	setup(__props) {
		const { confirmData} = useAdmin();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["confirm-overlay", { open: unref(confirmData).show }] }, _attrs))} data-v-5a2eef80><div class="confirm-box" data-v-5a2eef80><div class="icon" data-v-5a2eef80>${ssrInterpolate(unref(confirmData).type === "danger" ? "⚠️" : "❓")}</div><h3 data-v-5a2eef80>${ssrInterpolate(unref(confirmData).title)}</h3><p data-v-5a2eef80>${ssrInterpolate(unref(confirmData).message)}</p><div class="btn-row" data-v-5a2eef80><button class="btn-outline" data-v-5a2eef80>Batal</button><button class="btn-primary" style="${ssrRenderStyle({ background: unref(confirmData).type === "danger" ? "#d43f34" : "#1a6a4a" })}" data-v-5a2eef80>${ssrInterpolate(unref(confirmData).actionText)}</button></div></div></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminConfirm.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var AdminConfirm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-5a2eef80"]]);
//#endregion
//#region app/components/admin/AdminToast.vue
var _sfc_main$1 = {
	__name: "AdminToast",
	__ssrInlineRender: true,
	setup(__props) {
		const { toastList } = useAdmin();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "toastContainer" }, _attrs))} data-v-6b096e53><!--[-->`);
			ssrRenderList(unref(toastList), (toast) => {
				_push(`<div class="${ssrRenderClass([[toast.type, { show: toast.show }], "toast-msg"])}" data-v-6b096e53><span style="${ssrRenderStyle({ "font-size": "16px" })}" data-v-6b096e53>${ssrInterpolate(toast.type === "error" ? "❌" : toast.type === "warning" ? "⚠️" : "✅")}</span><span data-v-6b096e53>${ssrInterpolate(toast.message)}</span></div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminToast.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AdminToast_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-6b096e53"]]);
//#endregion
//#region app/pages/admin.vue
var _sfc_main = {
	__name: "admin",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "tyket.id · Organizer Creator",
			bodyAttrs: { style: "margin: 0; background: #f8fafc; overflow: hidden; font-family: Inter, sans-serif;" }
		});
		useSupabaseUser();
		useAdmin();
		useRouter();
		const route = useRoute();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-layout" }, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$7, { style: unref(route).path !== "/admin" ? null : { display: "none" } }, null, _parent));
			_push(`<div class="main">`);
			_push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
			_push(`<div class="content" id="pageContent">`);
			_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`<div class="loader-container" style="${ssrRenderStyle({
					"height": "100%",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center"
				})}"${_scopeId}><div class="spinner"${_scopeId}></div></div>`);
				else return [createVNode("div", {
					class: "loader-container",
					style: {
						"height": "100%",
						"display": "flex",
						"align-items": "center",
						"justify-content": "center"
					}
				}, [createVNode("div", { class: "spinner" })])];
			}) }, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(AdminWizard_default, null, null, _parent));
			_push(ssrRenderComponent(AdminOnboarding_default, null, null, _parent));
			_push(ssrRenderComponent(AdminConfirm_default, null, null, _parent));
			_push(ssrRenderComponent(AdminToast_default, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-DDmfx7xq.mjs.map
