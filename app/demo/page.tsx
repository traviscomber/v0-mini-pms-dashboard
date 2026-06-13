import Link from "next/link";
import { ArrowRight, Building2, BriefcaseBusiness, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { requireAppViewer } from "@/lib/auth/session";

const DEMO_MODULES = [
  {
    icon: BriefcaseBusiness,
    title: "Admin General",
    text: "Budgets, personnel, and operating governance.",
  },
  {
    icon: Sparkles,
    title: "Hospitality",
    text: "Guest services, concierge, and communication workflows.",
  },
  {
    icon: Wrench,
    title: "Field operations",
    text: "Work queues, maintenance, and dispatch across sites.",
  },
  {
    icon: Building2,
    title: "Infrastructure",
    text: "Assets, inventory, properties, and operational readiness.",
  },
  {
    icon: ShieldCheck,
    title: "Trust layer",
    text: "Auditability, approvals, and safe execution boundaries.",
  },
];

export default async function DemoPage() {
  await requireAppViewer("/demo");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Internal demo</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Module-level demo for the operating team.</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            Back to public site
          </Link>
        </div>

        <div className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <section className="grid gap-4 md:grid-cols-2">
            {DEMO_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.title} className="rounded-3xl border border-border bg-card/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="text-base font-semibold">{module.title}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-foreground/65">{module.text}</p>
                </article>
              );
            })}
          </section>

          <aside className="space-y-4 rounded-[28px] border border-border bg-card/90 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">What this demo shows</p>
            <h2 className="text-2xl font-semibold tracking-tight">A focused view for internal sales and onboarding.</h2>
            <p className="text-sm leading-6 text-foreground/65">
              This page helps internal teams walk through the product by module, keeping the public site generic while
              still showing the depth of the platform.
            </p>

            <div className="rounded-3xl border border-border bg-background/80 p-4 text-sm text-foreground/65">
              <p className="font-semibold text-foreground">Suggested flow</p>
              <ol className="mt-3 space-y-2 leading-6">
                <li>1. Explain the operating context</li>
                <li>2. Show the four core modules</li>
                <li>3. Jump into the live shell if needed</li>
              </ol>
            </div>

            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Sign in to live workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
