import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  useWedgeProducts,
  useThirdPartyData,
  WEDGE_PRODUCTS,
  type WedgeProduct,
} from "@/lib/demoConfig";

export type LeftRailKey =
  | "Notifications"
  | "Home"
  | "Search"
  | "Clients"
  | "Trading"
  | "Operations"
  | "Analysis"
  | "Compliance"
  | "Admin"
  | "Help"
  | "ViDA";

export type HouseholdTabKey =
  | "Overview"
  | "Trading/Holdings"
  | "Insurance"
  | "Reports"
  | "Documents"
  | "Contacts"
  | "Planning"
  | "Administration";

export type HouseholdToolbarKey = "Year to Today" | "All Accounts";

export type PanelKey =
  | "Notifications"
  | "Home"
  | "Clients"
  | "Trading"
  | "Operations"
  | "Analysis"
  | "Compliance"
  | "Admin";

export const LEFT_RAIL_KEYS: LeftRailKey[] = [
  "Notifications",
  "Home",
  "Search",
  "Clients",
  "Trading",
  "Operations",
  "Analysis",
  "Compliance",
  "Admin",
  "Help",
  "ViDA",
];

export const HOUSEHOLD_TAB_KEYS: HouseholdTabKey[] = [
  "Overview",
  "Trading/Holdings",
  "Insurance",
  "Reports",
  "Documents",
  "Contacts",
  "Planning",
  "Administration",
];

export const PANEL_ITEMS: Record<PanelKey, string[]> = {
  Notifications: ["All Notifications", "Mentions", "Tasks", "Alerts"],
  Home: ["Dashboard", "Home Office Portal", "Shortcuts"],
  Clients: [
    "Households",
    "Accounts",
    "Insurance (In Force)",
    "Insurance (Pending)",
    "CRM Activities",
    "People",
    "Opportunities",
    "Texting",
    "Workflows",
    "Practice Intelligence",
    "Meeting Prep",
  ],
  Trading: ["Order Blotters", "Models"],
  Operations: [
    "Account Opening Dashboard",
    "Open New Account",
    "Bulk Account Opening",
    "Forms",

  ],
  Analysis: ["Portfolio Analytics", "Performance", "Risk"],
  Compliance: ["Corporate RIA Reviews"],
  Admin: [
    "CRM Admin",
    "Permissions and Preferences",
    "Notification Settings",
    "Integrations",
    "Demo Configurations",
  ],
};

export const PANEL_KEYS: PanelKey[] = Object.keys(PANEL_ITEMS) as PanelKey[];

export const HOUSEHOLD_TOOLBAR_KEYS: HouseholdToolbarKey[] = [
  "Year to Today",
  "All Accounts",
];

export type PanelItems = Record<PanelKey, Record<string, boolean>>;

export type NavVisibility = {
  leftRail: Record<LeftRailKey, boolean>;
  householdTabs: Record<HouseholdTabKey, boolean>;
  householdToolbar: Record<HouseholdToolbarKey, boolean>;
  panelItems: PanelItems;
};

const CACHE_KEY = "a360.navVisibility.v3";
const SETTINGS_KEY = "nav_visibility";
const EVT = "a360-navvis-change";

function defaultPanelItems(): PanelItems {
  return Object.fromEntries(
    PANEL_KEYS.map((p) => [
      p,
      Object.fromEntries(PANEL_ITEMS[p].map((l) => [l, true])),
    ]),
  ) as PanelItems;
}

function defaults(): NavVisibility {
  return {
    leftRail: Object.fromEntries(LEFT_RAIL_KEYS.map((k) => [k, true])) as Record<
      LeftRailKey,
      boolean
    >,
    householdTabs: Object.fromEntries(
      HOUSEHOLD_TAB_KEYS.map((k) => [k, true])
    ) as Record<HouseholdTabKey, boolean>,
    householdToolbar: Object.fromEntries(
      HOUSEHOLD_TOOLBAR_KEYS.map((k) => [k, true])
    ) as Record<HouseholdToolbarKey, boolean>,
    panelItems: defaultPanelItems(),
  };
}

function merge(partial: Partial<NavVisibility> | null | undefined): NavVisibility {
  const d = defaults();
  if (!partial) return d;
  const mergedPanels = { ...d.panelItems };
  if (partial.panelItems) {
    for (const p of PANEL_KEYS) {
      mergedPanels[p] = {
        ...d.panelItems[p],
        ...((partial.panelItems[p] as Record<string, boolean>) ?? {}),
      };
    }
  }
  return {
    leftRail: { ...d.leftRail, ...(partial.leftRail ?? {}) },
    householdTabs: { ...d.householdTabs, ...(partial.householdTabs ?? {}) },
    householdToolbar: { ...d.householdToolbar, ...(partial.householdToolbar ?? {}) },
    panelItems: mergedPanels,
  };
}

