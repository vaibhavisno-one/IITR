import Link from "next/link";

const statusStyles = {
  active: "bg-success-subtle text-success",
  completed: "bg-primary-subtle text-primary-hover",
  pending: "bg-warning-subtle text-warning",
};

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project._id || project.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-accent hover:bg-card-hover hover:shadow-xl hover:shadow-primary/5">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary-hover">
              {project.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusStyles[project.status] || "bg-surface text-muted"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Employer */}
          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {project.employer?.fullName || project.employer?.username || project.employer?.name || (typeof project.employer === "string" ? project.employer : "—")}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="text-sm text-muted">
              <span className="text-foreground font-semibold">${(project.budget || 0).toLocaleString()}</span> budget
            </div>
            <div className="flex items-center gap-1 text-sm text-muted">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {(project.milestones || []).length} milestones
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
