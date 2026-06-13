"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  LineChart,
  Lock,
  Sparkles,
  Wand2,
} from "lucide-react";

interface LoginShellProps {
  next: string;
  message?: string;
  supabaseReady: boolean;
  signInAction: (formData: FormData) => Promise<void>;
  signUpAction: (formData: FormData) => Promise<void>;
}

const HERO_STATS = [
  { label: "Ocupación", value: "94%", delta: "+12%" },
  { label: "ADR promedio", value: "$287.000 CLP", delta: "+8%" },
  { label: "Ingresos mensuales", value: "$41M CLP", delta: "+23%" },
  { label: "Tareas resueltas", value: "98%", delta: "+4%" },
];

const PLATFORM_PILLARS = [
  {
    icon: Brain,
    title: "Lectura ejecutiva",
    description: "Resumen claro de riesgo, caja, ocupación y la próxima mejor acción.",
  },
  {
    icon: Wand2,
    title: "Automatización con agentes",
    description: "Especialistas para ingresos, operaciones, mensajes, integraciones y control.",
  },
  {
    icon: CalendarDays,
    title: "Operación sin fricción",
    description: "Llegadas, salidas, housekeeping y mantención coordinados en un solo lugar.",
  },
  {
    icon: BarChart3,
    title: "Más ingreso, menos pérdida",
    description: "Señales de pricing, demanda y cobros visibles antes de que se pierdan ventas.",
  },
];

