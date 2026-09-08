import Link from "next/link";
import { LandingIssuePreview } from "@/components/features/landing-issue-preview";

const FEATURES = [
  {
    title: "One view for every workspace",
    description:
      "Switch between projects without losing your place. Every issue, comment, and label lives in a single fast interface.",
  },
  {
    title: "Built for keyboard, not clicks",
    description:
      "Jump to any issue, change status, or assign a teammate without reaching for the mouse.",
  },
  {
    title: "Activity you can actually read",
    description:
      "Every status change, comment, and reassignment is logged in plain language, not a wall of JSON.",
  },
];

export default function Home() {
  return (
    <div>
      <header className="page-container flex h-16 items-center justify-between">
        <span className="font-mono text-sm text-foreground">devflow</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-muted hover:text-foreground">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary w-auto px-4">
            Start for free
          </Link>
        </nav>
      </header>

      <section className="page-container grid grid-cols-1 gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-32">
        <div>
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Triage issues before they triage your sprint.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Devflow keeps every workspace, project, and issue in one fast, keyboard-driven view —
            so your team spends less time in status meetings and more time shipping.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/signup" className="btn-primary w-auto px-6">
              Start for free
            </Link>
            <Link href="/login" className="text-sm text-muted hover:text-foreground">
              Sign in instead
            </Link>
          </div>
        </div>
        <LandingIssuePreview />
      </section>

      <section className="page-container border-t border-border py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="text-base font-medium text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="page-container border-t border-border py-8">
        <p className="text-sm text-muted">Devflow — built for teams who&apos;d rather be shipping.</p>
      </footer>
    </div>
  );
}