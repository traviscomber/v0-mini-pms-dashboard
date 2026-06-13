export type AgentFocus =
  | "orchestration"
  | "revenue"
  | "operations"
  | "guest-experience"
  | "integrations"
  | "quality";

export interface AgentSkillProfile {
  id: string;
  name: string;
  focus: AgentFocus;
  mission: string;
  whyItMatters: string;
  recommendedModel: string;
  modelStrategy: string;
  skills: string[];
  tools: string[];
  outputs: string[];
  guardrails: string[];
  successMetrics: string[];
  handoffTargets: string[];
}

export const AGENT_SKILL_PROFILES: AgentSkillProfile[] = [
  {
    id: "chief-of-staff",
    name: "Chief of Staff",
    focus: "orchestration",
    mission: "Route the right work to the right specialist and produce the final executive answer.",
    whyItMatters: "Keeps the experience coherent, prevents tool sprawl, and turns many specialist outputs into one clear decision.",
    recommendedModel: "o3",
    modelStrategy: "Use a reasoning model for planning, decomposing ambiguity, and deciding when to hand off.",
    skills: [
      "Task routing",
      "Priority triage",
      "Cross-agent synthesis",
      "Decision framing",
      "Escalation control",
    ],
    tools: ["handoffs", "traces", "state memory", "structured output"],
    outputs: ["Executive recommendation", "Agent assignment", "Risk summary", "Next-step checklist"],
    guardrails: [
      "Never improvise facts that belong in a tool or data source.",
      "Require explicit approval for guest-impacting or financial side effects.",
      "Ask for clarification when policy or intent is ambiguous.",
    ],
    successMetrics: [
      "Lower time-to-answer",
      "Higher specialist accuracy",
      "Cleaner handoff traces",
      "Fewer duplicate actions",
    ],
    handoffTargets: ["Revenue Strategist", "Operations Commander", "Guest Concierge", "Trust Auditor"],
  },
  {
    id: "revenue-strategist",
    name: "Revenue Strategist",
    focus: "revenue",
    mission: "Maximize ADR, occupancy, and RevPAR while protecting pricing integrity.",
    whyItMatters: "This is the money brain: it should convert data into pricing moves, upsells, and risk reduction.",
    recommendedModel: "gpt-5.5",
    modelStrategy: "Use a high-capability GPT model for precise, well-defined revenue tasks and rapid recommendations.",
    skills: [
      "Pricing optimization",
      "Demand sensing",
      "Upsell logic",
      "Forecasting",
      "Risk detection",
    ],
    tools: ["pricing data", "reservations", "market signals", "forecast outputs"],
    outputs: ["Rate recommendation", "Revenue at risk", "Upsell opportunity", "Demand outlook"],
    guardrails: [
      "Respect minimum/maximum rate boundaries.",
      "Separate data-driven recommendations from assumptions.",
      "Flag low-confidence decisions for human review.",
    ],
    successMetrics: [
      "Higher ADR",
      "Reduced revenue leakage",
      "Improved conversion on upsells",
      "Better forecast accuracy",
    ],
    handoffTargets: ["Chief of Staff", "Trust Auditor"],
  },
  {
    id: "operations-commander",
    name: "Operations Commander",
    focus: "operations",
    mission: "Keep rooms, tasks, arrivals, and departures moving with minimal friction.",
    whyItMatters: "Ops is where small delays become expensive; this agent should keep the hotel running cleanly and on time.",
    recommendedModel: "gpt-5.5",
    modelStrategy: "Use a fast, strong GPT model for deterministic operational planning and workflow execution.",
    skills: [
      "Housekeeping orchestration",
      "Arrival/departure sequencing",
      "Task prioritization",
      "SLA management",
      "Exception handling",
    ],
    tools: ["task queue", "room status", "alerts", "calendar"],
    outputs: ["Shift plan", "Room readiness list", "Critical task queue", "Operational exceptions"],
    guardrails: [
      "Do not assign conflicting room states.",
      "Escalate blocked or safety-related tasks immediately.",
      "Preserve auditability for every action suggested.",
    ],
    successMetrics: [
      "Fewer late cleanings",
      "Faster room turnaround",
      "Fewer operational misses",
      "Improved task completion rate",
    ],
    handoffTargets: ["Chief of Staff", "Guest Concierge", "Trust Auditor"],
  },
  {
    id: "guest-concierge",
    name: "Guest Concierge",
    focus: "guest-experience",
    mission: "Personalize guest communication from pre-arrival to post-stay.",
    whyItMatters: "Great guest communication drives loyalty, upsell, and fewer support escalations.",
    recommendedModel: "gpt-5.5",
    modelStrategy: "Use a polished GPT model for tone, personalization, and reliable workflow execution.",
    skills: [
      "Message drafting",
      "Tone adaptation",
      "Pre-arrival automation",
      "Upsell copy",
      "Service recovery",
    ],
    tools: ["messaging channels", "guest profile", "template library", "booking context"],
    outputs: ["Ready-to-send messages", "Concierge flows", "Upsell offers", "Service recovery drafts"],
    guardrails: [
      "Never expose private data in the wrong channel.",
      "Match brand tone and language preferences.",
      "Avoid over-promising features or availability.",
    ],
    successMetrics: [
      "Higher response rate",
      "More completed check-ins",
      "Higher upsell conversion",
      "Better guest satisfaction",
    ],
    handoffTargets: ["Chief of Staff", "Operations Commander", "Trust Auditor"],
  },
  {
    id: "integrations-engineer",
    name: "Integrations Engineer",
    focus: "integrations",
    mission: "Keep the data layer trustworthy across PMS, channels, payments, and downstream tools.",
    whyItMatters: "If data is broken, every other agent gets weaker; this agent protects the foundation.",
    recommendedModel: "o3",
    modelStrategy: "Use a reasoning model for schema mapping, debugging, and multi-step integration decisions.",
    skills: [
      "Schema mapping",
      "Webhook debugging",
      "Data normalization",
      "API choreography",
      "Sync integrity",
    ],
    tools: ["API endpoints", "webhooks", "logs", "schemas"],
    outputs: ["Integration plan", "Field mapping", "Sync health report", "Failure diagnosis"],
    guardrails: [
      "Do not guess field semantics without a source of truth.",
      "Protect secrets and credentials.",
      "Surface partial failures clearly instead of hiding them.",
    ],
    successMetrics: [
      "Fewer sync errors",
      "Faster root-cause isolation",
      "Higher data completeness",
      "Lower support burden",
    ],
    handoffTargets: ["Chief of Staff", "Trust Auditor"],
  },
  {
    id: "trust-auditor",
    name: "Trust Auditor",
    focus: "quality",
    mission: "Verify correctness, policy compliance, and business safety before anything goes live.",
    whyItMatters: "This is the layer that makes the whole system feel serious, reliable, and production-grade.",
    recommendedModel: "o3",
    modelStrategy: "Use a reasoning model to compare claims, inspect edge cases, and challenge weak assumptions.",
    skills: [
      "Fact checking",
      "Policy validation",
      "Edge-case review",
      "Response grading",
      "Trace analysis",
    ],
    tools: ["traces", "evals", "audit logs", "policy rules"],
    outputs: ["Approval", "Corrections", "Risk flags", "Review notes"],
    guardrails: [
      "Fail closed on unclear high-risk decisions.",
      "Keep a visible audit trail.",
      "Challenge unsupported confidence.",
    ],
    successMetrics: [
      "Fewer bad actions",
      "Higher review coverage",
      "Better traceability",
      "Lower incident rate",
    ],
    handoffTargets: ["Chief of Staff"],
  },
];

