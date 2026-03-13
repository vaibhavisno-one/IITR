const statusStyles = {
  approved: { bg: "bg-success-subtle", text: "text-success", dot: "bg-success" },
  "under review": { bg: "bg-warning-subtle", text: "text-warning", dot: "bg-warning" },
  rejected: { bg: "bg-danger-subtle", text: "text-danger", dot: "bg-danger" },
};

export default function SubmissionCard({ submission }) {
  const config = statusStyles[submission.status] || statusStyles["under review"];

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border-accent hover:bg-card-hover">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-foreground">{submission.title}</h4>
          <p className="mt-1 text-sm text-muted">{submission.description}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${config.bg} ${config.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {submission.status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {submission.date
            ? submission.date
            : submission.createdAt
            ? new Date(submission.createdAt).toLocaleDateString()
            : "—"}
        </div>
      </div>
    </div>
  );
}
