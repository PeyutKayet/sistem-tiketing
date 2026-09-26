import { t as components_default } from './components-C44pW9aw.mjs';
import { u as useAdmin } from './useAdmin-C8FerkPj.mjs';
import { ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/admin/event/[slug]/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { isLoading, selectedEvent, formatDate, totalPeserta, totalLunas, totalPending, totalHadir, persenHadir, showToast, supabase} = useAdmin();
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		const baseUrl = ref("");
		const isArchived = computed(() => selectedEvent.value && (selectedEvent.value.status === "archived" || selectedEvent.value.is_archived));
		const daftarTiket = ref([]);
		const isLoadingDaftarTiket = ref(false);
		const formatRupiah = (angka) => {
			if (angka === 0) return "GRATIS";
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(angka);
		};
		const muatTiketStatistik = async () => {
			if (!selectedEvent.value) return;
			isLoadingDaftarTiket.value = true;
			try {
				const { data, error } = await supabase.from("kategori_tiket").select("*").eq("event_id", selectedEvent.value.id);
				if (error) throw error;
				const { data: peserta } = await supabase.from("peserta").select("nama_tiket").eq("event_id", selectedEvent.value.id).eq("status_bayar", "paid");
				daftarTiket.value = (data || []).map((t) => {
					const terjual = (peserta || []).filter((p) => p.nama_tiket === t.nama_kategori).length;
					return {
						...t,
						terjual
					};
				});
			} catch (err) {
				showToast("Gagal memuat tiket: " + err.message, "error");
			} finally {
				isLoadingDaftarTiket.value = false;
			}
		};
		watch(selectedEvent, () => {
			if (selectedEvent.value) muatTiketStatistik();
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			if (unref(selectedEvent)) {
				_push(`<div id="page-event"><div class="page-header"><h2 class="page-title">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:clipboard-list",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` <span>${ssrInterpolate(unref(selectedEvent).nama_event)}</span></h2><button class="btn-outline">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-left",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Kembali</button></div><div class="panel"><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "16px"
				})}"><h4 style="${ssrRenderStyle({
					"font-weight": "600",
					"color": "#0a1929",
					"margin": "0"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit-3",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Informasi Acara</h4><button class="btn-icon" style="${ssrRenderStyle({
					"background": "#f0f4fa",
					"font-size": "13px",
					"padding": "6px 12px"
				})}" title="Edit Informasi">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Edit</button></div><div class="row"><div class="col" style="${ssrRenderStyle({ "flex": "0 0 150px" })}"><div class="poster-lg" style="${ssrRenderStyle(unref(selectedEvent).poster_url ? {
					backgroundImage: `url('${fixPosterUrl(unref(selectedEvent).poster_url)}')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					height: "150px",
					borderRadius: "12px"
				} : {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#f8fafc",
					height: "150px",
					borderRadius: "12px",
					border: "1px dashed #cbd5e1"
				})}">`);
				if (!unref(selectedEvent).poster_url) _push(ssrRenderComponent(_component_Icon, {
					name: "lucide:rocket",
					style: {
						"font-size": "48px",
						"color": "#cbd5e1"
					}
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div><div style="${ssrRenderStyle({ "margin-top": "10px" })}">`);
				if (unref(selectedEvent).status !== "archived" && !unref(selectedEvent).is_archived && unref(selectedEvent).status !== "finished") _push(`<span class="status-badge active" style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center"
				})}"><span style="${ssrRenderStyle({
					"display": "inline-block",
					"width": "8px",
					"height": "8px",
					"background": "#1a6a4a",
					"border-radius": "50%",
					"margin-right": "6px",
					"animation": "pulseGlow 1.5s infinite alternate"
				})}"></span> Aktif </span>`);
				else if (unref(selectedEvent).status === "finished") _push(`<span class="status-badge off">Selesai</span>`);
				else _push(`<span class="status-badge archived">Diarsipkan</span>`);
				_push(`</div></div><div class="col"><div class="row"><div class="col"><label class="form-label">Nama Acara</label><div class="value">${ssrInterpolate(unref(selectedEvent).nama_event)}</div></div><div class="col"><label class="form-label">Slug</label><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "12px",
					"align-items": "center",
					"font-weight": "400"
				})}"><span>${ssrInterpolate(unref(selectedEvent).slug)}</span><button class="btn-outline btn-sm">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:clipboard-list",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Copy</button></div></div></div><div class="row"><div class="col"><label class="form-label">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:calendar",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Tanggal</label><div class="value" style="${ssrRenderStyle({ "font-weight": "400" })}">${ssrInterpolate(unref(formatDate)(unref(selectedEvent).tanggal_mulai))}</div></div><div class="col"><label class="form-label">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:map-pin",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Lokasi</label><div class="value" style="${ssrRenderStyle({ "font-weight": "400" })}">${ssrInterpolate(unref(selectedEvent).lokasi || "Online / Belum diset")}</div></div></div><div><label class="form-label">Deskripsi</label><div class="desc">${ssrInterpolate(unref(selectedEvent).deskripsi || "-")}</div></div></div></div></div><div class="panel"><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "10px"
				})}"><h4 style="${ssrRenderStyle({
					"font-weight": "600",
					"color": "#0a1929",
					"margin": "0"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Kategori Tiket</h4><button class="btn-icon" style="${ssrRenderStyle({
					"background": "#f0f4fa",
					"font-size": "13px",
					"padding": "6px 12px"
				})}" title="Edit Tiket">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Edit</button></div><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Harga</th><th>Kuota</th><th>Terjual</th><th>Sisa</th><th>Aksi</th></tr></thead><tbody>`);
				if (isLoadingDaftarTiket.value) {
					_push(`<tr><td colspan="6" style="${ssrRenderStyle({
						"text-align": "center",
						"color": "#8a9aa8"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:hourglass",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(` Memuat data tiket...</td></tr>`);
				} else if (daftarTiket.value.length === 0) _push(`<tr><td colspan="6" style="${ssrRenderStyle({
					"text-align": "center",
					"color": "#8a9aa8"
				})}">Belum ada tiket.</td></tr>`);
				else _push(`<!---->`);
				_push(`<!--[-->`);
				ssrRenderList(daftarTiket.value, (t) => {
					_push(`<tr><td>${ssrInterpolate(t.nama_kategori)}</td><td>${ssrInterpolate(formatRupiah(t.harga))}</td><td>${ssrInterpolate(t.kuota_maksimal)}</td><td>${ssrInterpolate(t.terjual)}</td><td>${ssrInterpolate(t.kuota_maksimal - t.terjual)}</td><td><button class="btn-icon" title="Edit Tiket">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:edit",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(`</button></td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></div><div class="panel"><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "10px"
				})}"><h4 style="${ssrRenderStyle({
					"font-weight": "600",
					"color": "#0a1929",
					"margin": "0"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:users",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Statistik Peserta</h4><button class="btn-icon" style="${ssrRenderStyle({
					"background": "#f0f4fa",
					"font-size": "13px",
					"padding": "6px 12px"
				})}" title="Lihat Peserta">Lihat `);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-right",
					style: { "margin-left": "4px" }
				}, null, _parent));
				_push(`</button></div><div class="stats-grid" style="${ssrRenderStyle({ "margin": "0" })}"><div class="stat-card"><div class="label">Total</div><div class="value">${ssrInterpolate(unref(totalPeserta))}</div></div><div class="stat-card"><div class="label">Lunas</div><div class="value">${ssrInterpolate(unref(totalLunas))}</div></div><div class="stat-card"><div class="label">Pending</div><div class="value">${ssrInterpolate(unref(totalPending))}</div></div><div class="stat-card"><div class="label">Hadir</div><div class="value">${ssrInterpolate(unref(totalHadir))} <span style="${ssrRenderStyle({
					"font-size": "14px",
					"font-weight": "normal",
					"color": "#8a9aa8"
				})}">(${ssrInterpolate(unref(persenHadir))}%)</span></div></div></div></div><div class="panel flex" style="${ssrRenderStyle({
					"justify-content": "space-between",
					"align-items": "flex-start"
				})}"><div style="${ssrRenderStyle({
					"flex": "1",
					"padding-right": "20px"
				})}"><label class="form-label" style="${ssrRenderStyle({ "margin-bottom": "10px" })}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:link",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Link Publik</label><div style="${ssrRenderStyle({
					"display": "flex",
					"flex-direction": "column",
					"gap": "8px"
				})}"><div style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"border": "1px solid #cbd5e1",
					"border-radius": "6px",
					"overflow": "hidden",
					"background": "white"
				})}"><div style="${ssrRenderStyle({
					"width": "120px",
					"padding": "6px 12px",
					"font-size": "11px",
					"font-weight": "600",
					"color": "#475569",
					"background": "#f8fafc",
					"border-right": "1px solid #cbd5e1",
					"white-space": "nowrap"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Pendaftaran </div><input type="text" readonly${ssrRenderAttr("value", `${baseUrl.value}/${unref(selectedEvent).slug}`)} style="${ssrRenderStyle({
					"flex": "1",
					"padding": "6px 10px",
					"border": "none",
					"font-size": "12px",
					"color": "#0f172a",
					"outline": "none",
					"font-family": "monospace"
				})}"><div style="${ssrRenderStyle({
					"display": "flex",
					"border-left": "1px solid #cbd5e1",
					"background": "#f8fafc"
				})}"><button class="btn-icon" style="${ssrRenderStyle({
					"padding": "6px 12px",
					"border": "none",
					"border-radius": "0",
					"border-right": "1px solid #cbd5e1"
				})}" title="Salin">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:copy",
					style: { "font-size": "13px" }
				}, null, _parent));
				_push(`</button><button class="btn-icon" style="${ssrRenderStyle({
					"padding": "6px 12px",
					"border": "none",
					"border-radius": "0",
					"border-right": "1px solid #cbd5e1"
				})}" title="Kirim via WhatsApp">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:send",
					style: {
						"font-size": "13px",
						"color": "#16a34a"
					}
				}, null, _parent));
				_push(`</button><a${ssrRenderAttr("href", `${baseUrl.value}/${unref(selectedEvent).slug}`)} target="_blank" class="btn-icon" style="${ssrRenderStyle({
					"padding": "6px 12px",
					"border": "none",
					"border-radius": "0",
					"color": "#3b82f6",
					"display": "flex",
					"align-items": "center"
				})}" title="Buka di tab baru">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:external-link",
					style: { "font-size": "13px" }
				}, null, _parent));
				_push(`</a></div></div>`);
				if (unref(selectedEvent).settings?.is_qr_active !== false) {
					_push(`<div style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"border": "1px solid #cbd5e1",
						"border-radius": "6px",
						"overflow": "hidden",
						"background": "white"
					})}"><div style="${ssrRenderStyle({
						"width": "120px",
						"padding": "6px 12px",
						"font-size": "11px",
						"font-weight": "600",
						"color": "#475569",
						"background": "#f8fafc",
						"border-right": "1px solid #cbd5e1",
						"white-space": "nowrap"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:scan-line",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(` Kamera Scanner </div><input type="text" readonly${ssrRenderAttr("value", `${baseUrl.value}/scanner/${unref(selectedEvent).slug}`)} style="${ssrRenderStyle({
						"flex": "1",
						"padding": "6px 10px",
						"border": "none",
						"font-size": "12px",
						"color": "#0f172a",
						"outline": "none",
						"font-family": "monospace"
					})}"><div style="${ssrRenderStyle({
						"display": "flex",
						"border-left": "1px solid #cbd5e1",
						"background": "#f8fafc"
					})}"><button class="btn-icon" style="${ssrRenderStyle({
						"padding": "6px 12px",
						"border": "none",
						"border-radius": "0",
						"border-right": "1px solid #cbd5e1"
					})}" title="Salin">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:copy",
						style: { "font-size": "13px" }
					}, null, _parent));
					_push(`</button><button class="btn-icon" style="${ssrRenderStyle({
						"padding": "6px 12px",
						"border": "none",
						"border-radius": "0",
						"border-right": "1px solid #cbd5e1"
					})}" title="Kirim via WhatsApp">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:send",
						style: {
							"font-size": "13px",
							"color": "#16a34a"
						}
					}, null, _parent));
					_push(`</button><a${ssrRenderAttr("href", `${baseUrl.value}/scanner/${unref(selectedEvent).slug}`)} target="_blank" class="btn-icon" style="${ssrRenderStyle({
						"padding": "6px 12px",
						"border": "none",
						"border-radius": "0",
						"color": "#3b82f6",
						"display": "flex",
						"align-items": "center"
					})}" title="Buka di tab baru">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:external-link",
						style: { "font-size": "13px" }
					}, null, _parent));
					_push(`</a></div></div>`);
				} else _push(`<!---->`);
				if (unref(selectedEvent).settings?.is_online_absen_active) {
					_push(`<div style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"border": "1px solid #cbd5e1",
						"border-radius": "6px",
						"overflow": "hidden",
						"background": "white"
					})}"><div style="${ssrRenderStyle({
						"width": "120px",
						"padding": "6px 12px",
						"font-size": "11px",
						"font-weight": "600",
						"color": "#475569",
						"background": "#f8fafc",
						"border-right": "1px solid #cbd5e1",
						"white-space": "nowrap"
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:monitor-play",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(` Absen Online </div><input type="text" readonly${ssrRenderAttr("value", `${baseUrl.value}/absen/${unref(selectedEvent).slug}`)} style="${ssrRenderStyle({
						"flex": "1",
						"padding": "6px 10px",
						"border": "none",
						"font-size": "12px",
						"color": "#0f172a",
						"outline": "none",
						"font-family": "monospace"
					})}"><div style="${ssrRenderStyle({
						"display": "flex",
						"border-left": "1px solid #cbd5e1",
						"background": "#f8fafc"
					})}"><button class="btn-icon" style="${ssrRenderStyle({
						"padding": "6px 12px",
						"border": "none",
						"border-radius": "0",
						"border-right": "1px solid #cbd5e1"
					})}" title="Salin">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:copy",
						style: { "font-size": "13px" }
					}, null, _parent));
					_push(`</button><button class="btn-icon" style="${ssrRenderStyle({
						"padding": "6px 12px",
						"border": "none",
						"border-radius": "0",
						"border-right": "1px solid #cbd5e1"
					})}" title="Kirim via WhatsApp">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:send",
						style: {
							"font-size": "13px",
							"color": "#16a34a"
						}
					}, null, _parent));
					_push(`</button><a${ssrRenderAttr("href", `${baseUrl.value}/absen/${unref(selectedEvent).slug}`)} target="_blank" class="btn-icon" style="${ssrRenderStyle({
						"padding": "6px 12px",
						"border": "none",
						"border-radius": "0",
						"color": "#3b82f6",
						"display": "flex",
						"align-items": "center"
					})}" title="Buka di tab baru">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:external-link",
						style: { "font-size": "13px" }
					}, null, _parent));
					_push(`</a></div></div>`);
				} else _push(`<!---->`);
				_push(`</div></div><div class="flex" style="${ssrRenderStyle({
					"flex-direction": "column",
					"gap": "10px",
					"align-items": "flex-end"
				})}"><button class="btn-primary">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Edit Event</button><button class="${ssrRenderClass([{ "danger": !isArchived.value }, "btn-outline"])}">`);
				if (isArchived.value) {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:archive-restore",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(` Batal Arsip <!--]-->`);
				} else {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:archive",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(` Arsipkan <!--]-->`);
				}
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/event/[slug]/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-DnRD8xZx.mjs.map
