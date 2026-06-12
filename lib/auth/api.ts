import { NextResponse } from "next/server";

import type { PmsScope } from "@/lib/pms/types";
import { getViewerContext } from "@/lib/auth/session";

export async function guardPmsApi() {
  const viewer = await getViewerContext();

  if (!viewer.authEnabled) {
    return {
      response: null,
      scope: null,
    };
  }

  if (!viewer.user) {
    return {
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      scope: null,
    };
  }

  if (!viewer.schemaReady || viewer.needsSetup) {
    return {
      response: NextResponse.json({ message: "Workspace setup required" }, { status: 403 }),
      scope: null,
    };
  }

  if (!viewer.activeMembership || !viewer.activeProperty) {
    return {
      response: NextResponse.json({ message: "No active property selected" }, { status: 409 }),
      scope: null,
    };
  }

  const scope: PmsScope = {
    organizationId: viewer.activeMembership.organizationId,
    propertyId: viewer.activeProperty.id,
    userId: viewer.user.id,
  };

  return {
    response: null,
    scope,
  };
}
