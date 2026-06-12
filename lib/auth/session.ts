import { cache } from "react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

interface MembershipRow {
  organization_id: string;
  role: string;
  is_default: boolean;
}

interface OrganizationRow {
  id: string;
  name: string;
  slug: string;
}

interface PropertyRow {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  timezone: string;
  currency: string;
}

interface ProfileRow {
  full_name: string | null;
}

export interface ViewerUser {
  id: string;
  email: string;
  displayName: string;
}

export interface ViewerMembership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
}

export interface ViewerProperty {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  timezone: string;
  currency: string;
}

export interface ViewerContext {
  activeMembership: ViewerMembership | null;
  activeProperty: ViewerProperty | null;
  authEnabled: boolean;
  needsSetup: boolean;
  properties: ViewerProperty[];
  schemaReady: boolean;
  user: ViewerUser | null;
}

function sanitizeInternalPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function isSchemaError(message?: string) {
  return Boolean(message && message.includes("relation") && message.includes("does not exist"));
}

function createLoggedOutContext(): ViewerContext {
  return {
    activeMembership: null,
    activeProperty: null,
    authEnabled: true,
    needsSetup: false,
    properties: [],
    schemaReady: true,
    user: null,
  };
}

function createDemoContext(): ViewerContext {
  return {
    activeMembership: null,
    activeProperty: null,
    authEnabled: false,
    needsSetup: false,
    properties: [],
    schemaReady: false,
    user: null,
  };
}

function createSchemaPendingContext(user: ViewerUser): ViewerContext {
  return {
    activeMembership: null,
    activeProperty: null,
    authEnabled: true,
    needsSetup: false,
    properties: [],
    schemaReady: false,
    user,
  };
}

function createViewerUser(user: { id: string; email?: string | null; user_metadata?: { full_name?: unknown } }, fullName?: string | null) {
  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      (typeof fullName === "string" && fullName.trim()) ||
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
      user.email ||
      "Hospitality user",
  };
}

export const getViewerContext = cache(async (): Promise<ViewerContext> => {
  if (!hasSupabaseAuthConfig()) {
    return createDemoContext();
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = typeof claimsData?.claims?.sub === "string" ? claimsData.claims.sub : null;

  if (claimsError || !userId) {
    return createLoggedOutContext();
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return createLoggedOutContext();
  }

  const profileResult = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const membershipResult = await supabase
    .from("memberships")
    .select("organization_id, role, is_default")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  const profile = (profileResult.data ?? null) as ProfileRow | null;
  const viewerUser = createViewerUser(userData.user, profile?.full_name);

  if (isSchemaError(profileResult.error?.message) || isSchemaError(membershipResult.error?.message)) {
    return createSchemaPendingContext(viewerUser);
  }

  if (profileResult.error || membershipResult.error) {
    return createSchemaPendingContext(viewerUser);
  }

  const memberships = (membershipResult.data ?? []) as MembershipRow[];

  if (memberships.length === 0) {
    return {
      activeMembership: null,
      activeProperty: null,
      authEnabled: true,
      needsSetup: true,
      properties: [],
      schemaReady: true,
      user: viewerUser,
    };
  }

  const organizationIds = [...new Set(memberships.map((membership) => membership.organization_id))];

  const [organizationResult, propertyResult] = await Promise.all([
    supabase.from("organizations").select("id, name, slug").in("id", organizationIds),
    supabase
      .from("properties")
      .select("id, organization_id, name, slug, timezone, currency")
      .in("organization_id", organizationIds)
      .order("name", { ascending: true }),
  ]);

  if (isSchemaError(organizationResult.error?.message) || isSchemaError(propertyResult.error?.message)) {
    return createSchemaPendingContext(viewerUser);
  }

  if (organizationResult.error || propertyResult.error) {
    return createSchemaPendingContext(viewerUser);
  }

  const organizations = (organizationResult.data ?? []) as OrganizationRow[];
  const properties = ((propertyResult.data ?? []) as PropertyRow[]).map((property) => ({
    currency: property.currency,
    id: property.id,
    name: property.name,
    organizationId: property.organization_id,
    slug: property.slug,
    timezone: property.timezone,
  }));

  const activeMembershipRow = memberships.find((membership) => membership.is_default) ?? memberships[0];
  const activeOrganization = organizations.find((organization) => organization.id === activeMembershipRow.organization_id);

  return {
    activeMembership: activeOrganization
      ? {
          organizationId: activeOrganization.id,
          organizationName: activeOrganization.name,
          organizationSlug: activeOrganization.slug,
          role: activeMembershipRow.role,
        }
      : null,
    activeProperty: properties.find((property) => property.organizationId === activeMembershipRow.organization_id) ?? null,
    authEnabled: true,
    needsSetup: false,
    properties,
    schemaReady: true,
    user: viewerUser,
  };
});

export async function requireAppViewer(pathname: string) {
  const viewer = await getViewerContext();

  if (!viewer.authEnabled) {
    return viewer;
  }

  if (!viewer.user) {
    redirect(`/auth/login?next=${encodeURIComponent(sanitizeInternalPath(pathname))}`);
  }

  if (!viewer.schemaReady) {
    redirect("/setup?mode=schema");
  }

  if (viewer.needsSetup) {
    redirect("/setup");
  }

  return viewer;
}

export async function getRouteGuard() {
  const viewer = await getViewerContext();

  return {
    authEnabled: viewer.authEnabled,
    isReady: viewer.schemaReady && !viewer.needsSetup,
    userId: viewer.user?.id ?? null,
  };
}
