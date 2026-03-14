export default function SubmissionResult({ result }) {
  if (!result) return null;

  const { aiScore, aiVerdict, milestoneStatus, payout } = result;

  const verdictConfig = {
    approved: { color: "text-success", bg: "bg-success-subtle", icon: "✓" },
    rejected: { color: "text-danger", bg: "bg-danger-subtle", icon: "✗" },
    pending: { color: "text-warning", bg: "bg-warning-subtle", icon: "⏳" },
  };

  const vConfig = verdictConfig[aiVerdict] || verdictConfig.pending;

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <h3 className="mb-6 text-xl font-semibold text-foreground">AI Review Result</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* AI Score */}
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">AI Score</div>
          <div className={`mt-2 text-4xl font-black ${
            aiScore >= 70 ? "text-success" : aiScore >= 40 ? "text-warning" : "text-danger"
          }`}>
            {aiScore ?? "—"}
          </div>
          <div className="mx-auto mt-3 h-2 w-full rounded-full bg-background">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                aiScore >= 70 ? "bg-success" : aiScore >= 40 ? "bg-warning" : "bg-danger"
              }`}
              style={{ width: `${Math.min(aiScore || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* AI Verdict */}
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Verdict</div>
          <div className={`mt-2 inline-flex h-14 w-14 items-center justify-center rounded-full text-2xl ${vConfig.bg}`}>
            {vConfig.icon}
          </div>
          <div className={`mt-2 text-sm font-bold capitalize ${vConfig.color}`}>
            {aiVerdict || "Pending"}
          </div>
        </div>

        {/* Milestone Status */}
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Milestone</div>
          <div className="mt-2 text-lg font-bold capitalize text-foreground">
            {milestoneStatus || "—"}
          </div>
          {payout && (
            <div className={`mt-2 text-sm font-semibold ${
              payout === "100%" ? "text-success" : payout === "70%" ? "text-warning" : "text-danger"
            }`}>
              Payout: {payout}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
