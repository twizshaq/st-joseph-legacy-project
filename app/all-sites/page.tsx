"use client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import searchIcon from '@/public/icons/search-icon.svg';
import sortIcon from '@/public/icons/sort-icon.svg';
import Footer from "@/app/components/FooterModal"
import Portal from "@/app/components/Portal" 
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

import { SiteCardSkeleton } from '@/app/components/SiteCardSkeleton';


export type SiteCard = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  category: string;
  likes_count: number;
};

const AllSitesContent = () => {
  // --- STATE ---
  const [activeDot, setActiveDot] = useState(0);
  const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 12;

  // Refs
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Popup Position State
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  // --- 1. Scroll Effect ---
  const scrollToTopAnchor = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (nextPage: number) => {
    if (pageCount === 0) return;

    const clamped = Math.min(Math.max(nextPage, 1), pageCount);
    if (clamped === currentPage) return;

    window.location.assign(`/all-sites?page=${clamped}`);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    if (Number.isFinite(p) && p >= 1) setCurrentPage(p);
  }, [searchParams]);

  // Toggle Sort Logic
  const toggleSort = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSortOpen && sortBtnRef.current) {
      const rect = sortBtnRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const popupWidth = 285;
      const margin = 10;

      let leftPos = rect.right + window.scrollX - popupWidth;

      if (leftPos + popupWidth > viewportWidth - margin) {
        leftPos = viewportWidth - popupWidth - margin;
      }
      if (leftPos < margin) {
        leftPos = margin;
      }

      setPopupPos({
        top: rect.bottom + window.scrollY + 10,
        left: leftPos
      });
    }
    setIsSortOpen(!isSortOpen);
  };

  // Video Sources
  const videoSources = [
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  ];

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

  // Click Outside Listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortOpen]);

  // Data Fetching
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
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
      } catch (error) {
        console.error("Failed to fetch site cards from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteCards();
  }, []);

  // Scroll Restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      const prev = history.scrollRestoration as 'auto' | 'manual';
      history.scrollRestoration = 'manual';
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  // Filter Logic
  const uniqueCategories = useMemo(() => {
    const cats = new Set(siteCards.map(s => s.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [siteCards]);

  const filteredSites = useMemo(() => {
    let result = siteCards;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((card) => 
        card.name.toLowerCase().includes(lowerQuery) ||
        card.category?.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((card) => card.category === selectedCategory);
    }

    return [...result].sort((a, b) => {
      if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
      if (sortOption === 'popularity') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      return a.id - b.id;
    });
  }, [siteCards, searchQuery, selectedCategory, sortOption]);

  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);
  const pageCount = Math.ceil(filteredSites.length / sitesPerPage);
  const pageNumbers = pageCount > 0 ? Array.from({ length: pageCount }, (_, i) => i + 1) : [];

  return (
    <div className='flex flex-col justify-center items-center text-black min-h-screen'>
      
      {/* Header & Search Sections... */}
      <div ref={headerRef} className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">
        <video ref={videoRef} autoPlay muted playsInline onEnded={handleVideoEnded} className="absolute top-0 left-0 w-full h-full object-cover">
          <source src={videoSources[activeDot]} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
        <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">Explore All Sites</p>
        
        <div className='absolute bottom-[-34px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] w-[450px] max-w-[90vw] z-50'>
          <div className='relative bg-white/10 backdrop-blur-[10px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'><Image src={searchIcon} alt="" height={25} /></span>
            <input 
              type="text" 
              placeholder='Search St Joseph' 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className='bg-black/50 rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none pr-[95px]'
            />
            <button 
              ref={sortBtnRef}
              onClick={toggleSort}
              className='flex gap-[10px] py-[10px] cursor-pointer items-center justify-center absolute font-bold right-[20px] top-[10px] text-[#E0E0E0] transition-colors'
            >
              Sort <Image src={sortIcon} alt="" height={23} />
            </button>

            {isSortOpen && (
              <Portal>
                <div 
                  className="fixed inset-0" 
                  onClick={() => setIsSortOpen(false)} 
                />
                <div 
                  ref={sortMenuRef} 
                  className="absolute mt-[20px]"
                  style={{ top: popupPos.top, left: popupPos.left }}
                >
                  <div className='bg-white/10 backdrop-blur-[20px] rounded-[43px] p-[3px] shadow-[0px_0px_15px_rgba(0,0,0,0.4)]'>
                      <div className="relative w-[300px] bg-black/60 rounded-[40px] p-6 overflow-hidden flex flex-col gap-5 text-white">
                          <div>
                              <p className="text-sm text-gray-300 font-bold mb-3 uppercase tracking-wider ml-1">Sort By</p>
                              <div className="flex flex-col gap-2">
                                  {[
                                      { label: 'Default', value: 'default' },
                                      { label: 'Name (A-Z)', value: 'name_asc' },
                                      { label: 'Popularity', value: 'popularity' }
                                  ].map((opt) => (
                                      <button
                                          key={opt.value}
                                          onClick={() => setSortOption(opt.value)}
                                          className={`text-left px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                                              sortOption === opt.value 
                                              ? 'bg-white text-black shadow-lg scale-[1.02]' 
                                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                          }`}
                                      >
                                          {opt.label}
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <p className="text-sm text-gray-300 font-bold mb-3 uppercase tracking-wider ml-1">Filter By Category</p>
                              <div className="flex flex-wrap gap-2">
                                  {uniqueCategories.map((cat) => (
                                      <button
                                          key={cat}
                                          onClick={() => {
                                              setSelectedCategory(cat);
                                              setCurrentPage(1);
                                          }}
                                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                              selectedCategory === cat
                                              ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                              : 'bg-transparent border-white/20 text-gray-300 hover:border-white/50'
                                          }`}
                                      >
                                          {cat}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </Portal>
            )}
          </div>
        </div>
        <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          {[0, 1, 2, 3].map((i) => (<div key={i} className={`rounded-full h-[7px] transition-all duration-300 ${i === activeDot ? 'bg-[#fff] w-[15px]' : 'bg-[#fff]/30 w-[7px]'}`} />))}
        </div>
      </div>
      <div className='bg-[#ddd]/80 h-[2px] w-[450px] max-w-[70vw] mt-[55px] rounded-full'></div>

      <div className="w-full mt-[40px] max-w-[1400px] mx-auto px-4 pb-20">
        
        {/* Main Grid Container - 1 Col Mobile / 2 Col Tablet / etc. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-16 justify-items-center mb-12">
          {loading ? (
             // Show 8 skeletons while loading (Using the provided SiteCardSkeleton)
             Array.from({ length: 8 }).map((_, i) => (
               <SiteCardSkeleton key={i} />
             ))
          ) : filteredSites.length > 0 ? (
             currentSites.map((card) => (
              <div
                key={card.id}
                className="relative mx-auto w-[260px] h-[330px]"
              >
                <div className="relative w-[260px] h-[330px] origin-top-left scale-100">
                  <div className="absolute inset-0 bg-cover bg-center rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white" style={{ backgroundImage: `url(${card.image_url})` }}>
                    <div className="rotate-[180deg] self-end">
                      <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
                    </div>
                  </div>
                  <div className="relative h-full w-full bg-cover bg-center rounded-[54px] flex flex-col justify-end overflow-hidden z-10" style={{ backgroundImage: `url(${card.image_url})` }}>
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
              </div>
            ))
          ) : null}
        </div>

        {/* Empty State */}
        {!loading && filteredSites.length === 0 && (
          <p className="font-bold text-center mt-10">No sites found.</p>
        )}

        {/* Pagination */}
        {!loading && filteredSites.length > 0 && (
          <div className='flex flex-wrap justify-center gap-3 mt-4'>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-default disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {pageNumbers.map((num) => (
              <button
                key={num}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToPage(num)}
                className={`flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] font-bold rounded-2xl transition-all ${
                  currentPage === num 
                    ? 'bg-[#007BFF] text-white shadow-[0px_0px_15px_rgba(0,0,0,0.2)] hover:scale-[1.05]' 
                    : 'bg-white/80 border border-slate-200/80 text-slate-500 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:text-blue-600 hover:scale-[1.05]'
                }`}
              >
                {num}
              </button>
            ))}
            
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-default disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const AllSites = () => {
  return (
    <Suspense fallback={
       <div className="w-full mt-[60px] max-w-[1400px] mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-16 justify-items-center mb-12">
             {Array.from({ length: 8 }).map((_, i) => <SiteCardSkeleton key={i} />)}
          </div>
       </div>
    }>
      <AllSitesContent />
    </Suspense>
  );
};

export default AllSites;