'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Clock, DollarSign, MapPin, Sparkles, Users } from 'lucide-react';
import { Reservation, Task, Room } from '../types';
import { getTasksForDate, getCriticalTasks, groupTasksByStatus } from '../lib/task-utils';
import { useLanguage as useLanguage } from '../LanguageContext';

interface TodayCommandCenterProps {
  reservations: Reservation[];
  rooms: Room[];
  tasks: Task[];
  onExecute?: (target: "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar", title: string, reason: string) => void;
  onNavigate?: (section: "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar") => void;
  onSelectReservation?: (reservation: Reservation) => void;
}

export default function TodayCommandCenter({
  reservations,
  rooms,
  tasks,
  onExecute,
  onNavigate,
  onSelectReservation,
}: TodayCommandCenterProps) {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'risk' | 'stable'>('all');
  const [activeMode, setActiveMode] = useState<'today' | 'risk' | 'incident'>('today');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();

  const priorityScore: Record<string, number> = {
    urgent: 0,
    high: 1,
    normal: 2,
    low: 3,
  };

  const statusScore: Record<string, number> = {
    in_progress: 0,
    pending: 1,
    blocked: 2,
    completed: 3,
    cancelled: 4,
  };

  const todayReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.reservationStatus !== 'cancelled' &&
          (
            new Date(reservation.checkInDate).toDateString() === today.toDateString() ||
            new Date(reservation.checkOutDate).toDateString() === today.toDateString() ||
            (new Date(reservation.checkInDate) < today && new Date(reservation.checkOutDate) > today)
          ),
      ),
    [reservations, today],
  );

  const todayTasks = useMemo(() => getTasksForDate(tasks, today), [tasks, today]);
  const criticalTasks = useMemo(() => getCriticalTasks(todayTasks), [todayTasks]);
  const tasksByStatus = useMemo(() => groupTasksByStatus(todayTasks), [todayTasks]);
  const rankedTodayTasks = useMemo(
    () =>
      [...todayTasks].sort((leftTask, rightTask) => {
        const leftDue = new Date(leftTask.dueDate).getTime();
        const rightDue = new Date(rightTask.dueDate).getTime();
        const leftLag = leftDue - now.getTime();
        const rightLag = rightDue - now.getTime();

        if (leftLag !== rightLag) {
          return leftLag - rightLag;
        }

        const leftPriority = priorityScore[String(leftTask.priority ?? 'normal').toLowerCase()] ?? 2;
        const rightPriority = priorityScore[String(rightTask.priority ?? 'normal').toLowerCase()] ?? 2;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        const leftStatus = statusScore[String(leftTask.status ?? 'pending').toLowerCase()] ?? 1;
        const rightStatus = statusScore[String(rightTask.status ?? 'pending').toLowerCase()] ?? 1;

        if (leftStatus !== rightStatus) {
          return leftStatus - rightStatus;
        }

        return leftDue - rightDue;
      }),
    [now, todayTasks],
  );

  const checkIns = todayReservations.filter((reservation) => new Date(reservation.checkInDate).toDateString() === today.toDateString());
  const checkOuts = todayReservations.filter((reservation) => new Date(reservation.checkOutDate).toDateString() === today.toDateString());
  const occupiedRooms = todayReservations.length;
  const pendingPayments = todayReservations.filter((reservation) => reservation.paymentStatus === 'pending' || reservation.paymentStatus === 'partially_paid');
  const totalBalance = pendingPayments.reduce((sum, reservation) => sum + reservation.balanceDue, 0);
  const overdueTodayTasks = todayTasks.filter(
    (task) => task.status !== 'completed' && task.status !== 'cancelled' && new Date(task.dueDate).getTime() < now.getTime(),
  );
  const topTasks = rankedTodayTasks.slice(0, 3);
  const roleLabels: Record<string, string> = {
    finance: 'Finance',
    housekeeping: 'Housekeeping',
    reception: 'Reception',
    operations: 'Operations',
    manager: 'Manager',
    unassigned: 'Unassigned',
  };

  const roleOrder = ['finance', 'housekeeping', 'reception', 'operations', 'manager'];
  const roleTargets: Record<string, "reservations" | "housekeeping" | "ledger" | "messaging" | "calendar"> = {
    finance: 'ledger',
    housekeeping: 'housekeeping',
    reception: 'messaging',
    operations: 'calendar',
    manager: 'reservations',
    unassigned: 'reservations',
  };

  const roleBuckets = useMemo(() => {
    const bucket: Record<string, Task[]> = {
      finance: [],
      housekeeping: [],
      reception: [],
      operations: [],
      manager: [],
      unassigned: [],
    };

    todayTasks.forEach((task) => {
      const explicitRole = String(task.assignedTo ?? '').trim().toLowerCase();
      const derivedRole =
        explicitRole ||
        (task.type === 'payment'
          ? 'finance'
          : task.type === 'cleaning' || task.type === 'inspection'
            ? 'housekeeping'
            : task.type === 'communication' || task.type === 'check_in'
              ? 'reception'
              : task.type === 'check_out'
                ? 'operations'
                : 'manager');

      if (!bucket[derivedRole]) {
        bucket.unassigned.push(task);
        return;
      }

      bucket[derivedRole].push(task);
    });

    Object.values(bucket).forEach((roleTasks) => {
      roleTasks.sort((leftTask, rightTask) => {
        const leftDue = new Date(leftTask.dueDate).getTime();
        const rightDue = new Date(rightTask.dueDate).getTime();

        if (leftDue !== rightDue) {
          return leftDue - rightDue;
        }

        const leftPriority = priorityScore[String(leftTask.priority ?? 'normal').toLowerCase()] ?? 2;
        const rightPriority = priorityScore[String(rightTask.priority ?? 'normal').toLowerCase()] ?? 2;

        return leftPriority - rightPriority;
      });
    });

    return bucket;
  }, [todayTasks]);

  const roleOptions = [
    { id: 'all', label: 'All roles' },
    ...roleOrder.map((role) => ({ id: role, label: roleLabels[role] })),
    { id: 'unassigned', label: roleLabels.unassigned },
  ];

  const formatSla = (task: Task) => {
    const dueTime = new Date(task.dueDate).getTime();
    const diffMinutes = Math.round((dueTime - now.getTime()) / 60000);

    if (task.status === 'completed') {
      return 'Completed';
    }

    if (diffMinutes < 0) {
      return `Overdue by ${Math.abs(diffMinutes)}m`;
    }

    if (diffMinutes < 60) {
      return `Due in ${diffMinutes}m`;
    }

    return `Due in ${Math.round(diffMinutes / 60)}h`;
  };

  const getRoleSummary = (role: string) => {
    const roleTasks = roleBuckets[role] ?? [];
    const urgentCount = roleTasks.filter((task) => task.priority === 'urgent' || task.priority === 'high').length;
    const overdueCount = roleTasks.filter((task) => {
      const diffMinutes = Math.round((new Date(task.dueDate).getTime() - now.getTime()) / 60000);
      return diffMinutes < 0 && task.status !== 'completed' && task.status !== 'cancelled';
    }).length;
    const dueSoonCount = roleTasks.filter((task) => {
      const diffMinutes = Math.round((new Date(task.dueDate).getTime() - now.getTime()) / 60000);
      return diffMinutes <= 120;
    }).length;

    return { roleTasks, urgentCount, overdueCount, dueSoonCount };
  };

  const getTaskOwnerRole = (task: Task) => {
    const explicitRole = String(task.assignedTo ?? '').trim().toLowerCase();

    if (explicitRole && roleLabels[explicitRole]) {
      return explicitRole;
    }

    if (task.type === 'payment') return 'finance';
    if (task.type === 'cleaning' || task.type === 'inspection') return 'housekeeping';
    if (task.type === 'communication' || task.type === 'check_in') return 'reception';
    if (task.type === 'check_out') return 'operations';
    return 'manager';
  };

  const historyEntries = useMemo(
    () =>
      rankedTodayTasks.slice(0, 6).map((task) => {
        const ownerRole = getTaskOwnerRole(task);
        const ownerLabel = roleLabels[ownerRole] ?? ownerRole;
        const dueTime = new Date(task.dueDate).getTime();
        const diffMinutes = Math.round((dueTime - now.getTime()) / 60000);
        const statusLabel =
          task.status === 'completed'
            ? 'completed'
            : diffMinutes < 0
              ? 'overdue'
              : diffMinutes <= 120
                ? 'due soon'
                : 'scheduled';

        return {
          id: task.id,
          ownerLabel,
          title: task.title,
          statusLabel,
          dueLabel: formatSla(task),
          priority: task.priority,
        };
      }),
    [rankedTodayTasks, now],
  );

  const incidentMode = criticalTasks.length >= 2 || overdueTodayTasks.length >= 3;

  useEffect(() => {
    if (incidentMode && activeMode === 'incident') {
      setSelectedRole('all');
      setSelectedRisk('risk');
    }
  }, [activeMode, incidentMode]);

  const setMode = (mode: 'today' | 'risk' | 'incident') => {
    setActiveMode(mode);

    if (mode === 'today') {
      setSelectedRole('all');
      setSelectedRisk('all');
      return;
    }

    if (mode === 'risk') {
      setSelectedRole('all');
      setSelectedRisk('risk');
      return;
    }

    setSelectedRole('all');
    setSelectedRisk('risk');
  };

  const visibleRoles = useMemo(() => {
    const candidateRoles = roleOrder.filter((role) => {
      if (selectedRole !== 'all' && selectedRole !== role) {
        return false;
      }

      const summary = getRoleSummary(role);
      const roleRisk = summary.overdueCount > 0 || summary.urgentCount > 1;

      if (selectedRisk === 'risk') {
        return roleRisk;
      }

      if (selectedRisk === 'stable') {
        return !roleRisk;
      }

      return true;
    });

    const rolePressureScore = (role: string) => {
      const summary = getRoleSummary(role);

      return summary.overdueCount * 100 + summary.urgentCount * 10 + summary.dueSoonCount;
    };

    if (activeMode === 'today') {
      return candidateRoles;
    }

    return [...candidateRoles].sort((leftRole, rightRole) => {
      const leftScore = rolePressureScore(leftRole);
      const rightScore = rolePressureScore(rightRole);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return roleOrder.indexOf(leftRole) - roleOrder.indexOf(rightRole);
    });
  }, [activeMode, selectedRisk, selectedRole, todayTasks]);

  const highlightedRole = visibleRoles[0] ?? 'finance';

  const unassignedVisible = selectedRole === 'all' || selectedRole === 'unassigned';

  const visibleHistory = historyEntries.filter((entry) => {
    if (selectedRole !== 'all' && entry.ownerLabel.toLowerCase() !== roleLabels[selectedRole]?.toLowerCase()) {
      return false;
    }

    if (selectedRisk === 'risk') {
      return entry.statusLabel === 'overdue' || entry.statusLabel === 'due soon';
    }

    if (selectedRisk === 'stable') {
      return entry.statusLabel === 'completed' || entry.statusLabel === 'scheduled';
    }

    return true;
  });

  const focusRole = visibleRoles[0] ?? 'manager';
  const focusSummary = getRoleSummary(focusRole);
  const focusTask = focusSummary.roleTasks[0];
  const focusTarget = roleTargets[focusRole] ?? 'reservations';
  const focusLabel = roleLabels[focusRole] ?? focusRole;
  const focusCopy =
    activeMode === 'incident'
      ? {
          title: `Stabilize ${focusLabel}`,
          body: focusTask
            ? `${focusTask.title} is the next recovery point. Escalate it now and keep the lane moving.`
            : `This lane is under pressure. Create an urgent follow-up and keep the team in motion.`,
          button: 'Escalate now',
        }
      : activeMode === 'risk'
        ? {
            title: `Triage ${focusLabel}`,
            body: focusTask
              ? `${focusTask.title} is the best next step to reduce risk and keep SLA intact.`
              : `This lane has visible pressure. Open it and assign the next action fast.`,
            button: 'Handle risk',
          }
        : {
          title: 'Execute the best next move',
          body: topTasks[0]
            ? `${topTasks[0].title} is the cleanest action to start with right now.`
            : 'The board is calm enough to keep working in the most useful lane.',
          button: 'Open next action',
        };

  const modeMetricCards =
    activeMode === 'incident'
      ? [
          { label: 'Critical', value: criticalTasks.length, helper: 'Needs immediate recovery' },
          { label: 'Overdue', value: overdueTodayTasks.length, helper: 'Already behind SLA' },
          { label: 'Unassigned', value: roleBuckets.unassigned.length, helper: 'Needs a clear owner' },
        ]
      : activeMode === 'risk'
        ? [
            { label: 'Overdue', value: overdueTodayTasks.length, helper: 'Tasks already late' },
            { label: 'Pending pay', value: pendingPayments.length, helper: 'Open balances to close' },
            { label: 'Critical', value: criticalTasks.length, helper: 'Immediate attention' },
          ]
        : [
            { label: 'Check-ins', value: checkIns.length, helper: 'Arrivals today' },
            { label: 'Check-outs', value: checkOuts.length, helper: 'Departures today' },
            { label: 'Tasks', value: todayTasks.length, helper: 'Work items scheduled' },
          ];

  const handleRoleAction = (role: string, action: "execute" | "open" | "escalate") => {
    const target = roleTargets[role] ?? 'reservations';
    const summary = getRoleSummary(role);
    const nextTask = summary.roleTasks[0];
    const roleLabel = roleLabels[role] ?? role;

    if (action === "open") {
      onNavigate?.(target);
      return;
    }

    onExecute?.(
      target,
      `${roleLabel} follow-up`,
      action === "escalate"
        ? nextTask
          ? `Escalate ${nextTask.title.toLowerCase()} for ${roleLabel.toLowerCase()} because it is already behind SLA.`
          : `Escalate the ${roleLabel.toLowerCase()} lane and create an urgent follow-up.`
        : nextTask
          ? `Shift board assigned ${nextTask.title.toLowerCase()} to ${roleLabel.toLowerCase()}.`
          : `Create the next ${roleLabel.toLowerCase()} action for today's shift board.`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Mode switcher</p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">Jump to the right operating context.</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'risk', label: 'At risk' },
              { id: 'incident', label: 'Incident' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMode(mode.id as 'today' | 'risk' | 'incident')}
                className={[
                  'rounded-full px-3 py-2 text-xs font-semibold transition',
                  activeMode === mode.id
                    ? 'border border-primary/30 bg-primary/10 text-primary'
                    : 'border border-border bg-background text-foreground/65 hover:border-primary/25 hover:text-foreground',
                ].join(' ')}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground/60">
          {activeMode === 'today'
            ? 'Standard operational view with the full shift board.'
            : activeMode === 'risk'
              ? 'Filtered to the lanes and decisions that need attention.'
              : 'Focused on the busiest and most urgent recovery path.'}
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/8 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Focus action</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">{focusCopy.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">{focusCopy.body}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onExecute?.(focusTarget, focusCopy.title, focusCopy.body)}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              {focusCopy.button}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.(focusTarget)}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/25 hover:bg-primary/5"
            >
              Open lane
            </button>
          </div>
        </div>
      </div>

      {incidentMode ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">Incident mode</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">The day needs fast coordination.</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                We detected a higher-than-normal backlog. The board highlights the urgent lanes and keeps the team focused on recovery.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-background/80 px-3 py-2 text-xs font-semibold text-rose-200">
              <AlertCircle className="h-3.5 w-3.5" />
              {criticalTasks.length} critical · {overdueTodayTasks.length} overdue
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Compact console</p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">Today at a glance.</h3>
          </div>
          <div className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/65">
            {todayTasks.length} tasks
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/45">Critical</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{criticalTasks.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/45">Overdue</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{overdueTodayTasks.length}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {topTasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-border bg-background/70 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <p className="mt-1 text-xs text-foreground/55">{task.type.replace('_', ' ')} · {formatSla(task)}</p>
                </div>
                <span className="rounded-full border border-border bg-card px-2 py-1 text-[11px] text-foreground/60">
                  {String(task.priority).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedRisk('risk')}
            className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200"
          >
            Show at risk
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('all');
              setSelectedRisk('all');
            }}
            className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground/65"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Today&apos;s command center</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">The work that needs attention right now.</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                We rank the day by urgency, assign the next move, and keep the team focused on the work that moves the stay forward.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/65">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {todayTasks.length} work items
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {modeMetricCards.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
                <p className="mt-1 text-sm text-foreground/60">{metric.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Right now</p>
          </div>

          <div className="mt-4 space-y-3">
            {topTasks.length > 0 ? topTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{task.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">{task.type.replace('_', ' ')}</p>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/60">
                    {String(task.priority).toUpperCase()}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                    <MapPin className="h-3 w-3" />
                    Room {task.roomId}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                    <Clock className="h-3 w-3" />
                    {formatSla(task)}
                  </span>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-sm text-foreground/60">
                No urgent tasks yet — the queue is calm.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden rounded-2xl border border-border bg-card p-5 shadow-sm md:block">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Shift board</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">What each role owns right now.</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">
              Each lane groups the current work by team so the handoff is obvious and no one has to translate the day.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/65">
            <Users className="h-3.5 w-3.5 text-primary" />
            {roleOrder.reduce((sum, role) => sum + (roleBuckets[role]?.length ?? 0), 0)} assigned tasks
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {roleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedRole(option.id)}
              className={[
                'rounded-full px-3 py-2 text-xs font-semibold transition',
                selectedRole === option.id
                  ? 'border border-primary/30 bg-primary/10 text-primary'
                  : 'border border-border bg-background text-foreground/65 hover:border-primary/25 hover:text-foreground',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
          {(['all', 'risk', 'stable'] as const).map((risk) => (
            <button
              key={risk}
              type="button"
              onClick={() => setSelectedRisk(risk)}
              className={[
                'rounded-full px-3 py-2 text-xs font-semibold transition',
                selectedRisk === risk
                  ? 'border border-primary/30 bg-primary/10 text-primary'
                  : 'border border-border bg-background text-foreground/65 hover:border-primary/25 hover:text-foreground',
              ].join(' ')}
            >
              {risk === 'all' ? 'All risk' : risk === 'risk' ? 'At risk' : 'Stable'}
            </button>
          ))}
          {(selectedRole !== 'all' || selectedRisk !== 'all') ? (
            <button
              type="button"
              onClick={() => {
                setSelectedRole('all');
                setSelectedRisk('all');
              }}
              className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground/65 transition hover:border-primary/25 hover:text-foreground"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          {visibleRoles.map((role) => {
            const { roleTasks, urgentCount, overdueCount, dueSoonCount } = getRoleSummary(role);
            const nextTask = roleTasks[0];

            return (
              <article
                key={role}
                className={[
                  'rounded-2xl border p-4 transition',
                  role === highlightedRole
                    ? 'border-primary/30 bg-primary/8 ring-1 ring-primary/20'
                    : 'border-border bg-background/70',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">{roleLabels[role]}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{roleTasks.length}</p>
                  </div>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/60">
                    {role === highlightedRole ? 'priority' : `${urgentCount} urgent`}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card/80 px-3 py-2">
                    <span className="text-foreground/60">Due within 2h</span>
                    <span className="font-semibold text-foreground">{dueSoonCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card/80 px-3 py-2">
                    <span className="text-foreground/60">Over SLA</span>
                    <span className="font-semibold text-foreground">{overdueCount}</span>
                  </div>

                  {nextTask ? (
                    <div className="rounded-xl border border-border bg-card/80 p-3">
                      <p className="text-sm font-semibold text-foreground">{nextTask.title}</p>
                      <p className="mt-1 text-xs text-foreground/55">{formatSla(nextTask)}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border bg-card/40 p-3 text-sm text-foreground/55">
                      No current tasks in this lane.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleAction(role, "execute")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                  >
                    Create next action
                  </button>
                  {overdueCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleRoleAction(role, "escalate")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-500/15"
                    >
                      Escalate
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleRoleAction(role, "open")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/25 hover:bg-primary/5"
                  >
                    Open lane
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {unassignedVisible && roleBuckets.unassigned.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-amber-300">Unassigned tasks</p>
            <p className="mt-1 text-sm text-foreground/60">
              {roleBuckets.unassigned.length} items still need a clear owner.
            </p>
          </div>
        ) : null}
      </div>

      {activeMode === 'incident' ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">Recovery queue</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">Only the next 3 actions stay visible.</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                We trim the rest of the detail so the team can stabilize the day without extra noise.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-background/80 px-3 py-2 text-xs font-semibold text-rose-200">
              <AlertCircle className="h-3.5 w-3.5" />
              High focus
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {topTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="rounded-2xl border border-rose-500/20 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{task.title}</p>
                    <p className="mt-1 text-xs text-foreground/55">{task.type.replace('_', ' ')} · {formatSla(task)}</p>
                  </div>
                  <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200">
                    {String(task.priority).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden rounded-2xl border border-border bg-card p-5 shadow-sm md:block">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Decision trail</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">Recent ownership and SLA context.</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                This gives the team a quick memory of what was assigned, who owns it, and how close it is to falling behind.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/65">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {historyEntries.length} recent decisions
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleHistory.length > 0 ? visibleHistory.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">{entry.ownerLabel}</p>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">{entry.title}</h4>
                  </div>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/60">
                    {String(entry.priority).toUpperCase()}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/60">
                  <span className="rounded-full border border-border bg-card px-2.5 py-1">
                    {entry.statusLabel}
                  </span>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1">
                    {entry.dueLabel}
                  </span>
                </div>
              </article>
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-sm text-foreground/60 md:col-span-2 xl:col-span-3">
                No decisions match the current filters.
              </div>
            )}
          </div>
        </div>
      )}

      {criticalTasks.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-red-700">
                {criticalTasks.length} {criticalTasks.length === 1 ? t('operations.criticalTaskPlural') : `${t('operations.criticalTaskPlural')}s`}
              </p>
              <div className="mt-2 space-y-1">
                {criticalTasks.slice(0, 3).map((task) => (
                  <p key={task.id} className="text-sm text-destructive">
                    {task.title}
                  </p>
                ))}
                {criticalTasks.length > 3 && (
                  <p className="text-sm text-destructive">{t('operations.moreItems', { count: criticalTasks.length - 3 })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.checkInsToday')}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{checkIns.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.checkOutsToday')}</p>
          <p className="mt-1 text-2xl font-bold text-accent">{checkOuts.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.occupiedRooms')}</p>
          <p className="mt-1 text-2xl font-bold text-secondary">{occupiedRooms}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.pendingPayments')}</p>
          <p className="mt-1 text-2xl font-bold text-destructive">${totalBalance.toFixed(0)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.tasksDue')}</p>
          <p className="mt-1 text-2xl font-bold">{todayTasks.length}</p>
        </div>
      </div>

      {checkIns.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t('operations.checkInBoard')} ({checkIns.length})</h3>
          </div>
          <div className="space-y-2">
            {checkIns.map((reservation) => (
              <button
                key={reservation.id}
                onClick={() => onSelectReservation?.(reservation)}
                className="w-full rounded-lg border border-border bg-background p-3 text-left transition hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{reservation.guestName}</p>
                    <p className="text-sm text-foreground/60">
                      {t('operations.roomLabel')} {rooms.find((room) => room.id === reservation.roomId)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${reservation.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-foreground/60">
                      {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? t('operations.guest') : t('operations.guests')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {checkOuts.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">{t('operations.checkOutBoard')} ({checkOuts.length})</h3>
          </div>
          <div className="space-y-2">
            {checkOuts.map((reservation) => (
              <button
                key={reservation.id}
                onClick={() => onSelectReservation?.(reservation)}
                className="w-full rounded-lg border border-border bg-background p-3 text-left transition hover:border-accent"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{reservation.guestName}</p>
                    <p className="text-sm text-foreground/60">
                      {reservation.cleaningStatus === 'dirty' ? (
                        <span className="text-secondary600">{t('operations.roomNeedsGuestCleaning')}</span>
                      ) : (
                        <span className="text-green-600">{t('operations.roomClean')}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {reservation.balanceDue > 0 && (
                      <p className="text-sm font-semibold text-destructive">
                        {t('operations.balanceDue', { amount: `$${reservation.balanceDue.toFixed(2)}` })}
                      </p>
                    )}
                    {reservation.paymentStatus === 'paid' && (
                      <p className="text-sm font-semibold text-green-600">{t('operations.paid')}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.pending')}</p>
          <p className="mt-1 text-2xl font-bold text-secondary600">{tasksByStatus.pending.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('housekeeping.inProgress')}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{tasksByStatus.in_progress.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('housekeeping.completed')}</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-foreground/60">{t('operations.completionPercent')}</p>
          <p className="mt-1 text-2xl font-bold">
            {todayTasks.length > 0
              ? Math.round((tasksByStatus.completed.length / todayTasks.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {pendingPayments.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold">{t('operations.outstandingPayments')} ({pendingPayments.length})</h3>
          </div>
          <div className="space-y-2">
            {pendingPayments.map((reservation) => (
              <div key={reservation.id} className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{reservation.guestName}</p>
                    <p className="text-sm text-foreground/60">
                      {t('operations.checkOut')}: {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">${reservation.balanceDue.toFixed(2)}</p>
                    <p className="text-xs text-foreground/60">
                      {reservation.paymentStatus === 'partially_paid' ? t('operations.partial') : t('operations.pending')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
