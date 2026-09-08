export const STATUS_META = {
  OPEN: { label: "Open", color: "bg-muted" },
  IN_PROGRESS: { label: "In Progress", color: "bg-accent" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500" },
  CLOSED: { label: "Closed", color: "bg-muted/50" },
} as const;

export const PRIORITY_META = {
  LOW: { label: "Low", className: "bg-surface-hover text-muted" },
  MEDIUM: { label: "Medium", className: "bg-surface-hover text-foreground" },
  HIGH: { label: "High", className: "bg-accent/15 text-accent" },
  CRITICAL: { label: "Critical", className: "bg-critical/15 text-critical" },
} as const;

export type IssueStatus = keyof typeof STATUS_META;
export type IssuePriority = keyof typeof PRIORITY_META;