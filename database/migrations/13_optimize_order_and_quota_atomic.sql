-- ========================================================
-- MIGRATION: 13_optimize_order_and_quota_atomic.sql
-- Optimasi Indeks Order ID, Search Tiket, Timestamp Scan,
-- dan Atomic Quota Lock pada RPC Checkout
-- ========================================================

-- 1. Index Expression untuk Order ID (Mempercepat polling & lookup tanpa table scan)
CREATE INDEX IF NOT EXISTS idx_peserta_order_id ON public.peserta ((data_tambahan->>'order_id'));

-- 2. Index untuk fitur Cari Tiket Saya (Pencarian cepat berdasarkan no_wa dan email)
CREATE INDEX IF NOT EXISTS idx_peserta_search ON public.peserta (no_wa, email);

-- 3. Kolom timestamp waktu scan tiket di gate
ALTER TABLE public.peserta ADD COLUMN IF NOT EXISTS scanned_at TIMESTAMPTZ;

-- 4. Peningkatan RPC Checkout Atomik (Anti-Calo + Anti-Overselling Quota Lock)
CREATE OR REPLACE FUNCTION public.checkout_tiket_atomic(
  p_event_id bigint,
  p_is_anti_calo_email boolean,
  p_is_anti_calo_wa boolean,
  p_peserta_data jsonb
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
BEGIN
  -- A. Kunci Row Kategori Tiket & Validasi Kuota Atomik (Mencegah Overselling saat War Tiket)
  FOR v_item IN 
    SELECT 
      (x->>'kategori_id')::bigint as kat_id, 
      COUNT(*)::bigint as qty_diminta 
    FROM jsonb_array_elements(p_peserta_data) x 
    GROUP BY (x->>'kategori_id')::bigint
  LOOP
    -- Lock row kategori_tiket agar transaksi konkuren lain menunggu
    SELECT kuota_maksimal, nama_kategori INTO v_kuota_max, v_nama_kategori
    FROM public.kategori_tiket 
    WHERE id = v_item.kat_id 
    FOR UPDATE;

    IF v_kuota_max IS NOT NULL AND v_kuota_max > 0 THEN
      -- Hitung tiket yang sudah paid atau pending dalam 15 menit terakhir
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
      -- Mengunci email spesifik untuk event ini selama transaksi
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
      -- Mengunci nomor wa spesifik untuk event ini selama transaksi
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

  -- C. Insert data peserta jika lolos kuota dan anti-calo
  INSERT INTO public.peserta (
    event_id, 
    kategori_id, 
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
    x->>'nama_lengkap',
    x->>'email',
    x->>'no_wa',
    x->>'nama_tiket',
    (x->>'status_bayar')::payment_status,
    x->>'bukti_bayar_url',
    (x->'data_tambahan')
  FROM jsonb_array_elements(p_peserta_data) AS x;

  RETURN '{"status":"success"}'::jsonb;
END;
$$ LANGUAGE plpgsql;
