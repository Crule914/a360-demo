import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Filter,
  Folder,
  MoreVertical,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/operations/forms")({
  head: () => ({
    meta: [
      { title: "Forms — Operations | Advisor360°" },
      {
        name: "description",
        content:
          "Search, e-sign, download and manage custodial and sponsor forms across your practice.",
      },
      { property: "og:title", content: "Forms — Operations | Advisor360°" },
      {
        property: "og:description",
        content:
          "Search, e-sign, download and manage custodial and sponsor forms across your practice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FormsLibraryPage,
});

type FormRow = {
  id: number;
  name: string;
  status: "Live" | string;
  draft?: string;
  top: boolean;
  category: string;
  extra?: number;
  published: string;
  folder: string;
};

const FOLDERS = ["Schwab", "Sponsor", "Middlebrook Financial", "Acorn Brokerage"];

const NAMES: [string, string, string][] = [
  ["Schwab One® Account Application", "Account Maintenance", "Schwab"],
  ["Account Transfer Form (ACAT)", "Account Maintenance", "Middlebrook Financial"],
  ["Advisory Fee Authorization", "Compensation", "Schwab"],
  ["Change of Address Request", "Account Maintenance", "Schwab"],
  ["Beneficiary Designation — Non-Retirement", "Account Maintenance", "Schwab"],
  ["Standing Letter of Authorization", "Account Maintenance", "Middlebrook Financial"],
  ["Duplicate Statement Request", "Account Maintenance", "Schwab"],
  ["Account Feature Application (Options)", "Account Maintenance", "Schwab"],
  ["Solicitor Disclosure Statement", "Compensation", "Middlebrook Financial"],
  ["Rep Commission Split Agreement", "Compensation", "Acorn Brokerage"],
  ["Traditional IRA Application", "Retirement", "Schwab"],
  ["Limited Power of Attorney", "Account Maintenance", "Schwab"],
  ["Trusted Contact Person Form", "Account Maintenance", "Schwab"],
  ["Cash Journal Request", "Account Maintenance", "Schwab"],
  ["W-9 Request for Taxpayer ID", "Account Maintenance", "Schwab"],
  ["Roth IRA Conversion Request", "Retirement", "Schwab"],
  ["Trust Certification of Investment Powers", "Account Maintenance", "Middlebrook Financial"],
  ["Electronic Delivery Consent", "Account Maintenance", "Schwab"],
  ["Inherited IRA Application", "Retirement", "Schwab"],
  ["Account Restriction Removal", "Account Maintenance", "Schwab"],
  ["Investment Advisory Agreement (ADV Part 2)", "Compliance", "Middlebrook Financial"],
  ["Required Minimum Distribution Request", "Retirement", "Schwab"],
  ["IRA Distribution Request", "Retirement", "Schwab"],
  ["Third-Party Wire Authorization", "Account Maintenance", "Middlebrook Financial"],
  ["Margin Account Agreement", "Trading", "Schwab"],
  ["Options Trading Application", "Trading", "Schwab"],
  ["UTMA/UGMA Custodial Application", "Account Maintenance", "Schwab"],
  ["Move Money Authorization", "Account Maintenance", "Schwab"],
  ["Journal Between Accounts Request", "Cashiering", "Middlebrook Financial"],
  ["Check Writing Application", "Cashiering", "Schwab"],
  ["SEP IRA Adoption Agreement", "Retirement", "Schwab"],
  ["Automatic Investment Plan Enrollment", "Account Maintenance", "Middlebrook Financial"],
  ["Foreign Account Certification (W-8BEN)", "Compliance", "Schwab"],
  ["Equity Award Distribution Request", "Trading", "Schwab"],
  ["Deceased Account Transfer Instructions", "Account Maintenance", "Schwab"],
  ["529 Education Savings Plan Application", "Account Maintenance", "Schwab"],
  ["Bank Link (ACH) Authorization", "Cashiering", "Schwab"],
  ["Corporate Resolution of Authority", "Account Maintenance", "Middlebrook Financial"],
  ["SIMPLE IRA Employer Adoption", "Retirement", "Schwab"],
  ["Fee Billing Schedule Change", "Compensation", "Acorn Brokerage"],
];

const ROWS: FormRow[] = NAMES.map(([name, category, folder], i) => ({
  id: i + 1,
  name,
  status: i === 19 ? "Draft (8/11/24)" : i === 38 ? "Draft (8/04/24)" : "Live",
  top: i < 10,
  category,
  extra: i === 0 || i === 1 ? 2 : i === 2 ? 3 : undefined,
  published: i === 38 ? "--" : "March 10, 2024",
  folder: i === 38 ? "--" : folder,
}));

const MENU_ITEMS = [
  "Send with E-Sign",
  "Download",
  "Remove from My Top Forms",
  "Edit",
  "Archive",
];

function FormsLibraryPage() {
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

  const rows = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          (!folder || r.folder === folder) &&
          r.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, folder],
  );

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="Operations"
          title="Forms"
          rightActions={
            <button className="text-white/90 hover:text-white" aria-label="Open in new window">
              <ExternalLink className="w-5 h-5" />
            </button>
          }
        />
      }
    >
      <div className="p-4">
        <div className="bg-white border border-[#E3E6EA] rounded-[2px] flex min-h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <aside className="w-[260px] shrink-0 border-r border-[#E3E6EA] flex flex-col">
            <div className="px-4 py-4 flex items-center gap-2 text-[14px] text-[#13294B]">
              <Folder className="w-4 h-4 text-[#6b7280] fill-[#6b7280]" />
              Forms
            </div>
            <nav className="text-[14px]">
              <button
                onClick={() => setFolder(null)}
                className={`w-full text-left px-4 py-2 ${
                  folder === null
                    ? "bg-[#0B79D0] text-white"
                    : "text-[#13294B] hover:bg-[#F0F2F5]"
                }`}
              >
                View All
              </button>
              {[
                { label: "Schwab", count: 1050 },
                { label: "Sponsor", count: 1223 },
              ].map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFolder(f.label)}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                    folder === f.label
                      ? "bg-[#0B79D0] text-white"
                      : "text-[#13294B] hover:bg-[#F0F2F5]"
                  }`}
                >
                  <Folder className="w-4 h-4 text-[#6b7280] fill-[#6b7280]" />
                  {f.label} ({f.count})
                </button>
              ))}
              <div>
                <div className="flex items-center">
                  <button
                    onClick={() => setExpanded((e) => !e)}
                    className="pl-2 pr-1 py-2 text-[#6b7280]"
                    aria-label="Toggle folder"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${expanded ? "" : "-rotate-90"}`}
                    />
                  </button>
                  <button
                    onClick={() => setFolder("Middlebrook Financial")}
                    className={`flex-1 text-left pr-4 py-2 flex items-center gap-2 ${
                      folder === "Middlebrook Financial"
                        ? "bg-[#0B79D0] text-white"
                        : "text-[#13294B] hover:bg-[#F0F2F5]"
                    }`}
                  >
                    <Folder className="w-4 h-4 text-[#6b7280] fill-[#6b7280]" />
                    Middlebrook Financial (54)
                  </button>
                </div>
                {expanded && (
                  <button
                    onClick={() => setFolder("Acorn Brokerage")}
                    className={`w-full text-left pl-10 pr-4 py-2 flex items-center gap-2 ${
                      folder === "Acorn Brokerage"
                        ? "bg-[#0B79D0] text-white"
                        : "text-[#13294B] hover:bg-[#F0F2F5]"
                    }`}
                  >
                    <Folder className="w-4 h-4 text-[#6b7280] fill-[#6b7280]" />
                    ADV Forms (35)
                  </button>
                )}
              </div>
            </nav>
            <div className="mt-auto border-t border-[#E3E6EA] mx-4" />
            <div className="px-4 py-4 flex items-center gap-2 text-[14px] text-[#13294B]">
              <Folder className="w-4 h-4 text-[#6b7280] fill-[#6b7280]" />
              Archive (5)
            </div>
          </aside>

          {/* Table area */}
          <div className="flex-1 min-w-0 p-5">
            <div className="flex items-start justify-between">
              <h2 className="text-[22px] text-[#13294B]">Forms</h2>
              <div className="relative w-[360px]">
                <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search forms"
                  className="w-full h-[34px] pl-9 pr-3 border border-[#C7CCD3] rounded-[2px] text-[14px] text-[#13294B] placeholder:text-[#6b7280]"
                />
              </div>
            </div>

            <div className="mt-4 text-[14px] text-[#13294B]">
              Showing {rows.length}
            </div>

            <div className="mt-3 overflow-auto max-h-[calc(100vh-280px)]">
              <table className="w-full text-[13px] border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-[#1A5FA8] text-left border-b border-[#C7CCD3]">
                    <th className="w-9 py-2" />
                    <th className="w-8" />
                    <th className="py-2 font-normal">
                      <span className="underline">NAME</span>
                      <HeaderFilter />
                    </th>
                    <th className="py-2 font-normal border-l border-[#E3E6EA] pl-3">
                      STATUS
                      <HeaderFilter />
                    </th>
                    <th className="py-2 font-normal border-l border-[#E3E6EA] pl-3 whitespace-nowrap">
                      TOP FORMS ↑
                    </th>
                    <th className="py-2 font-normal border-l border-[#E3E6EA] pl-3">
                      CATEGORY
                      <HeaderFilter />
                    </th>
                    <th className="py-2 font-normal border-l border-[#E3E6EA] pl-3 whitespace-nowrap">
                      LAST PUBLISHED
                      <HeaderFilter />
                    </th>
                    <th className="py-2 font-normal border-l border-[#E3E6EA] pl-3">
                      FOLDER
                      <HeaderFilter />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-[#E3E6EA] hover:bg-[#F7F9FB]">
                      <td className="py-2 pl-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(r.id)}
                          onChange={() => toggle(r.id)}
                          aria-label={`Select ${r.name}`}
                          className="w-4 h-4 accent-[#0B79D0]"
                        />
                      </td>
                      <td>
                        <RowMenu />
                      </td>
                      <td className="py-2 pr-3">
                        <button className="text-[#1A5FA8] hover:underline text-left">
                          {r.name}
                        </button>
                      </td>
                      <td className="py-2 pl-3">
                        {r.status === "Live" ? (
                          <span className="bg-[#E6F4E6] text-[#1E7A1E] px-2 py-0.5 rounded-[2px]">
                            Live
                          </span>
                        ) : (
                          <span className="bg-[#FCF3D2] text-[#8A6A12] px-2 py-0.5 rounded-[2px]">
                            {r.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2 pl-3">
                        {r.top && (
                          <CheckCircle2 className="w-[18px] h-[18px] text-[#1E7A1E]" />
                        )}
                      </td>
                      <td className="py-2 pl-3">
                        <span className="bg-[#EDEFF2] text-[#13294B] px-2 py-0.5 rounded-[2px]">
                          {r.category}
                        </span>
                        {r.extra && (
                          <span className="ml-2 text-[#6b7280]">+{r.extra}</span>
                        )}
                      </td>
                      <td className="py-2 pl-3 text-[#13294B] whitespace-nowrap">
                        {r.published}
                      </td>
                      <td className="py-2 pl-3 text-[#13294B] whitespace-nowrap">
                        {r.folder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function HeaderFilter() {
  return (
    <Filter className="w-3.5 h-3.5 inline-block ml-2 text-[#1A5FA8] fill-[#1A5FA8]" />
  );
}

function RowMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="text-[#6b7280] hover:text-[#13294B] px-1"
          aria-label="Row actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[230px] rounded-[2px] py-2">
        {MENU_ITEMS.map((m) => (
          <DropdownMenuItem
            key={m}
            className="text-[14px] text-[#1A5FA8] px-4 py-2 cursor-pointer focus:text-[#1A5FA8]"
          >
            {m}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
