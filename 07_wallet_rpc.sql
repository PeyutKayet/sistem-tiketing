-- FASE 3: OPTIMASI PERFORMA & KEAMANAN DOMPET (RPC)

-- 1. FUNGSI UNTUK MENGHITUNG SALDO DI SISI SERVER
-- Ini akan mencegah browser klien / HP EO me-load ribuan data JSON
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
    -- Hitung total uang CAIR dan PENDING langsung dengan nge-join tabel
    SELECT 
        COALESCE(SUM(CASE WHEN p.status_dana = 'CAIR' THEN k.harga ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN p.status_dana = 'PENDING' THEN k.harga ELSE 0 END), 0)
    INTO v_total_cair, v_total_pending
    FROM peserta p
    JOIN kategori_tiket k ON p.kategori_id = k.id
    JOIN event e ON k.event_id = e.id
    WHERE e.organizer_id = eo_id AND p.status_bayar = 'paid';

    -- Hitung total yang sudah ditarik atau sedang antre ditarik
    SELECT COALESCE(SUM(nominal), 0) INTO v_total_ditarik
    FROM penarikan_dana
    WHERE organizer_id = eo_id AND status != 'DITOLAK';

    -- Rumus Saldo Tersedia
    v_saldo_tersedia := GREATEST(0::BIGINT, v_total_cair - v_total_ditarik);

    RETURN jsonb_build_object(
        'saldo_tersedia', v_saldo_tersedia,
        'saldo_tertunda', v_total_pending,
        'total_ditarik', v_total_ditarik
    );
END;
$$;

-- 2. FUNGSI UNTUK MENGAJUKAN PENARIKAN (MENCEGAH DOUBLE SPEND)
-- Jika user buka 2 Tab bersamaan, fungsi ini mengunci (Lock) datanya sehingga tidak bisa dieksekusi 2x
CREATE OR REPLACE FUNCTION ajukan_penarikan(
    eo_id UUID, 
    req_nominal BIGINT, 
    b_nama VARCHAR, 
    b_rek VARCHAR, 
    b_atas_nama VARCHAR
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_balances jsonb;
    v_tersedia BIGINT;
BEGIN
    -- LOCK PROFILE EO: Siapapun yang mencoba menarik uang EO ini bersamaan harus ngantri (Transaction Lock)
    PERFORM 1 FROM organizer_profile WHERE id = eo_id FOR UPDATE;

    -- Kalkulasi saldo TERBARU setelah antrean Lock terbuka
    v_balances := get_eo_balances(eo_id);
    v_tersedia := (v_balances->>'saldo_tersedia')::BIGINT;

    -- Validasi Keamanan
    IF req_nominal <= 0 THEN
        RAISE EXCEPTION 'Nominal penarikan harus lebih dari 0.';
    END IF;

    IF req_nominal > v_tersedia THEN
        RAISE EXCEPTION 'Saldo tidak mencukupi (Tersedia: %)', v_tersedia;
    END IF;

    -- Jika lolos semua validasi, masukkan ke antrean
    INSERT INTO penarikan_dana (
        organizer_id, nominal, bank_tujuan, rekening_tujuan, atas_nama, status
    ) VALUES (
        eo_id, req_nominal, b_nama, b_rek, b_atas_nama, 'REQUEST'
    );

    RETURN jsonb_build_object('success', true, 'pesan', 'Berhasil masuk antrean.');
END;
$$;
