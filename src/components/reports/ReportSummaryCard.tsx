import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReportSummaryMetric } from "@/constants/reportSummaries";
import { cn } from "@/lib/utils";

interface ReportSummaryCardProps {
  icon: LucideIcon;
  title: string;
  metrics: ReportSummaryMetric[];
  onClick?: () => void;
}

export const ReportSummaryCard = ({ icon: Icon, title, metrics, onClick }: ReportSummaryCardProps) => {
  const getValueColorClass = (color?: ReportSummaryMetric["valueColor"]) => {
    switch (color) {
      case "success":
        return "text-emerald-600 dark:text-emerald-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card
      className={cn(
        "p-0 border-l-4 border-l-primary bg-card overflow-hidden",
        onClick && "cursor-pointer hover:bg-accent/5 transition-colors",
      )}
      onClick={onClick}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-base text-foreground">{title}</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</p>
              <p className={cn("text-base font-bold", getValueColorClass(metric.valueColor))}>
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
