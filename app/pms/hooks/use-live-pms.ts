"use client";

import { useEffect, useMemo, useState } from "react";

import { demoData } from "@/app/pms/data";
import type { ReservationInput, Reservation as ApiReservation, Room as ApiRoom } from "@/lib/pms/types";

const defaultPropertyId = demoData.properties[0]?.id ?? "prop-live";

function toDate(value: string | Date | undefined) {
  if (!value) {
    return new Date();
  }

  return value instanceof Date ? value : new Date(value);
}

function normalizeRoomType(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("apartment")) return "apartment";
  if (normalized.includes("suite")) return "suite";
  if (normalized.includes("cabin")) return "cabin";
  if (normalized.includes("studio")) return "studio";
  if (normalized.includes("villa")) return "villa";

  return "room";
}

function normalizeReservationSource(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("booking")) return "Booking.com";
  if (normalized.includes("airbnb")) return "Airbnb";
  if (normalized.includes("phone")) return "Phone";
  if (normalized.includes("website")) return "Website";

  return "Direct";
}

function normalizePaymentStatus(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "paid") return "paid";
  if (normalized === "partial" || normalized === "partially_paid") return "partially_paid";
  if (normalized === "overdue") return "overdue";

  return "pending";
}

function normalizeCleaningStatus(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "clean") return "clean";
  if (normalized.includes("progress")) return "in_progress";
  if (normalized.includes("dirty") || normalized.includes("needs")) return "dirty";

  return "clean";
}

function buildPaymentSnapshot(totalAmount: number, paymentStatus: string) {
  if (paymentStatus === "paid") {
    return {
      balanceDue: 0,
      paidAmount: totalAmount,
    };
  }

  if (paymentStatus === "partially_paid") {
    const paidAmount = Math.round(totalAmount / 2);

    return {
      balanceDue: Math.max(0, totalAmount - paidAmount),
      paidAmount,
    };
  }

  return {
    balanceDue: totalAmount,
    paidAmount: 0,
  };
}

function adaptRoom(room: ApiRoom, index: number) {
  return {
    amenities: [],
    basePrice: room.basePrice,
    bathrooms: 1,
    bedrooms: 1,
    capacity: room.capacity,
    color: room.color,
    createdAt: new Date(),
    id: room.id,
    name: room.name,
    propertyId: defaultPropertyId,
    roomNumber: `${index + 1}`.padStart(3, "0"),
    status: "available",
    type: normalizeRoomType(room.type),
    updatedAt: new Date(),
  };
}

function adaptReservation(reservation: ApiReservation) {
  const checkInDate = toDate(reservation.checkIn);
  const checkOutDate = toDate(reservation.checkOut);
  const paymentStatus = normalizePaymentStatus(reservation.paymentStatus);
  const cleaningStatus = normalizeCleaningStatus(reservation.cleaningStatus);
  const source = normalizeReservationSource(reservation.source);
  const totalAmount = reservation.totalPrice;
  const { balanceDue, paidAmount } = buildPaymentSnapshot(totalAmount, paymentStatus);
  const createdAt = toDate(reservation.createdAt);

  return {
    balanceDue,
    checkIn: reservation.checkIn,
    checkInDate,
    checkOut: reservation.checkOut,
    checkOutDate,
    check_in_date: reservation.checkIn,
    check_out_date: reservation.checkOut,
    cleaningStatus,
    cleaning_status: cleaningStatus,
    createdAt,
    created_at: createdAt.toISOString(),
    guestEmail: reservation.guestEmail,
    guestPhone: reservation.guestPhone,
    guestId: `guest-${reservation.id}`,
    guestName: reservation.guestName,
    guest_email: reservation.guestEmail,
    guest_name: reservation.guestName,
    guest_phone: reservation.guestPhone,
    id: reservation.id,
    notes: reservation.notes,
    numberOfGuests: reservation.adults + reservation.children,
    paidAmount,
    paymentStatus,
    payment_status: paymentStatus,
    propertyId: defaultPropertyId,
    reservationStatus: "confirmed",
    roomId: reservation.roomId,
    room_id: reservation.roomId,
    source,
    specialRequests: reservation.notes,
    status: "confirmed",
    totalAmount,
    totalPrice: totalAmount,
    updatedAt: createdAt,
    updated_at: createdAt.toISOString(),
  };
}

export function createPaymentEntries(reservations: ReturnType<typeof adaptReservation>[]) {
  return reservations
    .filter((reservation) => reservation.paidAmount > 0)
    .map((reservation) => ({
      amount: reservation.paidAmount,
      id: `payment-${reservation.id}`,
      method: reservation.source === "Direct" ? "cash" : "online",
      propertyId: reservation.propertyId,
      recordedAt: reservation.updatedAt,
      reference: reservation.source,
      reservationId: reservation.id,
      type: reservation.paidAmount < reservation.totalAmount ? "booking_deposit" : "payment",
    }));
}

