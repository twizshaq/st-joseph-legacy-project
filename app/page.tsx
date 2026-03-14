"use client";

import HomePageHero from "@/app/components/home/landing/HomePageHero";
import HomeSurveySection from "@/app/components/home/landing/HomeSurveySection";
import { useHomeHeroCarousel } from "@/app/components/home/landing/useHomeHeroCarousel";
import { useHomeSurveyForm } from "@/app/components/home/landing/useHomeSurveyForm";
import { useWaitlistForm } from "@/app/components/home/landing/useWaitlistForm";

export default function Home() {
  const waitlist = useWaitlistForm();
  const hero = useHomeHeroCarousel();
  const survey = useHomeSurveyForm();

  return (
    <div className="relative h-[100dvh] w-full overflow-x-hidden text-slate-800">
      <section className="relative flex min-h-[130dvh] flex-col justify-center overflow-hidden bg-[#050b16]/0 px-4 pb-8 pt-16 sm:px-6 lg:px-10">
        <HomePageHero waitlist={waitlist} hero={hero} />
        <HomeSurveySection survey={survey} />
      </section>
    </div>
  );
}
