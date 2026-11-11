import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileSpreadsheet,
  Folder,
  Search,
  Star,
  Trash2,
  X,
  MinusCircle,
  Columns3,
  Plus,
  Info,
  GripVertical,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/practice-intelligence")({
  component: PracticeIntelligencePage,
});

// ---------------- Insight data ----------------
type Insight = {
  category: string;
  title: string;
  description: string;
  metric: string;
  action: string;
  // which preset view to load on action click
  view: string;
};

const INSIGHTS: Insight[] = [
  // page 1
  { category: "Life Stage or Event", title: "Clients Reaching RMD Age This Year", description: "# of clients required to start RMDs this year", metric: "14,392", action: "View Clients", view: "All Open Accounts" },
  { category: "Account Maintenance", title: "Insurance Missing Beneficiaries", description: "# of products missing primary beneficiary", metric: "1,341,239", action: "View Insurance Products", view: "Insurance Lines of Business" },
  { category: "Account Maintenance", title: "Upcoming Term Conversions", description: "# of products with term conversions", metric: "6,752", action: "View Insurance Products", view: "Insurance Anniversary Review" },
  { category: "Account Maintenance", title: "Upcoming Surrender Charge Expiration Date", description: "# of products with surrender charges expiring", metric: "2,156", action: "View Insurance Products", view: "Insurance Lines of Business" },
  { category: "Life Stage or Event", title: "Clients Eligible for Retirement Catch-Up Contributions", description: "# of clients potentially eligible", metric: "169,515", action: "View Clients", view: "All Open Accounts" },
  // page 2
  { category: "Growth Opportunity", title: "High Cash Balances", description: "# of accounts with cash above target", metric: "8,431", action: "View Accounts", view: "All Open Accounts" },
  { category: "Growth Opportunity", title: "Held-Away Assets Identified", description: "# of clients with held-away balances", metric: "23,118", action: "View Clients", view: "All Open Accounts" },
  { category: "Account Maintenance", title: "Cost Basis Missing", description: "# of positions missing cost basis", metric: "47,902", action: "View Accounts", view: "Holdings (Single Security)" },
  { category: "Life Stage or Event", title: "Clients Turning 65 This Year", description: "# of clients approaching Medicare eligibility", metric: "5,221", action: "View Clients", view: "All Open Accounts" },
  { category: "Growth Opportunity", title: "Recently Inherited IRAs", description: "# of beneficiary IRAs opened in last 90 days", metric: "1,084", action: "View Accounts", view: "Accounts Opened In Last 30 Days" },
  // page 3
  { category: "Account Maintenance", title: "Inactive Accounts >12 Months", description: "# of accounts with no activity in 12+ months", metric: "12,640", action: "View Accounts", view: "All Open Accounts" },
  { category: "Life Stage or Event", title: "Clients Approaching Social Security FRA", description: "# of clients within 12 months of FRA", metric: "9,873", action: "View Clients", view: "All Open Accounts" },
  { category: "Growth Opportunity", title: "Large Deposits Last 30 Days", description: "# of deposits over $25,000 last 30 days", metric: "3,492", action: "View Accounts", view: "Additions and Withdrawals" },
  { category: "Account Maintenance", title: "Trusted Contact Missing", description: "# of accounts missing a trusted contact", metric: "201,338", action: "View Accounts", view: "Account Register" },
  { category: "Growth Opportunity", title: "Single-Account Households", description: "# of households with only one account", metric: "18,205", action: "View Households", view: "All Open Accounts" },
  // page 4
  { category: "Life Stage or Event", title: "Clients with New Mortgages", description: "# of clients with new mortgage activity", metric: "742", action: "View Clients", view: "All Open Accounts" },
  { category: "Account Maintenance", title: "Address On File Outdated", description: "# of clients with address >5 years old", metric: "34,118", action: "View Clients", view: "Account Register" },
  { category: "Growth Opportunity", title: "529 Plan Cross-Sell Candidates", description: "# of clients with children under 18", metric: "11,902", action: "View Clients", view: "All Open Accounts" },
  { category: "Account Maintenance", title: "Pending Document Signatures", description: "# of accounts awaiting client signature", metric: "1,673", action: "View Accounts", view: "All Open Accounts" },
  { category: "Life Stage or Event", title: "Recently Widowed Clients", description: "# of clients with spouse passing in last 12 months", metric: "318", action: "View Clients", view: "All Open Accounts" },
  // page 5
  { category: "Growth Opportunity", title: "Annuity Re-Evaluation Candidates", description: "# of clients with annuities >7 years old", metric: "6,210", action: "View Insurance Products", view: "Insurance Lines of Business" },
  { category: "Account Maintenance", title: "Margin Eligible Not Enrolled", description: "# of accounts eligible but not enrolled in margin", metric: "27,489", action: "View Accounts", view: "All Open Accounts" },
  { category: "Life Stage or Event", title: "Clients with Recent Birth Event", description: "# of clients with new dependents", metric: "984", action: "View Clients", view: "All Open Accounts" },
  { category: "Growth Opportunity", title: "Underweight Equity Allocations", description: "# of accounts below target equity allocation", metric: "15,720", action: "View Accounts", view: "Holdings (Single Security)" },
  { category: "Account Maintenance", title: "Expiring Powers of Attorney", description: "# of accounts with POA expiring in 90 days", metric: "412", action: "View Accounts", view: "All Open Accounts" },
];

