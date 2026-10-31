-- ==========================================
-- SCRIPT OPTIMALISASI DATABASE (TAHAP 1)
-- ==========================================
-- PERINGATAN: Pastikan membackup data atau 
-- jalankan saat traffic sedang sepi jika ini server production.

-- 1. Buat tipe data ENUM (Sangat Irit Memori)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'expired', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('draft', 'published', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipe_event') THEN
        CREATE TYPE tipe_event AS ENUM ('offline', 'online', 'hybrid');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'checkin_system') THEN
        CREATE TYPE checkin_system AS ENUM ('scanner', 'manual_absen');
    END IF;
END$$;

-- 2. Optimalisasi Tabel Peserta
-- Hapus kolom redundan
ALTER TABLE peserta DROP COLUMN IF EXISTS status_pembayaran;
ALTER TABLE peserta DROP COLUMN IF EXISTS no_hp;
ALTER TABLE peserta DROP COLUMN IF EXISTS status_hadir;

-- Ubah tipe data dari TEXT ke ENUM payment_status
ALTER TABLE peserta 
  ALTER COLUMN status_bayar DROP DEFAULT,
  ALTER COLUMN status_bayar TYPE payment_status USING status_bayar::payment_status,
  ALTER COLUMN status_bayar SET DEFAULT 'pending'::payment_status;

-- 3. Optimalisasi Tabel Event
-- Ubah tipe data kolom berbasis TEXT ke ENUM
ALTER TABLE event 
  ALTER COLUMN tipe_event DROP DEFAULT,
  ALTER COLUMN tipe_event TYPE tipe_event USING tipe_event::tipe_event,
  ALTER COLUMN tipe_event SET DEFAULT 'offline'::tipe_event;

ALTER TABLE event 
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE event_status USING status::event_status,
  ALTER COLUMN status SET DEFAULT 'published'::event_status;

ALTER TABLE event 
  ALTER COLUMN sistem_checkin DROP DEFAULT,
  ALTER COLUMN sistem_checkin TYPE checkin_system USING sistem_checkin::checkin_system,
  ALTER COLUMN sistem_checkin SET DEFAULT 'scanner'::checkin_system;

-- 4. Re-create Tabel Riwayat Absen (Mengubah UUID jadi BIGINT)
-- Karena tabel belum dipakai, kita bisa DROP dan CREATE ulang agar bersih.
DROP TABLE IF EXISTS riwayat_absen;

CREATE TABLE riwayat_absen (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Perubahan dari UUID ke BigInt
    peserta_id BIGINT REFERENCES peserta(id) ON DELETE CASCADE,
    metode TEXT NOT NULL,
    waktu_absen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat index untuk mempercepat pencarian histori berdasarkan peserta_id
CREATE INDEX IF NOT EXISTS idx_riwayat_absen_peserta_id ON riwayat_absen(peserta_id);

-- SELESAI.
