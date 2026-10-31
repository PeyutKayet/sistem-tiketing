import { t as components_default } from './components-D4ypgbct.mjs';
import { u as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { u as useAdmin } from './useAdmin-6B6OnmW9.mjs';
import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
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

//#region app/pages/admin/dompet.vue
var _sfc_main = {
	__name: "dompet",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		useSupabaseUser();
		useRouter();
		useAdmin();
		const loading = ref(true);
		const formatDateTime = (dateStr) => {
			if (!dateStr) return "-";
			return new Date(dateStr).toLocaleString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		};
		const isSubmitting = ref(false);
		const organizerProfile = ref({});
		const totalPemasukanCair = ref(0);
		const totalPemasukanTertunda = ref(0);
		const riwayatPenarikan = ref([]);
		const nominalTarik = ref("");
		const isErrorShake = ref(false);
		const showPasswordModal = ref(false);
		const withdrawPassword = ref("");
		const isVerifyingPwd = ref(false);
		const nominalTarikDisplay = computed({
			get: () => {
				if (!nominalTarik.value) return "";
				return Number(nominalTarik.value).toLocaleString("id-ID");
			},
			set: (val) => {
				const numericVal = val.replace(/\D/g, "");
				nominalTarik.value = numericVal;
			}
		});
		const hasBankInfo = computed(() => {
			return organizerProfile.value.bank_nama && organizerProfile.value.bank_rekening && organizerProfile.value.bank_atas_nama;
		});
		const totalSudahDitarik = computed(() => {
			return riwayatPenarikan.value.filter((r) => r.status !== "DITOLAK").reduce((sum, r) => sum + Number(r.nominal) + Number(r.biaya_admin || 0), 0);
		});
		const saldoTersedia = computed(() => {
			return Math.max(0, totalPemasukanCair.value - totalSudahDitarik.value);
		});
		const saldoTertunda = computed(() => {
			return totalPemasukanTertunda.value;
		});
		const formatRupiah = (angka) => Number(angka).toLocaleString("id-ID");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "page-dompet" }, _attrs))} data-v-799bb408><div class="page-header" data-v-799bb408><h2 class="page-title" data-v-799bb408>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:wallet",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Dompet &amp; Pendapatan</h2><button class="btn-outline" data-v-799bb408>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:arrow-left",
				style: { "margin-right": "4px" }
			}, null, _parent));
			_push(` Kembali ke Dasbor</button></div>`);
			if (!hasBankInfo.value && !loading.value) {
				_push(`<div class="alert-box mb-18" data-v-799bb408><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "12px",
					"align-items": "flex-start"
				})}" data-v-799bb408>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:alert-triangle",
					style: {
						"color": "#b45309",
						"font-size": "24px",
						"margin-top": "2px"
					}
				}, null, _parent));
				_push(`<div data-v-799bb408><h4 style="${ssrRenderStyle({
					"margin": "0 0 4px 0",
					"color": "#b45309",
					"font-size": "15px"
				})}" data-v-799bb408>Informasi Rekening Belum Lengkap!</h4><p style="${ssrRenderStyle({
					"margin": "0",
					"font-size": "13px",
					"color": "#b45309",
					"line-height": "1.5"
				})}" data-v-799bb408>Kamu harus mengisi data Rekening Bank terlebih dahulu sebelum bisa melakukan penarikan dana.</p><button class="btn-primary" style="${ssrRenderStyle({
					"margin-top": "12px",
					"padding": "6px 16px",
					"font-size": "13px"
				})}" data-v-799bb408>Lengkapi Rekening Sekarang</button></div></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="eo-benefit-card mb-18" data-v-799bb408><div class="eo-benefit-content" data-v-799bb408><div class="eo-benefit-icon" data-v-799bb408>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:shield-check",
				style: {
					"font-size": "26px",
					"color": "#16a34a"
				}
			}, null, _parent));
			_push(`</div><div data-v-799bb408><h4 class="eo-benefit-title" data-v-799bb408>Pendapatan Transparan &amp; Tanpa Biaya Tersembunyi</h4><p class="eo-benefit-desc" data-v-799bb408> Di Tyket.id, hasil penjualan tiket dicairkan sesuai harga tiket yang Anda tentukan tanpa biaya siluman. Biaya transaksi digital ditanggung oleh pembeli tiket saat checkout. </p></div></div></div><div class="saldo-cards" data-v-799bb408><div class="card-saldo primary" data-v-799bb408><div class="saldo-header" data-v-799bb408><span data-v-799bb408>Saldo Tersedia</span>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:check-circle" }, null, _parent));
			_push(`</div><div class="saldo-amount" data-v-799bb408>Rp ${ssrInterpolate(formatRupiah(saldoTersedia.value))}</div><p class="saldo-desc" data-v-799bb408>Uang yang sudah cair dan siap kamu tarik kapan saja.</p><div class="withdraw-section" data-v-799bb408><label data-v-799bb408>Tarik ke Rekening:</label><div class="${ssrRenderClass([{ "shake-error border-danger": isErrorShake.value }, "input-group"])}" data-v-799bb408><span class="currency" data-v-799bb408>Rp</span><input type="text"${ssrRenderAttr("value", nominalTarikDisplay.value)} placeholder="Min. 50.000" class="input-withdraw"${ssrIncludeBooleanAttr(!hasBankInfo.value || isSubmitting.value) ? " disabled" : ""} data-v-799bb408><button class="btn-withdraw"${ssrIncludeBooleanAttr(!hasBankInfo.value || isSubmitting.value || nominalTarik.value < 5e4) ? " disabled" : ""} data-v-799bb408>`);
			if (isSubmitting.value) _push(ssrRenderComponent(_component_Icon, {
				name: "lucide:loader-2",
				class: "spin"
			}, null, _parent));
			else _push(`<!--[-->Tarik Dana<!--]-->`);
			_push(`</button></div>`);
			if (isErrorShake.value) _push(`<div class="error-msg" data-v-799bb408>Ups! Saldo tidak mencukupi untuk nominal penarikan + biaya bank.</div>`);
			else _push(`<!---->`);
			_push(`<div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#64748b",
				"margin-top": "6px",
				"display": "flex",
				"justify-content": "space-between",
				"flex-wrap": "wrap",
				"gap": "4px"
			})}" data-v-799bb408><span data-v-799bb408>Minimal: Rp 50.000</span><span data-v-799bb408>Biaya kliring bank: Rp 6.500</span></div>`);
			if (Number(nominalTarik.value) >= 5e4) _push(`<div style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "#0369a1",
				"margin-top": "4px",
				"font-weight": "500"
			})}" data-v-799bb408> Total saldo terpotong: Rp ${ssrInterpolate(formatRupiah(Number(nominalTarik.value) + 6500))}</div>`);
			else _push(`<!---->`);
			if (hasBankInfo.value) {
				_push(`<div class="bank-info-mini" data-v-799bb408>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:landmark",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` ${ssrInterpolate(organizerProfile.value.bank_nama)} - ${ssrInterpolate(organizerProfile.value.bank_rekening)} (${ssrInterpolate(organizerProfile.value.bank_atas_nama)}) </div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="card-saldo warning" data-v-799bb408><div class="saldo-header" data-v-799bb408><span data-v-799bb408>Saldo Tertunda</span>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:clock" }, null, _parent));
			_push(`</div><div class="saldo-amount" data-v-799bb408>Rp ${ssrInterpolate(formatRupiah(saldoTertunda.value))}</div><p class="saldo-desc" data-v-799bb408>Uang dari pembeli yang belum diselesaikan (Settlement) oleh Sistem Pusat. Sedang dalam proses pengecekan.</p></div></div><div class="panel" style="${ssrRenderStyle({ "margin-top": "24px" })}" data-v-799bb408><h4 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929"
			})}" data-v-799bb408>`);
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
			})}" data-v-799bb408>Memuat data...</div>`);
			else if (riwayatPenarikan.value.length === 0) _push(`<div style="${ssrRenderStyle({
				"text-align": "center",
				"padding": "40px 20px",
				"color": "#8a9aa8",
				"background": "#f8fafc",
				"border-radius": "12px",
				"border": "1px dashed #cbd5e1"
			})}" data-v-799bb408> Belum ada riwayat penarikan dana. </div>`);
			else {
				_push(`<div class="table-responsive" data-v-799bb408><table class="table" style="${ssrRenderStyle({
					"width": "100%",
					"text-align": "left",
					"border-collapse": "collapse"
				})}" data-v-799bb408><thead data-v-799bb408><tr style="${ssrRenderStyle({
					"background": "#f8fafc",
					"border-bottom": "1px solid #e2e8f0"
				})}" data-v-799bb408><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-799bb408>Tanggal Transaksi</th><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-799bb408>Nominal</th><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-799bb408>Rekening Tujuan</th><th style="${ssrRenderStyle({
					"padding": "12px",
					"font-size": "13px",
					"color": "#64748b",
					"font-weight": "600"
				})}" data-v-799bb408>Status</th></tr></thead><tbody data-v-799bb408><!--[-->`);
				ssrRenderList(riwayatPenarikan.value, (r) => {
					_push(`<tr style="${ssrRenderStyle({ "border-bottom": "1px solid #e2e8f0" })}" data-v-799bb408><td style="${ssrRenderStyle({
						"padding": "12px",
						"font-size": "13px",
						"color": "#475569",
						"min-width": "140px"
					})}" data-v-799bb408><div style="${ssrRenderStyle({ "margin-bottom": "4px" })}" data-v-799bb408><span style="${ssrRenderStyle({
						"font-size": "10px",
						"font-weight": "700",
						"color": "#94a3b8",
						"text-transform": "uppercase",
						"letter-spacing": "0.5px",
						"display": "block"
					})}" data-v-799bb408>Diajukan:</span><span style="${ssrRenderStyle({
						"color": "#334155",
						"font-weight": "500"
					})}" data-v-799bb408>${ssrInterpolate(formatDateTime(r.created_at))}</span></div>`);
					if (r.status !== "REQUEST") _push(`<div data-v-799bb408><span style="${ssrRenderStyle({
						"font-size": "10px",
						"font-weight": "700",
						"color": "#94a3b8",
						"text-transform": "uppercase",
						"letter-spacing": "0.5px",
						"display": "block",
						"margin-top": "6px"
					})}" data-v-799bb408>Selesai/Direspon:</span><span style="${ssrRenderStyle([{
						"color": "#059669",
						"font-weight": "500"
					}, r.status === "DITOLAK" ? "color:#e11d48;" : ""])}" data-v-799bb408>${ssrInterpolate(formatDateTime(r.updated_at))}</span></div>`);
					else _push(`<!---->`);
					_push(`</td><td style="${ssrRenderStyle({
						"padding": "12px",
						"font-size": "14px",
						"font-weight": "700",
						"color": "#0f172a"
					})}" data-v-799bb408>Rp ${ssrInterpolate(formatRupiah(r.nominal))}</td><td style="${ssrRenderStyle({ "padding": "12px" })}" data-v-799bb408><div style="${ssrRenderStyle({
						"font-size": "13px",
						"font-weight": "600",
						"color": "#0f172a"
					})}" data-v-799bb408>${ssrInterpolate(r.bank_tujuan)} - ${ssrInterpolate(r.rekening_tujuan)}</div><div style="${ssrRenderStyle({
						"font-size": "12px",
						"color": "#64748b"
					})}" data-v-799bb408>a.n ${ssrInterpolate(r.atas_nama)}</div></td><td style="${ssrRenderStyle({ "padding": "12px" })}" data-v-799bb408>`);
					if (r.status === "REQUEST") _push(`<span class="badge badge-warning" data-v-799bb408>Diproses</span>`);
					else if (r.status === "SELESAI") _push(`<span class="badge badge-success" data-v-799bb408>Selesai</span>`);
					else if (r.status === "DITOLAK") _push(`<span class="badge badge-danger" data-v-799bb408>Ditolak</span>`);
					else _push(`<span class="badge" data-v-799bb408>${ssrInterpolate(r.status)}</span>`);
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			_push(`</div>`);
			if (showPasswordModal.value) _push(`<div class="confirm-overlay open" style="${ssrRenderStyle({
				"display": "flex",
				"z-index": "9999"
			})}" data-v-799bb408><div class="confirm-box" data-v-799bb408><div class="icon" data-v-799bb408>🔒</div><h3 data-v-799bb408>Verifikasi Keamanan</h3><p style="${ssrRenderStyle({ "margin-bottom": "6px" })}" data-v-799bb408>Masukkan password akun Anda untuk menarik dana sebesar <strong data-v-799bb408>Rp ${ssrInterpolate(formatRupiah(nominalTarik.value))}</strong></p><p style="${ssrRenderStyle({
				"font-size": "12px",
				"color": "#64748b",
				"margin-top": "0",
				"margin-bottom": "18px"
			})}" data-v-799bb408>Total saldo terpotong: <strong data-v-799bb408>Rp ${ssrInterpolate(formatRupiah(Number(nominalTarik.value) + 6500))}</strong> (termasuk biaya transfer bank Rp 6.500)</p><input type="password"${ssrRenderAttr("value", withdrawPassword.value)} class="form-control" style="${ssrRenderStyle({
				"margin-bottom": "24px",
				"text-align": "center",
				"font-size": "18px",
				"letter-spacing": "2px"
			})}" placeholder="Password Akun" data-v-799bb408><div class="btn-row" style="${ssrRenderStyle({
				"display": "flex",
				"gap": "12px",
				"justify-content": "center"
			})}" data-v-799bb408><button class="btn-outline" style="${ssrRenderStyle({ "flex": "1" })}" data-v-799bb408>Batal</button><button class="btn-primary" style="${ssrRenderStyle({
				"flex": "1",
				"background": "#1a6a4a"
			})}"${ssrIncludeBooleanAttr(isVerifyingPwd.value) ? " disabled" : ""} data-v-799bb408>${ssrInterpolate(isVerifyingPwd.value ? "Mengecek..." : "Konfirmasi")}</button></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dompet.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dompet_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-799bb408"]]);

export { dompet_default as default };
//# sourceMappingURL=dompet-CBfJ6ltM.mjs.map
