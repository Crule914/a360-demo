import {
  createFileRoute,
  notFound,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Mail,
} from "lucide-react";
import shortcutsIcon from "@/assets/shortcuts-icon.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import {
  sweetsAccounts,
  sweetsMembers,
  twrRows as sweetsTwrRows,
  type SchwabAccount,
} from "@/data/sweetsOverview";
import { generateHousehold, type TwrRow, type HouseholdMember } from "@/data/householdGenerator";
import { getMeetingPrepClients } from "@/lib/meetingPrepClients";
import { pushRecentHousehold } from "@/lib/recentHouseholds";
import { useNavVisibility, useFilteredHouseholdTabs, useCrmReadOnly } from "@/lib/navVisibility";
import {
  HouseholdDataProvider,
  HouseholdWidgetShell,
  HOUSEHOLD_WIDGET_RENDERERS,
} from "@/components/household/HouseholdWidgets";
import {
  useHouseholdDashboardState,
  useAllowedHouseholdWidgets,
  HOUSEHOLD_WIDGET_CATALOG,
} from "@/lib/householdDashboardState";
import { ManageHouseholdDashboardPanel } from "@/components/household/ManageHouseholdDashboardPanel";


type HouseholdData = {
  id: string;
  name: string;
  members: HouseholdMember[];
  accounts: SchwabAccount[];
  twrRows: TwrRow[];
  isSweets: boolean;
};

function loadHousehold(householdId: string): HouseholdData {

  if (householdId === "sweets") {
    return {
      id: "sweets",
      name: "THE SWEETS FAMILY",
      members: sweetsMembers,
      accounts: sweetsAccounts,
      twrRows: sweetsTwrRows,
      isSweets: true,
    };
  }
  const client = getMeetingPrepClients().find((c) => c.clientId === householdId);
  if (!client) throw notFound();
  const g = generateHousehold(client.clientId, client.clientName);
  return {
    id: g.id,
    name: g.name,
    members: g.members,
    accounts: g.accounts,
    twrRows: g.twrRows,
    isSweets: false,
  };
}

export const Route = createFileRoute("/household/$householdId")({
  loader: ({ params }) => loadHousehold(params.householdId),
  component: HouseholdOverview,
  notFoundComponent: () => (
    <div className="p-6 text-sm text-[#4b5563]">Household not found.</div>
  ),
  errorComponent: ({ error }: ErrorComponentProps) => (
    <div className="p-6 text-sm text-[#b91c1c]">
      {error instanceof Error
        ? error.message
        : "Household could not be loaded."}
    </div>
  ),
});

