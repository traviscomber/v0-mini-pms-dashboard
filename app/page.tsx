'use client';

import { useState } from 'react';
import { demoData } from './pms/data';
import Sidebar from './pms/components/Sidebar';
import PageHeader from './pms/components/PageHeader';
import { useLanguage } from './pms/LanguageContext';
import HorizontalTimeline from './pms/components/HorizontalTimeline';
import ReservationDrawer from './pms/components/ReservationDrawer';
import OperationsDashboard from './pms/components/OperationsDashboard';
import EnhancedDashboard from './pms/components/EnhancedDashboard';
import Reports from './pms/components/Reports';
import ReservationList from './pms/components/ReservationList';
import { Reservation } from './pms/types';
import { hasConflict } from './pms/utils/conflict-detector';

type PageType = 'operations' | 'calendar' | 'reservations' | 'reports';

export default function PMSApp() {
  const [rooms, setRooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [activeSection, setActiveSection] = useState<PageType>('calendar');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };

  const handleUpdateReservation = (updated: Reservation) => {
    setReservations(reservations.map(r => r.id === updated.id ? updated : r));
  };

  const handleQuickBook = (roomId: string, checkInDate: Date, checkOutDate: Date) => {
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

    const id = Math.random().toString(36).substr(2, 9);
    setSelectedReservation({
      id,
      ...newReservation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsDrawerOpen(true);
  };

  const handleAddReservation = (newRes: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    if (!hasConflict(newRes, reservations)) {
      setReservations([
        ...reservations,
        {
          id,
          ...newRes,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } else {
      alert('Conflict detected: Room is already booked for this date range');
    }
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
            {/* Operations Dashboard */}
            {activeSection === 'operations' && (
              <OperationsDashboard
                reservations={reservations}
                rooms={rooms}
                onViewReservation={handleSelectReservation}
              />
            )}

            {/* Reservation Calendar */}
            {activeSection === 'calendar' && (
              <HorizontalTimeline
                rooms={rooms}
                reservations={reservations}
                onSelectReservation={handleSelectReservation}
                onQuickBook={handleQuickBook}
                onAddReservation={handleAddReservation}
              />
            )}

            {/* Reservation List */}
            {activeSection === 'reservations' && (
              <ReservationList
                reservations={reservations}
                rooms={rooms}
                onSelectReservation={handleSelectReservation}
              />
            )}

            {/* Reports & Analytics */}
            {activeSection === 'reports' && (
              <Reports
                reservations={reservations}
                rooms={rooms}
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
