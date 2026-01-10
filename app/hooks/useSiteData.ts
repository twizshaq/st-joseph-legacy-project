import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useSiteData(siteId: number, currentLat: number, currentLng: number) {
  const supabase = createClient();
  
  // 1. State Definitions
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [nearbySites, setNearbySites] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingSites, setLoadingSites] = useState(true);

  // 2. Auth Logic
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // 3. DEFINE fetchReviews (This was missing or misplaced)
  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    const { data } = await supabase
      .from('site_reviews')
      .select('*, profiles(username, avatar_url)')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
      
    setReviews(data || []);
    setLoadingReviews(false);
  }, [supabase, siteId]);

  // 4. Trigger fetchReviews on mount
  useEffect(() => { 
    fetchReviews(); 
  }, [fetchReviews]);

  // 5. Fetch Nearby Logic (With Dynamic Coordinates)
  useEffect(() => {
    const fetchNearby = async () => {
      // Return early if no coordinates provided to prevent errors
      if (!currentLat || !currentLng) return;

      setLoadingSites(true);

      const { data } = await supabase.from('location_pins').select('*').neq('id', siteId);

      if (data) {
        const sorted = data
          .filter((s) => s.latitude && s.longitude)
          .map((s) => {
            const R = 6371; // Earth radius in km
            const dLat = (s.latitude - currentLat) * (Math.PI / 180);
            const dLon = (s.longitude - currentLng) * (Math.PI / 180);
            const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(currentLat*Math.PI/180) * Math.cos(s.latitude*Math.PI/180) * Math.sin(dLon/2)*Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return {
              ...s,
              distance: R * c,
              image_url: s.pointimage,
              slug: s.slug || '#'
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);
        setNearbySites(sorted);
      }
      setLoadingSites(false);
    };
    fetchNearby();
  }, [supabase, siteId, currentLat, currentLng]);

  // 6. Return everything
  return { 
    user, 
    reviews, 
    nearbySites, 
    loadingReviews, 
    loadingSites, 
    fetchReviews, // Now this exists!
    supabase 
  };
}