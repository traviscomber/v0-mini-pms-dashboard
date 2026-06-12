import { getNights } from "@/lib/pms/date";
import type { PmsData, ReservationInput, ReservationValidationErrors, Room } from "@/lib/pms/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkOverlap(data: PmsData, roomId: string, checkIn: string, checkOut: string) {
  return data.reservations.some(
    (reservation) =>
      reservation.roomId === roomId && checkIn < reservation.checkOut && checkOut > reservation.checkIn,
  );
}

export function calculateReservationTotal(room: Room, checkIn: string, checkOut: string) {
  return getNights(checkIn, checkOut) * room.basePrice;
}

export function validateReservationInput(input: ReservationInput, data: PmsData): ReservationValidationErrors {
  const errors: ReservationValidationErrors = {};
  const room = data.rooms.find((candidate) => candidate.id === input.roomId);
  const totalGuests = input.adults + input.children;

  if (!input.guestName.trim()) {
    errors.guestName = "Guest name is required";
  }

  if (!input.guestEmail.trim()) {
    errors.guestEmail = "Email is required";
  } else if (!EMAIL_PATTERN.test(input.guestEmail)) {
    errors.guestEmail = "Invalid email format";
  }

  if (!room) {
    errors.roomId = "A valid room is required";
  }

  if (!input.checkIn) {
    errors.checkIn = "Check-in date is required";
  }

  if (!input.checkOut) {
    errors.checkOut = "Check-out date is required";
  }

  if (input.checkIn && input.checkOut && input.checkOut <= input.checkIn) {
    errors.checkOut = "Check-out must be after check-in";
  }

  if (input.adults < 1) {
    errors.adults = "At least 1 adult is required";
  }

  if (room && totalGuests > room.capacity) {
    errors.adults = `Total guests (${totalGuests}) exceed room capacity (${room.capacity})`;
  }

  if (room && input.checkIn && input.checkOut && checkOverlap(data, input.roomId, input.checkIn, input.checkOut)) {
    errors.checkOut = "This room is already booked for these dates";
  }

  return errors;
}
