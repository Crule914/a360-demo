import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import a360Logo from "@/assets/a360-logo.png.asset.json";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Advisor360°" },
      { name: "description", content: "Sign in to the Advisor360° demo." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        setError(
          result.error instanceof Error
            ? result.error.message
            : "Google sign-in failed. Please try again."
        );
        setLoading(false);
        return;
      }

      if (result.redirected) {
        // Browser will redirect to Google; nothing else to do.
        return;
      }

      const { supabase } = await import("@/integrations/supabase/client");
      const { signIn } = await import("@/lib/auth");
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;
      if (email) {
        const meta = data.user?.user_metadata ?? {};
        const name =
          (meta.full_name as string | undefined) ??
          (meta.name as string | undefined) ??
          undefined;
        signIn(email, name);
      }

      // Tokens received and session set — go to the dashboard.
      navigate({ to: "/", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <img
            src={a360Logo.url}
            alt="Advisor360°"
            className="h-14 object-contain mb-3"
          />
          <div className="text-[#13294B] text-sm tracking-[0.2em] uppercase font-medium mb-8">
            Demo
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-8">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-[#D1D5DB] rounded-md py-2.5 text-[14px] font-medium text-[#1F2937] hover:bg-[#F9FAFB] transition-colors disabled:opacity-60"
          >
            <GoogleIcon />
            {loading ? "Signing in…" : "Sign in with Google"}
          </button>

          {error && (
            <div className="mt-4 text-[13px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <p className="text-[12px] text-[#6B7280] text-center mt-6">
            Sign in with your Google account to access the demo.
          </p>
        </div>

      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.19l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96L3.97 7.3C4.68 5.18 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
