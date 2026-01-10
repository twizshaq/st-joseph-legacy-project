"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Transition } from 'framer-motion'; 
import { createPortal } from 'react-dom';

// Placeholder imports - ensure these point to your actual assets
import clockIcon from "@/public/icons/clock-icon.svg";
import camIcon from "@/public/icons/camera-icon.svg";
import ticketIcon from "@/public/icons/ticket-icon.svg";
import { SiteFactsData } from '@/app/types/site';

// --- Configuration ---

const transitionSpec: Transition = { 
  type: "spring", 
  stiffness: 200, 
  damping: 25, 
  mass: 0.8 
};

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

  // Scroll Lock Management
  useEffect(() => {
    if (selectedId) {
      // Save current setting
      previousBodyOverflow.current = document.body.style.overflow;
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll when modal closes
      document.body.style.overflow = previousBodyOverflow.current || '';
    }

    // Safety cleanup on unmount
    return () => {
      document.body.style.overflow = previousBodyOverflow.current || '';
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
            isSelected={selectedId === card.id}
            onClick={() => setSelectedId(card.id)}
          />
        ))}
      </div>

      <AnimatePresence>
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

// --- Standard Card (List View) ---

interface FactCardProps extends FactData {
  onClick: () => void;
  isSelected: boolean;
}

const FactCard = ({ id, icon, label, value, theme, onClick, isSelected }: FactCardProps) => {
  const styles = getThemeStyles(theme);
  const isLongContent = typeof value === 'object' || (typeof value === 'string' && value.length > 60);

  return (
    // 'invisible' hides the card visually but keeps its layout space. 
    // This prevents the grid from collapsing or jumping.
    <div className={`h-full ${isSelected ? 'invisible' : 'visible'}`}>
      <motion.div 
        layoutId={`card-container-${id}`}
        transition={transitionSpec}
        onClick={isLongContent ? onClick : undefined}
        className={`relative rounded-[42px] p-[4px] h-full ${styles.card} ${isLongContent ? 'cursor-pointer' : ''}`}
        whileHover={!isSelected && isLongContent ? { y: -4, scale: 1.01 } : {}}
      >
        <div className='group relative flex flex-row items-stretch gap-5 p-2 bg-white/90 h-full rounded-[40px] overflow-hidden'>
          <div className="absolute inset-0 opacity-[0.15] z-0 pointer-events-none" 
               style={{ backgroundImage: styles.gradient, backgroundSize: '14px 14px' }} />

          <motion.div 
            layoutId={`icon-${id}`} 
            transition={transitionSpec} 
            className={`relative z-10 flex items-center justify-center min-w-[80px] w-[80px] h-[80px] rounded-[30px] ${styles.iconBg}`}
          >
            <Image src={icon} alt={label} width={32} height={32} />
          </motion.div>

          <div className='relative z-10 flex flex-col justify-start py-1 w-full'>
            <motion.p 
              layoutId={`label-${id}`} 
              transition={transitionSpec} 
              className={`text-[0.75rem] font-bold uppercase tracking-widest mb-1 ${styles.labelColor}`}
            >
              {label}
            </motion.p>
            
            <div className='relative text-[1rem] leading-[1.4] font-semibold text-slate-800'>
              <div className="line-clamp-2">
                {value}
              </div>
              
              {isLongContent && (
                <motion.span 
                  layoutId={`more-${id}`} 
                  transition={transitionSpec} 
                  className={`absolute bottom-[2px] right-0 bg-white pl-4 mr-[7px] text-[0.75rem] font-bold underline cursor-pointer ${styles.labelColor}`}
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 20%)' }}
                >
                  Read More
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Full Screen Overlay (Expanded) ---

const FullScreenOverlay = ({ card, onClose }: { card: FactData, onClose: () => void }) => {
  const styles = getThemeStyles(card.theme);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <Portal>
      {/* 
         FIX: Added pointerEvents: 'none' to the exit variant.
         This ensures that as soon as the close animation starts (fading out),
         the overlay allows clicks to pass through to the page below immediately.
      */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: 'none' }} 
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px] cursor-pointer"
        onClick={onClose}
      >
        <motion.div 
          layoutId={`card-container-${card.id}`} 
          transition={transitionSpec}
          // Added 'cursor-default' so clicking the white card itself doesn't trigger the backdrop close
          className={`relative w-full max-w-[600px] max-h-[85vh] flex flex-col rounded-[42px] p-[4px] ${styles.card} shadow-2xl cursor-default`}
          onClick={(e) => e.stopPropagation()} 
        >
          <div className={`relative flex flex-col w-full h-full bg-white rounded-[40px] overflow-hidden`}>
            
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-[0.15] z-0 pointer-events-none" 
                 style={{ backgroundImage: styles.gradient, backgroundSize: '14px 14px' }} />

            <div className="relative z-10 flex items-center justify-between p-6 pb-2 shrink-0">
              <div className="flex items-center gap-4">
                <motion.div 
                  layoutId={`icon-${card.id}`} 
                  transition={transitionSpec} 
                  className={`flex items-center justify-center w-[60px] h-[60px] rounded-[20px] ${styles.iconBg}`}
                >
                  <Image src={card.icon} alt={card.label} width={28} height={28} className='opacity-80' />
                </motion.div>
                
                <motion.p 
                  layoutId={`label-${card.id}`} 
                  transition={transitionSpec} 
                  className={`text-[1rem] font-bold uppercase tracking-widest ${styles.labelColor}`}
                >
                  {card.label}
                </motion.p>
              </div>

              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                ✕
              </motion.button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-6 pt-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className='text-[1.25rem] leading-[1.6] font-medium text-slate-800 whitespace-pre-line'
              >
                {card.value}
              </motion.div>
            </div>

            <motion.div layoutId={`more-${card.id}`} className="absolute bottom-0 opacity-0 pointer-events-none" />

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
      card: 'bg-[#FF8400]/10', 
      gradient: 'radial-gradient(#FF8F00 1px, transparent 1px)', 
      iconBg: 'bg-orange-100',
      labelColor: 'text-orange-600',
    },
    blue: {
      card: 'bg-[#2563EB]/10', 
      gradient: 'radial-gradient(#2563EB 1px, transparent 1px)', 
      iconBg: 'bg-blue-100',
      labelColor: 'text-blue-600',
    },
    green: {
      card: 'bg-[#15803d]/10', 
      gradient: 'radial-gradient(#15803d 1px, transparent 1px)', 
      iconBg: 'bg-green-100',
      labelColor: 'text-green-600',
    }
  };
  return themes[theme];
};