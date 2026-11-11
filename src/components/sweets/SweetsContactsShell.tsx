import { useEffect, type ReactNode } from "react";
import { Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";
import { useFilteredHouseholdTabs } from "@/lib/navVisibility";

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

export const CONTACTS_MENU = [
  { label: "Overview", to: "/household/sweets/contacts" },
  { label: "People", to: "/household/sweets/contacts/people" },
  { label: "Connections", to: "/household/sweets/contacts/connections" },
  { label: "Activities", to: "/household/sweets/contacts/activities" },
  { label: "Workflows", to: "/household/sweets/contacts/workflows" },
] as const;

const DOCUMENTS_MENU = [
  { label: "Documents", to: "/household/sweets/documents" },
];

const TABS = [
  { label: "Overview", to: "/household/sweets" },
  {
    label: "Trading/Holdings",
    caret: true,
    menuItems: [
      { label: "Trading/Holdings", to: "/household/sweets/trading-holdings" },
      { label: "Account Activity", to: "/household/sweets/account-activity" },
      { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" },
      { label: "Account Profile", to: "/household/sweets/account-profile" },
    ],
  },
  { label: "Insurance" },
  { label: "Reports", to: "/household/sweets/reports" },
  { label: "Documents", to: "/household/sweets/documents" },
  { label: "Contacts", caret: true, active: true, menuItems: [...CONTACTS_MENU] },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

export function SweetsContactsShell({ children }: { children: ReactNode }) {
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
                    className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-[11px] font-semibold tracking-wide text-white"
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
            </>
          }
          tabs={useFilteredHouseholdTabs(TABS as unknown as { label: string; caret?: boolean }[])}
        />
      }
    >
      <div className="bg-[#eef1f5] min-h-full text-[13px] text-[#1f2937]">
        {children}
      </div>
    </AppShell>
  );
}

export function CaretakerNote() {
  return (
    <div className="mx-6 mt-4 mb-3 bg-[#FFFBEA] border-l-4 border-[#F5C518] rounded-sm px-4 py-3 flex items-center gap-3">
      <p className="flex-1 text-[14px] text-[#13294B]">
        Karen's mom is sick, and she's been the primary caretaker.
      </p>
    </div>
  );
}
