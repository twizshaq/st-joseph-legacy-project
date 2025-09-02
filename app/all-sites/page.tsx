"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import searchIcon from '@/public/icons/search-icon.svg';
import sortIcon from '@/public/icons/sort-icon.svg';

// Define the type for your site card data to ensure type safety
export type SiteCard = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  slug: string;
};

const AllSites = () => {
  const [activeDot, setActiveDot] = useState(0);
  // --- NEW: State to hold the site card data ---
  const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
  const [loading, setLoading] = useState(true); // To show a loading message

  // Video sources for the header
  const videoSources = [
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  ];

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoEnded = () => {
    setActiveDot((prev) => (prev + 1) % 4);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
      v.load();
      const p = v.play();
      if (p && typeof (p as Promise<void>).then === 'function') {
        (p as Promise<void>).catch(() => {});
      }
    } catch {}
  }, [activeDot]);

  // --- NEW: useEffect to fetch data from Supabase ---
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
      try {
        setLoading(true);
        const { data, error } = await supabase.from('site_cards').select('*');
        if (error) {
          throw error;
        }
        setSiteCards(data || []);
      } catch (error) {
        console.error("Failed to fetch site cards from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteCards();
  }, []); // The empty dependency array ensures this runs only once when the component mounts

  return (
    <div className='flex flex-col justify-center items-center text-black'>
      {/* --- HEADER SECTION (No changes here) --- */}
      <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={videoSources[activeDot]} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
        <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">
          Explore All Sites
        </p>
        <div className='absolute bottom-[-34px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] w-[450px] max-w-[90vw]'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'>
              <Image src={searchIcon} alt="" height={25} className=''/>
            </span>
            <input type="text" name="" id="" placeholder='Search St Joseph' className='bg-black/50 backdrop-blur-[100px] rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none pr-[95px]'/>
            <button className='bg-red-500/0 flex gap-[10px] items-center justify-center absolute font-bold right-[20px] mt-[-40px] text-[#E0E0E0]'>Sort<Image src={sortIcon} alt="" height={23} className=''/></button>
          </div>
        </div>
        <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-full h-[7px] transition-all duration-300 ${i === activeDot ? 'bg-[#fff] w-[15px]' : 'bg-[#fff]/30 w-[7px]'}`}
            />
          ))}
        </div>
      </div>
      <div className='bg-[#eee] h-[2px] w-[450px] max-w-[70vw] mt-[70px] rounded-full'></div>

      {/* --- NEW: SITES GRID SECTION --- */}
      <div className="w-full max-w-[1500px] px-[5vw] py-12">
        {loading ? (
          <p className="text-center">Loading sites...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {siteCards.map((card) => (
              <div 
                key={card.id}
                className="relative bg-cover bg-center h-[400px] rounded-[50px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end text-white group overflow-hidden"
                style={{ backgroundImage: `url(${card.image_url})` }}
              >
                <div className="absolute inset-0 bg-black/30 rounded-[32px] group-hover:bg-black/50 transition-colors duration-300"></div>
                
                <div className="relative z-10">
                  <p className="font-bold text-[1.3rem]">{card.name}</p>
                  <p className="text-sm opacity-90 mb-4">{card.description}</p>
                  <Link href={`/site/${card.slug}`} passHref>
                    <button className="w-full backdrop-blur-[10px] bg-white/20 rounded-full flex justify-center items-center px-[15px] py-[10px] border-2 border-white/30 font-bold hover:bg-white/30 transition-colors duration-300">
                      Explore Site
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSites;