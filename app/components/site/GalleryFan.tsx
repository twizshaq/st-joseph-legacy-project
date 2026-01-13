"use client";

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GalleryModal } from "@/app/components/site/GalleryModal";


export const GalleryFan = ({ items }: { items: any[] }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className='mb-[180px]'>
      <div className='flex flex-col text-center mb-[50px]'>
        <p className='font-bold text-[1.75rem]'>Photo & Video Gallery</p>
        <p className='text-[#666]'>A glimpse of the coastline, surf, and tidal pools</p>
      </div>
      <div className='relative flex flex-row justify-center items-end bg-green-500/0 min-h-[360px] sm:min-h-[420px] overflow-visible'>
        {/* Blurred color blobs behind the cards */}
        <div aria-hidden className='pointer-events-none absolute inset-0 z-0'>
          {/* <div className='absolute left-[5%] bottom-[0px] w-[320px] h-[320px] rounded-full bg-[#60A5FA]/40 blur-[90px]'></div> */}
          {/* <div className='absolute right-[6%] bottom-[10px] w-[300px] h-[300px] rounded-full bg-[#F472B6]/40 blur-[90px]'></div> */}
          {/* <div className='absolute left-1/2 -translate-x-1/2 top-[-10px] w-[360px] h-[360px] rounded-full bg-[#34D399]/35 blur-[100px]'></div> */}
          {/* <div className='absolute left-[22%] top-[0px] w-[220px] h-[220px] rounded-full bg-[#F59E0B]/35 blur-[80px]'></div> */}
        </div>

        {/* Card cluster (scaled down on small screens to keep spacing visually consistent) */}
        <div className='relative w-full flex justify-center items-end z-10 origin-bottom max-sm:scale-[0.76]'>
          
          {/* Center Card (Index 0) */}
          <div 
            onClick={() => { setSelectedIndex(0); setGalleryOpen(true); }}
            className='bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-20 shadow-[0px_0px_20px_rgba(0,0,0,.2)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
            style={{ backgroundImage: `url(${items[0]?.src})` }}
          ></div>

          {/* Right Inner Card (Index 3) */}
          <div 
            onClick={() => { setSelectedIndex(3); setGalleryOpen(true); }}
            className='absolute right-[220px] bottom-[80px] rotate-[7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.2)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
            style={{ backgroundImage: `url(${items[3]?.src})` }}
          ></div>

          {/* Left Inner Card (Index 4) */}
          <div 
            onClick={() => { setSelectedIndex(4); setGalleryOpen(true); }}
            className='absolute left-[220px] bottom-[80px] rotate-[-7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.2)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
            style={{ backgroundImage: `url(${items[4]?.src})` }}
          ></div>

          {/* Left Outer Card (Index 5) */}
          <div 
            onClick={() => { setSelectedIndex(5); setGalleryOpen(true); }}
            className='absolute left-[400px] bottom-[0px] rotate-[7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.2)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
            style={{ backgroundImage: `url(${items[5]?.src})` }}
          ></div>

          {/* Right Outer Card (Index 6) */}
          <div 
            onClick={() => { setSelectedIndex(6); setGalleryOpen(true); }}
            className='absolute right-[400px] bottom-[0px] rotate-[-7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.2)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
            style={{ backgroundImage: `url(${items[6]?.src})` }}
          ></div>

        </div>
      </div>
      <div className='relative bg-green-500 flex flex-col justify-center items-center z-30'>
          
          <Portal>
            {galleryOpen && (
              <GalleryModal 
                items={items} 
                initialIndex={selectedIndex} 
                onClose={() => setGalleryOpen(false)} 
              />
            )}
          </Portal>

          <div className='absolute bottom-[-80px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
            <div className='bg-white/10 active:scale-[.98] backdrop-blur-[3px] rounded-full p-[2.7px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <button onClick={() => setGalleryOpen(true)} className="cursor-pointer flex items-center py-[10px] px-[20px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                {/* <span className='z-10 fill-[#E0E0E0]'>
                  <Image src={photoIcon} alt="" height={30} className=''/>
                </span> */}
                <p className='font-bold text-[#fff]'>Open Gallery</p>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

// Portal Component (Required for Modal to render on top of everything)
const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  return mounted ? ReactDOM.createPortal(children, document.body) : null;
};

export default GalleryFan;