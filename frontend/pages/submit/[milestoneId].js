import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createSubmission, getSubmissionById } from "@/lib/api";
import SubmissionResult from "@/components/submission/SubmissionResult";
import withAuth from "@/components/withAuth";

function SubmitMilestone() {
  const router = useRouter();
  const { milestoneId } = router.query;

  const [submissionUrl, setSubmissionUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!milestoneId) return;
    setFetchLoading(false);
  }, [milestoneId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createSubmission({
        milestoneId,
        submissionUrl,
        description,
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
        <main className="mx-auto max-w-2xl px-6 py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle">
              <svg className="h-10 w-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Submission sent!</h1>
            <p className="mt-3 text-muted">
              Your work for milestone <span className="font-medium text-foreground">&quot;{milestoneId}&quot;</span> has been submitted for AI review.
            </p>
          </div>

          {/* AI Review Result */}
          {submissionResult && (
            <div className="mb-8">
              <SubmissionResult result={submissionResult} />
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Link
              href="/freelancer/dashboard"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Dashboard
            </Link>
            <Link
              href="/freelancer/projects"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover"
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
      <main className="mx-auto max-w-2xl px-6 py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/freelancer/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span className="text-foreground">Submit Work</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight">Submit Work</h1>
        <p className="mt-2 text-muted">
          Milestone ID: <span className="font-medium text-foreground">{milestoneId}</span>
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="mb-6">
            <label htmlFor="submissionUrl" className="mb-2 block text-sm font-medium">
              Submission URL
            </label>
            <input
              id="submissionUrl"
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              required
              placeholder="https://github.com/user/repo"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1.5 text-xs text-muted">Link to your code repository or deliverable.</p>
          </div>

          <div className="mb-6">
            <label htmlFor="desc" className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              placeholder="Describe the work completed…"
              className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Info box */}
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary-subtle px-4 py-3 text-sm text-primary-hover">
            <span className="font-semibold">AI Review:</span> Your submission will be automatically reviewed by AI. You&apos;ll see the score, verdict, and milestone status after submission.
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/freelancer/dashboard"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
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
