import { useState } from "react";

type Advisor = {
  firstName: string;
  lastName: string;
  advisorId: string;
  goesBy: string;
  company: string;
  crd: string;
  type: string;
  status: string;
  email: string;
  office: string;
};

const ADVISORS: Advisor[] = [
  { firstName: "Paul", lastName: "Malouf", advisorId: "321654987", goesBy: "Paul", company: "Sweets Wealth Partners", crd: "4482910", type: "Advisor", status: "Active", email: "pmalouf@advisor360.com", office: "Boston, MA" },
  { firstName: "Karen", lastName: "Condon", advisorId: "481029342", goesBy: "Kay", company: "Sweets Wealth Partners", crd: "5210934", type: "Advisor", status: "Active", email: "kcondon@advisor360.com", office: "Boston, MA" },
  { firstName: "Riva", lastName: "Threatt", advisorId: "598210034", goesBy: "Riva", company: "Threatt Financial Group", crd: "6103882", type: "Advisor", status: "Active", email: "rthreatt@advisor360.com", office: "Dallas, TX" },
  { firstName: "Nani", lastName: "Poole", advisorId: "672938401", goesBy: "Nan", company: "Poole Advisory LLC", crd: "3390124", type: "Advisor", status: "Inactive", email: "npoole@advisor360.com", office: "Chicago, IL" },
  { firstName: "Alex", lastName: "Baum", advisorId: "710238845", goesBy: "Alex", company: "Baum & Associates", crd: "7729110", type: "Registered Rep", status: "Active", email: "abaum@advisor360.com", office: "Denver, CO" },
  { firstName: "David", lastName: "Walker", advisorId: "884301992", goesBy: "Dave", company: "Walker Capital", crd: "2288301", type: "Registered Rep", status: "Active", email: "dwalker@advisor360.com", office: "Atlanta, GA" },
  { firstName: "Caroline", lastName: "Harris", advisorId: "902384710", goesBy: "Carrie", company: "Harris Wealth", crd: "9910233", type: "Advisor", status: "Pending", email: "charris@advisor360.com", office: "Boston, MA" },
  { firstName: "Tomas", lastName: "Martinez", advisorId: "119283746", goesBy: "Tom", company: "Martinez Planning", crd: "4410238", type: "Advisor", status: "Active", email: "tmartinez@advisor360.com", office: "Miami, FL" },
];

const LAST_VIEWED = [
  "Baum, Alex",
  "Walker, David",
  "Harris, Caroline",
  "Martinez, Tomas",
  "Dunaway, Becky",
  "Norton, June",
  "Gomez, Valerie",
  "Parker, Tyrone",
];

const EMPTY = {
  firstName: "",
  lastName: "",
  advisorId: "",
  goesBy: "",
  company: "",
  crd: "",
  type: "",
  status: "",
};

const inputCls =
  "w-full h-9 px-2 border border-[#B7BEC7] rounded-sm text-[13px] text-[#13294B] bg-white focus:outline-none focus:border-[#1A5FA8]";
const labelCls = "block text-[12px] text-[#6b7280] mb-1";

