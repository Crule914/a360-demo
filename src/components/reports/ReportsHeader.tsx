import { Filter, PanelLeftClose, PanelLeftOpen, Sparkles, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReportDescriptionHeader } from "./ReportDescriptionHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReportsLayout } from "@/hooks/useReportsLayout";

interface RelatedReport {
  id: string;
  title: string;
  isCustom?: boolean;
}

interface ReportsHeaderProps {
  isFiltersPanelOpen: boolean;
  onToggleFiltersPanel: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  reportTitle: string;
  reportDescription: string;
  isCustomReport?: boolean;
  relatedReports?: RelatedReport[];
  currentReportId?: string;
  onReportChange?: (reportId: string | null) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSaveConfiguration?: () => void;
  onSaveExisting?: () => void;
  hasUnsavedChanges?: boolean;
  isAISummaryVisible: boolean;
  onToggleAISummary: () => void;
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  onEditReport?: () => void;
  onDeleteReport?: () => void;
  isLandingView?: boolean;
}

export const ReportsHeader = ({
  isFiltersPanelOpen: _isFiltersPanelOpen,
  onToggleFiltersPanel,
  onToggleSidebar,
  isSidebarCollapsed,
  reportTitle,
  reportDescription,
  isCustomReport = false,
  relatedReports = [],
  currentReportId,
  onReportChange,
  isFavorite = false,
  onToggleFavorite,
  onSaveConfiguration,
  onSaveExisting,
  hasUnsavedChanges = false,
  isAISummaryVisible,
  onToggleAISummary,
  selectedAccount,
  onAccountChange,
  onEditReport,
  onDeleteReport,
  isLandingView = false,
}: ReportsHeaderProps) => {
  const { isFlatStyle } = useReportsLayout();

  return (
    <div
      className={`p-4 sticky top-0 z-20 pt-3 pb-[10px] ${
        isFlatStyle ? "bg-background" : "bg-card shadow-sm border-b"
      }`}
    >
      <div className="gap-4 flex items-center justify-between">
        <div className="flex items-center flex-1 gap-[15px]">
          {onToggleSidebar && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleSidebar}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          )}
          {isLandingView ? (
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold">Reports</span>
              <div className="w-px h-10 bg-border mx-2" />
              <div>
                <h1 className="text-lg text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">{reportDescription}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onReportChange?.(null)}
                className="text-xl font-semibold hover:text-muted-foreground transition-colors"
              >
                Reports
              </button>
              <div className="w-px h-10 bg-border mx-2" />
              <ReportDescriptionHeader
                title={reportTitle}
                description={reportDescription}
                isCustom={isCustomReport}
                relatedReports={relatedReports}
                currentReportId={currentReportId}
                onReportChange={onReportChange}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                onEditReport={isCustomReport ? onEditReport : undefined}
                onDeleteReport={isCustomReport ? onDeleteReport : undefined}
                hasUnsavedChanges={hasUnsavedChanges}
                onSaveExisting={onSaveExisting}
                onSaveConfiguration={onSaveConfiguration}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!isLandingView && (
            <Select value={selectedAccount} onValueChange={onAccountChange}>
              <SelectTrigger className={`w-[160px] h-8 ${isFlatStyle ? "bg-card" : ""}`}>
                <SelectValue placeholder="Filter by account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="open">Open Accounts</SelectItem>
                <SelectItem value="closed">Closed Accounts</SelectItem>
                <SelectItem value="roth-ira">Roth IRA Accounts</SelectItem>
                <SelectItem value="corporate">Corporate Accounts</SelectItem>
                <SelectItem value="individual">Individual Accounts</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0 ${isFlatStyle ? "bg-card" : ""}`}
            onClick={onToggleFiltersPanel}
            title={isLandingView ? "Configure" : "Filter"}
          >
            {isLandingView ? <Settings className="h-3.5 w-3.5" /> : <Filter className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant={isAISummaryVisible ? "purple" : "purpleOutline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleAISummary}
            title="Toggle AI Summary"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
