import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AISummarySection } from "./AISummarySection";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

const chartData = [
  { month: "Jan", cashFlow: 6200, average: 8166 },
  { month: "Feb", cashFlow: 7800, average: 8166 },
  { month: "Mar", cashFlow: 11400, average: 8166 },
  { month: "Apr", cashFlow: 6450, average: 8166 },
  { month: "May", cashFlow: 5900, average: 8166 },
  { month: "Jun", cashFlow: 12100, average: 8166 },
  { month: "Jul", cashFlow: 6800, average: 8166 },
  { month: "Aug", cashFlow: 7600, average: 8166 },
  { month: "Sep", cashFlow: 11200, average: 8166 },
  { month: "Oct", cashFlow: 6700, average: 8166 },
  { month: "Nov", cashFlow: 7400, average: 8166 },
  { month: "Dec", cashFlow: 12450, average: 8166 },
];

const cashFlowData = [
  {
    category: "Schwab Money Market",
    security: "Schwab Government Money Fund (SNVXX)",
    values: ["520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "520.00", "$6,240.00"],
  },
  {
    category: "ETF Dividends",
    security: "Schwab US Dividend Equity ETF (SCHD)",
    values: ["0.00", "0.00", "1,910.00", "0.00", "0.00", "1,910.00", "0.00", "0.00", "1,910.00", "0.00", "0.00", "1,910.00", "$7,640.00"],
  },
  {
    category: "",
    security: "Schwab US Broad Market ETF (SCHB)",
    values: ["0.00", "0.00", "2,840.00", "0.00", "0.00", "2,840.00", "0.00", "0.00", "2,840.00", "0.00", "0.00", "2,840.00", "$11,360.00"],
  },
  {
    category: "",
    security: "Schwab International Equity ETF (SCHF)",
    values: ["0.00", "0.00", "1,180.00", "0.00", "0.00", "1,180.00", "0.00", "0.00", "1,180.00", "0.00", "0.00", "1,180.00", "$4,720.00"],
  },
  {
    category: "Bond Interest",
    security: "Schwab US Aggregate Bond ETF (SCHZ)",
    values: ["1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "1,020.00", "$12,240.00"],
  },
];

export function EstimatedCashFlowDashboard({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: Props) {
  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            title="Estimated Cash Flow — Sweets Household"
            onClose={onToggleAISummary}
            onOpenChat={onOpenChat}
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Projected 12-month income across Schwab holdings:{" "}
                  <span className="font-bold">$98,000</span>.
                </li>
                <li>
                  Highest cash-flow months: <span className="font-bold">March, June, September,
                  December</span> (quarterly ETF dividends).
                </li>
                <li>
                  Monthly average:{" "}
                  <span className="font-bold">$8,166</span> — comfortably covers planned
                  distributions.
                </li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Cash Flow Illustration</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="hsl(var(--reports-muted-foreground))"
                    strokeWidth={2}
                    name="Average"
                    dot={false}
                  />
                  <Bar dataKey="cashFlow" fill="hsl(var(--reports-primary))" name="Cash Flow" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Sweets Joint Brokerage (xxxx6508) — projected 2026 cash flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]"></TableHead>
                      <TableHead className="text-right">Jan</TableHead>
                      <TableHead className="text-right">Feb</TableHead>
                      <TableHead className="text-right">Mar</TableHead>
                      <TableHead className="text-right">Apr</TableHead>
                      <TableHead className="text-right">May</TableHead>
                      <TableHead className="text-right">Jun</TableHead>
                      <TableHead className="text-right">Jul</TableHead>
                      <TableHead className="text-right">Aug</TableHead>
                      <TableHead className="text-right">Sep</TableHead>
                      <TableHead className="text-right">Oct</TableHead>
                      <TableHead className="text-right">Nov</TableHead>
                      <TableHead className="text-right">Dec</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-sm">
                          {row.category && <div className="font-semibold mb-1">{row.category}</div>}
                          <div className="pl-2 text-muted-foreground">{row.security}</div>
                        </TableCell>
                        {row.values.map((value, idx) => (
                          <TableCell key={idx} className="text-right">
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
