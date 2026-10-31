-- ========================================================
-- MIGRATION: 12_create_platform_settings.sql
-- Master Platform Settings & Emergency Failover Gateway
-- ========================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 1. Siapapun (Public / Anonymous) bisa membaca konfigurasi (misal status emergency gateway)
DROP POLICY IF EXISTS "Public platform_settings read policy" ON public.platform_settings;
CREATE POLICY "Public platform_settings read policy" ON public.platform_settings
    FOR SELECT USING (true);

-- 2. Hanya Super Admin yang berhak mengubah setting platform
DROP POLICY IF EXISTS "Super admin can manage platform_settings" ON public.platform_settings;
CREATE POLICY "Super admin can manage platform_settings" ON public.platform_settings
    FOR ALL
    USING (EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid()));

-- Inisialisasi data default konfigurasi payment gateway
INSERT INTO public.platform_settings (key, value)
VALUES (
    'payment_gateway',
    '{
        "is_emergency_backup": false,
        "emergency_message": "Sistem pembayaran otomatis (QRIS/VA) sedang dalam pemeliharaan berkala. Untuk kenyamanan Anda, pembayaran dialihkan sementara ke Transfer Bank Manual.",
        "updated_by": "master@tyket.id"
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
