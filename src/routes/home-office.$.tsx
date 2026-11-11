import type { ReactElement } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeOfficeShell } from "@/components/homeoffice/HomeOfficeShell";
import { WEDGE_PRODUCTS, useWedgeProducts } from "@/lib/demoConfig";
import {
  HomeDashboardPage,
  AccountOpeningDashboardPage,
  OpenNewAccountPage,
  AdvisorInformationPage,
  CrmUserManagementPage,
  EntitlementsPage,
  IntegrationsPage,
  BulkOnboardingPage,
  FormsPage,
  CaseManagerPage,
} from "@/components/homeoffice/HomeOfficePages";

export const Route = createFileRoute("/home-office/$")({
  head: () => ({
    meta: [
      { title: "Home Office Portal — Advisor360°" },
      { name: "description", content: "Practice-level home office portal for Advisor360°." },
    ],
  }),
  component: HomeOfficeRoute,
});

type PageDef = {
  breadcrumb: string;
  title: string;
  render: () => ReactElement;
};

const PAGES: Record<string, PageDef> = {
  home: { breadcrumb: "Home Office", title: "Dashboard", render: () => <HomeDashboardPage /> },
  "cases/case-manager": {
    breadcrumb: "Cases",
    title: "Case Manager",
    render: () => <CaseManagerPage />,
  },
  "accounts/account-opening-dashboard": {
    breadcrumb: "Accounts",
    title: "Account Opening Dashboard",
    render: () => <AccountOpeningDashboardPage />,
  },
  "accounts/open-new-account": {
    breadcrumb: "Accounts",
    title: "Open New Account",
    render: () => <OpenNewAccountPage />,
  },
  "accounts/bulk-onboarding": {
    breadcrumb: "Accounts",
    title: "Bulk Onboarding",
    render: () => <BulkOnboardingPage />,
  },
  "admin/forms": {
    breadcrumb: "Admin",
    title: "Forms",
    render: () => <FormsPage />,
  },
  "admin/advisor-information": {
    breadcrumb: "Admin",
    title: "Advisor Information",
    render: () => <AdvisorInformationPage />,
  },
  "configure/crm-user-management": {
    breadcrumb: "Configure",
    title: "CRM User Management",
    render: () => <CrmUserManagementPage />,
  },
  "configure/entitlements": {
    breadcrumb: "Configure",
    title: "Entitlements",
    render: () => <EntitlementsPage />,
  },
  "configure/integrations": {
    breadcrumb: "Configure",
    title: "Integrations",
    render: () => <IntegrationsPage />,
  },
};

function HomeOfficeRoute() {
  const { _splat } = Route.useParams() as { _splat?: string };
  const navigate = useNavigate();
  const wedge = useWedgeProducts();
  const anyWedge = WEDGE_PRODUCTS.some((w) => wedge.state[w]);
  // With a wedge product enabled, the home office landing page is the
  // Account Opening Dashboard instead of the full home office dashboard.
  const clientPortalOnly =
    wedge.state["Client Portal"] &&
    !wedge.state["Digital Onboarding"] &&
    !wedge.state["CRM+"];
  const fallback = clientPortalOnly
    ? "home"
    : anyWedge
      ? "accounts/account-opening-dashboard"
      : "home";
  const key = _splat && PAGES[_splat] ? _splat : fallback;
  const page = PAGES[key];

  return (
    <HomeOfficeShell
      page={key}
      onNavigate={(p) => {
        navigate({ to: "/home-office/$", params: { _splat: p } });
      }}
      topTitle={page.title}
      breadcrumb={page.breadcrumb}
    >
      {page.render()}
    </HomeOfficeShell>
  );
}

