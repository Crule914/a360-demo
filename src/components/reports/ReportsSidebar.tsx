import { useState, useMemo } from "react";
import { Search, Star, Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreateReportModal } from "./CreateReportModal";
import { REPORTS, Report } from "@/constants/reports";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { CustomReport } from "@/hooks/useCustomReports";
import { useReportsLayout } from "@/hooks/useReportsLayout";

interface ReportsSidebarProps {
  onSelectReport: (reportId: string | null) => void;
  selectedReportId: string | null;
  onToggleFavorite: (reportId: string) => void;
  isFavorite: (reportId: string) => boolean;
  hasFavoritePreference: (reportId: string) => boolean;
  customReports?: CustomReport[];
  className?: string;
}

export const ReportsSidebar = ({
  onSelectReport,
  selectedReportId,
  onToggleFavorite,
  isFavorite,
  hasFavoritePreference,
  customReports = [],
  className,
}: ReportsSidebarProps) => {
  const { isFlatStyle } = useReportsLayout();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const allReports = useMemo(() => {
    const dynamicReports: Report[] = customReports.map((cr) => {
      const parentReport = REPORTS.find((r) => r.id === cr.parentReportId);
      return {
        id: cr.id,
        icon: parentReport?.icon || REPORTS[0].icon,
        title: cr.title,
        description: cr.description,
        category: cr.category,
        starred: cr.starred,
        parentReportId: cr.parentReportId,
        isCustom: true,
      };
    });
    return [...REPORTS, ...dynamicReports];
  }, [customReports]);

  const reportsWithUserFavorites = allReports.map((report) => ({
    ...report,
    starred: hasFavoritePreference(report.id) ? isFavorite(report.id) : report.starred,
  }));

  const standardReports = reportsWithUserFavorites
    .filter((r) => !r.isCustom)
    .filter((r) => !r.parentReportId)
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const customReportsList = reportsWithUserFavorites.filter((r) => r.isCustom);
  const filteredCustom = customReportsList
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const allFavorites = reportsWithUserFavorites
    .filter((r) => r.starred)
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const isSearching = searchQuery.trim().length > 0;

  const searchResults = reportsWithUserFavorites
    .filter((r) => r.isCustom || !r.parentReportId)
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const highlightMatch = (text: string) => {
    if (!isSearching) return text;
    const q = searchQuery.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-[hsl(var(--warning)/0.3)] text-foreground rounded-sm px-0.5">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const renderSearchResultItem = (report: Report) => {
    const isSelected = report.id === selectedReportId;
    const IconComponent = report.icon;
    const isCustom = !!report.isCustom;

    return (
      <div
        key={report.id}
        onClick={() => onSelectReport(report.id)}
        className={`w-full text-left px-3 py-2.5 transition-colors group cursor-pointer border-l-2 ${
          isSelected
            ? "bg-muted/50 text-foreground border-l-primary"
            : "hover:bg-muted/40 border-l-transparent"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h4 className="font-medium text-sm leading-tight">{highlightMatch(report.title)}</h4>
              <span
                className={`text-[10px] font-medium px-1.5 py-0 h-4 rounded-full inline-flex items-center shrink-0 ${
                  isCustom
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                }`}
              >
                {isCustom ? "Custom" : "Pre-canned"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
              {highlightMatch(report.description)}
            </p>
          </div>
          {report.starred && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(report.id);
              }}
              className="shrink-0 mt-0.5 hover:scale-110 transition-all cursor-pointer"
            >
              <Star className="h-4 w-4 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFlatReportItem = (report: Report) => {
    const isSelected = report.id === selectedReportId;
    const IconComponent = report.icon;

    return (
      <div
        key={report.id}
        onClick={() => onSelectReport(report.id)}
        className={`w-full text-left px-3 py-2.5 transition-colors group cursor-pointer border-l-2 ${
          isSelected
            ? "bg-muted/50 text-foreground border-l-primary"
            : "hover:bg-muted/40 border-l-transparent"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight">{report.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
              {report.description}
            </p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(report.id);
            }}
            className={`shrink-0 mt-0.5 hover:scale-110 transition-all cursor-pointer ${
              report.starred ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Star
              className={`h-4 w-4 ${
                report.starred
                  ? "fill-[hsl(var(--warning))] text-[hsl(var(--warning))]"
                  : "text-muted-foreground"
              }`}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTemplateItem = (report: Report) => {
    const isSelected = report.id === selectedReportId;
    const customData = customReports.find((cr) => cr.id === report.id);
    const createdDate = customData?.createdAt
      ? new Date(customData.createdAt).toLocaleDateString()
      : null;
    const IconComponent = report.icon;

    return (
      <div
        key={report.id}
        onClick={() => onSelectReport(report.id)}
        className={`w-full text-left px-3 py-2.5 transition-colors group cursor-pointer border-l-2 ${
          isSelected
            ? "bg-muted/50 text-foreground border-l-primary"
            : "hover:bg-muted/40 border-l-transparent"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-medium text-sm leading-tight truncate">{report.title}</h4>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                Custom
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
              {report.description}
            </p>
            {createdDate && (
              <p className="text-[11px] text-muted-foreground mt-0.5">Created {createdDate}</p>
            )}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(report.id);
            }}
            className={`shrink-0 mt-0.5 hover:scale-110 transition-all cursor-pointer ${
              report.starred ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Star
              className={`h-4 w-4 ${
                report.starred
                  ? "fill-[hsl(var(--warning))] text-[hsl(var(--warning))]"
                  : "text-muted-foreground"
              }`}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMyTemplatesContent = () => {
    if (filteredCustom.length === 0 && searchQuery.trim().length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <p className="text-sm text-muted-foreground mb-3">No custom templates yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Template
          </Button>
        </div>
      );
    }

    if (filteredCustom.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No templates match your search
        </div>
      );
    }

    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full justify-start h-8 text-xs text-primary hover:text-primary hover:bg-primary/5 mb-1 px-3"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Template
        </Button>
        {filteredCustom.map((report) => renderTemplateItem(report))}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 overflow-hidden ${
        isFlatStyle ? "bg-background" : "bg-card border-r border-t rounded-tr-lg"
      } ${className || "w-[380px]"}`}
    >
      <Tabs defaultValue="favorites" className="flex flex-col h-full">
        <div
          className={`p-4 z-10 shrink-0 space-y-3 ${
            isFlatStyle ? "bg-background" : "bg-card border-b"
          }`}
        >
          <h2 className="text-sm font-semibold text-foreground">Reports</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-8 h-9 ${isFlatStyle ? "bg-card" : ""}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <TabsList
            className={`w-full h-9 bg-transparent p-0 border-b border-border rounded-none transition-opacity ${
              isSearching ? "opacity-35 pointer-events-none" : ""
            }`}
            aria-disabled={isSearching}
          >
            <TabsTrigger
              value="favorites"
              className="flex-1 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-semibold text-muted-foreground text-xs bg-transparent"
            >
              Favorites
              {allFavorites.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                  {allFavorites.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="standard"
              className="flex-1 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-semibold text-muted-foreground text-xs bg-transparent"
            >
              Pre-canned
              <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                {standardReports.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="flex-1 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-semibold text-muted-foreground text-xs bg-transparent"
            >
              Custom
              {customReportsList.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                  {customReportsList.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {isSearching ? (
          <div className="mt-0 flex-1 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-sm text-muted-foreground">No reports found</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {searchResults.map((report) => renderSearchResultItem(report))}
              </div>
            )}
          </div>
        ) : (
          <>
            <TabsContent value="favorites" className="mt-0 flex-1 overflow-y-auto">
              {allFavorites.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Star className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No favorites yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Star reports from other tabs to add them here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {allFavorites.map((report) =>
                    report.isCustom ? renderTemplateItem(report) : renderFlatReportItem(report),
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="standard" className="mt-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-border/50">
                {standardReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No reports match your search
                  </div>
                ) : (
                  standardReports.map((report) => renderFlatReportItem(report))
                )}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-0 flex-1 overflow-y-auto">
              {renderMyTemplatesContent()}
            </TabsContent>
          </>
        )}
      </Tabs>

      <CreateReportModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
