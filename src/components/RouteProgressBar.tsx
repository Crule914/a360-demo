import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function RouteProgressBar() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setVisible(true);
      setProgress(10);
      timer.current = setInterval(() => {
        setProgress((p) => (p < 85 ? p + Math.max(1, (90 - p) * 0.08) : p));
      }, 120);
    } else {
      if (timer.current) clearInterval(timer.current);
      setProgress(100);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isLoading]);

  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[80] pointer-events-none">
      <div
        className="h-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.6)] transition-[width,opacity] duration-200"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
