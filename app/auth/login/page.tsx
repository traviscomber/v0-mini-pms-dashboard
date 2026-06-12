import Link from "next/link";
import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/auth/session";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

import { signInAction, signUpAction } from "@/app/auth/login/actions";

interface LoginPageProps {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
}

function sanitizeNextPath(path?: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = sanitizeNextPath(params.next);
  const viewer = await getViewerContext();

  if (viewer.authEnabled && viewer.user) {
    redirect(viewer.needsSetup || !viewer.schemaReady ? "/setup" : next);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,1fr)]">
        <section className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Sprint 1 foundation
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-card-foreground sm:text-5xl">
              Turn this PMS into a real hospitality platform.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Authentication, roles, workspace onboarding, and multi-property foundations now live here. Once
              Supabase is configured, the app stops behaving like a public demo and starts acting like an actual
              hospitality workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-border bg-background/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What this adds</h2>
              <ul className="mt-4 space-y-3 text-sm text-card-foreground">
                <li>Email/password auth with protected PMS routes</li>
                <li>Workspace onboarding for organization + property</li>
                <li>RLS-ready multi-tenant schema and role model</li>
                <li>Proxy-based session refresh for Next.js 16</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-background/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What comes next</h2>
              <ul className="mt-4 space-y-3 text-sm text-card-foreground">
                <li>Map legacy room/reservation data into the tenant schema</li>
                <li>Staff permissions, owner dashboards, and audit trails</li>
                <li>Payments, automations, and OTA integrations</li>
                <li>Housekeeping, messaging, and revenue workflows</li>
              </ul>
            </article>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-5 text-sm text-muted-foreground">
            <p>
              If you have not configured Supabase yet, the current public demo still works. Once you add the auth env
              vars and run the SQL migration, this login becomes the real front door of the product.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          {params.message && (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              {params.message}
            </div>
          )}

          {!hasSupabaseAuthConfig() && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Supabase auth is not configured yet. Add `NEXT_PUBLIC_SUPABASE_URL` and
              `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then apply the migration file before using protected mode.
            </div>
          )}

          <div className="grid gap-6">
            <form action={signInAction} className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-card-foreground">Sign in</h2>
                <p className="text-sm text-muted-foreground">Use your team account to access your workspace.</p>
              </div>

              <input type="hidden" name="next" value={next} />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="you@company.com"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="••••••••"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-95"
              >
                Continue to PMS
              </button>
            </form>

            <form action={signUpAction} className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-card-foreground">Create account</h2>
                <p className="text-sm text-muted-foreground">Provision your operator login, then create your first workspace.</p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">Full name</span>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="Operations lead"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="ops@company.com"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">Password</span>
                <input
                  type="password"
                  name="password"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="At least 8 characters"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-card-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                Create account
              </button>
            </form>
          </div>

          <p className="px-1 text-sm text-muted-foreground">
            Need the migration file? It lives in `supabase/migrations/202606110001_sprint1_foundation.sql`. Once
            applied, continue with <Link href="/setup" className="text-primary hover:underline">workspace setup</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
