// src/hooks/useSitesData.ts
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SiteCard } from '@/app/types';

export const useSitesData = () => {
  const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchSiteCards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setSiteCards((data as SiteCard[]) || []);
      } catch (error) {
        console.error("Failed to fetch site cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteCards();
  }, []);

  return { siteCards, loading };
};