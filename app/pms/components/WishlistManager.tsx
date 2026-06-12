'use client';

import { memo, useState } from 'react';
import { Heart } from 'lucide-react';

interface WishlistManagerProps {
  rooms: any[];
}

const WishlistManager = memo(({ rooms }: WishlistManagerProps) => {
  const [wishlisted, setWishlisted] = useState<string[]>(['r1', 'r3']);

  const toggleWishlist = (roomId: string) => {
    setWishlisted(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const wishlistedRooms = rooms.filter(r => wishlisted.includes(r.id));

  return (
    <div className="space-y-6">
      {/* Wishlist Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground/60">Total Wishlists</p>
          <p className="text-3xl font-bold text-primary">{wishlisted.length}</p>
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-foreground/60">Popular Rooms</p>
          <p className="text-3xl font-bold text-accent">{Math.max(0, wishlisted.length - 1)}</p>
        </div>
      </div>

      {/* Room Wishlist Grid */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Room Wishlist Tracker</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => toggleWishlist(room.id)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                wishlisted.includes(room.id)
                  ? 'bg-destructive/10 border-destructive/50'
                  : 'bg-background border-border hover:border-foreground/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{room.name}</p>
                  <p className="text-sm text-foreground/60">${room.basePrice}/night</p>
                </div>
                <Heart
                  size={20}
                  className={wishlisted.includes(room.id) ? 'fill-red-500 text-destructive' : 'text-foreground/30'}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Wishlisted Rooms Summary */}
      {wishlistedRooms.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Your Wishlisted Rooms</h3>
          <div className="space-y-3">
            {wishlistedRooms.map(room => (
              <div key={room.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart size={20} className="fill-red-500 text-destructive" />
                  <div>
                    <p className="font-semibold text-foreground">{room.name}</p>
                    <p className="text-sm text-foreground/60">{room.type} • {room.capacity} guests</p>
                  </div>
                </div>
                <p className="font-bold text-accent">${room.basePrice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="font-semibold text-foreground mb-2">Guest Insights</p>
        <ul className="text-sm text-foreground/80 space-y-1">
          <li>• Most wishlisted: {wishlistedRooms.length > 0 ? wishlistedRooms[0].name : 'No wishlists yet'}</li>
          <li>• Average price of wishlisted: ${wishlistedRooms.length > 0 ? Math.round(wishlistedRooms.reduce((a, b) => a + b.basePrice, 0) / wishlistedRooms.length) : 0}/night</li>
        </ul>
      </div>
    </div>
  );
});

WishlistManager.displayName = 'WishlistManager';
export default WishlistManager;