export function createOperationalTasks(reservations: ReturnType<typeof adaptReservation>[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return reservations.flatMap((reservation) => [
    {
      createdAt: reservation.createdAt,
      dueDate: reservation.checkInDate,
      id: `task-checkin-${reservation.id}`,
      priority: reservation.checkInDate <= today ? "high" : "normal",
      propertyId: reservation.propertyId,
      reservationId: reservation.id,
      roomId: reservation.roomId,
      status: reservation.checkInDate < today ? "completed" : "pending",
      title: `Check-in ${reservation.guestName}`,
      type: "check_in",
      updatedAt: reservation.updatedAt,
    },
    {
      createdAt: reservation.createdAt,
      dueDate: reservation.checkOutDate,
      id: `task-checkout-${reservation.id}`,
      priority: reservation.balanceDue > 0 ? "urgent" : "normal",
      propertyId: reservation.propertyId,
      reservationId: reservation.id,
      roomId: reservation.roomId,
      status: reservation.checkOutDate < today ? "completed" : "pending",
      title: `Check-out ${reservation.guestName}`,
      type: "check_out",
      updatedAt: reservation.updatedAt,
    },
    {
      createdAt: reservation.createdAt,
      dueDate: reservation.checkOutDate,
      id: `task-cleaning-${reservation.id}`,
      priority: "normal",
      propertyId: reservation.propertyId,
      reservationId: reservation.id,
      roomId: reservation.roomId,
      status:
        reservation.cleaningStatus === "clean"
          ? "completed"
          : reservation.cleaningStatus === "in_progress"
            ? "in_progress"
            : "pending",
      title: `Prepare room for ${reservation.guestName}`,
      type: "cleaning",
      updatedAt: reservation.updatedAt,
    },
  ]);
}

function createFallbackState() {
  return {
    mode: "demo" as const,
    paymentEntries: demoData.paymentEntries,
    reservations: demoData.reservations,
    rooms: demoData.rooms,
    tasks: demoData.tasks,
  };
}

export function useLivePms() {
  const [rooms, setRooms] = useState<any[]>(createFallbackState().rooms);
  const [reservations, setReservations] = useState<any[]>(createFallbackState().reservations);
  const [tasks, setTasks] = useState<any[]>(createFallbackState().tasks);
  const [paymentEntries, setPaymentEntries] = useState<any[]>(createFallbackState().paymentEntries);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function hydrate() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pms", { cache: "no-store", credentials: "include" });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Sign in required to load live PMS data." : "Unable to load live PMS data.");
      }

      const payload = (await response.json()) as {
        reservations: ApiReservation[];
        rooms: ApiRoom[];
      };

      const nextRooms = payload.rooms.map(adaptRoom);
      const nextReservations = payload.reservations.map(adaptReservation);

      setRooms(nextRooms);
      setReservations(nextReservations);
      setTasks(createOperationalTasks(nextReservations));
      setPaymentEntries(createPaymentEntries(nextReservations));
      setMode("live");
    } catch (cause) {
      setRooms(createFallbackState().rooms);
      setReservations(createFallbackState().reservations);
      setTasks(createFallbackState().tasks);
      setPaymentEntries(createFallbackState().paymentEntries);
      setMode("demo");
      setError(cause instanceof Error ? cause.message : "Unable to load live PMS data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void hydrate();
  }, []);

  async function createReservation(input: {
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
  }) {
    const payload: ReservationInput = {
      adults: input.adults,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      children: input.children,
      cleaningStatus: input.cleaningStatus as ReservationInput["cleaningStatus"],
      guestEmail: input.guestEmail,
      guestName: input.guestName,
      guestPhone: input.guestPhone,
      notes: input.notes,
      paymentStatus: input.paymentStatus as ReservationInput["paymentStatus"],
      roomId: input.roomId,
      source: input.source as ReservationInput["source"],
    };

    const response = await fetch("/api/pms/reservations", {
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(responseBody?.message ?? "Unable to create reservation.");
    }

    const nextReservation = adaptReservation(responseBody as ApiReservation);

    setReservations((currentReservations) =>
      [...currentReservations, nextReservation].sort(
        (left, right) => left.checkInDate.getTime() - right.checkInDate.getTime(),
      ),
    );
    setTasks((currentTasks) => [...currentTasks, ...createOperationalTasks([nextReservation])]);
    setPaymentEntries((currentEntries) => [...currentEntries, ...createPaymentEntries([nextReservation])]);
    setMode("live");
  }

  async function deleteReservation(id: string) {
    const response = await fetch(`/api/pms/reservations/${id}`, {
      credentials: "include",
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete reservation.");
    }

    setReservations((currentReservations) =>
      currentReservations.filter((reservation) => reservation.id !== id),
    );
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.reservationId !== id),
    );
    setPaymentEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.reservationId !== id),
    );
  }

  const summary = useMemo(
    () => ({
      error,
      isLoading,
      mode,
      paymentEntries,
      refresh: hydrate,
      reservations,
      rooms,
      tasks,
    }),
    [error, isLoading, mode, paymentEntries, reservations, rooms, tasks],
  );

  return {
    ...summary,
    createReservation,
    deleteReservation,
    setPaymentEntries,
    setReservations,
    setTasks,
  };
}
