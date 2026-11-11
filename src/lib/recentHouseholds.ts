import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const KEY = "recentHouseholds";
const MAX = 3;

export type RecentHousehold = { id: string; name: string };

function isEstrada(h: RecentHousehold) {
  return (
    h.id.toLowerCase().includes("estrada") ||
    h.name.toLowerCase().includes("estrada")
  );
}

function read(): RecentHousehold[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as RecentHousehold[]) : [];
    const seen = new Set<string>();
    const cleaned: RecentHousehold[] = [];
    for (const h of parsed) {
      if (isEstrada(h)) continue;
      const c = canonical(h);
      const k = keyOf(c);
      if (seen.has(k)) continue;
      seen.add(k);
      cleaned.push(c);
    }
    if (
      cleaned.length !== parsed.length ||
      cleaned.some((h, i) => h.id !== parsed[i]?.id)
    ) {
      write(cleaned, false);
    }
    return cleaned;
  } catch {
    return [];
  }
}

function write(list: RecentHousehold[], emit = true) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  if (emit) {
    window.dispatchEvent(new Event("recentHouseholds:change"));
  }
}

/** Canonical key so the same household stored under different ids
 *  (e.g. "sweets" vs "client-sweets-family") only appears once. */
function keyOf(h: RecentHousehold) {
  return h.name.trim().toLowerCase().replace(/^the\s+/, "");
}

/** Prefer the curated "sweets" household over generated aliases. */
function canonical(h: RecentHousehold): RecentHousehold {
  if (keyOf(h) === "sweets family") return { id: "sweets", name: "THE SWEETS FAMILY" };
  return h;
}

export function pushRecentHousehold(h: RecentHousehold) {
  const item = canonical(h);
  const next = [
    item,
    ...read()
      .map(canonical)
      .filter((x) => x.id !== item.id && keyOf(x) !== keyOf(item)),
  ].slice(0, MAX);
  write(next);
}

export function useRecentHouseholds() {
  const [list, setList] = useState<RecentHousehold[]>([]);
  useEffect(() => {
    setList(read());
    const sync = () => setList(read());
    window.addEventListener("recentHouseholds:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("recentHouseholds:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return list;
}

export function useOpenHousehold() {
  const navigate = useNavigate();
  return (h: RecentHousehold) => {
    pushRecentHousehold(h);
    navigate({ to: "/household/$householdId", params: { householdId: h.id } });
  };
}
