import { t as components_default } from './components-C44pW9aw.mjs';
import { b as useRouter$1 } from '../virtual/entry.mjs';
import { u as useAdmin } from './useAdmin-Bdc_3kD3.mjs';
import { mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
import 'vue-router';
import '@supabase/ssr';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import './useSupabaseClient-BMEM7jHo.mjs';

//#region app/pages/admin/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { isLoading, eventAktif, eventSelesai, eventArsip, showArsip, formatDate} = useAdmin();
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		useRouter$1();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "page-home" }, _attrs))}>`);
			if (unref(isLoading)) _push(`<div class="loader-container"><div class="spinner"></div><div style="${ssrRenderStyle({
				"font-weight": "500",
				"font-size": "13px"
			})}">Mengambil data event...</div></div>`);
			else {
				_push(`<div><div class="stats-grid"><div class="stat-card"><div class="label">Event Aktif</div><div class="value">${ssrInterpolate(unref(eventAktif).length)}</div><div class="sub">Sedang berjalan / akan datang</div></div><div class="stat-card"><div class="label">Event Selesai</div><div class="value">${ssrInterpolate(unref(eventSelesai).length)}</div><div class="sub">Event yang sudah lewat</div></div><div class="stat-card"><div class="label">Event Diarsipkan</div><div class="value">${ssrInterpolate(unref(eventArsip).length)}</div><div class="sub">Disembunyikan dari utama</div></div></div><div class="section-header"><h3 style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "8px"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:target",
					style: { "color": "var(--primary)" }
				}, null, _parent));
				_push(` Event Aktif</h3><div class="flex" style="${ssrRenderStyle({ "gap": "10px" })}"><button class="btn-outline" style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:archive" }, null, _parent));
				_push(` ${ssrInterpolate(unref(showArsip) ? "Sembunyikan Arsip" : "Lihat Arsip")}</button><button class="action" style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:plus" }, null, _parent));
				_push(` Buat Event Baru</button></div></div>`);
				if (unref(eventAktif).length === 0) {
					_push(`<div style="${ssrRenderStyle({
						"text-align": "center",
						"padding": "40px",
						"color": "#8a9aa8",
						"background": "#ffffff",
						"border-radius": "12px",
						"border": "1px dashed #c8d6e8",
						"margin-bottom": "24px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:inbox",
						style: {
							"font-size": "32px",
							"color": "#c8d6e8",
							"margin-bottom": "12px",
							"display": "block",
							"margin-inline": "auto"
						}
					}, null, _parent));
					_push(` Belum ada event aktif. Klik <b>Buat Event Baru</b> untuk memulai. </div>`);
				} else _push(`<!---->`);
				_push(`<div class="event-grid"><!--[-->`);
				ssrRenderList(unref(eventAktif), (ev) => {
					_push(`<div class="event-card"><div class="thumb" style="${ssrRenderStyle(ev.poster_url ? {
						backgroundImage: `url('${fixPosterUrl(ev.poster_url)}')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat"
					} : {})}">`);
					if (!ev.poster_url) _push(ssrRenderComponent(_component_Icon, {
						name: "lucide:rocket",
						style: {
							"color": "rgba(255,255,255,0.7)",
							"font-size": "48px"
						}
					}, null, _parent));
					else _push(`<!---->`);
					_push(`</div><div class="body"><div class="title">${ssrInterpolate(ev.nama_event)}</div><div class="meta" style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "12px"
					})}"><span style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "4px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:calendar",
						style: { "font-size": "14px" }
					}, null, _parent));
					_push(` ${ssrInterpolate(unref(formatDate)(ev.tanggal_mulai))}</span><span style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "4px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:map-pin",
						style: { "font-size": "14px" }
					}, null, _parent));
					_push(` ${ssrInterpolate(ev.lokasi || "Online")}</span></div><span class="status-badge active">● Aktif</span></div></div>`);
				});
				_push(`<!--]--></div>`);
				if (unref(eventSelesai).length > 0) {
					_push(`<div><div class="section-header"><h3 style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "8px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, { name: "lucide:flag" }, null, _parent));
					_push(` Event Selesai</h3></div><div class="event-grid"><!--[-->`);
					ssrRenderList(unref(eventSelesai), (ev) => {
						_push(`<div class="event-card finished"><div class="thumb gray" style="${ssrRenderStyle(ev.poster_url ? {
							backgroundImage: `url('${fixPosterUrl(ev.poster_url)}')`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat"
						} : {})}">`);
						if (!ev.poster_url) _push(ssrRenderComponent(_component_Icon, {
							name: "lucide:check-circle",
							style: {
								"color": "rgba(255,255,255,0.7)",
								"font-size": "48px"
							}
						}, null, _parent));
						else _push(`<!---->`);
						_push(`<span class="badge-selesai">SELESAI</span></div><div class="body"><div class="title">${ssrInterpolate(ev.nama_event)}</div><div class="meta" style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "12px"
						})}"><span style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "4px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:calendar",
							style: { "font-size": "14px" }
						}, null, _parent));
						_push(` ${ssrInterpolate(unref(formatDate)(ev.tanggal_mulai))}</span><span style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "4px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:map-pin",
							style: { "font-size": "14px" }
						}, null, _parent));
						_push(` ${ssrInterpolate(ev.lokasi || "Online")}</span></div><span class="status-badge off">● Selesai</span></div></div>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				if (unref(showArsip)) {
					_push(`<div style="${ssrRenderStyle({
						"margin-top": "24px",
						"padding-top": "24px",
						"border-top": "1px dashed #cbd5e1"
					})}"><div class="section-header"><h3 style="${ssrRenderStyle({
						"color": "#64748b",
						"display": "flex",
						"align-items": "center",
						"gap": "8px"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, { name: "lucide:archive" }, null, _parent));
					_push(` Laci Arsip</h3></div>`);
					if (unref(eventArsip).length === 0) {
						_push(`<div style="${ssrRenderStyle({
							"text-align": "center",
							"color": "#8a9aa8",
							"padding": "20px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:inbox",
							style: {
								"font-size": "24px",
								"color": "#c8d6e8",
								"margin-bottom": "8px",
								"display": "block",
								"margin-inline": "auto"
							}
						}, null, _parent));
						_push(` Tidak ada event diarsipkan. </div>`);
					} else _push(`<!---->`);
					_push(`<div class="event-grid"><!--[-->`);
					ssrRenderList(unref(eventArsip), (ev) => {
						_push(`<div class="event-card archived"><div class="thumb gray">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:folder-closed",
							style: {
								"color": "rgba(255,255,255,0.7)",
								"font-size": "48px"
							}
						}, null, _parent));
						_push(`</div><div class="body"><div class="title">${ssrInterpolate(ev.nama_event)}</div><div class="meta" style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "12px"
						})}"><span style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "4px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:calendar",
							style: { "font-size": "14px" }
						}, null, _parent));
						_push(` ${ssrInterpolate(unref(formatDate)(ev.tanggal_mulai))}</span><span style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "4px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:map-pin",
							style: { "font-size": "14px" }
						}, null, _parent));
						_push(` ${ssrInterpolate(ev.lokasi || "Online")}</span></div><span class="status-badge archived">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:archive",
							style: { "margin-right": "4px" }
						}, null, _parent));
						_push(` Diarsipkan</span></div></div>`);
					});
					_push(`<!--]--></div></div>`);
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-DYqeFPOb.mjs.map
