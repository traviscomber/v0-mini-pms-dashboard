"use client";

import { useState, useRef } from "react";
import {
  Building2,
  BedDouble,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomDraft {
  name: string;
  type: string;
  capacity: number;
  basePrice: number;
}

interface OnboardingWizardProps {
  propertyName: string;
  onComplete: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROOM_TYPES = ["room", "suite", "studio", "apartment", "villa", "cabin"];

const STEP_META = [
  { icon: Sparkles,     label: "Welcome"   },
  { icon: Building2,    label: "Property"  },
  { icon: BedDouble,    label: "Rooms"     },
  { icon: CheckCircle2, label: "All set"   },
];

// ─── Step progress bar ────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEP_META.map((meta, idx) => {
        const Icon = meta.icon;
        const done    = idx < current;
        const active  = idx === current;

        return (
          <div key={idx} className="flex items-center gap-0 flex-1 last:flex-none">
            {/* circle */}
            <div
              style={{
                width: 40, height: 40, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: done
                  ? "oklch(0.57 0.22 145)"        // emerald — done
                  : active
                  ? "oklch(0.58 0.27 320)"         // magenta — active
                  : "oklch(0.18 0.01 280)",        // muted — future
                transition: "background 0.35s ease",
                boxShadow: active ? "0 0 18px oklch(0.58 0.27 320 / 0.50)" : "none",
              }}
            >
              <Icon
                size={18}
                style={{
                  color: done || active ? "oklch(0.98 0 0)" : "oklch(0.50 0.01 280)",
                  transition: "color 0.35s",
                }}
              />
            </div>

            {/* connector */}
            {idx < STEP_META.length - 1 && (
              <div
                style={{
                  flex: 1, height: 2,
                  background: done
                    ? "oklch(0.57 0.22 145)"
                    : "oklch(0.20 0.01 280)",
                  transition: "background 0.5s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Animated wrapper ─────────────────────────────────────────────────────────

function SlideIn({ children, key: _key }: { children: React.ReactNode; key: number }) {
  return (
    <div
      style={{
        animation: "slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {children}
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────

function StepWelcome({
  propertyName,
  onNext,
}: {
  propertyName: string;
  onNext: () => void;
}) {
  return (
    <div className="text-center space-y-8">
      <div
        style={{
          width: 80, height: 80, borderRadius: "50%", margin: "0 auto",
          background: "oklch(0.58 0.27 320)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px oklch(0.58 0.27 320 / 0.45)",
          animation: "pulse-glow 2.5s ease-in-out infinite",
        }}
      >
        <Sparkles size={36} style={{ color: "oklch(0.98 0 0)" }} />
      </div>

      <div>
        <h1 className="text-4xl font-bold text-balance mb-3">
          Welcome{propertyName ? ` to ${propertyName}` : ""}
        </h1>
        <p className="text-foreground/60 text-lg max-w-md mx-auto text-pretty">
          Your PMS is ready. This quick setup takes under 2 minutes — add your rooms and you are live.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-sm">
        {[
          { step: "1", text: "Add rooms" },
          { step: "2", text: "Take bookings" },
          { step: "3", text: "Manage guests" },
        ].map(({ step, text }) => (
          <div
            key={step}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card"
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "oklch(0.58 0.27 320 / 0.15)",
                border: "1px solid oklch(0.58 0.27 320 / 0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: "oklch(0.58 0.27 320)",
              }}
            >
              {step}
            </div>
            <span className="text-foreground/70 font-medium">{text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 36px", borderRadius: 12,
          background: "oklch(0.58 0.27 320)",
          color: "oklch(0.98 0 0)",
          fontSize: 16, fontWeight: 700,
          border: "none", cursor: "pointer",
          boxShadow: "0 0 28px oklch(0.58 0.27 320 / 0.4)",
          transition: "filter 0.15s, transform 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
      >
        Get started <ArrowRight size={18} />
      </button>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 28px oklch(0.58 0.27 320 / 0.40); }
          50%       { box-shadow: 0 0 52px oklch(0.58 0.27 320 / 0.70); }
        }
      `}</style>
    </div>
  );
}

// ─── Step 1: Property info (read-only confirm) ────────────────────────────────

function StepProperty({
  propertyName,
  onNext,
}: {
  propertyName: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Your property</h2>
        <p className="text-foreground/60">Confirm the details below. You can change them later in Settings.</p>
      </div>

      <div
        className="rounded-2xl border border-border bg-card p-6 space-y-4"
        style={{ boxShadow: "0 0 0 1px oklch(0.58 0.27 320 / 0.15)" }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: 56, height: 56, borderRadius: 14,
              background: "oklch(0.58 0.27 320 / 0.12)",
              border: "1px solid oklch(0.58 0.27 320 / 0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Building2 size={24} style={{ color: "oklch(0.58 0.27 320)" }} />
          </div>
          <div>
            <p className="text-sm text-foreground/50 font-medium uppercase tracking-wide">Property name</p>
            <p className="text-xl font-bold">{propertyName || "My Property"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { label: "Type",     value: "Boutique / B&B" },
            { label: "Status",   value: "Active" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-background p-4 border border-border">
              <p className="text-xs text-foreground/50 mb-1">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 28px", borderRadius: 10,
            background: "oklch(0.58 0.27 320)",
            color: "oklch(0.98 0 0)",
            fontSize: 15, fontWeight: 700,
            border: "none", cursor: "pointer",
            transition: "filter 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}
        >
          Next — Add rooms <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Add rooms ────────────────────────────────────────────────────────

function StepRooms({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [rooms, setRooms] = useState<RoomDraft[]>([
    { name: "Room 1", type: "room", capacity: 2, basePrice: 100 },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function addRoom() {
    setRooms(prev => [
      ...prev,
      { name: `Room ${prev.length + 1}`, type: "room", capacity: 2, basePrice: 100 },
    ]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function removeRoom(idx: number) {
    setRooms(prev => prev.filter((_, i) => i !== idx));
  }

  function update(idx: number, patch: Partial<RoomDraft>) {
    setRooms(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  async function save() {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/pms/rooms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooms }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Failed to save rooms");
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Add your rooms</h2>
        <p className="text-foreground/60">
          Start with the rooms you have. You can add more anytime.
        </p>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {rooms.map((room, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-4"
            style={{
              animation: "slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: `${idx * 40}ms`,
            }}
          >
            {/* Row 1: name + delete */}
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: "oklch(0.58 0.27 320 / 0.12)",
                  border: "1px solid oklch(0.58 0.27 320 / 0.30)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                  color: "oklch(0.58 0.27 320)",
                }}
              >
                {idx + 1}
              </div>
              <input
                value={room.name}
                onChange={e => update(idx, { name: e.target.value })}
                placeholder="Room name"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary"
              />
              {rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(idx)}
                  className="p-2 rounded-lg text-foreground/40 hover:text-destructive hover:bg-destructive/10 transition"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            {/* Row 2: type / capacity / price */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Type</label>
                <select
                  value={room.type}
                  onChange={e => update(idx, { type: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-primary capitalize"
                >
                  {ROOM_TYPES.map(t => (
                    <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Guests</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={room.capacity}
                  onChange={e => update(idx, { capacity: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Price / night</label>
                <input
                  type="number"
                  min={0}
                  value={room.basePrice}
                  onChange={e => update(idx, { basePrice: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <button
        onClick={addRoom}
        className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition"
      >
        <Plus size={16} /> Add another room
      </button>

      {error && (
        <p className="text-sm font-medium" style={{ color: "oklch(0.58 0.28 350)" }}>
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving || rooms.length === 0}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 32px", borderRadius: 10,
            background: "oklch(0.58 0.27 320)",
            color: "oklch(0.98 0 0)",
            fontSize: 15, fontWeight: 700,
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "filter 0.15s, opacity 0.15s",
          }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = "brightness(1.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
        >
          {saving ? (
            <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving rooms...</>
          ) : (
            <>Save {rooms.length} room{rooms.length !== 1 ? "s" : ""} <ChevronRight size={16} /></>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Step 3: All set ──────────────────────────────────────────────────────────

function StepDone({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-8">
      {/* animated checkmark ring */}
      <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto" }}>
        <svg viewBox="0 0 100 100" style={{ width: 100, height: 100, transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(0.57 0.22 145 / 0.20)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="oklch(0.57 0.22 145)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset="0"
            style={{ animation: "draw-ring 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          />
        </svg>
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <CheckCircle2 size={38} style={{ color: "oklch(0.57 0.22 145)", animation: "pop-in 0.4s 0.7s cubic-bezier(0.16, 1, 0.3, 1) both" }} />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-3">You are all set!</h2>
        <p className="text-foreground/60 text-lg max-w-sm mx-auto">
          Your rooms are saved and your PMS is live. Take your first booking now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-sm">
        {[
          { label: "Rooms added",   color: "oklch(0.57 0.22 145)" },
          { label: "Booking ready", color: "oklch(0.58 0.27 320)" },
        ].map(({ label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card"
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span className="text-foreground/70 font-medium">{label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 40px", borderRadius: 12,
          background: "oklch(0.57 0.22 145)",
          color: "oklch(0.98 0 0)",
          fontSize: 16, fontWeight: 700,
          border: "none", cursor: "pointer",
          boxShadow: "0 0 28px oklch(0.57 0.22 145 / 0.40)",
          transition: "filter 0.15s, transform 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
      >
        Open dashboard <ArrowRight size={18} />
      </button>

      <style>{`
        @keyframes draw-ring {
          from { stroke-dashoffset: ${2 * Math.PI * 44}; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function OnboardingWizard({ propertyName, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);

  function next() {
    setStep(s => s + 1);
  }

  return (
    /* Full-screen overlay */
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "oklch(0.08 0.008 280 / 0.92)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 560,
          background: "oklch(0.12 0.01 280)",
          border: "1px solid oklch(1 0 0 / 10%)",
          borderRadius: 24,
          padding: "40px 44px",
          boxShadow: "0 32px 80px oklch(0 0 0 / 0.60), 0 0 0 1px oklch(0.58 0.27 320 / 0.12)",
          animation: "modal-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <StepBar current={step} />

        <SlideIn key={step}>
          {step === 0 && <StepWelcome propertyName={propertyName} onNext={next} />}
          {step === 1 && <StepProperty propertyName={propertyName} onNext={next} />}
          {step === 2 && <StepRooms onComplete={next} />}
          {step === 3 && <StepDone onComplete={onComplete} />}
        </SlideIn>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
