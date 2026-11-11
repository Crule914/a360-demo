import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Cell, Pie, PieChart, ResponsiveContainer, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { AISummarySection } from "./AISummarySection";

const investmentsData = [
  { name: "Sweets Joint Brokerage (xxxx6508)", value: "1,628,750.40" },
  { name: "Rick Sweets — Schwab IRA (xxxx7886)", value: "894,210.18" },
  { name: "Karen Sweets — Schwab Roth IRA (xxxx7319)", value: "612,488.92" },
  { name: "Sweets Family Trust (xxxx4902)", value: "284,915.30" },
];

const insuranceData = [
  { name: "Northwestern Mutual — Term Life (Rick)", value: "0.00" },
  { name: "MassMutual — Whole Life (Karen, cash value)", value: "62,400.00" },
];

const bankingData = [{ name: "Primary Mortgage — Lancaster, MA", value: "($385,000.00)" }];

const physicalAssetsData = [
  { name: "Primary Residence — 84 Linden Hill Rd.", value: "1,485,000.00" },
];

const netWorthData = [
  { category: "Total Assets", value: 4967764.8, color: "#3b82f6" },
  { category: "Total Liabilities", value: 385000, color: "#ef4444" },
  { category: "Net Worth", value: 4582764.8, color: "#10b981" },
];

const assetCategoryData = [
  { name: "Domestic Equity", value: 2050118.4, percent: 41.27, color: "#1e40af" },
  { name: "Real Estate (Primary Residence)", value: 1485000.0, percent: 29.89, color: "#3b82f6" },
  { name: "Fixed Income (SCHZ / SCMB)", value: 644094.6, percent: 12.96, color: "#60a5fa" },
  { name: "International Equity (SCHF / SWISX)", value: 412678.2, percent: 8.31, color: "#93c5fd" },
  { name: "Schwab Money Market", value: 186420.18, percent: 3.75, color: "#bfdbfe" },
  { name: "Real Estate ETF (SCHH)", value: 152780.9, percent: 3.08, color: "#dbeafe" },
  { name: "Other Schwab Holdings", value: 36672.52, percent: 0.74, color: "#eff6ff" },
];

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

export const FinancialSummaryDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: Props) => {
  const parseValue = (v: string) => {
    const stripped = v.replace(/[$,()]/g, "");
    return v.includes("(") ? -parseFloat(stripped) : parseFloat(stripped);
  };
  const totalInvestments = investmentsData.reduce((s, i) => s + parseValue(i.value), 0);
  const totalInsurance = insuranceData.reduce((s, i) => s + parseValue(i.value), 0);
  const totalBanking = bankingData.reduce((s, i) => s + parseValue(i.value), 0);
  const totalPhysicalAssets = physicalAssetsData.reduce((s, i) => s + parseValue(i.value), 0);
  const totalNetWorth = totalInvestments + totalInsurance + totalBanking + totalPhysicalAssets;
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const CustomLegend = ({ payload }: any) => (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold mb-2">
        <div>Asset Category</div>
        <div className="text-right">Value ($)</div>
        <div className="text-right">(%)</div>
      </div>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span>{entry.value}</span>
          </div>
          <div className="text-right">{fmt(entry.payload.value)}</div>
          <div className="text-right">{entry.payload.percent.toFixed(2)}</div>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 text-xs font-bold border-t pt-1 mt-1">
        <div>Total</div>
        <div className="text-right">${fmt(4967764.8)}</div>
        <div className="text-right">100%</div>
      </div>
    </div>
  );

  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Sweets Household — Financial Summary"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Total net worth: <span className="font-bold">${fmt(totalNetWorth)}</span> — assets{" "}
                  <span className="font-bold">${fmt(totalInvestments + totalInsurance + totalPhysicalAssets)}</span>{" "}
                  vs liabilities <span className="font-bold">${fmt(Math.abs(totalBanking))}</span>.
                </li>
                <li>
                  Largest allocation: domestic equity (SCHB / SCHX / SCHD) at{" "}
                  <span className="font-bold">41.27%</span>.
                </li>
                <li>
                  Schwab investable assets total{" "}
                  <span className="font-bold">${fmt(totalInvestments)}</span>.
                </li>
              </ul>
            }
          />
        )}

        <div className="grid grid-cols-[400px_1fr] gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-lg">Net Worth</h3>

            {(
              [
                { title: "Schwab Investments", data: investmentsData, total: totalInvestments },
                { title: "Insurance Cash Value", data: insuranceData, total: totalInsurance },
                { title: "Banking", data: bankingData, total: totalBanking },
                { title: "Physical Assets", data: physicalAssetsData, total: totalPhysicalAssets },
              ] as const
            ).map((group) => (
              <div key={group.title} className="mb-6">
                <h4 className="font-semibold text-sm mb-2">{group.title}</h4>
                <Table>
                  <TableBody>
                    {group.data.map((item, i) => (
                      <TableRow key={i} className="border-b-0">
                        <TableCell className="text-xs py-1 px-2">{item.name}</TableCell>
                        <TableCell className="text-right text-xs py-1 px-2">{item.value}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t">
                      <TableCell className="text-xs py-1 px-2"></TableCell>
                      <TableCell className="text-right font-semibold text-xs py-1 px-2">
                        ${fmt(group.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))}

            <div className="pt-4 border-t-2">
              <div className="flex justify-between font-bold">
                <span>Total Net Worth</span>
                <span>${fmt(totalNetWorth)}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Net Worth Summary</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={netWorthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {netWorthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Asset Category Allocation</h3>
              <div className="flex gap-6">
                <div className="w-[300px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assetCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {assetCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <CustomLegend
                    payload={assetCategoryData.map((item) => ({
                      value: item.name,
                      color: item.color,
                      payload: item,
                    }))}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
