import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, Sparkles, Users2 } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Audit trail",
    text: "Every recommendation, approval, and action is recorded with context.",
  },
  {
    icon: Users2,
    title: "Role-based access",
    text: "Teams see the tools and data they need, without exposing everything to everyone.",
  },
  {
    icon: Clock3,
    title: "Operational visibility",
    text: "The system shows what needs attention now, what can wait, and what is blocked.",
  },
  {
    icon: CheckCircle2,
    title: "Human approvals",
    text: "AI can suggest, but people stay in control of risky or customer-facing actions.",
  },
];

const TRUST_METRICS = [
  { label: "Traceable actions", value: "100%" },
  { label: "Review path", value: "Visible" },
  { label: "Approval gates", value: "Human-in-the-loop" },
  { label: "Security posture", value: "Enterprise-first" },
];

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Trust</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Confidence by design.</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            Back home
            <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <section className="space-y-6">
            <p className="max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
              The platform is built to support serious operations where approvals, accountability, and auditability
              matter as much as speed.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {TRUST_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.title} className="rounded-3xl border border-border bg-card/80 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h2 className="text-base font-semibold">{pillar.title}</h2>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-foreground/65">{pillar.text}</p>
                  </article>
                );
              })}
            </div>

            <section className="rounded-3xl border border-border bg-card/80 p-6">
              <h2 className="text-xl font-semibold">Core trust metrics</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {TRUST_METRICS.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-4 rounded-[28px] border border-border bg-card/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Why it matters</p>
            <h2 className="text-2xl font-semibold tracking-tight">Trust is a product feature.</h2>
            <p className="text-sm leading-6 text-foreground/65">
              AI is only useful when the organization knows what it can do, what it should not do, and how to review
              every meaningful change later.
            </p>

            <div className="rounded-3xl border border-border bg-background/80 p-4 text-sm leading-6 text-foreground/65">
              <p className="font-semibold text-foreground">Included controls</p>
              <ul className="mt-3 space-y-2">
                <li>• Approval gates for sensitive actions</li>
                <li>• Audit-ready logs and traceable recommendations</li>
                <li>• Visible role boundaries and safe defaults</li>
              </ul>
            </div>

            <Link href="/walkthrough" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Book a walkthrough
              <Sparkles className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