function readCache(): NavVisibility {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? merge(JSON.parse(raw)) : defaults();
  } catch {
    return defaults();
  }
}

function writeCache(v: NavVisibility) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(v));
  window.dispatchEvent(new Event(EVT));
}

async function fetchRemote(): Promise<NavVisibility | null> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();
  if (error || !data) return null;
  return merge(data.value as Partial<NavVisibility>);
}

// When the signed-in user has their own saved view (or opened a shared view
// link), their nav settings win over the shared org-level app_settings row.
let navUserOverride = false;
export function setNavUserOverride() {
  navUserOverride = true;
  navUserPending = false;
}
export function hasNavUserOverride() {
  return navUserOverride;
}

// While the signed-in user's saved view is still loading, the org-level row
// must not be applied — otherwise it races ahead and resets the view.
let navUserPending = false;
const REFETCH_EVT = "a360-navvis-refetch";
export function setNavUserPending() {
  navUserPending = true;
}
export function clearNavUserPending() {
  navUserPending = false;
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(REFETCH_EVT));
}



async function saveRemote(v: NavVisibility) {
  await supabase
    .from("app_settings")
    .upsert({ key: SETTINGS_KEY, value: v as never });
}

// ---- Wedge product → navigation mapping -------------------------------
// A wedge with a definition restricts navigation to exactly those items.
// Wedges without a definition impose no restriction (yet).
type WedgeNav = {
  leftRail: LeftRailKey[];
  panelItems: Partial<Record<PanelKey, string[]>>;
  householdTabs?: HouseholdTabKey[];
};

export const WEDGE_NAV: Partial<Record<WedgeProduct, WedgeNav>> = {
  "Digital Onboarding": {
    leftRail: ["Home", "Operations", "Admin", "Notifications", "Search"],
    panelItems: {
      Home: ["Dashboard", "Home Office Portal"],
      Operations: PANEL_ITEMS.Operations,
      Admin: ["Integrations", "Demo Configurations"],
      Notifications: PANEL_ITEMS.Notifications,
    },
    householdTabs: [
      "Overview",
      "Trading/Holdings",
      "Documents",
      "Contacts",
      "Administration",
    ],
  },
  "CRM+": {
    leftRail: ["Home", "Clients", "Search", "Admin"],
    panelItems: {
      Home: ["Dashboard", "Shortcuts"],
      Clients: PANEL_ITEMS.Clients.filter(
        (l) =>
          ![
            "Accounts",
            "Insurance (In Force)",
            "Insurance (Pending)",
            "Practice Intelligence",
          ].includes(l),
      ),
      Admin: PANEL_ITEMS.Admin,
    },
    householdTabs: ["Overview", "Documents", "Contacts", "Administration"],
  },
  "Client Portal": {
    leftRail: ["Home", "Search", "Clients", "Admin", "Notifications"],
    panelItems: {
      Home: ["Dashboard", "Home Office Portal"],
      Clients: ["Households", "People", "CRM Activities"],
      Admin: ["Integrations", "Demo Configurations"],
      Notifications: PANEL_ITEMS.Notifications,
    },
    householdTabs: ["Overview", "Documents", "Contacts", "Administration"],
  },
};

function applyWedges(
  base: NavVisibility,
  enabled: WedgeProduct[],
): NavVisibility {
  const defs = enabled
    .map((w) => WEDGE_NAV[w])
    .filter(Boolean) as WedgeNav[];
  if (enabled.length === 0 || defs.length === 0) return base;

  const railAllowed = new Set<string>(defs.flatMap((d) => d.leftRail));
  const leftRail = Object.fromEntries(
    LEFT_RAIL_KEYS.map((k) => [k, railAllowed.has(k)]),
  ) as Record<LeftRailKey, boolean>;

  const panelItems = Object.fromEntries(
    PANEL_KEYS.map((p) => {
      const allowed = new Set<string>(
        defs.flatMap((d) => d.panelItems[p] ?? []),
      );
      return [
        p,
        Object.fromEntries(
          PANEL_ITEMS[p].map((l) => [
            l,
            // Demo Configurations stays available in every wedge.
            l === "Demo Configurations" ? true : allowed.has(l),
          ]),
        ),
      ];
    }),
  ) as PanelItems;

  const tabDefs = defs.filter((d) => d.householdTabs);
  const householdTabs = tabDefs.length
    ? (Object.fromEntries(
        HOUSEHOLD_TAB_KEYS.map((k) => [
          k,
          tabDefs.some((d) => d.householdTabs!.includes(k)),
        ]),
      ) as Record<HouseholdTabKey, boolean>)
    : base.householdTabs;

  return { ...base, leftRail, panelItems, householdTabs };
}

