export interface Stop {
  id: string; // or number depending on DB
  name: string;
  description: string;
}

export interface TourImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Review {
  id: string;
  user: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles?: {            // Fixes: Property 'profiles' does not exist
    username: string;
    avatar_url: string;
  };
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number; // in hours
  local_price: number;
  visitor_price: number;
  tour_image_url?: string;
  stops: Stop[];
  images: TourImage[];
  reviews: Review[];
}