export default function ApprovalsPage() {
  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-[var(--surface)]">
        <h1 className="font-medium">Approvals</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Human-in-the-loop queue for RTS, airworthiness and safety-critical agent outputs.
        </p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card p-8 text-center text-sm text-[var(--muted)]">
          No pending approvals. When agents produce airworthiness-relevant recommendations they
          appear here for certifying staff sign-off.
        </div>
      </div>
    </>
  );
}
