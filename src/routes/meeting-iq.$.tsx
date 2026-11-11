import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Construction } from "lucide-react";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import ClientsPage from "@miq/pages/ClientsPage";
import CalendarPage from "@miq/pages/CalendarPage";
import DashboardPage from "@miq/pages/DashboardPage";
import { useSyncMeetingIQUser } from "@miq/lib/userContext";
import { MeetingPrepBody } from "@/components/meeting-prep/MeetingPrepBody";

export const Route = createFileRoute("/meeting-iq/$")({
  // Source app uses localStorage / zustand — not SSR-safe.
  ssr: false,
  component: MeetingIQApp,
});

const TABS = [
  { label: "Dashboard", to: "/meeting-iq" },
  { label: "Clients", to: "/meeting-iq/clients" },
  { label: "Calendar", to: "/meeting-iq/calendar", caret: true },
];

function MeetingIQApp() {
  const { _splat } = Route.useParams();
  const sub = (_splat ?? "").replace(/\/+$/, "");
  useSyncMeetingIQUser();

  return (
    <BrowserRouter basename="/meeting-iq">
      <AppShell
        topBar={
          <PageHeader
            eyebrow="CLIENTS"
            title="Meeting Prep"
            tabs={TABS}
            rightActions={
              <Link to="/" className="hover:text-white" aria-label="Back to platform">
                <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            }
          />
        }
      >
        <div className="miq-scope h-full">
          <MeetingIQRouter sub={sub} />
        </div>
      </AppShell>
    </BrowserRouter>
  );
}

function MeetingIQRouter({ sub }: { sub: string }) {
  if (sub === "" || sub === "/") return <DashboardPage />;
  if (sub === "clients") return <ClientsPage />;
  if (sub === "calendar") return <CalendarPage />;
  if (sub.startsWith("meeting-prep/")) {
    const parts = sub.split("/").filter(Boolean);
    const clientId = parts[1] ?? "";
    const householdName = clientId
      .replace(/^client-/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return <MeetingPrepBody householdName={householdName || "Client"} />;
  }
  return <PortingPlaceholder pageName={sub} unknown />;
}

function PortingPlaceholder({ pageName, unknown = false }: { pageName: string; unknown?: boolean }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6 py-12">
      <div className="max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700">
          <Construction className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-[#13294B]">
          {unknown ? "Page not yet ported" : `${pageName} — porting in progress`}
        </h2>
        <p className="text-sm text-[#4b5563]">
          The Meeting Prep app is being ported into this project page-by-page.
          {unknown ? (
            <> The route <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">/meeting-iq/{pageName}</code> hasn't been ported yet.</>
          ) : (
            <> The {pageName} page will appear here once its components and data layer are imported. Other tabs remain available above.</>
          )}
        </p>
      </div>
    </div>
  );
}
