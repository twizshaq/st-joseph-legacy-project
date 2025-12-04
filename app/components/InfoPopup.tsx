"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import InfoIcon from "@/public/icons/info-icon"; 
 import { FaTimes } from "react-icons/fa";

export default function InfoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ bottom: 0, right: 0 });
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by ensuring we only portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position calculation
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        // Position relative to viewport:
        // Bottom: Distance from bottom of screen to top of button + 10px gap
        bottom: window.innerHeight - rect.top + 10,
        // Right: Distance from right of screen to right of button (aligns edges)
        right: window.innerWidth - rect.right 
      });
    }
  };

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition(); // Calculate positions just before opening
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle window resize or scroll
  // --- UPDATED SCROLL LOGIC ---
  useEffect(() => {
    if (!isOpen) return;

    // Close the popup immediately if the user scrolls or resizes the screen
    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    // 'true' (Capture) is REQUIRED here to detect scrolling within your inner <div>
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  // Click Outside Logic (Complex because Popup is in Portal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;

      // Check if clicked inside Popup Ref (in Portal) OR Button Ref (in Layout)
      const clickedInPopup = popupRef.current && popupRef.current.contains(target);
      const clickedInButton = buttonRef.current && buttonRef.current.contains(target);

      if (!clickedInPopup && !clickedInButton) {
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

  return (
    <>
      {/* THE BUTTON (Renders normally in your layout) */}
      <button 
        ref={buttonRef}
        onClick={togglePopup}
        className='active:scale-[.90] cursor-pointer block opacity-80 hover:opacity-100 transition-opacity'
      >
        <InfoIcon size={30} color="#fff" />
      </button>

      {/* THE POPUP (Renders in body via Portal) */}
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
          className="w-[250px] origin-bottom-right animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Glass Style */}
          <div className='bg-white/10 backdrop-blur-[7px] shadow-[0px_0px_10px_rgba(0,0,0,0.4)] rounded-[28px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,.5)] h-fit'>
            <div className="bg-black/40 text-white p-4 rounded-[25px] flex flex-col gap-2 relative">
              
              {/* Close Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute cursor-pointer top-2 right-2 text-white p-1 rounded-full hover:text-red-500 active:text-red-500 transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <h4 className="font-bold text-sm text-white tracking-wide">Custom Trip</h4>
              <p className="text-[0.85rem] text-white/70 font-light leading-relaxed">
                Create a custom trip with multiple locations and export it to maps apps like Apple or Google Maps.
              </p>
            </div>
            
            {/* Optional Gloss Line for depth */}
            <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          
          {/* Optional Arrow/Pointer logic could go here if strict design needed, 
              but usually clean floating windows look better in modern UIs. */}
        </div>,
        document.body
      )}
    </>
  );
}