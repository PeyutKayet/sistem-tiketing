import { f as useSeoMeta$1 } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BNBp86SD.mjs';
import { u as useAsyncData } from './asyncData-ClgIs2MV.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, withAsyncContext, computed, watch, unref, mergeProps, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { useRoute } from 'vue-router';
import { ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderStyle, ssrRenderList, ssrRenderAttrs, ssrLooseEqual, ssrRenderDynamicModel } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '@supabase/ssr';
import '@iconify/vue';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
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
//#region app/composables/useCart.ts
var useCart = (tickets, kodeUnik, adminFee = 2e3, showToast) => {
	const keranjang = ref({});
	const donasiAmount = ref(0);
	const totalQty = computed(() => {
		return Object.values(keranjang.value).reduce((sum, qty) => sum + qty, 0);
	});
	const totalPrice = computed(() => {
		let total = 0;
		for (const id in keranjang.value) {
			const qty = keranjang.value[id];
			const tiket = tickets.value.find((t) => String(t.id) === String(id));
			if (tiket && qty > 0) total += qty * tiket.harga;
		}
		return total;
	});
	const grandTotal = computed(() => {
		if (totalPrice.value === 0 && donasiAmount.value === 0) return 0;
		return totalPrice.value + donasiAmount.value + adminFee + kodeUnik.value;
	});
	const updateKeranjang = (tiketId, change, sisaKuota) => {
		let newQty = (keranjang.value[String(tiketId)] || 0) + change;
		if (newQty < 0) newQty = 0;
		if (newQty > sisaKuota) {
			showToast(`Sisa tiket hanya ${sisaKuota}.`, "error");
			newQty = sisaKuota;
		}
		keranjang.value[String(tiketId)] = newQty;
	};
	const resetKeranjang = () => {
		keranjang.value = {};
		donasiAmount.value = 0;
	};
	return {
		keranjang,
		donasiAmount,
		totalQty,
		totalPrice,
		grandTotal,
		updateKeranjang,
		resetKeranjang
	};
};
//#endregion
//#region app/composables/useImageCompress.ts
var useImageCompress = () => {
	/**
	* Mengkompresi file gambar di sisi klien sebelum diupload
	* @param file File gambar yang akan dikompresi
	* @param maxWidth Lebar maksimum gambar setelah dikompresi
	* @param quality Kualitas kompresi JPEG (0.0 - 1.0)
	* @returns Promise<File> File hasil kompresi
	*/
	const compressImageFile = (file, maxWidth = 800, quality = .6) => {
		return new Promise((resolve, reject) => {
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
					ctx.drawImage(img, 0, 0, width, height);
					canvas.toBlob((blob) => {
						if (!blob) return reject(/* @__PURE__ */ new Error("Canvas to Blob failed"));
						resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" }));
					}, "image/jpeg", quality);
				};
				img.onerror = (error) => reject(error);
			};
			reader.onerror = (error) => reject(error);
		});
	};
	return { compressImageFile };
};
//#endregion
//#region app/components/event/EventHeader.vue
var _sfc_main$5 = {
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
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		const formatDate = (dateString) => {
			if (!dateString) return "TBA";
			return new Date(dateString).toLocaleDateString("id-ID", {
				weekday: "short",
				day: "numeric",
				month: "short",
				year: "numeric"
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "event-header" }, _attrs))} data-v-87c8261e><div class="header-poster-section" data-v-87c8261e><img loading="lazy"${ssrRenderAttr("src", fixPosterUrl(__props.eventData?.poster_url) || "https://placehold.co/900x300/F8FAFC/64748B?text=POSTER+EVENT")} alt="Poster Event" class="poster-image" data-v-87c8261e><p class="organizer-name" data-v-87c8261e>${ssrInterpolate(__props.organizerProfile?.nama_organizer || "EventHub Organizer")}</p><h1 class="event-title" data-v-87c8261e>${ssrInterpolate(__props.eventData?.nama_event)}</h1></div><div class="info-grid" data-v-87c8261e><div class="info-card" data-v-87c8261e><span class="info-text" data-v-87c8261e>${ssrInterpolate(formatDate(__props.eventData?.tanggal_mulai))}</span></div><div class="info-card" data-v-87c8261e><span class="info-text" data-v-87c8261e>${ssrInterpolate(__props.eventData?.lokasi || "Lokasi Menyusul")}</span></div></div><div class="pricing-status-card" data-v-87c8261e><span class="section-label" data-v-87c8261e>DESKRIPSI EVENT</span><p class="description-text" data-v-87c8261e>${ssrInterpolate(__props.eventData?.deskripsi || "Deskripsi tidak tersedia.")}</p>`);
			if (__props.totalMaksimalKuota > 0) _push(`<div data-v-87c8261e><div class="divider" data-v-87c8261e></div><div class="quota-info" data-v-87c8261e><span class="quota-label" data-v-87c8261e>SISA KUOTA</span><span class="quota-count" data-v-87c8261e><b data-v-87c8261e>${ssrInterpolate(__props.totalSisaKuota)}</b> / ${ssrInterpolate(__props.totalMaksimalKuota)}</span></div><div class="progress-bar-container" data-v-87c8261e><div class="progress-bar-fill" style="${ssrRenderStyle({ width: __props.persentaseTerisi + "%" })}" data-v-87c8261e></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/EventHeader.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var EventHeader_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-87c8261e"]]);
