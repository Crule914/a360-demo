import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Mail, Plus, Minus, MoreVertical } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs } from "@/lib/navVisibility";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";
import { PROFILE_ACCOUNTS, getProfileAccount, type ProfileAccount } from "@/data/profileAccounts";

export const Route = createFileRoute("/household/sweets/account-profile/$accountId")({
  loader: ({ params }) => {
    const account = getProfileAccount(params.accountId);
    if (!account) throw notFound();
    return { account };
  },
  component: AccountProfileDetailPage,
  notFoundComponent: () => {
    const { accountId } = Route.useParams();
    return (
      <div className="p-10 text-[14px]">
        Account <span className="font-semibold">{accountId}</span> not found.{" "}
        <Link to="/household/sweets/account-profile" className="text-[#1f6fb8] hover:underline">
          Back to Account Profile
        </Link>
      </div>
    );
  },
  errorComponent: () => <div className="p-10 text-[14px]">Failed to load account.</div>,
});

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

const TABS = [
  { label: "Overview", to: "/household/sweets" },
  {
    label: "Trading/Holdings",
    caret: true,
    active: true,
    menuItems: [
      { label: "Trading/Holdings", to: "/household/sweets/trading-holdings" },
      { label: "Account Activity", to: "/household/sweets/account-activity" },
      { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" },
      { label: "Account Profile", to: "/household/sweets/account-profile" },
    ],
  },
  { label: "Insurance" },
  { label: "Reports", to: "/household/sweets/reports" },
  { label: "Documents", caret: true, menuItems: [{ label: "Documents", to: "/household/sweets/documents" }, { label: "Statements", to: "/household/sweets/statements" }, { label: "Tax Documents", to: "/household/sweets/tax-documents" }, { label: "Customer Correspondence", to: "/household/sweets/customer-correspondence" }, { label: "Confirms", to: "/household/sweets/confirms" }] },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] text-[#6b7280]">{label}</div>
      <div className="text-[13px] text-[#1f2937] mt-0.5">{children}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[12px] font-semibold tracking-wide text-[#1f2937] uppercase mb-3">{title}</div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#d4dae3]">
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#e5e7eb]">
        <div className="text-[16px] font-semibold text-[#1f2937]">{title}</div>
        {action}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function AccountSelect({ current }: { current: ProfileAccount }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-3 bg-white border border-[#e0a93b] bg-[#fff8e8] rounded-sm text-[13px] text-[#1f2937] flex items-center gap-2 max-w-[340px]"
      >
        <span className="truncate">{current.name.length > 38 ? `${current.name.slice(0, 38)}…` : current.name}</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-[420px] max-h-[420px] overflow-auto bg-white border border-[#d4dae3] shadow-md">
          {PROFILE_ACCOUNTS.map((a) => (
            <Link
              key={a.id}
              to="/household/sweets/account-profile/$accountId"
              params={{ accountId: a.id }}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-[13px] hover:bg-[#f1f5fb] ${
                a.id === current.id ? "bg-[#eaf2fb] text-[#143A69] font-medium" : "text-[#1f6fb8]"
              }`}
            >
              {a.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountProfileDetailPage() {
  const { account } = Route.useLoaderData() as { account: ProfileAccount };

  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="CLIENTS"
          title={HOUSEHOLD_NAME}
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
          tabs={useFilteredHouseholdTabs(TABS)}
        />
      }
    >
      <div className="bg-[#eef1f5] min-h-full text-[13px] text-[#1f2937]">
        {/* Controls bar */}
        <div className="bg-[#eef1f5] px-5 py-3 flex items-center gap-3 border-b border-[#d4dae3]">
          <Link to="/household/sweets/account-profile" className="text-[14px] font-semibold text-[#143A69] hover:underline">
            Account Profile
          </Link>
          <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
          <AccountSelect current={account} />
          <button className="flex items-center gap-1.5 text-[#1f6fb8] hover:underline ml-2">
            <Plus className="w-4 h-4" /> Create Account
          </button>
          <div className="ml-auto flex items-center gap-4 text-[#1f6fb8]">
            <button className="hover:underline">Update Addresses and Phones</button>
            <span className="text-[#d4dae3]">|</span>
            <button className="flex items-center gap-1 hover:underline">
              <span aria-hidden>🌿</span> Paperless Preferences
            </button>
          </div>
        </div>

        {/* Title + actions */}
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold text-[#1f2937]">{account.name}</h2>
          <button className="text-[#1f6fb8] hover:underline flex items-center gap-1">
            Actions <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-5 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Summary */}
          <Card title="Summary">
            <div className="inline-block px-2.5 py-1 bg-[#e8f0fa] text-[#1f6fb8] text-[12px] rounded-sm mb-4">
              {account.sponsor} Application in Transit
            </div>

            <SectionHeader title="Overview" />
            <div className="grid grid-cols-3 gap-4 mb-5">
              <Field label="Account Number">{account.id}</Field>
              <Field label="Business Line">{account.businessLine}</Field>
              <Field label="Registration Type">{account.registrationType}</Field>
              <Field label="Opened Date">{account.opened}</Field>
              <Field label="Sponsor Name">{account.sponsor}</Field>
            </div>

            <SectionHeader title="Account Management" />
            <div className="grid grid-cols-4 gap-4 mb-1">
              <Field label="Advisor ID">3M9 (Valle/Rudy)</Field>
              <Field label="Agency Code">024</Field>
              <Field label="Last RAP Date">--</Field>
              <Field label="Last Edited">05/06/2026</Field>
            </div>
            <button className="text-[#1f6fb8] hover:underline text-[12px] mb-5">Details</button>

            <SectionHeader title="Address" />
            <div className="grid grid-cols-3 gap-4 mb-5">
              <Field label="Mailing Address">
                {account.address.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </Field>
              <Field label="Legal Address">Same as Mailing Address</Field>
              <Field label="Account Registration">
                <div>{account.primaryOwner}</div>
                {account.address.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </Field>
            </div>

            <SectionHeader title="Account Characteristics" />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Field label="Government Entity">No</Field>
              <Field label="Managed Account">No</Field>
            </div>
            <Field label="Recommendation Reason">{account.recommendation}</Field>
          </Card>

          {/* Parties */}
          <div className="flex flex-col gap-5">
            <Card title="Parties">
              <div className="border-b-2 border-[#1f6fb8] inline-block pb-1 text-[14px] font-medium text-[#1f6fb8] mb-3">
                Owners
              </div>
              <div className="border border-[#e5e7eb]">
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px] text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] border-b border-[#e5e7eb] px-3 py-2">
                  <span className="text-[#1f6fb8]">
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Name</span>
                  <span>Role</span>
                  <span>Trusted Contact</span>
                  <span>MSA</span>
                </div>
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px] items-center text-[13px] border-b border-[#e5e7eb] px-3 py-2 bg-[#f7f9fb]">
                  <span className="text-[#1f6fb8]">
                    <Minus className="w-4 h-4" />
                  </span>
                  <span className="font-medium">{account.primaryOwner}</span>
                  <span>Primary Owner</span>
                  <span>--</span>
                  <span>--</span>
                </div>
                <div className="px-5 py-4 bg-[#f7f9fb] grid grid-cols-3 gap-4">
                  <Field label="SSN/TIN">{account.ssn}</Field>
                  <Field label="Date of Birth">{account.dob}</Field>
                  <Field label="Citizenship Status">{account.citizenship}</Field>
                  <Field label="Employment Status">{account.employment}</Field>
                  <Field label="Occupation">{account.occupation}</Field>
                  <Field label="Source of Income">{account.source}</Field>
                </div>
                <div className="px-5 py-4 bg-[#f7f9fb] border-t border-[#e5e7eb]">
                  <SectionHeader title="Contact Info" />
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Primary Phone">{account.phone}</Field>
                    <Field label="Secondary Phone">{account.phone2}</Field>
                    <Field label="Email">{account.email}</Field>
                    <Field label="Mailing Address">
                      {account.address.map((l) => (
                        <div key={l}>{l}</div>
                      ))}
                    </Field>
                    <Field label="Legal Address">Same as Mailing Address</Field>
                  </div>
                </div>
              </div>
            </Card>

            <Card title={`${account.sponsor} Account Features`} action={<button className="text-[#6b7280]"><MoreVertical className="w-4 h-4" /></button>}>
              <SectionHeader title="Investments and Income" />
              <div className="grid grid-cols-3 gap-4">
                <Field label="Cash Proceeds Instructions">Hold proceeds</Field>
                <Field label="Physical Security Instructions">Hold in street name</Field>
                <Field label="Eligible Dividend Income Instructions">Pay all to cash as proceeds</Field>
              </div>
            </Card>
          </div>

          {/* Suitability + Investment Knowledge spanning both columns */}
          <div className="lg:col-span-2">
            <Card title="Suitability">
              <SectionHeader title="Financial Profile" />
              <div className="grid grid-cols-4 gap-4 mb-5">
                <Field label="Federal Tax Rate">Greater than 35%</Field>
                <Field label="Annual Expenses">Less than 50K</Field>
                <Field label="Special Expenses">Less than 50K</Field>
                <Field label="Special Expenses Time Frame">Less than 2 years</Field>
              </div>
              <Field label="Account Funding Source">Asset Appreciation</Field>

              <div className="mt-6">
                <SectionHeader title="Investment Knowledge" />
                <Field label="General Investment Knowledge">Limited</Field>

                <div className="mt-4 max-w-[720px]">
                  <div className="grid grid-cols-[160px_1fr_1fr_1fr_1fr] text-[12px] text-[#6b7280] mb-1">
                    <span />
                    <span>None</span>
                    <span>Limited</span>
                    <span>Good</span>
                    <span>Extensive</span>
                  </div>
                  {["Stocks", "Bonds", "Mutual Funds", "Variable Contracts", "Limited Partnerships", "Alternative Investments", "Annuities"].map((row, i) => {
                    const sel = i % 4; // mock selection
                    return (
                      <div key={row} className="grid grid-cols-[160px_1fr_1fr_1fr_1fr] items-center py-1.5 border-b border-[#f1f3f6]">
                        <span className="text-[13px]">{row}</span>
                        {[0, 1, 2, 3].map((c) => (
                          <span key={c} className="flex items-center">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border ${
                                sel === c ? "bg-[#1f6fb8] border-[#1f6fb8]" : "border-[#9ca3af]"
                              }`}
                            />
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <SectionHeader title="Assets Held Away" />
                <div className="grid grid-cols-2 gap-4 max-w-[480px]">
                  <Field label="Client has assets held away?">Yes</Field>
                  <Field label="Total Assets ($)">0.00</Field>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="px-5 pb-6 text-[12px] text-[#6b7280]">
          For financial professional use only. Not for use with the public.
        </div>
      </div>
    </AppShell>
  );
}
