"use client";

import React from 'react';
import Footer from "@/app/components/FooterModal";
import Hero from './components/home/Hero';
import LegacyInfo from './components/home/LegacyInfo';
import VirtualMapSection from './components/home/VirtualMapSection';
import FeaturedSites from './components/home/FeaturedSites';
import Sponsors from './components/home/Sponsors';
import { useHomeData } from '@/app/hooks/useHomeData';
import CreditsCTA from './components/home/CreditsCTA';

export default function Home() {
    // Logic extracted to custom hook for better separation of concerns
    const { siteCards, sites, loading } = useHomeData();

    return (
        <div className='flex flex-col items-center min-h-[100dvh] text-black bg-[#fff] overflow-x-hidden'>
            <Hero />

            <LegacyInfo />

            <VirtualMapSection
                sites={sites}
                siteCards={siteCards}
            />

            <FeaturedSites
                siteCards={siteCards}
                loading={loading}
            />

            {/* <CreditsCTA /> */}

            <Sponsors />

            <Footer />
        </div>
    );
}
