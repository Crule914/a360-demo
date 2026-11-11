DROP POLICY IF EXISTS "demo open read app_settings" ON public.app_settings;
CREATE POLICY "authenticated read app_settings" ON public.app_settings FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.app_settings FROM anon;