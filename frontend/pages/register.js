import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registration attempted — Role: ${role}, Name: ${name}, Email: ${email}`);
  };

  return (
    <>
      <Head>
        <title>Sign Up — GigChain</title>
        <meta name="description" content="Create your GigChain account as an employer or freelancer." />
      </Head>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-muted">Start hiring or freelancing in minutes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8">
            {/* Role selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-foreground">I want to…</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("employer")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200 ${
                    role === "employer"
                      ? "border-primary bg-primary-subtle text-primary-hover"
                      : "border-border bg-surface text-muted hover:border-border-accent hover:text-foreground"
                  }`}
                >
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Hire talent
                  <span className="text-xs font-normal text-muted">Post projects & milestones</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200 ${
                    role === "freelancer"
                      ? "border-primary bg-primary-subtle text-primary-hover"
                      : "border-border bg-surface text-muted hover:border-border-accent hover:text-foreground"
                  }`}
                >
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Find work
                  <span className="text-xs font-normal text-muted">Browse & deliver projects</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Alex Morgan"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-2 block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-2 block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!role}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create account
            </button>

            <p className="mt-4 text-center text-xs text-muted">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
