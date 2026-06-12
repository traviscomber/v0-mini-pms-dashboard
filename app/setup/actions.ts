"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/auth/session";
import { slugify } from "@/lib/platform/slug";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

function appendSuffix(base: string) {
  return `${base}-${randomUUID().replace(/-/g, "").slice(0, 6)}`;
}

function buildSetupRedirect(message: string) {
  return `/setup?message=${encodeURIComponent(message)}`;
}

export async function createWorkspaceAction(formData: FormData) {
  if (!hasSupabaseAuthConfig()) {
    redirect("/");
  }

  const viewer = await getViewerContext();

  if (!viewer.user) {
    redirect("/auth/login?next=/setup");
  }

  if (!viewer.schemaReady) {
    redirect("/setup?mode=schema");
  }

  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const propertyName = String(formData.get("propertyName") ?? "").trim();
  const propertyTimezone = String(formData.get("propertyTimezone") ?? "").trim() || "UTC";
  const propertyCurrency = String(formData.get("propertyCurrency") ?? "").trim().toUpperCase() || "USD";

  if (!organizationName || !propertyName) {
    redirect(buildSetupRedirect("Organization and property names are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("bootstrap_workspace", {
    organization_name: organizationName,
    organization_slug: appendSuffix(slugify(organizationName)),
    property_currency: propertyCurrency,
    property_name: propertyName,
    property_slug: appendSuffix(slugify(propertyName)),
    property_timezone: propertyTimezone,
  });

  if (error) {
    redirect(buildSetupRedirect(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/pms?setup=done");
}
