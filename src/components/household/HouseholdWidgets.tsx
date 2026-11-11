import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  GripVertical,
  MoreVertical,
  Minus,
  ChevronDown,
  Star,
  Plus,
  AlertTriangle,
  Check,
  Pin,
  FileText,
  Paperclip,
  Calendar as CalendarIcon,
  ClipboardCheck,
  GitBranch,
  Pencil,
  MapPin,
} from "lucide-react";
import { formatCurrency } from "@/data/householdData";
import type { SchwabAccount } from "@/data/sweetsOverview";
import type { TwrRow, HouseholdMember } from "@/data/householdGenerator";
import { PEOPLE as SWEETS_PEOPLE, type Person } from "@/data/sweetsContacts";
import { useWedgeProducts } from "@/lib/demoConfig";
import { useClientPortalOnly } from "@/lib/dashboardState";
import type { HouseholdWidgetId } from "@/lib/householdDashboardState";

// ============ Context ============

export type HouseholdCtx = {
  id: string;
  name: string;
  members: HouseholdMember[];
  accounts: SchwabAccount[];
  twrRows: TwrRow[];
  isSweets: boolean;
};

const HouseholdDataContext = createContext<HouseholdCtx | null>(null);

export function HouseholdDataProvider({
  value,
  children,
}: {
  value: HouseholdCtx;
  children: ReactNode;
}) {
  return (
    <HouseholdDataContext.Provider value={value}>
      {children}
    </HouseholdDataContext.Provider>
  );
}

function useHousehold(): HouseholdCtx {
  const v = useContext(HouseholdDataContext);
  if (!v) throw new Error("HouseholdDataProvider missing");
  return v;
}

// ============ Shell ============

