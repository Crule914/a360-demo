import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Mail,
  Minus,
  Plus,
  Info,
  Printer,
  FileSpreadsheet,
  Columns3,
  Lock,
  ArrowUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs, useTradingReadOnly } from "@/lib/navVisibility";
import { Switch } from "@/components/ui/switch";
import { sweetsAccounts, sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";

export const Route = createFileRoute("/household/sweets/trading-holdings")({
  component: TradingHoldingsPage,
});

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

const TABS = [
  { label: "Overview", caret: false, to: "/household/sweets" },
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
  { label: "Insurance", caret: false },
  { label: "Reports", caret: false, to: "/household/sweets/reports" },
  { label: "Documents", caret: true, menuItems: [{ label: "Documents", to: "/household/sweets/documents" }, { label: "Statements", to: "/household/sweets/statements" }, { label: "Tax Documents", to: "/household/sweets/tax-documents" }, { label: "Customer Correspondence", to: "/household/sweets/customer-correspondence" }, { label: "Confirms", to: "/household/sweets/confirms" }] },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

type Holding = {
  description: string;
  symbol?: string;
  quantity: number;
  pricePct: number;
  valueChange: number;
  valuePct: number;
  price: number;
  value: number;
  assetsPct?: number;
  locked?: boolean;
  trade?: boolean;
};

type AccountBlock = {
  id: string;
  name: string;
  marketValue: number;
  cashAvailable: number | null;
  marketLabel?: string;
  cashLabel?: string;
  insurance?: boolean;
  holdings: Holding[];
};

const ADDITIONAL_ASSETS = 4410356.25;
const ADDITIONAL_LIABILITIES = -293006.05;

const PALETTE = [
  "#143A69", "#3091D8", "#16A0A0", "#3DA45B", "#A7C957",
  "#F4D35E", "#F4A53B", "#E76F51", "#C44536", "#8E2C3A",
  "#6A1B9A",
];

const ACCOUNT_BLOCKS: AccountBlock[] = [
  {
    id: "jav032164",
    name: "Richard Sweets Individual Schwab - Brokerage (10245678)",
    marketValue: 210369.58,
    cashAvailable: 210369.58,
    holdings: [
      { description: "ADVANTAGE CASH SWEEP", quantity: 210369.58, pricePct: 0, valueChange: 210369.58, valuePct: 0, price: 1.0, value: 210369.58, assetsPct: 100 },
      { description: "FLAGSTAR BK NATL ASSN HICKSVI CD 5.45000% 05/14/...", symbol: "33847GBG6", quantity: -100000, pricePct: 0, valueChange: 0, valuePct: 0, price: 0, value: 0 },
      { description: "SYNCHRONY BK RE/RETAIL CTF DEP UNSE", symbol: "87164W3L0", quantity: -60000, pricePct: 0, valueChange: 0, valuePct: 0, price: 0, value: 0 },
    ],
  },
  {
    id: "eep000907",
    name: "Richard Sweets & Karen Sweets Joint w/Survivor Schwab - Mutual Fund Strategist (10498012)",
    marketValue: 2570.95,
    cashAvailable: 2570.95,
    holdings: [
      { description: "ADVANTAGE CASH SWEEP", quantity: 2570.95, pricePct: 0, valueChange: 2570.95, valuePct: 0, price: 1.0, value: 2570.95, assetsPct: 0.05 },
    ],
  },
  {
    id: "br52001548",
    name: "Karen Sweets Brighthouse Life Insurance Co. (52001548) *",
    marketValue: 73643.34,
    cashAvailable: null,
    marketLabel: "Market Value*",
    cashLabel: "Cash Available*",
    insurance: true,
    holdings: [
      { description: "1-Year Shield 10 S&P 500 Index - MetLife Shield Level Se...", quantity: 2680.43, pricePct: 0, valueChange: 0, valuePct: 0, price: 1.0, value: 2680.43, assetsPct: 0.06, locked: true, trade: true },
      { description: "6-Year Shield 10 S&P 500 Index - MetLife Shield Level Se...", quantity: 70962.91, pricePct: 0, valueChange: 0, valuePct: 0, price: 1.0, value: 70962.91, assetsPct: 1.5, locked: true, trade: true },
    ],
  },
  {
    id: "ne321987",
    name: "Karen Sweets New England Life Insurance Co. - Variable Annuity (321987) *",
    marketValue: 515854.29,
    cashAvailable: null,
    marketLabel: "Market Value*",
    cashLabel: "Cash Available*",
    insurance: true,
    holdings: [
      { description: "Variable Annuity Sub-Account Aggregate", quantity: 515854.29, pricePct: 0, valueChange: 0, valuePct: 0, price: 1.0, value: 515854.29, assetsPct: 10.91, locked: true, trade: true },
    ],
  },
  {
    id: "b3200564",
    name: "Sweets Trust Schwab - Brokerage (10320056)",
    marketValue: 267428.06,
    cashAvailable: 1541.02,
    holdings: [
      { description: "ADVANTAGE CASH SWEEP", quantity: 1541.02, pricePct: 0, valueChange: 0, valuePct: 0, price: 1.0, value: 1541.02, assetsPct: 0.03 },
      { description: "VANGUARD TOTAL STOCK MARKET ETF", symbol: "VTI", quantity: 850, pricePct: 0.42, valueChange: 1132.5, valuePct: 0.43, price: 312.45, value: 265582.5, assetsPct: 5.62 },
      { description: "VANGUARD TOTAL BOND MARKET ETF", symbol: "BND", quantity: 4.5, pricePct: -0.08, valueChange: -0.27, valuePct: -0.09, price: 67.45, value: 303.54, assetsPct: 0.01 },
    ],
  },
];

const TOTAL_ACCOUNTS = ACCOUNT_BLOCKS.reduce((sum, a) => sum + a.marketValue, 0);
const TOTAL_NET_WORTH = TOTAL_ACCOUNTS + ADDITIONAL_ASSETS + ADDITIONAL_LIABILITIES;

const ACCOUNT_SUMMARY = ACCOUNT_BLOCKS.map((a, i) => ({
  id: a.id,
  name: a.name + (a.id === "jav032164" || a.id === "eep000907" || a.id === "b3200564" ? "" : ""),
  value: a.marketValue,
  pct: (a.marketValue / TOTAL_ACCOUNTS) * 100,
  color: PALETTE[i % PALETTE.length],
  insurance: a.insurance,
}));

function fmtMoney(n: number, opts: { signed?: boolean } = {}) {
  const s = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (opts.signed && n < 0) return `-$${s}`;
  if (opts.signed) return `$${s}`;
  return n < 0 ? `-$${s}` : `$${s}`;
}

function fmtPlain(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtQty(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function Donut({ data, size = 180 }: { data: { pct: number; color: string }[]; size?: number }) {
  const r = size / 2;
  const inner = r * 0.62;
  const cx = r;
  const cy = r;
  let cumulative = 0;
  const arcs = data
    .filter((d) => d.pct > 0)
    .map((d, i) => {
      const start = (cumulative / 100) * Math.PI * 2 - Math.PI / 2;
      cumulative += d.pct;
      const end = (cumulative / 100) * Math.PI * 2 - Math.PI / 2;
      const large = d.pct > 50 ? 1 : 0;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const xi1 = cx + inner * Math.cos(end);
      const yi1 = cy + inner * Math.sin(end);
      const xi2 = cx + inner * Math.cos(start);
      const yi2 = cy + inner * Math.sin(start);
      const dPath = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi2} ${yi2} Z`;
      return <path key={i} d={dPath} fill={d.color} stroke="#fff" strokeWidth={1} />;
    });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs}
    </svg>
  );
}

function TradingHoldingsPage() {
  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  const [showNetWorth, setShowNetWorth] = useState(true);
  const readOnly = useTradingReadOnly();
  const [tradingView, setTradingView] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);

  const toggle = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  const toggleAll = () => {
    const next = !allCollapsed;
    setAllCollapsed(next);
    const obj: Record<string, boolean> = {};
    ACCOUNT_BLOCKS.forEach((a) => (obj[a.id] = next));
    setCollapsed(obj);
  };

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
          <div className="text-[14px] font-semibold text-[#143A69]">Trading/Holdings</div>
          <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
          <FauxSelect>
            <span className="text-[#1f2937]">Most Recent</span>
            <span className="italic text-[#6b7280] ml-1">06/22/2026</span>
          </FauxSelect>
          <FauxSelect>All Accounts</FauxSelect>
          <FauxSelect>Group by: Account</FauxSelect>
          <div className="ml-auto flex items-center gap-5">
            {!readOnly && (
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#1f2937]">Trading View</span>
                <Switch checked={tradingView} onCheckedChange={setTradingView} />
              </div>
            )}
            <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline">
              <Printer className="w-4 h-4" /> Print Report
            </button>
            <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline">
              <FileSpreadsheet className="w-4 h-4" /> Export to Excel
            </button>
          </div>
        </div>

        {/* Total Net Worth card */}
        {showNetWorth && (
          <div className="bg-white border-b border-[#d4dae3]">
            <div className="px-5 pt-4 pb-2 flex items-start gap-6 border-b border-[#e5e7eb]">
              <button
                onClick={() => setShowNetWorth(false)}
                className="mt-1 w-5 h-5 rounded-full border border-[#1f6fb8] text-[#1f6fb8] flex items-center justify-center"
                aria-label="Hide"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] text-[#1f2937]">Total Net Worth:</span>
                <span className="text-[20px] font-semibold text-[#143A69]">
                  {fmtMoney(TOTAL_NET_WORTH)}
                </span>
              </div>
              <div className="border-l border-[#d4dae3] pl-6">
                <div className="text-[12px] text-[#6b7280]">Total Accounts</div>
                <div className="text-[16px] font-semibold text-[#1f2937]">{fmtMoney(TOTAL_ACCOUNTS)}</div>
              </div>
              <div className="pl-6">
                <div className="text-[12px] text-[#6b7280]">Total Additional Assets</div>
                <div className="text-[16px] font-semibold text-[#1f2937]">{fmtMoney(ADDITIONAL_ASSETS)}</div>
              </div>
              <div className="pl-6">
                <div className="text-[12px] text-[#6b7280]">Total Additional Liabilities</div>
                <div className="text-[16px] font-semibold text-[#1f2937]">{fmtMoney(ADDITIONAL_LIABILITIES)}</div>
              </div>
            </div>

            <div className="px-5 py-6 flex items-start gap-8">
              <div className="shrink-0 flex items-center justify-center w-[200px]">
                <Donut data={ACCOUNT_SUMMARY.map((a) => ({ pct: a.pct, color: a.color }))} size={180} />
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-[12px] text-[#6b7280] border-b border-[#e5e7eb]">
                      <th className="text-left font-semibold uppercase tracking-wide pb-2">
                        Account <Info className="w-3 h-3 inline text-[#9ca3af]" />
                      </th>
                      <th className="text-right font-semibold uppercase tracking-wide pb-2 w-[120px]">Value ($)</th>
                      <th className="text-right font-semibold uppercase tracking-wide pb-2 w-[100px]">Value (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACCOUNT_SUMMARY.map((a) => (
                      <tr key={a.id} className="border-b border-[#f1f3f6]">
                        <td className="py-1.5 flex items-center gap-2">
                          <span className="inline-block w-3 h-3" style={{ background: a.color }} />
                          <span>{a.name}</span>
                        </td>
                        <td className="py-1.5 text-right tabular-nums">{fmtPlain(a.value)}</td>
                        <td className="py-1.5 text-right tabular-nums">{a.pct.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-[#f1f3f6] text-[#6b7280]">
                      <td className="py-1.5 flex items-center gap-2">
                        <button className="text-[#1f6fb8]"><Plus className="w-3.5 h-3.5" /></button>
                        <span className="inline-block w-3 h-3 bg-[#6A1B9A]" />
                        <span>Remaining</span>
                      </td>
                      <td className="py-1.5 text-right tabular-nums">0.00</td>
                      <td className="py-1.5 text-right tabular-nums">0.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 pl-5 font-semibold">Total</td>
                      <td className="py-2 text-right font-semibold tabular-nums">{fmtMoney(TOTAL_ACCOUNTS)}</td>
                      <td className="py-2 text-right font-semibold tabular-nums">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="px-5 py-2">
          <button
            onClick={() => setShowNetWorth((v) => !v)}
            className="text-[#1f6fb8] hover:underline text-[13px]"
          >
            {showNetWorth ? "Hide" : "Show"} Total Net Worth
          </button>
        </div>

        {/* Accounts section */}
        <div className="px-5 pb-10">
          <div className="flex items-center justify-between py-2 border-b border-[#d4dae3]">
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-semibold text-[#143A69]">Accounts</span>
              <span className="text-[#d4dae3]">|</span>
              <button onClick={toggleAll} className="text-[#1f6fb8] hover:underline">
                {allCollapsed ? "Expand All" : "Collapse All"}
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline">
              <Columns3 className="w-4 h-4" /> Manage Columns
            </button>
          </div>

          {ACCOUNT_BLOCKS.map((a) => (
            <AccountSection
              key={a.id}
              account={a}
              collapsed={!!collapsed[a.id]}
              onToggle={() => toggle(a.id)}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function FauxSelect({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-8 px-3 bg-white border border-[#1f6fb8] rounded-sm text-[13px] text-[#1f6fb8] flex items-center gap-2 hover:bg-[#f4f8fc]">
      {children}
      <ChevronDown className="w-3.5 h-3.5" />
    </button>
  );
}

function AccountSection({
  account,
  collapsed,
  onToggle,
  readOnly,
}: {
  account: AccountBlock;
  collapsed: boolean;
  onToggle: () => void;
  readOnly?: boolean;
}) {
  const totalValue = account.holdings.reduce((s, h) => s + h.value, 0);
  const totalChange = account.holdings.reduce((s, h) => s + h.valueChange, 0);
  const totalAssetsPct = account.holdings.reduce((s, h) => s + (h.assetsPct ?? 0), 0);

  return (
    <div className="mt-3 bg-white border border-[#d4dae3]">
      <div className="px-3 py-2 flex items-center gap-3 border-b border-[#e5e7eb]">
        <button onClick={onToggle} className="text-[#1f6fb8]" aria-label="Toggle">
          <span className="w-5 h-5 rounded-full border border-[#1f6fb8] flex items-center justify-center">
            {collapsed ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </span>
        </button>
        <span className="text-[14px] font-semibold text-[#143A69]">{account.name}</span>
        <span className="text-[#d4dae3]">|</span>
        {!readOnly && (
          <button className="text-[#1f6fb8] hover:underline flex items-center gap-1">
            Actions <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
        <button className="text-[#1f6fb8] hover:underline flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Additional Info
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="px-3 py-3 flex items-start gap-10 border-b border-[#e5e7eb]">
            <div>
              <div className="text-[12px] text-[#6b7280]">{account.marketLabel ?? "Intraday Market Value"}</div>
              <div className="text-[15px] font-semibold text-[#1f2937]">{fmtMoney(account.marketValue)}</div>
            </div>
            <div>
              <div className="text-[12px] text-[#6b7280]">{account.cashLabel ?? "Intraday Cash Available"}</div>
              <div className="text-[15px] font-semibold text-[#1f2937]">
                {account.cashAvailable === null ? "N/A" : fmtMoney(account.cashAvailable)}
              </div>
            </div>
          </div>

          {!readOnly && (
            <div className="px-3 py-2 border-b border-[#e5e7eb]">
              <button
                className={`flex items-center gap-1.5 ${account.insurance ? "text-[#9ca3af] cursor-not-allowed" : "text-[#1f6fb8] hover:underline"}`}
                disabled={account.insurance}
              >
                <Plus className="w-3.5 h-3.5" /> Add New Order
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-[#f7f9fb]">
                <tr className="text-[11px] text-[#6b7280] uppercase tracking-wide border-b border-[#e5e7eb]">
                  {!readOnly && (
                    <th className="text-left font-semibold px-3 py-2 w-[160px]">
                      {account.insurance ? "" : "Liquidate/Cover All"}
                    </th>
                  )}
                  <th className="text-left font-semibold px-3 py-2">
                    <span className="inline-flex items-center gap-1">Description <ArrowUp className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left font-semibold px-3 py-2 w-[110px]">Symbol</th>
                  <th className="text-right font-semibold px-3 py-2 w-[110px]">Quantity</th>
                  <th className="text-right font-semibold px-3 py-2 w-[130px]">1-Day Price Change (%)</th>
                  <th className="text-right font-semibold px-3 py-2 w-[140px]">1-Day Value Change ($)</th>
                  <th className="text-right font-semibold px-3 py-2 w-[140px]">1-Day Value Change (%)</th>
                  <th className="text-right font-semibold px-3 py-2 w-[90px]">Price ($)</th>
                  <th className="text-right font-semibold px-3 py-2 w-[110px]">Value ($)</th>
                  <th className="text-right font-semibold px-3 py-2 w-[90px]">Assets (%)</th>
                </tr>
              </thead>
              <tbody>
                {account.holdings.map((h, i) => (
                  <tr key={i} className="border-b border-[#f1f3f6] hover:bg-[#fafbfd]">
                    {!readOnly && (
                      <td className="px-3 py-2">
                        {h.trade ? (
                          <button className={`flex items-center gap-1.5 ${h.locked ? "text-[#9ca3af]" : "text-[#1f6fb8] hover:underline"}`}>
                            Trade <ChevronDown className="w-3 h-3" />
                            {h.locked && <Lock className="w-3 h-3 ml-1" />}
                          </button>
                        ) : null}
                      </td>
                    )}
                    <td className="px-3 py-2 text-[#1f2937]">{h.description}</td>
                    <td className="px-3 py-2">
                      {h.symbol ? (
                        <button className="text-[#1f6fb8] hover:underline flex items-center gap-1">
                          {h.symbol} <ChevronDown className="w-3 h-3" />
                        </button>
                      ) : null}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${h.quantity < 0 ? "" : ""}`}>{fmtQty(h.quantity)}</td>
                    <td className={`px-3 py-2 text-right tabular-nums ${h.pricePct > 0 ? "text-[#1f7a3b]" : h.pricePct < 0 ? "text-[#b91c1c]" : ""}`}>
                      {h.pricePct.toFixed(2)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${h.valueChange > 0 ? "text-[#1f7a3b]" : h.valueChange < 0 ? "text-[#b91c1c]" : ""}`}>
                      {fmtPlain(h.valueChange)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${h.valuePct > 0 ? "text-[#1f7a3b]" : h.valuePct < 0 ? "text-[#b91c1c]" : ""}`}>
                      {h.valuePct.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{h.price.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtPlain(h.value)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{h.assetsPct !== undefined ? h.assetsPct.toFixed(2) : "0.00"}</td>
                  </tr>
                ))}
                <tr className="bg-[#f7f9fb] font-semibold">
                  {!readOnly && <td className="px-3 py-2" />}
                  <td className="px-3 py-2">Total</td>
                  <td />
                  <td />
                  <td />
                  <td className={`px-3 py-2 text-right tabular-nums ${totalChange > 0 ? "text-[#1f7a3b]" : totalChange < 0 ? "text-[#b91c1c]" : ""}`}>
                    {fmtPlain(totalChange)}
                  </td>
                  <td />
                  <td />
                  <td className="px-3 py-2 text-right tabular-nums">{fmtPlain(totalValue)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{totalAssetsPct.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
