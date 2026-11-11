DROP POLICY IF EXISTS "authenticated read app_settings" ON public.app_settings;
CREATE POLICY "Admins can read app_settings"
ON public.app_settings FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));