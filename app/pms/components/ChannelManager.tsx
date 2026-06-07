'use client';

import { useState } from 'react';
import { Link2, Unlink2, TrendingUp, AlertCircle } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
  listings: number;
  reservations: number;
}

const CHANNELS: Channel[] = [
  { id: 'airbnb', name: 'Airbnb', icon: 'A', connected: true, color: 'bg-red-500', listings: 3, reservations: 12 },
  { id: 'booking', name: 'Booking.com', icon: 'B', connected: true, color: 'bg-blue-600', listings: 3, reservations: 8 },
  { id: 'expedia', name: 'Expedia', icon: 'E', connected: false, color: 'bg-yellow-500', listings: 0, reservations: 0 },
  { id: 'vrbo', name: 'VRBO', icon: 'V', connected: false, color: 'bg-green-600', listings: 0, reservations: 0 },
  { id: 'direct', name: 'Direct Bookings', icon: 'D', connected: true, color: 'bg-purple-500', listings: 1, reservations: 5 },
];

export default function ChannelManager() {
  const [channels, setChannels] = useState(CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, connected: !ch.connected } : ch
    ));
  };

  const connectedCount = channels.filter(ch => ch.connected).length;
  const totalReservations = channels.reduce((sum, ch) => sum + ch.reservations, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">Connected Channels</p>
          <p className="text-3xl font-bold">{connectedCount}/{channels.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">Total Listings</p>
          <p className="text-3xl font-bold">{channels.reduce((sum, ch) => sum + ch.listings, 0)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">Channel Reservations</p>
          <p className="text-3xl font-bold">{totalReservations}</p>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Connected Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map(channel => (
            <div
              key={channel.id}
              onClick={() => setSelectedChannel(selectedChannel === channel.id ? null : channel.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                selectedChannel === channel.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Channel Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                    {channel.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{channel.name}</p>
                    <p className="text-xs text-foreground/60">
                      {channel.connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleConnection(channel.id);
                  }}
                  className={`p-2 rounded-lg transition ${
                    channel.connected
                      ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                  }`}
                >
                  {channel.connected ? (
                    <Unlink2 className="w-4 h-4" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Stats */}
              {channel.connected && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Listings:</span>
                    <span className="font-semibold">{channel.listings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Reservations:</span>
                    <span className="font-semibold text-primary">{channel.reservations}</span>
                  </div>
                </div>
              )}

              {!channel.connected && (
                <div className="text-xs text-foreground/60 bg-background/50 p-2 rounded mt-3">
                  Click the link icon to connect this channel
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sync Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold">Synchronization Status</p>
            <p className="text-sm text-foreground/60 mt-1">All channels synced in real-time. Last sync: 2 minutes ago</p>
            <button className="mt-2 text-sm text-primary hover:underline">View sync history</button>
          </div>
        </div>
      </div>

      {/* Channel Details Panel */}
      {selectedChannel && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold mb-4">
            {channels.find(ch => ch.id === selectedChannel)?.name} Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Property ID</label>
              <input
                type="text"
                placeholder="Enter property ID"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <button className="w-full px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/80 transition">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
