'use client';

import { useState } from 'react';
import { demoData } from './pms/data';
import Sidebar from './pms/components/Sidebar';
import PageHeader from './pms/components/PageHeader';
import { useLanguage } from './pms/LanguageContext';
import HorizontalTimeline from './pms/components/HorizontalTimeline';
import ReservationDrawer from './pms/components/ReservationDrawer';
import OperationsDashboard from './pms/components/OperationsDashboard';
import { Reservation } from './pms/types';
import { hasConflict } from './pms/utils/conflict-detector';

export default function PMSApp() {
  const [rooms, setRooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<'operations' | 'calendar'>('operations');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <PMSContent 
      rooms={rooms}
      setRooms={setRooms}
      reservations={reservations}
      setReservations={setReservations}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      selectedReservation={selectedReservation}
      setSelectedReservation={setSelectedReservation}
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
    />
  );
}

interface PMSContentProps {
  rooms: any[];
  setRooms: (rooms: any[]) => void;
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedReservation: Reservation | null;
  setSelectedReservation: (reservation: Reservation | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
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
    selectedReservation,
    setSelectedReservation,
    isDrawerOpen,
    setIsDrawerOpen,
  } = props;

  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };

  const handleUpdateReservation = (updated: Reservation) => {
    setReservations(reservations.map(r => r.id === updated.id ? updated : r));
  };

  const handleQuickBook = (roomId: string, checkInDate: Date, checkOutDate: Date) => {
    // Create a quick booking modal or direct entry
    const newReservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> = {
      roomId,
      guestId: 'guest-new',
      guestName: 'New Guest',
      checkInDate,
      checkOutDate,
      source: 'direct',
      reservationStatus: 'pending',
      paymentStatus: 'pending',
      cleaningStatus: 'clean',
      totalAmount: 0,
      paidAmount: 0,
      balanceDue: 0,
      numberOfGuests: 1,
    };

    if (hasConflict(newReservation, reservations)) {
      alert('Room is not available for this date range');
      return;
    }

    // Open drawer with prefilled data for new booking
    const id = Math.random().toString(36).substr(2, 9);
    setSelectedReservation({
      id,
      ...newReservation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsDrawerOpen(true);
  };

  const getPageTitle = () => {
    const titles: {[key: string]: string} = {
      operations: 'Today Operations',
      calendar: 'Reservation Calendar',
    };
    return titles[activeSection] || '';
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
            {/* Today Operations Dashboard */}
            {activeSection === 'operations' && (
              <OperationsDashboard
                reservations={reservations}
                rooms={rooms}
                onViewReservation={handleSelectReservation}
              />
            )}

            {/* Reservation Timeline Calendar */}
            {activeSection === 'calendar' && (
              <HorizontalTimeline
                rooms={rooms}
                reservations={reservations}
                onSelectReservation={handleSelectReservation}
                onQuickBook={handleQuickBook}
                onAddReservation={(res) => {
                  const id = Math.random().toString(36).substr(2, 9);
                  if (!hasConflict(res, reservations)) {
                    setReservations([
                      ...reservations,
                      {
                        id,
                        ...res,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ]);
                  } else {
                    alert('Conflict detected: Room is already booked for this date range');
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Reservation Drawer */}
      <ReservationDrawer
        reservation={selectedReservation}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedReservation(null);
        }}
        onUpdate={handleUpdateReservation}
        rooms={rooms}
      />
    </div>
  );
}
