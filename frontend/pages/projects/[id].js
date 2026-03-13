import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { projects } from "@/data/mockData";
import MilestoneCard from "@/components/MilestoneCard";

const statusStyles = {
  active: "bg-success-subtle text-success",
  completed: "bg-primary-subtle text-primary-hover",
  pending: "bg-warning-subtle text-warning",
};

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="mt-2 text-muted">The project you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/projects" className="mt-6 inline-block text-primary hover:text-primary-hover">
          ← Back to projects
        </Link>
      </main>
    );
  }

  const completedCount = project.milestones.filter((m) => m.status === "completed").length;
  const progress = Math.round((completedCount / project.milestones.length) * 100);

  return (
    <>
      <Head>
        <title>{`${project.title} — GigChain`}</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground">{project.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                <span
                  className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusStyles[project.status] || "bg-surface text-muted"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-muted">{project.description}</p>
            </div>

            {/* Milestones */}
            <div>
              <h2 className="mb-6 text-xl font-semibold">
                Milestones{" "}
                <span className="text-sm font-normal text-muted">
                  ({completedCount}/{project.milestones.length} completed)
                </span>
              </h2>
              <div>
                {project.milestones.map((milestone, index) => (
                  <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28 space-y-6">
              {/* Info card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Project Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">Employer</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{project.employer}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">Budget</dt>
                    <dd className="mt-1 text-sm font-bold text-foreground">${project.budget.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">Progress</dt>
                    <dd className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">{progress}% complete</span>
                        <span className="text-xs text-muted">
                          {completedCount}/{project.milestones.length}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-surface">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">Milestones</dt>
                    <dd className="mt-2 flex gap-2">
                      <span className="rounded-md bg-success-subtle px-2 py-1 text-xs font-medium text-success">
                        {project.milestones.filter((m) => m.status === "completed").length} done
                      </span>
                      <span className="rounded-md bg-primary-subtle px-2 py-1 text-xs font-medium text-primary-hover">
                        {project.milestones.filter((m) => m.status === "submitted").length} submitted
                      </span>
                      <span className="rounded-md bg-warning-subtle px-2 py-1 text-xs font-medium text-warning">
                        {project.milestones.filter((m) => m.status === "pending").length} pending
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Action */}
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface w-full py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                ← Back to projects
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
