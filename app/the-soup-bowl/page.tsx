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
const SOUP_BOWL_DATA: SiteContent = {
  id: 1,
  name: "Soup Bowl",
  tagline: "A surfer’s paradise on the rugged east coast.",
  description: "Known worldwide for its powerful reef breaks...",
  Roots_and_Routes: <>There is a deep-seated respect in Barbados for the ocean. As the locals say: The sea ain&apos;t got no back door. This reflects the Bajan philosophy of respecting nature&apos;s power, such power is seen at the Soup Bowl. You don&apos;t conquer the Soup Bowl; you just hope she lets you dance for a moment. <br /> <br /> The name &quot;Soup Bowl&quot; comes from the foamy, churning white water that fills the bay after a wave breaks, resembling a bowl of bubbling soup. Historically, this area was the playground of the Barbados Railway, where passengers would disembark to witness the raw power of the Atlantic. Today, it is a global surfing pilgrimage site, famously cited by 11-time world champion Kelly Slater as one of his top three favorite waves in the world.</>,
  sixty_Seconds_of_Secrets: <>The Soup Bowl isn&apos;t just a surf spot; it&apos;s a geological masterpiece. Those massive boulders sitting in the surf are limestone caprock that broke off the cliffs thousands of years ago. They act as natural &quot;pinnacles&quot; that help shape the incoming swells into the perfect, hollow barrels that photographers travel thousands of miles to capture.</>,
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
  stories: [
     { 
       id: 1, 
       type: 'audio', 
       title: "Local Legend", 
       src: "/data/cat-meow-9-fx-306185.mp3",
       caption: "A 2-minute history of the first surfers here." // Optional text
     },
  ],
  facts: {
    Category: "World-Class Surf Break & Natural Wonder", // Note: \n works because we added whitespace-pre-line in the CSS
    Best_For: "Surfing, Spectating, Photography, and Coastal Wandering.",
    Amenities: "Small local rum shops and restaurants are nearby. Public restrooms are available at the Bathsheba Park facility and Hillcrest.",
    Accessibility: "The main viewing areas and Bathsheba Park are accessible via paved roads. However, reaching the water's edge requires navigating uneven, often slippery rock and sand.",
    Nearby_Must_See: "Andromeda Botanical Gardens and the Hillcrest",
  }
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
  } = useSiteData(SOUP_BOWL_DATA.id);

  // 3. Render
  return (
    <main className='flex flex-col min-h-screen text-black items-center overflow-x-hidden'>
      
      <HeroSection content={SOUP_BOWL_DATA} />

      {/* Decorative Separator */}
      <div className='bg-gray-300 w-full max-w-[80vw] h-[2px] mt-20 mx-auto rounded-full' />

      <SiteFacts facts={SOUP_BOWL_DATA.facts}/>

      <InfoSection 
        Roots_and_Routes={SOUP_BOWL_DATA.Roots_and_Routes}
        sixty_Seconds_of_Secrets={SOUP_BOWL_DATA.sixty_Seconds_of_Secrets}
        sidebarSlot={
          <>
            <SiteSafety />
            <SiteQuiz user={user} siteId={SOUP_BOWL_DATA.id} />
            <LocalStories stories={SOUP_BOWL_DATA.stories} />
          </>
        }
      />

      {/* <LocalStories stories={SOUP_BOWL_DATA.stories} /> */}

      <GalleryFan items={SOUP_BOWL_DATA.gallery} />

      <ReviewsSection 
        user={user}
        reviews={reviews}
        loading={loadingReviews}
        onRefresh={fetchReviews}
        supabase={supabase}
        siteId={SOUP_BOWL_DATA.id}
      />

      <NearbySection 
        sites={nearbySites}
        loading={loadingSites}
      />

      <Footer />
    </main>
  );
}