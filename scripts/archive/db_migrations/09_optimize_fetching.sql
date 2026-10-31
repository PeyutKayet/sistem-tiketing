-- ==========================================
-- SCRIPT OPTIMALISASI DATABASE (TAHAP 2)
-- ==========================================
-- SCRIPT INI AMAN UNTUK DIJALANKAN KAPAN SAJA (ZERO DOWNTIME)

-- 1. Fungsi untuk mendapatkan jumlah tiket terjual per kategori
-- Berguna untuk halaman publik (landing page) dan halaman tiket admin
CREATE OR REPLACE FUNCTION get_ticket_sales(p_event_id BIGINT)
RETURNS TABLE (
    kategori_id BIGINT,
    terjual BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.kategori_id,
        COUNT(p.id)::BIGINT as terjual
    FROM peserta p
    WHERE p.event_id = p_event_id 
      AND p.status_bayar = 'paid'
    GROUP BY p.kategori_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Fungsi untuk mendapatkan statistik lengkap admin
-- Berguna untuk dashboard admin (Total Peserta, Lunas, Hadir, Pendapatan, dll)
CREATE OR REPLACE FUNCTION get_admin_event_stats(p_event_id BIGINT)
RETURNS TABLE (
    total_peserta BIGINT,
    total_lunas BIGINT,
    total_pending BIGINT,
    total_hadir BIGINT,
    pendapatan_tiket BIGINT,
    pendapatan_donasi BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(p.id)::BIGINT as total_peserta,
        COUNT(p.id) FILTER (WHERE p.status_bayar = 'paid')::BIGINT as total_lunas,
        COUNT(p.id) FILTER (WHERE p.status_bayar = 'pending')::BIGINT as total_pending,
        COUNT(p.id) FILTER (WHERE p.is_scanned = true)::BIGINT as total_hadir,
        COALESCE(SUM(kt.harga) FILTER (WHERE p.status_bayar = 'paid'), 0)::BIGINT as pendapatan_tiket,
        COALESCE(
            SUM(
                -- Tangani baik infaqNominal maupun donasi (jika format lama masih ada)
                COALESCE((p.data_tambahan->>'infaqNominal')::BIGINT, 0) +
                COALESCE(NULLIF(REGEXP_REPLACE(p.data_tambahan->>'donasi', '\D', '', 'g'), '')::BIGINT, 0)
            ) FILTER (WHERE p.status_bayar = 'paid'), 0
        )::BIGINT as pendapatan_donasi
    FROM peserta p
    LEFT JOIN kategori_tiket kt ON p.kategori_id = kt.id
    WHERE p.event_id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
