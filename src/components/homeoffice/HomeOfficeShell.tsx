import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useWedgeProducts } from "@/lib/demoConfig";
import homeIcon from "@/assets/nav/home.png.asset.json";
import homeActive from "@/assets/nav/home-active.png.asset.json";
import casesIcon from "@/assets/nav/cases.png.asset.json";
import casesActive from "@/assets/nav/cases.png.asset.json";

import clientsIcon from "@/assets/nav/ho-accounts.png.asset.json";
import clientsActive from "@/assets/nav/ho-accounts-active.png.asset.json";
import adminIcon from "@/assets/nav/admin.png.asset.json";
import adminActive from "@/assets/nav/admin-active.png.asset.json";
import operationsIcon from "@/assets/nav/ho-configure.png.asset.json";
import operationsActive from "@/assets/nav/ho-configure-active.png.asset.json";
import helpIcon from "@/assets/nav/help.png.asset.json";
import helpActive from "@/assets/nav/help-active.png.asset.json";
import vidaIcon from "@/assets/nav/vida.png.asset.json";
import vidaActive from "@/assets/nav/vida-active.png.asset.json";
import advisor360 from "@/assets/nav/advisor360.png.asset.json";

export type HOSection = "Home" | "Cases" | "Accounts" | "Admin" | "Configure";

type NavItem = { label: string; page: string };

const PANELS: Record<HOSection, { header: string; groups: { title?: string; items: NavItem[] }[] }> = {
  Home: {
    header: "Home",
    groups: [{ items: [{ label: "Dashboard", page: "home" }] }],
  },
  Cases: {
    header: "Cases",
    groups: [{ items: [{ label: "Case Manager", page: "cases/case-manager" }] }],
  },

  Accounts: {
    header: "Accounts",
    groups: [
      {
        items: [
          { label: "Account Opening Dashboard", page: "accounts/account-opening-dashboard" },
          { label: "Open New Account", page: "accounts/open-new-account" },
          { label: "Bulk Onboarding", page: "accounts/bulk-onboarding" },
        ],
      },
    ],
  },
  Admin: {
    header: "Admin",
    groups: [
      {
        title: "ADVISORS",
        items: [{ label: "Advisor Information", page: "admin/advisor-information" }],
      },
      {
        title: "FORMS",
        items: [{ label: "Forms", page: "admin/forms" }],
      },
    ],
  },

  Configure: {
    header: "Configure",
    groups: [
      {
        items: [
          { label: "CRM User Management", page: "configure/crm-user-management" },
          { label: "Entitlements", page: "configure/entitlements" },
        ],
      },
      {
        title: "INTEGRATIONS",
        items: [{ label: "Integrations", page: "configure/integrations" }],
      },
    ],
  },
};

const RAIL_ITEMS: { key: HOSection; icon: string; activeIcon: string }[] = [
  { key: "Home", icon: homeIcon.url, activeIcon: homeActive.url },
  { key: "Cases", icon: casesIcon.url, activeIcon: casesActive.url },
  { key: "Accounts", icon: clientsIcon.url, activeIcon: clientsActive.url },

  { key: "Admin", icon: adminIcon.url, activeIcon: adminActive.url },
  { key: "Configure", icon: operationsIcon.url, activeIcon: operationsActive.url },
];

let activeHomeOfficePanel: HOSection | null = null;
const panelListeners = new Set<() => void>();

function setActiveHomeOfficePanel(panel: HOSection | null) {
  activeHomeOfficePanel = panel;
  panelListeners.forEach((listener) => listener());
}

function useActiveHomeOfficePanel() {
  return useSyncExternalStore(
    (listener) => {
      panelListeners.add(listener);
      return () => panelListeners.delete(listener);
    },
    () => activeHomeOfficePanel,
    () => null,
  );
}

