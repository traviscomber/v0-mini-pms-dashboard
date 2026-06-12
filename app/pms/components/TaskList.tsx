'use client';

import { Task } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '../lib/date-utils';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onAdd,
  onStatusChange,
}: TaskListProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      in_progress: 'bg-blue-500/20 text-blue-300',
      completed: 'bg-green-500/20 text-green-300',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || 'bg-card/500/20 text-foreground/50';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-300',
      normal: 'text-blue-300',
      high: 'text-orange-300',
      urgent: 'text-red-300',
    };
    return colors[priority] || 'text-foreground/50';
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent');

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('tasks.title')}</h1>
          <p className="text-foreground/60">{t('tasks.subtitle')}</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {t('crud.add')} Task
        </button>
      </div>

      {urgentTasks.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-300 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">{urgentTasks.length} Urgent Task(s)</span>
          </div>
          <ul className="space-y-1 ml-7">
            {urgentTasks.map((task) => (
              <li key={task.id} className="text-sm text-red-300/80">
                • {task.title} (Due: {formatDate(task.dueDate)})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {['pending', 'in_progress', 'completed', 'cancelled'].map((status) => {
          const count = tasks.filter((t) => t.status === status).length;
          return (
            <div key={status} className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-sm text-foreground/60 capitalize">{status}</p>
              <p className="text-2xl font-bold text-foreground">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition flex items-start justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(
                  task.priority
                )}`}>
                  {task.priority}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
              <p className="text-sm text-foreground/60">
                {task.description}
              </p>
              <p className="text-xs text-foreground/50 mt-2">
                Due: {formatDate(task.dueDate)}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              {task.status !== 'completed' && (
                <button
                  onClick={() => onStatusChange?.(task.id, 'completed')}
                  className="p-2 hover:bg-green-500/20 rounded transition"
                  title="Mark complete"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                </button>
              )}
              <button
                onClick={() => onEdit(task)}
                className="p-2 hover:bg-blue-500/20 rounded transition"
              >
                <Edit2 className="w-4 h-4 text-blue-300" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 hover:bg-red-500/20 rounded transition"
              >
                <Trash2 className="w-4 h-4 text-red-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">{t('crud.noResults')}</p>
        </div>
      )}
    </div>
  );
}
