<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="back-nav">
        <a href="#" @click.prevent="goBack" class="back-link">
          <Icon name="lucide:arrow-left" /> Kembali
        </a>
      </div>
      
      <h1>Syarat & Ketentuan</h1>
      <p class="last-updated">Terakhir diperbarui: 5 Oktober 2026</p>

      <section>
        <h2>1. Pendahuluan</h2>
        <p>Selamat datang di tyket.id. Dengan mengakses dan menggunakan layanan kami (sebagai Penyelenggara maupun Pembeli), Anda menyetujui seluruh Syarat dan Ketentuan yang berlaku di platform ini. tyket.id berfungsi sebagai perantara teknologi (Software as a Service) untuk manajemen event dan distribusi tiket digital.</p>
      </section>

      <section>
        <h2>2. Transaksi & Pembelian Tiket</h2>
        <ul>
          <li>Seluruh harga yang tertera di platform diatur oleh pihak Penyelenggara (Event Organizer).</li>
          <li>Pembeli wajib memastikan data diri (Nama, Email, WhatsApp) diisi dengan benar sebelum melakukan pembayaran. Kesalahan input data yang menyebabkan e-tiket tidak diterima bukan menjadi tanggung jawab tyket.id.</li>
          <li>Setiap tiket yang dibeli dilengkapi dengan kode unik (QR Code) yang bersifat rahasia. Pembeli bertanggung jawab menjaga kerahasiaan tiketnya.</li>
        </ul>
      </section>

      <section>
        <h2>3. Kebijakan Pengembalian Dana (Refund Policy)</h2>
        <ul>
          <li><strong>Pembelian Bersifat Final:</strong> Seluruh tiket yang telah sukses dibayar tidak dapat ditukar, dibatalkan, atau dikembalikan (di-refund) secara sepihak oleh Pembeli dengan alasan apa pun.</li>
          <li><strong>Pembatalan Acara oleh Penyelenggara:</strong> Apabila suatu acara dibatalkan, ditunda, atau diubah jadwalnya secara fatal oleh pihak Penyelenggara, maka proses pengembalian dana sepenuhnya menjadi tanggung jawab Penyelenggara acara. tyket.id akan memfasilitasi data transaksi, namun ketersediaan dana mutlak berada di pihak Penyelenggara.</li>
          <li>Biaya layanan/platform fee yang dibayarkan melalui Payment Gateway tidak dapat dikembalikan dalam proses refund.</li>
        </ul>
      </section>

      <section>
        <h2>4. Tanggung Jawab Penyelenggara (Organizer)</h2>
        <p>Penyelenggara bertanggung jawab penuh atas pelaksanaan acara, keselamatan pengunjung, serta kebenaran informasi acara yang dipublikasikan di tyket.id. tyket.id terbebas dari segala tuntutan hukum yang timbul akibat kelalaian Penyelenggara.</p>
      </section>

      <section>
        <h2>5. Kontak Bantuan</h2>
        <p>Jika Anda memiliki kendala terkait transaksi, Anda dapat menghubungi tim dukungan kami melalui:</p>
        <ul>
          <li>Email: <strong>support.tyketid@gmail.com</strong></li>
          <li>WhatsApp: <strong>0851-5657-5710</strong></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push("/")
  }
}
useHead({
  title: 'Syarat & Ketentuan — tyket.id'
})
</script>

<style scoped>
.legal-page { background: #f8fafc; min-height: 100vh; padding: 20px 15px; font-family: system-ui, -apple-system, sans-serif; }
.legal-container { max-width: 680px; margin: 0 auto; background: #fff; padding: 24px 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
.back-nav { margin-bottom: 20px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.8rem; }
.back-link:hover { text-decoration: underline; }
h1 { font-size: 1.35rem; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
.last-updated { font-size: 0.75rem; color: #64748b; margin-bottom: 24px; font-weight: 500; }
section { margin-bottom: 20px; }
h2 { font-size: 1rem; color: #1e293b; margin-bottom: 8px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px; }
p, li { font-size: 0.8rem; line-height: 1.6; color: #475569; margin-bottom: 8px; }
ul { padding-left: 16px; }
</style>
