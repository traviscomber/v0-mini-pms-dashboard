import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { guardPmsApi } from "@/lib/auth/api";
import { slugify } from "@/lib/platform/slug";
import { getSql } from "@/lib/pms/postgres-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RoomInput {
  name: string;
  type: string;
  capacity: number;
  basePrice: number;
}

export async function POST(request: Request) {
  const { response: guardResponse, scope } = await guardPmsApi();

  if (guardResponse) {
    return guardResponse;
  }

  if (!scope) {
    return NextResponse.json({ message: "No active scope" }, { status: 409 });
  }

  let body: { rooms: RoomInput[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.rooms) || body.rooms.length === 0) {
    return NextResponse.json({ message: "Provide at least one room" }, { status: 400 });
  }

  const sql = getSql();
  const created: { id: string; name: string }[] = [];

  for (const room of body.rooms) {
    if (!room.name?.trim()) continue;

    const id = randomUUID();
    const slug = `${slugify(room.name.trim())}-${id.replace(/-/g, "").slice(0, 6)}`;

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
        ${id},
        ${scope.propertyId},
        ${room.name.trim()},
        ${slug},
        ${room.type ?? "room"},
        ${room.capacity ?? 2},
        ${room.basePrice ?? 100},
        ${"#6d28d9"}
      )
      on conflict do nothing
    `;

    created.push({ id, name: room.name.trim() });
  }

  return NextResponse.json({ created }, { status: 201 });
}
