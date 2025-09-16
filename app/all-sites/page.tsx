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
  category: string;
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
          .from('locations')
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
      <div className="flex justify-center items-center w-full mt-[15px] max-w-[1700px] bg-red-500/0 mx-auto  px-[0vw] py-5  min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center w-full mb-[340px]">
            <div
              aria-label="Loading"
              className="animate-spin w-12 h-12 bg-blue-500 [mask-image:url('/loading-icon.png')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-image:url('/loading-icon.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
            />
          </div>
        ) : siteCards.length > 0 ? (
          <div className='flex flex-row items-center justify-center bg-red-500/0 w-[90vw]'>
            <div className="grid grid-cols-2 gap-4 justify-items-center sm:flex sm:flex-wrap sm:gap-8 sm:justify-center">
              {siteCards.map((card) => (
                <div key={card.id} className="relative">
                  {/* Background / shadow layer (matches home page style) */}
                  <div
                    className="absolute bg-cover bg-center min-h-[340px] max-h-[340px] min-w-[270px] max-w-[270px] rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <div className="rotate-[180deg] self-end">
                      <div
                        className={`
                          bg-blue-500/0
                          absolute w-[270px] top-[70px] rotate-[-180deg]
                          backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px] 
                        `}
                      ></div>
                    </div>
                  </div>

                  {/* Main card (clickable) */}
                  <div
                    className="relative bg-cover bg-center min-h-[340px] max-h-[340px] min-w-[270px] max-w-[270px] rounded-[54px] flex flex-col justify-end overflow-hidden z-10"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <Link href={`/${card.slug}`} passHref>
                      <div className="absolute inset-0 bg-black/30 rounded-[50px]" />
                      <div className="relative z-30 text-center mb-[20px] px-[10px]">
                        <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                          <p className="font-bold text-[1.3rem] mb-[2px]">{card.name}</p>
                          <p className="text-[1rem]">{card.description}</p>
                          <div className='mt-[10px] flex justify-center items-center'>
                            <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] w-[190px] bg-white/10 shadow-[0px_0px_40px_rgba(0,0,0,0.3)] -mr-[2px]'>
                              <div className='bg-black/20 rounded-full px-[15px] py-[6.4px]'>
                                <p className='text-center font-bold text-[.85rem]'>
                                  {card.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="rotate-[180deg] self-end">
                      <div
                        className={
                          `
                            bg-blue-500/0
                            absolute w-[270px]
                            backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_50%,transparent)] opacity-100 h-[250px] 
                          `}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="font-bold self-center text-center">No sites found.</p>
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