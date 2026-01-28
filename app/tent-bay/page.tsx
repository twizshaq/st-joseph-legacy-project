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
const TENT_BAY_DATA: SiteContent = {
    id: 5,
    name: "Tent Bay",
    tagline: "Tent Bay is a working fishing village that retains an old-world charm. A small, active Fish Market, and if you are lucky, you may see the day&apos;s catch coming in.",
    description: "Known worldwide for its powerful reef breaks...",

    sections: [
        {
            title: "Roots and Routes",
            content:
                <>
                    <div className='mb-[15px] font-[700] text-[1.2rem] max-sm:text-[1.1rem]'>Explore the history and heritage of Tent Bay.
                    </div> In Barbados, we say: &quot;The sea ain&apos;t got no back door.&quot; This reflects a deep-seated respect for the Atlantic&apos;s power. At Soup Bowl, you don&apos;t conquer the ocean; you just hope she lets you dance.
                </>
        },
        {
            title: "⏱️ 60 Seconds of Secrets",
            content: <><strong>Tent Bay</strong> is where you see the &quot;real&quot; East Coast. Here, fishing isn&apos;t a hobby; it’s a generational lineage. You’ll see fishermen &quot;reading&quot; the waves to time their entry through the narrow reef passage known as the &quot;Gap.&quot; The community is tight-knit—if you visit the fish market, you aren&apos;t just a tourist; you’re a witness to a way of life that hasn&apos;t changed much since the last train left the tracks in 1937.</>
        },
        {
            title: "Deeper Diver",
            content: <>Tent Bay’s identity is forged by the Atlantic and the &quot;Iron Road.&quot; In the late 1800s, this bay became a vital stop for the <b>Barbados Railway</b>. The train stopped literally at the doorstep of the <b>Atlantis Hotel</b> (built in 1882), transforming this remote fishing outpost into a prestigious holiday escape for Bridgetown residents seeking the &quot;healing&quot; Atlantic air. Walking along the coastline you may find remnants of these old raillines.
                The bay is also famous for its <b>&quot;Tent Boats&quot;</b>—unique, brightly colored fishing vessels specially designed to navigate the treacherous reefs and heavy swells of the East Coast.
            </>
        },
    ],
    safety: {
        heading: "Harmony with the Elements",
        subheading: "Your guide to staying safe and respecting the landscape.",
        description:
            <>
                <li>
                    <b>The Atlantic Power:</b> Unlike the calm West Coast, Tent Bay has <b>extremely strong currents.</b>  Swimming is not advised; instead, enjoy the &quot;natural pools&quot; that form at low tide between the inner reefs.</li>
                <li>
                    <b>Tsunami Ready:</b> Tent Bay is in a coastal inundation zone. In the event of an earthquake or rapidly receding water, <b>immediately head uphill toward Hillcrest Community Centre</b>, which is the designated high-ground safe zone.
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
        Category: "Scenic & Heritage", // Note: \n works because we added whitespace-pre-line in the CSS
        Best_For: "Photography & Fresh Seafood.",
        Amenities: "Home to the historic Atlantis Historic Inn (dining/lodging) and the ECO Lifestyle + Lodge. The Garage Resturant.",
        Accessibility:
            <>
                <b>Road:</b> Accessible via steep, winding roads typical of St. Joseph. <br /> <b>Walking:</b> The area is part of the Bathsheba to Bath trail, which is relatively flat along the coast but requires steady footing on the sand and old rail bed.
            </>,
        Nearby_Must_See:
            <>
                <li>Andromeda Botanic Gardens (approx. 400m uphill)</li>
                <li>Soup Bowl (approx. 500m North)</li>
                <li>Atlantis Historic Inn (formerly The Atlantis Hotel) and the ECO Lifestyle & Lodge.</li>
            </>,
    },
    location: {
        lat: 13.210720,
        lng: -59.516262
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
        TENT_BAY_DATA.id,
        TENT_BAY_DATA.location.lat,
        TENT_BAY_DATA.location.lng
    );

    // 3. Render
    return (
        <main className='flex flex-col min-h-screen text-black items-center overflow-x-hidden'>

            <HeroSection content={TENT_BAY_DATA} />

            {/* Decorative Separator */}
            <div className='bg-gray-300 w-full max-w-[80vw] h-[2px] mt-20 mx-auto rounded-full' />

            <SiteFacts facts={TENT_BAY_DATA.facts} />

            <InfoSection
                sections={TENT_BAY_DATA.sections}
                sidebarSlot={
                    <>
                        <SiteSafety data={TENT_BAY_DATA.safety} />
                        {TENT_BAY_DATA.stories && (
                            <LocalStories data={TENT_BAY_DATA.stories} />
                        )}
                        <SiteQuiz user={user} siteId={TENT_BAY_DATA.id} />
                    </>
                }
            />

            <GalleryFan items={TENT_BAY_DATA.gallery} />

            <ReviewsSection
                user={user}
                reviews={reviews}
                loading={loadingReviews}
                onRefresh={fetchReviews}
                supabase={supabase}
                siteId={TENT_BAY_DATA.id}
            />

            <NearbySection
                sites={nearbySites}
                loading={loadingSites}
            />

            <Footer />
        </main>
    );
}
