'use client';

import { useState, useMemo, useEffect } from 'react';
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
import AlertBanner from './pms/components/AlertBanner';
import FilterPanel from './pms/components/FilterPanel';
import ChannelManager from './pms/components/ChannelManager';
import CommunicationTemplates from './pms/components/CommunicationTemplates';
import FinancialReports from './pms/components/FinancialReports';
import GuestMessaging from './pms/components/GuestMessaging';
import TodayCommandCenter from './pms/components/TodayCommandCenter';
import { useAlerts } from './pms/hooks/use-alerts';
import { applyFilters, defaultFilters, loadFiltersFromLocalStorage, saveFiltersToLocalStorage, FilterOptions } from './pms/lib/filter-utils';
import { Reservation } from './pms/types';
import { hasConflict } from './pms/utils/conflict-detector';

type PageType = 'operations' | 'calendar' | 'reservations' | 'reports' | 'channels' | 'templates' | 'financial';

export default function PMSApp() {
  const [rooms, setRooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [tasks, setTasks] = useState(demoData.tasks);
  const [users, setUsers] = useState(demoData.users);
  const [activeSection, setActiveSection] = useState<PageType>('operations');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  
  // Load filters from localStorage on client side only
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = loadFiltersFromLocalStorage();
      if (saved) setFilters(saved);
      setIsLoaded(true);
    }
  }, []);
  
  // Generate alerts based on current data
  const alerts = useAlerts(reservations, rooms);
  
  // Apply filters to reservations
  const filteredReservations = useMemo(() => 
    applyFilters(reservations, filters),
    [reservations, filters]
  );
  
  // Save filters when they change
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (typeof window !== 'undefined') {
      saveFiltersToLocalStorage(newFilters);
    }
  };

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
          <div className="p-8 space-y-6">
            {/* Alerts Section */}
            {alerts.length > 0 && (
              <AlertBanner alerts={alerts} />
            )}

            {/* Operations Dashboard - Today Command Center */}
            {activeSection === 'operations' && (
              <TodayCommandCenter
                reservations={reservations}
                rooms={rooms}
                tasks={tasks}
                onSelectReservation={handleSelectReservation}
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
              <div className="space-y-6">
                <FilterPanel 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  rooms={rooms}
                />
                <ReservationList
                  reservations={filteredReservations}
                  rooms={rooms}
                  onSelectReservation={handleSelectReservation}
                />
              </div>
            )}

            {/* Reports & Analytics */}
            {activeSection === 'reports' && (
              <Reports
                reservations={reservations}
                rooms={rooms}
              />
            )}

            {/* Channel Manager */}
            {activeSection === 'channels' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Channel Manager</h1>
                  <p className="text-foreground/60">Connect and manage your booking channels (OTAs)</p>
                </div>
                <ChannelManager />
              </div>
            )}

            {/* Guest Messaging */}
            {activeSection === 'messaging' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Communication Templates</h1>
                  <p className="text-foreground/60">Manage pre-built message templates for guest communication</p>
                </div>
                <CommunicationTemplates />
              </div>
            )}

            {/* Financial Reports */}
            {activeSection === 'financial' && (
              <FinancialReports />
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
