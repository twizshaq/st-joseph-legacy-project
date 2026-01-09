"use client";

import React from 'react';
import Link from 'next/link';
import { SiteCardSkeleton } from "@/app/components/SiteCardSkeleton";

interface NearbySite {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
}

interface NearbySectionProps {
  sites: NearbySite[];
  loading: boolean;
}

export const NearbySection = ({ sites, loading }: NearbySectionProps) => {
  return (
    <section className='relative flex flex-col items-center w-[1400px] max-w-[90vw] max-sm:max-w-[100vw] mx-auto mb-20'>
      
      {/* Header */}
      <div className='w-full px-[5.4vw] md:px-0 mb-[10px] self-start'>
        <h2 className='font-bold text-[1.75rem]'>Nearby Sites</h2>
        <p className='text-[#666] font-medium'>Plan your route across St. Joseph</p>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className='relative w-full overflow-visible z-10'>
        <div className="flex overflow-x-auto pb-12 pt-4 gap-6 max-sm:w-[100vw] md:w-[90vw] w-[1400px] px-4 max-sm:px-6 scroll-smooth mandatory hide-scrollbar">
          
          {loading ? (
            <>
              <SiteCardSkeleton /><SiteCardSkeleton /><SiteCardSkeleton /><SiteCardSkeleton />
            </>
          ) : (
            sites.map((card) => (
              <div key={card.id} className="relative flex-shrink-0 snap-center group cursor-pointer">
                
                {/* 1. Background / Shadow Layer (Slightly larger and rotated) */}
                <div
                  className="absolute bg-cover bg-center min-h-[310px] max-h-[310px] min-w-[260px] max-w-[260px] rounded-[57px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                  style={{ backgroundImage: `url(${card.image_url})` }}
                >
                  <div className="rotate-[180deg] self-end">
                    <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
                  </div>
                </div>

                {/* 2. Main Content Card */}
                <div
                  className="relative bg-cover bg-center min-h-[310px] max-h-[310px] min-w-[260px] max-w-[260px] rounded-[54px] flex flex-col justify-end overflow-hidden z-10 transition-transform duration-300 active:scale-[0.98]"
                  style={{ backgroundImage: `url(${card.image_url})` }}
                >
                  <Link href={`/${card.slug}`} passHref className="h-full flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/30 rounded-[50px] transition-opacity group-hover:bg-black/40" />
                    
                    <div className="relative z-30 text-center mb-[20px] px-[10px]">
                      <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                        <p className="font-bold text-[1.3rem] mb-[2px] leading-tight">{card.name}</p>
                        <p className="text-[0.9rem] px-[5px] line-clamp-2 opacity-90">{card.description}</p>
                        
                        {/* Category Pill */}
                        <div className='mt-[10px] flex justify-center items-center'>
                            <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] w-[190px] bg-white/10 shadow-[0px_0px_40px_rgba(0,0,0,0.3)] -mr-[2px]'>
                              <div className='bg-black/20 rounded-full px-[15px] py-[6.4px]'>
                                <p className='text-center font-bold text-[.85rem]'>{card.category}</p>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Bottom Blur Effect */}
                  <div className="rotate-[180deg] self-end pointer-events-none">
                    <div className="bg-blue-500/0 absolute w-[270px] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] opacity-100 h-[150px]"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};