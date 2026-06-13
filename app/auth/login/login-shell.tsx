"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight, BarChart3, Brain, CalendarDays, CheckCircle2,
  Globe, Lock, Shield, Sparkles, TrendingUp, Wand2, Zap,
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPES & TRANSLATIONS
───────────────────────────────────────── */
type Lang = "es" | "en";

const copy = {
  es: {
    tagline: "PMS agentivo para hoteleros exigentes",
    nav: {
      platform: "Plataforma",
      agents: "Agentes",
      security: "Seguridad",
      signin: "Iniciar sesion",
    },
    badge: "Operaciones hoteleras de siguiente nivel",
    headline: "Una torre de control\npara tu hotel.",
    subheadline:
      "N3uralia une reservas, ingresos, operaciones y comunicacion con huespedes en un solo espacio ejecutivo. Menos ruido, mas accion.",
    cta: "Solicitar acceso",
    stats: [
      { label: "Ocupacion promedio", value: "94%", delta: "+12%" },
      { label: "Tarifa diaria", value: "$287", delta: "+8%" },
      { label: "Ingresos / mes", value: "$41k", delta: "+23%" },
      { label: "Tareas completadas", value: "98%", delta: "+4%" },
    ],
    featuresLabel: "La plataforma",
    features: [
      {
        title: "Inteligencia ejecutiva",
        description:
          "Un resumen claro de riesgos, flujo de caja, estado operacional y la siguiente mejor accion del dia.",
        icon: "brain",
      },
      {
        title: "Automatizacion agentiva",
        description:
          "Agentes especializados gestionan ingresos, operaciones, mensajeria con huespedes y auditorias.",
        icon: "wand",
      },
      {
        title: "Control operacional",
        description:
          "Llegadas, salidas, housekeeping y mantenimiento siempre sincronizados en tiempo real.",
        icon: "calendar",
      },
      {
        title: "Aumento de ingresos",
        description:
          "Senales de precio, proyecciones de demanda y oportunidades de upsell siempre visibles.",
        icon: "chart",
      },
    ],
    agentLabel: "Stack de agentes",
    agentTitle: "Agentes especializados.\nResponsabilidad clara.",
    agentDesc:
      "Un orquestador mas especialistas en ingresos, operaciones, experiencia del huesped, integraciones y confianza.",
    agents: [
      "Chief of Staff",
      "Revenue Strategist",
      "Operations Commander",
      "Guest Concierge",
      "Integrations Engineer",
      "Trust Auditor",
    ],
    why: [
      { title: "Menos errores", text: "Reduce limpiezas tardias, handoffs perdidos y fugas de ingreso.", icon: "check" },
      { title: "Decisiones rapidas", text: "Convierte la actividad del PMS en un plan priorizado al instante.", icon: "zap" },
      { title: "Listo para auditoria", text: "Cada recomendacion es trazable, revisable y aprobable.", icon: "lock" },
    ],
    secLabel: "Seguridad",
    secTitle: "Construido para operar con confianza.",
    secTiles: [
      { title: "Acceso controlado", text: "Workspace protegido con datos delimitados por propiedad." },
      { title: "Aprobaciones humanas", text: "Las acciones de alto impacto requieren confirmacion explicita." },
      { title: "Trazabilidad completa", text: "Un camino visible desde la senal hasta la accion y el resultado." },
    ],
    auth: {
      label: "Acceso al workspace",
      title: "Inicia sesion y ponte a trabajar.",
      subtitle: "Tu resumen ejecutivo y el equipo de agentes, disponibles de inmediato.",
      tabSignin: "Iniciar sesion",
      tabSignup: "Crear cuenta",
      emailLabel: "Correo electronico",
      emailPlaceholder: "tu@empresa.com",
      passwordLabel: "Contrasena",
      passwordPlaceholder: "••••••••",
      passwordHint: "Minimo 8 caracteres",
      nameLabel: "Nombre completo",
      namePlaceholder: "Tu nombre",
      signinBtn: "Ingresar al workspace",
      signupBtn: "Crear cuenta",
      afterTitle: "Al ingresar tendras acceso a:",
      afterItems: [
        "Resumen ejecutivo con riesgos, flujo de caja y estado general",
        "Vista de operaciones: llegadas, salidas y housekeeping",
        "Torre de agentes para ingresos, ops y confianza",
      ],
      legal: "Al continuar aceptas nuestros Terminos y Politica de Privacidad.",
      supabaseWarning:
        "Supabase no esta configurado. Agrega las variables de entorno para habilitar la autenticacion.",
    },
    footer: "© 2026 N3uralia — Plataforma de hospitalidad agentiva",
  },
  en: {
    tagline: "Agentic PMS for serious hoteliers",
    nav: {
      platform: "Platform",
      agents: "Agents",
      security: "Security",
      signin: "Sign in",
    },
    badge: "Next-generation hotel operations",
    headline: "One control tower\nfor your hotel.",
    subheadline:
      "N3uralia brings reservations, revenue, operations, and guest communication into one executive workspace. Less noise, more action.",
    cta: "Request access",
    stats: [
      { label: "Average occupancy", value: "94%", delta: "+12%" },
      { label: "Daily rate", value: "$287", delta: "+8%" },
      { label: "Revenue / month", value: "$41k", delta: "+23%" },
      { label: "Tasks completed", value: "98%", delta: "+4%" },
    ],
    featuresLabel: "The platform",
    features: [
      {
        title: "Executive intelligence",
        description:
          "A clear briefing on risk, cash flow, operational status, and the next best action of the day.",
        icon: "brain",
      },
      {
        title: "Agentic automation",
        description:
          "Specialist agents handle revenue, operations, guest messaging, and trust audits.",
        icon: "wand",
      },
      {
        title: "Operational control",
        description:
          "Arrivals, departures, housekeeping, and maintenance always in sync in real time.",
        icon: "calendar",
      },
      {
        title: "Revenue lift",
        description:
          "Pricing signals, demand forecasts, and upsell opportunities always visible.",
        icon: "chart",
      },
    ],
    agentLabel: "Agent stack",
    agentTitle: "Specialist agents.\nClear ownership.",
    agentDesc:
      "One orchestrator plus specialists for revenue, operations, guest experience, integrations, and trust.",
    agents: [
      "Chief of Staff",
      "Revenue Strategist",
      "Operations Commander",
      "Guest Concierge",
      "Integrations Engineer",
      "Trust Auditor",
    ],
    why: [
      { title: "Fewer mistakes", text: "Reduce late cleans, missed handoffs, and hidden revenue leaks.", icon: "check" },
      { title: "Faster decisions", text: "Turns PMS activity into a prioritised action plan instantly.", icon: "zap" },
      { title: "Audit-ready", text: "Every recommendation is traceable, reviewable, and approvable.", icon: "lock" },
    ],
    secLabel: "Security",
    secTitle: "Built to operate with confidence.",
    secTiles: [
      { title: "Controlled access", text: "Protected workspace with property-scoped data." },
      { title: "Human approvals", text: "High-impact actions require explicit confirmation." },
      { title: "Full traceability", text: "A visible path from signal to action to outcome." },
    ],
    auth: {
      label: "Workspace access",
      title: "Sign in and go straight to work.",
      subtitle: "Your executive briefing and agent stack, available immediately.",
      tabSignin: "Sign in",
      tabSignup: "Create account",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      passwordHint: "Minimum 8 characters",
      nameLabel: "Full name",
      namePlaceholder: "Your name",
      signinBtn: "Sign in to workspace",
      signupBtn: "Create account",
      afterTitle: "After signing in you will have access to:",
      afterItems: [
        "Executive briefing with risk, cash flow, and readiness",
        "Operations view: arrivals, departures, and housekeeping",
        "Agent tower for revenue, ops, and trust",
      ],
      legal: "By continuing you agree to our Terms and Privacy Policy.",
      supabaseWarning:
        "Supabase is not configured. Add environment variables to enable authentication.",
    },
    footer: "© 2026 N3uralia — Agentic hospitality platform",
  },
} satisfies Record<Lang, unknown>;

