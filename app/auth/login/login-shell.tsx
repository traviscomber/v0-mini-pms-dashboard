"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BarChart3, Brain, CalendarDays, CheckCircle2, Globe, Lock, Sparkles, Wand2 } from "lucide-react";

/* ─────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────── */
type Lang = "es" | "en";

const copy = {
  es: {
    tagline: "PMS agentivo para hoteleros exigentes",
    nav: { platform: "Plataforma", agents: "Agentes", security: "Seguridad" },
    badge: "Operaciones hoteleras de siguiente nivel",
    headline: "Una torre de control para cada decision importante del hotel.",
    subheadline:
      "N3uralia une reservas, ingresos, operaciones y comunicacion con huespedes en un solo espacio de trabajo ejecutivo. Menos ruido, mas accion.",
    stats: [
      { label: "Ocupacion", value: "94%", delta: "+12%" },
      { label: "Tarifa promedio", value: "$287", delta: "+8%" },
      { label: "Ingresos / mes", value: "$41k", delta: "+23%" },
      { label: "Tareas completadas", value: "98%", delta: "+4%" },
    ],
    pillars: [
      {
        title: "Inteligencia ejecutiva",
        description:
          "Un resumen claro de riesgos, flujo de caja, estado operacional y la siguiente mejor accion.",
      },
      {
        title: "Automatizacion agentiva",
        description:
          "Agentes especializados gestionan ingresos, operaciones, mensajeria y confianza.",
      },
      {
        title: "Control operacional",
        description:
          "Llegadas, salidas, housekeeping y mantenimiento siempre sincronizados.",
      },
      {
        title: "Aumento de ingresos",
        description:
          "Senales de precio, proyecciones y oportunidades de upsell siempre visibles.",
      },
    ],
    agentSection: {
      label: "Equipo de agentes",
      title: "Agentes especializados. Responsabilidad clara.",
      description:
        "Un orquestador mas especialistas en ingresos, operaciones, experiencia del huesped, integraciones y confianza.",
    },
    callouts: [
      {
        title: "Menos errores",
        text: "Reduce limpiezas tardias, handoffs perdidos y fugas de ingreso ocultas.",
      },
      {
        title: "Decisiones mas rapidas",
        text: "Convierte la actividad del PMS en un plan priorizado de un vistazo.",
      },
      {
        title: "Listo para auditoria",
        text: "Cada recomendacion puede rastrearse, revisarse y aprobarse.",
      },
    ],
    security: {
      label: "Postura de seguridad",
      tiles: [
        {
          title: "Acceso controlado",
          text: "Espacio de trabajo protegido con datos delimitados por propiedad.",
        },
        {
          title: "Aprobaciones humanas",
          text: "Las acciones con impacto real requieren confirmacion explicita.",
        },
        {
          title: "Trazabilidad",
          text: "Un camino visible desde la senal hasta la accion y el resultado.",
        },
      ],
    },
    auth: {
      label: "Acceso al workspace",
      title: "Inicia sesion y ponte a trabajar.",
      subtitle:
        "Tu resumen ejecutivo, el equipo de agentes y el centro de comando de hoy en un solo lugar.",
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
        "Vista de operaciones con llegadas, salidas y housekeeping",
        "Torre de agentes para ingresos, ops, huespedes y confianza",
      ],
      legal: "Al continuar aceptas nuestros Terminos y Politica de Privacidad.",
      supabaseWarning:
        "Supabase no esta configurado. Agrega las variables de entorno para habilitar la autenticacion.",
    },
    footer: "© 2026 N3uralia — Plataforma de hospitalidad agentiva",
  },
  en: {
    tagline: "Agentic PMS for serious hoteliers",
    nav: { platform: "Platform", agents: "Agents", security: "Security" },
    badge: "Next-generation hotel operations",
    headline: "One control tower for every important hotel decision.",
    subheadline:
      "N3uralia brings reservations, revenue, operations, and guest communication into one executive workspace. Less noise, more action.",
    stats: [
      { label: "Occupancy", value: "94%", delta: "+12%" },
      { label: "Average rate", value: "$287", delta: "+8%" },
      { label: "Revenue / month", value: "$41k", delta: "+23%" },
      { label: "Tasks completed", value: "98%", delta: "+4%" },
    ],
    pillars: [
      {
        title: "Executive intelligence",
        description:
          "A clear briefing on risk, cash flow, operational status, and the next best action.",
      },
      {
        title: "Agentic automation",
        description:
          "Specialist agents handle revenue, operations, messaging, and trust.",
      },
      {
        title: "Operational control",
        description:
          "Arrivals, departures, housekeeping, and maintenance always in sync.",
      },
      {
        title: "Revenue lift",
        description:
          "Pricing signals, forecasts, and upsell opportunities always visible.",
      },
    ],
    agentSection: {
      label: "Agent stack",
      title: "Small specialist agents. Clear ownership.",
      description:
        "One orchestrator plus specialists for revenue, operations, guest experience, integrations, and trust.",
    },
    callouts: [
      {
        title: "Fewer mistakes",
        text: "Reduce late cleans, missed handoffs, and hidden revenue leaks.",
      },
      {
        title: "Faster decisions",
        text: "Turns PMS activity into a prioritised plan at a glance.",
      },
      {
        title: "Audit-ready",
        text: "Every recommendation can be traced, reviewed, and approved.",
      },
    ],
    security: {
      label: "Security posture",
      tiles: [
        {
          title: "Controlled access",
          text: "Protected workspace with property-scoped data.",
        },
        {
          title: "Human approvals",
          text: "Actions with real impact require explicit confirmation.",
        },
        {
          title: "Full traceability",
          text: "A visible path from signal to action to outcome.",
        },
      ],
    },
    auth: {
      label: "Workspace access",
      title: "Sign in and go straight to work.",
      subtitle:
        "Your executive briefing, agent stack, and today's command center in one place.",
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
        "Operations view with arrivals, departures, and housekeeping",
        "Agent control tower for revenue, ops, guests, and trust",
      ],
      legal: "By continuing you agree to our Terms and Privacy Policy.",
      supabaseWarning:
        "Supabase is not configured. Add the environment variables to enable authentication.",
    },
    footer: "© 2026 N3uralia — Agentic hospitality platform",
  },
} satisfies Record<Lang, unknown>;

