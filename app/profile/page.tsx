import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfileRedirectPage() {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If not logged in, send to home (to open login modal) or login page
    redirect("/");
  }

  // 2. Fetch the username for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // 3. Redirect to their dynamic profile page
  if (profile?.username) {
    redirect(`/${profile.username}`);
  }

  // Fallback if they are logged in but have no username
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Error: User profile not found.</p>
    </div>
  );
}