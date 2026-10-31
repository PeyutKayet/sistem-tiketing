import { t as components_default } from './components-D4ypgbct.mjs';
import { i as useState, N as NuxtLink, C as ClientOnly } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { u as useEventTicketCache } from './useEventTicketCache-x4oNpkfq.mjs';
import { _ as _virtual_public__2Flogo_tyket_default } from './_virtual_public-9BLckDHy.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { ref, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { F as publicAssetsURL } from '../nitro/nitro.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue-router';
import '@vue/shared';
import 'pinia';
import '@supabase/ssr';
import 'fnv1a-64';
import 'object-identity';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'node:crypto';
import '@supabase/supabase-js';
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

//#region \0virtual:public?%2Ffavicon.svg
var _virtual_public__2Ffavicon_default = publicAssetsURL("/favicon.svg");
//#endregion
//#region app/pages/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		useEventTicketCache();
		ref([]);
		ref(true);
		ref(null);
		useState("selected_event_preview", () => null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_ClientOnly = ClientOnly;
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "gridEventContainer" }, _attrs))} data-v-e08ae145><div class="grid-event-header-compact" data-v-e08ae145><div class="header-texts" data-v-e08ae145><img${ssrRenderAttr("src", _virtual_public__2Flogo_tyket_default)} alt="tyket.id Logo" class="brand-logo" data-v-e08ae145><p data-v-e08ae145>Temukan event menarik!</p></div><div class="header-cta-wrapper" data-v-e08ae145><span class="header-cta-hint" data-v-e08ae145>Punya acara?</span>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/admin",
				class: "header-cta-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2Ffavicon_default)} alt="tyket.id" class="header-cta-icon" data-v-e08ae145${_scopeId}><span data-v-e08ae145${_scopeId}>Buat Event</span>`);
					else return [createVNode("img", {
						src: _virtual_public__2Ffavicon_default,
						alt: "tyket.id",
						class: "header-cta-icon"
					}), createVNode("span", null, "Buat Event")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, { fallback: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) {
					_push(`<div class="event-cards-wrapper" data-v-e08ae145${_scopeId}><!--[-->`);
					ssrRenderList(4, (i) => {
						_push(`<div class="event-card skeleton-card" data-v-e08ae145${_scopeId}><div class="skeleton-img" data-v-e08ae145${_scopeId}></div><div class="event-card-body" data-v-e08ae145${_scopeId}><div class="skeleton-text skeleton-title" data-v-e08ae145${_scopeId}></div></div></div>`);
					});
					_push(`<!--]--></div>`);
				} else return [createVNode("div", { class: "event-cards-wrapper" }, [(openBlock(), createBlock(Fragment, null, renderList(4, (i) => {
					return createVNode("div", {
						key: "fall" + i,
						class: "event-card skeleton-card"
					}, [createVNode("div", { class: "skeleton-img" }), createVNode("div", { class: "event-card-body" }, [createVNode("div", { class: "skeleton-text skeleton-title" })])]);
				}), 64))])];
			}) }, _parent));
			_push(`<footer class="app-footer" data-v-e08ae145><div class="footer-links" data-v-e08ae145>`);
			_push(ssrRenderComponent(_component_NuxtLink, { to: "/cari-tiket" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Cari Tiket Saya`);
					else return [createTextVNode("Cari Tiket Saya")];
				}),
				_: 1
			}, _parent));
			_push(`<span class="dot-separator" data-v-e08ae145>•</span>`);
			_push(ssrRenderComponent(_component_NuxtLink, { to: "/terms" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Syarat &amp; Ketentuan`);
					else return [createTextVNode("Syarat & Ketentuan")];
				}),
				_: 1
			}, _parent));
			_push(`<span class="dot-separator" data-v-e08ae145>•</span>`);
			_push(ssrRenderComponent(_component_NuxtLink, { to: "/privacy" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Kebijakan Privasi`);
					else return [createTextVNode("Kebijakan Privasi")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="footer-contact" data-v-e08ae145><div class="contact-details" data-v-e08ae145><a href="mailto:support.tyketid@gmail.com" class="contact-span" data-v-e08ae145>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:mail" }, null, _parent));
			_push(`<span data-v-e08ae145>support.tyketid@gmail.com</span></a><a href="https://wa.me/6285156575710" target="_blank" rel="noopener noreferrer" class="contact-span" data-v-e08ae145>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:phone" }, null, _parent));
			_push(`<span data-v-e08ae145>+62 851-5657-5710</span></a></div></div><div class="footer-copyright" data-v-e08ae145> © 2026 tyket.id. Hak Cipta Dilindungi. </div></footer></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-e08ae145"]]);

export { pages_default as default };
//# sourceMappingURL=pages-CaLoV4Zd.mjs.map
