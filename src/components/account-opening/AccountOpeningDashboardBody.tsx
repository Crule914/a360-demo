import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useWedgeProducts } from "@/lib/demoConfig";

import {
  DASHBOARD_GROUPS,
  countAccounts,
  loadSubmissions,
  type DashboardGroup,
  type DashboardBundle,
  type BundleRow,
} from "@/lib/accountOpening";

export function AccountOpeningTopBar() {
  return (
    <>
      <div className="bg-[#1A4D8F] text-white px-6 h-10 flex items-center gap-3">
        <span className="text-[13px] tracking-wide">
          <span className="font-semibold">ACCOUNT</span> OPENING
        </span>
      </div>
      <div className="bg-[#2E73C0] text-white h-14 px-6 flex items-center justify-between">
        <h1 className="text-[22px] font-light">Dashboard</h1>
        <button className="text-white text-[13px] flex items-center gap-1.5 hover:underline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.6" />
            <path
              d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Help
        </button>
      </div>
    </>
  );
}

const GRID =
  "grid grid-cols-[1.5fr_1.1fr_1.3fr_1fr_1.3fr_1.3fr_1.2fr]";

export function AccountOpeningDashboardBody({ showTopBar = false }: { showTopBar?: boolean }) {
  const [query, setQuery] = useState("");
  const [groupBy, setGroupBy] = useState("Household");

  const wedge = useWedgeProducts();
  const digitalOnboarding = !!wedge.state["Digital Onboarding"];

  const submitted = useMemo(() => loadSubmissions(), []);

  const groups: DashboardGroup[] = useMemo(() => {
    const base = DASHBOARD_GROUPS.map((g) => ({
      ...g,
      bundles: g.bundles.map((b) => ({ ...b })),
    }));
    submitted.forEach((s) => {
      const name = s.household.toUpperCase();
      const bundle: DashboardBundle = {
        id: s.id,
        label: `${name} - Bundle ( ${s.accounts.length} Account${s.accounts.length === 1 ? "" : "s"} )`,
        signature: "--",
        lastUpdated: `${new Date(s.submittedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${s.advisor.split(" - ")[1] ?? s.advisor}`,
        accounts: s.accounts.map<BundleRow>((a) => ({
          status: "IN PROGRESS",
          holder: a.primaryOwner.name,
          registration: `Brokerage - ${a.registrationType}`,
          registrationLink: true,
          productType: "--",
          signature: "",
          advisor: "321654987 - Malouf, Paul",
        })),
      };
      const existing = base.find((g) => g.household === name);
      if (existing) existing.bundles.unshift(bundle);
      else base.unshift({ household: name, bundles: [bundle] });
    });
    if (digitalOnboarding) {
      // Brokerage-only, and product type is shown as dashes.
      return base
        .map((g) => ({
          ...g,
          bundles: g.bundles
            .map((b) => {
              const accounts = b.accounts
                .filter((a) => !a.registration.startsWith("Direct Sponsor"))
                .map((a) => ({ ...a, productType: "--", action: undefined }));
              return {
                ...b,
                accounts,
                label: b.label.replace(
                  /\( \d+ Accounts? \)/,
                  `( ${accounts.length} Account${accounts.length === 1 ? "" : "s"} )`,
                ),
              };
            })
            .filter((b) => b.accounts.length > 0),
        }))
        .filter((g) => g.bundles.length > 0);
    }

    return base;
  }, [submitted, digitalOnboarding]);

  const q = query.trim().toLowerCase();
  const filtered: DashboardGroup[] = q
    ? groups
        .map((g) => ({
          ...g,
          bundles: g.bundles
            .map((b) => ({
              ...b,
              accounts: b.accounts.filter((a) =>
                [a.holder, a.registration, a.productType, a.advisor, a.status]
                  .join(" ")
                  .toLowerCase()
                  .includes(q),
              ),
            }))
            .filter(
              (b) =>
                b.accounts.length > 0 || b.label.toLowerCase().includes(q),
            ),
        }))
        .filter((g) => g.bundles.length > 0 || g.household.toLowerCase().includes(q))
    : groups;

  const total = countAccounts(filtered);

  return (
    <div className="bg-[#F5F7FA] min-h-full">
      {showTopBar && <AccountOpeningTopBar />}
      <div>
        <div className="px-6 pt-3 pb-6">
          {/* Action links */}
          <div className="flex justify-end items-center gap-3 mb-3">
            <Link
              to="/operations/bulk-onboarding"
              className="text-[#2E73C0] text-[13px] font-medium hover:underline"
            >
              Bulk Account Onboarding
            </Link>
            <span className="text-[#D1D5DB]">|</span>
            <Link
              to="/account-opening/new"
              className="text-[#2E73C0] text-[13px] font-medium hover:underline"
            >
              + Create Account
            </Link>
          </div>

          <div className="bg-white border border-[#E1E5EA]">
            {/* Group by + search */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E5EA]">
              <div className="flex items-center gap-3 text-[13px] text-[#3F3F46]">
                <span>Group by</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="border border-[#D1D5DB] w-48 h-8 rounded-sm px-2 text-[13px] bg-white text-[#222]"
                >
                  <option>Household</option>
                  <option>Advisor</option>
                  <option>Status</option>
                </select>
              </div>
              <div className="flex items-center gap-2 border border-[#D1D5DB] rounded-sm px-2 h-8 w-72">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="1.5" />
                  <path d="m20 20-3-3" stroke="#6b7280" strokeWidth="1.5" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 outline-none text-[13px] bg-transparent"
                />
              </div>
            </div>

            {/* Count row */}
            <div className="flex items-center justify-between px-4 py-2 text-[13px] text-[#3F3F46] border-b border-[#E1E5EA]">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{total} Account(s)</span>
                <span className="text-[#D1D5DB]">|</span>
                <button className="text-[#2E73C0]">Filters Applied (1) ▾</button>
              </div>
              <div className="flex items-center gap-2 text-[12px] italic text-[#6b7280]">
                <span>Updated 12:55PM</span>
                <button className="text-[#2E73C0]">↻</button>
              </div>
            </div>

            <Table groups={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}

const COLS = [
  "Status",
  "Account Holder(s)",
  "Business Line - Registration",
  "Product Type",
  "Signature(s)",
  "Advisor ID",
  "Last Updated",
];

function FilterIcon({ active }: { active?: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
      <path
        d="M1 2h10L7 6.5V11L5 9.5V6.5L1 2Z"
        fill={active ? "#1A4D8F" : "#2E73C0"}
      />
    </svg>
  );
}

function Table({ groups }: { groups: DashboardGroup[] }) {
  return (
    <div className="text-[14px] overflow-x-auto">
      <div
        className={`${GRID} bg-white border-b border-[#E1E5EA] text-[14px] text-[#2E73C0] font-semibold uppercase tracking-wide`}
      >
        {COLS.map((c, i) => (
          <div
            key={c}
            className="px-3 py-3 flex items-start justify-between gap-2 border-r border-[#E1E5EA] last:border-r-0"
          >
            <span className="flex items-center gap-1.5">
              {i === 0 && <span className="text-[#6b7280] text-[13px]">⊖</span>}
              {c}
              {i === 0 && <span className="text-[#6b7280] normal-case">ⓘ</span>}
            </span>
            <FilterIcon active={i === COLS.length - 1} />
          </div>
        ))}
      </div>

      {groups.map((g) => (
        <HouseholdGroup key={g.household} group={g} />
      ))}

      {groups.length === 0 && (
        <div className="px-4 py-8 text-center text-[#6b7280]">
          No accounts match your search.
        </div>
      )}
    </div>
  );
}

function HouseholdGroup({ group }: { group: DashboardGroup }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className={`${GRID} border-b border-[#E1E5EA] bg-white`}>
        <div className="px-3 py-2 flex items-center gap-2 font-semibold text-[#222]">
          <button
            onClick={() => setOpen(!open)}
            className="text-[#6b7280]"
            aria-label={open ? "Collapse household" : "Expand household"}
          >
            {open ? "⊖" : "⊕"}
          </button>
          <span className="text-[#6b7280]">⋮</span>
          <span>{group.household}</span>
        </div>
        <div className="col-span-6" />
      </div>
      {open &&
        group.bundles.map((b) => <BundleGroup key={b.id} bundle={b} />)}
    </>
  );
}

function BundleGroup({ bundle }: { bundle: DashboardBundle }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className={`${GRID} border-b border-[#E1E5EA] hover:bg-[#FAFBFC]`}>
        <div className="px-3 py-2 pl-6 flex items-center gap-2 text-[#222]">
          <button
            onClick={() => setOpen(!open)}
            className="text-[#6b7280]"
            aria-label={open ? "Collapse bundle" : "Expand bundle"}
          >
            {open ? "⊖" : "⊕"}
          </button>
          <span className="text-[#6b7280]">⋮</span>
          <span className="truncate">{bundle.label}</span>
        </div>
        <div />
        <div />
        <div />
        <div className="px-3 py-2">
          {bundle.signature && bundle.signature !== "--" ? (
            <button className="text-[#2E73C0] hover:underline">
              {bundle.signature}
            </button>
          ) : (
            <span className="text-[#6b7280]">--</span>
          )}
        </div>
        <div />
        <div className="px-3 py-2 text-[#3F3F46]">{bundle.lastUpdated}</div>
      </div>
      {open &&
        bundle.accounts.map((a, i) => <Row key={i} row={a} />)}
    </>
  );
}

function Row({ row }: { row: BundleRow }) {
  return (
    <div className={`${GRID} border-b border-[#F0F2F5] hover:bg-[#FAFBFC]`}>
      <div className="px-3 py-2 pl-10 flex items-start gap-2">
        <span className="text-[#6b7280] leading-5">⋮</span>
        <span className="min-w-0">
          <span className="block truncate text-[#222]" title={row.status}>
            {row.status}
          </span>
          {row.action && (
            <button className="text-[#2E73C0] hover:underline">
              {row.action}
            </button>
          )}
        </span>
      </div>
      <div className="px-3 py-2">{row.holder}</div>
      <div className="px-3 py-2">
        {row.registrationLink ? (
          <button className="text-[#2E73C0] hover:underline text-left">
            {row.registration}
          </button>
        ) : (
          <span>{row.registration}</span>
        )}
      </div>
      <div className="px-3 py-2 text-[#3F3F46]">
        {row.productType === "--" ? (
          <span className="text-[#6b7280]">--</span>
        ) : (
          row.productType
        )}
      </div>
      <div className="px-3 py-2 text-[#6b7280]">{row.signature || ""}</div>
      <div className="px-3 py-2">{row.advisor}</div>
      <div className="px-3 py-2" />
    </div>
  );
}