const CHILE_FOCUSES = [
  {
    title: "Pensado para Chile",
    text: "Precios en CLP, copy en español y una experiencia clara para equipos locales.",
  },
  {
    title: "Recepción y operaciones",
    text: "Ideal para hoteles urbanos, apart-hoteles, hostales boutique y operaciones multi-canal.",
  },
  {
    title: "Época alta y feriados",
    text: "Ayuda a anticipar carga en verano, fines de semana largos y temporadas de alta demanda.",
  },
  {
    title: "Control serio",
    text: "Cada recomendación queda trazada para que el equipo decida con confianza.",
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

const WORKFLOW_STEPS = [
  {
    step: "1",
    title: "Detecta señales",
    text: "El sistema lee ocupación, cobros, llegadas y tareas abiertas en tiempo real.",
  },
  {
    step: "2",
    title: "Prioriza acciones",
    text: "Los agentes ordenan lo urgente: cobrar, preparar habitaciones o escribir al huésped.",
  },
  {
    step: "3",
    title: "Ejecuta con control",
    text: "El equipo actúa con trazabilidad, aprobaciones y una vista simple para decidir rápido.",
  },
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

        for (let otherIndex = index + 1; otherIndex < dots.length; otherIndex += 1) {
          const other = dots[otherIndex];
          const dx = (dot.x - other.x) * width;
          const dy = (dot.y - other.y) * height;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            ctx.beginPath();
            ctx.moveTo(dot.x * width, dot.y * height);
            ctx.lineTo(other.x * width, other.y * height);
            ctx.strokeStyle = `oklch(0.58 0.24 320 / ${0.05 * (1 - distance / 180)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(dot.x * width, dot.y * height, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.58 0.24 320 / ${dot.alpha})`;
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
    <div className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 top-8 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.58_0.24_320_/_0.14)_0%,transparent_65%)] blur-3xl animate-[lp-float_14s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -right-28 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,oklch(0.52_0.24_280_/_0.10)_0%,transparent_68%)] blur-3xl animate-[lp-float_18s_ease-in-out_infinite]"
      />

      <header className="relative z-10 border-b border-border/70 bg-card/70 backdrop-blur-xl animate-[lp-drop_0.7s_ease_both]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">N3uralia</p>
            <p className="text-xs text-foreground/60">PMS con agentes para operación hotelera en Chile</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-foreground/65 md:flex">
            <a href="#platform" className="transition hover:text-foreground">Plataforma</a>
            <a href="#chile" className="transition hover:text-foreground">Chile</a>
            <a href="#workflow" className="transition hover:text-foreground">Cómo funciona</a>
            <a href="#security" className="transition hover:text-foreground">Seguridad</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)] lg:items-start lg:px-8 lg:py-14">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary animate-[lp-rise_0.8s_ease_both]">
            <Sparkles className="h-3.5 w-3.5" />
            Operación hotelera moderna, lista para Chile
          </div>

          <div className="space-y-5 animate-[lp-rise_0.85s_ease_0.05s_both]">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              Un centro de control para hoteles que necesitan ordenar, vender y responder mejor.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
              N3uralia reúne reservas, ingresos, operación y comunicación en una sola vista ejecutiva.
              Pensado para equipos en Chile que quieren menos fricción y más claridad todos los días.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {HERO_STATS.map((stat, index) => (
              <MetricCard key={stat.label} {...stat} delay={index * 0.08} />
            ))}
          </div>

          <section id="platform" className="space-y-4">
            <SectionHeading
              eyebrow="Plataforma"
              title="Dividimos la experiencia en capas simples."
              text="Cada bloque responde una pregunta distinta: qué está pasando, qué conviene hacer y cómo ejecutarlo."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {PLATFORM_PILLARS.map((pillar, index) => (
                <FeatureCard
                  key={pillar.title}
                  icon={<pillar.icon className="h-4 w-4" />}
                  title={pillar.title}
                  description={pillar.description}
                  delay={index * 0.08}
                />
              ))}
            </div>
          </section>

          <section id="workflow" className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur animate-[lp-rise_0.9s_ease_0.15s_both]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Cómo funciona</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Una animación simple del flujo de trabajo.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-foreground/65">
                El objetivo es que cualquier gerente o recepcionista entienda en segundos cómo pasa de datos a acción.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-3">
                {WORKFLOW_STEPS.map((item, index) => (
                  <div key={item.step} className="rounded-2xl border border-border bg-background/80 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-foreground/65">{item.text}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-emerald-400 animate-[lp-bar_4.5s_ease-in-out_infinite]"
                        style={{ animationDelay: `${index * 0.7}s`, width: `${60 + index * 12}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-border bg-background/80 p-5">
                <div className="absolute inset-x-10 top-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-transparent" />
                <div className="grid gap-4">
                  <FlowNode
                    tone="input"
                    icon={<ClipboardList className="h-4 w-4" />}
                    title="Datos del día"
                    text="Llegadas, salidas, cobros, tareas y mensajes abiertos."
                  />
                  <div className="flex justify-center">
                    <ChevronRight className="h-6 w-6 animate-[lp-pulse_1.8s_ease-in-out_infinite] text-primary" />
                  </div>
                  <FlowNode
                    tone="processing"
                    icon={<Brain className="h-4 w-4" />}
                    title="Agentes inteligentes"
                    text="Priorizan, redactan, recomiendan y avisan lo que importa."
                  />
                  <div className="flex justify-center">
                    <ChevronRight className="h-6 w-6 animate-[lp-pulse_1.8s_ease-in-out_infinite] text-primary" />
                  </div>
                  <FlowNode
                    tone="output"
                    icon={<LineChart className="h-4 w-4" />}
                    title="Resultado claro"
                    text="El equipo ve una acción concreta, con contexto y trazabilidad."
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="chile" className="space-y-4">
            <SectionHeading
              eyebrow="Chile"
              title="Lo hacemos más útil para el contexto local."
              text="La página debe sentirse cercana a la operación hotelera real del país, no a un demo genérico."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {CHILE_FOCUSES.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-border bg-card/80 p-5 animate-[lp-rise_0.75s_ease_both]"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-foreground/65">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="agents" className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur animate-[lp-rise_0.9s_ease_0.15s_both]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Equipo de agentes</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Agentes pequeños, responsabilidades claras.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-foreground/65">
                Un orquestador principal y especialistas para ingresos, operación, experiencia, integraciones y confianza.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {AGENT_STACK.map((agent) => (
                <span
                  key={agent}
                  className="rounded-full border border-border bg-background/80 px-3 py-2 text-sm text-foreground/75 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
                >
                  {agent}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Callout icon={<CheckCircle2 className="h-4 w-4" />} title="Menos errores" text="Reduce atrasos, cobros olvidados y fallas de coordinación." />
              <Callout icon={<ArrowRight className="h-4 w-4" />} title="Decisiones rápidas" text="Convierte actividad PMS en un plan claro desde un solo vistazo." />
              <Callout icon={<Lock className="h-4 w-4" />} title="Listo para auditoría" text="Cada recomendación puede revisarse y aprobarse con trazabilidad." />
            </div>
          </section>

          <section id="security" className="rounded-3xl border border-border bg-card/70 p-6 animate-[lp-rise_0.9s_ease_0.2s_both]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Seguridad</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-3">
              <SecurityTile title="Acceso controlado" text="Ingreso protegido y datos segmentados por propiedad." />
              <SecurityTile title="Aprobación humana" text="Las acciones sensibles requieren confirmación explícita." />
              <SecurityTile title="Trazabilidad" text="Se ve el paso desde la señal hasta el resultado." />
            </div>
          </section>
        </section>

        <section aria-label="Authentication" className="lg:sticky lg:top-8" id="auth-card">
          <div className="rounded-[28px] border border-border bg-card/90 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7 animate-[lp-card_0.9s_ease_0.1s_both]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Acceso al workspace</p>
              <h2 className="text-2xl font-semibold tracking-tight">Entra y sigue trabajando sin perder contexto.</h2>
              <p className="text-sm leading-6 text-foreground/65">
                Ves el briefing ejecutivo, la operación diaria y el control de agentes en una sola entrada.
              </p>
            </div>

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
                    tab === variant ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/60 hover:text-foreground",
                  ].join(" ")}
                >
                  {variant === "signin" ? "Ingresar" : "Crear cuenta"}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {message ? <Notice tone="accent" text={message} /> : null}
              {!supabaseReady ? (
                <Notice
                  tone="warning"
                  text="Supabase aún no está configurado. Agrega las variables de entorno para activar la autenticación."
                />
              ) : null}
            </div>

            <div className="mt-5">
              {tab === "signin" ? (
                <form action={signInAction} className="space-y-4" noValidate>
                  <input type="hidden" name="next" value={next} />
                  <AuthInput label="Correo" name="email" type="email" placeholder="tu@hotel.cl" autoComplete="email" />
                  <AuthInput label="Contraseña" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                  <AuthButton label="Entrar al workspace" />
                </form>
              ) : (
                <form action={signUpAction} className="space-y-4" noValidate>
                  <AuthInput label="Nombre completo" name="fullName" type="text" placeholder="Tu nombre" />
                  <AuthInput label="Correo" name="email" type="email" placeholder="tu@hotel.cl" autoComplete="email" />
                  <AuthInput
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="Al menos 8 caracteres"
                    autoComplete="new-password"
                    hint="Mínimo 8 caracteres"
                    minLength={8}
                  />
                  <AuthButton label="Crear cuenta" />
                </form>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background/80 p-4 text-sm text-foreground/65">
              <p className="font-medium text-foreground">Después de entrar</p>
              <ul className="mt-3 space-y-2 leading-6">
                <li>• Briefing ejecutivo con riesgo, caja y ocupación</li>
                <li>• Vista operativa con tareas, llegadas, salidas y housekeeping</li>
                <li>• Torre de agentes para ingresos, operación y mensajes</li>
              </ul>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-foreground/50">
              Al continuar aceptas nuestros Términos y la Política de Privacidad.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/70 px-6 py-5 text-center text-xs text-foreground/50 lg:px-8">
        © 2026 N3uralia — Plataforma hotelera con agentes
      </footer>

      <style>{`
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes lp-drop {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, 18px, 0) scale(1.03); }
        }
        @keyframes lp-card {
          from { opacity: 0; transform: translateY(22px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lp-bar {
          0%, 100% { transform: translateX(-10%); opacity: 0.85; }
          50% { transform: translateX(10%); opacity: 1; }
        }
        @keyframes lp-pulse {
          0%, 100% { transform: translateX(0); opacity: 0.55; }
          50% { transform: translateX(4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">{text}</p>
    </div>
  );
}

function FlowNode({
  tone,
  icon,
  title,
  text,
}: {
  tone: "input" | "processing" | "output";
  icon: ReactNode;
  title: string;
  text: string;
}) {
  const toneClass =
    tone === "input"
      ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
      : tone === "processing"
        ? "border-primary/20 bg-primary/10 text-primary"
        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-current/20 bg-background/70">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-foreground/70">{text}</p>
        </div>
      </div>
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

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
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
          : "border-amber-500/20 bg-amber-500/10 text-amber-200",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function AuthInput({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  hint,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  minLength?: number;
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
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
