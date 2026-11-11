import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { AISummarySection } from "./AISummarySection";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

const holdingsData = [
  { description: "Sweets Joint Brokerage (xxxx6508)", quantity: "", price: "", value: "", pctAssets: "", estIncome: "", currentYield: "", isHeader: true },
  { description: "Schwab US Broad Market ETF (SCHB)", quantity: "11,520.000", price: "53.17", value: "612,480.50", pctAssets: "18.12", estIncome: "8,920.00", currentYield: "1.46" },
  { description: "Schwab US Large-Cap ETF (SCHX)", quantity: "5,420.000", price: "64.51", value: "349,665.00", pctAssets: "10.34", estIncome: "4,580.00", currentYield: "1.31" },
  { description: "Schwab Intl Equity ETF (SCHF)", quantity: "8,140.000", price: "35.15", value: "286,140.20", pctAssets: "8.47", estIncome: "7,720.00", currentYield: "2.70" },
  { description: "Schwab US Dividend Equity ETF (SCHD)", quantity: "1,440.000", price: "86.75", value: "124,918.45", pctAssets: "3.69", estIncome: "4,820.00", currentYield: "3.86" },
  { description: "Schwab Government Money Fund (SNVXX)", quantity: "186,420.180", price: "1.00", value: "186,420.18", pctAssets: "5.51", estIncome: "9,540.00", currentYield: "5.12" },
  { description: "Rick Sweets — Schwab IRA (xxxx7886)", quantity: "", price: "", value: "", pctAssets: "", estIncome: "", currentYield: "", isHeader: true },
  { description: "Schwab Total Stock Market Index (SWTSX)", quantity: "6,310.000", price: "83.82", value: "528,900.30", pctAssets: "15.64", estIncome: "6,945.00", currentYield: "1.31" },
  { description: "Schwab US Aggregate Bond ETF (SCHZ)", quantity: "12,540.000", price: "24.92", value: "312,410.00", pctAssets: "9.24", estIncome: "13,420.00", currentYield: "4.29" },
  { description: "Schwab Emerging Markets ETF (SCHE)", quantity: "5,420.000", price: "25.51", value: "138,290.70", pctAssets: "4.09", estIncome: "2,140.00", currentYield: "1.55" },
  { description: "Karen Sweets — Schwab Roth IRA (xxxx7319)", quantity: "", price: "", value: "", pctAssets: "", estIncome: "", currentYield: "", isHeader: true },
  { description: "Schwab International Index Fund (SWISX)", quantity: "5,420.000", price: "23.20", value: "125,750.40", pctAssets: "3.72", estIncome: "3,140.00", currentYield: "2.50" },
  { description: "Schwab US REIT ETF (SCHH)", quantity: "7,420.000", price: "20.59", value: "152,780.90", pctAssets: "4.52", estIncome: "5,420.00", currentYield: "3.55" },
  { description: "Schwab Mid-Cap ETF (SCHM)", quantity: "1,012.000", price: "78.49", value: "79,430.40", pctAssets: "2.35", estIncome: "1,140.00", currentYield: "1.43" },
  { description: "Schwab Municipal Bond ETF (SCMB)", quantity: "8,140.000", price: "20.00", value: "162,844.60", pctAssets: "4.82", estIncome: "5,820.00", currentYield: "3.57" },
  { description: "Schwab Short-Term Treasury ETF (SCHO)", quantity: "2,180.000", price: "50.58", value: "110,256.12", pctAssets: "3.26", estIncome: "5,140.00", currentYield: "4.66" },
  { description: "Sweets Family Trust (xxxx4902)", quantity: "", price: "", value: "", pctAssets: "", estIncome: "", currentYield: "", isHeader: true },
  { description: "Schwab Total Stock Market Index (SWTSX)", quantity: "1,250.000", price: "83.82", value: "104,775.00", pctAssets: "3.10", estIncome: "1,440.00", currentYield: "1.37" },
  { description: "Schwab US Aggregate Bond ETF (SCHZ)", quantity: "4,160.000", price: "24.92", value: "103,667.20", pctAssets: "3.07", estIncome: "4,450.00", currentYield: "4.29" },
  { description: "Schwab Cash Sweep", quantity: "76,473.100", price: "1.00", value: "76,473.10", pctAssets: "2.27", estIncome: "3,920.00", currentYield: "5.12" },
];

export const PortfolioHoldingsDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: Props) => {
  const totalValue = holdingsData
    .filter((i) => !i.isHeader && i.value)
    .reduce((s, i) => s + parseFloat(i.value.replace(/,/g, "")), 0);
  const totalIncome = holdingsData
    .filter((i) => !i.isHeader && i.estIncome)
    .reduce((s, i) => s + parseFloat(i.estIncome.replace(/,/g, "")), 0);

  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Portfolio Holdings — Sweets at Schwab"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sweets household holds <span className="font-bold">16 Schwab positions</span> across
                  4 accounts, total value{" "}
                  <span className="font-bold">
                    ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  .
                </li>
                <li>
                  Largest position: SCHB at <span className="font-bold">18.12%</span> of assets;
                  followed by SWTSX at <span className="font-bold">15.64%</span>.
                </li>
                <li>
                  Total estimated annual income:{" "}
                  <span className="font-bold">
                    ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>{" "}
                  — predominantly Schwab ETF dividends and money market interest.
                </li>
              </ul>
            }
          />
        )}

        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-lg">Holdings by Account</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Description</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Quantity</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Price</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Value ($)</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Pct<br />Assets (%)
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Est. Annual<br />Income ($)
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Current<br />Yield (%)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsData.map((row, index) => (
                  <TableRow key={index} className={row.isHeader ? "bg-muted/30" : "hover:bg-muted/30"}>
                    <TableCell className={row.isHeader ? "font-semibold text-sm" : "text-sm"}>
                      {row.description}
                    </TableCell>
                    <TableCell className="text-right text-sm">{row.quantity}</TableCell>
                    <TableCell className="text-right text-sm">{row.price}</TableCell>
                    <TableCell className="text-right text-sm">{row.value}</TableCell>
                    <TableCell className="text-right text-sm">{row.pctAssets}</TableCell>
                    <TableCell className="text-right text-sm">{row.estIncome}</TableCell>
                    <TableCell className="text-right text-sm">{row.currentYield}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
