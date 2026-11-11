import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Star,
  MinusCircle,
  X,
  Trash2,
  ArrowDown,
  ArrowUp,
  MoreVertical,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

type CaseRow = {
  number: string;
  name: string;
  type: string;
  created: string;
  status: "Open" | "Closed";
  assigned: string;
  queue: string;
};

const CASE_TYPES = ["Transaction Detail Form", "I-Mutual Fund 529 Application", "I-MSA"];

const NAMES = [
  "LINDA ADAMS", "ERIC ALLEN", "JAMES ANDERSON", "MICHAEL BROWN", "JESSICA CLARK",
  "STEVEN DAVIS", "ISABEL GARCIA", "LAURA GARCIA", "KAREN HARRIS", "ROBERT HARRIS",
  "EMILY JOHNSON", "DANIEL JONES", "BRIAN LEWIS", "JENNIFER MARTIN", "ANGELA MARTINEZ",
  "DAVID MARTINEZ", "MARIA MARTINEZ", "LAURA MILLER", "EMMA MOORE", "SARAH ROBINSON",
  "ANNA RODRIGUEZ", "HANNAH SCOTT", "ALEX SMITH", "OLIVIA TAYLOR", "MEGAN THOMAS",
  "CHARLES THOMPSON", "ANDREW WALKER", "RICK SWEETS", "KAREN SWEETS", "PETER DARSCH",
];

const RAW: Array<[string, string, string, string, "Open" | "Closed"]> = [
  ["5768355", NAMES[0], CASE_TYPES[0], "05/25/2025 10:07 AM", "Open"],
  ["5639985", NAMES[1], CASE_TYPES[1], "05/15/2025 05:31 PM", "Open"],
  ["5845251", NAMES[2], CASE_TYPES[1], "04/07/2025 04:41 PM", "Open"],
  ["5992467", NAMES[3], CASE_TYPES[2], "03/01/2025 11:44 AM", "Closed"],
  ["6878706", NAMES[4], CASE_TYPES[2], "02/13/2025 07:57 AM", "Open"],
  ["7012053", NAMES[5], CASE_TYPES[0], "01/09/2025 04:56 PM", "Open"],
  ["8565086", NAMES[6], CASE_TYPES[1], "11/30/2024 07:07 AM", "Open"],
  ["8568355", NAMES[7], CASE_TYPES[1], "11/28/2024 02:03 PM", "Open"],
  ["8793474", NAMES[8], CASE_TYPES[2], "11/22/2024 10:58 AM", "Closed"],
  ["8805119", NAMES[9], CASE_TYPES[2], "11/03/2024 04:35 PM", "Open"],
  ["8903963", NAMES[10], CASE_TYPES[0], "10/21/2024 01:37 PM", "Open"],
  ["9178412", NAMES[11], CASE_TYPES[1], "09/22/2024 12:59 PM", "Open"],
  ["9555796", NAMES[12], CASE_TYPES[1], "09/16/2024 09:23 AM", "Closed"],
  ["9643503", NAMES[13], CASE_TYPES[2], "07/08/2024 04:43 PM", "Open"],
  ["9863035", NAMES[14], CASE_TYPES[2], "05/16/2024 01:52 PM", "Open"],
  ["9928496", NAMES[15], CASE_TYPES[0], "11/16/2023 10:38 AM", "Open"],
  ["9975077", NAMES[16], CASE_TYPES[1], "10/20/2023 03:12 PM", "Open"],
  ["10605778", NAMES[17], CASE_TYPES[1], "10/12/2023 07:32 AM", "Closed"],
  ["10686419", NAMES[18], CASE_TYPES[2], "07/27/2023 12:43 PM", "Open"],
  ["10932098", NAMES[19], CASE_TYPES[2], "06/24/2023 12:19 PM", "Open"],
  ["10953691", NAMES[20], CASE_TYPES[1], "02/18/2023 11:07 AM", "Open"],
  ["11067940", NAMES[21], CASE_TYPES[0], "11/04/2022 08:36 AM", "Closed"],
  ["11122081", NAMES[22], CASE_TYPES[1], "10/01/2022 11:10 AM", "Open"],
  ["11185274", NAMES[23], CASE_TYPES[2], "09/26/2022 12:15 PM", "Open"],
  ["11199624", NAMES[24], CASE_TYPES[2], "07/03/2022 12:21 PM", "Open"],
  ["11287817", NAMES[25], CASE_TYPES[0], "07/01/2022 11:03 AM", "Open"],
  ["11449053", NAMES[26], CASE_TYPES[1], "11/12/2020 05:07 PM", "Closed"],
  ["11552310", NAMES[27], CASE_TYPES[0], "06/24/2026 05:30 PM", "Open"],
  ["11552311", NAMES[28], CASE_TYPES[1], "06/22/2026 09:12 AM", "Open"],
  ["11552312", NAMES[29], CASE_TYPES[2], "06/18/2026 02:40 PM", "Open"],
];

