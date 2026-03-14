import Head from "next/head";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Escrow Protection",
    desc: "Funds are held securely and released only when milestones are verified and approved.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Milestone-Based Workflow",
    desc: "Break projects into clear milestones with deliverables, deadlines, and payments.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Reputation System",
    desc: "Build trust with transparent performance scores powered by on-chain history.",
  },
];

const stats = [
  { value: "2,400+", label: "Active Projects" },
  { value: "$12M+", label: "Total Paid Out" },
  { value: "8,500+", label: "Freelancers" },
  { value: "99.2%", label: "Satisfaction Rate" },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>GigChain — Freelance Platform Powered by Trust</title>
        <meta
          name="description"
          content="GigChain is a milestone-based freelance platform with escrow protection, reputation scores, and seamless project management."
        />
      </Head>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/8 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[13px] font-medium text-muted shadow-sm">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Now in Public Beta
              </div>
              <h1 className="text-4xl md:text-[56px] lg:text-[72px] font-bold leading-tight tracking-tight text-foreground">
                Freelancing built on{" "}
                <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                  trust & milestones
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
                GigChain connects employers and freelancers through milestone-based contracts, escrow payments, and transparent reputation scores.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/projects"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)] sm:w-auto"
                >
                  Post a Project
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-surface px-8 py-3.5 text-[15px] font-medium text-foreground transition-all duration-300 hover:border-border-accent hover:bg-surface-hover hover:shadow-sm sm:w-auto"
                >
                  Find Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-surface/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-foreground md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Why teams choose{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">GigChain</span>
            </h2>
            <p className="mt-4 text-[17px] text-muted">
              A freelance platform designed for accountability, transparency, and fair compensation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-border-accent hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex rounded-[10px] bg-primary-subtle p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-muted text-[15px]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-24 text-center">
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-gradient-to-br from-surface via-card to-surface p-12 shadow-sm md:p-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                Ready to start building?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[17px] text-muted">
                Join thousands of freelancers and employers who trust GigChain for fair, milestone-based collaboration.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-[20px] py-[12px] text-[15px] font-medium text-white transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)]"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-border px-[20px] py-[12px] bg-surface text-[15px] font-medium text-foreground transition-all duration-300 hover:border-border-accent hover:bg-surface-hover hover:shadow-sm"
                >
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-surface/50">
          <div className="mx-auto max-w-7xl px-6 py-10 text-center text-sm text-muted">
            &copy; {new Date().getFullYear()} GigChain. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}
