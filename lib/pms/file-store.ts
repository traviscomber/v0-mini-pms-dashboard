import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { seedData } from "@/lib/pms/seed";
import type { PmsData, Reservation, ReservationInput } from "@/lib/pms/types";
import { calculateReservationTotal, validateReservationInput } from "@/lib/pms/validation";

const storeDirectory = join(process.cwd(), "data");
const storePath = join(storeDirectory, "pms.json");

let writeQueue = Promise.resolve();

function normalizeData(parsed: PmsData): PmsData {
  return {
    rooms: parsed.rooms ?? seedData.rooms,
    reservations: [...(parsed.reservations ?? [])].sort((left, right) =>
      left.checkIn.localeCompare(right.checkIn),
    ),
  };
}

async function ensureStore() {
  await mkdir(storeDirectory, { recursive: true });

  try {
    await readFile(storePath, "utf8");
  } catch {
    await writeFile(storePath, JSON.stringify(seedData, null, 2), "utf8");
  }
}

async function readStore(): Promise<PmsData> {
  await ensureStore();
  const raw = await readFile(storePath, "utf8");
  return normalizeData(JSON.parse(raw) as PmsData);
}

async function writeStore(nextData: PmsData) {
  await ensureStore();
  await writeFile(storePath, JSON.stringify(nextData, null, 2), "utf8");
}

function queueWrite<T>(operation: () => Promise<T>) {
  const nextOperation = writeQueue.then(operation);
  writeQueue = nextOperation.then(
    () => undefined,
    () => undefined,
  );

  return nextOperation;
}

export async function readFileStoreIfPresent() {
  try {
    return await readStore();
  } catch {
    return null;
  }
}

export async function getFilePmsData() {
  return readStore();
}

export async function createFileReservation(input: ReservationInput) {
  return queueWrite(async () => {
    const data = await readStore();
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

    await writeStore({
      ...data,
      reservations: [...data.reservations, reservation].sort((left, right) =>
        left.checkIn.localeCompare(right.checkIn),
      ),
    });

    return reservation;
  });
}

export async function deleteFileReservation(id: string) {
  return queueWrite(async () => {
    const data = await readStore();
    const reservations = data.reservations.filter((reservation) => reservation.id !== id);

    if (reservations.length === data.reservations.length) {
      return false;
    }

    await writeStore({
      ...data,
      reservations,
    });

    return true;
  });
}
