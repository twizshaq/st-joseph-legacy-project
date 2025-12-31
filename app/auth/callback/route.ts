import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default to /profile or / if no "next" param is provided
  const next = searchParams.get("next") ?? "/profile";

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // SUCCESS: The session is now active.
      // We redirect to the target page. 
      // The browser will receive the 'sb-access-token' cookie automatically.
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Auth Callback Error:", error.message);
    }
  }

  // Fallback if login fails or no code is present
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}