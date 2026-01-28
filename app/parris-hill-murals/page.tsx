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
const PARRIS_HILL_DATA: SiteContent = {
    id: 12,
    name: "Parris Hill Painted Sculpture",
    tagline: "A surfer’s paradise on the rugged east coast.",
    description: "Known worldwide for its powerful reef breaks...",

    sections: [
        {
            title: "Roots and Routes",
            content: <><div className='mb-[15px] f/ont-[700] text-[1.2rem] max-sm:text-[1.1rem]'>Explore the history and heritage of the Parris Hill Mural.</div>
                <div className='mb-[15px] font-[700] text-[1.2rem] max-sm:text-[1.1rem]'>⏱️ 60 Seconds of Secrets</div>
                This site is a rare example of large-scale, indigenous rock carving in the Eastern Caribbean. Unlike a traditional painted mural, these are sculptures etched directly into the natural limestone coral cliffs of St. Joseph. There are currently five scenes; from the Aesop’s Fable Lion and the Mouse (reminding us that no one is too small to make an impact) to the whimsical &quot;Cricket in the Jungle&quot; (a tribute to The Tradewinds&apos; song), the rock face is a celebration of Barbadian identity and universal fables.
            </>
        },
        {
            title: "A Deeper Dive- Explore with the Artist",
            content: <>This site is celebrated as a significant piece of public art. The work has evolved from the original murals to indigenous sculptures depicting scenes of folklore or the natural beauty of the parish.  The sculptures are the artistic vision of Christopher Chandler, a self-taught Barbadian &quot;recycle artist&quot; and sculptor. The primary works were completed around 2000, though Chandler has noted that the site is an ongoing &quot;vision&quot; rather than a finished decoration.
                <br />
                Like all great art, the interpretation is up to you, but we invite you to hear the stories from Christopher Chandler and see the progression of the work
            </>
        },
    ],
    safety: {
        heading: "Harmony with the Elements",
        subheading: "Your guide to staying safe and respecting the landscape.",
        description: "The Parris Hill Mural was carved from a shared vision; it belongs to all of us to admire and protect. Disaster preparedness works the same way. When you are ready, the whole community is stronger.  Know your plan, protect your home, and know where to meet when the elements test us.",
        guidelines: [
            "The 3-2-1 Rule: Keep at least 3 days of water, 2 ways to get emergency alerts (radio/phone), and 1 fully stocked Go Bag (first-aid kit, food, documents).",

            "The 'Meeting Point': Don't wait for the storm to decide where to go. Pick a specific landmark eg. like the Parris Hill Mural or a nearby community center, as your family’s 'safe zone' if you are separated.",

            "Document the Spirit: Just as we photograph the art, take photos of your important documents and home interior. Store them in a waterproof 'Go-Bag' or on the cloud.",
        ],
        emergencyNumbers: (
            <>• 211 Police <br /> • 511 Ambulance <br /> • 311 Fire</>
        )
    },

    heroMedia: {
        video: "https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/parris-hill-painted-sculptures/parris_hill_painted_sculptures_video_1.mp4",
        image: "https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG",
        photo360: "https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/soup-bowl/test2.jpg"
    },
    gallery: [
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG' }, // 0
        { type: 'video', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4' }, // 1
        { type: '360', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/soup-bowl/test2.jpg' }, // 2
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG' }, // 3
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-2.JPG' }, // 4
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG' }, // 5
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-2.JPG' }, // 6
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-1.JPG' }, // 7
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG' }, // 8
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-2.JPG' }, // 9
        { type: 'image', src: 'https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-1.JPG' }, // 10
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
                caption: "A 2-minute history of the first surfers here. — A local potter on the endurance of the Chalky Mount tradition.&quot;"
            },
        ],
    },
    facts: {
        Category: "Culture, Indigenous Art", // Note: \n works because we added whitespace-pre-line in the CSS
        Best_For: "what to put here?",
        Amenities: "Roadside viewing (active road), local shops near by",
        Accessibility: "Visible from the road.",
        Nearby_Must_See: "St Anne Church, Blackman’s Bridge, Eric Holder Complex",
    },
    location: {
        lat: 13.178027,
        lng: -59.548269
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
        PARRIS_HILL_DATA.id,
        PARRIS_HILL_DATA.location.lat,
        PARRIS_HILL_DATA.location.lng
    );

    // 3. Render
    return (
        <main className='flex flex-col min-h-screen text-black items-center overflow-x-hidden'>

            <HeroSection content={PARRIS_HILL_DATA} />

            {/* Decorative Separator */}
            <div className='bg-gray-300 w-full max-w-[80vw] h-[2px] mt-20 mx-auto rounded-full' />

            <SiteFacts facts={PARRIS_HILL_DATA.facts} />

            <InfoSection
                sections={PARRIS_HILL_DATA.sections}
                sidebarSlot={
                    <>
                        <SiteSafety data={PARRIS_HILL_DATA.safety} />
                        {PARRIS_HILL_DATA.stories && (
                            <LocalStories data={PARRIS_HILL_DATA.stories} />
                        )}
                        <SiteQuiz user={user} siteId={PARRIS_HILL_DATA.id} />
                    </>
                }
            />

            {/* <LocalStories stories={PARRIS_HILL_DATA.stories} /> */}

            <GalleryFan items={PARRIS_HILL_DATA.gallery} />

            <ReviewsSection
                user={user}
                reviews={reviews}
                loading={loadingReviews}
                onRefresh={fetchReviews}
                supabase={supabase}
                siteId={PARRIS_HILL_DATA.id}
            />

            <NearbySection
                sites={nearbySites}
                loading={loadingSites}
            />

            <Footer />
        </main>
    );
}
