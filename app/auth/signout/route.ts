import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  if (hasSupabaseAuthConfig()) {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();

    if (claimsData?.claims) {
      await supabase.auth.signOut();
    }
  }

  revalidatePath("/", "layout");

  return NextResponse.redirect(new URL("/auth/login", request.url), {
    status: 302,
  });
}
