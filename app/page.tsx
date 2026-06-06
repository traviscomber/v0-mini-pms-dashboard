'use client';

import { useState } from 'react';
import { demoData } from './pms/data';
import Sidebar from './pms/components/Sidebar';
import EnhancedDashboard from './pms/components/EnhancedDashboard';
import AdvancedCalendar from './pms/components/AdvancedCalendar';
import BookingFlowModal from './pms/components/BookingFlowModal';
import GuestManagement from './pms/components/GuestManagement';
import PaymentManager from './pms/components/PaymentManager';
import Reports from './pms/components/Reports';

export default function PMSApp() {
  const [rooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'calendar' | 'reservations' | 'rooms' | 'reports' | 'settings'>('dashboard');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleAddReservation = (newRes: typeof demoData.reservations[0]) => {
    const id = Math.random().toString(36).substr(2, 9);
    setReservations([...reservations, { id, ...newRes }]);
    setShowBookingModal(false);
  };

  const handleStatusChange = (reservationId: string, status: string) => {
    setReservations(reservations.map(r => 
      r.id === reservationId ? { ...r, status } : r
    ));
  };

  const handlePaymentStatusChange = (reservationId: string, status: string) => {
    setReservations(reservations.map(r => 
      r.id === reservationId ? { ...r, paymentStatus: status } : r
    ));
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      calendar: 'Booking Calendar',
      reservations: 'Reservations',
      rooms: 'Properties',
      reports: 'Reports',
      settings: 'Settings'
    };
    return titles[activeSection];
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-foreground/60">Manage your rental business efficiently</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {activeSection === 'dashboard' && <EnhancedDashboard rooms={rooms} reservations={reservations} />}
            {activeSection === 'calendar' && <AdvancedCalendar rooms={rooms} reservations={reservations} onDateRangeSelect={(start, end, roomId) => console.log('Selected:', start, end, roomId)} />}
            {activeSection === 'reservations' && (
              <>
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition"
                  >
                    + New Booking
                  </button>
                </div>
                <div className="space-y-8">
                  <GuestManagement 
                    reservations={reservations} 
                    rooms={rooms}
                    onStatusChange={handleStatusChange}
                  />
                  <PaymentManager 
                    reservations={reservations}
                    onPaymentStatusChange={handlePaymentStatusChange}
                  />
                </div>
              </>
            )}
            {activeSection === 'rooms' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map(room => (
                  <div 
                    key={room.id} 
                    className="group bg-card border border-border rounded-xl p-6 hover:border-accent hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{room.name}</h3>
                        <p className="text-sm text-foreground/60 mt-1">{room.type}</p>
                      </div>
                      <div className="pt-4 space-y-3 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/60">Capacity</span>
                          <span className="font-semibold text-foreground">{room.capacity} guests</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/60">Nightly Rate</span>
                          <span className="font-semibold text-accent">${room.basePrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'reports' && <Reports reservations={reservations} />}
            {activeSection === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-accent cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-accent transition-colors">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-accent cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-accent transition-colors">SMS reminders</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-primary cursor-pointer" 
                      />
                      <span className="text-foreground group-hover:text-primary transition-colors">Auto-confirm bookings</span>
                    </label>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-primary cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-primary transition-colors">Dark mode</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-secondary cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-secondary transition-colors">Analytics tracking</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      <BookingFlowModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        rooms={rooms}
        reservations={reservations}
        onConfirm={handleAddReservation}
      />
    </div>
  );
}
