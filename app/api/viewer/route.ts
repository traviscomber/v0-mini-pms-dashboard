import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = await getViewerContext();

  if (!viewer.user) {
    return NextResponse.json({ user: null, activeProperty: null }, { status: 200 });
  }

  return NextResponse.json({
    activeProperty: viewer.activeProperty
      ? { id: viewer.activeProperty.id, name: viewer.activeProperty.name }
      : null,
    user: { id: viewer.user.id, email: viewer.user.email, displayName: viewer.user.displayName },
  });
}
