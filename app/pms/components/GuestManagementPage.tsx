'use client';

import { Guest } from '../types';
import { useCRUD } from '../hooks/useCRUD';
import GuestList from './GuestList';
import GuestForm from './GuestForm';

interface GuestManagementPageProps {
  initialGuests: Guest[];
}

export default function GuestManagementPage({ initialGuests }: GuestManagementPageProps) {
  const [state, actions] = useCRUD<Guest>(initialGuests);

  const handleAdd = () => {
    actions.setSelectedItem(null);
    actions.openModal();
  };

  const handleEdit = (guest: Guest) => {
    actions.setSelectedItem(guest);
    actions.openModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      actions.delete(id);
    }
  };

  const handleSubmit = (guest: Guest) => {
    if (state.selectedItem) {
      actions.update(guest.id, guest);
    } else {
      actions.create(guest);
    }
  };

  return (
    <div>
      <GuestList guests={state.items} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />

      {state.isModalOpen && <GuestForm guest={state.selectedItem || undefined} onSubmit={handleSubmit} onCancel={actions.closeModal} />}
    </div>
  );
}