//#endregion
//#region app/components/event/TicketList.vue
var _sfc_main$4 = {
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
		}
	},
	emits: ["update-keranjang"],
	setup(__props, { emit: __emit }) {
		const formatPrice = (price) => {
			if (price == null) return "";
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(price);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "ticket-list-container" }, _attrs))} data-v-49619f0a><!--[-->`);
			ssrRenderList(__props.tickets, (tiket) => {
				_push(`<div class="ticket-card" style="${ssrRenderStyle({ opacity: tiket.sisa_kuota <= 0 ? "0.6" : "1" })}" data-v-49619f0a><div class="ticket-info" data-v-49619f0a><div class="ticket-name" data-v-49619f0a>${ssrInterpolate(tiket.nama_kategori)}</div><div class="ticket-meta" data-v-49619f0a><span class="ticket-price" data-v-49619f0a>${ssrInterpolate(tiket.harga === 0 ? "GRATIS" : formatPrice(tiket.harga))}</span><span class="ticket-quota" data-v-49619f0a> Sisa: ${ssrInterpolate(tiket.is_unlimited ? "~" : tiket.sisa_kuota)}</span></div></div><div class="ticket-actions" data-v-49619f0a><button class="action-btn btn-minus"${ssrIncludeBooleanAttr((__props.keranjang[tiket.id] || 0) <= 0) ? " disabled" : ""} data-v-49619f0a>-</button><span class="ticket-qty" data-v-49619f0a>${ssrInterpolate(__props.keranjang[tiket.id] || 0)}</span><button class="action-btn btn-plus"${ssrIncludeBooleanAttr(tiket.sisa_kuota <= 0) ? " disabled" : ""} data-v-49619f0a>+</button></div></div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/TicketList.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var TicketList_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-49619f0a"]]);
//#endregion
//#region app/components/event/ParticipantForm.vue
var _sfc_main$3 = {
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
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-573b19d9><!--[-->`);
			ssrRenderList(__props.daftarPeserta, (peserta, index) => {
				_push(`<div class="participant-card" data-v-573b19d9><div class="participant-header" data-v-573b19d9><h4 class="participant-title" data-v-573b19d9>Data Peserta Ke-${ssrInterpolate(index + 1)}</h4><span class="participant-badge" data-v-573b19d9>${ssrInterpolate(peserta.namaTiket)}</span></div><div class="form-grid" data-v-573b19d9><!--[-->`);
				ssrRenderList(__props.customFields, (field) => {
					_push(`<div style="${ssrRenderStyle({ gridColumn: `span ${field.width || 12}` })}" data-v-573b19d9>`);
					if (field.type === "header") _push(`<div class="form-section-header" data-v-573b19d9><h3 class="form-section-title" data-v-573b19d9>${ssrInterpolate(field.label)}</h3></div>`);
					else {
						_push(`<div data-v-573b19d9><label class="form-label" data-v-573b19d9>${ssrInterpolate(field.label)} `);
						if (field.required) _push(`<span class="required-mark" data-v-573b19d9>*</span>`);
						else _push(`<!---->`);
						_push(`</label>`);
						if (field.type === "phone_wa") _push(`<div class="phone-input-group" data-v-573b19d9><input type="text"${ssrRenderAttr("value", peserta["_cc_" + field.field_key])} placeholder="62" class="form-input cc-input" data-v-573b19d9><input type="tel"${ssrRenderAttr("value", peserta.jawaban[field.field_key])} placeholder="81234567890" class="form-input phone-input" data-v-573b19d9></div>`);
						else if (field.type === "domisili_api") {
							_push(`<div style="${ssrRenderStyle({ "position": "relative" })}" data-v-573b19d9><input type="text"${ssrRenderAttr("value", peserta.jawaban[field.field_key])} class="form-input"${ssrRenderAttr("placeholder", field.label || "Ketik nama kota/kecamatan...")} autocomplete="off" data-v-573b19d9>`);
							if (peserta["_domisiliSugs_" + field.field_key] || peserta["_domisiliLoading_" + field.field_key]) {
								_push(`<div class="domisili-suggestions" style="${ssrRenderStyle(peserta["_showDomisili_" + field.field_key] ? null : { display: "none" })}" data-v-573b19d9>`);
								if (peserta["_domisiliLoading_" + field.field_key]) _push(`<div class="domisili-item" style="${ssrRenderStyle({
									"color": "#e11d48",
									"font-weight": "700",
									"display": "flex",
									"align-items": "center"
								})}" data-v-573b19d9><div class="map-pin-mini" data-v-573b19d9></div> Mencari titik di peta... </div>`);
								else if (peserta["_domisiliSugs_" + field.field_key]) {
									_push(`<!--[--><div class="domisili-item manual" data-v-573b19d9><svg style="${ssrRenderStyle({
										"width": "16px",
										"height": "16px",
										"display": "inline-block",
										"vertical-align": "middle",
										"margin-right": "5px"
									})}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-573b19d9><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-573b19d9></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-573b19d9></path></svg> Gunakan: &quot;<b data-v-573b19d9>${ssrInterpolate(peserta.jawaban[field.field_key])}</b>&quot; </div>`);
									if (peserta["_domisiliSugs_" + field.field_key].length === 0) _push(`<div class="domisili-item" style="${ssrRenderStyle({
										"color": "var(--text-muted)",
										"font-size": "0.75rem"
									})}" data-v-573b19d9> Lokasi spesifik tidak ada di list peta, silakan klik tombol &#39;Gunakan&#39; di atas 👆 </div>`);
									else {
										_push(`<!--[-->`);
										ssrRenderList(peserta["_domisiliSugs_" + field.field_key], (tempat, i) => {
											_push(`<div class="domisili-item" data-v-573b19d9>${ssrInterpolate(tempat.display_name)}</div>`);
										});
										_push(`<!--]-->`);
									}
									_push(`<!--]-->`);
								} else _push(`<!---->`);
								_push(`</div>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else if (field.type === "paragraph") _push(`<textarea rows="3" class="form-input form-textarea"${ssrRenderAttr("placeholder", field.label)} data-v-573b19d9>${ssrInterpolate(peserta.jawaban[field.field_key])}</textarea>`);
						else if (field.type === "dropdown") {
							_push(`<select class="form-input form-select" data-v-573b19d9><option value="" data-v-573b19d9${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], "") : ssrLooseEqual(peserta.jawaban[field.field_key], "")) ? " selected" : ""}>Pilih Opsi...</option><!--[-->`);
							ssrRenderList(field.options, (opt, i) => {
								_push(`<option${ssrRenderAttr("value", opt)} data-v-573b19d9${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], opt) : ssrLooseEqual(peserta.jawaban[field.field_key], opt)) ? " selected" : ""}>${ssrInterpolate(opt)}</option>`);
							});
							_push(`<!--]--></select>`);
						} else if (field.type === "multiple_choice") {
							_push(`<div class="choice-group" data-v-573b19d9><!--[-->`);
							ssrRenderList(field.options, (opt, i) => {
								_push(`<label class="choice-label" data-v-573b19d9><input type="radio"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(ssrLooseEqual(peserta.jawaban[field.field_key], opt)) ? " checked" : ""} class="choice-input" data-v-573b19d9> ${ssrInterpolate(opt)}</label>`);
							});
							_push(`<!--]--></div>`);
						} else if (field.type === "checkboxes") {
							_push(`<div class="choice-group" data-v-573b19d9><!--[-->`);
							ssrRenderList(field.options, (opt, i) => {
								_push(`<label class="choice-label" data-v-573b19d9><input type="checkbox"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], opt) : peserta.jawaban[field.field_key]) ? " checked" : ""} class="choice-input" data-v-573b19d9> ${ssrInterpolate(opt)}</label>`);
							});
							_push(`<!--]--></div>`);
						} else if (field.type === "linear_scale") {
							_push(`<div class="linear-scale-container" data-v-573b19d9><div class="linear-scale-wrapper" data-v-573b19d9><span class="scale-limit" data-v-573b19d9>1</span><div class="scale-options" data-v-573b19d9><!--[-->`);
							ssrRenderList(field.scaleCount || 5, (n) => {
								_push(`<label class="scale-option" data-v-573b19d9>`);
								if (peserta.jawaban[field.field_key] === n) _push(`<span class="scale-tooltip" data-v-573b19d9>${ssrInterpolate(n)}</span>`);
								else _push(`<!---->`);
								_push(`<input type="radio"${ssrRenderAttr("value", n)}${ssrIncludeBooleanAttr(ssrLooseEqual(peserta.jawaban[field.field_key], n)) ? " checked" : ""} class="scale-input" data-v-573b19d9></label>`);
							});
							_push(`<!--]--></div><span class="scale-limit" data-v-573b19d9>${ssrInterpolate(field.scaleCount || 5)}</span></div></div>`);
						} else if (field.type === "file_upload") {
							_push(`<div class="file-upload-wrapper" data-v-573b19d9><input type="file" accept="image/*,.pdf" style="${ssrRenderStyle({ "display": "none" })}"${ssrRenderAttr("id", "file_" + index + "_" + field.field_key)} data-v-573b19d9><label${ssrRenderAttr("for", "file_" + index + "_" + field.field_key)} class="file-upload-label" data-v-573b19d9>`);
							if (peserta.jawaban[field.field_key]) _push(`<div class="file-icon file-icon-selected" data-v-573b19d9><svg style="${ssrRenderStyle({
								"width": "18px",
								"height": "18px"
							})}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-573b19d9><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-v-573b19d9></path><polyline points="22 4 12 14.01 9 11.01" data-v-573b19d9></polyline></svg></div>`);
							else _push(`<div class="file-icon file-icon-empty" data-v-573b19d9><svg style="${ssrRenderStyle({
								"width": "18px",
								"height": "18px"
							})}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-573b19d9><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-573b19d9></path><polyline points="17 8 12 3 7 8" data-v-573b19d9></polyline><line x1="12" y1="3" x2="12" y2="15" data-v-573b19d9></line></svg></div>`);
							_push(`<div class="file-info" data-v-573b19d9>`);
							if (peserta.jawaban[field.field_key]) _push(`<div class="file-name" data-v-573b19d9>${ssrInterpolate(peserta.jawaban[field.field_key].name || "File terpilih")}</div>`);
							else _push(`<div class="file-placeholder" data-v-573b19d9>Pilih File</div>`);
							_push(`<div class="file-hint" data-v-573b19d9>Format JPG/PNG/PDF</div></div></label></div>`);
						} else if (field.type === "terms") _push(`<label class="terms-label" data-v-573b19d9><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], null) : peserta.jawaban[field.field_key]) ? " checked" : ""} class="terms-input" data-v-573b19d9><span class="terms-text" data-v-573b19d9>${ssrInterpolate(field.termsText || field.label)}</span></label>`);
						else _push(`<input${ssrRenderAttr("type", field.type === "date" ? "date" : field.type === "time" ? "time" : "text")}${ssrRenderDynamicModel(field.type === "date" ? "date" : field.type === "time" ? "time" : "text", peserta.jawaban[field.field_key], null)} class="form-input"${ssrRenderAttr("placeholder", field.label)} data-v-573b19d9>`);
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
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/ParticipantForm.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var ParticipantForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-573b19d9"]]);
//#endregion
//#region \0virtual:public?%2Fqris.webp
var _virtual_public__2Fqris_default = publicAssetsURL("/qris.webp");
//#endregion
//#region app/components/event/CheckoutPayment.vue
var _sfc_main$2 = {
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
		}
	},
	emits: [
		"file-upload",
		"back",
		"submit",
		"toast"
	],
	setup(__props, { emit: __emit }) {
		const formatPrice = (price) => {
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(price);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-22985684><div class="billing-card" data-v-22985684><small class="billing-header" data-v-22985684>Total Tagihan</small><div class="billing-total-row" data-v-22985684><h2 class="billing-total-amount" data-v-22985684>${ssrInterpolate(formatPrice(__props.grandTotal))}</h2><button class="btn-copy" title="Salin Nominal" data-v-22985684><svg class="icon-copy" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-22985684><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-22985684></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-22985684></path></svg></button></div><div class="billing-details" data-v-22985684><div class="billing-detail-item" data-v-22985684><span data-v-22985684>Tiket (${ssrInterpolate(__props.totalQty)}x)</span><span data-v-22985684>${ssrInterpolate(formatPrice(__props.totalPrice))}</span></div>`);
			if (__props.donasiAmount > 0) _push(`<div class="billing-detail-subitem" style="${ssrRenderStyle({
				"color": "var(--text-main)",
				"font-weight": "600",
				"opacity": "1"
			})}" data-v-22985684><span data-v-22985684>Infaq / Donasi</span><span data-v-22985684>+${ssrInterpolate(formatPrice(__props.donasiAmount))}</span></div>`);
			else _push(`<!---->`);
			_push(`<div class="billing-detail-subitem" data-v-22985684><span data-v-22985684>Biaya Layanan</span><span data-v-22985684>${ssrInterpolate(formatPrice(__props.adminFee))}</span></div><div class="billing-detail-subitem" data-v-22985684><span data-v-22985684>Kode Unik</span><span data-v-22985684>+${ssrInterpolate(__props.kodeUnik)}</span></div></div></div><div class="qris-card" data-v-22985684><p class="qris-title" data-v-22985684>SCAN QRIS UNTUK MEMBAYAR</p><img loading="lazy"${ssrRenderAttr("src", _virtual_public__2Fqris_default)} alt="QRIS Pembayaran" class="qris-image" data-v-22985684><a href="/qris.webp" download="QRIS_Pembayaran.webp" class="btn-download-qris" data-v-22985684><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download" data-v-22985684><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" data-v-22985684></path></svg> Download QRIS </a><div class="qris-warning" data-v-22985684><p class="warning-title" data-v-22985684>⚠️ PASTIKAN NOMINAL SESUAI</p><p class="warning-desc" data-v-22985684>Termasuk 3 digit kode unik di belakang</p></div></div><div class="upload-section" data-v-22985684><label class="upload-label" data-v-22985684>Upload Bukti Pembayaran <span class="required-mark" data-v-22985684>*</span></label><div class="${ssrRenderClass([{ "error-shake": __props.uploadError }, "upload-box"])}" data-v-22985684>`);
			if (!__props.buktiBayarPreview) _push(`<div class="upload-placeholder" data-v-22985684><p class="upload-placeholder-title" data-v-22985684>Klik untuk pilih foto struk</p><p class="upload-placeholder-desc" data-v-22985684>Format JPG/PNG • Maks. 5MB</p></div>`);
			else _push(`<img${ssrRenderAttr("src", __props.buktiBayarPreview)} alt="Preview Bukti" class="upload-preview-image" data-v-22985684>`);
			_push(`<input type="file" accept="image/*" class="upload-input" data-v-22985684></div></div><div class="action-buttons" data-v-22985684><button class="btn btn-secondary" data-v-22985684>KEMBALI</button><button${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} class="${ssrRenderClass([{ "btn-loading": __props.isSubmitting }, "btn btn-primary"])}" data-v-22985684>${ssrInterpolate(__props.isSubmitting ? "MEMPROSES..." : "DAFTAR SEKARANG ✔️")}</button></div></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/CheckoutPayment.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var CheckoutPayment_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-22985684"]]);
//#endregion
//#region app/components/event/SuccessStep.vue
var _sfc_main$1 = {
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
		}
	},
	emits: [
		"kirim-wa",
		"buka-grup",
		"lihat-tiket"
	],
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "success-container" }, _attrs))} data-v-a7bfc11e><div class="icon-wrapper" data-v-a7bfc11e><svg class="success-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-a7bfc11e><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-v-a7bfc11e></path><polyline points="22 4 12 14.01 9 11.01" data-v-a7bfc11e></polyline></svg></div><h2 class="success-title" data-v-a7bfc11e>Pendaftaran Berhasil!</h2><p class="success-text" data-v-a7bfc11e>Terima kasih telah mendaftar.</p><div class="notification-box" data-v-a7bfc11e>`);
			if (__props.isFree) _push(`<p class="notification-text" data-v-a7bfc11e>E-Ticket Anda sudah jadi! Silakan simpan tiket Anda dan hubungi admin untuk info lebih lanjut.</p>`);
			else _push(`<p class="notification-text" data-v-a7bfc11e>Lakukan konfirmasi ke admin agar tiket Anda segera di-approve.</p>`);
			if (__props.isFree) _push(`<button class="btn btn-ticket" style="${ssrRenderStyle({ "margin-bottom": "10px" })}" data-v-a7bfc11e><svg class="btn-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-a7bfc11e><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-a7bfc11e></rect><line x1="16" y1="2" x2="16" y2="6" data-v-a7bfc11e></line><line x1="8" y1="2" x2="8" y2="6" data-v-a7bfc11e></line><line x1="3" y1="10" x2="21" y2="10" data-v-a7bfc11e></line></svg> LIHAT E-TICKET SAYA </button>`);
			else _push(`<!---->`);
			_push(`<button class="btn btn-wa" data-v-a7bfc11e><svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24" data-v-a7bfc11e><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.125-.339-.153-.889-.356-1.956-1.011-1.39-1.206-2.327-3.08-2.39-3.167-.063-.087-.573-.761-.573-1.451 0-.69.356-1.028.48-1.168.125-.14.271-.175.361-.175.09 0 .179.004.258.008.083.004.195-.031.305.234.114.276.391.958.427 1.03.036.073.06.157.014.248-.045.09-.068.145-.138.227-.07.082-.147.177-.208.244-.067.073-.138.153-.058.291.08.138.358.591.768.961.531.479.972.632 1.109.695.138.063.22.052.302-.041.082-.093.356-.411.451-.552.095-.14.19-.118.315-.072.125.047.795.375.932.443.138.068.23.102.264.159.034.057.034.331-.11.736z" data-v-a7bfc11e></path></svg>`);
			if (__props.isFree) _push(`<span data-v-a7bfc11e>KABARI ADMIN</span>`);
			else _push(`<span data-v-a7bfc11e>KONFIRMASI PEMBAYARAN</span>`);
			_push(`</button></div>`);
			if (__props.eventData?.settings?.link_grup_wa) _push(`<button class="btn btn-group" data-v-a7bfc11e> GABUNG GRUP WHATSAPP PESERTA </button>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/event/SuccessStep.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var SuccessStep_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-a7bfc11e"]]);
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
		const slug = useRoute().params.slug;
		const supabase = useSupabaseClient();
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		const { data: seoData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`seo-${slug}`, async () => {
			const { data } = await supabase.from("event").select("nama_event, deskripsi, poster_url").eq("slug", slug).single();
			return data;
		})), __temp = await __temp, __restore(), __temp);
		if (seoData.value) {
			const plainDesc = seoData.value.deskripsi ? seoData.value.deskripsi.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..." : `Daftar sekarang untuk acara ${seoData.value.nama_event}!`;
			useSeoMeta$1({
				title: seoData.value.nama_event,
				ogTitle: seoData.value.nama_event,
				description: plainDesc,
				ogDescription: plainDesc,
				ogImage: fixPosterUrl(seoData.value.poster_url),
				twitterCard: "summary_large_image"
			});
		}
		const loading = ref(true);
		const error = ref(null);
		const eventData = ref(null);
		const organizerProfile = ref({});
		const tickets = ref([]);
		const { compressImageFile } = useImageCompress();
		const currentStep = ref("home");
		const isSetujuSnk = ref(false);
		const isInfaqOn = ref(true);
		const selectedDonasiOpt = ref("");
		const customDonasiValue = ref(0);
		const customDonasiValueFormatted = ref("");
		const parsedDonasiOptions = computed(() => {
			if (!eventData.value?.settings?.donasi_options) return [];
			return eventData.value.settings.donasi_options.split(",").map((s) => s.trim()).filter((s) => s);
		});
		const fixedOptionsOnly = computed(() => {
			return parsedDonasiOptions.value.filter((opt) => opt !== "custom");
		});
		const hasFixedOptions = computed(() => {
			return fixedOptionsOnly.value.length > 0;
		});
		const hasCustomOption = computed(() => {
			return parsedDonasiOptions.value.includes("custom");
		});
		const initDefaultDonasi = () => {
			if (!eventData.value?.settings?.is_donasi_active) return;
			if (parsedDonasiOptions.value.length > 0) {
				const firstOpt = hasFixedOptions.value ? fixedOptionsOnly.value[0] : "custom";
				selectedDonasiOpt.value = firstOpt;
				if (firstOpt !== "custom") donasiAmount.value = Number(firstOpt);
				else donasiAmount.value = customDonasiValue.value || 0;
			}
		};
		watch(currentStep, (newVal) => {
			if (newVal === "form") {
				if (eventData.value?.settings?.is_infaq_wajib) isInfaqOn.value = true;
				if (donasiAmount.value === 0 && isInfaqOn.value) initDefaultDonasi();
			}
		});
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
			return fields;
		});
		const kodeUnik = ref(0);
		const { keranjang, donasiAmount, totalQty, totalPrice, grandTotal, updateKeranjang } = useCart(tickets, kodeUnik, adminFee, showToastMsg);
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
		const buktiBayarFile = ref(null);
		const buktiBayarPreview = ref("");
		const uploadError = ref(false);
		const isSubmitting = ref(false);
		const handleFileUpload = async (event) => {
			const file = event.target.files[0];
			if (!file) return;
			if (file.size > 5242880) {
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "error",
					title: "Ukuran Terlalu Besar",
					text: "Maksimal 5 MB. Silakan kompres foto struk Anda.",
					confirmButtonColor: "#E85D5E"
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
				console.error(e);
				showToastMsg("Gagal memproses gambar struk");
			}
			else {
				buktiBayarFile.value = file;
				buktiBayarPreview.value = URL.createObjectURL(file);
			}
		};
		const orderIdsGlobal = ref([]);
		const linkBuktiGlobal = ref("");
		const transactionIdGlobal = ref("");
		const submitData = async () => {
			const startTime = Date.now();
			if (grandTotal.value > 0 && !buktiBayarFile.value) {
				uploadError.value = true;
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "warning",
					title: "Struk Belum Ada",
					text: "Harap upload foto struk transfer terlebih dahulu.",
					confirmButtonColor: "#E85D5E"
				});
				else showToastMsg("Harap upload foto struk transfer!");
				return;
			}
			isSubmitting.value = true;
			try {
				if (tickets.value.length > 0 && !tickets.value[0].is_unlimited) {
					const { count, error: countErr } = await supabase.from("peserta").select("*", {
						count: "exact",
						head: true
					}).eq("kategori_id", tickets.value[0].id);
					if (!countErr && count !== null) {
						const sisaSekarang = tickets.value[0].kuota_maksimal - count;
						if (sisaSekarang < daftarPeserta.value.length) throw new Error(`Maaf, sisa kuota tiket ini hanya ${sisaSekarang > 0 ? sisaSekarang : 0}. Pesanan ditolak untuk mencegah oversold.`);
					}
				}
				const arrPeserta = daftarPeserta.value.map((p) => {
					let finalJawaban = { ...p.jawaban };
					for (const field of customFields.value) {
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
					for (const field of customFields.value) {
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
							infaqNominal: donasiAmount.value
						},
						kategori_id: p.tiketId,
						namaTiket: p.namaTiket
					};
				});
				const transactionId = `TRX-${eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase() : "EVT"}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
				transactionIdGlobal.value = transactionId;
				const emailVal = arrPeserta[0]?.email || "-";
				let urlBukti = "";
				if (buktiBayarFile.value) {
					const ext = buktiBayarFile.value.name.split(".").pop();
					const pathBukti = `${eventData.value?.nama_event || "Event"}/Bukti Transfer/${transactionId}.${ext}`;
					const { error: err1 } = await supabase.storage.from("berkas").upload(pathBukti, buktiBayarFile.value);
					if (err1) throw new Error("Gagal mengupload Bukti Transfer: " + err1.message);
					urlBukti = supabase.storage.from("berkas").getPublicUrl(pathBukti).data.publicUrl;
				}
				for (let p of arrPeserta) for (let key in p.dataTambahanJSON) if (p.dataTambahanJSON[key] instanceof File) {
					let file = p.dataTambahanJSON[key];
					let ext = file.name.split(".").pop();
					let pathCustom = `${eventData.value?.nama_event || "Event"}/${key}/${transactionId}_${p.namaAnak || "Peserta"}.${ext}`;
					const { error: err2 } = await supabase.storage.from("berkas").upload(pathCustom, file);
					if (err2) throw new Error("Gagal mengupload file: " + err2.message);
					p.dataTambahanJSON[key] = supabase.storage.from("berkas").getPublicUrl(pathCustom).data.publicUrl;
				}
				const dataPayload = {
					action: "create_order",
					transactionId,
					namaEvent: eventData.value?.nama_event || "Event Umum",
					peserta: arrPeserta,
					email: emailVal,
					infoDari: "-",
					kodeUnik: kodeUnik.value,
					infaqNominal: donasiAmount.value,
					kodePrefix: eventData.value?.settings?.Kode_Prefix || "EVT"
				};
				const res = await fetch("/api/create-order", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "omit",
					body: JSON.stringify(dataPayload)
				});
				if (!res.ok) throw new Error(`Pendaftaran tertunda (Error ${res.status}). Pastikan API tersedia.`);
				const response = await res.json();
				if (response.status === "success" || response.status === "error") {
					linkBuktiGlobal.value = urlBukti;
					const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase() : "EVT";
					const dNow = /* @__PURE__ */ new Date();
					const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2);
					const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2);
					const payloadSupabase = arrPeserta.map((p, index) => {
						let randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
						let ticketIdDynamic = `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`;
						let finalDataTambahan = p.dataTambahanJSON;
						finalDataTambahan.ticket_id = ticketIdDynamic;
						finalDataTambahan.order_id = transactionId;
						return {
							event_id: eventData.value.id,
							kategori_id: p.kategori_id,
							nama_lengkap: p.namaAnak,
							email: p.email,
							no_wa: p.hp,
							nama_tiket: p.namaTiket,
							bukti_bayar_url: linkBuktiGlobal.value,
							data_tambahan: finalDataTambahan,
							status_bayar: grandTotal.value === 0 ? "paid" : "pending"
						};
					});
					const { data: sbData, error: sbError } = await supabase.from("peserta").insert(payloadSupabase).select();
					if (sbError) throw sbError;
					if (sbData && sbData.length > 0) orderIdsGlobal.value = sbData.map((row) => `${row.data_tambahan.ticket_id}-${row.id}`);
					const elapsed = Date.now() - startTime;
					if (elapsed < 3500) await new Promise((r) => setTimeout(r, 3500 - elapsed));
					if (totalPrice.value === 0) {
						(void 0).isRedirecting = true;
						(void 0).location.href = `/tiket/${transactionIdGlobal.value}`;
					} else {
						currentStep.value = "sukses";
						(void 0).scrollTo({
							top: 0,
							behavior: "smooth"
						});
					}
				} else throw new Error(response.message || "Gagal memproses pendaftaran");
			} catch (err) {
				console.error(err);
				if ((void 0).Swal) (void 0).Swal.fire({
					icon: "error",
					title: "Pendaftaran Gagal",
					text: err.message,
					confirmButtonColor: "#E85D5E"
				});
				else showToastMsg("Gagal: " + err.message);
			} finally {
				if (!(void 0).isRedirecting) isSubmitting.value = false;
			}
		};
		const kirimWA = () => {
			let noAdmin = organizerProfile.value?.no_wa || "62800000000";
			noAdmin = noAdmin.replace(/\D/g, "");
			if (noAdmin.startsWith("0")) noAdmin = "62" + noAdmin.substring(1);
			const domain = (void 0).location.origin;
			let rawText = "";
			if (grandTotal.value === 0) rawText = `Hai Admin,\nSaya sudah mendaftar untuk acara *${eventData.value?.nama_event || "Event"}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${transactionIdGlobal.value}\n\nTerima kasih! 🙏`;
			else rawText = `Hai Admin,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${eventData.value?.nama_event || "Event"}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${transactionIdGlobal.value}\n\nSaya akan cek link tersebut secara berkala sampai dikonfirmasi. Terima kasih! 🙏`;
			(void 0).open(`https://api.whatsapp.com/send?phone=${noAdmin}&text=${encodeURIComponent(rawText)}`, "_blank");
		};
		const bukaGrupWa = () => {
			const link = eventData.value?.settings?.link_grup_wa;
			if (link) (void 0).open(link, "_blank");
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="container" data-v-2d9fa773>`);
			if (toastMessage.value) _push(`<div class="${ssrRenderClass([toastType.value === "success" ? "toast-success" : "toast-error", "toast-message"])}" data-v-2d9fa773>${ssrInterpolate(toastMessage.value)}</div>`);
			else _push(`<!---->`);
			if (loading.value) _push(`<div class="state-message" data-v-2d9fa773> Mempersiapkan ruang yang aman dan nyaman... </div>`);
			else if (error.value) _push(`<div class="state-message error-text" data-v-2d9fa773>${ssrInterpolate(error.value)}</div>`);
			else if (currentStep.value === "home") {
				_push(`<div class="step-content active step-home" data-v-2d9fa773><div class="glass glass-home" data-v-2d9fa773>`);
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
					onUpdateKeranjang: unref(updateKeranjang)
				}, null, _parent));
				_push(`<button class="btn-register" data-v-2d9fa773><div class="btn-register-text" data-v-2d9fa773>DAFTAR SEKARANG ➔</div>`);
				if (unref(totalQty) > 0) _push(`<small class="btn-register-sub" data-v-2d9fa773>${ssrInterpolate(unref(totalQty))} Tiket • ${ssrInterpolate(unref(totalPrice) === 0 ? "GRATIS" : unref(formatPrice)(unref(totalPrice)))}</small>`);
				else _push(`<!---->`);
				_push(`</button><div class="social-grid" data-v-2d9fa773><a${ssrRenderAttr("href", organizerProfile.value.link_ig || "#")} target="_blank" class="social-btn" data-v-2d9fa773><span class="social-text" data-v-2d9fa773>Instagram</span></a><a${ssrRenderAttr("href", ("formatWaLink" in _ctx ? _ctx.formatWaLink : unref(formatWaLink))(organizerProfile.value.no_wa))} target="_blank" class="social-btn" data-v-2d9fa773><span class="social-text" data-v-2d9fa773>WhatsApp</span></a><a${ssrRenderAttr("href", organizerProfile.value.link_web || "#")} target="_blank" class="social-btn" data-v-2d9fa773><span class="social-text" data-v-2d9fa773>Website</span></a></div></div></div>`);
			} else if (currentStep.value === "snk") _push(`<div class="step-content active step-padded" data-v-2d9fa773><h3 class="step-title" data-v-2d9fa773>Syarat &amp; Ketentuan</h3><p class="step-subtitle" data-v-2d9fa773>Mohon baca dan setujui sebelum melanjutkan</p><div class="snk-box" data-v-2d9fa773>${ssrInterpolate(eventData.value.settings?.snk_text || "Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.")}</div><label class="snk-label" data-v-2d9fa773><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(isSetujuSnk.value) ? ssrLooseContain(isSetujuSnk.value, null) : isSetujuSnk.value) ? " checked" : ""} class="snk-checkbox" data-v-2d9fa773> Saya menyetujui persyaratan di atas </label><div class="action-row" data-v-2d9fa773><button class="btn-action btn-secondary" data-v-2d9fa773>KEMBALI</button><button class="btn-action btn-primary" data-v-2d9fa773>LANJUTKAN ➔</button></div></div>`);
			else if (currentStep.value === "form") {
				_push(`<div class="step-content active step-padded" data-v-2d9fa773><h3 class="step-title-left" data-v-2d9fa773>Data Diri Peserta</h3>`);
				_push(ssrRenderComponent(ParticipantForm_default, {
					daftarPeserta: daftarPeserta.value,
					customFields: customFields.value,
					onToast: showToastMsg
				}, null, _parent));
				if (eventData.value?.settings?.is_donasi_active) {
					_push(`<div class="${ssrRenderClass([{ "donasi-dim": !isInfaqOn.value }, "participant-card donasi-form-card"])}" data-v-2d9fa773><div class="donasi-header-flex" data-v-2d9fa773><div class="donasi-title-wrap" data-v-2d9fa773><svg class="donasi-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-2d9fa773><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-v-2d9fa773></path></svg><span class="form-section-title" style="${ssrRenderStyle({
						"margin": "0",
						"font-size": "0.95rem"
					})}" data-v-2d9fa773>${ssrInterpolate(eventData.value.settings.donasi_header || "Infaq / Donasi")}</span></div>`);
					if (!eventData.value.settings.is_infaq_wajib) _push(`<label class="switch-small" data-v-2d9fa773><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(isInfaqOn.value) ? ssrLooseContain(isInfaqOn.value, null) : isInfaqOn.value) ? " checked" : ""} data-v-2d9fa773><span class="slider-small round-small" data-v-2d9fa773></span></label>`);
					else _push(`<!---->`);
					_push(`</div><p class="donasi-subtitle" data-v-2d9fa773>Bantu tebarkan manfaat untuk sesama</p>`);
					if (isInfaqOn.value) {
						_push(`<div class="donasi-form-body" data-v-2d9fa773>`);
						if (hasFixedOptions.value) {
							_push(`<div class="donasi-chips" data-v-2d9fa773><!--[-->`);
							ssrRenderList(fixedOptionsOnly.value, (opt, idx) => {
								_push(`<button class="${ssrRenderClass([{ "form-chip-active": selectedDonasiOpt.value === opt }, "form-chip"])}" data-v-2d9fa773>${ssrInterpolate(unref(formatPrice)(Number(opt)))}</button>`);
							});
							_push(`<!--]-->`);
							if (hasCustomOption.value) _push(`<button class="${ssrRenderClass([{ "form-chip-active": selectedDonasiOpt.value === "custom" }, "form-chip"])}" data-v-2d9fa773> Lainnya </button>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						if (selectedDonasiOpt.value === "custom" || !hasFixedOptions.value && hasCustomOption.value) _push(`<div class="form-input-group" data-v-2d9fa773><span class="form-input-prefix" data-v-2d9fa773>Rp</span><input type="text" inputmode="numeric"${ssrRenderAttr("value", customDonasiValueFormatted.value)} class="form-input donasi-input" placeholder="0" data-v-2d9fa773></div>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`<div class="action-row" data-v-2d9fa773><button class="btn-action btn-secondary" data-v-2d9fa773>KEMBALI</button><button class="btn-action btn-primary" data-v-2d9fa773>LANJUT BAYAR ➔</button></div></div>`);
			} else if (currentStep.value === "bayar") {
				_push(`<div class="step-content active step-padded" data-v-2d9fa773>`);
				_push(ssrRenderComponent(CheckoutPayment_default, {
					grandTotal: unref(grandTotal),
					totalQty: unref(totalQty),
					totalPrice: unref(totalPrice),
					adminFee,
					kodeUnik: kodeUnik.value,
					donasiAmount: unref(donasiAmount),
					buktiBayarPreview: buktiBayarPreview.value,
					uploadError: uploadError.value,
					isSubmitting: isSubmitting.value,
					onFileUpload: handleFileUpload,
					onBack: ($event) => currentStep.value = "form",
					onSubmit: submitData,
					onToast: showToastMsg
				}, null, _parent));
				_push(`</div>`);
			} else if (currentStep.value === "sukses") {
				_push(`<div class="step-content active" data-v-2d9fa773>`);
				_push(ssrRenderComponent(SuccessStep_default, {
					eventData: eventData.value,
					isFree: unref(grandTotal) === 0,
					onKirimWa: kirimWA,
					onBukaGrup: bukaGrupWa,
					onLihatTiket: () => {
						_ctx.window.location.href = `/tiket/${transactionIdGlobal.value}`;
					}
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><div class="${ssrRenderClass([{ active: isSubmitting.value }, "api-loader"])}" data-v-2d9fa773><div class="printer-wrapper" data-v-2d9fa773><div class="printer-slot" data-v-2d9fa773><div class="printer-slot-inner" data-v-2d9fa773><div class="printer-slot-light" data-v-2d9fa773></div></div></div><div class="printer-mask" data-v-2d9fa773><div class="ticket-paper-output" data-v-2d9fa773><div class="ticket-header-star" data-v-2d9fa773>★ E-TICKET RESMI ★</div><div class="ticket-header-event" data-v-2d9fa773>${ssrInterpolate(eventData.value?.nama_event || "EVENT")}</div><div class="ticket-divider" data-v-2d9fa773></div><div class="ticket-owner-box" data-v-2d9fa773><span class="ticket-owner-label" data-v-2d9fa773>PESERTA</span><span class="ticket-owner-name" data-v-2d9fa773>${ssrInterpolate(daftarPeserta.value[0]?.jawaban?.nama_lengkap || "PESERTA")}</span></div><div class="ticket-trx-box" data-v-2d9fa773><span class="ticket-trx-id" data-v-2d9fa773>${ssrInterpolate(transactionIdGlobal.value || "MEMPROSES...")}</span></div><div class="ticket-summary-box" data-v-2d9fa773><span data-v-2d9fa773>${ssrInterpolate(daftarPeserta.value.length)} TIKET</span><span class="ticket-status-paid" data-v-2d9fa773>LUNAS</span></div><div class="fake-barcode-area" data-v-2d9fa773><div class="bar-4" data-v-2d9fa773></div><div class="bar-8" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-16" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-8" data-v-2d9fa773></div><div class="bar-12" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-16" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-8" data-v-2d9fa773></div><div class="bar-8" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-16" data-v-2d9fa773></div><div class="bar-4" data-v-2d9fa773></div><div class="bar-12" data-v-2d9fa773></div></div></div></div></div><div class="loading-badge" data-v-2d9fa773><div class="loading-dot" data-v-2d9fa773></div> MENCETAK TIKET... </div></div><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-2d9fa773"]]);

export { _slug__default as default };
//# sourceMappingURL=_slug_-OhKTzqxl.mjs.map
