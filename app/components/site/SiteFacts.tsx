"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Transition } from 'framer-motion'; 
import { createPortal } from 'react-dom';

import clockIcon from "@/public/icons/clock-icon.svg";
import camIcon from "@/public/icons/camera-icon.svg";
import ticketIcon from "@/public/icons/ticket-icon.svg";
import { SiteFactsData } from '@/app/types/site';

// --- Configuration ---

// Layout/shared-element transitions (for layoutId animations)
const layoutTransition: Transition = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 };

// Simple fades/scales should feel consistent everywhere
const fadeTransition: Transition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

interface FactData {
  id: string;
  icon: any;
  label: string;
  value: ReactNode;
  theme: 'orange' | 'blue' | 'green';
}

interface SiteFactsProps {
  facts: SiteFactsData;
}

export const SiteFacts = ({ facts }: SiteFactsProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const previousBodyOverflow = useRef<string | null>(null);

  // FIX 1: Manage Scroll Lock in Parent (More Robust)
  // Store the previous body overflow value and restore it when the modal closes.
  // This avoids leaving the page in a locked or odd interaction state.
  useEffect(() => {
    if (selectedId) {
      // capture only once per open
      if (previousBodyOverflow.current === null) {
        previousBodyOverflow.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      // restore
      if (previousBodyOverflow.current !== null) {
        document.body.style.overflow = previousBodyOverflow.current;
        previousBodyOverflow.current = null;
      }
    }

    return () => {
      // ensure restore on unmount
      if (previousBodyOverflow.current !== null) {
        document.body.style.overflow = previousBodyOverflow.current;
        previousBodyOverflow.current = null;
      }
    };
  }, [selectedId]);

  const cards: FactData[] = [
    { id: 'cat', icon: clockIcon, label: "Category", value: facts.Category, theme: "orange" },
    { id: 'amen', icon: camIcon, label: "Amenities", value: facts.Amenities, theme: "blue" },
    { id: 'acc', icon: ticketIcon, label: "Accessibility", value: facts.Accessibility, theme: "green" },
    { id: 'near', icon: ticketIcon, label: "Nearby Must See", value: facts.Nearby_Must_See, theme: "green" },
    { id: 'best', icon: clockIcon, label: "Best For", value: facts.Best_For, theme: "green" },
  ];

  const selectedCard = cards.find(c => c.id === selectedId);

  return (
    <section className='relative mt-[60px] w-full max-w-[1400px] px-6 mx-auto flex flex-col'>
      <h2 className='relative z-10 font-bold text-[2rem] text-start mb-8 text-slate-900'>
        Know Before You Go
      </h2>
      
      <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-fr'>
        {cards.map((card) => (
          <FactCard 
            key={card.id}
            {...card} 
            onClick={() => setSelectedId(card.id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {selectedCard && (
          <FullScreenOverlay 
            key={`overlay-${selectedCard.id}`}
            card={selectedCard} 
            onClose={() => setSelectedId(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// --- Standard Card (Small) ---

interface FactCardProps extends FactData {
  onClick: () => void;
}

const FactCard = ({ id, icon, label, value, theme, onClick }: FactCardProps) => {
  const styles = getThemeStyles(theme);
  const isLongContent = typeof value === 'object' || (typeof value === 'string' && value.length > 60);

  return (
    <motion.div 
      layoutId={`card-${id}`}
      transition={layoutTransition}
      onClick={isLongContent ? onClick : undefined}
      // FIX 2: Removed 'bg-white' here. 
      // Rely on `styles.card` (e.g., bg-orange/10) to show the theme color.
      className={`relative rounded-[42px] p-[3px] h-full ${styles.card} ${isLongContent ? 'cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:scale-[.99]' : ''}`}
    >
      <div className='group relative flex flex-row items-stretch gap-5 p-2 bg-white/80 h-full rounded-[40px] overflow-hidden'>
        
        {/* Pattern: Increased opacity to 0.15 so it is visible */}
        <div className="absolute inset-0 opacity-[0.15] z-0 pointer-events-none" style={{ backgroundImage: styles.gradient, backgroundSize: '14px 14px' }} />

        <motion.div layoutId={`icon-${id}`} transition={layoutTransition} className={`relative z-10 flex items-center justify-center min-w-[80px] max-w-[80px] max-h-[80px] rounded-[30px] ${styles.iconBg}`}>
          <Image src={icon} alt={label} width={32} height={32} />
        </motion.div>

        <div className='relative z-10 flex flex-col justify-start py-1 w-full'>
          <motion.p layoutId={`label-${id}`} transition={layoutTransition} className={`text-[0.75rem] font-bold uppercase tracking-widest mb-1 ${styles.labelColor}`}>
            {label}
          </motion.p>
          
          {/* Relative container to hold both the text and the absolute "Read More" */}
          <div className='relative text-[1rem] leading-[1.4] font-semibold text-slate-800'>
            
            {/* The text remains clamped to 2 lines */}
            <div className="line-clamp-2">
              {value}
            </div>

            {/* The Read More link is positioned over the bottom-right corner */}
            {isLongContent && (
              <motion.span 
                layoutId={`more-${id}`} 
                transition={layoutTransition} 
                className={`absolute bottom-[3px] right-0 bg-white px-4 text-[0.75rem] font-bold underline cursor-pointer ${styles.labelColor}`}
                style={{
                  // This creates a fade effect so the text doesn't look cut off abruptly behind the link
                  maskImage: 'linear-gradient(to right, transparent, black 13%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 13%)',
                }}
              >
                Read More
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Full Screen Overlay (Expanded) ---

const FullScreenOverlay = ({ card, onClose }: { card: FactData, onClose: () => void }) => {
  const styles = getThemeStyles(card.theme);

  // Listen for Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <Portal>
      <motion.div 
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{ opacity: 1, pointerEvents: 'auto' }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
        transition={fadeTransition}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
        onClick={onClose}
      >
        <motion.div 
          layoutId={`card-${card.id}`} 
          transition={layoutTransition}
          // FIX 2: Removed 'bg-white' from here too. The theme color will now show.
          // Added 'bg-white' specifically to the inner container below if needed, 
          // or rely on the theme's tint.
          className={`relative w-full max-w-[600px] max-h-[85vh] overflow-y-auto rounded-[52px] p-[4px] ${styles.card} shadow-2xl pointer-events-auto`}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Inner Content Container - bg-white/95 to make text readable but keep subtle color behind it */}
          <div className={`relative flex flex-col gap-6 p-6 bg-white min-h-full rounded-[48px]`}>
             
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-[0.15] z-0 pointer-events-none" style={{ backgroundImage: styles.gradient, backgroundSize: '14px 14px' }} />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div layoutId={`icon-${card.id}`} transition={layoutTransition} className={`flex items-center justify-center w-[60px] h-[60px] rounded-[20px] ${styles.iconBg}`}>
                  <Image src={card.icon} alt={card.label} width={28} height={28} className='opacity-80' />
                </motion.div>
                <motion.p layoutId={`label-${card.id}`} transition={layoutTransition} className={`text-[1rem] font-bold uppercase tracking-widest ${styles.labelColor}`}>
                  {card.label}
                </motion.p>
              </div>

              <motion.button 
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={fadeTransition}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-20 cursor-pointer"
              >
                <span className="font-bold text-gray-500 px-2 text-lg">✕</span>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fadeTransition, delay: 0.05 }}
              className='relative z-10 text-[1.25rem] leading-[1.6] font-medium text-slate-800 whitespace-pre-line'
            >
              {card.value}
            </motion.div>
            
            <motion.p layoutId={`more-${card.id}`} transition={layoutTransition} className="hidden" />

          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

// --- Utilities ---

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
};

const getThemeStyles = (theme: 'orange' | 'blue' | 'green') => {
  const themes = {
    orange: {
      card: 'bg-[#FF8400]/10', // Light Orange Background
      gradient: 'radial-gradient(#FF8F00 1px, transparent 1px)', // Orange Dots
      iconBg: 'bg-orange-100',
      labelColor: 'text-orange-600',
    },
    blue: {
      card: 'bg-[#2563EB]/10', // Light Blue Background
      gradient: 'radial-gradient(#2563EB 1px, transparent 1px)', // Blue Dots
      iconBg: 'bg-blue-100',
      labelColor: 'text-blue-600',
    },
    green: {
      card: 'bg-[#15803d]/10', // Light Green Background
      gradient: 'radial-gradient(#15803d 1px, transparent 1px)', // Green Dots
      iconBg: 'bg-green-100',
      labelColor: 'text-green-600',
    }
  };
  return themes[theme];
};