"use client";

import { AlertTriangle, ArrowRight, CalendarClock, MessageSquareText, ShieldCheck, Wallet } from "lucide-react";
import { useMemo } from "react";

import type { Alert, Reservation, Room, Task } from "../types";

type SignalRoute = "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar";

type Signal = {
  id: string;
  title: string;
  description: string;
  route: SignalRoute;
  cta: string;
  score: number;
  tone: "critical" | "warning" | "info";
  icon: typeof Wallet;
};

interface OperationalSignalBoardProps {
  alerts: Alert[];
  reservations: Reservation[];
  rooms: Room[];
  tasks: Task[];
  onNavigate: (section: SignalRoute) => void;
}

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function toDate(value: unknown) {
  if (!value) return new Date(0);
  return value instanceof Date ? value : new Date(value as string);
}

function isPendingTask(task: Task) {
  return String(task.status ?? "").toLowerCase() === "pending" || String(task.status ?? "").toLowerCase() === "todo";
}

export default function OperationalSignalBoard({
  alerts,
  reservations,
  rooms,
  tasks,
  onNavigate,
}: OperationalSignalBoardProps) {
  const signals = useMemo<Signal[]>(() => {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const next48h = new Date(today);
    next48h.setDate(next48h.getDate() + 2);

    const overduePayments = reservations.filter((reservation) => Number(reservation.balanceDue ?? 0) > 0);
    const arrivingSoon = reservations.filter((reservation) => {
      const checkIn = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
      const status = String(reservation.reservationStatus ?? reservation.status ?? "").toLowerCase();
      return status !== "cancelled" && checkIn >= today && checkIn <= next48h;
    });
    const activeRoomsNeedingAttention = rooms.filter((room) => {
      const status = String(room.status ?? "").toLowerCase();
      return status === "maintenance" || status === "blocked";
    });
    const openOperationalTasks = tasks.filter(isPendingTask);
    const criticalAlerts = alerts.filter((alert) => String(alert.level ?? "").toLowerCase() === "critical");

    return [
      {
        id: "cash",
        title: overduePayments.length > 0 ? `${overduePayments.length} balance${overduePayments.length > 1 ? "s" : ""} need collection` : "No payment leakage detected",
        description: overduePayments.length > 0
          ? `There are ${overduePayments.length} reservation${overduePayments.length > 1 ? "s" : ""} with an outstanding balance. Prioritize the highest-value folio first.`
          : "Ledger is clear on the current sample. Keep watching arriving guests with open folios.",
        route: "ledger",
        cta: overduePayments.length > 0 ? "Open ledger" : "Review cash flow",
        score: overduePayments.length > 0 ? 96 : 68,
        tone: overduePayments.length > 0 ? "critical" : "info",
        icon: Wallet,
      },
      {
        id: "arrival",
        title: arrivingSoon.length > 0 ? `${arrivingSoon.length} arrival${arrivingSoon.length > 1 ? "s" : ""} in the next 48h` : "No near-term arrivals",
        description: arrivingSoon.length > 0
          ? "Send the pre-arrival note, confirm preferences, and flag any special requests before check-in rush."
          : "This property has breathing room on the front desk calendar right now.",
        route: "messaging",
        cta: "Draft messages",
        score: arrivingSoon.length > 0 ? 91 : 62,
        tone: arrivingSoon.length > 0 ? "warning" : "info",
        icon: MessageSquareText,
      },
      {
        id: "rooms",
        title: activeRoomsNeedingAttention.length > 0 ? `${activeRoomsNeedingAttention.length} room${activeRoomsNeedingAttention.length > 1 ? "s" : ""} need attention` : "Rooms are operationally stable",
        description: activeRoomsNeedingAttention.length > 0
          ? "Maintenance or blocked rooms should be resolved before they affect sellable inventory."
          : "No maintenance blockage is visible in the current room set.",
        route: "housekeeping",
        cta: "Open housekeeping",
        score: activeRoomsNeedingAttention.length > 0 ? 88 : 64,
        tone: activeRoomsNeedingAttention.length > 0 ? "warning" : "info",
        icon: ShieldCheck,
      },
      {
        id: "workload",
        title: openOperationalTasks.length > 0 ? `${openOperationalTasks.length} open task${openOperationalTasks.length > 1 ? "s" : ""} in the queue` : "Queue is clear",
        description: openOperationalTasks.length > 0
          ? "Convert open tasks into a focused work plan so the team can clear the highest-value items first."
          : "Operations are caught up. This is the right time to pre-empt tomorrow's work.",
        route: "calendar",
        cta: "Review timeline",
        score: openOperationalTasks.length > 0 ? 79 : 58,
        tone: openOperationalTasks.length > 0 ? "info" : "info",
        icon: CalendarClock,
      },
    ].sort((left, right) => right.score - left.score);
  }, [alerts, reservations, rooms, tasks]);

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Operational intelligence</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">What the system thinks matters most.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">
            Prioritized signals help the team decide fast, with the reason attached to every recommendation.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/70">
          <AlertTriangle className="h-3.5 w-3.5 text-primary" />
          Autogenerated from live PMS data
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {signals.map((signal) => {
          const Icon = signal.icon;

          return (
            <article key={signal.id} className="rounded-3xl border border-border bg-background/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold text-foreground">{signal.title}</h4>
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          signal.tone === "critical"
                            ? "bg-red-500/10 text-red-300"
                            : signal.tone === "warning"
                              ? "bg-amber-500/10 text-amber-300"
                              : "bg-primary/10 text-primary",
                        ].join(" ")}
                      >
                        {signal.score}% confidence
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground/65">{signal.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-border/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-emerald-400"
                  style={{ width: `${signal.score}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => onNavigate(signal.route)}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/25 hover:bg-primary/5"
              >
                {signal.cta}
                <ArrowRight className="h-4 w-4 text-primary" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
