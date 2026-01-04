"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import arrowIcon from "@/public/icons/arrow-icon.svg";
import AddIcon from "@/public/icons/add-icon";
import MapIcon from "@/public/icons/map-icon";
import TrashIcon from "@/public/icons/trash-icon";
import { Reorder, useDragControls } from "framer-motion";
import { format } from 'date-fns';
import DatePicker from '../DatePicker';
import AddIco from '@/public/icons/add-icon'
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import applemapsIcon from "@/public/icons/applemaps.svg"; 
import googlemapsIcon from "@/public/icons/googlemaps.svg";
import Portal from '../Portal';



// --- TYPES ---
export type TripSite = {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
  imageUrl?: string;
};

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

const Icons = {
  Location: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.5 15L22 18.5L15.5 22L12 15.5L8.5 22L2 18.5L8.5 15L12 2Z" /></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
};








// --- INTERNAL COMPONENT: The Overlay ---
function InternalAddPlaceOverlay({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  availableSites, 
  onAddItem 
}: {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  availableSites: TripSite[];
  onAddItem: (site: TripSite) => void;
}) {
  const [isVisible, setIsVisible] = useState(isOpen);

  // Sync internal visibility with prop AND cleanup on unmount
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // If closing, wait for animation then hide
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // If not open and not animating out, do not render ANYTHING.
  if (!isVisible && !isOpen) return null;

  // --- EVENT FIREWALL ---
  const stopProp = (e: any) => {
    e.stopPropagation();
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  

  return (
    <div className={`absolute inset-0 z-[50] flex flex-col justify-end isolate pointer-events-none ${isOpen ? 'pointer-events-auto' : ''}`}>
      
      {/* 1. BACKDROP */}
      <div 
        className={`
          absolute inset-0 transition-all duration-300 
          ${isOpen ? ' pointer-events-auto bg-transparent' : 'bg-transparent pointer-events-none'}
        `}
        onClick={(e) => {
          stopProp(e);
          onClose();
        }}
        onPointerDown={stopProp}
        onTouchStart={stopProp}
      />

      {/* 2. SHEET */}
      <div 
        className={`
          relative mb-[10px] w-[95%] h-[80%] mx-auto
          bg-[#fff]/10 touch-none rounded-[40px] p-[3px] 
          shadow-[0_0px_30px_rgba(0,0,0,0.5)]
          transform-gpu transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[120%] opacity-0 pointer-events-none'}
        `}
        onClick={stopProp}
        onPointerDown={stopProp}
        onMouseDown={stopProp}
        onTouchStart={stopProp}
      >
         <div className="rounded-[37px] bg-[#424242] flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 pb-2">
              <button 
                onClick={onClose}
                className="w-9 h-9 flex items-center cursor-pointer justify-center rounded-full text-white/70 hover:text-white transition-colors flex-shrink-0 active:opacity-80 active:scale-[.95]"
              >
                <span className='rotate-[180deg]'><Image src={arrowIcon} alt='Back Icon' height={35} /></span>
              </button>
              <div className="flex-1 relative">
                <div className="absolute left-3 top-[13px] text-[1.2rem] text-white/30"><IoSearch /></div>
                <input 
                  type="text" 
                  placeholder="Search places..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  onKeyDown={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  className="w-full bg-[#333] text-white rounded-[30px] py-3 pl-10 pr-4 text-sm outline-none font-[500] placeholder-white/30 focus:bg-[#333] border border-transparent focus:border-white/10 transition-colors" 
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {availableSites.map(site => (
                <div 
                  key={site.id} 
                  onClick={() => onAddItem(site)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { e.key === 'Enter' && onAddItem(site); }}
                  className="flex items-center justify-between p-3 rounded-[25px] hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer group"
                >
                  <div className='flex-1 pr-3 min-w-0 pl-1'>
                    <h4 className="text-white text-[0.95rem] font-bold truncate leading-tight">{site.name}</h4>
                    <p className="text-white/50 text-[0.75rem] truncate font-medium mt-0.5">{site.category}</p>
                  </div>
                  <div className="w-10 h-10 text-white flex items-center justify-center">
                    <span className='text-[1.2rem]'><FaPlus /></span>
                  </div>
                </div>
              ))}
              
              {availableSites.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-12 opacity-30 gap-2">
                  <Icons.Search />
                  <p className="text-center text-sm font-medium text-white/50">No results found.</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

function InternalDatePickerOverlay({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedDate: Date; 
  onChange: (date: Date) => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center isolate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/0" 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />
      {/* DatePicker Container */}
      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        <DatePicker 
          selectedDate={selectedDate} 
          onChange={onChange} 
          onClose={onClose} 
        />
      </div>
    </div>
  );
}







// --- MAIN COMPONENT ---
export default function TripPlanner({ sites, onBack, onClose, onSaveTrip, mobileSearchOpen, onHeaderClick }: TripPlannerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);


  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateSelect = (date: Date) => {
    // Convert Date object back to ISO string for your existing logic
    const isoString = format(date, "yyyy-MM-dd'T'HH:mm");
    setScheduledDate(isoString);
    setShowDatePicker(false);
  };
  
  // Trip Data State
  const [scheduledDate, setScheduledDate] = useState("");
  const [tripName, setTripName] = useState("My Trip to Barbados");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<TripSite[]>([]);

  const exportButtonRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0, width: 0 });

  const toggleExportMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showExportMenu && exportButtonRef.current) {
      const rect = exportButtonRef.current.getBoundingClientRect();
      setMenuPos({
        bottom: window.innerHeight - rect.top + 10, // 10px above the button
        left: rect.left,
        width: rect.width
      });
    }
    setShowExportMenu(!showExportMenu);
  };

  // Scroll Shadow Logic
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setScheduledDate(now.toISOString().slice(0, 16));
  }, []);

  // --- CRITICAL FIX: FORCE CLOSE OVERLAY WHEN PLANNER SHRINKS ---
  useEffect(() => {
    if (!mobileSearchOpen) {
      setIsAdding(false);
    }
  }, [mobileSearchOpen]);

  const handleOpenAdd = () => {
    setIsAdding(true);
    setShowExportMenu(false);
  };

  const availableSites = sites.filter(s => 
    !selectedItems.some(sel => sel.id === s.id) &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addItem = (site: TripSite) => setSelectedItems([...selectedItems, site]);
  const removeItem = (id: number) => setSelectedItems(prev => prev.filter(i => i.id !== id));

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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      setIsScrolled(scrollTop > 0);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden rounded-[40px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div 
          onClick={onHeaderClick}
          className="outline-none cursor-default"
        >
          <div className={`
            absolute z-[60] flex items-start justify-between px-[10px] w-full
            transition-all duration-400 
            ${mobileSearchOpen ? 'bg-black/0 pt-[7.5px] mt-[6px] pb-[0px] px-[15px]' : 'bg-black/0 mt-[0px] py-[7.5px]'}
          `}>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isAdding) {
                    setIsAdding(false);
                } else {
                    onBack();
                }
              }} 
              className={`
                inline-flex pr-[10px] active:scale-[.95] shrink-0 cursor-pointer items-center gap-2 
                text-white/90 hover:text-white active:opacity-80 active:scale-[.95]
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
                  onClick={(e) => e.stopPropagation()} 
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
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDatePicker(true);
                }}
                className={`
                  bg-transparent text-[#E0E0E0] text-sm text-right outline-none w-full font-medium p-0 m-0 
                  opacity-90 cursor-pointer mt-[-2px] 
                  text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]
                  ${!mobileSearchOpen ? 'pointer-events-none' : ''}
                `}
              >
                {scheduledDate 
                  ? format(new Date(scheduledDate), "MMM d, yyyy") 
                  : "Select Date"}
              </button>
            </div>
          </div>
        </div>

        {/* Shadows */}
        <div className={`absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#686868] via-[#686868]/80 to-transparent z-20 ${mobileSearchOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 rotate-[180deg] left-0 w-full h-[100px] bg-gradient-to-b from-[#686868] via-[#686868]/80 to-transparent z-20 ${mobileSearchOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* Main List */}
        <div 
           onScroll={handleScroll} 
           ref={scrollContainerRef} 
           className={`
              flex-1 overflow-y-auto h-[100%] justify-center items-center relative custom-scrollbar p-4 space-y-2
              transition-all duration-300 ease-in
              ${mobileSearchOpen ? 'opacity-100 delay-75' : 'opacity-0 pointer-events-none'}
           `}
        >
          
          <div className='flex gap-[10px] w-[100%] bg-red-500/0 mt-18'>
            <div className='bg-blue-500/40 active:scale-[.98] rounded-[26px] w-[100%] p-[3px]'>
              <div className="flex items-center gap-4 bg-blue-900/60 p-3 rounded-[24px]">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-blue-500/20">
                  <Icons.Location />
                </div>
                <div>
                  <h4 className="text-blue-100 font-bold text-sm">Current Location</h4>
                  <p className="text-blue-300/60 text-[10px] uppercase font-bold tracking-wider">Starting Point</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleOpenAdd} 
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
              <Reorder.Group axis="y" values={selectedItems} onReorder={setSelectedItems} className="flex flex-col gap-2">
                {selectedItems.map((item, i) => (
                  <SortableTripItem key={item.id} item={item} index={i} onRemove={removeItem}/>
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`
          absolute bottom-0 p-4 pt-2 flex bg-red-500/0 gap-3 z-30 w-full
          transition-opacity duration-300 ease-in-out
          ${mobileSearchOpen ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-full pointer-events-none'}
        `}>
          <div className='relative h-full' ref={exportButtonRef}>
            <button 
              disabled={selectedItems.length === 0} 
              onClick={toggleExportMenu} 
              className={`self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-[26px] p-[2.7px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] w-[100%]`}
            >
              <div className='flex items-center gap-[7px] text-center w-[100%] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-[23px] px-[35px] py-[15.4px]'>
                <p className='text-white font-bold'>Export to Maps</p>
                <MapIcon size={25} color="#fff" className=''/>
              </div>
            </button>
            
            {showExportMenu && selectedItems.length > 0 &&  (
              <Portal>
                {/* Transparent Backdrop to close on click outside */}
                <div 
                  className="fixed inset-0 z-[9998]" 
                  onClick={() => setShowExportMenu(false)} 
                />
                  <div style={{ 
                        position: 'fixed', 
                        bottom: `${menuPos.bottom}px`, 
                        left: `${menuPos.left}px`, 
                        width: `${menuPos.width}px`,
                        zIndex: 9999 
                      }} 
                      className="bg-white/10 backdrop-blur-[7px] p-[2.7px] bg-[#252525] max-w-[162px] rounded-[30px] shadow-[0px_0px_20px_rgba(0,0,0,0.2)] overflow-hidden p-1 duration-200 z-50 flex flex-col">
                    <div className="flex flex-col bg-black/30 text-white font-medium rounded-[27px] p-[5px]">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleExport('google'); setShowExportMenu(false); }} 
                        className="p-3.5 hover:bg-black/40 active:bg-black/40 text-center rounded-[20px] transition-colors cursor-pointer flex items-center justify-center gap-2"
                      ><Image src={googlemapsIcon} alt="Google Maps" height={16} width={16} className="object-contain" />
                        Google Maps
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleExport('apple'); setShowExportMenu(false); }} 
                        className="p-3.5 hover:bg-black/40 active:bg-black/40 text-center rounded-[20px] transition-colors cursor-pointer flex items-center justify-center gap-2"
                      ><Image src={applemapsIcon} alt="Apple Maps" height={16} width={16} className="object-contain" />
                        Apple Maps
                      </button>
                  </div>
                </div>
              </Portal>
            )}
          </div>

          <button 
              onClick={handleSave} 
              disabled={selectedItems.length === 0}
              className='bg-white/10 active:scale-[.98] rounded-[26px] w-[100%] h-[62px] px-auto p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] cursor-pointer'
              aria-label="Save Trip"
            >
            <div className='flex w-[100%] bg-[#525252]/90 items-center justify-center gap-2 py-[15.4px] rounded-[23px] font-bold text-[1rem] '>Save</div>
          </button>
        </div>

        {/* --- INTERNAL OVERLAY (Rendered directly in the tree) --- */}
        <InternalAddPlaceOverlay 
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          availableSites={availableSites}
          onAddItem={addItem}
        />

        <InternalDatePickerOverlay
          isOpen={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          selectedDate={scheduledDate ? new Date(scheduledDate) : new Date()}
          onChange={handleDateSelect}
        />
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
      // OPTIMIZATION: layout="position" is expensive. Use "position" only if drag feels necessary, otherwise remove for huge gains. 
      // If drag animations are non-negotiable, keep it, but know it has a cost.
      // OPTIMIZATION: transition prop prevents default heavy spring physics on every minor render.
      layout
      transition={{ duration: 0.2, ease: "easeInOut" }} 
      className="relative my-1 select-none will-change-transform transform-gpu" // Added hardware acceleration hints
    >
      <div className='bg-white/10 active:scale-[.98] rounded-[26px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] transition-colors hover:bg-white/20 transform-gpu'>
        <div className="flex items-center gap-3 bg-black/30 px-3 pr-4 rounded-[23px] z-10 py-[10px]">
          
          <div className="w-10 h-10 flex-shrink-0 rounded-[15px] overflow-hidden bg-[#333]/70 text-white flex items-center justify-center text-xs font-bold font-mono border border-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.3)] relative">
            {item.imageUrl ? (
              <Image 
                src={item.imageUrl} 
                alt={item.name}
                fill
                className='object-cover'
                sizes="32px"
                // OPTIMIZATION: Only eager load first 3, lazy the rest
                loading={index < 4 ? "eager" : "lazy"} 
              />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0 pointer-events-none">
            <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
          </div>
          
          {/* Touch Area Fix for mobile dragging */}
          <div className="flex items-center gap-1 pl-2 border-l border-white/10 touch-none"> 
            
            <div 
              onPointerDown={(e) => {
                  e.stopPropagation(); // Stop parent clicks
                  controls.start(e);
              }}
              className="text-white/40 hover:text-white cursor-grab active:cursor-grabbing p-2 touch-none"
            >
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>

            <button 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { 
                  e.stopPropagation(); 
                  onRemove(item.id); 
              }} 
              className="p-2 -mr-1 text-red-400 cursor-pointer rounded-full active:scale-90 transition-all"
            >
              <TrashIcon size={25} color="#ff303bff" className=''/>
            </button>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}, (prev, next) => {
   // OPTIMIZATION: Custom equality check for React.memo
   // Only re-render if the item ID or index changed. 
   // Prevents re-rendering all rows just because a function prop was recreated.
   return prev.item.id === next.item.id && prev.index === next.index;
});

SortableTripItem.displayName = 'SortableTripItem';