export function AdvisorInformationPage() {
  const [searchBy, setSearchBy] = useState<"person" | "firm">("person");
  const [form, setForm] = useState({ ...EMPTY });
  const [results, setResults] = useState<Advisor[] | null>(null);
  const [showViewed, setShowViewed] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const runSearch = () => {
    const m = (val: string, field: string) =>
      !val.trim() || field.toLowerCase().includes(val.trim().toLowerCase());
    setResults(
      ADVISORS.filter(
        (a) =>
          m(form.firstName, a.firstName) &&
          m(form.lastName, a.lastName) &&
          m(form.advisorId, a.advisorId) &&
          m(form.goesBy, a.goesBy) &&
          m(form.company, a.company) &&
          m(form.crd, a.crd) &&
          (!form.type || a.type === form.type) &&
          (!form.status || a.status === form.status),
      ),
    );
  };

  return (
    <div>
      {/* Sub bar */}
      <div className="bg-[#F2F4F6] border-b border-[#E3E6EA] px-6 py-3 flex items-center justify-between">
        <div className="text-[13px] text-[#13294B]">Search</div>
        <div className="flex items-center gap-3 text-[13px]">
          <button className="text-[#1A5FA8] hover:underline">Advanced Search</button>
          <span className="text-[#C9CED4]">|</span>
          <div className="relative">
            <button
              onClick={() => setActionsOpen((o) => !o)}
              className="text-[#1A5FA8] hover:underline inline-flex items-center gap-1"
            >
              Actions
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {actionsOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-[#E3E6EA] rounded-sm shadow-lg z-10 py-1 text-[13px] text-[#13294B]">
                {["Add Advisor", "Export Results", "Manage Saved Searches"].map((a) => (
                  <button key={a} className="block w-full text-left px-3 py-2 hover:bg-[#F5F8FC]">
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="bg-white border border-[#E3E6EA] rounded-sm p-5">
          <div className="mb-4">
            <div className="text-[13px] text-[#13294B] mb-2">Search by</div>
            <div className="flex items-center gap-8 text-[13px] text-[#13294B]">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={searchBy === "person"}
                  onChange={() => setSearchBy("person")}
                  className="accent-[#1A5FA8]"
                />
                Person
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={searchBy === "firm"}
                  onChange={() => setSearchBy("firm")}
                  className="accent-[#1A5FA8]"
                />
                Financial Institute
              </label>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-5 gap-y-4 max-w-[1050px]">
            {searchBy === "person" ? (
              <>
                <div>
                  <label className={labelCls}>First Name</label>
                  <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Advisor ID</label>
                  <input className={inputCls} value={form.advisorId} onChange={(e) => set("advisorId", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Goes By</label>
                  <input className={inputCls} value={form.goesBy} onChange={(e) => set("goesBy", e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-2">
                  <label className={labelCls}>Financial Institute Name</label>
                  <input className={inputCls} value={form.company} onChange={(e) => set("company", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Institute ID</label>
                  <input className={inputCls} value={form.advisorId} onChange={(e) => set("advisorId", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>CRD Number</label>
                  <input className={inputCls} value={form.crd} onChange={(e) => set("crd", e.target.value)} />
                </div>
              </>
            )}

            <div>
              <label className={labelCls}>Company Name</label>
              <input className={inputCls} value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>CRD Number</label>
              <input className={inputCls} value={form.crd} onChange={(e) => set("crd", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="">&nbsp;</option>
                <option>Advisor</option>
                <option>Registered Rep</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="">&nbsp;</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-4 max-w-[1050px]">
            <button
              className="text-[13px] text-[#1A5FA8] hover:underline"
              onClick={() => {
                setForm({ ...EMPTY });
                setResults(null);
              }}
            >
              Clear
            </button>
            <button
              onClick={runSearch}
              className="h-9 px-8 bg-[#1A5FA8] text-white text-[13px] rounded-sm hover:bg-[#154C88]"
            >
              Search
            </button>
          </div>

          {results === null ? (
            <div className="text-[13px] text-[#13294B] mt-4">You haven&apos;t searched yet. Start your search.</div>
          ) : results.length === 0 ? (
            <div className="text-[13px] text-[#13294B] mt-4">No advisors match your search criteria.</div>
          ) : (
            <div className="mt-5">
              <div className="text-[12px] text-[#6b7280] mb-2">{results.length} result{results.length === 1 ? "" : "s"}</div>
              <table className="w-full text-[13px]">
                <thead className="text-[#6b7280] text-left border-b border-[#E3E6EA]">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Advisor ID</th>
                    <th className="py-2 pr-3 font-medium">Company</th>
                    <th className="py-2 pr-3 font-medium">CRD</th>
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Office</th>
                  </tr>
                </thead>
                <tbody className="text-[#13294B]">
                  {results.map((a) => (
                    <tr key={a.advisorId} className="border-b border-[#E3E6EA]">
                      <td className="py-2 pr-3 text-[#1A5FA8]">{a.lastName}, {a.firstName}</td>
                      <td className="py-2 pr-3">{a.advisorId}</td>
                      <td className="py-2 pr-3">{a.company}</td>
                      <td className="py-2 pr-3">{a.crd}</td>
                      <td className="py-2 pr-3">{a.type}</td>
                      <td className="py-2 pr-3">{a.status}</td>
                      <td className="py-2 pr-3">{a.office}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => setShowViewed((s) => !s)}
              className="inline-flex items-center gap-2 text-[13px] text-[#13294B]"
            >
              <span className="w-4 h-4 rounded-full border border-[#1A5FA8] text-[#1A5FA8] flex items-center justify-center leading-none text-[12px]">
                {showViewed ? "−" : "+"}
              </span>
              Last Contacts Viewed
            </button>
            {showViewed && (
              <div className="mt-3 pl-6 flex flex-col gap-1.5">
                {LAST_VIEWED.map((n) => (
                  <button key={n} className="text-[13px] text-[#1A5FA8] hover:underline text-left w-fit">
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
