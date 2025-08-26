"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { flushSync } from 'react-dom';
// CORRECTED IMPORT PATH: Changed 'FullMap' to 'MapFull'
import MapFull from '@/app/components/MapFull';
import searchIcon from '@/public/icons/search-icon.svg';
import Image from 'next/image';
import { Feature, Point, FeatureCollection } from 'geojson';
import arrowIcon from "@/public/icons/arrow-icon.svg"
import linkIcon from "@/public/icons/link-icon.svg"
import { createClient } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---

type Zoomable = { zoomIn: () => void; zoomOut: () => void };

export type Site = {
  id: number;
  name: string;
  category: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  imageUrl: string;
  colorhex: string;
};

interface SupabaseSiteData {
  id: number;
  name: string | null;
  category: string | null;
  description: string | null;
  longitude: string | null;
  latitude: string | null;
  pointimage: string | null;
  colorhex: string | null;
}

// --- SEARCH RESULTS COMPONENT ---

function SearchResults({
  sites,
  selectedSite,
  setSelectedSite,
  mobileSearchInputRef,
  mobileSearchReady,
  handleMobileSearchTap,
  mobileSearchOpen,
}: {
  sites: Site[];
  selectedSite: Site | null;
  setSelectedSite: (s: Site | null) => void;
  mobileSearchInputRef: React.RefObject<HTMLInputElement | null>;
  mobileSearchReady: boolean;
  handleMobileSearchTap: () => void;
  mobileSearchOpen: boolean;
}) {
  // NEW: State to track if the content is scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  // NEW: Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  // If no site is selected (i.e., the detail view is closed)
  if (!selectedSite) {
    // Reset the scrolled state
    setIsScrolled(false);
    
    // Also reset the actual scroll position of the container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }
}, [selectedSite]);

  // NEW: Update isScrolled based on scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      setIsScrolled(scrollTop > 0);
    }
  };

  const handleHeaderClick = () => {
    if (!mobileSearchOpen) {
      handleMobileSearchTap();
    }
  };

  return (
    <div className='relative w-full h-full'>
      {/* VIEW 1: The List View (Search Bar + Results) */}
      <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-300 ${selectedSite ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`relative transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'mt-[13px] w-[93%] mx-auto' : 'w-full self-center'}`}>
          <span className='absolute z-10 mt-[11.5px] ml-[15px] fill-[#E0E0E0]'>
            <Image src={searchIcon} alt='Search Icon' height={25} />
          </span>
          <input
            ref={mobileSearchInputRef}
            type='text'
            placeholder='Search St Joseph'
            readOnly={!mobileSearchReady}
            onPointerDown={handleMobileSearchTap}
            inputMode='search'
            className="bg-black/40 rounded-full h-[50px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none"/>
        </div>
        {mobileSearchOpen && (
          <div className='mt-2 overflow-y-auto overflow-x-hidden flex-1 rounded-[16px]'>
            <ul className='px-3 pb-[5px] gap-[10px] mt-[10px] flex flex-col'>
              {sites.map((site) => (
                <li key={site.id}>
                  <button
                    onClick={() => setSelectedSite(site)}
                    className='flex flex-col w-full text-left rounded-[33px] bg-black/40 hover:bg-black/40 transition-colors duration-150 px-4 py-4 gap-3 mb-2'
                  >
                    <div className='flex-1'>
                      <div className='font-semibold text-white leading-tight text-[1.2rem]'>{site.name}</div>
                      <div className='text-sm text-[#E0E0E0]/80 line-clamp-2 pr-4 text-wrap'>{site.description}</div>
                    </div>
                    <div className='relative flex flex-row gap-2'>
                      {/* Placeholder images */}
                      <div className='min-w-[60px] min-h-[60px] overflow-hidden rounded-[22px] bg-[#FFCEC4] border-white border-2'></div>
                      <div className='absolute ml-[45px] min-w-[60px] min-h-[60px] overflow-hidden rounded-[22px] bg-[#FFCEC4] border-white border-2 shadow-[0px_0px_15px_rgba(0,0,0,0.3)]'></div>
                      <div className='absolute ml-[90px] min-w-[60px] min-h-[60px] overflow-hidden rounded-[22px] bg-[#FFCEC4] border-white border-2 shadow-[0px_0px_15px_rgba(0,0,0,0.3)]'></div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* VIEW 2: The Detail View */}
      <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-400 ${selectedSite ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {selectedSite && (
          <>
            <div onClick={handleHeaderClick} className={`absolute  z-10 flex items-start px-[10px] justify-between transition-all duration-400 rounded-full ${mobileSearchOpen ? 'bg-black/0 pt-[7.5px] pb-[0px] w-[100%] px-[15px]' : 'bg-black/0 mt-[0px] py-[7.5px] w-[100%]'}`}>

              <button onClick={() => setSelectedSite(null)} className={`inline-flex items-center gap-2 text-white/90 hover:text-white active:opacity-80 ${mobileSearchOpen ? 'mt-[5px]' : 'mt-[0px]'}`}>

                <span className='rotate-[-90deg]'><Image src={arrowIcon} alt='Back Icon' height={35} /></span>
              </button>
              <div className='flex flex-col text-right pr-3 pt-1'>
                <h2 className={`font-bold text-white text-[1.23rem] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transition-all duration-400 ${mobileSearchOpen ? 'mt-[0px]' : 'mt-[-10px]'}`}>
                  {selectedSite.name}
                </h2>
                {mobileSearchOpen ? (
                  <p className='text-[#E0E0E0] mt-[-5px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>{selectedSite.category}</p>
                ) : (
                  <p className='text-[#E0E0E0] mt-[-5px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>{selectedSite.category}</p>
                )}
              </div>
            </div>
            <>
              <div
                style={{ '--bg-color': selectedSite?.colorhex || '#fff' } as React.CSSProperties}
                className={`
                  bg-[var(--bg-color)]/30
                  absolute w-full
                  transition-all duration-400 ease-in-out backdrop-blur-[15px]
                  ${isScrolled ? 'backdrop-blur-[15px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] opacity-100' : 'backdrop-blur-[15px] [mask-image:linear-gradient(to_bottom,black_0%,transparent)] opacity-0'}
                  ${mobileSearchOpen ? 'h-[130px]' : 'h-0 opacity-0'}
                `}
              ></div>

              <div
                className={`
                  absolute w-full bg-transparent
                  transition-all duration-400 ease-in-out backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,black_20%,transparent)]
                  ${isScrolled ? 'backdrop-blur-[20px] opacity-100' : 'backdrop-blur-0 opacity-0'}
                  ${mobileSearchOpen ? 'h-[50px]' : 'h-0 opacity-0'}
                `}
              ></div>

              <div
                className={`
                  absolute w-full bg-transparent
                  transition-all duration-400 ease-in-out [mask-image:linear-gradient(to_bottom,black_10%,transparent)]
                  ${isScrolled ? 'backdrop-blur-[5px] opacity-100' : 'backdrop-blur-0 opacity-0'}
                  ${mobileSearchOpen ? 'h-[20px]' : 'h-0 opacity-0'}
                `}
              ></div>
            </>
           <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={`
                overflow-y-auto flex-1 p-0 space-y-4 
                transition-opacity duration-300 ease-in-out
                ${mobileSearchOpen ? 'opacity-100 delay-150' : 'opacity-0'}
              `}
            >
              {/* Example detail card */}
              <div className='flex flex-col rounded-[16px] overflow-hidden pb-3 gap-5'>
                <div className='px-4'>
                  {/* <h3 className='text-white text-lg font-bold mb-1'>{selectedSite.name}</h3> */}
                  <div className='flex gap-4 text-sm text-[#E0E0E0] mt-[100px]'>
                    <div className='flex flex-col text-center py-[7px] items-center justify-center cursor-pointer whitespace-nowrap rounded-[20px] p-[2px] bg-black/0'>
                      <Link href="/sign-up">
                          <p className='text-white font-bold text-[.9rem]'>Distance</p>
                          <p>13km</p>
                      </Link>
                    </div>
                    <div className='flex flex-col text-center py-[7px] items-center justify-center cursor-pointer whitespace-nowrap rounded-[20px] p-[2px] bg-black/0'>
                      <Link href="/sign-up">
                          <p className='text-white font-bold text-[.8rem]'>Hours</p>
                          <p className='text-green-500 font-bold '>Open</p>
                      </Link>
                    </div>
                    {/* <div className='flex flex-col text-center py-[7px] items-center justify-center cursor-pointer whitespace-nowrap rounded-[20px] p-[2px] bg-black/0'>
                      <Link href="/sign-up">
                          <p className='text-white font-bold text-[.9rem]'>Distance</p>
                          <p>13km</p>
                      </Link>
                    </div> */}
                  </div>
                </div>
                <div className='flex flex-col gap-2 text-sm text-[#E0E0E0] bg-blue-500/0 mt-[0px]'>
                  <p className='font-bold text-[1.2rem] px-4'>Photo Gallery</p>
                  <div className='flex flex-row gap-2 text-sm text-[#E0E0E0] w-[100%] px-4 overflow-x-scroll mt-[0px] bg-green-500/0 hide-scrollbar'>
                    <div className='bg-red-400 min-h-[120px] min-w-[150px] rounded-[30px]'></div>
                    <div className='flex flex-col gap-2'>
                      <div className='bg-red-400 h-[120px] w-[120px] rounded-[30px]'></div>
                      <div className='bg-red-400 h-[120px] w-[120px] rounded-[30px]'></div>
                    </div>
                      <div className='bg-red-400 min-h-[120px] min-w-[150px] rounded-[30px]'></div>
                    <div className='flex flex-col gap-2'>
                      <div className='bg-red-400 h-[120px] w-[120px] rounded-[30px]'></div>
                      <div className='bg-red-400 h-[120px] w-[120px] rounded-[30px]'></div>
                    </div>
                    <button className='cursor-pointer flex justify-center items-center bg-red-400 min-h-[120px] min-w-[150px] rounded-[30px]'>
                      <p>View All Photos</p>
                    </button>
                  </div>
                </div>
                <div className='px-4 mt-[40px]'>
                  <p className='font-bold text-[1.2rem]'>Details</p>
                  <div className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                      <p className='text-[#fff] font-bold'>Hours</p>
                      <div className='flex flex-row gap-9'>
                        <p>Mon - friday <br /> 6:00 am - 6:00 pm</p>
                        <p>Saturday <br /> 9:00 am - 3:00 pm</p>
                      </div>
                    </div>
                    <div className='bg-white/5 h-[2px] w-[95%] self-center'></div>
                    <div className='flex flex-col'>
                      <p className='font-bold'>Website</p>
                      <div className='flex gap-1'>
                        <p>www.example.com</p>
                        <Image src={linkIcon} alt='Back Icon' height={15} />
                      </div>
                    </div>
                    <div className='bg-white/5 h-[2px] w-[95%] self-center'></div>
                    <div className='flex flex-col'>
                      <p className='font-bold'>Contact</p>
                      <p>1(246)823-5885</p>
                      <p>shaquxn@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-[15px] mb-[17px]'>
                <div className='bg-white/5 h-[2px] w-[65%] self-center'></div>
                  <div className='self-center cursor-pointer whitespace-nowrap rounded-full p-[2.4px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0)] -mr-[2px]'>
                    <Link href="/sign-up">
                      <div className='flex flex-col text-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[6.4px]'>
                        <span className='text-white font-bold'>Availible Tours</span>
                      </div>
                    </Link>
                  </div>
                  <div className='self-center cursor-pointer whitespace-nowrap rounded-full p-[2.4px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0)] -mr-[2px]'>
                    <Link href="/sign-up">
                      <div className='flex flex-col text-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[6.4px]'>
                        <span className='text-white font-bold'>Add to Self Guided Tour</span>
                      </div>
                    </Link>
                  </div>
              </div>
              {/* Add more detail cards as needed */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function FullScreenMapPage() {
  const mapRef = useRef<Zoomable | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchReady, setMobileSearchReady] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Ensure the environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Please check your .env.local file.");
      return;
    }
    
    // Initialize the Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchSites = async () => {
      try {
        // Fetch the data from your 'sites' table
        const { data, error } = await supabase
          .from('sites') // <-- Your table name here
          .select('*');

        if (error) {
          // This will catch any errors from the Supabase query
          throw error;
        }
        
        // Map the Supabase data to your application's 'Site' type
        const siteData: Site[] = data.map((entry: SupabaseSiteData) => ({
          id: entry.id,
          name: entry.name || 'Unnamed Site',
          category: entry.category || '',
          description: entry.description || '',
          // Combine longitude and latitude from your table into the coordinates array
        coordinates: [parseFloat(entry.longitude || '') || 0, parseFloat(entry.latitude || '') || 0],
          imageUrl: entry.pointimage || '',
          colorhex: entry.colorhex || '#fff',
        })).filter((site): site is Site => site.id !== null && site.coordinates.length === 2); // Ensure essential data is present

        setSites(siteData);

      } catch (error) {
        console.error("Failed to fetch or parse site data from Supabase:", error);
      }
    };
    
    fetchSites();
  }, []);

  // --- DATA TRANSFORMATION ---
  const geojsonData = useMemo((): FeatureCollection<Point> | null => {

    const features: Feature<Point>[] = sites.map(site => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: site.coordinates,
      },
      properties: { ...site }, // Pass all site data in properties
    }));

    return { type: 'FeatureCollection', features };
  }, [sites]);

  // --- HANDLERS ---
  // AFTER THE FIX
    const handleMarkerClick = useCallback((feature: Feature<Point> | null) => {
    if (!feature || !feature.properties) {
      setSelectedSite(null);
      return;
    }

    const site = sites.find(s => s.id === feature.properties?.id);

    if (site) {
      setSelectedSite(site);
      setMobileSearchOpen(true);
    } else {
      setSelectedSite(null);
    }
  }, [sites]);

  const closeSearchPanels = () => {
    setMobileSearchOpen(false);
    setMobileSearchReady(false);
  };

  const handleMobileSearchTap = () => {
    if (!mobileSearchOpen) {
      setMobileSearchOpen(true);
      setMobileSearchReady(false);
      return;
    }
    if (!mobileSearchReady) {
      try { mobileSearchInputRef.current?.removeAttribute('readonly'); } catch {}
      flushSync(() => setMobileSearchReady(true));
      const el = mobileSearchInputRef.current;
      if (el) {
        el.focus({ preventScroll: true });
        try { el.setSelectionRange(el.value.length, el.value.length); } catch {}
      }
    }
  };

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!desktopSearchRef.current?.contains(target) && !mobileSearchRef.current?.contains(target)) {
        closeSearchPanels();
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [mobileSearchOpen]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  // --- RENDER ---
  return (
    <div className="h-[100dvh] overflow-hidden">
      <div className="absolute inset-0">
        <MapFull ref={mapRef} onMarkerClick={handleMarkerClick} geojsonData={geojsonData} /> 
      </div>

      {/* Desktop Zoom Controls */}
      <div className='absolute bottom-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] hidden sm:block'>
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
          <div className='rounded-full bg-black/40 backdrop-blur-[5px] flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
            <button onClick={handleZoomIn} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
              <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
              <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
            </button>
            <button onClick={handleZoomOut} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
              <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Search Panel */}
      <div className='absolute bottom-[20px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[400px] hidden sm:block'>
        <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[20px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[43px]`}>
          <div className={`bg-black/45 relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[55vh] rounded-[40px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
            <SearchResults sites={sites} selectedSite={selectedSite} setSelectedSite={setSelectedSite} mobileSearchInputRef={mobileSearchInputRef} mobileSearchReady={mobileSearchReady} handleMobileSearchTap={handleMobileSearchTap} mobileSearchOpen={mobileSearchOpen} />
          </div>
        </div>
      </div>

      {/* Mobile-only stacked controls */}
      <div className='absolute bg-red-400/0 bottom-[20px] right-[15px] sm:hidden flex flex-col items-end gap-[0px] w-[calc(100vw-25px)]'>
        <div className={`absolute right-1 bottom-[0px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'opacity-0 pointer-events-none translate-y-0' : 'opacity-100'}`}>

          <div className='absolute bottom-[80px] right-0 bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className='rounded-full bg-black/45 backdrop-blur-[5px] flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
              <button onClick={handleZoomIn} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
              </button>
              <button onClick={handleZoomOut} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
              </button>
            </div>
          </div>

        </div>
        
        {/* Mobile Search Panel */}
        <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] w-full'>
          <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[20px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[43px]`}>
            <div className={`bg-black/45 relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] rounded-[40px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
              <SearchResults sites={sites} selectedSite={selectedSite} setSelectedSite={setSelectedSite} mobileSearchInputRef={mobileSearchInputRef} mobileSearchReady={mobileSearchReady} handleMobileSearchTap={handleMobileSearchTap} mobileSearchOpen={mobileSearchOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}