const CARDS_PER_PAGE = 5;

// ---------------- Fields ----------------
type FieldKey =
  | "advisor"
  | "accountName"
  | "accountNumber"
  | "accountType"
  | "registration"
  | "custodian"
  | "household"
  | "status"
  | "value"
  | "cash"
  | "openDate"
  | "lastActivity"
  | "productType"
  | "sponsor";

const FIELDS: { key: FieldKey; label: string; numeric?: boolean }[] = [
  { key: "advisor", label: "Advisor Name(s)" },
  { key: "accountName", label: "Account Name" },
  { key: "accountNumber", label: "Account Number" },
  { key: "accountType", label: "Account Type" },
  { key: "registration", label: "Registration" },
  { key: "custodian", label: "Custodian" },
  { key: "household", label: "Household Name" },
  { key: "status", label: "Account Status" },
  { key: "value", label: "Value ($)", numeric: true },
  { key: "cash", label: "Cash ($)", numeric: true },
  { key: "openDate", label: "Open Date" },
  { key: "lastActivity", label: "Last Activity Date" },
  { key: "productType", label: "Product Type" },
  { key: "sponsor", label: "Manager or Sponsor" },
];

const FIELD_LABEL: Record<FieldKey, string> = Object.fromEntries(
  FIELDS.map((f) => [f.key, f.label]),
) as Record<FieldKey, string>;

// ---------------- Seed data ----------------
type Account = Record<FieldKey, string | number>;

const FIRST_NAMES = ["Account Holder Name", "Zaelynn Guido", "Jasiel Bravo", "Lulu Tyshaun Bergmann", "Debra Vancleave", "Alfie Perkins", "Marlowe Vance", "Tomas Yi", "Priya Kapoor", "Henrik Olsen", "Camila Reyes", "Noor Hadid", "Wyatt Booker", "Sienna Park", "Ezra Mahoney", "Aaliyah Khan", "Soren Pace", "Imani Brooks", "Theo Lindgren", "Maeve Donovan", "Beatrix Knoll", "Cassius Yates"];
const SPONSORS = ["Morningstar Investment Services, Inc.", "SEI", "Unknown Sponsor"];
const ACCOUNT_TYPES = ["Individual", "Joint", "IRA", "Roth IRA", "Trust", "401(k) Rollover"];
const REGISTRATIONS = ["Individual", "Joint Tenants", "Traditional IRA", "Roth IRA", "Revocable Trust"];
const PRODUCT_TYPES = ["Brokerage", "Managed Account", "Retirement", "Trust"];
const HOUSEHOLDS = ["Not Part Of A Household", "Household 102470", "Household 220110", "Household 998145", "Household 564023", "THE SWEETS FAMILY"];
const ADVISORS = ["1ST CONSULTANTS INC", "PEARSON ADVISORS", "BLUE RIDGE WEALTH", "MERIDIAN PARTNERS", "ATLAS PLANNING"];

