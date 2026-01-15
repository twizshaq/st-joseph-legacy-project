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

      {/* 1. Credits Intro */}
      <CreditsHeader />

      {/* 2. Project Lead */}
      <ProjectLead />

      {/* 3. Dev Team */}
      <DigitalArchitects />

      {/* 4. Sponsors */}
      <SponsorsSection />

      {/* 5. Journey Timeline */}
      <OurJourney />

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}