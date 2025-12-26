export interface TourImage {
  id: string;
  url: string;
}

export interface Stop {
  id: string;
  name: string;
  description: string;
}

export interface Review {
  id: number; // Changed to number to match database typically
  user_id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  tour_image_url: string;
  stops: Stop[];
  images: TourImage[];
}