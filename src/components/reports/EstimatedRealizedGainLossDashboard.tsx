import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AISummarySection } from "./AISummarySection";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

interface Transaction {
  closeDate: string;
  description: string;
  estimatedTaxCost: number;
  proceeds: number;
  shortTerm: number;
  longTerm: number;
}

interface AccountData {
  accountNumber: string;
  accountName: string;
  transactions: Transaction[];
}

const accountsData: AccountData[] = [
  {
    accountNumber: "xxxx6508",
    accountName: "Rick & Karen Sweets — Joint Brokerage",
    transactions: [
      { closeDate: "3/14/2026", description: "Schwab US Broad Market ETF (SCHB)", estimatedTaxCost: 2840.18, proceeds: 18250.40, shortTerm: 0.0, longTerm: 4620.18 },
      { closeDate: "3/14/2026", description: "Schwab Intl Equity ETF (SCHF)", estimatedTaxCost: 1218.92, proceeds: 8420.30, shortTerm: 0.0, longTerm: 1890.55 },
      { closeDate: "4/2/2026", description: "Schwab US Dividend Equity ETF (SCHD) — rebalance trim", estimatedTaxCost: 980.55, proceeds: 12410.05, shortTerm: 0.0, longTerm: 2150.40 },
      { closeDate: "4/2/2026", description: "Total xxxx6508", estimatedTaxCost: 5039.65, proceeds: 39080.75, shortTerm: 0.0, longTerm: 8661.13 },
    ],
  },
  {
    accountNumber: "xxxx7886",
    accountName: "Rick Sweets — Schwab IRA",
    transactions: [
      { closeDate: "2/18/2026", description: "Schwab Aggregate Bond ETF (SCHZ) — duration trim", estimatedTaxCost: 0.0, proceeds: 9420.18, shortTerm: 0.0, longTerm: 0.0 },
      { closeDate: "2/18/2026", description: "Schwab Emerging Markets ETF (SCHE)", estimatedTaxCost: 0.0, proceeds: 4150.92, shortTerm: 0.0, longTerm: 0.0 },
      { closeDate: "2/18/2026", description: "Total xxxx7886", estimatedTaxCost: 0.0, proceeds: 13571.10, shortTerm: 0.0, longTerm: 0.0 },
    ],
  },
];

export const EstimatedRealizedGainLossDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: Props) => {
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Estimated Realized Gain and Loss"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  YTD estimated tax cost across Sweets taxable accounts:{" "}
                  <span className="font-bold">$5,039.65</span>.
                </li>
                <li>
                  Rebalance trims of SCHB and SCHF generated{" "}
                  <span className="font-bold">$8,661.13</span> in long-term capital gains.
                </li>
                <li>IRA trades inside xxxx7886 are non-taxable (Schwab IRA shelter).</li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          {accountsData.map((account) => (
            <div key={account.accountNumber} className="bg-card rounded-lg border shadow-sm">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold text-foreground">
                  Account {account.accountNumber} {account.accountName}
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Close Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-[150px]">Estimated Tax Cost ($)</TableHead>
                    <TableHead className="text-right w-[120px]">Proceeds ($)</TableHead>
                    <TableHead className="text-right w-[150px]">Gain/Loss Short Term ($)</TableHead>
                    <TableHead className="text-right w-[150px]">Gain/Loss Long Term ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.transactions.map((t, index) => {
                    const isTotal = t.description.startsWith("Total");
                    return (
                      <TableRow key={index} className={isTotal ? "font-semibold bg-muted/20" : ""}>
                        <TableCell className="font-medium">{t.closeDate}</TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell className="text-right">{fmt(t.estimatedTaxCost)}</TableCell>
                        <TableCell className="text-right">{fmt(t.proceeds)}</TableCell>
                        <TableCell className="text-right">{fmt(t.shortTerm)}</TableCell>
                        <TableCell className="text-right">{fmt(t.longTerm)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
