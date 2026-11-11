import { useEffect, useState } from "react";
import { getStoredUser } from "./auth";
import { supabase } from "@/integrations/supabase/client";
import {
  useWedgeProducts,
  WEDGE_PRODUCTS,
  useThirdPartyData,
  type WedgeProduct,
} from "./demoConfig";

export type WidgetId =
  | "statistics"
  | "businessSnapshot"
  | "assets"
  | "favoriteReports"
  | "lastHouseholdsViewed"
  | "popularApplications"
  | "notifications"
  | "clientActivity"
  | "dayAtAGlance"
  | "financialCalculators"
  | "insurance";

export type WidgetCategory =
  | "Reporting"
  | "General"
  | "CRM"
  | "Trading"
  | "Planning"
  | "Insurance";

export const WIDGET_CATALOG: {
  id: WidgetId;
  title: string;
  category: WidgetCategory;
}[] = [
  { id: "statistics", title: "Statistics", category: "Reporting" },
  { id: "businessSnapshot", title: "Business Snapshot", category: "Reporting" },
  { id: "assets", title: "Assets", category: "Reporting" },
  { id: "favoriteReports", title: "Practice360 Favorite Reports", category: "Reporting" },
  { id: "lastHouseholdsViewed", title: "Last Households Viewed", category: "General" },
  { id: "popularApplications", title: "Popular Applications & Links", category: "General" },
  { id: "notifications", title: "Notifications", category: "General" },
  { id: "clientActivity", title: "Client Activity", category: "CRM" },
  { id: "dayAtAGlance", title: "Day at a Glance", category: "CRM" },
  { id: "financialCalculators", title: "Financial Calculators", category: "Planning" },
  { id: "insurance", title: "Insurance & Protection Products", category: "Insurance" },
];

// ---- Wedge product → dashboard widget restriction -----------------------
// When a wedge defines an allowed-widget list, only those widgets can be
// shown on or added to the dashboard. Wedges without a definition impose no
// restriction. Multiple enabled wedges union their allowed widgets.
export const WEDGE_WIDGETS: Partial<Record<WedgeProduct, WidgetId[]>> = {
"Digital Onboarding": [
    "popularApplications",
    "lastHouseholdsViewed",
    "statistics",
    "notifications",
    "assets",
  ],
  "CRM+": [
    "lastHouseholdsViewed",
    "popularApplications",
    "dayAtAGlance",
    "clientActivity",
    "notifications",
    "statistics",
    "assets",
  ],
  // Client Portal: Client Activity (no workflows) + Notifications only.
  "Client Portal": ["clientActivity", "notifications", "lastHouseholdsViewed"],
};

/** True when Client Portal is the only enabled wedge. */
export function useClientPortalOnly(): boolean {
  const wedge = useWedgeProducts();
  const tp = useThirdPartyData();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  // With first-party data, Client Portal shows full widget content.
  return (
    enabled.length === 1 &&
    enabled[0] === "Client Portal" &&
    !!tp.state["Client Portal"]?.crm
  );
}


export function useAllowedWidgets(): {
  allowed: WidgetId[] | null;
  catalog: typeof WIDGET_CATALOG;
  isRestricted: boolean;
} {
  const wedge = useWedgeProducts();
  const tp = useThirdPartyData();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  // Client Portal only restricts widgets when its CRM data is 3rd party.
  const restricting = enabled.filter(
    (w) => w !== "Client Portal" || !!tp.state["Client Portal"]?.crm,
  );
  if (enabled.includes("Client Portal") && restricting.length < enabled.length) {
    return { allowed: null, catalog: WIDGET_CATALOG, isRestricted: false };
  }
  const defs = restricting
    .map((w) => WEDGE_WIDGETS[w])
    .filter(Boolean) as WidgetId[][];
  if (enabled.length === 0 || defs.length === 0) {
    return { allowed: null, catalog: WIDGET_CATALOG, isRestricted: false };
  }
  const set = new Set<WidgetId>(defs.flat());
  return {
    allowed: [...set],
    catalog: WIDGET_CATALOG.filter((w) => set.has(w.id)),
    isRestricted: true,
  };
}

export const CATEGORY_ORDER: WidgetCategory[] = [
  "Reporting",
  "General",
  "CRM",
  "Trading",
  "Planning",
  "Insurance",
];

const DEFAULT_ACTIVE: WidgetId[] = [
  "dayAtAGlance",
  "lastHouseholdsViewed",
  "assets",
  "statistics",
];

