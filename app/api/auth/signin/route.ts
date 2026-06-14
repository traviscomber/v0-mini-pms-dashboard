import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual authentication logic
    // For now, accept any email/password combination
    // In production, verify against database using Supabase or similar
    
    if (email && password.length >= 6) {
      return NextResponse.json(
        { 
          message: "Sign in successful",
          user: { email }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[auth/signin] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
