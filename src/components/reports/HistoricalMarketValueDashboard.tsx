import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AISummarySection } from "./AISummarySection";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

const chartData = [
  { date: "1/1/2019", marketValue: 1480000, cumulativeFlows: 1450000 },
  { date: "1/1/2020", marketValue: 1620000, cumulativeFlows: 1480000 },
  { date: "1/1/2021", marketValue: 1980000, cumulativeFlows: 1525000 },
  { date: "1/1/2022", marketValue: 2333674, cumulativeFlows: 1570000 },
  { date: "1/1/2023", marketValue: 2686052, cumulativeFlows: 1615000 },
  { date: "1/1/2024", marketValue: 3050700, cumulativeFlows: 1660000 },
  { date: "1/1/2025", marketValue: 3179014, cumulativeFlows: 1705000 },
  { date: "5/1/2026", marketValue: 3420364, cumulativeFlows: 1712000 },
];

const tableData = [
  { date: "1/1/2019", marketValue: "1,480,000.00", netContributions: "1,450,000.00", cumulative: "1,450,000.00" },
  { date: "1/1/2020", marketValue: "1,620,000.00", netContributions: "30,000.00", cumulative: "1,480,000.00" },
  { date: "1/1/2021", marketValue: "1,980,000.00", netContributions: "45,000.00", cumulative: "1,525,000.00" },
  { date: "1/1/2022", marketValue: "2,333,674.05", netContributions: "45,000.00", cumulative: "1,570,000.00" },
  { date: "1/1/2023", marketValue: "2,686,052.52", netContributions: "45,000.00", cumulative: "1,615,000.00" },
  { date: "1/1/2024", marketValue: "3,050,700.87", netContributions: "45,000.00", cumulative: "1,660,000.00" },
  { date: "1/1/2025", marketValue: "3,179,014.08", netContributions: "45,000.00", cumulative: "1,705,000.00" },
  { date: "5/1/2026", marketValue: "3,420,364.80", netContributions: "7,000.00", cumulative: "1,712,000.00" },
];

export function HistoricalMarketValueDashboard({ onOpenChat, className, isAISummaryVisible = true, onToggleAISummary }: Props) {
  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            title="Historical Market Value — Sweets Household"
            onClose={onToggleAISummary}
            onOpenChat={onOpenChat}
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sweets Schwab portfolio grew from <span className="font-bold">$1.48M</span> in 2019
                  to <span className="font-bold">$3.42M</span> today.
                </li>
                <li>
                  Cumulative net contributions:{" "}
                  <span className="font-bold">$1.71M</span> — the rest is market appreciation.
                </li>
                <li>Steady IRA contributions of ~$45K/yr drive long-term compounding.</li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Sweets Portfolio — Market Value vs. Cumulative Flows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--reports-border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--reports-background))",
                      border: "1px solid hsl(var(--reports-border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="marketValue"
                    stroke="hsl(220, 90%, 56%)"
                    strokeWidth={2}
                    name="Market Value"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeFlows"
                    stroke="hsl(45, 93%, 47%)"
                    strokeWidth={2}
                    name="Cumulative Flows"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Annual Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Market Value ($)</TableHead>
                    <TableHead className="text-right">Net Contributions ($)</TableHead>
                    <TableHead className="text-right">Cumulative Contributions ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell className="text-right">{row.marketValue}</TableCell>
                      <TableCell className="text-right">{row.netContributions}</TableCell>
                      <TableCell className="text-right">{row.cumulative}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
