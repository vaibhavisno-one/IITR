import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProjects, getUserProjects } from "@/lib/api";
import ProjectCard from "@/components/project/ProjectCard";
import withAuth from "@/components/withAuth";

const tabs = ["my-projects", "browse"];
const statuses = ["all", "active", "pending", "completed"];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-surface ${className}`} />;
}

function FreelancerProjects() {
  const [activeTab, setActiveTab] = useState("my-projects");
  const [myProjects, setMyProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [myRes, allRes] = await Promise.allSettled([
          getUserProjects(),
          getProjects(),
        ]);

        if (myRes.status === "fulfilled") {
          const list = myRes.value?.data || myRes.value || [];
          setMyProjects(Array.isArray(list) ? list : []);
        }

        if (allRes.status === "fulfilled") {
          const list = allRes.value?.data || allRes.value || [];
          setAllProjects(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        setError(err.message || "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const source = activeTab === "my-projects" ? myProjects : allProjects;

  const filtered = source.filter((p) => {
    const matchesStatus = activeFilter === "all" || p.status === activeFilter;
    const title = p.title || "";
    const employer = p.employer?.name || p.employer || "";
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      employer.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Projects — GigChain</title>
        <meta name="description" content="Browse and manage your freelance projects on GigChain." />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted">Your assigned projects and available opportunities.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary-hover"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab === "my-projects" ? "My Projects" : "Browse All"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                  activeFilter === status
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-72"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
            <p className="text-lg font-medium text-foreground">No projects found</p>
            <p className="mt-1 text-sm text-muted">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default withAuth(FreelancerProjects);
