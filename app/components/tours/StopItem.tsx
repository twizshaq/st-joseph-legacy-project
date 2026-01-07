import React, { useState } from 'react';
import { Stop } from '@/app/types/tours';

interface StopItemProps {
  stop: Stop;
  index: number;
  totalStops: number;
  isPreview?: boolean; // Determines if we always hide Read More or not
}

export const StopItem: React.FC<StopItemProps> = ({ stop, index, totalStops, isPreview = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = stop.description && stop.description.length > 80;

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline Line Graphics */}
      <div className="flex flex-col items-center">
        <div className={`relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full border-[3px] flex-shrink-0 border-[#007BFF]`}></div>
        {index !== totalStops - 1 && <div className="absolute top-4 bottom-0 w-[3px] bg-blue-500"></div>}
      </div>

      {/* Content */}
      <div className="flex flex-col mt-[-4px] w-full">
        {/* On Preview (Main page) title is below desc, on Modal it might be above. Sticking to main page style here. */}
        <p className={`text-gray-800/70 font-[500] text-[.9rem] leading-tight transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {stop.description}
        </p>
        <p className={`font-[500] text-[1rem] text-gray-900 mt-1`}>{stop.name}</p>
        
        {/* Read More Toggle (Only if NOT in strict preview mode where space is tight, or just enable it always) */}
        {!isPreview && isLongText && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-[0.8rem] font-bold text-blue-600 mt-1 text-left hover:underline focus:outline-none w-fit"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
};