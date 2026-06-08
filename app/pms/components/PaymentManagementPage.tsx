'use client';

import { PaymentEntry } from '../types';
import { useCRUD } from '../hooks/useCRUD';
import PaymentList from './PaymentList';
import PaymentForm from './PaymentForm';

interface PaymentManagementPageProps {
  initialPayments: PaymentEntry[];
  propertyId: string;
}

export default function PaymentManagementPage({
  initialPayments,
  propertyId,
}: PaymentManagementPageProps) {
  const [state, actions] = useCRUD<PaymentEntry>(initialPayments);
  const [selectedReservation, setSelectedReservation] = '';

  const handleAdd = () => {
    if (!selectedReservation) {
      alert('Please select a reservation');
      return;
    }
    actions.setSelectedItem(null);
    actions.openModal();
  };

  const handleEdit = (payment: PaymentEntry) => {
    actions.setSelectedItem(payment);
    actions.openModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      actions.delete(id);
    }
  };

  const handleSubmit = (payment: PaymentEntry) => {
    if (state.selectedItem) {
      actions.update(payment.id, payment);
    } else {
      actions.create(payment);
    }
  };

  return (
    <div>
      <PaymentList
        payments={state.items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {state.isModalOpen && (
        <PaymentForm
          payment={state.selectedItem || undefined}
          reservationId={selectedReservation}
          propertyId={propertyId}
          onSubmit={handleSubmit}
          onCancel={actions.closeModal}
        />
      )}
    </div>
  );
}
