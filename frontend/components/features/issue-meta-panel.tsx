import { STATUS_META, PRIORITY_META, IssueStatus, IssuePriority } from "@/lib/issue-meta";
import { LabelBadge } from "./label-badge";

interface Props {
  status: IssueStatus;
  priority: IssuePriority;
  assignees: string[];
  labels: { name: string; color: string }[];
  createdAt: string;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

export function IssueMetaPanel({ status, priority, assignees, labels, createdAt }: Props) {
  return (
    <div className="rounded-lg border border-border p-4">
      <MetaRow label="Status">
        <span className="flex items-center gap-2">
          <span className={`status-dot ${STATUS_META[status].color}`} />
          {STATUS_META[status].label}
        </span>
      </MetaRow>
      <MetaRow label="Priority">
        <span className={`priority-badge ${PRIORITY_META[priority].className}`}>
          {PRIORITY_META[priority].label}
        </span>
      </MetaRow>
      <MetaRow label="Assignees">
        {assignees.length ? assignees.join(", ") : <span className="text-muted">Unassigned</span>}
      </MetaRow>
      <MetaRow label="Labels">
        <div className="flex flex-wrap justify-end gap-1">
          {labels.length ? (
            labels.map((l) => <LabelBadge key={l.name} label={l} />)
          ) : (
            <span className="text-muted">None</span>
          )}
        </div>
      </MetaRow>
      <MetaRow label="Created">{createdAt}</MetaRow>
    </div>
  );
}