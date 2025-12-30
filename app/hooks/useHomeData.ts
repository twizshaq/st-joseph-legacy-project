import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Site, SiteCard, SupabaseSiteData } from '@/app/types';

export function useHomeData() {
    const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch both sets of data concurrently
                const [sitesResponse, locationsResponse] = await Promise.all([
                    supabase.from('location_pins').select('*'),
                    // Assuming 'get_random_locations' is a valid RPC you have set up
                    supabase.rpc('get_random_locations', { p_limit: 7 })
                ]);

                // 1. Process Map Sites
                if (sitesResponse.error) throw sitesResponse.error;
                
                const siteData: Site[] = sitesResponse.data.map((entry: SupabaseSiteData) => ({
                    id: entry.id,
                    name: entry.name || 'Unnamed Site',
                    category: entry.category || '',
                    description: entry.description || '',
                    coordinates: [parseFloat(entry.longitude || '0'), parseFloat(entry.latitude || '0')] as [number, number],
                    imageUrl: entry.pointimage || '',
                    colorhex: entry.colorhex || '#fff',
                })).filter((site: Site) => site.id !== null && site.coordinates.length === 2);
                
                setSites(siteData);

                // 2. Process Featured Cards
                if (locationsResponse.error) throw locationsResponse.error;
                setSiteCards(locationsResponse.data || []);

            } catch (error) {
                console.error("Failed to fetch home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return { siteCards, sites, loading };
}