import { t as components_default } from './components-CJE4y65R.mjs';
import { u as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BNBp86SD.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import './asyncData-ClgIs2MV.mjs';
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
import '@supabase/ssr';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/pages/admin/dompet.vue
var _sfc_main = {
	__name: "dompet",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		useSupabaseUser();
		useRouter();
		const loading = ref(true);
		const isSubmitting = ref(false);
		const organizerProfile = ref({});
		const totalPemasukanCair = ref(0);
		const totalPemasukanTertunda = ref(0);
		const riwayatPenarikan = ref([]);
		const nominalTarik = ref("");
		const isErrorShake = ref(false);
		const hasBankInfo = computed(() => {
			return organizerProfile.value.bank_nama && organizerProfile.value.bank_rekening && organizerProfile.value.bank_atas_nama;
		});
		const totalSudahDitarik = computed(() => {
			return riwayatPenarikan.value.filter((r) => r.status !== "DITOLAK").reduce((sum, r) => sum + Number(r.nominal), 0);
		});
		const saldoTersedia = computed(() => {
			return Math.max(0, totalPemasukanCair.value - totalSudahDitarik.value);
		});
		const saldoTertunda = computed(() => {
			return totalPemasukanTertunda.value;
		});
		const formatRupiah = (angka) => Number(angka).toLocaleString("id-ID");
		const formatDate = (dateString) => {
			return new Date(dateString).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "page-dompet" }, _attrs))} data-v-0d8299fe><div class="page-header" data-v-0d8299fe><h2 class="page-title" data-v-0d8299fe>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:wallet",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Dompet &amp; Pendapatan</h2><button class="btn-outline" data-v-0d8299fe>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:arrow-left",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Kembali ke Dasbor</button></div>`);
			if (!hasBankInfo.value && !loading.value) {
				_push(`<div class="alert-box mb-18" data-v-0d8299fe><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "12px",
					"align-items": "flex-start"
				})}" data-v-0d8299fe>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:alert-triangle",
					style: {
						"color": "#b45309",
						"font-size": "24px",
						"margin-top": "2px"
					}
				}, null, _parent));
				_push(`<div data-v-0d8299fe><h4 style="${ssrRenderStyle({
					"margin": "0 0 4px 0",
					"color": "#b45309",
					"font-size": "15px"
				})}" data-v-0d8299fe>Informasi Rekening Belum Lengkap!</h4><p style="${ssrRenderStyle({
					"margin": "0",
					"font-size": "13px",
					"color": "#b45309",
					"line-height": "1.5"
				})}" data-v-0d8299fe>Kamu harus mengisi data Rekening Bank terlebih dahulu sebelum bisa melakukan penarikan dana.</p><button class="btn-primary" style="${ssrRenderStyle({
					"margin-top": "12px",
					"padding": "6px 16px",
					"font-size": "13px"
				})}" data-v-0d8299fe>Lengkapi Rekening Sekarang</button></div></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="saldo-cards" data-v-0d8299fe><div class="card-saldo primary" data-v-0d8299fe><div class="saldo-header" data-v-0d8299fe><span data-v-0d8299fe>Saldo Tersedia</span>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:check-circle" }, null, _parent));
			_push(`</div><div class="saldo-amount" data-v-0d8299fe>Rp ${ssrInterpolate(formatRupiah(saldoTersedia.value))}</div><p class="saldo-desc" data-v-0d8299fe>Uang yang sudah cair dan siap kamu tarik kapan saja.</p><div class="withdraw-section" data-v-0d8299fe><label data-v-0d8299fe>Tarik ke Rekening:</label><div class="${ssrRenderClass([{ "shake-error border-danger": isErrorShake.value }, "input-group"])}" data-v-0d8299fe><span class="currency" data-v-0d8299fe>Rp</span><input type="number"${ssrRenderAttr("value", nominalTarik.value)} placeholder="0" class="input-withdraw"${ssrIncludeBooleanAttr(!hasBankInfo.value || isSubmitting.value) ? " disabled" : ""} data-v-0d8299fe><button class="btn-withdraw"${ssrIncludeBooleanAttr(!hasBankInfo.value || isSubmitting.value || nominalTarik.value <= 0) ? " disabled" : ""} data-v-0d8299fe>`);
			if (isSubmitting.value) _push(ssrRenderComponent(_component_Icon, {
				name: "lucide:loader-2",
				class: "spin"
			}, null, _parent));
			else _push(`<!--[-->Tarik Dana<!--]-->`);
			_push(`</button></div>`);
			if (isErrorShake.value) _push(`<div class="error-msg" data-v-0d8299fe>Ups! Nominal melebihi Saldo Tersedia.</div>`);
			else _push(`<!---->`);
			if (hasBankInfo.value) {
				_push(`<div class="bank-info-mini" data-v-0d8299fe>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:landmark",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` ${ssrInterpolate(organizerProfile.value.bank_nama)} - ${ssrInterpolate(organizerProfile.value.bank_rekening)} (${ssrInterpolate(organizerProfile.value.bank_atas_nama)}) </div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="card-saldo warning" data-v-0d8299fe><div class="saldo-header" data-v-0d8299fe><span data-v-0d8299fe>Saldo Tertunda</span>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:clock" }, null, _parent));
			_push(`</div><div class="saldo-amount" data-v-0d8299fe>Rp ${ssrInterpolate(formatRupiah(saldoTertunda.value))}</div><p class="saldo-desc" data-v-0d8299fe>Uang dari pembeli yang belum diselesaikan (Settlement) oleh Sistem Pusat. Sedang dalam proses pengecekan.</p></div></div><div class="panel" style="${ssrRenderStyle({ "margin-top": "24px" })}" data-v-0d8299fe><h4 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-0d8299fe>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:history",
				style: {
					"margin-right": "6px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(` Riwayat Penarikan Dana</h4>`);
			if (loading.value) _push(`<div style="${ssrRenderStyle({
				"text-align": "center",
				"padding": "20px",
				"color": "#8a9aa8"
			})}" data-v-0d8299fe>Memuat data...</div>`);
			else if (riwayatPenarikan.value.length === 0) _push(`<div style="${ssrRenderStyle({
				"text-align": "center",
				"padding": "40px 20px",
				"color": "#8a9aa8",
				"background": "#f8fafc",
				"border-radius": "12px",
				"border": "1px dashed #cbd5e1"
			})}" data-v-0d8299fe> Belum ada riwayat penarikan dana. </div>`);
			else {
				_push(`<div class="table-responsive" data-v-0d8299fe><table class="table" style="${ssrRenderStyle({
					"width": "100%",
					"text-align": "left",
					"border-collapse": "collapse"
				})}" data-v-0d8299fe><thead data-v-0d8299fe><tr style="${ssrRenderStyle({
					"background": "#f8fafc",
					"border-bottom": "1px solid #e2e8f0"
				})}" data-v-0d8299fe><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-0d8299fe>Tanggal</th><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-0d8299fe>Nominal</th><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-0d8299fe>Rekening Tujuan</th><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-0d8299fe>Status</th></tr></thead><tbody data-v-0d8299fe><!--[-->`);
				ssrRenderList(riwayatPenarikan.value, (r) => {
					_push(`<tr style="${ssrRenderStyle({ "border-bottom": "1px solid #e2e8f0" })}" data-v-0d8299fe><td style="${ssrRenderStyle({
						"padding": "12px",
						"font-size": "13px",
						"color": "#475569"
					})}" data-v-0d8299fe>${ssrInterpolate(formatDate(r.created_at))}</td><td style="${ssrRenderStyle({
						"padding": "12px",
						"font-size": "14px",
						"font-weight": "700",
						"color": "#0f172a"
					})}" data-v-0d8299fe>Rp ${ssrInterpolate(formatRupiah(r.nominal))}</td><td style="${ssrRenderStyle({ "padding": "12px" })}" data-v-0d8299fe><div style="${ssrRenderStyle({
						"font-size": "13px",
						"font-weight": "600",
						"color": "#0f172a"
					})}" data-v-0d8299fe>${ssrInterpolate(r.bank_tujuan)} - ${ssrInterpolate(r.rekening_tujuan)}</div><div style="${ssrRenderStyle({
						"font-size": "12px",
						"color": "#64748b"
					})}" data-v-0d8299fe>a.n ${ssrInterpolate(r.atas_nama)}</div></td><td style="${ssrRenderStyle({ "padding": "12px" })}" data-v-0d8299fe>`);
					if (r.status === "REQUEST") _push(`<span class="badge badge-warning" data-v-0d8299fe>Diproses</span>`);
					else if (r.status === "SELESAI") _push(`<span class="badge badge-success" data-v-0d8299fe>Selesai</span>`);
					else if (r.status === "DITOLAK") _push(`<span class="badge badge-danger" data-v-0d8299fe>Ditolak</span>`);
					else _push(`<span class="badge" data-v-0d8299fe>${ssrInterpolate(r.status)}</span>`);
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dompet.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dompet_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-0d8299fe"]]);

export { dompet_default as default };
//# sourceMappingURL=dompet-C_jlZJmU.mjs.map
