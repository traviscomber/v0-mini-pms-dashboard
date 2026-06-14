'use client';

import { useMemo } from 'react';
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
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Urgent now</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{criticalTasks.length}</p>
              <p className="mt-1 text-sm text-foreground/60">Requires immediate attention.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Overdue</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{overdueTodayTasks.length}</p>
              <p className="mt-1 text-sm text-foreground/60">Already behind the clock.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Queue load</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{todayTasks.length}</p>
              <p className="mt-1 text-sm text-foreground/60">Tasks scheduled for today.</p>
            </div>
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

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          {roleOrder.map((role) => {
            const { roleTasks, urgentCount, overdueCount, dueSoonCount } = getRoleSummary(role);
            const nextTask = roleTasks[0];

            return (
              <article key={role} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">{roleLabels[role]}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{roleTasks.length}</p>
                  </div>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/60">
                    {urgentCount} urgent
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

        {roleBuckets.unassigned.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-amber-300">Unassigned tasks</p>
            <p className="mt-1 text-sm text-foreground/60">
              {roleBuckets.unassigned.length} items still need a clear owner.
            </p>
          </div>
        ) : null}
      </div>

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
