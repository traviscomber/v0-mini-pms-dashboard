import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Handshake, Layers3, Sparkles } from "lucide-react";

const CASE_STUDIES = [
  {
    slug: "blackswan",
    title: "Blackswan",
    subtitle: "First reference account",
    description:
      "A production deployment spanning hospitality, administration, field operations, and infrastructure under one operating model.",
    highlights: ["Multi-vertical", "Real workflow", "Traceable actions"],
  },
];

export default function CaseStudiesIndexPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Case studies</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Reference accounts that prove the platform in the real world.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">
              We keep the public brand clean and generic, while each case study shows how Yagán handles live operations,
              coordination, and accountability in actual deployments.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            Back home
          </Link>
        </div>

        <div className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <article key={study.slug} className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{study.subtitle}</p>
                  <h2 className="text-xl font-semibold">{study.title}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/65">{study.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {study.highlights.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-foreground/60">
                    <BadgeCheck className="h-3 w-3 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                  Open case study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
          <article className="rounded-3xl border border-dashed border-border bg-card/40 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-primary">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">More coming</p>
                <h2 className="text-xl font-semibold">Additional deployments</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-foreground/65">
              As Yagán expands, we can add more reference accounts, operating models, and implementation stories.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground/70">
              <Handshake className="h-4 w-4 text-primary" />
              Client references available on request
            </div>
          </article>
          <article className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-background p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why it matters</p>
            <h2 className="mt-3 text-xl font-semibold">Proof over promises.</h2>
            <p className="mt-4 text-sm leading-6 text-foreground/65">
              Each reference is designed to show real operational depth: a working stack, visible accountability, and a
              clear path from signal to action.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground/70">
              <Sparkles className="h-4 w-4 text-primary" />
              Built for operators who need confidence before rollout.
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
