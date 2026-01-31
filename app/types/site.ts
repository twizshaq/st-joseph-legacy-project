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
  caption?: ReactNode;      // Optional (?) means it can be undefined
  thumbnail?: string;    // Optional, mainly for video posters
}

export interface LocalStoriesData {
  title: string;
  tagline: string;
  items: Story[];
}

export interface SafetyInfo {
  heading: string;      // e.g., "Disaster Ready"
  subheading: string;   // e.g., "Safety Guidelines"
  description: ReactNode;  // Main paragraph text
  guidelines: ReactNode; // Array of strings for the bullet points
  emergencyNumbers: ReactNode; // ReactNode allows for <br/> tags
}

export interface SiteFactsData {
  Category: ReactNode;
  Best_For: ReactNode;
  Amenities: ReactNode;
  Accessibility: ReactNode;
  Nearby_Must_See: ReactNode;
}

export interface ContentSection {
  title: string;
  content: ReactNode;
}

export interface SiteContent {
  id: number;
  name: string;
  tagline: string;
  description: string;
  sections: ContentSection[];
  heroMedia: {
    video: string;
    image: string;
    photo360: string;
  };
  gallery: GalleryItem[];
  stories?: LocalStoriesData;
  facts: SiteFactsData;
  safety: SafetyInfo;
  location: {
    lat: number;
    lng: number;
  }
}
