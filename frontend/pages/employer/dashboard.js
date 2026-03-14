import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserProjects } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import ProjectCard from "@/components/project/ProjectCard";
import withAuth from "@/components/withAuth";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-surface ${className}`} />;
}

function EmployerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  useEffect(() => {
    getUserProjects()
      .then((res) => {
        const list = res?.data || res || [];
        setProjects(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(err.message || "Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const { lockedBalance } = useWallet();

  const activeProjects = projects.filter((p) => p.status === "active");
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const escrowLocked = lockedBalance || 0;

  const quickStats = [
    {
      label: "Total Projects",
      value: loading ? "—" : projects.length,
      color: "text-primary",
      bg: "bg-primary-subtle",
    },
    {
      label: "Active Projects",
      value: loading ? "—" : activeProjects.length,
      color: "text-success",
      bg: "bg-success-subtle",
    },
    {
      label: "Total Budget",
      value: loading ? "—" : `$${totalBudget.toLocaleString()}`,
      color: "text-accent",
      bg: "bg-accent-subtle",
    },
    {
      label: "Escrow Locked",
      value: loading ? "—" : `$${escrowLocked.toLocaleString()}`,
      color: "text-warning",
      bg: "bg-warning-subtle",
    },
  ];

  return (
    <>
      <Head>
        <title>Employer Dashboard — GigChain</title>
        <meta name="description" content="Manage your projects, budgets, and escrow on GigChain." />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="mt-2 text-muted">
            Welcome back{user?.name ? `, ${user.name}` : ""}! Manage your projects and escrow.
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

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/employer/create-project"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </Link>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
          >
            Wallet & Escrow
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-6 border-b border-border text-sm font-medium overflow-x-auto">
          {["all", "open", "assigned", "active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`capitalize transition-all whitespace-nowrap ${
                filterTab === tab
                  ? "border-b-2 border-primary pb-3 text-primary"
                  : "border-b-2 border-transparent pb-3 text-muted hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Active Projects */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold capitalize">{filterTab} Projects</h2>
          <Link href="/employer/projects" className="text-sm font-medium text-primary hover:text-primary-hover">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects
              .filter((p) => {
                const s = p.status?.toLowerCase();
                if (filterTab === "all") return true;
                if (filterTab === "open") return s === "open";
                if (filterTab === "assigned") return s === "assigned";
                if (filterTab === "active") return s === "in_progress";
                if (filterTab === "completed") return s === "completed";
                return true;
              })
              .map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted">
            No projects yet.{" "}
            <Link href="/employer/create-project" className="text-primary hover:text-primary-hover">
              Create your first project →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

export default withAuth(EmployerDashboard);
