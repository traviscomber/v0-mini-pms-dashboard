'use client';

import { memo, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface RoomManagerProps {
  rooms: any[];
  onUpdate: (rooms: any[]) => void;
}

const RoomManager = memo(({ rooms, onUpdate }: RoomManagerProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: 1,
    basePrice: 0,
  });

  const handleAdd = () => {
    const newRoom = {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
    };
    onUpdate([...rooms, newRoom]);
    setFormData({ name: '', type: '', capacity: 1, basePrice: 0 });
    setIsOpen(false);
  };

  const handleEdit = (room: any) => {
    setEditingId(room.id);
    setFormData({ name: room.name, type: room.type, capacity: room.capacity, basePrice: room.basePrice });
  };

  const handleSaveEdit = () => {
    onUpdate(rooms.map(r => r.id === editingId ? { ...r, ...formData } : r));
    setEditingId(null);
    setFormData({ name: '', type: '', capacity: 1, basePrice: 0 });
  };

  const handleDelete = (id: string) => {
    onUpdate(rooms.filter(r => r.id !== id));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t('properties.roomManagement')}</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          <Plus size={20} /> {t('properties.addRoom')}
        </button>
      </div>

      {/* Modal */}
      {(isOpen || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-foreground">{editingId ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => { setIsOpen(false); setEditingId(null); }} className="text-foreground/60 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Room Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
                  placeholder="e.g. Ocean View Apartment"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
                  placeholder="e.g. Apartment"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">{t('properties.capacity')}</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">{t('properties.basePrice')}</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setIsOpen(false); setEditingId(null); }}
                  className="flex-1 px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleSaveEdit : handleAdd}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  {editingId ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="bg-background border border-border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-foreground">{room.name}</h3>
                <p className="text-sm text-foreground/60">{room.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="p-2 hover:bg-foreground/10 rounded transition"
                >
                  <Edit2 size={16} className="text-accent" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-2 hover:bg-foreground/10 rounded transition"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">{t('properties.capacity')}</span>
                <span className="font-semibold text-foreground">{room.capacity} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">{t('properties.basePrice')}</span>
                <span className="font-semibold text-accent">${room.basePrice}/night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

RoomManager.displayName = 'RoomManager';
export default RoomManager;