/* ─────────────────────────────────────────
   PROPS
───────────────────────────────────────── */
interface LoginShellProps {
  next: string;
  message?: string;
  supabaseReady: boolean;
  signInAction: (formData: FormData) => Promise<void>;
  signUpAction: (formData: FormData) => Promise<void>;
}

/* ─────────────────────────────────────────
   ICON MAP
───────────────────────────────────────── */
const ICON_MAP: Record<string, ReactNode> = {
  brain: <Brain className="h-4 w-4" />,
  wand: <Wand2 className="h-4 w-4" />,
  calendar: <CalendarDays className="h-4 w-4" />,
  chart: <BarChart3 className="h-4 w-4" />,
  check: <CheckCircle2 className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  lock: <Lock className="h-4 w-4" />,
};

/* ─────────────────────────────────────────
   HERO PANEL — Animated right column
───────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, delay = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

const AGENT_TASKS_ES = [
  { agent: "Revenue Strategist",   task: "Ajuste de tarifa +12% viernes",           icon: "trend", done: true  },
  { agent: "Operations Commander", task: "3 cuartos pendientes de limpieza",         icon: "zap",   done: false },
  { agent: "Chief of Staff",       task: "Briefing ejecutivo listo para revision",   icon: "check", done: true  },
  { agent: "Guest Concierge",      task: "Bienvenida enviada a 4 llegadas hoy",      icon: "check", done: true  },
  { agent: "Revenue Strategist",   task: "Ocupacion proyectada 96% fin de semana",   icon: "trend", done: true  },
];
const AGENT_TASKS_EN = [
  { agent: "Revenue Strategist",   task: "Rate adjustment +12% Friday",              icon: "trend", done: true  },
  { agent: "Operations Commander", task: "3 rooms pending cleaning",                 icon: "zap",   done: false },
  { agent: "Chief of Staff",       task: "Executive briefing ready for review",      icon: "check", done: true  },
  { agent: "Guest Concierge",      task: "Welcome sent to 4 arrivals today",         icon: "check", done: true  },
  { agent: "Revenue Strategist",   task: "Occupancy projected 96% weekend",          icon: "trend", done: true  },
];

function HeroPanel({ lang }: { lang: Lang }) {
  const arrivals   = useCountUp(12, 1200, 800);
  const departures = useCountUp(8,  1000, 950);
  const hk         = useCountUp(94, 1400, 700);

  const tasks = lang === "es" ? AGENT_TASKS_ES : AGENT_TASKS_EN;
  const [visibleCount, setVisibleCount] = useState(2);
  const [cursor, setCursor] = useState(true);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setPing(p => !p), 2200);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    setVisibleCount(2);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    tasks.forEach((_, i) => {
      if (i >= 2) timeouts.push(setTimeout(() => setVisibleCount(i + 1), 1800 + i * 1600));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [lang]);

  const ml = lang === "es"
    ? { arrivals: "Llegadas", departures: "Salidas", hk: "Housekeeping", occ: "Ocupacion", live: "en vivo", status: "Estado operacional", agent: "Agente activo", done: "listo" }
    : { arrivals: "Arrivals", departures: "Departures", hk: "Housekeeping", occ: "Occupancy", live: "live", status: "Operational status", agent: "Active agent", done: "done" };

  return (
    <>
      {/* Status card */}
      <div className="absolute left-6 right-6 top-6"
        style={{ animation: "lp-rise 0.9s cubic-bezier(.16,1,.3,1) 0.4s both" }}>
        <div className="rounded-2xl border border-border/50 bg-card/85 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{ml.status}</p>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${ping ? "animate-ping" : ""}`} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-primary/70">{ml.live}</span>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: ml.arrivals,   value: arrivals,   suffix: ""  },
              { label: ml.departures, value: departures, suffix: ""  },
              { label: ml.hk,         value: hk,         suffix: "%" },
            ].map((item) => (
              <div key={item.label}
                className="rounded-xl border border-border/40 bg-background/60 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5">
                <p className="text-[10px] text-foreground/45">{item.label}</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
                  {item.value}{item.suffix}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[9px] text-foreground/40">{ml.occ}</p>
              <p className="text-[9px] font-semibold text-primary">{hk}%</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
              <div className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${hk}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Agent card */}
      <div className="absolute bottom-6 left-6 right-6"
        style={{ animation: "lp-rise 0.9s cubic-bezier(.16,1,.3,1) 0.6s both" }}>
        <div className="rounded-2xl border border-border/50 bg-card/85 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{ml.agent}</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
              {visibleCount}/{tasks.length}
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {tasks.slice(0, visibleCount).map((row, i) => (
              <div key={i} className="flex items-start gap-2.5"
                style={{ animation: i >= 2 ? "lp-rise 0.45s ease both" : "none" }}>
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  row.icon === "trend" ? "border-primary/30 bg-primary/15"
                  : row.icon === "zap" ? "border-secondary/30 bg-secondary/15"
                  : "border-accent/30 bg-accent/15"
                }`}>
                  {row.icon === "trend" && <TrendingUp   className="h-2.5 w-2.5 text-primary"  />}
                  {row.icon === "zap"   && <Zap          className="h-2.5 w-2.5 text-secondary" />}
                  {row.icon === "check" && <CheckCircle2 className="h-2.5 w-2.5 text-accent"    />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-foreground/45">{row.agent}</p>
                  <p className="text-xs text-foreground/80">
                    {row.task}
                    {i === visibleCount - 1 && visibleCount < tasks.length && (
                      <span className={`ml-px inline-block h-3 w-0.5 align-middle bg-primary transition-opacity duration-100 ${cursor ? "opacity-100" : "opacity-0"}`} />
                    )}
                  </p>
                </div>
                {row.done && (
                  <span className="ml-auto shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-medium text-accent">
                    {ml.done}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export function LoginShell({
  next,
  message,
  supabaseReady,
  signInAction,
  signUpAction,
}: LoginShellProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [lang, setLang] = useState<Lang>("es");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const c = copy[lang];

  /* Language persistence */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("n3-landing-lang") as Lang | null;
      if (saved === "es" || saved === "en") setLang(saved);
    } catch { /* noop */ }
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "es" ? "en" : "es";
    setLang(next);
    try { localStorage.setItem("n3-landing-lang", next); } catch { /* noop */ }
  };

  /* Canvas — royal magenta particle web */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let af = 0;
    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      radius: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.0012,
      vy: (Math.random() - 0.5) * 0.0012,
      alpha: Math.random() * 0.3 + 0.08,
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      dots.forEach((dot, i) => {
        dot.x += dot.vx; dot.y += dot.vy;
        if (dot.x < 0) dot.x = 1;
        if (dot.x > 1) dot.x = 0;
        if (dot.y < 0) dot.y = 1;
        if (dot.y > 1) dot.y = 0;
        for (let j = i + 1; j < dots.length; j++) {
          const o = dots[j];
          const dx = (dot.x - o.x) * w, dy = (dot.y - o.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const opacity = 0.08 * (1 - dist / 160);
            ctx.beginPath();
            ctx.moveTo(dot.x * w, dot.y * h);
            ctx.lineTo(o.x * w, o.y * h);
            ctx.strokeStyle = `oklch(0.60 0.28 320 / ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(dot.x * w, dot.y * h, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.60 0.28 320 / ${dot.alpha})`;
        ctx.fill();
      });
      af = window.requestAnimationFrame(draw);
    };

    resize(); draw();
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(af);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div suppressHydrationWarning className="relative min-h-[100svh] overflow-x-hidden bg-background text-foreground">

      {/* ── HEADER ─────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        style={{ animation: "lp-drop 0.5s ease both" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-[10px] font-black tracking-tight text-primary-foreground">N3</span>
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.08em] text-foreground group-hover:text-primary transition-colors">N3URALIA</p>
            </div>
          </a>

          {/* Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { href: "#plataforma", label: c.nav.platform },
              { href: "#agentes", label: c.nav.agents },
              { href: "#seguridad", label: c.nav.security },
            ].map(({ href, label }) => (
              <a key={href} href={href}
                className="rounded-lg px-3.5 py-2 text-sm text-foreground/60 transition-colors hover:bg-card hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} suppressHydrationWarning
              aria-label="Toggle language"
              className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-primary/30 hover:text-primary">
              <Globe className="h-3 w-3" />
              {lang === "es" ? "EN" : "ES"}
            </button>
            <a href="#auth-card"
              className="hidden rounded-lg border border-border/60 bg-card/60 px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary sm:block">
              {c.nav.signin}
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────── */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">

        {/* Left — text */}
        <div className="space-y-8">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-medium tracking-wide text-primary"
            style={{ animation: "lp-rise 0.7s ease both" }}
          >
            <Sparkles className="h-3 w-3" />
            {c.badge}
          </div>

          <h1
            className="text-5xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-6xl xl:text-7xl"
            style={{ animation: "lp-rise 0.75s ease 0.06s both", whiteSpace: "pre-line" }}
          >
            {c.headline}
          </h1>

          <p
            className="max-w-xl text-lg leading-relaxed text-foreground/60"
            style={{ animation: "lp-rise 0.8s ease 0.12s both" }}
          >
            {c.subheadline}
          </p>

          <div
            className="flex flex-wrap items-center gap-3"
            style={{ animation: "lp-rise 0.85s ease 0.18s both" }}
          >
            <a href="#auth-card"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]">
              {c.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#plataforma"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border/60 px-5 text-sm font-medium text-foreground/65 transition hover:border-primary/30 hover:text-foreground">
              {c.nav.platform}
            </a>
          </div>

          {/* Stats strip */}
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ animation: "lp-rise 0.9s ease 0.24s both" }}
          >
            {c.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3.5 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">{stat.label}</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-xl font-semibold tracking-tight text-foreground">{stat.value}</span>
                  <span className="mb-0.5 rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-semibold text-primary">{stat.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — animated canvas panel */}
        <div
          className="relative hidden h-[520px] overflow-hidden rounded-3xl border border-border/50 lg:block"
          style={{ animation: "lp-card 1s ease 0.1s both" }}
        >
          {/* Canvas particle web */}
          <canvas ref={canvasRef} aria-hidden="true" suppressHydrationWarning
            className="absolute inset-0 h-full w-full" />

          {/* Floating glow orbs */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, oklch(0.60 0.28 320 / 0.22) 0%, transparent 65%)",
              animation: "lp-float 12s ease-in-out infinite",
            }} />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, oklch(0.55 0.25 300 / 0.18) 0%, transparent 65%)",
              animation: "lp-float 16s ease-in-out 2s infinite",
            }} />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background: "radial-gradient(circle, oklch(0.50 0.26 340 / 0.12) 0%, transparent 65%)",
              animation: "lp-float 20s ease-in-out 4s infinite",
            }} />

          {/* Floating UI mockup cards */}
          <div className="absolute left-6 top-6 right-6" style={{ animation: "lp-rise 1s ease 0.4s both" }}>
            <div className="rounded-2xl border border-border/50 bg-card/80 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {lang === "es" ? "Estado operacional" : "Operational status"}
                </p>
                <div className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: lang === "es" ? "Llegadas" : "Arrivals", value: "12" },
                  { label: lang === "es" ? "Salidas" : "Departures", value: "8" },
                  { label: "Housekeeping", value: "94%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/40 bg-background/60 px-3 py-2.5">
                    <p className="text-[10px] text-foreground/45">{item.label}</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6" style={{ animation: "lp-rise 1s ease 0.55s both" }}>
            <div className="rounded-2xl border border-border/50 bg-card/80 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {lang === "es" ? "Agente activo" : "Active agent"}
              </p>
              <div className="mt-3 space-y-2">
                {[
                  { agent: "Revenue Strategist", action: lang === "es" ? "Ajuste de tarifa +12% viernes" : "Rate adjustment +12% Friday", done: true },
                  { agent: "Operations Commander", action: lang === "es" ? "3 cuartos pendientes de limpieza" : "3 rooms pending cleaning", done: false },
                ].map((row) => (
                  <div key={row.agent} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${row.done ? "bg-primary/20" : "bg-secondary/20"}`}>
                      {row.done
                        ? <TrendingUp className="h-2.5 w-2.5 text-primary" />
                        : <Zap className="h-2.5 w-2.5 text-secondary" />
                      }
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-foreground/50">{row.agent}</p>
                      <p className="text-xs text-foreground/75">{row.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subtle grid overlay */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(oklch(0.98 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.98 0 0) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }} />
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── FEATURES ───────────��───────────── */}
      <section id="plataforma" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.featuresLabel}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {lang === "es" ? "Todo lo que necesita tu hotel." : "Everything your hotel needs."}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.features.map((feat, i) => (
            <FeatureCard key={feat.title} icon={ICON_MAP[feat.icon]} title={feat.title} description={feat.description} index={i} />
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── AGENTS + AUTH (side by side on desktop) ── */}
      <section id="agentes" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_400px] lg:items-start lg:px-10">

        {/* Agents */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.agentLabel}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ whiteSpace: "pre-line" }}>
              {c.agentTitle}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/60">{c.agentDesc}</p>
          </div>

          {/* Agent pills */}
          <div className="flex flex-wrap gap-2">
            {c.agents.map((agent) => (
              <span key={agent}
                className="rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-foreground/70 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/8 hover:text-primary">
                {agent}
              </span>
            ))}
          </div>

          {/* Why cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {c.why.map((item) => (
              <WhyCard key={item.title} icon={ICON_MAP[item.icon]} title={item.title} text={item.text} />
            ))}
          </div>

          {/* Security */}
          <div id="seguridad" className="rounded-3xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.secLabel}</p>
            </div>
            <h3 className="mt-3 text-xl font-semibold">{c.secTitle}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {c.secTiles.map((tile) => (
                <div key={tile.title} className="rounded-2xl border border-border/50 bg-background/50 p-4">
                  <p className="text-sm font-semibold text-foreground">{tile.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/55">{tile.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Auth card */}
        <div id="auth-card" className="lg:sticky lg:top-24">
          <div className="rounded-[24px] border border-border/60 bg-card/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-7"
            style={{ animation: "lp-card 0.9s ease 0.1s both" }}>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{c.auth.label}</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">{c.auth.title}</h2>
              <p className="mt-1 text-sm text-foreground/55">{c.auth.subtitle}</p>
            </div>

            {/* Tabs */}
            <div className="mt-5 flex rounded-xl border border-border/60 bg-background/60 p-0.5">
              {(["signin", "signup"] as const).map((v) => (
                <button key={v} role="tab" aria-selected={tab === v}
                  onClick={() => setTab(v)} suppressHydrationWarning
                  className={[
                    "flex-1 rounded-[10px] py-2 text-sm font-medium transition",
                    tab === v
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/55 hover:text-foreground",
                  ].join(" ")}>
                  {v === "signin" ? c.auth.tabSignin : c.auth.tabSignup}
                </button>
              ))}
            </div>

            {/* Notices */}
            {(message || !supabaseReady) && (
              <div className="mt-4 space-y-2">
                {message && <Notice tone="accent" text={message} />}
                {!supabaseReady && <Notice tone="warning" text={c.auth.supabaseWarning} />}
              </div>
            )}

            {/* Forms */}
            <div className="mt-5">
              {tab === "signin" ? (
                <form action={signInAction} className="space-y-4" noValidate suppressHydrationWarning>
                  <input type="hidden" name="next" value={next} />
                  <AuthInput label={c.auth.emailLabel} name="email" type="email"
                    placeholder={c.auth.emailPlaceholder} autoComplete="email" />
                  <AuthInput label={c.auth.passwordLabel} name="password" type="password"
                    placeholder={c.auth.passwordPlaceholder} autoComplete="current-password" />
                  <AuthButton label={c.auth.signinBtn} />
                </form>
              ) : (
                <form action={signUpAction} className="space-y-4" noValidate suppressHydrationWarning>
                  <input type="hidden" name="next" value={next} />
                  <AuthInput label={c.auth.nameLabel} name="fullName" type="text"
                    placeholder={c.auth.namePlaceholder} />
                  <AuthInput label={c.auth.emailLabel} name="email" type="email"
                    placeholder={c.auth.emailPlaceholder} autoComplete="email" />
                  <AuthInput label={c.auth.passwordLabel} name="password" type="password"
                    placeholder={c.auth.passwordPlaceholder} autoComplete="new-password"
                    hint={c.auth.passwordHint} minLength={8} />
                  <AuthButton label={c.auth.signupBtn} />
                </form>
              )}
            </div>

            {/* After sign-in preview */}
            <div className="mt-5 rounded-xl border border-border/50 bg-background/50 p-4">
              <p className="text-xs font-semibold text-foreground/70">{c.auth.afterTitle}</p>
              <ul className="mt-3 space-y-2">
                {c.auth.afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/55">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-center text-[11px] leading-5 text-foreground/35">{c.auth.legal}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer className="border-t border-border/40 px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
              <span className="text-[8px] font-black text-primary-foreground">N3</span>
            </div>
            <span className="text-xs font-medium tracking-wide text-foreground/40">{c.footer}</span>
          </div>
          <button onClick={toggleLang} suppressHydrationWarning
            className="text-xs text-foreground/35 transition hover:text-foreground/60">
            {lang === "es" ? "English" : "Espanol"}
          </button>
        </div>
      </footer>

      {/* Inline keyframes */}
      <style>{`
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(16px); filter: blur(3px); }
          to   { opacity: 1; transform: translateY(0);   filter: blur(0);   }
        }
        @keyframes lp-drop {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes lp-float {
          0%, 100% { transform: translate3d(0, 0, 0);      }
          50%      { transform: translate3d(0, 22px, 0);    }
        }
        @keyframes lp-card {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function FeatureCard({ icon, title, description, index }: {
  icon: ReactNode; title: string; description: string; index: number;
}) {
  return (
    <article
      className="group rounded-2xl border border-border/60 bg-card/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-card/80"
      style={{ animation: `lp-rise 0.7s ease ${index * 0.07}s both` }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/55">{description}</p>
    </article>
  );
}

function WhyCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-4 transition hover:border-primary/20">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/55">{text}</p>
    </div>
  );
}

function Notice({ tone, text }: { tone: "accent" | "warning"; text: string }) {
  return (
    <div className={[
      "rounded-xl border px-4 py-3 text-xs leading-relaxed",
      tone === "accent"
        ? "border-primary/20 bg-primary/8 text-primary"
        : "border-secondary/20 bg-secondary/8 text-secondary",
    ].join(" ")}>
      {text}
    </div>
  );
}

function AuthInput({ label, name, type, placeholder, autoComplete, hint, minLength }: {
  label: string; name: string; type: string;
  placeholder?: string; autoComplete?: string; hint?: string; minLength?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground/70">{label}</span>
      <input
        name={name} type={type} placeholder={placeholder}
        autoComplete={autoComplete} minLength={minLength}
        suppressHydrationWarning
        className="h-11 w-full rounded-xl border border-border/60 bg-background/60 px-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
      />
      {hint && <span className="text-[11px] text-foreground/40">{hint}</span>}
    </label>
  );
}

function AuthButton({ label }: { label: string }) {
  return (
    <button type="submit" suppressHydrationWarning
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]">
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}
