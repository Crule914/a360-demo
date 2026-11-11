import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Mail, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs } from "@/lib/navVisibility";
import { MeetingPrepBody } from "@/components/meeting-prep/MeetingPrepBody";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";

export const Route = createFileRoute("/household/sweets/meeting-prep")({
  component: MeetingPrepPage,
});

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

const TABS = [
  { label: "Overview", caret: false, to: "/household/sweets" },
  { label: "Trading/Holdings", caret: true, menuItems: [{ label: "Trading/Holdings", to: "/household/sweets/trading-holdings" }, { label: "Account Activity", to: "/household/sweets/account-activity" }, { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" }, { label: "Account Profile", to: "/household/sweets/account-profile" }] },
  { label: "Insurance", caret: false },
  { label: "Reports", caret: false, to: "/household/sweets/reports" },
  { label: "Documents", caret: true, menuItems: [{ label: "Documents", to: "/household/sweets/documents" }, { label: "Statements", to: "/household/sweets/statements" }, { label: "Tax Documents", to: "/household/sweets/tax-documents" }, { label: "Customer Correspondence", to: "/household/sweets/customer-correspondence" }, { label: "Confirms", to: "/household/sweets/confirms" }] },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

function MeetingPrepPage() {
  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="CLIENTS"
          title={HOUSEHOLD_NAME}
          titleExtra={
            <>
              <button className="text-white/90 hover:text-white" aria-label="Email">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-1.5">
                {sweetsMembers.map((m) => (
                  <div
                    key={m.initials}
                    title={m.name}
                    className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-[11px] font-semibold tracking-wide"
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
            </>
          }
          tabs={useFilteredHouseholdTabs(TABS)}
          rightActions={
            <button aria-label="Open" className="hover:text-white">
              <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
            </button>
          }
        />
      }
    >
      <MeetingPrepBody householdName="The Sweets Family" meetingTime="Wednesday, June 24, 2026 at 5:30 PM" />
    </AppShell>
  );
}
