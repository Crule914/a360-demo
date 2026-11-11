import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Switch } from "@/components/ui/switch";
import {
  useNavVisibility,
  LEFT_RAIL_KEYS,
  HOUSEHOLD_TAB_KEYS,
  HOUSEHOLD_TOOLBAR_KEYS,
  PANEL_ITEMS,
  type PanelKey,
} from "@/lib/navVisibility";
import { adminTabs, AdminBackLink } from "@/lib/adminTabs";
import {
  useWedgeProducts,
  useThirdPartyData,
  WEDGE_PRODUCTS,
  wedgeLabel,
} from "@/lib/demoConfig";
import {
  useShareCurrentView,
  buildWedgeLink,
  buildFullPlatformLink,
} from "@/lib/viewPrefs";

export const Route = createFileRoute("/admin/navigation")({
  head: () => ({
    meta: [
      { title: "Demo Configurations — Navigation" },
      { name: "description", content: "Internal: toggle navigation visibility." },
    ],
  }),
  component: AdminNavigationPage,
});

function AdminNavigationPage() {
  const nav = useNavVisibility();
  const wedge = useWedgeProducts();
  const thirdParty = useThirdPartyData();
  const wedgeOn = Object.values(wedge.state).some(Boolean);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="DEMO CONFIGURATIONS"
          title="Demo Configurations"
          tabs={adminTabs("Navigation")}
        />
      }
    >
      <div className="px-6 py-6 max-w-4xl">

        <div className="mb-5">
          <Section title="Wedge Products">
            {WEDGE_PRODUCTS.map((p) => (
              <div key={p}>
                <Row
                  label={wedgeLabel(p)}
                  bold
                  checked={wedge.state[p]}
                  onChange={() => wedge.toggle(p)}
                />
                <Row
                  label="3rd Party CRM Data"
                  indent
                  disabled={!wedge.state[p]}
                  checked={thirdParty.state[p]?.crm ?? false}
                  onChange={() => thirdParty.toggle(p, "crm")}
                />
                <Row
                  label="3rd Party Portfolio Data"
                  indent
                  disabled={!wedge.state[p]}
                  checked={thirdParty.state[p]?.portfolio ?? false}
                  onChange={() => thirdParty.toggle(p, "portfolio")}
                />
              </div>
            ))}
            <div className="px-4 py-2.5 text-[13px] text-[#4b5563]">
              When data comes from an external system of record (a third-party
              CRM, or portfolio data from a provider such as Orion), those
              records display as read-only in Advisor360°. Portfolio read-only
              removes trading, rebalancing and account edits; messaging a client
              in Advisor360° stays available.
            </div>
          </Section>
        </div>


        <div className="mb-5 flex items-center justify-between">
          <p className="text-[13px] text-[#4b5563]">
            {wedgeOn
              ? "Navigation is controlled by the enabled wedge products. Turn all wedge products off to select nav items manually."
              : "Internal-only. Toggle which items appear in the left rail and the household top tabs. Settings persist on this browser."}
          </p>
          <div
            className={`flex items-center gap-3 text-[13px] ${
              wedgeOn ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <button
              onClick={() => nav.setAll(true)}
              className="text-[#1A5FA8] hover:underline"
            >
              Show all
            </button>
            <span className="text-[#D1D5DB]">|</span>
            <button
              onClick={() => nav.setAll(false)}
              className="text-[#1A5FA8] hover:underline"
            >
              Hide all
            </button>
            <span className="text-[#D1D5DB]">|</span>
            <button
              onClick={() => nav.reset()}
              className="text-[#1A5FA8] hover:underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Left Navigation Rail">
            {LEFT_RAIL_KEYS.map((k) => {
              const topOn = nav.leftRail[k];
              const items = (PANEL_ITEMS as Record<string, string[]>)[k];
              return (
                <div key={k}>
                  <Row
                    label={k}
                    bold
                    checked={topOn}
                    locked={wedgeOn}
                    onChange={() => nav.toggleLeftRail(k)}
                  />
                  {items?.map((item) => (
                    <Row
                      key={item}
                      label={item}
                      indent
                      disabled={!topOn}
                      locked={wedgeOn}
                      checked={nav.panelItems[k as PanelKey]?.[item] ?? true}
                      onChange={() =>
                        nav.togglePanelItem(k as PanelKey, item)
                      }
                    />
                  ))}
                </div>
              );
            })}
          </Section>
          <div className="space-y-4">
            <Section title="Household Top Tabs">
              {HOUSEHOLD_TAB_KEYS.map((k) => (
                <Row
                  key={k}
                  label={k}
                  checked={nav.householdTabs[k]}
                  locked={wedgeOn}
                  onChange={() => nav.toggleHouseholdTab(k)}
                />
              ))}
            </Section>
            <Section title="Household Toolbar Filters">
              {HOUSEHOLD_TOOLBAR_KEYS.map((k) => (
                <Row
                  key={k}
                  label={k}
                  checked={nav.householdToolbar[k]}
                  locked={wedgeOn}
                  onChange={() => nav.toggleHouseholdToolbar(k)}
                />
              ))}
            </Section>
          </div>
        </div>


        <ShareViewSection />

        <AdminBackLink />

      </div>
    </AppShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-[#E3E6EA] rounded-sm">
      <header className="px-4 py-2.5 border-b border-[#E3E6EA]">
        <h3 className="text-[14px] font-semibold text-[#13294B]">{title}</h3>
      </header>
      <div className="divide-y divide-[#F0F2F5]">{children}</div>
    </section>
  );
}

function Row({
  label,
  checked,
  onChange,
  bold,
  indent,
  disabled,
  locked,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  bold?: boolean;
  indent?: boolean;
  disabled?: boolean;
  locked?: boolean;
}) {
  const inactive = disabled || locked;
  return (
    <label
      className={`flex items-center justify-between px-4 py-2.5 ${
        indent ? "pl-8" : ""
      } ${
        inactive
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-[#F8F9FB]"
      }`}
    >
      <span
        className={`text-[14px] text-[#13294B] ${bold ? "font-semibold" : ""}`}
      >
        {label}
      </span>
      <Switch
        checked={disabled ? false : checked}
        disabled={inactive}
        onCheckedChange={() => {
          if (!inactive) onChange();
        }}
      />
    </label>
  );
}

function ShareViewSection() {
  const { copied, copy, currentLink } = useShareCurrentView("/");
  const presets = [
    { label: "Full platform (no wedge)", url: () => buildFullPlatformLink("/") },
    ...WEDGE_PRODUCTS.map((w) => ({
      label: `${wedgeLabel(w)} wedge only`,
      url: () => buildWedgeLink(w, "/"),
    })),
  ];

  return (
    <div className="mt-6">
      <Section title="Share this view">
        <div className="px-4 py-3 text-[13px] text-[#4b5563]">
          Your toggles save automatically to your profile and reload the next
          time you sign in. Share a link below to let a stakeholder open the
          app in that exact configuration — it becomes their saved preference
          too.
        </div>
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-[14px] text-[#13294B]">
            Current configuration
          </span>
          <button
            onClick={() => copy(currentLink(), "current")}
            className="bg-[#1A5FA8] text-white text-[13px] px-3 py-1.5 rounded-[2px]"
          >
            {copied === "current" ? "Link copied" : "Copy link"}
          </button>
        </div>
        {presets.map((p) => (
          <div
            key={p.label}
            className="px-4 py-3 flex items-center justify-between gap-3"
          >
            <span className="text-[14px] text-[#13294B]">{p.label}</span>
            <button
              onClick={() => copy(p.url(), p.label)}
              className="border border-[#1A5FA8] text-[#1A5FA8] bg-white text-[13px] px-3 py-1.5 rounded-[2px]"
            >
              {copied === p.label ? "Link copied" : "Copy link"}
            </button>
          </div>
        ))}
      </Section>
    </div>
  );
}
