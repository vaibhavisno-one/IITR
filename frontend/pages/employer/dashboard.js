import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserProjects } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import ProjectCard from "@/components/project/ProjectCard";
import withAuth from "@/components/withAuth";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-surface ${className}`} />;
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

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="mt-3 text-lg text-muted">
            Welcome back{user?.name ? `, ${user.name}` : ""}! Manage your projects and escrow.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1"
            >
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="mt-2 text-[15px] font-medium text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mb-10 flex flex-wrap gap-4">
          <Link
            href="/employer/create-project"
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-[18px] py-[10px] text-[15px] font-medium text-white transition-all hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </Link>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 rounded-[10px] border border-border px-[18px] py-[10px] text-[15px] font-medium text-foreground transition-all hover:bg-surface-hover hover:shadow-sm"
          >
            Wallet & Escrow
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-8 border-b border-border text-[15px] font-medium overflow-x-auto">
          {["all", "open", "assigned", "active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`capitalize transition-all whitespace-nowrap px-1 ${
                filterTab === tab
                  ? "border-b-2 border-primary pb-3 text-primary"
                  : "border-b-2 border-transparent pb-3 text-muted hover:text-foreground hover:border-border-accent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Active Projects */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold capitalize">{filterTab} Projects</h2>
          <Link href="/employer/projects" className="text-[15px] font-medium text-primary hover:text-primary-hover transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[212px]" />
            <Skeleton className="h-[212px]" />
            <Skeleton className="h-[212px]" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-2xl border border-border bg-card py-16 text-center text-[15px] text-muted shadow-sm">
            No projects yet.{" "}
            <Link href="/employer/create-project" className="font-medium text-primary transition-colors hover:text-primary-hover">
              Create your first project →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

export default withAuth(EmployerDashboard);
