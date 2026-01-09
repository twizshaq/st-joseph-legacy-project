// src/types/index.ts

export type SiteCard = {
    id: number;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    category: string;
    likes_count?: number; // Added based on your component usage
};

export type Site = {
    id: number;
    name: string;
    category: string;
    description: string;
    coordinates: [number, number];
    imageUrl: string;
    colorhex: string;
};

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

export type SortOption = 'default' | 'name_asc' | 'popularity';