const PILLAR_ICONS = [Brain, Wand2, CalendarDays, BarChart3];

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

const AGENT_STACK = [
  "Chief of Staff",
  "Revenue Strategist",
  "Operations Commander",
  "Guest Concierge",
  "Integrations Engineer",
  "Trust Auditor",
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export function LoginShell({ next, message, supabaseReady, signInAction, signUpAction }: LoginShellProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [lang, setLang] = useState<Lang>("es");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const c = copy[lang];

  // Persist language preference
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

  // Canvas particle animation — royal palette magenta
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let af = 0;
    const dots = Array.from({ length: 42 }, () => ({
      x: Math.random(), y: Math.random(),
      radius: Math.random() * 1.4 + 0.6,
      vx: (Math.random() - 0.5) * 0.0015,
      vy: (Math.random() - 0.5) * 0.0015,
      alpha: Math.random() * 0.22 + 0.06,
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
        if (dot.x < 0) dot.x = 1; if (dot.x > 1) dot.x = 0;
        if (dot.y < 0) dot.y = 1; if (dot.y > 1) dot.y = 0;
        for (let j = i + 1; j < dots.length; j++) {
          const o = dots[j];
          const dx = (dot.x - o.x) * w, dy = (dot.y - o.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(dot.x * w, dot.y * h);
            ctx.lineTo(o.x * w, o.y * h);
            ctx.strokeStyle = `oklch(0.60 0.28 320 / ${0.07 * (1 - dist / 180)})`;
            ctx.lineWidth = 1;
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
    return () => { window.cancelAnimationFrame(af); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div suppressHydrationWarning className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">

      {/* Canvas */}
      <canvas ref={canvasRef} aria-hidden="true" suppressHydrationWarning
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />

      {/* Royal glow — Iridescent Magenta */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full blur-3xl animate-[lp-float_14s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(0.60 0.28 320 / 0.18) 0%, transparent 65%)" }} />
      {/* Royal glow — Sapphire Violet */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -right-28 h-[28rem] w-[28rem] rounded-full blur-3xl animate-[lp-float_18s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 300 / 0.12) 0%, transparent 68%)" }} />

      {/* ── HEADER ── */}
      <header className="relative z-10 border-b border-border/70 bg-card/70 backdrop-blur-xl animate-[lp-drop_0.7s_ease_both]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">N3uralia</p>
            <p className="text-xs text-foreground/60">{c.tagline}</p>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm text-foreground/65 md:flex">
              <a href="#plataforma" className="transition hover:text-foreground">{c.nav.platform}</a>
              <a href="#agentes" className="transition hover:text-foreground">{c.nav.agents}</a>
              <a href="#seguridad" className="transition hover:text-foreground">{c.nav.security}</a>
            </nav>
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              suppressHydrationWarning
              aria-label="Toggle language"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] lg:items-start lg:px-8 lg:py-14">

        {/* ── LEFT COLUMN ── */}
        <section className="space-y-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary animate-[lp-rise_0.8s_ease_both]">
            <Sparkles className="h-3.5 w-3.5" />
            {c.badge}
          </div>

          <div className="space-y-5 animate-[lp-rise_0.85s_ease_0.05s_both]">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              {c.headline}
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-foreground/70 sm:text-lg">
              {c.subheadline}
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {c.stats.map((stat, i) => (
              <MetricCard key={stat.label} {...stat} delay={i * 0.08} />
            ))}
          </div>

          {/* Pillars */}
          <div id="plataforma" className="grid gap-4 md:grid-cols-2">
            {c.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <FeatureCard
                  key={pillar.title}
                  icon={<Icon className="h-4 w-4" />}
                  title={pillar.title}
                  description={pillar.description}
                  delay={i * 0.08}
                />
              );
            })}
          </div>

          {/* Agent stack */}
          <section id="agentes" className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur animate-[lp-rise_0.9s_ease_0.15s_both]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.agentSection.label}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{c.agentSection.title}</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-foreground/65">{c.agentSection.description}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {AGENT_STACK.map((agent) => (
                <span key={agent}
                  className="rounded-full border border-border bg-background/80 px-3 py-2 text-sm text-foreground/75 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                  {agent}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {c.callouts.map((item) => (
                <Callout key={item.title}
                  icon={item.title.includes("audit") || item.title.includes("Listo") ? <Lock className="h-4 w-4" /> : item.title.includes("rapidas") || item.title.includes("Faster") ? <ArrowRight className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </section>

          {/* Security */}
          <section id="seguridad" className="rounded-3xl border border-border bg-card/70 p-6 animate-[lp-rise_0.9s_ease_0.2s_both]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.security.label}</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-3">
              {c.security.tiles.map((tile) => (
                <SecurityTile key={tile.title} title={tile.title} text={tile.text} />
              ))}
            </div>
          </section>

        </section>

        {/* ── RIGHT COLUMN — Auth card ── */}
        <section aria-label={c.auth.label} className="lg:sticky lg:top-8" id="auth-card">
          <div className="rounded-[28px] border border-border bg-card/90 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7 animate-[lp-card_0.9s_ease_0.1s_both]">

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.auth.label}</p>
              <h2 className="text-2xl font-semibold tracking-tight">{c.auth.title}</h2>
              <p className="text-sm leading-6 text-foreground/65">{c.auth.subtitle}</p>
            </div>

            {/* Tab switcher */}
            <div className="mt-5 flex rounded-2xl border border-border bg-background p-1">
              {(["signin", "signup"] as const).map((variant) => (
                <button key={variant} role="tab" aria-selected={tab === variant}
                  onClick={() => setTab(variant)} suppressHydrationWarning
                  className={[
                    "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition duration-300",
                    tab === variant
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/60 hover:text-foreground",
                  ].join(" ")}>
                  {variant === "signin" ? c.auth.tabSignin : c.auth.tabSignup}
                </button>
              ))}
            </div>

            {/* Notices */}
            <div className="mt-4 space-y-3">
              {message ? <Notice tone="accent" text={message} /> : null}
              {!supabaseReady ? <Notice tone="warning" text={c.auth.supabaseWarning} /> : null}
            </div>

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
            <div className="mt-5 rounded-2xl border border-border bg-background/80 p-4 text-sm text-foreground/65">
              <p className="font-medium text-foreground">{c.auth.afterTitle}</p>
              <ul className="mt-3 space-y-2 leading-6">
                {c.auth.afterItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-foreground/50">{c.auth.legal}</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/70 px-6 py-5 text-center text-xs text-foreground/50 lg:px-8">
        {c.footer}
      </footer>

      <style>{`
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);  }
        }
        @keyframes lp-drop {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes lp-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1);       }
          50%      { transform: translate3d(0, 18px, 0) scale(1.03); }
        }
        @keyframes lp-card {
          from { opacity: 0; transform: translateY(22px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)    scale(1);     }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function MetricCard({ label, value, delta, delay }: { label: string; value: string; delta: string; delay: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur animate-[lp-rise_0.7s_ease_both]"
      style={{ animationDelay: `${delay}s` }}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{delta}</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: ReactNode; title: string; description: string; delay: number }) {
  return (
    <article className="rounded-3xl border border-border bg-card/80 p-5 animate-[lp-rise_0.75s_ease_both]"
      style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-foreground/65">{description}</p>
    </article>
  );
}

function Callout({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/20">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-foreground/65">{text}</p>
    </div>
  );
}

function SecurityTile({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-foreground/65">{text}</p>
    </div>
  );
}

function Notice({ tone, text }: { tone: "accent" | "warning"; text: string }) {
  return (
    <div className={["rounded-2xl border px-4 py-3 text-sm",
      tone === "accent"
        ? "border-primary/20 bg-primary/10 text-primary"
        : "border-secondary/20 bg-secondary/10 text-secondary",
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
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input name={name} type={type} placeholder={placeholder}
        autoComplete={autoComplete} minLength={minLength}
        suppressHydrationWarning
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/20" />
      {hint ? <span className="text-xs text-foreground/45">{hint}</span> : null}
    </label>
  );
}

function AuthButton({ label }: { label: string }) {
  return (
    <button type="submit" suppressHydrationWarning
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]">
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
