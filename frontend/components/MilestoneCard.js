import Link from "next/link";

const statusConfig = {
  pending: { bg: "bg-warning-subtle", text: "text-warning", dot: "bg-warning" },
  submitted: { bg: "bg-primary-subtle", text: "text-primary-hover", dot: "bg-primary" },
  completed: { bg: "bg-success-subtle", text: "text-success", dot: "bg-success" },
};

export default function MilestoneCard({ milestone, index }) {
  const config = statusConfig[milestone.status] || statusConfig.pending;

  return (
    <div className="group relative flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border text-xs font-bold ${
            milestone.status === "completed"
              ? "border-success bg-success-subtle text-success"
              : milestone.status === "submitted"
              ? "border-primary bg-primary-subtle text-primary-hover"
              : "bg-surface text-muted"
          }`}
        >
          {milestone.status === "completed" ? "✓" : index + 1}
        </div>
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* Card */}
      <div className="mb-6 flex-1 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border-accent hover:bg-card-hover">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-foreground">{milestone.title}</h4>
            <p className="mt-1 text-sm text-muted">Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "TBD"}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${config.bg} ${config.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {milestone.status}
          </span>
        </div>

        {milestone.status === "pending" && (
          <div className="mt-4">
            <Link
              href={`/submit/${milestone._id || milestone.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
