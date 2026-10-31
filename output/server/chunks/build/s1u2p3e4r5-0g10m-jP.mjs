import { u as useSupabaseUser, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, createVNode, openBlock, createBlock, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrRenderStyle } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
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
import '@vue/shared';
import 'pinia';
import 'fnv1a-64';
import 'object-identity';
import '@iconify/vue';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/pages/s1u2p3e4r5/index.vue
var MASTER_EMAIL = "master@tyket.id";
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
		const activeTab = ref("backup");
		const loadingData = ref(false);
		const isProcessing = ref(false);
		const pendingTransactions = ref([]);
		const selectedPeserta = ref([]);
		const withdrawalRequests = ref([]);
		const backupOrders = ref([]);
		const loadingBackup = ref(false);
		const isProcessingOrder = ref(null);
		const activeProofModal = ref(null);
		const gatewaySettings = ref({
			is_emergency_backup: false,
			emergency_message: "",
			updated_by: "",
			updated_at: null
		});
		const isUpdatingGateway = ref(false);
		const isAllSelected = computed(() => pendingTransactions.value.length > 0 && selectedPeserta.value.length === pendingTransactions.value.length);
		const totalSelectedNominal = computed(() => pendingTransactions.value.filter((t) => selectedPeserta.value.includes(t.id)).reduce((sum, t) => sum + (t.kategori_tiket?.harga || 0), 0));
		const formatRupiah = (angka) => Number(angka).toLocaleString("id-ID");
		const formatDate = (dateString) => {
			if (!dateString) return "-";
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "master-layout" }, _attrs))} data-v-a6af1d05>`);
			if (loadingAuth.value) _push(`<div class="loader-container" data-v-a6af1d05><p class="pulse-text" data-v-a6af1d05>Memeriksa Kredensial Super Admin...</p></div>`);
			else if (!isAuthorized.value) {
				_push(`<div class="auth-error" data-v-a6af1d05><div class="error-box" data-v-a6af1d05><h1 data-v-a6af1d05>Akses Ditolak</h1><p data-v-a6af1d05>Kamu tidak memiliki izin untuk mengakses Ruang Master.</p>`);
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
				_push(`<div class="master-container" data-v-a6af1d05><header class="master-header" data-v-a6af1d05><div class="header-titles" data-v-a6af1d05><h1 data-v-a6af1d05>Ruang Master (Super Admin)</h1><p data-v-a6af1d05>Pusat Kendali Pencairan Dana (Settlement &amp; Withdrawal)</p></div><div class="header-badge" data-v-a6af1d05><span class="badge-success" data-v-a6af1d05>Authorized: ${ssrInterpolate(masterEmail.value)}</span></div></header><div class="tabs" data-v-a6af1d05><button class="${ssrRenderClass(["tab-btn", activeTab.value === "backup" ? "active" : ""])}" data-v-a6af1d05> 🛡️ Antrean QRIS Cadangan `);
				if (backupOrders.value.length > 0) _push(`<span class="tab-badge-count" data-v-a6af1d05>${ssrInterpolate(backupOrders.value.length)}</span>`);
				else _push(`<!---->`);
				_push(`</button><button class="${ssrRenderClass(["tab-btn", activeTab.value === "settlement" ? "active" : ""])}" data-v-a6af1d05> ⏱️ Dana Tertunda (Settlement) </button><button class="${ssrRenderClass(["tab-btn", activeTab.value === "withdrawal" ? "active" : ""])}" data-v-a6af1d05> 💸 Antrean Penarikan (Withdrawals) </button><button class="${ssrRenderClass(["tab-btn", activeTab.value === "gateway" ? "active" : ""])}" data-v-a6af1d05><svg class="tab-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a6af1d05><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-a6af1d05></path></svg> Kendali Gateway &amp; Darurat </button></div>`);
				if (activeTab.value === "settlement") {
					_push(`<section class="master-card" data-v-a6af1d05><div class="card-header flex-between" data-v-a6af1d05><div data-v-a6af1d05><h2 data-v-a6af1d05>Antrean Dana Mengendap (PENDING)</h2><p class="subtitle" data-v-a6af1d05>Tiket lunas yang uangnya belum dicairkan ke Saldo EO.</p></div><button${ssrIncludeBooleanAttr(selectedPeserta.value.length === 0 || isProcessing.value) ? " disabled" : ""} class="btn-action" data-v-a6af1d05> Cairkan ${ssrInterpolate(selectedPeserta.value.length)} Transaksi Terpilih </button></div>`);
					if (loadingData.value) _push(`<div class="empty-state" data-v-a6af1d05>Memuat data transaksi...</div>`);
					else if (pendingTransactions.value.length === 0) _push(`<div class="empty-state box-dashed" data-v-a6af1d05><p data-v-a6af1d05>Bagus! Tidak ada dana yang nyangkut/pending saat ini.</p></div>`);
					else {
						_push(`<div class="table-container" data-v-a6af1d05><table class="master-table" data-v-a6af1d05><thead data-v-a6af1d05><tr data-v-a6af1d05><th width="40" data-v-a6af1d05><input type="checkbox"${ssrIncludeBooleanAttr(isAllSelected.value) ? " checked" : ""} class="cb-custom" data-v-a6af1d05></th><th data-v-a6af1d05>TANGGAL</th><th data-v-a6af1d05>NAMA EVENT</th><th data-v-a6af1d05>PESERTA &amp; TIKET</th><th class="text-right" data-v-a6af1d05>NOMINAL (Rp)</th></tr></thead><tbody data-v-a6af1d05><!--[-->`);
						ssrRenderList(pendingTransactions.value, (t) => {
							_push(`<tr data-v-a6af1d05><td data-v-a6af1d05><input type="checkbox"${ssrRenderAttr("value", t.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedPeserta.value) ? ssrLooseContain(selectedPeserta.value, t.id) : selectedPeserta.value) ? " checked" : ""} class="cb-custom" data-v-a6af1d05></td><td class="text-sm text-muted" data-v-a6af1d05>${ssrInterpolate(formatDate(t.created_at))}</td><td class="font-bold" data-v-a6af1d05>${ssrInterpolate(t.event?.nama_event || "-")}</td><td data-v-a6af1d05><div class="font-bold" data-v-a6af1d05>${ssrInterpolate(t.nama_lengkap)}</div><div class="text-xs text-muted" data-v-a6af1d05>${ssrInterpolate(t.nama_tiket)}</div></td><td class="text-right font-bold text-green" data-v-a6af1d05> Rp ${ssrInterpolate(formatRupiah(t.kategori_tiket?.harga || 0))}</td></tr>`);
						});
						_push(`<!--]--></tbody><tfoot data-v-a6af1d05><tr data-v-a6af1d05><td colspan="4" class="text-right font-bold" data-v-a6af1d05>Total Nominal Terpilih:</td><td class="text-right font-black text-blue" data-v-a6af1d05>Rp ${ssrInterpolate(formatRupiah(totalSelectedNominal.value))}</td></tr></tfoot></table></div>`);
					}
					_push(`</section>`);
				} else _push(`<!---->`);
				if (activeTab.value === "withdrawal") {
					_push(`<section class="master-card" data-v-a6af1d05><h2 data-v-a6af1d05>Antrean Penarikan (Withdrawals)</h2><p class="subtitle" style="${ssrRenderStyle({ "margin-bottom": "24px" })}" data-v-a6af1d05>Daftar EO yang merequest pencairan dana ke rekening mereka.</p>`);
					if (loadingData.value) _push(`<div class="empty-state" data-v-a6af1d05>Memuat data penarikan...</div>`);
					else if (withdrawalRequests.value.length === 0) _push(`<div class="empty-state box-dashed" data-v-a6af1d05><p data-v-a6af1d05>Bagus! Tidak ada antrean penarikan dana hari ini.</p></div>`);
					else {
						_push(`<div class="withdrawal-list" data-v-a6af1d05><!--[-->`);
						ssrRenderList(withdrawalRequests.value, (w) => {
							_push(`<div class="withdrawal-item" data-v-a6af1d05><div class="w-info" data-v-a6af1d05><div class="w-meta" data-v-a6af1d05><span class="badge-warning" data-v-a6af1d05>REQUEST</span><span class="text-muted text-sm" data-v-a6af1d05>${ssrInterpolate(formatDate(w.created_at))}</span></div><h3 data-v-a6af1d05>${ssrInterpolate(w.organizer_profile?.nama_organizer || "EO Tidak Dikenal")}</h3><p class="text-sm text-muted" style="${ssrRenderStyle({ "margin-top": "8px" })}" data-v-a6af1d05>Tujuan Transfer:</p><div class="bank-box" data-v-a6af1d05><strong data-v-a6af1d05>${ssrInterpolate(w.bank_tujuan)} - ${ssrInterpolate(w.rekening_tujuan)}</strong><p data-v-a6af1d05>a.n. ${ssrInterpolate(w.atas_nama)}</p></div></div><div class="w-action text-right" data-v-a6af1d05><p class="text-sm text-muted" data-v-a6af1d05>Nominal Pencairan</p><h2 class="text-green amount" data-v-a6af1d05>Rp ${ssrInterpolate(formatRupiah(w.nominal))}</h2><button${ssrIncludeBooleanAttr(isProcessing.value) ? " disabled" : ""} class="btn-success mt-2" data-v-a6af1d05> ✅ Tandai Sudah Ditransfer </button></div></div>`);
						});
						_push(`<!--]--></div>`);
					}
					_push(`</section>`);
				} else _push(`<!---->`);
				if (activeTab.value === "gateway") {
					_push(`<section class="master-card" data-v-a6af1d05><div class="card-header flex-between" data-v-a6af1d05><div data-v-a6af1d05><h2 data-v-a6af1d05>Master Kill-Switch &amp; Gateway Failover</h2><p class="subtitle" data-v-a6af1d05>Pusat kendali darurat jika payment gateway ESPay mengalami gangguan atau pemeliharaan.</p></div><div class="gateway-live-status" data-v-a6af1d05>`);
					if (gatewaySettings.value.is_emergency_backup) _push(`<span class="badge-danger-glow" data-v-a6af1d05><span class="status-dot-red" data-v-a6af1d05></span> MODE DARURAT AKTIF (TRANSFER MANUAL) </span>`);
					else _push(`<span class="badge-success-glow" data-v-a6af1d05><span class="status-dot-green" data-v-a6af1d05></span> GATEWAY NORMAL (ESPAY DIRECT ONLINE) </span>`);
					_push(`</div></div><div class="gateway-control-panel" data-v-a6af1d05><div class="${ssrRenderClass(["gateway-banner", gatewaySettings.value.is_emergency_backup ? "banner-emergency" : "banner-normal"])}" data-v-a6af1d05><div class="banner-icon-box" data-v-a6af1d05>`);
					if (gatewaySettings.value.is_emergency_backup) _push(`<svg class="banner-svg icon-alert" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a6af1d05><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-a6af1d05></path></svg>`);
					else _push(`<svg class="banner-svg icon-shield" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a6af1d05><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-a6af1d05></path></svg>`);
					_push(`</div><div class="banner-info" data-v-a6af1d05><h3 data-v-a6af1d05>${ssrInterpolate(gatewaySettings.value.is_emergency_backup ? "Seluruh Checkout Dialihkan ke Transfer Manual" : "Sistem Pembayaran Otomatis Berjalan Normal")}</h3><p data-v-a6af1d05>${ssrInterpolate(gatewaySettings.value.is_emergency_backup ? "Saat ini semua halaman pendaftaran tiket tidak akan memanggil API ESPay. Peserta akan diminta melakukan transfer manual ke rekening panitia dan mengupload bukti transfer." : "Peserta dapat membayar instan secara langsung menggunakan QRIS atau Virtual Account Mandiri, BRI, dan BNI melalui ESPay Direct API.")}</p></div></div><div class="switch-card" data-v-a6af1d05><div class="switch-row" data-v-a6af1d05><div class="switch-desc" data-v-a6af1d05><h4 data-v-a6af1d05>Aktifkan Failover Darurat (Manual Transfer Backup)</h4><p data-v-a6af1d05>Nyalakan saklar ini HANYA jika server ESPay down, timeout, atau sedang ada maintenance darurat dari pihak bank.</p></div><div class="switch-action" data-v-a6af1d05><label class="toggle-switch" data-v-a6af1d05><input type="checkbox"${ssrIncludeBooleanAttr(gatewaySettings.value.is_emergency_backup) ? " checked" : ""}${ssrIncludeBooleanAttr(isUpdatingGateway.value) ? " disabled" : ""} data-v-a6af1d05><span class="toggle-slider" data-v-a6af1d05></span></label></div></div><div class="emergency-msg-box" data-v-a6af1d05><label class="input-label" data-v-a6af1d05>Pesan Pemberitahuan untuk Peserta (Tampil di Halaman Checkout):</label><textarea rows="2" class="form-textarea-custom" placeholder="Contoh: Sistem pembayaran otomatis sedang dalam pemeliharaan berkala..." data-v-a6af1d05>${ssrInterpolate(gatewaySettings.value.emergency_message)}</textarea><div class="msg-footer" data-v-a6af1d05><span class="text-xs text-muted" data-v-a6af1d05>Terakhir diubah oleh: <strong data-v-a6af1d05>${ssrInterpolate(gatewaySettings.value.updated_by || "-")}</strong> (${ssrInterpolate(gatewaySettings.value.updated_at ? formatDate(gatewaySettings.value.updated_at) : "Belum pernah")})</span><button${ssrIncludeBooleanAttr(isUpdatingGateway.value) ? " disabled" : ""} class="btn-save-msg" data-v-a6af1d05>`);
					if (isUpdatingGateway.value) _push(`<span data-v-a6af1d05>Menyimpan...</span>`);
					else _push(`<span data-v-a6af1d05>Simpan Perubahan Pesan</span>`);
					_push(`</button></div></div></div><div class="simulator-card" data-v-a6af1d05><div class="simulator-card-content" data-v-a6af1d05><div class="simulator-icon-box" data-v-a6af1d05><svg class="simulator-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a6af1d05><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-a6af1d05></path></svg></div><div class="simulator-text" data-v-a6af1d05><h4 data-v-a6af1d05>Simulasi Pembayaran Tiket (Sandbox Tester)</h4><p data-v-a6af1d05>Uji coba alur pembelian tiket asli dari QRIS hingga Virtual Account Espay secara otomatis (tanpa perlu mengisi data) dan simulasikan penerbitan E-Tiket lunas secara instan.</p></div></div><div class="simulator-action" data-v-a6af1d05>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: "/espay-testing",
						class: "btn-open-simulator"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span data-v-a6af1d05${_scopeId}>⚡ Buka Simulator Tiket</span><svg class="btn-arrow-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a6af1d05${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" data-v-a6af1d05${_scopeId}></path></svg>`);
							else return [createVNode("span", null, "⚡ Buka Simulator Tiket"), (openBlock(), createBlock("svg", {
								class: "btn-arrow-svg",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								viewBox: "0 0 24 24"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								d: "M14 5l7 7m0 0l-7 7m7-7H3"
							})]))];
						}),
						_: 1
					}, _parent));
					_push(`</div></div></div></section>`);
				} else _push(`<!---->`);
				if (activeTab.value === "backup") {
					_push(`<section class="master-card" data-v-a6af1d05><div class="card-header flex-between" data-v-a6af1d05><div data-v-a6af1d05><h2 data-v-a6af1d05>Antrean Pembayaran QRIS Cadangan (Tyket.id)</h2><p class="subtitle" data-v-a6af1d05>Pesanan yang masuk lewat sistem cadangan saat gateway bermasalah. Cocokkan nominal + 3 digit kode unik di mutasi rekening Tyket.id.</p></div><button${ssrIncludeBooleanAttr(loadingBackup.value) ? " disabled" : ""} class="btn-refresh-backup" title="Muat Ulang Data Antrean" data-v-a6af1d05>`);
					if (loadingBackup.value) _push(`<span data-v-a6af1d05>Memuat...</span>`);
					else _push(`<span class="btn-refresh-content" data-v-a6af1d05><svg class="tab-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a6af1d05><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-a6af1d05></path></svg> Segarkan Antrean </span>`);
					_push(`</button></div>`);
					if (loadingBackup.value) _push(`<div class="empty-state" data-v-a6af1d05>Memuat antrean transaksi cadangan...</div>`);
					else if (backupOrders.value.length === 0) _push(`<div class="empty-state box-dashed" data-v-a6af1d05><p class="font-bold" data-v-a6af1d05>Bagus! Tidak ada antrean pembayaran cadangan pending.</p><p class="text-sm text-muted mt-2" data-v-a6af1d05>Semua transaksi cadangan sudah terverifikasi atau seluruh transaksi berjalan normal lewat payment gateway.</p></div>`);
					else {
						_push(`<div class="table-container" data-v-a6af1d05><table class="master-table" data-v-a6af1d05><thead data-v-a6af1d05><tr data-v-a6af1d05><th data-v-a6af1d05>WAKTU</th><th data-v-a6af1d05>ORDER ID &amp; EVENT</th><th data-v-a6af1d05>PEMESAN</th><th class="text-right" data-v-a6af1d05>TOTAL TRANSFER</th><th class="text-center" data-v-a6af1d05>BUKTI STRUK</th><th class="text-center" data-v-a6af1d05>AKSI</th></tr></thead><tbody data-v-a6af1d05><!--[-->`);
						ssrRenderList(backupOrders.value, (order) => {
							_push(`<tr data-v-a6af1d05><td class="text-sm text-muted" data-v-a6af1d05>${ssrInterpolate(formatDate(order.created_at))}</td><td data-v-a6af1d05><div class="order-id-badge" data-v-a6af1d05><code data-v-a6af1d05>${ssrInterpolate(order.id)}</code></div><div class="font-bold text-sm mt-1" data-v-a6af1d05>${ssrInterpolate(order.nama_event)}</div><div class="text-xs text-muted" data-v-a6af1d05>${ssrInterpolate(order.ticket_names)} (${ssrInterpolate(order.ticket_count)}x tiket)</div></td><td data-v-a6af1d05><div class="font-bold" data-v-a6af1d05>${ssrInterpolate(order.pembeli_nama)}</div><div class="text-xs text-muted" data-v-a6af1d05>WA: ${ssrInterpolate(order.pembeli_wa)}</div><div class="text-xs text-muted" data-v-a6af1d05>${ssrInterpolate(order.pembeli_email)}</div></td><td class="text-right" data-v-a6af1d05><div class="font-black text-green text-lg" data-v-a6af1d05> Rp ${ssrInterpolate(formatRupiah(order.total_tagihan))}</div>`);
							if (order.kode_unik) _push(`<div class="text-xs text-muted" data-v-a6af1d05> Kode Unik: <strong class="text-orange" data-v-a6af1d05>+${ssrInterpolate(order.kode_unik)}</strong></div>`);
							else _push(`<!---->`);
							_push(`</td><td class="text-center" data-v-a6af1d05>`);
							if (order.bukti_bayar_url) _push(`<div class="proof-thumb-box" data-v-a6af1d05><img${ssrRenderAttr("src", order.bukti_bayar_url)} alt="Struk" class="proof-thumb" data-v-a6af1d05><span class="proof-thumb-label" data-v-a6af1d05>🔍 Lihat Foto</span></div>`);
							else _push(`<div class="text-xs text-muted italic" data-v-a6af1d05> Belum ada bukti </div>`);
							_push(`</td><td class="text-center" data-v-a6af1d05><div class="action-btn-group" data-v-a6af1d05><button${ssrIncludeBooleanAttr(isProcessingOrder.value === order.id) ? " disabled" : ""} class="btn-action-verify" title="Verifikasi pembayaran dan terbitkan e-ticket peserta" data-v-a6af1d05>`);
							if (isProcessingOrder.value === order.id) _push(`<span data-v-a6af1d05>Memproses...</span>`);
							else _push(`<span data-v-a6af1d05>✅ Verifikasi &amp; Terbitkan</span>`);
							_push(`</button><button${ssrIncludeBooleanAttr(isProcessingOrder.value === order.id) ? " disabled" : ""} class="btn-action-reject" title="Tolak pesanan ini" data-v-a6af1d05> ❌ Tolak </button></div></td></tr>`);
						});
						_push(`<!--]--></tbody></table></div>`);
					}
					_push(`</section>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			}
			if (activeProofModal.value) _push(`<div class="modal-backdrop" data-v-a6af1d05><div class="modal-dialog" data-v-a6af1d05><div class="modal-header" data-v-a6af1d05><div data-v-a6af1d05><h3 class="modal-title" data-v-a6af1d05>Bukti Transfer Pembayaran</h3><p class="modal-subtitle" data-v-a6af1d05>Order ID: <code data-v-a6af1d05>${ssrInterpolate(activeProofModal.value.id)}</code> • ${ssrInterpolate(activeProofModal.value.pembeli_nama)}</p></div><button class="btn-close-modal" data-v-a6af1d05>×</button></div><div class="modal-body" data-v-a6af1d05><div class="modal-nominal-bar" data-v-a6af1d05><span data-v-a6af1d05>Nominal Tagihan + Kode Unik:</span><strong class="font-black text-green text-lg" data-v-a6af1d05>Rp ${ssrInterpolate(formatRupiah(activeProofModal.value.total_tagihan))}</strong></div><div class="modal-image-wrapper" data-v-a6af1d05><img${ssrRenderAttr("src", activeProofModal.value.bukti_bayar_url)} alt="Bukti Transfer Penuh" class="modal-full-img" data-v-a6af1d05></div></div><div class="modal-footer" data-v-a6af1d05><a${ssrRenderAttr("href", activeProofModal.value.bukti_bayar_url)} target="_blank" class="btn-open-external" data-v-a6af1d05> Buka Foto Asli di Tab Baru ↗ </a><div class="modal-action-buttons" data-v-a6af1d05><button class="btn-modal-reject" data-v-a6af1d05> Tolak Pesanan </button><button class="btn-modal-verify" data-v-a6af1d05> ✅ Verifikasi &amp; Terbitkan </button></div></div></div></div>`);
			else _push(`<!---->`);
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
var s1u2p3e4r5_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-a6af1d05"]]);

export { s1u2p3e4r5_default as default };
//# sourceMappingURL=s1u2p3e4r5-0g10m-jP.mjs.map
