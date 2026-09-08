import Link from "next/link";
import { LayoutGrid, ListChecks, Users, Settings, ChevronsUpDown } from "lucide-react";

const NAV_ITEMS = [
  { label: "Issues", href: "/issues", icon: ListChecks },
  { label: "Projects", href: "/projects", icon: LayoutGrid },
  { label: "Members", href: "/members", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <button className="flex items-center justify-between gap-2 border-b border-border px-4 py-4 text-left text-sm font-medium text-foreground hover:bg-surface-hover">
        <span>Acme Workspace</span>
        <ChevronsUpDown className="h-4 w-4 text-muted" />
      </button>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className="sidebar-link">
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-border px-4 py-4">
        <div className="h-8 w-8 rounded-full bg-accent" />
        <div className="flex flex-col">
          <span className="text-sm text-foreground">Jane Doe</span>
          <span className="text-xs text-muted">jane@devflow.dev</span>
        </div>
      </div>
    </aside>
  );
}