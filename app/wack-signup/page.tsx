// app/page.js or wherever your component is located
"use client"; // This is a client component

import Image from "next/image";
import GoogleIcon from "@/public/icons/google-icon.svg";
import { createClient } from "@/lib/supabase/client"; // Adjust path if needed

export default function Page() {
    // Create a Supabase client instance
    const supabase = createClient();

    const handleGoogleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // This tells Supabase where to redirect the user after they are authenticated
                redirectTo: `${location.origin}/profile`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error.message);
        }
    };

    return (
        <div className="min-h-[100dvh] flex justify-center items-center">
            <button
                onClick={handleGoogleSignIn} // Attach the handler here
                className="cursor-pointer bg-black/30 py-[10px] px-[20px] rounded-full flex flex-row font-bold gap-[10px] items-center shadow-[0_0px_30px_rgba(0,0,0,0.2)] text-shadow-[0_0px_30px_rgba(0,0,0,0.1)] border-white border-[2px] hover:bg-black/50 transition-colors"
            >
                <Image src={GoogleIcon} alt="Google Icon" height={30} />
                Sign in with Google
            </button>
        </div>
    );
}