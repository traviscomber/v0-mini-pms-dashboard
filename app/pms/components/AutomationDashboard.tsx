'use client';

import { useState, useMemo } from 'react';
import { Clock, AlertCircle, CheckCircle2, Home, Zap, Users } from 'lucide-react';

interface AutomationDashboardProps {
  tasks: any[];
  alerts: any[];
  criticalTasks: any[];
  onTaskStatusChange?: (taskId: string, status: string) => void;
  onAlertDismiss?: (alertId: string) => void;
}

export default function AutomationDashboard({
  tasks,
  alerts,
  criticalTasks,
  onTaskStatusChange,
  onAlertDismiss,
}: AutomationDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'alerts' | 'status'>('tasks');

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
    const pendingTasks = tasks.filter((t: any) => t.status === 'pending').length;

    const totalAlerts = alerts.filter((a: any) => !a.isDismissed).length;
    const criticalAlerts = alerts.filter((a: any) => !a.isDismissed && a.level === 'critical').length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalAlerts,
      criticalAlerts,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }, [tasks, alerts]);

  const groupedTasks = useMemo(() => {
    return {
      checkin: tasks.filter((t: any) => t.type === 'check_in'),
      checkout: tasks.filter((t: any) => t.type === 'check_out'),
      cleaning: tasks.filter((t: any) => t.type === 'cleaning'),
      maintenance: tasks.filter((t: any) => t.type === 'maintenance'),
      inspection: tasks.filter((t: any) => t.type === 'inspection'),
    };
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'warning':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground/60 mb-1">Tareas Hoy</p>
              <p className="text-2xl font-bold text-foreground">{stats.pendingTasks}</p>
            </div>
            <Clock className="w-8 h-8 text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground/60 mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-foreground">{stats.inProgressTasks}</p>
            </div>
            <Zap className="w-8 h-8 text-accent opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground/60 mb-1">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground/60 mb-1">Alertas</p>
              <p className="text-2xl font-bold text-orange-600">{stats.criticalAlerts}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'tasks'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          📋 Tareas ({stats.pendingTasks})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'alerts'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          🔔 Alertas ({stats.criticalAlerts})
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'status'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          🏠 Estado de Limpieza
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Tareas Críticas */}
          {criticalTasks.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 mb-3">⚠️ Tareas Críticas</h3>
              <div className="space-y-2">
                {criticalTasks.map((task: any) => (
                  <div key={task.id} className="bg-red-500/5 p-3 rounded border border-red-500/20">
                    <p className="font-semibold text-foreground">{task.title}</p>
                    <p className="text-sm text-foreground/60">{task.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onTaskStatusChange?.(task.id, 'in_progress')}
                        className="px-3 py-1 bg-blue-500/20 text-blue-700 rounded text-xs hover:bg-blue-500/30"
                      >
                        En Progreso
                      </button>
                      <button
                        onClick={() => onTaskStatusChange?.(task.id, 'completed')}
                        className="px-3 py-1 bg-green-500/20 text-green-700 rounded text-xs hover:bg-green-500/30"
                      >
                        Completar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check-in Tasks */}
          {groupedTasks.checkin.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Check-ins ({groupedTasks.checkin.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.checkin.map((task: any) => (
                  <div key={task.id} className={`p-3 rounded border ${getStatusColor(task.status)}`}>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm">{new Date(task.dueDate).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cleaning Tasks */}
          {groupedTasks.cleaning.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Home className="w-4 h-4" /> Limpieza ({groupedTasks.cleaning.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.cleaning.map((task: any) => (
                  <div key={task.id} className={`p-3 rounded border ${getStatusColor(task.status)}`}>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm">{task.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onTaskStatusChange?.(task.id, 'in_progress')}
                        className="px-2 py-1 bg-blue-500/20 text-blue-700 rounded text-xs hover:bg-blue-500/30"
                      >
                        En Progreso
                      </button>
                      <button
                        onClick={() => onTaskStatusChange?.(task.id, 'completed')}
                        className="px-2 py-1 bg-green-500/20 text-green-700 rounded text-xs hover:bg-green-500/30"
                      >
                        Completar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">✓ Sin alertas pendientes</p>
          ) : (
            alerts.filter((a: any) => !a.isDismissed).map((alert: any) => (
              <div key={alert.id} className={`p-4 rounded border ${getAlertColor(alert.level)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{alert.title.es || alert.title}</p>
                    <p className="text-sm">{alert.message.es || alert.message}</p>
                  </div>
                  <button
                    onClick={() => onAlertDismiss?.(alert.id)}
                    className="text-xs px-2 py-1 bg-black/20 rounded hover:bg-black/30"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Status Tab */}
      {activeTab === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Pre-arribo (Limpieza)</h3>
            <div className="space-y-2">
              {groupedTasks.cleaning
                .filter((t: any) => t.title.includes('Pre-arrival'))
                .map((task: any) => (
                  <div key={task.id} className={`p-3 rounded border ${getStatusColor(task.status)}`}>
                    <p className="text-sm font-semibold">{task.title}</p>
                    <p className="text-xs text-foreground/60">Vencimiento: {new Date(task.dueDate).toLocaleString()}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Post-salida (Limpieza)</h3>
            <div className="space-y-2">
              {groupedTasks.cleaning
                .filter((t: any) => t.title.includes('Post-checkout'))
                .map((task: any) => (
                  <div key={task.id} className={`p-3 rounded border ${getStatusColor(task.status)}`}>
                    <p className="text-sm font-semibold">{task.title}</p>
                    <p className="text-xs text-foreground/60">Vencimiento: {new Date(task.dueDate).toLocaleString()}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
