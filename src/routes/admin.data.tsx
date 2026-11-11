import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Switch } from "@/components/ui/switch";
import { adminTabs, AdminBackLink } from "@/lib/adminTabs";
import { useDataSources, DATA_SOURCES } from "@/lib/demoConfig";

export const Route = createFileRoute("/admin/data")({
  head: () => ({
    meta: [
      { title: "Demo Configurations — Data" },
      { name: "description", content: "Internal: toggle demo data sources." },
    ],
  }),
  component: AdminDataPage,
});

const DESCRIPTIONS: Record<string, string> = {
  NFS: "Show NFS (National Financial Services) accounts and documents.",
  IWS: "Show IWS (Investor Web Services) accounts and documents.",
  Schwab: "Show Schwab accounts and documents.",
};

function AdminDataPage() {
  const { state, toggle, setAll } = useDataSources();

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="DEMO CONFIGURATIONS"
          title="Demo Configurations"
          tabs={adminTabs("Data")}
        />
      }
    >
      <div className="px-6 py-6 max-w-4xl">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[13px] text-[#4b5563]">
            Choose which custodial data sources appear throughout the demo.
            Settings persist on this browser.
          </p>
          <div className="flex items-center gap-3 text-[13px]">
            <button onClick={() => setAll(true)} className="text-[#1A5FA8] hover:underline">
              Show all
            </button>
            <span className="text-[#D1D5DB]">|</span>
            <button onClick={() => setAll(false)} className="text-[#1A5FA8] hover:underline">
              Hide all
            </button>
          </div>
        </div>

        <section className="bg-white border border-[#E3E6EA] rounded-sm">
          <header className="px-4 py-2.5 border-b border-[#E3E6EA]">
            <h3 className="text-[14px] font-semibold text-[#13294B]">Data Sources</h3>
          </header>
          <div className="divide-y divide-[#F0F2F5]">
            {DATA_SOURCES.map((k) => (
              <label
                key={k}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#F8F9FB]"
              >
                <div>
                  <div className="text-[14px] text-[#13294B]">{k}</div>
                  <div className="text-[12px] text-[#6b7280]">{DESCRIPTIONS[k]}</div>
                </div>
                <Switch checked={state[k]} onCheckedChange={() => toggle(k)} />
              </label>
            ))}
          </div>
        </section>

        <AdminBackLink />
      </div>
    </AppShell>
  );
}
