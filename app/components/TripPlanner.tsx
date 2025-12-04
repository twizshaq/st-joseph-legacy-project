"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import arrowIcon from "@/public/icons/arrow-icon.svg";
import AddIcon from "@/public/icons/add-icon"
import MapIcon from "@/public/icons/map-icon"
// REMOVED: TrashIcon import (unused)
import { Reorder, useDragControls } from "framer-motion";
// REMOVED: createClient import (unused)

// --- TYPES ---
export type TripSite = {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
  imageUrl?: string;
};

export type Site = {
  id: number;
  name: string;
  category: string;
  description: string;
  coordinates: [number, number]; 
  imageUrl: string;
  colorhex: string;
  slug: string;
};

// REMOVED: SupabaseSiteData interface (unused in this file)

export type TripData = {
  name: string;
  scheduledAt: string;
  sites: TripSite[];
};

interface TripPlannerProps {
  sites: TripSite[];
  onBack: () => void;
  onClose: () => void;
  onSaveTrip?: (data: TripData) => void;
  mobileSearchOpen: boolean; 
  onHeaderClick: () => void;
}

// --- ICONS ---
const Icons = {
  // REMOVED: DragHandle (unused, you used inline SVG)
  // REMOVED: Close (unused)
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  ChevronUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Map: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Location: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.5 15L22 18.5L15.5 22L12 15.5L8.5 22L2 18.5L8.5 15L12 2Z" /></svg>,
  // REMOVED: Calendar (unused)
};

