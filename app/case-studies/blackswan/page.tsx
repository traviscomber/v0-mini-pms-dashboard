import Link from "next/link";
import { ArrowRight, Building2, Gauge, ListTodo, ShieldCheck } from "lucide-react";

const OUTCOMES = [
  { label: "Operational layers", value: "4" },
  { label: "Single control plane", value: "Yes" },
  { label: "Traceable actions", value: "100%" },
  { label: "Readiness for scale", value: "Multi-site" },
];

const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "Admin General",
    text: "Budgets, people, energy, and governance in one place.",
  },
  {
    icon: Gauge,
    title: "Hospitality",
    text: "Guest service and concierge flows with context and clear ownership.",
  },
  {
    icon: ListTodo,
    title: "Field operations",
    text: "Tasks, maintenance, and work queues that keep the day moving.",
  },
  {
    icon: ShieldCheck,
    title: "Infrastructure",
    text: "Assets, inventory, and site control with audit-ready traceability.",
  },
];

export default function BlackswanCaseStudyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Case study</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Blackswan as the first reference account.</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            Back to public site
            <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <section className="space-y-6">
            <p className="max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
              Blackswan shows how the platform works in a real multi-vertical environment: hospitality, admin,
              field operations, and infrastructure sharing one control system.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-3xl border border-border bg-card/80 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h2 className="text-base font-semibold">{item.title}</h2>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-foreground/65">{item.text}</p>
                  </article>
                );
              })}
            </div>

            <section className="rounded-3xl border border-border bg-card/80 p-6">
              <h2 className="text-xl font-semibold">What the client gets</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {OUTCOMES.map((outcome) => (
                  <div key={outcome.label} className="rounded-2xl border border-border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">{outcome.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{outcome.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-4 rounded-[28px] border border-border bg-card/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Why it matters</p>
            <h2 className="text-2xl font-semibold tracking-tight">A real deployment, not a concept deck.</h2>
            <p className="text-sm leading-6 text-foreground/65">
              Blackswan is the reference point that validates the platform across multiple operational categories.
              The public brand stays generic, while the case study proves the system in the wild.
            </p>

            <div className="rounded-3xl border border-border bg-background/80 p-4">
              <p className="text-sm font-semibold">Core takeaway</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                One system can coordinate service, assets, field work, and management without fragmenting the user experience.
              </p>
            </div>

            <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Open internal demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
