"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, Clock3, Gauge, ListTodo, ShieldCheck, Sparkles } from "lucide-react";
import {
  CASE_STUDIES_COPY,
  type CaseStudyLang,
  readCaseStudyLanguage,
} from "../case-studies-copy";

export default function BlackswanCaseStudyPage() {
  const [lang, setLang] = useState<CaseStudyLang>('es');

  useEffect(() => {
    setLang(readCaseStudyLanguage());

    const syncLanguage = () => setLang(readCaseStudyLanguage());
    window.addEventListener('storage', syncLanguage);
    window.addEventListener('focus', syncLanguage);

    return () => {
      window.removeEventListener('storage', syncLanguage);
      window.removeEventListener('focus', syncLanguage);
    };
  }, []);

  const c = CASE_STUDIES_COPY[lang];

  const highlights = [
    {
      icon: Building2,
      title: c.blackswanHighlights[0].title,
      text: c.blackswanHighlights[0].text,
    },
    {
      icon: Gauge,
      title: c.blackswanHighlights[1].title,
      text: c.blackswanHighlights[1].text,
    },
    {
      icon: ListTodo,
      title: c.blackswanHighlights[2].title,
      text: c.blackswanHighlights[2].text,
    },
    {
      icon: ShieldCheck,
      title: c.blackswanHighlights[3].title,
      text: c.blackswanHighlights[3].text,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Case study</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{c.blackswanTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">{c.blackswanSubtitle}</p>
          </div>
          <Link href="/case-studies" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            {c.blackswanBack}
            <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>

        <div className="grid gap-6 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(330px,0.85fr)]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {c.blackswanTag}
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/60">
                  {c.blackswanMeta}
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
                {c.blackswanIntro}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => {
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.blackswanImpactTitle}</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{c.blackswanImpactSubtitle}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {c.blackswanOutcomes.map((outcome) => (
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.blackswanDayLabel}</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{c.blackswanDayTitle}</h2>
              <div className="mt-5 space-y-3">
                {c.blackswanTimeline.map((item) => (
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.blackswanWhyTitle}</p>
            <h2 className="text-2xl font-semibold tracking-tight">{c.blackswanWhyTitle}</h2>
            <p className="text-sm leading-6 text-foreground/65">{c.blackswanWhyBody}</p>

            <div className="rounded-3xl border border-border bg-background/80 p-4">
              <p className="text-sm font-semibold">{c.blackswanTakeawayTitle}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">{c.blackswanTakeawayBody}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{c.blackswanConfidence}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{c.blackswanConfidence}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{c.blackswanVisibility}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{c.blackswanVisibility}</p>
              </div>
            </div>

            <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              {c.blackswanDemo}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="rounded-3xl border border-border bg-background/80 p-4">
              <p className="text-sm font-semibold">{c.blackswanPublicTitle}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">{c.blackswanPublicBody}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
