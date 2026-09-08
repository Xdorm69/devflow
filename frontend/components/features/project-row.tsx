import Link from "next/link";

interface Project {
  slug: string;
  name: string;
  description: string;
  openIssues: number;
  updatedAt: string;
}

export function ProjectRow({ project, isLast }: { project: Project; isLast?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`flex items-center justify-between px-4 py-3 hover:bg-surface-hover ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{project.name}</p>
        <p className="text-sm text-muted">{project.description}</p>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted">
        <span className="issue-key">{project.openIssues} open</span>
        <span>{project.updatedAt}</span>
      </div>
    </Link>
  );
}