const OWNERS = ["Martina Lowell", "Peter Nguyen", "Dana Whitfield"];
const QUEUES = ["Compliance Cases", "Cashiering", "My Money Movement"];

const CASES: CaseRow[] = RAW.map((r, i) => ({
  number: r[0],
  name: r[1],
  type: r[2],
  created: r[3],
  status: r[4],
  assigned: OWNERS[i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2],
  queue: QUEUES[i % 3],
}));

type Filter = { id: number; field: string; op: string; value: string };

const FILTER_FIELDS = ["Case Type", "Status", "Case Number", "Case Title", "Queue", "TIN", "Account Number"];
const OPS = ["is", "is not", "contains"];

const VIEWS = [
  { group: "Default Views", items: ["My Work", "Recent Cases"] },
  { group: "Queues", items: QUEUES.slice(0, 2) },
  { group: "My Views", items: ["My Money Movement"] },
];

const QUICK_QUERIES = ["Case Number", "Case Title", "Assigned To", "TIN", "Account Number"];

const COLUMNS = ["Case Number", "Case Title", "Case Type", "Created Date", "Status", "Assigned To"] as const;

export function CaseManagerPage() {
  const [railOpen, setRailOpen] = useState(true);
  const [view, setView] = useState("My Work");
  const [favorite, setFavorite] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["Default Views", "Queues", "My Views"]);
  const [viewsOpen, setViewsOpen] = useState(true);
  const [favOpen, setFavOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [assignedTo, setAssignedTo] = useState("Martina Lowell");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [colsOpen, setColsOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<string[]>([...COLUMNS]);
  

  // "Run" applies the builder state to the results
  const [applied, setApplied] = useState<{ assignedTo: string; filters: Filter[]; view: string }>({
    assignedTo: "Martina Lowell",
    filters: [],
    view: "My Work",
  });

  const results = useMemo(() => {
    let rows = CASES.slice();
    if (applied.view === "Recent Cases") rows = rows.slice(0, 10);
    if (QUEUES.includes(applied.view)) rows = rows.filter((r) => r.queue === applied.view);
    if (applied.assignedTo.trim()) {
      rows = rows.filter((r) => r.assigned.toLowerCase().includes(applied.assignedTo.trim().toLowerCase()));
    }
    for (const f of applied.filters) {
      if (!f.value.trim()) continue;
      const get = (r: CaseRow) =>
        f.field === "Case Type" ? r.type
          : f.field === "Status" ? r.status
          : f.field === "Case Number" ? r.number
          : f.field === "Queue" ? r.queue
          : f.field === "Case Title" ? r.name
          : r.number;
      const v = f.value.toLowerCase();
      rows = rows.filter((r) => {
        const cell = get(r).toLowerCase();
        if (f.op === "is") return cell === v;
        if (f.op === "is not") return cell !== v;
        return cell.includes(v);
      });
    }
    rows.sort((a, b) => {
      const da = new Date(a.created).getTime();
      const db = new Date(b.created).getTime();
      return sortDesc ? db - da : da - db;
    });
    return rows;
  }, [applied, sortDesc]);

  const addFilter = () =>
    setFilters((f) => [...f, { id: Date.now() + Math.random(), field: "Case Type", op: "is", value: "" }]);

  const run = () => setApplied({ assignedTo, filters, view });

  const toggleGroup = (g: string) =>
    setOpenGroups((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));

  const selectView = (v: string) => {
    setView(v);
    setApplied({ assignedTo, filters, view: v });
  };

  const exportCsv = () => {
    const header = visibleCols.join(",");
    const lines = results.map((r) =>
      visibleCols
        .map((c) =>
          c === "Case Number" ? r.number
            : c === "Case Title" ? `${r.name} (${r.number})`
            : c === "Case Type" ? r.type
            : c === "Created Date" ? r.created
            : c === "Status" ? r.status
            : r.assigned,
        )
        .map((v) => `"${v}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cases.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const allChecked = results.length > 0 && selected.length === results.length;

  return (
    <div className="flex flex-col h-full bg-[#F4F6F8]">

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Left query rail */}
        {railOpen ? (
          <div className="w-[290px] shrink-0 bg-white border border-[#E3E6EA] flex flex-col">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setRailOpen(false)}
                aria-label="Collapse panel"
                className="p-1 text-[#6b7280] hover:text-[#13294B]"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
            <div className="px-5 pb-4 space-y-3">
              <button className="w-full h-9 bg-[#1A5FA8] text-white rounded-[2px] text-[14px] font-medium inline-flex items-center justify-center gap-1 hover:bg-[#164e8c]">
                <Plus size={16} /> New
              </button>
              <div className="relative">
                <Search size={15} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                <input
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full h-9 pl-7 pr-2 border border-[#C6CCD4] rounded-[2px] text-[14px] outline-none focus:border-[#1A5FA8]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 text-[14px]">
              <TreeToggle open={favOpen} onClick={() => setFavOpen((v) => !v)} label="Favorites" indent={0} />
              <TreeToggle open={viewsOpen} onClick={() => setViewsOpen((v) => !v)} label="Views" indent={0} />
              {viewsOpen &&
                VIEWS.map((g) => (
                  <div key={g.group}>
                    <button
                      onClick={() => toggleGroup(g.group)}
                      className="w-full flex items-center gap-1 pl-8 pr-4 py-1.5 text-[#13294B] hover:bg-[#F4F6F8]"
                    >
                      {openGroups.includes(g.group) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="text-[#6b7280]">▣</span>
                      <span className="font-medium">{g.group}</span>
                    </button>
                    {openGroups.includes(g.group) &&
                      g.items
                        .filter((i) => i.toLowerCase().includes(sidebarSearch.toLowerCase()))
                        .map((item) => (
                          <button
                            key={item}
                            onClick={() => selectView(item)}
                            className={`w-full text-left pl-[52px] pr-4 py-2 ${
                              view === item ? "bg-[#1A5FA8] text-white" : "text-[#13294B] hover:bg-[#F4F6F8]"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                  </div>
                ))}
              <TreeToggle open={quickOpen} onClick={() => setQuickOpen((v) => !v)} label="Quick Queries" indent={0} />
              {quickOpen &&
                QUICK_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setFilters([{ id: Date.now(), field: q, op: "contains", value: "" }]);
                      setFiltersOpen(true);
                    }}
                    className="w-full text-left pl-8 pr-4 py-2 text-[#13294B] hover:bg-[#F4F6F8]"
                  >
                    {q}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRailOpen(true)}
            aria-label="Expand panel"
            className="w-8 shrink-0 bg-white border border-[#E3E6EA] flex items-start justify-center pt-3 text-[#6b7280] hover:text-[#13294B]"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Results / query builder */}
        <div className="flex-1 min-w-0 bg-white border border-[#E3E6EA] flex flex-col">
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <MinusCircle size={20} className="text-[#1A5FA8]" />
              <h2 className="text-[20px] font-semibold text-[#13294B]">{view}</h2>
              <button onClick={() => setFavorite((v) => !v)} aria-label="Favorite view">
                <Star size={18} className={favorite ? "fill-[#E0B84A] text-[#E0B84A]" : "text-[#6b7280]"} />
              </button>
            </div>

            <div className="mt-4 text-[13px] text-[#13294B] font-medium">
              Assigned To<span className="text-[#B3261E]">*</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <div className="flex">
                <div className="relative">
                  <input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-[230px] h-9 pl-3 pr-8 border border-[#C6CCD4] rounded-l-[2px] text-[14px] outline-none focus:border-[#1A5FA8]"
                  />
                  {assignedTo && (
                    <button
                      onClick={() => setAssignedTo("")}
                      aria-label="Clear assigned to"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#13294B]"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setAssignedTo("");
                    setFilters([]);
                  }}
                  aria-label="Remove criteria"
                  className="h-9 w-9 border border-l-0 border-[#C6CCD4] rounded-r-[2px] flex items-center justify-center text-[#6b7280] hover:text-[#B3261E]"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="text-[14px] text-[#1A5FA8] inline-flex items-center gap-1 hover:underline"
                >
                  Add Filters ({filters.length + (assignedTo ? 1 : 0)})
                  {filtersOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>

              <button
                onClick={run}
                className="h-9 px-8 bg-[#1A5FA8] text-white rounded-[2px] text-[14px] font-medium hover:bg-[#164e8c]"
              >
                Run
              </button>
            </div>

            {filtersOpen && (
              <div className="mt-3 border border-[#E3E6EA] bg-[#FAFBFC] p-3 space-y-2">
                {filters.length === 0 && (
                  <div className="text-[13px] text-[#6b7280]">No additional filters. Add one to narrow results.</div>
                )}
                {filters.map((f) => (
                  <div key={f.id} className="flex flex-wrap items-center gap-2">
                    <select
                      value={f.field}
                      onChange={(e) =>
                        setFilters((s) => s.map((x) => (x.id === f.id ? { ...x, field: e.target.value } : x)))
                      }
                      className="h-9 px-2 border border-[#C6CCD4] rounded-[2px] text-[14px] bg-white"
                    >
                      {FILTER_FIELDS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    <select
                      value={f.op}
                      onChange={(e) =>
                        setFilters((s) => s.map((x) => (x.id === f.id ? { ...x, op: e.target.value } : x)))
                      }
                      className="h-9 px-2 border border-[#C6CCD4] rounded-[2px] text-[14px] bg-white"
                    >
                      {OPS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    {f.field === "Case Type" || f.field === "Status" || f.field === "Queue" ? (
                      <select
                        value={f.value}
                        onChange={(e) =>
                          setFilters((s) => s.map((x) => (x.id === f.id ? { ...x, value: e.target.value } : x)))
                        }
                        className="h-9 px-2 min-w-[240px] border border-[#C6CCD4] rounded-[2px] text-[14px] bg-white"
                      >
                        <option value="">Select…</option>
                        {(f.field === "Case Type" ? CASE_TYPES : f.field === "Status" ? ["Open", "Closed"] : QUEUES).map(
                          (x) => (
                            <option key={x}>{x}</option>
                          ),
                        )}
                      </select>
                    ) : (
                      <input
                        value={f.value}
                        onChange={(e) =>
                          setFilters((s) => s.map((x) => (x.id === f.id ? { ...x, value: e.target.value } : x)))
                        }
                        placeholder="Value"
                        className="h-9 px-2 min-w-[240px] border border-[#C6CCD4] rounded-[2px] text-[14px]"
                      />
                    )}
                    <button
                      onClick={() => setFilters((s) => s.filter((x) => x.id !== f.id))}
                      aria-label="Remove filter"
                      className="h-9 w-9 flex items-center justify-center text-[#6b7280] hover:text-[#B3261E]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button onClick={addFilter} className="text-[14px] text-[#1A5FA8] inline-flex items-center gap-1 hover:underline">
                  <Plus size={15} /> Add filter
                </button>
              </div>
            )}
          </div>

          {/* Results toolbar */}
          <div className="px-6 flex items-center justify-between border-t border-[#EEF1F4] pt-3">
            <div className="text-[15px] text-[#13294B]">{results.length} Cases</div>
            <div className="flex items-center gap-4 text-[14px]">
              <button onClick={exportCsv} className="text-[#1A5FA8] inline-flex items-center gap-1 hover:underline">
                <FileSpreadsheet size={16} className="text-[#217346]" /> Export to Excel
              </button>
              <span className="text-[#D5D9DE]">|</span>
              <div className="relative">
                <button
                  onClick={() => setColsOpen((v) => !v)}
                  className="text-[#1A5FA8] inline-flex items-center gap-1 hover:underline"
                >
                  <Settings size={16} /> Manage Columns
                </button>
                {colsOpen && (
                  <div className="absolute right-0 top-8 z-20 w-[220px] bg-white border border-[#E3E6EA] shadow-lg p-3 space-y-2">
                    {COLUMNS.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-[13px] text-[#13294B]">
                        <input
                          type="checkbox"
                          checked={visibleCols.includes(c)}
                          onChange={() =>
                            setVisibleCols((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
                          }
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto px-6 pb-6 mt-2">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="text-left text-[#1A5FA8] border-y border-[#E3E6EA]">
                  <th className="py-2 w-8">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() => setSelected(allChecked ? [] : results.map((r) => r.number))}
                      aria-label="Select all cases"
                    />
                  </th>
                  <th className="w-6" />
                  {visibleCols.includes("Case Number") && <th className="py-2 pr-4 font-medium border-l border-[#E3E6EA] pl-3">CASE NUMBER</th>}
                  {visibleCols.includes("Case Title") && <th className="py-2 pr-4 font-medium border-l border-[#E3E6EA] pl-3">CASE TITLE</th>}
                  {visibleCols.includes("Case Type") && <th className="py-2 pr-4 font-medium border-l border-[#E3E6EA] pl-3">CASE TYPE</th>}
                  {visibleCols.includes("Created Date") && (
                    <th className="py-2 pr-4 font-medium border-l border-[#E3E6EA] pl-3">
                      <button onClick={() => setSortDesc((v) => !v)} className="inline-flex items-center gap-1">
                        CREATED DATE {sortDesc ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                      </button>
                    </th>
                  )}
                  {visibleCols.includes("Status") && <th className="py-2 pr-4 font-medium border-l border-[#E3E6EA] pl-3">STATUS</th>}
                  {visibleCols.includes("Assigned To") && <th className="py-2 pr-4 font-medium border-l border-[#E3E6EA] pl-3">ASSIGNED TO</th>}
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.number} className="border-b border-[#EEF1F4] hover:bg-[#F7FAFD]">
                    <td className="py-2">
                      <input
                        type="checkbox"
                        aria-label={`Select case ${r.number}`}
                        checked={selected.includes(r.number)}
                        onChange={() =>
                          setSelected((s) =>
                            s.includes(r.number) ? s.filter((x) => x !== r.number) : [...s, r.number],
                          )
                        }
                      />
                    </td>
                    <td className="text-[#6b7280]">
                      <MoreVertical size={15} />
                    </td>
                    {visibleCols.includes("Case Number") && (
                      <td className="py-2 pr-4 pl-3 text-[#1A5FA8]">{r.number}</td>
                    )}
                    {visibleCols.includes("Case Title") && (
                      <td className="py-2 pr-4 pl-3 text-[#13294B]">{`${r.name} (${r.number})`}</td>
                    )}
                    {visibleCols.includes("Case Type") && <td className="py-2 pr-4 pl-3 text-[#13294B]">{r.type}</td>}
                    {visibleCols.includes("Created Date") && (
                      <td className="py-2 pr-4 pl-3 text-[#13294B]">{r.created}</td>
                    )}
                    {visibleCols.includes("Status") && <td className="py-2 pr-4 pl-3 text-[#13294B]">{r.status}</td>}
                    {visibleCols.includes("Assigned To") && (
                      <td className="py-2 pr-4 pl-3 text-[#13294B]">{r.assigned}</td>
                    )}
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[#6b7280]">
                      No cases match the current query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeToggle({
  open,
  onClick,
  label,
  indent,
}: {
  open: boolean;
  onClick: () => void;
  label: string;
  indent: number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1 py-1.5 pr-4 text-[#1A5FA8] font-medium hover:bg-[#F4F6F8]"
      style={{ paddingLeft: 20 + indent * 16 }}
    >
      {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      {label}
    </button>
  );
}
