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

const performanceData = [
  { from: "01/01/2022", to: "03/31/2022", portfolio: "-5.2", global: "-6.15", muni: "-5.71", long: "-8.55" },
  { from: "04/01/2022", to: "06/30/2022", portfolio: "-7.8", global: "-11.01", muni: "-1.75", long: "-6.59" },
  { from: "07/01/2022", to: "09/30/2022", portfolio: "-6.1", global: "-8.85", muni: "-2.73", long: "-5.95" },
  { from: "10/01/2022", to: "12/31/2022", portfolio: "+8.0", global: "+6.81", muni: "+3.85", long: "+5.19" },
  { from: "01/01/2023", to: "03/31/2023", portfolio: "+2.4", global: "+3.06", muni: "+2.40", long: "+4.27" },
  { from: "04/01/2023", to: "06/30/2023", portfolio: "+3.9", global: "-2.16", muni: "-0.46", long: "+0.87" },
  { from: "07/01/2023", to: "09/30/2023", portfolio: "-3.1", global: "-4.00", muni: "-3.13", long: "-6.86" },
  { from: "10/01/2023", to: "12/31/2023", portfolio: "+7.4", global: "+9.21", muni: "+6.79", long: "+11.61" },
  { from: "01/01/2024", to: "03/31/2024", portfolio: "+4.6", global: "+2.41", muni: "+0.92", long: "+1.30" },
  { from: "04/01/2024", to: "06/30/2024", portfolio: "+3.2", global: "+1.85", muni: "+1.10", long: "+0.70" },
  { from: "07/01/2024", to: "09/30/2024", portfolio: "+2.9", global: "+5.10", muni: "+2.05", long: "+3.12" },
  { from: "10/01/2024", to: "12/31/2024", portfolio: "+1.7", global: "+0.95", muni: "+1.45", long: "-1.20" },
  { from: "01/01/2025", to: "03/31/2025", portfolio: "+3.8", global: "+2.10", muni: "+1.65", long: "+2.40" },
  { from: "04/01/2025", to: "06/30/2025", portfolio: "+4.1", global: "+3.55", muni: "+1.20", long: "+2.10" },
  { from: "07/01/2025", to: "09/30/2025", portfolio: "+3.5", global: "+2.90", muni: "+0.85", long: "+1.95" },
  { from: "10/01/2025", to: "12/31/2025", portfolio: "+2.9", global: "+1.40", muni: "+0.60", long: "+1.10" },
  { from: "01/01/2026", to: "05/20/2026", portfolio: "+8.6", global: "+5.10", muni: "+1.20", long: "+0.85" },
];

export const PerformanceHistoryTWRDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: Props) => {
  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Performance History — Sweets Household"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Cumulative Sweets return from Q1 2022 to May 2026:{" "}
                  <span className="font-bold">+38.2%</span>, vs Schwab 60/40 blend{" "}
                  <span className="font-bold">+12.7%</span>.
                </li>
                <li>
                  Strongest quarter: <span className="font-bold">+8.6%</span> (YTD 2026); most
                  challenging: <span className="font-bold">-7.8%</span> (Q2 2022).
                </li>
                <li>
                  Most recent quarter: <span className="font-bold">+8.6%</span> vs benchmark{" "}
                  <span className="font-bold">+5.1%</span>.
                </li>
              </ul>
            }
          />
        )}

        <Card className="p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground" colSpan={2}>
                    Quarterly
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center" colSpan={4}>
                    Time Weighted Return (%)
                  </TableHead>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">From</TableHead>
                  <TableHead className="font-semibold text-foreground">To</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Sweets Portfolio
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Schwab 60/40 Blend
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Schwab Muni Bond
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Schwab Long Bond
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{row.from}</TableCell>
                    <TableCell className="font-medium">{row.to}</TableCell>
                    <TableCell className="text-center">{row.portfolio}</TableCell>
                    <TableCell className="text-center">{row.global}</TableCell>
                    <TableCell className="text-center">{row.muni}</TableCell>
                    <TableCell className="text-center">{row.long}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2} className="font-bold">
                    Cumulative
                  </TableCell>
                  <TableCell className="text-center font-bold">+38.20</TableCell>
                  <TableCell className="text-center font-bold">+12.70</TableCell>
                  <TableCell className="text-center font-bold">+9.80</TableCell>
                  <TableCell className="text-center font-bold">+6.30</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
