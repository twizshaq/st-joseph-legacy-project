import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SiteCard } from '@/app/types';
import { SiteCardSkeleton } from '../SiteCardSkeleton';
import ArrowIcon from '@/public/icons/arrow-icon';

interface FeaturedSitesProps {
    siteCards: SiteCard[];
    loading: boolean;
}

export default function FeaturedSites({ siteCards, loading }: FeaturedSitesProps) {
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
    }, [handleScroll, siteCards, loading]);

    return (
        <div className="max-w-[1500px] w-full mt-[100px] flex flex-col text-slate-800">
            <div className="px-[5vw]">
                <p className="font-bold text-[2rem] max-sm:text-[1.5rem]">Featured Sites</p>
                <p className="max-w-[700px]">
                    Not sure where to begin? We&apos;ve curated a selection of Featured Sites that perfectly capture the spirit of our project. These locations represent the best of St. Joseph—blending breathtaking heritage with the vital &quot;earth-knowledge&quot; needed to keep our community strong.
                    <br /><br />
                    When driving around St. Joseph each featured stop is equipped with a physical QR code. When scanned, it reveals the &quot;hidden layer&quot; of the location: the stories of the ancestors who built it, and the modern safety insights provided by the DEO to protect it. Whether you are a lifelong resident or a first-time visitor, these sites offer a deeper look about the location.
                </p>
            </div>

            <div className="w-fit self-end mr-[5vw] font-bold mb-[-10px] mt-[20px]">
                <Link href="/all-sites">View All Sites</Link>
            </div>

            {/* Carousel Wrapper */}
            <div className="relative px-[5vw] max-sm:px-[0vw] b/g-red-500">
                {/* Edge Blur Overlays */}
                <div className="pointer-events-none absolute left-[3.5vw] top-[40px] z-9999 h-[440px] w-[90px] max-sm:hidden backdrop-blur-sm [mask-image:linear-gradient(to_right,black_50%,transparent)]" />
                <div className="pointer-events-none absolute right-[3.5vw] rotate-180 top-[40px] z-9999 h-[440px] w-[90px] max-sm:hidden backdrop-blur-xs bg-r/ed-500 [mask-image:linear-gradient(to_right,black_50%,transparent)]" />

                {/* Previous Button */}
                <button
                    type="button"
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    aria-label="Previous"
                    className="hidden md:flex absolute left-[2vw] top-1/2 -translate-y-1/2 z-9999 items-center justify-center w-[50px] h-[50px] rounded-full border-4 border-white/10 bg-blue-950/30 backdrop-blur-[20px] hover:bg-blue-500 transition-all duration-200 active:scale-[0.95] cursor-pointer dis/abled:cursor-not-allowed dis/abled:opacity-40 dis/abled:hover:bg-blue-950/30"
                >
                    <span className='-rotate-90 flex items-center justify-center text-white'>
                        <ArrowIcon width={24} height={24} />
                    </span>
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    aria-label="Next"
                    className="hidden md:flex absolute right-[2vw] top-1/2 -translate-y-1/2 z-9999 items-center justify-center w-[50px] h-[50px] rounded-full border-4 border-white/10 bg-blue-950/30 backdrop-blur-[20px] hover:bg-blue-500 transition-all duration-200 active:scale-[0.95] cursor-pointer disa/bled:cursor-not-allowed dis/abled:opacity-40 di/sabled:hover:bg-blue-950/30"
                >
                    <span className='rotate-90 flex items-center justify-center text-white'>
                        <ArrowIcon width={24} height={24} />
                    </span>
                </button>

                {/* Dynamic Site Cards Section */}
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
                    ) : siteCards.length > 0 ? (
                        siteCards.slice(0, 7).map((card) => (
                            <div key={card.id} className="relative shrink-0 snap-center cursor-pointer">
                                <Link href={`/${card.slug}`} passHref>
                                    {/* Shadow / Glow Layer */}
                                    <div
                                        className="absolute bg-cover bg-center min-h-[340px] max-h-[340px]
                                                   min-w-[270px] max-w-[270px] rounded-[57px]
                                                   shadow-[0px_0px_15px_rgba(0,0,0,0.3)]
                                                   flex flex-col justify-end overflow-hidden
                                                   scale-x-[1.03] scale-y-[1.025]"
                                        style={{ backgroundImage: `url(${card.image_url})` }}
                                    >
                                        <div className="rotate-[180deg] self-end scale-[1.02]">
                                            <div
                                                className="absolute w-[270px] top-[70px] rotate-[-180deg]
                                                           backdrop-blur-[10px]
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
                                                className="absolute w-[270px] backdrop-blur-[10px]
                                                           [mask-image:linear-gradient(to_bottom,black_50%,transparent)]
                                                           h-[250px]"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center font-bold">
                            No sites found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
