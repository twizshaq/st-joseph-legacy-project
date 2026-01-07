import React, { useRef, useEffect } from "react";
import Image from "next/image";
import ArrowIcon from '@/public/icons/arrow-icon';
import { Tour } from "@/app/types/tours";

interface TourSelectorProps {
  tours: Tour[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onSelect: (tour: Tour) => void;
}

const TourSelector: React.FC<TourSelectorProps> = ({ tours, isOpen, setIsOpen, onSelect }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
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
    <div className='flex justify-center gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] relative'>
      <div className='bg-white/10 active:scale-97 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,.1)] flex flex-row gap-6'>
        <button 
          className="cursor-pointer flex items-center py-[10px] pl-[13px] pr-[10px] gap-[3px] justify-center rounded-full bg-[#000]/5 backdrop-blur-[5px] active:bg-[#000]/10 z-[10]" 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        >
          <p className='font-bold text-slate-800'>Select Your Journey</p>
          <span><ArrowIcon className="rotate-180" color="#1E293B" /></span>
        </button>
      </div>

      {isOpen && (
        <div ref={menuRef} className="absolute top-full mt-2 bg-white/80 rounded-[28px] backdrop-blur-[10px] p-[2.5px] shadow-[0px_0px_20px_rgba(0,0,0,.2)] w-fit flex flex-wrap z-[40] overflow-hidden">
          <div className="flex flex-col gap-2 w-full bg-black/5 rounded-[25px] p-[5px]">
            {tours.map((t) => (
              <button 
                key={t.id} 
                onClick={() => { onSelect(t); setIsOpen(false); }} 
                className="flex items-center gap-[10px] cursor-pointer p-1 hover:bg-black/10 pr-[10px] active:bg-black/10 active:scale-[.98] rounded-[20px]"
              >
                <div className="relative overflow-hidden w-[50px] h-[50px] flex-shrink-0 border-[1.5px] border-white rounded-[17px] bg-neutral-600">
                  {t.tour_image_url ? (
                    <Image src={t.tour_image_url} alt={t.name || "Tour"} width={50} height={50} className="object-cover h-full w-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-[8px] text-white/50">No Img</span></div>
                  )}
                </div>
                <p className="font-[600] text-[.9rem] text-left line-clamp-2">{t.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TourSelector;