export function useNavVisibility() {
  const [state, setState] = useState<NavVisibility>(defaults());
  const wedge = useWedgeProducts();

  useEffect(() => {
    setState(readCache());
    const loadRemote = () => {
      void fetchRemote().then((remote) => {
        if (remote && !navUserOverride && !navUserPending) {
          writeCache(remote);
          setState(remote);
        }
      });
    };
    loadRemote();

    const sync = () => setState(readCache());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener(REFETCH_EVT, loadRemote);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(REFETCH_EVT, loadRemote);
    };
  }, []);


  function persist(next: NavVisibility) {
    navUserOverride = true;
    writeCache(next);
    setState(next);
    void saveRemote(next);
  }


  const enabledWedges = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  const effective = applyWedges(state, enabledWedges);

  return {
    ...effective,
    toggleLeftRail(k: LeftRailKey) {
      persist({ ...state, leftRail: { ...state.leftRail, [k]: !state.leftRail[k] } });
    },
    toggleHouseholdTab(k: HouseholdTabKey) {
      persist({
        ...state,
        householdTabs: { ...state.householdTabs, [k]: !state.householdTabs[k] },
      });
    },
    toggleHouseholdToolbar(k: HouseholdToolbarKey) {
      persist({
        ...state,
        householdToolbar: {
          ...state.householdToolbar,
          [k]: !state.householdToolbar[k],
        },
      });
    },
    togglePanelItem(panel: PanelKey, label: string) {
      const current = state.panelItems[panel]?.[label] ?? true;
      persist({
        ...state,
        panelItems: {
          ...state.panelItems,
          [panel]: { ...state.panelItems[panel], [label]: !current },
        },
      });
    },
    setAll(visible: boolean) {
      persist({
        leftRail: Object.fromEntries(LEFT_RAIL_KEYS.map((k) => [k, visible])) as Record<
          LeftRailKey,
          boolean
        >,
        householdTabs: Object.fromEntries(
          HOUSEHOLD_TAB_KEYS.map((k) => [k, visible])
        ) as Record<HouseholdTabKey, boolean>,
        householdToolbar: Object.fromEntries(
          HOUSEHOLD_TOOLBAR_KEYS.map((k) => [k, visible])
        ) as Record<HouseholdToolbarKey, boolean>,
        panelItems: Object.fromEntries(
          PANEL_KEYS.map((p) => [
            p,
            Object.fromEntries(PANEL_ITEMS[p].map((l) => [l, visible])),
          ]),
        ) as PanelItems,
      });
    },
    reset() {
      persist(defaults());
    },
  };
}

// ---- Household Administration dropdown --------------------------------
export const HOUSEHOLD_ADMIN_MENU = [
  "Admin Profile",
  "Benchmarks",
  "Quarterly Statements",
  "Investor360°",
] as const;

const WEDGE_ADMIN_MENU: Partial<Record<WedgeProduct, string[]>> = {
  "CRM+": ["Investor360°"],
  "Digital Onboarding": ["Admin Profile", "Investor360°"],
  "Client Portal": ["Investor360°"],
};

export function useHouseholdAdminMenu(): {
  label: string;
  href?: string;
  to?: string;
}[] {
  const wedge = useWedgeProducts();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  const defs = enabled
    .map((w) => WEDGE_ADMIN_MENU[w])
    .filter(Boolean) as string[][];
  const allowed = defs.length ? new Set(defs.flat()) : null;
  // Client Portal => Investor360° administration stays in the household view
  // (in-app navigation). Other wedges open the Investor360° app in a new tab.
  const clientPortal = enabled.includes("Client Portal");
  return HOUSEHOLD_ADMIN_MENU.filter((l) => !allowed || allowed.has(l)).map(
    (label) => {
      if (label !== "Investor360°") return { label };
      return clientPortal
        ? { label, to: "/investor360-admin" }
        : { label, href: "/investor360" };
    },
  );
}

/** CRM+ or Digital Onboarding => Documents tab is a plain link (no dropdown). */
export function useHouseholdDocumentsHasMenu(): boolean {
  const wedge = useWedgeProducts();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  if (enabled.includes("CRM+") || enabled.includes("Digital Onboarding"))
    return false;
  return true;
}

/**
 * Digital Onboarding (without CRM+) => CRM surfaces are read-only:
 * no add/edit/delete affordances.
 */
export function useCrmReadOnly(): boolean {
  const wedge = useWedgeProducts();
  const thirdParty = useThirdPartyCrm();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  if (thirdParty) return true;
  return enabled.includes("Digital Onboarding") && !enabled.includes("CRM+");
}

