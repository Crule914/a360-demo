import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Flag, MoreVertical, MessageSquare, FileText } from "lucide-react";
import { useVisibleNotifications } from "@/lib/notificationsVisibility";

export function NotificationsPanel() {
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [grouped, setGrouped] = useState(true);

  const list = useVisibleNotifications();
  const rows = unreadOnly ? list.filter((n) => n.unread) : list;
  const unreadTotal = list.filter((n) => n.unread).length;

  return (
    <div className="px-3 pb-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-1 pb-3">
        <select
          value={unreadOnly ? "unread" : "all"}
          onChange={(e) => setUnreadOnly(e.target.value === "unread")}
          className="bg-transparent border border-[#7FB3E8] text-[#7FB3E8] text-[12px] rounded-sm px-2 py-1 cursor-pointer focus:outline-none"
        >
          <option value="unread" className="text-[#13294B]">
            Unread Only
          </option>
          <option value="all" className="text-[#13294B]">
            All
          </option>
        </select>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-white/90">Grouped</span>
          <button
            role="switch"
            aria-checked={grouped}
            aria-label="Grouped"
            onClick={() => setGrouped((g) => !g)}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              grouped ? "bg-[#1A73E8]" : "bg-white/25"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                grouped ? "left-[18px]" : "left-0.5"
              }`}
            />
          </button>
          <MoreVertical className="w-4 h-4 text-white/70" strokeWidth={1.5} />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-sm text-[#13294B] max-h-[calc(100vh-190px)] overflow-y-auto">
        {rows.map((n, i) => (
          <Link
            key={n.id}
            to="/notifications"
            search={{ id: n.id, filter: undefined }}
            className={`block px-3 py-3 hover:bg-[#F5F8FC] ${
              i > 0 ? "border-t border-[#E3E6EA]" : ""
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  n.unread ? "bg-[#1A73E8]" : "bg-transparent"
                }`}
              />
              <span className="mt-0.5 shrink-0 text-[#1A5FA8]">
                {n.kind !== "investor360" ? (
                  <FileText className="w-4 h-4" strokeWidth={1.6} />
                ) : (
                  <MessageSquare className="w-4 h-4" strokeWidth={1.6} />
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1">
                  <div className="flex-1 min-w-0 flex items-center gap-1">
                    {n.kind === "docs" && (
                      <AlertTriangle
                        className="w-3.5 h-3.5 text-[#E8A317] shrink-0"
                        strokeWidth={2}
                      />
                    )}
                    <h3 className="text-[13px] font-semibold truncate">{n.title}</h3>
                  </div>
                  <Flag className="w-3.5 h-3.5 text-[#9AA3AF] shrink-0" strokeWidth={1.5} />
                  <MoreVertical
                    className="w-3.5 h-3.5 text-[#9AA3AF] shrink-0"
                    strokeWidth={1.5}
                  />
                </div>

                <span className="block text-[12px] text-[#1A5FA8] font-medium mt-1">
                  {n.account}
                </span>

                <p className="text-[12px] leading-[1.45] text-[#374151] mt-1">
                  {n.body}{" "}
                  {n.showMore && <span className="text-[#1A5FA8]">Show More</span>}
                </p>

                <div className="flex items-end justify-between mt-2 gap-2">
                  <span className="text-[12px] text-[#1A5FA8]">{n.action}</span>
                  <span className="text-[11px] text-[#6b7280] whitespace-nowrap">
                    {n.time}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="border-t border-[#E3E6EA] py-3 text-center">
          <Link
            to="/notifications"
            search={{ id: undefined, filter: "all" }}
            className="text-[12px] font-semibold text-[#1A5FA8] hover:underline"
          >
            Go to the Notification Center ({unreadTotal} Unread)
          </Link>
        </div>
      </div>
    </div>
  );
}
