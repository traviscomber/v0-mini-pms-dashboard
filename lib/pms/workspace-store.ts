import { randomUUID } from "node:crypto";

import { slugify } from "@/lib/platform/slug";
import { readFileStoreIfPresent } from "@/lib/pms/file-store";
import { getSql, type PostgresClient, type PostgresExecutor } from "@/lib/pms/postgres-client";
import { seedData } from "@/lib/pms/seed";
import type { PmsData, PmsScope, Reservation, ReservationInput, Room } from "@/lib/pms/types";
import { calculateReservationTotal, validateReservationInput } from "@/lib/pms/validation";

interface UnitRow {
  id: string;
  name: string;
  unit_type: string;
  capacity: number;
  base_price: number;
  color: string;
}

interface ReservationRow {
  id: string;
  unit_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
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

interface GuestRow {
  id: string;
}

interface PropertyCountsRow {
  property_count: number;
  reservation_count: number;
  unit_count: number;
}

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

function mapUnitRow(row: UnitRow): Room {
  return {
    id: row.id,
    name: row.name,
    type: row.unit_type,
    capacity: row.capacity,
    basePrice: row.base_price,
    color: row.color,
  };
}

function mapReservationRow(row: ReservationRow): Reservation {
  return {
    id: row.id,
    roomId: row.unit_id ?? "",
    guestName: row.guest_name ?? "Guest",
    guestEmail: row.guest_email ?? "",
    guestPhone: row.guest_phone ?? "",
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

function splitGuestName(fullName: string) {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return {
      firstName: "Guest",
      lastName: "",
    };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function getBalanceAmount(totalPrice: number, paymentStatus: Reservation["paymentStatus"]) {
  if (paymentStatus === "Paid") {
    return 0;
  }

  if (paymentStatus === "Partial") {
    return Math.max(0, Math.round(totalPrice / 2));
  }

  return totalPrice;
}

async function getPropertyCounts(sql: PostgresClient, scope: PmsScope) {
  const [counts] = await sql<PropertyCountsRow[]>`
    select
      (
        select count(*)::int
        from properties
        where organization_id = ${scope.organizationId}
      ) as property_count,
      (
        select count(*)::int
        from units
        join properties on properties.id = units.property_id
        where properties.organization_id = ${scope.organizationId}
      ) as unit_count,
      (
        select count(*)::int
        from reservations
        where organization_id = ${scope.organizationId}
      ) as reservation_count
  `;

  return counts;
}

async function findOrCreateGuest(
  sql: PostgresExecutor,
  scope: PmsScope,
  guestName: string,
  guestEmail: string,
  guestPhone: string,
) {
  const normalizedEmail = guestEmail.trim().toLowerCase();

  if (normalizedEmail) {
    const existing = await sql<GuestRow[]>`
      select id
      from guests
      where organization_id = ${scope.organizationId}
        and lower(coalesce(email, '')) = ${normalizedEmail}
      limit 1
    `;

    if (existing[0]) {
      return existing[0].id;
    }
  }

  const { firstName, lastName } = splitGuestName(guestName);
  const guestId = randomUUID();

  await sql`
    insert into guests (
      id,
      organization_id,
      first_name,
      last_name,
      email,
      phone,
      created_by
    )
    values (
      ${guestId},
      ${scope.organizationId},
      ${firstName},
      ${lastName || null},
      ${normalizedEmail || null},
      ${guestPhone.trim() || null},
      ${scope.userId}
    )
  `;

  return guestId;
}

async function seedWorkspaceFromLegacy(sql: PostgresClient, scope: PmsScope) {
  const counts = await getPropertyCounts(sql, scope);

  if (counts.property_count !== 1 || counts.unit_count > 0 || counts.reservation_count > 0) {
    return;
  }

  const sourceData = (await readFileStoreIfPresent()) ?? seedData;
  const unitIdByLegacyId = new Map<string, string>();

  for (const room of sourceData.rooms) {
    const unitId = randomUUID();
    unitIdByLegacyId.set(room.id, unitId);

    await sql`
      insert into units (
        id,
        property_id,
        name,
        slug,
        unit_type,
        capacity,
        base_price,
        color
      )
      values (
        ${unitId},
        ${scope.propertyId},
        ${room.name},
        ${`${slugify(room.name)}-${room.id}`},
        ${room.type},
        ${room.capacity},
        ${room.basePrice},
        ${room.color}
      )
      on conflict do nothing
    `;
  }

  for (const reservation of sourceData.reservations) {
    const unitId = unitIdByLegacyId.get(reservation.roomId);

    if (!unitId) {
      continue;
    }

    const guestId = await findOrCreateGuest(
      sql,
      scope,
      reservation.guestName,
      reservation.guestEmail,
      reservation.guestPhone,
    );

    await sql`
      insert into reservations (
        id,
        organization_id,
        property_id,
        unit_id,
        guest_id,
        source,
        status,
        payment_status,
        cleaning_status,
        check_in,
        check_out,
        adults,
        children,
        total_price,
        balance_amount,
        notes,
        created_by,
        created_at
      )
      values (
        ${randomUUID()},
        ${scope.organizationId},
        ${scope.propertyId},
        ${unitId},
        ${guestId},
        ${reservation.source},
        ${"confirmed"},
        ${reservation.paymentStatus},
        ${reservation.cleaningStatus},
        ${reservation.checkIn},
        ${reservation.checkOut},
        ${reservation.adults},
        ${reservation.children},
        ${reservation.totalPrice},
        ${getBalanceAmount(reservation.totalPrice, reservation.paymentStatus)},
        ${reservation.notes},
        ${scope.userId},
        ${reservation.createdAt}
      )
    `;
  }
}

async function ensureWorkspaceSeeded(scope: PmsScope) {
  const sql = getSql();
  const [property] = await sql<{ id: string }[]>`
    select id
    from properties
    where id = ${scope.propertyId}
      and organization_id = ${scope.organizationId}
    limit 1
  `;

  if (!property) {
    throw new Error("Active property not found");
  }

  await seedWorkspaceFromLegacy(sql, scope);
}

export async function getWorkspacePmsData(scope: PmsScope): Promise<PmsData> {
  await ensureWorkspaceSeeded(scope);
  const sql = getSql();

  const [rooms, reservations] = await Promise.all([
    sql<UnitRow[]>`
      select id, name, unit_type, capacity, base_price, color
      from units
      where property_id = ${scope.propertyId}
        and is_active = true
      order by name
    `,
    sql<ReservationRow[]>`
      select
        reservations.id,
        reservations.unit_id,
        (
          trim(
            coalesce(guests.first_name, '') || ' ' || coalesce(guests.last_name, '')
          )
        ) as guest_name,
        guests.email as guest_email,
        guests.phone as guest_phone,
        reservations.check_in,
        reservations.check_out,
        reservations.adults,
        reservations.children,
        reservations.source,
        reservations.payment_status,
        reservations.cleaning_status,
        reservations.notes,
        reservations.total_price,
        reservations.created_at
      from reservations
      left join guests on guests.id = reservations.guest_id
      where reservations.organization_id = ${scope.organizationId}
        and reservations.property_id = ${scope.propertyId}
      order by reservations.check_in, reservations.created_at, reservations.id
    `,
  ]);

  return {
    rooms: rooms.map(mapUnitRow),
    reservations: reservations.map(mapReservationRow),
  };
}

export async function createWorkspaceReservation(scope: PmsScope, input: ReservationInput) {
  await ensureWorkspaceSeeded(scope);
  const sql = getSql();

  return sql.begin(async (transaction) => {
    const units = await transaction<UnitRow[]>`
      select id, name, unit_type, capacity, base_price, color
      from units
      where property_id = ${scope.propertyId}
        and is_active = true
      order by name
    `;

    await transaction<UnitRow[]>`
      select id, name, unit_type, capacity, base_price, color
      from units
      where property_id = ${scope.propertyId}
        and id = ${input.roomId}
      for update
    `;

    const reservations = await transaction<ReservationRow[]>`
      select
        reservations.id,
        reservations.unit_id,
        (
          trim(
            coalesce(guests.first_name, '') || ' ' || coalesce(guests.last_name, '')
          )
        ) as guest_name,
        guests.email as guest_email,
        guests.phone as guest_phone,
        reservations.check_in,
        reservations.check_out,
        reservations.adults,
        reservations.children,
        reservations.source,
        reservations.payment_status,
        reservations.cleaning_status,
        reservations.notes,
        reservations.total_price,
        reservations.created_at
      from reservations
      left join guests on guests.id = reservations.guest_id
      where reservations.organization_id = ${scope.organizationId}
        and reservations.property_id = ${scope.propertyId}
        and reservations.unit_id = ${input.roomId}
      order by reservations.check_in, reservations.id
    `;

    const data: PmsData = {
      rooms: units.map(mapUnitRow),
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

    const guestId = await findOrCreateGuest(
      transaction,
      scope,
      input.guestName,
      input.guestEmail,
      input.guestPhone,
    );

    const reservation: Reservation = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      totalPrice: calculateReservationTotal(room, input.checkIn, input.checkOut),
      ...input,
    };

    await transaction`
      insert into reservations (
        id,
        organization_id,
        property_id,
        unit_id,
        guest_id,
        source,
        status,
        payment_status,
        cleaning_status,
        check_in,
        check_out,
        adults,
        children,
        total_price,
        balance_amount,
        notes,
        created_by,
        created_at
      )
      values (
        ${reservation.id},
        ${scope.organizationId},
        ${scope.propertyId},
        ${reservation.roomId},
        ${guestId},
        ${reservation.source},
        ${"confirmed"},
        ${reservation.paymentStatus},
        ${reservation.cleaningStatus},
        ${reservation.checkIn},
        ${reservation.checkOut},
        ${reservation.adults},
        ${reservation.children},
        ${reservation.totalPrice},
        ${getBalanceAmount(reservation.totalPrice, reservation.paymentStatus)},
        ${reservation.notes},
        ${scope.userId},
        ${reservation.createdAt}
      )
    `;

    return reservation;
  });
}

export async function deleteWorkspaceReservation(scope: PmsScope, id: string) {
  await ensureWorkspaceSeeded(scope);
  const sql = getSql();
  const deleted = await sql<{ id: string }[]>`
    delete from reservations
    where id = ${id}
      and organization_id = ${scope.organizationId}
      and property_id = ${scope.propertyId}
    returning id
  `;

  return deleted.length > 0;
}
