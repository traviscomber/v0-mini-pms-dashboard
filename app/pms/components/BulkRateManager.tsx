'use client';

import { memo, useState } from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { useLanguage as useLanguage } from '../LanguageContext';

interface BulkRateManagerProps {
  rooms: any[];
  reservations: any[];
}

const BulkRateManager = memo(({ rooms, reservations }: BulkRateManagerProps) => {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState('2026-06-10');
  const [endDate, setEndDate] = useState('2026-06-20');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [priceAdjustment, setPriceAdjustment] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'percentage'>('percentage');

  const handleApply = () => {
    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const roomsToUpdate = selectedRooms.length > 0 ? selectedRooms : rooms.map(r => r.id);
    
    console.log('[v0] Bulk rate update:', {
      startDate,
      endDate,
      days,
      rooms: roomsToUpdate,
      adjustment: adjustmentType === 'percentage' ? `${priceAdjustment}%` : `$${priceAdjustment}`,
    });
  };

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) ? prev.filter(r => r !== roomId) : [...prev, roomId]
    );
  };

  const calculateAffectedBookings = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return reservations.filter(r => {
      const resStart = new Date(r.checkInDate);
      const resEnd = new Date(r.checkOutDate);
      return resStart <= end && resEnd >= start;
    }).length;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">{t('bulkRate.bulkRateManager')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground/60 mb-2">{t('bulkRate.dateRange')}</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">{t('bulkRate.adjustmentType')}</label>
            <div className="flex gap-2">
              {(['fixed', 'percentage'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setAdjustmentType(type)}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    adjustmentType === type
                      ? 'bg-primary text-black'
                      : 'bg-card border border-border text-foreground hover:bg-card/80'
                  }`}
                >
                  {type === 'fixed' ? t('bulkRate.fixed') : t('bulkRate.percentage')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">
              {t('bulkRate.priceAdjustment')}
            </label>
            <input
              type="number"
              value={priceAdjustment}
              onChange={(e) => setPriceAdjustment(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
              placeholder="e.g. 10 or 15"
            />
          </div>

          <button
            onClick={handleApply}
            className="w-full py-2 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium transition"
          >
            {t('bulkRate.applyRateUpdate')}
          </button>
        </div>

        {/* Room Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground/60 mb-3">{t('bulkRate.selectRoomsOrApplyAll')}</label>
            <div className="space-y-2">
              {rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => toggleRoom(room.id)}
                  className={`w-full p-3 rounded-lg text-left font-medium transition ${
                    selectedRooms.includes(room.id)
                      ? 'bg-primary text-black'
                      : 'bg-card border border-border text-foreground hover:bg-card/80'
                  }`}
                >
                  {room.name} <span className="text-sm opacity-80">${room.basePrice}/night</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-foreground/60">{t('bulkRate.daysAffected')}</p>
            <p className="text-2xl font-bold text-primary">
              {Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground/60">{t('bulkRate.roomsSelected')}</p>
            <p className="text-2xl font-bold text-primary">{selectedRooms.length || 'All'}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/60">{t('bulkRate.bookingsAffected')}</p>
            <p className="text-2xl font-bold text-accent">{calculateAffectedBookings()}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

BulkRateManager.displayName = 'BulkRateManager';
export default BulkRateManager;
