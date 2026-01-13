"use client";

import React from "react";
import Footer from "@/app/components/FooterModal";

// --- About Sections ---
import AboutHero from "@/app/components/aboutus/AboutHero";
import AboutMission from "@/app/components/aboutus/AboutMission";
import AboutLeadership from "@/app/components/aboutus/AboutLeadership";
import AboutCommunity from "@/app/components/aboutus/AboutCommunity";
import ConnectCTA from "@/app/components/aboutus/ConnectCTA";

// --- Credits Sections ---
import CreditsHeader from "@/app/components/credits/CreditsHeader";
import ProjectLead from "@/app/components/credits/ProjectLead";
import DigitalArchitects from "@/app/components/credits/DigitalArchitects";
import SponsorsSection from "@/app/components/credits/SponsorsSection";
import OurJourney from "@/app/components/credits/OurJourney";

export default function AboutAndCreditsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden font-sans text-slate-800 flex flex-col items-center">

      {/* ================= ABOUT ================= */}

      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Mission */}
      <AboutMission />

      {/* 3. Leadership */}
      <AboutLeadership />

      {/* 4. Community & Values */}
      <AboutCommunity />

      {/* ================= CREDITS ================= */}

      {/* Soft transition divider */}
      <div className="w-full max-w-[1400px] my-32 px-6">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* 6. Credits Intro */}
      <CreditsHeader />

      {/* 7. Project Lead */}
      <ProjectLead />

      {/* 8. Dev Team */}
      <DigitalArchitects />

      {/* 9. Sponsors */}
      <SponsorsSection />

      {/* 10. Journey Timeline */}
      <OurJourney />

      {/* 11. Call to Action */}
      <ConnectCTA />

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}