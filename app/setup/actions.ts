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

  // Always use direct SQL insert with created_by and user_id
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
      created_by: viewer.user.id,
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
      user_id: viewer.user.id,
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

  revalidatePath("/", "layout");
  redirect("/pms?setup=done");
}
