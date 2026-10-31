-- Jalankan file ini di Supabase SQL Editor Anda
-- Tujuannya adalah menambahkan kolom `logo_url` ke tabel `organizer_profile` (jika belum ada)

ALTER TABLE organizer_profile 
ADD COLUMN IF NOT EXISTS logo_url TEXT;
