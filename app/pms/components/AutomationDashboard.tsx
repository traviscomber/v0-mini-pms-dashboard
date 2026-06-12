'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Zap, Mail, Home, CheckCircle2, Clock, Users, RefreshCw,
  CalendarCheck, BellRing, Star, ArrowRight, Play, Pause,
  MessageSquare, CreditCard, Shield,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    icon: React.ElementType;
    label: string;
    color: string;
  };
  actions: {
    icon: React.ElementType;
    label: string;
    color: string;
  }[];
  enabled: boolean;
  runsToday: number;
  category: 'guest' | 'housekeeping' | 'payment' | 'review';
}

// ─── Static automation rules (UI only — no backend needed yet) ───────────────

const AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'checkin-email',
    name: 'Check-in Welcome',
    description: 'Automatically send welcome message with door code 24h before arrival.',
    trigger: { icon: CalendarCheck, label: 'Guest checks in', color: 'oklch(0.58 0.27 320)' },
    actions: [
      { icon: Mail, label: 'Send welcome email', color: 'oklch(0.52 0.24 270)' },
      { icon: MessageSquare, label: 'Send SMS with code', color: 'oklch(0.56 0.25 290)' },
    ],
    enabled: true,
    runsToday: 3,
    category: 'guest',
  },
  {
    id: 'checkout-cleaning',
    name: 'Post-checkout Cleaning',
    description: 'Notify housekeeping as soon as a guest checks out.',
    trigger: { icon: CheckCircle2, label: 'Guest checks out', color: 'oklch(0.57 0.22 145)' },
    actions: [
      { icon: Home, label: 'Assign room cleaning', color: 'oklch(0.54 0.22 195)' },
      { icon: Clock, label: 'Set 2-hour deadline', color: 'oklch(0.60 0.23 60)' },
    ],
    enabled: true,
    runsToday: 2,
    category: 'housekeeping',
  },
  {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    description: 'Send a payment reminder 48 hours before check-in if balance is due.',
    trigger: { icon: Clock, label: '48h before arrival', color: 'oklch(0.60 0.23 60)' },
    actions: [
      { icon: CreditCard, label: 'Send payment link', color: 'oklch(0.55 0.26 25)' },
      { icon: Mail, label: 'Email reminder', color: 'oklch(0.52 0.24 270)' },
    ],
    enabled: true,
    runsToday: 5,
    category: 'payment',
  },
  {
    id: 'review-request',
    name: 'Review Request',
    description: 'Ask for a review 1 day after checkout via email.',
    trigger: { icon: CheckCircle2, label: '1 day after checkout', color: 'oklch(0.57 0.22 145)' },
    actions: [
      { icon: Star, label: 'Request review', color: 'oklch(0.60 0.23 60)' },
    ],
    enabled: false,
    runsToday: 0,
    category: 'review',
  },
  {
    id: 'new-booking-notify',
    name: 'New Booking Alert',
    description: 'Notify the property manager the moment a booking is confirmed.',
    trigger: { icon: BellRing, label: 'Booking confirmed', color: 'oklch(0.58 0.27 320)' },
    actions: [
      { icon: Mail, label: 'Email manager', color: 'oklch(0.52 0.24 270)' },
      { icon: Shield, label: 'Flag for review', color: 'oklch(0.54 0.24 350)' },
    ],
    enabled: true,
    runsToday: 1,
    category: 'guest',
  },
  {
    id: 'no-show',
    name: 'No-show Follow-up',
    description: 'If no check-in by 11 PM, mark as no-show and send manager alert.',
    trigger: { icon: Users, label: 'No check-in by 23:00', color: 'oklch(0.54 0.24 350)' },
    actions: [
      { icon: RefreshCw, label: 'Update status', color: 'oklch(0.56 0.25 290)' },
      { icon: Mail, label: 'Alert manager', color: 'oklch(0.52 0.24 270)' },
    ],
    enabled: true,
    runsToday: 0,
    category: 'guest',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  guest: 'Guest Experience',
  housekeeping: 'Housekeeping',
  payment: 'Payments',
  review: 'Reviews',
};

const CATEGORY_COLORS: Record<string, string> = {
  guest: 'oklch(0.58 0.27 320)',
  housekeeping: 'oklch(0.54 0.22 195)',
  payment: 'oklch(0.60 0.23 60)',
  review: 'oklch(0.57 0.22 145)',
};

