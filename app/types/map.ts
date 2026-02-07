export type Zoomable = { zoomIn: () => void; zoomOut: () => void };

export type Site = {
  id: number;
  name: string;
  category: string;
  description: string;
  coordinates: [number, number];
  imageUrl: string;
  colorhex: string;
  slug: string;
};

// Types needed for TripPlanner
export type TripSite = {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
  imageUrl?: string;
};

export type TripData = {
  name: string;
  scheduledAt: string;
  sites: TripSite[];
};
