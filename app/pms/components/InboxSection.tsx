'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface InboxProps {
  reservations: any[];
}

export default function InboxSection({ reservations }: InboxProps) {
  const { t } = useLanguage();
  const [selectedReservation, setSelectedReservation] = useState(reservations[0]);
  const [messages, setMessages] = useState<{id: string; sender: string; text: string; timestamp: string}[]>([
    { id: '1', sender: 'guest', text: 'Hi, I have a question about check-in time.', timestamp: '2:30 PM' },
    { id: '2', sender: 'host', text: 'Hi! Check-in is from 3 PM onwards.', timestamp: '2:45 PM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages([
      ...messages,
      { id: String(messages.length + 1), sender: 'host', text: newMessage, timestamp: timeStr }
    ]);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{t('inboxSection.messages')}</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {reservations.map(reservation => (
            <button
              key={reservation.id}
              onClick={() => setSelectedReservation(reservation)}
              className={`w-full p-4 text-left border-b border-border hover:bg-background transition ${
                selectedReservation?.id === reservation.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
              }`}
            >
              <p className="font-semibold text-foreground text-sm">{reservation.guestName}</p>
              <p className="text-xs text-foreground/60">Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg flex flex-col">
        {selectedReservation && (
          <>
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">{selectedReservation.guestName}</h3>
              <p className="text-xs text-foreground/60">{selectedReservation.guestEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'host' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'host'
                        ? 'bg-primary text-black rounded-br-none'
                        : 'bg-background border border-border text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'host' ? 'text-black/60' : 'text-foreground/60'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('inboxSection.typeMessage')}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
