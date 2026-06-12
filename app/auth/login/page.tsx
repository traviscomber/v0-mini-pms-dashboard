// v3
import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/auth/session";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

import { signInAction, signUpAction } from "@/app/auth/login/actions";
import { LoginShell } from "@/app/auth/login/login-shell";

interface LoginPageProps {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
}

function sanitizeNextPath(path?: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  return path;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = sanitizeNextPath(params.next);
  const viewer = await getViewerContext();

  if (viewer.authEnabled && viewer.user) {
    redirect(viewer.needsSetup || !viewer.schemaReady ? "/setup" : next);
  }

  return (
    <LoginShell
      next={next}
      message={params.message}
      supabaseReady={hasSupabaseAuthConfig()}
      signInAction={signInAction}
      signUpAction={signUpAction}
    />
  );
}
