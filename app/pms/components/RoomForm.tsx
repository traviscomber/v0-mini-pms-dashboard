'use client';

import { useState } from 'react';
import { Room, RoomTypeKey, BilingualText } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

const ROOM_TYPES: { value: RoomTypeKey; label: string }[] = [
  { value: 'room', label: 'Standard Room' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'suite', label: 'Suite' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'studio', label: 'Studio' },
  { value: 'villa', label: 'Villa' },
];

interface RoomFormProps {
  propertyId: string;
  room?: Room;
  onSave: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function RoomForm({ propertyId, room, onSave, onCancel }: RoomFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name_en: room?.name.en || '',
    name_es: room?.name.es || '',
    roomNumber: room?.roomNumber || '',
    type: (room?.type as RoomTypeKey) || 'room',
    capacity: room?.capacity || 1,
    bedrooms: room?.bedrooms || 1,
    bathrooms: room?.bathrooms || 1,
    basePrice: room?.basePrice || 100,
    notes_en: room?.notes?.en || '',
    notes_es: room?.notes?.es || '',
    status: room?.status || 'available',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRoom: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
      propertyId,
      name: { en: formData.name_en, es: formData.name_es },
      roomNumber: formData.roomNumber,
      type: formData.type,
      capacity: formData.capacity,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      basePrice: formData.basePrice,
      notes: { en: formData.notes_en, es: formData.notes_es },
      amenities: room?.amenities || [],
      status: formData.status as any,
    };

    onSave(newRoom);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-foreground">
            {room ? t('common.edit') : t('common.create')} Room
          </h2>
          <button onClick={onCancel} className="text-foreground/60 hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Name - Bilingual */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Room Name (English)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Ocean View Suite"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre de Habitación (Español)
              </label>
              <input
                type="text"
                value={formData.name_es}
                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Suite con Vista al Océano"
              />
            </div>
          </div>

          {/* Room Number and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Room Number</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomTypeKey })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Capacity and Beds */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Capacity (Guests)</label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
              <input
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bathrooms</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Price and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Base Price (per night)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="blocked">Blocked</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          {/* Notes - Bilingual */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notes (English)</label>
              <textarea
                value={formData.notes_en}
                onChange={(e) => setFormData({ ...formData, notes_en: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notas (Español)</label>
              <textarea
                value={formData.notes_es}
                onChange={(e) => setFormData({ ...formData, notes_es: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-foreground border border-border rounded-md hover:bg-background/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Save Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
