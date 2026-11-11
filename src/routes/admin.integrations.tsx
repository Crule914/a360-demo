import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useIntegrations, INTEGRATIONS, type Integration } from "@/lib/demoConfig";
import { useState } from "react";

export const Route = createFileRoute("/admin/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — Advisor360°" },
      {
        name: "description",
        content:
          "Connect and manage the financial planning tools available in your Advisor360° workspace.",
      },
      { property: "og:title", content: "Integrations — Advisor360°" },
      {
        property: "og:description",
        content:
          "Connect and manage the financial planning tools available in your Advisor360° workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IntegrationsPage,
});

const DETAILS: Record<
  Integration,
  { blurb: string; category: string; accent: string }
> = {
  eMoney: {
    blurb:
      "Sync household balance sheets and planning scenarios with eMoney Advisor.",
    category: "Financial Planning",
    accent: "#1A5FA8",
  },
  Conquest: {
    blurb:
      "Push client goals and account data into Conquest Planning's strategic advice engine.",
    category: "Financial Planning",
    accent: "#0F766E",
  },
  RightCapital: {
    blurb:
      "Share held-away and custodial positions with RightCapital plans and client portals.",
    category: "Financial Planning",
    accent: "#B45309",
  },
  "MoneyGuide Pro": {
    blurb:
      "Launch MoneyGuidePro goal planning directly from a household with pre-filled data.",
    category: "Financial Planning",
    accent: "#7C3AED",
  },
};

function IntegrationsPage() {
  // Demo Configurations decides which integrations exist in this environment;
  // this advisor-facing page manages the connection itself.
  const { state: available } = useIntegrations();
  const [connected, setConnected] = useState<Record<string, boolean>>({
    eMoney: true,
    Conquest: false,
    RightCapital: false,
    "MoneyGuide Pro": true,
  });

  const visible = INTEGRATIONS.filter((k) => available[k]);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="ADMIN"
          title="Integrations"
          tabs={[{ label: "Integrations", to: "/admin/integrations", active: true, caret: false }]}
        />
      }
    >
      <div className="px-6 py-6 max-w-5xl">
        <p className="text-[13px] text-[#4b5563] mb-5">
          Connect the planning tools your practice uses. Connected tools appear on
          household pages and can exchange client data with Advisor360°.
        </p>

        {visible.length === 0 ? (
          <div className="bg-white border border-[#E3E6EA] rounded-sm px-4 py-8 text-center text-[13px] text-[#6b7280]">
            No integrations are available for your firm.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((k) => {
              const d = DETAILS[k];
              const isOn = connected[k];
              return (
                <div
                  key={k}
                  className="bg-white border border-[#E3E6EA] rounded-sm p-4 flex flex-col"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-9 w-9 rounded-sm flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
                      style={{ backgroundColor: d.accent }}
                      aria-hidden="true"
                    >
                      {k.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#13294B]">{k}</div>
                      <div className="text-[12px] text-[#6b7280]">{d.category}</div>
                    </div>
                    <span
                      className={
                        "ml-auto text-[11px] px-2 py-0.5 rounded-full border " +
                        (isOn
                          ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                          : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]")
                      }
                    >
                      {isOn ? "Connected" : "Not connected"}
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] text-[#4b5563] leading-[1.5]">{d.blurb}</p>

                  <div className="mt-4 pt-3 border-t border-[#F0F2F5] flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConnected((s) => ({ ...s, [k]: !s[k] }))}
                      className={
                        "text-[13px] px-3 py-1.5 rounded-sm border transition-colors " +
                        (isOn
                          ? "border-[#D1D5DB] text-[#1F2937] hover:bg-[#F9FAFB]"
                          : "border-[#1A5FA8] bg-[#1A5FA8] text-white hover:bg-[#154E8A]")
                      }
                    >
                      {isOn ? "Disconnect" : "Connect"}
                    </button>
                    {isOn && (
                      <button
                        type="button"
                        className="text-[13px] text-[#1A5FA8] hover:underline"
                      >
                        Manage settings
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
