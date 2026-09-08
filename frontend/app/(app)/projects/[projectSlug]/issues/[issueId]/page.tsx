import { Comment } from "@/components/features/comment";
import { IssueMetaPanel } from "@/components/features/issue-meta-panel";

const ISSUE = {
  key: "API-142",
  title: "Rate limit responses missing Retry-After header",
  description:
    "When a client hits the rate limit, the 429 response doesn't include a Retry-After header, so clients can't back off correctly. We should add it based on the current window's reset time.",
  status: "OPEN",
  priority: "HIGH",
  assignees: ["Jane Doe"],
  labels: [
    { name: "bug", color: "#e8590c" },
    { name: "api", color: "#4d7cfe" },
  ],
  createdAt: "Sep 2, 2026",
} as const;

const COMMENTS = [
  { author: "Sam Lee", content: "Can confirm this on staging too.", createdAt: "1 day ago" },
  { author: "Jane Doe", content: "Picking this up today.", createdAt: "3 hours ago" },
];

export default function IssueDetailPage({
  params,
}: {
  params: { projectSlug: string; issueId: string };
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        <p className="issue-key mb-1">{ISSUE.key}</p>
        <h1 className="mb-4 text-xl font-semibold text-foreground">{ISSUE.title}</h1>
        <p className="text-sm leading-relaxed text-muted">{ISSUE.description}</p>

        <div className="mt-8">
          <h2 className="mb-2 text-sm font-medium text-foreground">Comments</h2>
          <div className="rounded-lg border border-border px-4">
            {COMMENTS.map((c, i) => (
              <Comment key={i} {...c} />
            ))}
          </div>
          <textarea className="form-input mt-4 min-h-24 resize-none" placeholder="Leave a comment..." />
        </div>
      </div>

      <IssueMetaPanel
        status={ISSUE.status}
        priority={ISSUE.priority}
        assignees={[...ISSUE.assignees]}
        labels={[...ISSUE.labels]}
        createdAt={ISSUE.createdAt}
      />
    </div>
  );
}