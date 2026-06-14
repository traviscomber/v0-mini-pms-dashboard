import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseBrowserConfig, hasSupabaseAuthConfig } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseAuthConfig()) {
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });

  const { url, publishableKey } = getSupabaseBrowserConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Avoid calling getClaims() as it can cause ReadableStream locked errors in Next.js 16
  // Session validation happens in components via getUser()
  
  return response;
}

