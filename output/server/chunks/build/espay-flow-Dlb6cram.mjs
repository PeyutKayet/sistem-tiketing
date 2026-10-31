import { N as NuxtLink } from '../virtual/entry.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/pages/espay-flow.vue?vue&type=script&setup=true&lang.ts
var espay_flow_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "espay-flow",
	__ssrInlineRender: true,
	setup(__props) {
		const selectedBank = ref("008");
		const banks = [
			{
				code: "008",
				name: "Mandiri (008)"
			},
			{
				code: "002",
				name: "BRI (002)"
			},
			{
				code: "009",
				name: "BNI (009)"
			}
		];
		function getBankName(code) {
			const b = banks.find((x) => x.code === code);
			return b ? b.name : code;
		}
		const isTracing = ref(false);
		const isSelfTesting = ref(false);
		const step = ref(0);
		const hasStalled = ref(false);
		const durations = ref({
			client: 0,
			server: 0
		});
		const selfTestResult = ref(null);
		ref(null);
		const logEntries = ref([]);
		const isLoadingLogs = ref(false);
		const isCopied = ref(false);
		const circuitVerdictClass = computed(() => {
			if (hasStalled.value) return "verdict-error";
			if (selfTestResult.value?.success) return "verdict-ok";
			if (isTracing.value) return "verdict-tracing";
			return "verdict-idle";
		});
		const circuitVerdictText = computed(() => {
			if (hasStalled.value) return "MOGOK DI GERBANG ESPAY (0031 REJECTED)";
			if (selfTestResult.value?.success) return "WEBHOOK SEHAT (< 10MS SNAP 2002400)";
			if (isTracing.value) return "SEDANG MEMANTAU ALIRAN LISTRIK...";
			return "STANDBY / SIAP UJI";
		});
		function formatTime(iso) {
			if (!iso) return "-";
			try {
				return new Date(iso).toLocaleTimeString("id-ID", { hour12: false });
			} catch {
				return iso;
			}
		}
		const draftChatText = computed(() => {
			return `Halo Ka Wiku / Tim Espay,

Saya ingin konfirmasi hasil tracing integrasi Virtual Account Sandbox kami (Merchant: SGWZULKARNAENALMUHAMMADY).

Kami sudah melakukan pengetesan mendalam di level jaringan:
1. Ketika kami nembak sendinvoice, server kami sudah siap menerima Inquiry di URL Callback:
   - Respon Inquiry lokal kami sudah SNAP resmi (responseCode: 2002400) dan responsif dalam waktu sangat cepat (< 10ms).
2. Namun selama 5-10 detik proses sendinvoice berjalan, di web inspector tunnel (Ngrok) maupun log server kami tercatat 0 hit (tidak ada sama sekali request masuk dari IP gateway Espay).
3. Di log Espay kemarin tercatat Host masih mengarah ke dev.tyket.id dengan SERVICE_MESSAGE_RESPONSE kosong.

Apakah di sisi gateway Sandbox Espay:
- Cache routing URL Inquiry untuk merchant kami bisa di-flush / clear cache?
- Atau apakah ada IP whitelist / firewall di sisi server Sandbox Espay yang membatasi koneksi keluar ke domain/tunnel merchant?

Mohon bantuannya ya Ka agar handshake Inquiry Sandbox-nya bisa tembus. Terima kasih banyak Ka! 🙏`;
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "tracer-page" }, _attrs))} data-v-d3943b96><header class="tracer-topbar" data-v-d3943b96><div class="topbar-inner" data-v-d3943b96><div class="topbar-left" data-v-d3943b96>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/espay-testing",
				class: "brand-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="back-arrow" data-v-d3943b96${_scopeId}>←</span><div class="brand-text" data-v-d3943b96${_scopeId}><span class="brand-title" data-v-d3943b96${_scopeId}>Tyket.id • Espay Circuit Tracer</span><span class="brand-sub" data-v-d3943b96${_scopeId}>Diagnostik Visual Aliran Listrik &amp; Transaksi Realtime</span></div>`);
					else return [createVNode("span", { class: "back-arrow" }, "←"), createVNode("div", { class: "brand-text" }, [createVNode("span", { class: "brand-title" }, "Tyket.id • Espay Circuit Tracer"), createVNode("span", { class: "brand-sub" }, "Diagnostik Visual Aliran Listrik & Transaksi Realtime")])];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="topbar-right" data-v-d3943b96>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/espay-testing",
				class: "nav-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` 📱 Simulator Form `);
					else return [createTextVNode(" 📱 Simulator Form ")];
				}),
				_: 1
			}, _parent));
			_push(`<div class="${ssrRenderClass([{ active: isTracing.value || isSelfTesting.value }, "live-pill"])}" data-v-d3943b96><span class="pulse-dot" data-v-d3943b96></span> ${ssrInterpolate(isTracing.value ? "SEDANG MENGALIR..." : isSelfTesting.value ? "MENGUJI WEBHOOK..." : "STANDBY")}</div></div></div></header><div class="container" data-v-d3943b96><section class="control-card" data-v-d3943b96><div class="control-header" data-v-d3943b96><div data-v-d3943b96><h1 class="page-title" data-v-d3943b96>⚡ Visualizer Jalur &amp; Aliran Listrik Transaksi Espay</h1><p class="page-desc" data-v-d3943b96> Pantau perjalanan data byte per byte dari Browser ke Espay dan Callback Inquiry untuk mengetahui dengan tepat di mana jalur mogok. </p></div><div class="bank-selector" data-v-d3943b96><span class="selector-label" data-v-d3943b96>Pilih Bank VA:</span><div class="bank-chips" data-v-d3943b96><!--[-->`);
			ssrRenderList(banks, (b) => {
				_push(`<button class="${ssrRenderClass(["bank-chip", selectedBank.value === b.code ? "active" : ""])}"${ssrIncludeBooleanAttr(isTracing.value || isSelfTesting.value) ? " disabled" : ""} data-v-d3943b96>${ssrInterpolate(b.name)}</button>`);
			});
			_push(`<!--]--></div></div></div><div class="action-grid" data-v-d3943b96><button class="btn-action btn-trace"${ssrIncludeBooleanAttr(isTracing.value || isSelfTesting.value) ? " disabled" : ""} data-v-d3943b96><span class="btn-icon" data-v-d3943b96>⚡</span><div class="btn-text" data-v-d3943b96><strong data-v-d3943b96>Jalankan Simulasi Transaksi Asli (Trace Aliran)</strong><span data-v-d3943b96>Tembak VA ${ssrInterpolate(getBankName(selectedBank.value))} dan amati aliran listrik secara realtime</span></div>`);
			if (isTracing.value) _push(`<span class="spinner" data-v-d3943b96></span>`);
			else _push(`<!---->`);
			_push(`</button><button class="btn-action btn-probe"${ssrIncludeBooleanAttr(isTracing.value || isSelfTesting.value) ? " disabled" : ""} data-v-d3943b96><span class="btn-icon" data-v-d3943b96>🧪</span><div class="btn-text" data-v-d3943b96><strong data-v-d3943b96>Uji Tembak Mandiri Webhook Inquiry</strong><span data-v-d3943b96>Buktikan bahwa server &amp; endpoint webhook kita responsif (&lt; 10ms)</span></div>`);
			if (isSelfTesting.value) _push(`<span class="spinner" data-v-d3943b96></span>`);
			else _push(`<!---->`);
			_push(`</button></div></section><section class="circuit-section" data-v-d3943b96><div class="circuit-header" data-v-d3943b96><span class="circuit-title" data-v-d3943b96>🔌 SIRKUIT ALIRAN DATA &amp; LISTRIK REALTIME</span><span class="${ssrRenderClass([circuitVerdictClass.value, "circuit-status"])}" data-v-d3943b96> Status Jalur: <strong data-v-d3943b96>${ssrInterpolate(circuitVerdictText.value)}</strong></span></div><div class="circuit-board" data-v-d3943b96><svg class="circuit-svg" viewBox="0 0 1000 380" preserveAspectRatio="none" data-v-d3943b96><defs data-v-d3943b96><filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%" data-v-d3943b96><feGaussianBlur stdDeviation="4" result="blur" data-v-d3943b96></feGaussianBlur><feMerge data-v-d3943b96><feMergeNode in="blur" data-v-d3943b96></feMergeNode><feMergeNode in="SourceGraphic" data-v-d3943b96></feMergeNode></feMerge></filter><filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%" data-v-d3943b96><feGaussianBlur stdDeviation="4" result="blur" data-v-d3943b96></feGaussianBlur><feMerge data-v-d3943b96><feMergeNode in="blur" data-v-d3943b96></feMergeNode><feMergeNode in="SourceGraphic" data-v-d3943b96></feMergeNode></feMerge></filter><filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%" data-v-d3943b96><feGaussianBlur stdDeviation="6" result="blur" data-v-d3943b96></feGaussianBlur><feMerge data-v-d3943b96><feMergeNode in="blur" data-v-d3943b96></feMergeNode><feMergeNode in="SourceGraphic" data-v-d3943b96></feMergeNode></feMerge></filter><filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%" data-v-d3943b96><feGaussianBlur stdDeviation="4" result="blur" data-v-d3943b96></feGaussianBlur><feMerge data-v-d3943b96><feMergeNode in="blur" data-v-d3943b96></feMergeNode><feMergeNode in="SourceGraphic" data-v-d3943b96></feMergeNode></feMerge></filter></defs><path d="M 230 100 L 410 100" class="wire-base" data-v-d3943b96></path>`);
			if (step.value >= 1) _push(`<path d="M 230 100 L 410 100" class="${ssrRenderClass([{ "beam-flowing": step.value === 1 }, "wire-active beam-cyan"])}" filter="url(#glow-cyan)" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			_push(`<path d="M 590 100 L 770 100" class="wire-base" data-v-d3943b96></path>`);
			if (step.value >= 2) _push(`<path d="M 590 100 L 770 100" class="${ssrRenderClass([{ "beam-flowing": step.value === 2 }, "wire-active beam-purple"])}" filter="url(#glow-purple)" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			_push(`<path d="M 870 180 L 870 280 L 590 280" class="wire-base" data-v-d3943b96></path>`);
			if (step.value === 3 && !hasStalled.value) _push(`<path d="M 870 180 L 870 280 L 590 280" class="wire-active beam-orange beam-flowing" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			if (hasStalled.value) _push(`<path d="M 870 180 L 870 280 L 720 280" class="wire-broken beam-red" filter="url(#glow-red)" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			_push(`<path d="M 590 310 L 890 310 L 890 180" class="wire-base wire-dashed" data-v-d3943b96></path>`);
			if (isSelfTesting.value && selfTestResult.value?.success) _push(`<path d="M 500 220 L 500 160" class="wire-active beam-green beam-flowing" filter="url(#glow-green)" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			_push(`<path d="M 770 120 L 590 120" class="wire-base wire-dashed" data-v-d3943b96></path>`);
			if (step.value >= 4 && hasStalled.value) _push(`<path d="M 770 120 L 590 120" class="wire-active beam-red-dash" filter="url(#glow-red)" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			if (step.value >= 4 && !hasStalled.value) _push(`<path d="M 770 120 L 590 120" class="wire-active beam-green beam-flowing" filter="url(#glow-green)" data-v-d3943b96></path>`);
			else _push(`<!---->`);
			if (hasStalled.value) _push(`<g transform="translate(710, 265)" data-v-d3943b96><circle cx="15" cy="15" r="14" fill="#ef4444" opacity="0.3" class="pulse-ring" data-v-d3943b96></circle><polygon points="15,2 19,11 28,12 21,18 23,28 15,22 7,28 9,18 2,12 11,11" fill="#facc15" stroke="#ef4444" stroke-width="2" class="spark-rotate" data-v-d3943b96></polygon></g>`);
			else _push(`<!---->`);
			_push(`</svg><div class="nodes-grid" data-v-d3943b96><div class="${ssrRenderClass([{
				active: step.value === 1,
				done: step.value > 1
			}, "circuit-node node-client"])}" data-v-d3943b96><div class="node-icon" data-v-d3943b96>🖥️</div><div class="node-body" data-v-d3943b96><div class="node-header" data-v-d3943b96><span class="node-step" data-v-d3943b96>SIMPUL 1</span><span class="${ssrRenderClass([step.value >= 1 ? "badge-ok" : "", "node-badge"])}" data-v-d3943b96>${ssrInterpolate(step.value >= 1 ? "TERKIRIM (200 OK)" : "STANDBY")}</span></div><h3 class="node-title" data-v-d3943b96>Browser Pembeli</h3><p class="node-desc" data-v-d3943b96>Klik tombol Bayar • Kirim order ke backend</p><div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Protokol:</span><span class="metric-val" data-v-d3943b96>POST /api/simulasi-create</span></div>`);
			if (durations.value.client) _push(`<div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Durasi:</span><span class="metric-val text-cyan" data-v-d3943b96>${ssrInterpolate(durations.value.client)} ms</span></div>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="${ssrRenderClass([{
				active: step.value === 2,
				done: step.value > 2
			}, "circuit-node node-server"])}" data-v-d3943b96><div class="node-icon" data-v-d3943b96>🏢</div><div class="node-body" data-v-d3943b96><div class="node-header" data-v-d3943b96><span class="node-step" data-v-d3943b96>SIMPUL 2</span><span class="${ssrRenderClass([step.value >= 2 ? "badge-ok" : "", "node-badge"])}" data-v-d3943b96>${ssrInterpolate(step.value >= 2 ? "PROSES OK" : "STANDBY")}</span></div><h3 class="node-title" data-v-d3943b96>Server Backend Tyket</h3><p class="node-desc" data-v-d3943b96>Buat Signature SHA256 • POST sendinvoice</p><div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Target:</span><span class="metric-val" data-v-d3943b96>sandbox-api.espay.id</span></div>`);
			if (durations.value.server) _push(`<div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Durasi Total:</span><span class="${ssrRenderClass([hasStalled.value ? "text-red" : "text-cyan", "metric-val"])}" data-v-d3943b96>${ssrInterpolate(durations.value.server)} ms </span></div>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="${ssrRenderClass([{
				active: step.value === 2 || step.value === 3,
				error: hasStalled.value,
				done: step.value > 3 && !hasStalled.value
			}, "circuit-node node-espay"])}" data-v-d3943b96><div class="node-icon" data-v-d3943b96>🌐</div><div class="node-body" data-v-d3943b96><div class="node-header" data-v-d3943b96><span class="node-step" data-v-d3943b96>SIMPUL 3</span><span class="${ssrRenderClass([hasStalled.value ? "badge-error" : step.value >= 2 ? "badge-warn" : "", "node-badge"])}" data-v-d3943b96>${ssrInterpolate(hasStalled.value ? "REJECT 0031" : step.value >= 2 ? "PROCESSING" : "STANDBY")}</span></div><h3 class="node-title" data-v-d3943b96>Gateway Sandbox Espay</h3><p class="node-desc" data-v-d3943b96>Terima invoice • Wajib Handshake ke Inquiry</p><div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Handshake:</span><span class="${ssrRenderClass([hasStalled.value ? "text-red font-bold" : "", "metric-val"])}" data-v-d3943b96>${ssrInterpolate(hasStalled.value ? "❌ TIMEOUT / GAGAL" : step.value === 3 ? "⏳ Mencoba Call Webhook..." : "Standby")}</span></div>`);
			if (hasStalled.value) _push(`<div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Respon:</span><span class="metric-val text-red" data-v-d3943b96>0031 Rejected (Mitra Timeout)</span></div>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="${ssrRenderClass([{
				active: isSelfTesting.value || step.value === 3 && !hasStalled.value,
				stalled: hasStalled.value,
				done: isSelfTesting.value && selfTestResult.value?.success
			}, "circuit-node node-webhook"])}" data-v-d3943b96><div class="node-icon" data-v-d3943b96>🎯</div><div class="node-body" data-v-d3943b96><div class="node-header" data-v-d3943b96><span class="node-step" data-v-d3943b96>SIMPUL 4</span><span class="${ssrRenderClass([hasStalled.value ? "badge-error" : selfTestResult.value?.success ? "badge-ok" : "", "node-badge"])}" data-v-d3943b96>${ssrInterpolate(hasStalled.value ? "TIDAK TERSENTUH" : selfTestResult.value?.success ? "SEHAT (200 OK)" : "STANDBY")}</span></div><h3 class="node-title" data-v-d3943b96>Webhook Callback Inquiry</h3><p class="node-desc" data-v-d3943b96>Endpoint SNAP resmi penerima inquiry dari Espay</p><div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>URL Portal:</span><span class="metric-val" data-v-d3943b96>/api/webhook/espay-inquiry</span></div><div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Status Server:</span><span class="metric-val text-green" data-v-d3943b96>100% Aktif &amp; Terbuka Publik</span></div>`);
			if (selfTestResult.value) _push(`<div class="node-metric" data-v-d3943b96><span class="metric-label" data-v-d3943b96>Hasil Uji Mandiri:</span><span class="metric-val text-green" data-v-d3943b96>${ssrInterpolate(selfTestResult.value.durationMs)}ms (${ssrInterpolate(selfTestResult.value.response?.responseCode || "2002400")}) </span></div>`);
			else _push(`<!---->`);
			_push(`</div></div></div>`);
			if (hasStalled.value) _push(`<div class="stalled-alert-card" data-v-d3943b96><div class="alert-icon" data-v-d3943b96>💥</div><div class="alert-body" data-v-d3943b96><h4 class="alert-title" data-v-d3943b96>MOGOK TERDETEKSI PADA JALUR ANTARA ESPAY ➡️ WEBHOOK INQUIRY!</h4><p class="alert-desc" data-v-d3943b96> Server Espay Sandbox <strong data-v-d3943b96>tidak berhasil menghubungi</strong> endpoint Inquiry Anda. Karena Espay tidak menerima respon dalam waktu batas toleransinya, transaksi langsung di-reject dengan kode <strong data-v-d3943b96>0031 Rejected, Error komunikasi dengan Mitra</strong>. </p></div></div>`);
			else _push(`<!---->`);
			_push(`</div></section><section class="diagnostic-grid" data-v-d3943b96><div class="diag-card" data-v-d3943b96><div class="diag-card-header" data-v-d3943b96><span class="diag-badge badge-why" data-v-d3943b96>Analisis Akar Masalah</span><h3 class="diag-title" data-v-d3943b96>🔍 Mengapa Aliran Listrik Putus di Gerbang Espay?</h3></div><div class="diag-card-body" data-v-d3943b96><p class="diag-para" data-v-d3943b96> Pada arsitektur Virtual Account Dinamis Espay, ketika server kita memanggil <code data-v-d3943b96>sendinvoice</code>, Espay <strong data-v-d3943b96>secara sinkron (saat itu juga)</strong> wajib menghubungi Webhook Inquiry merchant untuk menanyakan: <em data-v-d3943b96>&quot;Berapa total tagihan dan siapa nama pemilik order ini?&quot;</em>. </p><div class="analogy-box" data-v-d3943b96><div class="analogy-title" data-v-d3943b96>💡 Analogi Sederhana:</div><p data-v-d3943b96> Kita memesan makanan via telepon ke Espay. Espay bilang: <em data-v-d3943b96>&quot;Sebentar ya, saya mau telepon balik ke nomor konfirmasi Anda.&quot;</em> Namun nomor telepon balik Anda di catatan Espay tidak bisa tersambung atau belum ter-update. Espay menunggu 5-10 detik di gagang telepon, lalu menutup telepon sambil bilang: <em data-v-d3943b96>&quot;Maaf, saya tidak bisa menghubungi nomor Anda (0031 Rejected).&quot;</em></p></div><div class="diag-points" data-v-d3943b96><div class="diag-point" data-v-d3943b96><span class="point-num" data-v-d3943b96>1</span><div data-v-d3943b96><strong data-v-d3943b96>Server Webhook Kita Tidak Salah:</strong><span data-v-d3943b96>Ketika diuji mandiri, webhook kita merespons dalam <strong data-v-d3943b96>&lt; 10ms</strong> dengan kode SNAP 2002400.</span></div></div><div class="diag-point" data-v-d3943b96><span class="point-num" data-v-d3943b96>2</span><div data-v-d3943b96><strong data-v-d3943b96>Jalur Keluar Espay Tertahan:</strong><span data-v-d3943b96>Permintaan dari gateway Sandbox Espay sama sekali tidak menembus Ngrok maupun firewall server kita.</span></div></div></div></div></div><div class="diag-card" data-v-d3943b96><div class="diag-card-header" data-v-d3943b96><span class="diag-badge badge-proof" data-v-d3943b96>Bukti Nyata</span><h3 class="diag-title" data-v-d3943b96>📋 3 Bukti Faktual dari Sistem</h3></div><div class="diag-card-body" data-v-d3943b96><div class="proof-list" data-v-d3943b96><div class="proof-item" data-v-d3943b96><div class="proof-status text-red" data-v-d3943b96>0 HIT</div><div class="proof-content" data-v-d3943b96><strong data-v-d3943b96>Log Ngrok Web Inspector (Port 4040):</strong><p data-v-d3943b96>Ngrok menyaring setiap paket TCP dari internet. Selama tombol Bayar diproses, <strong data-v-d3943b96>tidak ada 1 pun hit</strong> dari IP Espay ke <code data-v-d3943b96>/api/webhook/espay-inquiry</code>.</p></div></div><div class="proof-item" data-v-d3943b96><div class="proof-status text-red" data-v-d3943b96>0 HIT</div><div class="proof-content" data-v-d3943b96><strong data-v-d3943b96>Server Log Internal (logs/webhook-debug.log):</strong><p data-v-d3943b96>Middleware kita mencatat setiap koneksi masuk. Selama proses transaksi, tidak ada paket HTTP yang mendarat di endpoint inquiry.</p></div></div><div class="proof-item" data-v-d3943b96><div class="proof-status text-orange" data-v-d3943b96>MISMATCH</div><div class="proof-content" data-v-d3943b96><strong data-v-d3943b96>Log dari CS Espay:</strong><p data-v-d3943b96>Espay CS memperlihatkan log <code data-v-d3943b96>Host: dev.tyket.id</code> dengan <code data-v-d3943b96>SERVICE_MESSAGE_RESPONSE: &quot;&quot;</code>. Ini membuktikan gateway Sandbox Espay masih menembak URL lama (cache) atau gagal rute ke domain tersebut.</p></div></div></div></div></div></section><section class="log-section" data-v-d3943b96><div class="log-header" data-v-d3943b96><div data-v-d3943b96><h3 class="log-title" data-v-d3943b96>📡 Live Stream Webhook Activity Log</h3><p class="log-sub" data-v-d3943b96>Aktivitas koneksi HTTP yang masuk ke server Anda secara realtime</p></div><button class="btn-refresh"${ssrIncludeBooleanAttr(isLoadingLogs.value) ? " disabled" : ""} data-v-d3943b96>${ssrInterpolate(isLoadingLogs.value ? "Memuat..." : "🔄 Refresh Log")}</button></div><div class="log-table-container" data-v-d3943b96><table class="log-table" data-v-d3943b96><thead data-v-d3943b96><tr data-v-d3943b96><th data-v-d3943b96>Waktu</th><th data-v-d3943b96>Method</th><th data-v-d3943b96>Endpoint Path</th><th data-v-d3943b96>Tipe</th><th data-v-d3943b96>Keterangan</th></tr></thead><tbody data-v-d3943b96>`);
			if (logEntries.value.length === 0) _push(`<tr data-v-d3943b96><td colspan="5" class="empty-log" data-v-d3943b96>Belum ada log aktivitas terbaru.</td></tr>`);
			else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(logEntries.value, (entry, idx) => {
				_push(`<tr class="${ssrRenderClass({
					"row-inquiry": entry.isInquiry,
					"row-middleware": entry.isMiddleware
				})}" data-v-d3943b96><td class="log-time" data-v-d3943b96>${ssrInterpolate(formatTime(entry.timestamp))}</td><td data-v-d3943b96><span class="${ssrRenderClass([`method-${entry.method?.toLowerCase()}`, "method-tag"])}" data-v-d3943b96>${ssrInterpolate(entry.method)}</span></td><td class="log-path" data-v-d3943b96><code data-v-d3943b96>${ssrInterpolate(entry.path)}</code></td><td data-v-d3943b96><span class="${ssrRenderClass([entry.isInquiry ? "type-inquiry" : "type-normal", "type-tag"])}" data-v-d3943b96>${ssrInterpolate(entry.isInquiry ? "🎯 INQUIRY CALLBACK" : entry.isMiddleware ? "MID" : "API")}</span></td><td class="log-detail" data-v-d3943b96>`);
				if (entry.isInquiry) _push(`<span class="text-green font-semibold" data-v-d3943b96>Tembusan Webhook Terdeteksi!</span>`);
				else _push(`<span class="text-muted" data-v-d3943b96>Aktivitas sistem normal</span>`);
				_push(`</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div></section><section class="chat-draft-card" data-v-d3943b96><div class="draft-header" data-v-d3943b96><div data-v-d3943b96><span class="draft-badge" data-v-d3943b96>Solusi Cepat</span><h3 class="draft-title" data-v-d3943b96>💬 Teks Rekomendasi Chat untuk Mas Wiku / CS Espay</h3><p class="draft-desc" data-v-d3943b96>Salin dan kirimkan teks ini ke CS Espay agar tim teknis mereka langsung tahu apa yang harus dicek:</p></div><button class="btn-copy" data-v-d3943b96>${ssrInterpolate(isCopied.value ? "✅ Tersalin!" : "📋 Salin Pesan")}</button></div><div class="draft-box" data-v-d3943b96><pre class="draft-pre" data-v-d3943b96>${ssrInterpolate(draftChatText.value)}</pre></div></section></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/espay-flow.vue
var _sfc_setup = espay_flow_vue_vue_type_script_setup_true_lang_default.setup;
espay_flow_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/espay-flow.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var espay_flow_default = /*#__PURE__*/ _plugin_vue_export_helper_default(espay_flow_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-d3943b96"]]);

export { espay_flow_default as default };
//# sourceMappingURL=espay-flow-Dlb6cram.mjs.map
