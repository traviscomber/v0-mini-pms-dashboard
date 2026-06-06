'use client';

import { memo, useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';

interface ReviewSystemProps {
  rooms: any[];
}

const ReviewSystem = memo(({ rooms }: ReviewSystemProps) => {
  const [reviews, setReviews] = useState<any[]>([
    {
      id: '1',
      roomId: 'r1',
      guestName: 'Sarah Johnson',
      rating: 5,
      date: '2026-06-04',
      text: 'Absolutely stunning ocean views! The apartment was clean and well-equipped.',
    },
    {
      id: '2',
      roomId: 'r2',
      guestName: 'Michael Chen',
      rating: 4,
      date: '2026-06-03',
      text: 'Great location, cozy studio. Only issue was the noisy neighbors.',
    },
    {
      id: '3',
      roomId: 'r3',
      guestName: 'Emma Davis',
      rating: 5,
      date: '2026-06-02',
      text: 'Perfect for families! Spacious cabin with all amenities. Would definitely return.',
    },
    {
      id: '4',
      roomId: 'r4',
      guestName: 'James Wilson',
      rating: 4,
      date: '2026-06-01',
      text: 'Unique glamping experience. Nature is wonderful, but WiFi could be better.',
    },
  ]);

  const getAverageRating = (roomId: string) => {
    const roomReviews = reviews.filter(r => r.roomId === roomId);
    if (roomReviews.length === 0) return 0;
    return (roomReviews.reduce((a, b) => a + b.rating, 0) / roomReviews.length).toFixed(1);
  };

  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || 'Unknown Room';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/30'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Room Ratings Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Room Ratings</h3>
        <div className="space-y-3">
          {rooms.map(room => {
            const avg = getAverageRating(room.id);
            const count = reviews.filter(r => r.roomId === room.id).length;
            return (
              <div key={room.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{room.name}</p>
                  <p className="text-sm text-foreground/60">{count} review{count !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(parseFloat(avg as any)))}
                  <span className="font-bold text-foreground ml-2">{avg}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle size={20} />
          Recent Guest Reviews
        </h3>
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="p-4 bg-background rounded-lg border border-border/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-foreground">{review.guestName}</p>
                  <p className="text-sm text-foreground/60">{getRoomName(review.roomId)}</p>
                </div>
                <span className="text-xs text-foreground/50">{review.date}</span>
              </div>
              <div className="mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-foreground/80">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ReviewSystem.displayName = 'ReviewSystem';
export default ReviewSystem;
