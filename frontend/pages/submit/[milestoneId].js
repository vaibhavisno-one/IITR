import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { projects } from "@/data/mockData";

export default function SubmitMilestone() {
  const router = useRouter();
  const { milestoneId } = router.query;
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  let milestone = null;
  let project = null;
  for (const p of projects) {
    const m = p.milestones.find((ms) => ms.id === Number(milestoneId));
    if (m) { milestone = m; project = p; break; }
  }

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  if (!milestone) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Milestone not found</h1>
        <Link href="/dashboard" className="mt-6 inline-block text-primary">← Dashboard</Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <>
        <Head><title>Submitted — GigChain</title></Head>
        <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle">
            <svg className="h-10 w-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Submission sent!</h1>
          <p className="mt-3 text-muted">Your work for &quot;{milestone.title}&quot; is under review.</p>
          <div className="mt-8 flex gap-4">
            <Link href={`/projects/${project.id}`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">View Project</Link>
            <Link href="/dashboard" className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover">Dashboard</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>{`Submit — ${milestone.title} — GigChain`}</title></Head>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link href={`/projects/${project.id}`} className="hover:text-foreground">{project.title}</Link>
          <span>/</span>
          <span className="text-foreground">Submit</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight">Submit Work</h1>
        <p className="mt-2 text-muted">Milestone: <span className="font-medium text-foreground">{milestone.title}</span></p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Upload files</label>
            <div className="relative flex flex-col items-center rounded-xl border-2 border-dashed border-border bg-surface px-6 py-10 hover:border-border-accent">
              <svg className="mb-3 h-10 w-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-muted"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
              <input type="file" onChange={(e) => e.target.files?.[0] && setFileName(e.target.files[0].name)} className="absolute inset-0 cursor-pointer opacity-0" />
            </div>
            {fileName && <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-subtle px-4 py-2 text-sm text-success">✓ {fileName}</div>}
          </div>

          <div className="mb-6">
            <label htmlFor="desc" className="mb-2 block text-sm font-medium">Description</label>
            <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required placeholder="Describe the work completed…" className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="flex justify-end gap-3">
            <Link href={`/projects/${project.id}`} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover">Cancel</Link>
            <button type="submit" className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25">Submit Work</button>
          </div>
        </form>
      </main>
    </>
  );
}
