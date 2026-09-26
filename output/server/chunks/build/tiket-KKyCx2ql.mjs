import { t as components_default } from './components-C44pW9aw.mjs';
import { u as useAdmin } from './useAdmin-C8FerkPj.mjs';
import { ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/admin/event/[slug]/tiket.vue
var _sfc_main = {
	__name: "tiket",
	__ssrInlineRender: true,
	setup(__props) {
		const { isLoading, selectedEvent, supabase, showToast} = useAdmin();
		const daftarTiket = ref([]);
		const isLoadingTiket = ref(false);
		const isSaving = ref(false);
		const isSavingEdit = ref(false);
		const showEditPopup = ref(false);
		const formBaru = ref({
			nama: "",
			harga: "",
			kuota: "",
			buka: "",
			tutup: ""
		});
		const formEdit = ref({
			id: null,
			nama: "",
			harga: "",
			kuota: "",
			buka: "",
			tutup: ""
		});
		const totalKapasitas = computed(() => daftarTiket.value.reduce((acc, t) => acc + (parseInt(t.kuota_maksimal) || 0), 0));
		const totalTerjual = computed(() => daftarTiket.value.reduce((acc, t) => acc + (t.terjual || 0), 0));
		const totalPendapatan = computed(() => daftarTiket.value.reduce((acc, t) => acc + (t.terjual || 0) * (parseInt(t.harga) || 0), 0));
		const formatRupiah = (angka) => {
			if (angka === 0) return "GRATIS";
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(angka);
		};
		const muatDaftarTiket = async () => {
			if (!selectedEvent.value) return;
			isLoadingTiket.value = true;
			try {
				const { data: tiketData, error } = await supabase.from("kategori_tiket").select("*").eq("event_id", selectedEvent.value.id).order("created_at", { ascending: true });
				if (error) throw error;
				const { data: pesertaData } = await supabase.from("peserta").select("nama_tiket").eq("event_id", selectedEvent.value.id).eq("status_bayar", "paid");
				daftarTiket.value = (tiketData || []).map((t) => {
					const terjual = (pesertaData || []).filter((p) => p.nama_tiket === t.nama_kategori).length;
					return {
						...t,
						terjual
					};
				});
			} catch (err) {
				showToast("Gagal memuat tiket: " + err.message, "error");
			} finally {
				isLoadingTiket.value = false;
			}
		};
		watch(selectedEvent, () => {
			if (selectedEvent.value) muatDaftarTiket();
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			if (unref(selectedEvent)) {
				_push(`<div id="page-tiket"><div class="page-header"><h2 class="page-title">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Tiket <span>${ssrInterpolate(unref(selectedEvent).nama_event)}</span></h2><button class="btn-outline">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-left",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Kembali</button></div><div class="panel"><h4 style="${ssrRenderStyle({
					"margin-bottom": "12px",
					"font-weight": "600",
					"color": "#0a1929"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit-3",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Tambah Tiket Baru</h4><div class="row mb-3"><div class="col"><label class="form-label">Nama Tiket</label><input type="text"${ssrRenderAttr("value", formBaru.value.nama)} placeholder="VIP" class="form-control"></div><div class="col"><label class="form-label">Harga</label><div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center"
				})}"><span style="${ssrRenderStyle({
					"position": "absolute",
					"left": "14px",
					"color": "#8a9aa8",
					"font-weight": "600"
				})}">Rp</span><input type="text"${ssrRenderAttr("value", formBaru.value.harga)} placeholder="0" class="form-control" style="${ssrRenderStyle({ "padding-left": "42px" })}"></div></div><div class="col"><label class="form-label">Kuota</label><input type="number"${ssrRenderAttr("value", formBaru.value.kuota)} placeholder="50" class="form-control"></div></div><div class="row"><div class="col"><label class="form-label">Buka</label><input type="datetime-local"${ssrRenderAttr("value", formBaru.value.buka)} class="form-control"></div><div class="col"><label class="form-label">Tutup</label><input type="datetime-local"${ssrRenderAttr("value", formBaru.value.tutup)} class="form-control"></div><div class="col" style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "flex-end",
					"gap": "8px"
				})}"><button class="btn-primary"${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "10px 22px" })}">💾 Simpan</button><button class="btn-outline" style="${ssrRenderStyle({ "padding": "10px 22px" })}">🔄 Reset</button></div></div></div><div class="panel"><h4 style="${ssrRenderStyle({
					"margin-bottom": "10px",
					"font-weight": "600",
					"color": "#0a1929"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:clipboard-list",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Daftar Tiket</h4><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Harga</th><th>Kuota</th><th>Sisa</th><th>Terjual</th><th>Aksi</th></tr></thead><tbody>`);
				if (isLoadingTiket.value) {
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
					_push(`<tr><td>${ssrInterpolate(t.nama_kategori)}</td><td>${ssrInterpolate(formatRupiah(t.harga))}</td><td>${ssrInterpolate(t.kuota_maksimal)}</td><td>${ssrInterpolate(t.kuota_maksimal - t.terjual)}</td><td>${ssrInterpolate(t.terjual)}</td><td><button class="btn-icon" title="Edit">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:edit",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(`</button><button class="btn-icon danger" title="Hapus">🗑️</button></td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></div><div class="panel"><h4 style="${ssrRenderStyle({
					"margin-bottom": "10px",
					"font-weight": "600",
					"color": "#0a1929"
				})}">📊 Statistik Tiket</h4><div class="stats-grid" style="${ssrRenderStyle({ "margin": "0" })}"><div class="stat-card"><div class="label">Total Tiket</div><div class="value">${ssrInterpolate(totalKapasitas.value)}</div></div><div class="stat-card"><div class="label">Terjual</div><div class="value">${ssrInterpolate(totalTerjual.value)}</div></div><div class="stat-card"><div class="label">Pendapatan</div><div class="value">${ssrInterpolate(formatRupiah(totalPendapatan.value))}</div></div></div></div><div class="${ssrRenderClass([{ open: showEditPopup.value }, "wizard-overlay"])}"><div class="wizard" style="${ssrRenderStyle({
					"max-width": "540px",
					"padding": "28px 32px",
					"height": "auto"
				})}"><button class="close">✖</button><h3 style="${ssrRenderStyle({
					"margin-bottom": "16px",
					"font-weight": "600",
					"color": "#0a1929"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Edit Tiket</h3><label class="form-label">Nama Tiket</label><input type="text"${ssrRenderAttr("value", formEdit.value.nama)} class="form-control" style="${ssrRenderStyle({ "margin-bottom": "10px" })}"><label class="form-label">Harga</label><div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"margin-bottom": "10px"
				})}"><span style="${ssrRenderStyle({
					"position": "absolute",
					"left": "14px",
					"color": "#8a9aa8",
					"font-weight": "600"
				})}">Rp</span><input type="text"${ssrRenderAttr("value", formEdit.value.harga)} placeholder="0" class="form-control" style="${ssrRenderStyle({ "padding-left": "42px" })}"></div><label class="form-label">Kuota</label><input type="number"${ssrRenderAttr("value", formEdit.value.kuota)} class="form-control" style="${ssrRenderStyle({ "margin-bottom": "10px" })}"><div class="row"><div class="col"><label class="form-label">Buka</label><input type="datetime-local"${ssrRenderAttr("value", formEdit.value.buka)} class="form-control"></div><div class="col"><label class="form-label">Tutup</label><input type="datetime-local"${ssrRenderAttr("value", formEdit.value.tutup)} class="form-control"></div></div><div class="flex" style="${ssrRenderStyle({ "margin-top": "16px" })}"><button class="btn-primary"${ssrIncludeBooleanAttr(isSavingEdit.value) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "10px 32px" })}">💾 Simpan</button><button class="btn-outline">❌ Batal</button></div></div></div></div>`);
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/event/[slug]/tiket.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tiket-KKyCx2ql.mjs.map
