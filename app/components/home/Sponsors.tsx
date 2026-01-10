'use client'; 
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

interface Sponsor {
  id: string;
  name: string;
  image_path: string;
  website_url?: string;
  is_active: boolean;
}

export default function Sponsors() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchSponsors = async () => {
            const { data, error } = await supabase
                .from('sponsors')
                .select('*')
                .eq('is_active', true);

            if (data) setSponsors(data as Sponsor[]);
        };
        fetchSponsors();
    }, []);

    useEffect(() => {
        if (sponsors.length > 0 && marqueeRef.current) {
            const marquee = marqueeRef.current;
            if (!marquee) return;

            const images = marquee.querySelectorAll('img');
            const loadPromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.addEventListener('load', resolve, { once: true });
                });
            });

            Promise.all(loadPromises).then(() => {
                const scrollerInner = marquee.firstElementChild as HTMLDivElement | null;
                const scrollerContent = scrollerInner?.querySelector('.flex:not(.duplicate)') as HTMLDivElement | null;

                if (scrollerInner && scrollerContent) {
                    const contentWidth = scrollerContent.getBoundingClientRect().width;
                    const totalWidth = scrollerInner.getBoundingClientRect().width;
                    const perc = (contentWidth / totalWidth) * 100;
                    scrollerInner.style.setProperty('--translate-end', `-${perc}%`);
                    setIsLoaded(true);
                }
            });
        }
    }, [sponsors]);

    const getImageUrl = (path: string) => {
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sponsors/${path}`;
    };

    const SponsorList = ({ isDuplicate = false }: { isDuplicate?: boolean }) => (
        <div className={`flex items-center shrink-0 ${isDuplicate ? 'duplicate' : ''}`}>
            {sponsors.map((sponsor) => (
                <div 
                    key={`${sponsor.id}-${isDuplicate ? 'dup' : 'orig'}`} 
                    className="flex items-center mx-[15px] select-none" 
                >
                    <Image 
                        src={getImageUrl(sponsor.image_path)} 
                        alt={sponsor.name}
                        width={150} 
                        height={80} 
                        priority={true}
                        unoptimized
                        draggable={false}
                        className="w-auto h-[80px] object-contain max-w-none opacity-80 hover:opacity-100 transition-opacity duration-300" 
                    />
                    <div className="w-[2px] h-[30px] bg-black/20 rounded-full ml-[30px] transform-gpu" />
                </div>
            ))}
        </div>
    );

    if (!sponsors.length) return null;

    return (
        <div className='w-full mt-[50px] flex flex-col items-center text-slate-800'>
            <div className='flex flex-col items-center mb-6 px-4 text-center'>
                <p className="font-bold text-[2rem] max-sm:text-[1.5rem]">Our Sponsors</p>
                <p className="text-gray-600">Generous Support provided by</p>
            </div>

            <div
              ref={marqueeRef}
              className="w-[600px] max-w-[90vw] overflow-hidden select-none marquee-mask [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)]"
              style={{ ['--fade' as any]: '100px' }}
            >
                <div 
                    className={`flex w-fit min-w-full transform-gpu hover:[animation-play-state:paused] fix-flicker ${isLoaded ? 'animate-marquee' : ''}`}
                >
                    <SponsorList />
                    <SponsorList isDuplicate={true} />
                </div>
            </div>
        </div>
    );
}