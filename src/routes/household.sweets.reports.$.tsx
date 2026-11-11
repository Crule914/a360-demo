import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route as RouterRoute,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ExternalLink, Mail } from "lucide-react";

import shortcutsIcon from "@/assets/shortcuts-icon.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs, useCrmReadOnly } from "@/lib/navVisibility";
import { pushRecentHousehold } from "@/lib/recentHouseholds";
import { sweetsMembers } from "@/data/sweetsOverview";

import { ReportsSidebar } from "@/components/reports/ReportsSidebar";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { REPORTS, Report } from "@/constants/reports";
import { PortfolioSummaryDashboard } from "@/components/reports/PortfolioSummaryDashboard";
import { AccountRegisterDashboard } from "@/components/reports/AccountRegisterDashboard";
import { AllocationHoldingsSummaryDashboard } from "@/components/reports/AllocationHoldingsSummaryDashboard";
import { EstimatedRealizedGainLossDashboard } from "@/components/reports/EstimatedRealizedGainLossDashboard";
import { PerformanceHistoryTWRDashboard } from "@/components/reports/PerformanceHistoryTWRDashboard";
import { BeneficiaryReviewDashboard } from "@/components/reports/BeneficiaryReviewDashboard";
import { FinancialSummaryDashboard } from "@/components/reports/FinancialSummaryDashboard";
import { PortfolioHoldingsDashboard } from "@/components/reports/PortfolioHoldingsDashboard";
import { CalendarMarketValuePerformanceDashboard } from "@/components/reports/CalendarMarketValuePerformanceDashboard";
import { ChangeMarketValueRegisterDashboard } from "@/components/reports/ChangeMarketValueRegisterDashboard";
import { EstimatedCashFlowDashboard } from "@/components/reports/EstimatedCashFlowDashboard";
import { HistoricalMarketValueDashboard } from "@/components/reports/HistoricalMarketValueDashboard";
import { HistoricalMarketValuePerformanceSummaryDashboard } from "@/components/reports/HistoricalMarketValuePerformanceSummaryDashboard";
import { HouseholdSummaryDashboard } from "@/components/reports/HouseholdSummaryDashboard";
import { FiltersPanel } from "@/components/reports/FiltersPanel";
import { AIChatPanel } from "@/components/reports/AIChatPanel";
import { SaveConfigurationModal } from "@/components/reports/SaveConfigurationModal";
import { ReportsLandingDashboard } from "@/components/reports/ReportsLandingDashboard";
import { ConfigureReportsPanel } from "@/components/reports/ConfigureReportsPanel";
import { AIInsightsPanel } from "@/components/reports/AIInsightsPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { useCustomReports, CustomReportConfiguration } from "@/hooks/useCustomReports";
import { useReportsLanding } from "@/hooks/useReportsLanding";
import { useToast } from "@/hooks/use-toast";
import { ReportsLayoutProvider } from "@/hooks/useReportsLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

