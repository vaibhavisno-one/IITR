import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProjectById, getProjectMilestones, applyForProject, generateMilestones } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import MilestoneTimeline from "@/components/milestone/MilestoneTimeline";
import ApplicantsList from "@/components/project/ApplicantsList";

const statusStyles = {
  active: "bg-success-subtle text-success",
  completed: "bg-primary-subtle text-primary-hover",
  pending: "bg-warning-subtle text-warning",
};

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-surface ${className}`} />;
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const [projectRes, milestonesRes] = await Promise.allSettled([
          getProjectById(id),
          getProjectMilestones(id),
        ]);

        if (projectRes.status === "fulfilled") {
          setProject(projectRes.value?.data || projectRes.value);
        } else {
          setError(projectRes.reason?.message || "Project not found.");
        }

        if (milestonesRes.status === "fulfilled") {
          const list = milestonesRes.value?.data || milestonesRes.value || [];
          setMilestones(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        setError(err.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const isFreelancer = user?.role === "freelancer";
  const isEmployer = user?.role === "employer";
  const isAssignedFreelancer = isFreelancer && project?.freelancer && (project.freelancer._id === user._id || project.freelancer === user._id);
  const backLink = isFreelancer ? "/freelancer/projects" : "/employer/projects";

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applyForProject(id, { message: applyMessage });
      setApplied(true);
    } catch (err) {
      alert(err.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  const handleGenerateMilestones = async () => {
    setGenerating(true);
    try {
      await generateMilestones(id);
      const updatedMilestones = await getProjectMilestones(id);
      const list = updatedMilestones?.data || updatedMilestones || [];
      setMilestones(Array.isArray(list) ? list : []);
    } catch (err) {
      alert(err.message || "Failed to generate AI milestones.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Skeleton className="mb-6 h-5 w-32" />
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="mt-2 text-muted">{error || "The project you're looking for doesn't exist."}</p>
        <Link href={backLink} className="mt-6 inline-block text-primary hover:text-primary-hover">
          ← Back to projects
        </Link>
      </main>
    );
  }

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const failedCount = milestones.filter((m) => m.status === "failed").length;
  const progress = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  const employerName =
    project.employer?.fullName || project.employer?.username || project.employer?.name || project.employerName || (typeof project.employer === "string" ? project.employer : "—");

  const totalMilestoneAmount = milestones.reduce((acc, m) => acc + (m.amount || 0), 0);

  return (
    <>
      <Head>
        <title>{`${project.title} — GigChain`}</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href={backLink} className="hover:text-foreground">
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
                  ({completedCount}/{milestones.length} completed)
                </span>
              </h2>
              {isEmployer && milestones.length === 0 && project.status === "open" && (
                <div className="mb-6 rounded-xl border border-border bg-card p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-primary">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">No Milestones Yet</h3>
                  <p className="mb-6 text-sm text-muted">Use AI to automatically break down your project into smart milestones based on your budget and deadline.</p>
                  <button
                    onClick={handleGenerateMilestones}
                    disabled={generating}
                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {generating ? "Generating AI Milestones..." : "Generate Milestones"}
                  </button>
                </div>
              )}
              
              <MilestoneTimeline
                milestones={milestones}
                showSubmitButton={isAssignedFreelancer}
              />
            </div>

            {/* Applicants (Employer only) */}
            {isEmployer && (
              <div className="mt-10 border-t border-border pt-10">
                <h2 className="mb-6 text-xl font-semibold">Applicants</h2>
                <ApplicantsList projectId={id} projectStatus={project.status} />
              </div>
            )}

            {/* Apply (Freelancer only) */}
            {isFreelancer && project.status !== "completed" && project.status !== "assigned" && !project.freelancer && (
              <div className="mt-10 border-t border-border pt-10">
                <h2 className="mb-6 text-xl font-semibold">Apply for Project</h2>
                {applied ? (
                  <div className="rounded-xl border border-border bg-success-subtle p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success">
                      ✓
                    </div>
                    <h3 className="text-lg font-bold text-success">Application Sent</h3>
                    <p className="mt-2 text-sm text-foreground">
                      The employer will review your profile and application message.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="rounded-xl border border-border bg-card p-6">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
                      Message to Employer
                    </label>
                    <textarea
                      id="message"
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      rows={4}
                      placeholder="Why are you the best fit for this project? Describe your approach..."
                      className="mb-4 w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {applying ? "Applying..." : "Apply for Project"}
                    </button>
                  </form>
                )}
              </div>
            )}
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
                    <dd className="mt-1 text-sm font-medium text-foreground">{employerName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">Budget</dt>
                    <dd className="mt-1 text-sm font-bold text-foreground">
                      ${(project.budget || 0).toLocaleString()}
                    </dd>
                  </div>
                  {totalMilestoneAmount > 0 && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-muted">Milestone Total</dt>
                      <dd className="mt-1 text-sm font-bold text-accent">
                        ${totalMilestoneAmount.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">Progress</dt>
                    <dd className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">{progress}% complete</span>
                        <span className="text-xs text-muted">
                          {completedCount}/{milestones.length}
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
                    <dd className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-md bg-success-subtle px-2 py-1 text-xs font-medium text-success">
                        {completedCount} done
                      </span>
                      <span className="rounded-md bg-primary-subtle px-2 py-1 text-xs font-medium text-primary-hover">
                        {milestones.filter((m) => m.status === "submitted").length} submitted
                      </span>
                      <span className="rounded-md bg-warning-subtle px-2 py-1 text-xs font-medium text-warning">
                        {milestones.filter((m) => m.status === "pending").length} pending
                      </span>
                      {failedCount > 0 && (
                        <span className="rounded-md bg-danger-subtle px-2 py-1 text-xs font-medium text-danger">
                          {failedCount} failed
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Action */}
              <Link
                href={backLink}
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
