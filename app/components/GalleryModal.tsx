"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import vrIcon from "@/public/icons/vr-icon.svg";
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import the new viewer
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

export const GalleryModal = ({ items, initialIndex, onClose }: { items: any[], initialIndex: number, onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // Swipe State
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // --- NAVIGATION LOGIC ---
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const activeThumb = thumbnailScrollRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 30) handleNext();
    if (distance < -30) handlePrev();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xl h-[100dvh] w-screen touch-none flex flex-col animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* --- TOP BAR --- */}
      <div className="flex justify-between items-center p-4 md:p-6 z-50 absolute top-0 w-full pointer-events-none">
        <span className="text-white/90 font-medium text-sm md:text-base ml-2 drop-shadow-md pointer-events-auto font-sans tracking-wide">
          {items[currentIndex].type === 'photo_360' ? '360° View' : `${currentIndex + 1} / ${items.length}`}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="pointer-events-auto group rounded-full bg-white/10 hover:bg-white/20 p-2 transition-all backdrop-blur-md cursor-pointer border border-white/5 shadow-lg"
        >
          <svg className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div 
        className="flex-1 relative flex items-center justify-center w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
          className="hidden md:flex absolute left-6 z-40 w-14 h-14 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90 hover:scale-105 cursor-pointer"
        >
          <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} 
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center pt-[50px] p-0 md:p-10"
            >
              {items[currentIndex].type === 'image' && (
                <div className="relative w-[90vw] h-full md:max-h-[85vh]">
                  <Image
                    src={items[currentIndex].src}
                    alt="Gallery Item"
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />
                </div>
              )}

              {items[currentIndex].type === 'video' && (
                <div className="relative max-w-[95vw] max-h-[80vh] aspect-video rounded-xl overflow-hidden bg-black">
                    <video
                    src={items[currentIndex].src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                    />
                </div>
              )}

              {items[currentIndex].type === 'photo_360' && (
                 <div className="w-full h-full md:max-h-[80vh] md:w-[90vw] md:rounded-2xl overflow-hidden relative">
                     {/* 2. REPLACED PANNELLUM WITH REACT-PHOTO-SPHERE-VIEWER */}
                     <ReactPhotoSphereViewer 
                        src={items[currentIndex].src} 
                        height={'100%'} 
                        width={"100%"}
                        container={""} // required prop type fix sometimes
                      />
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }} 
          className="hidden md:flex absolute right-6 z-40 w-14 h-14 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90 hover:scale-105 cursor-pointer"
        >
          <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* --- THUMBNAILS FOOTER --- */}
      <div 
        className="flex-shrink-0 h-auto pb-8 pt-6 w-full z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          ref={thumbnailScrollRef}
          className="flex gap-4 overflow-x-auto px-6 md:justify-center hide-scrollbar snap-x items-center py-[10px]"
        >
          {items.map((item, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentIndex(index)}
              className={`
                group relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[20px] overflow-hidden snap-center cursor-pointer transition-all duration-300
                ${currentIndex === index 
                  ? 'ring-2 ring-blue-500/80 opacity-100 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10' 
                  : 'opacity-40 hover:opacity-100 hover:scale-105'}
              `}
            >
              <div className="relative w-full h-full">
                <Image 
                  src={item.src} 
                  alt="thumb" 
                  fill 
                  className="object-cover" 
                  sizes="80px"
                />
              </div>

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] group-hover:bg-black/10 transition-colors">
                    <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3.25v13.5l12-6.75L4 3.25z"/></svg>
                </div>
              )}
              {item.type === 'photo_360' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] group-hover:bg-black/10 transition-colors">
                     <Image src={vrIcon} alt="360" width={24} height={24} className="drop-shadow-md" />
                 </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};