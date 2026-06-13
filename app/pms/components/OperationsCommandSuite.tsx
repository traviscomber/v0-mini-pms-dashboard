"use client";

import { Activity, Layers3, Sparkles } from "lucide-react";

import AlertBanner from "./AlertBanner";
import AgentControlTower from "./AgentControlTower";
import ExecutiveBriefing from "./ExecutiveBriefing";
import OperationalSignalBoard from "./OperationalSignalBoard";
import SmartActionBoard from "./SmartActionBoard";
import SmartMessageBoard from "./SmartMessageBoard";
import TodayCommandCenter from "./TodayCommandCenter";
import type { Alert, Reservation, Room, Task } from "../types";

interface OperationsCommandSuiteProps {
  alerts: Alert[];
  isLoading: boolean;
  reservations: Reservation[];
  rooms: Room[];
  tasks: Task[];
  onNavigate: (section: "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar") => void;
  onExecute: (section: "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar", title: string, reason: string) => void;
  onSelectReservation?: (reservation: Reservation) => void;
}

export default function OperationsCommandSuite({
  alerts,
  isLoading,
  reservations,
  rooms,
  tasks,
  onNavigate,
  onExecute,
  onSelectReservation,
}: OperationsCommandSuiteProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-card/70 px-6 py-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Operations command suite
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Three layers, one operating truth.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">
                Start with the executive read, let the agent stack propose the next best move, then execute from today's command center.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: Activity, label: "Live PMS data" },
              { icon: Layers3, label: "3 decision layers" },
              { icon: Sparkles, label: "Agentic workflows" },
            ].map((item) => (
              <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/70">
                <item.icon className="h-3.5 w-3.5 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {alerts.length > 0 ? <AlertBanner alerts={alerts} /> : null}

      <OperationalSignalBoard
        alerts={alerts}
        reservations={reservations}
        rooms={rooms}
        tasks={tasks}
        onNavigate={onNavigate}
      />

      <SmartActionBoard
        reservations={reservations}
        rooms={rooms}
        tasks={tasks}
        onNavigate={onNavigate}
        onExecute={onExecute}
      />

      <div className="space-y-3">
        <SectionLabel number="01" title="Executive Briefing" subtitle={isLoading ? "Reading live PMS data..." : "Risk, cash flow, readiness, and the next best action."} />
        <ExecutiveBriefing isLoading={isLoading} reservations={reservations} rooms={rooms} tasks={tasks} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="space-y-3">
          <SectionLabel number="02" title="Agent Control Tower" subtitle="Revenue, operations, guest messaging, integrations, and trust." />
          <AgentControlTower />
        </div>

        <div className="space-y-3">
          <SectionLabel number="03" title="Today's Command Center" subtitle="The work that needs human attention right now." />
          <TodayCommandCenter
            reservations={reservations}
            rooms={rooms}
            tasks={tasks}
            onSelectReservation={onSelectReservation}
          />
        </div>
      </div>

      <SmartMessageBoard
        reservations={reservations}
        onNavigate={() => onNavigate("messaging")}
      />
    </section>
  );
}

function SectionLabel({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-xs font-semibold text-primary">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground/60">{subtitle}</p>
      </div>
    </div>
  );
}
