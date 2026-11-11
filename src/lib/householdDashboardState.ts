import { useEffect, useState } from "react";
import { getStoredUser } from "./auth";
import { supabase } from "@/integrations/supabase/client";
import {
  useWedgeProducts,
  WEDGE_PRODUCTS,
  useThirdPartyData,
  type WedgeProduct,
} from "./demoConfig";

export type HouseholdWidgetId =
  | "balances"
  | "portfolioPerformance"
  | "peopleInHousehold"
  | "activeCrmWorkflows"
  | "recentCrmActivity"
  | "householdSummary";

export type HouseholdWidgetCategory = "Overview" | "CRM";

export const HOUSEHOLD_WIDGET_CATALOG: {
  id: HouseholdWidgetId;
  title: string;
  category: HouseholdWidgetCategory;
}[] = [
  { id: "balances", title: "Balances", category: "Overview" },
  { id: "portfolioPerformance", title: "Portfolio Performance", category: "Overview" },
  { id: "peopleInHousehold", title: "People in Household", category: "CRM" },
  { id: "activeCrmWorkflows", title: "Active CRM Workflows", category: "CRM" },
  { id: "recentCrmActivity", title: "Recent CRM Activity", category: "CRM" },
  { id: "householdSummary", title: "Household Summary", category: "CRM" },
];

export const HOUSEHOLD_CATEGORY_ORDER: HouseholdWidgetCategory[] = ["Overview", "CRM"];

// ---- Wedge product → household widget restriction ----------------------
export const WEDGE_HOUSEHOLD_WIDGETS: Partial<
  Record<WedgeProduct, HouseholdWidgetId[]>
> = {
  "CRM+": [
    "balances",
    "peopleInHousehold",
    "activeCrmWorkflows",
    "recentCrmActivity",
  ],
};

// Widgets a wedge must never offer, even when another enabled wedge allows
// them (denylist wins over the union of allowed lists).
export const WEDGE_HOUSEHOLD_DENIED: Partial<
  Record<WedgeProduct, HouseholdWidgetId[]>
> = {
  "CRM+": ["portfolioPerformance", "householdSummary"],
  "Digital Onboarding": ["recentCrmActivity", "portfolioPerformance"],
  "Client Portal": ["activeCrmWorkflows", "portfolioPerformance"],
};

export function useAllowedHouseholdWidgets(): {
  allowed: HouseholdWidgetId[] | null;
  catalog: typeof HOUSEHOLD_WIDGET_CATALOG;
} {
  const wedge = useWedgeProducts();
  const tp = useThirdPartyData();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  // Client Portal with first-party data shows every household widget.
  if (enabled.includes("Client Portal") && !tp.state["Client Portal"]?.crm) {
    return { allowed: null, catalog: HOUSEHOLD_WIDGET_CATALOG };
  }
  const defs = enabled
    .map((w) => WEDGE_HOUSEHOLD_WIDGETS[w])
    .filter(Boolean) as HouseholdWidgetId[][];
  const denied = new Set<HouseholdWidgetId>(
    enabled.flatMap((w) => WEDGE_HOUSEHOLD_DENIED[w] ?? []),
  );
  if (defs.length === 0 && denied.size === 0) {
    return { allowed: null, catalog: HOUSEHOLD_WIDGET_CATALOG };
  }
  const base =
    defs.length === 0
      ? HOUSEHOLD_WIDGET_CATALOG.map((w) => w.id)
      : defs.flat();
  const set = new Set<HouseholdWidgetId>(
    base.filter((id) => !denied.has(id)),
  );
  return {
    allowed: [...set],
    catalog: HOUSEHOLD_WIDGET_CATALOG.filter((w) => set.has(w.id)),
  };
}


const DEFAULT_ACTIVE: HouseholdWidgetId[] = [
  "balances",
  "portfolioPerformance",
  "peopleInHousehold",
  "activeCrmWorkflows",
  "recentCrmActivity",
  "householdSummary",
];

type HHState = {
  active: HouseholdWidgetId[];
  columns: 2 | 3;
  collapsed: boolean;
};

const CACHE_PREFIX = "a360.householdDash.v1";
const EVT = "a360-hhdash-change";

function cacheKey(email?: string | null) {
  return `${CACHE_PREFIX}:${email ?? "__anon__"}`;
}

function defaults(): HHState {
  return { active: DEFAULT_ACTIVE, columns: 2, collapsed: false };
}

function merge(p: Partial<HHState> | null | undefined): HHState {
  if (!p) return defaults();
  const valid = new Set<HouseholdWidgetId>(
    HOUSEHOLD_WIDGET_CATALOG.map((w) => w.id),
  );
  const active = Array.isArray(p.active)
    ? (p.active.filter((x) => valid.has(x as HouseholdWidgetId)) as HouseholdWidgetId[])
    : DEFAULT_ACTIVE;
  return {
    active: active.length ? active : DEFAULT_ACTIVE,
    columns: (p.columns === 3 ? 3 : 2) as 2 | 3,
    collapsed: !!p.collapsed,
  };
}

function readCache(email: string | null): HHState {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(cacheKey(email));
    return raw ? merge(JSON.parse(raw)) : defaults();
  } catch {
    return defaults();
  }
}

function writeCache(email: string | null, s: HHState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cacheKey(email), JSON.stringify(s));
  window.dispatchEvent(new Event(EVT));
}

// We share the user_dashboard_prefs row with the main dashboard by nesting
// household prefs under a `household` field on the same jsonb blob.
async function fetchRemote(email: string): Promise<HHState | null> {
  const { data, error } = await supabase
    .from("user_dashboard_prefs")
    .select("prefs")
    .eq("user_email", email)
    .maybeSingle();
  if (error || !data) return null;
  const prefs = (data.prefs ?? {}) as Record<string, unknown>;
  const hh = prefs.household as Partial<HHState> | undefined;
  return hh ? merge(hh) : null;
}

async function saveRemote(email: string, s: HHState) {
  const { data } = await supabase
    .from("user_dashboard_prefs")
    .select("prefs")
    .eq("user_email", email)
    .maybeSingle();
  const current = (data?.prefs ?? {}) as Record<string, unknown>;
  const next = { ...current, household: s };
  await supabase.from("user_dashboard_prefs").upsert({
    user_email: email,
    prefs: next as never,
  });
}

export function useHouseholdDashboardState() {
  const [email, setEmail] = useState<string | null>(
    () => getStoredUser()?.email ?? null,
  );
  const [state, setState] = useState<HHState>(defaults());

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

  function persist(next: HHState) {
    writeCache(email, next);
    setState(next);
    if (email) void saveRemote(email, next);
  }

  return {
    ...state,
    toggleWidget(id: HouseholdWidgetId) {
      const next = state.active.includes(id)
        ? state.active.filter((x) => x !== id)
        : [...state.active, id];
      persist({ ...state, active: next });
    },
    addWidgets(ids: HouseholdWidgetId[]) {
      const missing = ids.filter((id) => !state.active.includes(id));
      if (missing.length === 0) return;
      persist({ ...state, active: [...state.active, ...missing] });
    },
    removeWidget(id: HouseholdWidgetId) {
      persist({ ...state, active: state.active.filter((x) => x !== id) });
    },
    setColumns(columns: 2 | 3) {
      persist({ ...state, columns });
    },
    setCollapsed(collapsed: boolean) {
      persist({ ...state, collapsed });
    },
    moveWidget(id: HouseholdWidgetId, dir: -1 | 1) {
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