// ─── Animated dot that travels along the pipeline ────────────────────────────

function PipelineDot({ active, delay = 0 }: { active: boolean; delay?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'oklch(0.58 0.27 320)',
        boxShadow: active ? '0 0 8px 2px oklch(0.58 0.27 320 / 60%)' : 'none',
        opacity: active ? 1 : 0.25,
        animation: active ? `ping-dot 1.6s ${delay}ms ease-in-out infinite` : 'none',
        flexShrink: 0,
      }}
    />
  );
}

// ─── Single workflow row ──────────────────────────────────────────────────────

function AutomationRow({
  rule,
  onToggle,
  index,
}: {
  rule: AutomationRule;
  onToggle: (id: string) => void;
  index: number;
}) {
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stagger initial animation per row
  useEffect(() => {
    if (!rule.enabled) return;
    const start = setTimeout(() => {
      setAnimating(true);
    }, index * 400);
    return () => clearTimeout(start);
  }, [rule.enabled, index]);

  // Pulse every 3s to simulate "live" firing
  useEffect(() => {
    if (!rule.enabled || !animating) return;
    const interval = setInterval(() => {
      setAnimating(false);
      timerRef.current = setTimeout(() => setAnimating(true), 200);
    }, 3000 + index * 800);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [rule.enabled, animating, index]);

  const TriggerIcon = rule.trigger.icon;

  return (
    <div
      className="group relative bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
      style={{
        boxShadow: rule.enabled ? '0 0 0 0 transparent' : undefined,
        animation: rule.enabled ? undefined : undefined,
      }}
    >
      {/* Top row: name + toggle */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${CATEGORY_COLORS[rule.category]}22`, color: CATEGORY_COLORS[rule.category] }}
          >
            <Zap size={15} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground text-sm">{rule.name}</p>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[rule.category]}22`,
                  color: CATEGORY_COLORS[rule.category],
                }}
              >
                {CATEGORY_LABELS[rule.category]}
              </span>
            </div>
            <p className="text-xs text-foreground/50 mt-0.5 leading-relaxed">{rule.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {rule.enabled && (
            <span className="text-xs text-foreground/40">{rule.runsToday} runs today</span>
          )}
          {/* Toggle switch */}
          <button
            onClick={() => onToggle(rule.id)}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              backgroundColor: rule.enabled ? 'oklch(0.58 0.27 320)' : 'oklch(0.28 0.04 280)',
            }}
            title={rule.enabled ? 'Disable' : 'Enable'}
          >
            <span
              className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200"
              style={{ transform: rule.enabled ? 'translateX(18px)' : 'translateX(3px)' }}
            />
          </button>
        </div>
      </div>

      {/* Pipeline visualisation */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {/* Trigger pill */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 transition-all duration-300"
          style={{
            backgroundColor: `${rule.trigger.color}18`,
            border: `1px solid ${rule.trigger.color}40`,
            boxShadow: animating ? `0 0 14px 2px ${rule.trigger.color}30` : 'none',
          }}
        >
          <TriggerIcon size={14} style={{ color: rule.trigger.color }} />
          <span className="text-xs font-medium" style={{ color: rule.trigger.color }}>
            {rule.trigger.label}
          </span>
        </div>

        {/* Animated connector + actions */}
        {rule.actions.map((action, i) => {
          const ActionIcon = action.icon;
          return (
            <div key={i} className="flex items-center gap-0 flex-shrink-0">
              {/* Connector line with dot */}
              <div className="flex items-center gap-1 px-2">
                <div
                  className="h-px w-6"
                  style={{ backgroundColor: 'oklch(1 0 0 / 12%)' }}
                />
                <PipelineDot active={animating && rule.enabled} delay={i * 200} />
                <div
                  className="h-px w-6"
                  style={{ backgroundColor: 'oklch(1 0 0 / 12%)' }}
                />
                <ArrowRight size={10} className="text-foreground/30 flex-shrink-0" />
              </div>

              {/* Action pill */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: `${action.color}18`,
                  border: `1px solid ${action.color}40`,
                  boxShadow: animating && rule.enabled ? `0 0 12px 1px ${action.color}25` : 'none',
                  transitionDelay: `${(i + 1) * 120}ms`,
                }}
              >
                <ActionIcon size={14} style={{ color: action.color }} />
                <span className="text-xs font-medium" style={{ color: action.color }}>
                  {action.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Disabled overlay hint */}
        {!rule.enabled && (
          <span className="ml-3 text-xs text-foreground/30 italic">paused</span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AutomationDashboard({
  tasks = [],
  alerts = [],
  criticalTasks = [],
  onTaskStatusChange,
  onAlertDismiss,
}: {
  tasks?: any[];
  alerts?: any[];
  criticalTasks?: any[];
  onTaskStatusChange?: (id: string, status: string) => void;
  onAlertDismiss?: (id: string) => void;
}) {
  const [rules, setRules] = useState(AUTOMATION_RULES);
  const [filter, setFilter] = useState<string>('all');

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled, runsToday: r.enabled ? 0 : r.runsToday } : r))
    );
  };

  const totalRuns = rules.reduce((s, r) => s + (r.enabled ? r.runsToday : 0), 0);
  const activeCount = rules.filter((r) => r.enabled).length;
  const categories = ['all', 'guest', 'housekeeping', 'payment', 'review'];

  const filtered = filter === 'all' ? rules : rules.filter((r) => r.category === filter);

  return (
    <div className="space-y-6">
      {/* ── Inject keyframes ── */}
      <style>{`
        @keyframes ping-dot {
          0%   { transform: scale(1);   opacity: 1;    }
          50%  { transform: scale(1.5); opacity: 0.7;  }
          100% { transform: scale(1);   opacity: 1;    }
        }
      `}</style>

      {/* ── Hero summary row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'oklch(0.58 0.27 320 / 15%)' }}
          >
            <Zap size={20} style={{ color: 'oklch(0.58 0.27 320)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            <p className="text-xs text-foreground/50">Active rules</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'oklch(0.57 0.22 145 / 15%)' }}
          >
            <Play size={20} style={{ color: 'oklch(0.57 0.22 145)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalRuns}</p>
            <p className="text-xs text-foreground/50">Runs today</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'oklch(0.52 0.24 270 / 15%)' }}
          >
            <Mail size={20} style={{ color: 'oklch(0.52 0.24 270)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalRuns * 2}</p>
            <p className="text-xs text-foreground/50">Messages sent</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'oklch(0.54 0.22 195 / 15%)' }}
          >
            <Home size={20} style={{ color: 'oklch(0.54 0.22 195)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{rules.filter(r => r.enabled && r.category === 'housekeeping').length}</p>
            <p className="text-xs text-foreground/50">Cleaning rules</p>
          </div>
        </div>
      </div>

      {/* ── Explainer banner ── */}
      <div
        className="rounded-xl p-5 border flex items-start gap-4"
        style={{
          background: 'oklch(0.58 0.27 320 / 6%)',
          borderColor: 'oklch(0.58 0.27 320 / 20%)',
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'oklch(0.58 0.27 320 / 15%)' }}
        >
          <Zap size={18} style={{ color: 'oklch(0.58 0.27 320)' }} />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-sm">How automations work</p>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Each rule watches for a <strong className="text-foreground/80">trigger event</strong> (e.g. guest checks in) and
            automatically runs one or more <strong className="text-foreground/80">actions</strong> (e.g. send an email, assign a cleaner).
            Toggle any rule on or off instantly. No code required.
          </p>
        </div>
      </div>

      {/* ── Category filter pills ── */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
            style={{
              backgroundColor: filter === cat ? 'oklch(0.58 0.27 320)' : 'oklch(0.28 0.04 280)',
              color: filter === cat ? 'oklch(0.98 0 0)' : 'oklch(0.70 0.01 0)',
              border: `1px solid ${filter === cat ? 'oklch(0.58 0.27 320 / 60%)' : 'oklch(1 0 0 / 8%)'}`,
            }}
          >
            {cat === 'all' ? 'All rules' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* ── Rule list ── */}
      <div className="space-y-3">
        {filtered.map((rule, i) => (
          <AutomationRow key={rule.id} rule={rule} onToggle={toggleRule} index={i} />
        ))}
      </div>
    </div>
  );
}
