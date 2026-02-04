"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import { motion, Transition } from 'framer-motion';
import { createPortal } from 'react-dom';
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

// Placeholder imports - ensure these point to your actual assets
import clockIcon from "@/public/icons/clock-icon.svg";
import camIcon from "@/public/icons/camera-icon.svg";
import ticketIcon from "@/public/icons/ticket-icon.svg";
import { SiteFactsData } from '@/app/types/site';

// --- Configuration ---

const transitionSpec: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 28,
    mass: 0.75
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
        <section className='relative mt-[70px] w-full max-w-[1400px] px-6 mx-auto flex flex-col'>
            {/* Soft ambient background (keeps your current aesthetic but feels more premium) */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[1100px] max-w-[120vw] h-[520px] bg-gradient-to-b from-slate-200/70 via-white/60 to-transparent blur-3xl opacity-80" />
            <div className="pointer-events-none absolute -top-16 left-[-6%] w-[340px] h-[340px] rounded-full bg-orange-200/30 blur-[80px]" />
            <div className="pointer-events-none absolute top-[120px] right-[-6%] w-[360px] h-[360px] rounded-full bg-blue-200/25 blur-[90px]" />
            <div className="pointer-events-none absolute bottom-[-120px] left-[18%] w-[380px] h-[380px] rounded-full bg-emerald-200/20 blur-[95px]" />

            <div className='relative z-10 flex flex-col gap-2 mb-7'>
                <h2 className='font-extrabold text-[1.8rem] text-start text-slate-900 tracking-tight'>
                    Know Before You Go
                </h2>
                <div className='flex items-center gap-3'>
                    <div className='h-[3px] w-[65px] rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-emerald-500' />
                    <p className='text-slate-500 font-medium text-[0.95rem] md:text-[1rem]'>
                        Quick facts for your visit.
                    </p>
                </div>
            </div>

            <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 w-full auto-rows-fr'>
                {cards.map((card) => (
                    <FactCard
                        key={card.id}
                        {...card}
                        isSelected={selectedId === card.id}
                        onClick={() => setSelectedId(card.id)}
                    />
                ))}
            </div>

            {selectedCard && (
                <FullScreenOverlay
                    card={selectedCard}
                    onClose={() => setSelectedId(null)}
                />
            )}
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
        <div className={`h-full ${isSelected ? 'invisible' : 'visible'}`}>
            <motion.div
                layoutId={`card-container-${id}`}
                transition={transitionSpec}
                onClick={isLongContent ? onClick : undefined}
                className={`relative rounded-[42px] p-[3px] h-full ${styles.card} active:scale-[0.99] hover:scale-[1.02] duration-100 shadow-[0px_0px_20px_rgba(2,6,23,0.10)]`}
            // whileHover={!isSelected && isLongContent ? { y: -5, scale: 1.012 } : {}}
            // whileTap={!isSelected && isLongContent ? { scale: 0.995 } : {}}
            >
                <div className='group relative flex flex-row items-stretch gap-2 p-2 bg-white/80 h-full rounded-[40px] overflow-hidden'>
                    <div
                        className="absolute inset-0 opacity-[0.14] z-0 pointer-events-none"
                        style={{ backgroundImage: styles.gradient, backgroundSize: '14px 14px' }}
                    />
                    <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-slate-50/70" />

                    <motion.div
                        layoutId={`icon-${id}`}
                        transition={transitionSpec}
                        className={`relative z-10 flex rounded-[30px] items-center justify-center min-w-[83px] ${styles.iconBg}`}
                    >
                        <Image src={icon} alt={label} width={32} height={32} />
                    </motion.div>

                    <div className='relative z-10 flex flex-col justify-start py-1 w-full'>
                        <motion.p
                            layoutId={`label-${id}`}
                            transition={transitionSpec}
                            className={`text-[1rem] font-bold mb-1 ${styles.labelColor}`}
                        >
                            {label}
                        </motion.p>

                        <div className='relative text-[1rem] leading-[1.45] mr-[4px] font-[600] text-slate-800'>
                            <div className="line-clamp-2">
                                {value}
                            </div>

                            {isLongContent && (
                                <div className="absolute bottom-0 right-[-16px] pl-12 pr-2 py-0 h-[1.5em] flex items-center">
                                    <motion.button
                                        layoutId={`more-${id}`}
                                        className={`flex items-center gap-1.5 pl-3 pr-2 py-1 mr-[10px] cursor-pointer rounded-full text-[0.75rem] font-bold shadow-[0px_0px_5px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-black/5 ${styles.iconBg} ${styles.labelColor}`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <span>Read More</span>
                                        {/* Tiny Arrow Icon */}
                                        <svg
                                            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                                            className="transition-transform duration-300 group-hover/card:translate-x-0.5"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M12 5l7 7-7 7" />
                                        </svg>
                                    </motion.button>
                                </div>
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
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] cursor-pointer"
                onClick={onClose}
            >
                <div
                    className={`relative w-full max-w-[640px] max-h-[85vh] flex flex-col rounded-[44px] p-[3px] ${styles.expandedcard} shadow-[0px_30px_90px_rgba(0,0,0,0.45)] cursor-default`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`relative flex flex-col w-full h-full bg-white/90 rounded-[42px] overflow-hidden`}>

                        {/* Pattern Background */}
                        <div className="absolute inset-0 opacity-[0.15] z-0 pointer-events-none"
                            style={{ backgroundImage: styles.gradient, backgroundSize: '14px 14px' }} />

                        <div className="relative z-10 flex items-center justify-between p-6 pb-3 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-[60px] h-[60px] rounded-[20px] ${styles.iconBg}`}>
                                    <Image src={card.icon} alt={card.label} width={28} height={28} className='opacity-80' />
                                </div>

                                <p className={`text-[1rem] font-bold uppercase tracking-widest ${styles.labelColor}`}>
                                    {card.label}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className={`absolute top-6 right-6 flex items-center justify-center rounded-full ${styles.labelColor} hover:text-red-500 active:text-red-500 transition-colors cursor-pointer`}
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="relative z-10 flex-1 overflow-y-auto p-6 pt-2">
                            {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/90 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/90 to-transparent" /> */}
                            <div className='text-[1.15rem] md:text-[1.25rem] leading-[1.7] font-medium text-slate-800 whitespace-pre-line'>
                                {card.value}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
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
            card: 'bg-[#FFA345]/60',
            expandedcard: 'bg-[#FFA345]',
            gradient: 'radial-gradient(#FFA345 1px, transparent 1px)',
            iconBg: 'bg-orange-100',
            labelColor: 'text-orange-600',
        },
        blue: {
            card: 'bg-[#6193FF]/60',
            expandedcard: 'bg-[#6193FF]',
            gradient: 'radial-gradient(#6193FF 1px, transparent 1px)',
            iconBg: 'bg-blue-100',
            labelColor: 'text-blue-600',
        },
        green: {
            card: 'bg-[#78DE98]/60',
            expandedcard: 'bg-[#78DE98]',
            gradient: 'radial-gradient(#78DE98 1px, transparent 2px)',
            iconBg: 'bg-green-100',
            labelColor: 'text-green-600',
        }
    };
    return themes[theme];
};
