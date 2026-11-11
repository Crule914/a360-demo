import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export type ReportsLayoutMode = "full-width" | "content-only";
export type ReportsStyleMode = "card" | "flat";

const LAYOUT_STORAGE_KEY = "reports-layout-mode";
const STYLE_STORAGE_KEY = "reports-style-mode";

interface ReportsLayoutContextValue {
  layoutMode: ReportsLayoutMode;
  setLayoutMode: (mode: ReportsLayoutMode) => void;
  isFullWidth: boolean;
  isContentOnly: boolean;
  styleMode: ReportsStyleMode;
  setStyleMode: (mode: ReportsStyleMode) => void;
  isCardStyle: boolean;
  isFlatStyle: boolean;
}

const ReportsLayoutContext = createContext<ReportsLayoutContextValue | null>(null);

export const ReportsLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layoutMode, setLayoutMode] = useState<ReportsLayoutMode>(() => {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return (stored as ReportsLayoutMode) || "full-width";
  });

  const [styleMode, setStyleMode] = useState<ReportsStyleMode>(() => {
    const stored = localStorage.getItem(STYLE_STORAGE_KEY);
    return (stored as ReportsStyleMode) || "card";
  });

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem(STYLE_STORAGE_KEY, styleMode);
  }, [styleMode]);

  return (
    <ReportsLayoutContext.Provider
      value={{
        layoutMode,
        setLayoutMode,
        isFullWidth: layoutMode === "full-width",
        isContentOnly: layoutMode === "content-only",
        styleMode,
        setStyleMode,
        isCardStyle: styleMode === "card",
        isFlatStyle: styleMode === "flat",
      }}
    >
      {children}
    </ReportsLayoutContext.Provider>
  );
};

export const useReportsLayout = () => {
  const context = useContext(ReportsLayoutContext);
  if (!context) throw new Error("useReportsLayout must be used within a ReportsLayoutProvider");
  return context;
};
