'use client';

import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';
import { Tour } from "@/app/types/tours";
import { Session } from "@supabase/supabase-js";

export function useTourPage() {
  const supabase = createClient();
  
  // Data State
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [guestCount, setGuestCount] = useState(1);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);

  // Auth Subscription
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
    };
    initSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUserSession(session)
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Fetch Tours
  useEffect(() => {
    const loadTours = async () => {
      try {
        const { data } = await supabase
          .from('tours')
          .select('*, stops(*), images(*), reviews(*)');
          
        if (data) {
          setTours(data);
          if (data.length > 0) setSelectedTour(data[0]);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, [supabase]);

  // Reset guests when tour changes
  useEffect(() => {
    setGuestCount(1);
  }, [selectedTour]);

  return {
    tours,
    selectedTour,
    setSelectedTour,
    userSession,
    isLoading,
    guestCount,
    setGuestCount,
    isSelectorOpen,
    setIsSelectorOpen,
    isStopsModalOpen,
    setIsStopsModalOpen
  };
}