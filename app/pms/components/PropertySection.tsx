'use client';

import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface PropertyProps {
  rooms: any[];
}

export default function PropertySection({ rooms }: PropertyProps) {
  const { t } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [roomData, setRoomData] = useState({
    name: selectedRoom?.name || '',
    type: selectedRoom?.type || '',
    basePrice: selectedRoom?.basePrice || '',
    capacity: selectedRoom?.capacity || '',
    description: 'Comfortable and spacious room with modern amenities.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Room List */}
      <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">{t('propertySection.roomEditor')}</h3>
        <div className="space-y-2">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoom(room);
                setRoomData({ name: room.name, type: room.type, basePrice: room.basePrice, capacity: room.capacity || 4, description: '' });
              }}
              className={`w-full p-3 text-left rounded-lg transition border ${
                selectedRoom?.id === room.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-background border-border hover:bg-background/80'
              }`}
            >
              <p className="font-semibold">{room.name}</p>
              <p className="text-xs text-foreground/60">${room.basePrice}/night</p>
            </button>
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-lg">Room Details</h3>
          
          <div>
            <label className="block text-sm text-foreground/60 mb-2">Room Name</label>
            <input
              type="text"
              name="name"
              value={roomData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Room Type</label>
              <select
                name="type"
                value={roomData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
              >
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Cabin">Cabin</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={roomData.basePrice}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Guest Capacity</label>
            <input
              type="number"
              name="capacity"
              value={roomData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Description</label>
            <textarea
              name="description"
              value={roomData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-lg">Photos</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-background border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-background/80 transition">
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-foreground/40" />
                  <p className="text-xs text-foreground/60">Add photo</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 font-semibold transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
