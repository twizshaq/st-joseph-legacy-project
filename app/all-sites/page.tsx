"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import searchIcon from '@/public/icons/search-icon.svg';
import sortIcon from '@/public/icons/sort-icon.svg';

// Type definition remains the same
export type SiteCard = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  slug: string;
};

const AllSites = () => {
  const [activeDot, setActiveDot] = useState(0);
  const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});

  // Video header logic remains the same
  const videoSources = [
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  ];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const handleVideoEnded = () => setActiveDot((prev) => (prev + 1) % 4);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause(); v.currentTime = 0; v.load();
      const p = v.play();
      if (p && typeof (p as Promise<void>).then === 'function') {
        (p as Promise<void>).catch(() => {});
      }
    } catch {}
  }, [activeDot]);

  // --- NEW: Fetch **all** site cards (no pagination) ---
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing.");
      setLoading(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchSiteCards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_cards')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        setSiteCards(data || []);
        const initialStates: Record<number, boolean> = {};
        (data || []).forEach((card: SiteCard) => {
          initialStates[card.id] = true;
        });
        setImageLoadingStates(initialStates);
      } catch (error) {
        console.error("Failed to fetch site cards from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteCards();
  }, []);

  // Prevent browsers from auto-restoring the last scroll position during state changes
  useEffect(() => {
    if ('scrollRestoration' in history) {
      const prev = history.scrollRestoration as 'auto' | 'manual';
      history.scrollRestoration = 'manual';
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  const handleImageLoad = (cardId: number) => {
    setImageLoadingStates((prevState) => ({
      ...prevState,
      [cardId]: false,
    }));
  };

  return (
    <div className='flex flex-col justify-center items-center text-black'>
      {/* --- HEADER SECTION (No changes) --- */}
      <div ref={headerRef} className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">
        <video ref={videoRef} autoPlay muted playsInline onEnded={handleVideoEnded} className="absolute top-0 left-0 w-full h-full object-cover">
          <source src={videoSources[activeDot]} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
        <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">Explore All Sites</p>
        <div className='absolute bottom-[-34px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] w-[450px] max-w-[90vw]'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'><Image src={searchIcon} alt="" height={25} /></span>
            <input type="text" placeholder='Search St Joseph' className='bg-black/50 backdrop-blur-[100px] rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none pr-[95px]'/>
            <button className='bg-red-500/0 flex gap-[10px] items-center justify-center absolute font-bold right-[20px] mt-[-40px] text-[#E0E0E0]'>Sort<Image src={sortIcon} alt="" height={23} /></button>
          </div>
        </div>
        <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          {[0, 1, 2, 3].map((i) => (<div key={i} className={`rounded-full h-[7px] transition-all duration-300 ${i === activeDot ? 'bg-[#fff] w-[15px]' : 'bg-[#fff]/30 w-[7px]'}`} />))}
        </div>
      </div>
      <div className='bg-[#ddd]/80 h-[2px] w-[450px] max-w-[70vw] mt-[55px] rounded-full'></div>

      {/* --- SITES GRID SECTION (Two cols on mobile, flex on larger screens) --- */}
      <div className="flex justify-center w-full max-w-[1700px] bg-red-500/0 mx-auto  px-[0vw] py-5  min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center w-full mb-[340px]">
            <div
              aria-label="Loading"
              className="animate-spin w-12 h-12 bg-blue-500 [mask-image:url('/loading-icon.png')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-image:url('/loading-icon.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
            />
          </div>
        ) : siteCards.length > 0 ? (
          <div className='flex flex-row items-center justify-center bg-red-500/0 w-[90vw]'>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-8 sm:justify-start">
              {siteCards.map((card) => (
                <div key={card.id} className="relative w-[300px] max-sm:w-[175px] h-[350px] max-sm:h-[220px] max-sm:rounded-[35px] rounded-[50px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-3 py-5 flex flex-col justify-end text-white group overflow-hidden">
                  <Link href={`/${card.slug}`} passHref>
                    <div className="absolute inset-0">
                      {imageLoadingStates[card.id] && (
                        <div className="absolute inset-0 bg-gray-500 animate-pulse" />
                      )}
                      <Image
                        src={card.image_url}
                        alt={card.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 300px"
                        className={`object-cover transition-opacity duration-300 ${imageLoadingStates[card.id] ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => handleImageLoad(card.id)}
                        unoptimized
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/30 rounded-[32px] group-hover:bg-black/50 transition-colors duration-300"></div>
                    <div className='absolute flex flex-col bottom-[10px] bg-red-500/0 max-sm:left-[15px] left-[20px] w-[90%] z-[20] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                      <p className="font-bold text-[1.3rem] max-sm:text-[1.1rem] text-shadow-[0px_0px_10px_rgba(0,0,0,0)]">{card.name}</p>
                      <p className="text-sm max-sm:hidden opacity-90 mb-4 max-w-[250px] text-shadow-[0px_0px_10px_rgba(0,0,0,0)]">{card.description}</p>
                    </div>
                    <div className="relative z-10">
                      <div className='flex justify-between items-end'>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">No sites found.</p>
        )}
      </div>

      {/* --- Pagination controls removed entirely --- */}

      {/* Footer (No changes) */}
      <footer className='bg-blue-900 text-white w-full mt-[100px] pb-12 pt-0 px-[4vw]'>
        <div className='max-w-7xl mx-auto mt-10 pt-8 border-t border-blue-800 flex flex-col lg:flex-row lg:justify-between items-start lg:items-center text-sm text-blue-300'>
          <p>© 2025 DEO Project. All Rights Reserved.</p>
          <div className='flex gap-4 mt-4 lg:mt-0'>
            <a href="/privacy" className='hover:text-white transition-colors'>Privacy Policy</a>
            <a href="/terms" className='hover:text-white transition-colors'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllSites;