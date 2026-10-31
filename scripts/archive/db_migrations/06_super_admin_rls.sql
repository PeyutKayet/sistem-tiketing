-- FASE 2: PERBAIKAN BUG & KEAMANAN DOMPET
-- Memperbaiki celah keamanan RLS (menghindari hardcode email)

-- 1. Buat tabel khusus untuk menyimpan User ID Super Admin
CREATE TABLE IF NOT EXISTS super_admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mengaktifkan RLS untuk tabel ini supaya tidak ada orang iseng yang insert dari API publik
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
-- Policy yang memastikan admin hanya bisa melihat baris datanya sendiri, sekaligus MENCEGAH infinite recursion (error 42P17)
CREATE POLICY "Super admin bisa lihat tabelnya sendiri" ON super_admins FOR SELECT USING (user_id = auth.uid());


-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Super Admin bebas akses peserta" ON peserta;
DROP POLICY IF EXISTS "Super Admin bebas akses penarikan_dana" ON penarikan_dana;
DROP POLICY IF EXISTS "Super Admin bebas akses profil EO" ON organizer_profile;

-- 2. Berikan akses tanpa batas ke tabel `peserta` untuk Super Admin
CREATE POLICY "Super Admin bebas akses peserta" 
ON peserta 
FOR ALL 
USING (EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid()));

-- 3. Berikan akses tanpa batas ke tabel `penarikan_dana` untuk Super Admin
CREATE POLICY "Super Admin bebas akses penarikan_dana" 
ON penarikan_dana 
FOR ALL 
USING (EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid()));

-- 4. Super Admin juga harus bisa melihat profil EO untuk keperluan verifikasi bank
CREATE POLICY "Super Admin bebas akses profil EO" 
ON organizer_profile 
FOR ALL 
USING (EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid()));

-- (Data ke tabel super_admins ini hanya bisa diisi/insert langsung dari Supabase Dashboard menggunakan fitur Insert Row)
