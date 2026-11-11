
-- app_settings: keep public read (nav visibility is global config the UI reads pre-auth), restrict writes to authenticated users
DROP POLICY IF EXISTS "demo open insert app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "demo open update app_settings" ON public.app_settings;

CREATE POLICY "authenticated can insert app_settings"
  ON public.app_settings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated can update app_settings"
  ON public.app_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

REVOKE INSERT, UPDATE, DELETE ON public.app_settings FROM anon;

-- user_dashboard_prefs: scope to the signed-in user's own email
DROP POLICY IF EXISTS "demo open read user_dashboard_prefs" ON public.user_dashboard_prefs;
DROP POLICY IF EXISTS "demo open insert user_dashboard_prefs" ON public.user_dashboard_prefs;
DROP POLICY IF EXISTS "demo open update user_dashboard_prefs" ON public.user_dashboard_prefs;

CREATE POLICY "users read own dashboard prefs"
  ON public.user_dashboard_prefs FOR SELECT TO authenticated
  USING (lower(user_email) = lower(auth.email()));

CREATE POLICY "users insert own dashboard prefs"
  ON public.user_dashboard_prefs FOR INSERT TO authenticated
  WITH CHECK (lower(user_email) = lower(auth.email()));

CREATE POLICY "users update own dashboard prefs"
  ON public.user_dashboard_prefs FOR UPDATE TO authenticated
  USING (lower(user_email) = lower(auth.email()))
  WITH CHECK (lower(user_email) = lower(auth.email()));

REVOKE SELECT, INSERT, UPDATE, DELETE ON public.user_dashboard_prefs FROM anon;
