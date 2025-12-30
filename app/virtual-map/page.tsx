"use client";

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import MapFull from '@/app/components/map/MapFull';
import { useMapData } from '@/app/hooks/useMapData'; 
import { SearchResults } from '@/app/components/map/SearchResults';
import { Site, Zoomable } from '@/app/types/map';
import { Feature, Point, FeatureCollection } from 'geojson';

export default function FullScreenMapPage() {
  const mapRef = useRef<Zoomable | null>(null);
  
  // Custom Hook Logic
  const { sites, likedSiteIds, toggleLike, saveTrip } = useMapData();
  
  // Local UI State
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchReady, setMobileSearchReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // NEW: Search State
  
  // Refs
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null); // NEW: Separate Ref for Desktop
  
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Derived Logic
  const isLiked = selectedSite ? likedSiteIds.has(selectedSite.id) : false;

  // NEW: Filter Logic
  const filteredSites = useMemo(() => {
    if (!searchQuery.trim()) return sites;
    const lowerQuery = searchQuery.toLowerCase();
    return sites.filter(site => 
      site.name.toLowerCase().includes(lowerQuery) || 
      site.category?.toLowerCase().includes(lowerQuery)
    );
  }, [sites, searchQuery]);

  const geojsonData = useMemo((): FeatureCollection<Point> | null => {
    return {
      type: 'FeatureCollection',
      features: sites.map(site => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: site.coordinates },
        properties: { ...site },
      }))
    };
  }, [sites]);

  const handleMarkerClick = useCallback((feature: Feature<Point> | null) => {
    if (!feature?.properties) return setSelectedSite(null);
    const site = sites.find(s => s.id === feature.properties?.id);
    if (site) {
      setSelectedSite(site);
      setMobileSearchOpen(true);
    }
  }, [sites]);

  // Handler for Mobile Focus
  const handleMobileSearchTap = useCallback(() => {
    if (!mobileSearchOpen) {
      setMobileSearchOpen(true);
      setMobileSearchReady(false);
      return;
    }
    if (!mobileSearchReady) {
      flushSync(() => setMobileSearchReady(true));
      mobileSearchInputRef.current?.focus({ preventScroll: true });
    }
  }, [mobileSearchOpen, mobileSearchReady]);

  // NEW: Handler for Desktop Focus
  const handleDesktopSearchTap = useCallback(() => {
    if (!mobileSearchOpen) {
      setMobileSearchOpen(true);
      setMobileSearchReady(false);
      return;
    }
    if (!mobileSearchReady) {
      flushSync(() => setMobileSearchReady(true));
      desktopInputRef.current?.focus({ preventScroll: true });
    }
  }, [mobileSearchOpen, mobileSearchReady]);

  React.useEffect(() => {
    if (!mobileSearchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      const inDesktop = desktopSearchRef.current?.contains(target);
      const inMobile = mobileSearchRef.current?.contains(target);
      const inPopup = target?.closest('#info-popup-portal');
      if (!inDesktop && !inMobile && !inPopup) {
        setMobileSearchOpen(false);
        setMobileSearchReady(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [mobileSearchOpen]);

  return (
    <div className="h-[100dvh] overflow-hidden relative">
      
      {/* 1. MAP LAYER */}
      <div className="absolute inset-0">
        <MapFull ref={mapRef} onMarkerClick={handleMarkerClick} geojsonData={geojsonData} /> 
      </div>

      {/* 2. ZOOM CONTROLS */}
      <div className='absolute bottom-[20px] right-[20px] hidden sm:block z-[40] whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
         <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className='rounded-full bg-black/40 flex flex-col w-[45px] overflow-hidden'>
               {/* Added cursor-pointer to buttons */}
               <button onClick={() => mapRef.current?.zoomIn()} className='cursor-pointer px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                  <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                  <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
               </button>
               <button onClick={() => mapRef.current?.zoomOut()} className='cursor-pointer px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                  <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
               </button>
            </div>
         </div>
      </div>

      {/* 3. DESKTOP SEARCH PANEL */}
      <div className='absolute bottom-[20px] left-[20px] whitespace-nowrap rounded-full p-[3px] w-[400px] hidden sm:block z-[50]'>
        <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[13px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[43px]`}>
          <div className={`bg-black/45 [mask-image:radial-gradient(white,black)] relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
            <SearchResults 
               // Search Props
               sites={filteredSites} 
               searchQuery={searchQuery}
               onSearchChange={setSearchQuery}
               // Focus Props (Desktop specific)
               mobileSearchInputRef={desktopInputRef}
               handleMobileSearchTap={handleDesktopSearchTap}
               
               selectedSite={selectedSite} 
               setSelectedSite={setSelectedSite}
               mobileSearchReady={mobileSearchReady}
               mobileSearchOpen={mobileSearchOpen}
               isLiked={isLiked}
               onToggleLike={() => selectedSite && toggleLike(selectedSite.id)}
               onSaveTrip={saveTrip}
            />
          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER */}
      {/* Added pointer-events-none to wrapper */}
      <div className='absolute pointer-events-none bottom-[20px] right-[15px] sm:hidden flex flex-col items-end gap-[0px] w-[calc(100vw-25px)] z-[50]'>
         
         {/* Zoom buttons (Fade out when drawer opens) */}
         {/* Added pointer-events-auto to children */}
         <div className={`pointer-events-auto absolute right-1 bottom-[0px] whitespace-nowrap rounded-full p-[3px] -mr-[2px] transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'opacity-0 pointer-events-none translate-y-0' : 'opacity-100'}`}>
            <div className='absolute bottom-[80px] right-0 bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <div className='rounded-full bg-black/55 flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
                  {/* Added cursor-pointer to buttons */}
                  <button onClick={() => mapRef.current?.zoomIn()} className='cursor-pointer px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                    <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                    <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                  </button>
                  <button onClick={() => mapRef.current?.zoomOut()} className='cursor-pointer px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                    <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                  </button>
                </div>
            </div>
         </div>

         {/* Mobile Search Container */}
         {/* Added pointer-events-auto */}
         <div className='pointer-events-auto cursor-pointer whitespace-nowrap rounded-full p-[3px] w-full'>
            <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[13px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.3)] w-full transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'rounded-[43px] rounded-b-[49px]' : 'rounded-[43px] rounded-b-[43px]'}`}>
                <div className={`bg-black/55 [mask-image:radial-gradient(white,black)] relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px] rounded-b-[47px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
                   <SearchResults 
                     // Search Props
                     sites={filteredSites} 
                     searchQuery={searchQuery}
                     onSearchChange={setSearchQuery}
                     // Focus Props (Mobile specific)
                     mobileSearchInputRef={mobileSearchInputRef}
                     handleMobileSearchTap={handleMobileSearchTap}

                     selectedSite={selectedSite} 
                     setSelectedSite={setSelectedSite}
                     mobileSearchReady={mobileSearchReady}
                     mobileSearchOpen={mobileSearchOpen}
                     isLiked={isLiked}
                     onToggleLike={() => selectedSite && toggleLike(selectedSite.id)}
                     onSaveTrip={saveTrip}
                   />
                </div>
            </div>
         </div>
      </div>

    </div>
  );
}