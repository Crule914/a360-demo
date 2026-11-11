import { ExternalLink } from "lucide-react";

export function HomeTopBar() {
  return (
    <div className="bg-header text-white flex items-center justify-between px-6 py-3">
      <div>
        <div className="text-[11px] font-medium tracking-wide uppercase text-white/75">
          Home
        </div>
        <div className="text-[20px] font-medium leading-tight">Dashboard</div>
      </div>
      <button className="text-white/85 hover:text-white" aria-label="Open in new window">
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}
