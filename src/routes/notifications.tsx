import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Flag,
  MoreVertical,
  Users,
  UserSquare,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import {
  categoryOf,
  subCategoryOf,
  type Notification,
} from "@/data/notifications";
import { useVisibleNotifications } from "@/lib/notificationsVisibility";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notification Center | Advisor360°" },
      {
        name: "description",
        content:
          "Review Investor360° client messages and account document alerts across your book of business.",
      },
      { property: "og:title", content: "Notification Center | Advisor360°" },
      {
        property: "og:description",
        content:
          "Review Investor360° client messages and account document alerts across your book of business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
    filter: typeof search.filter === "string" ? search.filter : undefined,
  }),
  component: NotificationCenterPage,
});

type FilterKey = "all" | "unread" | "flagged" | "important" | string;

function NotificationCenterPage() {
  const { id, filter: initialFilter } = Route.useSearch();
  const [filter, setFilter] = useState<FilterKey>(initialFilter ?? "all");
  const [selected, setSelected] = useState<string[]>(id ? [id] : []);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Client Management": true,
    "Account Management": false,
  });

  const list = useVisibleNotifications();

  const rows = useMemo(() => {
    switch (filter) {
      case "unread":
        return list.filter((n) => n.unread);
      case "flagged":
        return list.filter((n) => n.flagged);
      case "important":
        return list.filter((n) => n.important);
      case "all":
        return list;
      default:
        return list.filter(
          (n) => categoryOf(n) === filter || subCategoryOf(n) === filter,
        );
    }
  }, [filter, list]);

  const unreadCount = rows.filter((n) => n.unread).length;
  const groups = ["Client Management", "Account Management"] as const;

  const heading =
    filter === "unread"
      ? "Unread"
      : filter === "flagged"
        ? "Flagged"
        : filter === "important"
          ? "Important"
          : filter === "all"
            ? "All Notifications"
            : filter;

  const toggle = (nid: string) =>
    setSelected((s) => (s.includes(nid) ? s.filter((x) => x !== nid) : [...s, nid]));

  return (
    <AppShell
      topBar={<PageHeader eyebrow="list" title="Notifications Center" />}
    >
      <div className="px-5 py-4">
        <div className="text-[13px] text-[#374151] mb-3">Notification Center</div>

        <div className="bg-white border border-[#E3E6EA] rounded-[2px] flex min-h-[720px]">
          {/* Sidebar */}
          <aside className="w-[300px] shrink-0 border-r border-[#E3E6EA] p-4">
            <ul className="space-y-2 mb-4">
              <SideLink
                active={filter === "unread"}
                onClick={() => setFilter("unread")}
                icon={<span className="h-2 w-2 rounded-full bg-[#1A73E8]" />}
                label="Unread"
              />
              <SideLink
                active={filter === "flagged"}
                onClick={() => setFilter("flagged")}
                icon={<Flag className="w-3.5 h-3.5 text-[#D0342C]" fill="#D0342C" />}
                label="Flagged"
              />
              <SideLink
                active={filter === "important"}
                onClick={() => setFilter("important")}
                icon={<AlertTriangle className="w-4 h-4 text-[#E8A317]" />}
                label="Important"
              />
            </ul>

            <button
              onClick={() => setFilter("all")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-[14px] ${
                filter === "all" ? "bg-[#2C5FB3] text-white" : "text-[#1A5FA8] hover:bg-[#F0F4FA]"
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span className="flex-1 text-left font-medium">All Notifications</span>
              <span>{list.length}</span>
            </button>

            <ul className="mt-2">
              {groups.map((g) => {
                const items = list.filter((n) => categoryOf(n) === g);
                const subs = Array.from(new Set(items.map(subCategoryOf)));
                const open = openGroups[g];
                return (
                  <li key={g}>
                    <div className="flex items-center gap-1.5 pl-3 pr-1 py-1.5">
                      <button
                        onClick={() => setOpenGroups((o) => ({ ...o, [g]: !o[g] }))}
                        aria-label={open ? "Collapse" : "Expand"}
                        className="text-[#6b7280]"
                      >
                        {open ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="grid place-items-center h-[18px] w-[18px] bg-[#1A5FA8] text-white rounded-[2px]">
                        {g === "Client Management" ? (
                          <Users className="w-3 h-3" />
                        ) : (
                          <UserSquare className="w-3 h-3" />
                        )}
                      </span>
                      <button
                        onClick={() => setFilter(g)}
                        className={`flex-1 text-left text-[14px] ${
                          filter === g ? "font-semibold text-[#13294B]" : "text-[#1A5FA8]"
                        } hover:underline`}
                      >
                        {g}
                      </button>
                      <span className="text-[13px] text-[#6b7280]">{items.length}</span>
                    </div>
                    {open &&
                      subs.map((s) => (
                        <div key={s} className="flex items-center pl-[52px] pr-1 py-1">
                          <button
                            onClick={() => setFilter(s)}
                            className={`flex-1 text-left text-[13px] ${
                              filter === s ? "font-semibold text-[#13294B]" : "text-[#374151]"
                            } hover:underline`}
                          >
                            {s}
                          </button>
                          <span className="text-[13px] text-[#6b7280]">
                            {items.filter((n) => subCategoryOf(n) === s).length}
                          </span>
                        </div>
                      ))}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* List */}
          <section className="flex-1 min-w-0 p-5">
            <h2 className="text-[16px] text-[#13294B] mb-3">
              {heading} ({unreadCount} Unread <span className="text-[#C7CBD1]">|</span>{" "}
              {rows.length} Total)
            </h2>

            <div className="flex items-center gap-3 border-b border-[#E3E6EA] pb-2">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={selected.length === rows.length && rows.length > 0}
                onChange={(e) => setSelected(e.target.checked ? rows.map((n) => n.id) : [])}
                className="h-4 w-4 accent-[#1A73E8]"
              />
              <span className="text-[12px] tracking-wide text-[#6b7280]">SELECT ALL</span>
            </div>

            <ul>
              {rows.map((n) => (
                <Row
                  key={n.id}
                  n={n}
                  checked={selected.includes(n.id)}
                  onToggle={() => toggle(n.id)}
                />
              ))}
              {rows.length === 0 && (
                <li className="py-8 text-center text-[13px] text-[#6b7280]">
                  No notifications in this view.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function SideLink({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center gap-2.5 pl-3 text-[15px] text-[#1A5FA8] hover:underline"
      >
        <span className="w-4 grid place-items-center">{icon}</span>
        <span className={active ? "font-semibold" : ""}>{label}</span>
      </button>
    </li>
  );
}

function Row({
  n,
  checked,
  onToggle,
}: {
  n: Notification;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-start gap-3 py-3 border-b border-[#E3E6EA]">
      <input
        type="checkbox"
        aria-label={`Select ${n.title}`}
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-4 w-4 accent-[#1A73E8]"
      />
      <span
        className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${
          n.unread ? "bg-[#1A73E8]" : "bg-transparent"
        }`}
      />
      <span className="mt-0.5 grid place-items-center h-[20px] w-[20px] shrink-0 bg-[#1A5FA8] text-white rounded-[2px]">
        {n.kind === "investor360" ? (
          <Users className="w-3.5 h-3.5" />
        ) : (
          <UserSquare className="w-3.5 h-3.5" />
        )}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-1.5">
            {n.important && (
              <AlertTriangle className="w-4 h-4 text-[#E8A317] shrink-0" strokeWidth={2} />
            )}
            <h3
              className={`text-[14px] text-[#13294B] truncate ${
                n.unread ? "font-semibold" : ""
              }`}
            >
              {n.title}
            </h3>
          </div>
          <Flag
            className={`w-4 h-4 shrink-0 ${n.flagged ? "text-[#D0342C]" : "text-[#9AA3AF]"}`}
            fill={n.flagged ? "#D0342C" : "none"}
            strokeWidth={1.5}
          />
          <MoreVertical className="w-4 h-4 text-[#9AA3AF] shrink-0" strokeWidth={1.5} />
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="block text-[13px] text-[#1A5FA8] font-semibold hover:underline mt-1"
        >
          {n.account}
        </a>

        <p className="text-[13px] leading-[1.5] text-[#374151] mt-1">{n.body}</p>

        <div className="flex items-end justify-between gap-3 mt-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[13px] text-[#1A5FA8] hover:underline"
          >
            {n.action}
          </a>
          <span className="text-[12px] text-[#6b7280] whitespace-nowrap">{n.time}</span>
        </div>
      </div>
    </li>
  );
}
