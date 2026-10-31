-- FUNGSI GET TICKET SALES (Hitung pending juga supaya kuota berkurang)
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
      AND p.status_bayar IN ('paid', 'pending')
    GROUP BY p.kategori_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNGSI GET EO BALANCES (Hitung donasi juga)
CREATE OR REPLACE FUNCTION get_eo_balances(eo_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_cair BIGINT := 0;
    v_total_pending BIGINT := 0;
    v_total_ditarik BIGINT := 0;
    v_saldo_tersedia BIGINT := 0;
BEGIN
    SELECT 
        COALESCE(SUM(
            CASE WHEN p.status_dana = 'CAIR' THEN 
                k.harga + COALESCE((p.data_tambahan->>'infaqNominal')::BIGINT, 0) + COALESCE(NULLIF(REGEXP_REPLACE(p.data_tambahan->>'donasi', '\D', '', 'g'), '')::BIGINT, 0)
            ELSE 0 END
        ), 0),
        COALESCE(SUM(
            CASE WHEN p.status_dana = 'PENDING' THEN 
                k.harga + COALESCE((p.data_tambahan->>'infaqNominal')::BIGINT, 0) + COALESCE(NULLIF(REGEXP_REPLACE(p.data_tambahan->>'donasi', '\D', '', 'g'), '')::BIGINT, 0)
            ELSE 0 END
        ), 0)
    INTO v_total_cair, v_total_pending
    FROM peserta p
    JOIN kategori_tiket k ON p.kategori_id = k.id
    JOIN event e ON k.event_id = e.id
    WHERE e.organizer_id = eo_id AND p.status_bayar = 'paid';

    SELECT COALESCE(SUM(nominal), 0) INTO v_total_ditarik
    FROM penarikan_dana
    WHERE organizer_id = eo_id AND status != 'DITOLAK';

    v_saldo_tersedia := GREATEST(0::BIGINT, v_total_cair - v_total_ditarik);

    RETURN jsonb_build_object(
        'saldo_tersedia', v_saldo_tersedia,
        'saldo_tertunda', v_total_pending,
        'total_ditarik', v_total_ditarik
    );
END;
$$;
