import { t as components_default } from './components-CJE4y65R.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BNBp86SD.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { N as NuxtLink } from './nuxt-link-DROHZVen.mjs';
import { ref, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue-router';
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

//#region \0virtual:public?%2Ffavicon.svg
var _virtual_public__2Ffavicon_default = publicAssetsURL("/favicon.svg");
//#endregion
//#region app/pages/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		const events = ref([]);
		const loading = ref(true);
		const error = ref(null);
		const fixPosterUrl = (url) => {
			if (!url) return "https://placehold.co/400x200/F8FAFC/64748B?text=POSTER+EVENT";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		const formatDate = (dateStr) => {
			if (!dateStr) return "Tanggal Menyusul";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "gridEventContainer" }, _attrs))} data-v-485135e1><div class="grid-event-header-compact" data-v-485135e1><div class="header-texts" data-v-485135e1><h1 data-v-485135e1>EventHub</h1><p data-v-485135e1>Temukan event menarik!</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/admin",
				class: "header-cta-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2Ffavicon_default)} alt="EventHub" class="header-cta-icon" data-v-485135e1${_scopeId}><span data-v-485135e1${_scopeId}>Buat Event</span>`);
					else return [createVNode("img", {
						src: _virtual_public__2Ffavicon_default,
						alt: "EventHub",
						class: "header-cta-icon"
					}), createVNode("span", null, "Buat Event")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (loading.value) {
				_push(`<div class="event-cards-wrapper" data-v-485135e1><!--[-->`);
				ssrRenderList(4, (i) => {
					_push(`<div class="event-card skeleton-card" data-v-485135e1><div class="skeleton-img" data-v-485135e1></div><div class="event-card-body" data-v-485135e1><div class="skeleton-text skeleton-title" data-v-485135e1></div><div class="event-card-meta-wrap" data-v-485135e1><div class="skeleton-text skeleton-meta" data-v-485135e1></div><div class="skeleton-text skeleton-meta" data-v-485135e1></div></div></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (error.value) {
				_push(`<div style="${ssrRenderStyle({
					"text-align": "center",
					"padding": "60px 20px",
					"background": "#fef2f2",
					"border-radius": "20px",
					"border": "1px dashed #f87171"
				})}" data-v-485135e1>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:alert-circle",
					style: {
						"font-size": "48px",
						"color": "#ef4444",
						"margin-bottom": "12px"
					}
				}, null, _parent));
				_push(`<h3 style="${ssrRenderStyle({
					"margin": "0 0 8px",
					"color": "#b91c1c"
				})}" data-v-485135e1>Gagal Memuat Data</h3><p style="${ssrRenderStyle({
					"margin": "0",
					"color": "#dc2626"
				})}" data-v-485135e1>${ssrInterpolate(error.value)}</p></div>`);
			} else if (events.value.length === 0) {
				_push(`<div style="${ssrRenderStyle({
					"text-align": "center",
					"padding": "60px 20px",
					"background": "#f8fafc",
					"border-radius": "20px",
					"border": "1px dashed #cbd5e1"
				})}" data-v-485135e1>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:calendar-off",
					style: {
						"font-size": "48px",
						"color": "#94a3b8",
						"margin-bottom": "12px"
					}
				}, null, _parent));
				_push(`<h3 style="${ssrRenderStyle({
					"margin": "0 0 8px",
					"color": "#475569"
				})}" data-v-485135e1>Belum Ada Event</h3><p style="${ssrRenderStyle({
					"margin": "0",
					"color": "#64748b"
				})}" data-v-485135e1>Saat ini belum ada event aktif yang tersedia. Coba kembali lagi nanti!</p></div>`);
			} else {
				_push(`<div class="event-cards-wrapper" data-v-485135e1><!--[-->`);
				ssrRenderList(events.value, (ev) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: ev.id,
						to: `/${ev.slug}`,
						class: "event-card"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<img${ssrRenderAttr("src", fixPosterUrl(ev.poster_url))} class="event-card-img"${ssrRenderAttr("alt", ev.nama_event)} loading="lazy" data-v-485135e1${_scopeId}><div class="event-card-body" data-v-485135e1${_scopeId}><h3 class="event-card-title" data-v-485135e1${_scopeId}>${ssrInterpolate(ev.nama_event)}</h3><div class="event-card-meta-wrap" data-v-485135e1${_scopeId}><div class="event-card-meta" data-v-485135e1${_scopeId}>`);
								_push(ssrRenderComponent(_component_Icon, {
									name: "lucide:calendar",
									style: { "color": "var(--primary)" }
								}, null, _parent, _scopeId));
								_push(`<span data-v-485135e1${_scopeId}>${ssrInterpolate(formatDate(ev.tanggal_mulai))}</span></div><div class="event-card-meta" data-v-485135e1${_scopeId}>`);
								_push(ssrRenderComponent(_component_Icon, {
									name: "lucide:map-pin",
									style: { "color": "#ef4444" }
								}, null, _parent, _scopeId));
								_push(`<span class="truncate-lokasi" data-v-485135e1${_scopeId}>${ssrInterpolate(ev.lokasi || "Lokasi Menyusul")}</span></div></div></div>`);
							} else return [createVNode("img", {
								src: fixPosterUrl(ev.poster_url),
								class: "event-card-img",
								alt: ev.nama_event,
								loading: "lazy"
							}, null, 8, ["src", "alt"]), createVNode("div", { class: "event-card-body" }, [createVNode("h3", { class: "event-card-title" }, toDisplayString(ev.nama_event), 1), createVNode("div", { class: "event-card-meta-wrap" }, [createVNode("div", { class: "event-card-meta" }, [createVNode(_component_Icon, {
								name: "lucide:calendar",
								style: { "color": "var(--primary)" }
							}), createVNode("span", null, toDisplayString(formatDate(ev.tanggal_mulai)), 1)]), createVNode("div", { class: "event-card-meta" }, [createVNode(_component_Icon, {
								name: "lucide:map-pin",
								style: { "color": "#ef4444" }
							}), createVNode("span", { class: "truncate-lokasi" }, toDisplayString(ev.lokasi || "Lokasi Menyusul"), 1)])])])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-485135e1"]]);

export { pages_default as default };
//# sourceMappingURL=pages-i2LfDL1K.mjs.map
