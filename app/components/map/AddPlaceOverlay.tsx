"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TripSite } from './TripPlanner';

type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
};

const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
};

interface AddPlaceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availableSites: TripSite[];
  onAddItem: (site: TripSite) => void;
  portalContainer: HTMLElement | null;
  parentBounds: Bounds | null;
  parentOnClose: () => void;
}

export default function AddPlaceOverlay({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  availableSites,
  onAddItem,
  portalContainer,
  parentBounds
}: AddPlaceOverlayProps) {

  const [isVisible, setIsVisible] = useState(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animation lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- THE EVENT TRAP ---
  // This effect attaches NATIVE DOM listeners to the overlay wrapper.
  // It intercepts 'mousedown', 'touchstart', and 'pointerdown' BEFORE they
  // bubble up to the document, which prevents "Click Outside" hooks from firing.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !isOpen) return;

    const trapEvent = (e: Event) => {
      e.stopPropagation();
      // @ts-ignore - stopImmediatePropagation exists on DOM Events, TS just gets strict about the Event type
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    };

    // We must block all these to ensure no variation of "click outside" detects this interaction
    const events = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'click', 'contextmenu'];

    events.forEach(event => el.addEventListener(event, trapEvent, { capture: false }));

    return () => {
      events.forEach(event => el.removeEventListener(event, trapEvent));
    };
  }, [isOpen]);

  const maskStyle = useMemo(() => {
    if (!parentBounds || parentBounds.width === 0) return {};
    return {
      top: `${parentBounds.top}px`,
      left: `${parentBounds.left}px`,
      width: `${parentBounds.width}px`,
      height: `${parentBounds.height}px`,
      borderRadius: '40px',
    };
  }, [parentBounds]);

  if (!portalContainer) return null;

  const content = (
    // We wrap everything in this div with the ref to trap events
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999]"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      {/* 1. BACKDROP */}
      {/* Clicking here should close the Overlay, but we must handle it manually
          since we are trapping all clicks on the parent div */}
      <div
        className={`
          absolute inset-0 transition-all duration-300
          ${isOpen ? 'bg-black/0' : 'bg-transparent'}
        `}
        onClick={(e) => {
          // We manually call onClose because the parent trap stops propagation
          e.stopPropagation();
          onClose();
        }}
      />

      {/* 2. MASK CONTAINER */}
      <div
        style={maskStyle}
        className={`
          fixed overflow-hidden pointer-events-none isolate z-[10000]
        `}
      >
        <div
          className={`
            absolute bottom-0 left-0 right-0 mx-auto w-[95%] h-[85%]
            bg-white/10 touch-none rounded-t-[40px] p-0
            shadow-[0_4px_30px_rgba(0,0,0,0.3)]
            backdrop-blur-[25px]
            transform-gpu transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
            pointer-events-auto

            ${isOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-[120%] opacity-0'
            }
          `}
        >
          {/* Content */}
          <div className="rounded-t-[40px] bg-black/60 flex flex-col h-full overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 p-3 pt-4 bg-[#1c1c1e]/0 rounded-t-[20px]">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-9 h-9 flex items-center justify-center bg-[#333] rounded-full text-white/70 hover:text-white transition-colors flex-shrink-0"
              >
                <Icons.ChevronDown />
              </button>
              <div className="flex-1 relative">
                <div className="absolute left-3 top-2.5 text-white/30"><Icons.Search /></div>
                <input
                  type="text"
                  placeholder="Search places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  // Stop React bubbling as well, just to be safe
                  onKeyDown={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  className="w-full bg-[#2c2c2e] text-white rounded-[20px] py-2 pl-10 pr-4 text-sm outline-none placeholder-white/30 focus:bg-[#333] border border-transparent focus:border-white/10 transition-colors"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-[#151515]/0 overscroll-y-contain">
              {availableSites.map(site => (
                <div
                  key={site.id}
                  onClick={(e) => { e.stopPropagation(); onAddItem(site); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { e.stopPropagation(); e.key === 'Enter' && onAddItem(site); }}
                  className="flex items-center justify-between p-3 rounded-[25px] hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer group"
                >
                  <div className='flex-1 pr-3 min-w-0 pl-1'>
                    <h4 className="text-white text-[0.95rem] font-bold truncate leading-tight">{site.name}</h4>
                    <p className="text-white/50 text-[0.75rem] truncate font-medium mt-0.5">{site.category}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#222] text-blue-500 border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icons.Plus />
                  </div>
                </div>
              ))}

              {availableSites.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-12 opacity-30 gap-2">
                  <Icons.Search />
                  <p className="text-center text-sm font-medium">No results found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalContainer);
}
