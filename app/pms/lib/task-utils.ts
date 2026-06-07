import { Reservation, Task, TaskStatus, TaskType, TaskPriority } from '../types';

/**
 * Auto-generate operational tasks when a reservation is confirmed
 * Creates check-in, check-out, cleaning, and inspection tasks
 */
export function generateTasksFromReservation(reservation: Reservation): Task[] {
  const tasks: Task[] = [];
  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);

  // Check-in task: day of arrival, morning
  tasks.push({
    id: `task-${reservation.id}-checkin`,
    reservationId: reservation.id,
    roomId: reservation.roomId,
    type: 'check_in',
    title: `Check-in: ${reservation.guestName}`,
    description: `Prepare room and check in guest ${reservation.guestName}. Contact: ${reservation.guestPhone || 'N/A'}`,
    status: 'pending',
    priority: 'high',
    dueDate: checkInDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Cleaning task: day of check-in (after check-in)
  tasks.push({
    id: `task-${reservation.id}-cleaning-before`,
    reservationId: reservation.id,
    roomId: reservation.roomId,
    type: 'cleaning',
    title: `Pre-arrival cleaning: ${reservation.guestName}`,
    description: 'Deep clean room before guest arrival',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(checkInDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Check-out task: day of departure
  tasks.push({
    id: `task-${reservation.id}-checkout`,
    reservationId: reservation.id,
    roomId: reservation.roomId,
    type: 'check_out',
    title: `Check-out: ${reservation.guestName}`,
    description: `Process checkout, collect payment, check room condition`,
    status: 'pending',
    priority: 'high',
    dueDate: checkOutDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Cleaning task: after check-out
  tasks.push({
    id: `task-${reservation.id}-cleaning-after`,
    reservationId: reservation.id,
    roomId: reservation.roomId,
    type: 'cleaning',
    title: `Post-checkout cleaning: ${reservation.guestName}`,
    description: 'Deep clean and prepare room for next guests',
    status: 'pending',
    priority: 'normal',
    dueDate: new Date(checkOutDate.getTime() + 60 * 60 * 1000), // 1 hour after
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Inspection task: after cleaning
  tasks.push({
    id: `task-${reservation.id}-inspection`,
    reservationId: reservation.id,
    roomId: reservation.roomId,
    type: 'inspection',
    title: `Room inspection: ${reservation.roomId}`,
    description: 'Quality check after cleaning',
    status: 'pending',
    priority: 'normal',
    dueDate: new Date(checkOutDate.getTime() + 120 * 60 * 1000), // 2 hours after
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Payment reminder task (if balance due)
  if (reservation.balanceDue > 0) {
    tasks.push({
      id: `task-${reservation.id}-payment`,
      reservationId: reservation.id,
      roomId: reservation.roomId,
      type: 'payment',
      title: `Payment reminder: $${reservation.balanceDue.toFixed(2)} due`,
      description: `Collect remaining payment before or at check-out`,
      status: 'pending',
      priority: 'high',
      dueDate: checkOutDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return tasks;
}

/**
 * Get all tasks for a specific date grouped by status
 */
export function getTasksForDate(tasks: Task[], date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return tasks.filter(
    (task) => task.dueDate >= startOfDay && task.dueDate <= endOfDay
  );
}

/**
 * Group tasks by status for Kanban board
 */
export function groupTasksByStatus(tasks: Task[]) {
  return {
    pending: tasks.filter((t) => t.status === 'pending'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    completed: tasks.filter((t) => t.status === 'completed'),
    cancelled: tasks.filter((t) => t.status === 'cancelled'),
  };
}

/**
 * Get high-priority tasks due today or overdue
 */
export function getCriticalTasks(tasks: Task[]): Task[] {
  const now = new Date();
  return tasks.filter(
    (task) =>
      task.status !== 'completed' &&
      task.status !== 'cancelled' &&
      (task.priority === 'urgent' ||
        (task.priority === 'high' && task.dueDate <= now))
  );
}

/**
 * Calculate task completion percentage
 */
export function getTaskCompletionStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  return {
    total,
    completed,
    inProgress,
    pending,
    completionPercentage: total > 0 ? (completed / total) * 100 : 0,
  };
}
