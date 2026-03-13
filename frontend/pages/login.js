import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login attempted with: ${email}`);
  };

  return (
    <>
      <Head>
        <title>Log In — GigChain</title>
        <meta name="description" content="Log in to your GigChain account to manage projects, milestones, and payments." />
      </Head>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-muted">Log in to continue to GigChain</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <button type="button" className="text-xs font-medium text-primary hover:text-primary-hover">
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
            >
              Log in
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              className="w-full rounded-lg border border-border bg-surface py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
            >
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-primary-hover">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
