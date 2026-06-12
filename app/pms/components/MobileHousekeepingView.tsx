'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { groupTasksByStatus } from '../lib/task-utils';
import { CheckCircle2, Clock, AlertCircle, Phone, MapPin, Zap } from 'lucide-react';

interface MobileHousekeepingViewProps {
  tasks: Task[];
  onUpdateTask?: (taskId: string, status: TaskStatus) => void;
}

const statusConfig = {
  pending: { label: 'To Do', color: 'bg-secondary500/20', textColor: 'text-secondary700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-primary/20', textColor: 'text-primary', icon: Zap },
  completed: { label: 'Done', color: 'bg-chart-2/20', textColor: 'text-green-700', icon: CheckCircle2 },
};

export default function MobileHousekeepingView({
  tasks,
  onUpdateTask,
}: MobileHousekeepingViewProps) {
  const [currentFilter, setCurrentFilter] = useState<TaskStatus>('pending');
  const tasksByStatus = groupTasksByStatus(tasks.filter((t) => t.type === 'cleaning'));
  const filteredTasks = tasksByStatus[currentFilter] || [];

  // Quick stats
  const stats = {
    pending: tasksByStatus.pending?.length || 0,
    inProgress: tasksByStatus.in_progress?.length || 0,
    completed: tasksByStatus.completed?.length || 0,
  };

  const completionRate = tasks.length > 0 
    ? Math.round((stats.completed / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-4">
        <h1 className="text-xl font-bold">Cleaning Tasks</h1>
        <p className="text-xs text-foreground/60 mt-1">
          {completionRate}% Complete • {stats.pending} pending
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <button
          onClick={() => setCurrentFilter('pending')}
          className={`p-3 rounded-lg transition ${
            currentFilter === 'pending'
              ? 'bg-secondary500/20 border-2 border-secondary500'
              : 'bg-background border border-border'
          }`}
        >
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs mt-1">Pending</p>
        </button>
        <button
          onClick={() => setCurrentFilter('in_progress')}
          className={`p-3 rounded-lg transition ${
            currentFilter === 'in_progress'
              ? 'bg-primary/20 border-2 border-primary'
              : 'bg-background border border-border'
          }`}
        >
          <p className="text-2xl font-bold">{stats.inProgress}</p>
          <p className="text-xs mt-1">Active</p>
        </button>
        <button
          onClick={() => setCurrentFilter('completed')}
          className={`p-3 rounded-lg transition ${
            currentFilter === 'completed'
              ? 'bg-chart-2/20 border-2 border-chart-2'
              : 'bg-background border border-border'
          }`}
        >
          <p className="text-2xl font-bold">{stats.completed}</p>
          <p className="text-xs mt-1">Done</p>
        </button>
      </div>

      {/* Task List */}
      <div className="px-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <p className="font-semibold">All Done!</p>
            <p className="text-sm text-foreground/60 mt-1">
              {currentFilter === 'completed'
                ? 'Great work today!'
                : 'No tasks in this category'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border-2 transition ${
                task.priority === 'urgent'
                  ? 'bg-destructive/10 border-destructive shadow-lg shadow-red-500/20'
                  : task.priority === 'high'
                  ? 'bg-destructive500/10 border-destructive500'
                  : 'bg-card border-border'
              }`}
            >
              {/* Room Number - Large and Prominent */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-primary">{task.roomId}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">Room</p>
                </div>
                {task.priority === 'urgent' && (
                  <span className="px-2 py-1 bg-destructive text-white text-xs font-bold rounded">
                    URGENT
                  </span>
                )}
              </div>

              {/* Task Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-foreground/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-foreground/60 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>

                {task.assignedTo && (
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <Phone className="w-3 h-3" />
                    Assigned to {task.assignedTo}
                  </div>
                )}
              </div>

              {/* Status Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdateTask?.(task.id, 'pending')}
                  className={`py-2 px-2 rounded text-xs font-medium transition ${
                    task.status === 'pending'
                      ? 'bg-secondary600 text-white'
                      : 'bg-secondary500/20 text-secondary700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => onUpdateTask?.(task.id, 'in_progress')}
                  className={`py-2 px-2 rounded text-xs font-medium transition ${
                    task.status === 'in_progress'
                      ? 'bg-primary text-white'
                      : 'bg-primary/20 text-primary'
                  }`}
                >
                  Working
                </button>
                <button
                  onClick={() => onUpdateTask?.(task.id, 'completed')}
                  className={`py-2 px-2 rounded text-xs font-medium transition ${
                    task.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-chart-2/20 text-green-700'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completion Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              {stats.completed} of {tasks.length} tasks completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{completionRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
