import { t as components_default } from './components-C44pW9aw.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { u as useAdmin } from './useAdmin-C8FerkPj.mjs';
import { _ as _sfc_main$1 } from './AdminFormBuilder-Bbb-btzh.mjs';
import { ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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
import 'vue-router';
import '@supabase/ssr';
import '@iconify/vue';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@iconify/utils/lib/css/icon';
import './useSupabaseClient-BMEM7jHo.mjs';

//#region app/pages/admin/event/[slug]/edit.vue
var _sfc_main = {
	__name: "edit",
	__ssrInlineRender: true,
	setup(__props) {
		const { isLoading, selectedEvent, formEditEvent, isSavingEdit, formForgeItems } = useAdmin();
		const fixPosterUrl = (url) => {
			if (!url) return "";
			return url.replace("http://192.168.1.7:8000", "https://supabase.e-tiket.web.id");
		};
		const posterFile = ref(null);
		const posterPreviewUrl = ref(null);
		const hpPreviewHtml = ref("<div style=\"color:#8a9aa8;font-size:11px;text-align:center;padding:10px 0;\">Memuat preview...</div>");
		const escapeHtml = (text) => {
			if (!text) return "";
			const div = (void 0).createElement("div");
			div.textContent = text;
			return div.innerHTML;
		};
		const updatePreviewFromItems = () => {
			let html = `
    <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
      <span style="font-size: 9px; color: #8a9aa8; font-weight: 700;">🎟️ TIKET:</span>
      <span style="font-size: 10px; font-weight: 800; color: var(--accent-main); background: #eff6ff; padding: 4px 8px; border-radius: 6px;">VIP / Reguler</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 8px; width: 100%;">
  `;
			const sorted = [...formForgeItems.value].sort((a, b) => a.y - b.y || a.x - b.x);
			for (const item of sorted) {
				html += `<div style="grid-column: span ${item.width || 12}; min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: transparent;">`;
				if (item.type === "header") html += `<div style="font-size:11px; font-weight:700; color:#0a1929; margin-top:4px; border-bottom:1px solid #e6edf5; padding-bottom:2px; word-wrap:break-word; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}</div>`;
				else html += `<label style="font-size:9px; font-weight:600; color:#4a5a6e; display:block; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink: 0;">${escapeHtml(item.label)}${item.required ? " <span style=\"color:#d43f34\">*</span>" : ""}</label>`;
				if (item.type === "header") ; else if (item.type === "short_text" || item.type === "phone_wa" || item.type === "currency_rp") html += `<input type="text" placeholder="${item.field_key === "nama_lengkap" ? "Budi Santoso" : item.field_key === "email" ? "budi@email.com" : item.type === "phone_wa" ? "08123456789" : "Jawaban singkat..."}" style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled/>`;
				else if (item.type === "date" || item.type === "time") html += `<input type="${item.type}" style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled/>`;
				else if (item.type === "paragraph") html += `<textarea placeholder="Jawaban panjang..." style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; resize:none; box-sizing: border-box; min-height: 40px;" disabled></textarea>`;
				else if (item.type === "dropdown") html += `<select style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled><option value="">Pilih Opsi ▼</option></select>`;
				else if (item.type === "multiple_choice" || item.type === "checkboxes") {
					html += `<div style="display:flex; flex-direction:column; gap:6px; font-size:10px; color:#4a5a6e; padding: 4px 0;">`;
					const isCheckbox = item.type === "checkboxes";
					(item.options || ["Opsi 1"]).forEach((o) => html += `<label style="display:flex; align-items:center; gap:6px; cursor:default;"><input type="${isCheckbox ? "checkbox" : "radio"}" disabled style="margin:0; width:12px; height:12px; accent-color:var(--primary);" /> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(o)}</span></label>`);
					html += `</div>`;
				} else if (item.type === "linear_scale") {
					const maxScale = item.scaleCount || 5;
					html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 8px;">
                     <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:bold; color:#64748b;">
                       <span>1</span>
                       <div style="display:flex; flex:1; justify-content:space-between; padding:0 8px;">`;
					for (let i = 1; i <= maxScale; i++) html += `<input type="radio" disabled style="margin:0; width:12px; height:12px; accent-color:var(--primary);" />`;
					html += `    </div>
                       <span>${maxScale}</span>
                     </div>
                   </div>`;
				} else if (item.type === "terms") {
					const termsText = item.termsText || "Saya menyetujui semua syarat dan ketentuan yang berlaku.";
					html += `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; max-height: 60px; overflow-y: hidden; font-size: 8px; line-height: 1.4; color: #8a9aa8; margin-bottom: 6px; white-space: pre-wrap;">${escapeHtml(termsText)}</div>
          <label style="display:flex; align-items:center; gap:6px; cursor:default; font-size:9px;"><input type="checkbox" disabled style="margin:0; width:12px; height:12px; accent-color:var(--primary);" /> Saya menyetujui</label>`;
				} else if (item.type === "file_upload") html += `<div style="border:1px dashed #c8d6e8; background:#fafcfe; border-radius:6px; padding:12px; text-align:center; font-size:10px; color:#8a9aa8; display:flex; align-items:center; justify-content:center; box-sizing: border-box;">📎 Klik untuk Upload</div>`;
				else if (item.type === "domisili_api") html += `<select style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" disabled><option value="">Pilih Provinsi / Kota ▼</option></select>`;
				else html += `<input type="text" placeholder="Jawaban..." disabled style="width:100%; padding:6px; border:1px solid #e6edf5; border-radius:6px; font-size:10px; background:#fafcfe; box-sizing: border-box;" />`;
				html += `</div>`;
			}
			html += "</div>";
			hpPreviewHtml.value = html;
		};
		watch(selectedEvent, (val) => {
			if (val) {
				const s = val.settings || {};
				formEditEvent.value = {
					nama: val.nama_event,
					slug: val.slug,
					tanggal: val.tanggal_mulai ? val.tanggal_mulai.substring(0, 10) : "",
					lokasi: val.lokasi,
					deskripsi: val.deskripsi,
					tipe_event: s.tipe_event || "offline",
					is_qr_active: s.is_qr_active !== false,
					is_online_absen_active: s.is_online_absen_active || false,
					sistem_checkin: val.sistem_checkin || "scanner",
					target_absen: val.target_absen || 0,
					is_snk_active: s.is_snk_active !== false,
					snk_text: s.snk_text || "Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.",
					is_anti_calo_email: s.is_anti_calo_email || false,
					is_anti_calo_wa: s.is_anti_calo_wa || false,
					is_wa_konfirm: s.is_wa_konfirm || false,
					is_donasi_active: s.is_donasi_active || false,
					donasi_header: s.donasi_header || "",
					donasi_options: s.donasi_options || "",
					is_grup_wa_active: s.link_grup_wa && s.link_grup_wa.length > 5,
					link_grup_wa: s.link_grup_wa || ""
				};
				if (s.pertanyaan_kustom && Array.isArray(s.pertanyaan_kustom)) formForgeItems.value = s.pertanyaan_kustom;
				else formForgeItems.value = getDefaultItems();
				setTimeout(() => {
					updatePreviewFromItems();
				}, 500);
				posterPreviewUrl.value = fixPosterUrl(val.poster_url) || null;
				posterFile.value = null;
			}
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-461cb084>`);
			if (unref(selectedEvent)) {
				_push(`<div id="page-edit" data-v-461cb084><div class="page-header" data-v-461cb084><h2 class="page-title" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Edit <span data-v-461cb084>${ssrInterpolate(unref(selectedEvent).nama_event)}</span></h2><button class="btn-outline" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:arrow-left",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Kembali</button></div><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "28px",
					"flex-wrap": "wrap"
				})}" data-v-461cb084><div style="${ssrRenderStyle({
					"flex": "1.2",
					"min-width": "280px"
				})}" data-v-461cb084><div class="panel" data-v-461cb084><div class="mb-3" data-v-461cb084><label class="form-label" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:image",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Upload Poster Event</label><input type="file" accept="image/*" class="form-file" style="${ssrRenderStyle({
					"background": "#f7faff",
					"padding": "10px",
					"border-radius": "12px",
					"border": "1px dashed #bcc8d8"
				})}" data-v-461cb084></div><div class="row mb-3" data-v-461cb084><div class="col" data-v-461cb084><label class="form-label" data-v-461cb084>Nama Acara</label><input type="text"${ssrRenderAttr("value", unref(formEditEvent).nama)} class="form-control" data-v-461cb084></div><div class="col" data-v-461cb084><label class="form-label" data-v-461cb084>Slug</label><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "8px"
				})}" data-v-461cb084><input type="text"${ssrRenderAttr("value", unref(formEditEvent).slug)} class="form-control" data-v-461cb084><button class="btn-outline btn-sm" data-v-461cb084>📋</button></div></div></div><div class="row mb-3" data-v-461cb084><div class="col" data-v-461cb084><label class="form-label" data-v-461cb084>Tanggal</label><input type="date"${ssrRenderAttr("value", unref(formEditEvent).tanggal)} class="form-control" data-v-461cb084></div><div class="col" data-v-461cb084><label class="form-label" data-v-461cb084>Lokasi</label><input type="text"${ssrRenderAttr("value", unref(formEditEvent).lokasi)} class="form-control" data-v-461cb084></div></div><div class="mb-3" data-v-461cb084><label class="form-label" data-v-461cb084>Deskripsi</label><textarea rows="2" class="form-control" data-v-461cb084>${ssrInterpolate(unref(formEditEvent).deskripsi)}</textarea></div></div><div class="panel" data-v-461cb084><h4 style="${ssrRenderStyle({
					"margin-bottom": "12px",
					"font-weight": "600",
					"color": "#0a1929",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:map-pin",
					style: {
						"font-size": "16px",
						"color": "var(--primary)"
					}
				}, null, _parent));
				_push(` Format Acara &amp; Absensi </h4><div style="${ssrRenderStyle({
					"display": "flex",
					"gap": "10px",
					"margin-bottom": "15px"
				})}" data-v-461cb084><label style="${ssrRenderStyle({
					flex: 1,
					border: "1px solid",
					borderColor: unref(formEditEvent).tipe_event === "offline" ? "var(--primary)" : "#e2e8f0",
					background: unref(formEditEvent).tipe_event === "offline" ? "#eff6ff" : "white",
					borderRadius: "8px",
					padding: "12px",
					cursor: "pointer",
					textAlign: "center",
					transition: "all 0.2s"
				})}" data-v-461cb084><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formEditEvent).tipe_event, "offline")) ? " checked" : ""} value="offline" style="${ssrRenderStyle({ "display": "none" })}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:building",
					style: {
						fontSize: "24px",
						color: unref(formEditEvent).tipe_event === "offline" ? "var(--primary)" : "#94a3b8",
						marginBottom: "4px"
					}
				}, null, _parent));
				_push(`<div style="${ssrRenderStyle({
					fontSize: "0.8rem",
					fontWeight: 700,
					color: unref(formEditEvent).tipe_event === "offline" ? "var(--primary)" : "#475569"
				})}" data-v-461cb084>Di Lokasi (Offline)</div></label><label style="${ssrRenderStyle({
					flex: 1,
					border: "1px solid",
					borderColor: unref(formEditEvent).tipe_event === "online" ? "var(--primary)" : "#e2e8f0",
					background: unref(formEditEvent).tipe_event === "online" ? "#eff6ff" : "white",
					borderRadius: "8px",
					padding: "12px",
					cursor: "pointer",
					textAlign: "center",
					transition: "all 0.2s"
				})}" data-v-461cb084><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formEditEvent).tipe_event, "online")) ? " checked" : ""} value="online" style="${ssrRenderStyle({ "display": "none" })}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:monitor-play",
					style: {
						fontSize: "24px",
						color: unref(formEditEvent).tipe_event === "online" ? "var(--primary)" : "#94a3b8",
						marginBottom: "4px"
					}
				}, null, _parent));
				_push(`<div style="${ssrRenderStyle({
					fontSize: "0.8rem",
					fontWeight: 700,
					color: unref(formEditEvent).tipe_event === "online" ? "var(--primary)" : "#475569"
				})}" data-v-461cb084>Virtual (Online)</div></label><label style="${ssrRenderStyle({
					flex: 1,
					border: "1px solid",
					borderColor: unref(formEditEvent).tipe_event === "hybrid" ? "var(--primary)" : "#e2e8f0",
					background: unref(formEditEvent).tipe_event === "hybrid" ? "#eff6ff" : "white",
					borderRadius: "8px",
					padding: "12px",
					cursor: "pointer",
					textAlign: "center",
					transition: "all 0.2s"
				})}" data-v-461cb084><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formEditEvent).tipe_event, "hybrid")) ? " checked" : ""} value="hybrid" style="${ssrRenderStyle({ "display": "none" })}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:refresh-cw",
					style: {
						fontSize: "24px",
						color: unref(formEditEvent).tipe_event === "hybrid" ? "var(--primary)" : "#94a3b8",
						marginBottom: "4px"
					}
				}, null, _parent));
				_push(`<div style="${ssrRenderStyle({
					fontSize: "0.8rem",
					fontWeight: 700,
					color: unref(formEditEvent).tipe_event === "hybrid" ? "var(--primary)" : "#475569"
				})}" data-v-461cb084>Hybrid</div></label></div>`);
				if (unref(formEditEvent).tipe_event === "offline" || unref(formEditEvent).tipe_event === "hybrid") {
					_push(`<div style="${ssrRenderStyle({
						"background": "#f8fafc",
						"padding": "12px",
						"border-radius": "8px",
						"border": "1px solid #e2e8f0",
						"margin-bottom": "10px"
					})}" data-v-461cb084><label class="checkbox-item mb-0" style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_qr_active) ? ssrLooseContain(unref(formEditEvent).is_qr_active, null) : unref(formEditEvent).is_qr_active) ? " checked" : ""} data-v-461cb084> <span style="${ssrRenderStyle({ "font-size": "0.85rem" })}" data-v-461cb084>Wajibkan Scan QR Code (Bagi Peserta Di Lokasi)</span></label>`);
					if (unref(formEditEvent).is_qr_active) {
						_push(`<div style="${ssrRenderStyle({
							"margin-left": "24px",
							"margin-top": "10px"
						})}" data-v-461cb084><label class="form-label" style="${ssrRenderStyle({ "font-size": "0.75rem" })}" data-v-461cb084>Frekuensi Scan</label><div style="${ssrRenderStyle({
							"display": "flex",
							"gap": "8px"
						})}" data-v-461cb084><select class="form-control" style="${ssrRenderStyle({
							"font-size": "0.8rem",
							"padding": "8px"
						})}" data-v-461cb084><option value="scanner" data-v-461cb084${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).sistem_checkin) ? ssrLooseContain(unref(formEditEvent).sistem_checkin, "scanner") : ssrLooseEqual(unref(formEditEvent).sistem_checkin, "scanner")) ? " selected" : ""}>1x Scan Langsung Hangus (Event Biasa)</option><option value="none" data-v-461cb084${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).sistem_checkin) ? ssrLooseContain(unref(formEditEvent).sistem_checkin, "none") : ssrLooseEqual(unref(formEditEvent).sistem_checkin, "none")) ? " selected" : ""}>Bebas Scan Berkali-kali (Akses Keluar-Masuk / Bazar)</option><option value="portal" data-v-461cb084${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).sistem_checkin) ? ssrLooseContain(unref(formEditEvent).sistem_checkin, "portal") : ssrLooseEqual(unref(formEditEvent).sistem_checkin, "portal")) ? " selected" : ""}>Scan Dibatasi Kuota Hari (Training / Bootcamp)</option></select>`);
						if (unref(formEditEvent).sistem_checkin === "portal") _push(`<input type="number"${ssrRenderAttr("value", unref(formEditEvent).target_absen)} class="form-control" placeholder="Jml hari: 3" style="${ssrRenderStyle({
							"font-size": "0.8rem",
							"padding": "8px",
							"width": "120px"
						})}" data-v-461cb084>`);
						else _push(`<!---->`);
						_push(`</div></div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (unref(formEditEvent).tipe_event === "online" || unref(formEditEvent).tipe_event === "hybrid") {
					_push(`<div style="${ssrRenderStyle({
						"background": "#eff6ff",
						"padding": "12px",
						"border-radius": "8px",
						"border": "1px dashed #93c5fd"
					})}" data-v-461cb084><label class="checkbox-item mb-0" style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_online_absen_active) ? ssrLooseContain(unref(formEditEvent).is_online_absen_active, null) : unref(formEditEvent).is_online_absen_active) ? " checked" : ""} data-v-461cb084> <span style="${ssrRenderStyle({
						"font-size": "0.85rem",
						"color": "#1e40af"
					})}" data-v-461cb084>Catat Kehadiran via Portal Absensi (Untuk Peserta Virtual)</span></label>`);
					if (unref(formEditEvent).is_online_absen_active) _push(`<div style="${ssrRenderStyle({
						"margin-left": "24px",
						"margin-top": "10px"
					})}" data-v-461cb084><label class="form-label" style="${ssrRenderStyle({
						"font-size": "0.75rem",
						"color": "#1e40af"
					})}" data-v-461cb084>Bagikan link ini saat acara berlangsung:</label><input type="text" readonly${ssrRenderAttr("value", "https://e-tiket.web.id/absen/" + unref(formEditEvent).slug)} class="form-control" style="${ssrRenderStyle({
						"background": "white",
						"font-size": "0.8rem",
						"padding": "8px",
						"color": "#1d4ed8",
						"font-weight": "600"
					})}" data-v-461cb084><small style="${ssrRenderStyle({
						"font-size": "10px",
						"color": "#3b82f6",
						"margin-top": "4px",
						"display": "block"
					})}" data-v-461cb084>Peserta klik link ini &gt; masukkan Email/WA &gt; Absen sukses!</small></div>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div><div class="panel" data-v-461cb084><h4 style="${ssrRenderStyle({
					"margin-bottom": "12px",
					"font-weight": "600",
					"color": "#0a1929",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:plug",
					style: {
						"font-size": "16px",
						"color": "var(--primary)"
					}
				}, null, _parent));
				_push(` Fitur Tambahan Pendaftaran </h4><label class="checkbox-item mb-0" style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_grup_wa_active) ? ssrLooseContain(unref(formEditEvent).is_grup_wa_active, null) : unref(formEditEvent).is_grup_wa_active) ? " checked" : ""} data-v-461cb084> <span style="${ssrRenderStyle({ "font-size": "0.85rem" })}" data-v-461cb084>Arahkan Peserta ke Grup Komunitas (WA/Telegram)</span></label>`);
				if (unref(formEditEvent).is_grup_wa_active) _push(`<div style="${ssrRenderStyle({
					"margin-left": "24px",
					"margin-top": "8px",
					"margin-bottom": "12px"
				})}" data-v-461cb084><input type="url"${ssrRenderAttr("value", unref(formEditEvent).link_grup_wa)} placeholder="Masukkan Link Grup (https://chat.whatsapp...)" class="form-control" style="${ssrRenderStyle({ "font-size": "0.85rem" })}" data-v-461cb084></div>`);
				else _push(`<!---->`);
				_push(`<div style="${ssrRenderStyle({
					"margin-top": "12px",
					"border-top": "1px dashed #e2e8f0",
					"padding-top": "12px"
				})}" data-v-461cb084><label class="checkbox-item mb-0" style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_snk_active) ? ssrLooseContain(unref(formEditEvent).is_snk_active, null) : unref(formEditEvent).is_snk_active) ? " checked" : ""} data-v-461cb084> <span style="${ssrRenderStyle({ "font-size": "0.85rem" })}" data-v-461cb084>Wajibkan Persetujuan Syarat &amp; Ketentuan (S&amp;K)</span></label>`);
				if (unref(formEditEvent).is_snk_active) _push(`<div style="${ssrRenderStyle({
					"margin-left": "24px",
					"margin-top": "8px"
				})}" data-v-461cb084><textarea rows="2" class="form-control" placeholder="Ketik S&amp;K di sini..." style="${ssrRenderStyle({ "font-size": "0.85rem" })}" data-v-461cb084>${ssrInterpolate(unref(formEditEvent).snk_text)}</textarea></div>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="panel" data-v-461cb084><h4 style="${ssrRenderStyle({
					"margin-bottom": "8px",
					"font-weight": "600",
					"color": "#0a1929",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:shield-check",
					style: {
						"font-size": "16px",
						"color": "var(--primary)"
					}
				}, null, _parent));
				_push(` Anti Calo</h4><label class="checkbox-item mb-1" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_anti_calo_email) ? ssrLooseContain(unref(formEditEvent).is_anti_calo_email, null) : unref(formEditEvent).is_anti_calo_email) ? " checked" : ""} data-v-461cb084> 1 Email = 1 Tiket <span class="text-muted" style="${ssrRenderStyle({
					"font-size": "12px",
					"margin-left": "4px"
				})}" data-v-461cb084>(Peserta tidak bisa daftar berulang dengan email yang sama)</span></label><label class="checkbox-item mb-1" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_anti_calo_wa) ? ssrLooseContain(unref(formEditEvent).is_anti_calo_wa, null) : unref(formEditEvent).is_anti_calo_wa) ? " checked" : ""} data-v-461cb084> 1 WA = 1 Tiket </label><label class="checkbox-item mb-1" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_wa_konfirm) ? ssrLooseContain(unref(formEditEvent).is_wa_konfirm, null) : unref(formEditEvent).is_wa_konfirm) ? " checked" : ""} data-v-461cb084> Wajib Konfirmasi Nomor WA Aktif (Akan dikirim OTP) </label></div><div class="panel" data-v-461cb084><h4 style="${ssrRenderStyle({
					"margin-bottom": "8px",
					"font-weight": "600",
					"color": "#0a1929",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:heart-handshake",
					style: {
						"font-size": "16px",
						"color": "#d43f34"
					}
				}, null, _parent));
				_push(` Fitur Donasi / Infaq</h4><div class="mb-3" data-v-461cb084><label class="checkbox-item" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_donasi_active) ? ssrLooseContain(unref(formEditEvent).is_donasi_active, null) : unref(formEditEvent).is_donasi_active) ? " checked" : ""} data-v-461cb084> Aktifkan Form Donasi Saat Pendaftaran </label></div>`);
				if (unref(formEditEvent).is_donasi_active) _push(`<div style="${ssrRenderStyle({
					"padding-top": "10px",
					"border-top": "1px dashed #e6edf5"
				})}" data-v-461cb084><div class="row" data-v-461cb084><div class="col" data-v-461cb084><label class="form-label" data-v-461cb084>Teks Header Donasi</label><input type="text"${ssrRenderAttr("value", unref(formEditEvent).donasi_header)} class="form-control" placeholder="Contoh: Infaq Pembangunan Masjid" data-v-461cb084></div><div class="col" data-v-461cb084><label class="form-label" data-v-461cb084>Pilihan Nominal (Pisahkan dengan koma)</label><input type="text"${ssrRenderAttr("value", unref(formEditEvent).donasi_options)} class="form-control" placeholder="Contoh: 10000, 50000, 100000, custom" data-v-461cb084><span class="text-muted" style="${ssrRenderStyle({
					"font-size": "11px",
					"display": "block",
					"margin-top": "4px"
				})}" data-v-461cb084>Tulis &quot;custom&quot; jika ingin peserta mengisi nominal sendiri.</span></div></div></div>`);
				else _push(`<!---->`);
				_push(`</div><div class="panel" data-v-461cb084><h4 style="${ssrRenderStyle({
					"margin-bottom": "8px",
					"font-weight": "600",
					"color": "#0a1929",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:message-circle",
					style: {
						"font-size": "16px",
						"color": "#15803d"
					}
				}, null, _parent));
				_push(` Grup Komunikasi</h4><div class="mb-3" data-v-461cb084><label class="checkbox-item" data-v-461cb084><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formEditEvent).is_grup_wa_active) ? ssrLooseContain(unref(formEditEvent).is_grup_wa_active, null) : unref(formEditEvent).is_grup_wa_active) ? " checked" : ""} data-v-461cb084> Sediakan Link Grup WhatsApp Peserta </label></div>`);
				if (unref(formEditEvent).is_grup_wa_active) _push(`<div style="${ssrRenderStyle({
					"padding-top": "10px",
					"border-top": "1px dashed #e6edf5"
				})}" data-v-461cb084><label class="form-label" data-v-461cb084>Link Grup WA</label><input type="url"${ssrRenderAttr("value", unref(formEditEvent).link_grup_wa)} class="form-control" placeholder="https://chat.whatsapp.com/..." data-v-461cb084></div>`);
				else _push(`<!---->`);
				_push(`</div><div class="panel" data-v-461cb084><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "12px"
				})}" data-v-461cb084><h4 style="${ssrRenderStyle({
					"margin": "0",
					"font-weight": "600",
					"color": "#0a1929",
					"display": "flex",
					"align-items": "center",
					"gap": "6px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:file-cog",
					style: {
						"font-size": "16px",
						"color": "var(--primary)"
					}
				}, null, _parent));
				_push(` Form Pendaftaran (FormForge)</h4></div>`);
				_push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
				_push(`</div><button class="btn-primary"${ssrIncludeBooleanAttr(unref(isSavingEdit)) ? " disabled" : ""} style="${ssrRenderStyle({
					"margin-top": "14px",
					"width": "100%",
					"padding": "14px",
					"font-size": "15px"
				})}" data-v-461cb084>${ssrInterpolate(unref(isSavingEdit) ? "<Icon name=\"lucide:hourglass\" style=\"margin-right:4px;\" /> Menyimpan..." : "💾 Simpan Perubahan")}</button></div><div class="preview-sticky" data-v-461cb084><div style="${ssrRenderStyle({
					"font-weight": "600",
					"font-size": "14px",
					"color": "#4a5a6e",
					"margin-bottom": "10px",
					"letter-spacing": "0.2px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:eye",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` Live Preview E-Tiket</div><div style="${ssrRenderStyle({
					"background": "#0a1929",
					"border-radius": "32px",
					"padding": "14px 12px",
					"box-shadow": "0 24px 56px -16px rgba(0, 0, 0, 0.4)",
					"height": "580px",
					"display": "flex",
					"flex-direction": "column"
				})}" data-v-461cb084><div class="hide-scrollbar" style="${ssrRenderStyle({
					"background": "#f8fafc",
					"border-radius": "20px",
					"overflow-y": "auto",
					"padding": "14px 16px 18px 16px",
					"flex": "1",
					"font-size": "12px",
					"scrollbar-width": "none",
					"-ms-overflow-style": "none"
				})}" data-v-461cb084><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"font-size": "10px",
					"color": "#8a9aa8",
					"padding-bottom": "4px",
					"border-bottom": "1px solid #f0f4fa",
					"margin-bottom": "6px"
				})}" data-v-461cb084><span style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-461cb084>12:30</span><span style="${ssrRenderStyle({
					"display": "flex",
					"gap": "4px",
					"align-items": "center"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:signal",
					style: { "font-size": "12px" }
				}, null, _parent));
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:wifi",
					style: { "font-size": "12px" }
				}, null, _parent));
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:battery-medium",
					style: { "font-size": "14px" }
				}, null, _parent));
				_push(`</span></div><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "center",
					"margin-bottom": "12px"
				})}" data-v-461cb084><span style="${ssrRenderStyle({
					"background": "#eef3f9",
					"color": "var(--primary)",
					"padding": "4px 12px",
					"border-radius": "20px",
					"font-size": "9px",
					"font-weight": "700",
					"letter-spacing": "0.5px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:ticket",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` EVENTHUB TICKET</span></div><div style="${ssrRenderStyle({
					"background": "#ffffff",
					"border-radius": "16px",
					"padding": "12px",
					"box-shadow": "0 4px 12px rgba(0,0,0,0.03)",
					"margin-bottom": "12px",
					"border": "1px solid #e6edf5"
				})}" data-v-461cb084><div style="${ssrRenderStyle({
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"margin-bottom": "12px"
				})}" data-v-461cb084><div style="${ssrRenderStyle([{
					"width": "100%",
					"height": "100px",
					"border-radius": "10px",
					"margin-bottom": "8px",
					"background-size": "cover",
					"background-position": "center",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center",
					"font-size": "28px",
					"color": "rgba(255,255,255,0.7)",
					"border": "1px solid #e2e8f0"
				}, posterPreviewUrl.value ? { backgroundImage: `url('${posterPreviewUrl.value}')` } : { background: "linear-gradient(145deg, var(--primary), #3b82f6)" }])}" data-v-461cb084>`);
				if (!posterPreviewUrl.value) _push(ssrRenderComponent(_component_Icon, { name: "lucide:rocket" }, null, _parent));
				else _push(`<!---->`);
				_push(`</div><p style="${ssrRenderStyle({
					"font-size": "9px",
					"font-weight": "700",
					"letter-spacing": "0.05em",
					"color": "var(--accent-main)",
					"text-transform": "uppercase",
					"margin-bottom": "2px"
				})}" data-v-461cb084> Organizer Name </p><h1 style="${ssrRenderStyle({
					"font-size": "16px",
					"font-weight": "800",
					"color": "#0a1929",
					"line-height": "1.2",
					"margin": "0",
					"letter-spacing": "-0.5px",
					"text-align": "center"
				})}" data-v-461cb084>${ssrInterpolate(unref(formEditEvent).nama || "Event Baru")}</h1></div><div style="${ssrRenderStyle({
					"display": "grid",
					"grid-template-columns": "1fr 1fr",
					"gap": "6px",
					"margin-bottom": "12px"
				})}" data-v-461cb084><div style="${ssrRenderStyle({
					"background": "#f8fafc",
					"padding": "8px",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"justify-content": "center",
					"gap": "4px",
					"border": "1px solid #e2e8f0"
				})}" data-v-461cb084><span style="${ssrRenderStyle({
					"font-size": "10px",
					"font-weight": "600",
					"color": "#0a1929",
					"text-align": "center"
				})}" data-v-461cb084>${ssrInterpolate(unref(formEditEvent).tanggal || "Tgl Menyusul")}</span></div><div style="${ssrRenderStyle({
					"background": "#f8fafc",
					"padding": "8px",
					"border-radius": "8px",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"justify-content": "center",
					"gap": "4px",
					"border": "1px solid #e2e8f0"
				})}" data-v-461cb084><span style="${ssrRenderStyle({
					"font-size": "10px",
					"font-weight": "600",
					"color": "#0a1929",
					"text-align": "center"
				})}" data-v-461cb084>${ssrInterpolate(unref(formEditEvent).lokasi || "Lokasi Menyusul")}</span></div></div><div style="${ssrRenderStyle({
					"padding": "10px",
					"margin-bottom": "12px",
					"background": "#ffffff",
					"border": "1px solid #e2e8f0",
					"border-radius": "12px",
					"text-align": "left"
				})}" data-v-461cb084><span style="${ssrRenderStyle({
					"font-size": "9px",
					"font-weight": "700",
					"color": "#8a9aa8",
					"letter-spacing": "1px"
				})}" data-v-461cb084>DESKRIPSI EVENT</span><p style="${ssrRenderStyle({
					"font-size": "10px",
					"color": "#0a1929",
					"line-height": "1.3",
					"margin-top": "4px",
					"white-space": "pre-wrap"
				})}" data-v-461cb084>${ssrInterpolate(unref(formEditEvent).deskripsi || "Deskripsi tidak tersedia.")}</p><div style="${ssrRenderStyle({
					"margin": "8px 0",
					"height": "1px",
					"background": "#e2e8f0"
				})}" data-v-461cb084></div><div style="${ssrRenderStyle({
					"display": "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "4px"
				})}" data-v-461cb084><span style="${ssrRenderStyle({
					"font-size": "9px",
					"font-weight": "700",
					"color": "#0a1929"
				})}" data-v-461cb084>SISA KUOTA</span><span style="${ssrRenderStyle({
					"font-size": "9px",
					"font-weight": "600",
					"color": "#8a9aa8"
				})}" data-v-461cb084><b style="${ssrRenderStyle({
					"color": "#0a1929",
					"font-size": "11px",
					"font-weight": "800"
				})}" data-v-461cb084>100</b> / 100</span></div><div style="${ssrRenderStyle({
					"width": "100%",
					"height": "5px",
					"background": "#e2e8f0",
					"border-radius": "10px",
					"overflow": "hidden"
				})}" data-v-461cb084><div style="${ssrRenderStyle({
					"width": "10%",
					"height": "100%",
					"background": "var(--accent-main)"
				})}" data-v-461cb084></div></div></div><button style="${ssrRenderStyle({
					"width": "100%",
					"padding": "10px",
					"border-radius": "10px",
					"font-size": "11px",
					"font-weight": "600",
					"background": "var(--primary)",
					"color": "white",
					"border": "none"
				})}" data-v-461cb084> DAFTAR SEKARANG ➔ </button></div><div style="${ssrRenderStyle({
					"background": "#ffffff",
					"border-radius": "16px",
					"padding": "12px",
					"box-shadow": "0 4px 12px rgba(0,0,0,0.03)",
					"border": "1px solid #e6edf5"
				})}" data-v-461cb084><div style="${ssrRenderStyle({
					"font-weight": "700",
					"font-size": "11px",
					"color": "#0a1929",
					"margin-bottom": "8px",
					"display": "flex",
					"align-items": "center",
					"gap": "4px"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:file-text",
					style: { "font-size": "12px" }
				}, null, _parent));
				_push(` Form Pendaftaran</div><div data-v-461cb084>${hpPreviewHtml.value ?? ""}</div><button style="${ssrRenderStyle({
					"width": "100%",
					"padding": "9px",
					"background": "#1a3a5c",
					"color": "white",
					"border": "none",
					"border-radius": "40px",
					"font-weight": "700",
					"font-size": "12px",
					"margin-top": "10px",
					"box-shadow": "0 4px 12px var(--primary-shadow)"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:edit-3",
					style: { "margin-right": "4px" }
				}, null, _parent));
				_push(` DAFTAR SEKARANG</button></div></div></div></div></div></div>`);
			} else if (unref(isLoading)) _push(`<div class="loader-container" style="${ssrRenderStyle({
				"height": "100%",
				"display": "flex",
				"align-items": "center",
				"justify-content": "center"
			})}" data-v-461cb084><div style="${ssrRenderStyle({ "text-align": "center" })}" data-v-461cb084><div class="spinner" style="${ssrRenderStyle({ "margin": "0 auto 12px auto" })}" data-v-461cb084></div><div style="${ssrRenderStyle({
				"font-weight": "500",
				"font-size": "13px",
				"color": "#8a9aa8"
			})}" data-v-461cb084>Memuat data event...</div></div></div>`);
			else {
				_push(`<div style="${ssrRenderStyle({
					"padding": "60px 20px",
					"text-align": "center",
					"color": "#8a9aa8"
				})}" data-v-461cb084>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:file-question",
					style: {
						"font-size": "48px",
						"color": "#c8d6e8",
						"margin-bottom": "12px",
						"display": "block",
						"margin-inline": "auto"
					}
				}, null, _parent));
				_push(`<div style="${ssrRenderStyle({
					"font-size": "16px",
					"font-weight": "600",
					"color": "#0a1929",
					"margin-bottom": "8px"
				})}" data-v-461cb084>Event Tidak Ditemukan</div> Event yang Anda cari mungkin sudah dihapus atau URL tidak valid.<br data-v-461cb084><br data-v-461cb084><button class="btn-primary" data-v-461cb084>Kembali ke Beranda</button></div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/event/[slug]/edit.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var edit_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-461cb084"]]);

export { edit_default as default };
//# sourceMappingURL=edit-BHmaAGkf.mjs.map
