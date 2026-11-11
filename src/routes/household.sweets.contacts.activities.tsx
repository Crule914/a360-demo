import { createFileRoute } from "@tanstack/react-router";
import { CanEdit } from "@/components/CanEdit";
import { SweetsContactsShell, CaretakerNote } from "@/components/sweets/SweetsContactsShell";
import { ACTIVITIES } from "@/data/sweetsContacts";
import { useWedgeProducts, WEDGE_PRODUCTS } from "@/lib/demoConfig";
import {
  AlertTriangle,
  ArrowDown,
  Cake,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Filter,
  GitBranch,
  ListChecks,
  Paperclip,
  Pencil,
  Phone,
  Pin,
  Plus,
  Settings,
  StickyNote,
} from "lucide-react";

export const Route = createFileRoute("/household/sweets/contacts/activities")({
  component: ActivitiesPage,
});

function ActivityIcon({ type }: { type: (typeof ACTIVITIES)[number]["type"] }) {
  const cls = "w-4 h-4 text-[#1D9E75]";
  if (type === "Appointment") return <CalendarCheck className={cls} />;
  if (type === "Note") return <StickyNote className={cls} />;
  if (type === "Phone Call") return <Phone className={cls} />;
  if (type === "Life Event") return <Cake className={cls} />;
  return <ListChecks className={cls} />;
}

const HOUSEHOLD = "THE SWEETS FAMILY";

function ActivitiesPage() {
  const wedge = useWedgeProducts();
  const clientPortal = WEDGE_PRODUCTS.some(
    (w) => w === "Client Portal" && wedge.state[w],
  );
  const activities = clientPortal
    ? ACTIVITIES.filter((a) => a.investor360)
    : ACTIVITIES;
  return (
    <SweetsContactsShell>
      <div className="px-6 py-4 flex items-center">
        <h2 className="text-[18px] font-semibold text-[#13294B]">Activities</h2>
        <div className="ml-auto">
          <CanEdit>
            <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Activity
            </a>
          </CanEdit>
        </div>
      </div>

      <CaretakerNote />

      {/* Reviews + Touch Points */}
      <div className="mx-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel
          title="Reviews"
          items={[
            { label: "Last Review", value: "11/25/2025" },
            { label: "Next Projected Review", value: "04/20/2026", warning: true },
            { label: "Next Scheduled Review", value: "06/24/2026" },
          ]}
        />
        <Panel
          title="Touch Points"
          items={[
            { label: "Last Touch Point", value: "03/16/2026" },
            { label: "Next Projected Touch Point", value: "06/16/2026", warning: true },
            { label: "Next Scheduled Touch Point", value: "06/24/2026" },
          ]}
        />
      </div>

      <div className="mx-6 mb-6 bg-white border border-[#E3E6EA]">
        <div className="px-4 py-3 flex items-center border-b border-[#F0F2F5]">
          <div className="text-[15px] font-semibold text-[#13294B]">All Activities</div>
          <div className="ml-auto flex items-center gap-3">
            <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Tags
            </a>
            <span className="text-[#D1D5DB]">|</span>
            <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Manage Columns
            </a>
          </div>
        </div>
        <div className="px-4 py-2 text-[13px] text-[#13294B] border-b border-[#F0F2F5]">
          {activities.length} activities
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase text-[#6b7280] border-b border-[#E3E6EA]">
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Activity <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">Subject</th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Regarding <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Date <ArrowDown className="w-3 h-3" /> <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Status <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Owner <Filter className="w-3 h-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => (
                <tr key={i} className="border-b border-[#F0F2F5]">
                  <td className="px-2 py-2 text-[#1A5FA8]"><Plus className="w-4 h-4" /></td>
                  <td className="px-1 py-2"><input type="checkbox" className="accent-[#1A5FA8]" /></td>
                  <td className="px-1 py-2 text-[#B5BAC2]">
                    <Pin className={`w-3.5 h-3.5 ${a.pinned ? "text-[#1A5FA8]" : ""}`} />
                  </td>
                  <td className="px-1 py-2"><ActivityIcon type={a.type} /></td>
                  <td className="px-1 py-2 text-[#1D9E75]">
                    {a.hasChildren && <GitBranch className="w-3.5 h-3.5" />}
                  </td>
                  <td className="px-3 py-2 text-[#13294B]">{a.type}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      <a className="text-[#1A5FA8] hover:underline cursor-pointer">{a.subject}</a>
                      {a.attachment && <Paperclip className="w-3.5 h-3.5 text-[#6b7280]" />}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <a className="text-[#1A5FA8] hover:underline cursor-pointer">{HOUSEHOLD}</a>
                  </td>
                  <td className="px-3 py-2 text-[#13294B]">
                    <span className="inline-flex items-center gap-1">
                      {a.date}
                      {a.warning && <AlertTriangle className="w-3.5 h-3.5 text-[#E0A800] fill-[#FFF3B0]" />}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {a.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1D9E75] fill-[#1D9E75]/15" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#9097A2]" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-[#13294B]">{a.owner}</td>
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

function Panel({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string; warning?: boolean }[];
}) {
  return (
    <div className="bg-white border border-[#E3E6EA] p-4">
      <div className="flex items-start">
        <h4 className="text-[16px] font-semibold text-[#13294B] mr-6">{title}</h4>
        <div className="flex-1 grid grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.label}>
              <div className="text-[12px] text-[#6b7280]">{it.label}</div>
              <div className="text-[14px] text-[#13294B] inline-flex items-center gap-1">
                {it.value}
                {it.warning && <AlertTriangle className="w-3.5 h-3.5 text-[#E0A800] fill-[#FFF3B0]" />}
              </div>
            </div>
          ))}
        </div>
        <CanEdit>
          <button className="text-[#6b7280] hover:text-[#13294B] ml-2" aria-label="Edit">
            <Pencil className="w-4 h-4" />
          </button>
        </CanEdit>
      </div>
    </div>
  );
}
