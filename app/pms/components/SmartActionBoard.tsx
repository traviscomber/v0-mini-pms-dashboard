"use client";

import { ArrowRight, BadgeDollarSign, CalendarCheck2, House, MessagesSquare, Sparkles, Wrench } from "lucide-react";

import type { Reservation, Room, Task } from "../types";

type QuickTarget = "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar";

interface SmartActionBoardProps {
  reservations: Reservation[];
  rooms: Room[];
  tasks: Task[];
  onNavigate: (section: QuickTarget) => void;
}

type ActionItem = {
  id: string;
  title: string;
  reason: string;
  impact: string;
  confidence: number;
  icon: typeof House;
  target: QuickTarget;
  accent: string;
};

function toDate(value: unknown) {
  if (!value) return new Date(0);
  return value instanceof Date ? value : new Date(value as string);
}

export default function SmartActionBoard({ reservations, rooms, tasks, onNavigate }: SmartActionBoardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const occupancy = rooms.length > 0
    ? reservations.filter((reservation) => {
        const status = String(reservation.reservationStatus ?? reservation.status ?? "").toLowerCase();
        const checkInDate = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
        const checkOutDate = toDate(reservation.checkOutDate ?? reservation.checkOut ?? reservation.check_out_date);
        return status !== "cancelled" && checkInDate <= today && checkOutDate > today;
      }).length / rooms.length
    : 0;

  const overduePayments = reservations.filter((reservation) => {
    const balanceDue = Number(reservation.balanceDue ?? 0);
    const status = String(reservation.paymentStatus ?? "").toLowerCase();
    return balanceDue > 0 && status !== "paid";
  });

  const housekeepingBacklog = tasks.filter((task) => String(task.type ?? "").toLowerCase() === "cleaning" && String(task.status ?? "").toLowerCase() !== "completed");
  const todayCheckIns = reservations.filter((reservation) => {
    const checkInDate = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
    return checkInDate.toDateString() === today.toDateString();
  });
  const pendingMessages = Math.max(0, todayCheckIns.length + overduePayments.length - housekeepingBacklog.length);

  const actions: ActionItem[] = [
    occupancy < 0.75
      ? {
          id: "occupancy",
          title: "Lift occupancy",
          reason: `Current occupancy is ${(occupancy * 100).toFixed(0)}% and there is room to sell more inventory.`,
          impact: "Protect revenue before the day closes.",
          confidence: 93,
          icon: BadgeDollarSign,
          target: "reservations",
          accent: "from-emerald-500/15 to-emerald-500/5",
        }
      : {
          id: "occupancy-stable",
          title: "Protect demand",
          reason: `Occupancy is already ${(occupancy * 100).toFixed(0)}%. Hold price discipline and avoid discounting too early.`,
          impact: "Preserve ADR and stay selective.",
          confidence: 84,
          icon: Sparkles,
          target: "reservations",
          accent: "from-cyan-500/15 to-cyan-500/5",
        },
    housekeepingBacklog.length > 0
      ? {
          id: "housekeeping",
          title: "Clear housekeeping backlog",
          reason: `${housekeepingBacklog.length} cleaning task${housekeepingBacklog.length === 1 ? "" : "s"} are still open.`,
          impact: "Prevent late rooms and check-in friction.",
          confidence: 91,
          icon: Wrench,
          target: "housekeeping",
          accent: "from-orange-500/15 to-orange-500/5",
        }
      : {
          id: "housekeeping-clear",
          title: "Housekeeping is under control",
          reason: "Cleaning flow is healthy right now.",
          impact: "Keep room readiness stable.",
          confidence: 87,
          icon: Wrench,
          target: "housekeeping",
          accent: "from-slate-500/15 to-slate-500/5",
        },
    overduePayments.length > 0
      ? {
          id: "collections",
          title: "Follow up on payments",
          reason: `${overduePayments.length} reservation${overduePayments.length === 1 ? "" : "s"} still have a balance due.`,
          impact: "Recover revenue and reduce checkout friction.",
          confidence: 96,
          icon: BadgeDollarSign,
          target: "ledger",
          accent: "from-rose-500/15 to-rose-500/5",
        }
      : {
          id: "communications",
          title: "Prepare guest comms",
          reason: `${todayCheckIns.length} check-in${todayCheckIns.length === 1 ? "" : "s"} are scheduled today and ${pendingMessages} message${pendingMessages === 1 ? "" : "s"} can be prepped.`,
          impact: "Make arrivals smoother and more personalized.",
          confidence: 88,
          icon: MessagesSquare,
          target: "messaging",
          accent: "from-purple-500/15 to-purple-500/5",
        },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Next best actions</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">What the system wants you to do now.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">
            This is the intelligence layer: it reads the day, ranks the work, and lets the team jump straight to execution.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/65">
          <CalendarCheck2 className="h-3.5 w-3.5 text-primary" />
          Live recommendations
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {actions.map((action) => (
          <article
            key={action.id}
            className={`rounded-3xl border border-border bg-gradient-to-br ${action.accent} p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/20`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-primary">
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">{action.title}</h4>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{action.confidence}% confidence</p>
                </div>
              </div>
              <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-foreground/60">
                priority
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-foreground/70">{action.reason}</p>
            <p className="mt-3 text-sm font-medium text-foreground">{action.impact}</p>

            <button
              type="button"
              onClick={() => onNavigate(action.target)}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Go there
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

