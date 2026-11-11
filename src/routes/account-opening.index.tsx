import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  AccountOpeningDashboardBody,
  AccountOpeningTopBar,
} from "@/components/account-opening/AccountOpeningDashboardBody";

export const Route = createFileRoute("/account-opening/")({
  component: AccountOpeningDashboard,
});

function AccountOpeningDashboard() {
  return (
    <AppShell topBar={<AccountOpeningTopBar />}>
      <AccountOpeningDashboardBody />
    </AppShell>
  );
}