function mask(n: number) {
  return `xxxx${String(n).padStart(4, "0")}`;
}

function buildAccounts(): Account[] {
  const rows: Account[] = [];
  let counter = 100;
  for (let i = 0; i < 36; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const sponsor = SPONSORS[i % SPONSORS.length];
    const acctNum = mask(1000 + ((i * 733) % 9000));
    const value = Math.round(Math.random() * 1_500_000 * 100) / 100;
    const cash = Math.round(Math.random() * Math.min(value, 50_000) * 100) / 100;
    const year = 2015 + (i % 10);
    const month = ((i * 3) % 12) + 1;
    const day = ((i * 7) % 27) + 1;
    const openDate = `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
    const lastM = ((i * 5) % 12) + 1;
    const lastD = ((i * 11) % 27) + 1;
    const lastActivity = `${String(lastM).padStart(2, "0")}/${String(lastD).padStart(2, "0")}/2026`;
    rows.push({
      advisor: ADVISORS[i % ADVISORS.length],
      accountName: `${first} ${sponsor} - Schwab - (${acctNum})`,
      accountNumber: acctNum,
      accountType: ACCOUNT_TYPES[i % ACCOUNT_TYPES.length],
      registration: REGISTRATIONS[i % REGISTRATIONS.length],
      custodian: "Schwab",
      household: HOUSEHOLDS[i % HOUSEHOLDS.length],
      status: i % 17 === 0 ? "CLOSED" : "OPEN",
      value,
      cash,
      openDate,
      lastActivity,
      productType: PRODUCT_TYPES[i % PRODUCT_TYPES.length],
      sponsor,
    });
    counter++;
  }
  // Make sure the specific seeded rows requested are present
  rows[0] = {
    ...rows[0],
    advisor: "1ST CONSULTANTS INC",
    accountName: "Account Holder Name Morningstar Investment Services, Inc. - Schwab - (xxxx8856)",
    household: "Not Part Of A Household",
    status: "OPEN",
    value: 715145.49,
    cash: 61.05,
    sponsor: "Morningstar Investment Services, Inc.",
  };
  rows[1] = {
    ...rows[1],
    advisor: "1ST CONSULTANTS INC",
    accountName: "Zaelynn Guido Morningstar Investment Services, Inc. - Schwab - (xxxx2566)",
    household: "Not Part Of A Household",
    status: "OPEN",
    value: 288304.59,
    cash: 0,
    sponsor: "Morningstar Investment Services, Inc.",
  };
  rows[2] = {
    ...rows[2],
    advisor: "1ST CONSULTANTS INC",
    accountName: "Jasiel Bravo IRA SEI - Schwab - (xxxx2718)",
    household: "Household 102470",
    status: "OPEN",
    value: 0,
    cash: 0,
    sponsor: "SEI",
  };
  return rows;
}

const ACCOUNTS = buildAccounts();

// ---------------- Saved views ----------------
type Filter = { field: FieldKey; op: string; value: string };
type View = {
  name: string;
  description: string;
  columns: FieldKey[];
  filters: Filter[];
  required?: Filter[];
};

const VIEWS: Record<string, View> = {
  "All Open Accounts": {
    name: "All Open Accounts",
    description: "All open accounts",
    columns: ["advisor", "accountName", "household", "value", "cash"],
    filters: [],
    required: [{ field: "status", op: "equals", value: "OPEN" }],
  },
  "Account Register": {
    name: "Account Register",
    description: "All accounts with registration details",
    columns: ["accountName", "registration", "accountType", "custodian", "household"],
    filters: [],
  },
  "Accounts Opened In Last 30 Days": {
    name: "Accounts Opened In Last 30 Days",
    description: "New accounts opened in the last 30 days",
    columns: ["advisor", "accountName", "openDate", "value", "household"],
    filters: [{ field: "openDate", op: "within last", value: "30 days" }],
  },
  "Additions and Withdrawals": {
    name: "Additions and Withdrawals",
    description: "Account additions and withdrawals",
    columns: ["accountName", "lastActivity", "value", "cash"],
    filters: [],
  },
  "Holdings (Single Security)": {
    name: "Holdings (Single Security)",
    description: "Holdings filtered to a single security",
    columns: ["accountName", "productType", "value"],
    filters: [],
  },
  "Insurance Anniversary Review": {
    name: "Insurance Anniversary Review",
    description: "Insurance policies up for anniversary review",
    columns: ["accountName", "productType", "sponsor", "value"],
    filters: [{ field: "productType", op: "equals", value: "Managed Account" }],
  },
  "Insurance Lines of Business": {
    name: "Insurance Lines of Business",
    description: "Insurance products grouped by line of business",
    columns: ["accountName", "productType", "sponsor"],
    filters: [],
  },
};

// ---------------- Component ----------------
function PracticeIntelligencePage() {
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [navOpen, setNavOpen] = useState(true);
  const [activeView, setActiveView] = useState("All Open Accounts");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favSectionOpen, setFavOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(true);
  const [viewsOpen, setViewsOpen] = useState(true);
  const [defaultViewsOpen, setDefaultViewsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const view = VIEWS[activeView];
  const [columns, setColumns] = useState<FieldKey[]>(view.columns);
  const [filters, setFilters] = useState<Filter[]>(view.filters);
  const [sortBy, setSortBy] = useState<{ key: FieldKey; dir: "asc" | "desc" }>({ key: "advisor", dir: "asc" });
  const [groupBy, setGroupBy] = useState<FieldKey | "none">("none");
  const [manageColsOpen, setManageColsOpen] = useState(false);
  const [addFiltersOpen, setAddFiltersOpen] = useState(false);

  // Load a saved view
  function loadView(name: string) {
    const v = VIEWS[name];
    if (!v) return;
    setActiveView(name);
    setColumns(v.columns);
    setFilters(v.filters);
  }

  const totalPages = Math.ceil(INSIGHTS.length / CARDS_PER_PAGE);
  const pageCards = INSIGHTS.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  // Build effective filters: required (always) + user filters
  const effectiveFilters: Filter[] = [...(view.required ?? []), ...filters];

  // Filter & sort rows
  const rows = useMemo(() => {
    let r = ACCOUNTS.filter((row) =>
      effectiveFilters.every((f) => {
        const v = String(row[f.field] ?? "").toLowerCase();
        const fv = f.value.toLowerCase();
        switch (f.op) {
          case "equals":
            return v === fv;
          case "contains":
            return v.includes(fv);
          case "not equals":
            return v !== fv;
          case ">":
            return Number(row[f.field]) > Number(f.value);
          case "<":
            return Number(row[f.field]) < Number(f.value);
          default:
            return true;
        }
      }),
    );
    r = [...r].sort((a, b) => {
      const av = a[sortBy.key];
      const bv = b[sortBy.key];
      if (typeof av === "number" && typeof bv === "number") return sortBy.dir === "asc" ? av - bv : bv - av;
      return sortBy.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return r;
  }, [effectiveFilters, sortBy]);

  function toggleSort(key: FieldKey) {
    setSortBy((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function toggleFavorite(name: string) {
    setFavorites((s) => {
      const n = new Set(s);
      if (n.has(name)) n.delete(name);
      else n.add(name);
      return n;
    });
  }

  // Group rows
  const grouped = useMemo(() => {
    if (groupBy === "none") return [{ key: "", rows }];
    const map = new Map<string, Account[]>();
    rows.forEach((r) => {
      const k = String(r[groupBy]);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    });
    return Array.from(map.entries()).map(([key, rows]) => ({ key, rows }));
  }, [rows, groupBy]);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="CLIENTS"
          title="Practice Intelligence"
          rightActions={
            <button className="hover:text-white" aria-label="Open in new window">
              <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
            </button>
          }
        />
      }
    >
      {insightsOpen ? (
        <div className="bg-[#F0F2F5] px-6 pt-6 pb-4">
          <div className="flex justify-end mb-2">
            <button
              className="text-[13px] text-[#0A66C2] hover:underline"
              onClick={() => setInsightsOpen(false)}
            >
              Hide Insights
            </button>
          </div>
          <div className="flex items-stretch gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="shrink-0 self-center text-[#6b7280] hover:text-[#13294B] disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 grid grid-cols-5 gap-3">
              {pageCards.map((c, i) => (
                <InsightCard
                  key={`${page}-${i}`}
                  insight={c}
                  accent={i % 2 === 0 ? "#0A66C2" : "#1AA3A3"}
                  onAction={() => loadView(c.view)}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="shrink-0 self-center text-[#6b7280] hover:text-[#13294B] disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "bg-[#0A66C2] w-10" : "bg-[#C9CDD3] w-8"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#F0F2F5] px-6 py-3 flex justify-end">
          <button
            className="text-[13px] text-[#0A66C2] hover:underline"
            onClick={() => setInsightsOpen(true)}
          >
            Show Insights
          </button>
        </div>
      )}

      <div className="flex bg-white border-t border-[#E3E6EA] min-h-[600px]">
        {/* Left navigator */}
        {navOpen ? (
          <aside className="w-[280px] shrink-0 border-r border-[#E3E6EA] p-4">
            <div className="flex justify-end mb-2">
              <button onClick={() => setNavOpen(false)} className="text-[#6b7280] hover:text-[#13294B]" aria-label="Collapse navigator">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <button className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-[#0A66C2] text-[#0A66C2] text-[13px] font-medium rounded-sm hover:bg-[#0A66C2]/5 mb-3">
              <Plus className="w-4 h-4" /> New
            </button>
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-8 pr-2 py-2 text-[13px] border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            <NavSection label="Favorites" open={favSectionOpen} onToggle={() => setFavOpen((o) => !o)}>
              {favorites.size === 0 ? (
                <div className="px-6 py-1 text-[12px] text-[#9ca3af] italic">No favorites yet</div>
              ) : (
                Array.from(favorites).map((name) => (
                  <NavItem key={name} label={name} active={activeView === name} onClick={() => loadView(name)} />
                ))
              )}
            </NavSection>

            <NavSection label="Quick Queries" open={quickOpen} onToggle={() => setQuickOpen((o) => !o)}>
              <NavItem label="Holdings (Single Security)" active={activeView === "Holdings (Single Security)"} onClick={() => loadView("Holdings (Single Security)")} />
              <NavItem label="Insurance Anniversary Review" active={activeView === "Insurance Anniversary Review"} onClick={() => loadView("Insurance Anniversary Review")} />
              <NavItem label="Insurance Lines of Business" active={activeView === "Insurance Lines of Business"} onClick={() => loadView("Insurance Lines of Business")} />
            </NavSection>

            <NavSection label="Views" open={viewsOpen} onToggle={() => setViewsOpen((o) => !o)}>
              <button
                onClick={() => setDefaultViewsOpen((o) => !o)}
                className="w-full flex items-center gap-1.5 px-4 py-1 text-[13px] text-[#13294B] hover:bg-[#F0F2F5]"
              >
                {defaultViewsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <Folder className="w-4 h-4 text-[#6b7280]" />
                Default Views
              </button>
              {defaultViewsOpen && (
                <div>
                  <NavItem indent label="Account Register" active={activeView === "Account Register"} onClick={() => loadView("Account Register")} />
                  <NavItem indent label="Accounts Opened In Last 30 Days" active={activeView === "Accounts Opened In Last 30 Days"} onClick={() => loadView("Accounts Opened In Last 30 Days")} />
                  <NavItem indent label="Additions and Withdrawals" active={activeView === "Additions and Withdrawals"} onClick={() => loadView("Additions and Withdrawals")} />
                  <NavItem indent label="All Open Accounts" active={activeView === "All Open Accounts"} onClick={() => loadView("All Open Accounts")} />
                </div>
              )}
            </NavSection>
          </aside>
        ) : (
          <div className="border-r border-[#E3E6EA] p-2">
            <button onClick={() => setNavOpen(true)} className="text-[#6b7280] hover:text-[#13294B]" aria-label="Expand navigator">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Right results pane */}
        <div className="flex-1 min-w-0 p-6">
          <div className="flex items-center gap-2 mb-1">
            <MinusCircle className="w-5 h-5 text-[#0A66C2]" />
            <h2 className="text-[20px] font-medium text-[#13294B]">{view.name}</h2>
            <button onClick={() => toggleFavorite(view.name)} aria-label="Favorite">
              <Star className={`w-5 h-5 ${favorites.has(view.name) ? "fill-[#F4B400] text-[#F4B400]" : "text-[#9ca3af]"}`} />
            </button>
          </div>
          <div className="text-[13px] text-[#6b7280] mb-5">{view.description}</div>

          <div className="flex items-end gap-6 mb-4 flex-wrap">
            <div>
              <div className="text-[12px] text-[#6b7280] flex items-center gap-1">Search Scope <Info className="w-3 h-3" /></div>
              <div className="text-[14px] text-[#13294B] mt-1">Accounts</div>
            </div>
            {view.required?.[0] && (
              <div>
                <div className="text-[12px] text-[#6b7280]">
                  {FIELD_LABEL[view.required[0].field]}<span className="text-[#b91c1c]">*</span>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 border border-[#D1D5DB] rounded-sm px-2 py-1.5">
                  <span className="text-[13px] text-[#13294B]">{view.required[0].value}</span>
                  <button className="text-[#9ca3af] hover:text-[#13294B]" aria-label="Clear">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-[#E3E6EA]" />
                  <button className="text-[#9ca3af] hover:text-[#13294B]" aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => setAddFiltersOpen(true)}
              className="text-[14px] text-[#0A66C2] hover:underline flex items-center gap-1 pb-1.5"
            >
              Add Filters ({filters.length}) <ChevronDown className="w-4 h-4" />
            </button>
            <button className="bg-[#0A66C2] hover:bg-[#0850a0] text-white text-[13px] font-medium px-6 py-2 rounded-sm">
              Run
            </button>
          </div>

          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-[#EEF4FB] border border-[#D6E4F1] text-[12px] text-[#13294B] px-2 py-1 rounded-sm">
                  {FIELD_LABEL[f.field]} {f.op} <strong>{f.value}</strong>
                  <button onClick={() => setFilters(filters.filter((_, j) => j !== i))} aria-label="Remove filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#E3E6EA] pt-3">
            <div className="text-[13px] text-[#6b7280]">
              <div>As of 06/19/2026</div>
              <div className="text-[#13294B]">{rows.length.toLocaleString()} Results</div>
            </div>
            <div className="flex items-center gap-5 text-[13px]">
              <label className="flex items-center gap-2 text-[#13294B]">
                Group By:
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as FieldKey | "none")}
                  className="border-none bg-transparent text-[#0A66C2] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="none">None</option>
                  {FIELDS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </label>
              <span className="text-[#E3E6EA]">|</span>
              <button className="flex items-center gap-1.5 text-[#0A66C2] hover:underline">
                <FileSpreadsheet className="w-4 h-4 text-[#1F7244]" /> Export to Excel
              </button>
              <span className="text-[#E3E6EA]">|</span>
              <button onClick={() => setManageColsOpen(true)} className="flex items-center gap-1.5 text-[#0A66C2] hover:underline">
                <Columns3 className="w-4 h-4" /> Manage Columns
              </button>
              <span className="text-[#E3E6EA]">|</span>
              <button className="text-[#0A66C2] hover:underline">Reset Widths</button>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto border border-[#E3E6EA]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E3E6EA]">
                  {columns.map((c) => {
                    const f = FIELDS.find((x) => x.key === c)!;
                    return (
                      <th
                        key={c}
                        onClick={() => toggleSort(c)}
                        className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] cursor-pointer hover:text-[#13294B] ${f.numeric ? "text-right" : "text-left"}`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {f.label}
                          {sortBy.key === c && (sortBy.dir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {grouped.map((g) => (
                  <Fragment key={g.key || "all"}>
                    {g.key && (
                      <tr className="bg-[#EEF4FB]">
                        <td colSpan={columns.length} className="px-3 py-1.5 text-[12px] font-semibold text-[#13294B]">
                          {g.key} ({g.rows.length})
                        </td>
                      </tr>
                    )}
                    {g.rows.map((row, ri) => (
                      <tr key={`${g.key}-${ri}`} className="border-b border-[#F0F2F5] hover:bg-[#FAFBFC]">
                        {columns.map((c) => {
                          const f = FIELDS.find((x) => x.key === c)!;
                          const val = row[c];
                          const display = f.numeric
                            ? Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : String(val);
                          const isAcct = c === "accountName";
                          const isHousehold = c === "household" && val !== "Not Part Of A Household";
                          return (
                            <td key={c} className={`px-3 py-2 ${f.numeric ? "text-right tabular-nums" : ""} ${(isAcct || isHousehold) ? "text-[#0A66C2]" : "text-[#13294B]"}`}>
                              {(isAcct || isHousehold) ? <a href="#" className="hover:underline">{display}</a> : display}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-8 text-center text-[#6b7280]">No results match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {manageColsOpen && (
        <ManageColumnsDrawer
          columns={columns}
          onChange={setColumns}
          onClose={() => setManageColsOpen(false)}
        />
      )}
      {addFiltersOpen && (
        <AddFiltersDrawer
          onAdd={(f) => setFilters([...filters, f])}
          onClose={() => setAddFiltersOpen(false)}
        />
      )}
    </AppShell>
  );
}


function InsightCard({ insight, accent, onAction }: { insight: Insight; accent: string; onAction: () => void }) {
  return (
    <div className="bg-white border border-[#E3E6EA] rounded-sm flex overflow-hidden min-h-[230px]">
      <div className="w-[5px] shrink-0" style={{ backgroundColor: accent }} />
      <div className="flex-1 min-w-0 p-4 flex flex-col">
        <div className="text-[12px] text-[#6b7280]">{insight.category}</div>
        <div className="text-[15px] font-semibold text-[#13294B] mt-1 leading-tight">{insight.title}</div>
        <div className="text-[12px] text-[#6b7280] mt-2 truncate">{insight.description}</div>
        <div className="text-[28px] font-semibold text-[#13294B] mt-3">{insight.metric}</div>
        <button onClick={onAction} className="text-[13px] text-[#0A66C2] hover:underline text-left mt-auto pt-2">
          {insight.action}
        </button>
      </div>
    </div>
  );
}

function NavSection({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <button onClick={onToggle} className="w-full flex items-center gap-1.5 px-1 py-1 text-[14px] text-[#0A66C2] font-medium hover:underline">
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        {label}
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

function NavItem({ label, active, onClick, indent }: { label: string; active?: boolean; onClick: () => void; indent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F0F2F5] ${indent ? "pl-9" : "pl-6"} ${active ? "bg-[#0A66C2] text-white hover:bg-[#0A66C2]" : "text-[#13294B]"}`}
    >
      {label}
    </button>
  );
}

function ManageColumnsDrawer({ columns, onChange, onClose }: { columns: FieldKey[]; onChange: (c: FieldKey[]) => void; onClose: () => void }) {
  const [local, setLocal] = useState<FieldKey[]>(columns);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function toggle(key: FieldKey) {
    setLocal((l) => (l.includes(key) ? l.filter((k) => k !== key) : [...l, key]));
  }
  function onDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...local];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setLocal(next);
    setDragIdx(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white w-[400px] h-full shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3E6EA]">
          <h3 className="text-[16px] font-semibold text-[#13294B]">Manage Columns</h3>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-[12px] text-[#6b7280] mb-3">Check fields to include as columns. Drag selected fields to reorder.</div>
          <div className="mb-4">
            <div className="text-[11px] uppercase font-semibold text-[#6b7280] mb-1">Selected (in display order)</div>
            {local.map((k, i) => {
              const f = FIELDS.find((x) => x.key === k)!;
              return (
                <div
                  key={k}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className="flex items-center gap-2 px-2 py-1.5 text-[13px] hover:bg-[#F0F2F5] cursor-move"
                >
                  <GripVertical className="w-4 h-4 text-[#9ca3af]" />
                  <input type="checkbox" checked readOnly onClick={() => toggle(k)} />
                  {f.label}
                </div>
              );
            })}
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold text-[#6b7280] mb-1">Available</div>
            {FIELDS.filter((f) => !local.includes(f.key)).map((f) => (
              <label key={f.key} className="flex items-center gap-2 px-2 py-1.5 text-[13px] hover:bg-[#F0F2F5] cursor-pointer">
                <span className="w-4" />
                <input type="checkbox" checked={false} onChange={() => toggle(f.key)} />
                {f.label}
              </label>
            ))}
          </div>
        </div>
        <div className="border-t border-[#E3E6EA] px-4 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="text-[13px] px-4 py-2 text-[#0A66C2]">Cancel</button>
          <button
            onClick={() => { onChange(local); onClose(); }}
            className="text-[13px] bg-[#0A66C2] text-white px-4 py-2 rounded-sm hover:bg-[#0850a0]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function AddFiltersDrawer({ onAdd, onClose }: { onAdd: (f: Filter) => void; onClose: () => void }) {
  const [field, setField] = useState<FieldKey>("advisor");
  const [op, setOp] = useState("contains");
  const [value, setValue] = useState("");
  const f = FIELDS.find((x) => x.key === field)!;
  const ops = f.numeric ? ["equals", ">", "<"] : ["contains", "equals", "not equals"];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white w-[400px] h-full shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3E6EA]">
          <h3 className="text-[16px] font-semibold text-[#13294B]">Add Filter</h3>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <label className="block">
            <div className="text-[12px] text-[#6b7280] mb-1">Field</div>
            <select value={field} onChange={(e) => { setField(e.target.value as FieldKey); setOp(FIELDS.find(x => x.key === e.target.value)?.numeric ? "equals" : "contains"); }} className="w-full border border-[#D1D5DB] rounded-sm px-2 py-2 text-[13px]">
              {FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="text-[12px] text-[#6b7280] mb-1">Operator</div>
            <select value={op} onChange={(e) => setOp(e.target.value)} className="w-full border border-[#D1D5DB] rounded-sm px-2 py-2 text-[13px]">
              {ops.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="text-[12px] text-[#6b7280] mb-1">Value</div>
            <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full border border-[#D1D5DB] rounded-sm px-2 py-2 text-[13px]" />
          </label>
        </div>
        <div className="border-t border-[#E3E6EA] px-4 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="text-[13px] px-4 py-2 text-[#0A66C2]">Cancel</button>
          <button
            onClick={() => { if (value) { onAdd({ field, op, value }); onClose(); } }}
            className="text-[13px] bg-[#0A66C2] text-white px-4 py-2 rounded-sm hover:bg-[#0850a0]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
