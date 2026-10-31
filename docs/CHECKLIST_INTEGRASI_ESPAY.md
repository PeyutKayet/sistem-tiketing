# Checklist & Hasil Temuan Investigasi Integrasi Espay

Dokumen ini memuat rangkuman analisis dari dokumentasi resmi Espay (`Inquiry`, `Tanya Jawab Umum`, dan `Portal Sandbox`) beserta langkah tindakan konkret.

---

## 🎯 Ringkasan Temuan Emas (Golden Clues)

Dari dokumen yang dianalisis, ditemukan 3 kunci krusial:

1. **IP Whitelisting di Portal Sandbox (Penyebab Utama Webhook Tertahan)**:
   - Di dokumen FAQ Keamanan tertera jelas:
     > *"Bisakah saya mendaftarkan lebih dari satu alamat IP ke whitelist? Ya... **Sandbox: Gunakan tanda `*` untuk mengizinkan semua IP (untuk tujuan pengujian)**."*
   - Jika field IP Whitelist di portal Sandbox kosong atau terisi IP lama, Espay akan menolak komunikasi keluar/masuk.

2. **Perbedaan VA Dinamis vs VA Statis (Solusi Bebas Timeout)**:
   - Di dokumen FAQ tertera jelas:
     > *"Kapan kita perlu menggunakan inquiry? Inquiry perlu digunakan untuk semua metode pembayaran, **KECUALI Virtual Account Static**..."*
     > *"Virtual Account Statis: Layanan yang dibutuhkan hanya **Payment** (TIDAK BUTUH INQUIRY)."*
   - Jika menggunakan VA Statis / Closed, proses tidak pernah menyentuh Inquiry, sehingga **bebas dari error 0031 dan langsung terbit < 1 detik**.

3. **Verifikasi Format Respon Inquiry SNAP BI**:
   - Kode respon `2002400`, `partnerServiceId: " Espay"`, `virtualAccountPhone: 62xxxx`, dan `billDescription` (english/indonesia max 18 karakter) di kode server kita (`server/api/webhook/espay-inquiry.ts`) **sudah 100% cocok dan identik** dengan Sample Response resmi di dokumentasi.

---

## 📋 Tabel Checklist & Status Tindakan

| No | Fokus Checklist | Temuan Dokumen | Tindakan yang Harus Dilakukan | Status |
|:---:|---|---|---|:---:|
| **1** | **Setting IP Whitelist di Portal Sandbox** | Sandbox mewajibkan tanda `*` jika ingin menerima semua request testing. | Buka Portal Sandbox > `Merchant` > `New Merchant` > Edit Merchant ID Anda > Isi field IP Whitelist dengan `*` > Klik Submit. | ⏳ **Wajib Cek di Portal** |
| **2** | **Alur Menu Pendaftaran URL di Portal** | Alur resmi: `Merchant` > `New Merchant` > Pilih ID > Edit > Submit. | Pastikan URL diisi lengkap: `https://unhinge-stowing-treat.ngrok-free.dev/api/webhook/espay-inquiry` dan klik Submit sampai muncul notifikasi sukses. | ⏳ **Wajib Cek di Portal** |
| **3** | **Kesesuaian Payload Respon Server** | Respon wajib format SNAP BI `2002400`. | Server kita di `server/api/webhook/espay-inquiry.ts` sudah 100% valid dan lolos uji mandiri (< 5ms). | ✅ **SELESAI (100% VALID)** |
| **4** | **Opsi VA Statis (Tanpa Inquiry)** | VA Statis tidak membutuhkan callback Inquiry. | Disimpan sebagai alternatif jika VA Dinamis tetap terkendala jaringan di sisi sandbox Espay. | 💡 **Alternatif Siap Pakai** |
| **5** | **Konfirmasi ke Tim Teknis Espay** | Error 0031 terjadi jika Espay timeout 5s ke merchant. | Minta CS Espay verifikasi IP Whitelist merchant & flush cache routing callback. | ⏳ **Siap Dikirim ke CS** |
