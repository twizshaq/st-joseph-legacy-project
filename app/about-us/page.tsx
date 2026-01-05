"use client";
import React from 'react';
import Footer from "@/app/components/FooterModal";
import AboutHero from "@/app/components/aboutus/AboutHero";
import AboutMission from "@/app/components/aboutus/AboutMission";
import AboutLeadership from "@/app/components/aboutus/AboutLeadership";
import AboutCommunity from "@/app/components/aboutus/AboutCommunity";
import ConnectCTA from "@/app/components/aboutus/ConnectCTA";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden font-sans text-slate-800 flex flex-col items-center">
      
      {/* 1. Hero Section (Video) */}
      <AboutHero />

      {/* 2. Mission Statement */}
      <AboutMission />

      {/* 3. Leadership Team & Timeline */}
      <AboutLeadership />

      {/* 4. Values & Community */}
      <AboutCommunity />

      {/* 5. Action Center / CTA */}
      <ConnectCTA />

      {/* 6. Footer */}
      <Footer />
      
    </div>
  );
}