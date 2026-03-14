import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserProjects, getUserPFI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProjectCard from "@/components/project/ProjectCard";
import SubmissionCard from "@/components/submission/SubmissionCard";
import withAuth from "@/components/withAuth";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-surface ${className}`} />;
}

function FreelancerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [pfi, setPfi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, pfiRes] = await Promise.allSettled([
          getUserProjects(),
          getUserPFI(),
        ]);

        if (projectsRes.status === "fulfilled") {
          const list = projectsRes.value?.data || projectsRes.value || [];
          setProjects(Array.isArray(list) ? list : []);
        }

        if (pfiRes.status === "fulfilled") {
          setPfi(pfiRes.value?.data || pfiRes.value || null);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const activeProjects = projects.filter((p) => p.status === "active");

  const pendingMilestones = projects
    .flatMap((p) =>
      (p.milestones || []).map((m) => ({
        ...m,
        projectTitle: p.title,
        projectId: p._id || p.id,
      }))
    )
    .filter((m) => m.status === "pending");

  const recentSubmissions = projects
    .flatMap((p) =>
      (p.milestones || []).flatMap((m) => m.submissions || [])
    )
    .slice(0, 3);

  const quickStats = [
    {
      label: "Active Projects",
      value: loading ? "—" : activeProjects.length,
      color: "text-primary",
      bg: "bg-primary-subtle",
    },
    {
      label: "Pending Milestones",
      value: loading ? "—" : pendingMilestones.length,
      color: "text-warning",
      bg: "bg-warning-subtle",
    },
    {
      label: "Submissions",
      value: loading ? "—" : recentSubmissions.length,
      color: "text-accent",
      bg: "bg-accent-subtle",
    },
    {
      label: "PFI Score",
      value: loading ? "—" : (pfi?.score ?? pfi?.pfiScore ?? "N/A"),
      color: "text-success",
      bg: "bg-success-subtle",
    },
  ];

  return (
    <>
      <Head>
        <title>Freelancer Dashboard — GigChain</title>
        <meta name="description" content="Manage your freelancing work, milestones, and submissions on GigChain." />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Freelancer Dashboard</h1>
          <p className="mt-2 text-muted">
            Welcome back{user?.name ? `, ${user.name}` : ""}! Here&apos;s your freelancing overview.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Projects</h2>
              <Link href="/freelancer/projects" className="text-sm font-medium text-primary hover:text-primary-hover">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-44" />
                <Skeleton className="h-44" />
              </div>
            ) : activeProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeProjects.map((project) => (
                  <ProjectCard key={project._id || project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted">
                No active projects yet.{" "}
                <Link href="/freelancer/projects" className="text-primary hover:text-primary-hover">
                  Browse projects →
                </Link>
              </div>
            )}

            {/* Pending Milestones */}
            <div className="mt-10">
              <h2 className="mb-5 text-xl font-semibold">Pending Milestones</h2>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : pendingMilestones.length > 0 ? (
                <div className="space-y-3">
                  {pendingMilestones.slice(0, 5).map((m) => (
                    <div
                      key={m._id || m.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
                    >
                      <div>
                        <p className="font-medium text-foreground">{m.title}</p>
                        <p className="mt-0.5 text-sm text-muted">{m.projectTitle}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.amount != null && (
                          <span className="text-xs font-bold text-foreground">
                            ${Number(m.amount).toLocaleString()}
                          </span>
                        )}
                        {m.dueDate && (
                          <span className="text-xs text-muted">
                            Due: {new Date(m.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <Link
                          href={`/submit/${m._id || m.id}`}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                        >
                          Submit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted">
                  No pending milestones.
                </p>
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div>
            <h2 className="mb-5 text-xl font-semibold">Recent Submissions</h2>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {recentSubmissions.map((sub) => (
                  <SubmissionCard key={sub._id || sub.id} submission={sub} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted">
                No submissions yet.
              </p>
            )}

            {/* Wallet link */}
            <Link
              href="/wallet"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface w-full py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Wallet →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default withAuth(FreelancerDashboard);
