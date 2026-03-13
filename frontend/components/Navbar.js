import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-white">
            G
          </span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GigChain
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-subtle text-primary-hover"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border px-6 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-subtle text-primary-hover"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <hr className="my-2 border-border" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
