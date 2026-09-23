import { a as useHead$1 } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMEM7jHo.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/pages/tiket/[id].vue
var _sfc_main = {
	__name: "[id]",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ script: [{
			src: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
			defer: true
		}] });
		const ticketId = useRoute().params.id;
		const loading = ref(true);
		const error = ref("");
		const tiketData = ref(null);
		const isDownloading = ref(false);
		useSupabaseClient();
		const linkGrupWa = computed(() => {
			return tiketData.value?.event?.settings?.link_grup_wa || null;
		});
		const formatWaLink = (no) => {
			if (!no) return "#";
			let hp = no.replace(/\D/g, "");
			if (hp.startsWith("0")) hp = "62" + hp.substring(1);
			return `https://wa.me/${hp}`;
		};
		const organizerData = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "ticket-wrapper" }, _attrs))} data-v-01e10bbb><div class="ticket-container" data-v-01e10bbb>`);
			if (loading.value) _push(`<div class="state-msg" data-v-01e10bbb>⏳ Mengambil Data Tiket...</div>`);
			else if (error.value) _push(`<div class="state-msg error" data-v-01e10bbb>${ssrInterpolate(error.value)}</div>`);
			else {
				_push(`<div class="content-box" data-v-01e10bbb><div class="${ssrRenderClass([tiketData.value.status_bayar === "paid" ? "paid" : "pending", "status-badge"])}" data-v-01e10bbb>${ssrInterpolate(tiketData.value.status_bayar === "paid" ? "✅ LUNAS" : "⏳ MENUNGGU PEMBAYARAN")}</div><h2 class="event-title" data-v-01e10bbb>${ssrInterpolate(tiketData.value.event?.nama_event || "Event")}</h2><p class="ticket-type" data-v-01e10bbb>E-Ticket Preview</p>`);
				if (tiketData.value.status_bayar === "paid") _push(`<div class="ticket-card-wrapper" style="${ssrRenderStyle({ "margin-bottom": "25px" })}" data-v-01e10bbb><div id="ticketCard" class="ticket-card" data-v-01e10bbb><div class="stub" data-v-01e10bbb><div class="cutout" data-v-01e10bbb></div><div class="stub-text" data-v-01e10bbb>${ssrInterpolate(tiketData.value.nama_tiket)}</div><div class="perforated" data-v-01e10bbb></div></div><div class="body" data-v-01e10bbb><div class="info-group" data-v-01e10bbb><div class="nama" data-v-01e10bbb>${ssrInterpolate(tiketData.value.nama_lengkap)}</div><div class="event-info" data-v-01e10bbb><div class="nama-event" data-v-01e10bbb>${ssrInterpolate(tiketData.value.event?.nama_event)}</div><div class="tanggal" data-v-01e10bbb>${ssrInterpolate(new Date(tiketData.value.created_at).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric"
				}))}</div></div><div class="ticket-id" data-v-01e10bbb>${ssrInterpolate(tiketData.value.data_tambahan?.ticket_id || unref(ticketId))}</div></div><div class="qr-box" data-v-01e10bbb><img${ssrRenderAttr("src", `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tiketData.value.data_tambahan?.ticket_id || unref(ticketId)}`)} alt="QR Code" crossorigin="anonymous" data-v-01e10bbb></div></div></div></div>`);
				else {
					_push(`<div class="locked-box" data-v-01e10bbb><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-01e10bbb><rect x="3" y="11" width="18" height="11" rx="2" ry="2" data-v-01e10bbb></rect><path d="M7 11V7a5 5 0 0110 0v4" data-v-01e10bbb></path></svg><p style="${ssrRenderStyle({ "margin-bottom": "20px" })}" data-v-01e10bbb>Data dan bukti transfer Anda sedang <strong data-v-01e10bbb>ditinjau oleh Admin</strong>. E-Ticket akan otomatis terbuka di halaman ini setelah diverifikasi.</p>`);
					if (organizerData.value) {
						_push(`<div style="${ssrRenderStyle({
							"display": "flex",
							"gap": "10px",
							"justify-content": "center",
							"margin-top": "15px"
						})}" data-v-01e10bbb>`);
						if (organizerData.value.no_wa) _push(`<a${ssrRenderAttr("href", formatWaLink(organizerData.value.no_wa))} target="_blank" class="social-link wa" title="Hubungi WhatsApp Admin" data-v-01e10bbb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-01e10bbb><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" data-v-01e10bbb></path></svg></a>`);
						else _push(`<!---->`);
						if (organizerData.value.link_ig) _push(`<a${ssrRenderAttr("href", organizerData.value.link_ig)} target="_blank" class="social-link ig" title="Instagram Resmi" data-v-01e10bbb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-01e10bbb><rect x="2" y="2" width="20" height="20" rx="5" ry="5" data-v-01e10bbb></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" data-v-01e10bbb></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" data-v-01e10bbb></line></svg></a>`);
						else _push(`<!---->`);
						if (organizerData.value.link_web) _push(`<a${ssrRenderAttr("href", organizerData.value.link_web)} target="_blank" class="social-link web" title="Website Resmi" data-v-01e10bbb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-01e10bbb><circle cx="12" cy="12" r="10" data-v-01e10bbb></circle><line x1="2" y1="12" x2="22" y2="12" data-v-01e10bbb></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-v-01e10bbb></path></svg></a>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				}
				_push(`<div class="action-buttons" data-v-01e10bbb>`);
				if (tiketData.value.status_bayar === "paid") {
					_push(`<button${ssrIncludeBooleanAttr(isDownloading.value) ? " disabled" : ""} class="btn btn-download" data-v-01e10bbb>`);
					if (isDownloading.value) _push(`<span data-v-01e10bbb>⏳ Memproses...</span>`);
					else _push(`<span data-v-01e10bbb>📥 Unduh E-Ticket (Gambar)</span>`);
					_push(`</button>`);
				} else _push(`<!---->`);
				if (tiketData.value.status_bayar === "paid" && linkGrupWa.value) _push(`<button class="btn btn-wa" data-v-01e10bbb> 💬 Masuk Grup WhatsApp Event </button>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			}
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tiket/[id].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-01e10bbb"]]);

export { _id__default as default };
//# sourceMappingURL=_id_-BmH_dsUK.mjs.map