export default function TripPlanner({ sites, onBack, onClose, onSaveTrip, mobileSearchOpen, onHeaderClick }: TripPlannerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [scheduledDate, setScheduledDate] = useState("");
  const [tripName, setTripName] = useState("My Trip to Barbados");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<TripSite[]>([]);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setScheduledDate(now.toISOString().slice(0, 16));
  }, []);

  const availableSites = sites.filter(s => 
    !selectedItems.some(sel => sel.id === s.id) &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addItem = (site: TripSite) => setSelectedItems([...selectedItems, site]);
  const removeItem = (id: number) => setSelectedItems(prev => prev.filter(i => i.id !== id));

  // REMOVED: moveItem (unused)

  const handleSave = () => {
    if (selectedItems.length === 0) return;
    const tripData: TripData = { name: tripName, scheduledAt: scheduledDate, sites: selectedItems };
    if (onSaveTrip) onSaveTrip(tripData);
  };

  const handleExport = (platform: 'google' | 'apple') => {
    if (!selectedItems.length) return;
    const latLng = (s: TripSite) => `${s.coordinates[1]},${s.coordinates[0]}`;
    if (platform === 'google') {
      const destination = latLng(selectedItems[selectedItems.length - 1]);
      const waypoints = selectedItems.length > 1
        ? "&waypoints=" + selectedItems.slice(0, -1).map(latLng).join('|') : "";
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}${waypoints}`, '_blank');
    } else {
      window.open(`http://maps.apple.com/?daddr=${latLng(selectedItems[0])}`, '_blank');
    }
  };

    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
  
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop } = scrollContainerRef.current;
        setIsScrolled(scrollTop > 0);
      }
    };

    // REMOVED: dragItem, dragOverItem, handleSort (All unused)

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden rounded-[40px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* --- HEADER --- */}
        {/* FIX: Changed div to div with role="button" to fix accessibility error, 
            or you could remove onClick here if the click is only meant for the back button */}
        <div 
          onClick={onHeaderClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onHeaderClick()}
          className="outline-none"
        >
        <div className={`
          absolute z-30 flex items-start justify-between px-[10px] w-full
          transition-all duration-400 
          ${mobileSearchOpen ? 'bg-black/0 pt-[7.5px] mt-[6px] pb-[0px] px-[15px]' : 'bg-black/0 mt-[0px] py-[7.5px]'}
        `}>
          
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Stop bubbling to header
              onBack();
            }} 
            className={`
              inline-flex pr-[10px] active:scale-[.95] shrink-0 cursor-pointer items-center gap-2 
              text-white/90 hover:text-white active:opacity-80 
              ${mobileSearchOpen ? 'mt-[7px]' : 'mt-[-1px]'}
            `}
          >
            <span className='rotate-[-90deg]'><Image src={arrowIcon} alt='Back Icon' height={35} /></span>
          </button>

          <div className='flex flex-col text-right pr-3 pt-1 flex-1 mt-[-11px] min-w-0 overflow-hidden relative'>
            <div className="w-full">
               <input 
                type="text" 
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Allow typing without triggering header click
                className={`
                  w-full bg-transparent text-white text-right font-bold text-[1.23rem] outline-none
                  text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] p-0 m-0 border-none focus:ring-0
                  transition-all duration-400 
                  ${mobileSearchOpen ? 'mt-[10px]' : 'mt-[0px]'}
                  ${!mobileSearchOpen ? 'pointer-events-none' : ''} 
                `}
                placeholder="Trip Name"
                tabIndex={!mobileSearchOpen ? -1 : 0} 
              />
            </div>
            <input 
              type="datetime-local" 
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className={`
                bg-transparent text-[#E0E0E0] text-sm text-right outline-none w-full font-medium p-0 m-0 
                border-none focus:ring-0 [color-scheme:dark] opacity-90 cursor-pointer mt-[-2px] 
                text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]
                ${!mobileSearchOpen ? 'pointer-events-none' : ''}
              `}
              tabIndex={!mobileSearchOpen ? -1 : 0}
            />
          </div>
        </div>
      </div>

          <div
            className={`
              fixed top-0 left-0 right-0 w-full bg-[#676767] pointer-events-none
              transition-all duration-400 ease-in-out z-[20] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]
              h-[100px] 
              ${isScrolled ? 'opacity-100' : 'opacity-0'}
            `}
          ></div>
          <div
            className={`
              absolute bottom-0 left-0 right-0 rotate-[180deg] w-full bg-[#676767] pointer-events-none
              transition-all duration-400 ease-in-out z-[20] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]
              ${mobileSearchOpen ? 'h-[100px]' : 'h-0 opacity-0'}
            `}
          ></div>


        {/* --- TRIP LIST CONTENT --- */}
        <div onScroll={handleScroll} ref={scrollContainerRef} className="flex-1 overflow-y-auto h-[100%] justify-center items-center relative bg-red-500/0 custom-scrollbar p-4 space-y-2 relative">
          
          {/* Start Point */}
          <div className='flex gap-[10px] w-[100%] bg-red-500/0 mt-18'>
            <div className='bg-blue-500/40 active:scale-[.98] rounded-[26px] w-[100%] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
              <div className="flex items-center gap-4 bg-blue-900/60 p-3 rounded-[24px] shadow-[0px_0px_10px_rgba(0,0,0,0)]">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-blue-500/20">
                  <Icons.Location />
                </div>
                <div>
                  <h4 className="text-blue-100 font-bold text-sm">Current Location</h4>
                  <p className="text-blue-300/60 text-[10px] uppercase font-bold tracking-wider">Starting Point</p>
                </div>
              </div>
            </div>
            {/* FIX: Changed div to button for accessibility */}
            <button 
              onClick={() => { setIsAdding(true); setShowExportMenu(false); }} 
              className='bg-white/10 active:scale-[.98] rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] cursor-pointer'
              aria-label="Add Stop"
            >
                <AddIcon size={45} color="#fff" className='bg-black/30 h-[100%] w-[100%] p-3 rounded-[23px]'/>
            </button>
          </div>

          <div className='bg-white/10 h-[2px] my-[13px] w-[75%] self-center mx-auto'></div>

          <div className="relative space-y-2 pb-24 bg-red-500/0 flex flex-col gap-2"> 
            
            {selectedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-[10%] text-white/30 text-center gap-2">
                <MapIcon size={25} color="#ffffff30"/>
                <div><p className="text-sm font-medium">No places added Yet</p></div>
              </div>
            ) : (
              <Reorder.Group 
                axis="y" 
                values={selectedItems} 
                onReorder={setSelectedItems} 
                className="flex flex-col gap-2"
              >
                {selectedItems.map((item, i) => (
                  <SortableTripItem 
                    key={item.id} 
                    item={item} 
                    index={i} 
                    onRemove={removeItem}
                  />
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="absolute bottom-0 p-4 pt-2 flex bg-red-500/0 gap-3 z-30 w-full">
          <div className='relative h-full'>
            <button disabled={selectedItems.length === 0} onClick={() => setShowExportMenu(!showExportMenu)} className={`self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-[26px] p-[2.7px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)]  w-[100%]`}>
              <div className='flex items-center gap-[7px] text-center w-[100%] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-[23px] px-[35px] py-[15.4px]'>
                <p className='text-white font-bold'>Add to Maps</p>
                <MapIcon size={25} color="#fff" className=''/>
              </div>
            </button>
            {showExportMenu && selectedItems.length > 0 && (
                <div className="absolute bottom-[115%] left-0 right-0 bg-[#252525] border border-white/10 rounded-xl shadow-xl overflow-hidden p-1 animate-in zoom-in-95 duration-200 z-50">
                    <button onClick={() => handleExport('google')} className="w-full text-left px-3 py-3 text-sm text-white hover:bg-white/10 rounded-lg font-medium">Google Maps</button>
                    <button onClick={() => handleExport('apple')} className="w-full text-left px-3 py-3 text-sm text-white hover:bg-white/10 rounded-lg font-medium border-t border-white/5">Apple Maps</button>
                </div>
            )}
          </div>

          <button onClick={handleSave} disabled={selectedItems.length === 0} className={`flex items-center justify-center gap-2 py-[15.4px] rounded-[23px] font-bold text-xs sm:text-sm transition-all border border-white/5 ${selectedItems.length > 0 ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/40 text-white/20 cursor-not-allowed'}`}>Save</button>
        </div>

        {/* --- ADD PLACES OVERLAY --- */}
        <div className={`absolute inset-x-2 bottom-2 top-[90px] rounded-[20px] bg-[#1c1c1e] z-40 flex flex-col border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isAdding ? 'translate-y-0' : 'translate-y-[110%]'}`}>
          <div className="flex items-center gap-3 p-3 border-b border-white/10 bg-[#1c1c1e] rounded-t-[20px]">
            <button onClick={() => setIsAdding(false)} className="w-8 h-8 flex items-center justify-center bg-[#333] rounded-full text-white/70 hover:text-white"><Icons.ChevronDown /></button>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-2.5 text-white/30"><Icons.Search /></div>
              <input autoFocus={isAdding} type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#2c2c2e] text-white rounded-xl py-2 pl-9 pr-4 text-sm outline-none placeholder-white/30 focus:bg-[#333] border border-transparent focus:border-white/10 transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-[#151515]">
            {availableSites.map(site => (
              // FIX: Added keyboard support for accessibility
              <div 
                key={site.id} 
                onClick={() => addItem(site)} 
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && addItem(site)}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className='flex-1 pr-2 min-w-0'><h4 className="text-white text-sm font-medium truncate">{site.name}</h4><p className="text-white/40 text-xs truncate">{site.category}</p></div>
                <div className="w-8 h-8 rounded-full bg-[#222] text-blue-500 border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors"><Icons.Plus /></div>
              </div>
            ))}
            {availableSites.length === 0 && <p className="text-center text-white/20 text-sm mt-8">No results found.</p>}
          </div>
        </div>
        {isAdding && (<div className="absolute top-0 bottom-[90%] left-0 right-0 z-30" onClick={() => setIsAdding(false)} />)}
    </div>
  );
}

const SortableTripItem = React.memo(({ item, index, onRemove }: { item: TripSite, index: number, onRemove: (id: number) => void }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={String(item.id)}
      dragListener={false} 
      dragControls={controls}
      className="relative my-1 select-none touch-none" 
      layout="position"
    >
      <div className='bg-white/10 active:scale-[.98] rounded-[26px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] transition-colors hover:bg-white/20 transform-gpu'>
        <div className="flex items-center gap-3 bg-black/30 px-2 pr-4 rounded-[23px] z-10 py-3">
          
          <div className="w-8 h-8 flex-shrink-0 rounded-[10px] overflow-hidden bg-[#333]/70 text-white flex items-center justify-center text-xs font-bold font-mono border border-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.3)] relative">
            {item.imageUrl ? (
              <Image 
                src={item.imageUrl} 
                alt={item.name}
                fill
                className='object-cover'
                sizes="32px"
                loading="eager"
              />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0 pointer-events-none">
            <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
          </div>
          
          <div className="flex items-center gap-3 pl-2 border-l border-white/10 touch-none"> 
            
            <div 
              onPointerDown={(e) => controls.start(e)}
              className="text-white/40 hover:text-white cursor-grab active:cursor-grabbing p-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>

            <button 
              onClick={(e) => { 
                  e.stopPropagation(); 
                  onRemove(item.id); 
              }} 
              className="p-2 -mr-1 text-red-400 hover:bg-red-500/10 rounded-full active:scale-90 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
});

// Explicit Display Name for Memoized Component (Fixes potential display-name error)
SortableTripItem.displayName = 'SortableTripItem';