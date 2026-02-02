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
const ERIC_HOLDER_COMPLEX_DATA: SiteContent = {
    id: 16,
    name: "Eric Holder Jr. Municipal Complex",
    tagline: " Category 1 Shelter",
    description: "Known worldwide for its powerful reef breaks...",

    sections: [
        {
            title: "Roots & Routes",
            content:
                <>
                    <div className='mb-[15px] font-[700] text-[1.2rem] max-sm:text-[1.1rem]'>Explore the history and heritage of the Eric Holder Jr. Complex.
                    </div> In Barbados, we say: &quot;The sea ain&apos;t got no back door.&quot; This reflects a deep-seated respect for the Atlantic&apos;s power. At Soup Bowl, you don&apos;t conquer the ocean; you just hope she lets you dance.
                </>
        },
        {
            title: "⏱️ 60 Seconds of Secrets",
            content: <>This complex is named after <b>Eric Holder Jr.</b>, the first African American Attorney General of the United States, whose family roots are tied directly to the soil of St. Joseph. It represents a &quot;New Barbados&quot;—bringing essential services like law, communication, and education into a single, storm-resistant location for the rural community.<br />
                <ul className="ml-10">
                    <li className="list-disc"><b>A Fortress in the Hills:</b> The building is specifically engineered with reinforced concrete and hurricane shutters to serve as a primary refuge.
                    </li>
                </ul>
            </>
        },
        {
            title: "Deeper Diver",
            content: <>
                <h1 className="font-semibold text-xl mb-4">
                    The Civic Heart of St. Joseph
                </h1>
                The Eric Holder Jr. Complex is the primary <b>Governmental Hub</b> for the parish. It houses:

                <ul className="ml-10 mt-2">
                    <li className="list-disc"><b>District &quot;F&quot; Police Station:</b> The main security point for the central-east coast.</li>
                    <li className="list-disc"><b>Magistrate&apos;s Court:</b> Handling legal matters for the rural northern and eastern districts.</li>
                    <li className="list-disc"><b>Post Office:</b> Providing essential mail and payment services.</li>
                    <li className="list-disc"><b>St. Joseph Outpatient Clinic (Nearby):</b> While not in the building, the parish’s primary healthcare clinic is located just a short distance away to support the complex during emergencies.</li>
                </ul>
                <br /> <br />

                <h1 className="font-semibold text-xl mb-4">
                    The Shelter System: Category 1 vs. Category 2
                </h1>

                <span>In Barbados, emergency shelters are strictly graded to ensure your safety:</span>
                <ul className="ml-10 mt-2">
                    <li className="list-disc"><b>Category 1 Shelter (The Complex):</b> These are the only shelters opened <b>BEFORE</b> a hurricane strikes. They are structurally certified to withstand the direct impact of high-intensity winds and rain.
                    </li>
                    <li className="list-disc"><b>Category 2 Shelter:</b> These are buildings that are inspected but only opened <b>AFTER</b> the storm has passed, provided they remain safe. They serve as &quot;relief centers&quot; for those whose homes were damaged during the event. Eg. Grantley Adams Memorial School,St. Bernard Primary School and St. Joseph Primary School </li>
                    <li className="list-disc"><b>Rule of Thumb:</b>  If a hurricane is coming, only head to a <b>Category 1</b> location. For a full, up-to-date list of all Category 1 shelters across the island, visit the&nbsp;
                        <a href="https://dem.gov.bb/emergency/shelter" className="text-blue-500 underline" target="_blank">
                            Department of Emergency Management (DEM) Official Shelter List.
                        </a>
                    </li>
                </ul>
            </>
        },
    ],
    safety: {
        heading: "Harmony with the Elements",
        subheading: "Your guide to staying safe and respecting the landscape.",
        description:
            <>
                <ul className="list-decimal ml-3">
                    <li>
                        <b>Know Your Shelters:</b> The Eric Holder Complex/Tamarind Hall is the primary Category 1 shelter for this area.
                    </li>
                    <li>
                        Hurricane season officially starts <b>June 1st.</b> Residents should verify their nearest shelter and map out two different routes to reach it, as roads in St. Joseph are prone to landslips.
                    </li>
                </ul>
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
        image: "https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/eric-holder/eric_holder_1.JPG",
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
        Category: "Civic Hub / Category 1 Emergency Shelter ", // Note: \n works because we added whitespace-pre-line in the CSS
        Best_For: "Photography & Fresh Seafood.",
        Amenities: "Tamarind Hall Branch Library, Post Office, District &ldquo;F&rdquo; Magistrate&rsquo;s Court, Police Station, and ATM.",
        Accessibility:
            <>
                <b>Excellent.</b>This is one of the few fully wheelchair-accessible government hubs in the rural interior, featuring ramps and wide-access doorways.

            </>,
        Nearby_Must_See:
            <>
                <li>Parris Hill Mural, Cotton Tower.</li>
            </>,
    },
    location: {
        lat: 13.192840,
        lng: -59.544026
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
        ERIC_HOLDER_COMPLEX_DATA.id,
        ERIC_HOLDER_COMPLEX_DATA.location.lat,
        ERIC_HOLDER_COMPLEX_DATA.location.lng
    );

    // 3. Render
    return (
        <main className='flex flex-col min-h-screen text-black items-center overflow-x-hidden'>

            <HeroSection content={ERIC_HOLDER_COMPLEX_DATA} />

            {/* Decorative Separator */}
            <div className='bg-gray-300 w-full max-w-[80vw] h-[2px] mt-20 mx-auto rounded-full' />

            <SiteFacts facts={ERIC_HOLDER_COMPLEX_DATA.facts} />

            <InfoSection
                sections={ERIC_HOLDER_COMPLEX_DATA.sections}
                sidebarSlot={
                    <>
                        <SiteSafety data={ERIC_HOLDER_COMPLEX_DATA.safety} />
                        {ERIC_HOLDER_COMPLEX_DATA.stories && (
                            <LocalStories data={ERIC_HOLDER_COMPLEX_DATA.stories} />
                        )}
                        <SiteQuiz user={user} siteId={ERIC_HOLDER_COMPLEX_DATA.id} />
                    </>
                }
            />

            {/* <LocalStories stories={ERIC_HOLDER_COMPLEX_DATA.stories} /> */}

            <GalleryFan items={ERIC_HOLDER_COMPLEX_DATA.gallery} />

            <ReviewsSection
                user={user}
                reviews={reviews}
                loading={loadingReviews}
                onRefresh={fetchReviews}
                supabase={supabase}
                siteId={ERIC_HOLDER_COMPLEX_DATA.id}
            />

            <NearbySection
                sites={nearbySites}
                loading={loadingSites}
            />

            <Footer />
        </main>
    );
}
