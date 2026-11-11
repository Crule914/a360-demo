import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PROFILE_ACCOUNTS } from "@/data/profileAccounts";
import { useSourceFilter } from "@/lib/demoConfig";
import { ChevronDown, Mail, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs } from "@/lib/navVisibility";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";

export const Route = createFileRoute("/household/sweets/account-profile/")({
  component: AccountProfilePage,
});

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

const TABS = [
  { label: "Overview", to: "/household/sweets" },
  {
    label: "Trading/Holdings",
    caret: true,
    active: true,
    menuItems: [
      { label: "Trading/Holdings", to: "/household/sweets/trading-holdings" },
      { label: "Account Activity", to: "/household/sweets/account-activity" },
      { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" },
      { label: "Account Profile", to: "/household/sweets/account-profile" },
    ],
  },
  { label: "Insurance" },
  { label: "Reports", to: "/household/sweets/reports" },
  { label: "Documents", caret: true, menuItems: [{ label: "Documents", to: "/household/sweets/documents" }, { label: "Statements", to: "/household/sweets/statements" }, { label: "Tax Documents", to: "/household/sweets/tax-documents" }, { label: "Customer Correspondence", to: "/household/sweets/customer-correspondence" }, { label: "Confirms", to: "/household/sweets/confirms" }] },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

const SECTION_ORDER = ["Individual", "Joint", "Other", "Retirement", "Trust", "Insurance", "Closed"];

function FauxSelect({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-9 px-3 bg-white border border-[#1f6fb8] rounded-sm text-[13px] text-[#1f6fb8] flex items-center gap-2 hover:bg-[#f4f8fc]">
      {children}
      <ChevronDown className="w-3.5 h-3.5" />
    </button>
  );
}

function AccountProfilePage() {
  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  const keep = useSourceFilter();
  const visibleAccounts = PROFILE_ACCOUNTS.filter((a) => keep(a, (r) => r.sponsor));
  const sections = SECTION_ORDER.map((title) => ({
    title,
    accounts: visibleAccounts.filter((a) => a.category === title),
  })).filter((s) => s.accounts.length > 0);
  const total = visibleAccounts.length;


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
          tabs={useFilteredHouseholdTabs(TABS)}
        />
      }
    >
      <div className="bg-[#eef1f5] min-h-full text-[13px] text-[#1f2937]">
        {/* Controls bar */}
        <div className="bg-[#eef1f5] px-5 py-3 flex items-center gap-3 border-b border-[#d4dae3]">
          <div className="text-[14px] font-semibold text-[#143A69]">Account Profile</div>
          <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
          <FauxSelect>All Accounts</FauxSelect>
          <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline ml-2">
            <Plus className="w-4 h-4" /> Create Account
          </button>
          <div className="ml-auto flex items-center gap-4 text-[#1f6fb8]">
            <button className="hover:underline">Edit Dividend and Capital Gains</button>
            <span className="text-[#d4dae3]">|</span>
            <button className="hover:underline">Update Addresses and Phones</button>
            <span className="text-[#d4dae3]">|</span>
            <button className="flex items-center gap-1 hover:underline">
              <span aria-hidden>🌿</span> Paperless Preferences
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white border-b border-[#d4dae3] px-8 py-6">
          {sections.map((sec) => (
            <div key={sec.title} className="mb-7">
              <div className="text-[16px] font-semibold text-[#1f2937] mb-2">{sec.title}</div>
              <ul className="space-y-1.5">
                {sec.accounts.map((a) => (
                  <li key={a.id}>
                    <Link
                      to="/household/sweets/account-profile/$accountId"
                      params={{ accountId: a.id }}
                      className="text-[#1f6fb8] hover:underline cursor-pointer"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="text-center text-[12px] text-[#6b7280] mt-8">
            Showing 1 - {total} of {total}
          </div>
        </div>

        <div className="px-5 py-4 text-[12px] text-[#6b7280]">
          For financial professional use only. Not for use with the public.
        </div>
      </div>
    </AppShell>
  );
}
