// app/components/MapPanel.tsx
"use client";

import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import searchIcon from '@/public/icons/search-icon.svg';

type Site = {
  id: number;
  name: string;
  description: string;
};

const PEEK_HEIGHT = 140;

export default function MapPanel({ sites }: { sites: Site[] }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const [snapPoints, setSnapPoints] = useState<number[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const touchStartRef = useRef({ y: 0 });

  useEffect(() => {
    const calculatedSnapPoints = [
      80, // Fully open
      window.innerHeight * 0.5, // Halfway
      window.innerHeight - PEEK_HEIGHT // Peeking
    ];
    setSnapPoints(calculatedSnapPoints);
    y.set(calculatedSnapPoints[2]);

    const unsubscribeY = y.on("change", (latestY) => {
      // Check if the sheet is at or very near the fully open snap point
      setIsSheetOpen(latestY <= calculatedSnapPoints[0] + 1);
    });

    return () => unsubscribeY();
  }, [y]);

  useEffect(() => {
    document.body.style.overflow = isDragging || isSheetOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDragging, isSheetOpen]);

  // --- CORRECTED GESTURE LOGIC ---
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Store the initial touch position.
      touchStartRef.current.y = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Only apply this custom logic when the sheet is fully open.
      if (!isSheetOpen) return;

      const touchCurrentY = e.touches[0].clientY;
      const touchStartY = touchStartRef.current.y;
      
      // Check if the user is swiping their finger down the screen.
      const isSwipingDown = touchCurrentY > touchStartY;
      // Check if the content element is scrolled to its topmost position.
      const isContentScrolledToTop = contentEl.scrollTop === 0;

      // If the user is swiping down AND the content is at the top,
      // we want to allow the parent sheet to be dragged.
      // To do this, we simply let the event bubble up by returning early.
      if (isSwipingDown && isContentScrolledToTop) {
        return;
      }
      
      // In all other scenarios (e.g., swiping up, or swiping down when not at the top),
      // we want to enable normal content scrolling. We prevent the drag gesture
      // on the parent sheet by stopping the event from bubbling up.
      e.stopPropagation();
    };

    // Add event listeners to the content element.
    // `passive: false` is required on touchmove to allow `stopPropagation`.
    contentEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    contentEl.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      // Cleanup: remove event listeners when the component unmounts or dependencies change.
      contentEl.removeEventListener('touchstart', handleTouchStart);
      contentEl.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isSheetOpen]); // Rerun this effect when the sheet's open state changes.

  const onDragEnd = (_: unknown, info: { velocity: { y: number } }) => {
  setIsDragging(false);
  const currentY = y.get();          // y should be a MotionValue<number>
  const velocity = info.velocity.y;  // velocity is now typed as number
  const velocityThreshold = 200;

  const closestSnapPoint = snapPoints.reduce((prev, curr) =>
    Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev
  );

    let targetSnapPoint = closestSnapPoint;

    // Snap to a different point based on velocity.
    if (velocity > velocityThreshold) {
      targetSnapPoint = snapPoints[2]; // Snap to peeking
    } else if (velocity < -velocityThreshold) {
      targetSnapPoint = snapPoints[0]; // Snap to fully open
    }

    animate(y, targetSnapPoint, {
      type: "spring",
      stiffness: 300,
      damping: 40,
      velocity: velocity,
    });
  };

  if (snapPoints.length === 0) return null;

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Unchanged) --- */}
      <div className="hidden md:block absolute top-0 left-0 w-80 lg:w-96 h-full bg-black/60 backdrop-blur-[20px] shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Explore St. Joseph</h1>
        <div className="relative mb-6">
            <Image src={searchIcon} alt="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 opacity-50" />
            <input
            type="text"
            placeholder="Search"
            className="w-full bg-black/40 font-semibold shadow-[4px_4px_10px_rgba(0,0,0,0.2)] rounded-full pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none"
            />
        </div>
        <div className='bg-red-500/0 w-[100%] flex flex-row justify-between mb-[10px]'>
            <div className='bg-blue-500 min-h-[70px] min-w-[100px] rounded-[20px] border-3 border-white/10'></div>
            <div className='bg-blue-500 min-h-[70px] min-w-[100px] rounded-[20px] border-3 border-white/10'></div>
            <div className='bg-blue-500 min-h-[70px] min-w-[100px] rounded-[20px] border-3 border-white/10'></div>
        </div>
        <ul className="space-y-2">
            {sites.map((site) => (
              <li key={site.id}>
                <button className="w-full text-left p-2 rounded-lg hover:bg-white/10">
                  <h3 className="font-semibold text-white">{site.name}</h3>
                  <p className="text-sm text-gray-400">{site.description}</p>
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* --- MOBILE BOTTOM SHEET --- */}
      <motion.div
        ref={sheetRef}
        className="md:hidden fixed left-0 right-0 w-[100vw] bg-black/65 backdrop-blur-[15px] shadow-2xl z-20 flex flex-col"
        style={{ y, height: window.innerHeight, touchAction: 'none' }}
        drag="y"
        dragConstraints={{ top: snapPoints[0], bottom: snapPoints[2] }}
        dragElastic={{ top: 0.1, bottom: 0.5 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
      >
        <div className="w-full py-3 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        <div className='w-[92vw] self-center'>
            <h1 className="text-2xl font-bold text-white mb-3">Explore St. Joseph</h1>
            <div className="relative mb-5">
                <Image src={searchIcon} alt="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 opacity-50" />
                <input
                type="text"
                placeholder="Search"
                className="w-full bg-black/40 font-semibold shadow-[4px_4px_10px_rgba(0,0,0,0.2)] rounded-[20px] pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none"
                />
            </div>
            <div className='bg-red-500/0 w-[100%] flex flex-row justify-between mb-[10px]'>
                <div className='bg-blue-500 min-h-[70px] min-w-[100px] rounded-[20px] border-3 border-white/10'></div>
                <div className='bg-blue-500 min-h-[70px] min-w-[100px] rounded-[20px] border-3 border-white/10'></div>
                <div className='bg-blue-500 min-h-[70px] min-w-[100px] rounded-[20px] border-3 border-white/10'></div>
            </div>
        </div>

        <div
          ref={contentRef}
          className="flex-grow text-white px-4 overflow-y-auto"
          style={{ touchAction: 'pan-y' }}
        >
          <ul>
            {sites.map((site) => (
              <li key={site.id} className="border-t border-white/10 first:border-none">
                <button className="w-full text-left py-4">
                  <h3 className="font-semibold">{site.name}</h3>
                  <p className="text-sm text-gray-400">{site.description}</p>
                </button>
              </li>
            ))}
            {/* Add padding to the bottom to ensure the last items can be scrolled up */}
            <div className="h-40"></div>
          </ul>
        </div>
      </motion.div>
    </>
  );
}