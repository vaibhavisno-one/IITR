import Head from "next/head";
import Link from "next/link";
import { userProfile, projects } from "@/data/mockData";

const completedProjects = projects.filter((p) => p.status === "completed");

export default function Profile() {
  return (
    <>
      <Head>
        <title>{userProfile.name} — GigChain Profile</title>
        <meta name="description" content={`${userProfile.name}'s freelancer profile on GigChain.`} />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Sidebar */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-black text-white">
                {userProfile.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              <p className="mt-1 text-sm text-muted">{userProfile.email}</p>
              <span className="mt-3 inline-block rounded-full bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary-hover">
                {userProfile.role}
              </span>

              {/* PFI Score */}
              <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Reputation (PFI)</div>
                <div className="mt-2 text-4xl font-black text-foreground">{userProfile.reputationScore}</div>
                <div className="mx-auto mt-3 h-2 w-full rounded-full bg-background">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${userProfile.reputationScore}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">Top 8% of freelancers</p>
              </div>

              <div className="mt-6 space-y-3 text-left text-sm">
                <div className="flex justify-between"><span className="text-muted">Member since</span><span className="font-medium">{userProfile.memberSince}</span></div>
                <div className="flex justify-between"><span className="text-muted">Completed</span><span className="font-medium">{userProfile.completedProjects} projects</span></div>
                <div className="flex justify-between"><span className="text-muted">Active</span><span className="font-medium">{userProfile.activeProjects} projects</span></div>
                <div className="flex justify-between"><span className="text-muted">Earnings</span><span className="font-bold text-success">${userProfile.totalEarnings.toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-2">
            {/* Bio */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">About</h2>
              <p className="leading-relaxed text-muted">{userProfile.bio}</p>
            </section>

            {/* Skills */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill) => (
                  <span key={skill} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground">{skill}</span>
                ))}
              </div>
            </section>

            {/* Stats */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Projects", value: userProfile.completedProjects, color: "text-primary", bg: "bg-primary-subtle" },
                  { label: "Active", value: userProfile.activeProjects, color: "text-success", bg: "bg-success-subtle" },
                  { label: "PFI Score", value: userProfile.reputationScore, color: "text-accent", bg: "bg-accent-subtle" },
                  { label: "Earnings", value: `$${(userProfile.totalEarnings / 1000).toFixed(0)}k`, color: "text-warning", bg: "bg-warning-subtle" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="mt-1 text-xs text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Completed Projects */}
            <section>
              <h2 className="mb-4 text-xl font-semibold">Completed Projects</h2>
              <div className="space-y-3">
                {completedProjects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover">
                    <div>
                      <h3 className="font-medium text-foreground">{p.title}</h3>
                      <p className="mt-0.5 text-sm text-muted">{p.employer}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">${p.budget.toLocaleString()}</div>
                      <div className="text-xs text-success">Completed</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
