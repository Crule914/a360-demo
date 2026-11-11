import type { ReactNode } from "react";
import { useCrmReadOnly } from "@/lib/navVisibility";

/**
 * Renders CRM action affordances (add / edit / delete) only when the current
 * wedge configuration allows editing. Digital Onboarding is read-only.
 */
export function CanEdit({ children }: { children: ReactNode }) {
  const readOnly = useCrmReadOnly();
  if (readOnly) return null;
  return <>{children}</>;
}
