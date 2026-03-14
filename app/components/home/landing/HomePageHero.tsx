import type {
  HeroCarouselModel,
  WaitlistFormModel,
} from "@/app/components/home/landing/home.types";
import HeroBackground from "@/app/components/home/landing/HeroBackground";
import HeroSiteCarousel from "@/app/components/home/landing/HeroSiteCarousel";
import HomeHeroHeading from "@/app/components/home/landing/HomeHeroHeading";
import WaitlistSignupForm from "@/app/components/home/landing/WaitlistSignupForm";

type HomePageHeroProps = {
  waitlist: WaitlistFormModel;
  hero: HeroCarouselModel;
};

export default function HomePageHero({ waitlist, hero }: HomePageHeroProps) {
  return (
    <>
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-[1400px] max-w-[90vw] flex-col items-center">
        <div className="z-40 mt-20 flex flex-col items-center text-center lg:mt-20">
          <HomeHeroHeading />
          <WaitlistSignupForm waitlist={waitlist} />
        </div>

        <div className="z-30 mt-10 flex w-full flex-col items-center">
          <p className="mb-16 max-w-[700px] text-center text-[1rem] font-medium italic leading-[1.6] text-slate-800 max-sm:mb-5 sm:text-[1.2rem]">
            The &quot;Unveiling St. Joseph&quot; project is capturing the stories of our people and places to build a
            stronger community-one story at a time.
          </p>

          <HeroSiteCarousel hero={hero} />
        </div>
      </div>
    </>
  );
}
