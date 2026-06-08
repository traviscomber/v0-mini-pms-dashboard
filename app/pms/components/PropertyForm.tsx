'use client';

import { useState } from 'react';
import { Property } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (property: Property) => void;
  onCancel: () => void;
}

export default function PropertyForm({ property, onSubmit, onCancel }: PropertyFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Property>(
    property || {
      id: `prop-${Date.now()}`,
      name: '',
      description: '',
      location: {
        address: '',
        city: '',
        country: '',
        zipCode: '',
      },
      totalRooms: 0,
      amenities: [],
      maxGuests: 0,
      timezone: 'UTC',
      currency: 'USD',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const [amenityInput, setAmenityInput] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
      updatedAt: new Date(),
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput],
        updatedAt: new Date(),
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
      updatedAt: new Date(),
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
            {property ? t('crud.update') : t('crud.create')} {t('property.title')}
          </h2>
          <button
            onClick={onCancel}
            className="text-foreground/60 hover:text-foreground transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('property.propertyName')}
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
              {t('property.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('property.address')}
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('property.city')}
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('property.country')}
              </label>
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('property.zipCode')}
              </label>
              <input
                type="text"
                value={formData.location.zipCode}
                onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('property.totalRooms')}
              </label>
              <input
                type="number"
                value={formData.totalRooms}
                onChange={(e) => handleChange('totalRooms', parseInt(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('property.currency')}
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('property.amenities')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-foreground"
                placeholder="e.g., WiFi, Pool, Restaurant"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition"
              >
                {t('crud.add')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-primary/20 text-primary text-sm px-3 py-1 rounded flex items-center gap-2"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-primary/60 hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground">
              {t('property.isActive')}
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-background border border-border text-foreground px-4 py-2 rounded hover:bg-background/80 transition"
            >
              {t('crud.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              {t('crud.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
