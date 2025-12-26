"use client";

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import MapFull from '@/app/components/map/MapFull';
import { useMapData } from '@/app/hooks/useMapData'; 
import { SearchResults } from '@/app/components/map/SearchResults';
import { Site, Zoomable } from '@/app/types/map';
import { Feature, Point, FeatureCollection } from 'geojson';
import { createClient } from '@/lib/supabase/client';

export default function FullScreenMapPage() {
  const mapRef = useRef<Zoomable | null>(null);
  
  // Custom Hook Logic
  const { sites, likedSiteIds, toggleLike, saveTrip } = useMapData();
  
  // Local UI State
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchReady, setMobileSearchReady] = useState(false);
  
  // Refs
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Derived Logic
  const isLiked = selectedSite ? likedSiteIds.has(selectedSite.id) : false;

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
      <div className='absolute bottom-[20px] right-[20px] hidden sm:block z-[40] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
         {/* Replaced 'shadow-lg' with your specific 'shadow-[...]' */}
         <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className='rounded-full bg-black/40 flex flex-col w-[45px] overflow-hidden'>
               <button onClick={() => mapRef.current?.zoomIn()} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                  <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                  <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
               </button>
               <button onClick={() => mapRef.current?.zoomOut()} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                  <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
               </button>
            </div>
         </div>
      </div>

      {/* 3. DESKTOP SEARCH PANEL */}
      <div className='absolute bottom-[20px] left-[20px] whitespace-nowrap rounded-full p-[3px] w-[400px] hidden sm:block z-[50]'>
        {/* Replaced 'shadow-lg' with your specific 'shadow-[...]' */}
        <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[13px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[43px]`}>
          <div className={`bg-black/45 [mask-image:radial-gradient(white,black)] relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
            <SearchResults 
               sites={sites} 
               selectedSite={selectedSite} 
               setSelectedSite={setSelectedSite}
               mobileSearchInputRef={mobileSearchInputRef}
               mobileSearchReady={mobileSearchReady}
               handleMobileSearchTap={handleMobileSearchTap}
               mobileSearchOpen={mobileSearchOpen}
               isLiked={isLiked}
               onToggleLike={() => selectedSite && toggleLike(selectedSite.id)}
               onSaveTrip={saveTrip}
            />
          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER */}
      <div className='absolute bg-red-400/0 bottom-[20px] right-[15px] sm:hidden flex flex-col items-end gap-[0px] w-[calc(100vw-25px)] z-[50]'>
         
         {/* Zoom buttons (Fade out when drawer opens) */}
         <div className={`absolute right-1 bottom-[0px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'opacity-0 pointer-events-none translate-y-0' : 'opacity-100'}`}>
            <div className='absolute bottom-[80px] right-0 bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <div className='rounded-full bg-black/55 flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
                  <button onClick={() => mapRef.current?.zoomIn()} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                    <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                    <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                  </button>
                  <button onClick={() => mapRef.current?.zoomOut()} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                    <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                  </button>
                </div>
            </div>
         </div>

         {/* Mobile Search Container */}
         <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] w-full'>
            <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[13px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.3)] w-full transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'rounded-[43px] rounded-b-[49px]' : 'rounded-[43px] rounded-b-[43px]'}`}>
                <div className={`bg-black/55 [mask-image:radial-gradient(white,black)] relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px] rounded-b-[47px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
                   <SearchResults 
                     sites={sites} 
                     selectedSite={selectedSite} 
                     setSelectedSite={setSelectedSite}
                     mobileSearchInputRef={mobileSearchInputRef}
                     mobileSearchReady={mobileSearchReady}
                     handleMobileSearchTap={handleMobileSearchTap}
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