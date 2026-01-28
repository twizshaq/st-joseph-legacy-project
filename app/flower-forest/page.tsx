"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

// 1. Hooks & Types
import { useSiteData } from '@/app/hooks/useSiteData';
import { SiteContent } from '@/app/types/site';

// 2. Widget Components
import { SiteSafety } from '@/app/components/site/SiteSafety';
import { SiteFacts } from '@/app/components/site/SiteFacts';
import { SiteQuiz } from '@/app/components/site/SiteQuiz';

// 3. Shared Components
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { GalleryModal } from "@/app/components/site/GalleryModal";
import Footer from "@/app/components/FooterModal";
import { ReviewsSection } from '@/app/components/site/ReviewsSection';
import { LocalStories } from '@/app/components/site/LocalStories';
import { ReviewSkeleton } from "@/app/components/ReviewSkeleton";
import { NearbySection } from '@/app/components/site/NearbySection';

import { SiteCardSkeleton } from "@/app/components/SiteCardSkeleton";
import { WaveformAudioPlayer } from "@/app/components/site/CustomAudioPlayer";
import { ReportModal } from "@/app/components/ReportModal";
import { HeroSection } from '@/app/components/site/HeroSection';
import { InfoSection } from '@/app/components/site/InfoSection';
import { GalleryFan } from '@/app/components/site/GalleryFan';

// 1. Define Static Data (Or fetch this from a CMS/DB in a Server Component if using App Router)
const FLOWER_FOREST_DATA: SiteContent = {
  id: 2,
  name: "Flower Forest Botanical Gardens",
  tagline: "A surfer’s paradise on the rugged east coast.",
  description: "Known worldwide for its powerful reef breaks...",

  sections: [
    {
      title: "Roots and Routes",
      content:<><div className='mb-[15px] font-[700] text-[1.2rem] max-sm:text-[1.1rem]'>Explore the history and heritage of the Soup Bowl.</div> In Barbados, we say: &quot;The sea ain&apos;t got no back door.&quot; This reflects a deep-seated respect for the Atlantic&apos;s power. At Soup Bowl, you don&apos;t conquer the ocean; you just hope she lets you dance.</>
    },
    {
      title: "Sixty Seconds of Secrets",
      content:<><strong>Soup Bowl</strong> is located in the community of Cleavers Hill in Bathsheba is widely considered the crown jewel of Caribbean surfing. It offers a dramatic contrast to the calm, white-sand beaches of the West Coast, characterized instead by raw Atlantic power and prehistoric-looking rock formations.</>
    },
    {
      title: "Surf Conditions and Significance",
      content:<>The Soup Bowl&apos;s reputation is built on its unique geological structure and exposure to the Atlantic.
        <ul className="list-disc pl-5 space-y-3 mt-[15px]">
          <li>
            <strong>World-Class Break:</strong> The wave breaks over a <strong>shallow coral reef</strong>, creating a consistent, heavy, and fast right-hand reef break. This setup produces hollow, barrel-shaped waves that are both exhilarating and highly demanding.
          </li>

          <li>
            <strong>Consistency:</strong> Unlike many surf spots that rely on specific tropical systems, the Soup Bowl catches nearly every northerly and easterly swell generated in the North Atlantic, making it one of the most consistent surf zones in the Caribbean.
          </li>

          <li>
            <strong>Global Recognition:</strong> The site regularly hosts international competitions, notably part of the World Surf League (WSL) Qualifying Series, solidifying its status as a premier global surfing destination. Eleven-time world champion Kelly Slater has frequently praised the quality of the waves here.
          </li>
        </ul>
      </>
    },
  ],
  safety: {
    heading: "Harmony with the Elements",
    subheading: "Your guide to staying safe and respecting the landscape.",
    description: "East coast seas are unpredictable. Avoid swimming during high swells. Monitor weather advisories.",
    guidelines: [
       "Use designated zones for photography.",
       "Park away from soft shoulders."
    ],
    emergencyNumbers: (
       <>• 211 Police <br /> • 511 Ambulance <br /> • 311 Fire</>
    )
  },

  heroMedia: {
    video: "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4",
    image: "https://i.pinimg.com/736x/ac/c5/16/acc5165e07eba2b8db85c8a7bcb2eda6.jpg",
    photo360: "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/Andromeda_20250920_110344_00_008.jpg"
  },
  gallery: [
  { type: 'image', src: 'https://i.pinimg.com/736x/ac/c5/16/acc5165e07eba2b8db85c8a7bcb2eda6.jpg' }, // 0
  { type: 'video', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4' }, // 1
  { type: '360', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/Andromeda_20250920_110344_00_008.jpg' }, // 2
  { type: 'image', src: 'https://i.pinimg.com/736x/8f/bb/62/8fbb625e1c77a0d60ab0477d0551b000.jpg' }, // 3
  { type: 'image', src: 'https://i.pinimg.com/736x/e8/61/55/e86155c8a8e27a4eed5df56b1b0f915f.jpg' }, // 4
  { type: 'image', src: 'https://i.pinimg.com/736x/b2/1a/4e/b21a4edd98d5deeae826a459aeeb1b26.jpg' }, // 5
  { type: 'image', src: 'https://i.pinimg.com/736x/a5/71/41/a57141ad568104a6b1e49acedddd1eca.jpg' }, // 6
  { type: 'image', src: 'https://i.pinimg.com/736x/d8/51/26/d85126e7178f37e0f8cb5a73d495707d.jpg' }, // 7
  { type: 'image', src: 'https://i.pinimg.com/736x/3f/82/ac/3f82ac4cde04c3143ed4f2580d64820c.jpg' }, // 8
  { type: 'image', src: 'https://i.pinimg.com/736x/4c/20/00/4c20006b09ffc0b4f31278d3009f7390.jpg' }, // 9
  { type: 'image', src: 'https://i.pinimg.com/736x/ee/f1/ed/eef1ed5ee44a821046bcd209a3e1fbcc.jpg' }, // 10
],
  stories: {
    title: "Local Stories",
    tagline: "Listen, Watch, Discover",
    items: [
      {
        id: 1,
        type: 'audio',
        title: "Local Legend",
        src: "/data/cat-meow-9-fx-306185.mp3",
        caption: "A 2-minute history of the first surfers here."
      },
    ],
  },
  facts: {
    Category: "World-Class Surf Break & Natural Wonder", // Note: \n works because we added whitespace-pre-line in the CSS
    Best_For: "Surfing, Spectating, Photography, and Coastal Wandering.",
    Amenities: "Small local rum shops and restaurants are nearby. Public restrooms are available at the Bathsheba Park facility and Hillcrest.",
    Accessibility: "The main viewing areas and Bathsheba Park are accessible via paved roads. However, reaching the water's edge requires navigating uneven, often slippery rock and sand.",
    Nearby_Must_See: "Andromeda Botanical Gardens and the Hillcrest",
  },
  location: {
    lat: 13.214743,
    lng: -59.523950
  },
};

export default function SoupBowlPage() {
  // 2. Data Fetching (Reviews/Auth/User)
  const {
    user,
    reviews,
    nearbySites,
    loadingReviews,
    loadingSites,
    fetchReviews,
    supabase
  } = useSiteData(
    FLOWER_FOREST_DATA.id,
    FLOWER_FOREST_DATA.location.lat,
    FLOWER_FOREST_DATA.location.lng
  );

  // 3. Render
  return (
    <main className='flex flex-col min-h-screen text-black items-center overflow-x-hidden'>

      <HeroSection content={FLOWER_FOREST_DATA} />

      {/* Decorative Separator */}
      <div className='bg-gray-300 w-full max-w-[80vw] h-[2px] mt-20 mx-auto rounded-full' />

      <SiteFacts facts={FLOWER_FOREST_DATA.facts}/>

      <InfoSection
        sections={FLOWER_FOREST_DATA.sections}
        sidebarSlot={
          <>
            <SiteSafety data={FLOWER_FOREST_DATA.safety}/>
            {FLOWER_FOREST_DATA.stories && (
              <LocalStories data={FLOWER_FOREST_DATA.stories} />
            )}
            <SiteQuiz user={user} siteId={FLOWER_FOREST_DATA.id} />
          </>
        }
      />

      {/* <LocalStories stories={FLOWER_FOREST_DATA.stories} /> */}

      <GalleryFan items={FLOWER_FOREST_DATA.gallery} />

      <ReviewsSection
        user={user}
        reviews={reviews}
        loading={loadingReviews}
        onRefresh={fetchReviews}
        supabase={supabase}
        siteId={FLOWER_FOREST_DATA.id}
      />

      <NearbySection
        sites={nearbySites}
        loading={loadingSites}
      />

      <Footer />
    </main>
  );
}
