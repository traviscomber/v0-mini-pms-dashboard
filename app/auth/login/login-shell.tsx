"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
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
  { label: "Unidades activas", value: "4", delta: "Core" },
  { label: "Operaciones cubiertas", value: "100%", delta: "Admin + field" },
  { label: "Tiempo ahorrado", value: "—", delta: "Automation" },
  { label: "Decisiones trazables", value: "100%", delta: "Audit-ready" },
];

const PLATFORM_PILLARS = [
  {
    icon: Brain,
    title: "Lectura ejecutiva",
    description: "Resumen claro de estado, riesgos, prioridades y la próxima mejor acción.",
  },
  {
    icon: Wand2,
    title: "Automatización con agentes",
    description: "Especialistas para administración, hospitality, campo e infraestructura.",
  },
  {
    icon: CalendarDays,
    title: "Operación sin fricción",
    description: "Reservas, mantenimiento, activos y servicios coordinados en un solo lugar.",
  },
  {
    icon: BarChart3,
    title: "Más control, menos pérdida",
    description: "Señales de costos, ocupación, mantenimientos y cobros visibles antes de que se pierdan oportunidades.",
  },
];

const CORE_MODULES = [
  {
    title: "Admin General",
    text: "Presupuestos, personas, energía y gobierno del sistema en una sola vista.",
  },
  {
    title: "Hospitality",
    text: "Guest services, concierge y atención al cliente con contexto y trazabilidad.",
  },
  {
    title: "Landscaping & Farming",
    text: "Orchards, vineyards, livestock y fuel coordinados como operación viva.",
  },
  {
    title: "Infrastructure",
    text: "Properties, assets, inventory y mantenimiento en un solo hub operativo.",
  },
];

