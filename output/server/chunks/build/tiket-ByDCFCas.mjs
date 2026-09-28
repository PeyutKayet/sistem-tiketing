import { t as components_default } from './components-CJE4y65R.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { u as useAdmin } from './useAdmin-C8ifkcan.mjs';
import { ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
			is_gratis: false,
			kuota: "",
			is_unlimited: false,
			is_hidden: false,
			is_active: true,
			buka: "",
			tutup: ""
		});
		const formEdit = ref({
			id: null,
			nama: "",
			harga: "",
			is_gratis: false,
			kuota: "",
			is_unlimited: false,
			is_hidden: false,
			is_active: true,
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
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-7c912186>`);
			if (unref(selectedEvent)) {
				_push(`<div id="page-tiket" data-v-7c912186><div class="page-header" data-v-7c912186><h2 class="page-title" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Tiket <span data-v-7c912186>${ssrInterpolate(unref(selectedEvent).nama_event)}</span></h2><button class="btn-outline" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-left",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Kembali</button></div><div class="panel" data-v-7c912186><h4 style="${ssrRenderStyle({
					"margin-bottom": "12px",
					"font-weight": "600",
					"color": "#0a1929"
				})}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit-3",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Tambah Tiket Baru</h4><div class="row mb-3" data-v-7c912186><div class="col" data-v-7c912186><label class="form-label" data-v-7c912186>Nama Tiket</label><input type="text"${ssrRenderAttr("value", formBaru.value.nama)} placeholder="VIP" class="form-control" data-v-7c912186></div><div class="col" data-v-7c912186><label class="form-label" style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center"
				})}" data-v-7c912186><span data-v-7c912186>Harga</span><label style="${ssrRenderStyle({
					"font-size": "11px",
					"cursor": "pointer",
					"font-weight": "normal",
					"margin": "0"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formBaru.value.is_gratis) ? ssrLooseContain(formBaru.value.is_gratis, null) : formBaru.value.is_gratis) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-7c912186> Gratis</label></label>`);
				if (!formBaru.value.is_gratis) _push(`<div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center"
				})}" data-v-7c912186><span style="${ssrRenderStyle({
					"position": "absolute",
					"left": "14px",
					"color": "#8a9aa8",
					"font-weight": "600"
				})}" data-v-7c912186>Rp</span><input type="text"${ssrRenderAttr("value", formBaru.value.harga)} placeholder="0" class="form-control" style="${ssrRenderStyle({ "padding-left": "42px" })}" data-v-7c912186></div>`);
				else _push(`<div class="form-control" style="${ssrRenderStyle({
					"background": "#f8fafc",
					"color": "#10b981",
					"font-weight": "600",
					"text-align": "center"
				})}" data-v-7c912186>Gratis</div>`);
				_push(`</div><div class="col" data-v-7c912186><label class="form-label" style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center"
				})}" data-v-7c912186><span data-v-7c912186>Kuota</span><label style="${ssrRenderStyle({
					"font-size": "11px",
					"cursor": "pointer",
					"font-weight": "normal",
					"margin": "0"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formBaru.value.is_unlimited) ? ssrLooseContain(formBaru.value.is_unlimited, null) : formBaru.value.is_unlimited) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-7c912186> Unlimited</label></label>`);
				if (!formBaru.value.is_unlimited) _push(`<input type="number"${ssrRenderAttr("value", formBaru.value.kuota)} placeholder="50" class="form-control" data-v-7c912186>`);
				else _push(`<div class="form-control" style="${ssrRenderStyle({
					"background": "#f8fafc",
					"color": "#8a9aa8",
					"text-align": "center",
					"font-style": "italic"
				})}" data-v-7c912186>Tidak Terbatas</div>`);
				_push(`</div></div><div class="row" data-v-7c912186><div class="col" data-v-7c912186><label class="form-label" data-v-7c912186>Buka</label><div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"cursor": "pointer"
				})}" data-v-7c912186>`);
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
				})}" data-v-7c912186>`);
				if (!formBaru.value.buka) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-7c912186>Pilih waktu buka...</span>`);
				else _push(`<span style="${ssrRenderStyle({
					"color": "#0f172a",
					"font-weight": "500"
				})}" data-v-7c912186>${ssrInterpolate(formatDateTimeKustom(formBaru.value.buka))}</span>`);
				_push(`</div><input type="datetime-local"${ssrRenderAttr("value", formBaru.value.buka)} style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"width": "100%",
					"height": "100%",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "3"
				})}" data-v-7c912186></div></div><div class="col" data-v-7c912186><label class="form-label" data-v-7c912186>Tutup</label><div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"cursor": "pointer"
				})}" data-v-7c912186>`);
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
				})}" data-v-7c912186>`);
				if (!formBaru.value.tutup) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-7c912186>Pilih waktu tutup...</span>`);
				else _push(`<span style="${ssrRenderStyle({
					"color": "#0f172a",
					"font-weight": "500"
				})}" data-v-7c912186>${ssrInterpolate(formatDateTimeKustom(formBaru.value.tutup))}</span>`);
				_push(`</div><input type="datetime-local"${ssrRenderAttr("value", formBaru.value.tutup)} style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"width": "100%",
					"height": "100%",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "3"
				})}" data-v-7c912186></div></div></div><div class="row" style="${ssrRenderStyle({ "margin-top": "12px" })}" data-v-7c912186><div class="col" style="${ssrRenderStyle({
					"display": "flex",
					"flex-direction": "column",
					"gap": "8px"
				})}" data-v-7c912186><label style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "8px",
					"font-size": "13px",
					"cursor": "pointer",
					"font-weight": "600",
					"color": "#4a5a6e"
				})}" data-v-7c912186><div class="switch-admin" style="${ssrRenderStyle({
					"margin": "0",
					"width": "34px"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formBaru.value.is_hidden) ? ssrLooseContain(formBaru.value.is_hidden, null) : formBaru.value.is_hidden) ? " checked" : ""} data-v-7c912186><span class="slider-admin round-admin" data-v-7c912186></span></div> Tiket Privat (Hanya via link) </label><label style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "8px",
					"font-size": "13px",
					"cursor": "pointer",
					"font-weight": "600",
					"color": "#4a5a6e"
				})}" data-v-7c912186><div class="switch-admin" style="${ssrRenderStyle({
					"margin": "0",
					"width": "34px"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formBaru.value.is_active) ? ssrLooseContain(formBaru.value.is_active, null) : formBaru.value.is_active) ? " checked" : ""} data-v-7c912186><span class="slider-admin round-admin" data-v-7c912186></span></div> ${ssrInterpolate(formBaru.value.is_active !== false ? "Aktifkan Tiket" : "Nonaktifkan Tiket")}</label></div><div class="col" style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "flex-end",
					"justify-content": "flex-end",
					"gap": "8px"
				})}" data-v-7c912186><button class="btn-primary"${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "10px 22px" })}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:save",
					style: {
						"margin-right": "4px",
						"font-size": "16px"
					}
				}, null, _parent));
				_push(` Simpan</button><button class="btn-outline" style="${ssrRenderStyle({ "padding": "10px 22px" })}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:rotate-ccw",
					style: {
						"margin-right": "4px",
						"font-size": "16px"
					}
				}, null, _parent));
				_push(` Reset</button></div></div></div><div class="panel" data-v-7c912186><h4 style="${ssrRenderStyle({
					"margin-bottom": "10px",
					"font-weight": "600",
					"color": "#0a1929"
				})}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:clipboard-list",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Daftar Tiket</h4><div class="table-wrap" data-v-7c912186><table data-v-7c912186><thead data-v-7c912186><tr data-v-7c912186><th data-v-7c912186>Nama</th><th data-v-7c912186>Harga</th><th data-v-7c912186>Kuota</th><th data-v-7c912186>Sisa</th><th data-v-7c912186>Terjual</th><th data-v-7c912186>Aksi</th></tr></thead><tbody data-v-7c912186>`);
				if (isLoadingTiket.value) {
					_push(`<tr data-v-7c912186><td colspan="6" style="${ssrRenderStyle({
						"text-align": "center",
						"color": "#8a9aa8"
					})}" data-v-7c912186>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:hourglass",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(` Memuat data tiket...</td></tr>`);
				} else if (daftarTiket.value.length === 0) _push(`<tr data-v-7c912186><td colspan="6" style="${ssrRenderStyle({
					"text-align": "center",
					"color": "#8a9aa8"
				})}" data-v-7c912186>Belum ada tiket.</td></tr>`);
				else _push(`<!---->`);
				_push(`<!--[-->`);
				ssrRenderList(daftarTiket.value, (t) => {
					_push(`<tr data-v-7c912186><td data-v-7c912186><div style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "6px"
					})}" data-v-7c912186><span style="${ssrRenderStyle({ opacity: t.is_active === false ? .5 : 1 })}" data-v-7c912186>${ssrInterpolate(t.nama_kategori)}</span>`);
					if (t.is_active === false) _push(`<span style="${ssrRenderStyle({
						"background": "#fee2e2",
						"color": "#ef4444",
						"font-size": "10px",
						"padding": "2px 6px",
						"border-radius": "4px",
						"font-weight": "600"
					})}" data-v-7c912186>Nonaktif</span>`);
					else _push(`<!---->`);
					if (t.is_hidden) {
						_push(`<span style="${ssrRenderStyle({
							"background": "#f1f5f9",
							"color": "#64748b",
							"font-size": "10px",
							"padding": "2px 6px",
							"border-radius": "4px",
							"font-weight": "600"
						})}" data-v-7c912186>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:eye-off",
							style: {
								"font-size": "10px",
								"margin-right": "2px"
							}
						}, null, _parent));
						_push(` Privat</span>`);
					} else _push(`<!---->`);
					_push(`</div></td><td data-v-7c912186>${ssrInterpolate(formatRupiah(t.harga))}</td><td data-v-7c912186>`);
					if (t.kuota_maksimal == 0) _push(`<span style="${ssrRenderStyle({
						"color": "#8a9aa8",
						"font-style": "italic"
					})}" data-v-7c912186>~</span>`);
					else _push(`<span data-v-7c912186>${ssrInterpolate(t.kuota_maksimal)}</span>`);
					_push(`</td><td data-v-7c912186>`);
					if (t.kuota_maksimal == 0) _push(`<span style="${ssrRenderStyle({
						"color": "#8a9aa8",
						"font-style": "italic"
					})}" data-v-7c912186>Tidak Terbatas</span>`);
					else _push(`<span data-v-7c912186>${ssrInterpolate(t.kuota_maksimal - t.terjual)}</span>`);
					_push(`</td><td data-v-7c912186>${ssrInterpolate(t.terjual)}</td><td style="${ssrRenderStyle({
						"display": "flex",
						"gap": "8px",
						"align-items": "center"
					})}" data-v-7c912186><label class="switch-admin"${ssrRenderAttr("title", t.is_active !== false ? "Nonaktifkan Tiket" : "Aktifkan Tiket")} data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(t.is_active !== false) ? " checked" : ""} data-v-7c912186><span class="slider-admin round-admin" data-v-7c912186></span></label><div style="${ssrRenderStyle({
						"width": "1px",
						"height": "20px",
						"background": "#e2e8f0",
						"margin": "0 2px"
					})}" data-v-7c912186></div>`);
					if (t.is_hidden) {
						_push(`<button class="btn-icon" title="Copy Link Privat" style="${ssrRenderStyle({ "color": "var(--primary)" })}" data-v-7c912186>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:link",
							style: { "margin-right": "4px" }
						}, null, _parent));
						_push(`</button>`);
					} else _push(`<!---->`);
					_push(`<button class="btn-icon" title="Edit" data-v-7c912186>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:edit",
						style: { "margin-right": "4px" }
					}, null, _parent));
					_push(`</button>`);
					if (t.terjual === 0) {
						_push(`<button class="btn-icon danger" title="Hapus" data-v-7c912186>`);
						_push(ssrRenderComponent(_component_Icon, { name: "lucide:trash-2" }, null, _parent));
						_push(`</button>`);
					} else {
						_push(`<button class="btn-icon" title="Tiket yang sudah terjual tidak bisa dihapus" style="${ssrRenderStyle({
							"opacity": "0.3",
							"cursor": "not-allowed"
						})}" data-v-7c912186>`);
						_push(ssrRenderComponent(_component_Icon, { name: "lucide:trash-2" }, null, _parent));
						_push(`</button>`);
					}
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></div><div class="panel" data-v-7c912186><h4 style="${ssrRenderStyle({
					"margin-bottom": "10px",
					"font-weight": "600",
					"color": "#0a1929"
				})}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:bar-chart-2",
					style: {
						"margin-right": "6px",
						"color": "#2563EB"
					}
				}, null, _parent));
				_push(` Statistik Tiket</h4><div class="stats-grid" style="${ssrRenderStyle({ "margin": "0" })}" data-v-7c912186><div class="stat-card" data-v-7c912186><div class="label" data-v-7c912186>Total Tiket</div><div class="value" data-v-7c912186>${ssrInterpolate(totalKapasitas.value)}</div></div><div class="stat-card" data-v-7c912186><div class="label" data-v-7c912186>Terjual</div><div class="value" data-v-7c912186>${ssrInterpolate(totalTerjual.value)}</div></div><div class="stat-card" data-v-7c912186><div class="label" data-v-7c912186>Pendapatan</div><div class="value" data-v-7c912186>${ssrInterpolate(formatRupiah(totalPendapatan.value))}</div></div></div></div><div class="${ssrRenderClass([{ open: showEditPopup.value }, "wizard-overlay"])}" data-v-7c912186><div class="wizard" style="${ssrRenderStyle({
					"max-width": "540px",
					"padding": "28px 32px",
					"height": "auto"
				})}" data-v-7c912186><button class="close" data-v-7c912186>✖</button><h3 style="${ssrRenderStyle({
					"margin-bottom": "16px",
					"font-weight": "600",
					"color": "#0a1929"
				})}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Edit Tiket</h3><label class="form-label" data-v-7c912186>Nama Tiket</label><input type="text"${ssrRenderAttr("value", formEdit.value.nama)} class="form-control" style="${ssrRenderStyle({ "margin-bottom": "10px" })}" data-v-7c912186><label class="form-label" style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center"
				})}" data-v-7c912186><span data-v-7c912186>Harga</span><label style="${ssrRenderStyle({
					"font-size": "11px",
					"cursor": "pointer",
					"font-weight": "normal",
					"margin": "0"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formEdit.value.is_gratis) ? ssrLooseContain(formEdit.value.is_gratis, null) : formEdit.value.is_gratis) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-7c912186> Gratis</label></label>`);
				if (!formEdit.value.is_gratis) _push(`<div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"margin-bottom": "10px"
				})}" data-v-7c912186><span style="${ssrRenderStyle({
					"position": "absolute",
					"left": "14px",
					"color": "#8a9aa8",
					"font-weight": "600"
				})}" data-v-7c912186>Rp</span><input type="text"${ssrRenderAttr("value", formEdit.value.harga)} placeholder="0" class="form-control" style="${ssrRenderStyle({ "padding-left": "42px" })}" data-v-7c912186></div>`);
				else _push(`<div class="form-control" style="${ssrRenderStyle({
					"background": "#f8fafc",
					"color": "#10b981",
					"font-weight": "600",
					"text-align": "center",
					"margin-bottom": "10px"
				})}" data-v-7c912186>Gratis</div>`);
				_push(`<label class="form-label" style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center"
				})}" data-v-7c912186><span data-v-7c912186>Kuota</span><label style="${ssrRenderStyle({
					"font-size": "11px",
					"cursor": "pointer",
					"font-weight": "normal",
					"margin": "0"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formEdit.value.is_unlimited) ? ssrLooseContain(formEdit.value.is_unlimited, null) : formEdit.value.is_unlimited) ? " checked" : ""} style="${ssrRenderStyle({ "margin": "0 4px 0 0" })}" data-v-7c912186> Unlimited</label></label>`);
				if (!formEdit.value.is_unlimited) _push(`<input type="number"${ssrRenderAttr("value", formEdit.value.kuota)} class="form-control" style="${ssrRenderStyle({ "margin-bottom": "10px" })}" data-v-7c912186>`);
				else _push(`<div class="form-control" style="${ssrRenderStyle({
					"background": "#f8fafc",
					"color": "#8a9aa8",
					"text-align": "center",
					"font-style": "italic",
					"margin-bottom": "10px"
				})}" data-v-7c912186>Tidak Terbatas</div>`);
				_push(`<div class="row" data-v-7c912186><div class="col" data-v-7c912186><label class="form-label" data-v-7c912186>Buka</label><div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"cursor": "pointer"
				})}" data-v-7c912186>`);
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
				})}" data-v-7c912186>`);
				if (!formEdit.value.buka) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-7c912186>Pilih waktu buka...</span>`);
				else _push(`<span style="${ssrRenderStyle({
					"color": "#0f172a",
					"font-weight": "500"
				})}" data-v-7c912186>${ssrInterpolate(formatDateTimeKustom(formEdit.value.buka))}</span>`);
				_push(`</div><input type="datetime-local"${ssrRenderAttr("value", formEdit.value.buka)} style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"width": "100%",
					"height": "100%",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "3"
				})}" data-v-7c912186></div></div><div class="col" data-v-7c912186><label class="form-label" data-v-7c912186>Tutup</label><div style="${ssrRenderStyle({
					"position": "relative",
					"display": "flex",
					"align-items": "center",
					"cursor": "pointer"
				})}" data-v-7c912186>`);
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
				})}" data-v-7c912186>`);
				if (!formEdit.value.tutup) _push(`<span style="${ssrRenderStyle({ "color": "#8a9aa8" })}" data-v-7c912186>Pilih waktu tutup...</span>`);
				else _push(`<span style="${ssrRenderStyle({
					"color": "#0f172a",
					"font-weight": "500"
				})}" data-v-7c912186>${ssrInterpolate(formatDateTimeKustom(formEdit.value.tutup))}</span>`);
				_push(`</div><input type="datetime-local"${ssrRenderAttr("value", formEdit.value.tutup)} style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"width": "100%",
					"height": "100%",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "3"
				})}" data-v-7c912186></div></div></div><label style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "8px",
					"font-size": "13px",
					"cursor": "pointer",
					"font-weight": "600",
					"color": "#4a5a6e",
					"margin-top": "16px"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formEdit.value.is_hidden) ? ssrLooseContain(formEdit.value.is_hidden, null) : formEdit.value.is_hidden) ? " checked" : ""} style="${ssrRenderStyle({
					"width": "16px",
					"height": "16px"
				})}" data-v-7c912186> Tiket Privat (Hanya via link) </label><label style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "8px",
					"font-size": "13px",
					"cursor": "pointer",
					"font-weight": "600",
					"color": "#4a5a6e",
					"margin-top": "8px"
				})}" data-v-7c912186><div class="switch-admin" style="${ssrRenderStyle({
					"margin": "0",
					"width": "34px"
				})}" data-v-7c912186><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formEdit.value.is_active) ? ssrLooseContain(formEdit.value.is_active, null) : formEdit.value.is_active) ? " checked" : ""} data-v-7c912186><span class="slider-admin round-admin" data-v-7c912186></span></div> ${ssrInterpolate(formEdit.value.is_active !== false ? "Aktifkan Tiket" : "Nonaktifkan Tiket")}</label><div class="flex" style="${ssrRenderStyle({ "margin-top": "16px" })}" data-v-7c912186><button class="btn-primary"${ssrIncludeBooleanAttr(isSavingEdit.value) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "10px 32px" })}" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:save",
					style: {
						"margin-right": "4px",
						"font-size": "16px"
					}
				}, null, _parent));
				_push(` Simpan</button><button class="btn-outline" data-v-7c912186>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:x",
					style: {
						"margin-right": "4px",
						"font-size": "16px"
					}
				}, null, _parent));
				_push(` Batal</button></div></div></div></div>`);
			} else if (unref(isLoading)) _push(`<div class="loader-container" style="${ssrRenderStyle({
				"height": "100%",
				"display": "flex",
				"align-items": "center",
				"justify-content": "center"
			})}" data-v-7c912186><div style="${ssrRenderStyle({ "text-align": "center" })}" data-v-7c912186><div class="spinner" style="${ssrRenderStyle({ "margin": "0 auto 12px auto" })}" data-v-7c912186></div><div style="${ssrRenderStyle({
				"font-weight": "500",
				"font-size": "13px",
				"color": "#8a9aa8"
			})}" data-v-7c912186>Memuat data event...</div></div></div>`);
			else {
				_push(`<div style="${ssrRenderStyle({
					"padding": "60px 20px",
					"text-align": "center",
					"color": "#8a9aa8"
				})}" data-v-7c912186>`);
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
				})}" data-v-7c912186>Event Tidak Ditemukan</div> Event yang Anda cari mungkin sudah dihapus atau URL tidak valid.<br data-v-7c912186><br data-v-7c912186><button class="btn-primary" data-v-7c912186>Kembali ke Beranda</button></div>`);
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
var tiket_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-7c912186"]]);

export { tiket_default as default };
//# sourceMappingURL=tiket-ByDCFCas.mjs.map
