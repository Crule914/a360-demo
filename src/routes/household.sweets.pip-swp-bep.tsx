import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronDown, Mail, Plus, FileSpreadsheet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import {
  useFilteredHouseholdTabs,
  usePortfolioReadOnly,
} from "@/lib/navVisibility";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";

export const Route = createFileRoute("/household/sweets/pip-swp-bep")({
  component: PipSwpBepPage,
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

type PlanRow = {
  type: "PIP" | "SWP" | "BEP";
  account: string;
  security: string;
  frequency: string;
  nextDate: string;
  amount: number;
  status: "Active" | "Paused";
};

const ROWS: PlanRow[] = [
  { type: "PIP", account: "JAV032164 — Richard Sweets Ind.", security: "VANGUARD TOTAL STOCK MARKET ETF (VTI)", frequency: "Monthly", nextDate: "07/01/2026", amount: 1500, status: "Active" },
  { type: "PIP", account: "EEP000907 — Joint w/Survivor", security: "American Funds Growth Fund", frequency: "Monthly", nextDate: "07/01/2026", amount: 500, status: "Active" },
  { type: "SWP", account: "JAV033209 — Karen Sweets IRA", security: "ADVANTAGE CASH SWEEP", frequency: "Monthly", nextDate: "07/15/2026", amount: 2000, status: "Active" },
  { type: "SWP", account: "B3200564 — Sweets Trust", security: "VANGUARD TOTAL BOND MARKET ETF (BND)", frequency: "Quarterly", nextDate: "09/30/2026", amount: 3500, status: "Paused" },
  { type: "BEP", account: "EEP000906 — Richard Sweets IRA", security: "DoubleLine Total Return Bond", frequency: "Semi-Annual", nextDate: "12/15/2026", amount: 1200, status: "Active" },
];

function fmtMoney(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function FauxSelect({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-9 px-3 bg-white border border-[#1f6fb8] rounded-sm text-[13px] text-[#1f6fb8] flex items-center gap-2 hover:bg-[#f4f8fc]">
      {children}
      <ChevronDown className="w-3.5 h-3.5" />
    </button>
  );
}

function PipSwpBepPage() {
  const portfolioReadOnly = usePortfolioReadOnly();
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
          tabs={useFilteredHouseholdTabs(TABS)}
        />
      }
    >
      <div className="bg-[#eef1f5] min-h-full text-[13px] text-[#1f2937]">
        <div className="bg-[#eef1f5] px-5 py-3 flex items-center gap-3 border-b border-[#d4dae3]">
          <div className="text-[14px] font-semibold text-[#143A69]">PIP / SWP / BEP</div>
          <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
          <FauxSelect>All Accounts</FauxSelect>
          <FauxSelect>All Plan Types</FauxSelect>
          {!portfolioReadOnly && (
            <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline ml-2">
              <Plus className="w-4 h-4" /> Create New Plan
            </button>
          )}
          <div className="ml-auto flex items-center gap-3 text-[#1f6fb8]">
            <button className="flex items-center gap-1.5 hover:underline">
              <FileSpreadsheet className="w-4 h-4" /> Export to Excel
            </button>
          </div>
        </div>

        <div className="bg-white border-b border-[#d4dae3] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[12px] text-[#1f6fb8] uppercase tracking-wide border-b border-[#e5e7eb]">
                <th className="text-left font-semibold px-3 py-3 w-[80px]">Type</th>
                <th className="text-left font-semibold px-3 py-3">Account</th>
                <th className="text-left font-semibold px-3 py-3">Security</th>
                <th className="text-left font-semibold px-3 py-3 w-[120px]">Frequency</th>
                <th className="text-left font-semibold px-3 py-3 w-[120px]">Next Date</th>
                <th className="text-right font-semibold px-3 py-3 w-[120px]">Amount</th>
                <th className="text-left font-semibold px-3 py-3 w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-b border-[#f1f3f6] hover:bg-[#fafbfd]">
                  <td className="px-3 py-2">
                    <span className="inline-block px-2 py-0.5 rounded-sm text-[11px] font-semibold bg-[#eaf2fb] text-[#143A69]">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[#1f6fb8]">{r.account}</td>
                  <td className="px-3 py-2">{r.security}</td>
                  <td className="px-3 py-2">{r.frequency}</td>
                  <td className="px-3 py-2">{r.nextDate}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(r.amount)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 ${
                        r.status === "Active" ? "text-[#1f7a3b]" : "text-[#b45309]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          r.status === "Active" ? "bg-[#1f7a3b]" : "bg-[#b45309]"
                        }`}
                      />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 text-[12px] text-[#6b7280]">
          PIP = Periodic Investment Plan • SWP = Systematic Withdrawal Plan • BEP = Bond Exchange Plan
          <br />
          For financial professional use only. Not for use with the public.
        </div>
      </div>
    </AppShell>
  );
}
