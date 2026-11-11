import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { sweetsMembers } from "@/data/sweetsOverview";
import { useFilteredHouseholdTabs } from "@/lib/navVisibility";

const HOUSEHOLD_TABS = [
  { label: "Overview", to: "/household/sweets" },
  { label: "Trading/Holdings", caret: true },
  { label: "Reports", to: "/household/sweets/reports" },
  { label: "Documents", to: "/household/sweets/documents" },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true, active: true },
];

export const Route = createFileRoute("/investor360-admin")({
  head: () => ({
    meta: [
      { title: "Investor360° Administration | Advisor360" },
      {
        name: "description",
        content:
          "Manage Investor360° IDs for the Sweets household: permissions, logins, shared documents and account access.",
      },
      { property: "og:title", content: "Investor360° Administration" },
      {
        property: "og:description",
        content:
          "Investor360° ID administration for the Sweets household with impersonation and password tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Investor360AdminPage,
});

type Id = {
  initials: string;
  name: string;
  loginId: string;
  status: string;
  assignedTo: string;
  email: string;
  permissions: string[];
  logins: number;
  docsShared: number;
  accounts: { group: string; items: string[] }[];
  portalUser: string;
};

const IDS: Id[] = [
  {
    initials: "RS",
    name: "Richard Sweets",
    loginId: "rsweets-a360-prod",
    status: "Active",
    assignedTo: "CLIENT",
    email: "rickandkarensweets@gmail.com",
    permissions: ["Performance: IRR", "Gain/Loss: Est. Tax", "Gain/Loss: Schwab"],
    logins: 14,
    docsShared: 6,
    portalUser: "Rick",
    accounts: [
      {
        group: "Joint",
        items: [
          "Richard & Karen Sweets Joint w/Survivor Schwab - (EEP000907)",
        ],
      },
      {
        group: "Additional Accounts",
        items: [
          "Chase Checking",
          "Fidelity 401(k)",
        ],
      },
      {
        group: "Closed Accounts",
        items: ["Sweets Family American Funds - (SynF0599853511-2)"],
      },
    ],
  },
  {
    initials: "KS",
    name: "Karen Sweets",
    loginId: "ksweets-a360-prod",
    status: "In Process",
    assignedTo: "OTHER",
    email: "rickandkarensweets@gmail.com",
    permissions: ["Additional Accounts (8)", "Performance: TWR"],
    logins: 0,
    docsShared: 2,
    portalUser: "Karen",
    accounts: [
      {
        group: "Retirement",
        items: [
          "Karen Sweets Traditional IRA - (JAV033209)",
          "Karen Sweets Roth IRA - (JAV033211)",
        ],
      },
      {
        group: "Additional Accounts",
        items: ["Ally Savings"],
      },
    ],
  },
];

function Investor360AdminPage() {
  const openPortal = (user: string) => {
    window.open(
      `/investor360-portal?user=${encodeURIComponent(user)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const tabs = useFilteredHouseholdTabs(
    HOUSEHOLD_TABS as unknown as { label: string; caret?: boolean }[],
  );

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="CLIENTS"
          title="THE SWEETS FAMILY"
          titleExtra={
            <>
              <button className="text-white/90 hover:text-white" aria-label="Email">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-1.5">
                {sweetsMembers.map((m) => (
                  <div
                    key={m.initials}
                    title={m.name}
                    className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-[11px] font-semibold tracking-wide text-white"
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
            </>
          }
          tabs={tabs}
        />
      }
    >
    <div className="min-h-full bg-[#F0F2F5]">
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-[16px] text-[#28313B]">Investor360°</h2>
        <div className="flex items-center gap-4 text-[14px] text-[#1f6fb8]">
          <button type="button">+ Create New Investor360° ID</button>
          <span className="text-[#c9ced4]">|</span>
          <button type="button">Permissions</button>
        </div>
      </div>

      <main className="px-6 pb-10 space-y-4">
        {IDS.map((id) => (
          <section
            key={id.loginId}
            className="bg-white border border-[#E3E6EA] rounded-md"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E3E6EA]">
              <span className="w-9 h-9 rounded-full bg-[#E4E8ED] text-[#4a5561] text-[13px] font-semibold flex items-center justify-center">
                {id.initials}
              </span>
              <span className="text-[17px] font-medium text-[#28313B]">
                {id.name}
              </span>
              <span className="text-[#c9ced4]">|</span>
              <div className="flex items-center gap-3 text-[14px] text-[#1f6fb8]">
                <button type="button">Edit</button>
                <span className="text-[#c9ced4]">|</span>
                <button type="button" onClick={() => openPortal(id.portalUser)}>
                  Impersonate
                </button>
                <span className="text-[#c9ced4]">|</span>
                <button type="button">Reset password</button>
                <span className="text-[#c9ced4]">|</span>
                <button type="button">User Activity</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1.4fr] gap-6 px-5 py-5 text-[14px] text-[#28313B]">
              <div className="space-y-4">
                <Field label="Login ID" value={id.loginId} />
                <Field label="Status" value={id.status} />
                <Field label="ID Assigned To" value={id.assignedTo} />
                <div>
                  <div className="text-[#6b7280]">Email</div>
                  <a className="text-[#1f6fb8]" href={`mailto:${id.email}`}>
                    {id.email}
                  </a>
                </div>
              </div>

              <div>
                <div className="text-[#6b7280]">Permission(s)</div>
                {id.permissions.map((p) => (
                  <div key={p}>{p}</div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[#6b7280]">Logins in Last 90 Days</div>
                  <div className="text-[#1f6fb8]">{id.logins}</div>
                </div>
                <div>
                  <div className="text-[#6b7280]">Documents Shared</div>
                  <div>{id.docsShared}</div>
                </div>
              </div>

              <div>
                <div className="text-[16px] font-medium mb-2">All Accounts</div>
                {id.accounts.map((g) => (
                  <div key={g.group}>
                    <div className="font-semibold border-b border-[#E3E6EA] py-1.5">
                      {g.group}
                    </div>
                    {g.items.map((it) => (
                      <div
                        key={it}
                        className="border-b border-[#E3E6EA] py-1.5 pl-4"
                      >
                        {it}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#6b7280]">{label}</div>
      <div>{value}</div>
    </div>
  );
}
