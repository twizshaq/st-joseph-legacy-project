"use client";
import React from 'react';

// Components
import CreditsHeader from "@/app/components/credits/CreditsHeader";
import ProjectLead from "@/app/components/credits/ProjectLead";
import DigitalArchitects from "@/app/components/credits/DigitalArchitects";
import SponsorsSection from "@/app/components/credits/SponsorsSection";
import OurJourney from "@/app/components/credits/OurJourney"; // Note: Adjust if this is shared
import Footer from "@/app/components/FooterModal";

export default function CreditsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden font-sans text-slate-800 flex flex-col items-center">
      
      {/* 1. Header & Intro */}
      <CreditsHeader />

      {/* 2. Lead Visionary */}
      <ProjectLead />

      {/* 3. The Dev Team */}
      <DigitalArchitects />

      {/* 4. Sponsors & Partners */}
      <SponsorsSection />

      {/* 5. Project Timeline (From previous context) */}
      <OurJourney />

      {/* 6. Footer */}
      <Footer />

    </div>
  );
}