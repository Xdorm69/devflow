import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IssueRow } from "@/components/features/issue-row";

const ISSUES = [
  { id: "1", key: "API-142", title: "Rate limit responses missing Retry-After header", status: "OPEN", priority: "HIGH", assignee: "Jane Doe" },
  { id: "2", key: "API-141", title: "Add pagination to /issues endpoint", status: "IN_PROGRESS", priority: "MEDIUM", assignee: "Sam Lee" },
  { id: "3", key: "API-139", title: "Webhook retries not respecting backoff", status: "OPEN", priority: "CRITICAL" },
  { id: "4", key: "API-137", title: "Deprecate legacy /v1/auth routes", status: "RESOLVED", priority: "LOW", assignee: "Jane Doe" },
] as const;

export default function ProjectPage({ params }: { params: { projectSlug: string } }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{params.projectSlug}</p>
          <h1 className="text-lg font-semibold text-foreground">Issues</h1>
        </div>
        <Button className="w-auto gap-2 px-4">
          <Plus className="h-4 w-4" />
          New issue
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        {ISSUES.map((issue, i) => (
          <IssueRow key={issue.id} issue={issue} isLast={i === ISSUES.length - 1} />
        ))}
      </div>
    </div>
  );
}