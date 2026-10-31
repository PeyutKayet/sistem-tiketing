-- ==============================================================================
-- MIGRATION: 15_create_orders_table_and_sync_wallet.sql
-- Fundamental Financial Architecture Upgrade for Tyket.id:
-- 1. Dedicated 'orders' table (normalized transaction & payment tracking)
-- 2. Foreign Key 'order_id' on 'peserta' table
-- 3. Non-destructive legacy data backfill into 'orders'
-- 4. Infaq & Wallet Reconciliation (RPC get_eo_balances)
-- 5. Standard Rp 6.500 bank fee & Rp 50.000 minimum withdrawal (RPC ajukan_penarikan)
-- 6. Updated event statistics (RPC get_admin_event_stats)
-- 7. Atomic Quota, Anti-Calo, and Order creation (RPC checkout_tiket_atomic)
-- ==============================================================================

-- 1. TABEL ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
    pembeli_nama VARCHAR(255),
    pembeli_email VARCHAR(255),
    pembeli_wa VARCHAR(50),
    subtotal_tiket BIGINT NOT NULL DEFAULT 0,
    nominal_infaq BIGINT NOT NULL DEFAULT 0,
    biaya_admin BIGINT NOT NULL DEFAULT 0,
    biaya_gateway BIGINT NOT NULL DEFAULT 0,
    total_tagihan BIGINT NOT NULL DEFAULT 0,
    status_pembayaran VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, cancelled, expired
    status_dana VARCHAR(20) NOT NULL DEFAULT 'PENDING',        -- PENDING, CAIR
    metode_pembayaran VARCHAR(50),                             -- qris, va_bca, manual, dll.
    payment_reference VARCHAR(100),                            -- Reconcile ID / VA number
    data_transaksi JSONB DEFAULT '{}'::jsonb,                  -- Gateway payload detail
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing tabel orders
CREATE INDEX IF NOT EXISTS idx_orders_event_id ON public.orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status_pembayaran);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(pembeli_wa, pembeli_email);

-- 2. RELASI ORDER_ID PADA TABEL PESERTA
ALTER TABLE public.peserta ADD COLUMN IF NOT EXISTS order_id VARCHAR(64) REFERENCES public.orders(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_peserta_order_fk ON public.peserta(order_id);

-- Kolom biaya_admin pada penarikan_dana
ALTER TABLE public.penarikan_dana ADD COLUMN IF NOT EXISTS biaya_admin BIGINT DEFAULT 6500;

-- 3. ROW LEVEL SECURITY (RLS) UNTUK ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Organizer can view orders of their events" ON public.orders;
CREATE POLICY "Organizer can view orders of their events"
ON public.orders FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.event e
        WHERE e.id = orders.event_id AND e.organizer_id = auth.uid()
    )
);

-- 4. BACKFILL DATA LAMA DARI PESERTA KE TABEL ORDERS (AMAN & ZERO DATA LOSS)
DO $$
DECLARE
    r RECORD;
    v_order_id VARCHAR(64);
    v_subtotal BIGINT;
    v_infaq BIGINT;
    v_admin BIGINT;
    v_gateway BIGINT;
    v_total BIGINT;
    v_status VARCHAR(20);
    v_status_dana VARCHAR(20);
    v_metode VARCHAR(50);
    v_created_at TIMESTAMPTZ;
