import type { PmsData, PmsScope, PmsStorageMode, ReservationInput } from "@/lib/pms/types";

import { createFileReservation, deleteFileReservation, getFilePmsData } from "@/lib/pms/file-store";
import {
  createPostgresReservation,
  deletePostgresReservation,
  getPostgresConfigSource,
  getPostgresPmsData,
  hasPostgresStore,
} from "@/lib/pms/postgres-store";
import {
  createWorkspaceReservation,
  deleteWorkspaceReservation,
  getWorkspacePmsData,
} from "@/lib/pms/workspace-store";

interface PmsRepository {
  createReservation(input: ReservationInput, scope?: PmsScope): Promise<Awaited<ReturnType<typeof createFileReservation>>>;
  deleteReservation(id: string, scope?: PmsScope): Promise<boolean>;
  getPmsData(scope?: PmsScope): Promise<PmsData>;
}

const fileRepository: PmsRepository = {
  createReservation: async (input) => createFileReservation(input),
  deleteReservation: async (id) => deleteFileReservation(id),
  getPmsData: async () => getFilePmsData(),
};

const postgresRepository: PmsRepository = {
  createReservation: async (input, scope) =>
    scope ? createWorkspaceReservation(scope, input) : createPostgresReservation(input),
  deleteReservation: async (id, scope) =>
    scope ? deleteWorkspaceReservation(scope, id) : deletePostgresReservation(id),
  getPmsData: async (scope) =>
    scope ? getWorkspacePmsData(scope) : getPostgresPmsData(),
};

function getRepository() {
  return hasPostgresStore() ? postgresRepository : fileRepository;
}

export function getPmsStorageMode(): PmsStorageMode {
  return hasPostgresStore() ? "postgres" : "file";
}

export function getPmsStorageConfigSource() {
  return getPostgresConfigSource();
}

export async function getPmsData(scope?: PmsScope) {
  return getRepository().getPmsData(scope);
}

export async function createReservation(input: ReservationInput, scope?: PmsScope) {
  return getRepository().createReservation(input, scope);
}

export async function deleteReservation(id: string, scope?: PmsScope) {
  return getRepository().deleteReservation(id, scope);
}
