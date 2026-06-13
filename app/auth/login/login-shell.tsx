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
      "Yagán une reservas, ingresos, operaciones y comunicacion con huespedes en un solo espacio de trabajo ejecutivo. Menos ruido, mas accion.",
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
    footer: "© 2026 Yagán — Plataforma de hospitalidad agentiva",
  },
  en: {
    tagline: "Agentic PMS for serious hoteliers",
    nav: { platform: "Platform", agents: "Agents", security: "Security" },
    badge: "Next-generation hotel operations",
    headline: "One control tower for every important hotel decision.",
    subheadline:
      "Yagán brings reservations, revenue, operations, and guest communication into one executive workspace. Less noise, more action.",
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
    footer: "© 2026 Yagán — Agentic hospitality platform",
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
<<<<<<< HEAD
   COUNT-UP HOOK
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

/* ─────────────────────────────────────────
   HERO CANVAS — Live hotel floor plan
───────────────────────────────────────── */
type RoomStatus = "occupied" | "vacant" | "housekeeping" | "maintenance" | "checkout";

const STATUS_COLORS: Record<RoomStatus, { fill: string; stroke: string }> = {
  occupied:     { fill: "oklch(0.60 0.28 320 / 0.30)", stroke: "oklch(0.60 0.28 320 / 0.80)" },
  vacant:       { fill: "oklch(0.98 0 0 / 0.04)",      stroke: "oklch(0.98 0 0 / 0.13)"       },
  housekeeping: { fill: "oklch(0.55 0.25 300 / 0.28)", stroke: "oklch(0.55 0.25 300 / 0.75)"  },
  maintenance:  { fill: "oklch(0.50 0.26 340 / 0.25)", stroke: "oklch(0.50 0.26 340 / 0.70)"  },
  checkout:     { fill: "oklch(0.60 0.23 60  / 0.20)", stroke: "oklch(0.60 0.23 60  / 0.65)"  },
};

const STATUSES: RoomStatus[] = ["occupied", "vacant", "housekeeping", "maintenance", "checkout"];

function HeroCanvas({ lang }: { lang: Lang }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const arrivals   = useCountUp(12, 1400, 900);
  const departures = useCountUp(8,  1200, 1050);
  const hk         = useCountUp(94, 1600, 750);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setPing(p => !p), 2400);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLS = 6, ROWS = 5, TOTAL = COLS * ROWS;
    const rooms = Array.from({ length: TOTAL }, (_, i) => ({
      status: STATUSES[i % STATUSES.length] as RoomStatus,
      pulse: 0,
      targetPulse: (i % 3 === 0) ? 0.7 : 0.1,
      nextChange: 80 + (i * 37) % 220,
      num: 101 + i,
    }));

    let frame = 0, af = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawAurora = (w: number, h: number, t: number) => {
      ctx.save();
      ctx.translate(w * 0.79, h * 0.17);
      const r = Math.min(w, h) * 0.29;

      for (let ring = 9; ring >= 0; ring--) {
        const progress = ring / 9;
        const ringR    = r * (0.25 + progress * 0.75);
        const wx       = Math.sin(t * 0.65 + ring * 0.85) * 9;
        const wy       = Math.cos(t * 0.48 + ring * 0.65) * 7;
        const hue      = 320 + Math.sin(t * 0.38 + ring * 0.45) * 32;
        const alpha    = (0.13 - progress * 0.01) * (0.55 + 0.45 * Math.sin(t * 0.55 + ring));
        const chroma   = 0.27 - progress * 0.05;
        const l        = 0.57 + progress * 0.06;

        const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, ringR);
        g.addColorStop(0,   `oklch(${l} ${chroma} ${hue} / ${Math.min(alpha * 3.2, 0.9)})`);
        g.addColorStop(0.4, `oklch(${l} ${chroma} ${hue - 18} / ${alpha})`);
        g.addColorStop(1,   `oklch(${l - 0.04} ${chroma - 0.06} ${hue - 35} / 0)`);

        ctx.beginPath();
        ctx.arc(wx, wy, ringR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.16);
      core.addColorStop(0,   `oklch(0.70 0.31 ${318 + Math.sin(t) * 14} / 0.75)`);
      core.addColorStop(0.6, `oklch(0.62 0.28 320 / 0.30)`);
      core.addColorStop(1,   `oklch(0.60 0.28 320 / 0)`);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      ctx.restore();
    };

    const drawFloorPlan = (w: number, h: number) => {
      const pad   = w * 0.055;
      const planW = w * 0.73;
      const planH = h * 0.60;
      const sx    = pad;
      const sy    = h * 0.275;
      const cellW = planW / COLS;
      const cellH = planH / ROWS;
      const gap   = 6, rad = 7;

      ctx.fillStyle   = "oklch(0.085 0.012 280 / 0.58)";
      ctx.strokeStyle = "oklch(0.98 0 0 / 0.055)";
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.roundRect(sx - 7, sy - 7, planW + 14, planH + 14, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "oklch(0.60 0.28 320 / 0.52)";
      ctx.font      = `bold ${Math.round(h * 0.022)}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText("PISO 1  \u2500  HOTEL", sx, sy - 15);

      rooms.forEach((room, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x   = sx + col * cellW + gap / 2;
        const y   = sy + row * cellH + gap / 2;
        const rw  = cellW - gap;
        const rh  = cellH - gap;
        const { fill, stroke } = STATUS_COLORS[room.status];
        const g   = room.pulse;

        ctx.fillStyle   = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth   = g > 0.5 ? 1.9 : 0.9;
        ctx.beginPath();
        ctx.roundRect(x, y, rw, rh, rad);
        ctx.fill();
        ctx.stroke();

        if (g > 0.08) {
          const base = stroke.substring(0, stroke.lastIndexOf("/"));
          const pg   = ctx.createRadialGradient(
            x + rw / 2, y + rh / 2, 0,
            x + rw / 2, y + rh / 2, Math.max(rw, rh) * 0.72
          );
          pg.addColorStop(0, `${base}/ ${Math.min(g * 0.50, 0.5)})`);
          pg.addColorStop(1, `${base}/ 0)`);
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.roundRect(x, y, rw, rh, rad);
          ctx.fill();
        }

        ctx.fillStyle = `oklch(0.88 0 0 / ${0.22 + g * 0.48})`;
        ctx.font      = `${Math.round(cellH * 0.20)}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(String(room.num), x + rw / 2, y + rh * 0.63);

        if (room.status !== "vacant") {
          const base = stroke.substring(0, stroke.lastIndexOf("/"));
          ctx.beginPath();
          ctx.arc(x + rw - 8, y + 8, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${base}/ 0.88)`;
          ctx.fill();
        }
      });
    };

    const drawLegend = (w: number, h: number) => {
      const entries: [string, string][] = [
        [lang === "es" ? "Ocupado"    : "Occupied",  "oklch(0.60 0.28 320 / 0.85)"],
        ["Housekeeping",                               "oklch(0.55 0.25 300 / 0.85)"],
        [lang === "es" ? "Check-out"  : "Checkout",  "oklch(0.60 0.23 60  / 0.85)"],
        [lang === "es" ? "Disponible" : "Vacant",    "oklch(0.65 0 0 / 0.38)"],
      ];
      const y0 = h * 0.955, x0 = w * 0.056, step = w * 0.172;
      ctx.font = `${Math.round(h * 0.019)}px sans-serif`;
      entries.forEach(([label, color], i) => {
        const x = x0 + i * step;
        ctx.beginPath();
        ctx.arc(x + 5, y0, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = "oklch(0.65 0 0 / 0.50)";
        ctx.textAlign = "left";
        ctx.fillText(label, x + 14, y0 + 4);
      });
    };

    const draw = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const t = frame / 60;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "oklch(0.07 0.008 280)";
      ctx.fillRect(0, 0, w, h);

      for (let gx = 0; gx < w; gx += 30) {
        for (let gy = 0; gy < h; gy += 30) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = "oklch(0.98 0 0 / 0.035)";
          ctx.fill();
        }
      }

      drawAurora(w, h, t);
      drawFloorPlan(w, h);
      drawLegend(w, h);

      rooms.forEach((room) => {
        room.pulse += (room.targetPulse - room.pulse) * 0.032;
        room.nextChange--;
        if (room.nextChange <= 0) {
          const next = (STATUSES.indexOf(room.status) + 1 + Math.floor(Math.random() * (STATUSES.length - 1))) % STATUSES.length;
          room.status      = STATUSES[next];
          room.targetPulse = 0.88;
          room.nextChange  = 110 + Math.floor(Math.random() * 260);
        }
        if (room.pulse > 0.74) room.targetPulse = 0.05;
      });

      frame++;
      af = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(af); window.removeEventListener("resize", resize); };
  }, [lang]);

  const ml = lang === "es"
    ? { arrivals: "Llegadas", dep: "Salidas", hk: "HK", live: "en vivo", status: "Estado operacional" }
    : { arrivals: "Arrivals",  dep: "Departures", hk: "HK", live: "live",    status: "Operational status" };

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} aria-hidden="true" suppressHydrationWarning
        className="absolute inset-0 h-full w-full" />

      <div className="absolute right-4 top-4"
        style={{ animation: "lp-rise 1s cubic-bezier(.16,1,.3,1) 0.55s both" }}>
        <div className="rounded-2xl border border-primary/20 bg-background/78 px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between gap-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary">{ml.status}</p>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${ping ? "animate-ping" : ""}`} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-widest text-primary/60">{ml.live}</span>
            </span>
          </div>
          <div className="flex gap-5">
            {[
              { label: ml.arrivals, value: arrivals,   suffix: "" },
              { label: ml.dep,      value: departures, suffix: "" },
              { label: ml.hk,       value: hk,         suffix: "%" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[9px] text-foreground/40">{item.label}</p>
                <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
                  {item.value}{item.suffix}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-border/40">
            <div className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${hk}%` }} />
          </div>
        </div>
      </div>
    </div>
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
=======
   COMPONENT
───────────────────────────────────────── */
export function LoginShell({ next, message, supabaseReady, signInAction, signUpAction }: LoginShellProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
>>>>>>> origin/main
  const [lang, setLang] = useState<Lang>("es");
  const c = copy[lang];

<<<<<<< HEAD
=======
  // Persist language preference
>>>>>>> origin/main
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/main
  return (
    <div suppressHydrationWarning className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">

<<<<<<< HEAD
      <header
        className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        style={{ animation: "lp-drop 0.5s ease both" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          <a href="/" className="flex items-center gap-3 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-[10px] font-black tracking-tight text-primary-foreground">N3</span>
            </div>
            <p className="text-sm font-bold tracking-[0.08em] text-foreground group-hover:text-primary transition-colors">N3URALIA</p>
          </a>

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

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} suppressHydrationWarning
=======
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Yagán</p>
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
>>>>>>> origin/main
              aria-label="Toggle language"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "es" ? "EN" : "ES"}
            </button>
<<<<<<< HEAD
            <a href="/auth/login"
              className="hidden rounded-lg border border-border/60 bg-card/60 px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary sm:block">
              {c.nav.signin}
            </a>
=======
>>>>>>> origin/main
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
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
            <a href="/auth/login"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]">
              {c.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#plataforma"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border/60 px-5 text-sm font-medium text-foreground/65 transition hover:border-primary/30 hover:text-foreground">
              {c.nav.platform}
            </a>
          </div>

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

        {/* Right — animated hotel floor plan canvas */}
        <div
          className="relative hidden h-[520px] overflow-hidden rounded-3xl border border-border/40 lg:block"
          style={{ animation: "lp-card 1s ease 0.1s both" }}
        >
          <HeroCanvas lang={lang} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* FEATURES */}
      <section id="plataforma" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <PlatformSection lang={lang} features={c.features} label={c.featuresLabel} />
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* AGENTS + AUTH */}
      <section id="agentes" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">

          {/* ── Left: text + pills + why cards + security ── */}
          <div className="flex-1 space-y-8 lg:max-w-[52%]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.agentLabel}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ whiteSpace: "pre-line" }}>
                {c.agentTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/60">{c.agentDesc}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {c.agents.map((agent) => (
                <span key={agent}
                  className="rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-foreground/70 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/8 hover:text-primary">
                  {agent}
                </span>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {c.why.map((item) => (
                <WhyCard key={item.title} icon={ICON_MAP[item.icon]} title={item.title} text={item.text} />
              ))}
            </div>

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

          {/* ── Right: animated agent messages demo ── */}
          <div className="w-full lg:sticky lg:top-20 lg:w-[44%]">
            <AgentMessagesDemo lang={lang} />
          </div>

        </div>
      </section>

      <footer className="border-t border-border/40">

        {/* ── Top brand strip ── */}
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-10 lg:px-10">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand column */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <span className="text-[10px] font-black text-primary-foreground">N3</span>
                </div>
                <span className="text-sm font-semibold tracking-tight">N3uralia</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/55 max-w-[220px]">
                {lang === "es"
                  ? "PMS agentivo para hoteleros. Ingresos, operaciones y huespedes en una sola torre de control."
                  : "Agentic PMS for hoteliers. Revenue, operations, and guests in one control tower."}
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-foreground/40">
                <span>N3uralia Inc. — {lang === "es" ? "Plataforma SaaS" : "SaaS Platform"}</span>
                <a href="mailto:hola@n3uralia.com" className="transition hover:text-foreground/70">hola@n3uralia.com</a>
              </div>
              {/* Social proof / LLM-readable authority signals */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(lang === "es"
                  ? ["PMS IA", "Revenue Management", "Automatizacion Hotelera"]
                  : ["AI PMS", "Revenue Management", "Hotel Automation"]
                ).map(t => (
                  <span key={t} className="rounded-full border border-border/50 px-2.5 py-0.5 text-[10px] text-foreground/40">{t}</span>
                ))}
              </div>
            </div>

            {/* Product links */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/30">
                {lang === "es" ? "Producto" : "Product"}
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/55">
                {(lang === "es" ? [
                  { label: "Plataforma PMS",         href: "#plataforma" },
                  { label: "Stack de Agentes IA",    href: "#agentes" },
                  { label: "Control operacional",    href: "#agentes" },
                  { label: "Revenue Management",     href: "#plataforma" },
                  { label: "Seguridad y auditorias", href: "#seguridad" },
                  { label: "Integraciones OTA",      href: "#agentes" },
                ] : [
                  { label: "PMS Platform",           href: "#plataforma" },
                  { label: "AI Agent Stack",         href: "#agentes" },
                  { label: "Operations control",     href: "#agentes" },
                  { label: "Revenue management",     href: "#plataforma" },
                  { label: "Security & audits",      href: "#seguridad" },
                  { label: "OTA integrations",       href: "#agentes" },
                ]).map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="transition hover:text-foreground/90">{l.label}</a>
                  </li>
=======
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
>>>>>>> origin/main
                ))}
              </ul>
            </div>

<<<<<<< HEAD
            {/* Use-cases / LLMO semantic anchors */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/30">
                {lang === "es" ? "Casos de uso" : "Use cases"}
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/55">
                {(lang === "es" ? [
                  "Hotel boutique independiente",
                  "Cadena hotelera regional",
                  "Hostal y B&B",
                  "Complejo de apartamentos",
                  "Revenue manager independiente",
                  "Director de operaciones",
                ] : [
                  "Independent boutique hotel",
                  "Regional hotel chain",
                  "Hostel & B&B",
                  "Apartment complex",
                  "Independent revenue manager",
                  "Operations director",
                ]).map(t => (
                  <li key={t} className="text-foreground/50">{t}</li>
                ))}
              </ul>
            </div>

            {/* Company + legal + CTA */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/30">
                {lang === "es" ? "Empresa" : "Company"}
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/55">
                {(lang === "es" ? [
                  { label: "Acerca de N3uralia",   href: "#" },
                  { label: "Blog y recursos",      href: "#" },
                  { label: "Solicitar demo",        href: "#" },
                  { label: "Precios",              href: "#" },
                  { label: "Terminos de servicio", href: "#" },
                  { label: "Politica de privacidad", href: "#" },
                ] : [
                  { label: "About N3uralia",    href: "#" },
                  { label: "Blog & resources",  href: "#" },
                  { label: "Request a demo",    href: "#" },
                  { label: "Pricing",           href: "#" },
                  { label: "Terms of service",  href: "#" },
                  { label: "Privacy policy",    href: "#" },
                ]).map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="transition hover:text-foreground/90">{l.label}</a>
                  </li>
                ))}
              </ul>

              {/* Mini CTA */}
              <div className="pt-2">
                <a href="#auth"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/15">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"/>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"/>
                  </span>
                  {lang === "es" ? "Solicitar acceso" : "Request access"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── LLM / GEO semantic block — machine-readable entity signals ── */}
        <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
          <div className="rounded-2xl border border-border/40 bg-card/20 px-6 py-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/25">
              {lang === "es" ? "Sobre la plataforma" : "About the platform"}
            </p>
            <p className="text-xs leading-relaxed text-foreground/35 max-w-4xl">
              {lang === "es"
                ? "N3uralia es un sistema de gestion hotelera (PMS) de nueva generacion impulsado por agentes de inteligencia artificial. Automatiza revenue management, operaciones, housekeeping, mensajeria con huespedes e integraciones con OTAs como Booking.com y Expedia. Disenado para hoteles boutique, cadenas regionales, hostales y gestores de apartamentos que buscan reducir errores operativos, aumentar la tarifa media diaria (ADR) y mejorar la experiencia del huesped sin aumentar el equipo."
                : "N3uralia is a next-generation hotel property management system (PMS) powered by AI agents. It automates revenue management, operations, housekeeping, guest messaging, and OTA integrations including Booking.com and Expedia. Designed for boutique hotels, regional chains, hostels, and apartment managers seeking to reduce operational errors, increase average daily rate (ADR), and improve guest experience without growing headcount."}
            </p>
            {/* Structured keyword anchors for GEO / LLMO */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(lang === "es" ? [
                "PMS hotelero con IA", "Revenue management automatico", "Housekeeping en tiempo real",
                "Integracion Booking.com", "Integracion Expedia", "Agente de ingresos hoteleros",
                "Software para hoteles boutique", "ADR optimizacion", "Upsell automatico hotel",
                "Control de operaciones hotel", "Gestion de huespedes IA",
              ] : [
                "AI hotel PMS", "Automated revenue management", "Real-time housekeeping",
                "Booking.com integration", "Expedia integration", "Hotel revenue agent",
                "Boutique hotel software", "ADR optimisation", "Automated hotel upsell",
                "Hotel operations control", "AI guest management",
              ]).map(k => (
                <span key={k} className="rounded-full bg-border/30 px-2.5 py-0.5 text-[10px] text-foreground/30">{k}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-border/30">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-foreground/35">
              <span>{lang === "es" ? "© 2026 N3uralia. Todos los derechos reservados." : "© 2026 N3uralia. All rights reserved."}</span>
              <a href="#" className="transition hover:text-foreground/60">{lang === "es" ? "Terminos" : "Terms"}</a>
              <a href="#" className="transition hover:text-foreground/60">{lang === "es" ? "Privacidad" : "Privacy"}</a>
              <a href="#" className="transition hover:text-foreground/60">Sitemap</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-foreground/25">
                {lang === "es" ? "Disponible en" : "Available in"} ES · EN
              </span>
              <button onClick={toggleLang} suppressHydrationWarning
                className="rounded-lg border border-border/50 px-3 py-1.5 text-xs text-foreground/40 transition hover:border-border hover:text-foreground/70">
                {lang === "es" ? "English" : "Espanol"}
              </button>
            </div>
          </div>
        </div>

=======
            <p className="mt-4 text-center text-xs leading-5 text-foreground/50">{c.auth.legal}</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/70 px-6 py-5 text-center text-xs text-foreground/50 lg:px-8">
        {c.footer}
>>>>>>> origin/main
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
<<<<<<< HEAD
          0%, 100% { transform: translate3d(0, 0, 0);   }
          50%      { transform: translate3d(0, 22px, 0); }
=======
          0%, 100% { transform: translate3d(0, 0, 0) scale(1);       }
          50%      { transform: translate3d(0, 18px, 0) scale(1.03); }
>>>>>>> origin/main
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
   AGENT MESSAGES DEMO
───────────────────────────────────────── */
type AgentMsg = {
  agent: string;
  role: string;
  color: string;
  border: string;
  bg: string;
  message: { es: string; en: string };
  detail?: { es: string; en: string };
  tag?: { es: string; en: string; tone: "green" | "yellow" | "red" | "blue" };
};

const AGENT_MESSAGES: AgentMsg[] = [
  {
    agent: "Revenue Strategist", role: "Ingresos",
    color: "text-primary", border: "border-primary/25", bg: "bg-primary/8",
    message: { es: "Demanda alta detectada para el viernes 20 jun. 8 habitaciones disponibles.", en: "High demand detected for Friday Jun 20. 8 rooms still available." },
    detail:  { es: "Recomiendo subir tarifa de $187 a $215 (+15%). Ocupacion proyectada: 97%.", en: "Recommend raising rate from $187 to $215 (+15%). Projected occupancy: 97%." },
    tag: { es: "Accion sugerida", en: "Suggested action", tone: "green" },
  },
  {
    agent: "Operations Commander", role: "Operaciones",
    color: "text-accent", border: "border-accent/25", bg: "bg-accent/8",
    message: { es: "3 habitaciones de check-out pendientes de limpieza: 204, 311, 408.", en: "3 checkout rooms pending housekeeping: 204, 311, 408." },
    detail:  { es: "Equipo A asignado. ETA 45 min. Hab. 311 llega a las 14:00 — prioridad alta.", en: "Team A assigned. ETA 45 min. Rm. 311 arrives at 14:00 — high priority." },
    tag: { es: "En progreso", en: "In progress", tone: "yellow" },
  },
  {
    agent: "Guest Concierge", role: "Huespedes",
    color: "text-secondary", border: "border-secondary/25", bg: "bg-secondary/8",
    message: { es: "Huesped VIP Martinez (hab. 501) solicita late check-out y traslado al aeropuerto.", en: "VIP guest Martinez (rm. 501) requests late check-out and airport transfer." },
    detail:  { es: "Late check-out hasta las 15:00 confirmado. Traslado reservado para las 16:30.", en: "Late check-out until 15:00 confirmed. Transfer booked for 16:30." },
    tag: { es: "Resuelto", en: "Resolved", tone: "green" },
  },
  {
    agent: "Trust Auditor", role: "Auditoria",
    color: "text-destructive", border: "border-destructive/25", bg: "bg-destructive/8",
    message: { es: "Anomalia detectada: 4 cargos de minibar sin registro de huesped activo.", en: "Anomaly detected: 4 minibar charges with no active guest record." },
    detail:  { es: "Cargos del 12-jun aislados. Requiere revision manual antes del cierre de turno.", en: "Charges from Jun-12 isolated. Requires manual review before shift close." },
    tag: { es: "Requiere revision", en: "Needs review", tone: "red" },
  },
  {
    agent: "Chief of Staff", role: "Orquestador",
    color: "text-primary", border: "border-primary/25", bg: "bg-primary/8",
    message: { es: "Resumen ejecutivo listo. RevPAR hoy: $271 (+9% vs ayer). Sin alertas criticas.", en: "Executive briefing ready. RevPAR today: $271 (+9% vs yesterday). No critical alerts." },
    detail:  { es: "Proxima accion: revisar propuesta de Revenue Strategist antes de las 13:00.", en: "Next action: review Revenue Strategist proposal before 13:00." },
    tag: { es: "Resumen diario", en: "Daily briefing", tone: "blue" },
  },
  {
    agent: "Integrations Engineer", role: "Integraciones",
    color: "text-accent", border: "border-accent/25", bg: "bg-accent/8",
    message: { es: "Sync con OTA completado: 12 reservas nuevas desde Booking.com y Expedia.", en: "OTA sync complete: 12 new reservations from Booking.com and Expedia." },
    detail:  { es: "Inventario actualizado en todos los canales. Sin conflictos de disponibilidad.", en: "Inventory updated across all channels. No availability conflicts." },
    tag: { es: "Sincronizado", en: "Synced", tone: "green" },
  },
];

const TAG_STYLES: Record<"green" | "yellow" | "red" | "blue", string> = {
  green:  "bg-green-500/10 text-green-400 border-green-500/30",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  red:    "bg-destructive/10 text-destructive border-destructive/30",
  blue:   "bg-primary/10 text-primary border-primary/25",
};

type ChatEntry = { msg: AgentMsg; showDetail: boolean; id: number };

function AgentMessagesDemo({ lang }: { lang: Lang }) {
  const [entries, setEntries] = useState<ChatEntry[]>([
    { msg: AGENT_MESSAGES[0], showDetail: false, id: 0 },
  ]);
  const [nextIdx, setNextIdx] = useState(1);
  const [counter, setCounter] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever entries change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  // Show detail for newly added entry after 600ms
  useEffect(() => {
    const last = entries[entries.length - 1];
    if (last && !last.showDetail) {
      const t = setTimeout(() => {
        setEntries(prev =>
          prev.map(e => e.id === last.id ? { ...e, showDetail: true } : e)
        );
      }, 600);
      return () => clearTimeout(t);
    }
  }, [entries]);

  // Append next message every 3.5s, cycling; keep last 6 visible
  useEffect(() => {
    const t = setTimeout(() => {
      const newEntry: ChatEntry = {
        msg: AGENT_MESSAGES[nextIdx % AGENT_MESSAGES.length],
        showDetail: false,
        id: counter,
      };
      setEntries(prev => [...prev.slice(-5), newEntry]);
      setNextIdx(i => i + 1);
      setCounter(c => c + 1);
    }, 3500);
    return () => clearTimeout(t);
  }, [entries, nextIdx, counter]);

  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-card/40 overflow-hidden" style={{ height: "calc(100vh - 90px)", maxHeight: "720px", minHeight: "480px" }}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
            {lang === "es" ? "Actividad de agentes — en vivo" : "Agent activity — live"}
          </span>
        </div>
        <span className="text-[10px] text-foreground/25">{entries.length * 2} {lang === "es" ? "eventos hoy" : "events today"}</span>
      </div>

      {/* Scrollable feed */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollBehavior: "smooth" }}>
        {entries.map((entry, i) => {
          const m = entry.msg;
          const isNewest = i === entries.length - 1;
          return (
            <div
              key={entry.id}
              style={{
                opacity: isNewest ? 1 : 0.72 - (entries.length - 1 - i) * 0.08,
                animation: "msg-in 0.45s cubic-bezier(.16,1,.3,1) both",
              }}
            >
              {/* Agent chip */}
              <div className={["flex items-center justify-between rounded-xl border px-3 py-2", m.border, m.bg].join(" ")}>
                <div className="flex items-center gap-2.5">
                  <div className={["flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-black", m.border, m.bg].join(" ")}>
                    <span className={m.color}>{m.agent[0]}</span>
                  </div>
                  <div>
                    <p className={["text-xs font-semibold leading-tight", m.color].join(" ")}>{m.agent}</p>
                    <p className="text-[9px] text-foreground/35">{m.role}</p>
                  </div>
                </div>
                {m.tag && (
                  <span className={["rounded-full border px-2 py-0.5 text-[9px] font-semibold", TAG_STYLES[m.tag.tone]].join(" ")}>
                    {lang === "es" ? m.tag.es : m.tag.en}
                  </span>
                )}
              </div>

              {/* Message text */}
              <div className="mt-2 px-1 space-y-1.5">
                <p className="text-sm leading-relaxed text-foreground/80">
                  {lang === "es" ? m.message.es : m.message.en}
                </p>
                {m.detail && (
                  <p
                    style={{
                      opacity: entry.showDetail ? 1 : 0,
                      transform: entry.showDetail ? "translateY(0)" : "translateY(4px)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                    className="text-sm leading-relaxed text-foreground/45"
                  >
                    {lang === "es" ? m.detail.es : m.detail.en}
                  </p>
                )}
              </div>

              {/* Divider between entries except last */}
              {i < entries.length - 1 && (
                <div className="mt-4 border-t border-border/30" />
              )}
            </div>
          );
        })}

        {/* Typing indicator for incoming message */}
        <div className="flex items-center gap-1.5 px-1" style={{ animation: "msg-in 0.4s ease both" }}>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/40 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs text-foreground/30">
          <span className="flex-1">{lang === "es" ? "Agentes monitoreando en tiempo real…" : "Agents monitoring in real time…"}</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
        </div>
      </div>

      <style>{`
        @keyframes msg-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
<<<<<<< HEAD

/* ── Feature Visual: per-feature canvas animation ── */
function FeatureVisual({ index }: { index: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width = c.offsetWidth || 420;
    const H = c.height = c.offsetHeight || 320;
    const draw = (ts: number) => {
      const t = ts / 1000;
      ctx.clearRect(0, 0, W, H);
      if (index === 0) {
        for (let r = 1; r <= 4; r++) {
          ctx.beginPath(); ctx.arc(W/2, H*0.42, r*34+Math.sin(t*0.8+r)*4, 0, Math.PI*2);
          ctx.strokeStyle = `oklch(0.60 0.28 320 / ${0.04+r*0.04})`; ctx.lineWidth=1; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(W/2, H*0.42, 6+Math.sin(t*2)*2, 0, Math.PI*2);
        ctx.fillStyle="oklch(0.60 0.28 320 / 0.9)"; ctx.fill();
        [0.72,0.91,0.58,0.84].forEach((v,i)=>{
          const bh=H*0.22*v, x=W*0.16+i*(W*0.19), by=H*0.82-bh;
          ctx.fillStyle=`oklch(0.60 0.28 320 / ${0.22+v*0.3})`;
          ctx.beginPath(); ctx.roundRect(x,by,W*0.14,bh,3); ctx.fill();
        });
      }
      if (index === 1) {
        const N=[{x:W*.5,y:H*.18},{x:W*.18,y:H*.48},{x:W*.5,y:H*.52},{x:W*.82,y:H*.48},{x:W*.33,y:H*.80},{x:W*.67,y:H*.80}];
        [[0,1],[0,2],[0,3],[2,4],[2,5],[1,4],[3,5]].forEach(([a,b],ei)=>{
          const p=((t*0.6+ei*0.3)%1);
          ctx.beginPath(); ctx.moveTo(N[a].x,N[a].y); ctx.lineTo(N[b].x,N[b].y);
          ctx.strokeStyle="oklch(0.55 0.25 300 / 0.18)"; ctx.lineWidth=1; ctx.stroke();
          ctx.beginPath(); ctx.arc(N[a].x+(N[b].x-N[a].x)*p, N[a].y+(N[b].y-N[a].y)*p, 2.5,0,Math.PI*2);
          ctx.fillStyle="oklch(0.60 0.28 320 / 0.8)"; ctx.fill();
        });
        N.forEach((n,ni)=>{
          ctx.beginPath(); ctx.arc(n.x,n.y,7+Math.sin(t*1.5+ni)*2,0,Math.PI*2);
          ctx.fillStyle=ni===0?"oklch(0.60 0.28 320 / 0.9)":"oklch(0.55 0.25 300 / 0.55)"; ctx.fill();
        });
      }
      if (index === 2) {
        const cols=6,rows=4,cw=W/(cols+1),ch=H/(rows+2);
        const st=[0,0,1,2,0,0,1,0,0,2,0,1,0,3,0,0,1,0,0,0,2,0,0,1];
        const cl=["oklch(0.60 0.28 320/0.75)","oklch(0.55 0.25 300/0.65)","oklch(0.68 0.18 80/0.70)","oklch(0.50 0.26 340/0.60)"];
        for(let r=0;r<rows;r++) for(let c2=0;c2<cols;c2++){
          const s=st[r*cols+c2], x=cw*(c2+0.5), y=ch*(r+1);
          ctx.fillStyle=cl[s]; ctx.beginPath(); ctx.roundRect(x,y,cw*.75,ch*.72,4); ctx.fill();
          if(s===1){ctx.beginPath();ctx.arc(x+cw*.65,y+5,2+Math.sin(t*2+r+c2)*1.2,0,Math.PI*2);ctx.fillStyle="oklch(0.98 0 0/0.5)";ctx.fill();}
        }
      }
      if (index === 3) {
        const pts=[0.45,0.52,0.48,0.61,0.58,0.70,0.67,0.78,0.75,0.88];
        const pad=W*.1,aw=W-pad*2,ah=H*.55,base=H*.75;
        for(let g=0;g<4;g++){ctx.beginPath();ctx.moveTo(pad,base-ah*(g/3));ctx.lineTo(W-pad,base-ah*(g/3));ctx.strokeStyle="oklch(0.98 0 0/0.05)";ctx.lineWidth=1;ctx.stroke();}
        ctx.beginPath(); pts.forEach((v,i)=>{const x=pad+(i/(pts.length-1))*aw,y=base-ah*v;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
        ctx.lineTo(W-pad,base); ctx.lineTo(pad,base); ctx.closePath();
        const g2=ctx.createLinearGradient(0,base-ah,0,base);
        g2.addColorStop(0,"oklch(0.60 0.28 320/0.22)"); g2.addColorStop(1,"oklch(0.60 0.28 320/0.0)");
        ctx.fillStyle=g2; ctx.fill();
        ctx.beginPath(); pts.forEach((v,i)=>{const x=pad+(i/(pts.length-1))*aw,y=base-ah*v;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
        ctx.strokeStyle="oklch(0.60 0.28 320/0.85)"; ctx.lineWidth=2; ctx.stroke();
        const lx=W-pad,ly=base-ah*.88,glow=Math.sin(t*2)*4+8;
        ctx.beginPath();ctx.arc(lx,ly,glow,0,Math.PI*2);ctx.fillStyle="oklch(0.60 0.28 320/0.12)";ctx.fill();
        ctx.beginPath();ctx.arc(lx,ly,4,0,Math.PI*2);ctx.fillStyle="oklch(0.60 0.28 320/1)";ctx.fill();
      }
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [index]);
  return <canvas ref={ref} className="h-full w-full" style={{ display:"block" }} />;
}

function PlatformSection({ lang, features, label }: {
  lang: Lang;
  features: { title: string; description: string; icon: string }[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const [dir, setDir]       = useState<"down"|"up">("down");
  useEffect(() => {
    const t = setTimeout(() => { setDir("down"); setActive(a=>(a+1)%features.length); }, 4000);
    return () => clearTimeout(t);
  }, [active, features.length]);
  const pick = (i: number) => { if (i===active) return; setDir(i>active?"down":"up"); setActive(i); };
  const f = features[active];
  return (
    <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-start lg:gap-16">
      <div className="flex-1 space-y-10 lg:max-w-[50%]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{label}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {lang==="es"?"Todo lo que necesita tu hotel.":"Everything your hotel needs."}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/55">
            {lang==="es"
              ?"Una plataforma que conecta ingresos, operaciones, huespedes e integraciones en un solo flujo inteligente."
              :"One platform connecting revenue, operations, guests, and integrations in a single intelligent flow."}
          </p>
        </div>
        <div className="space-y-2">
          {features.map((feat, i) => (
            <button key={feat.title} onClick={()=>pick(i)}
              className={["group w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                i===active?"border-primary/30 bg-primary/8":"border-border/50 bg-card/30 hover:border-border hover:bg-card/60"].join(" ")}>
              <div className="flex items-center gap-3">
                <div className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                  i===active?"border-primary/30 bg-primary/15 text-primary":"border-border/50 bg-card/60 text-foreground/40 group-hover:text-foreground/70"].join(" ")}>
                  {ICON_MAP[feat.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={["text-sm font-semibold transition-colors duration-200",
                    i===active?"text-foreground":"text-foreground/60 group-hover:text-foreground/80"].join(" ")}>{feat.title}</p>
                  {i===active&&(
                    <p className="mt-1 text-sm leading-relaxed text-foreground/55" style={{animation:"msg-in 0.35s ease both"}}>{feat.description}</p>
                  )}
                </div>
                {i===active&&(
                  <div className="ml-2 h-10 w-0.5 shrink-0 overflow-hidden rounded-full bg-border/40">
                    <div className="w-full rounded-full bg-primary" style={{animation:"progress-fill 4s linear both"}}/>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full lg:sticky lg:top-20 lg:w-[46%] lg:self-start">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40" style={{height:"420px"}}>
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/80 px-4 py-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"/>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"/>
              </span>
              <span key={active} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40" style={{animation:"msg-in 0.3s ease both"}}>{f.title}</span>
            </div>
            <div className="flex gap-1">
              {features.map((_,i)=>(
                <button key={i} onClick={()=>pick(i)} aria-label={`Feature ${i+1}`}
                  className={["h-1.5 rounded-full transition-all duration-300",i===active?"w-5 bg-primary":"w-1.5 bg-border/50 hover:bg-border"].join(" ")}/>
              ))}
            </div>
          </div>
          <div key={active} className="absolute inset-0 pt-10"
            style={{animation:`${dir==="down"?"plat-in-down":"plat-in-up"} 0.4s cubic-bezier(.16,1,.3,1) both`}}>
            <FeatureVisual index={active}/>
          </div>
          <div key={`d${active}`} className="absolute inset-x-0 bottom-0 border-t border-border/50 bg-card/80 px-5 py-4 backdrop-blur-sm"
            style={{animation:"msg-in 0.4s ease 0.15s both"}}>
            <p className="text-sm leading-relaxed text-foreground/70">{f.description}</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progress-fill{from{height:0%}to{height:100%}}
        @keyframes plat-in-down{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes plat-in-up  {from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description, index }: {
  icon: ReactNode; title: string; description: string; index: number;
}) {
=======
function MetricCard({ label, value, delta, delay }: { label: string; value: string; delta: string; delay: number }) {
>>>>>>> origin/main
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
