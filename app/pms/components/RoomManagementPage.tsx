'use client';

import { useState } from 'react';
import { Room } from '../types';
import { useCRUD } from '../hooks/useCRUD';
import RoomList from './RoomList';
import RoomForm from './RoomForm';

interface RoomManagementPageProps {
  initialRooms: Room[];
  propertyId?: string;
}

export default function RoomManagementPage({ initialRooms, propertyId }: RoomManagementPageProps) {
  const [state, actions] = useCRUD<Room>(initialRooms);
  const [currentPropertyId, setCurrentPropertyId] = useState(propertyId);

  const handleAdd = () => {
    if (!currentPropertyId) {
      alert('Please select a property first');
      return;
    }
    actions.setSelectedItem(null);
    actions.openModal();
  };

  const handleEdit = (room: Room) => {
    actions.setSelectedItem(room);
    actions.openModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      actions.delete(id);
    }
  };

  const handleSubmit = (room: Room) => {
    if (state.selectedItem) {
      actions.update(room.id, room);
    } else {
      actions.create(room);
    }
  };

  return (
    <div>
      <RoomList
        rooms={state.items}
        propertyId={currentPropertyId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {state.isModalOpen && currentPropertyId && (
        <RoomForm
          room={state.selectedItem || undefined}
          propertyId={currentPropertyId}
          onSubmit={handleSubmit}
          onCancel={actions.closeModal}
        />
      )}
    </div>
  );
}