const SITE_PROFILES = [
  {
    city: "Santiago",
    label: "HQ + operación urbana",
    text: "Ideal para administración central, hospitality y coordinación de tareas de alto volumen.",
  },
  {
    city: "Valparaíso",
    label: "Operación distribuida",
    text: "Perfecto para sedes con servicios mixtos, rotación frecuente y múltiples responsables.",
  },
  {
    city: "Patagonia",
    label: "Terreno y remotas",
    text: "Más anticipación, comunicación proactiva y margen operativo para clima, traslados y cambios de itinerario.",
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

const DAY_FLOW = [
  {
    time: "07:00",
    title: "Despierta la operación",
    text: "Recepción, administración y equipos de campo arrancan con la lectura del estado real de cada sede.",
    tone: "sky",
  },
  {
    time: "11:30",
    title: "Ajusta habitaciones y mensajes",
    text: "Se asignan prioridades, se confirman pendientes y se preparan mensajes para los siguientes movimientos.",
    tone: "violet",
  },
  {
    time: "16:00",
    title: "Entra el bloque de check-ins",
    text: "El sistema empuja alertas, tareas y mensajes para que cada interacción sea ordenada y sin fricción.",
    tone: "amber",
  },
  {
    time: "21:00",
    title: "Cierre y aprendizaje",
    text: "Se revisa lo ocurrido, se cierran pendientes y queda el día listo para mañana.",
    tone: "emerald",
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
            <p className="text-xs text-foreground/60">Core system para operación multi-vertical</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-foreground/65 md:flex">
            <a href="#platform" className="transition hover:text-foreground">Plataforma</a>
            <a href="#modules" className="transition hover:text-foreground">Módulos</a>
            <a href="#workflow" className="transition hover:text-foreground">Cómo funciona</a>
            <a href="#security" className="transition hover:text-foreground">Seguridad</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)] lg:items-start lg:px-8 lg:py-14">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary animate-[lp-rise_0.8s_ease_both]">
            <Sparkles className="h-3.5 w-3.5" />
            N3uralia Facility Core System
          </div>

          <div className="space-y-5 animate-[lp-rise_0.85s_ease_0.05s_both]">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              Un centro de control para equipos que organizan hospitality, administración, campo e infraestructura.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
              La plataforma reúne equipos, activos, reservas, mantenimiento y comunicación en una sola vista ejecutiva.
              Pensado para equipos que necesitan control serio y claridad todos los días.
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
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Un día en la operación, contado como una mini película.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-foreground/65">
                El objetivo es que cualquier gerente o recepcionista entienda en segundos cómo el sistema observa, decide y activa el trabajo.
              </p>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                {DAY_FLOW.map((item, index) => (
                  <div key={item.time} className="rounded-2xl border border-border bg-background/80 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-xs font-semibold text-primary">
                        {item.time}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                            {index === 0 ? "mañana" : index === 1 ? "mediodía" : index === 2 ? "tarde" : "cierre"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-foreground/65">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_45%)]" />
                <div className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                <div className="relative grid gap-4">
                  <div className="rounded-3xl border border-border/70 bg-background/75 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Reel operativo</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">La jornada se mueve en capas.</h3>
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        en vivo
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <FlowScene
                        title="Mañana"
                        subtitle="Recepción y housekeeping"
                        accent="sky"
                        icon={<ClipboardList className="h-4 w-4" />}
                        detail="Entradas, salidas y habitaciones listas antes del peak."
                        delay="0s"
                      />
                      <FlowScene
                        title="Tarde"
                        subtitle="Llegadas y mensajes"
                        accent="violet"
                        icon={<Brain className="h-4 w-4" />}
                        detail="El copiloto propone el siguiente paso y prepara la respuesta."
                        delay="0.9s"
                      />
                      <FlowScene
                        title="Noche"
                        subtitle="Cierre y aprendizaje"
                        accent="emerald"
                        icon={<LineChart className="h-4 w-4" />}
                        detail="Queda una foto clara para arrancar mañana con menos fricción."
                        delay="1.8s"
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-border bg-card/80 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45">
                        <span>Línea del día</span>
                        <span>24h</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-border/50">
                        <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-sky-400 via-primary to-emerald-400 animate-[lp-progress_6s_ease-in-out_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="modules" className="space-y-4">
            <SectionHeading
              eyebrow="Módulos core"
              title="Cuatro bloques para operar sin fricción."
              text="La portada debe mostrar la estructura real del producto, no una promesa genérica."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {CORE_MODULES.map((item, index) => (
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

            <div className="grid gap-4 lg:grid-cols-3">
              {SITE_PROFILES.map((city, index) => (
                <article
                  key={city.city}
                  className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 animate-[lp-rise_0.8s_ease_both]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{city.city}</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{city.label}</h3>
                  <p className="mt-4 text-sm leading-6 text-foreground/65">{city.text}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/65">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Copy local para esta sede
                  </div>
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
                Un orquestador principal y especialistas para hospitality, administración, terreno, integraciones y confianza.
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
              <Callout icon={<ArrowRight className="h-4 w-4" />} title="Decisiones rápidas" text="Convierte actividad del core system en un plan claro desde un solo vistazo." />
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
                  <AuthInput label="Correo" name="email" type="email" placeholder="tu@empresa.com" autoComplete="email" />
                  <AuthInput label="Contraseña" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                  <AuthButton label="Entrar al workspace" />
                </form>
              ) : (
                <form action={signUpAction} className="space-y-4" noValidate>
                  <AuthInput label="Nombre completo" name="fullName" type="text" placeholder="Tu nombre" />
                  <AuthInput label="Correo" name="email" type="email" placeholder="tu@empresa.com" autoComplete="email" />
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
                <li>• Vista operativa con tareas, sedes, activos y servicios</li>
                <li>• Torre de agentes para administración, hospitality, campo y mantenimiento</li>
              </ul>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-foreground/50">
              Al continuar aceptas nuestros Términos y la Política de Privacidad.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/70 px-6 py-5 text-center text-xs text-foreground/50 lg:px-8">
        © 2026 N3uralia — Facility Core System
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
        @keyframes lp-progress {
          0%, 100% { transform: translateX(-14%); opacity: 0.78; }
          50% { transform: translateX(14%); opacity: 1; }
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

function FlowScene({
  title,
  subtitle,
  detail,
  accent,
  icon,
  delay,
}: {
  title: string;
  subtitle: string;
  detail: string;
  accent: "sky" | "violet" | "emerald";
  icon: ReactNode;
  delay: string;
}) {
  const accentClass =
    accent === "sky"
      ? "from-sky-400/20 via-sky-300/10 to-transparent text-sky-200"
      : accent === "violet"
        ? "from-primary/20 via-primary/10 to-transparent text-primary"
        : "from-emerald-400/20 via-emerald-300/10 to-transparent text-emerald-200";

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-4 animate-[lp-rise_0.8s_ease_both]"
      style={{ animationDelay: delay }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${accentClass}`} />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/80 text-primary">
          {icon}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/45">
              {subtitle}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-foreground/65">{detail}</p>
        </div>
      </div>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-border/50">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary via-accent to-emerald-400 animate-[lp-progress_5s_ease-in-out_infinite]" />
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
