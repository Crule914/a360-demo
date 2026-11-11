import { createFileRoute } from "@tanstack/react-router";
import { CanEdit } from "@/components/CanEdit";
import { SweetsContactsShell, CaretakerNote } from "@/components/sweets/SweetsContactsShell";
import { CONNECTIONS } from "@/data/sweetsContacts";
import { LayoutGrid, LayoutList, MoreVertical, Plus, Settings, Star } from "lucide-react";

export const Route = createFileRoute("/household/sweets/contacts/connections")({
  component: ConnectionsPage,
});

function ConnectionsPage() {
  return (
    <SweetsContactsShell>
      <div className="px-6 py-4 flex items-center">
        <h2 className="text-[18px] font-semibold text-[#13294B]">Connections</h2>
        <div className="ml-auto flex items-center gap-3 text-[14px]">
          <CanEdit>
            <a className="text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Connection
            </a>
            <span className="text-[#D1D5DB]">|</span>
          </CanEdit>
          <div className="flex items-center border border-[#D1D5DB] rounded-sm">
            <button className="px-1.5 py-1 bg-[#1A5FA8] text-white" aria-label="List view">
              <LayoutList className="w-4 h-4" />
            </button>
            <button className="px-1.5 py-1 text-[#6b7280]" aria-label="Grid view">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CaretakerNote />

      <div className="mx-6 mb-6 bg-white border border-[#E3E6EA]">
        <div className="px-4 py-3 flex items-center border-b border-[#F0F2F5]">
          <div className="text-[13px] text-[#13294B]">{CONNECTIONS.length} connections</div>
          <a className="ml-auto text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" /> Manage Columns
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase text-[#6b7280] border-b border-[#E3E6EA]">
                <th className="w-8"></th>
                <th className="text-left font-medium py-2 px-3">Name</th>
                <th className="text-left font-medium py-2 px-3">Connected To</th>
                <th className="text-left font-medium py-2 px-3">Email</th>
                <th className="text-left font-medium py-2 px-3">Phone</th>
                <th className="text-left font-medium py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {CONNECTIONS.map((c) => (
                <tr key={c.name} className="border-b border-[#F0F2F5] align-top">
                  <td className="px-1 py-3 text-[#6b7280]">
                    <MoreVertical className="w-4 h-4" />
                  </td>
                  <td className="px-3 py-3">
                    <a className="text-[#1A5FA8] hover:underline cursor-pointer">{c.name}</a>
                    <span className="text-[#13294B] ml-1">({c.role})</span>
                  </td>
                  <td className="px-3 py-3 text-[#13294B]">
                    {c.connectedTo}
                    <span className="text-[#6b7280] ml-1">({c.connectedRel})</span>
                  </td>
                  <td className="px-3 py-3">
                    <a className="text-[#1A5FA8] hover:underline cursor-pointer block">{c.email}</a>
                    <div className="text-[12px] text-[#6b7280] flex items-center gap-1">
                      ({c.emailLabel})
                      {c.emailPrimary && <Star className="w-3 h-3 text-[#1D9E75] fill-[#1D9E75]" />}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#13294B]">{c.phone}</td>
                  <td className="px-3 py-3 text-[#13294B] truncate max-w-[260px]">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="px-6 pb-6 text-[12px] text-[#6b7280]">
        For financial professional use only. Not for use with the public.
      </p>
    </SweetsContactsShell>
  );
}
