'use client';

import { useCallback, useEffect, useState } from 'react';
import { Reservation, Task, Alert } from '../types';
import { generateTasksFromReservation, getCriticalTasks } from '../lib/task-utils';

interface AutomationConfig {
  autoGenerateTasks: boolean;
  autoCreateAlerts: boolean;
  autoUpdateCleaningStatus: boolean;
  notifyHoursBefore: number; // hours before check-in to notify
}

/**
 * Hook to handle automated hospitality tasks:
 * - Auto-generate cleaning/check-in/check-out tasks from reservations
 * - Auto-create alerts for upcoming check-ins/check-outs
 * - Auto-update cleaning status based on reservation dates
 */
export function useAutomation(
  reservations: Reservation[],
  tasks: Task[],
  alerts: Alert[],
  onTasksChange?: (newTasks: Task[]) => void,
  onAlertsChange?: (newAlerts: Alert[]) => void,
  config: Partial<AutomationConfig> = {}
) {
  const defaultConfig: AutomationConfig = {
    autoGenerateTasks: true,
    autoCreateAlerts: true,
    autoUpdateCleaningStatus: true,
    notifyHoursBefore: 24,
    ...config,
  };

  const [automatedTasks, setAutomatedTasks] = useState<Task[]>(tasks);
  const [automatedAlerts, setAutomatedAlerts] = useState<Alert[]>(alerts);

  /**
   * Auto-generate tasks from new/updated reservations
   */
  const autoGenerateTasks = useCallback(() => {
    if (!defaultConfig.autoGenerateTasks) return;

    const newTasks: Task[] = [];
    const existingTaskIds = new Set(automatedTasks.map(t => t.id));

    reservations.forEach(reservation => {
      const taskId = `task-${reservation.id}-checkin`;
      if (!existingTaskIds.has(taskId)) {
        const generatedTasks = generateTasksFromReservation(reservation);
        newTasks.push(...generatedTasks);
      }
    });

    if (newTasks.length > 0) {
      const updatedTasks = [...automatedTasks, ...newTasks];
      setAutomatedTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    }
  }, [reservations, automatedTasks, defaultConfig.autoGenerateTasks, onTasksChange]);

  /**
   * Auto-create alerts for upcoming check-ins and check-outs
   */
  const autoCreateAlerts = useCallback(() => {
    if (!defaultConfig.autoCreateAlerts) return;

    const now = new Date();
    const newAlerts: Alert[] = [];
    const existingAlertIds = new Set(automatedAlerts.map(a => a.id));

    reservations.forEach(reservation => {
      const checkInDate = new Date(reservation.checkInDate);
      const checkOutDate = new Date(reservation.checkOutDate);
      const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      const hoursUntilCheckOut = (checkOutDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Alert for upcoming check-in
      if (hoursUntilCheckIn > 0 && hoursUntilCheckIn <= defaultConfig.notifyHoursBefore) {
        const alertId = `alert-checkin-${reservation.id}`;
        if (!existingAlertIds.has(alertId)) {
          newAlerts.push({
            id: alertId,
            propertyId: reservation.propertyId,
            type: 'check_in_today',
            level: 'info',
            title: {
              en: `Check-in: ${reservation.guestName}`,
              es: `Check-in: ${reservation.guestName}`,
            },
            message: {
              en: `Guest ${reservation.guestName} checking in at ${checkInDate.toLocaleTimeString()}`,
              es: `Huésped ${reservation.guestName} entrará a las ${checkInDate.toLocaleTimeString()}`,
            },
            relatedEntity: {
              type: 'reservation',
              id: reservation.id,
            },
            isDismissed: false,
            createdAt: new Date(),
          });
        }
      }

      // Alert for upcoming check-out
      if (hoursUntilCheckOut > 0 && hoursUntilCheckOut <= 2) {
        const alertId = `alert-checkout-${reservation.id}`;
        if (!existingAlertIds.has(alertId)) {
          newAlerts.push({
            id: alertId,
            propertyId: reservation.propertyId,
            type: 'check_out_today',
            level: 'warning',
            title: {
              en: `Check-out: ${reservation.guestName}`,
              es: `Check-out: ${reservation.guestName}`,
            },
            message: {
              en: `Guest ${reservation.guestName} checking out at ${checkOutDate.toLocaleTimeString()}`,
              es: `Huésped ${reservation.guestName} saldrá a las ${checkOutDate.toLocaleTimeString()}`,
            },
            relatedEntity: {
              type: 'reservation',
              id: reservation.id,
            },
            isDismissed: false,
            createdAt: new Date(),
          });
        }
      }

      // Alert for payment due at check-out
      if (reservation.balanceDue > 0 && hoursUntilCheckOut > 0 && hoursUntilCheckOut <= 24) {
        const alertId = `alert-payment-${reservation.id}`;
        if (!existingAlertIds.has(alertId)) {
          newAlerts.push({
            id: alertId,
            propertyId: reservation.propertyId,
            type: 'pending_payment',
            level: 'critical',
            title: {
              en: `Payment due: $${reservation.balanceDue.toFixed(2)}`,
              es: `Pago debido: $${reservation.balanceDue.toFixed(2)}`,
            },
            message: {
              en: `${reservation.guestName} owes $${reservation.balanceDue.toFixed(2)} due at checkout`,
              es: `${reservation.guestName} debe $${reservation.balanceDue.toFixed(2)} al salir`,
            },
            relatedEntity: {
              type: 'reservation',
              id: reservation.id,
            },
            isDismissed: false,
            createdAt: new Date(),
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      const updatedAlerts = [...automatedAlerts, ...newAlerts];
      setAutomatedAlerts(updatedAlerts);
      onAlertsChange?.(updatedAlerts);
    }
  }, [reservations, automatedAlerts, defaultConfig, onAlertsChange]);

  /**
   * Auto-update cleaning status for rooms based on reservation checkout
   */
  const autoUpdateCleaningStatus = useCallback(() => {
    if (!defaultConfig.autoUpdateCleaningStatus) return;

    const now = new Date();
    const updatedTasks = automatedTasks.map(task => {
      if (task.type === 'cleaning' && task.status === 'pending') {
        const dueDate = new Date(task.dueDate);
        
        // Mark post-checkout cleaning as needed immediately after checkout
        if (task.id.includes('cleaning-after') && dueDate <= now) {
          return { ...task, status: 'pending', priority: 'high' };
        }

        // Mark pre-arrival cleaning as in-progress 2 hours before check-in
        if (task.id.includes('cleaning-before') && dueDate <= new Date(now.getTime() + 2 * 60 * 60 * 1000)) {
          return { ...task, status: 'in_progress' };
        }
      }
      return task;
    });

    if (JSON.stringify(updatedTasks) !== JSON.stringify(automatedTasks)) {
      setAutomatedTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    }
  }, [automatedTasks, defaultConfig.autoUpdateCleaningStatus, onTasksChange]);

  /**
   * Get critical tasks that need immediate attention
   */
  const getCriticalTasksForToday = useCallback(() => {
    return getCriticalTasks(automatedTasks);
  }, [automatedTasks]);

  /**
   * Update task status
   */
  const updateTaskStatus = useCallback((taskId: string, newStatus: string) => {
    const updatedTasks = automatedTasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus as any, updatedAt: new Date() }
        : task
    );
    setAutomatedTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  }, [automatedTasks, onTasksChange]);

  /**
   * Dismiss alert
   */
  const dismissAlert = useCallback((alertId: string) => {
    const updatedAlerts = automatedAlerts.map(alert =>
      alert.id === alertId
        ? { ...alert, isDismissed: true }
        : alert
    );
    setAutomatedAlerts(updatedAlerts);
    onAlertsChange?.(updatedAlerts);
  }, [automatedAlerts, onAlertsChange]);

  /**
   * Run automation checks periodically
   */
  useEffect(() => {
    autoGenerateTasks();
    autoCreateAlerts();
    autoUpdateCleaningStatus();

    // Re-run every 5 minutes to catch changes
    const interval = setInterval(() => {
      autoCreateAlerts();
      autoUpdateCleaningStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoGenerateTasks, autoCreateAlerts, autoUpdateCleaningStatus]);

  return {
    tasks: automatedTasks,
    alerts: automatedAlerts,
    criticalTasks: getCriticalTasksForToday(),
    updateTaskStatus,
    dismissAlert,
  };
}
