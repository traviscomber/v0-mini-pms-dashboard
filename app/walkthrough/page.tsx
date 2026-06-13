import Link from "next/link";
import { ArrowRight, CalendarDays, PlayCircle, Sparkles, type LucideIcon } from "lucide-react";

export default function WalkthroughPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="rounded-[32px] border border-border bg-card/90 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Book a walkthrough</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">See the product in a guided flow.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70">
            This page gives prospects a clean path to understand the platform, the reference case study, and the live demo
            without exposing the internal workspace.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              icon={CalendarDays}
              title="Book time"
              text="Schedule a walkthrough with the team."
            />
            <StepCard
              icon={Sparkles}
              title="Review the story"
              text="Start from the public site and case study."
            />
            <StepCard
              icon={PlayCircle}
              title="Show the demo"
              text="Move into the internal demo with session access."
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/case-studies" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
              View case studies
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Open internal demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-border bg-background/80 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-foreground/65">{text}</p>
    </article>
  );
}
