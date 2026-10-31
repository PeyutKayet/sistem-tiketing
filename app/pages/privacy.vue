<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="back-nav">
        <a href="#" @click.prevent="goBack" class="back-link">
          <Icon name="lucide:arrow-left" /> Kembali
        </a>
      </div>
      
      <h1>Kebijakan Privasi</h1>
      <p class="last-updated">Terakhir diperbarui: 5 Oktober 2026</p>

      <section>
        <h2>1. Pengumpulan Data Pribadi</h2>
        <p>Ketika Anda menggunakan layanan tyket.id untuk membeli tiket atau mendaftarkan event, kami dapat mengumpulkan informasi yang dapat mengidentifikasi Anda secara pribadi, termasuk namun tidak terbatas pada:</p>
        <ul>
          <li>Nama Lengkap</li>
          <li>Alamat Email</li>
          <li>Nomor Telepon / WhatsApp</li>
          <li>Data transaksi dan preferensi metode pembayaran (yang diproses secara aman oleh Payment Gateway mitra kami).</li>
        </ul>
      </section>

      <section>
        <h2>2. Penggunaan Data</h2>
        <p>Data pribadi yang dikumpulkan digunakan secara eksklusif untuk tujuan:</p>
        <ul>
          <li>Memproses transaksi pembayaran tiket acara.</li>
          <li>Mengirimkan E-Tiket (QR Code) melalui Email dan WhatsApp.</li>
          <li>Menyediakan informasi kehadiran peserta (Check-in) kepada pihak Penyelenggara (Organizer) acara yang bersangkutan.</li>
          <li>Berkomunikasi mengenai status layanan, pemberitahuan event batal, atau keperluan *Customer Support*.</li>
        </ul>
      </section>

      <section>
        <h2>3. Perlindungan & Pembagian Data</h2>
        <p>tyket.id berkomitmen untuk menjaga keamanan data pribadi Anda menggunakan standar enkripsi web yang aman. Kami <strong>TIDAK PERNAH memperjualbelikan</strong> data pribadi (PII) pelanggan kepada pihak ketiga mana pun.</p>
        <p>Kami hanya membagikan data Anda kepada:</p>
        <ul>
          <li><strong>Penyelenggara Acara (Organizer):</strong> Hanya untuk event yang Anda beli tiketnya, guna keperluan validasi check-in di lapangan.</li>
          <li><strong>Mitra Payment Gateway (Espay):</strong> Untuk memvalidasi keamanan transaksi pembayaran.</li>
        </ul>
        <p>tyket.id berhak mengolah data transaksi secara agregat (keseluruhan) dan anonim (tanpa melibatkan identitas personal apa pun). Data statistik ini digunakan untuk keperluan riset bisnis, peningkatan kualitas layanan, analisis tren pasar industri acara, serta dapat dibagikan kepada mitra bisnis kami untuk tujuan tersebut.</p>
      </section>

      <section>
        <h2>4. Penghapusan Data</h2>
        <p>Anda berhak untuk meminta penghapusan akun atau data pribadi Anda dari sistem kami dengan menghubungi layanan pelanggan kami di alamat email di bawah ini, dengan tunduk pada kewajiban retensi data untuk keperluan audit transaksi keuangan.</p>
      </section>

      <section>
        <h2>5. Kontak Privasi</h2>
        <p>Jika Anda memiliki pertanyaan seputar cara kami memproses data Anda, hubungi kami di:</p>
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
  title: 'Kebijakan Privasi — tyket.id'
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
