import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { createProject } from "@/lib/api";
import { useWallet } from "@/context/WalletContext";
import withAuth from "@/components/withAuth";

function CreateProject() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { walletBalance, lockedBalance, refreshWallet } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const projectBudget = Number(budget);
    const availableBalance = walletBalance - lockedBalance;

    if (projectBudget > availableBalance) {
      setError(`Insufficient wallet balance. You have $${availableBalance.toLocaleString()} available. Please deposit funds.`);
      return;
    }

    setLoading(true);

    try {
      await createProject({
        title,
        description,
        budget: projectBudget,
        deadline,
      });
      refreshWallet();
      router.push("/employer/projects");
    } catch (err) {
      setError(err.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Project — GigChain</title>
        <meta name="description" content="Post a new project on GigChain with budget and deadline. AI will auto-generate milestones." />
      </Head>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/employer/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span className="text-foreground">Create Project</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="mt-2 text-muted">
          Provide your project details. AI will automatically generate milestones based on your budget and deadline.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground">
                Project Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., E-Commerce Platform Redesign"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                placeholder="Describe the project scope, requirements, and deliverables…"
                className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="budget" className="mb-2 block text-sm font-medium text-foreground">
                  Budget (USD)
                </label>
                <input
                  id="budget"
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  placeholder="5000"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="mb-2 block text-sm font-medium text-foreground">
                  Deadline
                </label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary-subtle px-4 py-3 text-sm text-primary-hover">
            <span className="font-semibold">AI Milestones:</span> After creation, our AI will automatically generate milestones with amounts and deadlines based on your project details.
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              href="/employer/dashboard"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default withAuth(CreateProject);
