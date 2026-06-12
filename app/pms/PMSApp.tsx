"use client";

import { useEffect, useMemo, useState } from "react";

import AlertBanner from "./components/AlertBanner";
import AuditLogViewer from "./components/AuditLogViewer";
import ChannelManager from "./components/ChannelManager";
import CommunicationTemplates from "./components/CommunicationTemplates";
import ConflictDetectionUI from "./components/ConflictDetectionUI";
import FilterPanel from "./components/FilterPanel";
import FinancialReports from "./components/FinancialReports";
import HorizontalTimeline from "./components/HorizontalTimeline";
import HousekeepingBoard from "./components/HousekeepingBoard";
import MobileHousekeepingView from "./components/MobileHousekeepingView";
import PageHeader from "./components/PageHeader";
import PaymentLedger from "./components/PaymentLedger";
import Reports from "./components/Reports";
import ReservationDrawer from "./components/ReservationDrawer";
import ReservationList from "./components/ReservationList";
import Sidebar from "./components/Sidebar";
import TodayCommandCenter from "./components/TodayCommandCenter";
import UserManagement from "./components/UserManagement";
import { demoData } from "./data";
import { useAlerts } from "./hooks/use-alerts";
import { applyFilters, defaultFilters, loadFiltersFromLocalStorage, saveFiltersToLocalStorage, type FilterOptions } from "./lib/filter-utils";
import type { Reservation } from "./types";
import { hasConflict } from "./utils/conflict-detector";

type PageType =
  | "operations"
  | "housekeeping"
  | "calendar"
  | "reservations"
  | "reports"
  | "messaging"
  | "channels"
  | "financial"
  | "ledger"
  | "users"
  | "audit"
  | "conflicts";

export default function PMSApp() {
  const [rooms] = useState(demoData.rooms);
  const [reservations, setReservations] = useState(demoData.reservations);
  const [tasks, setTasks] = useState(demoData.tasks);
  const [users] = useState(demoData.users);
  const [activeSection, setActiveSection] = useState<PageType>("operations");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = loadFiltersFromLocalStorage();

      if (saved) {
        setFilters(saved);
      }

      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const alerts = useAlerts(reservations, rooms);
  const filteredReservations = useMemo(
    () => applyFilters(reservations, filters),
    [reservations, filters],
  );

  const handleFilterChange = (nextFilters: FilterOptions) => {
    setFilters(nextFilters);

    if (typeof window !== "undefined") {
      saveFiltersToLocalStorage(nextFilters);
    }
  };

  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };

  const handleUpdateReservation = (updatedReservation: Reservation) => {
    setReservations((currentReservations) =>
      currentReservations.map((reservation) =>
        reservation.id === updatedReservation.id ? updatedReservation : reservation,
      ),
    );
  };

  const handleQuickBook = (roomId: string, checkInDate: Date, checkOutDate: Date) => {
    const nextReservation: Omit<Reservation, "id" | "createdAt" | "updatedAt"> = {
      roomId,
      guestId: "guest-new",
      guestName: "New Guest",
      checkInDate,
      checkOutDate,
      source: "direct",
      reservationStatus: "pending",
      paymentStatus: "pending",
      cleaningStatus: "clean",
      totalAmount: 0,
      paidAmount: 0,
      balanceDue: 0,
      numberOfGuests: 1,
    };

    if (hasConflict(nextReservation, reservations)) {
      alert("Room is not available for this date range");
      return;
    }

    setSelectedReservation({
      id: Math.random().toString(36).slice(2, 11),
      ...nextReservation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsDrawerOpen(true);
  };

  const handleAddReservation = (reservationInput: Omit<Reservation, "id" | "createdAt" | "updatedAt">) => {
    if (hasConflict(reservationInput, reservations)) {
      alert("Conflict detected: Room is already booked for this date range");
      return;
    }

    setReservations((currentReservations) => [
      ...currentReservations,
      {
        id: Math.random().toString(36).slice(2, 11),
        ...reservationInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader section={activeSection} />

        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-8">
            {alerts.length > 0 ? <AlertBanner alerts={alerts} /> : null}

            {activeSection === "operations" ? (
              <TodayCommandCenter
                reservations={reservations}
                rooms={rooms}
                tasks={tasks}
                onSelectReservation={handleSelectReservation}
              />
            ) : null}

            {activeSection === "housekeeping"
              ? isMobile
                ? (
                  <MobileHousekeepingView
                    tasks={tasks}
                    onUpdateTask={(taskId, status) => {
                      setTasks((currentTasks) =>
                        currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
                      );
                    }}
                  />
                )
                : (
                  <HousekeepingBoard
                    tasks={tasks}
                    onUpdateTask={(taskId, status) => {
                      setTasks((currentTasks) =>
                        currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
                      );
                    }}
                  />
                )
              : null}

            {activeSection === "calendar" ? (
              <HorizontalTimeline
                rooms={rooms}
                reservations={reservations}
                onSelectReservation={handleSelectReservation}
                onQuickBook={handleQuickBook}
                onAddReservation={handleAddReservation}
              />
            ) : null}

            {activeSection === "reservations" ? (
              <div className="space-y-6">
                <FilterPanel filters={filters} onFilterChange={handleFilterChange} rooms={rooms} />
                <ReservationList
                  reservations={filteredReservations}
                  rooms={rooms}
                  onSelectReservation={handleSelectReservation}
                />
              </div>
            ) : null}

            {activeSection === "reports" ? <Reports reservations={reservations} rooms={rooms} /> : null}

            {activeSection === "channels" ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Channel Manager</h1>
                  <p className="text-foreground/60">Connect and manage your booking channels (OTAs)</p>
                </div>
                <ChannelManager />
              </div>
            ) : null}

            {activeSection === "messaging" ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Communication Templates</h1>
                  <p className="text-foreground/60">Manage pre-built message templates for guest communication</p>
                </div>
                <CommunicationTemplates />
              </div>
            ) : null}

            {activeSection === "financial" ? <FinancialReports /> : null}

            {activeSection === "ledger" ? (
              <PaymentLedger reservations={reservations} paymentEntries={demoData.paymentEntries} />
            ) : null}

            {activeSection === "users" ? <UserManagement users={users} /> : null}

            {activeSection === "audit" ? <AuditLogViewer auditLogs={demoData.auditLogs} /> : null}

            {activeSection === "conflicts" ? (
              <ConflictDetectionUI rooms={rooms} reservations={reservations} />
            ) : null}
          </div>
        </main>
      </div>

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
