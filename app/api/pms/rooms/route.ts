import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { guardPmsApi } from "@/lib/auth/api";
import { slugify } from "@/lib/platform/slug";
import { getSql } from "@/lib/pms/postgres-client";
import { getViewerContext } from "@/lib/auth/session";

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

  let propertyId: string;
  let userId: string;
  let organizationId: string;

  // If guardResponse exists and isn't "no property", return the error
  if (guardResponse) {
    // Only allow proceeding if it's a "no active property" error (409)
    // This happens during onboarding when workspace is set up but no property selected
    const errorBody = await guardResponse.json();
    if (errorBody.message !== "No active property selected") {
      return guardResponse;
    }

    // For onboarding: fetch viewer context and create/use a default property
    const viewer = await getViewerContext();

    if (!viewer.user || !viewer.activeMembership) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    userId = viewer.user.id;
    organizationId = viewer.activeMembership.organizationId;
    const sql = getSql();

    // Get or create a default property for this organization
    const existingProperty = await sql`
      select id from properties 
      where organization_id = ${organizationId}
      limit 1
    `.catch(() => null);

    if (existingProperty && existingProperty.length > 0) {
      propertyId = existingProperty[0].id;
    } else {
      propertyId = randomUUID();
      const propertySlug = `default-${propertyId.replace(/-/g, "").slice(0, 6)}`;

      await sql`
        insert into properties (
          id,
          organization_id,
          name,
          slug,
          timezone,
          currency
        )
        values (
          ${propertyId},
          ${organizationId},
          'My Property',
          ${propertySlug},
          'UTC',
          'USD'
        )
        on conflict do nothing
      `;
    }
  } else if (!scope) {
    return NextResponse.json({ message: "No active scope" }, { status: 409 });
  } else {
    // Normal path with valid scope
    propertyId = scope.propertyId;
    userId = scope.userId;
    organizationId = scope.organizationId;
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
        ${propertyId},
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
