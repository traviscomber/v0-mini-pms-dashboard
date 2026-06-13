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
  const [lang, setLang] = useState<Lang>("es");
  const c = copy[lang];

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

  return (
    <div suppressHydrationWarning className="relative min-h-[100svh] overflow-x-hidden bg-background text-foreground">

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
              aria-label="Toggle language"
              className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-primary/30 hover:text-primary">
              <Globe className="h-3 w-3" />
              {lang === "es" ? "EN" : "ES"}
            </button>
            <a href="/auth/login"
              className="hidden rounded-lg border border-border/60 bg-card/60 px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary sm:block">
              {c.nav.signin}
            </a>
          </div>
        </div>
      </header>

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

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* AGENTS + AUTH */}
      <section id="agentes" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

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
          <div className="w-full lg:sticky lg:top-24 lg:w-[44%]">
            <AgentMessagesDemo lang={lang} />
          </div>

        </div>
      </section>

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
          0%, 100% { transform: translate3d(0, 0, 0);   }
          50%      { transform: translate3d(0, 22px, 0); }
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

function AgentMessagesDemo({ lang }: { lang: Lang }) {
  const [active, setActive]       = useState(0);
  const [visible, setVisible]     = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setVisible(true);
    setShowDetail(false);
    const t1 = setTimeout(() => setShowDetail(true), 550);
    const t2 = setTimeout(() => setVisible(false), 3700);
    const t3 = setTimeout(() => {
      setActive(a => (a + 1) % AGENT_MESSAGES.length);
    }, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);

  const msg = AGENT_MESSAGES[active];

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
            {lang === "es" ? "Actividad de agentes — en vivo" : "Agent activity — live"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {AGENT_MESSAGES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Message ${i + 1}`}
              className={["h-1.5 rounded-full transition-all duration-300", i === active ? "w-4 bg-primary" : "w-1.5 bg-border/60 hover:bg-border"].join(" ")} />
          ))}
        </div>
      </div>

      {/* Message */}
      <div style={{ minHeight: "140px" }} className="p-4">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-6px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
          {/* Agent chip */}
          <div className={["flex items-center justify-between rounded-xl border px-3 py-2", msg.border, msg.bg].join(" ")}>
            <div className="flex items-center gap-2.5">
              <div className={["flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-black", msg.border, msg.bg].join(" ")}>
                <span className={msg.color}>{msg.agent[0]}</span>
              </div>
              <div>
                <p className={["text-xs font-semibold leading-tight", msg.color].join(" ")}>{msg.agent}</p>
                <p className="text-[9px] text-foreground/35">{msg.role}</p>
              </div>
            </div>
            {msg.tag && (
              <span className={["rounded-full border px-2 py-0.5 text-[9px] font-semibold", TAG_STYLES[msg.tag.tone]].join(" ")}>
                {lang === "es" ? msg.tag.es : msg.tag.en}
              </span>
            )}
          </div>

          {/* Message text */}
          <div className="mt-2.5 px-1 space-y-1.5">
            <p className="text-sm leading-relaxed text-foreground/80">
              {lang === "es" ? msg.message.es : msg.message.en}
            </p>
            {msg.detail && (
              <p style={{ opacity: showDetail ? 1 : 0, transform: showDetail ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s" }}
                className="text-sm leading-relaxed text-foreground/45">
                {lang === "es" ? msg.detail.es : msg.detail.en}
              </p>
            )}
          </div>
        </div>
      </div>
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
