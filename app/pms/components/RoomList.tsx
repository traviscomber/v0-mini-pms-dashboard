'use client';

import { Room } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { Edit2, Trash2, DoorOpen } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  propertyId?: string;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function RoomList({ rooms, propertyId, onEdit, onDelete, onAdd }: RoomListProps) {
  const { t } = useLanguage();

  const filteredRooms = propertyId ? rooms.filter((r) => r.propertyId === propertyId) : rooms;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-500/20 text-green-300',
      maintenance: 'bg-yellow-500/20 text-yellow-300',
      blocked: 'bg-red-500/20 text-red-300',
      reserved: 'bg-blue-500/20 text-blue-300',
    };
    return colors[status] || 'bg-card/500/20 text-foreground/50';
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('rooms.title')}</h1>
          <p className="text-foreground/60">{t('rooms.subtitle')}</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {t('crud.add')} {t('rooms.title')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground">{room.name}</h3>
                  <p className="text-xs text-foreground/60">#{room.roomNumber}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <p className="text-foreground/60">
                {t('rooms.roomType')}: {room.type}
              </p>
              <p className="text-foreground/60">
                {t('rooms.capacity')}: {room.capacity} {t('common.guests')}
              </p>
              <p className="font-semibold text-primary">
                ${room.basePrice}/night
              </p>
              {room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 2).map((amenity, idx) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 2 && (
                    <span className="text-xs text-foreground/60">
                      +{room.amenities.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(room)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-2 rounded transition text-sm"
              >
                <Edit2 className="w-4 h-4" />
                {t('crud.edit')}
              </button>
              <button
                onClick={() => onDelete(room.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-2 rounded transition text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {t('crud.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">{t('crud.noResults')}</p>
        </div>
      )}
    </div>
  );
}
