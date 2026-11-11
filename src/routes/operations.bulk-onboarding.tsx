import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { BulkOnboardingPage } from "@/components/homeoffice/HomeOfficePages";

export const Route = createFileRoute("/operations/bulk-onboarding")({
  head: () => ({
    meta: [
      { title: "Bulk Account Opening — Operations | Advisor360°" },
      {
        name: "description",
        content:
          "Import spreadsheets to open multiple client accounts at once and track import status.",
      },
      { property: "og:title", content: "Bulk Account Opening — Operations | Advisor360°" },
      {
        property: "og:description",
        content:
          "Import spreadsheets to open multiple client accounts at once and track import status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BulkOnboardingRoute,
});

function BulkOnboardingRoute() {
  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="Operations"
          title="Bulk Account Opening"
          rightActions={
            <button className="text-white/90 hover:text-white" aria-label="Open in new window">
              <ExternalLink className="w-5 h-5" />
            </button>
          }
        />
      }
    >
      <BulkOnboardingPage />
    </AppShell>
  );
}
