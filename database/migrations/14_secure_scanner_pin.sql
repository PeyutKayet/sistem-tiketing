-- ========================================================
-- MIGRATION: 14_secure_scanner_pin.sql
-- Update trigger handle_new_user() agar tidak lagi memberi default 123456,
-- dan reset organizer_profile yang masih menggunakan pin default 123456 menjadi NULL
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.organizer_profile (id, nama_organizer, no_wa, pin_scanner, updated_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    NULL, -- Wajib dibuat sendiri oleh organizer di onboarding
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bersihkan PIN default 123456 yang masih tersisa di database agar dipaksa onboarding
UPDATE public.organizer_profile
SET pin_scanner = NULL
WHERE pin_scanner = '123456';
