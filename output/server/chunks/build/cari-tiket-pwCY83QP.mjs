import { t as components_default } from './components-D4ypgbct.mjs';
import { f as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { _ as _virtual_public__2Flogo_tyket_default } from './_virtual_public-9BLckDHy.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
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
import 'vue-router';
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

//#region app/pages/cari-tiket.vue
var _sfc_main = {
	__name: "cari-tiket",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({
			title: "Cari E-Ticket Saya | tyket.id",
			meta: [{
				name: "description",
				content: "Temukan dan unduh e-ticket resmi tyket.id Anda dengan memasukkan nomor WhatsApp dan email pendaftaran."
			}],
			script: [{
				src: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
				defer: true
			}]
		});
		const noWa = ref("");
		const email = ref("");
		const isLoading = ref(false);
		const hasSearched = ref(false);
		const orders = ref([]);
		const qrMap = ref({});
		const isDownloading = ref(false);
		const totalTicketsCount = computed(() => {
			if (!orders.value) return 0;
			return orders.value.reduce((acc, o) => acc + (o.tickets?.length || 0), 0);
		});
		const fixPosterUrl = (url) => {
			if (!url) return "https://placehold.co/400x200/F8FAFC/64748B?text=POSTER+EVENT";
			return url.replace("http://192.168.1.7:8000", "https://supabase.tyket.id").replace("http://localhost:8000", "https://supabase.tyket.id");
		};
		const formatDate = (dateStr) => {
			if (!dateStr) return "-";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric"
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "cari-wrapper" }, _attrs))} data-v-2d186889><div class="cari-container" data-v-2d186889><div class="top-nav" data-v-2d186889>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: "btn-back"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:arrow-left",
							style: { "font-size": "18px" }
						}, null, _parent, _scopeId));
						_push(`<span data-v-2d186889${_scopeId}>Kembali</span>`);
					} else return [createVNode(_component_Icon, {
						name: "lucide:arrow-left",
						style: { "font-size": "18px" }
					}), createVNode("span", null, "Kembali")];
				}),
				_: 1
			}, _parent));
			_push(`<img${ssrRenderAttr("src", _virtual_public__2Flogo_tyket_default)} alt="tyket.id" class="logo-img" data-v-2d186889></div><div class="hero-card" data-v-2d186889><div class="hero-icon-box" data-v-2d186889>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:search",
				style: {
					"font-size": "28px",
					"color": "var(--primary)"
				}
			}, null, _parent));
			_push(`</div><h1 class="hero-title" data-v-2d186889>Cari E-Ticket Saya</h1><p class="hero-subtitle" data-v-2d186889> Masukkan Nomor WhatsApp dan Email yang Anda gunakan saat mendaftar untuk mengakses e-tiket resmi Anda. </p><form class="search-form" data-v-2d186889><div class="input-group" data-v-2d186889><label class="input-label" data-v-2d186889>Nomor WhatsApp</label><div class="input-wrapper" data-v-2d186889>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:phone",
				class: "input-icon"
			}, null, _parent));
			_push(`<input type="tel"${ssrRenderAttr("value", noWa.value)} placeholder="Contoh: 08123456789" required class="form-input"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-2d186889></div></div><div class="input-group" data-v-2d186889><label class="input-label" data-v-2d186889>Alamat Email</label><div class="input-wrapper" data-v-2d186889>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:mail",
				class: "input-icon"
			}, null, _parent));
			_push(`<input type="email"${ssrRenderAttr("value", email.value)} placeholder="Contoh: nama@gmail.com" required class="form-input"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-2d186889></div></div><button type="submit" class="btn-submit"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-2d186889>`);
			if (isLoading.value) {
				_push(`<span class="btn-loading" data-v-2d186889>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:loader-2",
					class: "spin"
				}, null, _parent));
				_push(` Mencari E-Ticket... </span>`);
			} else {
				_push(`<span class="btn-text" data-v-2d186889>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: { "font-size": "18px" }
				}, null, _parent));
				_push(` Temukan Tiket Saya </span>`);
			}
			_push(`</button></form></div>`);
			if (hasSearched.value && !isLoading.value && (!orders.value || orders.value.length === 0)) {
				_push(`<div class="empty-card" data-v-2d186889><div class="empty-icon-box" data-v-2d186889>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket-x",
					style: {
						"font-size": "40px",
						"color": "#ef4444"
					}
				}, null, _parent));
				_push(`</div><h3 class="empty-title" data-v-2d186889>E-Ticket Tidak Ditemukan</h3><p class="empty-desc" data-v-2d186889> Tidak ada tiket yang cocok dengan kombinasi Nomor WhatsApp dan Email tersebut. Pastikan nomor dan email sama persis seperti saat mengisi formulir pendaftaran. </p><div class="empty-tips" data-v-2d186889><strong data-v-2d186889>💡 Tips Bantuan:</strong><ul data-v-2d186889><li data-v-2d186889>Periksa apakah nomor HP diawali 08... atau 628...</li><li data-v-2d186889>Cek typo pada alamat email Anda</li><li data-v-2d186889>Jika baru selesai transfer manual, tunggu beberapa saat hingga Admin memverifikasi</li></ul></div></div>`);
			} else _push(`<!---->`);
			if (orders.value && orders.value.length > 0) {
				_push(`<div class="results-wrapper" data-v-2d186889><div class="results-header" data-v-2d186889><h2 class="results-title" data-v-2d186889>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check-circle-2",
					style: { "color": "#16a34a" }
				}, null, _parent));
				_push(` Ditemukan ${ssrInterpolate(totalTicketsCount.value)} Tiket </h2><span class="results-subtitle" data-v-2d186889>${ssrInterpolate(orders.value.length)} Transaksi Terdaftar</span></div><!--[-->`);
				ssrRenderList(orders.value, (order, oIdx) => {
					_push(`<div class="order-card" data-v-2d186889><div class="order-event-header" data-v-2d186889>`);
					if (order.event?.poster_url) _push(`<img${ssrRenderAttr("src", fixPosterUrl(order.event.poster_url))} class="event-mini-poster" alt="Poster" data-v-2d186889>`);
					else _push(`<!---->`);
					_push(`<div class="event-header-info" data-v-2d186889><h3 class="event-name" data-v-2d186889>${ssrInterpolate(order.event?.nama_event || "Event")}</h3><div class="event-meta" data-v-2d186889>`);
					if (order.event?.tanggal_mulai) {
						_push(`<span data-v-2d186889>`);
						_push(ssrRenderComponent(_component_Icon, { name: "lucide:calendar" }, null, _parent));
						_push(` ${ssrInterpolate(formatDate(order.event.tanggal_mulai))}</span>`);
					} else _push(`<!---->`);
					if (order.event?.lokasi) {
						_push(`<span data-v-2d186889>`);
						_push(ssrRenderComponent(_component_Icon, { name: "lucide:map-pin" }, null, _parent));
						_push(` ${ssrInterpolate(order.event.lokasi)}</span>`);
					} else _push(`<!---->`);
					_push(`</div></div><div class="${ssrRenderClass([order.status_bayar === "paid" ? "pill-paid" : "pill-pending", "order-badge-pill"])}" data-v-2d186889>${ssrInterpolate(order.status_bayar === "paid" ? "LUNAS" : "MENUNGGU")}</div></div><div class="ticket-cards-list" data-v-2d186889><!--[-->`);
					ssrRenderList(order.tickets, (t, tIdx) => {
						_push(`<div${ssrRenderAttr("id", "ticketView-" + oIdx + "-" + tIdx)} class="single-ticket-item" data-v-2d186889><div class="ticket-item-top" data-v-2d186889><div class="ticket-cat-name" data-v-2d186889>${ssrInterpolate(t.nama_tiket)}</div><div class="${ssrRenderClass([order.status_bayar === "paid" ? "label-paid" : "label-pending", "ticket-status-label"])}" data-v-2d186889>`);
						_push(ssrRenderComponent(_component_Icon, { name: order.status_bayar === "paid" ? "lucide:check-circle" : "lucide:clock" }, null, _parent));
						_push(` ${ssrInterpolate(order.status_bayar === "paid" ? "E-TICKET RESMI" : "BELUM LUNAS")}</div></div><div class="ticket-body-content" data-v-2d186889><div class="participant-info" data-v-2d186889><span class="info-label" data-v-2d186889>NAMA PESERTA</span><span class="info-value" data-v-2d186889>${ssrInterpolate(t.nama_lengkap)}</span></div><div class="qr-container" data-v-2d186889><div class="qr-image-box" data-v-2d186889>`);
						if (qrMap.value[t.ticket_id]) _push(`<img${ssrRenderAttr("src", qrMap.value[t.ticket_id])} alt="QR Code" class="qr-img" data-v-2d186889>`);
						else _push(`<div class="qr-loading" data-v-2d186889>Membuat Barcode...</div>`);
						_push(`</div><div class="ticket-code-str" data-v-2d186889>${ssrInterpolate(t.ticket_id)}</div>`);
						if (t.is_scanned) {
							_push(`<div class="scanned-badge" data-v-2d186889>`);
							_push(ssrRenderComponent(_component_Icon, { name: "lucide:check" }, null, _parent));
							_push(` SUDAH CHECK-IN </div>`);
						} else _push(`<!---->`);
						_push(`</div></div></div>`);
					});
					_push(`<!--]--></div>`);
					if (order.status_bayar === "paid") {
						_push(`<div class="order-cta-box" data-v-2d186889>`);
						if (order.event?.organizer_profile?.no_wa) {
							_push(`<button class="btn-order-wa" data-v-2d186889><div class="cta-left-row" data-v-2d186889>`);
							_push(ssrRenderComponent(_component_Icon, {
								name: "lucide:message-circle",
								class: "cta-icon-lg"
							}, null, _parent));
							_push(`<div class="cta-text-wrap" data-v-2d186889><span class="cta-title" data-v-2d186889>${ssrInterpolate(order.event?.settings?.link_grup_wa ? "KABARI ADMIN & MASUK GRUP" : "KABARI ADMIN PANITIA VIA WA")}</span><span class="cta-subtitle" data-v-2d186889>1x Klik Selesai Langsung ke WhatsApp</span></div></div>`);
							_push(ssrRenderComponent(_component_Icon, {
								name: "lucide:arrow-right",
								class: "cta-arrow-sm"
							}, null, _parent));
							_push(`</button>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else {
						_push(`<div class="order-pending-box" data-v-2d186889><div style="${ssrRenderStyle({
							"display": "flex",
							"align-items": "center",
							"gap": "8px",
							"margin-bottom": "6px"
						})}" data-v-2d186889>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:clock",
							style: {
								"color": "#d97706",
								"font-size": "18px"
							}
						}, null, _parent));
						_push(`<strong style="${ssrRenderStyle({
							"font-size": "0.85rem",
							"color": "#92400e"
						})}" data-v-2d186889>Menunggu Verifikasi Pembayaran</strong></div><p style="${ssrRenderStyle({
							"font-size": "0.78rem",
							"color": "#78350f",
							"margin": "0 0 10px 0",
							"line-height": "1.4"
						})}" data-v-2d186889> Pembayaran sedang diverifikasi Admin. Kirimkan bukti transfer untuk mempercepat aktivasi: </p>`);
						if (order.event?.organizer_profile?.no_wa) {
							_push(`<button class="btn-order-pending-wa" data-v-2d186889>`);
							_push(ssrRenderComponent(_component_Icon, { name: "lucide:send" }, null, _parent));
							_push(`<span data-v-2d186889>Kirim Bukti Pembayaran via WhatsApp</span></button>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					}
					_push(`<div class="order-action-bar" data-v-2d186889>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: `/tiket/${order.order_id}`,
						class: "btn-action btn-full-ticket"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(_component_Icon, { name: "lucide:external-link" }, null, _parent, _scopeId));
								_push(`<span data-v-2d186889${_scopeId}>Buka Halaman Tiket Penuh</span>`);
							} else return [createVNode(_component_Icon, { name: "lucide:external-link" }), createVNode("span", null, "Buka Halaman Tiket Penuh")];
						}),
						_: 2
					}, _parent));
					if (order.status_bayar === "paid") {
						_push(`<button class="btn-action btn-download"${ssrIncludeBooleanAttr(isDownloading.value) ? " disabled" : ""} data-v-2d186889>`);
						_push(ssrRenderComponent(_component_Icon, { name: "lucide:download" }, null, _parent));
						_push(`<span data-v-2d186889>${ssrInterpolate(isDownloading.value ? "Memproses Unduhan..." : "Unduh Gambar Tiket (PNG)")}</span></button>`);
					} else _push(`<!---->`);
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`<footer class="cari-footer" data-v-2d186889><p data-v-2d186889>© 2026 tyket.id • Sistem Tiketing Aman &amp; Transparan</p></footer></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cari-tiket.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var cari_tiket_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-2d186889"]]);

export { cari_tiket_default as default };
//# sourceMappingURL=cari-tiket-pwCY83QP.mjs.map