/** True when any enabled wedge sources its CRM records from a third party. */
export function useThirdPartyCrm(): boolean {
  const wedge = useWedgeProducts();
  const tp = useThirdPartyData();
  return WEDGE_PRODUCTS.some((w) => wedge.state[w] && tp.state[w]?.crm);
}

/**
 * True when any enabled wedge sources portfolio/account data from a third
 * party (e.g. Orion). Portfolio surfaces become read-only: no trading, no
 * rebalancing, no account edits. Client messaging inside A360 stays enabled.
 */
export function useThirdPartyPortfolio(): boolean {
  const wedge = useWedgeProducts();
  const tp = useThirdPartyData();
  return WEDGE_PRODUCTS.some((w) => wedge.state[w] && tp.state[w]?.portfolio);
}

/** Portfolio / holdings / account surfaces are view-only. */
export function usePortfolioReadOnly(): boolean {
  return useThirdPartyPortfolio();
}

/** Client Connect ships as part of the CRM+ wedge. */
export function useClientConnectEnabled(): boolean {
  const wedge = useWedgeProducts();
  return !!wedge.state["CRM+"];
}

/** Digital Onboarding alone limits Contacts to Overview + People. */
export function useContactsMenuAllowed(): string[] | null {
  const wedge = useWedgeProducts();
  const tp = useThirdPartyData();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  if (enabled.includes("Digital Onboarding") && !enabled.includes("CRM+"))
    return ["Overview", "People"];
  // Client Portal limits Contacts only when its CRM data comes from a third
  // party; with first-party CRM data, Workflows and Connections stay visible.
  if (enabled.includes("Client Portal") && tp.state["Client Portal"]?.crm)
    return ["Overview", "People", "Activities"];
  return null;
}


/** Canonical Contacts dropdown, used when a page omits its own menu items. */
const DEFAULT_CONTACTS_MENU = [
  { label: "Overview", to: "/household/sweets/contacts" },
  { label: "People", to: "/household/sweets/contacts/people" },
  { label: "Connections", to: "/household/sweets/contacts/connections" },
  { label: "Activities", to: "/household/sweets/contacts/activities" },
  { label: "Workflows", to: "/household/sweets/contacts/workflows" },
];

/** Canonical Trading/Holdings dropdown, used on every household page. */
const DEFAULT_TRADING_MENU = [
  { label: "Trading/Holdings", to: "/household/sweets/trading-holdings" },
  { label: "Account Activity", to: "/household/sweets/account-activity" },
  { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" },
  { label: "Account Profile", to: "/household/sweets/account-profile" },
];


export function useFilteredHouseholdTabs<T extends { label: string }>(
  tabs: T[],
): T[] {
  const { householdTabs } = useNavVisibility();
  const adminMenu = useHouseholdAdminMenu();
  const docsMenu = useHouseholdDocumentsHasMenu();
  const clientConnect = useClientConnectEnabled();
  const contactsAllowed = useContactsMenuAllowed();
  return tabs
    .filter((t) => householdTabs[t.label as HouseholdTabKey] !== false)
    .map((t) => {
      if (t.label === "Trading/Holdings") {
        const items =
          (t as unknown as { menuItems?: { label: string; to?: string }[] })
            .menuItems ?? DEFAULT_TRADING_MENU;
        return {
          ...t,
          caret: true,
          menuItems: items,
          to: "/household/sweets/trading-holdings",
        } as T;
      }
      if (t.label === "Administration")
        return { ...t, caret: true, menuItems: adminMenu } as T;

      if (t.label === "Documents" && !docsMenu)
        return {
          ...t,
          caret: false,
          menuItems: undefined,
          to:
            (t as unknown as { to?: string }).to ??
            "/household/sweets/documents",
        } as T;
      if (t.label === "Contacts") {
        const base =
          (t as unknown as { menuItems?: { label: string; to?: string }[] })
            .menuItems ?? DEFAULT_CONTACTS_MENU;
        const items = base
          .filter((m) => m.label !== "Client Connect")
          .filter((m) => !contactsAllowed || contactsAllowed.includes(m.label));
        if (clientConnect)
          items.push({ label: "Client Connect", to: "/household/sweets/contacts/client-connect" });
        return { ...t, caret: true, menuItems: items } as T;
      }
      return t;
    });
}






/** Digital Onboarding or CRM+ wedge => Trading/Holdings is a read-only view. */
export function useTradingReadOnly(): boolean {
  const wedge = useWedgeProducts();
  const portfolioReadOnly = useThirdPartyPortfolio();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  if (portfolioReadOnly) return true;
  return enabled.includes("Digital Onboarding") || enabled.includes("CRM+");
}
