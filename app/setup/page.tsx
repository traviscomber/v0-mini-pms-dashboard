import Link from "next/link";
import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/auth/session";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

import { createWorkspaceAction } from "@/app/setup/actions";

interface SetupPageProps {
  searchParams: Promise<{
    message?: string;
    mode?: string;
  }>;
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;
  const viewer = await getViewerContext();

  if (!hasSupabaseAuthConfig()) {
    redirect("/");
  }

  if (!viewer.user) {
    redirect("/auth/login?next=/setup");
  }

  if (viewer.schemaReady && !viewer.needsSetup) {
    redirect("/pms");
  }

  const isSchemaMode = params.mode === "schema" || !viewer.schemaReady;
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Workspace setup
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-card-foreground">Provision your workspace</h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              This step creates the first organization, owner membership, and site context that future platform
              operations, maintenance, hospitality, and automation flows will hang from.
            </p>
          </div>
        </section>

        {params.message && (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {params.message}
          </div>
        )}

        {isSchemaMode ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <article className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-card-foreground">Apply the Sprint 1 SQL migration first</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Your auth session works, but the multi-tenant tables and policies are not available yet. Run the SQL in
                `supabase/migrations/202606110001_sprint1_foundation.sql` against your Supabase project, then reload this
                page to continue.
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-background/70 p-5 text-sm text-card-foreground">
                <p className="font-medium">What the migration creates</p>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>`profiles`, `organizations`, `memberships`, `properties`, `units`</li>
                <li>`guests`, `reservations`, `tasks`, `audit_logs`</li>
                <li>Owner/admin/manager/staff roles plus RLS helpers</li>
                <li>A secure `bootstrap_workspace(...)` function for onboarding</li>
              </ul>
            </div>
            </article>

            <article className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-card-foreground">After you apply it</h2>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>1. Refresh this page</li>
                <li>2. Enter your organization and first property</li>
                <li>3. Land in the protected PMS shell</li>
                <li>4. Start mapping legacy room/reservation data into tenant-aware tables</li>
              </ol>

              <div className="mt-6 rounded-2xl border border-border bg-background/70 p-5 text-sm text-muted-foreground">
                Want a reminder of the auth entrypoint? Head back to <Link href="/auth/login" className="text-primary hover:underline">`/auth/login`</Link>.
              </div>
            </article>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <form action={createWorkspaceAction} className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-card-foreground">Create first workspace</h2>
                <p className="text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-card-foreground">{viewer.user.displayName}</span>.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">Organization name</span>
                <input
                  type="text"
                  name="organizationName"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="N3uralia Group"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-card-foreground">First property name</span>
                <input
                  type="text"
                  name="propertyName"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                  placeholder="Main Operations Hub"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-card-foreground">Timezone</span>
                  <input
                    type="text"
                    name="propertyTimezone"
                    defaultValue={defaultTimezone}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary"
                    placeholder="America/Santiago"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-card-foreground">Currency</span>
                  <input
                    type="text"
                    name="propertyCurrency"
                    defaultValue="USD"
                    maxLength={3}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 uppercase text-card-foreground outline-none transition focus:border-primary"
                    placeholder="CLP"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-95"
              >
                Create workspace and continue
              </button>
            </form>

            <aside className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">This creates</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>An organization record tied to your owner account</li>
                <li>A default owner membership with protected access</li>
                <li>The first site scaffold for multi-location expansion</li>
                <li>The base entity context for units, guests, folios, and tasks</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-5 text-sm text-muted-foreground">
                After setup, the next technical step is migrating the current rooms, reservations, and work queues into
                these tenant-aware tables so each site has isolated inventory and operations.
            </div>
          </aside>
        </section>
        )}
      </div>
    </main>
  );
}
