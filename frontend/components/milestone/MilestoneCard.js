import Link from "next/link";

const statusConfig = {
  pending: { bg: "bg-warning-subtle", text: "text-warning", dot: "bg-warning", label: "Pending" },
  submitted: { bg: "bg-primary-subtle", text: "text-primary-hover", dot: "bg-primary", label: "Submitted" },
  completed: { bg: "bg-success-subtle", text: "text-success", dot: "bg-success", label: "Completed" },
  failed: { bg: "bg-danger-subtle", text: "text-danger", dot: "bg-danger", label: "Failed" },
};

function getPayoutInfo(milestone) {
  if (milestone.status === "failed") return { pct: "0%", label: "No payout", color: "text-danger" };
  if (milestone.status !== "completed") return null;

  const deadline = milestone.dueDate ? new Date(milestone.dueDate) : null;
  const completedAt = milestone.completedAt ? new Date(milestone.completedAt) : null;

  if (!deadline || !completedAt) return { pct: "100%", label: "Full payout", color: "text-success" };

  if (completedAt <= deadline) return { pct: "100%", label: "On-time payout", color: "text-success" };
  return { pct: "70%", label: "Late payout", color: "text-warning" };
}

export default function MilestoneCard({ milestone, index, showSubmitButton = true }) {
  const config = statusConfig[milestone.status] || statusConfig.pending;
  const payout = getPayoutInfo(milestone);

  return (
    <div className="group relative flex gap-5">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border text-[13px] font-bold shadow-sm ${
            milestone.status === "completed"
              ? "border-success bg-success-subtle text-success"
              : milestone.status === "submitted"
              ? "border-primary bg-primary-subtle text-primary-hover"
              : milestone.status === "failed"
              ? "border-danger bg-danger-subtle text-danger"
              : "bg-surface text-muted"
          }`}
        >
          {milestone.status === "completed" ? "✓" : milestone.status === "failed" ? "✗" : index + 1}
        </div>
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* Card */}
      <div className="mb-8 flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-border-accent hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h4 className="text-[17px] font-semibold text-foreground">{milestone.title}</h4>
            <p className="mt-1.5 text-[15px] font-medium text-muted">
              Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "TBD"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {milestone.amount != null && (
              <span className="rounded-[10px] bg-surface px-4 py-2 border border-border text-[15px] font-bold text-foreground">
                ${Number(milestone.amount).toLocaleString()}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
        </div>

        {/* Payout info */}
        {payout && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${payout.color}`}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {payout.pct} — {payout.label}
          </div>
        )}

        {/* Submit button (freelancer only) */}
        {showSubmitButton && milestone.status === "pending" && (
          <div className="mt-6">
            <Link
              href={`/submit/${milestone._id || milestone.id}`}
              className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-[18px] py-[10px] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)]"
            >
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Submit Work
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
