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

//#region app/pages/privacy.vue
var _sfc_main = {
	__name: "privacy",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		useHead$1({ title: "Kebijakan Privasi — tyket.id" });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "legal-page" }, _attrs))} data-v-7bfa664f><div class="legal-container" data-v-7bfa664f><div class="back-nav" data-v-7bfa664f><a href="#" class="back-link" data-v-7bfa664f>`);
			_push(ssrRenderComponent(_component_Icon, { name: "lucide:arrow-left" }, null, _parent));
			_push(` Kembali </a></div><h1 data-v-7bfa664f>Kebijakan Privasi</h1><p class="last-updated" data-v-7bfa664f>Terakhir diperbarui: 5 Oktober 2026</p><section data-v-7bfa664f><h2 data-v-7bfa664f>1. Pengumpulan Data Pribadi</h2><p data-v-7bfa664f>Ketika Anda menggunakan layanan tyket.id untuk membeli tiket atau mendaftarkan event, kami dapat mengumpulkan informasi yang dapat mengidentifikasi Anda secara pribadi, termasuk namun tidak terbatas pada:</p><ul data-v-7bfa664f><li data-v-7bfa664f>Nama Lengkap</li><li data-v-7bfa664f>Alamat Email</li><li data-v-7bfa664f>Nomor Telepon / WhatsApp</li><li data-v-7bfa664f>Data transaksi dan preferensi metode pembayaran (yang diproses secara aman oleh Payment Gateway mitra kami).</li></ul></section><section data-v-7bfa664f><h2 data-v-7bfa664f>2. Penggunaan Data</h2><p data-v-7bfa664f>Data pribadi yang dikumpulkan digunakan secara eksklusif untuk tujuan:</p><ul data-v-7bfa664f><li data-v-7bfa664f>Memproses transaksi pembayaran tiket acara.</li><li data-v-7bfa664f>Mengirimkan E-Tiket (QR Code) melalui Email dan WhatsApp.</li><li data-v-7bfa664f>Menyediakan informasi kehadiran peserta (Check-in) kepada pihak Penyelenggara (Organizer) acara yang bersangkutan.</li><li data-v-7bfa664f>Berkomunikasi mengenai status layanan, pemberitahuan event batal, atau keperluan *Customer Support*.</li></ul></section><section data-v-7bfa664f><h2 data-v-7bfa664f>3. Perlindungan &amp; Pembagian Data</h2><p data-v-7bfa664f>tyket.id berkomitmen untuk menjaga keamanan data pribadi Anda menggunakan standar enkripsi web yang aman. Kami <strong data-v-7bfa664f>TIDAK PERNAH memperjualbelikan</strong> data pribadi (PII) pelanggan kepada pihak ketiga mana pun.</p><p data-v-7bfa664f>Kami hanya membagikan data Anda kepada:</p><ul data-v-7bfa664f><li data-v-7bfa664f><strong data-v-7bfa664f>Penyelenggara Acara (Organizer):</strong> Hanya untuk event yang Anda beli tiketnya, guna keperluan validasi check-in di lapangan.</li><li data-v-7bfa664f><strong data-v-7bfa664f>Mitra Payment Gateway (Espay):</strong> Untuk memvalidasi keamanan transaksi pembayaran.</li></ul><p data-v-7bfa664f>tyket.id berhak mengolah data transaksi secara agregat (keseluruhan) dan anonim (tanpa melibatkan identitas personal apa pun). Data statistik ini digunakan untuk keperluan riset bisnis, peningkatan kualitas layanan, analisis tren pasar industri acara, serta dapat dibagikan kepada mitra bisnis kami untuk tujuan tersebut.</p></section><section data-v-7bfa664f><h2 data-v-7bfa664f>4. Penghapusan Data</h2><p data-v-7bfa664f>Anda berhak untuk meminta penghapusan akun atau data pribadi Anda dari sistem kami dengan menghubungi layanan pelanggan kami di alamat email di bawah ini, dengan tunduk pada kewajiban retensi data untuk keperluan audit transaksi keuangan.</p></section><section data-v-7bfa664f><h2 data-v-7bfa664f>5. Kontak Privasi</h2><p data-v-7bfa664f>Jika Anda memiliki pertanyaan seputar cara kami memproses data Anda, hubungi kami di:</p><ul data-v-7bfa664f><li data-v-7bfa664f>Email: <strong data-v-7bfa664f>support.tyketid@gmail.com</strong></li><li data-v-7bfa664f>WhatsApp: <strong data-v-7bfa664f>0851-5657-5710</strong></li></ul></section></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var privacy_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-7bfa664f"]]);

export { privacy_default as default };
//# sourceMappingURL=privacy-DcCcwkVw.mjs.map
