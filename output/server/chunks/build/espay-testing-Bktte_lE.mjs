import { N as NuxtLink, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { C as CheckoutPayment_default, T as TicketPrinterOverlay_default } from './TicketPrinterOverlay-DKYac3wV.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import QRCode from 'qrcode';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import 'node:crypto';
import '@supabase/supabase-js';
import '@supabase/ssr';
import 'crypto';
import 'fs';
import 'path';
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
import 'vue-router';
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

//#region app/pages/espay-testing.vue?vue&type=script&setup=true&lang.ts
var espay_testing_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "espay-testing",
	__ssrInlineRender: true,
	setup(__props) {
		const dummyUser = {
			name: "Budi Santoso",
			email: "tester@tyket.id",
			phone: "081234567890"
		};
		const dummyEventData = {
			id: 999999,
			nama_event: "Festival Musik Tyket 2026",
			tanggal_mulai: (/* @__PURE__ */ new Date()).toISOString(),
			waktu_mulai: "19:00:00",
			lokasi: "Jakarta Convention Center (JCC)",
			deskripsi: "Simulasi alur transaksi tiket resmi Tyket.id dengan payment gateway Espay Sandbox.",
			poster_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80",
			settings: {
				is_espay_active: true,
				is_qr_active: true,
				espay_methods: {
					qris: true,
					va_bca: true,
					va_mandiri: true,
					va_bri: true,
					va_bni: false
				}
			}
		};
		const daftarPeserta = computed(() => [{
			namaAnak: dummyUser.name,
			nama_lengkap: dummyUser.name,
			email: dummyUser.email,
			hp: dummyUser.phone,
			no_wa: dummyUser.phone,
			namaTiket: "Tiket Regular Presale",
			tiketId: 1,
			jawaban: {
				nama_lengkap: dummyUser.name,
				email: dummyUser.email,
				no_wa: dummyUser.phone
			}
		}]);
		const currentStep = ref("bayar");
		const ticketAmount = ref(1e4);
		const grandTotalCalculated = computed(() => ticketAmount.value + 2e3);
		const activePaymentResult = ref(null);
		const transactionIdGlobal = ref("");
		const lastPaidData = ref(null);
		const ticketQrUrl = ref("");
		const isPrinting = ref(false);
		const printAudio = ref(null);
		const toastMessage = ref("");
		const toastType = ref("info");
		let toastTimer = null;
		const logStatus = ref("idle");
		const logData = ref(null);
		const activeTab = ref("summary");
		const selectedMerchant = ref("SGWZULKARNAENALMUHAMMADY");
		const copied = ref(false);
		const envInfo = ref(null);
		const currentOrigin = computed(() => {
			return "http://localhost:3000";
		});
		const formattedToday = computed(() => {
			return (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			});
		});
		function formatPrice(val) {
			return (val || 0).toLocaleString("id-ID");
		}
		function formatJson(val) {
			if (!val) return "";
			try {
				return JSON.stringify(val, null, 2);
			} catch (e) {
				return String(val);
			}
		}
		function showToastMsg(msg, type = "info") {
			toastMessage.value = msg;
			toastType.value = type;
			if (toastTimer) clearTimeout(toastTimer);
			toastTimer = setTimeout(() => {
				toastMessage.value = "";
			}, 3e3);
		}
		function getErrorDiagnosis(log) {
			if (!log) return null;
			const code = String(log?.responseCode || log?.httpStatus || "");
			const msg = String(log?.message || log?.debug?.responseMessage || "").toLowerCase();
			const raw = JSON.stringify(log?.debug || {}).toLowerCase();
			if (msg.includes("private key") || raw.includes("private key")) return {
				title: "Private Key RSA Tidak Ditemukan",
				description: "Server gagal membaca private key untuk membuat signature SNAP BI.",
				fix: "Pastikan file server/certs/espay-private.pem ada dan berformat RSA Private Key valid."
			};
			if (code.includes("0031") || msg.includes("komunikasi dengan mitra") || raw.includes("0031")) return {
				title: "Handshake Webhook Callback Inquiry Timeout (Error 0031)",
				description: "Request Send Invoice & Signature Anda sudah 100% SUKSES dan DITERIMA oleh Espay! Namun server Espay gagal menghubungi Webhook Callback Inquiry merchant Anda dalam 10 detik.",
				fix: "Espay mewajibkan URL Callback Inquiry yang terdaftar di portal merchant aktif dan dapat diakses dari internet publik. Pastikan URL Callback Inquiry di portal merchant Espay mengarah ke domain publik yang aktif (misal dev.tyket.id atau via tunnel ngrok)."
			};
			if (code.includes("0004") || msg.includes("format input salah") || msg.includes("remark")) return {
				title: "Format Input Parameter Tidak Sesuai (Error 0004)",
				description: log?.message || "Espay menolak format salah satu parameter input (misal Remark 2 / Nama).",
				fix: "Sesuai aturan Espay: Remark 2 (Nama) WAJIB berupa karakter Alfanumerik dan Spasi saja (maksimal 30 karakter, tanpa tanda kurung atau simbol spesial). Order ID harus alfanumerik."
			};
			if (code.includes("IRF") || msg.includes("credential is not valid")) return {
				title: "Kredensial Tidak Cocok (Error IRF: Credential is not Valid)",
				description: `Target merchant "${log?.merchantId}" tidak cocok dengan Signature Key di .env.`,
				fix: "Pastikan memilih tombol target merchant \"👤 SGWZULKARNAENALMUHAMMADY (Akun .env)\" di atas."
			};
			if (code.includes("401") || msg.includes("unauthorized") || msg.includes("invalid") && msg.includes("signature")) return {
				title: "Signature Asymmetric Ditolak (401 Unauthorized / Invalid Signature)",
				description: "Signature SHA256withRSA ditolak oleh server Espay Sandbox.",
				fix: "1. Jika Anda menguji akun merchant pribadi, pastikan file server/certs/espay-public.pub sudah diunggah ke portal Sandbox Espay.\n2. Coba klik tombol \"🏢 SGWYESSISHOP (Sample Sandbox Docs)\" di atas: sample merchant ini sudah otomatis dihubungkan oleh Espay dengan sample private key di dokumentasi."
			};
			if (code.startsWith("4") || msg.includes("bad request") || msg.includes("invalid") || raw.includes("invalid")) return {
				title: "Format Parameter Tidak Sesuai (Bad Request)",
				description: "Server Espay menolak salah satu parameter dalam payload body request.",
				fix: "Buka tab \"Asymmetric Signature & Request\" atau \"Raw JSON\" di bawah untuk melihat request parameter."
			};
			return {
				title: "Gagal Memproses Transaksi Espay",
				description: log?.message || "Gateway Espay mengembalikan status error.",
				fix: "Buka tab \"Asymmetric Signature & Request\" atau \"Raw JSON\" di bawah untuk melihat detail respon dan parameter request."
			};
		}
		const errorDiagnosis = computed(() => getErrorDiagnosis(logData.value));
		async function handleRequestEspay({ paymentMethod = "qris", onSuccess, onError } = {}) {
			logStatus.value = "loading";
			const methodLabel = paymentMethod.startsWith("va") ? "Virtual Account" : "QRIS";
			logData.value = {
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID"),
				method: paymentMethod,
				merchantId: selectedMerchant.value,
				message: `Mengirim request ${methodLabel} ke Espay Sandbox (${selectedMerchant.value})...`,
				debug: null
			};
			try {
				const res = await $fetch$2("/api/simulasi-create", {
					method: "POST",
					body: {
						method: paymentMethod,
						amount: ticketAmount.value,
						merchantId: selectedMerchant.value,
						customerName: dummyUser.name,
						customerEmail: dummyUser.email,
						customerPhone: dummyUser.phone
					}
				});
				if (Boolean(res && (res.status === "success" || res.va_number || res.debug?.errorCode === "0000" || res.debug?.responseCode === "0000"))) {
					logStatus.value = "success";
					logData.value = {
						timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID"),
						method: paymentMethod,
						merchantId: selectedMerchant.value,
						httpStatus: 200,
						responseCode: res.debug?.responseCode || res.debug?.errorCode || "0000",
						message: `${methodLabel} Berhasil Diterbitkan dari Espay Sandbox!`,
						orderId: res.order_id,
						raw: res,
						debug: res.debug
					};
					activePaymentResult.value = res;
					transactionIdGlobal.value = res.order_id;
					if (onSuccess) onSuccess(res);
					showToastMsg(`${methodLabel} berhasil diterbitkan dari Espay Sandbox!`, "success");
				} else {
					logStatus.value = "error";
					logData.value = {
						timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID"),
						method: paymentMethod,
						merchantId: selectedMerchant.value,
						httpStatus: res?.debug?.httpStatus || 400,
						responseCode: res?.debug?.responseCode || res?.debug?.errorCode || "ERROR",
						message: res?.message || `Gagal menerbitkan ${methodLabel} dari Espay.`,
						raw: res,
						debug: res?.debug
					};
					if (onError) onError(res);
					showToastMsg(res?.message || `Gagal menerbitkan ${methodLabel} dari Espay.`, "error");
				}
			} catch (err) {
				const errData = err?.data || {};
				logStatus.value = "error";
				logData.value = {
					timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID"),
					method: paymentMethod,
					merchantId: selectedMerchant.value,
					httpStatus: err.statusCode || errData?.debug?.httpStatus || 500,
					responseCode: errData?.debug?.responseCode || "CONN_ERROR",
					message: errData.message || err.message || "Koneksi ke gateway Espay gagal.",
					raw: errData || err.message,
					debug: errData.debug || null
				};
				if (onError) onError(err);
				showToastMsg(errData.message || err.message || "Terjadi kesalahan sistem saat menghubungi gateway.", "error");
			}
		}
		async function handlePaymentSuccess(orderId) {
			transactionIdGlobal.value = orderId;
			lastPaidData.value = { ...activePaymentResult.value };
			try {
				ticketQrUrl.value = await QRCode.toDataURL(`TKT-${orderId}`, {
					width: 300,
					margin: 1
				});
			} catch (e) {}
			if (printAudio.value) try {
				printAudio.value.currentTime = 0;
				printAudio.value.play().catch(() => {});
			} catch (e) {}
			isPrinting.value = true;
			await new Promise((resolve) => setTimeout(resolve, 3500));
			isPrinting.value = false;
			currentStep.value = "sukses";
		}
		const isSimulatingPay = ref(false);
		function handleResetPayment() {
			activePaymentResult.value = null;
			transactionIdGlobal.value = "";
			ticketQrUrl.value = "";
			isPrinting.value = false;
			currentStep.value = "bayar";
			showToastMsg("Simulator siap untuk pengujian baru.", "success");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "simulation-page" }, _attrs))} data-v-8ca51bba><audio src="/printer.mp3" preload="auto" data-v-8ca51bba></audio><header class="simulator-topbar" data-v-8ca51bba><div class="topbar-inner" data-v-8ca51bba><div class="topbar-left" data-v-8ca51bba>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: "brand-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="brand-logo" data-v-8ca51bba${_scopeId}>T</div><div class="brand-text" data-v-8ca51bba${_scopeId}><span class="brand-title" data-v-8ca51bba${_scopeId}>Tyket.id</span><span class="brand-sub" data-v-8ca51bba${_scopeId}>Sandbox Environment</span></div>`);
					else return [createVNode("div", { class: "brand-logo" }, "T"), createVNode("div", { class: "brand-text" }, [createVNode("span", { class: "brand-title" }, "Tyket.id"), createVNode("span", { class: "brand-sub" }, "Sandbox Environment")])];
				}),
				_: 1
			}, _parent));
			_push(`<span class="topbar-separator" data-v-8ca51bba></span><span class="sandbox-badge" data-v-8ca51bba><span class="pulse-dot" data-v-8ca51bba></span> Simulasi Gateway Espay </span></div><div class="topbar-right" data-v-8ca51bba>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/espay-flow",
				class: "btn-tracer-link",
				style: {
					"background": "rgba(56, 189, 248, 0.15)",
					"border": "1px solid rgba(56, 189, 248, 0.4)",
					"color": "#38bdf8",
					"font-weight": "700",
					"padding": "6px 14px",
					"border-radius": "8px",
					"font-size": "13px",
					"text-decoration": "none",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				}
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` ⚡ Visualizer Listrik `);
					else return [createTextVNode(" ⚡ Visualizer Listrik ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/s1u2p3e4r5",
				class: "btn-master-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` 👑 Ruang Master `);
					else return [createTextVNode(" 👑 Ruang Master ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></header>`);
			if (toastMessage.value) _push(`<div class="${ssrRenderClass([toastType.value === "success" ? "toast-success" : "toast-error", "toast-message"])}" data-v-8ca51bba>${ssrInterpolate(toastMessage.value)}</div>`);
			else _push(`<!---->`);
			_push(`<div class="container" data-v-8ca51bba><div class="sim-event-banner" data-v-8ca51bba><div class="sim-event-media" data-v-8ca51bba><img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&amp;auto=format&amp;fit=crop&amp;q=80" alt="Poster Festival Musik" class="sim-poster-img" data-v-8ca51bba><div class="sim-badge-overlay" data-v-8ca51bba>UJI COBA RESMI</div></div><div class="sim-event-meta" data-v-8ca51bba><span class="sim-tag" data-v-8ca51bba>Event Musik &amp; Ekspo</span><h1 class="sim-title" data-v-8ca51bba>${ssrInterpolate(dummyEventData.nama_event)}</h1><p class="sim-loc" data-v-8ca51bba>📍 ${ssrInterpolate(dummyEventData.lokasi)} • 19:00 WIB</p></div></div>`);
			if (currentStep.value === "bayar" && !activePaymentResult.value) {
				_push(`<div class="sim-config-card" data-v-8ca51bba><div class="auto-user-box" data-v-8ca51bba><div class="auto-user-avatar" data-v-8ca51bba>BP</div><div class="auto-user-info" data-v-8ca51bba><div class="auto-user-name" data-v-8ca51bba><span data-v-8ca51bba>${ssrInterpolate(dummyUser.name)}</span><span class="auto-badge" data-v-8ca51bba>Otomatis Terisi</span></div><div class="auto-user-meta" data-v-8ca51bba>${ssrInterpolate(dummyUser.email)} • ${ssrInterpolate(dummyUser.phone)}</div></div></div><div class="nominal-preset-section" data-v-8ca51bba><div class="preset-label" data-v-8ca51bba><span data-v-8ca51bba>Pilih Nominal Tiket Pengujian:</span><strong data-v-8ca51bba>Rp ${ssrInterpolate(formatPrice(ticketAmount.value))}</strong></div><div class="preset-buttons-grid" data-v-8ca51bba><!--[-->`);
				ssrRenderList([
					1e4,
					25e3,
					5e4,
					1e5
				], (amt) => {
					_push(`<button type="button" class="${ssrRenderClass(["preset-btn", ticketAmount.value === amt ? "active" : ""])}" data-v-8ca51bba> Rp ${ssrInterpolate(amt / 1e3)}rb </button>`);
				});
				_push(`<!--]--></div></div></div>`);
			} else _push(`<!---->`);
			if (currentStep.value === "bayar") {
				_push(`<div class="step-content active step-padded" data-v-8ca51bba>`);
				_push(ssrRenderComponent(CheckoutPayment_default, {
					grandTotal: grandTotalCalculated.value,
					totalQty: 1,
					totalPrice: ticketAmount.value,
					adminFee: 2e3,
					kodeUnik: 0,
					donasiAmount: 0,
					daftarPeserta: daftarPeserta.value,
					isEspayActive: true,
					espayMethods: {
						qris: true,
						va_bca: true,
						va_mandiri: true,
						va_bri: true,
						va_bni: false
					},
					eventData: dummyEventData,
					initialPaymentResult: activePaymentResult.value,
					onRequestEspay: handleRequestEspay,
					onPaymentSuccess: handlePaymentSuccess,
					onResetPayment: handleResetPayment,
					onCancelOrder: handleResetPayment,
					onToast: showToastMsg
				}, null, _parent));
				if (activePaymentResult.value) {
					_push(`<div class="sim-sandbox-pay-box" data-v-8ca51bba><div class="sim-pay-badge-row" data-v-8ca51bba><span class="badge-sandbox-mode" data-v-8ca51bba>⚡ UJI COBA PEMBAYARAN</span><span class="sim-order-id-tag" data-v-8ca51bba>Order ID: <strong data-v-8ca51bba>${ssrInterpolate(activePaymentResult.value.order_id)}</strong></span></div><h3 class="sim-pay-title" data-v-8ca51bba>Simulasikan Pembeli Membayar</h3><p class="sim-pay-desc" data-v-8ca51bba> Di Sandbox, Anda tidak perlu transfer uang sungguhan. Klik tombol di bawah untuk menyimulasikan pembayaran lunas dan menguji alur otomatisasi tiket Tyket: </p><div class="sim-pay-btn-row" data-v-8ca51bba><button type="button"${ssrIncludeBooleanAttr(isSimulatingPay.value) ? " disabled" : ""} class="btn-trigger-pay" data-v-8ca51bba>`);
					if (isSimulatingPay.value) _push(`<span class="spinner-small" data-v-8ca51bba></span>`);
					else _push(`<span class="btn-text-icon" data-v-8ca51bba><svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-8ca51bba><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-8ca51bba></path></svg> ⚡ Simulasikan Pembayaran Sukses (Terbitkan E-Ticket) </span>`);
					_push(`</button></div><div class="sim-pay-portal-note" data-v-8ca51bba><small data-v-8ca51bba>💡 <strong data-v-8ca51bba>Atau via Portal Resmi Espay:</strong> Login ke portal sandbox Espay → Masuk menu <strong data-v-8ca51bba>Collection / Temp Report</strong> → Pilih transaksi → Klik tombol <strong data-v-8ca51bba>&quot;Update to Success with Notification&quot;</strong>.</small></div></div>`);
				} else _push(`<!---->`);
				_push(`<div id="debug-log-card" class="${ssrRenderClass([`status-${logStatus.value}`, "debug-console-card"])}" data-v-8ca51bba><div class="console-header" data-v-8ca51bba><div class="console-title-wrap" data-v-8ca51bba><div class="${ssrRenderClass([`pulse-${logStatus.value}`, "console-pulse"])}" data-v-8ca51bba></div><div class="console-title-texts" data-v-8ca51bba><h3 class="console-title" data-v-8ca51bba>Log Respon Gateway Espay</h3><span class="console-subtitle" data-v-8ca51bba>Pantau status respon asli &amp; generator QRIS Sandbox</span></div></div><div class="${ssrRenderClass([`badge-${logStatus.value}`, "console-status-badge"])}" data-v-8ca51bba>`);
				if (logStatus.value === "idle") _push(`<span data-v-8ca51bba>⚪ Menunggu Trigger</span>`);
				else if (logStatus.value === "loading") _push(`<span data-v-8ca51bba>🟡 Memproses...</span>`);
				else if (logStatus.value === "success") _push(`<span data-v-8ca51bba>🟢 200 OK (Berhasil)</span>`);
				else if (logStatus.value === "error") _push(`<span data-v-8ca51bba>🔴 GAGAL ${ssrInterpolate(logData.value?.responseCode || logData.value?.httpStatus || "")}</span>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="console-actions-bar" data-v-8ca51bba><div class="actions-left" data-v-8ca51bba><span class="action-meta-tag" data-v-8ca51bba> Metode: <strong data-v-8ca51bba>${ssrInterpolate(logData.value?.method?.toUpperCase() || "QRIS")}</strong></span><span class="action-meta-tag" data-v-8ca51bba> Merchant ID: <strong data-v-8ca51bba>${ssrInterpolate(selectedMerchant.value)}</strong></span>`);
				if (logData.value?.timestamp) _push(`<span class="action-time-tag" data-v-8ca51bba> 🕒 ${ssrInterpolate(logData.value.timestamp)}</span>`);
				else _push(`<!---->`);
				_push(`</div><div class="actions-right" data-v-8ca51bba>`);
				if (logData.value) {
					_push(`<button type="button" class="btn-console-tool" title="Salin Log JSON ke Clipboard" data-v-8ca51bba>`);
					if (copied.value) _push(`<span data-v-8ca51bba>✓ Tersalin!</span>`);
					else _push(`<span data-v-8ca51bba>📋 Salin JSON</span>`);
					_push(`</button>`);
				} else _push(`<!---->`);
				if (logData.value) _push(`<button type="button" class="btn-console-tool btn-tool-clear" title="Bersihkan Log" data-v-8ca51bba> 🗑️ Bersihkan </button>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="merchant-switch-row" data-v-8ca51bba><span class="m-switch-label" data-v-8ca51bba>Target Merchant Sandbox:</span><div class="m-switch-buttons" data-v-8ca51bba><button type="button" class="${ssrRenderClass(["btn-m-switch", selectedMerchant.value === "SGWYESSISHOP" ? "active" : ""])}" data-v-8ca51bba> 🏢 SGWYESSISHOP <small data-v-8ca51bba>(Sample Sandbox Docs)</small></button><button type="button" class="${ssrRenderClass(["btn-m-switch", selectedMerchant.value === (envInfo.value?.commCode || "SGWZULKARNAENALMUHAMMADY") ? "active" : ""])}" data-v-8ca51bba> 👤 ${ssrInterpolate(envInfo.value?.commCode || "SGWZULKARNAENALMUHAMMADY")} <small data-v-8ca51bba>(Akun .env)</small></button></div></div>`);
				if (logStatus.value === "error" && errorDiagnosis.value) _push(`<div class="diagnosis-banner" data-v-8ca51bba><div class="diagnosis-icon-wrap" data-v-8ca51bba><svg class="diag-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-8ca51bba><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-8ca51bba></path></svg></div><div class="diagnosis-body" data-v-8ca51bba><div class="diagnosis-title" data-v-8ca51bba>${ssrInterpolate(errorDiagnosis.value.title)}</div><p class="diagnosis-desc" data-v-8ca51bba>${ssrInterpolate(errorDiagnosis.value.description)}</p><div class="diagnosis-fix-box" data-v-8ca51bba><span class="fix-label" data-v-8ca51bba>💡 Solusi &amp; Rekomendasi:</span><p class="fix-text" data-v-8ca51bba>${ssrInterpolate(errorDiagnosis.value.fix)}</p></div></div></div>`);
				else _push(`<!---->`);
				_push(`<div class="console-tabs-nav" data-v-8ca51bba><button type="button" class="${ssrRenderClass(["console-tab-btn", activeTab.value === "summary" ? "active" : ""])}" data-v-8ca51bba> 📊 Ringkasan </button><button type="button" class="${ssrRenderClass(["console-tab-btn", activeTab.value === "raw" ? "active" : ""])}" data-v-8ca51bba> 📄 Raw JSON </button><button type="button" class="${ssrRenderClass(["console-tab-btn", activeTab.value === "signature" ? "active" : ""])}" data-v-8ca51bba> 🔑 Headers &amp; Signature Request </button><button type="button" class="${ssrRenderClass(["console-tab-btn", activeTab.value === "env" ? "active" : ""])}" data-v-8ca51bba> ⚙️ Konfigurasi .env </button></div>`);
				if (activeTab.value === "summary") {
					_push(`<div class="console-panel" data-v-8ca51bba>`);
					if (logStatus.value === "idle") _push(`<div class="console-empty-state" data-v-8ca51bba><div class="empty-icon" data-v-8ca51bba>⚡</div><div class="empty-title" data-v-8ca51bba>Siap untuk Pengujian Gateway</div><p class="empty-desc" data-v-8ca51bba> Pilih metode pembayaran (misal <strong data-v-8ca51bba>QRIS</strong>) lalu klik tombol <strong data-v-8ca51bba>&quot;BAYAR SEKARANG&quot;</strong> di atas. Log respon asli, kode status, dan diagnosa kegagalan dari Espay Sandbox akan otomatis muncul di sini. </p><button type="button" class="btn-trigger-quick" data-v-8ca51bba> 🚀 Test QRIS Langsung Sekarang </button></div>`);
					else {
						_push(`<div class="summary-grid" data-v-8ca51bba><div class="summary-item full-width" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>Pesan Respon</span><span class="${ssrRenderClass([logStatus.value === "error" ? "text-red" : "text-green", "s-value font-bold"])}" data-v-8ca51bba>${ssrInterpolate(logData.value?.message || "-")}</span></div><div class="summary-item" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>Kode Respon Espay</span><span class="${ssrRenderClass([logStatus.value === "error" ? "code-error" : "code-success", "s-value code-pill"])}" data-v-8ca51bba>${ssrInterpolate(logData.value?.responseCode || "-")}</span></div><div class="summary-item" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>HTTP Status</span><span class="s-value font-mono" data-v-8ca51bba>${ssrInterpolate(logData.value?.httpStatus || "-")}</span></div><div class="summary-item" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>Order ID Simulasi</span><span class="s-value font-mono" data-v-8ca51bba>${ssrInterpolate(logData.value?.orderId || logData.value?.raw?.order_id || "-")}</span></div><div class="summary-item" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>Metode Pembayaran</span><span class="s-value font-mono uppercase" data-v-8ca51bba>${ssrInterpolate(logData.value?.method || "QRIS")}</span></div>`);
						if (logData.value?.raw?.referenceNo) _push(`<div class="summary-item full-width" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>Reference No Espay</span><span class="s-value font-mono text-green" data-v-8ca51bba>${ssrInterpolate(logData.value.raw.referenceNo)}</span></div>`);
						else _push(`<!---->`);
						_push(`<div class="summary-item full-width highlight-callback" data-v-8ca51bba><div class="callback-header-row" data-v-8ca51bba><span class="s-label" data-v-8ca51bba>🔗 Target Callback Webhook Inquiry</span><button type="button" class="btn-copy-cb" title="Salin URL Callback Inquiry" data-v-8ca51bba> 📋 Salin </button></div><span class="s-value font-mono text-amber" data-v-8ca51bba>${ssrInterpolate(currentOrigin.value)}/api/webhook/espay-inquiry </span><span class="s-subtext text-emerald-600" data-v-8ca51bba> 💡 Pastikan URL ini dimasukkan ke kolom <strong data-v-8ca51bba>Inquiry URL</strong> di Portal Sandbox Espay lalu klik <strong data-v-8ca51bba>Submit/Save</strong>. </span></div></div>`);
					}
					_push(`</div>`);
				} else _push(`<!---->`);
				if (activeTab.value === "raw") _push(`<div class="console-panel" data-v-8ca51bba><pre class="json-code-block" data-v-8ca51bba>${ssrInterpolate(formatJson(logData.value?.raw || logData.value || {
					status: "idle",
					note: "Belum ada request yang dijalankan"
				}))}</pre></div>`);
				else _push(`<!---->`);
				if (activeTab.value === "signature") {
					_push(`<div class="console-panel" data-v-8ca51bba>`);
					if (!logData.value?.debug) _push(`<div class="no-step-data" data-v-8ca51bba> Belum ada data eksekusi signature. Klik &quot;BAYAR SEKARANG&quot; untuk merekam StringToSign dan Header yang dikirim ke Espay. </div>`);
					else {
						_push(`<div class="step-detail-box" data-v-8ca51bba><div class="step-meta-row" data-v-8ca51bba><span class="step-badge" data-v-8ca51bba>POST</span><span class="step-url" data-v-8ca51bba>${ssrInterpolate(logData.value.debug.url || "/api/v1.0/qr/qr-mpm-generate")}</span></div><div class="step-subhead" data-v-8ca51bba>1. Perbandingan Headers HTTP (Sample Docs vs Terkirim):</div><div class="compare-grid" data-v-8ca51bba><div class="compare-col" data-v-8ca51bba><span class="compare-title title-sample" data-v-8ca51bba>📋 Sample Headers (Dokumentasi Espay)</span><pre class="json-code-block border-sample" data-v-8ca51bba>${ssrInterpolate(formatJson(logData.value.debug.sampleHeaders))}</pre></div><div class="compare-col" data-v-8ca51bba><span class="compare-title title-actual" data-v-8ca51bba>🚀 Actual Headers Sent (Aplikasi Kita)</span><pre class="json-code-block border-actual" data-v-8ca51bba>${ssrInterpolate(formatJson(logData.value.debug.headersSent))}</pre></div></div><div class="step-subhead" data-v-8ca51bba>2. Perbandingan Parameter Request (Sample Docs vs Terkirim):</div><div class="compare-grid" data-v-8ca51bba><div class="compare-col" data-v-8ca51bba><span class="compare-title title-sample" data-v-8ca51bba>📋 Sample Request (Dokumentasi Espay)</span><pre class="json-code-block border-sample" data-v-8ca51bba>${ssrInterpolate(formatJson(logData.value.debug.sampleRequest))}</pre></div><div class="compare-col" data-v-8ca51bba><span class="compare-title title-actual" data-v-8ca51bba>🚀 Actual Request Sent (Aplikasi Kita)</span><pre class="json-code-block border-actual" data-v-8ca51bba>${ssrInterpolate(formatJson(logData.value.debug.formDataSent || logData.value.debug.bodySent))}</pre></div></div><div class="step-subhead" data-v-8ca51bba>3. Target Endpoint Callback Webhook:</div><div class="webhook-info-box" data-v-8ca51bba><div class="webhook-row" data-v-8ca51bba><span class="webhook-k" data-v-8ca51bba>Inquiry Callback URL (Dipanggil Espay saat Send Invoice):</span><div class="webhook-val-wrap" data-v-8ca51bba><span class="webhook-v font-mono text-amber" data-v-8ca51bba>${ssrInterpolate(currentOrigin.value)}/api/webhook/espay-inquiry</span><button type="button" class="btn-copy-cb-sm" data-v-8ca51bba>Salin</button></div></div><div class="webhook-row" data-v-8ca51bba><span class="webhook-k" data-v-8ca51bba>Payment Notification URL (Dipanggil Espay saat Lunas):</span><div class="webhook-val-wrap" data-v-8ca51bba><span class="webhook-v font-mono text-green" data-v-8ca51bba>${ssrInterpolate(currentOrigin.value)}/api/webhook/espay</span><button type="button" class="btn-copy-cb-sm" data-v-8ca51bba>Salin</button></div></div><div class="webhook-note" data-v-8ca51bba> ℹ️ <strong data-v-8ca51bba>Catatan Penting:</strong> Server Espay Sandbox memanggil Callback Inquiry ke URL yang disimpan di <strong data-v-8ca51bba>Portal Merchant Sandbox Espay</strong> Anda. Pastikan kolom Inquiry URL di portal sudah diisi dengan link tunnel/domain publik Anda (misal Pinggy/Ngrok) dan sudah tersimpan. </div></div>`);
						if (logData.value.debug.rawStringToSign) _push(`<div class="step-subhead" data-v-8ca51bba>4. StringToSign Hash-Based (Send Invoice):</div>`);
						else _push(`<!---->`);
						if (logData.value.debug.rawStringToSign) _push(`<pre class="json-code-block single-line" data-v-8ca51bba>${ssrInterpolate(logData.value.debug.rawStringToSign)}</pre>`);
						else _push(`<!---->`);
						if (logData.value.debug.stringToSign) _push(`<div class="step-subhead" data-v-8ca51bba>4. StringToSign Asymmetric (SNAP QRIS):</div>`);
						else _push(`<!---->`);
						if (logData.value.debug.stringToSign) _push(`<pre class="json-code-block single-line" data-v-8ca51bba>${ssrInterpolate(logData.value.debug.stringToSign)}</pre>`);
						else _push(`<!---->`);
						if (logData.value.debug.bodyHash) _push(`<div class="step-subhead" data-v-8ca51bba>Body SHA-256 (Lowercase Hex):</div>`);
						else _push(`<!---->`);
						if (logData.value.debug.bodyHash) _push(`<pre class="json-code-block single-line" data-v-8ca51bba>${ssrInterpolate(logData.value.debug.bodyHash)}</pre>`);
						else _push(`<!---->`);
						_push(`<div class="step-subhead" data-v-8ca51bba>5. Hasil Respon dari Server Espay Sandbox:</div><pre class="${ssrRenderClass([logData.value.httpStatus === 200 ? "border-green" : "border-red", "json-code-block"])}" data-v-8ca51bba>${ssrInterpolate(formatJson(logData.value.debug.responseRaw || logData.value.raw))}</pre></div>`);
					}
					_push(`</div>`);
				} else _push(`<!---->`);
				if (activeTab.value === "env") _push(`<div class="console-panel" data-v-8ca51bba><div class="env-info-grid" data-v-8ca51bba><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>ESPAY_API_URL:</span><span class="env-v font-mono" data-v-8ca51bba>${ssrInterpolate(envInfo.value?.apiUrl || "https://sandbox-api.espay.id")}</span></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>ESPAY_COMM_CODE:</span><span class="env-v font-mono" data-v-8ca51bba>${ssrInterpolate(envInfo.value?.commCode || "-")}</span></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>Inquiry Callback URL (Wajib di Portal Espay):</span><div class="webhook-val-wrap" data-v-8ca51bba><span class="env-v font-mono text-amber" data-v-8ca51bba>${ssrInterpolate(currentOrigin.value)}/api/webhook/espay-inquiry</span><button type="button" class="btn-copy-cb-sm" data-v-8ca51bba>Salin</button></div></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>Payment Notification URL (Portal Espay):</span><div class="webhook-val-wrap" data-v-8ca51bba><span class="env-v font-mono text-green" data-v-8ca51bba>${ssrInterpolate(currentOrigin.value)}/api/webhook/espay</span><button type="button" class="btn-copy-cb-sm" data-v-8ca51bba>Salin</button></div></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>Status Konfigurasi Portal:</span><span class="env-v text-amber font-medium" data-v-8ca51bba>Wajib disimpan di Portal Sandbox Espay</span></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>SNAP CLIENT ID:</span><span class="env-v font-mono" data-v-8ca51bba>${ssrInterpolate(envInfo.value?.clientId || "-")}</span></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>Status Private Key:</span><span class="${ssrRenderClass([envInfo.value?.hasPrivateKey ? "text-green" : "text-red", "env-v"])}" data-v-8ca51bba>${ssrInterpolate(envInfo.value?.hasPrivateKey ? `✅ Terpasang (${envInfo.value.privateKeyLength} bytes)` : "❌ Tidak ditemukan di server/certs/espay-private.pem")}</span></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>Status Public Key:</span><span class="${ssrRenderClass([envInfo.value?.hasPublicKey ? "text-green" : "text-muted", "env-v"])}" data-v-8ca51bba>${ssrInterpolate(envInfo.value?.hasPublicKey ? "✅ Terpasang (server/certs/espay-public.pub)" : "⚠️ Belum dipasang")}</span></div><div class="env-row" data-v-8ca51bba><span class="env-k" data-v-8ca51bba>Mode Simulator:</span><span class="env-v text-blue" data-v-8ca51bba>${ssrInterpolate(envInfo.value?.activeMode || "Direct API Sandbox (disableFallback: true)")}</span></div></div></div>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else if (currentStep.value === "sukses") {
				_push(`<div class="step-content active step-padded success-view" data-v-8ca51bba><div class="success-alert-badge" data-v-8ca51bba><div class="success-icon-circle" data-v-8ca51bba><svg class="check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-8ca51bba><polyline points="20 6 9 17 4 12" data-v-8ca51bba></polyline></svg></div><div data-v-8ca51bba><h3 data-v-8ca51bba>Pembayaran Berhasil Terverifikasi!</h3><p data-v-8ca51bba>E-Ticket resmi Anda telah terbit dan siap digunakan di lokasi acara.</p></div></div><div class="ticket-card-wrapper" data-v-8ca51bba><div class="ticket-card" data-v-8ca51bba><div class="ticket-header" data-v-8ca51bba><div class="ticket-category" data-v-8ca51bba>REGULAR PRESALE</div><div class="ticket-label" data-v-8ca51bba><svg class="label-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-8ca51bba><polyline points="20 6 9 17 4 12" data-v-8ca51bba></polyline></svg> LUNAS </div></div><div class="ticket-divider" data-v-8ca51bba><div class="dash" data-v-8ca51bba></div></div><div class="ticket-body" data-v-8ca51bba><div class="ticket-details" data-v-8ca51bba><div class="detail-box" data-v-8ca51bba><span class="detail-label" data-v-8ca51bba>NAMA PESERTA</span><span class="detail-value nama" data-v-8ca51bba>${ssrInterpolate(dummyUser.name)}</span></div><div class="detail-row" data-v-8ca51bba><div class="detail-box" data-v-8ca51bba><span class="detail-label" data-v-8ca51bba>EVENT</span><span class="detail-value event" data-v-8ca51bba>${ssrInterpolate(dummyEventData.nama_event)}</span></div><div class="detail-box text-right" data-v-8ca51bba><span class="detail-label" data-v-8ca51bba>TANGGAL</span><span class="detail-value date" data-v-8ca51bba>${ssrInterpolate(formattedToday.value)}</span></div></div><div class="detail-row mt-2" data-v-8ca51bba><div class="detail-box" data-v-8ca51bba><span class="detail-label" data-v-8ca51bba>METODE BAYAR</span><span class="detail-value uppercase" data-v-8ca51bba>${ssrInterpolate(lastPaidData.value?.payment_type === "qris" ? "QRIS NASIONAL" : lastPaidData.value?.bank_name || "VIRTUAL ACCOUNT")}</span></div><div class="detail-box text-right" data-v-8ca51bba><span class="detail-label" data-v-8ca51bba>TOTAL DIBAYAR</span><span class="detail-value text-green" data-v-8ca51bba>Rp ${ssrInterpolate(formatPrice(lastPaidData.value?.total_amount || 0))}</span></div></div></div><div class="ticket-qr-section" data-v-8ca51bba><div class="qr-box" data-v-8ca51bba>`);
				if (ticketQrUrl.value) _push(`<img${ssrRenderAttr("src", ticketQrUrl.value)} alt="QR E-Ticket" data-v-8ca51bba>`);
				else _push(`<div class="qr-loading" data-v-8ca51bba>Membuat Barcode...</div>`);
				_push(`</div><div class="ticket-id" data-v-8ca51bba>${ssrInterpolate(transactionIdGlobal.value)}</div><small class="ticket-note" data-v-8ca51bba>Tunjukkan kode QR ini ke petugas saat masuk</small></div></div></div></div><div class="action-buttons-box" data-v-8ca51bba><button class="btn-repeat-test" data-v-8ca51bba><svg class="btn-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-8ca51bba><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-8ca51bba></path></svg><span data-v-8ca51bba>Uji Coba Transaksi Lain (Reset)</span></button>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/s1u2p3e4r5",
					class: "btn-back-master"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Kembali ke Ruang Master `);
						else return [createTextVNode(" Kembali ke Ruang Master ")];
					}),
					_: 1
				}, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(TicketPrinterOverlay_default, {
				isSubmitting: false,
				isPrinting: isPrinting.value,
				eventData: dummyEventData,
				daftarPeserta: daftarPeserta.value,
				transactionId: transactionIdGlobal.value
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/espay-testing.vue
var _sfc_setup = espay_testing_vue_vue_type_script_setup_true_lang_default.setup;
espay_testing_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/espay-testing.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var espay_testing_default = /*#__PURE__*/ _plugin_vue_export_helper_default(espay_testing_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8ca51bba"]]);

export { espay_testing_default as default };
//# sourceMappingURL=espay-testing-Bktte_lE.mjs.map
