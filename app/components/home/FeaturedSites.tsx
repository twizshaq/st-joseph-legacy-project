import React from 'react';
import Link from 'next/link';
import { SiteCard } from '@/app/types';
import { SiteCardSkeleton } from '../SiteCardSkeleton';

interface FeaturedSitesProps {
    siteCards: SiteCard[];
    loading: boolean;
}

export default function FeaturedSites({ siteCards, loading }: FeaturedSitesProps) {
    return (
        <div className="bg-green-500/0 max-w-[1500px] w-full mt-[100px] flex flex-col">
            <div className="bg-red-500/0 px-[5vw]">
                <p className="font-bold text-[2rem] max-sm:text-[1.5rem]">Featured Sites</p>
                <p className="max-w-[700px]">
                    Not sure where to begin? We&apos;ve curated a selection of Featured Sites that perfectly capture the spirit of our project. These locations represent the best of St. Joseph—blending breathtaking heritage with the vital &quot;earth-knowledge&quot; needed to keep our community strong.
                    <br /> <br />
                    When driving around St. Joseph each featured stop is equipped with a physical QR code. When scanned, it reveals the &quot;hidden laye&quot; of the location: the stories of the ancestors who built it, and the modern safety insights provided by the DEO to protect it. Whether you are a lifelong resident or a first-time visitor, these sites offer a deeper look about the location
                </p>
            </div>
            <div className='bg-red-500/0 w-fit self-end mr-[5vw] font-bold mb-[-10px] mt-[20px]'>
                <Link href="/all-sites">View All Sites</Link>
            </div>

            {/* Dynamic Site Cards Section */}
            <div className="flex flex-col px-[5vw] max-sm:px-[0vw] overflow-x-auto hide-scrollbar">
                <div className="mt-[10px] flex flex-row items-center min-h-[450px] gap-[30px] overflow-y-hidden px-[.9vw] max-sm:px-[5vw]">
                    
                    {loading ? (
                        /* Render Skeletons Array */
                        Array.from({ length: 6 }).map((_, i) => (
                            <SiteCardSkeleton key={i} />
                        ))
                    ) : siteCards.length > 0 ? (
                        siteCards.slice(0, 7).map((card) => (
                            <div key={card.id} className="relative shrink-0 snap-center cursor-pointer">
                                <Link href={`/${card.slug}`} passHref>
                                {/* Background/shadow div */}
                                <div
                                    className="absolute bg-cover bg-center min-h-[340px] max-h-[340px] min-w-[270px] max-w-[270px] rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025]"
                                    style={{ backgroundImage: `url(${card.image_url})`}}
                                >
                                    <div className="rotate-[180deg] self-end scale-[1.02]">
                                        <div
                                            className={`
                                              bg-blue-500/0
                                              absolute w-[270px] top-[70px] rotate-[-180deg]
                                              backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]
                                            `}
                                        ></div>
                                    </div>
                                </div>

                                {/* Main card content */}
                                <div
                                    className="relative bg-cover bg-center min-h-[340px] max-h-[340px] min-w-[270px] max-w-[270px] rounded-[54px] flex flex-col justify-end overflow-hidden z-10"
                                    style={{ backgroundImage: `url(${card.image_url})` }}
                                >
                                    {/* <Link href={`/${card.slug}`} passHref> */}
                                        <div className="absolute inset-0 bg-black/30 rounded-[50px]" />
                                        <div className="relative z-30 text-center mb-[20px] px-[10px]">
                                            <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                                                <p className="font-bold text-[1.3rem] mb-[2px]">{card.name}</p>
                                                <p className="text-[1rem]">{card.description}</p>
                                                <div className='mt-[10px] flex justify-center items-center'>
                                                    <div className='whitespace-nowrap rounded-full p-[2px] w-[190px] bg-white/10 shadow-[0px_0px_40px_rgba(0,0,0,0.3)] -mr-[2px]'>
                                                        <div className='bg-black/20 rounded-full px-[15px] py-[6.4px]'>
                                                            <p className='text-center font-bold text-[.85rem]'>{card.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {/* </Link> */}
                                    <div className="rotate-[180deg] self-end ">
                                        <div
                                            className={`
                                              bg-blue-500/0
                                              absolute w-[270px]
                                              backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_50%,transparent)] opacity-100 h-[250px]
                                            `}
                                        ></div>
                                    </div>
                                </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='w-[100vw]'>
                            <p className="font-bold self-center text-center">No sites found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}