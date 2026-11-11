import { createFileRoute } from "@tanstack/react-router";
import { SweetsDocumentsShell } from "@/components/sweets/SweetsDocumentsShell";
import { DocsToolbar, DocsTable, DocsRow } from "@/components/sweets/DocsTable";
import { useSourceFilter } from "@/lib/demoConfig";

export const Route = createFileRoute("/household/sweets/customer-correspondence")({
  component: CustomerCorrespondencePage,
});

const ROWS = [
  { docType: "Revised Acct Profile", accountName: "Rick IRA Rollover Schwab - Brokerage (567890)", accountNumber: "567890", date: "06/24/2026", status: "Open" },
  { docType: "eDelivery Email Address Change RAP", accountName: "Rick IRA Rollover Schwab - Brokerage (567890)", accountNumber: "567890", date: "06/05/2026", status: "Open" },
  { docType: "3 Yr Account Profile", accountName: "Richard Sweets & Karen Sweets Joint w/Survivor Schwab - Mutual Fund Stra…", accountNumber: "EEP000907", date: "04/20/2026", status: "Open" },
  { docType: "3 Yr Account Profile", accountName: "Richard Sweets IRA Schwab - Mutual Fund Strategist (EEP000906)", accountNumber: "EEP000906", date: "04/20/2026", status: "Open" },
  { docType: "Revised Acct Profile", accountName: "Richard Sweets Individual NFS - Brokerage (NFS100234)", accountNumber: "NFS100234", date: "05/12/2026", status: "Open" },
  { docType: "3 Yr Account Profile", accountName: "Karen Sweets IRA NFS - Brokerage (NFS200714)", accountNumber: "NFS200714", date: "04/28/2026", status: "Open" },
  { docType: "eDelivery Enrollment", accountName: "Sweets Family Trust IWS - Advisory (IWS500221)", accountNumber: "IWS500221", date: "03/15/2026", status: "Open" },
];

function CustomerCorrespondencePage() {
  const keep = useSourceFilter();
  const rows = ROWS.filter((r) => keep(r, () => r.accountName));
  return (
    <SweetsDocumentsShell>
      <DocsToolbar title="Customer Correspondence" />
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