BEGIN
    FOR r IN 
        SELECT DISTINCT 
            COALESCE(NULLIF(TRIM(p.data_tambahan->>'order_id'), ''), 'LEGACY-' || p.id::text) as derived_order_id,
            p.event_id
        FROM public.peserta p
        WHERE p.order_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.orders o WHERE o.id = COALESCE(NULLIF(TRIM(p.data_tambahan->>'order_id'), ''), 'LEGACY-' || p.id::text))
    LOOP
        v_order_id := r.derived_order_id;

        -- Hitung total subtotal tiket & infaq per pesanan masa lalu
        SELECT 
            COALESCE(SUM(kt.harga), 0),
            COALESCE(MAX(COALESCE((p.data_tambahan->>'infaqNominal')::BIGINT, 0)), 0),
            COALESCE(MAX(COALESCE((p.data_tambahan->'payment'->>'admin_fee')::BIGINT, 0)), 0),
            COALESCE(MAX(COALESCE((p.data_tambahan->'payment'->>'gateway_fee')::BIGINT, 0)), 0),
            CASE 
                WHEN bool_or(p.status_bayar = 'paid') THEN 'paid'
                WHEN bool_or(p.status_bayar = 'pending') THEN 'pending'
                ELSE 'cancelled'
            END,
            CASE 
                WHEN bool_or(p.status_dana = 'CAIR') THEN 'CAIR'
                ELSE 'PENDING'
            END,
            COALESCE(MAX(p.data_tambahan->'payment'->>'channel'), 'unknown'),
            MIN(p.created_at)
        INTO v_subtotal, v_infaq, v_admin, v_gateway, v_status, v_status_dana, v_metode, v_created_at
        FROM public.peserta p
        LEFT JOIN public.kategori_tiket kt ON p.kategori_id = kt.id
        WHERE (p.data_tambahan->>'order_id' = v_order_id) OR ('LEGACY-' || p.id::text = v_order_id);

        v_total := v_subtotal + v_infaq + v_admin + v_gateway;

        -- Simpan ke tabel orders jika belum ada
        INSERT INTO public.orders (
            id, event_id, pembeli_nama, pembeli_email, pembeli_wa,
            subtotal_tiket, nominal_infaq, biaya_admin, biaya_gateway, total_tagihan,
            status_pembayaran, status_dana, metode_pembayaran, created_at, paid_at
        )
        SELECT 
            v_order_id, r.event_id, p.nama_lengkap, p.email, p.no_wa,
            v_subtotal, v_infaq, v_admin, v_gateway, v_total,
            v_status, v_status_dana, v_metode, v_created_at,
            CASE WHEN v_status = 'paid' THEN v_created_at ELSE NULL END
        FROM public.peserta p
        WHERE (p.data_tambahan->>'order_id' = v_order_id) OR ('LEGACY-' || p.id::text = v_order_id)
        ORDER BY p.id ASC
        LIMIT 1
        ON CONFLICT (id) DO NOTHING;

        -- Sinkronisasi kolom order_id di tabel peserta
        UPDATE public.peserta 
        SET order_id = v_order_id
        WHERE (data_tambahan->>'order_id' = v_order_id) OR ('LEGACY-' || id::text = v_order_id);
    END LOOP;
END $$;

-- 5. RPC DOMPET EO (MENGHITUNG DARI ORDERS: TIKET + INFAQ)
CREATE OR REPLACE FUNCTION public.get_eo_balances(eo_id UUID)
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
    -- Hitung total uang CAIR dan PENDING dari tabel orders
    SELECT 
        COALESCE(SUM(CASE WHEN o.status_dana = 'CAIR' THEN (o.subtotal_tiket + o.nominal_infaq) ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN o.status_dana = 'PENDING' THEN (o.subtotal_tiket + o.nominal_infaq) ELSE 0 END), 0)
    INTO v_total_cair, v_total_pending
    FROM public.orders o
    JOIN public.event e ON o.event_id = e.id
    WHERE e.organizer_id = eo_id AND o.status_pembayaran = 'paid';

    -- Hitung total yang sudah ditarik atau sedang antre ditarik (termasuk biaya admin bank Rp 6.500)
    SELECT COALESCE(SUM(nominal + COALESCE(biaya_admin, 0)), 0) INTO v_total_ditarik
    FROM public.penarikan_dana
    WHERE organizer_id = eo_id AND status != 'DITOLAK';

    -- Saldo Tersedia yang bisa ditarik
    v_saldo_tersedia := GREATEST(0::BIGINT, v_total_cair - v_total_ditarik);

    RETURN jsonb_build_object(
        'saldo_tersedia', v_saldo_tersedia,
        'saldo_tertunda', v_total_pending,
        'total_ditarik', v_total_ditarik
    );
END;
$$;

