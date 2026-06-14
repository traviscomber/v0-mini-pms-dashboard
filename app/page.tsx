import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/auth/session";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

import { signInAction, signUpAction } from "@/app/auth/login/actions";
import { LoginShell } from "@/app/auth/login/login-shell";

export default async function RootPage() {
  const viewer = await getViewerContext();

  // If already logged in, redirect straight to the PMS dashboard
  if (viewer.authEnabled && viewer.user) {
    redirect(viewer.needsSetup || !viewer.schemaReady ? "/setup" : "/pms");
  }

  // Show the landing page — on sign in, redirect to /pms
  return (
    <LoginShell
      next="/pms"
      supabaseReady={hasSupabaseAuthConfig()}
      signInAction={signInAction}
      signUpAction={signUpAction}
    />
  );
}
