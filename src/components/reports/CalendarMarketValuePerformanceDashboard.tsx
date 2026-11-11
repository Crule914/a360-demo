import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AISummarySection } from "./AISummarySection";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

const marketValueData = [
  { account: "Sweets Joint Brokerage (xxxx6508)", values: ["1,628,750.40", "1,512,403.18", "1,348,210.55", "1,442,891.06", "1,260,005.41", "1,098,322.18"] },
  { account: "Rick Sweets — Schwab IRA (xxxx7886)", values: ["894,210.18", "831,072.40", "760,318.92", "812,604.55", "725,810.66", "642,118.20"] },
  { account: "Karen Sweets — Schwab Roth IRA (xxxx7319)", values: ["612,488.92", "568,420.10", "521,338.04", "548,902.71", "490,118.05", "412,808.49"] },
  { account: "Sweets Family Trust (xxxx4902)", values: ["284,915.30", "267,118.40", "238,510.22", "246,302.55", "210,118.40", "180,425.18"] },
];

const benchmarkData = [
  { name: "Sweets portfolio (Schwab)", values: ["+8.6", "+15.2", "-11.7", "+18.4", "+12.1"] },
  { name: "Schwab 1000 Index", values: ["+8.4", "+14.8", "-12.5", "+18.9", "+11.7"] },
  { name: "Schwab US Aggregate Bond", values: ["+2.1", "+5.5", "-13.4", "-1.3", "+8.2"] },
  { name: "MSCI EAFE", values: ["+5.9", "+11.2", "-14.5", "+11.3", "+7.8"] },
];

export function CalendarMarketValuePerformanceDashboard({
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
            title="Calendar Market Value and Performance"
            onClose={onToggleAISummary}
            onOpenChat={onOpenChat}
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sweets household total value reached{" "}
                  <span className="font-bold">$3,420,364.80</span> at year end 2025.
                </li>
                <li>
                  Portfolio returned <span className="font-bold">+8.6% YTD</span> in 2026, slightly
                  ahead of the Schwab 1000.
                </li>
                <li>
                  5-year annualized return: <span className="font-bold">+9.4%</span>, comfortably
                  above the 7% planning assumption.
                </li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium">Account Name</CardTitle>
                <CardTitle className="text-base font-medium">Market Value ($)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]"></TableHead>
                    <TableHead className="text-right">YTD 2026</TableHead>
                    <TableHead className="text-right">12/31/2025</TableHead>
                    <TableHead className="text-right">12/31/2024</TableHead>
                    <TableHead className="text-right">12/31/2023</TableHead>
                    <TableHead className="text-right">12/31/2022</TableHead>
                    <TableHead className="text-right">12/31/2021</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketValueData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">{row.account}</TableCell>
                      {row.values.map((value, idx) => (
                        <TableCell key={idx} className="text-right">
                          {value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">$3,420,364.80</TableCell>
                    <TableCell className="text-right">$3,179,014.08</TableCell>
                    <TableCell className="text-right">$2,868,377.73</TableCell>
                    <TableCell className="text-right">$3,050,700.87</TableCell>
                    <TableCell className="text-right">$2,686,052.52</TableCell>
                    <TableCell className="text-right">$2,333,674.05</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium">Portfolio vs. Benchmarks</CardTitle>
                <CardTitle className="text-base font-medium">Returns (%)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]"></TableHead>
                    <TableHead className="text-right">YTD 2026</TableHead>
                    <TableHead className="text-right">2025</TableHead>
                    <TableHead className="text-right">2024</TableHead>
                    <TableHead className="text-right">2023</TableHead>
                    <TableHead className="text-right">2022</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarkData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">{row.name}</TableCell>
                      {row.values.map((value, idx) => (
                        <TableCell key={idx} className="text-right">
                          {value}
                        </TableCell>
                      ))}
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
