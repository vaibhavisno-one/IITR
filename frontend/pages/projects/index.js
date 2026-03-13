import Head from "next/head";
import { useState } from "react";
import { projects } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";

const statuses = ["all", "active", "pending", "completed"];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchesStatus = activeFilter === "all" || p.status === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.employer.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Projects — GigChain</title>
        <meta name="description" content="Browse all available freelance projects on GigChain." />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted">Browse and discover projects that match your skills.</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status tabs */}
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

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
            <svg className="mb-4 h-12 w-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-foreground">No projects found</p>
            <p className="mt-1 text-sm text-muted">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </>
  );
}
