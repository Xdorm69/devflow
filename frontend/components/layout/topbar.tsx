export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-foreground">Acme Workspace</span>
        <span className="text-muted">/</span>
        <span className="text-muted">Devflow</span>
      </div>
      <button className="icon-btn">
        <span className="issue-key">⌘K</span>
      </button>
    </header>
  );
}