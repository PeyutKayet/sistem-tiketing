-- 1. TRIGGER UNTUK OTOMATIS MEMBUAT PROFIL ORGANIZER SAAT REGISTER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.organizer_profile (id, nama_organizer, no_wa, pin_scanner, updated_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    '123456', -- Default PIN
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hapus trigger jika sudah ada sebelumnya
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. RPC UNTUK CHECKOUT ATOMIC & ANTI-CALO
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
  v_item jsonb;
BEGIN
  -- Pengecekan Anti-Calo secara atomik
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_peserta_data)
  LOOP
    v_email := v_item->>'email';
    v_wa := v_item->>'no_wa';

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

  -- Insert data peserta jika lolos anti-calo
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
