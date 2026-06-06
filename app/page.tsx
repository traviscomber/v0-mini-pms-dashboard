'use client';

import { useState } from 'react';
import { demoData } from './pms/data';
import Sidebar from './pms/components/Sidebar';
import PageHeader from './pms/components/PageHeader';
import { useLanguage } from './pms/LanguageContext';
import EnhancedDashboard from './pms/components/EnhancedDashboard';
import AdvancedCalendar from './pms/components/AdvancedCalendar';
import BookingFlowModal from './pms/components/BookingFlowModal';
import GuestManagement from './pms/components/GuestManagement';
import PaymentManager from './pms/components/PaymentManager';
import RoomManager from './pms/components/RoomManager';
import BulkRateManager from './pms/components/BulkRateManager';
import CleaningSchedule from './pms/components/CleaningSchedule';
import OccupancyForecast from './pms/components/OccupancyForecast';
import ReviewSystem from './pms/components/ReviewSystem';
import WishlistManager from './pms/components/WishlistManager';
import Reports from './pms/components/Reports';

export default function PMSApp() {
  const [rooms, setRooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'calendar' | 'reservations' | 'rooms' | 'reports' | 'settings'>('dashboard');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState<'bookings' | 'reviews' | 'wishlist'>('bookings');

  return (
    <PMSContent 
      rooms={rooms}
      setRooms={setRooms}
      reservations={reservations}
      setReservations={setReservations}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      showBookingModal={showBookingModal}
      setShowBookingModal={setShowBookingModal}
      analyticsTab={analyticsTab}
      setAnalyticsTab={setAnalyticsTab}
    />
  );
}

interface PMSContentProps {
  rooms: any[];
  setRooms: (rooms: any[]) => void;
  reservations: any[];
  setReservations: (reservations: any[]) => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showBookingModal: boolean;
  setShowBookingModal: (show: boolean) => void;
  analyticsTab: string;
  setAnalyticsTab: (tab: any) => void;
}

function PMSContent(props: PMSContentProps) {
  const { t } = useLanguage();
  const {
    rooms,
    setRooms,
    reservations,
    setReservations,
    activeSection,
    setActiveSection,
    showBookingModal,
    setShowBookingModal,
    analyticsTab,
    setAnalyticsTab
  } = props;

  const getPageTitle = () => {
    const titles: {[key: string]: string} = {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      reservations: 'Reservations',
      rooms: 'Properties',
      reports: 'Reports',
      settings: 'Settings'
    };
    return titles[activeSection] || '';
  };

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader section={activeSection} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {activeSection === 'dashboard' && <EnhancedDashboard rooms={rooms} reservations={reservations} />}
            {activeSection === 'calendar' && <AdvancedCalendar rooms={rooms} reservations={reservations} onDateRangeSelect={(start, end, roomId) => console.log('Selected:', start, end, roomId)} />}
            {activeSection === 'reservations' && (
              <>
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium transition"
                  >
                    + {getPageTitle() === 'Reservations' ? 'New Booking' : 'Nueva Reserva'}
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
              <div className="space-y-8">
                <RoomManager rooms={rooms} onUpdate={setRooms} />
                <BulkRateManager rooms={rooms} reservations={reservations} />
                <CleaningSchedule rooms={rooms} reservations={reservations} />
                <OccupancyForecast rooms={rooms} reservations={reservations} />
              </div>
            )}
            {activeSection === 'reports' && (
              <div className="space-y-6">
                {/* Analytics Tabs */}
                <div className="flex gap-2 border-b border-border">
                  {(['bookings', 'reviews', 'wishlists'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAnalyticsTab(tab)}
                      className={`px-4 py-2 font-medium transition ${
                        analyticsTab === tab
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      {t(`tabs.${tab}`)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {analyticsTab === 'bookings' && <Reports reservations={reservations} />}
                {analyticsTab === 'reviews' && <ReviewSystem rooms={rooms} />}
                {analyticsTab === 'wishlists' && <WishlistManager rooms={rooms} />}
              </div>
            )}
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
