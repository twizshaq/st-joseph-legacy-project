import { Lightbulb, Code2, Award, LucideIcon } from 'lucide-react';

// --- Types ---
export interface TeamMember {
  name: string;
  role: string;
}

export interface Sponsor {
  name: string;
  role: string;
  description: string;
}

// --- Data ---

export const digitalArchitects: string[] = [
  "Shaquon Hamilton",
  "Lamar Cox",
  "Akeem Smith",
  "Joshua Blackman",
  "Sonique Jordan-Alleyne",
  "Chesney Stay"
];

export const platinumSponsors: Sponsor[] = [
  {
    name: "Department of Emergency Management (DEM)",
    role: "Core oversight and support",
    description: "Ensuring our community aligns with national safety standards."
  },
  {
    name: "UWI DRRC",
    role: "Grant Provider",
    description: "Providing the essential grant that made this website build possible."
  },
  {
    name: "MarNiko",
    role: "Visual Media",
    description: "The creative eye behind our initial videos and photography."
  }
];
