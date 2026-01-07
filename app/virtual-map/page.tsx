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
  const { sites, likedSiteIds, toggleLike, saveTrip } = useMapData();
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchReady, setMobileSearchReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const isLiked = selectedSite ? likedSiteIds.has(selectedSite.id) : false;

  const filteredSites = useMemo(() => {
    if (!searchQuery) return sites;
    const lowerQuery = searchQuery.toLowerCase().trim();
    if (!lowerQuery) return sites;
    return sites.filter(site => 
      site.name.toLowerCase().includes(lowerQuery) || 
      site.category?.toLowerCase().includes(lowerQuery)
    );
  }, [sites, searchQuery]);

  const geojsonData = useMemo((): FeatureCollection<Point> => ({
    type: 'FeatureCollection',
    features: sites.map(site => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: site.coordinates },
      properties: { ...site },
    }))
  }), [sites]);

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

  const handlePointerDown = useCallback((e: PointerEvent) => {
      const target = e.target as Element;
      const inDesktop = desktopSearchRef.current?.contains(target);
      const inMobile = mobileSearchRef.current?.contains(target);
      const inPopup = target?.closest('#info-popup-portal');
      
      if (!inDesktop && !inMobile && !inPopup) {
         setMobileSearchOpen(prev => {
            if (prev) {
               setMobileSearchReady(false);
               return false;
            }
            return prev;
         });
      }
  }, []);

  React.useEffect(() => {
    if (mobileSearchOpen) document.addEventListener('pointerdown', handlePointerDown);
    else document.removeEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [mobileSearchOpen, handlePointerDown]);

  const handleToggleLike = useCallback(() => {
     if(selectedSite) toggleLike(selectedSite.id);
  }, [selectedSite, toggleLike]);

  const zoomControls = useMemo(() => (
      <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className='rounded-full bg-black/40 flex flex-col w-[45px] overflow-hidden'>
               <button onClick={() => mapRef.current?.zoomIn()} className='cursor-pointer px-[10px] py-[20px] pt-[25px] relative active:bg-black/20 flex justify-center items-center hover:bg-black/20'>
                  <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                  <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
               </button>
               <button onClick={() => mapRef.current?.zoomOut()} className='cursor-pointer px-[12px] py-[20px] pb-[23px] active:bg-black/20 hover:bg-black/20'>
                  <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
               </button>
            </div>
      </div>
  ), []);

  const helpButton = useMemo(() => (
  <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
    <div className='rounded-full bg-black/40 flex flex-col w-[45px] h-[45px] overflow-hidden'>
      <button 
        onClick={() => console.log("Help clicked")} 
        className='w-full h-full cursor-pointer flex justify-center items-center active:bg-black/20 hover:bg-black/20 transition-colors'
      >
        <span className='text-white text-xl font-bold font-mono leading-none'>?</span>
      </button>
    </div>
  </div>
), []);

  return (
    <div className="h-[100dvh] overflow-hidden relative bg-[#b9d3c2]">
      <div className="absolute inset-0 z-0">
         <MapFull ref={mapRef} onMarkerClick={handleMarkerClick} geojsonData={geojsonData} /> 
      </div>

      <div className='absolute bottom-[20px] right-[20px] hidden sm:flex flex-col gap-2 z-[40] items-center'>
        {zoomControls}
        {helpButton}
      </div>

      <div className='absolute bottom-[20px] left-[20px] whitespace-nowrap rounded-full p-[3px] w-[400px] hidden sm:block z-[50]'>
        <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[13px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] rounded-[43px] will-change-transform`}>
          <div className={`bg-black/45 relative w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}>
            <SearchResults 
                sites={filteredSites} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                mobileSearchInputRef={desktopInputRef}
                handleMobileSearchTap={handleDesktopSearchTap}
                selectedSite={selectedSite} 
                setSelectedSite={setSelectedSite}
                mobileSearchReady={mobileSearchReady}
                mobileSearchOpen={mobileSearchOpen}
                isLiked={isLiked}
                onToggleLike={handleToggleLike}
                onSaveTrip={saveTrip}
            />
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className='absolute pointer-events-none bottom-[20px] right-[15px] sm:hidden flex flex-col items-end gap-[0px] w-[calc(100vw-25px)] z-[50]'>
        <div className={`pointer-events-auto absolute right-1 bottom-[0px] whitespace-nowrap rounded-full p-[3px] -mr-[2px] transition-all duration-300 ease-in-out ${mobileSearchOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'}`}>
          <div className='absolute bottom-[80px] right-0 flex flex-col gap-2 items-center'>
            {zoomControls}
            {helpButton}
          </div>
        </div>

         {/* Mobile Search Container */}
         <div className='pointer-events-auto cursor-pointer whitespace-nowrap rounded-full p-[3px] w-full'>
            <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[13px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.3)] w-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[height,border-radius] ${mobileSearchOpen ? 'rounded-[43px] rounded-b-[49px]' : 'rounded-[43px] rounded-b-[43px]'}`}>
                {/* 
                   FIX FOR 4 CORNERS: 
                   1. overflow-hidden on this wrapper ensures children are clipped 
                   2. Added 'mask-image' to fix the glass clipping issue
                */}
                <div 
                   className={`bg-black/55 relative w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[height] 
                   [mask-image:radial-gradient(circle_at_center,black,black)]
                   ${mobileSearchOpen ? 'h-[60vh] max-h-[500px] rounded-[40px] rounded-b-[47px]' : 'h-[58px] rounded-[40px] p-[4px]'}`}
                >
                   <SearchResults 
                      sites={filteredSites} 
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      mobileSearchInputRef={mobileSearchInputRef}
                      handleMobileSearchTap={handleMobileSearchTap}
                      selectedSite={selectedSite} 
                      setSelectedSite={setSelectedSite}
                      mobileSearchReady={mobileSearchReady}
                      mobileSearchOpen={mobileSearchOpen}
                      isLiked={isLiked}
                      onToggleLike={handleToggleLike}
                      onSaveTrip={saveTrip}
                   />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}