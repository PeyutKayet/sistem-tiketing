import { t as components_default } from './components-D4ypgbct.mjs';
import { c as useAsyncData, $ as $fetch$2, k as useSeoMeta$1, f as useHead$1, i as useState, C as ClientOnly, N as NuxtLink, n as navigateTo } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { u as useEventTicketCache } from './useEventTicketCache-x4oNpkfq.mjs';
import { _ as _virtual_public__2Flogo_tyket_default } from './_virtual_public-9BLckDHy.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { C as CheckoutPayment_default, T as TicketPrinterOverlay_default } from './TicketPrinterOverlay-DKYac3wV.mjs';
import { ref, withAsyncContext, computed, watch, unref, withCtx, createTextVNode, createVNode, mergeProps, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs, defineStore } from 'pinia';
import { ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrRenderAttrs, ssrRenderStyle, ssrLooseEqual, ssrRenderDynamicModel } from 'vue/server-renderer';
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
import 'fnv1a-64';
import 'object-identity';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region app/composables/useImageCompress.ts
var useImageCompress = () => {
	/**
	* Mengkompresi file gambar di sisi klien sebelum diupload
	* @param file File gambar yang akan dikompresi
	* @param maxWidth Lebar maksimum gambar setelah dikompresi (default 1080px)
	* @param quality Kualitas kompresi (0.0 - 1.0, default 0.82)
	* @param preferredFormat 'image/webp' | 'image/jpeg' (default: 'image/webp' dengan fallback jpeg)
	* @returns Promise<File> File hasil kompresi
	*/
	const compressImageFile = (file, maxWidth = 1080, quality = .82, preferredFormat = "image/webp") => {
		return new Promise((resolve, reject) => {
			if (!file.type || !file.type.startsWith("image/")) return resolve(file);
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target?.result;
				img.onload = () => {
					let width = img.width;
					let height = img.height;
					if (width > maxWidth) {
						height = Math.round(height * maxWidth / width);
						width = maxWidth;
					}
					const canvas = (void 0).createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					if (!ctx) return reject(/* @__PURE__ */ new Error("Canvas context failed"));
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = "high";
					ctx.drawImage(img, 0, 0, width, height);
					let format = preferredFormat;
					const isWebpSupported = canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
					if (format === "image/webp" && !isWebpSupported) format = "image/jpeg";
					const extension = format === "image/webp" ? ".webp" : ".jpg";
					const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}${extension}`;
					canvas.toBlob((blob) => {
						if (!blob) return reject(/* @__PURE__ */ new Error("Canvas to Blob failed"));
						resolve(new File([blob], newFileName, { type: format }));
					}, format, quality);
				};
				img.onerror = (error) => reject(error);
			};
			reader.onerror = (error) => reject(error);
		});
	};
	return { compressImageFile };
};

//#region app/utils/format.ts
var formatPrice = (price) => {
	if (price == null) return "";
	const numPrice = typeof price === "string" ? parseFloat(price) : price;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0
	}).format(numPrice);
};
var formatWaLink = (noWa) => {
	if (!noWa || noWa === "62800000000") return "#";
	let noWaBersih = String(noWa).replace(/\D/g, "");
	if (noWaBersih.startsWith("0")) noWaBersih = "62" + noWaBersih.substring(1);
	return `https://wa.me/${noWaBersih}`;
};
//#endregion
//#region app/stores/cart.ts
var useCartStore = defineStore("cart", () => {
	const keranjang = ref({});
	const donasiAmount = ref(0);
	const currentEventSlug = ref("");
	const totalQty = computed(() => {
		return Object.values(keranjang.value).reduce((sum, qty) => sum + qty, 0);
	});
	const calculateTotalPrice = (tickets = []) => {
		let total = 0;
		for (const id in keranjang.value) {
			const qty = keranjang.value[id];
			const tiket = tickets.find((t) => String(t.id) === String(id));
			if (tiket && qty > 0) total += qty * tiket.harga;
		}
		return total;
	};
	const updateKeranjang = (tiketId, change, sisaKuota, options) => {
		const idStr = String(tiketId);
		let newQty = (keranjang.value[idStr] || 0) + change;
		if (newQty < 0) newQty = 0;
		const notifyWarning = (msg) => {
			if (options?.onWarning) options.onWarning(msg);
		};
		if (newQty > sisaKuota) {
			notifyWarning(`Sisa tiket hanya ${sisaKuota}.`);
			newQty = sisaKuota;
		}
		const maxLimit = options?.maxTicketsLimit || 0;
		if (maxLimit > 0) {
			let otherQty = 0;
			for (const k in keranjang.value) if (k !== idStr) otherQty += keranjang.value[k];
			if (otherQty + newQty > maxLimit) {
				notifyWarning(`Anda hanya bisa membeli maksimal ${maxLimit} tiket per transaksi.`);
				newQty = maxLimit - otherQty;
			}
		}
		keranjang.value[idStr] = newQty;
	};
	const setDonasi = (amount) => {
		donasiAmount.value = amount >= 0 ? amount : 0;
	};
	const setEventSlug = (slug) => {
		if (currentEventSlug.value && currentEventSlug.value !== slug) resetKeranjang();
		currentEventSlug.value = slug;
	};
	const syncWithAvailableTickets = (activeTickets = []) => {
		if (!activeTickets || activeTickets.length === 0) {
			keranjang.value = {};
			return;
		}
		const validIds = new Set(activeTickets.map((t) => String(t.id)));
		for (const id in keranjang.value) if (!validIds.has(String(id))) delete keranjang.value[id];
	};
	const resetKeranjang = () => {
		keranjang.value = {};
		donasiAmount.value = 0;
	};
	return {
		keranjang,
		donasiAmount,
		currentEventSlug,
		totalQty,
		calculateTotalPrice,
		updateKeranjang,
		setDonasi,
		setEventSlug,
		syncWithAvailableTickets,
		resetKeranjang
	};
}, { persist: true });
//#endregion
//#region app/composables/useCart.ts
var useCart = (tickets, kodeUnik, adminFee = 2e3, showToast, maxTicketsLimit = ref(0)) => {
	const cartStore = useCartStore();
	const { keranjang, donasiAmount, totalQty } = storeToRefs(cartStore);
	const totalPrice = computed(() => {
		return cartStore.calculateTotalPrice(tickets.value);
	});
	const grandTotal = computed(() => {
		if (totalPrice.value === 0 && donasiAmount.value === 0) return 0;
		return totalPrice.value + donasiAmount.value + adminFee + (kodeUnik?.value || 0);
	});
	const updateKeranjang = (tiketId, change, sisaKuota) => {
		cartStore.updateKeranjang(tiketId, change, sisaKuota, {
			maxTicketsLimit: maxTicketsLimit?.value || 0,
			onWarning: (msg) => showToast(msg, "error")
		});
	};
	const resetKeranjang = () => {
		cartStore.resetKeranjang();
	};
	const setEventSlug = (slug) => {
		cartStore.setEventSlug(slug);
	};
	const syncWithAvailableTickets = (activeTickets) => {
		cartStore.syncWithAvailableTickets(activeTickets);
	};
	return {
		cartStore,
		keranjang,
		donasiAmount,
		totalQty,
		totalPrice,
		grandTotal,
		updateKeranjang,
		resetKeranjang,
		setEventSlug,
		syncWithAvailableTickets
	};
};
//#endregion
//#region app/components/event/EventHeader.vue
var _sfc_main$7 = {
	__name: "EventHeader",
	__ssrInlineRender: true,
	props: {
		eventData: {
			type: Object,
			default: () => ({})
		},
		organizerProfile: {
			type: Object,
			default: () => ({})
		},
		totalMaksimalKuota: {
			type: Number,
			default: 0
		},
		totalSisaKuota: {
			type: Number,
			default: 0
		},
		persentaseTerisi: {
			type: Number,
			default: 0
		}
	},
	setup(__props) {
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id").replace("http://localhost:8000", "https://supabase.e-tiket.web.id");
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "event-header" }, _attrs))} data-v-0736d77a><div class="header-poster-section" data-v-0736d77a><img loading="lazy"${ssrRenderAttr("src", fixPosterUrl(__props.eventData?.poster_url) || "https://placehold.co/900x900/F8FAFC/64748B?text=POSTER+EVENT")} alt="Poster Event" class="poster-image" data-v-0736d77a><h1 class="event-title" data-v-0736d77a>${ssrInterpolate(__props.eventData?.nama_event)}</h1></div><div class="info-grid" data-v-0736d77a><div class="info-card" data-v-0736d77a>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`<span class="info-text" data-v-0736d77a${_scopeId}>Memuat...</span>`);
				else return [createVNode("span", { class: "info-text" }, "Memuat...")];
			}) }, _parent));
			_push(`</div><div class="info-card" data-v-0736d77a><span class="info-text" data-v-0736d77a>${ssrInterpolate(__props.eventData?.lokasi || "Lokasi Menyusul")}</span></div></div><div class="pricing-status-card" data-v-0736d77a>`);
			if (__props.organizerProfile?.nama_organizer) _push(`<div class="organizer-mini-card" data-v-0736d77a><img${ssrRenderAttr("src", __props.organizerProfile?.logo_url ? fixPosterUrl(__props.organizerProfile.logo_url) : `https://ui-avatars.com/api/?name=${encodeURIComponent(__props.organizerProfile.nama_organizer)}&background=0F172A&color=fff&rounded=true&size=40`)} alt="Logo" class="eo-logo-mini" data-v-0736d77a><div class="organizer-mini-info" data-v-0736d77a><span class="mini-label" data-v-0736d77a>Penyelenggara</span><span class="mini-name" data-v-0736d77a>${ssrInterpolate(__props.organizerProfile.nama_organizer)}</span></div></div>`);
			else _push(`<!---->`);
			if (__props.organizerProfile?.nama_organizer) _push(`<div class="divider" data-v-0736d77a></div>`);
			else _push(`<!---->`);
			_push(`<span class="section-label" data-v-0736d77a>DESKRIPSI EVENT</span><p class="description-text" data-v-0736d77a>${ssrInterpolate(__props.eventData?.deskripsi || "Deskripsi tidak tersedia.")}</p>`);
			if (__props.totalMaksimalKuota > 0) _push(`<div data-v-0736d77a><div class="divider" data-v-0736d77a></div><div class="quota-info" data-v-0736d77a><span class="quota-label" data-v-0736d77a>SISA KUOTA</span><span class="quota-count" data-v-0736d77a><b data-v-0736d77a>${ssrInterpolate(__props.totalSisaKuota)}</b> / ${ssrInterpolate(__props.totalMaksimalKuota)}</span></div><div class="progress-bar-container" data-v-0736d77a><div class="progress-bar-fill" style="${ssrRenderStyle({ width: __props.persentaseTerisi + "%" })}" data-v-0736d77a></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/EventHeader.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var EventHeader_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-0736d77a"]]);
//#endregion
//#region app/components/event/TicketList.vue
var _sfc_main$6 = {
	__name: "EventTicketList",
	__ssrInlineRender: true,
	props: {
		tickets: {
			type: Array,
			default: () => []
		},
		keranjang: {
			type: Object,
			default: () => ({})
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	emits: ["update-keranjang"],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "ticket-list-container" }, _attrs))} data-v-67992f38>`);
			if (__props.isLoading) {
				_push(`<!--[-->`);
				ssrRenderList(2, (n) => {
					_push(`<div class="ticket-card ticket-skeleton" data-v-67992f38><div class="ticket-info" data-v-67992f38><div class="skeleton-shimmer skeleton-tkt-title" data-v-67992f38></div><div class="skeleton-shimmer skeleton-tkt-meta" data-v-67992f38></div></div><div class="ticket-actions skeleton-actions-wrap" data-v-67992f38><div class="skeleton-shimmer skeleton-tkt-btn" data-v-67992f38></div></div></div>`);
				});
				_push(`<!--]-->`);
			} else if (__props.tickets.length === 0) _push(`<div class="no-tickets-state" data-v-67992f38> Belum ada tiket yang tersedia untuk event ini. </div>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(__props.tickets, (tiket) => {
					_push(`<div class="${ssrRenderClass([{ "is-selected": (__props.keranjang[tiket.id] || 0) > 0 }, "ticket-card"])}" style="${ssrRenderStyle({ opacity: tiket.sisa_kuota <= 0 ? "0.6" : "1" })}" data-v-67992f38><div class="ticket-info" data-v-67992f38><div class="ticket-name" data-v-67992f38>${ssrInterpolate(tiket.nama_kategori)}</div><div class="ticket-meta" data-v-67992f38>`);
					_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="ticket-price" data-v-67992f38${_scopeId}>Rp ...</span>`);
						else return [createVNode("span", { class: "ticket-price" }, "Rp ...")];
					}) }, _parent));
					if (tiket.sisa_kuota > 0 || tiket.is_unlimited) _push(`<span class="ticket-quota" data-v-67992f38> Sisa: ${ssrInterpolate(tiket.is_unlimited ? "~" : tiket.sisa_kuota)}</span>`);
					else _push(`<span class="ticket-quota sold-out" data-v-67992f38> Sold Out </span>`);
					_push(`</div></div><div class="ticket-actions" data-v-67992f38><button type="button" class="action-btn btn-minus"${ssrIncludeBooleanAttr((__props.keranjang[tiket.id] || 0) <= 0) ? " disabled" : ""} aria-label="Kurangi tiket" data-v-67992f38> - </button><span class="ticket-qty" data-v-67992f38>${ssrInterpolate(__props.keranjang[tiket.id] || 0)}</span><button type="button" class="action-btn btn-plus"${ssrIncludeBooleanAttr(tiket.sisa_kuota <= 0) ? " disabled" : ""} aria-label="Tambah tiket" data-v-67992f38> + </button></div></div>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/TicketList.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var TicketList_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$6, [["__scopeId", "data-v-67992f38"]]);
//#endregion
//#region app/components/event/ParticipantForm.vue
var _sfc_main$5 = {
	__name: "EventParticipantForm",
	__ssrInlineRender: true,
	props: {
		daftarPeserta: {
			type: Array,
			required: true
		},
		customFields: {
			type: Array,
			required: true
		}
	},
	emits: ["toast"],
	setup(__props, { emit: __emit }) {
		ref({});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-4205bbcc><!--[-->`);
			ssrRenderList(__props.daftarPeserta, (peserta, index) => {
				_push(`<div class="participant-card" data-v-4205bbcc><div class="participant-header" data-v-4205bbcc><h4 class="participant-title" data-v-4205bbcc>Data Peserta Ke-${ssrInterpolate(index + 1)}</h4><span class="participant-badge" data-v-4205bbcc>${ssrInterpolate(peserta.namaTiket)}</span></div>`);
				if (index > 0) {
					_push(`<div class="copy-participant-wrap" data-v-4205bbcc><button type="button" class="btn-copy-participant" title="Salin No WA, Email &amp; Domisili dari Peserta 1" data-v-4205bbcc>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "lucide:copy",
						style: { "font-size": "13px" }
					}, null, _parent));
					_push(`<span data-v-4205bbcc>Salin kontak dari Peserta 1</span></button></div>`);
				} else _push(`<!---->`);
				_push(`<div class="form-grid" data-v-4205bbcc><!--[-->`);
				ssrRenderList(__props.customFields, (field) => {
					_push(`<div class="${ssrRenderClass([`col-span-${field.width || 12}`, "form-field-col"])}" style="${ssrRenderStyle({ gridColumn: `span ${field.width || 12}` })}" data-v-4205bbcc>`);
					if (field.type === "header") _push(`<div class="form-section-header" data-v-4205bbcc><h3 class="form-section-title" data-v-4205bbcc>${ssrInterpolate(field.label)}</h3></div>`);
					else {
						_push(`<div data-v-4205bbcc><label class="form-label" data-v-4205bbcc>${ssrInterpolate(field.label)} `);
						if (field.required) _push(`<span class="required-mark" data-v-4205bbcc>*</span>`);
						else _push(`<!---->`);
						_push(`</label>`);
						if (field.type === "phone_wa") _push(`<div class="phone-input-group-modern" data-v-4205bbcc><div class="phone-cc-badge" data-v-4205bbcc><span class="cc-plus" data-v-4205bbcc>+</span><input type="text"${ssrRenderAttr("value", peserta["_cc_" + field.field_key])} placeholder="62" class="cc-input-modern" maxlength="4" title="Kode Negara" data-v-4205bbcc></div><div class="phone-divider" data-v-4205bbcc></div><input type="tel"${ssrRenderAttr("value", peserta.jawaban[field.field_key])} placeholder="81234567890" class="phone-input-modern" data-v-4205bbcc></div>`);
						else if (field.type === "domisili_api") {
							_push(`<div style="${ssrRenderStyle({ "position": "relative" })}" data-v-4205bbcc><input type="text"${ssrRenderAttr("value", peserta.jawaban[field.field_key])} class="form-input"${ssrRenderAttr("placeholder", field.label || "Ketik nama kota/kecamatan...")} autocomplete="off" data-v-4205bbcc>`);
							if (peserta["_domisiliSugs_" + field.field_key] || peserta["_domisiliLoading_" + field.field_key]) {
								_push(`<div class="domisili-suggestions" style="${ssrRenderStyle(peserta["_showDomisili_" + field.field_key] ? null : { display: "none" })}" data-v-4205bbcc>`);
								if (peserta["_domisiliLoading_" + field.field_key]) _push(`<div class="domisili-item" style="${ssrRenderStyle({
									"color": "#e11d48",
									"font-weight": "700",
									"display": "flex",
									"align-items": "center"
								})}" data-v-4205bbcc><div class="map-pin-mini" data-v-4205bbcc></div> Mencari titik di peta... </div>`);
								else if (peserta["_domisiliSugs_" + field.field_key]) {
									_push(`<!--[--><div class="domisili-item manual" data-v-4205bbcc><svg style="${ssrRenderStyle({
										"width": "16px",
										"height": "16px",
										"display": "inline-block",
										"vertical-align": "middle",
										"margin-right": "5px"
									})}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-4205bbcc><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-4205bbcc></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-4205bbcc></path></svg> Gunakan: &quot;<b data-v-4205bbcc>${ssrInterpolate(peserta.jawaban[field.field_key])}</b>&quot; </div>`);
									if (peserta["_domisiliSugs_" + field.field_key].length === 0) _push(`<div class="domisili-item" style="${ssrRenderStyle({
										"color": "var(--text-muted)",
										"font-size": "0.75rem"
									})}" data-v-4205bbcc> Lokasi spesifik tidak ada di list peta, silakan klik tombol &#39;Gunakan&#39; di atas 👆 </div>`);
									else {
										_push(`<!--[-->`);
										ssrRenderList(peserta["_domisiliSugs_" + field.field_key], (tempat, i) => {
											_push(`<div class="domisili-item" data-v-4205bbcc>${ssrInterpolate(tempat.display_name)}</div>`);
										});
										_push(`<!--]-->`);
									}
									_push(`<!--]-->`);
								} else _push(`<!---->`);
								_push(`</div>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else if (field.type === "paragraph") _push(`<textarea rows="3" class="form-input form-textarea"${ssrRenderAttr("placeholder", field.label)} data-v-4205bbcc>${ssrInterpolate(peserta.jawaban[field.field_key])}</textarea>`);
						else if (field.type === "dropdown") {
							_push(`<select class="form-input form-select" data-v-4205bbcc><option value="" data-v-4205bbcc${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], "") : ssrLooseEqual(peserta.jawaban[field.field_key], "")) ? " selected" : ""}>Pilih Opsi...</option><!--[-->`);
							ssrRenderList(field.options, (opt, i) => {
								_push(`<option${ssrRenderAttr("value", opt)} data-v-4205bbcc${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], opt) : ssrLooseEqual(peserta.jawaban[field.field_key], opt)) ? " selected" : ""}>${ssrInterpolate(opt)}</option>`);
							});
							_push(`<!--]--></select>`);
						} else if (field.type === "multiple_choice") {
							_push(`<div class="choice-group" data-v-4205bbcc><!--[-->`);
							ssrRenderList(field.options, (opt, i) => {
								_push(`<label class="choice-label" data-v-4205bbcc><input type="radio"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(ssrLooseEqual(peserta.jawaban[field.field_key], opt)) ? " checked" : ""} class="choice-input" data-v-4205bbcc> ${ssrInterpolate(opt)}</label>`);
							});
							_push(`<!--]--></div>`);
						} else if (field.type === "checkboxes") {
							_push(`<div class="choice-group" data-v-4205bbcc><!--[-->`);
							ssrRenderList(field.options, (opt, i) => {
								_push(`<label class="choice-label" data-v-4205bbcc><input type="checkbox"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], opt) : peserta.jawaban[field.field_key]) ? " checked" : ""} class="choice-input" data-v-4205bbcc> ${ssrInterpolate(opt)}</label>`);
							});
							_push(`<!--]--></div>`);
						} else if (field.type === "linear_scale") {
							_push(`<div class="linear-scale-container" data-v-4205bbcc><div class="linear-scale-wrapper" data-v-4205bbcc><span class="scale-limit" data-v-4205bbcc>1</span><div class="scale-options" data-v-4205bbcc><!--[-->`);
							ssrRenderList(field.scaleCount || 5, (n) => {
								_push(`<label class="scale-option" data-v-4205bbcc>`);
								if (peserta.jawaban[field.field_key] === n) _push(`<span class="scale-tooltip" data-v-4205bbcc>${ssrInterpolate(n)}</span>`);
								else _push(`<!---->`);
								_push(`<input type="radio"${ssrRenderAttr("value", n)}${ssrIncludeBooleanAttr(ssrLooseEqual(peserta.jawaban[field.field_key], n)) ? " checked" : ""} class="scale-input" data-v-4205bbcc></label>`);
							});
							_push(`<!--]--></div><span class="scale-limit" data-v-4205bbcc>${ssrInterpolate(field.scaleCount || 5)}</span></div></div>`);
						} else if (field.type === "file_upload") {
							_push(`<div class="file-upload-wrapper" data-v-4205bbcc><input type="file" accept="image/*,.pdf" style="${ssrRenderStyle({ "display": "none" })}"${ssrRenderAttr("id", "file_" + index + "_" + field.field_key)} data-v-4205bbcc><label${ssrRenderAttr("for", "file_" + index + "_" + field.field_key)} class="file-upload-label" data-v-4205bbcc>`);
							if (peserta.jawaban[field.field_key]) _push(`<div class="file-icon file-icon-selected" data-v-4205bbcc><svg style="${ssrRenderStyle({
								"width": "18px",
								"height": "18px"
							})}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-4205bbcc><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-v-4205bbcc></path><polyline points="22 4 12 14.01 9 11.01" data-v-4205bbcc></polyline></svg></div>`);
							else _push(`<div class="file-icon file-icon-empty" data-v-4205bbcc><svg style="${ssrRenderStyle({
								"width": "18px",
								"height": "18px"
							})}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-4205bbcc><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-4205bbcc></path><polyline points="17 8 12 3 7 8" data-v-4205bbcc></polyline><line x1="12" y1="3" x2="12" y2="15" data-v-4205bbcc></line></svg></div>`);
							_push(`<div class="file-info" data-v-4205bbcc>`);
							if (peserta.jawaban[field.field_key]) _push(`<div class="file-name" data-v-4205bbcc>${ssrInterpolate(peserta.jawaban[field.field_key].name || "File terpilih")}</div>`);
							else _push(`<div class="file-placeholder" data-v-4205bbcc>Pilih File</div>`);
							_push(`<div class="file-hint" data-v-4205bbcc>Format JPG/PNG/PDF</div></div></label></div>`);
						} else if (field.type === "terms") _push(`<label class="terms-label" data-v-4205bbcc><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], null) : peserta.jawaban[field.field_key]) ? " checked" : ""} class="terms-input" data-v-4205bbcc><span class="terms-text" data-v-4205bbcc>${ssrInterpolate(field.termsText || field.label)}</span></label>`);
						else _push(`<input${ssrRenderAttr("type", field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text")}${ssrRenderDynamicModel(field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text", peserta.jawaban[field.field_key], null)} class="form-input"${ssrRenderAttr("placeholder", field.label)} data-v-4205bbcc>`);
						_push(`</div>`);
					}
					_push(`</div>`);
				});
				_push(`<!--]--></div></div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/ParticipantForm.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ParticipantForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-4205bbcc"]]);
//#endregion
//#region app/components/event/CheckoutStepper.vue
var _sfc_main$4 = {
	__name: "EventCheckoutStepper",
	__ssrInlineRender: true,
	props: {
		currentStep: {
			type: String,
			required: true
		},
		hasSurvey: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const stepNumber = computed(() => {
			if (props.hasSurvey) {
				if (props.currentStep === "snk" || props.currentStep === "home") return 1;
				if (props.currentStep === "form") return 2;
				if (props.currentStep === "survei") return 3;
				if (props.currentStep === "bayar" || props.currentStep === "sukses") return 4;
				return 1;
			}
			if (props.currentStep === "snk" || props.currentStep === "home") return 1;
			if (props.currentStep === "form") return 2;
			if (props.currentStep === "bayar" || props.currentStep === "sukses") return 3;
			return 1;
		});
		const getStepClass = (step) => {
			if (stepNumber.value > step) return "completed";
			if (stepNumber.value === step) return "current";
			return "pending";
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "checkout-stepper-container" }, _attrs))} data-v-977b8103>`);
			if (__props.hasSurvey) {
				_push(`<!--[--><div class="${ssrRenderClass([getStepClass(1), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103>`);
				if (stepNumber.value > 1) _push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check",
					class: "step-check-icon"
				}, null, _parent));
				else _push(`<span class="step-num" data-v-977b8103>1</span>`);
				_push(`</div><span class="step-label" data-v-977b8103>Tiket</span></div><div class="${ssrRenderClass([{ filled: stepNumber.value >= 2 }, "stepper-connector"])}" data-v-977b8103></div><div class="${ssrRenderClass([getStepClass(2), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103>`);
				if (stepNumber.value > 2) _push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check",
					class: "step-check-icon"
				}, null, _parent));
				else _push(`<span class="step-num" data-v-977b8103>2</span>`);
				_push(`</div><span class="step-label" data-v-977b8103>Data Diri</span></div><div class="${ssrRenderClass([{ filled: stepNumber.value >= 3 }, "stepper-connector"])}" data-v-977b8103></div><div class="${ssrRenderClass([getStepClass(3), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103>`);
				if (stepNumber.value > 3) _push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check",
					class: "step-check-icon"
				}, null, _parent));
				else _push(`<span class="step-num" data-v-977b8103>3</span>`);
				_push(`</div><span class="step-label" data-v-977b8103>Kuesioner</span></div><div class="${ssrRenderClass([{ filled: stepNumber.value >= 4 }, "stepper-connector"])}" data-v-977b8103></div><div class="${ssrRenderClass([getStepClass(4), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103><span class="step-num" data-v-977b8103>4</span></div><span class="step-label" data-v-977b8103> Selesai `);
				if (stepNumber.value === 4) _push(`<span class="final-step-pill" data-v-977b8103>Akhir</span>`);
				else _push(`<!---->`);
				_push(`</span></div><!--]-->`);
			} else {
				_push(`<!--[--><div class="${ssrRenderClass([getStepClass(1), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103>`);
				if (stepNumber.value > 1) _push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check",
					class: "step-check-icon"
				}, null, _parent));
				else _push(`<span class="step-num" data-v-977b8103>1</span>`);
				_push(`</div><span class="step-label" data-v-977b8103>Tiket</span></div><div class="${ssrRenderClass([{ filled: stepNumber.value >= 2 }, "stepper-connector"])}" data-v-977b8103></div><div class="${ssrRenderClass([getStepClass(2), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103>`);
				if (stepNumber.value > 2) _push(ssrRenderComponent(_component_Icon, {
					name: "lucide:check",
					class: "step-check-icon"
				}, null, _parent));
				else _push(`<span class="step-num" data-v-977b8103>2</span>`);
				_push(`</div><span class="step-label" data-v-977b8103>Data Diri</span></div><div class="${ssrRenderClass([{ filled: stepNumber.value >= 3 }, "stepper-connector"])}" data-v-977b8103></div><div class="${ssrRenderClass([getStepClass(3), "stepper-item"])}" data-v-977b8103><div class="step-icon-wrap" data-v-977b8103><span class="step-num" data-v-977b8103>3</span></div><span class="step-label" data-v-977b8103> Pembayaran `);
				if (stepNumber.value === 3) _push(`<span class="final-step-pill" data-v-977b8103>Akhir</span>`);
				else _push(`<!---->`);
				_push(`</span></div><!--]-->`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/CheckoutStepper.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var CheckoutStepper_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-977b8103"]]);
//#endregion
//#region app/components/event/B2BSurveyStep.vue
var _sfc_main$3 = {
	__name: "EventB2BSurveyStep",
	__ssrInlineRender: true,
	props: {
		eventData: {
			type: Object,
			default: () => ({})
		},
		primaryParticipant: {
			type: Object,
			default: () => ({})
		},
		isTrulyFree: {
			type: Boolean,
			default: true
		},
		isSubmitting: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		"back",
		"complete",
		"toast"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const surveyData = ref({
			jenis_kelamin: "",
			usia: "",
			profesi_pilihan: "",
			profesi_lainnya: "",
			profesi_final: "",
			minat_calm: "",
			harapan_calm: "",
			pilihan_kelas: "",
			respon_harga_reguler: "",
			respon_harga_eksklusif: "",
			mau_info_wa: "",
			no_wa_calm: "",
			setuju_dihubungi_wa: false,
			calm_tahap: 1,
			calm_harga_reguler_diuji: "Rp500.000",
			calm_harga_eksklusif_diuji: "Rp1.700.000"
		});
		const willingnessOptions = [
			"Sangat mungkin mendaftar",
			"Mungkin, tetapi perlu informasi lebih lanjut",
			"Tertarik, tetapi harga di luar anggaran",
			"Tidak berminat mendaftar pada harga tersebut"
		];
		const assignedTier = ref(null);
		const isInterested = computed(() => {
			return !!surveyData.value.minat_calm && surveyData.value.minat_calm !== "Tidak tertarik";
		});
		watch(() => props.primaryParticipant, (newVal) => {
			if (newVal && newVal.phone && !surveyData.value.no_wa_calm) surveyData.value.no_wa_calm = newVal.phone;
		}, {
			immediate: true,
			deep: true
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "b2b-survey-container" }, _attrs))} data-v-49ef3924><div class="survey-header-card" data-v-49ef3924><div class="survey-badge" data-v-49ef3924>SURVEI RISET MINAT</div><h2 class="survey-title" data-v-49ef3924>Survei Program CALM — Khazilmu</h2><p class="survey-desc" data-v-49ef3924> Khazilmu sedang mengembangkan program pembelajaran psikologi diri berbasis Al-Qur’an dan Sunnah. Agar program ini sesuai dengan kebutuhan Anda, kami ingin mendengar pendapat Anda melalui survei singkat ini (1–2 menit). </p></div><div class="survey-card" data-v-49ef3924><h3 class="section-heading" data-v-49ef3924>Profil Responden</h3><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924>1. Jenis kelamin <span class="req" data-v-49ef3924>*</span></label><div class="radio-options" data-v-49ef3924><!--[-->`);
			ssrRenderList(["Perempuan", "Laki-laki"], (item) => {
				_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.jenis_kelamin === item }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.jenis_kelamin, item)) ? " checked" : ""}${ssrRenderAttr("value", item)} data-v-49ef3924><span class="radio-text" data-v-49ef3924>${ssrInterpolate(item)}</span></label>`);
			});
			_push(`<!--]--></div></div><div class="question-group mt-4" data-v-49ef3924><label class="q-label" data-v-49ef3924>2. Usia <span class="req" data-v-49ef3924>*</span></label><div class="radio-options grid-2" data-v-49ef3924><!--[-->`);
			ssrRenderList([
				"Di bawah 18 tahun",
				"18–25 tahun",
				"26–35 tahun",
				"36–45 tahun",
				"Di atas 45 tahun"
			], (item) => {
				_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.usia === item }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.usia, item)) ? " checked" : ""}${ssrRenderAttr("value", item)} data-v-49ef3924><span class="radio-text" data-v-49ef3924>${ssrInterpolate(item)}</span></label>`);
			});
			_push(`<!--]--></div></div><div class="question-group mt-4" data-v-49ef3924><label class="q-label" data-v-49ef3924>3. Profesi / aktivitas saat ini <span class="req" data-v-49ef3924>*</span></label><div class="radio-options grid-2" data-v-49ef3924><!--[-->`);
			ssrRenderList([
				"Pelajar/mahasiswa",
				"Ibu rumah tangga",
				"Karyawan/profesional",
				"Pengusaha/freelancer",
				"Guru/dosen",
				"Lainnya"
			], (item) => {
				_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.profesi_pilihan === item }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.profesi_pilihan, item)) ? " checked" : ""}${ssrRenderAttr("value", item)} data-v-49ef3924><span class="radio-text" data-v-49ef3924>${ssrInterpolate(item === "Lainnya" ? "Lainnya..." : item)}</span></label>`);
			});
			_push(`<!--]--></div>`);
			if (surveyData.value.profesi_pilihan === "Lainnya") _push(`<div class="custom-input-box mt-2" data-v-49ef3924><input type="text"${ssrRenderAttr("value", surveyData.value.profesi_lainnya)} placeholder="Tuliskan profesi/aktivitas Anda saat ini..." class="survey-input" data-v-49ef3924></div>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="info-highlight-card" data-v-49ef3924><div class="info-badge" data-v-49ef3924>Tentang Program CALM</div><h3 class="info-title" data-v-49ef3924>Cognitive Awareness &amp; Learning to Manage Emotions</h3><p class="info-p" data-v-49ef3924> Program kelola emosi dari Khazilmu, terutama bagi Muslimah. Membantu Anda mengenali pemicu emosi, mengelola amarah dan <i data-v-49ef3924>overthinking</i>, serta menyampaikan perasaan dengan lebih baik melalui pendekatan psikologi ilmiah dan nilai sunnah. </p><div class="info-features" data-v-49ef3924><div class="feat-item" data-v-49ef3924>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:calendar",
				class: "feat-icon"
			}, null, _parent));
			_push(`<span data-v-49ef3924><b data-v-49ef3924>Durasi:</b> 2 bulan, online</span></div><div class="feat-item" data-v-49ef3924>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:book-open",
				class: "feat-icon"
			}, null, _parent));
			_push(`<span data-v-49ef3924><b data-v-49ef3924>Total materi:</b> 32 video pembelajaran, 8 live session, 8 worksheet</span></div><div class="feat-item" data-v-49ef3924>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:clock",
				class: "feat-icon"
			}, null, _parent));
			_push(`<span data-v-49ef3924><b data-v-49ef3924>Ritme belajar:</b> 4 video + 1 live session + 1 worksheet per pekan</span></div><div class="feat-item" data-v-49ef3924>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:award",
				class: "feat-icon"
			}, null, _parent));
			_push(`<span data-v-49ef3924><b data-v-49ef3924>Fasilitas:</b> Rekaman live session &amp; Sertifikat resmi kelulusan</span></div><div class="feat-item" data-v-49ef3924>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:users",
				class: "feat-icon"
			}, null, _parent));
			_push(`<span data-v-49ef3924><b data-v-49ef3924>Pengajar:</b> Psikolog, Ustadz, dan Dosen International Open University (IOU)</span></div></div><div class="info-target-box" data-v-49ef3924><span class="target-title" data-v-49ef3924>Program ini sangat cocok untuk Anda yang:</span><ul class="target-list" data-v-49ef3924><li data-v-49ef3924>Sering emosi “meledak”, lalu menyesal</li><li data-v-49ef3924>Mudah cemas atau terus memikirkan hal yang belum terjadi</li><li data-v-49ef3924>Lelah menjalani banyak peran sekaligus</li><li data-v-49ef3924>Ingin mengelola emosi secara ilmiah sekaligus sesuai syariat &amp; sunnah</li><li data-v-49ef3924>Ingin merasakan format belajar kuliah psikologi, tanpa harus kuliah bertahun-tahun</li></ul><small class="disclaimer-note" data-v-49ef3924>* Program ini bersifat edukasi, bukan pengganti konseling atau terapi medis.</small></div></div><div class="survey-card" data-v-49ef3924><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924>4. Seberapa tertarik Anda mengikuti program CALM? <span class="req" data-v-49ef3924>*</span></label><div class="radio-options vertical" data-v-49ef3924><!--[-->`);
			ssrRenderList([
				{
					val: "Sangat tertarik",
					desc: "Sangat relevan dan ingin sekali bergabung"
				},
				{
					val: "Tertarik",
					desc: "Berminat dan ingin tahu lebih banyak"
				},
				{
					val: "Masih ragu",
					desc: "Belum yakin atau perlu waktu mempertimbangkan"
				},
				{
					val: "Tidak tertarik",
					desc: "Saat ini belum membutuhkan program ini"
				}
			], (item) => {
				_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.minat_calm === item.val }, "radio-card block"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.minat_calm, item.val)) ? " checked" : ""}${ssrRenderAttr("value", item.val)} data-v-49ef3924><div class="radio-content-wrap" data-v-49ef3924><span class="radio-text font-bold" data-v-49ef3924>${ssrInterpolate(item.val)}</span><span class="radio-subtext" data-v-49ef3924>${ssrInterpolate(item.desc)}</span></div></label>`);
			});
			_push(`<!--]--></div></div></div>`);
			if (isInterested.value) {
				_push(`<div class="survey-branch-section" data-v-49ef3924><div class="survey-card" data-v-49ef3924><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924> 5. Permasalahan apa yang ingin Anda atasi, dan perubahan apa yang Anda harapkan setelah mengikuti CALM? <span class="req" data-v-49ef3924>*</span></label><p class="q-hint" data-v-49ef3924>Ceritakan secukupnya tanpa perlu membagikan pengalaman pribadi yang sensitif.</p><textarea rows="3" class="survey-textarea" placeholder="Contoh: Saya ingin lebih sabar saat merespons anak, dan mengurangi rasa cemas yang berlebihan..." data-v-49ef3924>${ssrInterpolate(surveyData.value.harapan_calm)}</textarea></div></div><div class="class-choice-info-card" data-v-49ef3924><h3 class="class-info-title" data-v-49ef3924>Pilihan Kelas CALM</h3><div class="class-cards-grid" data-v-49ef3924><div class="class-subcard" data-v-49ef3924><span class="class-badge blue" data-v-49ef3924>Kelas Reguler — Format Kuliah Umum</span><ul class="class-list" data-v-49ef3924><li data-v-49ef3924>Live session dalam kelas besar bersama seluruh peserta batch</li><li data-v-49ef3924>8 sesi live via Zoom + rekaman</li><li data-v-49ef3924>32 video pembelajaran</li><li data-v-49ef3924>Worksheet dan latihan setiap pekan</li><li data-v-49ef3924>Sesi tanya jawab di akhir setiap live session</li><li data-v-49ef3924>Dibuka per batch sesuai jadwal Khazilmu</li></ul></div><div class="class-subcard gold" data-v-49ef3924><span class="class-badge gold-bg" data-v-49ef3924>Kelas Eksklusif — Semi-Private (Maks. 8 Peserta)</span><ul class="class-list" data-v-49ef3924><li data-v-49ef3924>Live session dalam kelompok kecil, maksimal 8 peserta</li><li data-v-49ef3924>Materi, video, dan worksheet sama dengan Kelas Reguler</li><li data-v-49ef3924>Diskusi dua arah, setiap peserta mendapat ruang bertanya dan berbagi</li><li data-v-49ef3924>Pendampingan lebih personal dari pengajar</li><li data-v-49ef3924>Jadwal mulai fleksibel, tanpa menunggu batch reguler</li></ul></div></div></div><div class="survey-card" data-v-49ef3924><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924>6. Jika kedua kelas tersebut dibuka, mana yang paling mungkin Anda pilih? <span class="req" data-v-49ef3924>*</span></label><div class="radio-options grid-2" data-v-49ef3924><!--[-->`);
				ssrRenderList(["Kelas Reguler", "Kelas Eksklusif"], (item) => {
					_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.pilihan_kelas === item }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.pilihan_kelas, item)) ? " checked" : ""}${ssrRenderAttr("value", item)} data-v-49ef3924><span class="radio-text font-bold" data-v-49ef3924>${ssrInterpolate(item)}</span></label>`);
				});
				_push(`<!--]--></div></div></div>`);
				if (surveyData.value.pilihan_kelas) {
					_push(`<div class="survey-after-q6-section" data-v-49ef3924><div class="survey-card" data-v-49ef3924><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924> 7. Jika biaya total <b data-v-49ef3924>Kelas Reguler CALM</b> selama 2 bulan adalah <span class="price-pill-tag" data-v-49ef3924>${ssrInterpolate(assignedTier.value?.harga_reguler || "Rp299.000")}</span>, bagaimana kemungkinan Anda mendaftar? <span class="req" data-v-49ef3924>*</span></label><div class="radio-options vertical" data-v-49ef3924><!--[-->`);
					ssrRenderList(willingnessOptions, (opt) => {
						_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.respon_harga_reguler === opt }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.respon_harga_reguler, opt)) ? " checked" : ""}${ssrRenderAttr("value", opt)} data-v-49ef3924><span class="radio-text" data-v-49ef3924>${ssrInterpolate(opt)}</span></label>`);
					});
					_push(`<!--]--></div></div></div><div class="survey-card" data-v-49ef3924><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924> 8. Jika biaya total <b data-v-49ef3924>Kelas Eksklusif CALM</b> selama 2 bulan adalah <span class="price-pill-tag gold" data-v-49ef3924>${ssrInterpolate(assignedTier.value?.harga_eksklusif || "Rp2.500.000")}</span>, bagaimana kemungkinan Anda mendaftar? <span class="req" data-v-49ef3924>*</span></label><div class="radio-options vertical" data-v-49ef3924><!--[-->`);
					ssrRenderList(willingnessOptions, (opt) => {
						_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.respon_harga_eksklusif === opt }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.respon_harga_eksklusif, opt)) ? " checked" : ""}${ssrRenderAttr("value", opt)} data-v-49ef3924><span class="radio-text" data-v-49ef3924>${ssrInterpolate(opt)}</span></label>`);
					});
					_push(`<!--]--></div></div></div><div class="survey-card" data-v-49ef3924><div class="question-group" data-v-49ef3924><label class="q-label" data-v-49ef3924>9. Apakah Anda ingin mendapatkan informasi program dan penawaran promo CALM melalui WhatsApp? <span class="req" data-v-49ef3924>*</span></label><div class="radio-options grid-2" data-v-49ef3924><!--[-->`);
					ssrRenderList(["Ya", "Tidak"], (item) => {
						_push(`<label class="${ssrRenderClass([{ selected: surveyData.value.mau_info_wa === item }, "radio-card"])}" data-v-49ef3924><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(surveyData.value.mau_info_wa, item)) ? " checked" : ""}${ssrRenderAttr("value", item)} data-v-49ef3924><span class="radio-text font-bold" data-v-49ef3924>${ssrInterpolate(item)}</span></label>`);
					});
					_push(`<!--]--></div>`);
					if (surveyData.value.mau_info_wa === "Ya") _push(`<div class="wa-consent-box mt-3" data-v-49ef3924><label class="sub-label" data-v-49ef3924>Nomor WhatsApp Aktif untuk Info CALM:</label><div class="wa-preview-row" data-v-49ef3924><input type="tel"${ssrRenderAttr("value", surveyData.value.no_wa_calm)} class="survey-input" placeholder="081234567890" data-v-49ef3924></div><small class="wa-hint" data-v-49ef3924>Nomor di atas terisi otomatis dari data pendaftaran tiket Anda (bisa disesuaikan jika berbeda).</small><label class="consent-checkbox-row mt-3" data-v-49ef3924><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(surveyData.value.setuju_dihubungi_wa) ? ssrLooseContain(surveyData.value.setuju_dihubungi_wa, null) : surveyData.value.setuju_dihubungi_wa) ? " checked" : ""} class="custom-chk" data-v-49ef3924><span class="consent-text" data-v-49ef3924> Saya bersedia dihubungi Khazilmu melalui WhatsApp untuk informasi dan promo program CALM. Saya dapat meminta berhenti menerima pesan kapan saja. </span></label></div>`);
					else _push(`<!---->`);
					_push(`</div></div></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`<div class="action-buttons-wrap mt-4" data-v-49ef3924><button type="button" class="btn-prev" data-v-49ef3924> ← KEMBALI KE DATA DIRI </button><button type="button" class="${ssrRenderClass([{ "btn-loading": __props.isSubmitting }, "btn-finish"])}"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} data-v-49ef3924>`);
			if (__props.isSubmitting) _push(`<span data-v-49ef3924>MEMPROSES PENDAFTARAN...</span>`);
			else _push(`<span data-v-49ef3924>${ssrInterpolate(__props.isTrulyFree ? "SELESAIKAN PENDAFTARAN →" : "LANJUT KE PEMBAYARAN →")}</span>`);
			_push(`</button></div></div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/B2BSurveyStep.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var B2BSurveyStep_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-49ef3924"]]);
//#endregion
//#region app/components/event/SuccessStep.vue
var _sfc_main$2 = {
	__name: "EventSuccessStep",
	__ssrInlineRender: true,
	props: {
		eventData: {
			type: Object,
			default: () => ({})
		},
		isFree: {
			type: Boolean,
			default: false
		},
		isPaid: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		"kirim-wa",
		"buka-grup",
		"lihat-tiket"
	],
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "success-container" }, _attrs))} data-v-83eed13f><div class="icon-wrapper" data-v-83eed13f><svg class="success-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-83eed13f><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-v-83eed13f></path><polyline points="22 4 12 14.01 9 11.01" data-v-83eed13f></polyline></svg></div><h2 class="success-title" data-v-83eed13f>${ssrInterpolate(__props.isPaid || __props.isFree ? "Pembayaran Berhasil & E-Ticket Terbit!" : "Pendaftaran Berhasil!")}</h2><p class="success-text" data-v-83eed13f> Terima kasih telah mendaftar di <strong data-v-83eed13f>${ssrInterpolate(__props.eventData?.nama_event || "acara ini")}</strong>. </p>`);
			if (__props.isPaid || __props.isFree) _push(`<div class="success-actions-box" data-v-83eed13f><button class="btn btn-wa-primary" data-v-83eed13f><div class="btn-wa-inner" data-v-83eed13f><svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24" data-v-83eed13f><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.125-.339-.153-.889-.356-1.956-1.011-1.39-1.206-2.327-3.08-2.39-3.167-.063-.087-.573-.761-.573-1.451 0-.69.356-1.028.48-1.168.125-.14.271-.175.361-.175.09 0 .179.004.258.008.083.004.195-.031.305.234.114.276.391.958.427 1.03.036.073.06.157.014.248-.045.09-.068.145-.138.227-.07.082-.147.177-.208.244-.067.073-.138.153-.058.291.08.138.358.591.768.961.531.479.972.632 1.109.695.138.063.22.052.302-.041.082-.093.356-.411.451-.552.095-.14.19-.118.315-.072.125.047.795.375.932.443.138.068.23.102.264.159.034.057.034.331-.11.736z" data-v-83eed13f></path></svg><div class="btn-text-block" data-v-83eed13f><span class="btn-title" data-v-83eed13f>${ssrInterpolate(__props.eventData?.settings?.link_grup_wa ? "KABARI ADMIN & MASUK GRUP" : "KABARI ADMIN PANITIA VIA WA")}</span><span class="btn-sub" data-v-83eed13f>1x Klik Selesai Langsung ke WhatsApp</span></div></div></button><button class="btn btn-ticket-secondary" data-v-83eed13f><svg class="btn-icon-sec" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-83eed13f><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-83eed13f></rect><line x1="16" y1="2" x2="16" y2="6" data-v-83eed13f></line><line x1="8" y1="2" x2="8" y2="6" data-v-83eed13f></line><line x1="3" y1="10" x2="21" y2="10" data-v-83eed13f></line></svg><span data-v-83eed13f>Lihat E-Ticket Resmi Saya</span><svg style="${ssrRenderStyle({
				"width": "15px",
				"height": "15px"
			})}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-83eed13f><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" data-v-83eed13f></path></svg></button></div>`);
			else _push(`<div class="pending-container" data-v-83eed13f><div class="pending-notice" data-v-83eed13f><p class="pending-text" data-v-83eed13f> Pesanan Anda telah dicatat. Silakan lakukan transfer dan kirimkan bukti pembayaran ke Admin agar E-Ticket segera diverifikasi. </p></div><button class="btn btn-pending-wa" data-v-83eed13f><svg class="btn-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-83eed13f><line x1="22" y1="2" x2="11" y2="13" data-v-83eed13f></line><polygon points="22 2 15 22 11 13 2 9 22 2" data-v-83eed13f></polygon></svg><span data-v-83eed13f>KIRIM BUKTI PEMBAYARAN KE ADMIN</span></button></div>`);
			if (__props.isPaid || __props.isFree) _push(`<div class="ticket-reminder" data-v-83eed13f><em data-v-83eed13f>💡 Simpan link tiket Anda untuk ditunjukkan saat hadir di lokasi event.</em></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/SuccessStep.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var SuccessStep_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-83eed13f"]]);
//#endregion
//#region app/components/event/DonationForm.vue
var _sfc_main$1 = {
	__name: "EventDonationForm",
	__ssrInlineRender: true,
	props: {
		eventData: Object,
		isInfaqOn: Boolean,
		donasiAmount: Number
	},
	emits: ["update:isInfaqOn", "update:donasiAmount"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const localIsInfaqOn = ref(props.isInfaqOn);
		const selectedDonasiOpt = ref("");
		const customDonasiValue = ref(0);
		const customDonasiValueFormatted = ref("");
		watch(() => props.isInfaqOn, (newVal) => {
			localIsInfaqOn.value = newVal;
		});
		watch(localIsInfaqOn, (newVal) => {
			emit("update:isInfaqOn", newVal);
		});
		const parsedDonasiOptions = computed(() => {
			if (!props.eventData?.settings?.donasi_options) return [];
			return props.eventData.settings.donasi_options.split(",").map((s) => s.trim()).filter((s) => s);
		});
		const fixedOptionsOnly = computed(() => {
			return parsedDonasiOptions.value.filter((opt) => opt.toLowerCase() !== "custom");
		});
		const hasFixedOptions = computed(() => {
			return fixedOptionsOnly.value.length > 0;
		});
		const hasCustomOption = computed(() => {
			return props.eventData?.settings?.is_donasi_custom === true || parsedDonasiOptions.value.some((opt) => opt.toLowerCase() === "custom");
		});
		watch(() => props.donasiAmount, (val) => {
			if (val > 0) {
				const valStr = String(val);
				if (fixedOptionsOnly.value.includes(valStr)) selectedDonasiOpt.value = valStr;
				else if (hasCustomOption.value) {
					selectedDonasiOpt.value = "custom";
					customDonasiValue.value = val;
					customDonasiValueFormatted.value = Number(val).toLocaleString("id-ID");
				}
			} else if (val === 0 && !localIsInfaqOn.value) selectedDonasiOpt.value = "";
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.eventData?.settings?.is_donasi_active) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["participant-card donasi-form-card", { "donasi-dim": !localIsInfaqOn.value }] }, _attrs))} data-v-6a7aca01><div class="donasi-header-flex" data-v-6a7aca01><div class="donasi-title-wrap" data-v-6a7aca01><svg class="donasi-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-6a7aca01><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-v-6a7aca01></path></svg><span class="form-section-title" style="${ssrRenderStyle({
					"margin": "0",
					"font-size": "0.95rem"
				})}" data-v-6a7aca01>${ssrInterpolate(__props.eventData.settings.donasi_header || "Infaq / Donasi")}</span></div>`);
				if (!__props.eventData.settings.is_infaq_wajib) _push(`<label class="switch-small" data-v-6a7aca01><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(localIsInfaqOn.value) ? ssrLooseContain(localIsInfaqOn.value, null) : localIsInfaqOn.value) ? " checked" : ""} data-v-6a7aca01><span class="slider-small round-small" data-v-6a7aca01></span></label>`);
				else _push(`<!---->`);
				_push(`</div>`);
				if (localIsInfaqOn.value) {
					_push(`<div class="donasi-form-body" data-v-6a7aca01>`);
					if (hasFixedOptions.value) {
						_push(`<div class="donasi-chips" data-v-6a7aca01><!--[-->`);
						ssrRenderList(fixedOptionsOnly.value, (opt, idx) => {
							_push(`<button type="button" class="${ssrRenderClass([{ "form-chip-active": String(selectedDonasiOpt.value) === String(opt) }, "form-chip"])}" data-v-6a7aca01>${ssrInterpolate(unref(formatPrice)(Number(opt)))}</button>`);
						});
						_push(`<!--]-->`);
						if (hasCustomOption.value) _push(`<button type="button" class="${ssrRenderClass([{ "form-chip-active": selectedDonasiOpt.value === "custom" }, "form-chip"])}" data-v-6a7aca01> Lainnya </button>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else _push(`<!---->`);
					if (selectedDonasiOpt.value === "custom" || !hasFixedOptions.value && hasCustomOption.value) _push(`<div class="form-input-group" data-v-6a7aca01><span class="form-input-prefix" data-v-6a7aca01>Rp</span><input type="text" inputmode="numeric"${ssrRenderAttr("value", customDonasiValueFormatted.value)} class="form-input donasi-input" placeholder="0" data-v-6a7aca01></div>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/DonationForm.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var DonationForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-6a7aca01"]]);
//#endregion
//#region app/composables/useEventCheckout.ts
var useEventCheckout = () => {
	const isSubmitting = ref(false);
	const isPrinting = ref(false);
	const buktiBayarFile = ref(null);
	const buktiBayarPreview = ref("");
	const uploadError = ref(false);
	const transactionIdGlobal = ref("");
	const linkBuktiGlobal = ref("");
	ref([]);
	const checkKuotaTiket = async (supabase, tickets, jumlahPeserta) => {
		if (tickets.length === 0 || tickets[0].is_unlimited) return;
		const { count, error: countErr } = await supabase.from("peserta").select("*", {
			count: "exact",
			head: true
		}).eq("kategori_id", tickets[0].id).neq("status_bayar", "cancelled");
		if (!countErr && count !== null) {
			const sisaSekarang = tickets[0].kuota_maksimal - count;
			if (sisaSekarang < jumlahPeserta) throw new Error(`Maaf, sisa kuota tiket ini hanya ${sisaSekarang > 0 ? sisaSekarang : 0}. Pesanan ditolak.`);
		}
	};
	const buildArrPeserta = (daftarPeserta, customFields, donasiAmount) => {
		return daftarPeserta.map((p) => {
			let finalJawaban = { ...p.jawaban };
			for (const field of customFields) {
				if (field.type === "phone_wa" && p["_cc_" + field.field_key]) finalJawaban[field.field_key] = p["_cc_" + field.field_key] + (finalJawaban[field.field_key] || "");
				if (field.type === "domisili_api" && p["_lat_" + field.field_key]) {
					finalJawaban["lat"] = p["_lat_" + field.field_key];
					finalJawaban["lon"] = p["_lon_" + field.field_key];
				}
			}
			return {
				...p,
				jawaban: finalJawaban
			};
		}).map((p) => {
			const { nama_lengkap, email, no_wa, domisili, ...dataTambahanJSON } = p.jawaban;
			let emailVal = email;
			let noWaVal = no_wa;
			let namaLengkapVal = nama_lengkap;
			for (const field of customFields) {
				if (field.type === "email" && p.jawaban[field.field_key]) emailVal = p.jawaban[field.field_key];
				if (field.type === "phone_wa" && p.jawaban[field.field_key]) noWaVal = p.jawaban[field.field_key];
				if (field.field_key === "nama_lengkap" && p.jawaban[field.field_key]) namaLengkapVal = p.jawaban[field.field_key];
			}
			return {
				namaAnak: namaLengkapVal || "-",
				usia: "-",
				domisili: domisili || "-",
				followMunira: "Tidak",
				hp: noWaVal ? noWaVal.replace(/\D/g, "") : no_wa ? no_wa.replace(/\D/g, "") : "-",
				email: emailVal || "-",
				latitude: "",
				longitude: "",
				dataTambahanJSON: {
					...dataTambahanJSON,
					infaqNominal: donasiAmount
				},
				kategori_id: p.tiketId,
				namaTiket: p.namaTiket
			};
		});
	};
	const uploadAllFiles = async (supabase, eventData, transactionId, arrPeserta) => {
		let urlBukti = "";
		if (buktiBayarFile.value) {
			const ext = buktiBayarFile.value.name.split(".").pop();
			const pathBukti = `${eventData?.nama_event || "Event"}/Bukti Transfer/${transactionId}.${ext}`;
			const { error: err1 } = await supabase.storage.from("berkas").upload(pathBukti, buktiBayarFile.value);
			if (err1) throw new Error("Gagal mengupload Bukti Transfer: " + err1.message);
			urlBukti = supabase.storage.from("berkas").getPublicUrl(pathBukti).data.publicUrl;
		}
		for (const p of arrPeserta) for (const key in p.dataTambahanJSON) if (p.dataTambahanJSON[key] instanceof File) {
			const file = p.dataTambahanJSON[key];
			const ext = file.name.split(".").pop();
			const pathCustom = `${eventData?.nama_event || "Event"}/${key}/${transactionId}_${p.namaAnak || "Peserta"}.${ext}`;
			const { error: err2 } = await supabase.storage.from("berkas").upload(pathCustom, file);
			if (err2) throw new Error("Gagal mengupload file: " + err2.message);
			p.dataTambahanJSON[key] = supabase.storage.from("berkas").getPublicUrl(pathCustom).data.publicUrl;
		}
		return urlBukti;
	};
	const processEspaySubmit = async (params) => {
		const { donasiAmount, eventData, daftarPeserta, customFields, tickets, supabase, $fetch, paymentMethod, kodeUnik } = params;
		isSubmitting.value = true;
		try {
			await checkKuotaTiket(supabase, tickets, daftarPeserta.length);
			let arrPeserta = JSON.parse(JSON.stringify(daftarPeserta));
			const prefixDynamic = eventData.nama_event ? eventData.nama_event.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase() : "EVT";
			const dNow = /* @__PURE__ */ new Date();
			const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2);
			const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2);
			const processedPeserta = arrPeserta.map((p) => {
				let finalJawaban = { ...p.jawaban };
				for (const field of customFields) {
					if (field.type === "phone_wa" && p["_cc_" + field.field_key]) finalJawaban[field.field_key] = p["_cc_" + field.field_key] + (finalJawaban[field.field_key] || "");
					if (field.type === "domisili_api" && p["_lat_" + field.field_key]) {
						finalJawaban["lat"] = p["_lat_" + field.field_key];
						finalJawaban["lon"] = p["_lon_" + field.field_key];
					}
				}
				return {
					...p,
					namaAnak: finalJawaban["nama_lengkap"] || p.jawaban["namaLengkap"] || "Peserta",
					email: finalJawaban["email"] || "-",
					hp: (function() {
						let rawWa = finalJawaban["no_wa"] || "-";
						if (rawWa !== "-" && !rawWa.startsWith("62")) {
							if (rawWa.startsWith("0")) rawWa = "62" + rawWa.substring(1);
							else rawWa = "62" + rawWa;
						}
						return rawWa;
					})(),
					dataTambahanJSON: {
						...finalJawaban,
						infaqNominal: donasiAmount
					}
				};
			});
			const checkoutRes = await $fetch("/api/checkout", {
				method: "POST",
				body: {
					event_id: eventData.id,
					kategori_id: arrPeserta[0].tiketId,
					payment_method: paymentMethod || "qris",
					kode_unik: kodeUnik || 0,
					peserta: processedPeserta.map((p) => {
						const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
						return {
							kategori_id: p.tiketId,
							nama_tiket: p.namaTiket,
							nama_lengkap: p.namaAnak,
							email: p.email,
							no_wa: p.hp,
							ticket_id: `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`,
							data_tambahan: p.dataTambahanJSON
						};
					})
				}
			});
			if (checkoutRes && checkoutRes.status === "success") {
				transactionIdGlobal.value = checkoutRes.order_id;
				isSubmitting.value = false;
				return checkoutRes;
			} else throw new Error(checkoutRes?.message || "Gagal membuat pembayaran ESPay");
		} catch (err) {
			isSubmitting.value = false;
			throw err;
		}
	};
	const processManualSubmit = async (params) => {
		const { eventData, daftarPeserta, customFields, tickets, supabase, $fetch, printAudio, grandTotal, totalPrice, kodeUnik, donasiAmount, adminFee, startTime } = params;
		if (!daftarPeserta || daftarPeserta.length === 0) throw new Error("Data peserta tidak boleh kosong.");
		if (grandTotal > 0 && !buktiBayarFile.value) {
			uploadError.value = true;
			throw new Error("Harap upload foto struk transfer terlebih dahulu.");
		}
		isSubmitting.value = true;
		isPrinting.value = true;
		if (printAudio) {
			printAudio.currentTime = 0;
			printAudio.play().catch((e) => console.warn(e));
		}
		try {
			await checkKuotaTiket(supabase, tickets, daftarPeserta.length);
			const arrPeserta = buildArrPeserta(daftarPeserta, customFields, donasiAmount);
			const isGenuinelyFree = arrPeserta.every((p) => {
				const ticketObj = tickets.find((t) => String(t.id) === String(p.kategori_id));
				return ticketObj ? Number(ticketObj.harga) === 0 : false;
			}) && Number(donasiAmount || 0) === 0;
			if (!isGenuinelyFree) {
				if (grandTotal <= 0) throw new Error("Total tagihan tidak valid untuk tiket berbayar. Silakan ulangi pendaftaran.");
				if (!buktiBayarFile.value) {
					uploadError.value = true;
					throw new Error("Harap upload foto struk transfer terlebih dahulu.");
				}
			}
			const prefixDynamic = eventData.nama_event ? eventData.nama_event.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase() : "EVT";
			const transactionId = `TRX-${prefixDynamic}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
			transactionIdGlobal.value = transactionId;
			const urlBukti = await uploadAllFiles(supabase, eventData, transactionId, arrPeserta);
			linkBuktiGlobal.value = urlBukti;
			const dNow = /* @__PURE__ */ new Date();
			const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2);
			const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2);
			const checkoutRes = await $fetch("/api/checkout", {
				method: "POST",
				body: {
					event_id: eventData.id,
					kategori_id: arrPeserta[0].kategori_id,
					payment_method: "manual",
					kode_unik: kodeUnik || 0,
					bukti_bayar_url: urlBukti || null,
					peserta: arrPeserta.map((p) => {
						const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
						return {
							kategori_id: p.kategori_id,
							nama_tiket: p.namaTiket,
							nama_lengkap: p.namaAnak,
							email: p.email,
							no_wa: p.hp,
							ticket_id: `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`,
							data_tambahan: p.dataTambahanJSON
						};
					})
				}
			});
			if (!checkoutRes || checkoutRes.status !== "success") throw new Error(checkoutRes?.statusMessage || checkoutRes?.message || "Gagal memproses pendaftaran manual.");
			const finalOrderId = checkoutRes.order_id || transactionId;
			transactionIdGlobal.value = finalOrderId;
			const elapsed = Date.now() - startTime;
			if (elapsed < 3500) await new Promise((r) => setTimeout(r, 3500 - elapsed));
			return {
				isFree: isGenuinelyFree,
				transactionId: finalOrderId
			};
		} catch (err) {
			isSubmitting.value = false;
			isPrinting.value = false;
			throw err;
		}
	};
	return {
		isSubmitting,
		isPrinting,
		buktiBayarFile,
		buktiBayarPreview,
		uploadError,
		transactionIdGlobal,
		processEspaySubmit,
		processManualSubmit
	};
};
//#endregion
//#region app/pages/[slug].vue
var adminFee = 2e3;
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const toastMessage = ref("");
		const toastType = ref("");
		const showToastMsg = (msg, type = "error") => {
			toastMessage.value = msg;
			toastType.value = type;
			setTimeout(() => {
				toastMessage.value = "";
			}, 3e3);
		};
		const route = useRoute();
		const printAudio = ref(null);
		const slug = route.params.slug;
		const supabase = useSupabaseClient();
		const fixPosterUrl = (url) => {
			if (!url) return "";
			let fixed = url.replace("http://192.168.1.7:8000", "https://supabase.tyket.id").replace("http://localhost:8000", "https://supabase.tyket.id");
			if (!fixed.match(/\.(jpg|jpeg|png|webp)($|\?)/i)) fixed += (fixed.includes("?") ? "&" : "?") + "wa_trick=.jpg";
			return fixed;
		};
		const { data: seoData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`seo-${slug}`, async () => {
			try {
				return await $fetch$2(`/api/seo/${slug}`);
			} catch (e) {
				return null;
			}
		}, { lazy: true })), __temp = await __temp, __restore(), __temp);
		if (seoData.value) {
			const plainDesc = seoData.value.deskripsi ? seoData.value.deskripsi.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..." : `Daftar sekarang untuk acara ${seoData.value.nama_event}!`;
			const finalDesc = `Penyelenggara: ${seoData.value.organizer_profile?.nama_organizer || "tyket.id"} | ${plainDesc}`;
			const currentUrl = `https://tyket.id/${slug}`;
			useSeoMeta$1({
				title: seoData.value.nama_event,
				ogTitle: seoData.value.nama_event,
				description: finalDesc,
				ogDescription: finalDesc,
				ogImage: fixPosterUrl(seoData.value.poster_url),
				ogImageType: "image/jpeg",
				ogType: "website",
				ogUrl: currentUrl,
				twitterCard: "summary_large_image",
				twitterTitle: seoData.value.nama_event,
				twitterDescription: finalDesc,
				twitterImage: fixPosterUrl(seoData.value.poster_url)
			});
			useHead$1({ link: [{
				rel: "preload",
				as: "image",
				href: "/qris.webp",
				type: "image/webp"
			}] });
		}
		useHead$1({ link: [{
			rel: "preload",
			as: "image",
			href: "/qris.webp",
			type: "image/webp"
		}] });
		const { ticketCache, invalidateTicketCache } = useEventTicketCache();
		const selectedPreview = useState("selected_event_preview", () => null);
		const initialEvent = selectedPreview.value && selectedPreview.value.slug === slug ? selectedPreview.value : seoData.value ? {
			...seoData.value,
			slug
		} : null;
		const cachedInitialTickets = initialEvent?.id && ticketCache.value[initialEvent.id]?.tickets || null;
		const eventData = ref(initialEvent);
		const organizerProfile = ref(initialEvent?.organizer_profile || {});
		const isEventLoading = ref(!initialEvent);
		const isTicketsLoading = ref(!cachedInitialTickets);
		const tickets = ref(cachedInitialTickets ? [...cachedInitialTickets] : []);
		const error = ref(null);
		const isEmergencyBackup = ref(false);
		const emergencyMessage = ref("");
		const isEspayActiveCalculated = computed(() => {
			if (isEmergencyBackup.value) return false;
			return eventData.value?.settings?.is_espay_active !== false;
		});
		const hasB2BSurvey = computed(() => {
			return eventData.value?.settings?.b2b_survey?.active === true;
		});
		const primaryParticipant = computed(() => {
			if (!daftarPeserta.value || daftarPeserta.value.length === 0) return null;
			const p = daftarPeserta.value[0];
			return {
				nama: p.jawaban?.nama_lengkap || p.nama || "",
				email: p.jawaban?.email || p.email || "",
				phone: p.jawaban?.no_wa || p.phone || ""
			};
		});
		const { compressImageFile } = useImageCompress();
		const currentStep = ref("home");
		const isSetujuSnk = ref(false);
		const isInfaqOn = ref(true);
		const daftarPeserta = ref([]);
		const customFields = computed(() => {
			const fields = eventData.value?.settings?.pertanyaan_kustom;
			if (!fields || fields.length === 0) return [
				{
					field_key: "nama_lengkap",
					label: "Nama Lengkap",
					required: true,
					width: 12,
					type: "short_text"
				},
				{
					field_key: "email",
					label: "Email",
					required: true,
					width: 6,
					type: "email"
				},
				{
					field_key: "no_wa",
					label: "No. WhatsApp",
					required: true,
					width: 6,
					type: "phone_wa"
				}
			];
			return [...fields].sort((a, b) => a.y - b.y || a.x - b.x);
		});
		const kodeUnik = ref(0);
		const { keranjang, donasiAmount, totalQty, totalPrice, grandTotal, updateKeranjang, setEventSlug, syncWithAvailableTickets } = useCart(tickets, kodeUnik, adminFee, showToastMsg, computed(() => {
			if (eventData.value?.settings?.is_limit_tiket_active) return eventData.value?.settings?.max_tiket_per_transaksi || 1;
			return 0;
		}));
		setEventSlug(slug);
		if (cachedInitialTickets) syncWithAvailableTickets(tickets.value);
		const setDonasiAmount = (val) => donasiAmount.value = val;
		const ensureCartSynced = () => {
			if (daftarPeserta.value && daftarPeserta.value.length > 0) {
				let needsSync = false;
				const reconstructedCart = {};
				for (const p of daftarPeserta.value) if (p.tiketId) reconstructedCart[String(p.tiketId)] = (reconstructedCart[String(p.tiketId)] || 0) + 1;
				for (const id in reconstructedCart) if (keranjang.value[id] !== reconstructedCart[id]) {
					needsSync = true;
					break;
				}
				if (needsSync || Object.keys(keranjang.value).length === 0) keranjang.value = reconstructedCart;
			}
		};
		const isTrulyFree = computed(() => {
			if (donasiAmount.value > 0) return false;
			if (totalPrice.value > 0) return false;
			if (!daftarPeserta.value || daftarPeserta.value.length === 0) return false;
			if (daftarPeserta.value.some((p) => {
				const t = tickets.value.find((tkt) => String(tkt.id) === String(p.tiketId));
				return t ? Number(t.harga) > 0 : Number(p.hargaTiket) > 0;
			})) return false;
			return true;
		});
		watch(currentStep, (newVal) => {
			if (newVal === "form" || newVal === "bayar") {
				ensureCartSynced();
				if (daftarPeserta.value.length === 0 && !activePaymentResult.value) {
					currentStep.value = "home";
					return;
				}
				if (eventData.value?.settings?.is_infaq_wajib) isInfaqOn.value = true;
			}
		});
		const totalMaksimalKuota = computed(() => {
			return tickets.value.reduce((sum, t) => t.is_unlimited ? sum : sum + (t.kuota_maksimal || 0), 0);
		});
		const totalSisaKuota = computed(() => {
			return tickets.value.reduce((sum, t) => t.is_unlimited ? sum : sum + (t.sisa_kuota || 0), 0);
		});
		const persentaseTerisi = computed(() => {
			if (totalMaksimalKuota.value === 0) return 0;
			const persen = (totalMaksimalKuota.value - totalSisaKuota.value) / totalMaksimalKuota.value * 100;
			return persen > 100 ? 100 : persen;
		});
		const handleSurveyComplete = async (surveyPayload) => {
			if (daftarPeserta.value && daftarPeserta.value.length > 0) daftarPeserta.value.forEach((p) => {
				p.jawaban = {
					...p.jawaban,
					...surveyPayload
				};
			});
			if (eventData.value?.settings?.is_infaq_wajib && donasiAmount.value <= 0) {
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "warning",
					title: "Infaq Wajib",
					text: "Mohon isi nominal infaq terbaik Anda.",
					confirmButtonColor: "#E85D5E"
				});
				else showToastMsg("Mohon isi nominal infaq!");
				return;
			}
			if (eventData.value?.settings?.is_anti_calo_email || eventData.value?.settings?.is_anti_calo_wa) {
				isSubmitting.value = true;
				isPrinting.value = false;
				try {
					const payloadPeserta = daftarPeserta.value.map((p) => {
						let rawWa = p.jawaban["no_wa"] || "";
						if (rawWa && !rawWa.startsWith("62")) {
							if (rawWa.startsWith("0")) rawWa = "62" + rawWa.substring(1);
							else rawWa = "62" + rawWa;
						}
						return {
							email: p.jawaban["email"] || "",
							no_wa: rawWa
						};
					});
					await $fetch$2("/api/check-calo", {
						method: "POST",
						body: {
							event_id: eventData.value.id,
							peserta: payloadPeserta
						}
					});
				} catch (err) {
					isSubmitting.value = false;
					const msg = err.data?.statusMessage || err.data?.message || err.message;
					if ((void 0).Swal) (void 0).Swal.fire({
						icon: "error",
						title: "Pendaftaran Ditolak",
						text: msg,
						confirmButtonColor: "#E85D5E"
					});
					return;
				}
				isSubmitting.value = false;
			}
			ensureCartSynced();
			if (isTrulyFree.value) {
				isPrinting.value = true;
				submitData();
			} else {
				currentStep.value = "bayar";
				(void 0).scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}
		};
		const { isSubmitting, isPrinting, buktiBayarFile, buktiBayarPreview, uploadError, transactionIdGlobal, processEspaySubmit, processManualSubmit } = useEventCheckout();
		const activePaymentResult = ref(null);
		const isPaymentGatewayPaid = ref(false);
		const handleResetPayment = () => {
			activePaymentResult.value = null;
		};
		const handleCancelOrder = (orderId) => {
			activePaymentResult.value = null;
			transactionIdGlobal.value = "";
			daftarPeserta.value = [];
			keranjang.value = {};
			donasiAmount.value = 0;
			currentStep.value = "home";
			showToastMsg("Pesanan berhasil dibatalkan. Kuota tiket telah dikembalikan.", "info");
		};
		const handleEspayPayment = async ({ paymentMethod, onSuccess, onError }) => {
			try {
				const res = await processEspaySubmit({
					donasiAmount: donasiAmount.value,
					eventData: eventData.value,
					daftarPeserta: daftarPeserta.value,
					customFields: customFields.value,
					tickets: tickets.value,
					kodeUnik: kodeUnik.value,
					supabase,
					$fetch: $fetch$2,
					paymentMethod
				});
				activePaymentResult.value = res;
				transactionIdGlobal.value = res.order_id;
				if (onSuccess) onSuccess(res);
			} catch (err) {
				if (onError) onError(err);
				const errorMsg = err.data?.statusMessage || err.data?.message || err.message || "";
				const statusCode = err.statusCode || err.data?.statusCode || err.status;
				if (statusCode === 400 || statusCode === 404 || statusCode === 422 || errorMsg.includes("Sistem Anti-Calo") || errorMsg.includes("kuota") || errorMsg.includes("tidak mencukupi") || errorMsg.includes("1 Email") || errorMsg.includes("1 No WA") || errorMsg.includes("belum diaktifkan") || errorMsg.includes("Silakan pilih") || errorMsg.includes("Sandbox")) {
					if ((void 0).Swal) (void 0).Swal.fire({
						icon: "warning",
						title: "Pemberitahuan",
						text: errorMsg,
						confirmButtonColor: "#0c387a"
					});
					else showToastMsg(errorMsg, "error");
					return;
				}
				console.warn("[Auto-Failover] ESPay gagal, mengalihkan ke mode QRIS cadangan Tyket.id:", errorMsg);
				activePaymentResult.value = null;
				isEmergencyBackup.value = true;
				emergencyMessage.value = "Layanan pembayaran otomatis sedang gangguan/pemeliharaan berkala. Pembayaran dialihkan ke QRIS Resmi Tyket.id.";
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "info",
					title: "Pengalihan Pembayaran Cadangan",
					text: "Layanan pembayaran bank otomatis sedang gangguan atau pemeliharaan berkala. Pembayaran Anda langsung dialihkan ke QRIS Resmi Tyket.id.",
					confirmButtonColor: "#0c387a",
					confirmButtonText: "Lanjutkan Bayar via QRIS"
				});
				else showToastMsg("Pembayaran dialihkan ke QRIS Cadangan Tyket.id", "info");
			}
		};
		const goToTicket = async () => {
			if (transactionIdGlobal.value) await navigateTo(`/tiket/${transactionIdGlobal.value}`);
		};
		const handlePaymentSuccess = async (orderId) => {
			transactionIdGlobal.value = orderId;
			isPaymentGatewayPaid.value = true;
			if (printAudio.value) try {
				printAudio.value.currentTime = 0;
				printAudio.value.play().catch((e) => console.log("Autoplay sound blocked:", e));
			} catch (e) {}
			isPrinting.value = true;
			isSubmitting.value = true;
			const preloadTicketData = async () => {
				try {
					const { data, error: sbErr } = await supabase.from("peserta").select("*, event(nama_event, settings, organizer_id), kategori_tiket(harga)").or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`).order("id", { ascending: true });
					if (!sbErr && data && data.length > 0) {
						const QRCode = (await import('qrcode')).default;
						const qrMap = {};
						for (const t of data) {
							const code = t.data_tambahan?.ticket_id || orderId;
							if (code && !qrMap[code]) try {
								qrMap[code] = await QRCode.toDataURL(code, {
									width: 240,
									margin: 1,
									color: {
										dark: "#0f172a",
										light: "#ffffff"
									}
								});
							} catch (e) {}
						}
					}
				} catch (e) {
					console.warn("Preload tiket di background gagal, fallback ke fetch normal:", e);
				}
			};
			await Promise.all([preloadTicketData(), new Promise((resolve) => {
				let isDone = false;
				const finish = () => {
					if (!isDone) {
						isDone = true;
						resolve();
					}
				};
				if (printAudio.value) printAudio.value.onended = finish;
				setTimeout(finish, 3350);
			})]);
			isPrinting.value = false;
			isSubmitting.value = false;
			await navigateTo(`/tiket/${orderId}`);
		};
		const handleFileUpload = async (event) => {
			const file = event.target.files[0];
			if (!file) return;
			if (file.size > 5242880) {
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "error",
					title: "Ukuran Terlalu Besar",
					text: "Maksimal 5 MB."
				});
				else showToastMsg("Ukuran foto maksimal 5 MB!");
				event.target.value = "";
				return;
			}
			uploadError.value = false;
			if (file.type.startsWith("image/")) try {
				buktiBayarFile.value = await compressImageFile(file, 800, .6);
				buktiBayarPreview.value = URL.createObjectURL(buktiBayarFile.value);
			} catch (e) {
				showToastMsg("Gagal memproses gambar struk");
			}
			else {
				buktiBayarFile.value = file;
				buktiBayarPreview.value = URL.createObjectURL(file);
			}
		};
		const submitData = async () => {
			const startTime = Date.now();
			try {
				const res = await processManualSubmit({
					eventData: eventData.value,
					daftarPeserta: daftarPeserta.value,
					customFields: customFields.value,
					tickets: tickets.value,
					supabase,
					$fetch: $fetch$2,
					printAudio: printAudio.value,
					grandTotal: grandTotal.value,
					totalPrice: totalPrice.value,
					kodeUnik: kodeUnik.value,
					donasiAmount: donasiAmount.value,
					adminFee,
					startTime
				});
				isPrinting.value = false;
				isSubmitting.value = false;
				if (eventData.value?.id) invalidateTicketCache(eventData.value.id);
				if (res.isFree) {
					(void 0).isRedirecting = true;
					await navigateTo(`/tiket/${res.transactionId}`);
				} else {
					currentStep.value = "sukses";
					(void 0).scrollTo({
						top: 0,
						behavior: "smooth"
					});
				}
			} catch (err) {
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "error",
					title: "Pendaftaran Gagal",
					text: err.message,
					confirmButtonColor: "#E85D5E"
				});
				else showToastMsg("Gagal: " + err.message);
			}
		};
		const kirimWA = () => {
			let noAdmin = organizerProfile.value?.no_wa || "62800000000";
			noAdmin = noAdmin.replace(/\D/g, "");
			if (noAdmin.startsWith("0")) noAdmin = "62" + noAdmin.substring(1);
			const domain = (void 0).location.origin;
			const namaEvent = eventData.value?.nama_event || "Event";
			const namaPeserta = daftarPeserta.value?.[0]?.nama_lengkap || "";
			const groupUrl = eventData.value?.settings?.link_grup_wa || "";
			let rawText = "";
			if (isTrulyFree.value || isPaymentGatewayPaid.value) {
				rawText = `Halo Admin Panitia,\nSaya sudah menyelesaikan pendaftaran acara *${namaEvent}*:\n` + (namaPeserta ? `• Nama: *${namaPeserta}*\n` : "") + `• Order ID: *${transactionIdGlobal.value}*\n• Link E-Ticket: ${domain}/tiket/${transactionIdGlobal.value}\n\n`;
				if (groupUrl) rawText += `👉 Tautan Masuk Grup WhatsApp Peserta:\n${groupUrl}\n\nMohon dicatat dan di-approve di grup ya min. Terima kasih! 🙏`;
				else rawText += `Mohon dicatat dan dikonfirmasi kehadiran saya. Terima kasih! 🙏`;
			} else rawText = `Halo Admin Panitia,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${namaEvent}*.\n\n` + (namaPeserta ? `• Nama: *${namaPeserta}*\n` : "") + `• Order ID: *${transactionIdGlobal.value}*\n• Link Tiket: ${domain}/tiket/${transactionIdGlobal.value}\n\nBerikut saya lampirkan bukti transfer pembayaran saya. Mohon bantuannya untuk diverifikasi. Terima kasih! 🙏`;
			(void 0).open(`https://api.whatsapp.com/send?phone=${noAdmin}&text=${encodeURIComponent(rawText)}`, "_blank");
		};
		const bukaGrupWa = () => {
			const link = eventData.value?.settings?.link_grup_wa;
			if (link) (void 0).open(link, "_blank");
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			const _component_Icon = components_default;
			const _component_NuxtLink = NuxtLink;
			_push(`<!--[--><div class="container" data-v-c856af3a>`);
			if (toastMessage.value) _push(`<div class="${ssrRenderClass([toastType.value === "success" ? "toast-success" : "toast-error", "toast-message"])}" data-v-c856af3a>${ssrInterpolate(toastMessage.value)}</div>`);
			else _push(`<!---->`);
			if (isEventLoading.value) {
				_push(`<div class="step-content active step-home" data-v-c856af3a><div class="glass glass-home" data-v-c856af3a><div class="skeleton-badge-wrap" data-v-c856af3a><div class="skeleton-brand-badge" data-v-c856af3a><span class="skeleton-dot-pulse" data-v-c856af3a></span><span class="skeleton-badge-text" data-v-c856af3a>Memuat detail event...</span></div></div><div class="skeleton-item skeleton-poster-box" data-v-c856af3a></div><div class="skeleton-item skeleton-title-line" data-v-c856af3a></div><div class="skeleton-item skeleton-title-line-short" data-v-c856af3a></div><div class="skeleton-meta-grid" data-v-c856af3a><div class="skeleton-item skeleton-meta-pill" data-v-c856af3a></div><div class="skeleton-item skeleton-meta-pill" data-v-c856af3a></div></div><div class="skeleton-card-block" data-v-c856af3a><div class="skeleton-eo-row" data-v-c856af3a><div class="skeleton-item skeleton-avatar-circle" data-v-c856af3a></div><div class="skeleton-eo-text" data-v-c856af3a><div class="skeleton-item skeleton-eo-sub" data-v-c856af3a></div><div class="skeleton-item skeleton-eo-main" data-v-c856af3a></div></div></div><div class="skeleton-item skeleton-divider" data-v-c856af3a></div><div class="skeleton-item skeleton-desc-heading" data-v-c856af3a></div><div class="skeleton-item skeleton-desc-line" data-v-c856af3a></div><div class="skeleton-item skeleton-desc-line" data-v-c856af3a></div><div class="skeleton-item skeleton-desc-line-short" data-v-c856af3a></div></div><div class="skeleton-tickets-container" data-v-c856af3a><!--[-->`);
				ssrRenderList(2, (n) => {
					_push(`<div class="skeleton-ticket-item" data-v-c856af3a><div class="skeleton-tkt-left" data-v-c856af3a><div class="skeleton-item skeleton-tkt-title" data-v-c856af3a></div><div class="skeleton-item skeleton-tkt-price" data-v-c856af3a></div></div><div class="skeleton-item skeleton-tkt-action" data-v-c856af3a></div></div>`);
				});
				_push(`<!--]--></div><div class="skeleton-item skeleton-btn-main" data-v-c856af3a></div></div></div>`);
			} else if (error.value) _push(`<div class="state-message error-text" data-v-c856af3a>${ssrInterpolate(error.value)}</div>`);
			else if (currentStep.value === "home") {
				_push(`<div class="step-content active step-home" data-v-c856af3a><div class="glass glass-home" data-v-c856af3a>`);
				_push(ssrRenderComponent(EventHeader_default, {
					eventData: eventData.value,
					organizerProfile: organizerProfile.value,
					totalMaksimalKuota: totalMaksimalKuota.value,
					totalSisaKuota: totalSisaKuota.value,
					persentaseTerisi: persentaseTerisi.value
				}, null, _parent));
				_push(ssrRenderComponent(TicketList_default, {
					tickets: tickets.value,
					keranjang: unref(keranjang),
					isLoading: isTicketsLoading.value,
					onUpdateKeranjang: unref(updateKeranjang)
				}, null, _parent));
				_push(`<button class="btn-register"${ssrIncludeBooleanAttr(isTicketsLoading.value || tickets.value.length === 0) ? " disabled" : ""} data-v-c856af3a><div class="btn-register-text" data-v-c856af3a>`);
				if (isTicketsLoading.value) _push(`<!--[-->MEMUAT TIKET...<!--]-->`);
				else if (tickets.value.length === 0) _push(`<!--[-->TIKET BELUM TERSEDIA<!--]-->`);
				else _push(`<!--[-->DAFTAR SEKARANG →<!--]-->`);
				_push(`</div>`);
				_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
				_push(`</button>`);
				if (organizerProfile.value.link_ig || organizerProfile.value.no_wa || organizerProfile.value.link_web) {
					_push(`<div class="social-grid" data-v-c856af3a>`);
					if (organizerProfile.value.link_ig) {
						_push(`<a${ssrRenderAttr("href", organizerProfile.value.link_ig)} target="_blank" rel="noopener noreferrer" class="social-btn" data-v-c856af3a>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "mdi:instagram",
							size: "1.2rem",
							style: { "color": "#64748b" }
						}, null, _parent));
						_push(`<span class="social-text" data-v-c856af3a>Instagram</span></a>`);
					} else _push(`<!---->`);
					if (organizerProfile.value.no_wa) {
						_push(`<a${ssrRenderAttr("href", ("formatWaLink" in _ctx ? _ctx.formatWaLink : unref(formatWaLink))(organizerProfile.value.no_wa))} target="_blank" rel="noopener noreferrer" class="social-btn" data-v-c856af3a>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "mdi:whatsapp",
							size: "1.2rem",
							style: { "color": "#64748b" }
						}, null, _parent));
						_push(`<span class="social-text" data-v-c856af3a>WhatsApp</span></a>`);
					} else _push(`<!---->`);
					if (organizerProfile.value.link_web) {
						_push(`<a${ssrRenderAttr("href", organizerProfile.value.link_web)} target="_blank" rel="noopener noreferrer" class="social-btn" data-v-c856af3a>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "lucide:globe",
							size: "1.2rem",
							style: { "color": "#64748b" }
						}, null, _parent));
						_push(`<span class="social-text" data-v-c856af3a>Website</span></a>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`<div class="footer-check-ticket" data-v-c856af3a>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/cari-tiket",
					class: "link-check-ticket"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Sudah mendaftar? Cek tiket di sini `);
						else return [createTextVNode(" Sudah mendaftar? Cek tiket di sini ")];
					}),
					_: 1
				}, _parent));
				_push(`</div><div class="platform-watermark" data-v-c856af3a>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/",
					class: "watermark-link",
					title: "Buat sistem tiket event Anda di tyket.id"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span data-v-c856af3a${_scopeId}>Ditenagai oleh</span><img${ssrRenderAttr("src", _virtual_public__2Flogo_tyket_default)} alt="tyket.id" class="watermark-logo" data-v-c856af3a${_scopeId}>`);
						else return [createVNode("span", null, "Ditenagai oleh"), createVNode("img", {
							src: _virtual_public__2Flogo_tyket_default,
							alt: "tyket.id",
							class: "watermark-logo"
						})];
					}),
					_: 1
				}, _parent));
				_push(`</div></div></div>`);
			} else if (currentStep.value === "snk") {
				_push(`<div class="step-content active step-padded" data-v-c856af3a>`);
				_push(ssrRenderComponent(CheckoutStepper_default, {
					currentStep: currentStep.value,
					hasSurvey: hasB2BSurvey.value
				}, null, _parent));
				_push(`<h3 class="step-title" data-v-c856af3a>Syarat &amp; Ketentuan</h3><p class="step-subtitle" data-v-c856af3a>Mohon baca dan setujui sebelum melanjutkan</p><div class="snk-box" data-v-c856af3a>${ssrInterpolate(eventData.value.settings?.snk_text || "Syarat dan ketentuan berlaku mengikuti kebijakan panitia dan tyket.id.")}</div><label class="snk-label" data-v-c856af3a><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(isSetujuSnk.value) ? ssrLooseContain(isSetujuSnk.value, null) : isSetujuSnk.value) ? " checked" : ""} class="snk-checkbox" data-v-c856af3a> Saya menyetujui persyaratan di atas </label><div class="action-row" data-v-c856af3a><button class="btn-action btn-secondary" data-v-c856af3a>KEMBALI</button><button class="btn-action btn-primary" data-v-c856af3a>LANJUTKAN →</button></div></div>`);
			} else if (currentStep.value === "form") {
				_push(`<div class="step-content active step-padded" data-v-c856af3a>`);
				_push(ssrRenderComponent(CheckoutStepper_default, {
					currentStep: currentStep.value,
					hasSurvey: hasB2BSurvey.value
				}, null, _parent));
				_push(`<h3 class="step-title-left" data-v-c856af3a>Data Diri Peserta</h3>`);
				_push(ssrRenderComponent(ParticipantForm_default, {
					daftarPeserta: daftarPeserta.value,
					customFields: customFields.value,
					onToast: showToastMsg
				}, null, _parent));
				_push(ssrRenderComponent(DonationForm_default, {
					eventData: eventData.value,
					isInfaqOn: isInfaqOn.value,
					"onUpdate:isInfaqOn": ($event) => isInfaqOn.value = $event,
					donasiAmount: unref(donasiAmount),
					"onUpdate:donasiAmount": setDonasiAmount
				}, null, _parent));
				_push(`<div class="legal-disclaimer" data-v-c856af3a> Dengan menekan tombol di bawah, Anda menyetujui <a href="/terms" target="_blank" data-v-c856af3a>Syarat &amp; Ketentuan</a> serta <a href="/privacy" target="_blank" data-v-c856af3a>Kebijakan Privasi</a> tyket.id. </div><div class="action-row" data-v-c856af3a><button class="btn-action btn-secondary" data-v-c856af3a>KEMBALI</button><button class="btn-action btn-primary" data-v-c856af3a>${ssrInterpolate(hasB2BSurvey.value ? "LANJUT KE KUESIONER →" : isTrulyFree.value ? "SELESAIKAN DAFTAR →" : "LANJUT BAYAR →")}</button></div></div>`);
			} else if (currentStep.value === "survei") {
				_push(`<div class="step-content active step-padded" data-v-c856af3a>`);
				_push(ssrRenderComponent(CheckoutStepper_default, {
					currentStep: currentStep.value,
					hasSurvey: hasB2BSurvey.value
				}, null, _parent));
				_push(ssrRenderComponent(B2BSurveyStep_default, {
					eventData: eventData.value,
					primaryParticipant: primaryParticipant.value,
					isTrulyFree: isTrulyFree.value,
					isSubmitting: unref(isSubmitting),
					onBack: ($event) => currentStep.value = "form",
					onComplete: handleSurveyComplete,
					onToast: showToastMsg
				}, null, _parent));
				_push(`</div>`);
			} else if (currentStep.value === "bayar") {
				_push(`<div class="step-content active step-padded" data-v-c856af3a>`);
				if (!activePaymentResult.value) _push(ssrRenderComponent(CheckoutStepper_default, {
					currentStep: currentStep.value,
					hasSurvey: hasB2BSurvey.value
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(CheckoutPayment_default, {
					grandTotal: unref(grandTotal),
					totalQty: unref(totalQty),
					totalPrice: unref(totalPrice),
					adminFee,
					kodeUnik: kodeUnik.value,
					donasiAmount: unref(donasiAmount),
					buktiBayarPreview: unref(buktiBayarPreview),
					uploadError: unref(uploadError),
					isSubmitting: unref(isSubmitting),
					daftarPeserta: daftarPeserta.value,
					isEspayActive: isEspayActiveCalculated.value,
					isEmergencyBackup: isEmergencyBackup.value,
					emergencyMessage: emergencyMessage.value,
					espayMethods: eventData.value?.settings?.espay_methods,
					eventData: eventData.value,
					initialPaymentResult: activePaymentResult.value,
					onFileUpload: handleFileUpload,
					onBack: ($event) => currentStep.value = hasB2BSurvey.value ? "survei" : "form",
					onSubmit: submitData,
					onToast: showToastMsg,
					onRequestEspay: handleEspayPayment,
					onPaymentSuccess: handlePaymentSuccess,
					onResetPayment: handleResetPayment,
					onCancelOrder: handleCancelOrder
				}, null, _parent));
				_push(`</div>`);
			} else if (currentStep.value === "sukses") {
				_push(`<div class="step-content active" data-v-c856af3a>`);
				_push(ssrRenderComponent(SuccessStep_default, {
					eventData: eventData.value,
					isFree: isTrulyFree.value,
					isPaid: isPaymentGatewayPaid.value,
					onKirimWa: kirimWA,
					onBukaGrup: bukaGrupWa,
					onLihatTiket: goToTicket
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(TicketPrinterOverlay_default, {
				isSubmitting: unref(isSubmitting),
				isPrinting: unref(isPrinting),
				eventData: eventData.value,
				daftarPeserta: daftarPeserta.value,
				transactionId: unref(transactionIdGlobal)
			}, null, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-c856af3a"]]);

export { _slug__default as default };
//# sourceMappingURL=_slug_-hmE3LZBy.mjs.map