const TABS = [
  { label: "Overview", to: "/household/sweets" as const },
  { label: "Trading/Holdings", caret: true, menuItems: [{ label: "Trading/Holdings", to: "/household/sweets/trading-holdings" }, { label: "Account Activity", to: "/household/sweets/account-activity" }, { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" }, { label: "Account Profile", to: "/household/sweets/account-profile" }] },
  { label: "Insurance" },
  { label: "Reports", to: "/household/sweets/reports" as const, active: true },
  { label: "Documents", caret: true, menuItems: [{ label: "Documents", to: "/household/sweets/documents" }, { label: "Statements", to: "/household/sweets/statements" }, { label: "Tax Documents", to: "/household/sweets/tax-documents" }, { label: "Customer Correspondence", to: "/household/sweets/customer-correspondence" }, { label: "Confirms", to: "/household/sweets/confirms" }] },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

export const Route = createFileRoute("/household/sweets/reports/$")({
  // Reports app uses localStorage + react-router; not SSR-safe.
  ssr: false,
  component: HouseholdReportsRoute,
});

function HouseholdReportsRoute() {
  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="CLIENTS"
          title={HOUSEHOLD_NAME}
          titleExtra={
            <>
              <button className="text-white/90 hover:text-white" aria-label="Email">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-1.5">
                {sweetsMembers.map((m) => (
                  <div
                    key={m.initials}
                    title={m.name}
                    className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-[11px] font-semibold tracking-wide"
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
            </>
          }
          tabs={useFilteredHouseholdTabs(TABS)}
          rightActions={
            <>
              <AppLauncherDropdown />
              <button aria-label="Open" className="hover:text-white">
                <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </>
          }
        />
      }
    >
      <ReportsLayoutProvider>
        <TooltipProvider>
          <BrowserRouter basename="/household/sweets/reports">
            <div className="reports-scope flex flex-col min-h-[calc(100vh-220px)]">
              <AIInsightsPanel />
              <div className="flex-1 min-h-0">
                <Routes>
                  <RouterRoute path="/" element={<Reports />} />
                  <RouterRoute path="/:reportId" element={<Reports />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ReportsLayoutProvider>
    </AppShell>
  );
}

function AppLauncherDropdown() {
  const [open, setOpen] = useState(false);
  const hideActivity = useCrmReadOnly();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleDocumentClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label="App launcher"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="hover:text-white"
      >
        <img src={shortcutsIcon.url} alt="" className="w-5 h-5 object-contain" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[270px] bg-white rounded-md shadow-lg z-50 py-2">
          <div className="absolute -top-2 right-[6px] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#17447B]" />
          {!hideActivity && (
          <>
          <div className="px-4 pt-2">
            <div className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
              Add Activity
            </div>
            {[
              "Add Task",
              "Add Phone Call",
              "Add Appointment",
              
              "Add Note",
              "Add Investor360° Message",
              "Apply Workflow",
            ].map((label) => (
              <a
                key={label}
                className="block text-[14px] text-[#1A5FA8] py-1.5 hover:underline cursor-pointer"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="border-t border-[#E3E6EA] my-2" />
          </>
          )}
          <div className="px-4 pb-2">
            <div className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
              Launch
            </div>
            {[
              "Account Opening",
              "Schwab Advisor Center",
              "Investor360° (Impersonate)",
            ].map((label) => (
              <a
                key={label}
                className="block text-[14px] text-[#1A5FA8] py-1.5 hover:underline cursor-pointer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Reports() {
  const { reportId: urlReportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(urlReportId || null);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pendingConfiguration, setPendingConfiguration] = useState<CustomReportConfiguration | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAISummaryVisible, setIsAISummaryVisible] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const { toggleFavorite, isFavorite, hasFavoritePreference } = useFavorites();
  const { customReports, addCustomReport, updateCustomReport, deleteCustomReport } = useCustomReports();
  const { toast } = useToast();

  // Default to Allocation & Holdings Summary on first visit.
  useEffect(() => {
    if (!urlReportId) {
      navigate("/allocation-holdings-summary", { replace: true });
    } else {
      setSelectedReportId(urlReportId);
    }
  }, [urlReportId, navigate]);

  useEffect(() => {
    if ((location.state as any)?.reset) {
      navigate("/", { replace: true });
      setIsSidebarCollapsed(false);
      setHasUnsavedChanges(false);
      setIsAISummaryVisible(true);
    }
  }, [location.state, navigate]);

  const {
    selectedReportIds: landingReportIds,
    isConfigPanelOpen,
    tempSelectedIds,
    openConfigPanel,
    closeConfigPanel,
    toggleTempReport,
    selectAllTemp,
    deselectAllTemp,
    saveConfiguration: saveLandingConfig,
    cancelConfiguration: cancelLandingConfig,
    maxReports,
  } = useReportsLanding();

  const isLandingView = selectedReportId === null;

  const handleReportUpdated = () => setHasUnsavedChanges(true);

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

  const selectedReport = selectedReportId ? allReports.find((r) => r.id === selectedReportId) : null;

  const handleOpenChat = (question: string) => {
    setChatQuestion(question);
    setIsChatPanelOpen(true);
  };

  const getRelatedReports = () => {
    if (!selectedReport) return [];
    const relatedReports: { id: string; title: string; isCustom?: boolean }[] = [];

    if (selectedReport.isCustom && selectedReport.parentReportId) {
      const parentReport = allReports.find((r) => r.id === selectedReport.parentReportId);
      if (parentReport) {
        relatedReports.push({ id: parentReport.id, title: parentReport.title, isCustom: false });
      }
      relatedReports.push({ id: selectedReport.id, title: selectedReport.title, isCustom: true });
      const siblings = allReports.filter(
        (r) => r.parentReportId === selectedReport.parentReportId && r.id !== selectedReportId,
      );
      relatedReports.push(...siblings.map((r) => ({ id: r.id, title: r.title, isCustom: r.isCustom })));
    } else {
      relatedReports.push({ id: selectedReport.id, title: selectedReport.title, isCustom: false });
      const customChildren = allReports.filter((r) => r.parentReportId === selectedReport.id);
      relatedReports.push(
        ...customChildren.map((r) => ({ id: r.id, title: r.title, isCustom: r.isCustom })),
      );
    }
    return relatedReports;
  };

  const handleSaveConfiguration = (configuration?: CustomReportConfiguration) => {
    setPendingConfiguration(configuration);
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = (title: string, description: string) => {
    if (!selectedReport) return;
    const parentId =
      selectedReport.isCustom && selectedReport.parentReportId
        ? selectedReport.parentReportId
        : selectedReport.id;
    const newReportId = addCustomReport(
      title,
      description,
      parentId,
      selectedReport.category,
      pendingConfiguration,
    );
    toast({ title: "Report saved", description: `"${title}" has been created successfully.` });
    navigate(`/${newReportId}`);
    setPendingConfiguration(undefined);
    setHasUnsavedChanges(false);
  };

  const handleSaveExisting = () => {
    if (!selectedReport?.isCustom || !selectedReportId) return;
    updateCustomReport(selectedReportId, { configuration: pendingConfiguration });
    toast({ title: "Report saved", description: `"${selectedReport.title}" has been updated.` });
    setHasUnsavedChanges(false);
  };

  const handleEditReport = () => setIsEditModalOpen(true);

  const handleConfirmEdit = (title: string, description: string) => {
    if (!selectedReport?.isCustom) return;
    updateCustomReport(selectedReportId!, { title, description });
    toast({ title: "Report updated", description: `"${title}" has been updated.` });
    setIsEditModalOpen(false);
  };

  const handleDeleteReport = () => {
    if (!selectedReport?.isCustom) return;
    const reportTitle = selectedReport.title;
    const parentId = selectedReport.parentReportId;
    deleteCustomReport(selectedReportId!);
    if (parentId) navigate(`/${parentId}`);
    else navigate("/");
    toast({ title: "Report deleted", description: `"${reportTitle}" has been deleted.` });
  };

  const handleSelectReport = (reportId: string | null) => {
    if (reportId) navigate(`/${reportId}`);
    else navigate("/");
    setHasUnsavedChanges(false);
  };

  const renderReport = () => {
    if (!selectedReportId || !selectedReport) return null;

    const commonProps = {
      isFiltersPanelOpen,
      onToggleFiltersPanel: () => setIsFiltersPanelOpen(!isFiltersPanelOpen),
      onOpenChat: handleOpenChat,
      isSidebarCollapsed,
      reportTitle: selectedReport.title,
      reportDescription: selectedReport.description,
      isCustomReport: selectedReport.isCustom || false,
      currentReportId: selectedReportId,
      onReportChange: handleSelectReport,
      isFavorite: isFavorite(selectedReportId),
      onToggleFavorite: () => toggleFavorite(selectedReportId),
      onSaveConfiguration: handleSaveConfiguration,
      hasUnsavedChanges,
      isAISummaryVisible,
      onToggleAISummary: () => setIsAISummaryVisible(!isAISummaryVisible),
      hideHeader: true,
      onReportUpdated: handleReportUpdated,
    };

    const effectiveReportId =
      selectedReport.isCustom && selectedReport.parentReportId
        ? selectedReport.parentReportId
        : selectedReportId;

    switch (effectiveReportId) {
      case "allocation-holdings-summary":
        return <AllocationHoldingsSummaryDashboard {...commonProps} />;
      case "account-register":
        return <AccountRegisterDashboard {...commonProps} />;
      case "estimated-realized-gain-loss":
        return <EstimatedRealizedGainLossDashboard {...commonProps} />;
      case "performance-history-twr":
        return <PerformanceHistoryTWRDashboard {...commonProps} />;
      case "beneficiary-review":
        return <BeneficiaryReviewDashboard {...commonProps} />;
      case "financial-summary":
        return <FinancialSummaryDashboard {...commonProps} />;
      case "portfolio-holdings":
        return <PortfolioHoldingsDashboard {...commonProps} />;
      case "calendar-market-value-performance":
        return <CalendarMarketValuePerformanceDashboard {...commonProps} />;
      case "change-market-value-register":
        return <ChangeMarketValueRegisterDashboard {...commonProps} />;
      case "estimated-cash-flow":
        return <EstimatedCashFlowDashboard {...commonProps} />;
      case "historical-market-value":
        return <HistoricalMarketValueDashboard {...commonProps} />;
      case "historical-market-value-performance":
        return <HistoricalMarketValuePerformanceSummaryDashboard {...commonProps} />;
      case "household-summary":
        return <HouseholdSummaryDashboard {...commonProps} />;
      default:
        return <PortfolioSummaryDashboard {...commonProps} />;
    }
  };

  const relatedReports = getRelatedReports();

  const headerProps = {
    isFiltersPanelOpen,
    onToggleFiltersPanel: isLandingView
      ? openConfigPanel
      : () => setIsFiltersPanelOpen(!isFiltersPanelOpen),
    onToggleSidebar: () => setIsSidebarCollapsed(!isSidebarCollapsed),
    isSidebarCollapsed,
    reportTitle: isLandingView ? "Client Reports Overview" : selectedReport?.title || "",
    reportDescription: isLandingView
      ? "Combined insights from your selected reports"
      : selectedReport?.description || "",
    isCustomReport: selectedReport?.isCustom || false,
    relatedReports: isLandingView ? [] : relatedReports,
    currentReportId: selectedReportId || undefined,
    onReportChange: handleSelectReport,
    isFavorite: selectedReportId ? isFavorite(selectedReportId) : false,
    onToggleFavorite: selectedReportId ? () => toggleFavorite(selectedReportId) : undefined,
    onSaveConfiguration: isLandingView ? undefined : handleSaveConfiguration,
    onSaveExisting: isLandingView ? undefined : handleSaveExisting,
    hasUnsavedChanges: isLandingView ? false : hasUnsavedChanges,
    isAISummaryVisible,
    onToggleAISummary: () => setIsAISummaryVisible(!isAISummaryVisible),
    selectedAccount,
    onAccountChange: setSelectedAccount,
    onEditReport: handleEditReport,
    onDeleteReport: handleDeleteReport,
    isLandingView,
  };

  return (
    <div className="flex flex-col h-full">
      <ReportsHeader {...headerProps} />
      <div className="flex flex-1 overflow-hidden mt-4">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarCollapsed
              ? "w-0 -translate-x-full opacity-0"
              : "w-[25%] translate-x-0 opacity-100"
          }`}
        >
          <ReportsSidebar
            onSelectReport={handleSelectReport}
            selectedReportId={selectedReportId}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            hasFavoritePreference={hasFavoritePreference}
            customReports={customReports}
            className="w-full h-full"
          />
        </div>
        {isLandingView ? (
          <ReportsLandingDashboard
            selectedReportIds={landingReportIds}
            isAISummaryVisible={isAISummaryVisible}
            onCloseAISummary={() => setIsAISummaryVisible(false)}
            onReportSelect={handleSelectReport}
          />
        ) : (
          renderReport()
        )}
        {!isLandingView && isFiltersPanelOpen && (
          <FiltersPanel
            isOpen={isFiltersPanelOpen}
            onClose={() => setIsFiltersPanelOpen(false)}
            reportId={selectedReportId!}
            className="w-[20%]"
            onUpdateReport={handleReportUpdated}
          />
        )}
        {isLandingView && (
          <ConfigureReportsPanel
            isOpen={isConfigPanelOpen}
            onClose={closeConfigPanel}
            selectedIds={tempSelectedIds}
            onToggleReport={toggleTempReport}
            onSelectAll={selectAllTemp}
            onDeselectAll={deselectAllTemp}
            onSave={saveLandingConfig}
            onCancel={cancelLandingConfig}
            maxReports={maxReports}
          />
        )}
        {isChatPanelOpen && (
          <AIChatPanel
            isOpen={isChatPanelOpen}
            onClose={() => setIsChatPanelOpen(false)}
            initialQuestion={chatQuestion}
            className="w-[20%]"
          />
        )}
      </div>
      <SaveConfigurationModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleConfirmSave}
        defaultTitle={`${selectedReport?.title || "Report"} - Custom`}
        defaultDescription={selectedReport?.description || ""}
        mode="create"
      />
      <SaveConfigurationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleConfirmEdit}
        defaultTitle={selectedReport?.title || ""}
        defaultDescription={selectedReport?.description || ""}
        mode="edit"
      />
    </div>
  );
}
