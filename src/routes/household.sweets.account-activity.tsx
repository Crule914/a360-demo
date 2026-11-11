import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { ChevronDown, Mail, Plus, Minus, FileSpreadsheet, ArrowUp, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs } from "@/lib/navVisibility";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";

export const Route = createFileRoute("/household/sweets/account-activity")({
  component: AccountActivityPage,
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

type Row = {
  date: string;
  account: string;
  description: string;
  activityType: string;
  quantity: number;
  price: number;
  amount: number;
  subAccount?: string;
};

const ROWS: Row[] = [
  { date: "06/24", account: "F54013302", description: "INSIGHT ...", activityType: "Buy", quantity: 22.95, price: 1.0, amount: -22.95, subAccount: "Sweets Traditional IRA ..." },
  { date: "06/24", account: "F54013302", description: "INSIGHT ...", activityType: "Buy", quantity: 12.16, price: 1.0, amount: -12.16 },
  { date: "11/03", account: "F54013302", description: "INSIGHT ...", activityType: "Buy", quantity: 35.04, price: 1.0, amount: -35.04 },
  { date: "10/31", account: "F54013302", description: "INSIGHT ...", activityType: "Buy", quantity: 3.61, price: 1.0, amount: -3.61, subAccount: "Sweets Traditional IRA ..." },
  { date: "10/28", account: "F54013302", description: "INSIGHT ...", activityType: "Buy", quantity: 20.25, price: 1.0, amount: -20.25 },
  { date: "10/28", account: "652399828", description: "FIDELITY ...", activityType: "Buy", quantity: 5.26, price: 1.0, amount: -5.26 },
  { date: "10/28", account: "652399768", description: "FIDELITY ...", activityType: "Buy", quantity: 9.59, price: 1.0, amount: -9.59 },
  { date: "10/28", account: "652399763", description: "FIDELITY ...", activityType: "Buy", quantity: 4.71, price: 1.0, amount: -4.71 },
  { date: "10/15", account: "652399828", description: "FIDELITY ...", activityType: "Buy", quantity: 31.3, price: 1.0, amount: -31.3 },
  { date: "10/15", account: "652399768", description: "FIDELITY ...", activityType: "Buy", quantity: 56.81, price: 1.0, amount: -56.81 },
  { date: "10/15", account: "652399763", description: "FIDELITY ...", activityType: "Buy", quantity: 28.0, price: 1.0, amount: -28.0 },
  { date: "10/15", account: "652399828", description: "American Funds Growth Fund ...", activityType: "Buy", quantity: 2.167, price: 53.8, amount: -116.58 },
  { date: "10/15", account: "652399828", description: "ClearBridge Aggressive Growth ...", activityType: "Buy", quantity: 24.572, price: 55.92, amount: -1374.05 },
  { date: "10/15", account: "652399828", description: "DoubleLine Total Return Bond ...", activityType: "Buy", quantity: 94.111, price: 8.27, amount: -778.3 },
  { date: "10/15", account: "652399828", description: "Baird Aggregate Bond ...", activityType: "Buy", quantity: 263.047, price: 9.16, amount: -2409.51 },
  { date: "10/15", account: "652399768", description: "American Funds Growth Fund ...", activityType: "Buy", quantity: 9.111, price: 53.8, amount: -490.17 },
  { date: "10/15", account: "652399768", description: "ClearBridge Aggressive Growth ...", activityType: "Buy", quantity: 41.408, price: 55.92, amount: -2315.52 },
  { date: "10/15", account: "652399768", description: "DoubleLine Total Return Bond ...", activityType: "Buy", quantity: 154.881, price: 8.27, amount: -1280.87 },
  { date: "10/15", account: "652399768", description: "Baird Aggregate Bond ...", activityType: "Buy", quantity: 360.698, price: 9.16, amount: -3303.99 },
  { date: "10/15", account: "652399763", description: "American Funds Growth Fund ...", activityType: "Buy", quantity: 3.184, price: 53.8, amount: -171.31 },
  { date: "10/15", account: "652399763", description: "ClearBridge Aggressive Growth ...", activityType: "Buy", quantity: 20.896, price: 55.92, amount: -1168.48 },
  { date: "10/15", account: "652399763", description: "DoubleLine Total Return Bond ...", activityType: "Buy", quantity: 82.756, price: 8.27, amount: -684.39 },
  { date: "10/15", account: "652399763", description: "Baird Aggregate Bond ...", activityType: "Buy", quantity: 221.476, price: 9.16, amount: -2028.72 },
  { date: "10/15", account: "652399828", description: "Allspring Special Mid Cap ...", activityType: "Buy", quantity: 53.769, price: 11.64, amount: -625.87 },
  { date: "10/15", account: "652399768", description: "Allspring Special Mid Cap ...", activityType: "Buy", quantity: 97.267, price: 11.64, amount: -1132.19 },
  { date: "10/15", account: "652399763", description: "Allspring Special Mid Cap ...", activityType: "Buy", quantity: 47.043, price: 11.64, amount: -547.58 },
];

function fmtNum(n: number, frac = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: frac, maximumFractionDigits: 3 });
}

