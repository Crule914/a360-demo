import { useState, useEffect, useCallback } from "react";
import { DEFAULT_SELECTED_REPORTS } from "@/constants/reportSummaries";

const STORAGE_KEY = "reports-landing-config";
const MAX_SELECTED_REPORTS = 5;

interface ReportsLandingConfig {
  selectedReportIds: string[];
}

export const useReportsLanding = () => {
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: ReportsLandingConfig = JSON.parse(saved);
        return parsed.selectedReportIds || DEFAULT_SELECTED_REPORTS;
      } catch {
        return DEFAULT_SELECTED_REPORTS;
      }
    }
    return DEFAULT_SELECTED_REPORTS;
  });

  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedReportIds);

  useEffect(() => {
    if (isConfigPanelOpen) setTempSelectedIds(selectedReportIds);
  }, [isConfigPanelOpen, selectedReportIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedReportIds }));
  }, [selectedReportIds]);

  const openConfigPanel = useCallback(() => setIsConfigPanelOpen(true), []);
  const closeConfigPanel = useCallback(() => setIsConfigPanelOpen(false), []);

  const toggleTempReport = useCallback((reportId: string) => {
    setTempSelectedIds((prev) => {
      if (prev.includes(reportId)) return prev.filter((id) => id !== reportId);
      if (prev.length >= MAX_SELECTED_REPORTS) return prev;
      return [...prev, reportId];
    });
  }, []);

  const selectAllTemp = useCallback(
    (reportIds: string[]) => setTempSelectedIds(reportIds.slice(0, MAX_SELECTED_REPORTS)),
    [],
  );
  const deselectAllTemp = useCallback(() => setTempSelectedIds([]), []);

  const saveConfiguration = useCallback(() => {
    setSelectedReportIds(tempSelectedIds);
    setIsConfigPanelOpen(false);
  }, [tempSelectedIds]);

  const cancelConfiguration = useCallback(() => {
    setTempSelectedIds(selectedReportIds);
    setIsConfigPanelOpen(false);
  }, [selectedReportIds]);

  return {
    selectedReportIds,
    isConfigPanelOpen,
    tempSelectedIds,
    openConfigPanel,
    closeConfigPanel,
    toggleTempReport,
    selectAllTemp,
    deselectAllTemp,
    saveConfiguration,
    cancelConfiguration,
    maxReports: MAX_SELECTED_REPORTS,
  };
};
