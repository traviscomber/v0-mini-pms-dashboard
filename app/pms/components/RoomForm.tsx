'use client';

import { useState } from 'react';
import { Room } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

interface RoomFormProps {
  room?: Room;
  propertyId: string;
  onSubmit: (room: Room) => void;
  onCancel: () => void;
}

export default function RoomForm({ room, propertyId, onSubmit, onCancel }: RoomFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Room>(
    room || {
      id: `room-${Date.now()}`,
      propertyId,
      name: '',
      roomNumber: '',
      type: 'room',
      capacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      basePrice: 100,
      amenities: [],
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const [amenityInput, setAmenityInput] = useState('');

  const roomTypes = ['room', 'apartment', 'suite', 'cabin', 'studio', 'villa'];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput],
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {room ? t('crud.update') : t('crud.create')} {t('rooms.title')}
          </h2>
          <button onClick={onCancel} className="text-foreground/60 hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('rooms.roomName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('rooms.roomNumber')}
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => handleChange('roomNumber', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('rooms.roomType')}
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('rooms.status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="blocked">Blocked</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('rooms.capacity')}
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('rooms.basePrice')}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => handleChange('basePrice', parseFloat(e.target.value))}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('rooms.amenities')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-foreground"
                placeholder="WiFi, Pool, etc."
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, idx) => (
                <span key={idx} className="bg-primary/20 text-primary text-sm px-3 py-1 rounded flex items-center gap-2">
                  {amenity}
                  <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-primary/60">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-background border border-border text-foreground px-4 py-2 rounded hover:bg-background/80"
            >
              {t('crud.cancel')}
            </button>
            <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded hover:opacity-90">
              {t('crud.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
