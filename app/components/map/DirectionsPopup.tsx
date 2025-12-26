"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import DirectionsIcon from "@/public/icons/directions-icon";
import applemapsIcon from "@/public/icons/applemaps.svg"; 
import googlemapsIcon from "@/public/icons/googlemaps.svg"; 

interface DirectionsPopupProps {
  name: string;
  lat: number;
  lng: number;
}

export default function DirectionsPopup({ name, lat, lng }: DirectionsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ bottom: 0, right: 0 });
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        bottom: window.innerHeight - rect.top + 10,
        right: window.innerWidth - rect.right 
      });
    }
  };

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => setIsOpen(false);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;
      if (!popupRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // --- NEW SMART MAP LINKS ---

  // 1. APPLE MAPS STRATEGY: 
  // We use "sll" (Search Location Lat/Long) instead of "ll".
  // "sll" centers the map but does NOT drop a pin.
  // "q" searches for the name.
  // Result: It searches for "Peg farm" *near* those coords, finding the Real Business.
  const appleUrl = `http://maps.apple.com/?q=${encodeURIComponent(name)}&sll=${lat},${lng}`;

  // 2. GOOGLE MAPS STRATEGY:
  // We switch to "/search/" instead of "/dir/".
  // This opens the "Place Sheet" (Ratings, Info, Photos) if found.
  // We search "Name + Barbados" to ensure it finds the right island location.
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Barbados")}`;

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={togglePopup}
        className='w-[100%] active:scale-[.98] transition-transform'
      >
        <div className='bg-white/10 cursor-pointer rounded-[26px] p-[3px] w-[100%] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
            <div className='flex justify-center items-center gap-[10px] text-white font-[500] text-[1rem] bg-black/30 py-[12px] rounded-[23px] hover:bg-black/40 transition-colors'>
                <DirectionsIcon size={30} color="#fff"/>
                <p>Get Directions</p>
            </div>
        </div>
      </button>

      {mounted && isOpen && createPortal(
        <div 
          ref={popupRef}
          id="info-popup-portal"
          style={{ 
            position: 'fixed', 
            bottom: `${position.bottom}px`, 
            right: `${position.right}px`,
            zIndex: 9999 
          }}
          className="w-fit"
        >
          <div className='bg-white/10 backdrop-blur-md p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] rounded-[28px] overflow-hidden'>
            <div className="flex flex-col bg-black/30 text-white font-medium rounded-[25px]">
                
                {/* Option 1: Apple Maps */}
                <a 
                   href={appleUrl}
                   target="_blank" rel="noopener noreferrer"
                   className="p-3.5 hover:bg-white/10 active:bg-white/20 text-center transition-colors rounded-t-[25px] border-b border-white/10 cursor-pointer flex items-center justify-center gap-2"
                >
                    {/* <Image src={applemapsIcon} alt="" height={25} width={25}/> */}
                    <span className="text-sm">Apple Maps</span>
                </a>

                {/* Option 2: Google Maps */}
                <a 
                   href={googleUrl}
                   target="_blank" rel="noopener noreferrer"
                   className="p-3.5 hover:bg-white/10 active:bg-white/20 text-center rounded-b-[25px] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                    {/* <Image src={googlemapsIcon} alt="" height={25} width={25} className='ml-[7px]'/> */}
                    <span className="text-sm">Google Maps</span>
                </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}