function FauxSelect({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <button
      className={`h-9 px-3 bg-white border rounded-sm text-[13px] flex items-center gap-2 ${
        highlight
          ? "border-[#e0a93b] text-[#1f2937] bg-[#fff8e8]"
          : "border-[#1f6fb8] text-[#1f6fb8] hover:bg-[#f4f8fc]"
      }`}
    >
      {children}
      <ChevronDown className="w-3.5 h-3.5" />
    </button>
  );
}

function AccountActivityPage() {
  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 3: true });

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
          <div className="text-[14px] font-semibold text-[#143A69]">Account Activity</div>
          <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
          <FauxSelect highlight>
            <span className="font-medium">Inception to Prior Year End</span>
            <span className="italic text-[#6b7280] ml-1">09/11/2017 - 12/31/2025</span>
          </FauxSelect>
          <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
          <FauxSelect>All Accounts</FauxSelect>
          <span className="text-[12px] italic text-[#6b7280] ml-1">200 of 1,325 records</span>
          <div className="ml-auto flex items-center gap-5">
            <FauxSelect>Activity Filters</FauxSelect>
            <div className="w-px h-6 bg-[#c5ccd6]" />
            <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline">
              <ClipboardList className="w-4 h-4" /> Est Realized G/L
            </button>
            <div className="w-px h-6 bg-[#c5ccd6]" />
            <button className="flex items-center gap-1.5 text-[#1f7a3b] hover:underline" aria-label="Export">
              <FileSpreadsheet className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-b border-[#d4dae3] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[12px] text-[#1f6fb8] uppercase tracking-wide border-b border-[#e5e7eb]">
                <th className="w-10 px-2 py-3" />
                <th className="text-left font-semibold px-2 py-3 w-[80px]">Date</th>
                <th className="text-left font-semibold px-2 py-3 w-[120px]">Account</th>
                <th className="text-left font-semibold px-2 py-3">Description</th>
                <th className="text-left font-semibold px-2 py-3 w-[180px]">
                  <span className="inline-flex items-center gap-1">Activity Type <ArrowUp className="w-3 h-3" /></span>
                </th>
                <th className="text-right font-semibold px-2 py-3 w-[110px]">Quantity</th>
                <th className="text-right font-semibold px-2 py-3 w-[90px]">Price($)</th>
                <th className="text-right font-semibold px-2 py-3 w-[120px] pr-5">Amount($)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => {
                const isOpen = !!expanded[i];
                return (
                  <Fragment key={i}>
                    <tr key={i} className={`border-b border-[#f1f3f6] ${isOpen ? "bg-[#f7f9fb]" : "hover:bg-[#fafbfd]"}`}>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => setExpanded((e) => ({ ...e, [i]: !e[i] }))}
                          className="text-[#1f6fb8]"
                          aria-label="Toggle"
                        >
                          <span className="w-5 h-5 rounded-full border border-[#1f6fb8] flex items-center justify-center">
                            {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </span>
                        </button>
                      </td>
                      <td className="px-2 py-2">{r.date}</td>
                      <td className="px-2 py-2">{r.account}</td>
                      <td className="px-2 py-2">{r.description}</td>
                      <td className="px-2 py-2">{r.activityType}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{fmtNum(r.quantity, 2)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{r.price.toFixed(2)}</td>
                      <td className="px-2 py-2 pr-5 text-right tabular-nums">{fmtNum(r.amount, 2)}</td>
                    </tr>
                    {isOpen && r.subAccount && (
                      <tr key={`${i}-sub`} className="bg-[#f7f9fb] border-b border-[#f1f3f6]">
                        <td />
                        <td />
                        <td className="px-2 py-2 text-[#6b7280] italic" colSpan={6}>
                          {r.subAccount}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 text-[12px] text-[#6b7280]">
          For financial professional use only. Not for use with the public.
        </div>
      </div>
    </AppShell>
  );
}
