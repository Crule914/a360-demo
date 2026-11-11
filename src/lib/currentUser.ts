import { useAuthUser } from "./auth";

export type CurrentUser = {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  displayName: string; // "Last, First" style
};

const DEFAULT: CurrentUser = {
  email: "demo@advisor360.com",
  fullName: "Demo Advisor",
  firstName: "Demo",
  lastName: "Advisor",
  initials: "DA",
  displayName: "Advisor, Demo",
};

function deriveName(email: string, name?: string) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" ") || parts[0],
    };
  }
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  const parts = cleaned.split(/\s+/);
  return {
    firstName: cap(parts[0] ?? "User"),
    lastName: cap(parts[1] ?? ""),
  };
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function useCurrentUser(): CurrentUser {
  const user = useAuthUser();
  if (!user) return DEFAULT;
  const { firstName, lastName } = deriveName(user.email, user.name);
  const fullName = `${firstName}${lastName ? " " + lastName : ""}`.trim();
  return {
    email: user.email,
    fullName,
    firstName,
    lastName,
    initials: user.initials,
    displayName: lastName ? `${lastName}, ${firstName}` : firstName,
  };
}
