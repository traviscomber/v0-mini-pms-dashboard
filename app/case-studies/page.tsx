import Link from "next/link";
import { ArrowRight, Building2, Handshake, Layers3 } from "lucide-react";

const CASE_STUDIES = [
  {
    slug: "blackswan",
    title: "Blackswan",
    subtitle: "First reference account",
    description: "A multi-vertical deployment spanning hospitality, admin, field operations, and infrastructure.",
  },
];

export default function CaseStudiesIndexPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Case studies</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Reference accounts that prove the platform.</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            Back home
          </Link>
        </div>

        <div className="grid gap-4 py-10 md:grid-cols-2">
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
              We can add future reference accounts as the product expands into more verticals and sites.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground/70">
              <Handshake className="h-4 w-4 text-primary" />
              Client references available on request
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
