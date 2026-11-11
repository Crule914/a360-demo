import { createFileRoute } from "@tanstack/react-router";
import { SweetsDocumentsShell } from "@/components/sweets/SweetsDocumentsShell";
import { DocsToolbar, DocsTable, DocsRow } from "@/components/sweets/DocsTable";
import { useSourceFilter } from "@/lib/demoConfig";

export const Route = createFileRoute("/household/sweets/tax-documents")({
  component: TaxDocumentsPage,
});

const ROWS = [
  { docType: "1099", accountName: "Richard Sweets & Karen Sweets Joint w/Survivor Schwab - Mutual Fund Stra…", accountNumber: "EEP000907", taxYear: "2025", datePosted: "11/06/2025" },
  { docType: "1099", accountName: "Sweets Trust Schwab Brokerage (B3200564)", accountNumber: "B3200564", taxYear: "2025", datePosted: "11/06/2025" },
  { docType: "1099", accountName: "Richard Sweets Individual NFS - Brokerage (NFS100234)", accountNumber: "NFS100234", taxYear: "2025", datePosted: "11/06/2025" },
  { docType: "1099-R", accountName: "Karen Sweets IRA NFS - Brokerage (NFS200714)", accountNumber: "NFS200714", taxYear: "2025", datePosted: "11/06/2025" },
  { docType: "1099", accountName: "Sweets Family Trust IWS - Advisory (IWS500221)", accountNumber: "IWS500221", taxYear: "2025", datePosted: "11/06/2025" },
];

function TaxDocumentsPage() {
  const keep = useSourceFilter();
  const rows = ROWS.filter((r) => keep(r, () => r.accountName));
  return (
    <SweetsDocumentsShell>
      <DocsToolbar title="Tax Documents" />
      <DocsTable
        resultsLabel={`${rows.length} Results`}
        headers={["Document Type", "Account Name", "Account Number", "Tax Year ↓", "Date Posted"]}
      >
        {rows.map((r, i) => (
          <DocsRow
            key={i}
            cells={[
              <a className="text-[#1f6fb8] hover:underline cursor-pointer">{r.docType}</a>,
              r.accountName,
              r.accountNumber,
              r.taxYear,
              r.datePosted,
            ]}
          />
        ))}
      </DocsTable>
    </SweetsDocumentsShell>
  );
}
