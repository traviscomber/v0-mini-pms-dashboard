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

  // Try RPC first, fallback to SQL if RPC fails due to schema cache
  const { data: rpcData, error: rpcError } = await supabase.rpc("bootstrap_workspace", {
    organization_name: organizationName,
    organization_slug: appendSuffix(slugify(organizationName)),
    property_currency: propertyCurrency,
    property_name: propertyName,
    property_slug: appendSuffix(slugify(propertyName)),
    property_timezone: propertyTimezone,
  });

  if (rpcError && rpcError.message.includes("schema cache")) {
    // Fallback to direct SQL insert
    const orgId = randomUUID();
    const propId = randomUUID();
    const orgSlug = appendSuffix(slugify(organizationName));
    const propSlug = appendSuffix(slugify(propertyName));
    
    const { error: orgError } = await supabase
      .from("organizations")
      .insert({
        id: orgId,
        name: organizationName,
        slug: orgSlug,
      });

    if (orgError) {
      redirect(buildSetupRedirect(`Failed to create organization: ${orgError.message}`));
    }

    const { error: propError } = await supabase
      .from("properties")
      .insert({
        id: propId,
        organization_id: orgId,
        name: propertyName,
        slug: propSlug,
        currency: propertyCurrency,
        timezone: propertyTimezone,
      });

    if (propError) {
      redirect(buildSetupRedirect(`Failed to create property: ${propError.message}`));
    }

    const { error: memberError } = await supabase
      .from("memberships")
      .insert({
        id: randomUUID(),
        user_id: viewer.user.id,
        organization_id: orgId,
        role: "owner",
        is_default: true,
      });

    if (memberError) {
      redirect(buildSetupRedirect(`Failed to create membership: ${memberError.message}`));
    }
  } else if (rpcError) {
    redirect(buildSetupRedirect(rpcError.message));
  }

  revalidatePath("/", "layout");
  redirect("/pms?setup=done");
}
