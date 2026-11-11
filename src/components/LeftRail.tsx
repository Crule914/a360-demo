import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, GripVertical, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { shortcuts } from "@/data/householdData";
import { useRecentHouseholds, useOpenHousehold } from "@/lib/recentHouseholds";
import { useAuthUser, signOut } from "@/lib/auth";
import { useNavVisibility } from "@/lib/navVisibility";
import { useWedgeProducts } from "@/lib/demoConfig";
import { openVida } from "@/components/vida/VidaPanel";
import { getMeetingPrepClients } from "@/lib/meetingPrepClients";





import { NotificationsPanel } from "@/components/NotificationsPanel";
import notificationsIcon from "@/assets/nav/notifications.png.asset.json";
import notificationsActive from "@/assets/nav/notifications-active.png.asset.json";
import homeIcon from "@/assets/nav/home.png.asset.json";
import homeActive from "@/assets/nav/home-active.png.asset.json";
import searchIcon from "@/assets/nav/search.png.asset.json";
import searchActive from "@/assets/nav/search-active.png.asset.json";
import clientsIcon from "@/assets/nav/clients.png.asset.json";
import clientsActive from "@/assets/nav/clients-active.png.asset.json";
import tradingIcon from "@/assets/nav/trading.png.asset.json";
import tradingActive from "@/assets/nav/trading-active.png.asset.json";
import operationsIcon from "@/assets/nav/operations.png.asset.json";
import operationsActive from "@/assets/nav/operations-active.png.asset.json";
import analysisIcon from "@/assets/nav/analysis.png.asset.json";
import analysisActive from "@/assets/nav/analysis-active.png.asset.json";
import complianceIcon from "@/assets/nav/compliance.png.asset.json";
import complianceActive from "@/assets/nav/compliance-active.png.asset.json";
import adminIcon from "@/assets/nav/admin.png.asset.json";
import adminActive from "@/assets/nav/admin-active.png.asset.json";
import helpIcon from "@/assets/nav/help.png.asset.json";
import helpActive from "@/assets/nav/help-active.png.asset.json";
import vidaIcon from "@/assets/nav/vida.png.asset.json";
import vidaActive from "@/assets/nav/vida-active.png.asset.json";
import avatarPm from "@/assets/nav/avatar-pm.png.asset.json";
import advisor360 from "@/assets/nav/advisor360.png.asset.json";

type PanelKey =
  | "Notifications"
  | "Home"
  | "Search"
  | "Clients"
  | "Trading"
  | "Operations"
  | "Analysis"
  | "Compliance"
  | "Admin";

type RailItem = { label: PanelKey; icon: string; activeIcon?: string; badge?: string };

const topItems: RailItem[] = [
  { label: "Notifications", icon: notificationsIcon.url, activeIcon: notificationsActive.url, badge: "9+" },
  { label: "Home", icon: homeIcon.url, activeIcon: homeActive.url },
  { label: "Search", icon: searchIcon.url, activeIcon: searchActive.url },
  { label: "Clients", icon: clientsIcon.url, activeIcon: clientsActive.url },
  { label: "Trading", icon: tradingIcon.url, activeIcon: tradingActive.url },
  { label: "Operations", icon: operationsIcon.url, activeIcon: operationsActive.url },
  { label: "Analysis", icon: analysisIcon.url, activeIcon: analysisActive.url },
  { label: "Compliance", icon: complianceIcon.url, activeIcon: complianceActive.url },
  { label: "Admin", icon: adminIcon.url, activeIcon: adminActive.url },
];

