"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, Handshake, Layers3, Sparkles } from "lucide-react";
import {
  CASE_STUDIES_COPY,
  type CaseStudyLang,
  readCaseStudyLanguage,
} from "./case-studies-copy";

const CASE_STUDIES = [
  {
    slug: "blackswan",
    title: "Blackswan",
    ...CASE_STUDIES_COPY.es,
  },
];

export default function CaseStudiesIndexPage() {
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Case studies</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{c.indexTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">{c.indexSubtitle}</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5">
            {c.indexBack}
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
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.indexCardSubtitle}</p>
                  <h2 className="text-xl font-semibold">{study.title}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/65">{c.indexCardDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {c.indexCardHighlights.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-foreground/60">
                    <BadgeCheck className="h-3 w-3 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                  {lang === 'es' ? 'Abrir caso' : 'Open case study'}
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.indexMoreTitle}</p>
                <h2 className="text-xl font-semibold">{c.indexMoreTitle}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-foreground/65">{c.indexMoreDescription}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground/70">
              <Handshake className="h-4 w-4 text-primary" />
              {c.indexMoreNote}
            </div>
          </article>
          <article className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-background p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.indexProofTitle}</p>
            <h2 className="mt-3 text-xl font-semibold">{c.indexProofTitle}</h2>
            <p className="mt-4 text-sm leading-6 text-foreground/65">{c.indexProofBody}</p>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground/70">
              <Sparkles className="h-4 w-4 text-primary" />
              {c.indexProofBadge}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
