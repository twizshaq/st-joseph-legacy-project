// types/site.ts
import { ReactNode } from 'react';

export type MediaType = 'video' | 'image' | '360';
export type StoryType = 'audio' | 'video' | 'image';

export interface GalleryItem {
  type: MediaType;
  src: string;
  thumbnail?: string; // Optional optimization
}

export interface Story {
  id: string | number;   // Required for key={story.id}
  type: StoryType;       // Required for switch(story.type)
  title: string;
  src: string;
  caption?: string;      // Optional (?) means it can be undefined
  thumbnail?: string;    // Optional, mainly for video posters
}

export interface SiteFactsData {
  Category: ReactNode;
  Best_For: ReactNode;
  Amenities: ReactNode;
  Accessibility: ReactNode;
  Nearby_Must_See: ReactNode;
}

export interface SiteContent {
  id: number;
  name: string;
  tagline: string;
  description: string;
  Roots_and_Routes: ReactNode; 
  sixty_Seconds_of_Secrets: ReactNode;
  heroMedia: {
    video: string;
    image: string;
    photo360: string;
  };
  gallery: GalleryItem[];
  stories: Story[];
  facts: SiteFactsData;
}