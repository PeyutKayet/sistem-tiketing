import { t as components_default } from './components-C44pW9aw.mjs';
import { u as useAdmin } from './useAdmin-C8FerkPj.mjs';
import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';

//#region app/components/admin/AdminFormBuilder.vue
var _sfc_main = {
	__name: "AdminFormBuilder",
	__ssrInlineRender: true,
	setup(__props) {
		useAdmin();
		const builderWrapper = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "builderWrapper",
				ref: builderWrapper,
				class: "ff-shared-builder-ui",
				style: {
					"display": "flex",
					"flex-direction": "column",
					"gap": "16px"
				}
			}, _attrs))}><div style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "flex-end",
				"margin-bottom": "20px"
			})}"><div><h4 style="${ssrRenderStyle({
				"margin-bottom": "4px",
				"font-weight": "600",
				"color": "#0a1929",
				"display": "flex",
				"align-items": "center",
				"gap": "6px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:layout-template",
				style: { "color": "var(--primary)" }
			}, null, _parent));
			_push(` Form Builder</h4><p class="text-muted" style="${ssrRenderStyle({
				"margin": "0",
				"font-size": "13px"
			})}">Rancang formulir data peserta yang akan mengisi tiket ini.</p></div><div class="flex" style="${ssrRenderStyle({ "gap": "8px" })}"><button class="btn-outline btn-sm" style="${ssrRenderStyle({
				"font-size": "12px",
				"padding": "6px 12px",
				"font-weight": "600",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:rotate-ccw",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Reset</button><button class="btn-outline danger btn-sm" style="${ssrRenderStyle({
				"font-size": "12px",
				"padding": "6px 12px",
				"font-weight": "600",
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:trash-2",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Kosongkan</button></div></div><div class="ff-field-types-grid" style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(5, 1fr)",
				"gap": "6px",
				"background": "#ffffff",
				"padding": "10px",
				"border-radius": "12px",
				"border": "1px solid #e6edf5",
				"box-shadow": "inset 0 2px 4px rgba(0,0,0,0.01)"
			})}"><button class="ff-field-type-btn btn-outline" data-type="short_text" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:text-cursor-input",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Short Text</span></button><button class="ff-field-type-btn btn-outline" data-type="paragraph" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:align-left",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Paragraph</span></button><button class="ff-field-type-btn btn-outline" data-type="multiple_choice" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:circle-dot",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">M. Choice</span></button><button class="ff-field-type-btn btn-outline" data-type="checkboxes" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:check-square",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Checkboxes</span></button><button class="ff-field-type-btn btn-outline" data-type="dropdown" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:chevron-down-square",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Dropdown</span></button><button class="ff-field-type-btn btn-outline" data-type="linear_scale" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:sliders-horizontal",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Lin. Scale</span></button><button class="ff-field-type-btn btn-outline" data-type="date" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:calendar",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Date</span></button><button class="ff-field-type-btn btn-outline" data-type="time" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:clock",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Time</span></button><button class="ff-field-type-btn btn-outline" data-type="file_upload" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:paperclip",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Upload</span></button><button class="ff-field-type-btn btn-outline" data-type="terms" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:file-signature",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Terms</span></button><button class="ff-field-type-btn btn-outline" data-type="domisili_api" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px",
				"border-color": "#3b82f6",
				"background": "#eff6ff"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:map-pin",
				style: {
					"font-size": "16px",
					"color": "#1d4ed8"
				}
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "700",
				"color": "#1d4ed8"
			})}">Domisili</span></button><button class="ff-field-type-btn btn-outline" data-type="phone_wa" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px",
				"border-color": "#22c55e",
				"background": "#f0fdf4"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:phone",
				style: {
					"font-size": "16px",
					"color": "#15803d"
				}
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "700",
				"color": "#15803d"
			})}">No. WA</span></button><button class="ff-field-type-btn btn-outline" data-type="currency_rp" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px",
				"border-color": "#eab308",
				"background": "#fefce8"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:banknote",
				style: {
					"font-size": "16px",
					"color": "#a16207"
				}
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "700",
				"color": "#a16207"
			})}">Rupiah</span></button><button class="ff-field-type-btn btn-outline" data-type="header" style="${ssrRenderStyle({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"gap": "4px",
				"padding": "6px",
				"border-radius": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:heading",
				style: { "font-size": "16px" }
			}, null, _parent));
			_push(` <span style="${ssrRenderStyle({
				"font-size": "9px",
				"font-weight": "600"
			})}">Header</span></button></div><div class="ff-canvas-wrapper" style="${ssrRenderStyle({
				"background": "#fafcfe",
				"border-radius": "16px",
				"border": "2px dashed #c8d6e8",
				"padding": "20px",
				"flex": "1",
				"min-height": "250px",
				"position": "relative",
				"overflow": "auto",
				"background-image": "radial-gradient(circle, #d5e0ee 1px, transparent 1px)",
				"background-size": "20px 20px",
				"transition": "0.2s"
			})}"><div class="ff-grid-container" style="${ssrRenderStyle({
				"position": "relative",
				"width": "100%",
				"min-height": "400px",
				"transition": "min-height 0.2s ease"
			})}"><div class="ff-drop-preview" style="${ssrRenderStyle({
				"position": "absolute",
				"border": "2px dashed var(--primary)",
				"border-radius": "12px",
				"background": "var(--primary-shadow)",
				"pointer-events": "none",
				"z-index": "50",
				"opacity": "0",
				"visibility": "hidden",
				"transition": "0.15s"
			})}"></div></div></div><div style="${ssrRenderStyle({
				"font-size": "11px",
				"font-weight": "500",
				"color": "#8a9aa8",
				"display": "flex",
				"gap": "16px",
				"justify-content": "center",
				"margin-top": "8px"
			})}"><span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:move",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Drag to move</span><span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:scaling",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Resize from corner</span><span style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "4px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:mouse-pointer-click",
				style: { "font-size": "14px" }
			}, null, _parent));
			_push(` Click to edit</span></div><div class="wizard-overlay ff-property-overlay" style="${ssrRenderStyle({ "z-index": "10001" })}"><div class="wizard" style="${ssrRenderStyle({
				"max-width": "540px",
				"padding": "28px 32px",
				"height": "auto"
			})}"><button class="close ff-close-prop">`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:x" }, null, _parent));
			_push(`</button><h3 style="${ssrRenderStyle({
				"margin-bottom": "16px",
				"font-weight": "600",
				"color": "#0a1929",
				"display": "flex",
				"align-items": "center",
				"gap": "8px"
			})}">`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "lucide:settings-2",
				style: { "color": "var(--primary)" }
			}, null, _parent));
			_push(` Edit Form Field</h3><div class="ff-property-content"></div></div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminFormBuilder.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminFormBuilder-Bbb-btzh.mjs.map
