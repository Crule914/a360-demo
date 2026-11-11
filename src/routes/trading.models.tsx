import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Filter,
  HelpCircle,
  Info,
  MoreVertical,
  Search,
  Settings,
  ArrowDown,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/trading/models")({
  component: ModelsPage,
});

// ---------- Seed Data ----------
type ActionType = "Buy" | "Sell" | "No Trade";

interface Row {
  id: number;
  symbol: string;
  current: number | null;
  target: number;
  action: ActionType;
  trade: number;
  rtTrade: number;
  heldGL: number | null;
  leavesGL: number | null;
  proposed: number | null;
  taxMethod: string | null;
  tif: string;
  taxability: "Qualified" | "Non Qualified";
  active: boolean;
}

const SEED: Row[] = [
  { id: 1, symbol: "WM", current: 5.32, target: 0, action: "Sell", trade: 26, rtTrade: -5545.02, heldGL: 1614.28, leavesGL: 1614.28, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 2, symbol: "VOO", current: 0, target: 25, action: "Buy", trade: 37, rtTrade: 25478.20, heldGL: null, leavesGL: null, proposed: 25212.17, taxMethod: null, tif: "Day", taxability: "Non Qualified", active: true },
  { id: 3, symbol: "VOO", current: 0, target: 25, action: "Buy", trade: 2, rtTrade: 1377.20, heldGL: null, leavesGL: null, proposed: 1362.82, taxMethod: null, tif: "Day", taxability: "Qualified", active: true },
  { id: 4, symbol: "VOO", current: 0, target: 25, action: "Buy", trade: 13, rtTrade: 8951.80, heldGL: null, leavesGL: null, proposed: 8858.33, taxMethod: null, tif: "Day", taxability: "Non Qualified", active: true },
  { id: 5, symbol: "USRT", current: null, target: 0, action: "Buy", trade: 10, rtTrade: 650.50, heldGL: null, leavesGL: null, proposed: null, taxMethod: null, tif: "Day", taxability: "Qualified", active: true },
  { id: 6, symbol: "UNH", current: 2.60, target: 0, action: "Sell", trade: 7, rtTrade: -2816.03, heldGL: -951.32, leavesGL: -951.32, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 7, symbol: "T", current: 3.22, target: 0, action: "Sell", trade: 155, rtTrade: -3461.93, heldGL: -322.80, leavesGL: -322.80, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 8, symbol: "SYY", current: 3.86, target: 0, action: "Sell", trade: 52, rtTrade: -4112.68, heldGL: 101.51, leavesGL: 101.51, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 9, symbol: "SO", current: 5.25, target: 0, action: "Sell", trade: 61, rtTrade: -5729.12, heldGL: 1562.96, leavesGL: 1562.96, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 10, symbol: "RSG", current: 6.26, target: 0, action: "Sell", trade: 32, rtTrade: -6549.12, heldGL: 2574.71, leavesGL: 2574.71, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 11, symbol: "QQQ", current: 0, target: 25, action: "Buy", trade: 1, rtTrade: 739.29, heldGL: null, leavesGL: null, proposed: 722.51, taxMethod: null, tif: "Day", taxability: "Qualified", active: true },
  { id: 12, symbol: "QQQ", current: 0, target: 25, action: "Buy", trade: 12, rtTrade: 8871.42, heldGL: null, leavesGL: null, proposed: 8670.12, taxMethod: null, tif: "Day", taxability: "Non Qualified", active: true },
  { id: 13, symbol: "PG", current: 4.17, target: 0, action: "Sell", trade: 29, rtTrade: -4396.11, heldGL: 323.89, leavesGL: 323.89, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 14, symbol: "MSFT", current: 5.33, target: 0, action: "No Trade", trade: 0, rtTrade: 0, heldGL: 1669.68, leavesGL: 1669.68, proposed: 5748.44, taxMethod: null, tif: "Day", taxability: "Non Qualified", active: false },
  { id: 15, symbol: "MDLZ", current: 3.52, target: 0, action: "Sell", trade: 62, rtTrade: -3737.05, heldGL: -302.83, leavesGL: -302.83, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 16, symbol: "MCK", current: 0, target: 0, action: "Sell", trade: 0, rtTrade: 0, heldGL: null, leavesGL: null, proposed: null, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: false },
  { id: 17, symbol: "MCD", current: 3.82, target: 0, action: "Sell", trade: 14, rtTrade: -3922.81, heldGL: 176.59, leavesGL: 176.59, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 18, symbol: "LW", current: 1.93, target: 0, action: "Sell", trade: 47, rtTrade: -2110.77, heldGL: -1800.99, leavesGL: -1800.99, proposed: 0, taxMethod: "Default", tif: "Day", taxability: "Non Qualified", active: true },
  { id: 19, symbol: "LQD", current: 0, target: 25, action: "Buy", trade: 234, rtTrade: 25542.27, heldGL: null, leavesGL: null, proposed: 25452.18, taxMethod: null, tif: "Day", taxability: "Non Qualified", active: true },
  { id: 20, symbol: "LQD", current: 0, target: 25, action: "Buy", trade: 13, rtTrade: 1419.02, heldGL: null, leavesGL: null, proposed: 1414.01, taxMethod: null, tif: "Day", taxability: "Qualified", active: true },
  { id: 21, symbol: "LQD", current: 0, target: 25, action: "Buy", trade: 82, rtTrade: 8950.71, heldGL: null, leavesGL: null, proposed: 8919.14, taxMethod: null, tif: "Day", taxability: "Non Qualified", active: true },
];

