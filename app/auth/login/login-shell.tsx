"use client";

import { useEffect, useRef, useState } from "react";

interface LoginShellProps {
  next: string;
  message?: string;
  supabaseReady: boolean;
  signInAction: (formData: FormData) => Promise<void>;
  signUpAction: (formData: FormData) => Promise<void>;
}

const STATS = [
  { label: "Occupancy rate", value: "94%", delta: "+12%" },
  { label: "Avg nightly rate", value: "$287", delta: "+8%" },
  { label: "Revenue / month", value: "$41k", delta: "+23%" },
];

const FEATURES = [
  { title: "Dynamic Pricing", description: "AI adjusts rates in real time based on demand, events, and competition." },
  { title: "Unified Inbox", description: "OTA messages, reviews, and tasks in one streamlined place." },
  { title: "Housekeeping", description: "Auto-assign tasks on checkout. Track status room by room." },
  { title: "Revenue Reports", description: "Visual P&L, channel mix, and forecasting at a glance." },
];

export function LoginShell({ next, message, supabaseReady, signInAction, signUpAction }: LoginShellProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    const gW = () => canvas.offsetWidth;
    const gH = () => canvas.offsetHeight;
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * gW(), y: Math.random() * gH(),
      r: Math.random() * 1.5 + 0.4, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      const w = gW(); const h = gH();
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x; const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(251,191,36,${0.07 * (1 - dist / 120)})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      }
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${d.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [mounted]);

  return (
    <div suppressHydrationWarning style={{ minHeight:"100svh", display:"flex", flexDirection:"column", background:"#09090d", color:"#f8fafc", fontFamily:"var(--font-sans)", position:"relative", overflow:"hidden" }}>
      {/* fade-in overlay rendered only client-side to avoid hydration mismatch */}
      {!mounted && (
        <div aria-hidden="true" style={{ position:"absolute", inset:0, background:"#09090d", zIndex:999, pointerEvents:"none" }} />
      )}
      {mounted && (
        <canvas ref={canvasRef} aria-hidden="true" style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />
      )}
      <div aria-hidden="true" style={{ position:"absolute", top:-200, left:-200, width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,191,36,0.09) 0%, transparent 65%)", pointerEvents:"none", zIndex:0 }} />

      {/* Header */}
      <header style={{ position:"relative", zIndex:10, borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(9,9,13,0.75)", backdropFilter:"blur(14px)", animation:"lp-fadein 0.5s ease both" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"1.25rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"1.35rem", fontWeight:800, letterSpacing:"-0.02em", background:"linear-gradient(90deg,#fbbf24,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>N3uralia</span>
          <nav style={{ display:"flex", gap:"1.75rem" }}>
            {["Features","Pricing","Support"].map(l => (
              <a key={l} href="#" style={{ fontSize:"0.8125rem", color:"#64748b", textDecoration:"none" }}
                onMouseEnter={e => (e.currentTarget.style.color="#f8fafc")} onMouseLeave={e => (e.currentTarget.style.color="#64748b")}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* Body */}
      <main style={{ position:"relative", zIndex:10, flex:1, display:"grid", gap:"3rem", maxWidth:1200, width:"100%", margin:"0 auto", padding:"3.5rem 1.5rem", alignItems:"center" }} className="lp-grid">
        
        {/* Hero */}
        <section style={{ display:"flex", flexDirection:"column", gap:"2rem", animation:"lp-fade-up 0.6s ease 0.1s both" }} className="lp-hero" aria-labelledby="hero-heading">
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.4rem 0.9rem", borderRadius:99, border:"1px solid rgba(251,191,36,0.25)", background:"rgba(251,191,36,0.07)", fontSize:"0.7rem", fontWeight:600, color:"#fbbf24", letterSpacing:"0.07em", textTransform:"uppercase", width:"fit-content" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#fbbf24", flexShrink:0, animation:"lp-pulse 2s ease-in-out infinite" }} />
            Live dashboard
          </div>
          <h1 id="hero-heading" style={{ fontSize:"clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.03em", margin:0 }}>
            Property Management
            <span style={{ display:"block", background:"linear-gradient(90deg,#fbbf24,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Reimagined</span>
          </h1>
          <p style={{ fontSize:"1.0625rem", lineHeight:1.65, color:"#94a3b8", maxWidth:480, margin:0 }}>
            AI-powered operations for boutique hotels and vacation rentals. Manage properties, maximize revenue, and delight guests — from one unified workspace.
          </p>
          <div style={{ display:"flex", gap:"0.875rem", flexWrap:"wrap" }} role="list">
            {STATS.map((s, i) => <StatCard key={s.label} stat={s} delay={0.15 + i * 0.1} />)}
          </div>
          <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"0.875rem" }} role="list">
            {FEATURES.map((f, i) => (
              <li key={f.title} style={{ display:"flex", alignItems:"flex-start", gap:"0.875rem", animation:`lp-slide-right 0.45s ease ${0.35 + i * 0.08}s both` }} role="listitem">
                <span style={{ flexShrink:0, marginTop:4, width:7, height:7, borderRadius:"50%", background:"#fbbf24", boxShadow:"0 0 8px rgba(251,191,36,0.6)" }} aria-hidden="true" />
                <div>
                  <p style={{ fontSize:"0.875rem", fontWeight:600, color:"#e2e8f0", margin:0 }}>{f.title}</p>
                  <p style={{ fontSize:"0.8rem", color:"#64748b", lineHeight:1.5, margin:"0.15rem 0 0" }}>{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Auth card */}
        <section style={{ animation:"lp-fade-up 0.65s ease 0.2s both" }} aria-label="Authentication">
          <div style={{ borderRadius:20, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(14,16,24,0.92)", backdropFilter:"blur(24px)", padding:"2rem", boxShadow:"0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.55)", display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            {/* Tabs */}
            <div role="tablist" style={{ display:"flex", padding:4, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
              {(["signin","signup"] as const).map(t => (
                <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)}
                  style={{ flex:1, padding:"0.55rem 1rem", border:"none", borderRadius:7, background: tab===t ? "rgba(255,255,255,0.09)" : "transparent", color: tab===t ? "#f8fafc" : "#64748b", fontSize:"0.8125rem", fontWeight: tab===t ? 600 : 500, cursor:"pointer", transition:"all 0.2s", boxShadow: tab===t ? "0 1px 6px rgba(0,0,0,0.3)" : "none" }}>
                  {t === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            {message && <div role="alert" style={{ borderRadius:10, padding:"0.75rem 1rem", fontSize:"0.8125rem", border:"1px solid rgba(251,191,36,0.25)", background:"rgba(251,191,36,0.07)", color:"#fde68a" }}>{message}</div>}
            {!supabaseReady && <div role="alert" style={{ borderRadius:10, padding:"0.75rem 1rem", fontSize:"0.8125rem", border:"1px solid rgba(248,113,113,0.25)", background:"rgba(248,113,113,0.06)", color:"#fca5a5" }}>Supabase is not configured. Add environment variables to enable authentication.</div>}

            {tab === "signin" && (
              <form action={signInAction} style={{ display:"flex", flexDirection:"column", gap:"1rem" }} noValidate>
                <input type="hidden" name="next" value={next} />
                <AuthInput label="Email" name="email" type="email" placeholder="you@property.com" autoComplete="email" />
                <AuthInput label="Password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                <AuthButton label="Sign in to workspace" />
              </form>
            )}
            {tab === "signup" && (
              <form action={signUpAction} style={{ display:"flex", flexDirection:"column", gap:"1rem" }} noValidate>
                <AuthInput label="Full name" name="fullName" type="text" placeholder="Your name" />
                <AuthInput label="Email" name="email" type="email" placeholder="you@property.com" autoComplete="email" />
                <AuthInput label="Password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" hint="Minimum 8 characters" minLength={8} />
                <AuthButton label="Create account" />
              </form>
            )}

            <p style={{ fontSize:"0.7rem", color:"#475569", textAlign:"center", lineHeight:1.5 }}>
              By continuing you agree to our{" "}
              <a href="#" style={{ color:"#64748b", textDecoration:"underline" }}>Terms</a> and{" "}
              <a href="#" style={{ color:"#64748b", textDecoration:"underline" }}>Privacy Policy</a>.
            </p>
          </div>
        </section>
      </main>

      <footer style={{ position:"relative", zIndex:10, borderTop:"1px solid rgba(255,255,255,0.05)", padding:"1.125rem 2rem", textAlign:"center", fontSize:"0.7rem", color:"#334155" }}>
        © 2025 N3uralia — Enterprise hospitality platform
      </footer>

      <style>{`
        @keyframes lp-fadein    { from { opacity:0 } to { opacity:1 } }
        @keyframes lp-fade-up   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes lp-slide-right { from { opacity:0; transform:translateX(-12px) } to { opacity:1; transform:translateX(0) } }
        @keyframes lp-pulse     { 0%,100% { box-shadow:0 0 0 0 rgba(251,191,36,0.6) } 50% { box-shadow:0 0 0 5px rgba(251,191,36,0) } }
        @keyframes lp-stat-in   { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
        .lp-grid { grid-template-columns: 1fr; }
        @media (min-width: 960px) {
          .lp-grid { grid-template-columns: 1fr 440px !important; padding: 4rem 2rem !important; }
          .lp-hero { display: flex !important; }
        }
        @media (max-width: 959px) { .lp-hero { display: none !important; } }
      `}</style>
    </div>
  );
}

function StatCard({ stat, delay }: { stat: typeof STATS[number]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div role="listitem" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ flex:1, minWidth:100, padding:"1rem 1.125rem", borderRadius:12, border: hovered ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(255,255,255,0.07)", background: hovered ? "rgba(251,191,36,0.04)" : "rgba(255,255,255,0.03)", display:"flex", flexDirection:"column", gap:"0.2rem", animation:`lp-stat-in 0.5s ease ${delay}s both`, transition:"border-color 0.25s, background 0.25s", cursor:"default" }}>
      <span style={{ fontSize:"1.4rem", fontWeight:700, color:"#f8fafc", letterSpacing:"-0.02em" }}>{stat.value}</span>
      <span style={{ fontSize:"0.685rem", textTransform:"uppercase", letterSpacing:"0.07em", color:"#64748b" }}>{stat.label}</span>
      <span style={{ fontSize:"0.75rem", fontWeight:600, color:"#4ade80" }}>{stat.delta}</span>
    </div>
  );
}

interface AuthInputProps { label:string; name:string; type:string; placeholder:string; autoComplete?:string; hint?:string; minLength?:number; }
function AuthInput({ label, name, type, placeholder, autoComplete, hint, minLength }: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display:"flex", flexDirection:"column", gap:"0.375rem", fontSize:"0.8125rem", fontWeight:500, color:"#cbd5e1" }}>
      <span>{label}</span>
      <input type={type} name={name} required suppressHydrationWarning placeholder={placeholder} autoComplete={autoComplete} minLength={minLength}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:"100%", padding:"0.75rem 1rem", borderRadius:10, border: focused ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.1)", background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", color:"#f8fafc", fontSize:"0.875rem", outline:"none", transition:"border-color 0.2s, background 0.2s, box-shadow 0.2s", boxShadow: focused ? "0 0 0 3px rgba(251,191,36,0.1)" : "none", caretColor:"#fbbf24", boxSizing:"border-box" as const }} />
      {hint && <span style={{ fontSize:"0.71rem", color:"#475569" }}>{hint}</span>}
    </label>
  );
}

function AuthButton({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="submit" suppressHydrationWarning onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width:"100%", marginTop:"0.25rem", padding:"0.825rem 1rem", border:"none", borderRadius:10, background:"linear-gradient(135deg,#fbbf24 0%,#f97316 100%)", color:"#0a0a0a", fontSize:"0.875rem", fontWeight:700, letterSpacing:"0.01em", cursor:"pointer", transition:"opacity 0.2s, transform 0.15s, box-shadow 0.2s", opacity: hovered ? 0.9 : 1, transform: hovered ? "translateY(-1px)" : "translateY(0)", boxShadow: hovered ? "0 8px 32px rgba(251,191,36,0.35)" : "0 4px 20px rgba(251,191,36,0.2)" }}>
      {label}
    </button>
  );
}
