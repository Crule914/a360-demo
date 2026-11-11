import { createFileRoute } from "@tanstack/react-router";
import { SweetsContactsShell, CaretakerNote } from "@/components/sweets/SweetsContactsShell";
import { WORKFLOWS } from "@/data/sweetsContacts";
import { AlertTriangle, ArrowDown, Plus, Settings } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/household/sweets/contacts/workflows")({
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const [showCompleted, setShowCompleted] = useState(true);
  return (
    <SweetsContactsShell>
      <div className="px-6 py-4 flex items-center">
        <h2 className="text-[18px] font-semibold text-[#13294B]">Workflows</h2>
        <div className="ml-auto flex items-center gap-3 text-[14px]">
          <a className="text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
            <Plus className="w-4 h-4" /> Apply Workflow
          </a>
          <span className="text-[#D1D5DB]">|</span>
          <label className="inline-flex items-center gap-2 text-[#13294B]">
            Show Completed
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className={`w-9 h-5 rounded-full p-0.5 transition ${
                showCompleted ? "bg-[#1A5FA8]" : "bg-[#D1D5DB]"
              }`}
              aria-pressed={showCompleted}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  showCompleted ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      <CaretakerNote />

      <div className="mx-6 mb-6 bg-white border border-[#E3E6EA]">
        <div className="px-4 py-3 flex items-center border-b border-[#F0F2F5]">
          <div className="text-[13px] text-[#13294B]">{WORKFLOWS.length} workflows</div>
          <a className="ml-auto text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" /> Manage Columns
          </a>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase text-[#1f6fb8] border-b border-[#E3E6EA]">
              <th className="text-left font-medium py-2 px-3">
                <span className="inline-flex items-center gap-1">Workflow Name <ArrowDown className="w-3 h-3" /></span>
              </th>
              <th className="text-left font-medium py-2 px-3">Status</th>
              <th className="text-left font-medium py-2 px-3">Main Event Date</th>
              <th className="text-left font-medium py-2 px-3">Next Activity</th>
              <th className="text-left font-medium py-2 px-3">Next Activity Due Date</th>
              <th className="text-left font-medium py-2 px-3">Next Activity Owner</th>
            </tr>
          </thead>
          <tbody>
            {WORKFLOWS.map((w) => (
              <tr key={w.name} className="border-b border-[#F0F2F5]">
                <td className="px-3 py-3">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer">{w.name}</a>
                </td>
                <td className="px-3 py-3 text-[#13294B]">{w.status}</td>
                <td className="px-3 py-3 text-[#13294B]">{w.mainDate}</td>
                <td className="px-3 py-3">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer">{w.nextActivity}</a>
                </td>
                <td className="px-3 py-3 text-[#13294B]">
                  <span className="inline-flex items-center gap-1">
                    {w.nextDate}
                    {w.warning && <AlertTriangle className="w-3.5 h-3.5 text-[#E0A800] fill-[#FFF3B0]" />}
                  </span>
                </td>
                <td className="px-3 py-3 text-[#13294B]">{w.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-6 pb-6 text-[12px] text-[#6b7280]">
        For financial professional use only. Not for use with the public.
      </p>
    </SweetsContactsShell>
  );
}
