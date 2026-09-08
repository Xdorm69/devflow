const PREVIEW_ISSUES = [
  { key: "API-142", title: "Rate limit responses missing Retry-After header", status: "bg-muted", priority: "High", priorityClass: "bg-accent/15 text-accent" },
  { key: "API-139", title: "Webhook retries not respecting backoff", status: "bg-critical", priority: "Critical", priorityClass: "bg-critical/15 text-critical" },
  { key: "WEB-88", title: "Dark mode toggle flickers on load", status: "bg-accent", priority: "Medium", priorityClass: "bg-surface-hover text-foreground" },
];

export function LandingIssuePreview() {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm text-foreground">API</span>
        <span className="issue-key">3 open</span>
      </div>
      {PREVIEW_ISSUES.map((issue, i) => (
        <div
          key={issue.key}
          className={`flex items-center gap-3 px-4 py-3 ${
            i === PREVIEW_ISSUES.length - 1 ? "" : "border-b border-border"
          }`}
        >
          <span className={`status-dot ${issue.status}`} />
          <span className="issue-key w-16 shrink-0">{issue.key}</span>
          <span className="flex-1 truncate text-sm text-foreground">{issue.title}</span>
          <span className={`priority-badge ${issue.priorityClass}`}>{issue.priority}</span>
        </div>
      ))}
    </div>
  );
}