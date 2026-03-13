import Head from "next/head";
import Link from "next/link";
import { projects, recentActivity, submissions } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";
import SubmissionCard from "@/components/SubmissionCard";

const activeProjects = projects.filter((p) => p.status === "active");
const pendingMilestones = projects
  .flatMap((p) => p.milestones.map((m) => ({ ...m, projectTitle: p.title, projectId: p.id })))
  .filter((m) => m.status === "pending");

const quickStats = [
  {
    label: "Active Projects",
    value: activeProjects.length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "text-primary",
    bg: "bg-primary-subtle",
  },
  {
    label: "Pending Milestones",
    value: pendingMilestones.length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-warning",
    bg: "bg-warning-subtle",
  },
  {
    label: "Submissions",
    value: submissions.length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    color: "text-accent",
    bg: "bg-accent-subtle",
  },
  {
    label: "Completed",
    value: projects.filter((p) => p.status === "completed").length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-success",
    bg: "bg-success-subtle",
  },
];

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard — GigChain</title>
        <meta name="description" content="Manage your active projects, milestones, and submissions on GigChain." />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted">Welcome back! Here's an overview of your activity.</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${s.bg} ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Projects</h2>
              <Link href="/projects" className="text-sm font-medium text-primary hover:text-primary-hover">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pending Milestones */}
            <div className="mt-10">
              <h2 className="mb-5 text-xl font-semibold">Pending Milestones</h2>
              <div className="space-y-3">
                {pendingMilestones.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
                  >
                    <div>
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{m.projectTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">Due: {m.dueDate}</span>
                      <Link
                        href={`/submit/${m.id}`}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                      >
                        Submit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="mb-5 text-xl font-semibold">Recent Activity</h2>
            <div className="rounded-xl border border-border bg-card">
              {recentActivity.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-4 ${
                    i !== recentActivity.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="mt-0.5 text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm text-foreground">{item.message}</p>
                    <p className="mt-1 text-xs text-muted">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Submissions */}
            <h2 className="mb-5 mt-10 text-xl font-semibold">Recent Submissions</h2>
            <div className="space-y-3">
              {submissions.slice(0, 3).map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
