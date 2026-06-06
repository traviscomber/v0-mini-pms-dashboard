'use client';

import { useState } from 'react';
import { demoData } from './pms/data';
import Sidebar from './pms/components/Sidebar';
import PageHeader from './pms/components/PageHeader';
import { useLanguage } from './pms/LanguageContext';
import SimplifiedDashboard from './pms/components/SimplifiedDashboard';
import CalendarSection from './pms/components/CalendarSection';
import InboxSection from './pms/components/InboxSection';
import PropertySection from './pms/components/PropertySection';
import AnalyticsSection from './pms/components/AnalyticsSection';
import FinanceSection from './pms/components/FinanceSection';
import CheckInsModal from './pms/components/CheckInsModal';
import PaymentsModal from './pms/components/PaymentsModal';
import BookingFlowModal from './pms/components/BookingFlowModal';
import GuestManagement from './pms/components/GuestManagement';
import PaymentManager from './pms/components/PaymentManager';

export default function PMSApp() {
  const [rooms, setRooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'calendar' | 'reservations' | 'inbox' | 'property' | 'analytics' | 'finance' | 'settings'>('dashboard');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCheckInsModal, setShowCheckInsModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);

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
      showCheckInsModal={showCheckInsModal}
      setShowCheckInsModal={setShowCheckInsModal}
      showPaymentsModal={showPaymentsModal}
      setShowPaymentsModal={setShowPaymentsModal}
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
  showCheckInsModal: boolean;
  setShowCheckInsModal: (show: boolean) => void;
  showPaymentsModal: boolean;
  setShowPaymentsModal: (show: boolean) => void;
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
    showCheckInsModal,
    setShowCheckInsModal,
    showPaymentsModal,
    setShowPaymentsModal,
  } = props;

  const getPageTitle = () => {
    const titles: {[key: string]: string} = {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      reservations: 'Reservations',
      inbox: 'Messages',
      property: 'Property',
      analytics: 'Analytics',
      finance: 'Finance',
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
            {/* Dashboard - Simplified */}
            {activeSection === 'dashboard' && (
              <SimplifiedDashboard 
                rooms={rooms} 
                reservations={reservations}
                onShowCheckIns={() => setShowCheckInsModal(true)}
                onShowPayments={() => setShowPaymentsModal(true)}
              />
            )}

            {/* Reservations - Manage Bookings */}
            {activeSection === 'reservations' && (
              <>
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium transition"
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

            {/* Calendar */}
            {activeSection === 'calendar' && (
              <CalendarSection rooms={rooms} reservations={reservations} />
            )}

            {/* Inbox */}
            {activeSection === 'inbox' && (
              <InboxSection reservations={reservations} />
            )}

            {/* Property */}
            {activeSection === 'property' && (
              <PropertySection rooms={rooms} />
            )}

            {/* Analytics */}
            {activeSection === 'analytics' && (
              <AnalyticsSection reservations={reservations} rooms={rooms} />
            )}

            {/* Finance */}
            {activeSection === 'finance' && (
              <FinanceSection reservations={reservations} />
            )}

            {/* Settings */}
            {activeSection === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('settings.notifications')}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-accent cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-accent transition-colors">{t('settings.emailNotifications')}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-accent cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-accent transition-colors">{t('settings.smsReminders')}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-primary cursor-pointer" 
                      />
                      <span className="text-foreground group-hover:text-primary transition-colors">{t('settings.autoConfirmBookings')}</span>
                    </label>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('settings.preferences')}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-primary cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-primary transition-colors">{t('settings.darkMode')}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-border bg-input checked:bg-secondary cursor-pointer" 
                        defaultChecked 
                      />
                      <span className="text-foreground group-hover:text-secondary transition-colors">{t('settings.analyticsTracking')}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CheckInsModal 
        reservations={reservations}
        rooms={rooms}
        isOpen={showCheckInsModal}
        onClose={() => setShowCheckInsModal(false)}
      />
      <PaymentsModal 
        reservations={reservations}
        isOpen={showPaymentsModal}
        onClose={() => setShowPaymentsModal(false)}
        onMarkPaid={handlePaymentStatusChange}
      />
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
