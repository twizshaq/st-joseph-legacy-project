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
const HIGHLAND_POTTERY_DATA: SiteContent = {
    id: 15,
    name: "Highland Pottery (Chalky Mount)",
    tagline: "Tent Bay is a working fishing village that retains an old-world charm. A small, active Fish Market, and if you are lucky, you may see the day&apos;s catch coming in.",
    description: "Known worldwide for its powerful reef breaks...",

    sections: [
        {
            title: "Roots and Routes",
            content:
                <>
                    <div className='mb-[15px] font-[700] text-[1.2rem] max-sm:text-[1.1rem]'>Explore the history and heritage of Chalky Mount.
                    </div> In Barbados, we say: &quot;The sea ain&apos;t got no back door.&quot; This reflects a deep-seated respect for the Atlantic&apos;s power. At Soup Bowl, you don&apos;t conquer the ocean; you just hope she lets you dance.
                </>
        },
        {
            title: "⏱️ 60 Seconds of Secrets",
            content: <><b>Chalky Mount</b> is the &quot;backbone&quot; of the Scotland District, a region geologically distinct from the rest of Barbados. While 85% of the island is covered in coral limestone, Chalky Mount is a rare exposure of the accretionary prism—sediment scraped from the ocean floor 70 million years ago and thrust upward.
                This unique geology gave birth to the Chalky Mount Potteries.  Because it is made of clay and sandstone rather than solid rock, the landscape is constantly changing due to erosion.</>
        },
        {
            title: "Deeper Diver",
            content: <>
                Since the 1700s, families have harvested the local red clay to craft &quot;monkeys&quot; (water jugs), &quot;conaree&quot; jars, and flower pots. The village remains one of the longest-standing industrial areas on the island, where master potters still use traditional wheels to keep a centuries-old Bajan legacy alive.<br /> <br />

                The hike up Chalky Mount is often described as walking on the edge of the world. The ridge is narrow, with the land falling away sharply on both sides into lush, green &quot;V&quot; shaped valleys.<br /> <br />

                The &quot;Chalk&quot; in the name is actually a bit of a misnomer; the white appearance comes from weathered clay and sandstone. As you climb toward the Keith Laurie Memorial Cross, you are standing on some of the oldest earth in the Caribbean, witnessing a landscape that predates the last Ice Age.
            </>
        },
    ],
    safety: {
        heading: "Harmony with the Elements",
        subheading: "Your guide to staying safe and respecting the landscape.",
        description:
            <>
                <li>
                    <b>The Resilience Angle (Landslips):</b> The Scotland District is prone to soil movement. The pottery industry is a testament to living with the land, not just on it.
                </li>
                <li>
                    <b>The Clay Trap:</b> When dry, the clay is like concrete; when wet, it is like grease. <b>Avoid the ridges during or immediately after heavy rain.</b>
                </li>
                <li>
                    <b>Road Safety:</b> Be mindful of &quot;slipping&quot; roads in this area. Report any new cracks in the pavement to the District Emergency Organisation (DEO).
                </li>
            </>,
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
        title: "Unfiltered Barbados",
        tagline: "Voices and stories from the heart of the community.",
        items: [
            {
                id: 1,
                type: 'audio',
                title: " ",
                src: "/data/cat-meow-9-fx-306185.mp3",
                caption:
                    <>
                        My hands are never clean, but my heart is always full. This clay is part of our skin. My father taught me, and his father taught him. We don&apos;t just make pots; we make the earth talk.
                        <span className="font-bold"> — A local potter on the endurance of the Chalky Mount tradition.&quot;</span>
                    </>,
            },
        ],
    },
    facts: {
        Category: " Cultural Heritage / Geological Landmark / Hiking", // Note: \n works because we added whitespace-pre-line in the CSS
        Best_For: "Photography & Fresh Seafood.",
        Amenities: "Local pottery workshops, informal parking areas. No public restrooms or large-scale visitor centers.",
        Accessibility:
            <>
                <b>Workshops- accessible from road side; hiking accessibility  Difficult.</b> The terrain is composed of steep, narrow ridges and slippery clay paths. Not suitable for wheelchairs or those with significant mobility issues.
            </>,
        Nearby_Must_See:
            <>
                <li>Barclays Park (at the foot of the hill) Bathsheba.</li>
            </>,
    },
    location: {
        lat: 13.231536,
        lng: -59.554309
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
        HIGHLAND_POTTERY_DATA.id,
        HIGHLAND_POTTERY_DATA.location.lat,
        HIGHLAND_POTTERY_DATA.location.lng
    );

    // 3. Render
    return (
        <main className='flex flex-col min-h-screen text-black items-center overflow-x-hidden'>

            <HeroSection content={HIGHLAND_POTTERY_DATA} />

            {/* Decorative Separator */}
            <div className='bg-gray-300 w-full max-w-[80vw] h-[2px] mt-20 mx-auto rounded-full' />

            <SiteFacts facts={HIGHLAND_POTTERY_DATA.facts} />

            <InfoSection
                sections={HIGHLAND_POTTERY_DATA.sections}
                sidebarSlot={
                    <>
                        <SiteSafety data={HIGHLAND_POTTERY_DATA.safety} />
                        {HIGHLAND_POTTERY_DATA.stories && (
                            <LocalStories data={HIGHLAND_POTTERY_DATA.stories} />
                        )}
                        <SiteQuiz user={user} siteId={HIGHLAND_POTTERY_DATA.id} />
                    </>
                }
            />

            {/* <LocalStories stories={HIGHLAND_POTTERY_DATA.stories} /> */}

            <GalleryFan items={HIGHLAND_POTTERY_DATA.gallery} />

            <ReviewsSection
                user={user}
                reviews={reviews}
                loading={loadingReviews}
                onRefresh={fetchReviews}
                supabase={supabase}
                siteId={HIGHLAND_POTTERY_DATA.id}
            />

            <NearbySection
                sites={nearbySites}
                loading={loadingSites}
            />

            <Footer />
        </main>
    );
}
