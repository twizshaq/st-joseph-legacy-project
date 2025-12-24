"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import searchIcon from '@/public/icons/search-icon.svg';
import sortIcon from '@/public/icons/sort-icon.svg';
import Footer from "@/app/components/FooterModal"

export type SiteCard = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  category: string;
};

const AllSites = () => {
  // --- STATE ---
  const [activeDot, setActiveDot] = useState(0);
  const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 12; // Adjusted to 12 so it looks good on a 3 or 4 column grid

  // Video header refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // Video Source List
  const videoSources = [
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  ];

  // Video rotation logic
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

  // Fetch all sites
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
          .order('id', { ascending: true }); // Removed category sort, standard ID sort

        if (error) throw error;
        setSiteCards(data || []);
      } catch (error) {
        console.error("Failed to fetch site cards from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteCards();
  }, []);

  // Prevent auto-scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      const prev = history.scrollRestoration as 'auto' | 'manual';
      history.scrollRestoration = 'manual';
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  // --- PAGINATION LOGIC (From SoupBowl) ---
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = siteCards.slice(indexOfFirstSite, indexOfLastSite);
  const pageCount = Math.ceil(siteCards.length / sitesPerPage);
  const pageNumbers = pageCount > 0 ? Array.from({ length: pageCount }, (_, i) => i + 1) : [];

  return (
    <div className='flex flex-col justify-center items-center text-black min-h-screen'>
      
      {/* --- HEADER SECTION (Unchanged) --- */}
      <div ref={headerRef} className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">
        <video ref={videoRef} autoPlay muted playsInline onEnded={handleVideoEnded} className="absolute top-0 left-0 w-full h-full object-cover">
          <source src={videoSources[activeDot]} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
        <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">Explore All Sites</p>
        <div className='absolute bottom-[-34px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] w-[450px] max-w-[90vw]'>
          <div className='bg-white/10 backdrop-blur-[10px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'><Image src={searchIcon} alt="" height={25} /></span>
            <input type="text" placeholder='Search St Joseph' className='bg-black/50 rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none pr-[95px]'/>
            <button className='bg-red-500/0 flex gap-[10px] items-center justify-center absolute font-bold right-[20px] mt-[-40px] text-[#E0E0E0]'>Sort<Image src={sortIcon} alt="" height={23} /></button>
          </div>
        </div>
        <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          {[0, 1, 2, 3].map((i) => (<div key={i} className={`rounded-full h-[7px] transition-all duration-300 ${i === activeDot ? 'bg-[#fff] w-[15px]' : 'bg-[#fff]/30 w-[7px]'}`} />))}
        </div>
      </div>
      <div className='bg-[#ddd]/80 h-[2px] w-[450px] max-w-[70vw] mt-[55px] rounded-full'></div>

      {/* --- GRID & PAGINATION SECTION --- */}
      <div className="w-full mt-[40px] max-w-[1400px] mx-auto px-4 pb-20">
        
        {loading ? (
          <div className="flex items-center justify-center w-full h-[400px]">
            <div
              aria-label="Loading"
              className="animate-spin w-12 h-12 bg-blue-500 [mask-image:url('/loading-icon.png')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-image:url('/loading-icon.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
            />
          </div>
        ) : siteCards.length > 0 ? (
          <>
            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-16 gap-x-8 justify-items-center mb-12">
              {currentSites.map((card) => (
                // Fixed Dimensions Container to preserve existing card styling perfectly
                <div key={card.id} className="relative w-[260px] h-[330px]">
                  
                  {/* Background / shadow layer */}
                  <div
                    className="absolute inset-0 bg-cover bg-center rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <div className="rotate-[180deg] self-end">
                      <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
                    </div>
                  </div>

                  {/* Main card (clickable) */}
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
                    <div className="absolute bottom-0 right-0 rotate-[180deg] pointer-events-none">
                      <div className="bg-blue-500/0 w-[270px] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_50%,transparent)] opacity-100 h-[200px]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CUSTOM PAGINATION BAR (From SoupBowl) */}
            <div className='flex flex-wrap justify-center gap-3 mt-4'>
              {/* Previous Arrow Button */}
              <button 
                onClick={() => {
                   setCurrentPage(currentPage - 1);
                   window.scrollTo({ top: 400, behavior: 'smooth' }); // Optional: scroll to top of grid
                }}
                disabled={currentPage === 1 || siteCards.length === 0}
                className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-default disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Page Number Buttons */}
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => {
                     setCurrentPage(num);
                     window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] font-bold rounded-2xl transition-all ${
                    currentPage === num 
                      ? 'bg-[#007BFF] text-white shadow-[0px_0px_15px_rgba(0,0,0,0.2)] hover:scale-[1.05]' 
                      : 'bg-white/80 border border-slate-200/80 text-slate-500 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:text-blue-600 hover:scale-[1.05]'
                  }`}
                >
                  {num}
                </button>
              ))}
              
              {/* Next Arrow Button */}
              <button 
                onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                disabled={currentPage === pageCount || siteCards.length === 0}
                className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-default disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </>
        ) : (
          <p className="font-bold text-center mt-10">No sites found.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllSites;