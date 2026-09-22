-- Index untuk mempercepat pencarian event berdasarkan slug (digunakan di halaman publik event)
CREATE INDEX IF NOT EXISTS idx_event_slug ON event(slug);

-- Index untuk mempercepat pengambilan daftar peserta berdasarkan event_id (digunakan di admin dashboard)
CREATE INDEX IF NOT EXISTS idx_peserta_event_id ON peserta(event_id);

-- Index untuk mempercepat pencarian kategori tiket berdasarkan event_id
CREATE INDEX IF NOT EXISTS idx_kategori_tiket_event_id ON kategori_tiket(event_id);

-- Index tambahan: status pembayaran peserta (sering di-filter)
CREATE INDEX IF NOT EXISTS idx_peserta_status_bayar ON peserta(status_bayar);

-- Index tambahan: riwayat absen berdasarkan peserta
CREATE INDEX IF NOT EXISTS idx_riwayat_absen_peserta_id ON riwayat_absen(peserta_id);
