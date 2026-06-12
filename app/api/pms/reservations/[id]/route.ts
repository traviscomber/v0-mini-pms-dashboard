import { NextResponse } from "next/server";

import { guardPmsApi } from "@/lib/auth/api";
import { deleteReservation, getPmsStorageConfigSource, getPmsStorageMode } from "@/lib/pms/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response: guardResponse, scope } = await guardPmsApi();

  if (guardResponse) {
    return guardResponse;
  }

  const { id } = await context.params;
  const deleted = await deleteReservation(id, scope ?? undefined);

  if (!deleted) {
    return NextResponse.json(
      { message: "Reservation not found" },
      {
        status: 404,
        headers: {
          "x-pms-storage": getPmsStorageMode(),
          "x-pms-storage-config": getPmsStorageConfigSource() ?? "data/pms.json",
          "x-pms-scope": scope ? "workspace" : "legacy",
        },
      },
    );
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      "x-pms-storage": getPmsStorageMode(),
      "x-pms-storage-config": getPmsStorageConfigSource() ?? "data/pms.json",
      "x-pms-scope": scope ? "workspace" : "legacy",
    },
  });
}
