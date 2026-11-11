import { useState } from "react";
import { ChevronRight, Minus, Plus, Check, GripVertical } from "lucide-react";
import {
  HOUSEHOLD_CATEGORY_ORDER,
  useHouseholdDashboardState,
  useAllowedHouseholdWidgets,
  type HouseholdWidgetCategory,
} from "@/lib/householdDashboardState";
import { WIDGET_THUMBNAILS } from "@/assets/widget-thumbs";


export function ManageHouseholdDashboardPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { active, columns, setColumns, toggleWidget } = useHouseholdDashboardState();
  const { catalog } = useAllowedHouseholdWidgets();
  const [openGroups, setOpenGroups] = useState<
    Record<HouseholdWidgetCategory, boolean>
  >({ Overview: true, CRM: true });

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />
      <aside className="fixed top-0 right-0 z-40 h-full w-[232px] bg-[#F0F2F5] border-l border-[#E3E6EA] shadow-xl flex flex-col">
        <div className="flex items-center gap-2 px-3 pt-4 pb-3 bg-[#F0F2F5]">
          <button
            onClick={onClose}
            className="w-7 h-7 inline-flex items-center justify-center bg-[#E3E6EA] hover:bg-[#D1D5DB] rounded-sm shrink-0"
            aria-label="Close panel"
          >
            <ChevronRight className="w-4 h-4 text-[#13294B]" />
          </button>
          <h2 className="text-[18px] leading-none font-normal text-black">
            Manage Dashboard
          </h2>
        </div>

        <div className="px-4 pb-4 flex items-center gap-3">
          <span className="text-[15px] text-[#5A6472]">Columns:</span>

          <button
            onClick={() => setColumns(2)}
            className={`p-1.5 border rounded-sm ${
              columns === 2 ? "border-[#13294B] bg-white" : "border-[#D1D5DB]"
            }`}
            aria-label="Two columns"
          >
            <ColumnsIcon n={2} active={columns === 2} />
          </button>
          <button
            onClick={() => setColumns(3)}
            className={`p-1.5 border rounded-sm ${
              columns === 3 ? "border-[#13294B] bg-white" : "border-[#D1D5DB]"
            }`}
            aria-label="Three columns"
          >
            <ColumnsIcon n={3} active={columns === 3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {HOUSEHOLD_CATEGORY_ORDER.map((cat) => {
            const items = catalog.filter((w) => w.category === cat);
            if (items.length === 0) return null;
            const isOpen = openGroups[cat];
            return (
              <div key={cat}>
                <button
                  onClick={() =>
                    setOpenGroups((g) => ({ ...g, [cat]: !g[cat] }))
                  }
                  className="flex items-center gap-2 text-[14px] font-semibold text-[#1A5FA8] py-1"
                >
                  <span className="w-5 h-5 rounded-full border border-[#1A5FA8] inline-flex items-center justify-center">
                    {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </span>
                  {cat} ({items.length})
                </button>
                {isOpen && (
                  <div className="mt-2 flex flex-wrap gap-3">
                    {items.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => toggleWidget(w.id)}
                        className="text-left bg-white border border-[#E3E6EA] rounded-sm overflow-hidden hover:border-[#1A5FA8] transition shrink-0"
                        style={{ width: 200 }}
                      >
                        <div
                          className="flex items-center px-2 border-b border-[#E3E6EA]"
                          style={{ height: 32 }}
                        >
                          <GripVertical className="w-3 h-3 text-[#B5BAC2] mr-1 shrink-0" />
                          <span className="flex-1 text-[12px] font-semibold text-[#13294B] truncate">
                            {w.title}
                          </span>
                          {active.includes(w.id) && (
                            <span className="w-4 h-4 rounded-full bg-[#1D9E75] inline-flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </span>
                          )}
                        </div>
                        <div
                          className="bg-[#F0F2F5]"
                          style={{ width: 200, height: 106 }}
                        >
                          <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
                            {WIDGET_THUMBNAILS[w.id] ? (
                              <img
                                src={WIDGET_THUMBNAILS[w.id]}
                                alt={`${w.title} widget preview`}
                                style={{ width: 179, height: 106 }}
                                className="object-contain"
                                loading="lazy"
                              />
                            ) : (
                              [0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="rounded-[1px]"
                                  style={{
                                    height: 2,
                                    background: i === 0 ? "#13294B" : "#D1D5DB",
                                    width: `${90 - i * 12}%`,
                                  }}
                                />
                              ))
                            )}
                          </div>

                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

function ColumnsIcon({ n, active }: { n: number; active: boolean }) {
  return (
    <div className="flex gap-0.5 w-6 h-4">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px]"
          style={{ background: active ? "#13294B" : "#B5BAC2" }}
        />
      ))}
    </div>
  );
}
