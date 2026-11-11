import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Filter,
  Info,
  MoreVertical,
  Plus,
  Settings,
  FileSpreadsheet,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/trading/order-blotters")({
  component: OrderBlottersPage,
});

// ---------- Seed Data (system of record) ----------
type OrderStatus = "Trade Desk" | "Pending" | "Open/Executed" | "Rejected" | "Cancelled" | "Saved";
type ActionType = "Buy" | "Sell";

interface Order {
  id: string;
  symbol: string;
  description: string;
  action: ActionType;
  tradeQty: number;
  qtyType: string;
  priceType: string;
  limitAmount: number | null;
  tif: string;
  status: OrderStatus;
  assetType: string;
  sponsor: string;
}

const ORDERS: Order[] = [
  {
    id: "1",
    symbol: "SCHO",
    description: "Schwab Short-Term U.S. Treasury ETF",
    action: "Buy",
    tradeQty: 10,
    qtyType: "Shares",
    priceType: "Market",
    limitAmount: null,
    tif: "Day",
    status: "Trade Desk",
    assetType: "ETF",
    sponsor: "Charles Schwab",
  },
  {
    id: "2",
    symbol: "SCHF",
    description: "Schwab International Equity ETF",
    action: "Sell",
    tradeQty: 100,
    qtyType: "Shares",
    priceType: "Limit",
    limitAmount: 30.0,
    tif: "GTC",
    status: "Trade Desk",
    assetType: "ETF",
    sponsor: "Charles Schwab",
  },
  {
    id: "3",
    symbol: "MSFT",
    description: "Microsoft Corp",
    action: "Buy",
    tradeQty: 10,
    qtyType: "Shares",
    priceType: "Market",
    limitAmount: null,
    tif: "Day",
    status: "Pending",
    assetType: "Equity",
    sponsor: "Charles Schwab",
  },
  {
    id: "4",
    symbol: "GSEW",
    description: "Goldman Sachs Equal Weight U.S. Large Cap Equity ETF",
    action: "Buy",
    tradeQty: 10,
    qtyType: "Shares",
    priceType: "Market",
    limitAmount: null,
    tif: "Day",
    status: "Pending",
    assetType: "ETF",
    sponsor: "Charles Schwab",
  },
];

type TabKey = "Rejected" | "Pending" | "Open/Executed" | "Cancelled" | "Saved" | "All";

const TABS: TabKey[] = ["Rejected", "Pending", "Open/Executed", "Cancelled", "Saved", "All"];

// ---------- Page ----------
function OrderBlottersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("All");

  const counts = useMemo(() => {
    const byStatus = (s: OrderStatus) => ORDERS.filter((o) => o.status === s).length;
    return {
      Rejected: byStatus("Rejected"),
      Pending: byStatus("Pending"),
      "Open/Executed": byStatus("Open/Executed"),
      Cancelled: byStatus("Cancelled"),
      Saved: byStatus("Saved"),
      All: ORDERS.length,
    } as Record<TabKey, number>;
  }, []);

  const visibleOrders = useMemo(() => {
    if (activeTab === "All") return ORDERS;
    return ORDERS.filter((o) => o.status === (activeTab as OrderStatus));
  }, [activeTab]);

  return (
    <AppShell topBar={<HeaderBand />}>
      <div className="bg-white">
        <QuickAccessBar
          tabs={TABS}
          counts={counts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <SubHeaderRow />
        <FilterRow resultCount={visibleOrders.length} />
        <OrdersGrid orders={visibleOrders} />
      </div>
      {/* generous whitespace below grid */}
      <div className="h-[40vh]" />
    </AppShell>
  );
}

// ---------- Header Band ----------
function HeaderBand() {
  return (
    <header className="bg-[#17447B] text-white px-6 py-3 flex items-start justify-between">
      <div>
        <div className="text-[11px] tracking-[0.12em] uppercase text-[#7FB3E8] font-semibold">
          Trading
        </div>
        <h1 className="text-[22px] font-semibold leading-tight">Order Blotters</h1>
      </div>
      <button
        aria-label="Open in new window"
        className="text-white/85 hover:text-white mt-1"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </header>
  );
}

