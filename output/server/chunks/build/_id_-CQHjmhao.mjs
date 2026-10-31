import { f as useHead$1, C as ClientOnly } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, computed, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/tiket/[id].vue
var _sfc_main = {
	__name: "[id]",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ script: [{
			src: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
			defer: true
		}] });
		useRoute().params.id;
		ref(true);
		ref("");
		const tiketData = ref(null);
		ref(false);
		ref({});
		computed(() => {
			return tiketData.value?.[0]?.kategori_tiket?.harga === 0 && tiketData.value?.[0]?.event?.settings?.is_infaq_wajib !== true;
		});
		useSupabaseClient();
		computed(() => {
			return tiketData.value?.[0]?.event?.settings?.link_grup_wa || null;
		});
		ref(false);
		ref("");
		ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "ticket-wrapper" }, _attrs))} data-v-757a6b7c><div class="ticket-container" data-v-757a6b7c>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`<div class="state-msg" data-v-757a6b7c${_scopeId}>⏳ Mengambil Data Tiket...</div>`);
				else return [createVNode("div", { class: "state-msg" }, "⏳ Mengambil Data Tiket...")];
			}) }, _parent));
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
var _id__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-757a6b7c"]]);

export { _id__default as default };
//# sourceMappingURL=_id_-CQHjmhao.mjs.map
