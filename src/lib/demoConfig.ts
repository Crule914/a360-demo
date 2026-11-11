import { useEffect, useState, useCallback } from "react";

const DATA_KEY = "demo.dataSources.v1";
const INT_KEY = "demo.integrations.v1";

export const DATA_SOURCES = ["NFS", "IWS", "Schwab"] as const;
export type DataSource = (typeof DATA_SOURCES)[number];

export const INTEGRATIONS = [
  "eMoney",
  "Conquest",
  "RightCapital",
  "MoneyGuide Pro",
] as const;
export type Integration = (typeof INTEGRATIONS)[number];

export const WEDGE_PRODUCTS = [
  "Digital Onboarding",
  "CRM+",
  "Client Portal",
] as const;
export type WedgeProduct = (typeof WEDGE_PRODUCTS)[number];

/** Display labels (stored keys stay stable). */
export const WEDGE_LABELS: Record<WedgeProduct, string> = {
  "Digital Onboarding": "Digital Onboarding",
  "CRM+": "Digital Onboarding and CRM+",
  "Client Portal": "Client Portal",
};
export const wedgeLabel = (w: WedgeProduct) => WEDGE_LABELS[w] ?? w;

type Toggles<K extends string> = Record<K, boolean>;

function loadToggles<K extends string>(
  key: string,
  keys: readonly K[],
  defaultOn = true,
): Toggles<K> {
  const defaults = Object.fromEntries(
    keys.map((k) => [k, defaultOn]),
  ) as Toggles<K>;
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<Toggles<K>>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

const DEMO_EVT = "demo-config-change";

function saveToggles<K extends string>(key: string, val: Toggles<K>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event(DEMO_EVT));
  } catch {
    // ignore
  }
}

function useToggles<K extends string>(
  key: string,
  keys: readonly K[],
  defaultOn = true,
) {
  const [state, setState] = useState<Toggles<K>>(() =>
    typeof window === "undefined"
      ? (Object.fromEntries(keys.map((k) => [k, defaultOn])) as Toggles<K>)
      : loadToggles(key, keys, defaultOn),
  );

  useEffect(() => {
    const sync = () => setState(loadToggles(key, keys, defaultOn));
    sync();
    window.addEventListener(DEMO_EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DEMO_EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);


  const toggle = useCallback(
    (k: K) => {
      const current = loadToggles(key, keys, defaultOn);
      const next = { ...current, [k]: !current[k] } as Toggles<K>;
      setState(next);
      saveToggles(key, next);
    },
    [key, keys, defaultOn],
  );


  const setAll = useCallback(
    (val: boolean) => {
      const next = Object.fromEntries(keys.map((k) => [k, val])) as Toggles<K>;
      setState(next);
      saveToggles(key, next);
    },
    [key, keys],
  );

  return { state, toggle, setAll };
}

export function useDataSources() {
  return useToggles<DataSource>(DATA_KEY, DATA_SOURCES);
}

export function useIntegrations() {
  return useToggles<Integration>(INT_KEY, INTEGRATIONS);
}

const WEDGE_KEY = "demo.wedgeProducts.v2";

export function useWedgeProducts() {
  return useToggles<WedgeProduct>(WEDGE_KEY, WEDGE_PRODUCTS, false);
}

// ---------------------------------------------------------------------------
// Third-party data sourcing per wedge. When a wedge is fed by an external
// system of record (e.g. a third-party CRM, or portfolio data from Orion),
// the corresponding A360 surfaces become read-only.
// ---------------------------------------------------------------------------

export const THIRD_PARTY_KEY = "demo.thirdPartyData.v1";

export type ThirdPartyFlags = { crm: boolean; portfolio: boolean };
export type ThirdPartyState = Record<WedgeProduct, ThirdPartyFlags>;

const THIRD_PARTY_DEFAULT: ThirdPartyState = Object.fromEntries(
  WEDGE_PRODUCTS.map((w) => [w, { crm: false, portfolio: false }]),
) as ThirdPartyState;

function loadThirdParty(): ThirdPartyState {
  if (typeof window === "undefined") return THIRD_PARTY_DEFAULT;
  try {
    const raw = window.localStorage.getItem(THIRD_PARTY_KEY);
    if (!raw) return THIRD_PARTY_DEFAULT;
    const parsed = JSON.parse(raw) as Partial<ThirdPartyState>;
    return Object.fromEntries(
      WEDGE_PRODUCTS.map((w) => [
        w,
        { ...THIRD_PARTY_DEFAULT[w], ...(parsed?.[w] ?? {}) },
      ]),
    ) as ThirdPartyState;
  } catch {
    return THIRD_PARTY_DEFAULT;
  }
}

export function useThirdPartyData() {
  const [state, setState] = useState<ThirdPartyState>(() => loadThirdParty());

  useEffect(() => {
    const sync = () => setState(loadThirdParty());
    sync();
    window.addEventListener(DEMO_EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DEMO_EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((wedge: WedgeProduct, kind: keyof ThirdPartyFlags) => {
    const current = loadThirdParty();
    const next: ThirdPartyState = {
      ...current,
      [wedge]: { ...current[wedge], [kind]: !current[wedge][kind] },
    };
    setState(next);
    try {
      window.localStorage.setItem(THIRD_PARTY_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(DEMO_EVT));
    } catch {
      // ignore
    }
  }, []);

  return { state, toggle };
}

// Classify a free-text label (account name, document type, etc.) into a
// custodial data source. Falls back to Schwab when no explicit marker is
// present so legacy demo rows stay visible when Schwab is enabled.
export function classifySource(text: string | undefined | null): DataSource {
  const t = (text ?? "").toUpperCase();
  if (/\bNFS\b|NATIONAL FINANCIAL/.test(t)) return "NFS";
  if (/\bIWS\b|INVESTOR WEB/.test(t)) return "IWS";
  return "Schwab";
}

// Hook returning a predicate that keeps rows whose classified source is
// currently enabled in Demo Configurations → Data. Accepts a row and an
// optional accessor; by default it inspects a `.name` or `.accountName` field.
export function useSourceFilter() {
  const { state } = useDataSources();
  return function keep<T>(row: T, accessor?: (r: T) => string): boolean {
    const text =
      accessor?.(row) ??
      (row as any)?.accountName ??
      (row as any)?.name ??
      (row as any)?.sponsor ??
      "";
    const src = classifySource(String(text));
    return state[src];
  };
}
