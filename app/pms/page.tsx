'use client';

import { useState } from 'react';
import { demoData } from './data';
import { useLanguage } from './LanguageContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookingCalendar from './components/BookingCalendar';
import BookingForm from './components/BookingForm';
import ReservationList from './components/ReservationList';
import Reports from './components/Reports';
import LanguageTest from './components/LanguageTest';
import LanguageDebugger from './components/LanguageDebugger';

export default function PMSApp() {
  const [rooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'calendar' | 'reservations' | 'rooms' | 'reports' | 'settings'>('dashboard');
  const { language } = useLanguage();

  const handleAddReservation = (newRes: typeof demoData.reservations[0]) => {
    setReservations([...reservations, newRes]);
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
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
    <div className="flex h-screen bg-background" key={language}>
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <LanguageDebugger />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-muted-foreground">Manage your rental business efficiently</p>
          </div>
          <LanguageTest />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {activeSection === 'dashboard' && <Dashboard rooms={rooms} reservations={reservations} />}
            {activeSection === 'calendar' && <BookingCalendar rooms={rooms} reservations={reservations} />}
            {activeSection === 'reservations' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <BookingForm rooms={rooms} reservations={reservations} onAdd={handleAddReservation} />
                </div>
                <div>
                  <ReservationList reservations={reservations} onDelete={handleDeleteReservation} />
                </div>
              </div>
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
                        <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors">{room.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{room.type}</p>
                      </div>
                      <div className="pt-4 space-y-3 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Capacity</span>
                          <span className="font-semibold text-card-foreground">{room.capacity} guests</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Nightly Rate</span>
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
                  <h3 className="text-lg font-semibold text-card-foreground">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-accent cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-card-foreground group-hover:text-accent transition-colors">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-accent cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-card-foreground group-hover:text-accent transition-colors">SMS reminders</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-primary cursor-pointer" 
                      />
                      <span className="text-card-foreground group-hover:text-primary transition-colors">Auto-confirm bookings</span>
                    </label>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-primary cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-card-foreground group-hover:text-primary transition-colors">Dark mode</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-secondary cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-card-foreground group-hover:text-secondary transition-colors">Analytics tracking</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
