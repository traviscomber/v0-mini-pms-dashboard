"use client";

import type { ReactNode } from "react";

import { ShieldCheck, Sparkles, Target, Workflow } from "lucide-react";

import { AGENT_SKILL_PROFILES } from "../agents/agent-profiles";

export default function AgentControlTower() {
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Agent Control Tower
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Specialists that can run the hotel for us</h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground/65">
            A serious multi-agent setup should not feel like a toy. Each agent needs a narrow mission, a clear model strategy,
            and a measurable outcome.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Metric label="Agents" value={AGENT_SKILL_PROFILES.length} />
          <Metric label="Planner" value="o3" />
          <Metric label="Executor" value="gpt-5.5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {AGENT_SKILL_PROFILES.map((agent) => (
          <article key={agent.id} className="rounded-2xl border border-border/70 bg-background/70 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{agent.focus.replace("-", " ")}</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{agent.name}</h3>
              </div>
              <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/70">
                {agent.recommendedModel}
              </div>
            </div>

            <p className="mt-3 text-sm text-foreground/75">{agent.mission}</p>
            <p className="mt-2 text-sm text-foreground/55">{agent.whyItMatters}</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Block title="Skills" items={agent.skills} icon={<Workflow className="h-4 w-4" />} />
              <Block title="Tools" items={agent.tools} icon={<Target className="h-4 w-4" />} />
              <Block title="Outputs" items={agent.outputs} icon={<Sparkles className="h-4 w-4" />} />
              <Block title="Guardrails" items={agent.guardrails} icon={<ShieldCheck className="h-4 w-4" />} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="text-lg font-semibold text-foreground">Build sequence</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          {[
            "1. Chief of Staff",
            "2. Revenue Strategist",
            "3. Operations Commander",
            "4. Guest Concierge",
            "5. Trust + Integrations",
          ].map((step) => (
            <div key={step} className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/75">
              {step}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-right">
      <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Block({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm text-foreground/65">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