export function HouseholdWidgetShell({
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
        <h3 className="flex-1 text-[16px] font-semibold text-[#13294B] truncate">
          {title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-[#6b7280] hover:text-[#13294B] p-1"
            aria-label="Widget menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#E3E6EA] rounded-[2px] shadow-md min-w-[140px] py-1 text-[13px]">
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F0F2F5] text-[#13294B]"
                  onClick={() => { onMoveUp(); setMenuOpen(false); }}
                >
                  Move up
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F0F2F5] text-[#13294B]"
                  onClick={() => { onMoveDown(); setMenuOpen(false); }}
                >
                  Move down
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F0F2F5] text-[#D64545]"
                  onClick={() => { onRemove(); setMenuOpen(false); }}
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

// ============ Balances ============

const GROUP_ORDER: SchwabAccount["group"][] = [
  "Individual",
  "Joint",
  "Retirement",
  "Trust",
  "Closed",
];

const GROUP_LABEL: Record<SchwabAccount["group"], string> = {
  Individual: "Individual",
  Joint: "Joint",
  Retirement: "Retirement",
  Trust: "Trust",
  Closed: "Closed Accounts",
};

function BalancesWidget() {
  const { accounts } = useHousehold();
  const grouped = useMemo(() => {
    const map = new Map<SchwabAccount["group"], SchwabAccount[]>();
    for (const g of GROUP_ORDER) map.set(g, []);
    for (const a of accounts) map.get(a.group)!.push(a);
    return map;
  }, [accounts]);

  const openAccounts = accounts.filter((a) => !a.closed);
  const accountsSubtotal = openAccounts.reduce((s, a) => s + a.value, 0);
  const totalCash = openAccounts.reduce((s, a) => s + a.cash, 0);
  const totalNetWorth = accounts.reduce((s, a) => s + a.value, 0);

  return (
    <>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between pb-3">
          <span className="text-[16px] font-semibold text-[#13294B]">Total Net Worth</span>
          <span className="text-[18px] font-semibold text-[#13294B]">
            {formatCurrency(totalNetWorth, { decimals: 2 })}
          </span>
        </div>
      </div>
      <div className="px-4 pb-1">
        <div className="flex items-center justify-between py-2 border-t border-b border-[#E3E6EA]">
          <button className="flex items-center gap-2 text-[#1A5FA8] text-[15px] font-semibold">
            <span className="w-4 h-4 border border-[#1A5FA8] rounded-sm flex items-center justify-center">
              <Minus className="w-3 h-3" strokeWidth={2} />
            </span>
            Accounts
          </button>
          <span className="text-[14px] font-semibold text-[#13294B]">
            {formatCurrency(accountsSubtotal, { decimals: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-[13px]">
          <span className="text-[#13294B]">
            Total Cash: {formatCurrency(totalCash, { decimals: 2 })}
          </span>
          <span className="text-[#1D9E75]">{formatCurrency(totalCash, { decimals: 2 })}</span>
        </div>
      </div>
      <div className="pb-2">
        {GROUP_ORDER.map((g) => {
          const accts = grouped.get(g)!;
          if (!accts.length) return null;
          const subtotal = accts.reduce((s, a) => s + a.value, 0);
          const showSubtotal = g !== "Individual" && g !== "Joint";
          return (
            <div key={g}>
              <div className="flex items-center justify-between bg-[#EFF1F3] px-4 py-1.5 text-[13px] text-[#13294B]">
                <span>
                  {GROUP_LABEL[g]}
                  {showSubtotal && `: ${formatCurrency(subtotal, { decimals: 2 })}`}
                </span>
              </div>
              {accts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between px-4 py-2 border-b border-[#F0F2F5]"
                >
                  <button className="flex items-start gap-1 text-left text-[13px] text-[#1A5FA8] hover:underline">
                    <span>{a.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 mt-1 shrink-0" />
                  </button>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13px] font-semibold text-[#13294B]">
                      {formatCurrency(a.value, { decimals: 2 })}
                    </div>
                    {!a.closed ? (
                      <div className="text-[12px] text-[#1D9E75]">
                        Cash: {formatCurrency(a.cash, { decimals: 2 })}
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#9097A2]">—</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============ Portfolio Performance ============

const IRR_BENCH = [
  "FTSE NON-USD WGBI (USD)",
  "BOFA MERRILL LYNCH US CORPORATE (1-3 YR)",
  "DOW JONES UTILITIES",
];

function PortfolioPerformanceWidget() {
  const { accounts, twrRows } = useHousehold();
  return (
    <>
      <div className="px-4 pt-4">
        <h4 className="text-[14px] font-medium text-[#13294B] mb-3">
          Time Weighted Return (TWR)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[480px]">
            <thead>
              <tr className="text-[11px] text-[#6b7280] uppercase tracking-wide">
                <th className="text-left font-medium pb-2"></th>
                <th className="text-right font-medium pb-2">Portfolio</th>
                {IRR_BENCH.map((b) => (
                  <th key={b} className="text-right font-medium pb-2">{b}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {twrRows.map((r) => (
                <tr key={r.period} className="border-t border-[#F0F2F5]">
                  <td className="py-1.5 text-[#13294B]">{r.period}</td>
                  <td className="py-1.5 text-right text-[#13294B]">
                    {r.portfolio.toFixed(2)}
                  </td>
                  {r.b.map((v, i) => (
                    <td key={i} className="py-1.5 text-right text-[#13294B]">
                      {v.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-4 pt-5 pb-4">
        <h4 className="text-[14px] font-medium text-[#13294B] mb-3">
          Internal Rate of Return (IRR)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[520px]">
            <thead>
              <tr className="text-[11px] text-[#6b7280] uppercase tracking-wide">
                <th className="text-left font-medium pb-2">Account</th>
                <th className="text-left font-medium pb-2">Since</th>
                <th className="text-right font-medium pb-2">Portfolio</th>
                {IRR_BENCH.map((b) => (
                  <th key={b} className="text-right font-medium pb-2">{b}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-[#F0F2F5]">
                  <td className="py-1.5 text-[#13294B]">{a.number}</td>
                  <td className="py-1.5 text-[#13294B]">{a.irr.since}</td>
                  <td className="py-1.5 text-right text-[#13294B]">
                    {a.irr.portfolio.toFixed(2)}
                  </td>
                  <td className="py-1.5 text-right text-[#13294B]">0.00</td>
                  <td className="py-1.5 text-right text-[#13294B]">0.00</td>
                  <td className="py-1.5 text-right text-[#13294B]">0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ============ People in Household ============

function toPersonRow(m: HouseholdMember, i: number): Person {
  const first = m.name.split(" ")[0];
  return {
    name: m.name,
    nickname: first,
    relationship: i === 0 ? "Head of Household" : i === 1 ? "Spouse" : "Dependent",
    dob: "—",
    age: "",
    ssn: "—",
    email: `${first.toLowerCase()}@example.com`,
    emailLabel: "Personal",
    emailPrimary: i === 0,
    home: "—",
    mobile: "—",
  };
}

function PeopleInHouseholdWidget() {
  const hh = useHousehold();
  const people: Person[] = hh.isSweets
    ? SWEETS_PEOPLE
    : hh.members.map(toPersonRow);
  return (
    <div>
      <div className="px-4 pt-3 flex justify-end">
        <button className="flex items-center gap-1 text-[#1A5FA8] text-[13px] font-medium hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add Person
        </button>
      </div>
      <div className="px-4 pt-3 pb-2 divide-y divide-[#F0F2F5]">
        {people.map((p) => (
          <div key={p.name} className="py-3 grid grid-cols-3 gap-4 text-[13px]">
            <div className="min-w-0">
              <div className="text-[#1A5FA8] font-semibold truncate">{p.name}</div>
              {p.nickname && (
                <div className="text-[#13294B]">
                  <span className="font-semibold">{p.nickname}</span>
                  {p.relationship && p.relationship !== "—" && (
                    <span> - {p.relationship}</span>
                  )}
                </div>
              )}
              {p.home && (
                <div className="mt-1.5">
                  <div className="text-[#1D9E75] font-medium flex items-center gap-1">
                    Home <Star className="w-3 h-3 fill-current" />
                  </div>
                  <div className="text-[#13294B]">{p.home}</div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              {p.ssn && p.ssn !== "—" && (
                <div className="text-[#13294B]">
                  <span className="font-semibold">SSN:</span> {p.ssn}
                </div>
              )}
              {p.dob && p.dob !== "—" && (
                <div className="text-[#13294B]">
                  <span className="font-semibold">DOB:</span> {p.dob}
                  {p.age !== "" && ` (${p.age})`}
                </div>
              )}
              {p.mobile && (
                <div className="mt-1.5">
                  <div className="text-[#13294B] font-medium">Mobile</div>
                  <div className="text-[#13294B]">{p.mobile}</div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              {p.email ? (
                <>
                  <div className="text-[#13294B] font-medium flex items-center gap-1">
                    Email {p.emailPrimary && <Star className="w-3 h-3 fill-[#1D9E75] text-[#1D9E75]" />}
                  </div>
                  <div className="text-[#1A5FA8] truncate">{p.email}</div>
                </>
              ) : (
                <>
                  <div className="text-[#13294B] font-medium">Email</div>
                  <div className="text-[#6b7280]">--</div>
                </>
              )}
              <div className="mt-1.5">
                <div className="text-[#13294B] font-medium">Work</div>
                <div className="text-[#6b7280]">--</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-[#E3E6EA] text-right">
        <button className="text-[#1A5FA8] text-[13px] font-medium hover:underline">
          View All People
        </button>
      </div>
    </div>
  );
}

// ============ Active CRM Workflows ============

function ActiveCrmWorkflowsWidget() {
  const hh = useHousehold();
  const surname = hh.members[0]?.name.split(" ").slice(-1)[0] ?? "Family";
  const rows = [
    {
      title: `Brokerage New Business for the ${surname.toUpperCase()}`,
      progress: "(2 out of 15 completed)",
      due: "06/02/2026",
      owner: "Reva Rudy",
      overdue: true,
    },
    {
      title: `Review meeting for the ${surname.toLowerCase()}`,
      progress: "(5 out of 10 completed)",
      due: "07/01/2026",
      owner: "Alannah Winder",
      overdue: true,
    },
  ];
  return (
    <div>
      <div className="px-4 pt-3">
        <div className="grid grid-cols-[1fr_120px_120px] gap-3 text-[11px] text-[#6b7280] uppercase tracking-wide pb-2">
          <div />
          <div>Activity Due</div>
          <div>Owner</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.title}
            className="grid grid-cols-[1fr_120px_120px] gap-3 py-3 border-t border-[#F0F2F5] text-[13px] items-start"
          >
            <div className="min-w-0">
              <div className="text-[#1A5FA8] font-medium">{r.title}</div>
              <div className="text-[#6b7280] italic text-[12px] mt-1">
                {r.progress}
              </div>
            </div>
            <div className="text-[#13294B] flex items-center gap-1.5">
              {r.due}
              {r.overdue && <AlertTriangle className="w-4 h-4 text-[#E8A317] fill-[#FDF3D6]" />}
            </div>
            <div className="text-[#13294B]">{r.owner}</div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-[#E3E6EA] text-center">
        <button className="text-[#1A5FA8] text-[13px] font-medium hover:underline">
          View All CRM Workflows
        </button>
      </div>
    </div>
  );
}

// ============ Recent CRM Activity ============

function RecentCrmActivityWidget() {
  const hh = useHousehold();
  const surname = hh.members[0]?.name.split(" ").slice(-1)[0] ?? "Family";
  const portalOnly = useClientPortalOnly();
  const rows = portalOnly
    ? [
        {
          icons: [Pin, FileText],
          subject: `Investor360° Message: ${surname} Family document shared`,
          date: "06/30/2026",
          done: true,
          overdue: false,
        },
        {
          icons: [Pin, Paperclip],
          subject: `Investor360° Message: ${surname} Family portfolio update`,
          date: "07/06/2026",
          done: false,
          overdue: true,
        },
      ]
    : [
        {
          icons: [Pin, FileText, Paperclip],
          subject: `AI Generated Note: Annual Review for the ${surname} Family`,
          date: "06/30/2026",
          done: true,
          overdue: false,
        },
        {
          icons: [Pin, CalendarIcon],
          subject: `Annual Review with ${surname} Family`,
          date: "07/06/2026",
          done: false,
          overdue: true,
        },
        {
          icons: [Pin, ClipboardCheck, GitBranch],
          subject: "Send follow up to client (within 72 hours)",
          date: "07/06/2026",
          done: false,
          overdue: true,
        },
      ];
  return (
    <div>
      <div className="px-4 pt-3 flex justify-end">
        <button className="flex items-center gap-1 text-[#1A5FA8] text-[13px] font-medium hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add Activity
        </button>
      </div>
      <div className="px-4 pt-2">
        <div className="grid grid-cols-[80px_1fr_100px_60px] gap-3 text-[11px] text-[#6b7280] uppercase tracking-wide pb-2">
          <div>Subject</div>
          <div />
          <div>Date</div>
          <div className="text-right">Status</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.subject}
            className="grid grid-cols-[80px_1fr_100px_60px] gap-3 py-3 border-t border-[#F0F2F5] text-[13px] items-start"
          >
            <div className="flex items-center gap-1 text-[#6b7280]">
              {r.icons.map((Icon, i) => (
                <Icon key={i} className="w-3.5 h-3.5" />
              ))}
            </div>
            <div className="text-[#1A5FA8] font-medium">{r.subject}</div>
            <div className="text-[#13294B] flex items-center gap-1.5">
              {r.date}
              {r.overdue && <AlertTriangle className="w-4 h-4 text-[#E8A317] fill-[#FDF3D6]" />}
            </div>
            <div className="flex justify-end">
              {r.done ? (
                <span className="w-5 h-5 rounded-full bg-[#1D9E75] inline-flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border border-[#B5BAC2]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Household Summary ============

function HouseholdSummaryWidget() {
  const hh = useHousehold();
  const wedge = useWedgeProducts();
  const isDigitalOnboardingOnly = !!wedge.state["Digital Onboarding"] && !wedge.state["CRM+"];
  const first = hh.members[0]?.name.split(" ")[0] ?? "Client";
  const spouseFirst = hh.members[1]?.name.split(" ")[0];
  const surname = hh.members[0]?.name.split(" ").slice(-1)[0] ?? "Family";
  const titleCase = (s: string) =>
    s
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  const displayName = hh.name
    ? titleCase(hh.name)
    : spouseFirst
      ? `${first} and ${spouseFirst} ${surname}`
      : `${first} ${surname}`;
  const initials = `${first[0] ?? ""}${spouseFirst?.[0] ?? ""}`;

  return (
    <div className="px-4 pt-4 pb-4 text-[13px]">
      <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
        <div className="w-[92px] h-[92px] rounded-full bg-[#B5BAC2] flex items-center justify-center text-white text-[22px] font-semibold">
          {initials || "H"}
        </div>
        <div className="min-w-0">
          <div className="text-[#1A5FA8] font-semibold text-[15px] leading-snug">
            {displayName}
          </div>
          <div className="text-[#13294B] mt-1.5">
            Assigned To <span className="text-[#13294B]">Reva Rudy</span>
          </div>
          <div className="text-[#13294B]">
            Advisor ID <span className="text-[#13294B]">620959</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#13294B] font-medium">Start Date</div>
          <div className="text-[#13294B]">04/01/2020</div>
        </div>
      </div>

      <div className="mt-4 bg-[#FEF6D8] border-l-4 border-[#E8A317] px-3 py-2 flex items-start justify-between gap-2">
        <p className="italic text-[#13294B]">
          {hh.isSweets
            ? "Karen's mom is sick, and she's been the primary caretaker."
            : `${first} recently mentioned planning for a major life event — follow up next quarter.`}
        </p>
        <button className="text-[#6b7280] hover:text-[#13294B] shrink-0" aria-label="Edit note">
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <div className="text-[#1D9E75] font-medium flex items-center gap-1">
            Phone - {first}'s Home <Star className="w-3 h-3 fill-current" />
          </div>
          <div className="text-[#13294B]">
            {hh.isSweets ? "(382) 444-8054" : "(555) 010-4400"}
          </div>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">E-Mail - {first}'s Personal</div>
          <div className="text-[#1A5FA8] truncate">
            {hh.isSweets
              ? "rsweets@eml.com"
              : `${first.toLowerCase()}@example.com`}
          </div>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">Address -</div>
          <div className="text-[#13294B]">
            321 SE Bay Oak Ave
            <br />
            Pensacola, NH 098765
          </div>
          <button className="text-[#1A5FA8] hover:underline mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Google Maps
          </button>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">Salutation</div>
          <div className="text-[#13294B]">Dear {displayName}</div>
          <div className="text-[#13294B]">--</div>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">Category</div>
          <div className="text-[#13294B]">--</div>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">Type</div>
          <div className="text-[#13294B]">Client</div>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">Last Review</div>
          <div className="text-[#13294B]">--</div>
        </div>
        <div>
          <div className="text-[#13294B] font-medium">Last Touch Point</div>
          <div className="text-[#13294B]">--</div>
        </div>
        {!isDigitalOnboardingOnly && (
          <div className="col-span-2">
            <div className="text-[#13294B] font-medium">Opportunity(ies)</div>
            <div className="text-[#13294B]">--</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Registry ============

export const HOUSEHOLD_WIDGET_RENDERERS: Record<
  HouseholdWidgetId,
  () => ReactNode
> = {
  balances: BalancesWidget,
  portfolioPerformance: PortfolioPerformanceWidget,
  peopleInHousehold: PeopleInHouseholdWidget,
  activeCrmWorkflows: ActiveCrmWorkflowsWidget,
  recentCrmActivity: RecentCrmActivityWidget,
  householdSummary: HouseholdSummaryWidget,
};
