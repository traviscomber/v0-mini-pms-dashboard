'use client';

import { useState } from 'react';
import { Send, MessageSquare, Search } from 'lucide-react';

interface Message {
  id: string;
  sender: 'host' | 'guest';
  text: string;
  timestamp: string;
  read: boolean;
}

interface GuestConversation {
  id: string;
  guestName: string;
  reservationId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const DEMO_CONVERSATIONS: GuestConversation[] = [
  {
    id: '1',
    guestName: 'John Doe',
    reservationId: 'RES-001',
    lastMessage: 'Thank you for the quick response!',
    lastMessageTime: '2 minutes ago',
    unreadCount: 0,
    messages: [
      { id: '1', sender: 'guest', text: 'Hi, can we check in early?', timestamp: '10:30 AM', read: true },
      { id: '2', sender: 'host', text: 'Yes, the room will be ready at 2 PM', timestamp: '10:45 AM', read: true },
      { id: '3', sender: 'guest', text: 'Thank you for the quick response!', timestamp: '10:50 AM', read: true },
    ],
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    reservationId: 'RES-002',
    lastMessage: 'Looking forward to staying with you',
    lastMessageTime: '1 hour ago',
    unreadCount: 1,
    messages: [
      { id: '1', sender: 'host', text: 'Welcome! We look forward to hosting you', timestamp: '9:15 AM', read: true },
      { id: '2', sender: 'guest', text: 'Looking forward to staying with you', timestamp: '9:20 AM', read: false },
    ],
  },
];

export default function GuestMessaging() {
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState('1');
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');

  const selected = conversations.find(c => c.id === selectedId);
  const filtered = conversations.filter(c =>
    c.guestName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selected) return;

    const newMessage: Message = {
      id: String(Date.now()),
      sender: 'host',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setConversations(convs =>
      convs.map(c =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: messageText }
          : c
      )
    );
    setMessageText('');
  };

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="bg-card border border-border rounded-lg flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg">
            <Search className="w-4 h-4 text-foreground/60" />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 bg-background text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full p-4 text-left border-b border-border hover:bg-background/50 transition ${
                selectedId === conv.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${conv.unreadCount > 0 ? 'text-primary' : ''}`}>
                    {conv.guestName}
                  </p>
                  <p className="text-sm text-foreground/60 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
              <p className="text-xs text-foreground/40 mt-2">{conv.lastMessageTime}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selected && (
        <div className="lg:col-span-2 bg-card border border-border rounded-lg flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">{selected.guestName}</h3>
            <p className="text-sm text-foreground/60">{selected.reservationId}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selected.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'host' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'host'
                      ? 'bg-primary text-black'
                      : 'bg-background border border-border text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/80 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selected && (
        <div className="lg:col-span-2 bg-card border border-border rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/60">Select a conversation to start messaging</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="lg:col-span-3 grid grid-cols-3 gap-4 bg-card border border-border rounded-lg p-4">
        <div>
          <p className="text-sm text-foreground/60">Total Conversations</p>
          <p className="text-2xl font-bold">{conversations.length}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Unread Messages</p>
          <p className="text-2xl font-bold text-red-500">{unreadTotal}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Response Rate</p>
          <p className="text-2xl font-bold text-green-500">100%</p>
        </div>
      </div>
    </div>
  );
}
