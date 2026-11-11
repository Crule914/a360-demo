import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PageHeaderTabMenuItem {
  label: string;
  to?: string;
  /** External / new-tab destination. Rendered as an anchor with target="_blank". */
  href?: string;
  onSelect?: () => void;
}

export interface PageHeaderTab {
  label: string;
  /** If provided, renders a Link and active state is derived from the current pathname. */
  to?: string;
  /** Render a downward caret next to the label. */
  caret?: boolean;
  /** For non-link tabs, explicitly mark the tab as active. */
  active?: boolean;
  /** If provided, the tab opens a dropdown menu with these items. */
  menuItems?: PageHeaderTabMenuItem[];
}

export interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  /** Extra elements rendered beside the title (e.g. icons, avatars). */
  titleExtra?: ReactNode;
  tabs?: PageHeaderTab[];
  /** Elements rendered at the far right of the header. */
  rightActions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  titleExtra,
  tabs = [],
  rightActions,
}: PageHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="bg-header text-white">
      <div className="flex items-stretch px-5">
        <div className="shrink-0 flex flex-col justify-center pr-4 py-2">
          <div className="text-[11px] text-[#7FB3E8] uppercase">{eyebrow}</div>
          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="text-[18px] font-medium leading-tight">{title}</h1>
            {titleExtra}
          </div>
        </div>

        {tabs.length > 0 && (
          <nav className="flex-1 flex items-end gap-1 overflow-hidden">
            {tabs.map((t) => {
              // When a page declares its own active tab, trust it — otherwise a
              // parent path like /household/sweets would also match sub-pages.
              const hasExplicitActive = tabs.some((x) => x.active === true);
              const active = hasExplicitActive
                ? t.active === true
                : t.to
                  ? pathname === t.to || pathname.startsWith(`${t.to}/`)
                  : (t.active ?? false);


              const className = `relative px-3 lg:px-4 py-2.5 text-[14px] flex items-center gap-1 whitespace-nowrap ${
                active ? "text-white" : "text-white/85 hover:text-white"
              }`;

              const content = (
                <>
                  {t.label}
                  {t.caret && (
                    <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
                  )}
                  {active && (
                    <span className="absolute left-2 right-2 bottom-0 h-[3px] bg-[#7FB3E8] rounded-t-sm" />
                  )}
                </>
              );

              if (t.menuItems && t.menuItems.length > 0) {
                return (
                  <DropdownMenu key={t.label}>
                    <DropdownMenuTrigger asChild={!!t.to} className={t.to ? undefined : className}>
                      {t.to ? (
                        <Link to={t.to} className={className}>
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="min-w-[200px] rounded-none border border-[#d4dae3] bg-white p-0 shadow-md"
                    >
                      {t.menuItems.map((mi) => {
                        const itemClass =
                          "px-4 py-2 text-[14px] text-[#1f6fb8] hover:bg-[#f1f5fb] focus:bg-[#f1f5fb] focus:text-[#1f6fb8] rounded-none cursor-pointer";
                        if (mi.href) {
                          return (
                            <DropdownMenuItem key={mi.label} asChild className={itemClass}>
                              <a href={mi.href} target="_blank" rel="noopener noreferrer">
                                {mi.label}
                              </a>
                            </DropdownMenuItem>
                          );
                        }
                        if (mi.to) {
                          return (
                            <DropdownMenuItem key={mi.label} asChild className={itemClass}>
                              <Link to={mi.to}>{mi.label}</Link>
                            </DropdownMenuItem>
                          );
                        }
                        return (
                          <DropdownMenuItem
                            key={mi.label}
                            className={itemClass}
                            onSelect={mi.onSelect}
                          >
                            {mi.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return t.to ? (
                <Link key={t.label} to={t.to} className={className}>
                  {content}
                </Link>
              ) : (
                <button key={t.label} className={className}>
                  {content}
                </button>
              );
            })}
          </nav>
        )}

        {rightActions && (
          <div className="flex items-start gap-3 px-2 pt-4 text-white/90">
            {rightActions}
          </div>
        )}
      </div>
    </div>
  );
}
