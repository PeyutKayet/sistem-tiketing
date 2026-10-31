# Dokumentasi Infrastruktur Server (Homelab)
*Dokumen ini digunakan sebagai referensi bagi developer dan AI agent untuk memahami batasan, spesifikasi, dan lingkungan server tempat aplikasi ini berjalan.*

## 🖥️ Spesifikasi Perangkat Keras (Hardware)
- **Mesin Utama:** Thin Client HP t520
- **Sistem Operasi:** Debian Linux + CasaOS
- **Kapasitas RAM:** 4 GB *(Kapasitas sangat terbatas, optimasi memori sangat krusial)*
- **Penyimpanan:** SSD 256 GB

## 🌐 Topologi & Jaringan
- **Akses Publik:** Menggunakan **Cloudflare Tunnel** (dan Nginx).
- Server aman dari paparan port publik langsung (NAT/Firewall bypass) berkat Cloudflare Tunnel.

## 📦 Lingkungan Perangkat Lunak (Software Stack)
- **Database / Backend:** Supabase (Self-hosted via Docker di CasaOS)
- **Frontend:** Nuxt 3 / Vue (Di-hosting di mesin yang sama dengan Supabase)
- **Catatan Penting:** Karena Frontend dan Backend berbagi RAM 4GB yang sama (dimana Supabase Docker sendiri sangat boros RAM), semua *query* ke database dan proses *rendering* Nuxt harus se-efisien mungkin. **Hindari:** *Cron jobs* berat, *polling* data yang agresif, atau pengolahan gambar/file besar di sisi server.

## 💾 Status Keamanan & Backup
- **Sistem Backup:** **SUDAH AKTIF**.
- Server Thin Client telah dikonfigurasi dengan cron job otomatis untuk melakukan dump database PostgreSQL secara berkala dan di-sync/upload langsung ke **Google Drive** sebagai off-site storage cadangan.