// ---------- Quick Access Bar ----------
function QuickAccessBar({
  tabs,
  counts,
  activeTab,
  onTabChange,
}: {
  tabs: TabKey[];
  counts: Record<TabKey, number>;
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
}) {
  return (
    <div className="flex items-center bg-[#F0F2F5] border-b border-[#E3E6EA] px-6 py-2.5 gap-4">
      <span className="text-[13px] text-[#13294B] font-medium">Quick Access</span>
      <div className="flex items-center gap-2">
        {tabs.map((t) => {
          const isActive = t === activeTab;
          return (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] transition-colors ${
                isActive
                  ? "bg-white border-[#1A5FA8] text-[#13294B]"
                  : "bg-white border-[#D1D5DB] text-[#1A5FA8] hover:border-[#1A5FA8]"
              }`}
            >
              <span>{t}</span>
              <span
                className={`min-w-[20px] text-center text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
                  isActive
                    ? "bg-[#1A5FA8] text-white"
                    : "bg-[#E3E6EA] text-[#13294B]"
                }`}
              >
                {counts[t]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="ml-auto flex items-center gap-4 text-[13px]">
      <button className="inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-not-allowed">
          <Plus className="w-4 h-4" /> Create Order
        </button>
        <span className="text-[#D1D5DB]">|</span>
        <button className="inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-not-allowed">
          Tools and Reports <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ---------- Sub-Header Row ----------
function SubHeaderRow() {
  return (
    <div className="flex items-center px-6 pt-4 pb-2 gap-4 text-[13px]">
      <h2 className="text-[18px] font-semibold text-[#13294B]">All Orders</h2>
      <span className="text-[#D1D5DB]">|</span>
      <button className="inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-not-allowed">
        Default View (System) <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <span className="bg-[#FFF3B0] text-[#7A5C00] text-[11px] font-semibold px-1.5 py-0.5 rounded cursor-not-allowed">
        Draft
      </span>
      <button className="text-[#9097A2] cursor-not-allowed">Save View</button>
      <span className="text-[#D1D5DB]">|</span>
      <button className="text-[#1A5FA8] hover:underline cursor-not-allowed">Save New View</button>
      <span className="text-[#D1D5DB]">|</span>
      <button className="text-[#1A5FA8] hover:underline cursor-not-allowed">Undo</button>

      <div className="ml-auto inline-flex items-center gap-1 text-[#1A5FA8] cursor-not-allowed">
        <span className="hover:underline">Trade Disclaimers</span>
        <Info className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

// ---------- Filter Row ----------
function FilterRow({ resultCount }: { resultCount: number }) {
  return (
    <div className="flex items-center px-6 pb-2 gap-4 text-[13px]">
      <span className="text-[#13294B]">{resultCount} Results</span>
      <span className="text-[#D1D5DB]">|</span>
      <button className="text-[#1A5FA8] hover:underline cursor-not-allowed">
        Clear All Filters (1)
      </button>

      <div className="ml-auto flex items-center gap-5">
        <label className="inline-flex items-center gap-2 text-[#13294B]">
          <input type="checkbox" className="w-3.5 h-3.5 accent-[#1A5FA8]" />
          Orders Entered Today
        </label>
        <label className="inline-flex items-center gap-2 text-[#13294B]">
          <input type="checkbox" className="w-3.5 h-3.5 accent-[#1A5FA8]" />
          Only my Orders
        </label>
        <span className="text-[#D1D5DB]">|</span>
        <button className="inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-not-allowed">
          <FileSpreadsheet className="w-4 h-4" /> Export to Excel
        </button>
        <span className="text-[#D1D5DB]">|</span>
        <button className="inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-not-allowed">
          <Settings className="w-4 h-4" /> Columns
        </button>
      </div>
    </div>
  );
}

// ---------- Grid ----------
function OrdersGrid({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto border-t border-[#E3E6EA]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-[#1A5FA8] border-b border-[#E3E6EA] bg-white">
            <th className="w-10 px-2 py-2">
              <input type="checkbox" className="accent-[#1A5FA8]" />
            </th>
            <th className="w-8 px-1 py-2" />
            <ColHeader label="Symbol" />
            <ColHeader label="Description" />
            <ColHeader label="Action" />
            <ColHeader label="Trade Qty" align="right" />
            <ColHeader label="Qty Type" />
            <ColHeader label="Price Type" />
            <ColHeader label="Limit Amount ($)" align="right" />
            <ColHeader label="TIF" />
            <ColHeader label="Order Status" />
            <ColHeader label="Asset Type" />
            <ColHeader label="Sponsor" />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="border-b border-[#F0F2F5] hover:bg-[#F7F9FC]"
            >
              <td className="px-2 py-2">
                <input type="checkbox" className="accent-[#1A5FA8]" />
              </td>
              <td className="px-1 py-2 text-[#6b7280]">
                <button aria-label="Row actions" className="hover:text-[#13294B]">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
              <td className="px-3 py-2">
                <span className="inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-not-allowed font-medium">
                  {o.symbol}
                  <ChevronDown className="w-3 h-3" />
                </span>
              </td>
              <td className="px-3 py-2 text-[#13294B]">{o.description}</td>
              <td className="px-3 py-2">
                <span
                  className={
                    o.action === "Buy"
                      ? "text-[#1D9E75] font-medium"
                      : "text-[#D64545] font-medium"
                  }
                >
                  {o.action}
                </span>
              </td>
              <td className="px-3 py-2 text-right text-[#13294B] tabular-nums">
                {o.tradeQty}
              </td>
              <td className="px-3 py-2 text-[#13294B]">{o.qtyType}</td>
              <td className="px-3 py-2 text-[#13294B]">{o.priceType}</td>
              <td className="px-3 py-2 text-right text-[#13294B] tabular-nums">
                {o.limitAmount === null ? "--" : o.limitAmount.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-[#13294B]">{o.tif}</td>
              <td className="px-3 py-2">
                <StatusChip status={o.status} />
              </td>
              <td className="px-3 py-2 text-[#13294B]">{o.assetType}</td>
              <td className="px-3 py-2 text-[#13294B]">{o.sponsor}</td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td
                colSpan={13}
                className="px-3 py-8 text-center text-[13px] text-[#6b7280]"
              >
                No orders match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ColHeader({
  label,
  align = "left",
}: {
  label: string;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`font-semibold py-2 px-3 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <span
        className={`inline-flex items-center gap-1 ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        {label}
        <Filter className="w-3 h-3 text-[#1A5FA8]/70" />
      </span>
    </th>
  );
}

// ---------- Status Chip (reusable, keyed off status value) ----------
const STATUS_STYLES: Record<OrderStatus, string> = {
  "Trade Desk": "bg-[#E3E6EA] text-[#13294B] border-[#D1D5DB]",
  Pending: "bg-[#FFF3B0] text-[#7A5C00] border-[#F0DA7A]",
  "Open/Executed": "bg-[#D6F1E3] text-[#1D6B4F] border-[#A7DCBF]",
  Rejected: "bg-[#FBD9D9] text-[#9B1C1C] border-[#F4B3B3]",
  Cancelled: "bg-[#E3E6EA] text-[#6b7280] border-[#D1D5DB]",
  Saved: "bg-[#DCE7F5] text-[#13294B] border-[#B7CDE8]",
};

function StatusChip({ status }: { status: OrderStatus }) {
  const cls =
    STATUS_STYLES[status] ?? "bg-[#E3E6EA] text-[#13294B] border-[#D1D5DB]";
  return (
    <span
      className={`inline-block text-[11px] font-medium border rounded px-2 py-0.5 cursor-not-allowed ${cls}`}
    >
      {status}
    </span>
  );
}
