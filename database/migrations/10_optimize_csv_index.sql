-- ==========================================
-- SCRIPT OPTIMALISASI DATABASE (TAHAP 3)
-- COMPOSITE INDEX UNTUK RPC
-- ==========================================

-- Index gabungan ini akan membuat fungsi get_ticket_sales dan get_admin_event_stats
-- berlari jauh lebih cepat karena PostgreSQL tidak perlu lagi menggabungkan
-- dua indeks terpisah saat mencari event tertentu yang sudah lunas.

CREATE INDEX IF NOT EXISTS idx_peserta_event_status ON peserta(event_id, status_bayar);
