import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { date: "12/31/2024", marketValue: 2868377, cumulativeFlows: 1660000 },
  { date: "3/31/2025", marketValue: 2960500, cumulativeFlows: 1671250 },
  { date: "6/30/2025", marketValue: 3045890, cumulativeFlows: 1682500 },
  { date: "9/30/2025", marketValue: 3120400, cumulativeFlows: 1693750 },
  { date: "12/31/2025", marketValue: 3179014, cumulativeFlows: 1705000 },
  { date: "3/31/2026", marketValue: 3320188, cumulativeFlows: 1712000 },
  { date: "5/20/2026", marketValue: 3420364, cumulativeFlows: 1712000 },
];

const priorYearData = [
  { label: "Beginning Balance (1/1/2025)", value: "$2,868,377.73" },
  { label: "Contributions", value: "$45,000.00" },
  { label: "Withdrawals", value: "$0.00" },
  { label: "Positions Change in Value", value: "$258,236.35" },
  { label: "Dividend / Cap Gains", value: "$7,400.00" },
  { label: "Ending Balance (12/31/2025)", value: "$3,179,014.08", bold: true },
  { label: "Total Gain / Loss After Fees", value: "$265,636.35", bold: true },
  { label: "TWR for 1/1/2025 to 12/31/2025", value: "+15.20", bold: true },
];

const monthToDateData = [
  { label: "Beginning Balance (1/1/2026)", value: "$3,179,014.08" },
  { label: "Contributions", value: "$7,000.00" },
  { label: "Withdrawals", value: "$0.00" },
  { label: "Positions Change in Value", value: "$229,907.76" },
  { label: "Dividend / Cap Gains", value: "$4,442.96" },
  { label: "Ending Balance (5/20/2026)", value: "$3,420,364.80", bold: true },
  { label: "Total Gain / Loss After Fees", value: "$234,350.72", bold: true },
  { label: "TWR for 1/1/2026 to 5/20/2026", value: "+8.60", bold: true },
];

export function HistoricalMarketValuePerformanceSummaryDashboard({
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
            title="Historical Market Value and Performance — Sweets Household"
            onClose={onToggleAISummary}
            onOpenChat={onOpenChat}
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Prior year TWR: <span className="font-bold">+15.20%</span> with total gains of{" "}
                  <span className="font-bold">$265,636.35</span>.
                </li>
                <li>
                  YTD TWR: <span className="font-bold">+8.60%</span> — outpacing the Schwab 60/40
                  blend.
                </li>
                <li>
                  Ending balance: <span className="font-bold">$3,420,364.80</span> as of 5/20/2026.
                </li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Prior Year Activity (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priorYearData.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`text-muted-foreground ${item.bold ? "font-semibold text-foreground" : ""}`}>
                        {item.label}
                      </span>
                      <span className={item.bold ? "font-semibold" : ""}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Year to Date Activity (2026)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthToDateData.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`text-muted-foreground ${item.bold ? "font-semibold text-foreground" : ""}`}>
                        {item.label}
                      </span>
                      <span className={item.bold ? "font-semibold" : ""}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Market Value vs. Cumulative Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--reports-border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--reports-background))",
                      border: "1px solid hsl(var(--reports-border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="marketValue" stroke="hsl(220, 90%, 56%)" strokeWidth={2} name="Market Value" dot={false} />
                  <Line type="monotone" dataKey="cumulativeFlows" stroke="hsl(var(--reports-muted-foreground))" strokeWidth={2} name="Cumulative Flows" dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
