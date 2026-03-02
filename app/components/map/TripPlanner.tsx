"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
import LocationIcon from "@/public/icons/location-icon"
import ArrowIcon from "@/public/icons/arrow-icon"
import SearchIcon from "@/public/icons/search-icon"
import AiReorderIcon from "@/public/icons/aireorder-icon"



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





// --- INTERNAL COMPONENT: The Overlay ---

interface TripPlannerProps {
    sites: TripSite[];
    onBack: () => void;
    onClose: () => void;
    onSaveTrip?: (data: TripData) => void;
    mobileSearchOpen: boolean;
    onHeaderClick: () => void;
}

const Icons = {
    // Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
};

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
            <div className="absolute inset-0 bg-black/0" onClick={(e) => { e.stopPropagation(); onClose(); }} />
            <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                <DatePicker selectedDate={selectedDate} onChange={onChange} onClose={onClose} />
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function TripPlanner({ sites, onBack, onClose, onSaveTrip, mobileSearchOpen, onHeaderClick }: TripPlannerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [triggerStarSpin, setTriggerStarSpin] = useState(false);
    const prevIsAddingRef = useRef(isAdding);

    useEffect(() => {
    // Detect transition from SEARCH VIEW (true) -> MAIN VIEW (false)
    if (prevIsAddingRef.current === true && isAdding === false) {
        setTriggerStarSpin(true);

        // Reset after animation completes
        setTimeout(() => setTriggerStarSpin(false), 700);
    }

    prevIsAddingRef.current = isAdding;
}, [isAdding]);


    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showOnboardingTooltip, setShowOnboardingTooltip] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [scheduledDate, setScheduledDate] = useState("");
    const [tripName, setTripName] = useState("My Trip to Barbados");
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<TripSite[]>([]);

    const exportButtonRef = useRef<HTMLDivElement>(null);
    const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0, width: 0 });

    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setScheduledDate(now.toISOString().slice(0, 16));
    }, []);

    useEffect(() => {
        if (!mobileSearchOpen) setIsAdding(false);
    }, [mobileSearchOpen]);

    const handleDateSelect = (date: Date) => {
        setScheduledDate(format(date, "yyyy-MM-dd'T'HH:mm"));
        setShowDatePicker(false);
    };

    const toggleExportMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!showExportMenu && exportButtonRef.current) {
            const rect = exportButtonRef.current.getBoundingClientRect();
            setMenuPos({ bottom: window.innerHeight - rect.top + 10, left: rect.left, width: rect.width });
        }
        setShowExportMenu(!showExportMenu);
    };

    const availableSites = sites.filter(s =>
        !selectedItems.some(sel => sel.id === s.id) &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const addItem = (site: TripSite) => setSelectedItems([...selectedItems, site]);
    const removeItem = (id: number) => setSelectedItems(prev => prev.filter(i => i.id !== id));

    // --- HELPER: Haversine Formula for distance ---
    function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; 
    }

    const handleOptimizeRoute = () => {
        // We need at least 3 items to meaningfully reorder (Start + 2 destinations)
        // If less, the order doesn't really matter or is already fixed.
        if (selectedItems.length < 3) return; 

        // 1. Keep the first item (Start Point) fixed
        const startPoint = selectedItems[0];
        
        // 2. Get the rest of the items to be sorted
        const toVisit = [...selectedItems.slice(1)];
        const sortedPath = [startPoint];

        let currentLocation = startPoint;

        // 3. Nearest Neighbor Algorithm
        while (toVisit.length > 0) {
            let nearestIndex = -1;
            let minDistance = Infinity;

            for (let i = 0; i < toVisit.length; i++) {
                // coordinates[1] is Lat, coordinates[0] is Lng
                const dist = getDistance(
                    currentLocation.coordinates[1], 
                    currentLocation.coordinates[0],
                    toVisit[i].coordinates[1], 
                    toVisit[i].coordinates[0]
                );

                if (dist < minDistance) {
                    minDistance = dist;
                    nearestIndex = i;
                }
            }

            // Move the nearest site from 'toVisit' to 'sortedPath'
            if (nearestIndex !== -1) {
                const nextStop = toVisit[nearestIndex];
                sortedPath.push(nextStop);
                currentLocation = nextStop; // Update current location for next iteration
                toVisit.splice(nearestIndex, 1);
            }
        }

        setSelectedItems(sortedPath);
    };

    const handleExport = (platform: 'google' | 'apple') => {
        if (!selectedItems.length) return;
        const latLng = (s: TripSite) => `${s.coordinates[1]},${s.coordinates[0]}`;
        if (platform === 'google') {
            const dest = latLng(selectedItems[selectedItems.length - 1]);
            const wps = selectedItems.length > 1 ? "&waypoints=" + selectedItems.slice(0, -1).map(latLng).join('|') : "";
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}${wps}`, '_blank');
        } else {
            window.open(`http://maps.apple.com/?daddr=${latLng(selectedItems[0])}`, '_blank');
        }
    };

    return (
        <div className="relative h-full w-full flex flex-col overflow-hidden rounded-[40px] animate-in fade-in zoom-in-95 duration-200">
            {/* ---------------------------------------------------- */}
            {/* VIEW 1: THE MAIN PLANNER PAGE                        */}
            {/* ---------------------------------------------------- */}
            <div className={`absolute inset-0 h-full w-full flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isAdding ? '-translate-x-[110%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
                
                {/* Header (View 1) */}
                <div onClick={onHeaderClick} className="outline-none cursor-default">
                    <div className={`absolute z-[60] flex items-start justify-between px-[10px] w-full transition-all duration-400 ${mobileSearchOpen ? 'bg-black/0 pt-[7.5px] mt-[6px] pb-[0px] px-[15px]' : 'bg-black/0 mt-[0px] py-[7.5px]'}`}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onBack(); }}
                            className={`inline-flex pr-[10px] active:scale-[.95] shrink-0 cursor-pointer items-center gap-2 text-white/90 hover:text-white active:opacity-80 active:scale-[.95] ${mobileSearchOpen ? 'mt-[7px]' : 'mt-[-1px]'}`}
                        >
                            <span className='rotate-[-90deg]'><ArrowIcon size={40} color="#fff"/></span>
                        </button>
                        <div className='flex flex-col text-right pr-3 pt-1 flex-1 mt-[-11px] min-w-0 overflow-hidden relative'>
                            <input
                                type="text"
                                value={tripName}
                                onChange={(e) => setTripName(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className={`w-full bg-transparent text-white text-right font-bold text-[1.23rem] outline-none text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] p-0 m-0 border-none focus:ring-0 transition-all duration-400 ${mobileSearchOpen ? 'mt-[10px]' : 'mt-[0px]'} ${!mobileSearchOpen ? 'pointer-events-none' : ''}`}
                                placeholder="Trip Name"
                                tabIndex={!mobileSearchOpen ? -1 : 0}
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowDatePicker(true); }}
                                className={`bg-transparent text-[#E0E0E0] text-sm text-right outline-none w-full font-medium p-0 m-0 opacity-90 cursor-pointer mt-[-2px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] ${!mobileSearchOpen ? 'pointer-events-none' : ''}`}
                            >
                                {scheduledDate ? format(new Date(scheduledDate), "MMM d, yyyy") : "Select Date"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top/Bottom Fade Shadows (View 1) */}
                <div className={`absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#686868] via-[#686868]/80 to-transparent z-20 ${mobileSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
                <div className={`absolute bottom-0 rotate-[180deg] left-0 w-full h-[100px] bg-gradient-to-b from-[#686868] via-[#686868]/80 to-transparent z-20 ${mobileSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

                {/* Scrolling List (View 1) */}
                <div
                    onScroll={() => setIsScrolled(scrollContainerRef.current?.scrollTop! > 0)}
                    ref={scrollContainerRef}
                    className={`flex-1 overflow-y-auto h-[100%] relative custom-scrollbar p-4 space-y-2 transition-all duration-300 ease-in ${mobileSearchOpen ? 'opacity-100 delay-75' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className='flex gap-[10px] w-[100%] mt-18'>
                        <div className='bg-blue-500/40 active:scale-[.98] rounded-[26px] w-[100%] p-[2.7px]'>
                            <div className="flex items-center gap-4 bg-blue-900/60 p-3 rounded-[24px]">
                                <div className="w-8 h-8 rounded-full bg-blue-500/0 text-white flex items-center justify-center shadow-blue-500/20"><LocationIcon size={25} color="#fff" /></div>
                                <div><h4 className="text-blue-100 font-bold text-sm">Current Location</h4><p className="text-blue-300/60 text-[10px] uppercase font-bold tracking-wider">Starting Point</p></div>
                            </div>
                        </div>
                        <button onClick={() => { setIsAdding(true); setShowExportMenu(false); }} className='bg-white/10 active:scale-[.98] rounded-[26px] h-[62px] min-w-[62px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,0)] cursor-pointer' aria-label="Add Stop">
                            <AddIcon size={45} color="#fff" className='bg-black/30 h-[100%] w-[100%] p-3 rounded-[23px]' />
                        </button>
                    </div>

                    <div className='bg-white/10 h-[2px] my-[13px] w-[75%] self-center mx-auto'></div>

                    <div className="relative space-y-2 pb-24 flex flex-col gap-2">
                        {selectedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center mt-[10%] text-white/30 text-center gap-2">
                                <MapIcon size={25} color="#ffffff30" />
                                <p className="text-sm font-medium">No places added Yet</p>
                            </div>
                        ) : (
                            <Reorder.Group axis="y" values={selectedItems} onReorder={setSelectedItems} className="flex flex-col gap-1">
                                {selectedItems.map((item, i) => (<SortableTripItem key={item.id} item={item} index={i} onRemove={removeItem} />))}
                            </Reorder.Group>
                        )}
                    </div>
                </div>

                {/* Footer Buttons (View 1) */}
                <div className={`absolute bottom-0 p-4 pt-2 flex gap-3 z-30 w-full transition-opacity duration-300 ease-in-out ${mobileSearchOpen ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-full pointer-events-none'}`}>
    
                    <div className='relative h-full' ref={exportButtonRef}>
                        <button disabled={selectedItems.length === 0} onClick={toggleExportMenu} className={`self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-[26px] p-[2.7px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] w-[100%]`}>
                            <div className='flex items-center gap-[7px] text-center w-[100%] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-[23px] px-[35px] py-[15.4px]'>
                                <p className='text-white font-bold'>Export to Maps</p>
                            </div>
                        </button>
                        {/* Inline Export Menu - removed Portal completely! */}
                        {showExportMenu && selectedItems.length > 0 && (
                            <div className="absolute bottom-[calc(100%+10px)] left-0 w-[162px] z-[9999]">
                                {/* Local backdrop to catch clicks away */}
                                <div className="fixed inset-0" onClick={(e) => { e.stopPropagation(); setShowExportMenu(false); }} />
                                <div className="bg-white/10 backdrop-blur-[7px] p-[2.7px] bg-[#252525] relative rounded-[30px] shadow-[0px_0px_20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                                    <div className="flex flex-col bg-black/30 text-white font-medium rounded-[27px] p-[5px]">
                                        <button onClick={(e) => { e.stopPropagation(); handleExport('google'); setShowExportMenu(false); }} className="p-3.5 hover:bg-black/40 active:bg-black/40 text-center rounded-[20px] transition-colors cursor-pointer flex items-center justify-center gap-2"><Image src={googlemapsIcon} alt="Google Maps" height={16} width={16} />Google Maps</button>
                                        {/* <button onClick={(e) => { e.stopPropagation(); handleExport('apple'); setShowExportMenu(false); }} className="p-3.5 hover:bg-black/40 active:bg-black/40 text-center rounded-[20px] transition-colors cursor-pointer flex items-center justify-center gap-2"><Image src={applemapsIcon} alt="Apple Maps" height={16} width={16} />Apple Maps</button> */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleOptimizeRoute}
                        disabled={selectedItems.length < 3}
                        className={`
                            relative rounded-[26px] w-full p-[2.7px] transition-all duration-300
                            ${selectedItems.length >= 3 
                                ? 'ai-gradient-border active:scale-[.98] cursor-pointer' 
                                : 'bg-white/30 opacity-50 cursor-not-allowed shadow-none'
                            }
                        `}
                        aria-label="Reorder Trip"
                    >
                        <div className={`
                            flex w-[100%] h-full rounded-[23px] font-bold text-[1rem] items-center justify-center gap-2
                            ${selectedItems.length >= 3 ? 'bg-[#525252]/70' : 'bg-[#252525]'}
                        `}>
                            {/* Animate the Icon: Spin/Pulse when active */}
                            <div className={`transition-all duration-500 ${selectedItems.length >= 3 ? 'text-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'text-neutral-500'}`}>
                                <AiReorderIcon width={28} height={28} />
                            </div>
                            
                            <span className={`transition-colors duration-300 ${selectedItems.length >= 3 ? 'text-white' : 'text-neutral-500'}`}>
                                Reorder
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* VIEW 2: SEARCH AND ADD LOCATIONS SCREEN              */}
            {/* ---------------------------------------------------- */}
            <div className={`absolute inset-0 h-full w-full bg-black/5 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isAdding ? 'translate-x-0 opacity-100' : 'translate-x-[110%] opacity-0 pointer-events-none'}`}>
                
                {/* Header (View 2) */}
                <div className={`z-[60] flex items-center gap-2 w-full transition-all duration-400 px-[10px] ${mobileSearchOpen ? 'bg-black/0 pt-[8px] mt-[6px] pb-[8px] px-[15px]' : 'bg-black/0 py-[8px]'}`}>
                    <button onClick={(e) => { e.stopPropagation(); setIsAdding(false); }} className={`inline-flex active:scale-[.95] pr-[6px] cursor-pointer items-center justify-center rounded-full text-white/90 hover:text-white transition-colors`}>
                        <span className='rotate-[-90deg] flex items-center justify-center'><ArrowIcon size={40} color="#fff"/></span>
                    </button>
                    
                    <div className="flex-1 relative pb-[1px] pt-[2px]">
                        <div className="absolute left-[14px] top-[14.5px] text-[1.2rem] text-white/40"><IoSearch /></div>
                        <input
                            type="text"
                            placeholder="Find places to add..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                            className="w-full bg-[#1F1F1F]/60 shadow-inner text-white rounded-[26px] h-[45px] pl-[40px] pr-4 text-[0.95rem] outline-none font-[600] placeholder-white/40 border border-transparent focus:border-white/10 transition-colors"
                        />
                    </div>
                </div>

                {/* Top fade specifically for the search list */}

                {/* Available List (View 2) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-[12px] px-[16px] space-y-[12px]">
                    {availableSites.map(site => (
                        <div
                            key={site.id}
                            onClick={() => addItem(site)}
                            className="flex items-center justify-between p-[2.7px] rounded-[33px] bg-white/10 hover:bg-white/15 active:scale-[.98] transition-all cursor-pointer group"
                        >
                            <div className='bg-black/30 flex items-center w-full h-full p-3 rounded-[30px] active:bg-black/40'>
                                <div className='flex-1 pr-3 min-w-0 flex items-center gap-3'>
                                    <div className="w-[50px] h-[50px] shrink-0 bg-black/30 rounded-[16px] relative overflow-hidden">
                                        {site.imageUrl && <Image src={site.imageUrl} alt='' fill className="object-cover" sizes="50px" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white text-[1rem] font-bold truncate leading-tight">{site.name}</h4>
                                        <p className="text-[#B0B0B0] text-[0.8rem] truncate font-medium mt-[1px]">{site.category}</p>
                                    </div>
                                </div>
                                <div className="w-[40px] h-[40px] shrink-0 text-white bg-black/40 rounded-[15px] flex items-center justify-center">
                                    <span className='text-[1.1rem]'><FaPlus /></span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {availableSites.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-16 opacity-30 gap-2">
                            <SearchIcon size={20} color="#fff" />
                            <p className="text-center text-[0.9rem] font-medium text-white/50">No locations found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* SHARED GLOBALS */}
            <InternalDatePickerOverlay isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} selectedDate={scheduledDate ? new Date(scheduledDate) : new Date()} onChange={handleDateSelect} />

            {/* Onboarding Tooltip (Hidden if adding location so it doesnt block UI) */}
            {showOnboardingTooltip && mobileSearchOpen && !isAdding && (
                <div className="absolute inset-0 z-40 flex items-start justify-center pointer-events-none pt-[80px]">
                    <div className="pointer-events-auto">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setShowOnboardingTooltip(false)} />
                        <div className="absolute right-[10px] z-50 ">
                            <div className="bg-gradient-to-bl from-[#007BFF] to-[#66B2FF] rounded-[35px] p-3 mt-2 shadow-black/30 border border-blue-400/30 w-[250px]">
                            <div className='mt-[10px]'>
                                <p className="text-white font-semibold text-sm mb-2">👋 Welcome!</p>
                                <p className="text-white/95 text-sm leading-relaxed mb-4 text-wrap">Edit your trip name and date here. Then add places to explore!</p>
                            </div>
                                <button onClick={() => setShowOnboardingTooltip(false)} className="w-full bg-white/20 text-white text-xs font-bold py-4 rounded-full transition-colors active:scale-[.98] active:bg-black/30 hover:bg-black/30">Got it!</button>
                                {/* <div className="absolute -top-2 left-1/2 -translate-x-1/2 w- h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-600/90 rounded-[30px]" /> */}
                                <div className="absolute top-[15px] right-[30px] -translate-x-1/2 w-[20px] h-[20px] bg-[#007BFF] transform rotate-45 -mt-[15.5px] rounded-[5px] z-[-1]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
            <div className='bg-white/10 active:scale-[.98] rounded-[28px] p-[2.7px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] transition-colors hover:bg-white/20 transform-gpu'>
                <div className="flex items-center gap-3 bg-black/40 px-3 pr-4 rounded-[25px] z-10 py-[10px]">

                    <div className="w-11 h-11 flex-shrink-0 rounded-[15px] overflow-hidden bg-[#333]/70 text-white flex items-center justify-center text-xs font-bold font-mono border border-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.3)] relative">
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
                            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                        </div>

                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(item.id);
                            }}
                            className="p-2 -mr-1 text-red-400 cursor-pointer rounded-full active:scale-90 transition-all"
                        >
                            <TrashIcon size={25} color="#ff303bff" className='' />
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
