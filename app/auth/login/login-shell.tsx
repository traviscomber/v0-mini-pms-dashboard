"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BarChart3, Brain, CalendarDays, CheckCircle2, Lock, Sparkles, Wand2 } from "lucide-react";

interface LoginShellProps {
  next: string;
  message?: string;
  supabaseReady: boolean;
  signInAction: (formData: FormData) => Promise<void>;
  signUpAction: (formData: FormData) => Promise<void>;
}

const HERO_STATS = [
  { label: "Ocupacion", value: "94%", delta: "+12%" },
  { label: "Tarifa promedio", value: "$287", delta: "+8%" },
  { label: "Ingresos / mes", value: "$41k", delta: "+23%" },
  { label: "Tareas completadas", value: "98%", delta: "+4%" },
];

const PLATFORM_PILLARS = [
  {
    icon: Brain,
    title: "Inteligencia ejecutiva",
    description: "Un resumen claro de riesgos, flujo de caja, estado operacional y la siguiente mejor accion.",
  },
  {
    icon: Wand2,
    title: "Automatizacion agentiva",
    description: "Agentes especializados gestionan ingresos, operaciones, mensajeria y confianza.",
  },
  {
    icon: CalendarDays,
    title: "Control operacional",
    description: "Llegadas, salidas, housekeeping y mantenimiento siempre sincronizados.",
  },
  {
    icon: BarChart3,
    title: "Aumento de ingresos",
    description: "Senales de precio, proyecciones y oportunidades de upsell siempre visibles.",
  },
];

const AGENT_STACK = [
  "Chief of Staff",
  "Revenue Strategist",
  "Operations Commander",
  "Guest Concierge",
  "Integrations Engineer",
  "Trust Auditor",
];

