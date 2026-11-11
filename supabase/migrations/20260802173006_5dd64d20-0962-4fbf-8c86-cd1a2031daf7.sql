CREATE TABLE public.user_view_prefs (
  user_email text PRIMARY KEY,
  prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_view_prefs TO authenticated;
GRANT ALL ON public.user_view_prefs TO service_role;

ALTER TABLE public.user_view_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own view prefs"
  ON public.user_view_prefs FOR SELECT TO authenticated
  USING (lower(user_email) = lower(auth.email()));

CREATE POLICY "users insert own view prefs"
  ON public.user_view_prefs FOR INSERT TO authenticated
  WITH CHECK (lower(user_email) = lower(auth.email()));

CREATE POLICY "users update own view prefs"
  ON public.user_view_prefs FOR UPDATE TO authenticated
  USING (lower(user_email) = lower(auth.email()))
  WITH CHECK (lower(user_email) = lower(auth.email()));

CREATE POLICY "users delete own view prefs"
  ON public.user_view_prefs FOR DELETE TO authenticated
  USING (lower(user_email) = lower(auth.email()));

CREATE TRIGGER user_view_prefs_set_updated_at
  BEFORE UPDATE ON public.user_view_prefs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();