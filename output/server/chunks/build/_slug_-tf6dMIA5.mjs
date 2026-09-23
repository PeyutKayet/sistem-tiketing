import { u as useSupabaseClient } from './useSupabaseClient-BMEM7jHo.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { useRoute } from 'vue-router';
import { ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderDynamicModel, ssrRenderClass } from 'vue/server-renderer';
import '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import '@supabase/ssr';
import '@iconify/vue';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
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

//#region \0virtual:public?%2Fqris.webp
var _virtual_public__2Fqris_default = publicAssetsURL("/qris.webp");
//#endregion
//#region app/pages/[slug].vue
var adminFee = 2e3;
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const toastMessage = ref("");
		const toastType = ref("");
		useRoute().params.slug;
		useSupabaseClient();
		const loading = ref(true);
		const error = ref(null);
		const eventData = ref(null);
		const organizerProfile = ref({});
		const tickets = ref([]);
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		const keranjang = ref({});
		const currentStep = ref("home");
		const isSetujuSnk = ref(false);
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
		const kodeUnik = ref(0);
		const grandTotal = computed(() => {
			if (totalPrice.value === 0) return 0;
			return totalPrice.value + adminFee + kodeUnik.value;
		});
		const totalMaksimalKuota = computed(() => {
			return tickets.value.reduce((sum, t) => sum + (t.kuota_maksimal || 0), 0);
		});
		const totalSisaKuota = computed(() => {
			return tickets.value.reduce((sum, t) => sum + (t.sisa_kuota || 0), 0);
		});
		const persentaseTerisi = computed(() => {
			if (totalMaksimalKuota.value === 0) return 0;
			const persen = (totalMaksimalKuota.value - totalSisaKuota.value) / totalMaksimalKuota.value * 100;
			return persen > 100 ? 100 : persen;
		});
		const formatWaLink = (noWa) => {
			if (!noWa || noWa === "62800000000") return "#";
			let noWaBersih = String(noWa).replace(/\D/g, "");
			if (noWaBersih.startsWith("0")) noWaBersih = "62" + noWaBersih.substring(1);
			return `https://wa.me/${noWaBersih}`;
		};
		ref(null);
		const buktiBayarPreview = ref("");
		const uploadError = ref(false);
		const isSubmitting = ref(false);
		ref([]);
		ref("");
		const transactionIdGlobal = ref("");
		const formatDate = (dateStr) => {
			if (!dateStr) return "Segera Hadir";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		};
		const formatPrice = (price) => {
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0
			}).format(price);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="container" data-v-dbc46a6b>`);
			if (toastMessage.value) _push(`<div style="${ssrRenderStyle([{
				"position": "fixed",
				"top": "20px",
				"left": "50%",
				"transform": "translateX(-50%)",
				"z-index": "9999",
				"padding": "12px 24px",
				"border-radius": "30px",
				"font-weight": "600",
				"font-size": "14px",
				"box-shadow": "0 8px 24px rgba(0,0,0,0.15)",
				"animation": "slideDown 0.3s ease-out",
				"color": "#fff"
			}, { background: toastType.value === "success" ? "#1a6a4a" : "#d43f34" }])}" data-v-dbc46a6b>${ssrInterpolate(toastMessage.value)}</div>`);
			else _push(`<!---->`);
			if (loading.value) _push(`<div style="${ssrRenderStyle({
				"padding": "50px",
				"text-align": "center",
				"color": "var(--text-main)"
			})}" data-v-dbc46a6b> Mempersiapkan ruang yang aman dan nyaman... </div>`);
			else if (error.value) _push(`<div style="${ssrRenderStyle({
				"padding": "50px",
				"text-align": "center",
				"color": "#ef4444"
			})}" data-v-dbc46a6b>${ssrInterpolate(error.value)}</div>`);
			else if (currentStep.value === "home") {
				_push(`<div class="step-content active" style="${ssrRenderStyle({ "padding": "6px" })}" data-v-dbc46a6b><div class="glass" style="${ssrRenderStyle({
					"margin-top": "0px",
					"padding": "1rem 1rem 0.5rem 1rem"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"margin-bottom": "0.75rem"
				})}" data-v-dbc46a6b><img loading="lazy"${ssrRenderAttr("src", fixPosterUrl(eventData.value.poster_url) || "https://placehold.co/900x300/F8FAFC/64748B?text=POSTER+EVENT")} alt="Poster Event" style="${ssrRenderStyle({
					"width": "100%",
					"aspect-ratio": "3 / 1",
					"object-fit": "cover",
					"border-radius": "10px",
					"margin-bottom": "0.5rem",
					"border": "1px solid var(--border-soft)",
					"box-shadow": "var(--shadow-sm)"
				})}" data-v-dbc46a6b><p style="${ssrRenderStyle({
					"font-size": "0.65rem",
					"font-weight": "700",
					"letter-spacing": "0.05em",
					"color": "var(--accent-main)",
					"text-transform": "uppercase",
					"margin-bottom": "0.1rem"
				})}" data-v-dbc46a6b>${ssrInterpolate(organizerProfile.value.nama_organizer || "EventHub Organizer")}</p><h1 style="${ssrRenderStyle({
					"font-size": "1.2rem",
					"font-weight": "800",
					"color": "var(--text-main)",
					"line-height": "1.2",
					"margin": "0",
					"letter-spacing": "-0.5px"
				})}" data-v-dbc46a6b>${ssrInterpolate(eventData.value.nama_event)}</h1></div><div style="${ssrRenderStyle({
					"display": "grid",
					"grid-template-columns": "1fr 1fr",
					"gap": "0.4rem",
					"margin-bottom": "0.75rem"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"background": "var(--bg-light)",
					"padding": "0.5rem",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"justify-content": "center",
					"gap": "0.2rem",
					"border": "1px solid var(--border-soft)"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.7rem",
					"font-weight": "600",
					"color": "var(--text-main)",
					"text-align": "center"
				})}" data-v-dbc46a6b>${ssrInterpolate(formatDate(eventData.value.tanggal_mulai))}</span></div><div style="${ssrRenderStyle({
					"background": "var(--bg-light)",
					"padding": "0.5rem",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"justify-content": "center",
					"gap": "0.2rem",
					"border": "1px solid var(--border-soft)"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.7rem",
					"font-weight": "600",
					"color": "var(--text-main)",
					"text-align": "center"
				})}" data-v-dbc46a6b>${ssrInterpolate(eventData.value.lokasi || "Lokasi Menyusul")}</span></div></div><div class="pricing-status-card" style="${ssrRenderStyle({
					"padding": "0.75rem",
					"margin-bottom": "0.75rem",
					"background": "var(--card-light)",
					"border": "1px solid var(--border-soft)",
					"border-radius": "12px",
					"text-align": "left"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.65rem",
					"font-weight": "700",
					"color": "var(--text-muted)",
					"letter-spacing": "1px"
				})}" data-v-dbc46a6b>DESKRIPSI EVENT</span><p style="${ssrRenderStyle({
					"font-size": "0.7rem",
					"color": "var(--text-main)",
					"line-height": "1.3",
					"margin-top": "2px"
				})}" data-v-dbc46a6b>${ssrInterpolate(eventData.value.deskripsi || "Deskripsi tidak tersedia.")}</p><div style="${ssrRenderStyle({
					"margin": "8px 0",
					"height": "1px",
					"background": "var(--border-soft)"
				})}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "4px"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.7rem",
					"font-weight": "700",
					"color": "var(--text-main)"
				})}" data-v-dbc46a6b>SISA KUOTA</span><span style="${ssrRenderStyle({
					"font-size": "0.7rem",
					"font-weight": "600",
					"color": "var(--text-muted)"
				})}" data-v-dbc46a6b><b style="${ssrRenderStyle({
					"color": "var(--text-main)",
					"font-size": "0.9rem",
					"font-weight": "800"
				})}" data-v-dbc46a6b>${ssrInterpolate(totalSisaKuota.value)}</b> / ${ssrInterpolate(totalMaksimalKuota.value)}</span></div><div style="${ssrRenderStyle({
					"width": "100%",
					"height": "5px",
					"background": "var(--border-soft)",
					"border-radius": "10px",
					"overflow": "hidden"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					width: persentaseTerisi.value + "%",
					height: "100%",
					background: "var(--accent-main)",
					transition: "width 1.5s ease-in-out"
				})}" data-v-dbc46a6b></div></div></div><div style="${ssrRenderStyle({
					"margin-bottom": "1rem",
					"display": "flex",
					"flex-direction": "column",
					"gap": "8px"
				})}" data-v-dbc46a6b><!--[-->`);
				ssrRenderList(tickets.value, (tiket) => {
					_push(`<div style="${ssrRenderStyle([{
						"background": "var(--card-light)",
						"border": "1px solid var(--border-soft)",
						"border-radius": "10px",
						"padding": "10px 12px",
						"display": "flex",
						"justify-content": "space-between",
						"align-items": "center",
						"transition": "var(--transition)"
					}, { opacity: tiket.sisa_kuota <= 0 ? "0.6" : "1" }])}" data-v-dbc46a6b><div style="${ssrRenderStyle({
						"flex": "1",
						"text-align": "left"
					})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
						"font-weight": "700",
						"font-size": "0.85rem",
						"color": "var(--text-main)"
					})}" data-v-dbc46a6b>${ssrInterpolate(tiket.nama_kategori)}</div><div style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "6px",
						"margin-top": "2px"
					})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
						"font-size": "0.8rem",
						"color": "var(--accent-main)",
						"font-weight": "800"
					})}" data-v-dbc46a6b>${ssrInterpolate(tiket.harga === 0 ? "GRATIS" : formatPrice(tiket.harga))}</span><span style="${ssrRenderStyle({
						"font-size": "0.65rem",
						"color": "var(--text-muted)",
						"border-left": "1px solid var(--border-soft)",
						"padding-left": "6px"
					})}" data-v-dbc46a6b> Sisa: ${ssrInterpolate(tiket.sisa_kuota)}</span></div></div><div style="${ssrRenderStyle({
						"display": "flex",
						"align-items": "center",
						"gap": "8px",
						"background": "var(--bg-light)",
						"padding": "4px",
						"border-radius": "8px",
						"border": "1px solid var(--border-soft)"
					})}" data-v-dbc46a6b><button${ssrIncludeBooleanAttr(tiket.sisa_kuota <= 0) ? " disabled" : ""} style="${ssrRenderStyle({
						"width": "24px",
						"height": "24px",
						"border-radius": "4px",
						"border": "none",
						"background": "var(--card-light)",
						"color": "var(--text-main)",
						"font-weight": "bold",
						"cursor": "pointer",
						"display": "flex",
						"justify-content": "center",
						"align-items": "center",
						"box-shadow": "var(--shadow-sm)"
					})}" data-v-dbc46a6b>-</button><span style="${ssrRenderStyle({
						"font-weight": "800",
						"width": "14px",
						"text-align": "center",
						"color": "var(--text-main)",
						"font-size": "0.85rem"
					})}" data-v-dbc46a6b>${ssrInterpolate(keranjang.value[tiket.id] || 0)}</span><button${ssrIncludeBooleanAttr(tiket.sisa_kuota <= 0) ? " disabled" : ""} style="${ssrRenderStyle({
						"width": "24px",
						"height": "24px",
						"border-radius": "4px",
						"border": "none",
						"background": "var(--text-main)",
						"color": "var(--card-light)",
						"font-weight": "bold",
						"cursor": "pointer",
						"display": "flex",
						"justify-content": "center",
						"align-items": "center",
						"box-shadow": "var(--shadow-sm)"
					})}" data-v-dbc46a6b>+</button></div></div>`);
				});
				_push(`<!--]--></div><button style="${ssrRenderStyle({
					"margin-top": "0",
					"padding": "0.75rem",
					"border-radius": "10px",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"gap": "6px",
					"font-size": "0.85rem",
					"flex-direction": "column",
					"line-height": "1.2",
					"width": "100%",
					"background": "var(--primary)",
					"color": "white",
					"border": "none",
					"cursor": "pointer",
					"transition": "0.2s"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"gap": "6px",
					"font-weight": "600"
				})}" data-v-dbc46a6b>DAFTAR SEKARANG ➔</div>`);
				if (totalQty.value > 0) _push(`<small style="${ssrRenderStyle({
					"font-size": "0.65rem",
					"font-weight": "600",
					"opacity": "0.9"
				})}" data-v-dbc46a6b>${ssrInterpolate(totalQty.value)} Tiket • ${ssrInterpolate(totalPrice.value === 0 ? "GRATIS" : formatPrice(totalPrice.value))}</small>`);
				else _push(`<!---->`);
				_push(`</button><div style="${ssrRenderStyle({
					"display": "grid",
					"grid-template-columns": "repeat(3, 1fr)",
					"gap": "0.4rem",
					"margin-top": "0.75rem",
					"padding-top": "0.75rem",
					"border-top": "1px solid #e2e8f0"
				})}" data-v-dbc46a6b><a${ssrRenderAttr("href", organizerProfile.value.link_ig || "#")} target="_blank" style="${ssrRenderStyle({
					"background": "#ffffff",
					"padding": "0.5rem 0.25rem",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"gap": "0.25rem",
					"text-decoration": "none",
					"border": "1px solid #e2e8f0",
					"transition": "0.2s",
					"box-shadow": "0 1px 3px rgba(0,0,0,0.02)"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.6rem",
					"font-weight": "600",
					"color": "var(--text-muted)",
					"text-transform": "uppercase"
				})}" data-v-dbc46a6b>Instagram</span></a><a${ssrRenderAttr("href", formatWaLink(organizerProfile.value.no_wa))} target="_blank" style="${ssrRenderStyle({
					"background": "#ffffff",
					"padding": "0.5rem 0.25rem",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"gap": "0.25rem",
					"text-decoration": "none",
					"border": "1px solid #e2e8f0",
					"transition": "0.2s",
					"box-shadow": "0 1px 3px rgba(0,0,0,0.02)"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.6rem",
					"font-weight": "600",
					"color": "var(--text-muted)",
					"text-transform": "uppercase"
				})}" data-v-dbc46a6b>WhatsApp</span></a><a${ssrRenderAttr("href", organizerProfile.value.link_web || "#")} target="_blank" style="${ssrRenderStyle({
					"background": "#ffffff",
					"padding": "0.5rem 0.25rem",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"gap": "0.25rem",
					"text-decoration": "none",
					"border": "1px solid #e2e8f0",
					"transition": "0.2s",
					"box-shadow": "0 1px 3px rgba(0,0,0,0.02)"
				})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
					"font-size": "0.6rem",
					"font-weight": "600",
					"color": "var(--text-muted)",
					"text-transform": "uppercase"
				})}" data-v-dbc46a6b>Website</span></a></div></div></div>`);
			} else if (currentStep.value === "snk") _push(`<div class="step-content active" style="${ssrRenderStyle({ "padding": "12px 15px" })}" data-v-dbc46a6b><h3 style="${ssrRenderStyle({
				"margin-top": "0",
				"color": "var(--primary)",
				"text-align": "center"
			})}" data-v-dbc46a6b>Syarat &amp; Ketentuan</h3><p style="${ssrRenderStyle({
				"font-size": "0.8rem",
				"text-align": "center",
				"color": "var(--text-muted)",
				"margin-top": "-5px"
			})}" data-v-dbc46a6b>Mohon baca dan setujui sebelum melanjutkan</p><div style="${ssrRenderStyle({
				"background": "#f8fafc",
				"border": "1px solid #e2e8f0",
				"border-radius": "8px",
				"padding": "10px",
				"max-height": "250px",
				"overflow-y": "auto",
				"font-size": "0.7rem",
				"line-height": "1.5",
				"color": "var(--text-muted)",
				"margin-bottom": "10px",
				"white-space": "pre-wrap"
			})}" data-v-dbc46a6b>${ssrInterpolate(eventData.value.settings?.snk_text || "Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.")}</div><label style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"font-size": "0.75rem",
				"font-weight": "600",
				"cursor": "pointer",
				"margin-bottom": "15px"
			})}" data-v-dbc46a6b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(isSetujuSnk.value) ? ssrLooseContain(isSetujuSnk.value, null) : isSetujuSnk.value) ? " checked" : ""} style="${ssrRenderStyle({
				"width": "20px",
				"height": "20px",
				"accent-color": "var(--primary)"
			})}" data-v-dbc46a6b> Saya menyetujui persyaratan di atas </label><div style="${ssrRenderStyle({
				"display": "flex",
				"gap": "8px"
			})}" data-v-dbc46a6b><button style="${ssrRenderStyle({
				"flex": "3",
				"padding": "12px",
				"border-radius": "10px",
				"font-weight": "600",
				"background": "#e2e8f0",
				"color": "#475569",
				"border": "none",
				"cursor": "pointer"
			})}" data-v-dbc46a6b>KEMBALI</button><button style="${ssrRenderStyle({
				"flex": "7",
				"padding": "12px",
				"border-radius": "10px",
				"font-weight": "600",
				"background": "var(--primary)",
				"color": "white",
				"border": "none",
				"cursor": "pointer"
			})}" data-v-dbc46a6b>LANJUTKAN ➔</button></div></div>`);
			else if (currentStep.value === "form") {
				_push(`<div class="step-content active" style="${ssrRenderStyle({ "padding": "12px 15px" })}" data-v-dbc46a6b><h3 style="${ssrRenderStyle({ "margin-top": "0" })}" data-v-dbc46a6b>Data Diri Peserta</h3><!--[-->`);
				ssrRenderList(daftarPeserta.value, (peserta, index) => {
					_push(`<div style="${ssrRenderStyle({
						"background": "#ffffff",
						"border": "1px solid #e2e8f0",
						"border-radius": "12px",
						"padding": "15px",
						"margin-bottom": "15px",
						"box-shadow": "0 2px 8px rgba(0,0,0,0.02)"
					})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
						"display": "flex",
						"justify-content": "space-between",
						"align-items": "center",
						"border-bottom": "1px dashed var(--border-soft)",
						"padding-bottom": "10px",
						"margin-bottom": "15px"
					})}" data-v-dbc46a6b><h4 style="${ssrRenderStyle({
						"margin": "0",
						"color": "var(--primary)",
						"font-size": "0.95rem"
					})}" data-v-dbc46a6b>Data Peserta Ke-${ssrInterpolate(index + 1)}</h4><span style="${ssrRenderStyle({
						"font-size": "0.65rem",
						"font-weight": "800",
						"color": "var(--accent-main)",
						"background": "#eff6ff",
						"border": "1px solid #bfdbfe",
						"padding": "4px 8px",
						"border-radius": "4px",
						"text-transform": "uppercase"
					})}" data-v-dbc46a6b>${ssrInterpolate(peserta.namaTiket)}</span></div><div style="${ssrRenderStyle({
						"display": "grid",
						"grid-template-columns": "repeat(12, minmax(0, 1fr))",
						"gap": "10px"
					})}" data-v-dbc46a6b><!--[-->`);
					ssrRenderList(customFields.value, (field) => {
						_push(`<div style="${ssrRenderStyle({ gridColumn: `span ${field.width || 12}` })}" data-v-dbc46a6b>`);
						if (field.type === "header") _push(`<div style="${ssrRenderStyle({
							"border-bottom": "2px solid var(--border-soft)",
							"padding-bottom": "6px",
							"margin": "12px 0 6px"
						})}" data-v-dbc46a6b><h3 style="${ssrRenderStyle({
							"margin": "0",
							"color": "var(--text-main)",
							"font-size": "1.1rem"
						})}" data-v-dbc46a6b>${ssrInterpolate(field.label)}</h3></div>`);
						else {
							_push(`<div data-v-dbc46a6b><label style="${ssrRenderStyle({
								"display": "block",
								"margin-bottom": "6px",
								"font-size": "0.75rem",
								"font-weight": "600",
								"color": "var(--text-muted)"
							})}" data-v-dbc46a6b>${ssrInterpolate(field.label)} `);
							if (field.required) _push(`<span style="${ssrRenderStyle({ "color": "#ef4444" })}" data-v-dbc46a6b>*</span>`);
							else _push(`<!---->`);
							_push(`</label>`);
							if (field.type === "phone_wa") _push(`<div style="${ssrRenderStyle({
								"display": "flex",
								"gap": "8px"
							})}" data-v-dbc46a6b><input type="text"${ssrRenderAttr("value", peserta["_cc_" + field.field_key])} placeholder="62" style="${ssrRenderStyle({
								"width": "55px",
								"min-width": "0",
								"padding": "10px",
								"box-sizing": "border-box",
								"text-align": "center",
								"background": "var(--bg-light)",
								"border": "1px solid var(--border-soft)",
								"border-radius": "8px",
								"font-size": "0.85rem",
								"font-weight": "600"
							})}" data-v-dbc46a6b><input type="tel"${ssrRenderAttr("value", peserta.jawaban[field.field_key])} placeholder="81234567890" style="${ssrRenderStyle({
								"flex": "1",
								"min-width": "0",
								"padding": "10px 12px",
								"box-sizing": "border-box",
								"background": "var(--bg-light)",
								"border": "1px solid var(--border-soft)",
								"border-radius": "8px",
								"font-size": "0.85rem"
							})}" data-v-dbc46a6b></div>`);
							else if (field.type === "paragraph") _push(`<textarea rows="3" style="${ssrRenderStyle({
								"width": "100%",
								"padding": "10px 12px",
								"box-sizing": "border-box",
								"background": "var(--bg-light)",
								"border": "1px solid var(--border-soft)",
								"border-radius": "8px",
								"font-family": "inherit",
								"font-size": "0.85rem",
								"outline": "none"
							})}"${ssrRenderAttr("placeholder", field.label)} data-v-dbc46a6b>${ssrInterpolate(peserta.jawaban[field.field_key])}</textarea>`);
							else if (field.type === "dropdown") {
								_push(`<select style="${ssrRenderStyle({
									"width": "100%",
									"padding": "10px 12px",
									"box-sizing": "border-box",
									"background": "var(--bg-light)",
									"border": "1px solid var(--border-soft)",
									"border-radius": "8px",
									"font-size": "0.85rem",
									"appearance": "none"
								})}" data-v-dbc46a6b><option value="" data-v-dbc46a6b${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], "") : ssrLooseEqual(peserta.jawaban[field.field_key], "")) ? " selected" : ""}>Pilih Opsi...</option><!--[-->`);
								ssrRenderList(field.options, (opt, i) => {
									_push(`<option${ssrRenderAttr("value", opt)} data-v-dbc46a6b${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], opt) : ssrLooseEqual(peserta.jawaban[field.field_key], opt)) ? " selected" : ""}>${ssrInterpolate(opt)}</option>`);
								});
								_push(`<!--]--></select>`);
							} else if (field.type === "multiple_choice") {
								_push(`<div style="${ssrRenderStyle({
									"display": "flex",
									"flex-direction": "column",
									"gap": "8px",
									"margin-top": "4px"
								})}" data-v-dbc46a6b><!--[-->`);
								ssrRenderList(field.options, (opt, i) => {
									_push(`<label style="${ssrRenderStyle({
										"display": "flex",
										"align-items": "center",
										"gap": "8px",
										"font-size": "0.85rem",
										"cursor": "pointer"
									})}" data-v-dbc46a6b><input type="radio"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(ssrLooseEqual(peserta.jawaban[field.field_key], opt)) ? " checked" : ""} style="${ssrRenderStyle({
										"width": "16px",
										"height": "16px",
										"flex-shrink": "0",
										"accent-color": "var(--primary)"
									})}" data-v-dbc46a6b> ${ssrInterpolate(opt)}</label>`);
								});
								_push(`<!--]--></div>`);
							} else if (field.type === "checkboxes") {
								_push(`<div style="${ssrRenderStyle({
									"display": "flex",
									"flex-direction": "column",
									"gap": "8px",
									"margin-top": "4px"
								})}" data-v-dbc46a6b><!--[-->`);
								ssrRenderList(field.options, (opt, i) => {
									_push(`<label style="${ssrRenderStyle({
										"display": "flex",
										"align-items": "center",
										"gap": "8px",
										"font-size": "0.85rem",
										"cursor": "pointer"
									})}" data-v-dbc46a6b><input type="checkbox"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], opt) : peserta.jawaban[field.field_key]) ? " checked" : ""} style="${ssrRenderStyle({
										"width": "16px",
										"height": "16px",
										"flex-shrink": "0",
										"accent-color": "var(--primary)"
									})}" data-v-dbc46a6b> ${ssrInterpolate(opt)}</label>`);
								});
								_push(`<!--]--></div>`);
							} else if (field.type === "linear_scale") {
								_push(`<div style="${ssrRenderStyle({
									"margin-top": "10px",
									"margin-bottom": "5px",
									"padding": "15px 12px",
									"background": "var(--bg-light)",
									"border-radius": "8px",
									"border": "1px solid var(--border-soft)"
								})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
									"display": "flex",
									"justify-content": "space-between",
									"align-items": "center",
									"gap": "10px"
								})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
									"font-size": "0.8rem",
									"font-weight": "700",
									"color": "var(--text-muted)"
								})}" data-v-dbc46a6b>1</span><div style="${ssrRenderStyle({
									"display": "flex",
									"flex": "1",
									"justify-content": "space-between",
									"align-items": "center"
								})}" data-v-dbc46a6b><!--[-->`);
								ssrRenderList(field.scaleCount || 5, (n) => {
									_push(`<label style="${ssrRenderStyle({
										"cursor": "pointer",
										"display": "flex",
										"flex-direction": "column",
										"align-items": "center",
										"position": "relative",
										"padding": "2px"
									})}" data-v-dbc46a6b>`);
									if (peserta.jawaban[field.field_key] === n) _push(`<span style="${ssrRenderStyle({
										"position": "absolute",
										"top": "-18px",
										"font-size": "0.75rem",
										"font-weight": "800",
										"color": "var(--primary)"
									})}" data-v-dbc46a6b>${ssrInterpolate(n)}</span>`);
									else _push(`<!---->`);
									_push(`<input type="radio"${ssrRenderAttr("value", n)}${ssrIncludeBooleanAttr(ssrLooseEqual(peserta.jawaban[field.field_key], n)) ? " checked" : ""} style="${ssrRenderStyle({
										"margin": "0",
										"width": "18px",
										"height": "18px",
										"accent-color": "var(--primary)",
										"cursor": "pointer"
									})}" data-v-dbc46a6b></label>`);
								});
								_push(`<!--]--></div><span style="${ssrRenderStyle({
									"font-size": "0.8rem",
									"font-weight": "700",
									"color": "var(--text-muted)"
								})}" data-v-dbc46a6b>${ssrInterpolate(field.scaleCount || 5)}</span></div></div>`);
							} else if (field.type === "file_upload") {
								_push(`<div style="${ssrRenderStyle({ "margin-top": "4px" })}" data-v-dbc46a6b><input type="file" accept="image/*,.pdf" style="${ssrRenderStyle({ "display": "none" })}"${ssrRenderAttr("id", "file_" + index + "_" + field.field_key)} data-v-dbc46a6b><label${ssrRenderAttr("for", "file_" + index + "_" + field.field_key)} style="${ssrRenderStyle({
									"display": "flex",
									"align-items": "center",
									"gap": "10px",
									"padding": "10px",
									"background": "var(--bg-light)",
									"border": "1px dashed var(--border-soft)",
									"border-radius": "8px",
									"cursor": "pointer",
									"transition": "0.2s"
								})}" data-v-dbc46a6b>`);
								if (peserta.jawaban[field.field_key]) _push(`<div style="${ssrRenderStyle({
									"width": "36px",
									"height": "36px",
									"border-radius": "6px",
									"background": "#dcfce7",
									"color": "#16a34a",
									"display": "flex",
									"align-items": "center",
									"justify-content": "center",
									"flex-shrink": "0"
								})}" data-v-dbc46a6b><svg style="${ssrRenderStyle({
									"width": "18px",
									"height": "18px"
								})}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-dbc46a6b><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-v-dbc46a6b></path><polyline points="22 4 12 14.01 9 11.01" data-v-dbc46a6b></polyline></svg></div>`);
								else _push(`<div style="${ssrRenderStyle({
									"width": "36px",
									"height": "36px",
									"border-radius": "6px",
									"background": "#f1f5f9",
									"color": "var(--text-muted)",
									"display": "flex",
									"align-items": "center",
									"justify-content": "center",
									"flex-shrink": "0"
								})}" data-v-dbc46a6b><svg style="${ssrRenderStyle({
									"width": "18px",
									"height": "18px"
								})}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-dbc46a6b><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-dbc46a6b></path><polyline points="17 8 12 3 7 8" data-v-dbc46a6b></polyline><line x1="12" y1="3" x2="12" y2="15" data-v-dbc46a6b></line></svg></div>`);
								_push(`<div style="${ssrRenderStyle({
									"flex": "1",
									"min-width": "0"
								})}" data-v-dbc46a6b>`);
								if (peserta.jawaban[field.field_key]) _push(`<div style="${ssrRenderStyle({
									"font-size": "0.75rem",
									"font-weight": "700",
									"color": "#16a34a",
									"white-space": "nowrap",
									"overflow": "hidden",
									"text-overflow": "ellipsis"
								})}" data-v-dbc46a6b>${ssrInterpolate(peserta.jawaban[field.field_key].name || "File terpilih")}</div>`);
								else _push(`<div style="${ssrRenderStyle({
									"font-size": "0.75rem",
									"font-weight": "600",
									"color": "var(--text-main)"
								})}" data-v-dbc46a6b>Pilih File</div>`);
								_push(`<div style="${ssrRenderStyle({
									"font-size": "0.65rem",
									"color": "var(--text-muted)",
									"margin-top": "2px"
								})}" data-v-dbc46a6b>Format JPG/PNG/PDF</div></div></label></div>`);
							} else if (field.type === "terms") _push(`<label style="${ssrRenderStyle({
								"display": "flex",
								"gap": "10px",
								"font-size": "0.75rem",
								"align-items": "flex-start",
								"padding": "12px",
								"box-sizing": "border-box",
								"background": "#f8fafc",
								"border": "1px solid #e2e8f0",
								"border-radius": "8px",
								"cursor": "pointer"
							})}" data-v-dbc46a6b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(peserta.jawaban[field.field_key]) ? ssrLooseContain(peserta.jawaban[field.field_key], null) : peserta.jawaban[field.field_key]) ? " checked" : ""} style="${ssrRenderStyle({
								"margin-top": "3px",
								"width": "16px",
								"height": "16px",
								"accent-color": "var(--primary)",
								"flex-shrink": "0"
							})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
								"line-height": "1.5",
								"color": "var(--text-muted)"
							})}" data-v-dbc46a6b>${ssrInterpolate(field.termsText || field.label)}</span></label>`);
							else _push(`<input${ssrRenderAttr("type", field.type === "date" ? "date" : field.type === "time" ? "time" : "text")}${ssrRenderDynamicModel(field.type === "date" ? "date" : field.type === "time" ? "time" : "text", peserta.jawaban[field.field_key], null)} style="${ssrRenderStyle({
								"width": "100%",
								"padding": "10px 12px",
								"box-sizing": "border-box",
								"background": "var(--bg-light)",
								"border": "1px solid var(--border-soft)",
								"border-radius": "8px",
								"font-family": "inherit",
								"font-size": "0.85rem",
								"outline": "none",
								"color": "var(--text-main)"
							})}"${ssrRenderAttr("placeholder", field.label)} data-v-dbc46a6b>`);
							_push(`</div>`);
						}
						_push(`</div>`);
					});
					_push(`<!--]--></div></div>`);
				});
				_push(`<!--]--><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "8px",
					"margin-top": "15px"
				})}" data-v-dbc46a6b><button style="${ssrRenderStyle({
					"flex": "3",
					"padding": "12px",
					"border-radius": "10px",
					"font-weight": "600",
					"background": "#e2e8f0",
					"color": "#475569",
					"border": "none",
					"cursor": "pointer"
				})}" data-v-dbc46a6b>KEMBALI</button><button style="${ssrRenderStyle({
					"flex": "7",
					"padding": "12px",
					"border-radius": "10px",
					"font-weight": "600",
					"background": "var(--primary)",
					"color": "white",
					"border": "none",
					"cursor": "pointer"
				})}" data-v-dbc46a6b>LANJUT BAYAR ➔</button></div></div>`);
			} else if (currentStep.value === "bayar") {
				_push(`<div class="step-content active" style="${ssrRenderStyle({ "padding": "12px 15px" })}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"background": "var(--bg-light)",
					"padding": "15px",
					"border-radius": "12px",
					"margin-bottom": "20px",
					"border": "1px solid #e2e8f0",
					"box-shadow": "0 4px 15px rgba(0,0,0,0.03)"
				})}" data-v-dbc46a6b><small style="${ssrRenderStyle({
					"font-weight": "700",
					"text-transform": "uppercase",
					"color": "var(--text-muted)",
					"letter-spacing": "1px",
					"text-align": "center",
					"display": "block"
				})}" data-v-dbc46a6b>Total Tagihan</small><div style="${ssrRenderStyle({
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"gap": "10px",
					"margin": "8px 0 15px"
				})}" data-v-dbc46a6b><h2 style="${ssrRenderStyle({
					"color": "var(--text-main)",
					"margin": "0",
					"font-size": "1.8rem",
					"font-weight": "900"
				})}" data-v-dbc46a6b>${ssrInterpolate(formatPrice(grandTotal.value))}</h2><button style="${ssrRenderStyle({
					"background": "white",
					"border": "1px solid var(--border-soft)",
					"border-radius": "6px",
					"padding": "6px",
					"cursor": "pointer",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"color": "var(--text-muted)",
					"box-shadow": "0 1px 2px rgba(0,0,0,0.05)"
				})}" title="Salin Nominal" data-v-dbc46a6b><svg style="${ssrRenderStyle({
					"width": "16px",
					"height": "16px"
				})}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-dbc46a6b><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-dbc46a6b></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-dbc46a6b></path></svg></button></div><div style="${ssrRenderStyle({
					"border-top": "1px dashed var(--border-soft)",
					"padding-top": "12px"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"font-size": "0.65rem",
					"color": "var(--text-muted)",
					"margin-bottom": "4px"
				})}" data-v-dbc46a6b><span data-v-dbc46a6b>Tiket (${ssrInterpolate(totalQty.value)}x)</span><span data-v-dbc46a6b>${ssrInterpolate(formatPrice(totalPrice.value))}</span></div><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"font-size": "0.55rem",
					"color": "var(--text-muted)",
					"opacity": "0.8",
					"margin-bottom": "3px"
				})}" data-v-dbc46a6b><span data-v-dbc46a6b>Biaya Layanan</span><span data-v-dbc46a6b>${ssrInterpolate(formatPrice(adminFee))}</span></div><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"font-size": "0.55rem",
					"color": "var(--text-muted)",
					"opacity": "0.8"
				})}" data-v-dbc46a6b><span data-v-dbc46a6b>Kode Unik</span><span data-v-dbc46a6b>+${ssrInterpolate(kodeUnik.value)}</span></div></div></div><div style="${ssrRenderStyle({
					"background": "var(--card-light)",
					"border": "1px solid var(--border-soft)",
					"border-radius": "12px",
					"padding": "15px 20px",
					"text-align": "center",
					"margin-bottom": "15px",
					"box-shadow": "var(--shadow-sm)"
				})}" data-v-dbc46a6b><p style="${ssrRenderStyle({
					"font-size": "0.75rem",
					"font-weight": "700",
					"color": "var(--text-main)",
					"margin": "0 0 10px",
					"letter-spacing": "0.5px"
				})}" data-v-dbc46a6b>SCAN QRIS UNTUK MEMBAYAR</p><img loading="lazy"${ssrRenderAttr("src", _virtual_public__2Fqris_default)} alt="QRIS Pembayaran" style="${ssrRenderStyle({
					"width": "100%",
					"max-width": "150px",
					"border-radius": "12px",
					"border": "1px solid var(--border-soft)",
					"margin-bottom": "10px",
					"box-shadow": "var(--shadow-sm)"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"background": "#FFFBEB",
					"border": "1px dashed #FCD34D",
					"padding": "10px",
					"border-radius": "8px",
					"display": "inline-block"
				})}" data-v-dbc46a6b><p style="${ssrRenderStyle({
					"font-size": "0.7rem",
					"color": "#D97706",
					"margin": "0",
					"font-weight": "800"
				})}" data-v-dbc46a6b>⚠️ PASTIKAN NOMINAL SESUAI</p><p style="${ssrRenderStyle({
					"font-size": "0.65rem",
					"color": "var(--text-main)",
					"margin": "4px 0 0",
					"font-weight": "600"
				})}" data-v-dbc46a6b>Termasuk 3 digit kode unik di belakang</p></div></div><div style="${ssrRenderStyle({ "margin-bottom": "12px" })}" data-v-dbc46a6b><label style="${ssrRenderStyle({
					"display": "block",
					"margin-bottom": "4px",
					"font-size": "0.75rem",
					"font-weight": "600",
					"color": "var(--text-muted)"
				})}" data-v-dbc46a6b>Upload Bukti Pembayaran <span style="${ssrRenderStyle({ "color": "#ef4444" })}" data-v-dbc46a6b>*</span></label><div style="${ssrRenderStyle({
					"border": "2px dashed var(--border-soft)",
					"border-radius": "12px",
					"padding": "40px 20px",
					"text-align": "center",
					"background": "var(--bg-light)",
					"cursor": "pointer",
					"position": "relative",
					"overflow": "hidden"
				})}" class="${ssrRenderClass({ "error-shake": uploadError.value })}" data-v-dbc46a6b>`);
				if (!buktiBayarPreview.value) _push(`<div style="${ssrRenderStyle({ "pointer-events": "none" })}" data-v-dbc46a6b><p style="${ssrRenderStyle({
					"margin": "0 0 6px 0",
					"font-size": "0.9rem",
					"font-weight": "700",
					"color": "var(--text-main)"
				})}" data-v-dbc46a6b>Klik untuk pilih foto struk</p><p style="${ssrRenderStyle({
					"margin": "0",
					"font-size": "0.75rem",
					"font-weight": "500",
					"color": "var(--text-muted)"
				})}" data-v-dbc46a6b>Format JPG/PNG • Maks. 5MB</p></div>`);
				else _push(`<img${ssrRenderAttr("src", buktiBayarPreview.value)} alt="Preview Bukti" style="${ssrRenderStyle({
					"width": "100%",
					"max-height": "250px",
					"object-fit": "contain",
					"border-radius": "8px",
					"border": "1px solid var(--border-soft)"
				})}" data-v-dbc46a6b>`);
				_push(`<input type="file" accept="image/*" style="${ssrRenderStyle({
					"position": "absolute",
					"inset": "0",
					"opacity": "0",
					"cursor": "pointer",
					"z-index": "10"
				})}" data-v-dbc46a6b></div></div><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "8px",
					"margin-top": "15px"
				})}" data-v-dbc46a6b><button style="${ssrRenderStyle({
					"flex": "3",
					"padding": "12px",
					"border-radius": "10px",
					"font-weight": "600",
					"background": "#e2e8f0",
					"color": "#475569",
					"border": "none",
					"cursor": "pointer"
				})}" data-v-dbc46a6b>KEMBALI</button><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} style="${ssrRenderStyle({
					"flex": "7",
					"padding": "12px",
					"border-radius": "10px",
					"font-weight": "600",
					"background": "#10b981",
					"color": "white",
					"border": "none",
					"cursor": "pointer"
				})}" data-v-dbc46a6b>${ssrInterpolate(isSubmitting.value ? "MEMPROSES..." : "DAFTAR SEKARANG ✔️")}</button></div></div>`);
			} else if (currentStep.value === "sukses") {
				_push(`<div class="step-content active" style="${ssrRenderStyle({
					"text-align": "center",
					"padding": "40px 15px 20px"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"width": "80px",
					"height": "80px",
					"background": "#10B981",
					"color": "white",
					"border-radius": "50%",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"margin": "0 auto 20px",
					"box-shadow": "0 0 0 8px #D1FAE5",
					"animation": "scaleIn 0.5s ease-out"
				})}" data-v-dbc46a6b><svg style="${ssrRenderStyle({
					"width": "40px",
					"height": "40px"
				})}" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" data-v-dbc46a6b><polyline points="20 6 9 17 4 12" data-v-dbc46a6b></polyline></svg></div><h2 style="${ssrRenderStyle({
					"margin": "0 0 8px",
					"font-weight": "900",
					"font-size": "1.5rem",
					"color": "var(--text-main)",
					"letter-spacing": "-0.5px"
				})}" data-v-dbc46a6b>Pendaftaran Berhasil!</h2><p style="${ssrRenderStyle({
					"color": "var(--text-muted)",
					"font-size": "0.85rem",
					"margin": "0 auto 25px",
					"line-height": "1.6",
					"max-width": "280px"
				})}" data-v-dbc46a6b> Terima kasih, data dan bukti pembayaran Anda telah kami terima. </p><div style="${ssrRenderStyle({
					"background": "var(--bg-light)",
					"border": "1px dashed var(--border-soft)",
					"padding": "18px",
					"border-radius": "16px",
					"margin-bottom": "25px",
					"position": "relative"
				})}" data-v-dbc46a6b><div style="${ssrRenderStyle({
					"position": "absolute",
					"top": "-12px",
					"left": "50%",
					"transform": "translateX(-50%)",
					"background": "#F59E0B",
					"color": "white",
					"font-size": "0.65rem",
					"font-weight": "800",
					"padding": "4px 12px",
					"border-radius": "20px",
					"letter-spacing": "0.5px"
				})}" data-v-dbc46a6b>LANGKAH TERAKHIR</div><p style="${ssrRenderStyle({
					"font-size": "0.8rem",
					"font-weight": "700",
					"color": "var(--text-main)",
					"margin": "10px 0 6px"
				})}" data-v-dbc46a6b>Kirim Pesan Konfirmasi</p><p style="${ssrRenderStyle({
					"font-size": "0.75rem",
					"color": "var(--text-muted)",
					"margin": "0 0 15px",
					"line-height": "1.5"
				})}" data-v-dbc46a6b>Ketuk tombol di bawah ini untuk mengirimkan tiket ke WhatsApp Admin agar segera diaktifkan.</p><button style="${ssrRenderStyle({
					"width": "100%",
					"padding": "14px",
					"border-radius": "12px",
					"font-weight": "700",
					"font-size": "0.85rem",
					"background": "#25D366",
					"color": "white",
					"border": "none",
					"cursor": "pointer",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"gap": "8px",
					"box-shadow": "0 4px 12px rgba(37, 211, 102, 0.25)",
					"transition": "0.2s"
				})}" data-v-dbc46a6b><svg style="${ssrRenderStyle({
					"width": "18px",
					"height": "18px"
				})}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-dbc46a6b><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" data-v-dbc46a6b></path></svg> KONFIRMASI VIA WHATSAPP </button></div>`);
				if (eventData.value?.settings?.link_grup_wa) _push(`<button style="${ssrRenderStyle({
					"width": "100%",
					"padding": "14px",
					"border-radius": "12px",
					"font-weight": "700",
					"font-size": "0.8rem",
					"background": "var(--card-light)",
					"color": "var(--text-main)",
					"border": "1px solid var(--border-soft)",
					"cursor": "pointer",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"gap": "6px"
				})}" data-v-dbc46a6b> MASUK GRUP INFO PESERTA </button>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><div class="${ssrRenderClass([{ active: isSubmitting.value }, "api-loader"])}" data-v-dbc46a6b><div class="printer-wrapper" data-v-dbc46a6b><div class="printer-slot" data-v-dbc46a6b><div class="printer-slot-inner" data-v-dbc46a6b><div class="printer-slot-light" data-v-dbc46a6b></div></div></div><div class="printer-mask" data-v-dbc46a6b><div class="ticket-paper-output" data-v-dbc46a6b><div style="${ssrRenderStyle({
				"font-size": "11px",
				"font-weight": "900",
				"letter-spacing": "2px",
				"color": "var(--primary)",
				"text-transform": "uppercase",
				"margin-bottom": "4px",
				"text-align": "center"
			})}" data-v-dbc46a6b>★ E-TICKET RESMI ★</div><div style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "800",
				"color": "var(--text-muted)",
				"margin-bottom": "16px",
				"text-align": "center",
				"text-transform": "uppercase"
			})}" data-v-dbc46a6b>${ssrInterpolate(eventData.value?.nama_event || "EVENT")}</div><div style="${ssrRenderStyle({
				"width": "100%",
				"border-top": "2px dashed #cbd5e1",
				"margin-bottom": "16px"
			})}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({
				"width": "100%",
				"text-align": "center"
			})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
				"font-size": "11px",
				"font-weight": "800",
				"color": "var(--text-muted)",
				"display": "block",
				"margin-bottom": "2px"
			})}" data-v-dbc46a6b>PESERTA</span><span style="${ssrRenderStyle({
				"font-size": "14px",
				"font-weight": "900",
				"color": "var(--text-main)",
				"text-transform": "uppercase"
			})}" data-v-dbc46a6b>${ssrInterpolate(daftarPeserta.value[0]?.jawaban?.nama_lengkap || "PESERTA")}</span></div><div style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"width": "100%",
				"margin-top": "10px",
				"padding": "6px 0",
				"border-top": "1px dashed #cbd5e1",
				"border-bottom": "1px dashed #cbd5e1"
			})}" data-v-dbc46a6b><span style="${ssrRenderStyle({
				"font-size": "13px",
				"font-weight": "900",
				"color": "var(--text-main)",
				"font-family": "monospace",
				"letter-spacing": "2px"
			})}" data-v-dbc46a6b>${ssrInterpolate(transactionIdGlobal.value || "MEMPROSES...")}</span></div><div style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "space-between",
				"width": "100%",
				"margin-top": "10px",
				"font-size": "10px",
				"font-weight": "900",
				"color": "var(--text-muted)",
				"border-top": "1px dotted #cbd5e1",
				"padding-top": "8px"
			})}" data-v-dbc46a6b><span data-v-dbc46a6b>${ssrInterpolate(daftarPeserta.value.length)} TIKET</span><span style="${ssrRenderStyle({ "color": "var(--primary)" })}" data-v-dbc46a6b>LUNAS</span></div><div class="fake-barcode-area" data-v-dbc46a6b><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "8px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "16px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "8px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "12px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "16px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "8px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "8px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "16px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "4px" })}" data-v-dbc46a6b></div><div style="${ssrRenderStyle({ "width": "12px" })}" data-v-dbc46a6b></div></div></div></div></div><div class="loading-badge" data-v-dbc46a6b><div class="loading-dot" data-v-dbc46a6b></div> MENCETAK TIKET... </div></div><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-dbc46a6b"]]);

export { _slug__default as default };
//# sourceMappingURL=_slug_-tf6dMIA5.mjs.map
