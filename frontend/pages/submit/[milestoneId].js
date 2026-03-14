import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createSubmission, getSubmissionById, getMilestoneById, getProjectMilestones } from "@/lib/api";
import SubmissionResult from "@/components/submission/SubmissionResult";
import withAuth from "@/components/withAuth";

function SubmitMilestone() {
  const router = useRouter();
  const { milestoneId } = router.query;

  const [selectedMilestone, setSelectedMilestone] = useState(milestoneId || "");
  const [projectMilestones, setProjectMilestones] = useState([]);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!milestoneId) return;
    
    // Fetch current milestone to identify the project
    getMilestoneById(milestoneId)
      .then((res) => {
        const m = res?.data || res;
        const pId = m?.project?._id || m?.project;
        if (pId) {
            getProjectMilestones(pId).then((mRes) => {
                const arr = Array.isArray(mRes?.data) ? mRes.data : Array.isArray(mRes) ? mRes : [];
                setProjectMilestones(arr.filter(mil => mil.status === "pending" || mil._id === milestoneId));
                setFetchLoading(false);
            }).catch(() => setFetchLoading(false));
        } else {
            setFetchLoading(false);
        }
      }).catch(() => setFetchLoading(false));

    setSelectedMilestone(milestoneId);
  }, [milestoneId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createSubmission({
        milestoneId: selectedMilestone,
        repoLink: submissionUrl,
        content: description,
      });

      const data = res?.data || res;

      // If the backend returns AI review data immediately
      setSubmissionResult({
        aiScore: data?.aiScore ?? data?.ai_score ?? null,
        aiVerdict: data?.aiVerdict ?? data?.ai_verdict ?? null,
        milestoneStatus: data?.milestoneStatus ?? data?.milestone_status ?? "submitted",
        payout: data?.payout ?? null,
      });

      setSubmitted(true);

      // Poll for AI review if not immediate
      if (data?._id && data?.aiScore == null) {
        setTimeout(async () => {
          try {
            const review = await getSubmissionById(data._id);
            const reviewData = review?.data || review;
            if (reviewData?.aiScore != null) {
              setSubmissionResult({
                aiScore: reviewData.aiScore ?? reviewData.ai_score,
                aiVerdict: reviewData.aiVerdict ?? reviewData.ai_verdict,
                milestoneStatus: reviewData.milestoneStatus ?? reviewData.milestone_status ?? "submitted",
                payout: reviewData.payout ?? null,
              });
            }
          } catch {
            // silent — review not ready yet
          }
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="animate-pulse text-muted">Loading…</div>
      </main>
    );
  }

  if (submitted) {
    return (
      <>
        <Head><title>Submitted — GigChain</title></Head>
        <main className="mx-auto max-w-2xl px-6 py-12 md:py-16">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-success-subtle shadow-[0_4px_14px_rgba(34,197,94,0.1)]">
              <svg className="h-10 w-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Submission sent!</h1>
            <p className="mt-3 text-[17px] text-muted">
              Your work for milestone <span className="font-semibold text-foreground">&quot;{selectedMilestone}&quot;</span> has been submitted for AI review.
            </p>
          </div>

          {/* AI Review Result */}
          {submissionResult && (
            <div className="mb-10">
              <SubmissionResult result={submissionResult} />
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Link
              href="/freelancer/dashboard"
              className="rounded-[10px] bg-primary px-[20px] py-[12px] text-[15px] font-medium text-white transition-all hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)]"
            >
              Dashboard
            </Link>
            <Link
              href="/freelancer/projects"
              className="rounded-[10px] border border-border bg-surface px-[20px] py-[12px] text-[15px] font-medium text-foreground transition-colors hover:bg-surface-hover hover:shadow-sm"
            >
              Projects
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>Submit Work — GigChain</title></Head>
      <main className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <nav className="mb-8 flex items-center gap-2 text-[15px] font-medium text-muted">
          <Link href="/freelancer/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-foreground">Submit Work</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Submit Work</h1>
        <p className="mt-3 text-[17px] text-muted">Submit your deliverable for AI review and escrow release.</p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-[15px] font-medium text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 rounded-[32px] border border-border bg-card p-10 shadow-sm">
          
          {/* Milestone Selection */}
          <div className="mb-8">
            <label htmlFor="milestoneSelect" className="mb-3 block text-[15px] font-semibold text-foreground">
              Select Milestone
            </label>
            <div className="relative">
                <select
                id="milestoneSelect"
                value={selectedMilestone}
                onChange={(e) => setSelectedMilestone(e.target.value)}
                required
                className="w-full appearance-none rounded-xl border border-border bg-surface px-5 py-3.5 text-[15px] font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                >
                <option value="" disabled>Select a pending milestone...</option>
                {projectMilestones.map((milestone) => (
                    <option key={milestone._id || milestone.id} value={milestone._id || milestone.id}>
                        {milestone.title} (${milestone.amount})
                    </option>
                ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="submissionUrl" className="mb-3 block text-[15px] font-semibold text-foreground">
              Repository or Link
            </label>
            <input
              id="submissionUrl"
              type="text"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full rounded-xl border border-border bg-surface px-5 py-3.5 text-[15px] text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <p className="mt-2 text-[13px] font-medium text-muted">Provide the URL for your deliverable (optional).</p>
          </div>

          <div className="mb-8">
            <label htmlFor="desc" className="mb-3 block text-[15px] font-semibold text-foreground">Details & Content</label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              placeholder="Provide a detailed description of the completed work..."
              className="w-full resize-none rounded-xl border border-border bg-surface px-5 py-4 text-[15px] text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Info box */}
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary-subtle px-6 py-5 text-[15px] text-primary-hover shadow-sm">
            <span className="font-semibold">AI Review:</span> Your submission will be automatically reviewed by AI. You&apos;ll see the score, verdict, and milestone status after submission.
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <Link
              href="/freelancer/dashboard"
              className="rounded-[10px] border border-border px-[20px] py-[12px] text-[15px] font-medium text-foreground transition-colors hover:bg-surface-hover hover:shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-[10px] bg-primary px-[26px] py-[12px] text-[15px] font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit Work"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default withAuth(SubmitMilestone);
