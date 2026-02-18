// src/components/allsites/SiteCardItem.tsx
import React from 'react';
import Link from 'next/link';
import { SiteCard } from '@/app/types';

interface SiteCardItemProps {
    card: SiteCard;
}

export const SiteCardItem = ({ card }: SiteCardItemProps) => {
    return (
        <div className="relative mx-auto w-[260px] h-[330px]">
            <div className="relative w-[260px] h-[330px] scale-100 hover:scale-[1.05] active:scale-[1.05] duration-200">
                {/* Background Image Container */}
                <div
                    className="absolute inset-0 bg-cover bg-center rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                >
                    <div className="rotate-[180deg] self-end">
                        <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
                    </div>
                </div>

                {/* Content Container */}
                <div
                    className="relative h-full w-full bg-cover bg-center rounded-[54px] flex flex-col justify-end overflow-hidden z-10"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                >
                    <Link href={`/${card.slug}`} passHref className="h-full w-full flex flex-col justify-end">
                        <div className="absolute inset-0 bg-black/30 rounded-[50px] pointer-events-none" />
                        <div className="relative z-30 text-center mb-[20px] px-[10px]">
                            <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                                <p className="font-bold text-[1.3rem] mb-[2px]">{card.name}</p>
                                <p className="text-[1rem] px-[5px] line-clamp-2">{card.description}</p>
                            </div>
                        </div>
                    </Link>
                    <div className="rotate-[180deg] self-end">
                        <div
                            className="absolute w-[270px] backdrop-blur-[6px]
                                                           [mask-image:linear-gradient(to_bottom,black_50%,transparent)]
                                                           h-[250px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
