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
import DirectionsIcon from "@/public/icons/directions-icon"
import ShareIcon from "@/public/icons/share-icon"
import LikeButton from '@/app/components/LikeButton';
import InfoIcon from "@/public/icons/info-icon"
import PlayIcon from "@/public/icons/play-icon"
import InfoPopup from '@/app/components/InfoPopup';
import DirectionsPopup from '@/app/components/DirectionsPopup';

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
  slug: string;
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
  slug: string;
}

// --- MOCK MEDIA DATA (For styling View 2) ---
const MOCK_GALLERY = [
  { type: 'image', src: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg' },
  { type: 'image', src: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg' },
  { type: 'image', src: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg' },
  { type: 'video', src: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' }, // Represents a video thumb
  { type: 'image', src: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg' },
  { type: 'image', src: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg' },
];

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
          <div className='mt-2 overflow-y-auto overflow-x-hidden flex-1 pb-[10px]'>
            <ul className='px-3 pb-[5px] gap-[10px] mt-[10px] flex flex-col'>
              {sites.map((site) => (
                <li key={site.id}>
                  <div className='bg-white/10 active:scale-[.98] rounded-[37px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
                    <button
                      onClick={() => setSelectedSite(site)}
                      className='flex w-full text-wrap text-left cursor-pointer rounded-[35px] bg-black/40 overflow-hidden hover:bg-black/40 transition-colors duration-150 p-2 gap-3'
                    >
                      {/* <div className='bg-white/10 rounded-[27px] p-[2.5px] shadow-[0px_0px_30px_rgba(0,0,0,.2)]'> */}
                        {site.imageUrl ? (
                          <Image 
                            src={site.imageUrl} 
                            alt='site image' 
                            height={80} 
                            width={80} 
                            className='min-w-[80px] min-h-[80px] object-cover rounded-[28px] max-w-[80px] max-h-[80px]'
                          />
                        ) : (
                          /* Fallback: Show a colored box if no image exists to prevent the crash */
                          <div className='min-w-[80px] min-h-[80px] bg-black/20 rounded-[28px]' />
                        )}
                      {/* </div> */}
                      <div className='flex-1'>
                        <div className='font-semibold text-white leading-tight text-[1.2rem]'>{site.name}</div>
                        <div className='text-sm text-[#E0E0E0]/80 line-clamp-2 pr-4 text-wrap'>{site.category}</div>
                      </div>
                      <div className='relative flex flex-row gap-2'>
                        {/* Placeholder images */}
                        {/* <div className='min-w-[60px] min-h-[60px] overflow-hidden rounded-[22px] bg-[#FFCEC4] border-white border-2'></div> */}
                        {/* <div className='absolute ml-[45px] min-w-[60px] min-h-[60px] overflow-hidden rounded-[22px] bg-[#FFCEC4] border-white border-2 shadow-[0px_0px_15px_rgba(0,0,0,0.3)]'></div>
                        <div className='absolute ml-[90px] min-w-[60px] min-h-[60px] overflow-hidden rounded-[22px] bg-[#FFCEC4] border-white border-2 shadow-[0px_0px_15px_rgba(0,0,0,0.3)]'></div> */}
                      </div>
                    </button>
                  </div>
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
          <style jsx>{`
              @keyframes marquee-loop {
                0%, 15% { transform: translateX(0%); }      /* Stay (Start) */
                45% { transform: translateX(-105%); }       /* Exit completely Left */
                45.01% { transform: translateX(105%); }     /* Teleport to Right (Hidden) */
                75%, 100% { transform: translateX(0%); }    /* Enter & Stay (End) */
              }
              
              .scrolling-text {
                display: inline-block;
                white-space: nowrap;
                /* 12s duration = quick scroll, long read time */
                animation: marquee-loop 12s linear infinite; 
              }
            `}</style>
            <div onClick={handleHeaderClick} className={`absolute  z-30 flex items-start px-[10px] justify-between transition-all duration-400 rounded-full ${mobileSearchOpen ? 'bg-black/0 pt-[7.5px] mt-[6px] pb-[0px] w-[100%] px-[15px]' : 'bg-black/0 mt-[0px] py-[7.5px] w-[100%]'}`}>

              <button onClick={() => setSelectedSite(null)} className={`inline-flex pr-[10px] active:scale-[.95] shrink-0 cursor-pointer items-center gap-2 text-white/90 hover:text-white active:opacity-80 ${mobileSearchOpen ? 'mt-[7px]' : 'mt-[-1px]'}`}>

                <span className='rotate-[-90deg]'><Image src={arrowIcon} alt='Back Icon' height={35} /></span>
              </button>
              <div className='flex flex-col text-right pr-3 pt-1 flex-1 mt-[-11px] min-w-0 overflow-hidden relative'>
                <div className="w-full overflow-hidden">
                  <h2 className={`font-bold text-white text-[1.23rem] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transition-all duration-400 ${mobileSearchOpen ? 'mt-[10px]' : 'mt-[0px]'} ${selectedSite.name.length > 20 ? 'scrolling-text' : 'truncate'}`}>
                    {selectedSite.name}
                  </h2>
              </div>
                {mobileSearchOpen ? (
                  <p className='text-[#E0E0E0] mt-[-5px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>{selectedSite.category}</p>
                ) : (
                  <p className='text-[#E0E0E0] mt-[-5px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>{selectedSite.category}</p>
                )}
              </div>
            </div>
            <>
              {/* <div
                style={{ '--bg-color': selectedSite?.colorhex || '#fff' } as React.CSSProperties}
                className={`
                  bg-[var(--bg-color)]/30
                  absolute w-full
                  transition-all duration-400 ease-in-out backdrop-blur-[15px]
                  ${isScrolled ? 'backdrop-blur-[15px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] opacity-100' : 'backdrop-blur-[15px] [mask-image:linear-gradient(to_bottom,black_0%,transparent)] opacity-0'}
                  ${mobileSearchOpen ? 'h-[130px]' : 'h-0 opacity-0'}
                `}
              ></div> */}

              <div
                className={`
                  absolute w-full bg-[#676767]
                  transition-all duration-400 ease-in-out z-[20] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]
                  ${isScrolled ? 'opacity-100' : 'opacity-0'}
                  ${mobileSearchOpen ? 'h-[100px]' : 'h-0 opacity-0'}
                `}
              ></div>

              {/* <div
                className={`
                  absolute w-full bg-transparent
                  transition-all duration-400 ease-in-out [mask-image:linear-gradient(to_bottom,black_10%,transparent)]
                  ${isScrolled ? 'backdrop-blur-[5px] opacity-100' : 'backdrop-blur-0 opacity-0'}
                  ${mobileSearchOpen ? 'h-[20px]' : 'h-0 opacity-0'}
                `}
              ></div> */}
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
                <div className='flex flex-col gap-2 text-sm text-[#E0E0E0] bg-blue-500/0 mt-[90px]'>
                  <p className='font-bold text-[1.2rem] px-4'>Description</p>
                  <p className='text-black font-[500] px-4 text-white'>{selectedSite.description}</p>
                  {/* <div className='flex flex-row gap-2 text-sm text-[#E0E0E0] w-[100%] px-4 overflow-x-scroll mt-[0px] bg-green-500/0 hide-scrollbar'>
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
                  </div> */}
                </div>
                <div className='px-4'>
                  {/* <h3 className='text-white text-lg font-bold mb-1'>{selectedSite.name}</h3> */}
                  <div className='flex gap-4 text-sm text-[#E0E0E0]'>
                    
                    <div className='flex w-[100%] text-center items-center bg-black/0 gap-[5px]'>
                      <DirectionsPopup 
                        name={selectedSite.name} 
                        lat={selectedSite.coordinates[1]} 
                        lng={selectedSite.coordinates[0]} 
                      />
                          {/* <p className='text-white font-bold text-[1rem] bg-red-500 py-[20px] w-fit px-[20px]'>Like</p> */}
                          {/* <div className='bg-white/10 active:scale-[.98] rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'> */}
                          <LikeButton/>
                          {/* </div> */}
                          {/* <HeartIcon size={80} color="#fff" className='bg-black/40 p-3'/> */}
                          <Link href={`/${selectedSite.slug}`} passHref>
                            <div className='bg-white/10 active:scale-[.98] rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
                              <ShareIcon size={45} color="#fff" className='bg-black/30 p-[13px] h-[100%] w-[100%] rounded-[23px]'/>
                            </div>
                          </Link>
                          {/* <p className='text-white font-bold text-[1rem] bg-red-500'>Custom Tour</p> */}
                          {/* <p>13km</p> */}
                      {/* </Link> */}
                    </div>
                  </div>
                </div>

              </div>

              <div className='flex flex-col gap-[15px] mb-[17px]'>
                <div className='bg-white/10 h-[2px] w-[65%] self-center'></div>
                <p className='font-bold text-[1.2rem] px-4'>Media</p>
                <div className='flex flex-row gap-2 text-sm text-[#E0E0E0] w-[100%] px-4 overflow-x-scroll mt-[0px] bg-green-500/0 hide-scrollbar'>
                          {/* Item 1: Large Image */}
                          <div className='active:scale-[.98] snap-start relative min-h-[250px] min-w-[180px] rounded-[30px] overflow-hidden bg-neutral-800'>
                              <Image src={MOCK_GALLERY[0].src} alt="Gallery 1" fill className='object-cover' />
                          </div>

                          {/* Item 2: Stacked Column */}
                          <div className='snap-start flex flex-col gap-3 min-w-[120px]'>
                              <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                                <Image src={MOCK_GALLERY[1].src} alt="Gallery 2" fill className='object-cover' />
                              </div>
                              <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                                <Image src={MOCK_GALLERY[2].src} alt="Gallery 3" fill className='object-cover' />
                              </div>
                          </div>

                           {/* Item 3: Video Type */}
                           <div className='active:scale-[.98] snap-start relative min-h-[250px] min-w-[180px] rounded-[30px] overflow-hidden bg-neutral-800 group cursor-pointer'>
                              <Image src={MOCK_GALLERY[3].src} alt="Gallery Video" fill className='object-cover opacity-80' />
                              <div className='absolute inset-0 flex bg-red-500/0'>
                                {/* <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40'> */}
                                   {/* Simple Play Icon SVG */}
                                   <PlayIcon size={20} color="#fff" className='absolute top-[15px] right-[15px] drop-shadow-[0px_0px_5px_rgba(0,0,0,0.4)]'/>
                                {/* </div> */}
                              </div> 
                          </div>

                          {/* Item 4: Stacked Column */}
                          <div className='snap-start flex flex-col gap-3 min-w-[120px]'>
                              <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                                <Image src={MOCK_GALLERY[4].src} alt="Gallery 5" fill className='object-cover' />
                              </div>
                              <div className='active:scale-[.98]  relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                                <Image src={MOCK_GALLERY[5].src} alt="Gallery 6" fill className='object-cover' />
                              </div>
                          </div>



                          {/* View All Button */}
                          <button className='snap-start relative cursor-pointer min-h-[250px] min-w-[120px] rounded-[30px] overflow-hidden border-[1px] active:scale-[.98] [mask-image:radial-gradient(white,black)] border-white/10'>
                              

                              {/* Dark Overlay */}
                              {/* <div className='h-[100%] w-[100%] absolute inset-0 bg-black/40 backdrop-blur-[2px]'></div> */}

                              {/* Dark Overlay */}
                              {/* <div className='h-[100%] w-[100%] bg-black/60 z-[1000]'></div> */}

                              {/* Background Image Stack */}
                              {/* Added rounded-[30px] here explicitly to help Safari/Mobile clip inner images */}
                              <div className='absolute inset-0 flex flex-col gap-[1px] rounded-[30px] overflow-hidden'>
                                <div className='relative flex-1 w-full bg-neutral-800'>
                                  <Image src={MOCK_GALLERY[0].src} alt="Preview 1" fill className='object-cover' />
                                </div>
                                <div className='relative flex-1 w-full bg-neutral-800'>
                                  <Image src={MOCK_GALLERY[1].src} alt="Preview 2" fill className='object-cover' />
                                </div>
                                <div className='relative flex-1 w-full bg-neutral-800'>
                                  <Image src={MOCK_GALLERY[2].src} alt="Preview 3" fill className='object-cover' />
                                </div>
                              </div>

                              {/* Centered Text Content */}
                              {/* z-10 ensures text sits above the hardware-accelerated image layer */}
                              <div className='absolute inset-0 flex flex-col items-center justify-center z-10 p-2'>
                                {/* <div className='w-8 h-8 rounded-full border border-white/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform bg-black/20'>
                                  <span className='text-xl text-white font-light'>+</span>
                                </div> */}
                                <p className='text-[0.8rem] font-bold text-white uppercase tracking-[0.15em] text-center leading-relaxed'>
                                  See<br/>More
                                </p>

                                {/* Dark Overlay */}
                              <div className='h-[100%] w-[100%] absolute bg-black/40 backdrop-blur-[2px] z-[-200]'></div>
                              </div>
                          </button>
                        </div>
                  <div className='bg-white/10 h-[2px] w-[65%] self-center'></div>
                  <div className='w-[90%] flex self-center items-center gap-[10px]'>
                    <div className='self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-[26px] p-[2.4px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] -mr-[2px] w-[100%]'>
                    {/* <Link href="/sign-up"> */}
                      <div className='flex flex-col text-center w-[100%] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-[23px] px-[15px] py-[15.4px]'>
                        <span className='text-white font-bold'>Create a custom trip</span>
                      </div>
                    {/* </Link> */}
                    </div>
                    <div className='relative'>
                      <InfoPopup key={selectedSite.id} />
                    </div>


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
          .from('location_pins') // <-- Your table name here
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
          slug: entry.slug || '',
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
    const target = e.target as Element | null; // Cast to Element to use .closest()

    // 1. Check if clicked inside Main Search Panels
    const inDesktop = desktopSearchRef.current?.contains(target);
    const inMobile = mobileSearchRef.current?.contains(target);

    // 2. Check if clicked inside the Info Popup Portal (Fixes the issue)
    const inPopup = target?.closest('#info-popup-portal'); 

    // Only close if we clicked OUTSIDE of Desktop Search, Mobile Search, AND the Popup
    if (!inDesktop && !inMobile && !inPopup) {
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
      <div className='absolute bottom-[20px] left-[20px] whitespace-nowrap rounded-full p-[3px] w-[400px] hidden sm:block'>
        <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[20px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[43px]`}>
          <div className={`bg-black/45 [mask-image:radial-gradient(white,black)] relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
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
          <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[20px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.3)] w-full transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'rounded-[43px] rounded-b-[49px]' : 'rounded-[43px] rounded-b-[43px]'}`}>
            <div className={`bg-black/45 [mask-image:radial-gradient(white,black)] relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px] rounded-b-[47px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
              <SearchResults sites={sites} selectedSite={selectedSite} setSelectedSite={setSelectedSite} mobileSearchInputRef={mobileSearchInputRef} mobileSearchReady={mobileSearchReady} handleMobileSearchTap={handleMobileSearchTap} mobileSearchOpen={mobileSearchOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}