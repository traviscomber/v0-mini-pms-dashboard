'use client';

import { useState } from 'react';
import { Property } from '../types';
import { useCRUD } from '../hooks/useCRUD';
import PropertyList from './PropertyList';
import PropertyForm from './PropertyForm';

interface PropertyManagementPageProps {
  initialProperties: Property[];
}

export default function PropertyManagementPage({ initialProperties }: PropertyManagementPageProps) {
  const [state, actions] = useCRUD<Property>(initialProperties);

  const handleAdd = () => {
    actions.setSelectedItem(null);
    actions.openModal();
  };

  const handleEdit = (property: Property) => {
    actions.setSelectedItem(property);
    actions.openModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      actions.delete(id);
    }
  };

  const handleSubmit = (property: Property) => {
    if (state.selectedItem) {
      // Update existing property
      actions.update(property.id, property);
    } else {
      // Create new property
      actions.create(property);
    }
  };

  return (
    <div>
      <PropertyList
        properties={state.items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {state.isModalOpen && (
        <PropertyForm
          property={state.selectedItem || undefined}
          onSubmit={handleSubmit}
          onCancel={actions.closeModal}
        />
      )}
    </div>
  );
}
