import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserProfile, getUserPFI, getUserProjects } from "@/lib/api";
import withAuth from "@/components/withAuth";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-surface ${className}`} />;
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [pfi, setPfi] = useState(null);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, pfiRes, projectsRes] = await Promise.allSettled([
          getUserProfile(),
          getUserPFI(),
          getUserProjects(),
        ]);

        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value?.data || profileRes.value);
        } else {
          setError(profileRes.reason?.message || "Failed to load profile.");
        }

        if (pfiRes.status === "fulfilled") {
          setPfi(pfiRes.value?.data || pfiRes.value);
        }

        if (projectsRes.status === "fulfilled") {
          const list = projectsRes.value?.data || projectsRes.value || [];
          setCompletedProjects(
            (Array.isArray(list) ? list : []).filter((p) => p.status === "completed")
          );
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const pfiScore = pfi?.score ?? pfi?.pfiScore ?? 0;
  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("")
    : "?";

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-24" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">{error || "Profile not found"}</h1>
        <p className="mt-2 text-muted">Please log in to view your profile.</p>
        <Link href="/login" className="mt-6 inline-block text-primary hover:text-primary-hover">
          Log in →
        </Link>
      </main>
    );
  }

  const skills = profile.skills || [];
  const totalEarnings = profile.totalEarnings || 0;
  const activeProjectsCount = profile.activeProjects ?? 0;
  const completedProjectsCount = profile.completedProjects ?? completedProjects.length;

  return (
    <>
      <Head>
        <title>{profile.name} — GigChain Profile</title>
        <meta name="description" content={`${profile.name}'s profile on GigChain.`} />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Sidebar */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-black text-white">
                {initials}
              </div>
              <h1 className="text-xl font-bold">{profile.name}</h1>
              <p className="mt-1 text-sm text-muted">{profile.email}</p>
              <span className="mt-3 inline-block rounded-full bg-primary-subtle px-3 py-1 text-xs font-semibold capitalize text-primary-hover">
                {profile.role}
              </span>

              {/* PFI Score */}
              <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Reputation (PFI)</div>
                <div className="mt-2 text-4xl font-black text-foreground">{pfiScore}</div>
                <div className="mx-auto mt-3 h-2 w-full rounded-full bg-background">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.min(pfiScore, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">Freelancer reputation score</p>
              </div>

              <div className="mt-6 space-y-3 text-left text-sm">
                {profile.memberSince && (
                  <div className="flex justify-between">
                    <span className="text-muted">Member since</span>
                    <span className="font-medium">
                      {new Date(profile.memberSince || profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Completed</span>
                  <span className="font-medium">{completedProjectsCount} projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Active</span>
                  <span className="font-medium">{activeProjectsCount} projects</span>
                </div>
                {totalEarnings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Earnings</span>
                    <span className="font-bold text-success">${totalEarnings.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-2">
            {/* Bio */}
            {profile.bio && (
              <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">About</h2>
                <p className="leading-relaxed text-muted">{profile.bio}</p>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Stats */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Projects", value: completedProjectsCount, color: "text-primary", bg: "bg-primary-subtle" },
                  { label: "Active", value: activeProjectsCount, color: "text-success", bg: "bg-success-subtle" },
                  { label: "PFI Score", value: pfiScore, color: "text-accent", bg: "bg-accent-subtle" },
                  { label: "Earnings", value: totalEarnings > 0 ? `$${(totalEarnings / 1000).toFixed(0)}k` : "$0", color: "text-warning", bg: "bg-warning-subtle" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="mt-1 text-xs text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold">Completed Projects</h2>
                <div className="space-y-3">
                  {completedProjects.map((p) => (
                    <Link
                      key={p._id || p.id}
                      href={`/projects/${p._id || p.id}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
                    >
                      <div>
                        <h3 className="font-medium text-foreground">{p.title}</h3>
                        <p className="mt-0.5 text-sm text-muted">
                          {p.employer?.name || p.employer || ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          ${(p.budget || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-success">Completed</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default withAuth(Profile);
