import { Fragment, useState, useRef, type ReactNode } from "react";
import {
  GripVertical,
  Link2,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Info,
  Search,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  Cake,
  Heart,
  Check,
  CheckCircle2,
  Circle,

  Users,
  Workflow,
} from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import { useClientPortalOnly, type WidgetId } from "@/lib/dashboardState";
import { useCurrentUser } from "@/lib/currentUser";
import { formatCurrency } from "@/data/householdData";
import { useOpenHousehold } from "@/lib/recentHouseholds";
import {
  practiceStatistics,
  businessSnapshotData,
  assetsData,
  favoriteReports,
  lastHouseholds,
  sweetsHouseholdDetail,
  
  notificationsData,
  clientActivityData,
  dayAtAGlanceData,
  financialCalculatorGroups,
  insuranceData,
} from "@/data/dashboardData";
import { getMockMeetingData } from "@/meeting-iq/data/mockMeetingData";
import {
  DAG_APPOINTMENTS,
  DAG_TODOS,
  DAG_LIFE_EVENTS,
} from "@/data/dayAtAGlance";

function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <span className="w-4 h-4 shrink-0 mt-0.5 rounded-full bg-[#1D9E75] flex items-center justify-center">
      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
    </span>
  ) : (
    <span className="w-4 h-4 shrink-0 mt-0.5 rounded-full bg-white border border-[#9097A2]" />
  );
}


import clientActivitySprite from "@/assets/widgets/client-activity-sprite.png.asset.json";



// ============ Card chrome ============