export function HomeOfficeShell({
  page,
  onNavigate,
  topTitle,
  breadcrumb,
  children,
}: {
  page: string;
  onNavigate: (page: string) => void;
  topTitle: string;
  breadcrumb: string;
  children: ReactNode;
}) {
  const openPanel = useActiveHomeOfficePanel();
  const [hovered, setHovered] = useState<HOSection | null>(null);
  const wedge = useWedgeProducts();
  const enabledWedges = Object.keys(wedge.state).filter(
    (k) => wedge.state[k as keyof typeof wedge.state],
  );
  // Digital Onboarding wedge (without CRM+) hides CRM User Management.
  const hideCrmUserManagement =
    enabledWedges.includes("Digital Onboarding") && !enabledWedges.includes("CRM+");
  // Client Portal wedge: only Home, Admin (Advisor Information) and
  // Configure (Entitlements) — applies whenever the wedge is enabled.
  const clientPortalOnly = enabledWedges.includes("Client Portal");
  const railItems = clientPortalOnly
    ? RAIL_ITEMS.filter((r) => ["Home", "Admin", "Configure"].includes(r.key))
    : RAIL_ITEMS;
  const allowedPages = clientPortalOnly
    ? new Set(["home", "admin/advisor-information", "configure/entitlements"])
    : null;

  const activeSection: HOSection =
    page === "home"
      ? "Home"
      : page.startsWith("cases")
        ? "Cases"
        : page.startsWith("accounts")
        ? "Accounts"
        : page.startsWith("admin")
          ? "Admin"
          : page.startsWith("configure")
            ? "Configure"
            : "Home";

  const toggle = (k: HOSection) => {
    setActiveHomeOfficePanel(openPanel === k ? null : k);
  };
  const close = () => setActiveHomeOfficePanel(null);

  return (
    <div className="flex min-h-screen w-full bg-[#F0F2F5] text-[#1f2937] font-sans">
      <aside className="w-[80px] shrink-0 bg-[#17447B] text-white flex flex-col items-stretch relative z-50">
        <div className="flex-1 flex flex-col">
          {railItems.map((item) => {
            const isOpen = openPanel === item.key;
            const isActive = isOpen || activeSection === item.key;
            const showActive = isActive || hovered === item.key;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => toggle(item.key)}
                aria-expanded={isOpen}
                aria-controls="home-office-navigation-panel"
                onMouseEnter={() => setHovered(item.key)}
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
                    src={item.activeIcon}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${
                      showActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <span className={isActive ? "underline underline-offset-2" : ""}>
                  {item.key}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-stretch border-t border-white/10">
          <RailMini icon={helpIcon.url} activeIcon={helpActive.url} label="Help" />
          <RailMini icon={vidaIcon.url} activeIcon={vidaActive.url} label="ViDA" />
          <div className="flex justify-center pb-3 pt-2">
            <img src={advisor360.url} alt="Advisor360°" className="h-8 object-contain" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-header text-white flex items-center justify-between px-6 py-3">
          <div>
            <div className="text-[11px] font-medium tracking-wide uppercase text-white/75">
              {breadcrumb}
            </div>
            <div className="text-[20px] font-medium leading-tight">{topTitle}</div>
          </div>
          <button className="text-white/85 hover:text-white" aria-label="Open in new window">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {openPanel && (
        <>
          <button
            type="button"
            aria-label="Close panel"
            onClick={close}
            className="fixed inset-0 z-30 bg-black/20"
          />
          <div
            id="home-office-navigation-panel"
            role="dialog"
            aria-label={`${PANELS[openPanel].header} navigation`}
            className="fixed top-0 bottom-0 left-[80px] w-[380px] max-w-[calc(100vw-80px)] bg-header text-white z-[60] shadow-[6px_0_18px_rgba(0,0,0,0.25)] flex flex-col"
            style={{ animation: "slideIn 180ms ease-out" }}
          >
            <header className="flex items-center justify-between px-6 h-[60px] shrink-0">
              <h2 className="text-[20px] font-medium">{PANELS[openPanel].header}</h2>
              <button type="button" onClick={close} className="text-white/80 hover:text-white" aria-label="Close">
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto pb-6 text-[14px]">
              {PANELS[openPanel].groups.map((g, gi) => {
                const items = g.items.filter(
                  (it) =>
                    !(hideCrmUserManagement && it.page === "configure/crm-user-management") &&
                    (!allowedPages || allowedPages.has(it.page)),
                );
                if (items.length === 0) return null;
                return (
                <div key={gi} className={gi > 0 ? "mt-4" : ""}>
                  {g.title && (
                    <div className="px-6 pb-1 pt-1 text-[12px] font-semibold tracking-wide text-[#7FB3E8]">
                      {g.title}
                    </div>
                  )}
                  {items.map((it) => {
                    const active = page === it.page;
                    return (
                      <button
                        type="button"
                        key={it.page}
                        onClick={() => {
                          onNavigate(it.page);
                          close();
                        }}
                        className="relative flex items-center w-full text-left px-6 py-1 leading-tight hover:bg-white/5"
                      >
                        {active && (
                          <span className="absolute left-0 top-0.5 bottom-0.5 w-[3px] bg-[#7FB3E8] rounded-r-sm" />
                        )}
                        <span className={active ? "text-white" : ""}>{it.label}</span>
                      </button>
                    );
                  })}
                </div>
                );
              })}
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
    </div>
  );
}

function RailMini({ icon, activeIcon, label }: { icon: string; activeIcon: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
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
          src={activeIcon}
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