export function LoginShell({
  next,
  message,
  supabaseReady,
  signInAction,
  signUpAction,
}: LoginShellProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof window === "undefined") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    const dots = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
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
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot, index) => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0) dot.x = 1;
        if (dot.x > 1) dot.x = 0;
        if (dot.y < 0) dot.y = 1;
        if (dot.y > 1) dot.y = 0;

        for (let j = index + 1; j < dots.length; j++) {
          const other = dots[j];
          const dx = (dot.x - other.x) * width;
          const dy = (dot.y - other.y) * height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(dot.x * width, dot.y * height);
            ctx.lineTo(other.x * width, other.y * height);
            // Royal palette: Iridescent Magenta oklch(0.60 0.28 320)
            ctx.strokeStyle = `oklch(0.60 0.28 320 / ${0.07 * (1 - dist / 180)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(dot.x * width, dot.y * height, dot.radius, 0, Math.PI * 2);
        // Royal palette: Iridescent Magenta
        ctx.fillStyle = `oklch(0.60 0.28 320 / ${dot.alpha})`;
        ctx.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div suppressHydrationWarning className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        suppressHydrationWarning
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      />

      {/* Royal glow — Iridescent Magenta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full blur-3xl animate-[lp-float_14s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(0.60 0.28 320 / 0.18) 0%, transparent 65%)" }}
      />
      {/* Royal glow — Sapphire Violet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -right-28 h-[28rem] w-[28rem] rounded-full blur-3xl animate-[lp-float_18s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 300 / 0.12) 0%, transparent 68%)" }}
      />

      <header className="relative z-10 border-b border-border/70 bg-card/70 backdrop-blur-xl animate-[lp-drop_0.7s_ease_both]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">N3uralia</p>
            <p className="text-xs text-foreground/60">PMS agentivo para hoteleros exigentes</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-foreground/65 md:flex">
            <a href="#plataforma" className="transition hover:text-foreground">Plataforma</a>
            <a href="#agentes" className="transition hover:text-foreground">Agentes</a>
            <a href="#seguridad" className="transition hover:text-foreground">Seguridad</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] lg:items-start lg:px-8 lg:py-14">

        {/* ── LEFT COLUMN ── */}
        <section className="space-y-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary animate-[lp-rise_0.8s_ease_both]">
            <Sparkles className="h-3.5 w-3.5" />
            Operaciones hoteleras de siguiente nivel
          </div>

          <div className="space-y-5 animate-[lp-rise_0.85s_ease_0.05s_both]">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              Una torre de control para cada decision importante del hotel.
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-foreground/70 sm:text-lg">
              N3uralia une reservas, ingresos, operaciones y comunicacion con huespedes en un solo espacio de trabajo ejecutivo. Menos ruido, mas accion.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {HERO_STATS.map((stat, i) => (
              <MetricCard key={stat.label} {...stat} delay={i * 0.08} />
            ))}
          </div>

          {/* Pillars */}
          <div id="plataforma" className="grid gap-4 md:grid-cols-2">
            {PLATFORM_PILLARS.map((pillar, i) => (
              <FeatureCard
                key={pillar.title}
                icon={<pillar.icon className="h-4 w-4" />}
                title={pillar.title}
                description={pillar.description}
                delay={i * 0.08}
              />
            ))}
          </div>

          {/* Agent stack */}
          <section
            id="agentes"
            className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur animate-[lp-rise_0.9s_ease_0.15s_both]"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Equipo de agentes</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Agentes especializados. Responsabilidad clara.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-foreground/65">
                Un orquestador mas especialistas en ingresos, operaciones, experiencia del huesped, integraciones y confianza.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {AGENT_STACK.map((agent) => (
                <span
                  key={agent}
                  className="rounded-full border border-border bg-background/80 px-3 py-2 text-sm text-foreground/75 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {agent}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Callout
                icon={<CheckCircle2 className="h-4 w-4" />}
                title="Menos errores"
                text="Reduce limpiezas tardias, handoffs perdidos y fugas de ingreso ocultas."
              />
              <Callout
                icon={<ArrowRight className="h-4 w-4" />}
                title="Decisiones mas rapidas"
                text="Convierte la actividad del PMS en un plan priorizado de un vistazo."
              />
              <Callout
                icon={<Lock className="h-4 w-4" />}
                title="Listo para auditoria"
                text="Cada recomendacion puede rastrearse, revisarse y aprobarse."
              />
            </div>
          </section>

          {/* Security */}
          <section
            id="seguridad"
            className="rounded-3xl border border-border bg-card/70 p-6 animate-[lp-rise_0.9s_ease_0.2s_both]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Postura de seguridad</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-3">
              <SecurityTile
                title="Acceso controlado"
                text="Espacio de trabajo protegido con datos delimitados por propiedad."
              />
              <SecurityTile
                title="Aprobaciones humanas"
                text="Las acciones con impacto real requieren confirmacion explicita."
              />
              <SecurityTile
                title="Trazabilidad"
                text="Un camino visible desde la senal hasta la accion y el resultado."
              />
            </div>
          </section>
        </section>

        {/* ── RIGHT COLUMN — Auth card ── */}
        <section aria-label="Autenticacion" className="lg:sticky lg:top-8" id="auth-card">
          <div className="rounded-[28px] border border-border bg-card/90 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7 animate-[lp-card_0.9s_ease_0.1s_both]">

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Acceso al workspace</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Inicia sesion y ponte a trabajar.
              </h2>
              <p className="text-sm leading-6 text-foreground/65">
                Tu resumen ejecutivo, el equipo de agentes y el centro de comando de hoy, en un solo lugar.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="mt-5 flex rounded-2xl border border-border bg-background p-1">
              {(["signin", "signup"] as const).map((variant) => (
                <button
                  key={variant}
                  role="tab"
                  aria-selected={tab === variant}
                  onClick={() => setTab(variant)}
                  suppressHydrationWarning
                  className={[
                    "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition duration-300",
                    tab === variant
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/60 hover:text-foreground",
                  ].join(" ")}
                >
                  {variant === "signin" ? "Iniciar sesion" : "Crear cuenta"}
                </button>
              ))}
            </div>

            {/* Notices */}
            <div className="mt-4 space-y-3">
              {message ? <Notice tone="accent" text={message} /> : null}
              {!supabaseReady ? (
                <Notice
                  tone="warning"
                  text="Supabase no esta configurado. Agrega las variables de entorno para habilitar la autenticacion."
                />
              ) : null}
            </div>

            {/* Forms */}
            <div className="mt-5">
              {tab === "signin" ? (
                <form action={signInAction} className="space-y-4" noValidate suppressHydrationWarning>
                  <input type="hidden" name="next" value={next} />
                  <AuthInput
                    label="Correo electronico"
                    name="email"
                    type="email"
                    placeholder="tu@empresa.com"
                    autoComplete="email"
                  />
                  <AuthInput
                    label="Contrasena"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <AuthButton label="Ingresar al workspace" />
                </form>
              ) : (
                <form action={signUpAction} className="space-y-4" noValidate suppressHydrationWarning>
                  <AuthInput
                    label="Nombre completo"
                    name="fullName"
                    type="text"
                    placeholder="Tu nombre"
                  />
                  <AuthInput
                    label="Correo electronico"
                    name="email"
                    type="email"
                    placeholder="tu@empresa.com"
                    autoComplete="email"
                  />
                  <AuthInput
                    label="Contrasena"
                    name="password"
                    type="password"
                    placeholder="Minimo 8 caracteres"
                    autoComplete="new-password"
                    hint="Minimo 8 caracteres"
                    minLength={8}
                  />
                  <AuthButton label="Crear cuenta" />
                </form>
              )}
            </div>

            {/* After sign-in preview */}
            <div className="mt-5 rounded-2xl border border-border bg-background/80 p-4 text-sm text-foreground/65">
              <p className="font-medium text-foreground">Al ingresar tendras acceso a:</p>
              <ul className="mt-3 space-y-2 leading-6">
                <li>• Resumen ejecutivo con riesgos, flujo de caja y estado general</li>
                <li>• Vista de operaciones con llegadas, salidas y housekeeping</li>
                <li>• Torre de agentes para ingresos, ops, huespedes y confianza</li>
              </ul>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-foreground/50">
              Al continuar aceptas nuestros Terminos y Politica de Privacidad.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/70 px-6 py-5 text-center text-xs text-foreground/50 lg:px-8">
        © 2026 N3uralia — Plataforma de hospitalidad agentiva
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
          0%, 100% { transform: translate3d(0, 0, 0) scale(1);    }
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

function MetricCard({ label, value, delta, delay }: { label: string; value: string; delta: string; delay: number }) {
  return (
    <div
      className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur animate-[lp-rise_0.7s_ease_both]"
      style={{ animationDelay: `${delay}s` }}
    >
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
    <article
      className="rounded-3xl border border-border bg-card/80 p-5 animate-[lp-rise_0.75s_ease_both]"
      style={{ animationDelay: `${delay}s` }}
    >
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
    <div
      className={[
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "accent"
          ? "border-primary/20 bg-primary/10 text-primary"
          : "border-secondary/20 bg-secondary/10 text-secondary",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function AuthInput({
  label, name, type, placeholder, autoComplete, hint, minLength,
}: {
  label: string; name: string; type: string;
  placeholder?: string; autoComplete?: string; hint?: string; minLength?: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        suppressHydrationWarning
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
      />
      {hint ? <span className="text-xs text-foreground/45">{hint}</span> : null}
    </label>
  );
}

function AuthButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      suppressHydrationWarning
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
