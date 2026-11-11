import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Check, GripVertical } from "lucide-react";
import {
  WIDGET_CATALOG,
  CATEGORY_ORDER,
  useDashboardState,
  useAllowedWidgets,
  type WidgetCategory,
  type WidgetId,
} from "@/lib/dashboardState";
import { WIDGET_THUMBNAILS } from "@/assets/widget-thumbs";


export function ManageDashboardPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { active, columns, setColumns, toggleWidget } = useDashboardState();
  const { catalog } = useAllowedWidgets();
  const [openGroups, setOpenGroups] = useState<Record<WidgetCategory, boolean>>({
    Reporting: true,
    General: false,
    CRM: false,
    Trading: false,
    Planning: false,
    Insurance: false,
  });

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
          {CATEGORY_ORDER.map((cat) => {
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
                    {isOpen ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                  {cat} ({items.length})
                </button>
                {isOpen && (
                  <div className="mt-2 flex flex-wrap gap-3">
                    {items.map((w) => (
                      <WidgetThumb
                        key={w.id}
                        id={w.id}
                        title={w.title}
                        added={active.includes(w.id)}
                        onToggle={() => toggleWidget(w.id)}
                      />
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

function WidgetThumb({
  id,
  title,
  added,
  onToggle,
}: {
  id: WidgetId;
  title: string;
  added: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="text-left bg-white border border-[#E3E6EA] rounded-sm overflow-hidden hover:border-[#1A5FA8] transition shrink-0"
      style={{ width: 200 }}
    >
      <div
        className="flex items-center px-2 border-b border-[#E3E6EA]"
        style={{ height: 32 }}
      >
        <GripVertical className="w-3 h-3 text-[#B5BAC2] mr-1 shrink-0" />
        <span className="flex-1 text-[12px] font-semibold text-[#13294B] truncate">
          {title}
        </span>
        {added && (
          <span className="w-4 h-4 rounded-full bg-[#1D9E75] inline-flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </span>
        )}
      </div>
      <div
        className="bg-[#F0F2F5] overflow-hidden"
        style={{ width: 200, height: 106 }}
      >
        <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
          {WIDGET_THUMBNAILS[id] ? (
            <img
              src={WIDGET_THUMBNAILS[id]}
              alt={`${title} widget preview`}
              style={{ width: 179, height: 106 }}
              className="object-contain"
              loading="lazy"
            />
          ) : (
            <ThumbPreview id={id} />
          )}
        </div>
      </div>

    </button>
  );
}

function ThumbPreview({ id }: { id: WidgetId }) {
  const line = (w: string, color = "#D1D5DB") => (
    <div style={{ width: w, height: 2, background: color, borderRadius: 1 }} />
  );
  const dark = "#13294B";

  switch (id) {
    case "statistics":
      return (
        <div className="flex gap-2">
          {[0, 1].map((c) => (
            <div key={c} className="flex-1 flex flex-col gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-1">
                  {line("55%")}
                  <div
                    style={{
                      width: "28%",
                      height: 3,
                      background: dark,
                      borderRadius: 1,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    case "businessSnapshot":
      return (
        <div className="flex flex-col gap-1.5">
          {line("45%", dark)}
          {line("75%")}
          <div className="flex gap-1">
            <div
              style={{
                height: 8,
                width: 14,
                background: dark,
                borderRadius: 1,
              }}
            />
            <div
              style={{
                height: 8,
                flex: 1,
                background: "#7FD0B5",
                borderRadius: 1,
              }}
            />
          </div>
          <div
            className="flex rounded-sm overflow-hidden"
            style={{ height: 8 }}
          >
            <div className="w-1/2" style={{ background: dark }} />
            <div className="w-1/4" style={{ background: "#1A5FA8" }} />
            <div className="w-1/4" style={{ background: "#7FD0B5" }} />
          </div>
          {line("55%")}
        </div>
      );
    case "assets":
      return (
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              {line(`${60 - i * 5}%`)}
              <div
                style={{
                  width: "22%",
                  height: 3,
                  background: dark,
                  borderRadius: 1,
                }}
              />
            </div>
          ))}
        </div>
      );
    case "favoriteReports":
      return (
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              {line(`${75 - (i % 3) * 10}%`, dark)}
              <div
                style={{
                  width: 20,
                  height: 8,
                  background: "#1A5FA8",
                  borderRadius: 2,
                }}
              />
            </div>
          ))}
        </div>
      );
    case "lastHouseholdsViewed":
      return (
        <div className="flex gap-2">
          <div className="w-2/5 flex flex-col gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>{line(`${90 - i * 8}%`, "#1A5FA8")}</div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#B5BAC2",
                }}
              />
              <div className="flex-1 flex flex-col gap-1">
                {line("75%", dark)}
                {line("50%")}
              </div>
            </div>
            <div
              style={{
                height: 6,
                background: "#FFF6CC",
                borderRadius: 1,
              }}
            />
            {line("65%")}
            {line("45%")}
          </div>
        </div>
      );
    case "popularApplications":
      return (
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="bg-[#B5BAC2]"
                style={{ width: 10, height: 10 }}
              />
              {line("85%", "#1A5FA8")}
            </div>
          ))}
        </div>
      );
    case "notifications":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex flex-col gap-1">
                {line("60%")}
                {line("80%", "#1A5FA8")}
              </div>
            ))}
          </div>
          {line("95%", dark)}
          {line("75%", "#1A5FA8")}
        </div>
      );
    case "clientActivity":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-around">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-full bg-[#1A5FA8]"
                style={{ width: 14, height: 14 }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {line("80%", "#1A5FA8")}
            {line("60%", "#1A5FA8")}
            {line("45%", "#1A5FA8")}
          </div>
        </div>
      );
    case "dayAtAGlance":
      return (
        <div className="flex flex-col gap-1.5">
          {line("100%", "#1D9E75")}
          <div className="flex justify-between items-center">
            <div
              className="bg-[#1A5FA8]"
              style={{ width: 10, height: 10 }}
            />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className={`${i === 4 ? "bg-[#1A5FA8]" : "bg-[#D1D5DB]"}`}
                  style={{ width: 8, height: 14, borderRadius: 1 }}
                />
              ))}
            </div>
            <div
              className="bg-[#1A5FA8]"
              style={{ width: 10, height: 10 }}
            />
          </div>
          {line("85%", dark)}
        </div>
      );
    case "financialCalculators":
      return (
        <div className="flex flex-col gap-1.5">
          {line("45%", dark)}
          {line("90%", "#1A5FA8")}
          {line("75%", "#1A5FA8")}
          {line("35%", dark)}
          {line("65%", "#1A5FA8")}
        </div>
      );
    case "insurance":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2 items-center">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                background:
                  "conic-gradient(#13294B 0 200deg, #1A5FA8 200deg 290deg, #1D9E75 290deg 350deg, #7FD0B5 350deg 360deg)",
              }}
            >
              <div
                className="bg-white rounded-full"
                style={{ width: 32, height: 32, margin: 12 }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              {line("85%")}
              {line("65%")}
              {line("75%")}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {line("55%", dark)}
            {line("45%")}
          </div>
        </div>
      );
  }
}

// Re-export ChevronLeft so the panel's open trigger arrow uses a consistent icon.
export { ChevronLeft };
