import Link from "next/link";
import { ArrowRight, Building2, BriefcaseBusiness, Globe2, ShieldCheck, Sparkles } from "lucide-react";

const PRODUCT_PILLARS = [
  {
    icon: Building2,
    title: "Operations core",
    text: "One operating layer for hospitality, field services, assets, and maintenance.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Executive control",
    text: "Clear prioritization for leaders who need to move from signals to actions.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready",
    text: "Every recommendation can be reviewed, approved, and traced.",
  },
  {
    icon: Globe2,
    title: "Multi-vertical",
    text: "Built to adapt across hospitality, admin, infrastructure, and remote operations.",
  },
];

const PUBLIC_USE_CASES = [
  "Hospitality teams that need operational clarity.",
  "Property groups managing assets, people, and service delivery.",
  "Field operations that depend on coordination and traceability.",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Yagán</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Facility core system for modern operations.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/case-studies" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
              Case studies
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link href="/case-studies/blackswan" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
              Blackswan case study
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Internal demo
              <Sparkles className="h-4 w-4" />
            </Link>
            <Link href="/walkthrough" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
              Book a walkthrough
            </Link>
            <Link href="/trust" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
              Trust
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
              Sign in
            </Link>
          </div>
        </header>

        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Built for operators who need a clear system
            </div>
            <div className="space-y-4">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                Bring reservations, assets, tasks, and service delivery into one control plane.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
                Yagán helps teams make better decisions faster with a structured operating layer for hospitality,
                infrastructure, and field operations.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {PRODUCT_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.title} className="rounded-3xl border border-border bg-card/80 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-semibold">{pillar.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-foreground/65">{pillar.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[28px] border border-border bg-card/90 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Public site</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">A clean brand story for the market.</h3>
            <p className="mt-3 text-sm leading-6 text-foreground/65">
              Public pages stay generic and reusable. Customer-specific proof points live in case studies and internal demos.
            </p>

            <div className="mt-6 space-y-3 rounded-3xl border border-border bg-background/80 p-4">
              <p className="text-sm font-semibold text-foreground">Best fit</p>
              <ul className="space-y-2 text-sm leading-6 text-foreground/65">
                {PUBLIC_USE_CASES.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/case-studies" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
                Browse case studies
              </Link>
              <Link href="/case-studies/blackswan" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
                View Blackswan case study
              </Link>
              <Link href="/walkthrough" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
                Book a walkthrough
              </Link>
              <Link href="/trust" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
                Trust
              </Link>
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                Open internal demo
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
