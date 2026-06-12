"use client";

import { useEffect, useMemo, useState } from "react";

import AlertBanner from "./components/AlertBanner";
import AuditLogViewer from "./components/AuditLogViewer";
import AutomationDashboard from "./components/AutomationDashboard";
import BookingForm from "./components/BookingForm";
import OnboardingWizard from "./components/OnboardingWizard";
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
import { useAlerts } from "./hooks/use-alerts";
import { createOperationalTasks, createPaymentEntries, useLivePms } from "./hooks/use-live-pms";
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
  | "conflicts"
  | "automation";

export default function PMSApp() {
  const {
    createReservation,
    deleteReservation,
    error: liveError,
    isLoading,
    mode,
    paymentEntries,
    refresh,
    reservations,
    rooms,
    setPaymentEntries,
    setReservations,
    setTasks,
    tasks,
  } = useLivePms();
  const [activeSection, setActiveSection] = useState<PageType>("operations");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isMobile, setIsMobile] = useState(false);
  const [propertyName, setPropertyName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = loadFiltersFromLocalStorage();

      if (saved) {
        setFilters(saved);
      }

      setIsMobile(window.innerWidth < 768);
    }

    // Fetch the active property name for the onboarding wizard greeting
    fetch("/api/viewer", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.activeProperty?.name) setPropertyName(data.activeProperty.name);
      })
      .catch(() => {/* ignore */});
  }, []);

  const alerts = useAlerts(reservations, rooms);
  const filteredReservations = useMemo(
    () => applyFilters(reservations, filters),
    [reservations, filters],
  );
  const today = useMemo(() => {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
  }, []);

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
    setTasks((currentTasks) => [
      ...currentTasks.filter((task) => task.reservationId !== updatedReservation.id),
      ...createOperationalTasks([updatedReservation]),
    ]);
    setPaymentEntries((currentEntries) => [
      ...currentEntries.filter((entry) => entry.reservationId !== updatedReservation.id),
      ...createPaymentEntries([updatedReservation]),
    ]);
  };

  const handleQuickBook = (roomId: string, checkInDate: Date, checkOutDate: Date) => {
    const room = rooms.find((currentRoom) => currentRoom.id === roomId);
    const nextReservation: Omit<Reservation, "id" | "createdAt" | "updatedAt"> = {
      balanceDue: 0,
      checkIn: checkInDate.toISOString().split("T")[0],
      checkInDate,
      checkOut: checkOutDate.toISOString().split("T")[0],
      checkOutDate,
      check_in_date: checkInDate.toISOString().split("T")[0],
      check_out_date: checkOutDate.toISOString().split("T")[0],
      cleaningStatus: "clean",
      cleaning_status: "clean",
      created_at: new Date().toISOString(),
      guestEmail: "",
      guestId: "guest-new",
      guestName: "New Guest",
      guestPhone: "",
      guest_email: "",
      guest_name: "New Guest",
      guest_phone: "",
      numberOfGuests: 1,
      paidAmount: 0,
      paymentStatus: "pending",
      payment_status: "pending",
      propertyId: room?.propertyId ?? "",
      reservationStatus: "pending",
      roomId,
      room_id: roomId,
      source: "Direct",
      specialRequests: "",
      status: "pending",
      totalAmount: 0,
      totalPrice: 0,
      updated_at: new Date().toISOString(),
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

  const handleAddReservation = async (reservationInput: {
    adults: number;
    checkIn: string;
    checkOut: string;
    children: number;
    cleaningStatus: string;
    guestEmail: string;
    guestName: string;
    guestPhone: string;
    notes: string;
    paymentStatus: string;
    roomId: string;
    source: string;
  }) => {
    await createReservation(reservationInput);
  };

  const handleDeleteReservation = async (id: string) => {
    await deleteReservation(id);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader section={activeSection} />

        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${mode === "live" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-secondary500/30 bg-secondary500/10 text-secondary300"}`}>
                {mode === "live" ? "Live PMS data" : "Demo fallback data"}
              </span>
              {isLoading ? <span className="text-xs text-foreground/60">Syncing PMS data...</span> : null}
              {liveError ? <span className="text-xs text-red-300">{liveError}</span> : null}
            </div>

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
              />
            ) : null}

            {activeSection === "reservations" ? (
              <div className="space-y-6">
                <FilterPanel filters={filters} onFilterChange={handleFilterChange} rooms={rooms} />
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                  <BookingForm
                    rooms={rooms}
                    reservations={reservations}
                    onAdd={handleAddReservation}
                  />
                  <ReservationList
                    reservations={filteredReservations}
                    onAdd={() => {
                      const firstRoom = rooms[0];

                      if (!firstRoom) {
                        return;
                      }

                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      handleQuickBook(firstRoom.id, today, tomorrow);
                    }}
                    onDelete={handleDeleteReservation}
                    onEdit={handleSelectReservation}
                  />
                </div>
              </div>
            ) : null}

            {activeSection === "reports" ? <Reports reservations={reservations} /> : null}

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
              <PaymentLedger reservations={reservations} paymentEntries={paymentEntries} />
            ) : null}

            {activeSection === "users" ? <UserManagement users={[]} /> : null}

            {activeSection === "audit" ? <AuditLogViewer auditLogs={[]} /> : null}

            {activeSection === "conflicts" ? (
              <ConflictDetectionUI rooms={rooms} reservations={reservations} />
            ) : null}

            {activeSection === "automation" ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Automation</h1>
                  <p className="text-foreground/60">Rules that run automatically - no manual work needed.</p>
                </div>
                <AutomationDashboard tasks={tasks} alerts={alerts} criticalTasks={[]} />
              </div>
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

      {/* Onboarding wizard — shown once, when no rooms exist after load */}
      {!isLoading && rooms.length === 0 && !liveError && (
        <OnboardingWizard
          propertyName={propertyName}
          onComplete={() => void refresh()}
        />
      )}
    </div>
  );
}
