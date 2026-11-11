import type { ReactNode } from "react";
import { GripVertical, MoreVertical } from "lucide-react";
import { LeftRail } from "./LeftRail";
import { VidaPanel } from "./vida/VidaPanel";
import { RouteProgressBar } from "./RouteProgressBar";

export function AppShell({
  topBar,
  children,
}: {
  topBar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#F0F2F5] text-[#1f2937] font-sans">
      <RouteProgressBar />
      <LeftRail />
      <div className="flex-1 flex flex-col min-w-0">
        {topBar}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <VidaPanel />
    </div>
  );
}

export function Card({
  title,
  children,
  className = "",
  chrome = true,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  chrome?: boolean;
}) {
  return (
    <section
      className={`bg-white border border-[#E3E6EA] rounded-[2px] ${className}`}
    >
      {title && (
        <header className="flex items-center px-3 py-2.5 border-b border-[#E3E6EA]">
          {chrome && (
            <GripVertical className="w-3.5 h-3.5 text-[#B5BAC2] mr-1.5 cursor-grab" />
          )}
          <h3 className="flex-1 text-[15px] font-semibold text-[#13294B]">
            {title}
          </h3>
          {chrome && (
            <button className="text-[#6b7280] hover:text-[#13294B]">
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
