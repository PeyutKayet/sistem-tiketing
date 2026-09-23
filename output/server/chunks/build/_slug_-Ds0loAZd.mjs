import { t as components_default } from './components-C44pW9aw.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMEM7jHo.mjs';
import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/pages/scanner/[slug].vue
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		useSupabaseClient();
		route.params.slug;
		const eventData = ref(null);
		ref(null);
		ref("environment");
		ref(false);
		const isUnlocked = ref(false);
		const inputPin = ref("");
		ref("");
		const pinError = ref("");
		const scanResult = ref(null);
		const modeText = computed(() => {
			if (!eventData.value) return "Memuat...";
			const m = eventData.value.settings?.sistem_checkin || "scanner";
			if (m === "none") return "Tanpa Batas (Bebas Masuk)";
			if (m === "portal") return "Multi-Hari (Berulang)";
			return "1x Datang (Tiket Hangus)";
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ style: {
				"background": "#000",
				"min-height": "100vh",
				"display": "flex",
				"align-items": "center",
				"justify-content": "center",
				"font-family": "'Inter', sans-serif"
			} }, _attrs))}><div style="${ssrRenderStyle({
				"width": "100%",
				"max-width": "480px",
				"min-height": "100vh",
				"background": "#0f172a",
				"color": "white",
				"display": "flex",
				"flex-direction": "column",
				"position": "relative",
				"overflow": "hidden",
				"box-shadow": "0 0 20px rgba(0,0,0,0.5)"
			})}"><div style="${ssrRenderStyle({
				"padding": "15px 20px",
				"background": "#1e293b",
				"display": "flex",
				"align-items": "center",
				"justify-content": "space-between",
				"border-bottom": "1px solid #334155"
			})}"><div><h3 style="${ssrRenderStyle({
				"margin": "0",
				"font-size": "1.1rem",
				"font-weight": "700"
			})}">Scanner Panitia</h3><p style="${ssrRenderStyle({
				"margin": "4px 0 0",
				"font-size": "0.75rem",
				"color": "#94a3b8"
			})}">${ssrInterpolate(eventData.value ? eventData.value.nama_event : "Memuat event...")}</p></div><button style="${ssrRenderStyle({
				"background": "transparent",
				"border": "1px solid #475569",
				"color": "white",
				"padding": "6px 12px",
				"border-radius": "8px",
				"cursor": "pointer",
				"font-size": "0.8rem"
			})}"> Tutup </button></div>`);
			if (eventData.value && !eventData.value.settings?.is_qr_active) {
				_push(`<div style="${ssrRenderStyle({
					"padding": "40px 20px",
					"text-align": "center",
					"flex": "1",
					"display": "flex",
					"flex-direction": "column",
					"justify-content": "center"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:alert-triangle",
					style: {
						"font-size": "60px",
						"color": "#f59e0b",
						"margin-bottom": "15px"
					}
				}, null, _parent));
				_push(`<h2 style="${ssrRenderStyle({
					"margin": "0 0 10px",
					"font-weight": "800"
				})}">Fitur E-Ticket Nonaktif</h2><p style="${ssrRenderStyle({
					"color": "#cbd5e1",
					"font-size": "0.9rem"
				})}">Event ini tidak menggunakan sistem QR Code scanner.</p></div>`);
			} else if (!isUnlocked.value) {
				_push(`<div style="${ssrRenderStyle({
					"flex": "1",
					"display": "flex",
					"flex-direction": "column",
					"align-items": "center",
					"justify-content": "center",
					"padding": "20px"
				})}"><div style="${ssrRenderStyle({
					"background": "#1e293b",
					"padding": "30px 20px",
					"border-radius": "16px",
					"width": "100%",
					"max-width": "320px",
					"text-align": "center",
					"box-shadow": "0 10px 25px rgba(0,0,0,0.5)"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:lock",
					style: {
						"font-size": "48px",
						"color": "var(--primary)",
						"margin-bottom": "15px"
					}
				}, null, _parent));
				_push(`<h2 style="${ssrRenderStyle({
					"margin": "0 0 10px",
					"font-weight": "800",
					"font-size": "1.2rem"
				})}">Masukkan PIN Scanner</h2><p style="${ssrRenderStyle({
					"color": "#94a3b8",
					"font-size": "0.8rem",
					"margin": "0 0 20px",
					"line-height": "1.4"
				})}">Minta PIN dari pengelola event untuk menyalakan kamera.</p><input type="password"${ssrRenderAttr("value", inputPin.value)} placeholder="******" style="${ssrRenderStyle({
					"width": "100%",
					"box-sizing": "border-box",
					"text-align": "center",
					"font-size": "1.5rem",
					"letter-spacing": "10px",
					"padding": "12px",
					"border-radius": "10px",
					"border": "1px solid #334155",
					"background": "#0f172a",
					"color": "white",
					"outline": "none",
					"margin-bottom": "15px"
				})}"><button style="${ssrRenderStyle({
					"width": "100%",
					"padding": "14px",
					"border-radius": "10px",
					"background": "var(--primary)",
					"color": "white",
					"border": "none",
					"font-weight": "700",
					"font-size": "1rem",
					"cursor": "pointer"
				})}"> BUKA SCANNER </button>`);
				if (pinError.value) _push(`<p style="${ssrRenderStyle({
					"color": "#ef4444",
					"font-size": "0.8rem",
					"margin": "10px 0 0"
				})}">${ssrInterpolate(pinError.value)}</p>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else {
				_push(`<div style="${ssrRenderStyle({
					"flex": "1",
					"display": "flex",
					"flex-direction": "column",
					"position": "relative",
					"background": "#000"
				})}"><div id="reader" style="${ssrRenderStyle({
					"width": "100%",
					"flex": "1",
					"background": "black",
					"display": "flex",
					"align-items": "center",
					"justify-content": "center"
				})}"></div>`);
				if (scanResult.value) {
					_push(`<div style="${ssrRenderStyle({
						position: "absolute",
						top: "0",
						left: "0",
						right: "0",
						bottom: "0",
						background: scanResult.value.success ? "rgba(22, 163, 74, 0.95)" : "rgba(220, 38, 38, 0.95)",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "20px",
						zIndex: 10
					})}">`);
					_push(ssrRenderComponent(_component_Icon, {
						name: scanResult.value.success ? "lucide:check-circle" : "lucide:x-circle",
						style: {
							"font-size": "80px",
							"color": "white",
							"margin-bottom": "20px"
						}
					}, null, _parent));
					_push(`<h2 style="${ssrRenderStyle({
						"margin": "0 0 10px",
						"font-size": "1.8rem",
						"font-weight": "900",
						"text-align": "center"
					})}">${ssrInterpolate(scanResult.value.title)}</h2><div style="${ssrRenderStyle({
						"background": "rgba(0,0,0,0.2)",
						"padding": "15px",
						"border-radius": "12px",
						"width": "100%",
						"text-align": "center",
						"margin-bottom": "30px"
					})}"><p style="${ssrRenderStyle({
						"margin": "0 0 5px",
						"font-size": "0.85rem",
						"opacity": "0.8"
					})}">Nama Peserta:</p><p style="${ssrRenderStyle({
						"margin": "0",
						"font-size": "1.2rem",
						"font-weight": "800"
					})}">${ssrInterpolate(scanResult.value.pesertaName || "-")}</p><p style="${ssrRenderStyle({
						"margin": "10px 0 0",
						"font-size": "0.8rem"
					})}">${ssrInterpolate(scanResult.value.message)}</p></div><button style="${ssrRenderStyle({
						"padding": "15px 30px",
						"font-size": "1rem",
						"font-weight": "800",
						"border-radius": "50px",
						"border": "none",
						"background": "white",
						"color": "#0f172a",
						"cursor": "pointer",
						"box-shadow": "0 4px 15px rgba(0,0,0,0.2)",
						"width": "100%"
					})}"> SCAN TIKET BERIKUTNYA </button></div>`);
				} else _push(`<!---->`);
				_push(`<div style="${ssrRenderStyle({
					"padding": "15px 20px",
					"background": "#1e293b",
					"display": "flex",
					"align-items": "center",
					"justify-content": "space-between",
					"border-top": "1px solid #334155"
				})}"><button style="${ssrRenderStyle({
					"padding": "10px 15px",
					"border-radius": "10px",
					"background": "#334155",
					"color": "white",
					"border": "none",
					"font-weight": "600",
					"display": "flex",
					"align-items": "center",
					"gap": "8px",
					"cursor": "pointer",
					"font-size": "0.85rem"
				})}">`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "lucide:switch-camera",
					style: { "font-size": "18px" }
				}, null, _parent));
				_push(` Balik Kamera </button><div style="${ssrRenderStyle({
					"font-size": "0.75rem",
					"color": "#94a3b8",
					"text-align": "right",
					"line-height": "1.3"
				})}"> Mode Check-in:<br><strong style="${ssrRenderStyle({ "color": "white" })}">${ssrInterpolate(modeText.value)}</strong></div></div></div>`);
			}
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/scanner/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-Ds0loAZd.mjs.map
