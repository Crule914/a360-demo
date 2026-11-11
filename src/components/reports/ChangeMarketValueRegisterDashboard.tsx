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

const accountData = [
  {
    account: "Karen Sweets — Schwab Roth IRA (xxxx7319)",
    performanceStart: "1/1/2026",
    beginningValue: "568,420.10",
    netContributions: "7,000.00",
    totalGainedLosses: "36,138.82",
    netIncome: "930.00",
    endingBalance: "612,488.92",
    netChange: "44,068.82",
    performanceStop: "5/20/2026",
    twr: "+6.51",
    twrAnn: "",
  },
  {
    account: "Rick & Karen Sweets — Joint Brokerage (xxxx6508)",
    performanceStart: "1/1/2026",
    beginningValue: "1,512,403.18",
    netContributions: "0.00",
    totalGainedLosses: "112,420.66",
    netIncome: "3,926.56",
    endingBalance: "1,628,750.40",
    netChange: "116,347.22",
    performanceStop: "5/20/2026",
    twr: "+7.69",
    twrAnn: "",
  },
  {
    account: "Sweets Family Trust (xxxx4902)",
    performanceStart: "1/1/2026",
    beginningValue: "267,118.40",
    netContributions: "0.00",
    totalGainedLosses: "17,210.50",
    netIncome: "586.40",
    endingBalance: "284,915.30",
    netChange: "17,796.90",
    performanceStop: "5/20/2026",
    twr: "+6.66",
    twrAnn: "",
  },
];

export function ChangeMarketValueRegisterDashboard({
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
            title="Change in Market Value Register"
            onClose={onToggleAISummary}
            onOpenChat={onOpenChat}
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sweets portfolios gained <span className="font-bold">$178,212.94</span> total this
                  period.
                </li>
                <li>
                  Net income of <span className="font-bold">$5,442.96</span> from Schwab dividend
                  positions (SCHD, SCMB).
                </li>
                <li>
                  Ending balance: <span className="font-bold">$2,526,154.62</span> across the three
                  reviewed Schwab accounts.
                </li>
              </ul>
            }
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">Account Name</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Performance Start</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Beginning Value ($)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Net Contributions ($)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Total Gain/Loss ($)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Net Income ($)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ending Balance ($)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Net Change ($)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Performance Stop</TableHead>
                    <TableHead className="text-right whitespace-nowrap">TWR (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">{row.account}</TableCell>
                      <TableCell className="text-right">{row.performanceStart}</TableCell>
                      <TableCell className="text-right">{row.beginningValue}</TableCell>
                      <TableCell className="text-right">{row.netContributions}</TableCell>
                      <TableCell className="text-right">{row.totalGainedLosses}</TableCell>
                      <TableCell className="text-right">{row.netIncome}</TableCell>
                      <TableCell className="text-right">{row.endingBalance}</TableCell>
                      <TableCell className="text-right">{row.netChange}</TableCell>
                      <TableCell className="text-right">{row.performanceStop}</TableCell>
                      <TableCell className="text-right">{row.twr}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">1/1/2026</TableCell>
                    <TableCell className="text-right">$2,347,941.68</TableCell>
                    <TableCell className="text-right">$7,000.00</TableCell>
                    <TableCell className="text-right">$165,769.98</TableCell>
                    <TableCell className="text-right">$5,442.96</TableCell>
                    <TableCell className="text-right">$2,526,154.62</TableCell>
                    <TableCell className="text-right">$178,212.94</TableCell>
                    <TableCell className="text-right">5/20/2026</TableCell>
                    <TableCell className="text-right">+7.18</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
