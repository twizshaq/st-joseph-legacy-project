import React, { useRef, useEffect } from 'react';
import ArrowIcon from '@/public/icons/arrow-icon';
import { StopItem } from './StopItem';
import { Tour } from '@/app/types/tours';

interface StopsModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
}

const StopsModal: React.FC<StopsModalProps> = ({ tour, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[6px] animate-in fade-in duration-200">
      <div ref={modalRef} className="bg-white relative w-full max-w-[600px] max-h-[85vh] rounded-[45px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-2 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <h2 className="text-2xl font-bold text-gray-900">All Stops</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
            <ArrowIcon className="rotate-45" color="#000" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {tour.stops.map((stop, index) => (
            <StopItem 
              key={stop.id} 
              stop={stop} 
              index={index} 
              totalStops={tour.stops.length} 
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-3 bg-black text-white font-bold rounded-full hover:bg-black/90 transition-opacity">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopsModal;