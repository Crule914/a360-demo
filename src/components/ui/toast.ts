// Lightweight types for use-toast hook. The full shadcn Toast UI isn't installed
// in this project — toast() calls are no-ops at the UI level but keep the API
// surface for ported code.
import type * as React from "react";

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement;
