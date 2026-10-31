import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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

//#region app/pages/admin-verify.vue
var _sfc_main = {
	__name: "admin-verify",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		route.query.id;
		route.query.token;
		const loading = ref(true);
		const isSubmitting = ref(false);
		const error = ref("");
		const orderData = ref(null);
		const showManualLink = ref(false);
		const buktiUrl = computed(() => {
			return orderData.value?.linkBukti || null;
		});
		const isPaid = computed(() => orderData.value?.status?.toLowerCase() === "paid");
		const formatPrice = (price) => {
			if (!price) return "Rp 0";
			const p = typeof price === "string" ? parseInt(price.toString().replace(/\D/g, "")) : price;
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(p || 0);
		};
		useSupabaseClient();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-wrapper" }, _attrs))} data-v-3d7cd3da><div class="admin-container" data-v-3d7cd3da>`);
			if (loading.value && !orderData.value) _push(`<div class="state-box loading" data-v-3d7cd3da><div class="spinner" data-v-3d7cd3da></div><p data-v-3d7cd3da>Memuat Data Pesanan...</p></div>`);
			else if (error.value) _push(`<div class="state-box error" data-v-3d7cd3da><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3d7cd3da><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-3d7cd3da></path></svg><p data-v-3d7cd3da>${ssrInterpolate(error.value)}</p></div>`);
			else if (orderData.value) {
				_push(`<div class="content-box" data-v-3d7cd3da><div class="header-section" data-v-3d7cd3da><div class="badge-admin" data-v-3d7cd3da>MODE ADMIN</div><h2 class="title" data-v-3d7cd3da>Verifikasi Pesanan</h2><p class="trx-id" data-v-3d7cd3da>${ssrInterpolate(orderData.value.idPesanan)}</p></div><div class="image-section" data-v-3d7cd3da>`);
				if (buktiUrl.value) _push(`<img${ssrRenderAttr("src", buktiUrl.value)} class="img-preview" alt="Bukti Transfer" data-v-3d7cd3da>`);
				else _push(`<div class="img-preview empty" data-v-3d7cd3da><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3d7cd3da><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-3d7cd3da></path></svg><p data-v-3d7cd3da>Bukti transfer tidak diunggah</p></div>`);
				if (showManualLink.value) _push(`<a${ssrRenderAttr("href", orderData.value.linkBukti)} target="_blank" class="manual-link" data-v-3d7cd3da> Buka Foto Manual ➔ </a>`);
				else _push(`<!---->`);
				_push(`</div><div class="receipt-box" data-v-3d7cd3da><div class="receipt-row" data-v-3d7cd3da><span class="lbl" data-v-3d7cd3da>Nama Pendaftar</span><span class="val" data-v-3d7cd3da>${ssrInterpolate(orderData.value.namaSiswa)}</span></div><div class="receipt-row" data-v-3d7cd3da><span class="lbl" data-v-3d7cd3da>Event</span><span class="val" data-v-3d7cd3da>${ssrInterpolate(orderData.value.kelas)}</span></div><div class="receipt-row" data-v-3d7cd3da><span class="lbl" data-v-3d7cd3da>Kategori Tiket</span><span class="val badge-ticket" data-v-3d7cd3da>${ssrInterpolate(orderData.value.paket)}</span></div><div class="receipt-row" data-v-3d7cd3da><span class="lbl" data-v-3d7cd3da>Waktu Pemesanan</span><span class="val date-text" data-v-3d7cd3da>${ssrInterpolate(orderData.value.waktu)}</span></div><div class="receipt-row total" data-v-3d7cd3da><span class="lbl" data-v-3d7cd3da>Total Transfer</span><span class="val amount" data-v-3d7cd3da>${ssrInterpolate(formatPrice(orderData.value.totalBayar))}</span></div></div><div class="status-section" data-v-3d7cd3da><span class="lbl" data-v-3d7cd3da>Status Pembayaran:</span><div class="${ssrRenderClass([isPaid.value ? "paid" : "pending", "status-pill"])}" data-v-3d7cd3da>`);
				if (isPaid.value) _push(`<svg fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-3d7cd3da><polyline points="20 6 9 17 4 12" data-v-3d7cd3da></polyline></svg>`);
				else _push(`<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-3d7cd3da><circle cx="12" cy="12" r="10" data-v-3d7cd3da></circle><polyline points="12 6 12 12 16 14" data-v-3d7cd3da></polyline></svg>`);
				_push(` ${ssrInterpolate(orderData.value.status)}</div></div><button${ssrIncludeBooleanAttr(isPaid.value || isSubmitting.value) ? " disabled" : ""} class="${ssrRenderClass([{ "btn-success": isPaid.value }, "btn-confirm"])}" data-v-3d7cd3da>`);
				if (isPaid.value) _push(`<span data-v-3d7cd3da>Pesanan Sudah Dikonfirmasi</span>`);
				else if (isSubmitting.value) _push(`<span data-v-3d7cd3da>Memproses...</span>`);
				else _push(`<span data-v-3d7cd3da>KONFIRMASI PEMBAYARAN</span>`);
				_push(`</button></div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin-verify.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var admin_verify_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-3d7cd3da"]]);

export { admin_verify_default as default };
//# sourceMappingURL=admin-verify-C-Fb-bQT.mjs.map
