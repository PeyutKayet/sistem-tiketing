-- Hapus policy yang mungkin bentrok sebelumnya
DROP POLICY IF EXISTS "Izinkan semua orang melihat logo" ON storage.objects;
DROP POLICY IF EXISTS "Izinkan admin upload logo" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."organizer_profile";

-- 1. Beri akses baca untuk tabel organizer_profile (agar data bisa tampil di form)
CREATE POLICY "Enable read access for all users" ON "public"."organizer_profile"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- 2. Kebijakan Storage untuk 'logos'
CREATE POLICY "Izinkan semua orang melihat logo" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'logos' );

CREATE POLICY "Izinkan admin upload logo" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'logos' );
