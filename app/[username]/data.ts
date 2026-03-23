import type { ActivitySection, BadgeItem, TourItem } from "./types";

export const mediaData = [
  "https://i.pinimg.com/736x/8f/bb/62/8fbb625e1c77a0d60ab0477d0551b000.jpg",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=800&auto=format&fit=crop",
  "https://i.pinimg.com/1200x/24/b4/f7/24b4f73760970fb2b35dbeb6f2aed0a0.jpg",
  "https://i.pinimg.com/736x/e8/61/55/e86155c8a8e27a4eed5df56b1b0f915f.jpg",
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop",
  "https://i.pinimg.com/736x/3f/82/ac/3f82ac4cde04c3143ed4f2580d64820c.jpg",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
];

export const activityData: ActivitySection[] = [
  {
    label: "Today",
    items: [
      { type: "visit", title: "Visited All Sites", subtitle: 'Unlocked the "Island Explorer" badge', points: 250 },
      { type: "visit", title: "Visited Bathsheba", subtitle: 'Unlocked the "Wave Master" badge', points: 250 },
      { type: "upload", title: "Uploaded 10 items", points: 250, images: mediaData.slice(0, 6) },
    ],
  },
  {
    label: "Yesterday",
    items: [{ type: "rank", title: "Ranked up to #52", subtitle: "Moved up 10 positions on the leaderboard", points: 250 }],
  },
];

export const toursData: TourItem[] = [
  { id: 1, title: "The Gardens of St. Joseph Circuit", date: "February 15, 2024", image: "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg", status: "Completed", type: "Self-Guided" },
  { id: 2, title: "Cliffs, Coastlines, & Canopies", date: "February 15, 2024", image: "https://i.pinimg.com/1200x/bb/a9/bc/bba9bc4cc096c07d70075dcb03bae5ca.jpg", status: "Active", type: "Custom" },
  { id: 3, title: "Cliffs, Coastlines, & Canopies", date: "February 15, 2024", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", status: "Completed", type: "Self-Guided" },
];

export const badgesData: BadgeItem[] = [];

export const visibleBadges = badgesData.filter((badge) => badge.unlocked);
