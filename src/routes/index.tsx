import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HomeTopBar } from "@/components/HomeTopBar";
import { useDashboardState } from "@/lib/dashboardState";
import { WIDGET_CATALOG, useAllowedWidgets } from "@/lib/dashboardState";
import { WIDGET_RENDERERS, WidgetShell } from "@/components/dashboard/widgets";
import { ManageDashboardPanel } from "@/components/ManageDashboardPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Advisor360°" },
      {
        name: "description",
        content:
          "Advisor360° practice-level home dashboard with customizable widgets.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const dash = useDashboardState();
  const { allowed } = useAllowedWidgets();
  const [panelOpen, setPanelOpen] = useState(false);

  const titleFor = (id: string) =>
    WIDGET_CATALOG.find((w) => w.id === id)?.title ?? id;

  // When a wedge restricts widgets, hide any active widget not in the allowed set.
  const activeIds = allowed
    ? dash.active.filter((id) => allowed.includes(id))
    : dash.active;

  // First time a restricting wedge is enabled, seed the dashboard with all of
  // its allowed widgets so the user sees them by default.
  const seedKey = allowed ? `a360.wedgeSeed.${[...allowed].sort().join(",")}` : null;
  useEffect(() => {
    if (!allowed || !seedKey) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(seedKey)) return;
    window.localStorage.setItem(seedKey, "1");
    const missing = allowed.filter((id) => !dash.active.includes(id));
    dash.addWidgets(missing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);


  // Split active widgets into N columns, top-to-bottom fill (round-robin keeps even balance).
  const cols: typeof activeIds[] = Array.from({ length: dash.columns }, () => []);
  activeIds.forEach((id, i) => {
    cols[i % dash.columns].push(id);
  });

  return (
    <AppShell topBar={<HomeTopBar />}>
      <div className="px-6 py-5">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-[13px] font-normal text-[#6b7280]">My Dashboard</h1>
          <div className="flex items-center gap-4 text-[13px]">
            <button
              onClick={() => dash.setCollapsed(!dash.collapsed)}
              className="text-[#1A5FA8] hover:underline cursor-pointer"
            >
              {dash.collapsed ? "Show All Content" : "Hide All Content"}
            </button>
            <span className="text-[#B5BAC2]">|</span>
            <button
              onClick={() => setPanelOpen(true)}
              className="text-[#1A5FA8] hover:underline cursor-pointer"
            >
              Manage Dashboard
            </button>
          </div>
        </header>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${dash.columns}, minmax(0, 1fr))`,
          }}
        >
          {cols.map((colIds, ci) => (
            <div key={ci} className="flex flex-col gap-4 min-w-0">
              {colIds.map((id) => {
                const Renderer = WIDGET_RENDERERS[id];
                if (!Renderer) return null;
                return (
                  <WidgetShell
                    key={id}
                    title={titleFor(id)}
                    collapsed={dash.collapsed}
                    onRemove={() => dash.removeWidget(id)}
                    onMoveUp={() => dash.moveWidget(id, -1)}
                    onMoveDown={() => dash.moveWidget(id, 1)}
                  >
                    <Renderer />
                  </WidgetShell>
                );
              })}
            </div>
          ))}
        </div>

        {activeIds.length === 0 && (
          <div className="text-center py-12 text-[13px] text-[#6b7280]">
            No widgets on your dashboard. Click{" "}
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

      <ManageDashboardPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </AppShell>
  );
}
