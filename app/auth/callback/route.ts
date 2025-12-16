import { createClient } from "@/lib/supabase/server"; // Ensure you have this helper
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is passed as a param, we can use it as a fallback
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient(); // Use await for server client
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 1. Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Fetch the username from your database
        // Replace 'profiles' and 'username' with your actual table/column names
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        // 3. If username exists, redirect to /[username]
        if (profile?.username) {
            return NextResponse.redirect(`${origin}/${profile.username}`);
        }
        
        // 4. If no username (first time user?), redirect to an onboarding/profile setup page
        // You might want to force them to create a username here
        return NextResponse.redirect(`${origin}/profile`); 
      }
    }
  }

  // Fallback if login fails
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}