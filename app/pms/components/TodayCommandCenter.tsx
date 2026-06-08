'use client';

import { useState, useMemo } from 'react';
import { Reservation, Task, Room } from '../types';
import { Clock, AlertCircle, CheckCircle2, Users, Home, DollarSign } from 'lucide-react';
import { getTasksForDate, getCriticalTasks, groupTasksByStatus } from '../lib/task-utils';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface TodayCommandCenterProps {
  reservations: Reservation[];
  rooms: Room[];
  tasks: Task[];
  onSelectReservation?: (reservation: Reservation) => void;
}

export default function TodayCommandCenter({
  reservations,
  rooms,
  tasks,
  onSelectReservation,
}: TodayCommandCenterProps) {
  const { t } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter today's data
  const todayReservations = useMemo(
    () =>
      reservations.filter(
        (r) =>
          r.reservationStatus !== 'cancelled' &&
          ((new Date(r.checkInDate).toDateString() === today.toDateString()) ||
            (new Date(r.checkOutDate).toDateString() === today.toDateString()) ||
            (new Date(r.checkInDate) < today && new Date(r.checkOutDate) > today))
      ),
    [reservations, today]
  );

  const todayTasks = useMemo(() => getTasksForDate(tasks, today), [tasks, today]);
  const criticalTasks = useMemo(() => getCriticalTasks(todayTasks), [todayTasks]);
  const tasksByStatus = useMemo(() => groupTasksByStatus(todayTasks), [todayTasks]);

  // Today metrics
  const checkIns = todayReservations.filter((r) => new Date(r.checkInDate).toDateString() === today.toDateString());
  const checkOuts = todayReservations.filter((r) => new Date(r.checkOutDate).toDateString() === today.toDateString());
  const occupiedRooms = todayReservations.length;
  const pendingPayments = todayReservations.filter((r) => r.paymentStatus === 'pending' || r.paymentStatus === 'partially_paid');
  const totalBalance = pendingPayments.reduce((sum, r) => sum + r.balanceDue, 0);

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalTasks.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">
                {criticalTasks.length} {criticalTasks.length === 1 ? t('operations.criticalTaskPlural') : `${t('operations.criticalTaskPlural')}s`}
              </p>
              <div className="space-y-1 mt-2">
                {criticalTasks.slice(0, 3).map((task) => (
                  <p key={task.id} className="text-sm text-red-600">
                    {task.title}
                  </p>
                ))}
                {criticalTasks.length > 3 && (
                  <p className="text-sm text-red-600">{t('operations.moreItems', { count: criticalTasks.length - 3 })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.checkInsToday')}</p>
          <p className="text-2xl font-bold text-primary mt-1">{checkIns.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.checkOutsToday')}</p>
          <p className="text-2xl font-bold text-accent mt-1">{checkOuts.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.occupiedRooms')}</p>
          <p className="text-2xl font-bold text-secondary mt-1">{occupiedRooms}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.pendingPayments')}</p>
          <p className="text-2xl font-bold text-destructive mt-1">${totalBalance.toFixed(0)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.tasksDue')}</p>
          <p className="text-2xl font-bold mt-1">{todayTasks.length}</p>
        </div>
      </div>

      {/* Check-Ins Section */}
      {checkIns.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{t('operations.checkInBoard')} ({checkIns.length})</h3>
          </div>
          <div className="space-y-2">
            {checkIns.map((res) => (
              <button
                key={res.id}
                onClick={() => onSelectReservation?.(res)}
                className="w-full p-3 bg-background border border-border rounded-lg hover:border-primary transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{res.guestName}</p>
                    <p className="text-sm text-foreground/60">
                      {t('operations.roomLabel')} {rooms.find((r) => r.id === res.roomId)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${res.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-foreground/60">
                      {res.numberOfGuests} {res.numberOfGuests === 1 ? t('operations.guest') : t('operations.guests')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check-Outs Section */}
      {checkOuts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">{t('operations.checkOutBoard')} ({checkOuts.length})</h3>
          </div>
          <div className="space-y-2">
            {checkOuts.map((res) => (
              <button
                key={res.id}
                onClick={() => onSelectReservation?.(res)}
                className="w-full p-3 bg-background border border-border rounded-lg hover:border-accent transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{res.guestName}</p>
                    <p className="text-sm text-foreground/60">
                      {res.cleaningStatus === 'dirty' ? (
                        <span className="text-amber-600">{t('operations.roomNeedsGuestCleaning')}</span>
                      ) : (
                        <span className="text-green-600">{t('operations.roomClean')}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {res.balanceDue > 0 && (
                      <p className="text-sm font-semibold text-destructive">
                        {t('operations.balanceDue', { amount: `$${res.balanceDue.toFixed(2)}` })}
                      </p>
                    )}
                    {res.paymentStatus === 'paid' && (
                      <p className="text-sm font-semibold text-green-600">{t('operations.paid')}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Task Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.pending')}</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {tasksByStatus.pending.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('housekeeping.inProgress')}</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {tasksByStatus.in_progress.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('housekeeping.completed')}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {tasksByStatus.completed.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">{t('operations.completionPercent')}</p>
          <p className="text-2xl font-bold mt-1">
            {todayTasks.length > 0
              ? Math.round((tasksByStatus.completed.length / todayTasks.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold">{t('operations.outstandingPayments')} ({pendingPayments.length})</h3>
          </div>
          <div className="space-y-2">
            {pendingPayments.map((res) => (
              <div key={res.id} className="p-3 bg-background border border-border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{res.guestName}</p>
                    <p className="text-sm text-foreground/60">
                      {t('operations.checkOut')}: {new Date(res.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">
                      ${res.balanceDue.toFixed(2)}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {res.paymentStatus === 'partially_paid' ? t('operations.partial') : t('operations.pending')}
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
