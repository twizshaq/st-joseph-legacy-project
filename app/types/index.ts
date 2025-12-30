// src/types/index.ts

// This is the "blueprint" for the card data
export type SiteCard = {
    id: number;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    category: string;
};

// This is the "blueprint" for the full site data (for the map)
export type Site = {
    id: number;
    name: string;
    category: string;
    description: string;
    coordinates: [number, number];
    imageUrl: string;
    colorhex: string;
};

// This helps us understand what Supabase returns from the database
export interface SupabaseSiteData {
    id: number;
    name: string | null;
    category: string | null;
    description: string | null;
    longitude: string | null;
    latitude: string | null;
    pointimage: string | null;
    colorhex: string | null;
}