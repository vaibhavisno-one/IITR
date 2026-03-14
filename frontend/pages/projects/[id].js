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
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Skeleton className="mb-8 h-5 w-32" />
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-[212px]" />
            <Skeleton className="h-[212px]" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <p className="mt-3 text-[17px] text-muted">{error || "The project you're looking for doesn't exist."}</p>
        <Link href={backLink} className="mt-6 inline-block font-medium text-primary hover:text-primary-hover">
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

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[15px] font-medium text-muted">
          <Link href={backLink} className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground">{project.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h1>
                <span
                  className={`mt-1.5 rounded-full px-3 py-1 text-[13px] font-semibold capitalize ${
                    statusStyles[project.status] || "bg-surface text-muted"
                  }`}
                >
                  {project.status === 'in_progress' ? 'active' : project.status}
                </span>
              </div>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">{project.description}</p>
            </div>

            <div>
              <h2 className="mb-6 text-2xl font-semibold">
                Milestones{" "}
                <span className="text-[17px] font-normal text-muted">
                  ({completedCount}/{milestones.length} completed)
                </span>
              </h2>
              {isEmployer && milestones.length === 0 && project.status === "open" && (
                <div className="mb-8 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-subtle text-primary">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">No Milestones Yet</h3>
                  <p className="mb-8 text-[15px] font-medium text-muted mx-auto max-w-md">Use AI to automatically break down your project into smart milestones based on your budget and deadline.</p>
                  <button
                    onClick={handleGenerateMilestones}
                    disabled={generating}
                    className="rounded-[10px] bg-primary px-[20px] py-[12px] text-[15px] font-medium text-white transition-all hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
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
              <div className="mt-12 border-t border-border pt-10">
                <h2 className="mb-6 text-2xl font-semibold">Apply for Project</h2>
                {applied ? (
                  <div className="rounded-2xl border border-border bg-success-subtle p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success text-2xl">
                      ✓
                    </div>
                    <h3 className="text-xl font-bold text-success">Application Sent</h3>
                    <p className="mt-3 text-[15px] font-medium text-foreground">
                      The employer will review your profile and application message.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <label htmlFor="message" className="mb-3 block text-[15px] font-semibold text-foreground">
                      Message to Employer
                    </label>
                    <textarea
                      id="message"
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      rows={5}
                      placeholder="Why are you the best fit for this project? Describe your approach..."
                      className="mb-6 w-full resize-none rounded-xl border border-border bg-surface px-5 py-4 text-[15px] font-medium transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="rounded-[10px] bg-primary px-[20px] py-[12px] text-[15px] font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)] disabled:cursor-not-allowed disabled:opacity-60 w-full md:w-auto"
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
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-5 text-[17px] font-semibold text-foreground">Project Details</h3>
                <dl className="space-y-5">
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-muted">Employer</dt>
                    <dd className="mt-1 flex items-center gap-2 text-[15px] font-medium text-foreground">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {(employerName || "U")[0].toUpperCase()}
                      </div>
                      {employerName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-muted">Budget</dt>
                    <dd className="mt-1 text-[22px] font-black text-foreground tracking-tight">
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
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface w-full py-4 text-[15px] font-medium text-foreground transition-all hover:bg-surface-hover hover:shadow-sm"
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
