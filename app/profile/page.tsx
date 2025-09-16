// app/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Adjust path if needed
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            
            if (error || !data.user) {
                // If no user is logged in, redirect to the login page
                router.push('/login');
            } else {
                setUser(data.user);
            }
            setLoading(false);
        };

        fetchUser();
    }, [supabase, router]);

    // Handle logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/wack-signup');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div
                  aria-label="Loading"
                  className="animate-spin w-12 h-12 bg-blue-500 [mask-image:url('/loading-icon.png')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-image:url('/loading-icon.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
                />
            </div>
        );
    }
    
    // The username from Google is stored in user_metadata
    const userName = user?.user_metadata?.full_name || user?.email;

    return (
        <div className="min-h-screen flex items-center justify-center text-black">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome to your Profile!</h1>
                <p className="mt-4 text-xl">
                    Your username is: <span className="font-semibold text-blue-500">{userName}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  Log Out
                </button>
            </div>
        </div>
    );
}