import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import ArrowIcon from '@/public/icons/arrow-icon'; // Assuming this exists based on your snippet
import { Tour } from "@/app/types/tours";

interface TourSelectorProps {
  tours: Tour[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onSelect: (tour: Tour) => void;
  selectedTour?: Tour | null; // Optional: Pass the current tour to highlight it
}

const TourSelector: React.FC<TourSelectorProps> = ({ 
  tours, 
  isOpen, 
  setIsOpen, 
  onSelect, 
  selectedTour 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative w-[300px] max-w-[90vw] mx-auto z-30" ref={menuRef}>
      {/* --- Main Trigger Button --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full cursor-pointer group transition-all duration-300 ease-out
          flex items-center justify-between
          pl-6 pr-5 py-4
          bg-white/90 backdrop-blur-md
          border border-white/50
          shadow-[0_0px_20px_rgba(0,0,0,0.08)] active:scale-[.97]
          rounded-full
        `}
      >
        <div className="flex flex-col items-start">
            {/* <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 ml-1">
                Current Journey
            </span> */}
            <span className="text-lg font-bold text-slate-800 ml-1">
                {selectedTour ? selectedTour.name : "Select Your Journey"}
            </span>
        </div>

        <div className={`
            w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/0 
            transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}
        `}>
             <ArrowIcon className="w-7 h-7 text-slate-600" />
        </div>
      </button>

      {/* --- Dropdown Menu --- */}
      <div className={`absolute top-[calc(100%+12px)] bg-white/40 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] left-0 w-full backdrop-blur-sm rounded-[53px] p-[3px] transition-all duration-300 origin-top
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
        <div 
          className={`
              bg-[#ddd]/60
              rounded-[50px]
              overflow-hidden
          `}
        >
          <div className="p-3 flex flex-col gap-2">
              {tours.map((t) => {
                const isSelected = selectedTour?.id === t.id;
                
                return (
                  <button 
                    key={t.id} 
                    onClick={() => { onSelect(t); setIsOpen(false); }} 
                    className={`
                      flex items-center gap-4 p-2 w-full
                      rounded-[34px] transition-all duration-200
                      text-left group cursor-pointer active:scale-98 active:bg-black/20
                      ${isSelected ? 'bg-blue-50/80 ring-1 ring-blue-100' : 'hover:bg-black/20'}
                    `}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-16 h-16 shrink-0 rounded-[25px] overflow-hidden border-[1.5px] border-white/50">
                      {t.tour_image_url ? (
                        <Image 
                          src={t.tour_image_url} 
                          alt={t.name || "Tour"} 
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Img</div>
                      )}
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 pr-2">
                      <p className={`font-bold text-base leading-tight mb-0.5 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {t.name}
                      </p>
                      {/* Optional: If you have a duration or subtitle in your Tour type, add it here */}
                      <p className="text-xs text-slate-500 font-medium">
                          View Details
                      </p>
                    </div>

                    {/* Selection Indicator (Checkmark or Arrow) */}
                    {isSelected && (
                      <div className="mr-3 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourSelector;