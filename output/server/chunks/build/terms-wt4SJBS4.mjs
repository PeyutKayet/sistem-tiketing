import { t as components_default } from './components-D4ypgbct.mjs';
import { g as useRouter, f as useHead$1 } from '../virtual/entry.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/terms.vue
var _sfc_main = {
	__name: "terms",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		useHead$1({ title: "Syarat & Ketentuan — tyket.id" });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "legal-page" }, _attrs))} data-v-299f319b><div class="legal-container" data-v-299f319b><div class="back-nav" data-v-299f319b><a href="#" class="back-link" data-v-299f319b>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:arrow-left" }, null, _parent));
			_push(` Kembali </a></div><h1 data-v-299f319b>Syarat &amp; Ketentuan</h1><p class="last-updated" data-v-299f319b>Terakhir diperbarui: 5 Oktober 2026</p><section data-v-299f319b><h2 data-v-299f319b>1. Pendahuluan</h2><p data-v-299f319b>Selamat datang di tyket.id. Dengan mengakses dan menggunakan layanan kami (sebagai Penyelenggara maupun Pembeli), Anda menyetujui seluruh Syarat dan Ketentuan yang berlaku di platform ini. tyket.id berfungsi sebagai perantara teknologi (Software as a Service) untuk manajemen event dan distribusi tiket digital.</p></section><section data-v-299f319b><h2 data-v-299f319b>2. Transaksi &amp; Pembelian Tiket</h2><ul data-v-299f319b><li data-v-299f319b>Seluruh harga yang tertera di platform diatur oleh pihak Penyelenggara (Event Organizer).</li><li data-v-299f319b>Pembeli wajib memastikan data diri (Nama, Email, WhatsApp) diisi dengan benar sebelum melakukan pembayaran. Kesalahan input data yang menyebabkan e-tiket tidak diterima bukan menjadi tanggung jawab tyket.id.</li><li data-v-299f319b>Setiap tiket yang dibeli dilengkapi dengan kode unik (QR Code) yang bersifat rahasia. Pembeli bertanggung jawab menjaga kerahasiaan tiketnya.</li></ul></section><section data-v-299f319b><h2 data-v-299f319b>3. Kebijakan Pengembalian Dana (Refund Policy)</h2><ul data-v-299f319b><li data-v-299f319b><strong data-v-299f319b>Pembelian Bersifat Final:</strong> Seluruh tiket yang telah sukses dibayar tidak dapat ditukar, dibatalkan, atau dikembalikan (di-refund) secara sepihak oleh Pembeli dengan alasan apa pun.</li><li data-v-299f319b><strong data-v-299f319b>Pembatalan Acara oleh Penyelenggara:</strong> Apabila suatu acara dibatalkan, ditunda, atau diubah jadwalnya secara fatal oleh pihak Penyelenggara, maka proses pengembalian dana sepenuhnya menjadi tanggung jawab Penyelenggara acara. tyket.id akan memfasilitasi data transaksi, namun ketersediaan dana mutlak berada di pihak Penyelenggara.</li><li data-v-299f319b>Biaya layanan/platform fee yang dibayarkan melalui Payment Gateway tidak dapat dikembalikan dalam proses refund.</li></ul></section><section data-v-299f319b><h2 data-v-299f319b>4. Tanggung Jawab Penyelenggara (Organizer)</h2><p data-v-299f319b>Penyelenggara bertanggung jawab penuh atas pelaksanaan acara, keselamatan pengunjung, serta kebenaran informasi acara yang dipublikasikan di tyket.id. tyket.id terbebas dari segala tuntutan hukum yang timbul akibat kelalaian Penyelenggara.</p></section><section data-v-299f319b><h2 data-v-299f319b>5. Kontak Bantuan</h2><p data-v-299f319b>Jika Anda memiliki kendala terkait transaksi, Anda dapat menghubungi tim dukungan kami melalui:</p><ul data-v-299f319b><li data-v-299f319b>Email: <strong data-v-299f319b>support.tyketid@gmail.com</strong></li><li data-v-299f319b>WhatsApp: <strong data-v-299f319b>0851-5657-5710</strong></li></ul></section></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var terms_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-299f319b"]]);

export { terms_default as default };
//# sourceMappingURL=terms-wt4SJBS4.mjs.map
