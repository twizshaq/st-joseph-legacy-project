export type ProfileTab = "All" | "Tours" | "Badges" | "Media";

export interface ActivityItem {
  type: "rank" | "visit" | "upload";
  title: string;
  subtitle?: string;
  points: number;
  images?: string[];
}

export interface ActivitySection {
  label: string;
  items: ActivityItem[];
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  is_private: boolean;
}

export interface TourItem {
  id: number;
  title: string;
  date: string;
  image: string;
  status: "Upcoming" | "Active" | "Completed";
  type: "Upcoming" | "Self-Guided" | "Custom";
}

export interface BadgeItem {
  id: number;
  name: string;
  icon: string;
  imageUrl?: string;
  desc: string;
  unlocked: boolean;
  date?: string;
}
