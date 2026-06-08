'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { groupTasksByStatus } from '../lib/task-utils';
import { GripVertical, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface HousekeepingBoardProps {
  tasks: Task[];
  onUpdateTask?: (taskId: string, status: TaskStatus) => void;
  onDeleteTask?: (taskId: string) => void;
}

const statusConfig = {
  pending: { labelKey: 'housekeeping.pending', color: 'bg-amber-500/20', textColor: 'text-amber-700', icon: Clock },
  in_progress: { labelKey: 'housekeeping.inProgress', color: 'bg-blue-500/20', textColor: 'text-blue-700', icon: AlertCircle },
  completed: { labelKey: 'housekeeping.completed', color: 'bg-green-500/20', textColor: 'text-green-700', icon: CheckCircle2 },
  cancelled: { labelKey: 'housekeeping.cancelled', color: 'bg-gray-500/20', textColor: 'text-gray-700', icon: Trash2 },
};

export default function HousekeepingBoard({
  tasks,
  onUpdateTask,
  onDeleteTask,
}: HousekeepingBoardProps) {
  const { t } = useLanguage();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const tasksByStatus = groupTasksByStatus(tasks.filter((t) => t.type === 'cleaning'));

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask?.(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  const renderColumn = (status: TaskStatus, columnTasks: Task[]) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div
        key={status}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(status)}
        className="bg-card border border-border rounded-lg p-4 flex flex-col"
      >
        {/* Column Header */}
        <div className="flex items-center gap-2 mb-4">
          <Icon className={`w-5 h-5 ${config.textColor}`} />
          <h3 className="font-semibold">{t(config.labelKey)}</h3>
          <span className="ml-auto bg-foreground/10 text-foreground/60 text-sm font-medium px-2 py-1 rounded">
            {columnTasks.length}
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-2 flex-1">
          {columnTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(task)}
              className={`p-3 ${config.color} rounded-lg cursor-grab active:cursor-grabbing border border-transparent hover:border-foreground/20 transition`}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-foreground/40 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-foreground/60 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-foreground/10 rounded">
                      {task.roomId}
                    </span>
                    {task.priority === 'urgent' && (
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-700 rounded font-medium">
                        URGENT
                      </span>
                    )}
                    {task.priority === 'high' && (
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-700 rounded">
                        High
                      </span>
                    )}
                  </div>
                  {task.assignedTo && (
                    <p className="text-xs text-foreground/50 mt-2">
                      Assigned to: {task.assignedTo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {columnTasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-foreground/40">
              <p className="text-sm">No tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Board Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-foreground/60">
          Drag tasks between columns to update their status. Cleaning tasks are automatically generated when guests check out.
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(statusConfig).map((status) =>
          renderColumn(
            status as TaskStatus,
            tasksByStatus[status as TaskStatus] || []
          )
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Total Cleaning Tasks</p>
          <p className="text-2xl font-bold mt-1">{tasks.filter((t) => t.type === 'cleaning').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Completion Rate</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {tasks.length > 0
              ? Math.round(
                  (tasks.filter((t) => t.status === 'completed').length /
                    tasks.length) *
                    100
                )
              : 0}
            %
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Critical Tasks</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Assigned Tasks</p>
          <p className="text-2xl font-bold mt-1">
            {tasks.filter((t) => t.assignedTo).length}
          </p>
        </div>
      </div>
    </div>
  );
}
