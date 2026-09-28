import { u as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BNBp86SD.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { N as NuxtLink } from './nuxt-link-DROHZVen.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrRenderStyle } from 'vue/server-renderer';
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

//#region app/pages/s1u2p3e4r5/index.vue
var MASTER_EMAIL = "master@eventhub.com";
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		useSupabaseUser();
		useRouter();
		const loadingAuth = ref(true);
		const isAuthorized = ref(false);
		const masterEmail = ref(MASTER_EMAIL);
		const activeTab = ref("settlement");
		const loadingData = ref(false);
		const isProcessing = ref(false);
		const pendingTransactions = ref([]);
		const selectedPeserta = ref([]);
		const withdrawalRequests = ref([]);
		const isAllSelected = computed(() => pendingTransactions.value.length > 0 && selectedPeserta.value.length === pendingTransactions.value.length);
		const totalSelectedNominal = computed(() => pendingTransactions.value.filter((t) => selectedPeserta.value.includes(t.id)).reduce((sum, t) => sum + (t.kategori_tiket?.harga || 0), 0));
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
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "master-layout" }, _attrs))} data-v-256477d3>`);
			if (loadingAuth.value) _push(`<div class="loader-container" data-v-256477d3><p class="pulse-text" data-v-256477d3>Memeriksa Kredensial Super Admin...</p></div>`);
			else if (!isAuthorized.value) {
				_push(`<div class="auth-error" data-v-256477d3><div class="error-box" data-v-256477d3><h1 data-v-256477d3>Akses Ditolak</h1><p data-v-256477d3>Kamu tidak memiliki izin untuk mengakses Ruang Master.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/",
					class: "btn-primary"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Kembali ke Beranda`);
						else return [createTextVNode("Kembali ke Beranda")];
					}),
					_: 1
				}, _parent));
				_push(`</div></div>`);
			} else {
				_push(`<div class="master-container" data-v-256477d3><header class="master-header" data-v-256477d3><div class="header-titles" data-v-256477d3><h1 data-v-256477d3>Ruang Master (Super Admin)</h1><p data-v-256477d3>Pusat Kendali Pencairan Dana (Settlement &amp; Withdrawal)</p></div><div class="header-badge" data-v-256477d3><span class="badge-success" data-v-256477d3>Authorized: ${ssrInterpolate(masterEmail.value)}</span></div></header><div class="tabs" data-v-256477d3><button class="${ssrRenderClass(["tab-btn", activeTab.value === "settlement" ? "active" : ""])}" data-v-256477d3> ⏱️ Dana Tertunda (Settlement) </button><button class="${ssrRenderClass(["tab-btn", activeTab.value === "withdrawal" ? "active" : ""])}" data-v-256477d3> 💸 Antrean Penarikan (Withdrawals) </button></div>`);
				if (activeTab.value === "settlement") {
					_push(`<section class="master-card" data-v-256477d3><div class="card-header flex-between" data-v-256477d3><div data-v-256477d3><h2 data-v-256477d3>Antrean Dana Mengendap (PENDING)</h2><p class="subtitle" data-v-256477d3>Tiket lunas yang uangnya belum dicairkan ke Saldo EO.</p></div><button${ssrIncludeBooleanAttr(selectedPeserta.value.length === 0 || isProcessing.value) ? " disabled" : ""} class="btn-action" data-v-256477d3> Cairkan ${ssrInterpolate(selectedPeserta.value.length)} Transaksi Terpilih </button></div>`);
					if (loadingData.value) _push(`<div class="empty-state" data-v-256477d3>Memuat data transaksi...</div>`);
					else if (pendingTransactions.value.length === 0) _push(`<div class="empty-state box-dashed" data-v-256477d3><p data-v-256477d3>Bagus! Tidak ada dana yang nyangkut/pending saat ini.</p></div>`);
					else {
						_push(`<div class="table-container" data-v-256477d3><table class="master-table" data-v-256477d3><thead data-v-256477d3><tr data-v-256477d3><th width="40" data-v-256477d3><input type="checkbox"${ssrIncludeBooleanAttr(isAllSelected.value) ? " checked" : ""} class="cb-custom" data-v-256477d3></th><th data-v-256477d3>TANGGAL</th><th data-v-256477d3>NAMA EVENT</th><th data-v-256477d3>PESERTA &amp; TIKET</th><th class="text-right" data-v-256477d3>NOMINAL (Rp)</th></tr></thead><tbody data-v-256477d3><!--[-->`);
						ssrRenderList(pendingTransactions.value, (t) => {
							_push(`<tr data-v-256477d3><td data-v-256477d3><input type="checkbox"${ssrRenderAttr("value", t.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedPeserta.value) ? ssrLooseContain(selectedPeserta.value, t.id) : selectedPeserta.value) ? " checked" : ""} class="cb-custom" data-v-256477d3></td><td class="text-sm text-muted" data-v-256477d3>${ssrInterpolate(formatDate(t.created_at))}</td><td class="font-bold" data-v-256477d3>${ssrInterpolate(t.event?.nama_event || "-")}</td><td data-v-256477d3><div class="font-bold" data-v-256477d3>${ssrInterpolate(t.nama_lengkap)}</div><div class="text-xs text-muted" data-v-256477d3>${ssrInterpolate(t.nama_tiket)}</div></td><td class="text-right font-bold text-green" data-v-256477d3> Rp ${ssrInterpolate(formatRupiah(t.kategori_tiket?.harga || 0))}</td></tr>`);
						});
						_push(`<!--]--></tbody><tfoot data-v-256477d3><tr data-v-256477d3><td colspan="4" class="text-right font-bold" data-v-256477d3>Total Nominal Terpilih:</td><td class="text-right font-black text-blue" data-v-256477d3>Rp ${ssrInterpolate(formatRupiah(totalSelectedNominal.value))}</td></tr></tfoot></table></div>`);
					}
					_push(`</section>`);
				} else _push(`<!---->`);
				if (activeTab.value === "withdrawal") {
					_push(`<section class="master-card" data-v-256477d3><h2 data-v-256477d3>Antrean Penarikan (Withdrawals)</h2><p class="subtitle" style="${ssrRenderStyle({ "margin-bottom": "24px" })}" data-v-256477d3>Daftar EO yang merequest pencairan dana ke rekening mereka.</p>`);
					if (loadingData.value) _push(`<div class="empty-state" data-v-256477d3>Memuat data penarikan...</div>`);
					else if (withdrawalRequests.value.length === 0) _push(`<div class="empty-state box-dashed" data-v-256477d3><p data-v-256477d3>Bagus! Tidak ada antrean penarikan dana hari ini.</p></div>`);
					else {
						_push(`<div class="withdrawal-list" data-v-256477d3><!--[-->`);
						ssrRenderList(withdrawalRequests.value, (w) => {
							_push(`<div class="withdrawal-item" data-v-256477d3><div class="w-info" data-v-256477d3><div class="w-meta" data-v-256477d3><span class="badge-warning" data-v-256477d3>REQUEST</span><span class="text-muted text-sm" data-v-256477d3>${ssrInterpolate(formatDate(w.created_at))}</span></div><h3 data-v-256477d3>${ssrInterpolate(w.organizer_profile?.nama_organizer || "EO Tidak Dikenal")}</h3><p class="text-sm text-muted" style="${ssrRenderStyle({ "margin-top": "8px" })}" data-v-256477d3>Tujuan Transfer:</p><div class="bank-box" data-v-256477d3><strong data-v-256477d3>${ssrInterpolate(w.bank_tujuan)} - ${ssrInterpolate(w.rekening_tujuan)}</strong><p data-v-256477d3>a.n. ${ssrInterpolate(w.atas_nama)}</p></div></div><div class="w-action text-right" data-v-256477d3><p class="text-sm text-muted" data-v-256477d3>Nominal Pencairan</p><h2 class="text-green amount" data-v-256477d3>Rp ${ssrInterpolate(formatRupiah(w.nominal))}</h2><button${ssrIncludeBooleanAttr(isProcessing.value) ? " disabled" : ""} class="btn-success mt-2" data-v-256477d3> ✅ Tandai Sudah Ditransfer </button></div></div>`);
						});
						_push(`<!--]--></div>`);
					}
					_push(`</section>`);
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/s1u2p3e4r5/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var s1u2p3e4r5_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-256477d3"]]);

export { s1u2p3e4r5_default as default };
//# sourceMappingURL=s1u2p3e4r5-C3fYt10E.mjs.map
