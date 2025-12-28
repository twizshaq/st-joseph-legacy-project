import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Site, TripData } from '@/app/types/map';

export function useMapData() {
  const [sites, setSites] = useState<Site[]>([]);
  const [user, setUser] = useState<any>(null);
  const [likedSiteIds, setLikedSiteIds] = useState<Set<number>>(new Set());
  
  const supabase = createClient();

  // 1. Fetch User & Likes
  useEffect(() => {
    const fetchUserAndLikes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from('user_likes')
          .select('site_id')
          .eq('user_id', currentUser.id);
        
        if (data) {
          setLikedSiteIds(new Set(data.map((item: any) => item.site_id)));
        }
      } else {
        setLikedSiteIds(new Set());
      }
    };

    fetchUserAndLikes();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        // Simple re-run logic can be placed here or handled by dependencies
        if (session?.user) fetchUserAndLikes();
        else { setUser(null); setLikedSiteIds(new Set()); }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // 2. Fetch Sites
  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase.from('location_pins').select('*');
      if (!error && data) {
        const mapped: Site[] = data.map((entry: any) => ({
          id: entry.id,
          name: entry.name || 'Unnamed',
          category: entry.category || '',
          description: entry.description || '',
          coordinates: [parseFloat(entry.longitude || 0), parseFloat(entry.latitude || 0)] as [number, number],
          imageUrl: entry.pointimage || '',
          colorhex: entry.colorhex || '#fff',
          slug: entry.slug || '',
        })).filter(s => s.coordinates.length === 2 && !isNaN(s.coordinates[0]));
        setSites(mapped);
      }
    };
    fetchSites();
  }, [supabase]);

  // 3. Actions
  const toggleLike = async (siteId: number) => {
    if (!user) return alert("Please sign in.");
    const isLiked = likedSiteIds.has(siteId);

    // Optimistic Update
    setLikedSiteIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(siteId) : next.add(siteId);
      return next;
    });

    try {
      if (isLiked) {
        await supabase.from('user_likes').delete().match({ user_id: user.id, site_id: siteId });
      } else {
        await supabase.from('user_likes').insert({ user_id: user.id, site_id: siteId });
      }
    } catch (e) {
      console.error(e);
      // Revert if failed
      setLikedSiteIds(prev => {
        const next = new Set(prev);
        isLiked ? next.add(siteId) : next.delete(siteId);
        return next;
      });
    }
  };

  const saveTrip = async (tripData: TripData) => {
    if (!user) return alert("Please sign in.");
    const { error } = await supabase.from('user_trips').insert({
      user_id: user.id,
      trip_name: tripData.name,
      scheduled_at: tripData.scheduledAt,
      sites: tripData.sites 
    });
    if (error) alert("Failed to save.");
    else alert("Trip saved!");
  };

  return { sites, user, likedSiteIds, toggleLike, saveTrip };
}