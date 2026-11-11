import { ChevronDown, Download, Leaf } from "lucide-react";
import type { ReactNode } from "react";

export function DocsToolbar({
  title,
  showDate = true,
}: {
  title: string;
  showDate?: boolean;
}) {
  return (
    <div className="bg-white border-b border-[#d4dae3] px-6 py-3 flex items-center gap-3">
      <div className="text-[15px] font-semibold text-[#143A69]">{title}</div>
      <div className="w-px h-6 bg-[#c5ccd6] mx-1" />
      <button className="h-9 px-3 bg-white border border-[#1f6fb8] rounded-sm text-[13px] text-[#1f6fb8] flex items-center gap-2 hover:bg-[#f4f8fc]">
        All Accounts <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {showDate && (
        <button className="h-9 px-3 bg-[#fff8e1] border border-[#e0b400] rounded-sm text-[13px] text-[#1f2937] flex items-center gap-2">
          <span className="font-semibold text-[#143A69]">Most Recent</span>
          <span className="text-[#6b7280]">06/24/2025 - 06/24/2026</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="ml-auto">
        <button className="flex items-center gap-1 text-[#1f6fb8] hover:underline">
          <Leaf className="w-4 h-4" /> Paperless Preferences
        </button>
      </div>
    </div>
  );
}

export function DocsTable({
  resultsLabel,
  headers,
  children,
}: {
  resultsLabel: string;
  headers: ReactNode[];
  children: ReactNode;
}) {
  return (
    <div className="bg-white">
      <div className="px-6 py-3 border-b border-[#d4dae3] text-[13px] text-[#1f2937]">
        {resultsLabel}
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-[12px] text-[#1f6fb8] uppercase border-b border-[#d4dae3]">
            <th className="px-4 py-2 w-8">
              <input type="checkbox" />
            </th>
            <th className="px-2 py-2 w-10"></th>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function DocsRow({ cells }: { cells: ReactNode[] }) {
  return (
    <tr className="border-b border-[#eef1f5] hover:bg-[#f8fafc]">
      <td className="px-4 py-2.5">
        <input type="checkbox" />
      </td>
      <td className="px-2 py-2.5">
        <Download className="w-4 h-4 text-[#1f6fb8]" />
      </td>
      {cells.map((c, i) => (
        <td key={i} className="px-4 py-2.5">
          {c}
        </td>
      ))}
    </tr>
  );
}
