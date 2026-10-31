import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { j as appDiagnostics } from '../virtual/entry.mjs';
import { ref, computed, watch, useSSRContext } from 'vue';
import { F as publicAssetsURL } from '../nitro/nitro.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';

//#region node_modules/nuxt/dist/app/compat/interval.js
var setInterval = (() => {
	appDiagnostics.NUXT_E1004();
});

//#region \0virtual:public?%2Fqris.webp
var _virtual_public__2Fqris_default = publicAssetsURL("/qris.webp");
//#endregion
//#region app/components/event/CheckoutPayment.vue
var _sfc_main$1 = {
	__name: "EventCheckoutPayment",
	__ssrInlineRender: true,
	props: {
		grandTotal: {
			type: Number,
			required: true
		},
		totalQty: {
			type: Number,
			required: true
		},
		totalPrice: {
			type: Number,
			required: true
		},
		adminFee: {
			type: Number,
			required: true
		},
		kodeUnik: {
			type: Number,
			required: true
		},
		donasiAmount: {
			type: Number,
			default: 0
		},
		buktiBayarPreview: {
			type: String,
			default: ""
		},
		uploadError: {
			type: Boolean,
			default: false
		},
		isSubmitting: {
			type: Boolean,
			default: false
		},
		daftarPeserta: {
			type: Array,
			default: () => []
		},
		isEspayActive: {
			type: Boolean,
			default: false
		},
		espayMethods: {
			type: Object,
			default: () => ({
				qris: true,
				va_mandiri: true,
				va_bri: true,
				va_bni: true
			})
		},
		eventData: {
			type: Object,
			default: () => ({})
		},
		initialPaymentResult: {
			type: Object,
			default: null
		},
		isEmergencyBackup: {
			type: Boolean,
			default: false
		},
		emergencyMessage: {
			type: String,
			default: ""
		}
	},
	emits: [
		"file-upload",
		"back",
		"submit",
		"toast",
		"request-espay",
		"payment-success",
		"reset-payment",
		"cancel-order"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const isGenerating = ref(false);
		const paymentResult = ref(null);
		const selectedMethod = ref("qris");
		const isCheckingStatus = ref(false);
		const isCancelling = ref(false);
		const cooldownSeconds = ref(0);
		let pollInterval = null;
		const primaryParticipant = computed(() => {
			if (!props.daftarPeserta || props.daftarPeserta.length === 0) return null;
			const p = props.daftarPeserta[0];
			const j = p.jawaban || {};
			return {
				nama: j.nama_lengkap || j.namaLengkap || p.namaAnak || p.nama_lengkap || "Peserta",
				email: j.email || p.email || "-",
				phone: j.no_wa || j.whatsapp || p.hp || p.no_wa || "-"
			};
		});
		const allParticipants = computed(() => {
			if (!props.daftarPeserta || props.daftarPeserta.length === 0) return [];
			return props.daftarPeserta.map((p, idx) => {
				const j = p.jawaban || {};
				return {
					index: idx + 1,
					nama: j.nama_lengkap || j.namaLengkap || p.namaAnak || p.nama_lengkap || `Peserta ${idx + 1}`
				};
			});
		});
		const expirySeconds = ref(900);
		const isExpired = ref(false);
		let expiryInterval = null;
		function formatTimeRemaining(totalSec) {
			if (totalSec <= 0) return "00:00";
			const m = Math.floor(totalSec / 60);
			const s = totalSec % 60;
			return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
		}
		function startExpiryTimer(initialSeconds = 900) {
			if (expiryInterval) {
				clearInterval(expiryInterval);
				expiryInterval = null;
			}
			expirySeconds.value = Math.max(0, initialSeconds);
			isExpired.value = expirySeconds.value <= 0;
			if (isExpired.value) {
				stopPolling();
				return;
			}
			expiryInterval = setInterval();
		}
		function stopPolling() {
			if (pollInterval) {
				clearInterval(pollInterval);
				pollInterval = null;
			}
		}
		function startPollingPayment(orderId) {
			if (!orderId) return;
			stopPolling();
			pollInterval = setInterval();
		}
		watch(() => props.initialPaymentResult, (val) => {
			if (val && val.order_id) {
				paymentResult.value = val;
				if (val.created_at) {
					const createdTime = new Date(val.created_at).getTime();
					const elapsedSec = Math.floor((Date.now() - createdTime) / 1e3);
					startExpiryTimer(Math.max(0, 900 - elapsedSec));
				} else startExpiryTimer(900);
				startPollingPayment(val.order_id);
			}
		}, { immediate: true });
		const availableMethods = computed(() => {
			const m = props.espayMethods || {};
			return {
				qris: m.qris !== false,
				va_mandiri: m.va_mandiri !== false,
				va_bri: m.va_bri !== false,
				va_bni: m.va_bni !== false
			};
		});
		const displayTotalQty = computed(() => {
			if (props.totalQty > 0) return props.totalQty;
			if (paymentResult.value?.ticket_count) return paymentResult.value.ticket_count;
			return 1;
		});
		const displayTotalPrice = computed(() => {
			if (props.totalPrice > 0) return props.totalPrice;
			if (paymentResult.value?.amount !== void 0) return paymentResult.value.amount;
			return 0;
		});
		const displayDonasiAmount = computed(() => {
			if (props.donasiAmount > 0) return props.donasiAmount;
			if (paymentResult.value?.donasi_amount !== void 0) return paymentResult.value.donasi_amount;
			return 0;
		});
		const platformFee = computed(() => {
			if (paymentResult.value?.admin_fee !== void 0) return paymentResult.value.admin_fee;
			if (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0;
			return (props.adminFee || 2e3) + (props.kodeUnik || 0);
		});
		const manualPlatformFee = computed(() => {
			if (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0;
			return (props.adminFee || 2e3) + (props.kodeUnik || 0);
		});
		const isQrisCheaper = computed(() => {
			return displayTotalPrice.value + displayDonasiAmount.value + platformFee.value < 39e4;
		});
		const recommendedMethod = computed(() => {
			if (isQrisCheaper.value && availableMethods.value.qris) return "qris";
			if (availableMethods.value.va_mandiri) return "va_mandiri";
			if (availableMethods.value.va_bri) return "va_bri";
			if (availableMethods.value.va_bni) return "va_bni";
			if (availableMethods.value.qris) return "qris";
			return "qris";
		});
		const isBankExpanded = ref(false);
		const selectedBankShortName = computed(() => {
			if (selectedMethod.value === "va_mandiri") return "Mandiri";
			if (selectedMethod.value === "va_bri") return "BRI";
			if (selectedMethod.value === "va_bni") return "BNI";
			return "";
		});
		watch(availableMethods, (m) => {
			if (!m[selectedMethod.value]) {
				selectedMethod.value = recommendedMethod.value;
				if (selectedMethod.value.startsWith("va")) isBankExpanded.value = true;
			}
		});
		const currentGatewayFee = computed(() => {
			if (paymentResult.value?.fee !== void 0) return paymentResult.value.fee;
			if (!props.isEspayActive || displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0;
			const subtotal = displayTotalPrice.value + displayDonasiAmount.value + platformFee.value;
			if (selectedMethod.value === "qris") return Math.ceil(subtotal / .992896) - subtotal;
			else if (selectedMethod.value === "va_bni") return 3330;
			else if (selectedMethod.value.startsWith("va")) return 2775;
			return 0;
		});
		const displayGrandTotal = computed(() => {
			if (paymentResult.value?.total_amount && props.isEspayActive) return paymentResult.value.total_amount;
			if (!props.isEspayActive) {
				if (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0;
				return displayTotalPrice.value + displayDonasiAmount.value + manualPlatformFee.value;
			}
			return displayTotalPrice.value + displayDonasiAmount.value + platformFee.value + currentGatewayFee.value;
		});
		const formatPrice = (price) => {
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(price || 0);
		};
		computed(() => {
			if (selectedMethod.value === "qris") return "QRIS (Semua E-Wallet / Bank)";
			if (selectedMethod.value === "va_mandiri") return "Mandiri Virtual Account";
			if (selectedMethod.value === "va_bri") return "BRI Virtual Account (BRIVA)";
			if (selectedMethod.value === "va_bni") return "BNI Virtual Account";
			return selectedMethod.value;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-e61a4062>`);
			if (primaryParticipant.value && !paymentResult.value) {
				_push(`<div class="buyer-review-card" data-v-e61a4062><div class="buyer-review-header" data-v-e61a4062><div class="buyer-header-title" data-v-e61a4062><svg class="buyer-header-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-e61a4062></path></svg><span data-v-e61a4062>Konfirmasi Data E-Ticket</span></div><button type="button" class="btn-review-change" title="Ubah data pemesan" data-v-e61a4062> Ubah Data </button></div><div class="buyer-review-body" data-v-e61a4062><div class="buyer-field-row" data-v-e61a4062><div class="buyer-field" data-v-e61a4062><span class="buyer-field-label" data-v-e61a4062>Nama Pemesan</span><span class="buyer-field-val font-semibold" data-v-e61a4062>${ssrInterpolate(primaryParticipant.value.nama)}</span></div><div class="buyer-field" data-v-e61a4062><span class="buyer-field-label" data-v-e61a4062>No. WhatsApp</span><span class="buyer-field-val" data-v-e61a4062>${ssrInterpolate(primaryParticipant.value.phone)}</span></div></div><div class="buyer-field-row single" data-v-e61a4062><div class="buyer-field" data-v-e61a4062><span class="buyer-field-label" data-v-e61a4062>Email Pengiriman E-Ticket</span><span class="buyer-field-val email-highlight" data-v-e61a4062>${ssrInterpolate(primaryParticipant.value.email)}</span></div></div>`);
				if (allParticipants.value.length > 1) {
					_push(`<div class="buyer-participants-section" data-v-e61a4062><span class="buyer-field-label" data-v-e61a4062>Daftar Peserta Tiket (${ssrInterpolate(allParticipants.value.length)})</span><div class="buyer-chips-wrap" data-v-e61a4062><!--[-->`);
					ssrRenderList(allParticipants.value, (p) => {
						_push(`<span class="buyer-chip" data-v-e61a4062> #${ssrInterpolate(p.index)} ${ssrInterpolate(p.nama)}</span>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="billing-card" data-v-e61a4062><small class="billing-header" data-v-e61a4062>Total Tagihan</small><div class="billing-total-row" data-v-e61a4062><h2 class="billing-total-amount" data-v-e61a4062>${ssrInterpolate(formatPrice(displayGrandTotal.value))}</h2><button class="btn-copy" title="Salin Nominal" data-v-e61a4062><svg class="icon-copy" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-e61a4062></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-e61a4062></path></svg></button></div><div class="billing-details" data-v-e61a4062><div class="billing-detail-item" data-v-e61a4062><span data-v-e61a4062>Tiket (${ssrInterpolate(displayTotalQty.value)}x)</span><span data-v-e61a4062>${ssrInterpolate(formatPrice(displayTotalPrice.value))}</span></div>`);
			if (displayDonasiAmount.value > 0) _push(`<div class="billing-detail-subitem" style="${ssrRenderStyle({
				"color": "var(--text-main)",
				"font-weight": "600",
				"opacity": "1"
			})}" data-v-e61a4062><span data-v-e61a4062>Infaq / Donasi</span><span data-v-e61a4062>+${ssrInterpolate(formatPrice(displayDonasiAmount.value))}</span></div>`);
			else _push(`<!---->`);
			if (__props.isEspayActive) _push(`<div class="billing-detail-subitem" data-v-e61a4062><span data-v-e61a4062>Biaya Admin Pembayaran (Gateway + PPN)</span><span data-v-e61a4062>+${ssrInterpolate(formatPrice(platformFee.value + currentGatewayFee.value))}</span></div>`);
			else if (manualPlatformFee.value > 0) _push(`<div class="billing-detail-subitem" data-v-e61a4062><span data-v-e61a4062>Biaya Layanan</span><span data-v-e61a4062>+${ssrInterpolate(formatPrice(manualPlatformFee.value))}</span></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
			if (__props.isEmergencyBackup) _push(`<div class="emergency-alert-banner" data-v-e61a4062><div class="emergency-banner-icon" data-v-e61a4062><svg class="icon-emergency-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-e61a4062></path></svg></div><div class="emergency-banner-content" data-v-e61a4062><span class="emergency-badge-text" data-v-e61a4062>MODE CADANGAN / DARURAT AKTIF</span><p class="emergency-message-text" data-v-e61a4062>${ssrInterpolate(__props.emergencyMessage || "Sistem pembayaran otomatis sedang dialihkan ke Transfer Bank Manual.")}</p></div></div>`);
			else _push(`<!---->`);
			if (__props.isEspayActive) {
				_push(`<div class="espay-container" data-v-e61a4062>`);
				if (!paymentResult.value) {
					_push(`<div class="method-selection-card" data-v-e61a4062><p class="section-title" data-v-e61a4062>Pilih Metode Pembayaran</p><div class="payment-method-groups" data-v-e61a4062>`);
					if (availableMethods.value.qris) {
						_push(`<div class="${ssrRenderClass([{ active: selectedMethod.value === "qris" }, "method-group-item"])}" data-v-e61a4062><div class="group-header-row" data-v-e61a4062><div class="group-header-left" data-v-e61a4062><div class="method-icon-box qris-icon-bg" data-v-e61a4062><svg class="method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e61a4062><rect x="3" y="3" width="7" height="7" data-v-e61a4062></rect><rect x="14" y="3" width="7" height="7" data-v-e61a4062></rect><rect x="14" y="14" width="7" height="7" data-v-e61a4062></rect><rect x="3" y="14" width="7" height="7" data-v-e61a4062></rect></svg></div><div class="method-info" data-v-e61a4062><div class="method-name-row" data-v-e61a4062><span class="method-name" data-v-e61a4062>QRIS</span>`);
						if (isQrisCheaper.value) _push(`<span class="badge-cheapest" data-v-e61a4062>Rekomendasi</span>`);
						else _push(`<!---->`);
						_push(`</div><span class="method-desc" data-v-e61a4062>BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay</span></div></div><div class="${ssrRenderClass([{ checked: selectedMethod.value === "qris" }, "method-radio"])}" data-v-e61a4062>`);
						if (selectedMethod.value === "qris") _push(`<svg class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-e61a4062><polyline points="20 6 9 17 4 12" data-v-e61a4062></polyline></svg>`);
						else _push(`<!---->`);
						_push(`</div></div></div>`);
					} else _push(`<!---->`);
					if (availableMethods.value.va_mandiri || availableMethods.value.va_bri || availableMethods.value.va_bni) {
						_push(`<div class="${ssrRenderClass([{
							active: selectedMethod.value.startsWith("va"),
							expanded: isBankExpanded.value
						}, "method-group-item bank-group-item"])}" data-v-e61a4062><div class="group-header-row bank-header-clickable" data-v-e61a4062><div class="group-header-left" data-v-e61a4062><div class="method-icon-box bank-icon-bg" data-v-e61a4062><svg class="method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e61a4062><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3z" data-v-e61a4062></path></svg></div><div class="method-info" data-v-e61a4062><div class="method-name-row" data-v-e61a4062><span class="method-name" data-v-e61a4062>Transfer Bank (Virtual Account)</span>`);
						if (!isQrisCheaper.value) _push(`<span class="badge-cheapest" data-v-e61a4062>Rekomendasi</span>`);
						else _push(`<!---->`);
						_push(`</div></div></div><div class="bank-accordion-indicator" data-v-e61a4062>`);
						if (selectedMethod.value.startsWith("va") && !isBankExpanded.value) _push(`<span class="active-bank-pill" data-v-e61a4062>${ssrInterpolate(selectedBankShortName.value)}</span>`);
						else _push(`<!---->`);
						_push(`<svg class="${ssrRenderClass([{ rotate: isBankExpanded.value }, "chevron-icon-svg"])}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-e61a4062></path></svg></div></div><div class="bank-grid-dropdown" style="${ssrRenderStyle(isBankExpanded.value ? null : { display: "none" })}" data-v-e61a4062>`);
						if (availableMethods.value.va_mandiri) {
							_push(`<button type="button" class="${ssrRenderClass([{ selected: selectedMethod.value === "va_mandiri" }, "bank-grid-card"])}" data-v-e61a4062><div class="bank-card-top" data-v-e61a4062><span class="bank-badge mandiri" data-v-e61a4062>mandiri</span><div class="${ssrRenderClass([{ checked: selectedMethod.value === "va_mandiri" }, "bank-radio"])}" data-v-e61a4062>`);
							if (selectedMethod.value === "va_mandiri") _push(`<svg class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-e61a4062><polyline points="20 6 9 17 4 12" data-v-e61a4062></polyline></svg>`);
							else _push(`<!---->`);
							_push(`</div></div><span class="bank-card-title" data-v-e61a4062>Bank Mandiri</span></button>`);
						} else _push(`<!---->`);
						if (availableMethods.value.va_bri) {
							_push(`<button type="button" class="${ssrRenderClass([{ selected: selectedMethod.value === "va_bri" }, "bank-grid-card"])}" data-v-e61a4062><div class="bank-card-top" data-v-e61a4062><span class="bank-badge bri" data-v-e61a4062>BRI</span><div class="${ssrRenderClass([{ checked: selectedMethod.value === "va_bri" }, "bank-radio"])}" data-v-e61a4062>`);
							if (selectedMethod.value === "va_bri") _push(`<svg class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-e61a4062><polyline points="20 6 9 17 4 12" data-v-e61a4062></polyline></svg>`);
							else _push(`<!---->`);
							_push(`</div></div><span class="bank-card-title" data-v-e61a4062>Bank BRI</span></button>`);
						} else _push(`<!---->`);
						if (availableMethods.value.va_bni) {
							_push(`<button type="button" class="${ssrRenderClass([{ selected: selectedMethod.value === "va_bni" }, "bank-grid-card"])}" data-v-e61a4062><div class="bank-card-top" data-v-e61a4062><span class="bank-badge bni" data-v-e61a4062>BNI</span><div class="${ssrRenderClass([{ checked: selectedMethod.value === "va_bni" }, "bank-radio"])}" data-v-e61a4062>`);
							if (selectedMethod.value === "va_bni") _push(`<svg class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-e61a4062><polyline points="20 6 9 17 4 12" data-v-e61a4062></polyline></svg>`);
							else _push(`<!---->`);
							_push(`</div></div><span class="bank-card-title" data-v-e61a4062>Bank BNI</span></button>`);
						} else _push(`<!---->`);
						_push(`</div></div>`);
					} else _push(`<!---->`);
					_push(`</div><div class="checkout-final-notice" data-v-e61a4062><span class="notice-pulse-badge" data-v-e61a4062><span class="pulse-dot" data-v-e61a4062></span> LANGKAH TERAKHIR </span><p class="notice-desc" data-v-e61a4062> Pendaftaran belum selesai. Klik <strong data-v-e61a4062>BAYAR SEKARANG</strong> di bawah untuk mendapatkan kode pembayaran. </p></div><div class="action-buttons mt-3" data-v-e61a4062><button type="button" class="btn btn-secondary" data-v-e61a4062>KEMBALI</button><button type="button"${ssrIncludeBooleanAttr(isGenerating.value || __props.isSubmitting) ? " disabled" : ""} class="${ssrRenderClass([{ "btn-loading": isGenerating.value || __props.isSubmitting }, "btn btn-primary"])}" data-v-e61a4062>`);
					if (isGenerating.value || __props.isSubmitting) _push(`<span data-v-e61a4062>MEMPROSES KODE BAYAR...</span>`);
					else _push(`<span class="btn-text-icon" data-v-e61a4062> BAYAR SEKARANG <svg class="btn-arrow-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" data-v-e61a4062></path></svg></span>`);
					_push(`</button></div></div>`);
				} else {
					_push(`<div class="payment-result-wrapper" data-v-e61a4062>`);
					if (isExpired.value) _push(`<div class="expired-card" data-v-e61a4062><div class="expired-icon" data-v-e61a4062><svg class="icon-expired-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><circle cx="12" cy="12" r="10" data-v-e61a4062></circle><polyline points="12 6 12 12 16 14" data-v-e61a4062></polyline></svg></div><h4 class="expired-title" data-v-e61a4062>Batas Waktu Pembayaran Telah Habis</h4><p class="expired-desc" data-v-e61a4062>Kode pembayaran ini sudah kedaluwarsa (melewati batas 15 menit). Kuota tiket telah dikembalikan.</p><button class="btn btn-primary mt-3" data-v-e61a4062><span class="btn-text-icon" data-v-e61a4062> Buat Pesanan Baru <svg class="btn-arrow-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" data-v-e61a4062></path></svg></span></button></div>`);
					else {
						_push(`<!--[--><div class="stay-page-banner" data-v-e61a4062><div class="stay-pulse-icon" data-v-e61a4062><span class="stay-ring" data-v-e61a4062></span><svg class="stay-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-e61a4062></path></svg></div><div class="stay-content" data-v-e61a4062><span class="stay-title" data-v-e61a4062>MOHON JANGAN TUTUP HALAMAN INI</span><p class="stay-desc" data-v-e61a4062>Setelah pembayaran Anda selesai, E-Ticket resmi akan <strong data-v-e61a4062>otomatis terbit di layar ini</strong>.</p></div></div><div class="${ssrRenderClass([{ "timer-urgent": expirySeconds.value <= 180 }, "payment-timer-box"])}" data-v-e61a4062><svg class="timer-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><circle cx="12" cy="12" r="10" data-v-e61a4062></circle><polyline points="12 6 12 12 16 14" data-v-e61a4062></polyline></svg><span class="timer-label" data-v-e61a4062>Selesaikan pembayaran dalam</span><span class="timer-countdown" data-v-e61a4062>${ssrInterpolate(formatTimeRemaining(expirySeconds.value))}</span></div>`);
						if (paymentResult.value.payment_type === "qris") {
							_push(`<div class="qris-card" data-v-e61a4062><div class="qris-header-badge" data-v-e61a4062><span class="qris-label" data-v-e61a4062>QRIS STANDAR NASIONAL</span><span class="qris-sublabel" data-v-e61a4062>Bisa di-scan semua Mobile Banking &amp; E-Wallet</span></div><div class="qris-qr-box" data-v-e61a4062><img${ssrRenderAttr("src", paymentResult.value.qr_image)} alt="QRIS Pembayaran" class="qris-dynamic-image" data-v-e61a4062></div><button type="button" class="btn-download-qris" data-v-e61a4062><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" data-v-e61a4062></path></svg> Unduh Gambar QRIS </button><div class="realtime-status-box" data-v-e61a4062><div class="pulse-indicator" data-v-e61a4062></div><div data-v-e61a4062><p class="realtime-status-text" data-v-e61a4062>Menunggu Pembayaran...</p><small class="realtime-subtext" data-v-e61a4062>Halaman otomatis ter-update setelah Anda membayar.</small></div></div><button type="button"${ssrIncludeBooleanAttr(isCheckingStatus.value || cooldownSeconds.value > 0) ? " disabled" : ""} class="btn-refresh-status" data-v-e61a4062>`);
							if (isCheckingStatus.value) _push(`<span class="spinner-small" data-v-e61a4062></span>`);
							else if (cooldownSeconds.value > 0) _push(`<span class="btn-text-icon" data-v-e61a4062><svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><circle cx="12" cy="12" r="10" data-v-e61a4062></circle><polyline points="12 6 12 12 16 14" data-v-e61a4062></polyline></svg> Cek Lagi dalam ${ssrInterpolate(cooldownSeconds.value)}s </span>`);
							else _push(`<span class="btn-text-icon" data-v-e61a4062><svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-e61a4062></path></svg> Cek Status Pembayaran </span>`);
							_push(`</button></div>`);
						} else if (paymentResult.value.payment_type === "va") {
							_push(`<div class="va-card" data-v-e61a4062><div class="va-header" data-v-e61a4062><span class="va-bank-badge" data-v-e61a4062>${ssrInterpolate(paymentResult.value.bank_name || "Virtual Account")}</span><span class="va-instan-badge" data-v-e61a4062>Otomatis Terverifikasi</span></div><div class="va-number-box" data-v-e61a4062><small class="va-number-label" data-v-e61a4062>Nomor Virtual Account</small><div class="va-number-row" data-v-e61a4062><span class="va-digits" data-v-e61a4062>${ssrInterpolate(paymentResult.value.va_number)}</span><button class="btn-copy-va" title="Salin Nomor VA" data-v-e61a4062><span data-v-e61a4062>Salin</span><svg class="icon-copy-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-e61a4062></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-e61a4062></path></svg></button></div></div><div class="va-amount-box" data-v-e61a4062><small class="va-amount-label" data-v-e61a4062>Total yang Harus Ditransfer</small><div class="va-amount-row" data-v-e61a4062><span class="va-amount-digits" data-v-e61a4062>${ssrInterpolate(formatPrice(paymentResult.value.total_amount))}</span><button class="btn-copy-va" title="Salin Nominal" data-v-e61a4062><span data-v-e61a4062>Salin</span><svg class="icon-copy-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-e61a4062></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-e61a4062></path></svg></button></div><small class="va-exact-warn" data-v-e61a4062><svg class="icon-warn-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-e61a4062></path></svg> Transfer nominal tepat hingga digit terakhir agar otomatis terdeteksi. </small></div><div class="va-guide-card" data-v-e61a4062><p class="guide-title" data-v-e61a4062><svg class="icon-info-svg-blue" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><circle cx="12" cy="12" r="10" data-v-e61a4062></circle><line x1="12" y1="16" x2="12" y2="12" data-v-e61a4062></line><line x1="12" y1="8" x2="12.01" y2="8" data-v-e61a4062></line></svg> Cara Bayar via Mobile Banking / ATM: </p><ol class="guide-steps" data-v-e61a4062><li data-v-e61a4062>Buka aplikasi Mobile Banking / ATM bank Anda.</li><li data-v-e61a4062>Pilih menu <strong data-v-e61a4062>Transfer / Bayar</strong> → <strong data-v-e61a4062>Virtual Account</strong>.</li><li data-v-e61a4062>Masukkan nomor VA: <strong data-v-e61a4062>${ssrInterpolate(paymentResult.value.va_number)}</strong>.</li><li data-v-e61a4062>Pastikan nama tagihan sesuai, lalu konfirmasi pembayaran.</li></ol></div><div class="realtime-status-box" data-v-e61a4062><div class="pulse-indicator" data-v-e61a4062></div><div data-v-e61a4062><p class="realtime-status-text" data-v-e61a4062>Menunggu Transfer...</p><small class="realtime-subtext" data-v-e61a4062>Begitu transfer selesai, tiket Anda langsung terbit otomatis!</small></div></div><button type="button"${ssrIncludeBooleanAttr(isCheckingStatus.value || cooldownSeconds.value > 0) ? " disabled" : ""} class="btn-refresh-status" data-v-e61a4062>`);
							if (isCheckingStatus.value) _push(`<span class="spinner-small" data-v-e61a4062></span>`);
							else if (cooldownSeconds.value > 0) _push(`<span class="btn-text-icon" data-v-e61a4062><svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><circle cx="12" cy="12" r="10" data-v-e61a4062></circle><polyline points="12 6 12 12 16 14" data-v-e61a4062></polyline></svg> Cek Lagi dalam ${ssrInterpolate(cooldownSeconds.value)}s </span>`);
							else _push(`<span class="btn-text-icon" data-v-e61a4062><svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-e61a4062></path></svg> Cek Status Pembayaran </span>`);
							_push(`</button></div>`);
						} else _push(`<!---->`);
						_push(`<div class="action-buttons mt-3" data-v-e61a4062><button type="button"${ssrIncludeBooleanAttr(isCancelling.value) ? " disabled" : ""} class="btn-cancel-order" data-v-e61a4062>`);
						if (isCancelling.value) _push(`<span class="spinner-small danger-spinner" data-v-e61a4062></span>`);
						else _push(`<span class="btn-text-icon" data-v-e61a4062><svg class="icon-cancel-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><circle cx="12" cy="12" r="10" data-v-e61a4062></circle><line x1="15" y1="9" x2="9" y2="15" data-v-e61a4062></line><line x1="9" y1="9" x2="15" y2="15" data-v-e61a4062></line></svg> Batalkan Pesanan Ini </span>`);
						_push(`</button></div><!--]-->`);
					}
					_push(`</div>`);
				}
				_push(`</div>`);
			} else {
				_push(`<div class="manual-container" data-v-e61a4062><div class="qris-card" data-v-e61a4062><div class="qris-header-badge" data-v-e61a4062><span class="qris-label" data-v-e61a4062>SCAN QRIS UNTUK MEMBAYAR</span><span class="qris-sublabel" data-v-e61a4062>Bisa di-scan semua Mobile Banking &amp; E-Wallet</span></div><div class="qris-qr-box" data-v-e61a4062><img${ssrRenderAttr("src", _virtual_public__2Fqris_default)} alt="QRIS Pembayaran" class="qris-static-image" fetchpriority="high" decoding="async" width="175" height="175" data-v-e61a4062></div><a href="/qris.webp" download="QRIS_Pembayaran.webp" class="btn-download-qris" data-v-e61a4062><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" data-v-e61a4062></path></svg> Download QRIS </a><div class="va-amount-box precision-box mt-3" data-v-e61a4062><small class="va-amount-label" data-v-e61a4062>Total yang Wajib Ditransfer (Termasuk Kode Unik)</small><div class="va-amount-row" data-v-e61a4062><span class="va-amount-digits highlight-price" data-v-e61a4062>${ssrInterpolate(formatPrice(displayGrandTotal.value))}</span><button type="button" class="btn-copy-va" title="Salin Nominal Tepat" data-v-e61a4062><span data-v-e61a4062>Salin Nominal</span><svg class="icon-copy-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-e61a4062></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-e61a4062></path></svg></button></div><small class="va-exact-warn" data-v-e61a4062><svg class="icon-warn-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-e61a4062></path></svg> Wajib transfer tepat hingga 3 digit terakhir agar pembayaran dapat diverifikasi cepat oleh Admin Tyket. </small></div></div><div class="upload-section" data-v-e61a4062><label class="upload-label" data-v-e61a4062>Upload Bukti Pembayaran <span class="required-mark" data-v-e61a4062>*</span></label><div class="${ssrRenderClass([{ "error-shake": __props.uploadError }, "upload-box"])}" data-v-e61a4062>`);
				if (!__props.buktiBayarPreview) _push(`<div class="upload-placeholder" data-v-e61a4062><p class="upload-placeholder-title" data-v-e61a4062>Klik untuk pilih foto struk</p><p class="upload-placeholder-desc" data-v-e61a4062>Format JPG/PNG • Maks. 5MB</p></div>`);
				else _push(`<img${ssrRenderAttr("src", __props.buktiBayarPreview)} alt="Preview Bukti" class="upload-preview-image" data-v-e61a4062>`);
				_push(`<input type="file" accept="image/*" class="upload-input" data-v-e61a4062></div></div><div class="action-buttons" data-v-e61a4062><button class="btn btn-secondary" data-v-e61a4062>KEMBALI</button><button${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} class="${ssrRenderClass([{ "btn-loading": __props.isSubmitting }, "btn btn-primary"])}" data-v-e61a4062>`);
				if (__props.isSubmitting) _push(`<span data-v-e61a4062>MEMPROSES...</span>`);
				else _push(`<span class="btn-text-icon" data-v-e61a4062> DAFTAR SEKARANG <svg class="icon-check-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-e61a4062><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-e61a4062></path></svg></span>`);
				_push(`</button></div></div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/CheckoutPayment.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var CheckoutPayment_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-e61a4062"]]);
//#endregion
//#region app/components/event/TicketPrinterOverlay.vue
var _sfc_main = {
	__name: "EventTicketPrinterOverlay",
	__ssrInlineRender: true,
	props: {
		isSubmitting: Boolean,
		isPrinting: Boolean,
		eventData: Object,
		daftarPeserta: Array,
		transactionId: String
	},
	setup(__props) {
		const props = __props;
		const pesertaName = computed(() => {
			return props.daftarPeserta && props.daftarPeserta.length > 0 ? props.daftarPeserta[0]?.jawaban?.nama_lengkap || "PESERTA" : "PESERTA";
		});
		const categoryName = computed(() => {
			return props.daftarPeserta && props.daftarPeserta.length > 0 ? props.daftarPeserta[0]?.namaTiket || "REGULER" : "REGULER";
		});
		const ticketCount = computed(() => {
			return props.daftarPeserta ? props.daftarPeserta.length : 0;
		});
		const eventDate = computed(() => {
			if (props.eventData?.tanggal_mulai) return new Date(props.eventData.tanggal_mulai).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric"
			});
			return "SEGERA";
		});
		const eventTime = computed(() => {
			if (props.eventData?.waktu_mulai) return props.eventData.waktu_mulai.substring(0, 5) + " WIB";
			return "WIB";
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-390b72ef>`);
			if (__props.isSubmitting && !__props.isPrinting) _push(`<div class="glass-overlay" data-v-390b72ef><div class="modern-spinner-box" data-v-390b72ef><div class="spinner-ring" data-v-390b72ef></div><div class="spinner-core" data-v-390b72ef></div><h3 class="spinner-title" data-v-390b72ef>MEMPROSES</h3><p class="spinner-subtitle" data-v-390b72ef>Mengamankan kuota tiket Anda...</p></div></div>`);
			else _push(`<!---->`);
			if (__props.isPrinting) _push(`<div class="overlay style-a" data-v-390b72ef><div class="backdrop-blur" data-v-390b72ef></div><div class="wallet-wrapper" data-v-390b72ef><div class="wallet-slot" data-v-390b72ef></div><div class="wallet-mask" data-v-390b72ef><div class="ticket-card t-classic" data-v-390b72ef><div class="t-header-row" data-v-390b72ef><div class="t-event-info" data-v-390b72ef><div class="t-event-name" data-v-390b72ef>${ssrInterpolate(__props.eventData?.nama_event || "EVENT")}</div><div class="t-event-date" data-v-390b72ef>${ssrInterpolate(eventDate.value)} • ${ssrInterpolate(eventTime.value)}</div></div><span class="t-badge" data-v-390b72ef>BOOKING PASS</span></div><div class="t-divider" data-v-390b72ef></div><div class="t-guest-row" data-v-390b72ef><div class="t-guest-col" data-v-390b72ef><div class="t-label" data-v-390b72ef>NAMA PESERTA</div><div class="t-value" data-v-390b72ef>${ssrInterpolate(pesertaName.value)}</div></div><div class="t-guest-col text-right" data-v-390b72ef><div class="t-label" data-v-390b72ef>KATEGORI</div><div class="t-value" data-v-390b72ef>${ssrInterpolate(categoryName.value)}</div></div></div><div class="t-barcode-section" data-v-390b72ef><div class="barcode-lines" data-v-390b72ef></div><div class="t-trx-number" data-v-390b72ef>${ssrInterpolate(__props.transactionId || "TRX-MEMPROSES...")}</div></div><div class="t-divider-dashed" data-v-390b72ef></div><div class="t-footer" data-v-390b72ef><span class="t-qty" data-v-390b72ef>${ssrInterpolate(ticketCount.value)} x TIKET</span><span class="t-status" data-v-390b72ef>MEMPROSES</span></div></div></div></div><div class="loading-status" data-v-390b72ef><span class="loading-dot" data-v-390b72ef></span> Mencatat pesanan...</div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/TicketPrinterOverlay.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var TicketPrinterOverlay_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-390b72ef"]]);

export { CheckoutPayment_default as C, TicketPrinterOverlay_default as T };
//# sourceMappingURL=TicketPrinterOverlay-C1j6oMr0.mjs.map