-- 6. RPC PENARIKAN DANA DENGAN ATURAN MINIMAL 50K & BIAYA ADMIN 6.5K
CREATE OR REPLACE FUNCTION public.ajukan_penarikan(
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
    v_biaya_admin BIGINT := 6500;
    v_total_dibutuhkan BIGINT;
BEGIN
    -- Kunci transaksi per organizer profile
    PERFORM 1 FROM public.organizer_profile WHERE id = eo_id FOR UPDATE;

    -- Ambil saldo terbaru
    v_balances := public.get_eo_balances(eo_id);
    v_tersedia := (v_balances->>'saldo_tersedia')::BIGINT;

    -- Validasi 1: Minimal Penarikan Rp 50.000
    IF req_nominal < 50000 THEN
        RAISE EXCEPTION 'Minimal penarikan dana adalah Rp 50.000.';
    END IF;

    v_total_dibutuhkan := req_nominal + v_biaya_admin;

    -- Validasi 2: Saldo Harus Mencukupi (Nominal + Biaya Admin Rp 6.500)
    IF v_total_dibutuhkan > v_tersedia THEN
        RAISE EXCEPTION 'Saldo tidak mencukupi. Penarikan Rp % membutuhkan saldo minimal Rp % (termasuk biaya kliring bank Rp 6.500). Saldo tersedia: Rp %',
            req_nominal, v_total_dibutuhkan, v_tersedia;
    END IF;

    -- Simpan permohonan penarikan dana
    INSERT INTO public.penarikan_dana (
        organizer_id, nominal, biaya_admin, bank_tujuan, rekening_tujuan, atas_nama, status
    ) VALUES (
        eo_id, req_nominal, v_biaya_admin, b_nama, b_rek, b_atas_nama, 'REQUEST'
    );

    RETURN jsonb_build_object(
        'success', true, 
        'pesan', 'Pengajuan penarikan dana berhasil diproses.',
        'nominal', req_nominal,
        'biaya_admin', v_biaya_admin,
        'total_potong', v_total_dibutuhkan
    );
END;
$$;

-- 7. RPC STATISTIK EVENT ADMIN (PENDAPATAN TIKET & DONASI DARI ORDERS)
CREATE OR REPLACE FUNCTION public.get_admin_event_stats(p_event_id BIGINT)
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
        COALESCE((
            SELECT SUM(o.subtotal_tiket) 
            FROM public.orders o 
            WHERE o.event_id = p_event_id AND o.status_pembayaran = 'paid'
        ), 0)::BIGINT as pendapatan_tiket,
        COALESCE((
            SELECT SUM(o.nominal_infaq) 
            FROM public.orders o 
            WHERE o.event_id = p_event_id AND o.status_pembayaran = 'paid'
        ), 0)::BIGINT as pendapatan_donasi
    FROM public.peserta p
    WHERE p.event_id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC CHECKOUT TIKET ATOMIK (MENDUKUNG ORDERS & ANTI-CALO)
CREATE OR REPLACE FUNCTION public.checkout_tiket_atomic(
  p_event_id bigint,
  p_is_anti_calo_email boolean,
  p_is_anti_calo_wa boolean,
  p_peserta_data jsonb,
  p_order_data jsonb DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_email text;
  v_wa text;
  v_item record;
  v_kuota_max bigint;
  v_nama_kategori text;
  v_terpakai bigint;
  v_peserta_row jsonb;
  v_order_id varchar(64);
BEGIN
  -- A. Kunci Row Kategori Tiket & Validasi Kuota Atomik
  FOR v_item IN 
    SELECT 
      (x->>'kategori_id')::bigint as kat_id, 
      COUNT(*)::bigint as qty_diminta 
    FROM jsonb_array_elements(p_peserta_data) x 
    GROUP BY (x->>'kategori_id')::bigint
  LOOP
    SELECT kuota_maksimal, nama_kategori INTO v_kuota_max, v_nama_kategori
    FROM public.kategori_tiket 
    WHERE id = v_item.kat_id 
    FOR UPDATE;

    IF v_kuota_max IS NOT NULL AND v_kuota_max > 0 THEN
      SELECT COUNT(*) INTO v_terpakai
      FROM public.peserta
      WHERE kategori_id = v_item.kat_id
        AND (status_bayar = 'paid' OR (status_bayar = 'pending' AND created_at > now() - interval '15 minutes'));

      IF (v_terpakai + v_item.qty_diminta) > v_kuota_max THEN
        RAISE EXCEPTION 'Mohon maaf, kuota tiket "%" tidak mencukupi (sisa % tiket).', 
          v_nama_kategori, 
          GREATEST(0, v_kuota_max - v_terpakai);
      END IF;
    END IF;
  END LOOP;

  -- B. Pengecekan Anti-Calo secara atomik
  FOR v_peserta_row IN SELECT * FROM jsonb_array_elements(p_peserta_data)
  LOOP
    v_email := v_peserta_row->>'email';
    v_wa := v_peserta_row->>'no_wa';

    IF p_is_anti_calo_email AND v_email IS NOT NULL AND v_email != '' THEN
      PERFORM pg_advisory_xact_lock(hashtext('email' || p_event_id::text || v_email));
      
      IF EXISTS (
        SELECT 1 FROM public.peserta 
        WHERE event_id = p_event_id 
          AND email = v_email 
          AND (status_bayar = 'paid' OR (status_bayar = 'pending' AND created_at > now() - interval '15 minutes'))
      ) THEN
        RAISE EXCEPTION 'Sistem Anti-Calo: Email % sudah terdaftar pada event ini.', v_email;
      END IF;
    END IF;

    IF p_is_anti_calo_wa AND v_wa IS NOT NULL AND v_wa != '' THEN
      PERFORM pg_advisory_xact_lock(hashtext('wa' || p_event_id::text || v_wa));
      
      IF EXISTS (
        SELECT 1 FROM public.peserta 
        WHERE event_id = p_event_id 
          AND no_wa = v_wa 
          AND (status_bayar = 'paid' OR (status_bayar = 'pending' AND created_at > now() - interval '15 minutes'))
      ) THEN
        RAISE EXCEPTION 'Sistem Anti-Calo: Nomor WhatsApp % sudah terdaftar pada event ini.', v_wa;
      END IF;
    END IF;
  END LOOP;

  -- C. Simpan Order jika p_order_data disediakan
  IF p_order_data IS NOT NULL THEN
    v_order_id := p_order_data->>'id';
    INSERT INTO public.orders (
      id,
      event_id,
      pembeli_nama,
      pembeli_email,
      pembeli_wa,
      subtotal_tiket,
      nominal_infaq,
      biaya_admin,
      biaya_gateway,
      total_tagihan,
      status_pembayaran,
      status_dana,
      metode_pembayaran,
      payment_reference,
      data_transaksi
    ) VALUES (
      v_order_id,
      p_event_id,
      p_order_data->>'pembeli_nama',
      p_order_data->>'pembeli_email',
      p_order_data->>'pembeli_wa',
      COALESCE((p_order_data->>'subtotal_tiket')::bigint, 0),
      COALESCE((p_order_data->>'nominal_infaq')::bigint, 0),
      COALESCE((p_order_data->>'biaya_admin')::bigint, 0),
      COALESCE((p_order_data->>'biaya_gateway')::bigint, 0),
      COALESCE((p_order_data->>'total_tagihan')::bigint, 0),
      COALESCE(p_order_data->>'status_pembayaran', 'pending'),
      COALESCE(p_order_data->>'status_dana', 'PENDING'),
      p_order_data->>'metode_pembayaran',
      p_order_data->>'payment_reference',
      COALESCE(p_order_data->'data_transaksi', '{}'::jsonb)
    )
    ON CONFLICT (id) DO UPDATE SET
      total_tagihan = EXCLUDED.total_tagihan,
      updated_at = now();
  END IF;

  -- D. Insert data peserta
  INSERT INTO public.peserta (
    event_id, 
    kategori_id, 
    order_id,
    nama_lengkap, 
    email, 
    no_wa, 
    nama_tiket, 
    status_bayar, 
    bukti_bayar_url, 
    data_tambahan
  )
  SELECT 
    (x->>'event_id')::bigint,
    (x->>'kategori_id')::bigint,
    COALESCE(x->>'order_id', v_order_id, x->'data_tambahan'->>'order_id'),
    x->>'nama_lengkap',
    x->>'email',
    x->>'no_wa',
    x->>'nama_tiket',
    (x->>'status_bayar')::payment_status,
    x->>'bukti_bayar_url',
    (x->'data_tambahan')
  FROM jsonb_array_elements(p_peserta_data) AS x;

  RETURN jsonb_build_object('status', 'success', 'order_id', v_order_id);
END;
$$ LANGUAGE plpgsql;
