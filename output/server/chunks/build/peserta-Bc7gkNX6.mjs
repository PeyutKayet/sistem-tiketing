import { t as components_default } from './components-C44pW9aw.mjs';
import { u as useAdmin } from './useAdmin-Bdc_3kD3.mjs';
import { ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
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
import 'vue-router';
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
import './useSupabaseClient-BMEM7jHo.mjs';

//#region app/pages/admin/event/[slug]/peserta.vue
var _sfc_main = {
	__name: "peserta",
	__ssrInlineRender: true,
	setup(__props) {
		const { isLoading, selectedEvent, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, isLoadingPeserta, daftarPeserta, muatDaftarPeserta, pesertaPage, pesertaTotalData } = useAdmin();
		const searchQuery = ref("");
		const filterStatus = ref("semua");
		const filterHadir = ref("semua");
		const totalPages = computed(() => Math.ceil(pesertaTotalData.value / 50) || 1);
		const reloadData = () => {
			muatDaftarPeserta(searchQuery.value, filterStatus.value, filterHadir.value, 50);
		};
		let timeoutSearch = null;
		watch([
			pesertaPage,
			searchQuery,
			filterStatus,
			filterHadir
		], () => {
			if (pesertaPage.value > totalPages.value) pesertaPage.value = 1;
			clearTimeout(timeoutSearch);
			timeoutSearch = setTimeout(() => {
				reloadData();
			}, 500);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			if (unref(selectedEvent)) {
				_push(`<div id="page-peserta"><div class="page-header"><h2 class="page-title">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:users",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Peserta <span>${ssrInterpolate(unref(selectedEvent).nama_event)}</span></h2><button class="btn-outline">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-left",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Kembali ke Event</button></div><div class="stats-grid" style="${ssrRenderStyle({ "margin": "0 0 18px 0" })}"><div class="stat-card"><div class="label">Total</div><div class="value">${ssrInterpolate(unref(totalPeserta))}</div></div><div class="stat-card"><div class="label">Lunas</div><div class="value">${ssrInterpolate(unref(totalLunas))}</div></div><div class="stat-card"><div class="label">Pending</div><div class="value">${ssrInterpolate(unref(totalPending))}</div></div><div class="stat-card"><div class="label">Hadir</div><div class="value">${ssrInterpolate(unref(totalHadir))} <span style="${ssrRenderStyle({
					"font-size": "14px",
					"font-weight": "normal",
					"color": "#8a9aa8"
				})}">(${ssrInterpolate(unref(persenHadir))}%)</span></div></div></div><div class="flex" style="${ssrRenderStyle({
					"margin-bottom": "14px",
					"flex-wrap": "wrap"
				})}"><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="🔍 Cari Nama / Email / WA" class="filter-control" style="${ssrRenderStyle({
					"flex": "1",
					"min-width": "180px"
				})}"><select class="filter-control"><option value="semua"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "semua") : ssrLooseEqual(filterStatus.value, "semua")) ? " selected" : ""}>Semua Status</option><option value="paid"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "paid") : ssrLooseEqual(filterStatus.value, "paid")) ? " selected" : ""}>Lunas</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "pending") : ssrLooseEqual(filterStatus.value, "pending")) ? " selected" : ""}>Pending</option></select><select class="filter-control"><option value="semua"${ssrIncludeBooleanAttr(Array.isArray(filterHadir.value) ? ssrLooseContain(filterHadir.value, "semua") : ssrLooseEqual(filterHadir.value, "semua")) ? " selected" : ""}>Semua Kehadiran</option><option value="hadir"${ssrIncludeBooleanAttr(Array.isArray(filterHadir.value) ? ssrLooseContain(filterHadir.value, "hadir") : ssrLooseEqual(filterHadir.value, "hadir")) ? " selected" : ""}>Hadir</option><option value="belum"${ssrIncludeBooleanAttr(Array.isArray(filterHadir.value) ? ssrLooseContain(filterHadir.value, "belum") : ssrLooseEqual(filterHadir.value, "belum")) ? " selected" : ""}>Belum</option></select><button class="btn-success">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:download",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Download CSV</button></div><div class="table-wrap"><table style="${ssrRenderStyle({
					"width": "100%",
					"border-collapse": "collapse",
					"font-size": "14px",
					"min-width": "600px"
				})}"><thead style="${ssrRenderStyle({
					"background": "#f7faff",
					"border-bottom": "1px solid #e6edf5",
					"text-align": "left"
				})}"><tr><th style="${ssrRenderStyle({ "padding": "14px 20px" })}">Nama</th><th style="${ssrRenderStyle({ "padding": "14px 20px" })}">Email &amp; WA</th><th style="${ssrRenderStyle({ "padding": "14px 20px" })}">Tiket</th><th style="${ssrRenderStyle({ "padding": "14px 20px" })}">Status</th><th style="${ssrRenderStyle({ "padding": "14px 20px" })}">Bukti</th><th style="${ssrRenderStyle({ "padding": "14px 20px" })}">Aksi</th></tr></thead><tbody>`);
				if (unref(isLoadingPeserta)) _push(`<tr><td colspan="6" style="${ssrRenderStyle({ "padding": "20px" })}"><div style="${ssrRenderStyle({
					"display": "flex",
					"flex-direction": "column",
					"gap": "12px"
				})}"><div class="skeleton" style="${ssrRenderStyle({
					"height": "40px",
					"width": "100%",
					"border-radius": "8px"
				})}"></div><div class="skeleton" style="${ssrRenderStyle({
					"height": "40px",
					"width": "100%",
					"border-radius": "8px"
				})}"></div><div class="skeleton" style="${ssrRenderStyle({
					"height": "40px",
					"width": "100%",
					"border-radius": "8px"
				})}"></div></div></td></tr>`);
				else if (unref(daftarPeserta).length === 0) _push(`<tr><td colspan="6" style="${ssrRenderStyle({
					"text-align": "center",
					"padding": "30px",
					"color": "#8a9aa8"
				})}">Tidak ada data peserta yang cocok.</td></tr>`);
				else _push(`<!---->`);
				_push(`<!--[-->`);
				ssrRenderList(unref(daftarPeserta), (p) => {
					_push(`<tr style="${ssrRenderStyle({ "border-bottom": "1px solid #f0f4fa" })}"><td style="${ssrRenderStyle({
						"padding": "14px 20px",
						"font-weight": "500"
					})}">${ssrInterpolate(p.nama_lengkap)}</td><td style="${ssrRenderStyle({ "padding": "14px 20px" })}">${ssrInterpolate(p.email)}<br><small style="${ssrRenderStyle({ "color": "#8a9aa8" })}">${ssrInterpolate(p.no_wa)}</small></td><td style="${ssrRenderStyle({ "padding": "14px 20px" })}">${ssrInterpolate(p.nama_tiket)}</td><td style="${ssrRenderStyle({ "padding": "14px 20px" })}">`);
					if (p.status_bayar === "paid") _push(`<span class="status-badge active" style="${ssrRenderStyle({ "margin": "0" })}">Lunas</span>`);
					else _push(`<span class="status-badge off" style="${ssrRenderStyle({
						"margin": "0",
						"background": "#fdf0e4",
						"color": "#b8681a"
					})}">Pending</span>`);
					_push(`</td><td style="${ssrRenderStyle({ "padding": "14px 20px" })}">`);
					if (p.bukti_bayar_url && p.bukti_bayar_url !== "Tidak ada file" && p.bukti_bayar_url.startsWith("http")) _push(`<a${ssrRenderAttr("href", p.bukti_bayar_url)} target="_blank" style="${ssrRenderStyle({
						"color": "var(--primary)",
						"text-decoration": "none",
						"font-weight": "600"
					})}">Lihat</a>`);
					else _push(`<span>-</span>`);
					_push(`</td><td style="${ssrRenderStyle({
						"padding": "14px 20px",
						"display": "flex",
						"gap": "8px"
					})}">`);
					if (p.status_bayar === "pending") {
						_push(`<button class="btn-primary btn-sm" style="${ssrRenderStyle({
							"padding": "6px 12px",
							"font-size": "12px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:check-circle",
							style: { "margin-right": "4px" }
						}, null, _parent));
						_push(` Set Lunas</button>`);
					} else _push(`<!---->`);
					if (p.status_bayar === "paid" && !p.status_hadir) {
						_push(`<button class="btn-success btn-sm" style="${ssrRenderStyle({
							"padding": "6px 12px",
							"font-size": "12px"
						})}">`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:map-pin",
							style: { "margin-right": "4px" }
						}, null, _parent));
						_push(` Check-in</button>`);
					} else _push(`<!---->`);
					if (p.status_hadir) {
						_push(`<span style="${ssrRenderStyle({
							"color": "#1a6a4a",
							"font-weight": "bold",
							"font-size": "12px"
						})}">Hadir `);
						_push(ssrRenderComponent(_component_Icon, { name: "lucide:check" }, null, _parent));
						_push(`</span>`);
					} else _push(`<!---->`);
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div><div id="infoDataPeserta" class="flex" style="${ssrRenderStyle({
					"justify-content": "space-between",
					"align-items": "center",
					"margin-top": "14px",
					"flex-wrap": "wrap",
					"gap": "10px"
				})}"><span class="text-muted" style="${ssrRenderStyle({ "font-size": "14px" })}">Total Ditemukan: ${ssrInterpolate(unref(pesertaTotalData))} peserta</span><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "8px",
					"align-items": "center"
				})}"><button class="btn-outline btn-sm"${ssrIncludeBooleanAttr(unref(pesertaPage) <= 1) ? " disabled" : ""}>`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:arrow-left" }, null, _parent));
				_push(`</button><span style="${ssrRenderStyle({
					"font-size": "14px",
					"font-weight": "500"
				})}">Halaman ${ssrInterpolate(unref(pesertaPage))} dari ${ssrInterpolate(totalPages.value)}</span><button class="btn-outline btn-sm"${ssrIncludeBooleanAttr(unref(pesertaPage) >= totalPages.value) ? " disabled" : ""}>`);
				_push(ssrRenderComponent(_component_Icon, { name: "lucide:arrow-right" }, null, _parent));
				_push(`</button></div></div></div>`);
			} else if (unref(isLoading)) _push(`<div class="loader-container" style="${ssrRenderStyle({
				"height": "100%",
				"display": "flex",
				"align-items": "center",
				"justify-content": "center"
			})}"><div style="${ssrRenderStyle({ "text-align": "center" })}"><div class="spinner" style="${ssrRenderStyle({ "margin": "0 auto 12px auto" })}"></div><div style="${ssrRenderStyle({
				"font-weight": "500",
				"font-size": "13px",
				"color": "#8a9aa8"
			})}">Memuat data event...</div></div></div>`);
			else {
				_push(`<div style="${ssrRenderStyle({
					"padding": "60px 20px",
					"text-align": "center",
					"color": "#8a9aa8"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:file-question",
					style: {
						"font-size": "48px",
						"color": "#c8d6e8",
						"margin-bottom": "12px",
						"display": "block",
						"margin-inline": "auto"
					}
				}, null, _parent));
				_push(`<div style="${ssrRenderStyle({
					"font-size": "16px",
					"font-weight": "600",
					"color": "#0a1929",
					"margin-bottom": "8px"
				})}">Event Tidak Ditemukan</div> Event yang Anda cari mungkin sudah dihapus atau URL tidak valid.<br><br><button class="btn-primary">Kembali ke Beranda</button></div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/event/[slug]/peserta.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=peserta-Bc7gkNX6.mjs.map
