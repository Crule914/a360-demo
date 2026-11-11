import { Link } from "@tanstack/react-router";

export const ADMIN_TABS = [
  { label: "Navigation", to: "/admin/navigation" as const },
  { label: "Data", to: "/admin/data" as const },
];

export function adminTabs(active: "Navigation" | "Data") {
  return ADMIN_TABS.map((t) => ({
    label: t.label,
    to: t.to,
    active: t.label === active,
    caret: false,
  }));
}

export function AdminBackLink() {
  return (
    <div className="mt-6 text-[13px]">
      <Link to="/" className="text-[#1A5FA8] hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  );
}
