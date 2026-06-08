'use client';

import { Property } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { Edit2, Trash2, MapPin, Home } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function PropertyList({ properties, onEdit, onDelete, onAdd }: PropertyListProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('property.title')}</h1>
          <p className="text-foreground/60">{t('property.subtitle')}</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {t('crud.add')} {t('property.title')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">{property.name}</h3>
              </div>
              {property.isActive && (
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                  {t('crud.active')}
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-start gap-2 text-foreground/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{property.location.address}</p>
                  <p>{property.location.city}, {property.location.country}</p>
                </div>
              </div>
              <p className="text-foreground/60">
                {t('property.totalRooms')}: {property.totalRooms}
              </p>
              <p className="text-foreground/60">
                {t('property.currency')}: {property.currency}
              </p>
            </div>

            {property.description && (
              <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                {property.description}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(property)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-2 rounded transition"
              >
                <Edit2 className="w-4 h-4" />
                {t('crud.edit')}
              </button>
              <button
                onClick={() => onDelete(property.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-2 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
                {t('crud.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">{t('crud.noResults')}</p>
        </div>
      )}
    </div>
  );
}
