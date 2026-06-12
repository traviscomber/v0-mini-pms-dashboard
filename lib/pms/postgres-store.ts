import { randomUUID } from "node:crypto";

import { readFileStoreIfPresent } from "@/lib/pms/file-store";
import { getPostgresConfigSource, getSql, hasPostgresStore, type DatabaseUrlKey, type PostgresClient } from "@/lib/pms/postgres-client";
import { seedData } from "@/lib/pms/seed";
import type { PmsData, Reservation, ReservationInput, Room } from "@/lib/pms/types";
import { calculateReservationTotal, validateReservationInput } from "@/lib/pms/validation";

interface RoomRow {
  id: string;
  name: string;
  type: string;
  capacity: number;
  base_price: number;
  color: string;
}

interface ReservationRow {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string | Date;
  check_out: string | Date;
  adults: number;
  children: number;
  source: string;
  payment_status: string;
  cleaning_status: string;
  notes: string;
  total_price: number;
  created_at: string | Date;
}

let setupPromise: Promise<void> | null = null;

function normalizeDateOnly(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function normalizeTimestamp(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapRoomRow(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    capacity: row.capacity,
    basePrice: row.base_price,
    color: row.color,
  };
}

function mapReservationRow(row: ReservationRow): Reservation {
  return {
    id: row.id,
    roomId: row.room_id,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone,
    checkIn: normalizeDateOnly(row.check_in),
    checkOut: normalizeDateOnly(row.check_out),
    adults: row.adults,
    children: row.children,
    source: row.source as Reservation["source"],
    paymentStatus: row.payment_status as Reservation["paymentStatus"],
    cleaningStatus: row.cleaning_status as Reservation["cleaningStatus"],
    notes: row.notes,
    totalPrice: row.total_price,
    createdAt: normalizeTimestamp(row.created_at),
  };
}

async function seedDatabase(sql: PostgresClient) {
  const sourceData = (await readFileStoreIfPresent()) ?? seedData;

  for (const room of sourceData.rooms) {
    await sql`
      insert into rooms (id, name, type, capacity, base_price, color)
      values (${room.id}, ${room.name}, ${room.type}, ${room.capacity}, ${room.basePrice}, ${room.color})
      on conflict (id) do nothing
    `;
  }

  for (const reservation of sourceData.reservations) {
    await sql`
      insert into reservations (
        id,
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        adults,
        children,
        source,
        payment_status,
        cleaning_status,
        notes,
        total_price,
        created_at
      )
      values (
        ${reservation.id},
        ${reservation.roomId},
        ${reservation.guestName},
        ${reservation.guestEmail},
        ${reservation.guestPhone},
        ${reservation.checkIn},
        ${reservation.checkOut},
        ${reservation.adults},
        ${reservation.children},
        ${reservation.source},
        ${reservation.paymentStatus},
        ${reservation.cleaningStatus},
        ${reservation.notes},
        ${reservation.totalPrice},
        ${reservation.createdAt}
      )
      on conflict (id) do nothing
    `;
  }
}

async function ensureLegacyDatabase() {
  if (setupPromise) {
    return setupPromise;
  }

  setupPromise = (async () => {
    const sql = getSql();

    await sql`
      create table if not exists rooms (
        id text primary key,
        name text not null,
        type text not null,
        capacity integer not null check (capacity > 0),
        base_price integer not null check (base_price >= 0),
        color text not null
      )
    `;

    await sql`
      create table if not exists reservations (
        id text primary key,
        room_id text not null references rooms(id) on delete restrict,
        guest_name text not null,
        guest_email text not null,
        guest_phone text not null default '',
        check_in date not null,
        check_out date not null,
        adults integer not null check (adults > 0),
        children integer not null default 0 check (children >= 0),
        source text not null,
        payment_status text not null,
        cleaning_status text not null,
        notes text not null default '',
        total_price integer not null check (total_price >= 0),
        created_at timestamptz not null default now()
      )
    `;

    await sql`
      create index if not exists reservations_room_dates_idx
      on reservations (room_id, check_in, check_out)
    `;

    await sql`
      create index if not exists reservations_check_in_idx
      on reservations (check_in)
    `;

    const [roomCount] = await sql<{ count: number }[]>`
      select count(*)::int as count
      from rooms
    `;

    if (roomCount.count === 0) {
      await seedDatabase(sql);
    }
  })();

  try {
    await setupPromise;
  } catch (error) {
    setupPromise = null;
    throw error;
  }
}

export { getPostgresConfigSource, hasPostgresStore };
export type { DatabaseUrlKey };

export async function getPostgresPmsData(): Promise<PmsData> {
  await ensureLegacyDatabase();
  const sql = getSql();

  const [rooms, reservations] = await Promise.all([
    sql<RoomRow[]>`
      select id, name, type, capacity, base_price, color
      from rooms
      order by id
    `,
    sql<ReservationRow[]>`
      select
        id,
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        adults,
        children,
        source,
        payment_status,
        cleaning_status,
        notes,
        total_price,
        created_at
      from reservations
      order by check_in, id
    `,
  ]);

  return {
    rooms: rooms.map(mapRoomRow),
    reservations: reservations.map(mapReservationRow),
  };
}

export async function createPostgresReservation(input: ReservationInput) {
  await ensureLegacyDatabase();
  const sql = getSql();

  return sql.begin(async (transaction) => {
    const rooms = await transaction<RoomRow[]>`
      select id, name, type, capacity, base_price, color
      from rooms
      order by id
    `;

    await transaction<RoomRow[]>`
      select id
      from rooms
      where id = ${input.roomId}
      for update
    `;

    const reservations = await transaction<ReservationRow[]>`
      select
        id,
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        adults,
        children,
        source,
        payment_status,
        cleaning_status,
        notes,
        total_price,
        created_at
      from reservations
      where room_id = ${input.roomId}
      order by check_in, id
    `;

    const data: PmsData = {
      rooms: rooms.map(mapRoomRow),
      reservations: reservations.map(mapReservationRow),
    };

    const errors = validateReservationInput(input, data);

    if (Object.keys(errors).length > 0) {
      const error = new Error("Validation failed");
      (error as Error & { details?: unknown }).details = errors;
      throw error;
    }

    const room = data.rooms.find((candidate) => candidate.id === input.roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const reservation: Reservation = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      totalPrice: calculateReservationTotal(room, input.checkIn, input.checkOut),
      ...input,
    };

    await transaction`
      insert into reservations (
        id,
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        adults,
        children,
        source,
        payment_status,
        cleaning_status,
        notes,
        total_price,
        created_at
      )
      values (
        ${reservation.id},
        ${reservation.roomId},
        ${reservation.guestName},
        ${reservation.guestEmail},
        ${reservation.guestPhone},
        ${reservation.checkIn},
        ${reservation.checkOut},
        ${reservation.adults},
        ${reservation.children},
        ${reservation.source},
        ${reservation.paymentStatus},
        ${reservation.cleaningStatus},
        ${reservation.notes},
        ${reservation.totalPrice},
        ${reservation.createdAt}
      )
    `;

    return reservation;
  });
}

export async function deletePostgresReservation(id: string) {
  await ensureLegacyDatabase();
  const sql = getSql();
  const deleted = await sql<{ id: string }[]>`
    delete from reservations
    where id = ${id}
    returning id
  `;

  return deleted.length > 0;
}
