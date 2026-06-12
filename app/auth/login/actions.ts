"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAppUrl } from "@/lib/platform/url";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

function sanitizeNextPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function buildRedirect(pathname: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export async function signInAction(formData: FormData) {
  if (!hasSupabaseAuthConfig()) {
    redirect(buildRedirect("/auth/login", { message: "Supabase auth is not configured yet." }));
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = sanitizeNextPath(String(formData.get("next") ?? "/"));

  if (!email || !password) {
    redirect(buildRedirect("/auth/login", { message: "Email and password are required.", next }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(buildRedirect("/auth/login", { message: error.message, next }));
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  if (!hasSupabaseAuthConfig()) {
    redirect(buildRedirect("/auth/login", { message: "Supabase auth is not configured yet." }));
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    redirect(buildRedirect("/auth/login", { message: "Full name, email, and password are required." }));
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${await getAppUrl()}/auth/callback?next=/setup`,
    },
  });

  if (error) {
    redirect(buildRedirect("/auth/login", { message: error.message }));
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/setup");
  }

  redirect(
    buildRedirect("/auth/login", {
      message: "Account created. Check your email to confirm access, then continue with setup.",
    }),
  );
}
