'use client';

import { Task } from '../types';
import { useCRUD } from '../hooks/useCRUD';
import TaskList from './TaskList';

interface TaskManagementPageProps {
  initialTasks: Task[];
}

export default function TaskManagementPage({ initialTasks }: TaskManagementPageProps) {
  const [state, actions] = useCRUD<Task>(initialTasks);

  const handleAdd = () => {
    actions.setSelectedItem(null);
    actions.openModal();
  };

  const handleEdit = (task: Task) => {
    actions.setSelectedItem(task);
    actions.openModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      actions.delete(id);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    const task = state.items.find((t) => t.id === id);
    if (task) {
      actions.update(id, {
        ...task,
        status: status as any,
        completedAt: status === 'completed' ? new Date() : undefined,
      });
    }
  };

  return (
    <div>
      <TaskList
        tasks={state.items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
