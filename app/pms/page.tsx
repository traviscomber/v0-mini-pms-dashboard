'use client';

import { useState } from 'react';
import { Calendar, Home, BarChart3, Settings, Menu, X, Plus, AlertCircle } from 'lucide-react';
import { demoData } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookingCalendar from './components/BookingCalendar';
import BookingForm from './components/BookingForm';
import ReservationList from './components/ReservationList';
import Reports from './components/Reports';

export default function PMSApp() {
  const [rooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'calendar' | 'reservations' | 'rooms' | 'reports' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddReservation = (newRes: typeof demoData.reservations[0]) => {
    setReservations([...reservations, newRes]);
    setSuccessMsg('Reservation added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {activeSection === 'dashboard' && 'Dashboard'}
            {activeSection === 'calendar' && 'Booking Calendar'}
            {activeSection === 'reservations' && 'Reservations'}
            {activeSection === 'rooms' && 'Properties'}
            {activeSection === 'reports' && 'Reports'}
            {activeSection === 'settings' && 'Settings'}
          </h1>
          <div className="w-10" />
        </header>

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-6 mt-4 rounded text-green-800 flex items-center gap-2">
            <Plus size={20} />
            {successMsg}
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'dashboard' && <Dashboard rooms={rooms} reservations={reservations} />}
          {activeSection === 'calendar' && <BookingCalendar rooms={rooms} reservations={reservations} />}
          {activeSection === 'reservations' && (
            <div className="space-y-6">
              <BookingForm rooms={rooms} reservations={reservations} onAdd={handleAddReservation} />
              <ReservationList reservations={reservations} onDelete={handleDeleteReservation} />
            </div>
          )}
          {activeSection === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-900">{room.name}</h3>
                  <p className="text-sm text-slate-600">{room.type} • Sleeps {room.capacity}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">${room.basePrice}/night</p>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'reports' && <Reports reservations={reservations} />}
          {activeSection === 'settings' && (
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h2 className="font-semibold text-slate-900 mb-4">Settings</h2>
              <p className="text-slate-600">Settings coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
