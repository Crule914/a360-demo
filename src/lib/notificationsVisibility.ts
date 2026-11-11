import { useMemo } from "react";
import { useWedgeProducts, WEDGE_PRODUCTS } from "./demoConfig";
import { ALL_NOTIFICATIONS, type Notification } from "@/data/notifications";

/**
 * Digital Onboarding (on its own) limits notifications to account-document
 * alerts: missing required documents and documents that have been shared.
 * Client Portal (on its own) limits them to Investor360 messages and
 * Investor360 shared documents.
 */
export function useVisibleNotifications(): Notification[] {
  const wedge = useWedgeProducts();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  const only = enabled.length === 1 ? enabled[0] : null;

  return useMemo(() => {
    if (only === "Digital Onboarding") {
      return ALL_NOTIFICATIONS.filter(
        (n) => n.kind === "docs" || n.kind === "shared",
      );
    }
    if (only === "Client Portal") {
      return ALL_NOTIFICATIONS.filter(
        (n) => n.kind === "investor360" || n.kind === "shared",
      );
    }
    return ALL_NOTIFICATIONS;
  }, [only]);
}
