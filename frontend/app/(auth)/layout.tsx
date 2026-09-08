export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-sm text-muted">devflow</span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">{children}</div>
      </div>
    </div>
  );
}