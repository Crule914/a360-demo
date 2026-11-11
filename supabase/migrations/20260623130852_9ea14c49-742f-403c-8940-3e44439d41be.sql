
-- Global key/value settings (e.g. nav visibility)
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo open read app_settings" ON public.app_settings
  FOR SELECT USING (true);
CREATE POLICY "demo open insert app_settings" ON public.app_settings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "demo open update app_settings" ON public.app_settings
  FOR UPDATE USING (true) WITH CHECK (true);

-- Per-demo-user dashboard preferences (keyed by email)
CREATE TABLE public.user_dashboard_prefs (
  user_email text PRIMARY KEY,
  prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_dashboard_prefs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_dashboard_prefs TO authenticated;
GRANT ALL ON public.user_dashboard_prefs TO service_role;

ALTER TABLE public.user_dashboard_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo open read user_dashboard_prefs" ON public.user_dashboard_prefs
  FOR SELECT USING (true);
CREATE POLICY "demo open insert user_dashboard_prefs" ON public.user_dashboard_prefs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "demo open update user_dashboard_prefs" ON public.user_dashboard_prefs
  FOR UPDATE USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER app_settings_set_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER user_dashboard_prefs_set_updated_at
  BEFORE UPDATE ON public.user_dashboard_prefs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
