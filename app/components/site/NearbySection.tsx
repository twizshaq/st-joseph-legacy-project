"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SiteCardSkeleton } from "@/app/components/SiteCardSkeleton";
import ArrowIcon from '@/public/icons/arrow-icon';

interface NearbySite {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  distance?: number;
}

interface NearbySectionProps {
  sites: NearbySite[];
  loading: boolean;
}

export const NearbySection = ({ sites, loading }: NearbySectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: 'smooth',
    });
  };

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const atLeft = element.scrollLeft <= 2;
      const atRight = Math.ceil(element.scrollLeft + element.clientWidth) >= element.scrollWidth - 2;

      setCanScrollLeft(!atLeft);
      setCanScrollRight(!atRight);
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll, sites, loading]);

  return (
    <section className='relative w-full flex flex-col text-slate-800 mt-[0px] md:mt-[20px]'>

      {/* Header */}
      <div className='px-[5vw] mb-[20px]'>
        <h2 className='font-bold text-[2rem] max-sm:text-[1.5rem]'>Nearby Sites</h2>
        <p className='max-w-[700px] text-slate-600'>
          Plan your route across St. Joseph and discover neighboring heritage sites. Each location offers unique stories and insights into our community.
        </p>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative px-[5vw] max-sm:px-[0vw]">

        {/* Edge Blur Overlays */}
        <div
          className={`pointer-events-none absolute left-[4vw] top-[40px] z-50 h-[440px] w-[30px] max-sm:hidden bg-white [mask-image:linear-gradient(to_right,black_50%,transparent)] transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          className={`pointer-events-none absolute right-[4vw] rotate-180 top-[40px] z-50 h-[440px] w-[30px] max-sm:hidden bg-white [mask-image:linear-gradient(to_right,black_50%,transparent)] transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Previous Button */}
        <div className={`hidden md:flex absolute left-[3.5vw] top-1/2 -translate-y-1/2 z-50 items-center justify-center p-[2.5px] rounded-full bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition-all duration-100 active:scale-[0.93] cursor-pointer ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            type="button"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer hover:bg-black/50 transition-colors'
          >
            <span className='-rotate-90 flex mr-[2px] items-center scale-[1.1] justify-center text-white'>
              <ArrowIcon width={30} height={30} />
            </span>
          </button>
        </div>

        {/* Next Button */}
        <div className={`hidden md:flex absolute right-[3.5vw] top-1/2 -translate-y-1/2 z-50 items-center justify-center p-[2.5px] rounded-full bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition-all duration-100 active:scale-[0.93] cursor-pointer ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            type="button"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer hover:bg-black/50 transition-colors'
          >
            <span className='rotate-90 flex ml-[2px] items-center scale-[1.1] justify-center text-white'>
              <ArrowIcon width={30} height={30} />
            </span>
          </button>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-row items-center mt-[10px] min-h-[450px]
                     gap-[30px] px-[.9vw] max-sm:px-[5vw]
                     overflow-x-auto hide-scrollbar"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SiteCardSkeleton key={i} />
            ))
          ) : sites.length > 0 ? (
            sites.map((card) => (
              <div key={card.id} className="relative shrink-0 snap-center cursor-pointer">
                <Link href={`/${card.slug}`} passHref>
                  {/* Shadow / Glow Layer */}
                  <div
                    className="absolute bg-cover bg-center min-h-[340px] max-h-[340px]
                               min-w-[270px] max-w-[270px] rounded-[57px]
                               shadow-[0px_0px_10px_rgba(0,0,0,0.3)]
                               flex flex-col justify-end overflow-hidden
                               scale-x-[1.03] scale-y-[1.025]"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <div className="rotate-[180deg] self-end scale-[1.02]">
                      <div
                        className="absolute w-[270px] top-[70px] rotate-[-180deg]
                                   backdrop-blur-[5px]
                                   [mask-image:linear-gradient(to_bottom,black_70%,transparent)]
                                   h-[270px]"
                      />
                    </div>
                  </div>

                  {/* Main Card */}
                  <div
                    className="relative bg-cover bg-center min-h-[340px] max-h-[340px]
                               min-w-[270px] max-w-[270px] rounded-[54px]
                               flex flex-col justify-end overflow-hidden z-10"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <div className="absolute inset-0 bg-black/30 rounded-[50px]" />

                    {/* Distance Badge */}
                    {typeof card.distance === 'number' && (
                      <div className='absolute top-5 right-5 z-40'>
                        <div className='rounded-full p-[2px] bg-white/10 shadow-[0px_0px_20px_rgba(0,0,0,0.3)] backdrop-blur-[2px]'>
                          <div className='bg-black/30 rounded-full px-[12px] py-[5px]'>
                            <p className='text-center font-bold text-[0.75rem] text-white'>
                              {card.distance < 1
                                ? `${(card.distance * 1000).toFixed(0)}m away`
                                : `${card.distance.toFixed(1)} km away`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative z-30 text-center mb-[20px] px-[10px]">
                      <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                        <p className="font-bold text-[1.3rem] mb-[2px]">
                          {card.name}
                        </p>
                        <p className="text-[1rem]">{card.description}</p>

                        <div className="mt-[10px] flex justify-center">
                          <div className="whitespace-nowrap rounded-full p-[2px] w-[190px]
                                          bg-white/10 shadow-[0px_0px_40px_rgba(0,0,0,0.3)]">
                            <div className="bg-black/20 rounded-full px-[15px] py-[6.4px]">
                              <p className="font-bold text-[.85rem]">
                                {card.category}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rotate-[180deg] self-end">
                      <div
                        className="absolute w-[270px] backdrop-blur-[5px]
                                   [mask-image:linear-gradient(to_bottom,black_50%,transparent)]
                                   h-[200px]"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="w-full text-center font-bold text-slate-500">
              No nearby sites found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
