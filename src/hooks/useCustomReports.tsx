import { useState, useEffect, useCallback } from "react";
import { Report } from "@/constants/reports";

const CUSTOM_REPORTS_KEY = "custom-reports";

export interface CustomReportConfiguration {
  widgetOrder?: string[];
  chartTypes?: Record<string, string>;
  filterSettings?: Record<string, any>;
}

export interface CustomReport extends Omit<Report, "icon"> {
  id: string;
  title: string;
  description: string;
  parentReportId: string;
  category: Report["category"];
  isCustom: true;
  starred: boolean;
  configuration?: CustomReportConfiguration;
  createdAt: string;
}

export const useCustomReports = () => {
  const [customReports, setCustomReports] = useState<CustomReport[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_REPORTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_REPORTS_KEY, JSON.stringify(customReports));
    } catch {
      /* ignore */
    }
  }, [customReports]);

  const addCustomReport = useCallback(
    (
      title: string,
      description: string,
      parentReportId: string,
      category: Report["category"],
      configuration?: CustomReportConfiguration,
    ): string => {
      const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      setCustomReports((prev) => [
        ...prev,
        {
          id,
          title,
          description,
          parentReportId,
          category,
          isCustom: true,
          starred: false,
          configuration,
          createdAt: new Date().toISOString(),
        },
      ]);
      return id;
    },
    [],
  );

  const updateCustomReport = useCallback(
    (id: string, updates: Partial<Omit<CustomReport, "id" | "isCustom" | "createdAt">>) =>
      setCustomReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r))),
    [],
  );

  const deleteCustomReport = useCallback(
    (id: string) => setCustomReports((prev) => prev.filter((r) => r.id !== id)),
    [],
  );

  const getCustomReport = useCallback(
    (id: string) => customReports.find((r) => r.id === id),
    [customReports],
  );

  const getCustomReportsByParent = useCallback(
    (parentReportId: string) => customReports.filter((r) => r.parentReportId === parentReportId),
    [customReports],
  );

  return {
    customReports,
    addCustomReport,
    updateCustomReport,
    deleteCustomReport,
    getCustomReport,
    getCustomReportsByParent,
  };
};
