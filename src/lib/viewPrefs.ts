import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUser, useAuthUser } from "./auth";
import {
  setNavUserOverride,
  setNavUserPending,
  clearNavUserPending,
} from "./navVisibility";
import { WEDGE_PRODUCTS, type WedgeProduct } from "./demoConfig";

// ---------------------------------------------------------------------------
// A "view" is the full set of Demo Configuration toggles: navigation
// visibility, data sources, integrations and wedge products. Views are saved
// per signed-in user and can be encoded into a shareable link.
// ---------------------------------------------------------------------------

const NAV_KEY = "a360.navVisibility.v3";
const DATA_KEY = "demo.dataSources.v1";
const INT_KEY = "demo.integrations.v1";
const WEDGE_KEY = "demo.wedgeProducts.v2";
const THIRD_PARTY_KEY = "demo.thirdPartyData.v1";

const NAV_EVT = "a360-navvis-change";
const DEMO_EVT = "demo-config-change";

export const VIEW_PARAM = "view";

// Claim the nav layer synchronously (before any hook mounts) whenever a saved
// view could exist, so the org-level defaults can't win the race and reset the
// user's configuration on a fresh page load.
if (typeof window !== "undefined") {
  const search = window.location.search;
  if (search.includes(`${VIEW_PARAM}=`) || getStoredUser()) setNavUserPending();
}

export type ViewSnapshot = {
  nav?: unknown;
  dataSources?: Record<string, boolean>;
  integrations?: Record<string, boolean>;
  wedges?: Record<string, boolean>;
  thirdParty?: Record<string, { crm: boolean; portfolio: boolean }>;
};

function readJSON(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function snapshotView(): ViewSnapshot {
  if (typeof window === "undefined") return {};
  return {
    nav: readJSON(NAV_KEY),
    dataSources: readJSON(DATA_KEY),
    integrations: readJSON(INT_KEY),
    wedges: readJSON(WEDGE_KEY),
    thirdParty: readJSON(THIRD_PARTY_KEY),
  };
}

export function applyView(view: ViewSnapshot) {
  if (typeof window === "undefined" || !view) return;
  if (view.nav) {
    window.localStorage.setItem(NAV_KEY, JSON.stringify(view.nav));
    setNavUserOverride();
  }
  if (view.dataSources)
    window.localStorage.setItem(DATA_KEY, JSON.stringify(view.dataSources));
  if (view.integrations)
    window.localStorage.setItem(INT_KEY, JSON.stringify(view.integrations));
  if (view.wedges)
    window.localStorage.setItem(WEDGE_KEY, JSON.stringify(view.wedges));
  if (view.thirdParty)
    window.localStorage.setItem(
      THIRD_PARTY_KEY,
      JSON.stringify(view.thirdParty),
    );
  window.dispatchEvent(new Event(NAV_EVT));
  window.dispatchEvent(new Event(DEMO_EVT));
}

// ---- URL encoding ---------------------------------------------------------

export function encodeView(view: ViewSnapshot): string {
  const json = JSON.stringify(view);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeView(token: string): ViewSnapshot | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json) as ViewSnapshot;
  } catch {
    return null;
  }
}

export function buildShareLink(view: ViewSnapshot, path = "/"): string {
  const origin =
    typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}${path}?${VIEW_PARAM}=${encodeView(view)}`;
}

/** A link that shows exactly one wedge product (all others off). */
export function buildWedgeLink(wedge: WedgeProduct, path = "/"): string {
  const wedges = Object.fromEntries(
    WEDGE_PRODUCTS.map((w) => [w, w === wedge]),
  );
  return buildShareLink({ wedges }, path);
}

/** A link that turns every wedge off (full advisor platform). */
export function buildFullPlatformLink(path = "/"): string {
  const wedges = Object.fromEntries(WEDGE_PRODUCTS.map((w) => [w, false]));
  return buildShareLink({ wedges }, path);
}

// ---- Per-user persistence -------------------------------------------------

async function loadUserView(email: string): Promise<ViewSnapshot | null> {
  const { data, error } = await supabase
    .from("user_view_prefs")
    .select("prefs")
    .eq("user_email", email)
    .maybeSingle();
  if (error || !data) return null;
  return (data.prefs as ViewSnapshot) ?? null;
}

export async function saveUserView(email: string, view: ViewSnapshot) {
  await supabase
    .from("user_view_prefs")
    .upsert({ user_email: email, prefs: view as never });
}

/**
 * Mount once (root). Applies a shared `?view=` link when present — saving it as
 * the visitor's own preference — otherwise restores the user's saved view.
 * Afterwards, any configuration change is persisted back to their profile.
 */
export function useViewPrefsSync() {
  const user = useAuthUser();
  const email = user?.email ?? null;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get(VIEW_PARAM);
      const shared = token ? decodeView(token) : null;

      if (shared) {
        applyView(shared);
        if (email) await saveUserView(email, snapshotView());
        params.delete(VIEW_PARAM);
        const qs = params.toString();
        window.history.replaceState(
          {},
          "",
          window.location.pathname + (qs ? `?${qs}` : ""),
        );
      } else if (email) {
        setNavUserPending();
        const saved = await loadUserView(email);
        if (cancelled) return;
        if (saved) applyView(saved);
        else clearNavUserPending();
      } else {
        clearNavUserPending();
      }
      if (!cancelled) setReady(true);
    })().catch(() => {
      clearNavUserPending();
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [email]);

  // Persist every subsequent configuration change for this user.
  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const persist = () => {
      const current = getStoredUser()?.email;
      if (!current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        void saveUserView(current, snapshotView());
      }, 400);
    };
    window.addEventListener(NAV_EVT, persist);
    window.addEventListener(DEMO_EVT, persist);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(NAV_EVT, persist);
      window.removeEventListener(DEMO_EVT, persist);
    };
  }, [ready]);
}

/** Small helper for the admin share UI. */
export function useShareCurrentView(path = "/") {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore clipboard failures
    }
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);
  const currentLink = useCallback(
    () => buildShareLink(snapshotView(), path),
    [path],
  );
  return { copied, copy, currentLink };
}
