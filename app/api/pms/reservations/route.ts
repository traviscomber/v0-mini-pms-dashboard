import { NextResponse } from "next/server";

import { guardPmsApi } from "@/lib/auth/api";
import { createReservation, getPmsData, getPmsStorageConfigSource, getPmsStorageMode } from "@/lib/pms/repository";
import type { ReservationInput } from "@/lib/pms/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { response: guardResponse, scope } = await guardPmsApi();

  if (guardResponse) {
    return guardResponse;
  }

  const data = await getPmsData(scope ?? undefined);

  return NextResponse.json(data.reservations, {
    headers: {
      "x-pms-storage": getPmsStorageMode(),
      "x-pms-storage-config": getPmsStorageConfigSource() ?? "data/pms.json",
      "x-pms-scope": scope ? "workspace" : "legacy",
    },
  });
}

export async function POST(request: Request) {
  const { response: guardResponse, scope } = await guardPmsApi();

  if (guardResponse) {
    return guardResponse;
  }

  try {
    const payload = (await request.json()) as ReservationInput;
    const reservation = await createReservation(payload, scope ?? undefined);
    return NextResponse.json(reservation, {
      status: 201,
      headers: {
        "x-pms-storage": getPmsStorageMode(),
        "x-pms-storage-config": getPmsStorageConfigSource() ?? "data/pms.json",
        "x-pms-scope": scope ? "workspace" : "legacy",
      },
    });
  } catch (error) {
    const details = (error as Error & { details?: unknown }).details;
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to create reservation",
        details,
      },
      {
        status: details ? 400 : 500,
        headers: {
          "x-pms-storage": getPmsStorageMode(),
          "x-pms-storage-config": getPmsStorageConfigSource() ?? "data/pms.json",
          "x-pms-scope": scope ? "workspace" : "legacy",
        },
      },
    );
  }
}
