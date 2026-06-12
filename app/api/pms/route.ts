import { NextResponse } from "next/server";

import { guardPmsApi } from "@/lib/auth/api";
import { getPmsData, getPmsStorageConfigSource, getPmsStorageMode } from "@/lib/pms/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { response: guardResponse, scope } = await guardPmsApi();

  if (guardResponse) {
    return guardResponse;
  }

  const data = await getPmsData(scope ?? undefined).catch((err: unknown) => {
    console.log("[v0] getPmsData error:", err instanceof Error ? err.message : String(err));
    throw err;
  });

  return NextResponse.json(data, {
    headers: {
      "x-pms-storage": getPmsStorageMode(),
      "x-pms-storage-config": getPmsStorageConfigSource() ?? "data/pms.json",
      "x-pms-scope": scope ? "workspace" : "legacy",
    },
  });
}