type DashState = {
  active: WidgetId[];
  columns: 2 | 3;
  collapsed: boolean;
};

const CACHE_PREFIX = "a360.dashboard.v3";
const EVT = "a360-dash-change";

function cacheKey(email?: string | null) {
  return `${CACHE_PREFIX}:${email ?? "__anon__"}`;
}

function defaults(): DashState {
  return { active: DEFAULT_ACTIVE, columns: 3, collapsed: false };
}

function merge(p: Partial<DashState> | null | undefined): DashState {
  if (!p) return defaults();
  let active = Array.isArray(p.active) ? (p.active as WidgetId[]) : DEFAULT_ACTIVE;
  // Drop widgets that no longer exist (e.g. removed Market Summary / Cases)
  const known = new Set(WIDGET_CATALOG.map((w) => w.id));
  active = active.filter((id) => known.has(id));
  // Migration: ensure Day at a Glance sits above Last Households Viewed
  const hasDay = active.includes("dayAtAGlance");
  const hasLast = active.includes("lastHouseholdsViewed");
  if (hasLast && !hasDay) {
    const i = active.indexOf("lastHouseholdsViewed");
    active = [...active.slice(0, i), "dayAtAGlance", ...active.slice(i)];
  } else if (hasDay && hasLast) {
    const iDay = active.indexOf("dayAtAGlance");
    const iLast = active.indexOf("lastHouseholdsViewed");
    if (iDay > iLast) {
      active = active.filter((x) => x !== "dayAtAGlance");
      const j = active.indexOf("lastHouseholdsViewed");
      active = [...active.slice(0, j), "dayAtAGlance", ...active.slice(j)];
    }
  }
  return {
    active,
    columns: (p.columns === 2 ? 2 : 3) as 2 | 3,
    collapsed: !!p.collapsed,
  };
}

function readCache(email: string | null): DashState {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(cacheKey(email));
    return raw ? merge(JSON.parse(raw)) : defaults();
  } catch {
    return defaults();
  }
}

function writeCache(email: string | null, s: DashState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cacheKey(email), JSON.stringify(s));
  window.dispatchEvent(new Event(EVT));
}

async function fetchRemote(email: string): Promise<DashState | null> {
  const { data, error } = await supabase
    .from("user_dashboard_prefs")
    .select("prefs")
    .eq("user_email", email)
    .maybeSingle();
  if (error || !data) return null;
  return merge(data.prefs as Partial<DashState>);
}

async function saveRemote(email: string, s: DashState) {
  await supabase.from("user_dashboard_prefs").upsert({
    user_email: email,
    prefs: s as never,
  });
}

export function useDashboardState() {
  const [email, setEmail] = useState<string | null>(
    () => getStoredUser()?.email ?? null,
  );
  const [state, setState] = useState<DashState>(defaults());

  useEffect(() => {
    setState(readCache(email));
    if (email) {
      fetchRemote(email).then((remote) => {
        if (remote) {
          writeCache(email, remote);
          setState(remote);
        }
      });
    }
    const sync = () => {
      const e = getStoredUser()?.email ?? null;
      setEmail(e);
      setState(readCache(e));
    };
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("a360-auth-change", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("a360-auth-change", sync);
    };
  }, [email]);

  function persist(next: DashState) {
    writeCache(email, next);
    setState(next);
    if (email) void saveRemote(email, next);
  }

  return {
    ...state,
    toggleWidget(id: WidgetId) {
      const next = state.active.includes(id)
        ? state.active.filter((x) => x !== id)
        : [...state.active, id];
      persist({ ...state, active: next });
    },
    addWidgets(ids: WidgetId[]) {
      const missing = ids.filter((id) => !state.active.includes(id));
      if (missing.length === 0) return;
      persist({ ...state, active: [...state.active, ...missing] });
    },
    removeWidget(id: WidgetId) {
      persist({ ...state, active: state.active.filter((x) => x !== id) });
    },
    setColumns(columns: 2 | 3) {
      persist({ ...state, columns });
    },
    setCollapsed(collapsed: boolean) {
      persist({ ...state, collapsed });
    },
    moveWidget(id: WidgetId, dir: -1 | 1) {
      const idx = state.active.indexOf(id);
      if (idx === -1) return;
      const next = [...state.active];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return;
      [next[idx], next[target]] = [next[target], next[idx]];
      persist({ ...state, active: next });
    },
  };
}
