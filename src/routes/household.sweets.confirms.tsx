import { createFileRoute } from "@tanstack/react-router";
import { SweetsDocumentsShell } from "@/components/sweets/SweetsDocumentsShell";
import { DocsToolbar, DocsTable, DocsRow } from "@/components/sweets/DocsTable";
import { useSourceFilter } from "@/lib/demoConfig";

export const Route = createFileRoute("/household/sweets/confirms")({
  component: ConfirmsPage,
});

const ROWS = [
  { tradeDate: "10/22/2025", accountName: "Sweets Trust Schwab Brokerage (B3200564)", accountNumber: "B3200564", status: "Open" },
  { tradeDate: "10/20/2025", accountName: "Richard Sweets Individual NFS - Brokerage (NFS100234)", accountNumber: "NFS100234", status: "Open" },
  { tradeDate: "10/15/2025", accountName: "Sweets Family Trust IWS - Advisory (IWS500221)", accountNumber: "IWS500221", status: "Open" },
];

function ConfirmsPage() {
  const keep = useSourceFilter();
  const rows = ROWS.filter((r) => keep(r, () => r.accountName));
  return (
    <SweetsDocumentsShell>
      <DocsToolbar title="Confirms" />
      <DocsTable
        resultsLabel={`${rows.length} Result${rows.length === 1 ? "" : "s"}`}
        headers={["Trade Date ↓", "Account Name", "Account Number", "Account Status"]}
      >
        {rows.map((r, i) => (
          <DocsRow
            key={i}
            cells={[
              <a className="text-[#1f6fb8] hover:underline cursor-pointer">{r.tradeDate}</a>,
              r.accountName,
              r.accountNumber,
              r.status,
            ]}
          />
        ))}
      </DocsTable>
    </SweetsDocumentsShell>
  );
}
