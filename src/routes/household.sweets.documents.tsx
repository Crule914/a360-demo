import { createFileRoute, Link } from "@tanstack/react-router";
import { SweetsDocumentsShell } from "@/components/sweets/SweetsDocumentsShell";
import { ChevronDown, FileText, Image as ImageIcon, Users } from "lucide-react";
import { useSourceFilter } from "@/lib/demoConfig";
import { useHouseholdDocumentsHasMenu } from "@/lib/navVisibility";

export const Route = createFileRoute("/household/sweets/documents")({
  component: DocumentsPage,
});

const FOLDERS_PROCESSING = [{ name: "Processing Required", count: 9 }];

const FOLDERS_NO_PROCESSING: { name: string; count?: number }[] = [
  { name: "View All" },
  { name: "Administrative Correspondence", count: 3 },
  { name: "Business Planning" },
  { name: "Confirms" },
  { name: "CRIA Annual Client Contact - Global" },
  { name: "Estate Planning" },
  { name: "Financial Planning/Notes", count: 5 },
  { name: "Historical Documents", count: 1 },
  { name: "Investment Correspondence", count: 8 },
  { name: "Investments", count: 3 },
];

type DocRow = {
  type: "pdf" | "image";
  hasParty?: boolean;
  title: string;
  uploadDate: string;
  clientName: string;
  ssn: string;
  account: string;
};

const ROWS: DocRow[] = [
  { type: "pdf", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "JAV032164" },
  { type: "pdf", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "EEP000907" },
  { type: "pdf", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "EEP000906" },
  { type: "image", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Rick Sweets", ssn: "***-**-9511", account: "567890" },
  { type: "pdf", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "4013332" },
  { type: "image", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Karen Sweets", ssn: "***-**-9511", account: "B3200564" },
  { type: "pdf", hasParty: true, title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard & Karen Sweets", ssn: "***-**-9511", account: "EEP000907" },
  { type: "pdf", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "JAV032164" },
  { type: "image", title: "BPM Conversion Doc", uploadDate: "06/24/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "B3200564" },
  { type: "pdf", title: "NFS Application", uploadDate: "06/22/2026", clientName: "Richard Sweets", ssn: "***-**-9511", account: "NFS100234" },
  { type: "pdf", title: "NFS Beneficiary Form", uploadDate: "06/22/2026", clientName: "Karen Sweets", ssn: "***-**-9511", account: "NFS200714" },
  { type: "pdf", title: "IWS Advisory Agreement", uploadDate: "06/20/2026", clientName: "Sweets Family Trust", ssn: "***-**-9511", account: "IWS500221" },
];

function FolderRow({
  name,
  count,
  active,
  indent,
  caret,
}: {
  name: string;
  count?: number;
  active?: boolean;
  indent?: boolean;
  caret?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] ${
        active ? "bg-[#1f6fb8] text-white" : "text-[#1f2937] hover:bg-[#f4f8fc]"
      } ${indent ? "pl-10" : ""}`}
    >
      {caret && <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
      {!caret && !indent && <span className="w-3.5" />}
      <span aria-hidden className="text-[14px]">
        📁
      </span>
      <span className="font-medium">
        {name}
        {typeof count === "number" && ` (${count})`}
      </span>
    </button>
  );
}

function DocumentsPage() {
  const keep = useSourceFilter();
  // CRM+ alone => only "No Processing Required"; CRM+ & Digital Onboarding => both
  const showProcessing = useHouseholdDocumentsHasMenu();
  const rows = ROWS.filter((r) => keep(r, () => `${r.title} ${r.account}`));
  return (
    <SweetsDocumentsShell>
      <div className="bg-white border-b border-[#d4dae3] flex items-center justify-between px-6 py-3">
        <div className="text-[14px] text-[#143A69]">Documents</div>
        <Link to="/household/sweets/documents" className="text-[13px] text-[#1f6fb8] hover:underline">
          View Upload Log
        </Link>
      </div>

      <div className="flex">
        {/* Left folder rail */}
        <aside className="w-[300px] bg-white border-r border-[#d4dae3] min-h-[700px]">
          <div className="px-4 pt-4 pb-2 text-[13px] text-[#1f6fb8] hover:underline cursor-pointer">
            Expand All Folders
          </div>
          {showProcessing && (
            <div className="border-b border-[#d4dae3]">
              {FOLDERS_PROCESSING.map((f) => (
                <FolderRow key={f.name} name={f.name} count={f.count} active />
              ))}
            </div>
          )}
          <div className="mt-2">
            <FolderRow name="No Processing Required" count={12} caret active={!showProcessing} />
            <div>
              {FOLDERS_NO_PROCESSING.map((f) => (
                <FolderRow key={f.name} name={f.name} count={f.count} indent />
              ))}
            </div>
          </div>
        </aside>

        {/* Table */}
        <main className="flex-1 bg-white">
          <div className="px-6 py-4 border-b border-[#d4dae3]">
            <div className="text-[15px] font-semibold text-[#143A69]">
              {showProcessing ? "Processing Required" : "No Processing Required"}
            </div>
            <div className="text-[12px] text-[#6b7280] mt-0.5">Showing {rows.length}</div>
          </div>

          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[12px] text-[#1f6fb8] uppercase border-b border-[#d4dae3]">
                <th className="px-4 py-2 w-8">
                  <input type="checkbox" />
                </th>
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 w-12"></th>
                <th className="px-2 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Upload D…</th>
                <th className="px-4 py-2 text-left">Client Name</th>
                <th className="px-4 py-2 text-left">SSN/TIN</th>
                <th className="px-4 py-2 text-left">Account No.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-[#eef1f5] hover:bg-[#f8fafc]">
                  <td className="px-4 py-2.5">
                    <input type="checkbox" />
                  </td>
                  <td className="px-2 py-2.5 text-[#6b7280]">⋮</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {r.type === "pdf" ? (
                        <span className="inline-flex items-center justify-center w-7 h-5 bg-[#d92d20] text-white text-[9px] font-bold rounded-sm">
                          PDF
                        </span>
                      ) : (
                        <ImageIcon className="w-5 h-5 text-[#1f6fb8]" />
                      )}
                      {r.hasParty && <Users className="w-4 h-4 text-[#1f2937]" />}
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <a className="text-[#1f6fb8] hover:underline cursor-pointer">{r.title}</a>
                  </td>
                  <td className="px-4 py-2.5">{r.uploadDate}</td>
                  <td className="px-4 py-2.5">{r.clientName}</td>
                  <td className="px-4 py-2.5">{r.ssn}</td>
                  <td className="px-4 py-2.5">{r.account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      <div className="px-5 py-4 text-[12px] text-[#6b7280]">
        For financial professional use only. Not for use with the public.
      </div>
      {/* keep icon imports used */}
      <span className="hidden">
        <FileText />
      </span>
    </SweetsDocumentsShell>
  );
}
