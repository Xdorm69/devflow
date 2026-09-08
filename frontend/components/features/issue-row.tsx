import Link from "next/link";
import { STATUS_META, PRIORITY_META, IssueStatus, IssuePriority } from "@/lib/issue-meta";

interface Issue {
  id: string;
  key: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string;
}

export function IssueRow({ issue, isLast }: { issue: Issue; isLast?: boolean }) {
  const status = STATUS_META[issue.status];
  const priority = PRIORITY_META[issue.priority];

  return (
    <Link
      href={`/projects/api/issues/${issue.id}`}
      className={`flex items-center gap-4 px-4 py-3 hover:bg-surface-hover ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <span className={`status-dot ${status.color}`} title={status.label} />
      <span className="issue-key w-16 shrink-0">{issue.key}</span>
      <span className="flex-1 truncate text-sm text-foreground">{issue.title}</span>
      <span className={`priority-badge ${priority.className}`}>{priority.label}</span>
      <span className="w-24 shrink-0 truncate text-right text-sm text-muted">
        {issue.assignee ?? "Unassigned"}
      </span>
    </Link>
  );
}