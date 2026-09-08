import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectRow } from "@/components/features/project-row";

const PROJECTS = [
  { slug: "api", name: "API", description: "Core backend services", openIssues: 12, updatedAt: "2 days ago" },
  { slug: "web", name: "Web", description: "Marketing site and dashboard", openIssues: 5, updatedAt: "5 hours ago" },
  { slug: "mobile", name: "Mobile", description: "iOS and Android clients", openIssues: 0, updatedAt: "3 weeks ago" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Projects</h1>
        <Button className="w-auto gap-2 px-4">
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        {PROJECTS.map((project, i) => (
          <ProjectRow key={project.slug} project={project} isLast={i === PROJECTS.length - 1} />
        ))}
      </div>
    </div>
  );
}