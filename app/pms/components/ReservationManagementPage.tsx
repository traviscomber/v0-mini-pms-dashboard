'use client';

import { Reservation, Room, Guest } from '../types';
import { useCRUD } from '../hooks/useCRUD';
import ReservationList from './ReservationList';
import ReservationForm from './ReservationForm';

interface ReservationManagementPageProps {
  initialReservations: Reservation[];
  rooms: Room[];
  guests: Guest[];
  propertyId?: string;
}

export default function ReservationManagementPage({
  initialReservations,
  rooms,
  guests,
  propertyId,
}: ReservationManagementPageProps) {
  const [state, actions] = useCRUD<Reservation>(initialReservations);

  const handleAdd = () => {
    if (!propertyId) {
      alert('Please select a property');
      return;
    }
    actions.setSelectedItem(null);
    actions.openModal();
  };

  const handleEdit = (reservation: Reservation) => {
    actions.setSelectedItem(reservation);
    actions.openModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      actions.delete(id);
    }
  };

  const handleSubmit = (reservation: Reservation) => {
    if (state.selectedItem) {
      actions.update(reservation.id, reservation);
    } else {
      actions.create(reservation);
    }
  };

  return (
    <div>
      <ReservationList
        reservations={state.items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {state.isModalOpen && propertyId && (
        <ReservationForm
          reservation={state.selectedItem || undefined}
          propertyId={propertyId}
          rooms={rooms}
          guests={guests}
          onSubmit={handleSubmit}
          onCancel={actions.closeModal}
        />
      )}
    </div>
  );
}
