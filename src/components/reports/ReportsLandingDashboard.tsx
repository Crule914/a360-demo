import { CombinedAISummary } from "./CombinedAISummary";
import { ReportSummaryCard } from "./ReportSummaryCard";
import { REPORT_SUMMARY_DATA } from "@/constants/reportSummaries";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportsLandingDashboardProps {
  selectedReportIds: string[];
  isAISummaryVisible: boolean;
  onCloseAISummary: () => void;
  onReportSelect: (reportId: string) => void;
}

export const ReportsLandingDashboard = ({
  selectedReportIds,
  isAISummaryVisible,
  onCloseAISummary,
  onReportSelect,
}: ReportsLandingDashboardProps) => {
  const reportsWithData = selectedReportIds.map((id) => REPORT_SUMMARY_DATA[id]).filter(Boolean);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="px-6 pb-6 pt-0 space-y-6">
        {isAISummaryVisible && (
          <CombinedAISummary selectedReportIds={selectedReportIds} onClose={onCloseAISummary} />
        )}
        <div className="space-y-4">
          {reportsWithData.map((report) => (
            <ReportSummaryCard
              key={report.id}
              icon={report.icon}
              title={report.title}
              metrics={report.metrics}
              onClick={() => onReportSelect(report.id)}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center pt-4">
          Last updated: 6:00 AM Today
        </div>
      </div>
    </ScrollArea>
  );
};
