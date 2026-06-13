'use client';

import { useMemo } from 'react';
import { ArrowRight, BadgeDollarSign, ShieldAlert, Sparkles, TrendingUp, WandSparkles } from 'lucide-react';
import { useLanguage as useLanguage } from '../LanguageContext';

interface ExecutiveBriefingProps {
  isLoading?: boolean;
  reservations: any[];
  rooms: any[];
  tasks: any[];
}

function toDate(value: any) {
  if (!value) {
    return new Date(0);
  }

  return value instanceof Date ? value : new Date(value);
}

function sameDay(left: Date, right: Date) {
  return left.toDateString() === right.toDateString();
}

function safeCount(value: unknown) {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : 0;
}

export default function ExecutiveBriefing({ isLoading = false, reservations, rooms, tasks }: ExecutiveBriefingProps) {
  const { language, t } = useLanguage();

  const briefing = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const activeReservations = reservations.filter((reservation) => {
      const status = String(reservation.reservationStatus ?? reservation.status ?? '').toLowerCase();
      const checkInDate = toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date);
      const checkOutDate = toDate(reservation.checkOutDate ?? reservation.checkOut ?? reservation.check_out_date);

      return status !== 'cancelled' && checkInDate <= tomorrow && checkOutDate > today;
    });

    const checkInsToday = reservations.filter((reservation) =>
      sameDay(toDate(reservation.checkInDate ?? reservation.checkIn ?? reservation.check_in_date), today),
    );
    const checkOutsToday = reservations.filter((reservation) =>
      sameDay(toDate(reservation.checkOutDate ?? reservation.checkOut ?? reservation.check_out_date), today),
    );
    const overdueBalances = reservations.filter((reservation) => {
      const status = String(reservation.reservationStatus ?? reservation.status ?? '').toLowerCase();
      const balanceDue = safeCount(reservation.balanceDue ?? 0);
      const checkOutDate = toDate(reservation.checkOutDate ?? reservation.checkOut ?? reservation.check_out_date);

      return status !== 'cancelled' && balanceDue > 0 && checkOutDate <= tomorrow;
    });
    const openCleaningTasks = tasks.filter((task) => {
      const type = String(task.type ?? '').toLowerCase();
      const status = String(task.status ?? '').toLowerCase();

      return type === 'cleaning' && status !== 'completed';
    });
    const urgentTasks = tasks.filter((task) => {
      const priority = String(task.priority ?? '').toLowerCase();
      const status = String(task.status ?? '').toLowerCase();

      return status !== 'completed' && (priority === 'urgent' || priority === 'high');
    });

    const occupancyRate = rooms.length > 0 ? Math.round((activeReservations.length / rooms.length) * 100) : 0;
    const occupancyTarget = 75;
    const occupancyGap = Math.max(0, occupancyTarget - occupancyRate);
    const healthScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 -
            (occupancyGap * 1.2 + overdueBalances.length * 16 + (checkInsToday.length + checkOutsToday.length) * 3 + openCleaningTasks.length * 8 + urgentTasks.length * 10),
        ),
      ),
    );

    const statusLabel =
      healthScore >= 80 ? t('executive.controlled') : healthScore >= 60 ? t('executive.watch') : t('executive.escalated');

    const statusTone =
      healthScore >= 80
        ? 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/20 text-emerald-100'
        : healthScore >= 60
          ? 'from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-100'
          : 'from-rose-500/20 to-red-500/10 border-rose-500/20 text-rose-100';

    const summary =
      overdueBalances.length > 0
        ? language === 'es'
          ? `${overdueBalances.length} folio${overdueBalances.length === 1 ? '' : 's'} vencido${overdueBalances.length === 1 ? '' : 's'} requieren seguimiento de cobro.`
          : `${overdueBalances.length} overdue folio${overdueBalances.length === 1 ? '' : 's'} need collections focus.`
        : openCleaningTasks.length > 0
          ? language === 'es'
            ? `${openCleaningTasks.length} tarea${openCleaningTasks.length === 1 ? '' : 's'} de limpieza siguen abiertas.`
            : `${openCleaningTasks.length} turnover task${openCleaningTasks.length === 1 ? '' : 's'} are still open.`
          : occupancyRate < occupancyTarget
            ? language === 'es'
              ? `La ocupacion esta en ${occupancyRate}% y puede absorber mas demanda.`
              : `Occupancy is ${occupancyRate}% and could absorb more demand.`
            : language === 'es'
              ? 'La operacion esta equilibrada. Manten la disciplina y protege el dia.'
              : 'The operation is balanced. Stay disciplined and protect the day.';

    const actions = [
      {
        icon: BadgeDollarSign,
        title: t('executive.actionCollect'),
        description: t('executive.actionCollectDesc', { count: overdueBalances.length }),
        active: overdueBalances.length > 0,
      },
      {
        icon: Sparkles,
        title: t('executive.actionPrep'),
        description: t('executive.actionPrepDesc', { count: checkInsToday.length }),
        active: checkInsToday.length > 0,
      },
      {
        icon: WandSparkles,
        title: t('executive.actionClean'),
        description: t('executive.actionCleanDesc', { count: openCleaningTasks.length }),
        active: openCleaningTasks.length > 0,
      },
    ];

    const primaryAction =
      overdueBalances.length > 0
        ? actions[0]
        : openCleaningTasks.length > 0
          ? actions[2]
          : checkInsToday.length > 0
            ? actions[1]
            : {
                icon: TrendingUp,
                title: t('executive.actionProtect'),
                description: t('executive.actionProtectDesc'),
                active: true,
              };

    return {
      actions,
      checkInsToday,
      checkOutsToday,
      healthScore,
      occupancyRate,
      occupancyTarget,
      openCleaningTasks,
      overdueBalances,
      primaryAction,
      statusLabel,
      statusTone,
      summary,
      urgentTasks,
    };
  }, [language, reservations, rooms, tasks, t]);

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-950/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            {t('executive.focusLabel')}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{t('executive.title')}</h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">{t('executive.subtitle')}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" />
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="h-24 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
            <div className="h-24 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
            <div className="h-24 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
          </div>
          <p className="mt-4 text-sm text-slate-300">{t('executive.loading')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            {t('executive.insight')}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{t('executive.title')}</h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">{t('executive.subtitle')}</p>
            <p className="max-w-2xl text-sm leading-6 text-slate-200">{briefing.summary}</p>
          </div>
        </div>

        <div className={`rounded-2xl border bg-gradient-to-br p-4 ${briefing.statusTone}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t('executive.health')}</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-4xl font-semibold text-white">{briefing.healthScore}</span>
            <span className="pb-1 text-sm text-white/70">/ 100</span>
          </div>
          <p className="mt-2 text-sm font-medium text-white">{briefing.statusLabel}</p>
          <p className="mt-1 text-xs text-white/70">
            {t('executive.occupancyOutlook')}: {briefing.occupancyRate}% / {briefing.occupancyTarget}%
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.revenueAtRisk')}</p>
            <BadgeDollarSign className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">{briefing.overdueBalances.length}</p>
          <p className="mt-2 text-sm text-slate-300">
            {t('executive.revenueAtRiskDesc', { count: briefing.overdueBalances.length })}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.housekeepingBacklog')}</p>
            <WandSparkles className="h-4 w-4 text-cyan-300" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">{briefing.openCleaningTasks.length}</p>
          <p className="mt-2 text-sm text-slate-300">
            {t('executive.housekeepingBacklogDesc', { count: briefing.openCleaningTasks.length })}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.arrivalPressure')}</p>
            <TrendingUp className="h-4 w-4 text-amber-300" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">{briefing.checkInsToday.length + briefing.checkOutsToday.length}</p>
          <p className="mt-2 text-sm text-slate-300">
            {t('executive.arrivalPressureDesc', {
              count: briefing.checkInsToday.length,
              count2: briefing.checkOutsToday.length,
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.primaryMoveLabel')}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{t('executive.primaryMove')}</h3>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm font-semibold text-white">{briefing.primaryAction.title}</p>
            <p className="mt-1 text-sm text-slate-300">{briefing.primaryAction.description}</p>
          </div>

          <div className="mt-4 space-y-3">
            {briefing.actions.map((action) => {
              const Icon = action.icon;

              return (
                <div
                  key={action.title}
                  className={`flex items-start gap-3 rounded-xl border p-4 ${
                    action.active ? 'border-white/15 bg-white/5' : 'border-white/10 bg-white/5 opacity-80'
                  }`}
                >
                  <div className={`rounded-lg p-2 ${action.active ? 'bg-emerald-400/15' : 'bg-white/5'}`}>
                    <Icon className={`h-4 w-4 ${action.active ? 'text-emerald-200' : 'text-slate-400'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{action.title}</p>
                    <p className="mt-1 text-sm text-slate-300">{action.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.risk')}</p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-sm text-slate-300">{t('executive.occupancyOutlook')}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{briefing.occupancyRate}%</p>
              <p className="mt-1 text-xs text-slate-400">
                {language === 'es' ? 'Objetivo' : 'Target'} {briefing.occupancyTarget}% | {briefing.urgentTasks.length}{' '}
                {language === 'es'
                  ? `tarea urgente${briefing.urgentTasks.length === 1 ? '' : 's'}`
                  : `urgent task${briefing.urgentTasks.length === 1 ? '' : 's'}`}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.score')}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{briefing.healthScore}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('executive.risk')}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{100 - briefing.healthScore}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              {briefing.overdueBalances.length > 0
                ? language === 'es'
                  ? `${briefing.overdueBalances.length} folio${briefing.overdueBalances.length === 1 ? '' : 's'} requieren seguimiento de cobro.`
                  : `${briefing.overdueBalances.length} folio${briefing.overdueBalances.length === 1 ? '' : 's'} require collections follow-up.`
                : briefing.openCleaningTasks.length > 0
                  ? language === 'es'
                    ? `${briefing.openCleaningTasks.length} habitaciones todavia necesitan cierre de turno.`
                    : `${briefing.openCleaningTasks.length} rooms still need turnover work.`
                  : language === 'es'
                    ? 'No hay bloqueos inmediatos. Usa la ventana para proteger la ocupacion de manana.'
                    : "No immediate blockers. Use the window to protect tomorrow's occupancy."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
