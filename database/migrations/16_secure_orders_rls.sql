-- ==============================================================================
-- MIGRATION: 16_secure_orders_rls.sql
-- Fix Critical Security & PII Leak:
-- Drop "Public can view own order by id" policy which had USING (true)
-- Ensure orders table is only accessible by:
-- 1. Organizer of the event (via auth.uid())
-- 2. Super admins (via super_admins table)
-- 3. Server service role (bypasses RLS)
-- ==============================================================================

-- 1. Drop public open access policy
DROP POLICY IF EXISTS "Public can view own order by id" ON public.orders;

-- 2. Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Organizer policy (view and manage orders for their own events)
DROP POLICY IF EXISTS "Organizer can view orders of their events" ON public.orders;
CREATE POLICY "Organizer can view orders of their events"
ON public.orders FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.event e
        WHERE e.id = orders.event_id AND e.organizer_id = auth.uid()
    )
);

-- 4. Super Admin policy (Super admins can view all orders)
DROP POLICY IF EXISTS "Super admin can view all orders" ON public.orders;
CREATE POLICY "Super admin can view all orders"
ON public.orders FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.super_admins sa
        WHERE sa.user_id = auth.uid()
    )
);