const SWEETS_TABS = [
  { label: "Overview", caret: false, active: true },
  { label: "Trading/Holdings", caret: true, menuItems: [{ label: "Trading/Holdings", to: "/household/sweets/trading-holdings" }, { label: "Account Activity", to: "/household/sweets/account-activity" }, { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" }, { label: "Account Profile", to: "/household/sweets/account-profile" }] },
  { label: "Insurance", caret: false },
  { label: "Reports", caret: false, to: "/household/sweets/reports" },
  { label: "Documents", to: "/household/sweets/documents" },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

// Non-sweets households don't have per-route sub-pages built out yet.
const GENERIC_TABS = [
  { label: "Overview", caret: false, active: true },
  { label: "Trading/Holdings", caret: false },
  { label: "Insurance", caret: false },
  { label: "Reports", caret: false },
  { label: "Documents", caret: false },
  { label: "Contacts", caret: false },
  { label: "Planning", caret: false },
  { label: "Administration", caret: false },
];


function HouseholdOverview() {
  const data = Route.useLoaderData();
  
  const dash = useHouseholdDashboardState();
  const { allowed } = useAllowedHouseholdWidgets();
  const [panelOpen, setPanelOpen] = useState(false);

  const tabs = (data.isSweets ? SWEETS_TABS : GENERIC_TABS) as { label: string; caret?: boolean }[];
  const visibleTabs = useFilteredHouseholdTabs(tabs);


  useEffect(() => {
    pushRecentHousehold({ id: data.id, name: data.name });
  }, [data.id, data.name]);

  const titleFor = (id: string) =>
    HOUSEHOLD_WIDGET_CATALOG.find((w) => w.id === id)?.title ?? id;

  // When a wedge restricts widgets, hide any active widget outside the set and
  // seed the allowed ones the first time that wedge is enabled.
  const activeIds = allowed
    ? dash.active.filter((id) => allowed.includes(id))
    : dash.active;
  const seedKey = allowed
    ? `a360.hhWedgeSeed.${[...allowed].sort().join(",")}`
    : null;
  useEffect(() => {
    if (!allowed || !seedKey || typeof window === "undefined") return;
    if (window.localStorage.getItem(seedKey)) return;
    window.localStorage.setItem(seedKey, "1");
    dash.addWidgets(allowed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  const cols: (typeof activeIds)[] = Array.from(
    { length: dash.columns },
    () => [],
  );
  activeIds.forEach((id, i) => {
    cols[i % dash.columns].push(id);
  });


  return (
    <HouseholdDataProvider value={data}>
      <AppShell
        topBar={
          <PageHeader
            eyebrow="CLIENTS"
            title={data.name}
            titleExtra={
              <>
                <button className="text-white/90 hover:text-white" aria-label="Email">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-1.5">
                  {data.members.map((m: HouseholdMember) => (
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
            tabs={visibleTabs}
            rightActions={
              <>
                <AppLauncherDropdown />
                <button aria-label="Open" className="hover:text-white">
                  <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </>
            }
          />
        }
      >
        <Toolbar
          collapsed={dash.collapsed}
          onToggleCollapsed={() => dash.setCollapsed(!dash.collapsed)}
          onManage={() => setPanelOpen(true)}
        />
        <div className="px-6 py-5">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${dash.columns}, minmax(0, 1fr))` }}
          >
            {cols.map((colIds, ci) => (
              <div key={ci} className="flex flex-col gap-4 min-w-0">
                {colIds.map((id) => {
                  const Renderer = HOUSEHOLD_WIDGET_RENDERERS[id];
                  if (!Renderer) return null;
                  return (
                    <HouseholdWidgetShell
                      key={id}
                      title={titleFor(id)}
                      collapsed={dash.collapsed}
                      onRemove={() => dash.removeWidget(id)}
                      onMoveUp={() => dash.moveWidget(id, -1)}
                      onMoveDown={() => dash.moveWidget(id, 1)}
                    >
                      <Renderer />
                    </HouseholdWidgetShell>
                  );
                })}
              </div>
            ))}
          </div>
          {activeIds.length === 0 && (
            <div className="text-center py-12 text-[13px] text-[#6b7280]">
              No widgets on this dashboard. Click{" "}
              <button
                onClick={() => setPanelOpen(true)}
                className="text-[#1A5FA8] hover:underline"
              >
                Manage Dashboard
              </button>{" "}
              to add some.
            </div>
          )}
        </div>
        <ManageHouseholdDashboardPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </AppShell>
    </HouseholdDataProvider>
  );
}




function AppLauncherDropdown() {
  const [open, setOpen] = useState(false);
  const hideActivity = useCrmReadOnly();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleDocumentClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label="App launcher"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="hover:text-white"
      >
        <img src={shortcutsIcon.url} alt="" className="w-5 h-5 object-contain" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[270px] bg-white rounded-md shadow-lg z-50 py-2">
          <div className="absolute -top-2 right-[6px] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#17447B]" />
          {!hideActivity && (
          <>
          <div className="px-4 pt-2">
            <div className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
              Add Activity
            </div>
            {[
              "Add Task",
              "Add Phone Call",
              "Add Appointment",
              
              "Add Note",
              "Add Investor360° Message",
              "Apply Workflow",
            ].map((label) => (
              <a
                key={label}
                className="block text-[14px] text-[#1A5FA8] py-1.5 hover:underline cursor-pointer"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="border-t border-[#E3E6EA] my-2" />
          </>
          )}
          <div className="px-4 pb-2">
            <div className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
              Launch
            </div>
            {[
              "Account Opening",
              "Schwab Advisor Center",
              "Investor360° (Impersonate)",
            ].map((label) => (
              <a
                key={label}
                className="block text-[14px] text-[#1A5FA8] py-1.5 hover:underline cursor-pointer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Toolbar({
  collapsed,
  onToggleCollapsed,
  onManage,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onManage: () => void;
}) {
  const { householdToolbar } = useNavVisibility();
  return (
    <div className="bg-[#F0F2F5] border-b border-[#E3E6EA] px-6 py-2.5 flex items-center gap-3 flex-wrap">
      <span className="text-[13px] text-[#6b7280]">My Dashboard</span>
      <span className="text-[#D1D5DB]">|</span>
      {householdToolbar["Year to Today"] !== false && (
        <Pill label="Year to Today" extra="01/01/2026 - 06/20/2026" />
      )}
      {householdToolbar["All Accounts"] !== false && <Pill label="All Accounts" />}
      <span className="text-[12px] italic text-[#6b7280]">
        Last updated 02:39 PM
      </span>
      <div className="ml-auto flex items-center gap-3 text-[13px]">
        <button
          onClick={onToggleCollapsed}
          className="text-[#1A5FA8] hover:underline cursor-pointer"
        >
          {collapsed ? "Show All Content" : "Hide All Content"}
        </button>
        <span className="text-[#D1D5DB]">|</span>
        <button
          onClick={onManage}
          className="text-[#1A5FA8] hover:underline cursor-pointer"
        >
          Manage Dashboard
        </button>
      </div>
    </div>
  );
}


function Pill({ label, extra }: { label: string; extra?: string }) {
  return (
    <button className="flex items-center gap-2 bg-white border border-[#D1D5DB] rounded-sm px-3 py-1.5 text-[13px] text-[#13294B]">
      <span>{label}</span>
      {extra && <span className="text-[#6b7280] italic">{extra}</span>}
      <ChevronDown className="w-3.5 h-3.5 text-[#6b7280]" />
    </button>
  );
}

