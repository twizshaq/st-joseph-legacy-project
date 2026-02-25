'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/app/types'; // Importing from your global types

export const useNavbarProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            if (profileData) setProfile(profileData);
          }
          setIsLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            router.refresh();
          } else if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            if (profileData) setProfile(profileData);
          }
          setIsLoading(false);
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth setup error:", err);
        if (mounted) setIsLoading(false);
      }
    };

    setupAuth();
    return () => { mounted = false; };
  }, [supabase, router, fetchProfile]);

  // Listen for updates from other components (like SettingsModal)
  useEffect(() => {
    if (!user) return;
    const handleUpdateEvent = () => {
      setTimeout(async () => {
        const data = await fetchProfile(user.id);
        if (data) setProfile(data);
      }, 500);
    };
    window.addEventListener('profile-updated', handleUpdateEvent);
    return () => window.removeEventListener('profile-updated', handleUpdateEvent);
  }, [user, fetchProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    router.refresh();
  };

  return { user, profile, isLoading, handleLogout };
};