export function WidgetShell({
  title,
  collapsed,
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: string;
  collapsed: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <section className="bg-white border border-[#E3E6EA] rounded-[2px]">
      <header className="flex items-center px-3 py-2.5 border-b border-[#E3E6EA] relative">
        <button
          onClick={onMoveUp}
          className="text-[#B5BAC2] hover:text-[#13294B] mr-1.5 cursor-grab"
          title="Move up"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <h3 className="flex-1 text-[15px] font-semibold text-[#13294B] truncate">
          {title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-[#6b7280] hover:text-[#13294B] p-1"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#E3E6EA] rounded-[2px] shadow-md min-w-[140px] py-1 text-[14px]">
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F0F2F5] text-[#13294B]"
                  onClick={() => {
                    onMoveUp();
                    setMenuOpen(false);
                  }}
                >
                  Move up
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F0F2F5] text-[#13294B]"
                  onClick={() => {
                    onMoveDown();
                    setMenuOpen(false);
                  }}
                >
                  Move down
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F0F2F5] text-[#D64545]"
                  onClick={() => {
                    onRemove();
                    setMenuOpen(false);
                  }}
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </header>
      {!collapsed && <div>{children}</div>}
    </section>
  );
}

function SelectBox({ value, placeholder }: { value?: string; placeholder?: string }) {
  return (
    <div className="flex items-center justify-between border border-[#D1D5DB] bg-white rounded-sm px-2.5 py-2 text-[14px] text-[#6b7280] cursor-pointer">
      <span>{value ?? placeholder}</span>
      <ChevronDown className="w-3.5 h-3.5 text-[#6b7280]" />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
  indent,
}: {
  label: string;
  value: ReactNode;
  bold?: boolean;
  highlight?: boolean;
  indent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 text-[14px]">
      <span
        className={`${highlight ? "text-[#1A5FA8]" : "text-[#13294B]"} ${indent ? "pl-4" : ""}`}
      >
        {label}
      </span>
      <span className={`text-[#13294B] ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

// ============ Widgets ============

function StatisticsWidget() {
  const s = practiceStatistics;
  const fc = (n: number) => formatCurrency(n, { decimals: 2 });
  return (
    <>
      <div className="px-4 pt-3 pb-2">
        <div className="text-[14px] text-[#13294B] mb-1">Rep ID:</div>
        <SelectBox value={s.repId} />
      </div>
      <div className="py-1">
        <Row label="Number of Households" value={s.numberOfHouseholds} />
        <Row label="Average Household Balance" value={fc(s.averageHouseholdBalance)} />
        <Row label="Schwab Balances" value={fc(s.schwabBalances)} />
        <Row label="Non-Schwab Balances" value={fc(s.nonSchwabBalances)} />
        <Row label="Total Assets" value={fc(s.totalAssets)} bold />
        <Row label="Average Account Balance" value={fc(s.averageAccountBalance)} />
        <Row label="Total Fee Based Balance" value={fc(s.totalFeeBasedBalance)} />
        <Row label="Core Money Balance" value={fc(s.coreMoneyBalance)} />
        <Row label="Number of Accounts" value={s.numberOfAccounts} highlight />
        <Row label="Non Retirement" value={s.nonRetirement} indent />
        <Row label="Retirement" value={s.retirement} indent />
      </div>
    </>
  );
}

function BusinessSnapshotWidget() {
  const user = useCurrentUser();
  const b = businessSnapshotData;
  const fc = (n: number) => formatCurrency(n, { decimals: 0 });
  return (
    <div className="px-4 py-3">
      <div className="text-[14px] text-[#13294B] mb-1">Advisor's Name</div>
      <div className="text-[15px] font-semibold text-[#13294B] mb-3">
        {user.displayName}
      </div>
      <div className="text-[14px] text-[#13294B] mb-1">Filter by Advisor IDs</div>
      <SelectBox value={user.fullName} />

      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div>
          <div className="text-[14px] uppercase text-[#6b7280]">Trades</div>
          <div className="text-[18px] font-semibold text-[#13294B]">{b.trades}</div>
        </div>
        <div>
          <div className="text-[14px] uppercase text-[#6b7280]">Cash Available</div>
          <div className="text-[18px] font-semibold text-[#13294B]">{fc(b.cashAvailable)}</div>
        </div>
        <div>
          <div className="text-[14px] uppercase text-[#6b7280]">Total Assets</div>
          <div className="text-[18px] font-semibold text-[#13294B]">{fc(b.totalAssets)}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[14px] font-semibold text-[#13294B] mb-2">Asset Breakdown</div>
        <Row label="Fee Based Assets" value={fc(b.assetBreakdown.feeBased)} />
        <Row label="Schwab Non-Fee Based Assets" value={fc(b.assetBreakdown.schwabNonFeeBased)} />
        <Row label="Non-Schwab" value={fc(b.assetBreakdown.nonSchwab)} />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[14px] font-semibold text-[#13294B]">
            Business Goals
          </div>
          <button className="text-[14px] text-[#1A5FA8] hover:underline">
            Edit Goals
          </button>
        </div>
        <div className="text-[14px] text-[#6b7280] mb-2">As of {b.goalsAsOf}</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {b.legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-[14px] text-[#13294B]">
              <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          {b.bars.map((bar) => (
            <div key={bar.label}>
              <div className="text-[14px] text-[#13294B] mb-1">{bar.label}</div>
              <div className="relative h-3 bg-[#F0F2F5] rounded-sm overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${Math.min(100, bar.progress)}%`, background: "#7FD0B5" }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#13294B]"
                  style={{ left: `${bar.realistic}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#1D9E75]"
                  style={{ left: `${bar.stretch}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssetsWidget() {
  const a = assetsData;
  const fc = (n: number) => formatCurrency(n, { decimals: 2 });
  return (
    <div className="py-2">
      <Row label="Schwab Balance" value={fc(a.schwabBalance)} />
      <Row label="Non-Schwab Balance" value={fc(a.nonSchwabBalance)} />
      <Row label="Fee Based Balance" value={fc(a.feeBasedBalance)} />
      <Row label="Non-Fee Based Balance" value={fc(a.nonFeeBasedBalance)} />
      <Row label="Total Assets" value={fc(a.totalAssets)} bold />
      <Row label="Core Money Balance" value={fc(a.coreMoneyBalance)} />
    </div>
  );
}

function FavoriteReportsWidget() {
  return (
    <div>
      <ul>
        {favoriteReports.map((r) => (
          <li
            key={r}
            className="flex items-center justify-between px-4 py-2 text-[14px] border-b border-[#F0F2F5]"
          >
            <span className="text-[#13294B]">{r}</span>
            <button className="text-[14px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 border border-primary px-4 py-1 rounded-[2px]">
              Run
            </button>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2 text-right border-t border-[#E3E6EA]">
        <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">
          View Reports
        </a>
      </div>
    </div>
  );
}

function LastHouseholdsViewedWidget() {
  const openHousehold = useOpenHousehold();
  const user = useCurrentUser();
  const [selectedId, setSelectedId] = useState("sweets");
  const detail = sweetsHouseholdDetail;
  return (
    <div className="px-4 py-3">
      <div className="text-[14px] text-[#13294B] mb-3">
        View Last:
        <a className="text-[#1A5FA8] hover:underline cursor-pointer ml-1">10</a>
        <span className="mx-2 text-[#B5BAC2]">|</span>
        <a className="text-[#1A5FA8] hover:underline cursor-pointer">25</a>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-1 text-[14px]">
          {lastHouseholds.map((h) => {
            const active = h.id === selectedId;
            return (
              <li key={h.id}>
                <button
                  onClick={() => {
                    setSelectedId(h.id);
                    if (h.id !== "sweets") openHousehold({ id: h.id, name: h.name });
                  }}
                  className={`w-full text-left px-2 py-1 font-semibold truncate ${
                    active
                      ? "bg-[#EAF2FA] text-[#13294B]"
                      : "text-[#1A5FA8] hover:underline"
                  }`}
                  style={
                    active
                      ? {
                          clipPath:
                            "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                        }
                      : undefined
                  }
                >
                  {h.name}
                </button>
              </li>
            );
          })}
        </ul>
        <div>
          <div className="text-[14px] text-[#6b7280]">Formal Name</div>
          <button
            onClick={() => openHousehold({ id: detail.id, name: detail.name })}
            className="text-[14px] text-[#1A5FA8] font-semibold hover:underline text-left"
          >
            {detail.formalName}
          </button>
          <div className="flex items-center gap-3 mt-1">
            <Phone className="w-4 h-4 text-[#1A5FA8]" />
            <Mail className="w-4 h-4 text-[#1A5FA8]" />
          </div>
          <div className="mt-2 bg-[#FFF6CC] border-l-2 border-[#E5C53B] text-[#5C4A05] text-[14px] px-2 py-1.5">
            {detail.note}
          </div>
          <div className="mt-2 text-[14px] text-[#6b7280]">Household Assigned To</div>
          <div className="text-[14px] text-[#13294B]">{user.displayName}</div>
          <div className="mt-2 text-[14px] text-[#6b7280]">People</div>
          {detail.people.map((p) => (
            <button
              key={p.name}
              onClick={() => openHousehold({ id: detail.id, name: detail.name })}
              className="block text-[14px] text-[#1A5FA8] hover:underline text-left"
            >
              {p.short}
            </button>
          ))}
          <a className="mt-1 text-[14px] text-[#1A5FA8] hover:underline flex items-center gap-1 cursor-pointer">
            <ChevronRight className="w-3 h-3" /> View All Contacts
          </a>
          <div className="mt-2 text-[14px] text-[#6b7280]">Accounts</div>
          {detail.accounts.map((a) => (
            <button
              key={a}
              onClick={() => openHousehold({ id: detail.id, name: detail.name })}
              className="block text-[14px] text-[#1A5FA8] hover:underline truncate text-left max-w-full"
            >
              {a}
            </button>
          ))}
          <a className="mt-1 text-[14px] text-[#1A5FA8] hover:underline flex items-center gap-1 cursor-pointer">
            <ChevronRight className="w-3 h-3" /> View All Accounts
          </a>
        </div>
      </div>

    </div>
  );
}

type PopularApp = { label: string; to?: string };

const POPULAR_APPS: PopularApp[] = [
  { label: "Account Opening Dashboard", to: "/account-opening" },
  { label: "Bulk Onboarding", to: "/operations/bulk-onboarding" },
  { label: "Create a Household" },
];

function PopularApplicationsWidget() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PopularApp[]>(POPULAR_APPS);
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDrop = (target: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    setOverIndex(null);
    if (from === null || from === target) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  return (
    <ul className="py-1 max-h-[360px] overflow-y-auto">
      {items.map((a, i) => (
        <li
          key={a.label}
          draggable
          onDragStart={() => {
            dragIndex.current = i;
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDragLeave={() => setOverIndex((v) => (v === i ? null : v))}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(i);
          }}
          onDragEnd={() => {
            dragIndex.current = null;
            setOverIndex(null);
          }}
          className={`group flex items-center gap-3 px-4 py-2.5 text-[14px] border-b border-[#E3E6EA] last:border-b-0 cursor-grab active:cursor-grabbing ${
            overIndex === i ? "bg-[#EAF2FA]" : "hover:bg-[#F7F8FA]"
          }`}
        >
          <GripVertical className="w-4 h-4 text-[#B9BEC7] shrink-0" />
          <Link2 className="w-4 h-4 text-[#1A5FA8] shrink-0" />
          {a.to ? (
            <button
              onClick={() => navigate({ to: a.to })}
              className="text-[#1A5FA8] hover:underline truncate text-left"
            >
              {a.label}
            </button>
          ) : (
            <span className="text-[#1A5FA8] truncate cursor-default opacity-80">
              {a.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}


function NotificationsWidget() {
  const portalOnly = useClientPortalOnly();
  // Client Portal only surfaces Investor360 items under Client Management.
  const groups = portalOnly
    ? notificationsData.groups.filter((g) => g.name === "Client Management")
    : notificationsData.groups;
  const totals = portalOnly
    ? {
        unread: groups.reduce((sum, g) => sum + g.unread, 0),
        flagged: 0,
        important: 0,
        all: groups.reduce((sum, g) => sum + g.total, 0),
      }
    : notificationsData.totals;
  const n = { ...notificationsData, groups, totals };
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[14px] text-[#13294B]">Receiving For:</span>
        <div className="flex-1 max-w-[140px]">
          <SelectBox value={n.receivingFor} />
        </div>
      </div>
      <div className="grid grid-cols-4 text-center text-[14px] mb-3">
        <div>
          <div className="text-[#6b7280]">Unread</div>
          <div className="text-[15px] font-semibold text-[#1A5FA8]">
            {n.totals.unread.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[#6b7280]">Flagged</div>
          <div className="text-[15px] font-semibold text-[#D64545]">
            {n.totals.flagged}
          </div>
        </div>
        <div>
          <div className="text-[#6b7280]">Important</div>
          <div className="text-[15px] font-semibold text-[#13294B]">
            {n.totals.important}
          </div>
        </div>
        <div>
          <div className="text-[#6b7280]">All</div>
          <div className="text-[15px] font-semibold text-[#13294B]">
            {n.totals.all.toLocaleString()}
          </div>
        </div>
      </div>
      <table className="w-full text-[14px]">
        <thead>
          <tr className="text-[#6b7280] border-b border-[#E3E6EA]">
            <th className="text-left py-1.5 font-medium">Category / Type</th>
            <th className="text-right py-1.5 font-medium">Unread / Total</th>
          </tr>
        </thead>
        <tbody>
          {n.groups.map((g) => (
            <Fragment key={g.name}>
              <tr className="border-b border-[#F0F2F5]">
                <td className="py-1.5 font-semibold text-[#13294B]">{g.name}</td>
                <td className="py-1.5 text-right text-[#13294B]">
                  {g.unread.toLocaleString()} / {g.total.toLocaleString()}
                </td>
              </tr>
              {g.types.map((t) => (
                <tr key={`${g.name}-${t.name}`} className="border-b border-[#F0F2F5]">
                  <td className="py-1 pl-4 text-[#1A5FA8] hover:underline cursor-pointer">
                    {t.name}
                  </td>
                  <td className="py-1 text-right text-[#13294B]">
                    {t.unread} / {t.total}
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-3 text-[14px] text-[#6b7280]">
        <span>{n.updatedAt}</span>
        <a className="text-[#1A5FA8] hover:underline cursor-pointer">
          View All in Notification Center
        </a>
      </div>
    </div>
  );
}

function ClientActivityWidget() {
  const c = clientActivityData;
  const spriteUrl = clientActivitySprite.url;
  const portalOnly = useClientPortalOnly();
  const positions = ["0%", "33.3333%", "66.6667%", "100%"];
  const allTiles = ["Households", "People", "Activities", "Workflows"];
  // Client Portal drops the Workflows tile.
  const tiles = allTiles
    .map((label, i) => ({ label, pos: positions[i] }))
    .filter((t) => !(portalOnly && t.label === "Workflows"));
  const linkRow = (label: string, value: ReactNode) => (
    <div className="flex items-center justify-between py-1.5 text-[14px]">
      <a href="#" className="text-[#1A5FA8] hover:underline">
        {label}
      </a>
      <span className="text-[#13294B] font-semibold">{value}</span>
    </div>
  );
  return (
    <div className="px-4 py-3">
      <div
        className={`grid ${portalOnly ? "grid-cols-3" : "grid-cols-4"} gap-2 pb-3 border-b border-[#E3E6EA]`}
      >
        {tiles.map((t) => (
          <div key={t.label} className="text-center">
            <div
              className="mx-auto"
              role="img"
              aria-label={t.label}
              style={{
                width: 60,
                height: 28,
                backgroundImage: `url(${spriteUrl})`,
                backgroundSize: "400% 100%",
                backgroundPosition: `${t.pos} 50%`,
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="text-[14px] text-[#1A5FA8] mt-1">{t.label}</div>
          </div>
        ))}
      </div>


      <div className="pt-2">
        <div className="text-[14px] font-semibold text-[#13294B] mt-1">
          Unread Investor360°
        </div>
        {linkRow("Unread Messages", c.unreadInvestorMessages)}
      </div>
    </div>
  );
}

function DayAtAGlanceWidget() {
  const d = dayAtAGlanceData;
  const [tab, setTab] = useState<"appt" | "todo" | "life">("appt");

  // Reflect today's actual meetings from the Meeting IQ mock data.
  const today = new Date();
  const monthLabel = today.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const week = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(weekStart);
    dt.setDate(weekStart.getDate() + i);
    return { d: dt.getDate(), label: dayLabels[i], isToday: dt.toDateString() === today.toDateString() };
  });

  const allMeetings = getMockMeetingData();
  const todaysMeetings = allMeetings
    .filter((m: any) => {
      const md = m.date instanceof Date ? m.date : new Date(m.date);
      return md.toDateString() === today.toDateString();
    })
    .sort((a: any, b: any) => {
      const ad = a.date instanceof Date ? a.date : new Date(a.date);
      const bd = b.date instanceof Date ? b.date : new Date(b.date);
      return ad.getTime() - bd.getTime();
    });

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <button className="text-[#1A5FA8] cursor-not-allowed">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-[14px] font-semibold text-[#13294B]">{monthLabel}</div>
        <div className="flex items-center gap-2">
          <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-not-allowed">
            TODAY
          </a>
          <button className="text-[#1A5FA8] cursor-not-allowed">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-3">
        {week.map((day, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center gap-0.5 py-1 text-[14px] cursor-not-allowed text-[#13294B]"
          >
            <span className="text-[14px]">{day.label}</span>
            <span
              className={`font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                day.isToday ? "bg-[#1A5FA8] text-white" : ""
              }`}
            >
              {day.d}
            </span>
          </button>

        ))}
      </div>
      <div className="flex gap-4 border-b border-[#E3E6EA] mb-2 text-[14px]">
        <button
          onClick={() => setTab("appt")}
          className={`px-2 py-1 -mb-px cursor-pointer ${
            tab === "appt"
              ? "border-b-2 border-[#1A5FA8] text-[#1A5FA8] font-semibold"
              : "text-[#6b7280]"
          }`}
        >
          Appointments ({DAG_APPOINTMENTS.length})
        </button>
        <button
          onClick={() => setTab("todo")}
          className={`px-2 py-1 -mb-px cursor-pointer ${
            tab === "todo"
              ? "border-b-2 border-[#1A5FA8] text-[#1A5FA8] font-semibold"
              : "text-[#6b7280]"
          }`}
        >
          To Do's ({DAG_TODOS.length})
        </button>
        <button
          onClick={() => setTab("life")}
          className={`px-2 py-1 -mb-px cursor-pointer ${
            tab === "life"
              ? "border-b-2 border-[#1A5FA8] text-[#1A5FA8] font-semibold"
              : "text-[#6b7280]"
          }`}
        >
          Life Events ({DAG_LIFE_EVENTS.length})
        </button>
      </div>

      <div className="flex items-center justify-end text-[14px] uppercase text-[#6b7280] mb-1">
        {tab !== "life" && <span>Status</span>}
      </div>

      {tab === "appt" &&
        DAG_APPOINTMENTS.map((a) => (
          <div key={a.id} className="py-2 border-b border-[#E3E6EA] last:border-b-0">
            <div className="text-[14px] font-semibold text-[#13294B] uppercase mb-1">
              {a.household}
            </div>
            <div className="flex items-start gap-2 text-[14px]">
              <span className="text-[#13294B] whitespace-nowrap w-[62px]">{a.time}</span>
              <CalendarCheck className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <a className="text-[#1A5FA8] hover:underline cursor-pointer block truncate">
                  {a.subject}
                </a>
                <div className="text-[#13294B] truncate">{a.regarding}</div>
              </div>
              <StatusDot done={a.status === "complete"} />
            </div>
          </div>
        ))}

      {tab === "todo" &&
        DAG_TODOS.map((t) => (
          <div key={t.id} className="py-2 border-b border-[#E3E6EA] last:border-b-0">
            <div className="text-[14px] font-semibold text-[#13294B] uppercase mb-1">
              {t.household}
            </div>
            <div className="flex items-start gap-2 text-[14px]">
              <ClipboardCheck className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <a className="text-[#1A5FA8] hover:underline cursor-pointer block truncate">
                  {t.subject}
                </a>
                <div className="text-[#13294B] truncate">
                  {t.detail} · Due {t.due}
                </div>
              </div>
              <StatusDot done={t.status === "complete"} />
            </div>
          </div>
        ))}

      {tab === "life" &&
        DAG_LIFE_EVENTS.map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-2 py-2 text-[14px] border-b border-[#E3E6EA] last:border-b-0"
          >
            {e.kind === "Birthday" ? (
              <Cake className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" />
            ) : (
              <Heart className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <a className="text-[#1A5FA8] hover:underline cursor-pointer block truncate">
                {e.name}
              </a>
              <div className="text-[#13294B] truncate">{e.detail}</div>
            </div>
            {e.phone && <Phone className="w-4 h-4 text-[#1A5FA8] shrink-0 mt-0.5" />}
          </div>
        ))}

      <div className="mt-2">
        <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5" />
          {tab === "appt"
            ? "View Appointments in Practice360°"
            : tab === "todo"
              ? "View To Do's in Practice360°"
              : "View Life Events in Practice360°"}
        </a>
      </div>


    </div>
  );
}



function FinancialCalculatorsWidget() {
  return (
    <div className="px-4 py-3">
      {financialCalculatorGroups.map((g) => (
        <div key={g.name} className="mb-3">
          <div className="text-[14px] font-semibold text-[#13294B] mb-1">{g.name}</div>
          <ul className="space-y-0.5">
            {g.items.map((i) => (
              <li
                key={i}
                className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">
        View All Financial Calculators
      </a>
    </div>
  );
}

function InsuranceWidget() {
  const user = useCurrentUser();
  const d = insuranceData;
  const [tab, setTab] = useState<"inforce" | "pending">("inforce");
  const total = d.byType.reduce((s, t) => s + t.value, 0);
  let cumulative = 0;
  const arcs = d.byType.map((t) => {
    const start = (cumulative / total) * 360;
    cumulative += t.value;
    const end = (cumulative / total) * 360;
    return { ...t, start, end };
  });
  const gradient = arcs
    .map((a) => `${a.color} ${a.start}deg ${a.end}deg`)
    .join(", ");
  return (
    <div className="px-4 py-3">
      <div className="text-[14px] text-[#13294B] mb-1">Filter by Advisor IDs</div>
      <SelectBox value={user.fullName} />
      <div className="flex gap-1 border-b border-[#E3E6EA] mt-3 mb-3 text-[14px]">
        <button
          onClick={() => setTab("inforce")}
          className={`px-2 py-1 ${
            tab === "inforce"
              ? "border-b-2 border-[#1A5FA8] text-[#13294B] font-semibold"
              : "text-[#6b7280]"
          }`}
        >
          Inforce Policies ({d.inforce})
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`px-2 py-1 ${
            tab === "pending"
              ? "border-b-2 border-[#1A5FA8] text-[#13294B] font-semibold"
              : "text-[#6b7280]"
          }`}
        >
          Pending Policies ({d.pending})
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-full relative"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="absolute inset-3 rounded-full bg-white" />
        </div>
        <table className="flex-1 text-[14px]">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#E3E6EA]">
              <th className="text-left py-1 font-medium">Policy Type</th>
              <th className="text-right py-1 font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {d.byType.map((t) => (
              <tr key={t.name} className="border-b border-[#F0F2F5]">
                <td className="py-1 text-[#13294B] flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-sm"
                    style={{ background: t.color }}
                  />
                  {t.name}
                </td>
                <td className="py-1 text-right text-[#13294B]">{t.value}</td>
              </tr>
            ))}
            <tr>
              <td className="py-1 text-[#13294B] font-semibold">Total</td>
              <td className="py-1 text-right text-[#13294B] font-semibold">
                {d.inforce}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <div className="text-[14px] font-semibold text-[#13294B] mb-1">
          Top 10 Results
        </div>
        <div className="flex gap-3 text-[14px] border-b border-[#E3E6EA] mb-2">
          <span className="border-b-2 border-[#1A5FA8] text-[#13294B] font-semibold pb-1">
            Anniversaries
          </span>
          <span className="text-[#6b7280] pb-1">Conversions</span>
          <span className="text-[#6b7280] pb-1">Future Insurability</span>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#E3E6EA]">
              <th className="text-left py-1 font-medium">Owner</th>
              <th className="text-left py-1 font-medium">Policy</th>
              <th className="text-left py-1 font-medium">Type</th>
              <th className="text-left py-1 font-medium">Anniversary</th>
            </tr>
          </thead>
          <tbody>
            {d.anniversaries.map((a, i) => (
              <tr key={i} className="border-b border-[#F0F2F5]">
                <td className="py-1 text-[#1A5FA8]">{a.owner}</td>
                <td className="py-1 text-[#13294B]">{a.policy}</td>
                <td className="py-1 text-[#13294B]">{a.type}</td>
                <td className="py-1 text-[#13294B]">{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============ Renderer ============

export const WIDGET_RENDERERS: Record<WidgetId, () => ReactNode> = {
  statistics: StatisticsWidget,
  businessSnapshot: BusinessSnapshotWidget,
  assets: AssetsWidget,
  favoriteReports: FavoriteReportsWidget,
  lastHouseholdsViewed: LastHouseholdsViewedWidget,
  popularApplications: PopularApplicationsWidget,
  notifications: NotificationsWidget,
  clientActivity: ClientActivityWidget,
  dayAtAGlance: DayAtAGlanceWidget,
  financialCalculators: FinancialCalculatorsWidget,
  insurance: InsuranceWidget,
};
