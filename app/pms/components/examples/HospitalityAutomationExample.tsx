'use client';

import { useState, useCallback } from 'react';
import { useAutomation } from '@/app/pms/hooks/useAutomation';
import AutomationDashboard from '@/app/pms/components/AutomationDashboard';
import { Reservation, Task, Alert } from '@/app/pms/types';

/**
 * EJEMPLO: Implementación de Automatización de Hospitalidad
 * 
 * Este componente demuestra cómo integrar el sistema de automatización
 * en tu aplicación PMS.
 */

interface HospitalityAutomationExampleProps {
  propertyId: string;
}

export default function HospitalityAutomationExample({
  propertyId,
}: HospitalityAutomationExampleProps) {
  // Estado de reservaciones, tareas y alertas
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'res-001',
      propertyId,
      roomId: 'room-101',
      guestId: 'guest-001',
      guestName: 'John Smith',
      guestEmail: 'john@example.com',
      guestPhone: '+1-555-0123',
      checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
      source: 'direct',
      reservationStatus: 'confirmed',
      paymentStatus: 'partially_paid',
      cleaningStatus: 'clean',
      totalAmount: 450,
      paidAmount: 300,
      balanceDue: 150, // Balance pendiente - creará alerta automáticamente
      numberOfGuests: 2,
      specialRequests: {
        en: 'Late checkout requested',
        es: 'Se solicitó check-out tardío',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'res-002',
      propertyId,
      roomId: 'room-202',
      guestId: 'guest-002',
      guestName: 'Maria Garcia',
      guestEmail: 'maria@example.com',
      guestPhone: '+1-555-0456',
      checkInDate: new Date(), // Hoy
      checkOutDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // En 1 hora
      source: 'booking.com',
      reservationStatus: 'confirmed',
      paymentStatus: 'paid',
      cleaningStatus: 'dirty', // Necesita limpieza después de checkout
      totalAmount: 350,
      paidAmount: 350,
      balanceDue: 0,
      numberOfGuests: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Inicializar el hook de automatización
  const automation = useAutomation(
    reservations,
    tasks,
    alerts,
    setTasks,
    setAlerts,
    {
      autoGenerateTasks: true, // Generar tareas automáticamente
      autoCreateAlerts: true, // Crear alertas automáticamente
      autoUpdateCleaningStatus: true, // Actualizar limpieza
      notifyHoursBefore: 24, // Notificar 24h antes de check-in
    }
  );

  // Callback para cuando se actualiza el estado de una tarea
  const handleTaskStatusUpdate = useCallback(
    (taskId: string, newStatus: string) => {
      console.log(`[Automatización] Tarea actualizada: ${taskId} → ${newStatus}`);
      automation.updateTaskStatus(taskId, newStatus);

      // Aquí podrías enviar una notificación
      // await notifyStaff(`Tarea completada: ${taskId}`);

      // O actualizar la UI
      // toast.success('Tarea actualizada');
    },
    [automation]
  );

  // Callback para cuando se descarta una alerta
  const handleAlertDismiss = useCallback(
    (alertId: string) => {
      console.log(`[Automatización] Alerta descartada: ${alertId}`);
      automation.dismissAlert(alertId);

      // Aquí podrías loguear quién descartó la alerta
      // logAuditTrail('alert_dismissed', { alertId, userId });
    },
    [automation]
  );

  // Función para agregar una nueva reserva (ejemplo)
  const addNewReservation = useCallback(() => {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      propertyId,
      roomId: 'room-303',
      guestId: 'guest-new',
      guestName: 'New Guest',
      guestEmail: 'newguest@example.com',
      guestPhone: '+1-555-0789',
      checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      source: 'direct',
      reservationStatus: 'pending',
      paymentStatus: 'pending',
      cleaningStatus: 'clean',
      totalAmount: 600,
      paidAmount: 0,
      balanceDue: 600,
      numberOfGuests: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setReservations((prev) => [...prev, newReservation]);

    // El hook automáticamente:
    // 1. Generará 5-6 tareas para esta reserva
    // 2. Creará alertas cuando se acerque el check-in/check-out
    // 3. Creará alerta de pago pendiente
  }, [propertyId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automatización Hospitalaria</h1>
          <p className="text-foreground/60">Sistema automático de tareas y alertas</p>
        </div>
        <button
          onClick={addNewReservation}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          + Nueva Reserva (Demo)
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">Total Reservas</p>
          <p className="text-2xl font-bold text-foreground mt-2">{reservations.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">Tareas Generadas</p>
          <p className="text-2xl font-bold text-foreground mt-2">{automation.tasks.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">Alertas Activas</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {automation.alerts.filter((a) => !a.isDismissed).length}
          </p>
        </div>
      </div>

      {/* Main Automation Dashboard */}
      <div className="bg-card border border-border rounded-lg p-6">
        <AutomationDashboard
          tasks={automation.tasks}
          alerts={automation.alerts}
          criticalTasks={automation.criticalTasks}
          onTaskStatusChange={handleTaskStatusUpdate}
          onAlertDismiss={handleAlertDismiss}
        />
      </div>

      {/* Debug Info (Solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="bg-card border border-border rounded-lg p-4">
          <summary className="cursor-pointer font-semibold text-foreground">
            📊 Debug Info
          </summary>
          <pre className="mt-4 text-xs bg-background p-3 rounded overflow-auto max-h-48">
            {JSON.stringify(
              {
                totalTasks: automation.tasks.length,
                tasksStatus: {
                  pending: automation.tasks.filter((t) => t.status === 'pending').length,
                  in_progress: automation.tasks.filter((t) => t.status === 'in_progress').length,
                  completed: automation.tasks.filter((t) => t.status === 'completed').length,
                },
                activeAlerts: automation.alerts.filter((a) => !a.isDismissed).length,
                criticalTasksCount: automation.criticalTasks.length,
                lastUpdated: new Date().toISOString(),
              },
              null,
              2
            )}
          </pre>
        </details>
      )}

      {/* Instrucciones */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="font-semibold text-blue-700 mb-2">📖 Cómo Usar:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✓ El sistema genera automáticamente tareas cuando se crea una reserva</li>
          <li>✓ Las alertas se crean automáticamente 24h antes de check-in</li>
          <li>✓ Las alertas de checkout se crean 2h antes</li>
          <li>✓ Haz clic en "Nueva Reserva (Demo)" para ver cómo funciona</li>
          <li>✓ Las tareas se actualizan cada 5 minutos automáticamente</li>
          <li>✓ Puedes cambiar el estado de las tareas a "En Progreso" o "Completar"</li>
        </ul>
      </div>
    </div>
  );
}
