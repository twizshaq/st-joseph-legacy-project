// app/map-fullscreen/page.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import MapFull from '@/app/components/FullMap';
import compass from "@/public/icons/compass-icon.svg";
import MapPanel from '@/app/components/MapPanel';
import searchIcon from '@/public/icons/search-icon.svg';
import Image from 'next/image';

const historicSites = [
  { id: 1, name: 'Chalky Mount Potteries', description: 'Historic pottery village known for its unique clay.' },
  { id: 2, name: 'St. Joseph Parish Church', description: 'A beautiful Anglican church with a rich history.' },
  { id: 3, name: 'Andromeda Botanic Gardens', description: 'A 6-acre botanical garden and a popular tourist attraction.' },
  { id: 4, name: 'The Soup Bowl', description: 'World-renowned surfing spot in Bathsheba.' },
  { id: 5, name: 'Hunte\'s Gardens', description: 'A lush and exotic garden located in a sinkhole-like gully.' },
  { id: 6, name: 'Cotton Tower Signal Station', description: 'One of a series of signal stations built in the 1800s.' },
  { id: 7, name: 'Bathsheba Park', description: 'Known for its stunning rock formations and coastline.' },
  { id: 8, name: 'Joe\'s River Bridge', description: 'A scenic spot offering views of the tropical forest.' },
];

export default function FullScreenMapPage() {
  const mapRef = useRef<any>(null);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchReady, setMobileSearchReady] = useState(false); // when false, input is readOnly (no keyboard)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const closeSearchPanels = () => {
    setMobileSearchOpen(false);
    setMobileSearchReady(false);
  };

  const handleMobileSearchTap = () => {
    // First tap: open panel without showing keyboard
    if (!mobileSearchOpen) {
      setMobileSearchOpen(true);
      setMobileSearchReady(false);
      return;
    }
    // Second tap: enable typing and focus (must be synchronous for iOS)
    if (!mobileSearchReady) {
      try { mobileSearchInputRef.current?.removeAttribute('readonly'); } catch {}
      flushSync(() => setMobileSearchReady(true));
      const el = mobileSearchInputRef.current;
      if (el) {
        el.focus({ preventScroll: true });
        try {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        } catch {}
      }
    }
  };

  useEffect(() => {
    if (!mobileSearchOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      const inDesktop = desktopSearchRef.current?.contains(target as Node) ?? false;
      const inMobile = mobileSearchRef.current?.contains(target as Node) ?? false;
      if (!inDesktop && !inMobile) {
        closeSearchPanels();
      }
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [mobileSearchOpen]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  return (
    <div className="h-[100dvh] overflow-hidden">
      {/* The Map is now the base layer, always filling the screen */}
      <div className="absolute inset-0">
        <MapFull ref={mapRef} />
      </div>

      {/* The Panel is positioned absolutely on top of the map */}
      {/* <MapPanel sites={historicSites} /> */}

      {/* 
        The Zoom controls are also positioned absolutely.
        On desktop, they are pushed left by the width of the sidebar.
      */}
      <div className='absolute bottom-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] hidden sm:block'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <div className='rounded-full bg-black/40 backdrop-blur-[5px] flex flex-col gap-0 p-[0px] py-[0px] w-[45px] overflow-hidden z-[40]'>
                <button 
                  onClick={handleZoomIn}
                  className='rounded-[0px] px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'
                >
                  <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                  <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                </button>
                <button 
                  onClick={handleZoomOut}
                  className='rounded-[0px] px-[12px] py-[20px] pb-[23px] active:bg-white/10'
                >
                  <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                </button>
              </div>
            </div>
          </div>

          <div className='absolute bottom-[20px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[400px] max-sm:w-[90vw] hidden sm:block'>
            <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[3px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full duration-300 ease-out ${mobileSearchOpen ? 'rounded-[47px]' : 'rounded-[47px]'}`}>
              {/* Container that expands to 55vh when open; collapses to just the input height when closed */}
              <div className={`p-[6px] bg-black/40 relative w-full transition-[height] duration-300 ease-out ${mobileSearchOpen ? 'h-[55vh] rounded-[45px]' : 'h-[62px] rounded-[47px]'}`}>
                {/* Maintain column layout so the area below input can scroll */}
                <div className='flex flex-col h-full'>
                  {/* Input row pinned at the top; first click opens, second enables typing/focus */}
                  <div className={`relative ${mobileSearchOpen ? 'mt-[8px] w-[95%] mx-auto' : ''}`}>
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
                      enterKeyHint='search'
                      autoCapitalize='none'
                      autoCorrect='off'
                      className='bg-black/40 rounded-full h-[50px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none'
                    />
                  </div>
                  {/* Scrollable area below the input when expanded */}
                  {mobileSearchOpen && (
                    <div className='mt-2 overflow-y-auto flex-1 rounded-[16px]'>
                      {/* Desktop results/content here */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only stacked controls: zoom above, search below */}
          <div className='absolute bottom-[20px] right-[15px] sm:hidden flex flex-col items-end gap-[12px] w-[calc(100vw-25px)]'>
            {/* Zoom controls (mobile) */}
            <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <div className='rounded-full bg-black/40 backdrop-blur-[5px] flex flex-col gap-0 p-[0px] py-[0px] w-[45px] overflow-hidden z-[40]'>
                  <button 
                    onClick={handleZoomIn}
                    className='rounded-[0px] px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'
                  >
                    <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                    <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                  </button>
                  <button 
                    onClick={handleZoomOut}
                    className='rounded-[0px] px-[12px] py-[20px] pb-[23px] active:bg-white/10'
                  >
                    <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Search input (mobile) */}
            <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] w-full'>
              <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[3px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full duration-300 ease-out ${mobileSearchOpen ? 'rounded-[47px]' : 'rounded-[47px]'}`}>
                {/* Container that expands to 55vh when open; collapses to just the input height when closed */}
                <div className={`p-[6px] bg-black/40 relative w-full transition-[height] duration-300 ease-out ${mobileSearchOpen ? 'h-[55vh] rounded-[45px]' : 'h-[62px] rounded-[47px]'}`}>
                  <div className='flex flex-col h-full'>
                    <div className={`relative ${mobileSearchOpen ? 'mt-[8px] w-[95%] mx-auto' : ''}`}>
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
                        enterKeyHint='search'
                        autoCapitalize='none'
                        autoCorrect='off'
                        className='bg-black/40 rounded-full h-[50px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none'
                      />
                    </div>
                    {/* Scrollable area below the input when expanded */}
                    {mobileSearchOpen && (
                      <div className='mt-2 overflow-y-auto flex-1 rounded-[16px]'>
                        {/* Results/content go here. Keeping empty as requested; area is scrollable. */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}