export function LeftRail() {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);
  const [hovered, setHovered] = useState<PanelKey | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibility = useNavVisibility();
  const visibleTopItems = topItems.filter((i) => visibility.leftRail[i.label]);

  const activeSection: PanelKey | null =
    pathname === "/"
      ? "Home"
      : pathname.startsWith("/household")
        ? "Clients"
        : pathname.startsWith("/admin")
          ? "Admin"
          : null;

  const toggle = (k: PanelKey) => setOpenPanel((p) => (p === k ? null : k));
  const close = () => setOpenPanel(null);

  return (
    <>
      <aside className="w-[80px] shrink-0 bg-[#17447B] text-white flex flex-col items-stretch relative z-50">
        <div className="flex-1 flex flex-col">
          {visibleTopItems.map((item) => {
            const isOpen = openPanel === item.label;
            const isActive = isOpen || activeSection === item.label;
            const showActive = isActive || hovered === item.label;
            return (
              <button
                key={item.label}
                onClick={() => toggle(item.label)}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex flex-col items-center gap-1 py-3 px-1 text-[11px] leading-tight transition-colors ${
                  isActive
                    ? "bg-[#1A2D4E] text-[#7FB3E8]"
                    : "text-white/85 hover:bg-[#1A2D4E] hover:text-[#7FB3E8]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#7FB3E8] rounded-r-sm" />
                )}
                <div className="relative w-6 h-6">
                  <img
                    src={item.icon}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${
                      showActive ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <img
                    src={item.activeIcon || item.icon}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${
                      showActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#D64545] text-white text-[9px] leading-none rounded-sm px-1 py-[1px] font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={isActive ? "underline underline-offset-2" : ""}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-stretch border-t border-white/10">
          {visibility.leftRail.Help && (
            <RailMini icon={helpIcon.url} activeIcon={helpActive.url} label="Help" />
          )}
          {visibility.leftRail.ViDA && (
            <RailMini icon={vidaIcon.url} activeIcon={vidaActive.url} label="ViDA" onClick={() => openVida()} />
          )}
          <div className="flex justify-center py-3">
            <UserAvatar />
          </div>
          <div className="flex justify-center pb-3">
            <img src={advisor360.url} alt="Advisor360°" className="h-8 object-contain" />
          </div>
        </div>
      </aside>

      {openPanel && (
        <>
          <button
            aria-label="Close panel"
            onClick={close}
            className="fixed inset-0 z-30 bg-black/20"
          />
          <div
            className="fixed top-0 bottom-0 left-[80px] w-[380px] bg-header text-white z-40 shadow-[6px_0_18px_rgba(0,0,0,0.25)] flex flex-col"
            style={{ animation: "slideIn 180ms ease-out" }}
          >
            <header className="flex items-center justify-between px-6 h-[60px] shrink-0">
              <h2 className="text-[20px] font-medium">{openPanel}</h2>
              <button
                onClick={close}
                className="text-white/80 hover:text-white"
                aria-label="Close"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto pb-6">
              <PanelContent which={openPanel} onClose={close} />
            </div>
          </div>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-12px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </>
      )}
    </>
  );
}

function PanelContent({
  which,
  onClose,
}: {
  which: PanelKey;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const visibility = useNavVisibility();
  const wedge = useWedgeProducts();
  const homeOfficeTarget =
    wedge.state["Digital Onboarding"] || wedge.state["CRM+"]
      ? "/home-office/accounts/account-opening-dashboard"
      : "/home-office/home";
  const panelMap = (visibility.panelItems as Record<string, Record<string, boolean>>)[which];
  const isItemVisible = (item: string) => panelMap?.[item] ?? true;

  if (which === "Home") {
    return (
      <div className="text-[14px]">
        {isItemVisible("Dashboard") && (
          <NavyRow active label="Dashboard" onClick={() => { navigate({ to: "/" }); onClose(); }} />
        )}
        {isItemVisible("Home Office Portal") && (
          <NavyRow
            label="Home Office Portal"
            onClick={() => {
              // Open in a new window on the SAME origin so localStorage
              // (Supabase session + app user) is shared automatically —
              // no re-login / SSO prompt needed. Intentionally omit
              // "noopener" so the new window keeps the full same-origin
              // context of the parent app.
              window.open(homeOfficeTarget, "_blank");
              onClose();
            }}
          />
        )}

        {isItemVisible("Shortcuts") && (
          <>
            <div className="my-3 border-t border-white/10" />
            <div className="flex items-center justify-between px-6 pb-1 pt-1">
              <span className="text-[12px] font-semibold tracking-wide text-[#7FB3E8]">
                SHORTCUTS
              </span>
              <span className="text-[12px] text-[#7FB3E8] hover:underline cursor-pointer">
                Manage
              </span>
            </div>
            {shortcuts.map((s) => (
              <DragRow key={s} label={s} />
            ))}
          </>
        )}
      </div>
    );
  }

  if (which === "Search") {
    return <SearchPanel onClose={onClose} navigate={navigate} />;
  }

  if (which === "Clients") {
    return <ClientsPanel onClose={onClose} navigate={navigate} isItemVisible={isItemVisible} />;
  }

  if (which === "Notifications") {
    return <NotificationsPanel />;
  }

  if (which === "Admin") {
    return (
      <div className="text-[14px]">
        {isItemVisible("CRM Admin") && <NavyRow label="CRM Admin" />}
        {isItemVisible("Permissions and Preferences") && <NavyRow label="Permissions and Preferences" />}
        {isItemVisible("Notification Settings") && <NavyRow label="Notification Settings" />}
        {isItemVisible("Integrations") && (
          <NavyRow
            label="Integrations"
            onClick={() => {
              navigate({ to: "/admin/integrations" });
              onClose();
            }}
          />
        )}
        {isItemVisible("Demo Configurations") && (
          <NavyRow
            label="Demo Configurations"
            onClick={() => {
              navigate({ to: "/admin/navigation" });
              onClose();
            }}
          />
        )}
      </div>
    );
  }

  const placeholders: Record<string, string[]> = {
    Notifications: ["All Notifications", "Mentions", "Tasks", "Alerts"],
    Trading: ["Order Blotters", "Models"],
    Operations: [
      "Account Opening Dashboard",
      "Open New Account",
      "Bulk Account Opening",
      "Forms",

    ],
    Analysis: ["Portfolio Analytics", "Performance", "Risk"],
    Compliance: ["Corporate RIA Reviews"],
  };
  const routes: Record<string, string> = {
    "Account Opening Dashboard": "/account-opening",
    "Open New Account": "/account-opening/new",
    "Order Blotters": "/trading/order-blotters",
    "Models": "/trading/models",
    "Forms": "/operations/forms",
    "Bulk Account Opening": "/operations/bulk-onboarding",


  };

  return (
    <div className="text-[14px]">
      {(placeholders[which] ?? []).filter(isItemVisible).map((l) => (
        <NavyRow
          key={l}
          label={l}
          onClick={
            routes[l]
              ? () => {
                  navigate({ to: routes[l] });
                  onClose();
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}


function NavyRow({
  label,
  active,
  onClick,
  className = "",
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center w-full text-left px-6 py-1 leading-tight hover:bg-white/5 ${className}`}
    >
      {active && (
        <span className="absolute left-0 top-0.5 bottom-0.5 w-[3px] bg-[#7FB3E8] rounded-r-sm" />
      )}
      <span className={active ? "text-white" : ""}>{label}</span>
    </button>
  );
}

function ClientsPanel({
  onClose,
  navigate,
  isItemVisible,
}: {
  onClose: () => void;
  navigate: ReturnType<typeof useNavigate>;
  isItemVisible: (item: string) => boolean;
}) {
  const recents = useRecentHouseholds();
  const openHousehold = useOpenHousehold();
  const navLinks: { label: string; to?: string }[] = [
    { label: "Households" },
    { label: "Accounts" },
    { label: "Insurance (In Force)" },
    { label: "Insurance (Pending)" },
    { label: "CRM Activities" },
    { label: "People" },
    { label: "Opportunities" },
    { label: "Texting" },
    { label: "Workflows" },
    { label: "Practice Intelligence", to: "/practice-intelligence" },
    { label: "Meeting Prep", to: "/meeting-iq" },
  ];
  return (
    <div className="text-[15px] py-1">
      {navLinks.filter((l) => isItemVisible(l.label)).map((l) => (
        <NavyRow
          key={l.label}
          label={l.label}
          onClick={() => {
            if (l.to) navigate({ to: l.to });
            onClose();
          }}
        />
      ))}

      {recents.length > 0 && (
        <>
          <div className="h-5" />
          <div className="px-6 pb-1 text-[12px] font-semibold tracking-wide text-[#7FB3E8] uppercase">
            Last Viewed Households
          </div>
          {recents.map((h) => (
            <NavyRow
              key={h.id}
              label={h.name}
              onClick={() => {
                openHousehold(h);
                onClose();
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}


function DragRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-grab text-white/95">
      <GripVertical className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
      <span className="text-[14px]">{label}</span>
    </div>
  );
}

function RailMini({
  icon,
  activeIcon,
  label,
  onClick,
}: {
  icon: string;
  activeIcon?: string;
  label: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center gap-1 py-2 text-[11px] text-white/85 hover:bg-[#1A2D4E] hover:text-[#7FB3E8]"
    >
      <div className="relative w-6 h-6">
        <img
          src={icon}
          alt=""
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={activeIcon || icon}
          alt=""
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <span>{label}</span>
    </button>
  );
}

function UserAvatar() {
  const navigate = useNavigate();
  const user = useAuthUser();
  if (!user) {
    return (
      <button
        onClick={() => navigate({ to: "/login" })}
        title="Sign in"
        className="w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white/80 text-[11px] hover:bg-white/20 transition-colors"
      >
        Sign in
      </button>
    );
  }
  return (
    <button
      onClick={() => {
        if (window.confirm(`Sign out ${user.email}?`)) signOut();
      }}
      title={`${user.name} (${user.email}) — click to sign out`}
      className="w-9 h-9 rounded-full bg-[#7FB3E8] text-[#0E2747] text-[12px] font-semibold flex items-center justify-center hover:bg-[#A6CBED] transition-colors"
    >
      {user.initials}
    </button>
  );
}

function SearchPanel({
  onClose,
  navigate,
}: {
  onClose: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [query, setQuery] = useState("");
  const openHousehold = useOpenHousehold();
  const clients = getMeetingPrepClients();
  const q = query.trim().toLowerCase();
  const results = q
    ? clients.filter((c) => c.clientName.toLowerCase().includes(q))
    : [];
  return (
    <div className="px-4">
      <div className="bg-white rounded-sm p-3 text-[#13294B]">
        <div className="flex items-center gap-2 border border-[#D1D5DB] rounded-sm">
          <div className="flex items-center gap-1 px-2 py-1.5 border-r border-[#D1D5DB] text-[12px]">
            All
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#6b7280]">
              <path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth={1.5} />
            </svg>
          </div>
          <SearchIcon className="w-3.5 h-3.5 text-[#6b7280] ml-1" strokeWidth={1.5} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-none text-[13px] py-1.5 pr-2 bg-transparent"
          />
        </div>
      </div>
      <div className="mt-5 px-2">
        <div className="text-[13px] text-white font-semibold pb-2 border-b border-white/15">
          {q ? `Clients matching "${query}"` : "Last Viewed Search Results"}
        </div>
        {q ? (
          results.length === 0 ? (
            <div className="text-[13px] text-white/70 pt-3">No clients found.</div>
          ) : (
            <div className="pt-2">
              {results.map((c) => (
                <button
                  key={c.clientId}
                  onClick={() => {
                    openHousehold({ id: c.clientId, name: c.clientName });
                    onClose();
                  }}
                  className="block w-full text-left px-1 py-1.5 text-[13px] text-white hover:bg-white/5 rounded"
                >
                  {c.clientName}
                </button>
              ))}
            </div>
          )
        ) : (
          <div className="text-[13px] text-white/80 pt-3">
            Start typing to begin your search.
          </div>
        )}
      </div>
      {/* keep navigate referenced to satisfy lint when unused branches change */}
      <span className="hidden">{typeof navigate}</span>
    </div>
  );
}
