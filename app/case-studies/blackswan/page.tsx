import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Clock3, Gauge, ListTodo, ShieldCheck, Sparkles } from "lucide-react";

const OUTCOMES = [
  { label: "Operational layers", value: "4" },
  { label: "Control plane", value: "Unified" },
  { label: "Traceability", value: "Full" },
  { label: "Deployment shape", value: "Multi-site ready" },
];

const TIMELINE = [
  {
    time: "07:00",
    title: "Start with a clean brief",
    text: "The control tower opens with a single view of priorities, risk, and ownership.",
  },
  {
    time: "10:00",
    title: "Route the day by specialty",
    text: "Hospitality, admin, field work, and infrastructure each get their own lane.",
  },
  {
    time: "14:00",
    title: "Track action and follow-through",
    text: "Each assignment remains visible, traceable, and ready for review.",
  },
  {
    time: "19:00",
    title: "Close with confidence",
    text: "Leaders review what changed, what remains open, and what the next shift should inherit.",
  },
];

const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "Hospitality",
    text: "Guest service, concierge flows, and executive visibility in one shared workspace.",
  },
  {
    icon: Gauge,
    title: "Administration",
    text: "Budgets, staffing, and operational context kept together instead of scattered across tools.",
  },
  {
    icon: ListTodo,
    title: "Field operations",
    text: "Work queues, maintenance, and execution follow a clear ownership model.",
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
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Blackswan as the first production reference.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">
              A real deployment that proves Yagán can coordinate multiple operational layers without fragmenting the
              user experience.
            </p>
          </div>
          <Link href="/case-studies" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            Back to case studies
            <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>

        <div className="grid gap-6 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(330px,0.85fr)]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  First reference account
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/60">
                  Multi-vertical deployment
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
                Blackswan shows how Yagán operates in the wild: one workspace for hospitality, administration, field
                operations, and infrastructure. The result is less context switching, cleaner handoffs, and a system
                that leaders can actually trust.
              </p>
            </div>

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
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What changed</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold">One system now handles four operational layers.</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {OUTCOMES.map((outcome) => (
                  <div key={outcome.label} className="rounded-2xl border border-border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">{outcome.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{outcome.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card/80 p-6">
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Day in the operation</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold">A simple rhythm from briefing to close.</h2>
              <div className="mt-5 space-y-3">
                {TIMELINE.map((item) => (
                  <article key={item.time} className="flex items-start gap-4 rounded-2xl border border-border bg-background/70 p-4">
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                      {item.time}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-foreground/65">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-4 rounded-[28px] border border-border bg-card/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Why it matters</p>
            <h2 className="text-2xl font-semibold tracking-tight">A real deployment, not a concept deck.</h2>
            <p className="text-sm leading-6 text-foreground/65">
              Blackswan validates the product across multiple operational categories and gives the public site a clear
              credibility anchor.
            </p>

            <div className="rounded-3xl border border-border bg-background/80 p-4">
              <p className="text-sm font-semibold">Core takeaway</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                One control plane can coordinate service, assets, field work, and management without fragmenting the
                operator experience.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Confidence</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Production-ready</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Visibility</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Full traceability</p>
              </div>
            </div>

            <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Open internal demo
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="rounded-3xl border border-border bg-background/80 p-4">
              <p className="text-sm font-semibold">Public positioning</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                The public site stays generic. Blackswan is the proof point that shows the platform in a live
                environment.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