// ---------- Helpers ----------
const fmtPct = (v: number | null) => (v === null ? "" : v.toFixed(2));
const fmtMoney = (v: number | null) =>
  v === null
    ? ""
    : v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtMoneyAbs = (v: number) =>
  Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------- Top Bar ----------
function TopBar() {
  return (
    <div className="bg-[#17447B] text-white px-6 pt-2 pb-3 flex items-start justify-between">
      <div>
        <div className="text-[10px] tracking-[0.12em] uppercase text-white/70 font-semibold">
          Trading
        </div>
        <h1 className="text-[22px] font-semibold leading-tight">Models</h1>
      </div>
      <button className="text-white/80 hover:text-white cursor-not-allowed">
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}

// ---------- Tabs ----------
const TABS = ["Models", "Accounts / Groups", "Equivalencies", "Reports", "Rebalance Tracker"];
function TabRow() {
  return (
    <div className="bg-white border-b border-[#E3E6EA] px-6 flex items-center">
      {TABS.map((t) => {
        const active = t === "Models";
        return (
          <button
            key={t}
            className={`px-4 py-3 text-[14px] font-semibold relative ${
              active ? "text-[#143A69]" : "text-[#5A6473] cursor-not-allowed"
            }`}
          >
            {t}
            {active && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-[#1976D2]" />
            )}
          </button>
        );
      })}
      <div className="ml-auto">
        <HelpCircle className="w-5 h-5 text-[#1976D2] cursor-not-allowed" />
      </div>
    </div>
  );
}

// ---------- Toggle ----------
function Toggle({ on, onChange }: { on: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      className={`relative inline-flex h-[18px] w-[32px] items-center rounded-full transition-colors ${
        on ? "bg-[#1976D2]" : "bg-[#C8CDD4]"
      }`}
    >
      <span
        className={`inline-block h-[14px] w-[14px] transform rounded-full bg-white transition-transform ${
          on ? "translate-x-[16px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

// ---------- Action cell ----------
function ActionCell({ action, disabled }: { action: ActionType; disabled?: boolean }) {
  if (action === "No Trade") {
    return (
      <span className="text-[#9CA3AF]">No Trade</span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-0.5 cursor-not-allowed ${
        disabled ? "text-[#9CA3AF]" : "text-[#1976D2]"
      }`}
    >
      {action}
      <ChevronDown className="w-3 h-3" />
    </span>
  );
}

// ---------- Page ----------
function ModelsPage() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [equityOpen, setEquityOpen] = useState(true);

  const activeCount = useMemo(() => rows.filter((r) => r.active).length, [rows]);

  const totals = useMemo(() => {
    const activeRows = rows.filter((r) => r.active);
    const buys = activeRows.filter((r) => r.action === "Buy");
    const sells = activeRows.filter((r) => r.action === "Sell");
    return {
      buysCount: buys.length,
      buysSum: buys.reduce((s, r) => s + r.rtTrade, 0),
      sellsCount: sells.length,
      sellsSum: sells.reduce((s, r) => s + Math.abs(r.rtTrade), 0),
    };
  }, [rows]);

  const displayRows = useMemo(
    () => (showOnlyActive ? rows.filter((r) => r.active) : rows),
    [rows, showOnlyActive]
  );

  const toggleRow = (id: number) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));

  const updateTrade = (id: number, v: number) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, trade: v } : r)));

  return (
    <AppShell topBar={<TopBar />}>
      <div className="font-['Source_Sans_Pro',_-apple-system,sans-serif] text-[#1F2937] flex flex-col h-[calc(100vh-64px)]">
        <TabRow />

        {/* Header band */}
        <div className="px-6 pt-4 pb-2 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center text-[13px] text-[#5A6473]">
              <span className="text-[#1976D2] cursor-not-allowed">Models</span>
              <ChevronRight className="w-3.5 h-3.5 mx-1 text-[#9CA3AF]" />
              <span>Review Securities</span>
            </div>
            <div className="text-right text-[12px] italic text-[#6B7280] leading-tight">
              <div>*Non-Intraday Value</div>
              <div>**Contains Unknown Lots</div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between flex-wrap gap-y-2">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-[20px] font-semibold text-[#143A69]">Review Securities</h2>
              <span className="text-[#5A6473]">|</span>
              <button className="inline-flex items-center gap-1 text-[14px] text-[#1976D2] cursor-not-allowed">
                Models View <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded bg-[#FFF3B0] text-[#7A5C00] cursor-not-allowed">
                Draft
              </span>
              <span className="text-[#5A6473]">|</span>
              <button className="text-[14px] text-[#1976D2] cursor-not-allowed">Save View</button>
              <button className="text-[14px] text-[#1976D2] cursor-not-allowed">Save New View</button>
              <button className="text-[14px] text-[#1976D2] cursor-not-allowed">Undo</button>
            </div>
            <label className="inline-flex items-center gap-2 text-[13px] text-[#1F2937] cursor-not-allowed">
              <input type="checkbox" className="cursor-not-allowed" />
              Ignore GTC Pending/Accepted Orders in Net Trade Calculation
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Toggle on={showOnlyActive} onChange={setShowOnlyActive} />
              <span className="text-[13px] text-[#1F2937]">
                Show only Active Trades ({activeCount})
              </span>
              <span className="text-[#D1D5DB]">|</span>
              <button className="text-[13px] text-[#1976D2] cursor-not-allowed">Remove All</button>
              <button className="text-[13px] text-[#1976D2] cursor-not-allowed">Include All</button>
              <button className="inline-flex items-center gap-1 text-[13px] text-[#1976D2] cursor-not-allowed">
                Actions <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-[#5A6473]">
                Group by:{" "}
                <button className="inline-flex items-center gap-1 text-[#1976D2] cursor-not-allowed">
                  Asset Type <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </span>
              <button className="inline-flex items-center gap-1 text-[13px] text-[#1976D2] cursor-not-allowed">
                <Settings className="w-3.5 h-3.5" /> Columns
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 min-h-0 overflow-auto bg-white border-t border-[#E3E6EA]">
          <table className="w-full text-[13px] border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F5F7FA]">
              <tr className="text-[11px] uppercase tracking-wide text-[#5A6473] border-b border-[#E3E6EA]">
                <th className="w-[40px] px-2 py-2"></th>
                <th className="w-[28px] px-1 py-2"></th>
                <th className="text-left px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Symbol <ArrowDown className="w-3 h-3 text-[#1976D2]" />
                    <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-right px-2 py-2">Current (%)</th>
                <th className="text-right px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Target (%) <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-left px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Action <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-left px-2 py-2">Trade</th>
                <th className="text-right px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    RT Trade ($) <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-left px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Alerts <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-right px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Held G/L <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-right px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Leaves G/L <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-right px-2 py-2">Proposed ($)</th>
                <th className="text-left px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Tax Method <Info className="w-3 h-3 text-[#9CA3AF]" />{" "}
                    <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="text-left px-2 py-2">TIF</th>
                <th className="text-left px-2 py-2">
                  <span className="inline-flex items-center gap-1">
                    Taxability <Filter className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Equity Group Header */}
              <tr className="bg-[#FAFBFC] border-b border-[#E3E6EA] text-[13px]">
                <td colSpan={2} className="px-2 py-2">
                  <button
                    onClick={() => setEquityOpen((o) => !o)}
                    className="inline-flex items-center text-[#143A69]"
                  >
                    {equityOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </td>
                <td className="px-2 py-2 font-semibold text-[#143A69]">Equity</td>
                <td colSpan={2}></td>
                <td className="px-2 py-2">
                  <span className="inline-flex items-center gap-1 text-[#1976D2] cursor-not-allowed">
                    Edit All <ChevronDown className="w-3 h-3" />
                  </span>
                </td>
                <td className="px-2 py-2">
                  <input
                    placeholder="Edit All"
                    disabled
                    className="w-[64px] px-1.5 py-0.5 text-[12px] border border-[#E3E6EA] rounded bg-white text-[#9CA3AF] cursor-not-allowed"
                  />
                </td>
                <td colSpan={6}></td>
                <td className="px-2 py-2">
                  <span className="inline-flex items-center gap-1 text-[#1976D2] cursor-not-allowed">
                    Edit All <ChevronDown className="w-3 h-3" />
                  </span>
                </td>
              </tr>

              {equityOpen &&
                displayRows.map((r) => {
                  const dim = !r.active;
                  const tc = dim ? "text-[#9CA3AF]" : "text-[#1F2937]";
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-[#EEF0F3] hover:bg-[#F9FAFB] ${tc}`}
                    >
                      <td className="px-2 py-1.5">
                        <Toggle on={r.active} onChange={() => toggleRow(r.id)} />
                      </td>
                      <td className="px-1 py-1.5 text-[#9CA3AF]">
                        <MoreVertical className="w-4 h-4 cursor-not-allowed" />
                      </td>
                      <td className="px-2 py-1.5 font-medium">{r.symbol}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmtPct(r.current)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        <span className="inline-flex items-center gap-1 justify-end">
                          {r.action === "Buy" && r.current === 0 && (
                            <Search className="w-3 h-3 text-[#1976D2]" />
                          )}
                          {fmtPct(r.target)}
                        </span>
                      </td>
                      <td className="px-2 py-1.5">
                        <ActionCell action={r.action} disabled={dim} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={r.trade}
                          onChange={(e) => updateTrade(r.id, Number(e.target.value))}
                          disabled={dim}
                          className={`w-[64px] px-1.5 py-0.5 text-[12px] border rounded text-right tabular-nums ${
                            dim
                              ? "border-[#E3E6EA] bg-[#F3F4F6] text-[#9CA3AF]"
                              : "border-[#D1D5DB] bg-white"
                          }`}
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {r.rtTrade === 0 && r.action === "No Trade"
                          ? "0.00"
                          : fmtMoney(r.rtTrade)}
                      </td>
                      <td className="px-2 py-1.5 text-[#F59E0B]">
                        <span className="inline-flex gap-1 text-[12px]">
                          {!dim && <>↔ ⚠</>}
                        </span>
                      </td>
                      <td
                        className={`px-2 py-1.5 text-right tabular-nums ${
                          dim
                            ? ""
                            : r.heldGL === null
                            ? ""
                            : r.heldGL >= 0
                            ? "text-[#15803D]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {fmtMoney(r.heldGL)}
                      </td>
                      <td
                        className={`px-2 py-1.5 text-right tabular-nums ${
                          dim
                            ? ""
                            : r.leavesGL === null
                            ? ""
                            : r.leavesGL >= 0
                            ? "text-[#15803D]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {fmtMoney(r.leavesGL)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmtMoney(r.proposed)}
                      </td>
                      <td className="px-2 py-1.5">
                        {r.taxMethod ? (
                          <span
                            className={`inline-flex items-center gap-1 cursor-not-allowed ${
                              dim ? "text-[#9CA3AF]" : "text-[#1976D2]"
                            }`}
                          >
                            {r.taxMethod} <ChevronDown className="w-3 h-3" />
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-1.5">
                        <span
                          className={`inline-flex items-center gap-1 cursor-not-allowed ${
                            dim ? "text-[#9CA3AF]" : "text-[#1976D2]"
                          }`}
                        >
                          {r.tif} <ChevronDown className="w-3 h-3" />
                        </span>
                      </td>
                      <td className="px-2 py-1.5">{r.taxability}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 py-4 text-[#1976D2]">
            <button className="cursor-not-allowed"><ChevronsLeft className="w-4 h-4" /></button>
            <button className="cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1976D2] text-white text-[13px]">1</span>
            <button className="cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
            <button className="cursor-not-allowed"><ChevronsRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#5A6473] text-white px-6 py-3 flex items-center justify-between sticky bottom-0">
          <div className="flex items-center gap-8 text-[13px]">
            <div>
              <div className="text-[#86EFAC] font-semibold">{totals.buysCount} Buys</div>
              <div className="text-[#86EFAC]">${fmtMoneyAbs(totals.buysSum)}</div>
            </div>
            <div>
              <div className="text-[#FCA5A5] font-semibold">{totals.sellsCount} Sells</div>
              <div className="text-[#FCA5A5]">${fmtMoneyAbs(totals.sellsSum)}</div>
            </div>
            <div>
              <div className="font-semibold">0 Exchanges</div>
              <div>$0.00</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 text-[13px] border border-white/70 rounded hover:bg-white/10 cursor-not-allowed">
              Cancel
            </button>
            <button className="px-4 py-1.5 text-[13px] bg-white text-[#143A69] rounded font-semibold cursor-not-allowed">
              Save
            </button>
            <button className="px-4 py-1.5 text-[13px] bg-white text-[#143A69] rounded font-semibold cursor-not-allowed">
              Save and Exit
            </button>
            <button className="px-4 py-1.5 text-[13px] bg-[#1976D2] text-white rounded font-semibold cursor-not-allowed">
              Preview Trades
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
