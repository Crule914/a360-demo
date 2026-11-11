import { createFileRoute } from "@tanstack/react-router";
import { CanEdit } from "@/components/CanEdit";
import { SweetsContactsShell, CaretakerNote } from "@/components/sweets/SweetsContactsShell";
import { OPPORTUNITIES } from "@/data/sweetsContacts";
import { Plus, Settings } from "lucide-react";

export const Route = createFileRoute("/household/sweets/contacts/opportunities")({
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  return (
    <SweetsContactsShell>
      <div className="px-6 py-4 flex items-center">
        <h2 className="text-[18px] font-semibold text-[#13294B]">Opportunities</h2>
        <div className="ml-auto">
          <CanEdit>
            <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Opportunity
            </a>
          </CanEdit>
        </div>
      </div>

      <CaretakerNote />

      <div className="mx-6 mb-6 bg-white border border-[#E3E6EA]">
        <div className="px-4 py-3 flex items-center border-b border-[#F0F2F5]">
          <div className="text-[13px] text-[#13294B]">{OPPORTUNITIES.length} opportunities</div>
          <a className="ml-auto text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" /> Manage Columns
          </a>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase text-[#6b7280] border-b border-[#E3E6EA]">
              <th className="text-left font-medium py-2 px-3">Opportunity Name</th>
              <th className="text-left font-medium py-2 px-3">Stage</th>
              <th className="text-left font-medium py-2 px-3">Amount</th>
              <th className="text-left font-medium py-2 px-3">Probability</th>
              <th className="text-left font-medium py-2 px-3">Close Date</th>
              <th className="text-left font-medium py-2 px-3">Owner</th>
            </tr>
          </thead>
          <tbody>
            {OPPORTUNITIES.map((o) => (
              <tr key={o.name} className="border-b border-[#F0F2F5]">
                <td className="px-3 py-3">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer">{o.name}</a>
                </td>
                <td className="px-3 py-3 text-[#13294B]">{o.stage}</td>
                <td className="px-3 py-3 text-[#13294B]">{o.amount}</td>
                <td className="px-3 py-3 text-[#13294B]">{o.probability}</td>
                <td className="px-3 py-3 text-[#13294B]">{o.closeDate}</td>
                <td className="px-3 py-3 text-[#13294B]">{o.owner}</td>
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
