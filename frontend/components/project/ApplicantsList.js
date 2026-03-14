import { useState, useEffect } from "react";
import { getProjectApplicants, assignFreelancer, getPFIScore } from "@/lib/api";

export default function ApplicantsList({ projectId, projectStatus }) {
  const [applicants, setApplicants] = useState([]);
  const [pfiScores, setPfiScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    getProjectApplicants(projectId)
      .then(async (res) => {
        const list = res?.data || res || [];
        const applicantList = Array.isArray(list) ? list : [];
        setApplicants(applicantList);

        // Fetch PFI scores for each applicant
        const scores = {};
        await Promise.allSettled(
          applicantList.map(async (app) => {
            const userId = app.freelancer?._id || app.freelancer || app.userId;
            if (userId) {
              try {
                const pfi = await getPFIScore(userId);
                scores[userId] = pfi?.data || pfi;
              } catch {
                scores[userId] = null;
              }
            }
          })
        );
        setPfiScores(scores);
      })
      .catch((err) => setError(err.message || "Failed to load applicants."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleAccept = async (applicant) => {
    const freelancerId = applicant.freelancer?._id || applicant.freelancer || applicant.userId;
    if (!freelancerId) return;

    setAssigning(freelancerId);
    try {
      await assignFreelancer(projectId, { freelancerId });
      setApplicants((prev) =>
        prev.map((a) => {
          const id = a.freelancer?._id || a.freelancer || a.userId;
          return id === freelancerId ? { ...a, accepted: true } : a;
        })
      );
    } catch (err) {
      setError(err.message || "Failed to assign freelancer.");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-xl bg-surface h-20" />
        ))}
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted">
        No applicants yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {applicants.map((applicant) => {
        const user = applicant.freelancer || {};
        const userId = user._id || applicant.freelancer || applicant.userId;
        const name = user.fullName || user.name || "Unknown";
        const username = user.username || "—";
        const message = applicant.message || "";
        const pfi = pfiScores[userId];
        const pfiScore = pfi?.score ?? pfi?.pfiScore ?? "N/A";
        const successRate = pfi?.milestoneSuccessRate ?? pfi?.successRate ?? null;

        return (
          <div
            key={userId || applicant._id}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{name}</h4>
                  <p className="text-sm text-muted">@{username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* PFI Score */}
                <div className="rounded-lg bg-surface px-3 py-1.5 text-center">
                  <div className="text-xs text-muted">PFI</div>
                  <div className="text-sm font-bold text-primary">{pfiScore}</div>
                </div>

                {/* Success Rate */}
                {successRate != null && (
                  <div className="rounded-lg bg-surface px-3 py-1.5 text-center">
                    <div className="text-xs text-muted">Success</div>
                    <div className="text-sm font-bold text-success">{successRate}%</div>
                  </div>
                )}

                {/* Accept button */}
                {applicant.accepted ? (
                  <span className="rounded-lg bg-success-subtle px-4 py-2 text-sm font-semibold text-success">
                    ✓ Accepted
                  </span>
                ) : (
                  <button
                    onClick={() => handleAccept(applicant)}
                    disabled={assigning === userId || projectStatus !== "open"}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {assigning === userId ? "Assigning…" : "Accept"}
                  </button>
                )}
              </div>
            </div>

            {/* Application message */}
            {message && (
              <p className="mt-3 rounded-lg bg-surface px-4 py-2.5 text-sm text-muted italic">
                &ldquo;{message}&rdquo;
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
