import { useEffect, useState } from "react";

export type AuthUser = {
  email: string;
  name: string;
  initials: string;
};

const KEY = "a360.auth.user";
const EVT = "a360-auth-change";

export function getInitials(emailOrName: string): string {
  const local = emailOrName.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z]+/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (cleaned.length >= 2) return cleaned.slice(0, 2).toUpperCase();
  return (cleaned[0] ?? "?").toUpperCase();
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

export function signIn(email: string, name?: string): AuthUser {
  const cleanEmail = email.trim().toLowerCase();
  const displayName = name?.trim() || cleanEmail.split("@")[0];
  const user: AuthUser = {
    email: cleanEmail,
    name: displayName,
    initials: getInitials(name || cleanEmail),
  };
  window.localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVT));
  return user;
}

export async function signOut() {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
  } catch {
    // ignore — local clear below still runs
  }
  clearStoredUser();
}

export function useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  useEffect(() => {
    setUser(getStoredUser());
    const handler = () => setUser(getStoredUser());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return user;
}

export const ADVISOR360_DOMAIN = "advisor360.com";

export function isAdvisor360Email(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@" + ADVISOR360_DOMAIN);
}
