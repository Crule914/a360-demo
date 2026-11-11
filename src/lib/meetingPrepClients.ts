import { getMockMeetingData } from "@/meeting-iq/data/mockMeetingData";
import { getEnhancedMeetingsList } from "@/meeting-iq/data/mockDailyHighlights";

export type MeetingPrepClient = {
  clientId: string;
  clientName: string;
};

// Prefer a consistent display name for the Sweets household everywhere.
function normalizeName(clientId: string, clientName: string): string {
  if (clientId === "client-sweets-family") return "The Sweets Family";
  return clientName;
}

export function getMeetingPrepClients(): MeetingPrepClient[] {
  const seen = new Set<string>();
  const out: MeetingPrepClient[] = [];

  const push = (clientId?: string, clientName?: string) => {
    if (!clientId || !clientName) return;
    if (seen.has(clientId)) return;
    seen.add(clientId);
    out.push({ clientId, clientName: normalizeName(clientId, clientName) });
  };

  // Union the two meeting data sources so search and the household routes
  // show every test household surfaced anywhere in the Meeting Prep UI.
  for (const m of getMockMeetingData()) push(m?.clientId, m?.clientName);
  try {
    for (const m of getEnhancedMeetingsList(undefined, true)) {
      push((m as any)?.clientId, (m as any)?.clientName);
    }
  } catch {
    // getEnhancedMeetingsList can throw on weekends/edge dates — safe to ignore.
  }

  out.sort((a, b) => {
    if (a.clientId === "client-sweets-family") return -1;
    if (b.clientId === "client-sweets-family") return 1;
    return a.clientName.localeCompare(b.clientName);
  });
  return out;
}
