-- ==========================================
-- SCRIPT OPTIMALISASI DATABASE
-- INDEX UNTUK ANTI CALO (Pengecekan Email & WA)
-- ==========================================

-- Index ini akan mempercepat pengecekan anti-calo saat checkout,
-- karena sistem tidak perlu lagi melakukan sequential scan (scan seluruh data) 
-- pada tabel peserta setiap kali ada pengecekan email atau nomor WhatsApp.

CREATE INDEX IF NOT EXISTS idx_peserta_event_email ON peserta(event_id, email) WHERE email IS NOT NULL AND email != '';
CREATE INDEX IF NOT EXISTS idx_peserta_event_no_wa ON peserta(event_id, no_wa) WHERE no_wa IS NOT NULL AND no_wa != '';
