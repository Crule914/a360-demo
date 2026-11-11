import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_LANDING_REPORTS } from "@/constants/reportSummaries";

interface ConfigureReportsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onToggleReport: (reportId: string) => void;
  onSelectAll: (reportIds: string[]) => void;
  onDeselectAll: () => void;
  onSave: () => void;
  onCancel: () => void;
  maxReports: number;
}

export const ConfigureReportsPanel = ({
  isOpen,
  onClose,
  selectedIds,
  onToggleReport,
  onSelectAll,
  onDeselectAll,
  onSave,
  onCancel,
  maxReports,
}: ConfigureReportsPanelProps) => {
  if (!isOpen) return null;
  const allReportIds = AVAILABLE_LANDING_REPORTS.map((r) => r.id);

  return (
    <div className="w-[320px] border-l border-t bg-card flex flex-col h-full rounded-tl-lg overflow-hidden">
      <div className="p-4 border-b shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-base">Configure Dashboard</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Select up to {maxReports} reports to display on your dashboard overview.
        </p>
      </div>

      <div className="px-4 py-3 border-b shrink-0">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => onSelectAll(allReportIds)}
          >
            Select All
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={onDeselectAll}>
            Deselect All
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {selectedIds.length} of {maxReports} selected
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {AVAILABLE_LANDING_REPORTS.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedIds.includes(report.id);
            const isDisabled = !isSelected && selectedIds.length >= maxReports;

            return (
              <div
                key={report.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/5 border-primary/20"
                    : isDisabled
                      ? "bg-muted/30 border-transparent opacity-50 cursor-not-allowed"
                      : "bg-card border-transparent hover:bg-muted/50"
                }`}
                onClick={() => !isDisabled && onToggleReport(report.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={isSelected} disabled={isDisabled} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-sm truncate">{report.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {report.category}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {report.frequency}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t shrink-0 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onSave}>
          <Check className="h-4 w-4 mr-1" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
