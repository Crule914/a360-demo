import { createFileRoute } from "@tanstack/react-router";
import { SweetsDocumentsShell } from "@/components/sweets/SweetsDocumentsShell";
import { DocsToolbar, DocsTable, DocsRow } from "@/components/sweets/DocsTable";
import { useSourceFilter } from "@/lib/demoConfig";

export const Route = createFileRoute("/household/sweets/statements")({
  component: StatementsPage,
});

type Row = { docType: string; accountName: string; accountNumber: string; date: string; status: string };

const ROWS: Row[] = [
  { docType: "Schwab Statement", accountName: "Richard Sweets Individual Schwab - Brokerage (JAV032164)", accountNumber: "JAV032164", date: "10/31/2025", status: "Open" },
  { docType: "Schwab Statement", accountName: "Richard Sweets & Karen Sweets Joint w/Survivor Schwab - Mutual Fund Stra…", accountNumber: "EEP000907", date: "10/31/2025", status: "Open" },
  { docType: "Schwab Statement", accountName: "Richard Sweets IRA Schwab - Mutual Fund Strategist (EEP000906)", accountNumber: "EEP000906", date: "10/31/2025", status: "Open" },
  { docType: "Schwab Statement", accountName: "Rick IRA Rollover Schwab - Brokerage (567890)", accountNumber: "567890", date: "10/31/2025", status: "Open" },
  { docType: "M/Q Statement HH Summary", accountName: "Sweets Traditional IRA BD Schwab - Mutual Fund Strategist (4013332)", accountNumber: "4013332", date: "10/31/2025", status: "Open" },
  { docType: "Schwab Statement", accountName: "Sweets Traditional IRA BD Schwab - Mutual Fund Strategist (4013332)", accountNumber: "4013332", date: "10/31/2025", status: "Open" },
  { docType: "M/Q Statement HH Summary", accountName: "Sweets Trust Schwab Brokerage (B3200564)", accountNumber: "B3200564", date: "10/31/2025", status: "Open" },
  { docType: "Schwab Statement", accountName: "Sweets Trust Schwab Brokerage (B3200564)", accountNumber: "B3200564", date: "10/31/2025", status: "Open" },
  { docType: "NFS Statement", accountName: "Richard Sweets Individual NFS - Brokerage (NFS100234)", accountNumber: "NFS100234", date: "10/31/2025", status: "Open" },
  { docType: "NFS Statement", accountName: "Richard Sweets & Karen Sweets Joint NFS - Brokerage (NFS100888)", accountNumber: "NFS100888", date: "10/31/2025", status: "Open" },
  { docType: "IWS Statement", accountName: "Sweets Family Trust IWS - Advisory (IWS500221)", accountNumber: "IWS500221", date: "10/31/2025", status: "Open" },
  { docType: "IWS Statement", accountName: "Richard Sweets IRA IWS - Advisory (IWS500445)", accountNumber: "IWS500445", date: "10/31/2025", status: "Open" },
];

function StatementsPage() {
  const keep = useSourceFilter();
  const rows = ROWS.filter((r) => keep(r, () => `${r.docType} ${r.accountName}`));
  return (
    <SweetsDocumentsShell>
      <DocsToolbar title="Statements" />
      <DocsTable
        resultsLabel={`${rows.length} Results`}
        headers={["Document Type", "Account Name", "Account Number", "Date ↓", "Account Status"]}
      >
        {rows.map((r, i) => (
          <DocsRow
            key={i}
            cells={[
              <a className="text-[#1f6fb8] hover:underline cursor-pointer">{r.docType}</a>,
              r.accountName,
              r.accountNumber,
              r.date,
              r.status,
            ]}
          />
        ))}
      </DocsTable>
    </SweetsDocumentsShell>
  );
}
