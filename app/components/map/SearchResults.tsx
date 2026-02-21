
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Site, TripData } from '@/app/types/map';
import { SortOption } from '@/app/types';
import searchIcon from '@/public/icons/search-icon.svg';
import sortIcon from '@/public/icons/sort-icon.svg';
import arrowIcon from "@/public/icons/arrow-icon.svg";
import LinkIcon from "@/public/icons/link-icon";
import PlayIcon from "@/public/icons/play-icon";
import LikeButton from '@/app/components/map/LikeButton';
import DirectionsPopup from '@/app/components/map/DirectionsPopup';
import InfoPopup from '@/app/components/map/InfoPopup';
import TripPlanner from '@/app/components/map/TripPlanner';
import Portal from '@/app/components/Portal';
import { Eye } from 'lucide-react';

interface SearchResultsProps {
    sites: Site[];
    selectedSite: Site | null;
    setSelectedSite: (s: Site | null) => void;
    mobileSearchInputRef: React.RefObject<HTMLInputElement | null>;
    mobileSearchReady: boolean;
    handleMobileSearchTap: () => void;
    mobileSearchOpen: boolean;
    isLiked: boolean;
    onToggleLike: () => void;
    onSaveTrip: (data: TripData) => void;
    searchQuery?: string;
    onSearchChange?: (val: string) => void;
    sortOption: SortOption;
    setSortOption: (val: SortOption) => void;
}

const MOCK_GALLERY = [
    { type: 'image', src: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg' },
    { type: 'video', src: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg' },
];

export const SearchResults = memo(function SearchResults({
    sites,
    selectedSite,
    setSelectedSite,
    mobileSearchInputRef,
    mobileSearchReady,
    handleMobileSearchTap,
    mobileSearchOpen,
    isLiked,
    onToggleLike,
    onSaveTrip,
    searchQuery,
    onSearchChange,
    sortOption,
    setSortOption
}: SearchResultsProps) {

    const [isPlanningTrip, setIsPlanningTrip] = useState(false);
    const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    const handleHeaderClick = () => {
        if (!mobileSearchOpen) handleMobileSearchTap();
    };

    const toggleSort = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Helper function to calculate position and open
        const calculateAndOpenSort = () => {
            if (sortBtnRef.current) {
                const rect = sortBtnRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const popupWidth = 190;
                const margin = 10;

                let leftPos = rect.right + window.scrollX - popupWidth;

                if (leftPos + popupWidth > viewportWidth - margin) {
                    leftPos = viewportWidth - popupWidth - margin;
                }
                if (leftPos < margin) leftPos = margin;

                setPopupPos({
                    top: rect.bottom + window.scrollY + 10,
                    left: leftPos
                });
            }
            setIsSortOpen(true);
        };

        // If search is closed: open search, wait for animation to finish, then open sort
        if (!mobileSearchOpen) {
            handleMobileSearchTap(); // Expands the search bar

            // Wait 310ms for the duration-300 CSS transition to finish
            // so the button is in its final position before we calculate the popup location
            setTimeout(() => {
                calculateAndOpenSort();
            }, 310);
            return;
        }

        // If search is already open, just toggle normally
        if (isSortOpen) {
            setIsSortOpen(false);
        } else {
            calculateAndOpenSort();
        }
    };

    // FIXED: Memoize the scroll handler to prevent stale closures and ensure correct state updates
    const handleGalleryScroll = useCallback(() => {
        if (galleryRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
            // Use a small tolerance (2px) for calculation precision
            setCanScrollLeft(scrollLeft > 2);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
        }
    }, []);

    const scrollGallery = (direction: 'left' | 'right') => {
        if (galleryRef.current) {
            const scrollAmount = 300;
            const newScrollPos = direction === 'left'
                ? galleryRef.current.scrollLeft - scrollAmount
                : galleryRef.current.scrollLeft + scrollAmount;

            galleryRef.current.scrollTo({
                left: newScrollPos,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        if (isSortOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSortOpen]);

    // FIXED: Effect now correctly depends on the stable handleGalleryScroll
    useEffect(() => {
        const gallery = galleryRef.current;
        if (gallery) {
            gallery.addEventListener('scroll', handleGalleryScroll);
            // Initial check to set button state immediately
            handleGalleryScroll();
            // Also check on window resize in case the view changes
            window.addEventListener('resize', handleGalleryScroll);

            return () => {
                gallery.removeEventListener('scroll', handleGalleryScroll);
                window.removeEventListener('resize', handleGalleryScroll);
            };
        }
    }, [handleGalleryScroll, selectedSite]); // Added selectedSite to re-check when site opens

    useEffect(() => {
        if (!selectedSite || !mobileSearchOpen) return;
        const timer = setTimeout(() => {
            if (titleRef.current && containerRef.current) {
                setIsTitleOverflowing(titleRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [selectedSite, mobileSearchOpen]);

    const showView2 = !!selectedSite;

    return (
        <div className='relative w-full h-full'>

            {/* --- VIEW 1: SEARCH & LIST --- */}
            <div
                className={`absolute inset-0 flex flex-col h-full transition-opacity duration-300 ease-out
         ${showView2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <div className={`relative transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform-gpu ${mobileSearchOpen ? 'mt-[13px] w-[93%] mx-auto' : 'w-full self-center'}`}>
                    <span className='absolute z-10 mt-[11.5px] ml-[15px] pointer-events-none'>
                        <Image src={searchIcon} alt='Search Icon' height={25} priority />
                    </span>
                    <input
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        ref={mobileSearchInputRef}
                        type='text'
                        placeholder='Search St Joseph'
                        readOnly={!mobileSearchReady}
                        onPointerDown={handleMobileSearchTap}
                        inputMode='search'
                        className="bg-black/40 rounded-full h-[50px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] pr-[95px] outline-none border-none focus:ring-0"
                    />

                    <button
                        ref={sortBtnRef}
                        type="button"
                        onClick={toggleSort}
                        className={`flex gap-[8px] py-[10px] items-center justify-center absolute font-bold right-[14px] top-[3px] text-[#E0E0E0] rounded-full transition-all cursor-pointer active:scale-[.95]
                            }`}
                    >
                        Sort <Image src={sortIcon} alt="" height={22} />
                    </button>
                </div>

                {mobileSearchOpen && !showView2 && (
                    <div className='mt-2 overflow-y-auto overflow-x-hidden flex-1 pb-[10px] hide-scrollbar'>
                        <ul className='px-3 pb-[5px] gap-[10px] mt-[10px] flex flex-col'>
                            {sites.map((site) => (
                                <SiteListItem key={site.id} site={site} onClick={() => setSelectedSite(site)} />
                            ))}
                            {sites.length === 0 && <li className="text-white text-center py-4 opacity-50">No results found</li>}
                        </ul>
                    </div>
                )}
            </div>

            {/* --- VIEW 2: DETAILS --- */}
            <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-300 ease-in
        ${showView2 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}>

                {selectedSite && (
                    isPlanningTrip ? (
                        <TripPlanner
                            sites={sites}
                            onBack={() => setIsPlanningTrip(false)}
                            onClose={() => { setIsPlanningTrip(false); setSelectedSite(null); }}
                            mobileSearchOpen={mobileSearchOpen}
                            onHeaderClick={handleHeaderClick}
                            onSaveTrip={onSaveTrip}
                        />
                    ) : (
                        <>
                            {/* THE GRADIENT SHADE: This makes the header readable when scrolling */}
                            {mobileSearchOpen && (
                                <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#686868] via-[#686868]/80 to-transparent z-20 pointer-events-none rounded-t-[40px]" />
                            )}

                            <div onClick={handleHeaderClick} className={`absolute z-30 flex items-center px-[10px] justify-between transition-all duration-400 rounded-full ${mobileSearchOpen ? 'pt-[7.5px] mt-[6px] pb-[0px] w-[100%] px-[15px]' : 'mt-[-12px] py-[7.5px] w-[100%]'}`}>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedSite(null); }} className={`inline-flex pr-[10px] active:scale-[.95] shrink-0 cursor-pointer items-center gap-2 text-white/90 hover:text-white active:opacity-80 ${mobileSearchOpen ? 'mt-[-6px]' : 'mt-[5px]'}`}>

                                    <span className='rotate-[-90deg]'><Image src={arrowIcon} alt='Back' height={35} /></span>
                                </button>

                                <div ref={containerRef} className='flex flex-col text-right pr-2 pt-1 flex-1 min-w-0 overflow-hidden relative'>
                                    <style jsx>{`
                    .scrolling-text {
                      display: inline-block; white-space: nowrap; padding-right: 20px;
                      animation: marquee-loop 12s linear infinite;
                    }
                    @keyframes marquee-loop {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-100%); }
                    }
                  `}</style>
                                    <div className="w-full overflow-hidden block">
                                        <h2 ref={titleRef} className={`font-bold text-white text-[1.2rem] text-shadow-md transition-all duration-300 ${isTitleOverflowing ? 'scrolling-text' : 'truncate'}`}>
                                            {selectedSite.name}
                                        </h2>
                                    </div>
                                    <p className='text-[#E0E0E0] text-sm text-shadow-md truncate font-medium'>{selectedSite.category}</p>
                                </div>
                            </div>

                            {/* SCROLLABLE CONTENT */}
                            <div className={`overflow-y-auto flex-1 p-0 transition-opacity duration-300 custom-scrollbar ${mobileSearchOpen ? 'opacity-100' : 'opacity-0'}`}>
                                <style jsx>{`
                                    .custom-scrollbar::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-track {
                                        background: transparent;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb {
                                        background: rgba(255, 255, 255, 0.3);
                                        border-radius: 4px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                        background: rgba(255, 255, 255, 0.5);
                                    }
                                `}</style>

                                {/*
                   Padding Top pushes content down so it starts visible BELOW the header,
                   but scrolls UP BEHIND the header (and the gradient shade).
                */}
                                <div className='flex flex-col pb-8 pt-[90px]'>

                                    {/* Description */}
                                    <div className='flex flex-col gap-2 text-sm text-[#E0E0E0] px-4 mb-6 relative z-10'>
                                        <p className='font-bold text-[1.1rem] text-white'>Description</p>
                                        <p className='text-white/90 font-medium leading-relaxed'>{selectedSite.description}</p>
                                    </div>

                                    {/* ACTIONS BAR (Restored Original Share Button) */}
                                    <div className='px-4 mb-6 relative z-10'>
                                        <div className='flex items-center gap-[6px]'>
                                            <DirectionsPopup name={selectedSite.name} lat={selectedSite.coordinates[1]} lng={selectedSite.coordinates[0]} />

                                            <div className='active:scale-[.98] transition-transform'>
                                                <LikeButton isLiked={isLiked} onClick={onToggleLike} />
                                            </div>

                                            {/* RESTORED: Original Large Share Button Style */}
                                            <Link href={`/${selectedSite.slug}`} passHref>
                                                <div className='bg-white/10 active:scale-[.98] rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
                                                    <div className="bg-black/30 w-full h-full rounded-[23px] flex items-center justify-center hover:bg-black/40 transition-colors duration-200">
                                                        <LinkIcon size={40} color="#fff" className='p-[5px]' />
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className='bg-white/10 h-[2px] w-[65%] self-center mb-[17px]' />

                                    <div className='px-4 flex items-center gap-3 pb-[0px] mb-[15px]'>
                                        <div className='w-[90%] flex self-center items-center gap-[10px]'>
                                            <div onClick={() => setIsPlanningTrip(true)} className='self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-[26px] p-[2.7px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] -mr-[2px] w-[100%]'>
                                                <div className='flex flex-col text-center w-[100%] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-[23px] px-[15px] py-[15.4px]'>
                                                    <span className='text-white font-bold'>Create a custom trip</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='shrink-0'><InfoPopup key={selectedSite.id} /></div>
                                    </div>

                                    {/* <div className='bg-white/10 h-[2px] w-[65%] self-center mb-[20px]' />s */}

                                    {/* Media Section */}
                                    <div className='flex flex-col gap-[15px] mb-[20px]'>
                                        <p className='font-bold text-[1.2rem] px-4'>Photo Gallery</p>

                                        <div className='lg:relative lg:px-2 lg:group'>
                                            <div
                                                ref={galleryRef}
                                                // group/list: Handles the logic for dimming sibling images
                                                className='group/list flex flex-row gap-2 text-sm text-[#E0E0E0] w-[100%] px-4 lg:px-0 overflow-x-scroll mt-[0px] hide-scrollbar scroll-smooth'
                                            >

                                                {/* Item 1: Large */}
                                                <div className='group/item cursor-pointer active:scale-[.98] snap-start relative min-h-[250px] min-w-[180px] rounded-[30px] overflow-hidden bg-neutral-800 transition-all duration-300'>
                                                    <Image src={MOCK_GALLERY[0].src} alt="Gallery 1" fill className='object-cover' sizes="(max-width: 768px) 50vw, 200px" />

                                                    {/* EYE OVERLAY */}
                                                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300'>
                                                        <div className='bg-black/50 p-3 rounded-full backdrop-blur-sm'>
                                                            <Eye size={24} className='text-white' />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Item 2: Column */}
                                                <div className='snap-start flex flex-col gap-3 min-w-[120px]'>

                                                    {/* Top Image */}
                                                    <div className='group/item cursor-pointer active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800 transition-all duration-300 '>
                                                        <Image src={MOCK_GALLERY[1].src} alt="Gallery 2" fill className='object-cover' />
                                                        {/* EYE OVERLAY */}
                                                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300'>
                                                            <div className='bg-black/50 p-2 rounded-full backdrop-blur-sm'>
                                                                <Eye size={20} className='text-white' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Image */}
                                                    <div className='group/item cursor-pointer active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800 transition-all duration-300 '>
                                                        <Image src={MOCK_GALLERY[2].src} alt="Gallery 3" fill className='object-cover' />
                                                        {/* EYE OVERLAY */}
                                                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300'>
                                                            <div className='bg-black/50 p-2 rounded-full backdrop-blur-sm'>
                                                                <Eye size={20} className='text-white' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Item 3: Video */}
                                                <div className='group/item cursor-pointer active:scale-[.98] snap-start relative min-h-[250px] min-w-[180px] rounded-[30px] overflow-hidden bg-neutral-800 transition-all duration-300'>
                                                    <Image src={MOCK_GALLERY[3].src} alt="Video" fill className='object-cover opacity-80' />

                                                    {/* Play Icon (Always Visible) */}
                                                    <div className='absolute inset-0 flex'>
                                                        <PlayIcon size={20} color="#fff" className='absolute top-[15px] right-[15px] drop-shadow-[0px_0px_5px_rgba(0,0,0,0.4)]' />
                                                    </div>

                                                    {/* EYE OVERLAY (Centers on Hover) */}
                                                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300'>
                                                        <div className='bg-black/50 p-3 rounded-full backdrop-blur-sm'>
                                                            <Eye size={24} className='text-white' />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Item 4: Column */}
                                                <div className='snap-start flex flex-col gap-3 min-w-[120px]'>

                                                    {/* Top Image */}
                                                    <div className='group/item cursor-pointer active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800 transition-all duration-300 '>
                                                        <Image src={MOCK_GALLERY[4].src} alt="G5" fill className='object-cover' />
                                                        {/* EYE OVERLAY */}
                                                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300'>
                                                            <div className='bg-black/50 p-2 rounded-full backdrop-blur-sm'>
                                                                <Eye size={20} className='text-white' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Image */}
                                                    <div className='group/item cursor-pointer active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800 transition-all duration-300 '>
                                                        <Image src={MOCK_GALLERY[5].src} alt="G6" fill className='object-cover' />
                                                        {/* EYE OVERLAY */}
                                                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300'>
                                                            <div className='bg-black/50 p-2 rounded-full backdrop-blur-sm'>
                                                                <Eye size={20} className='text-white' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* View All Button */}
                                                <button type="button" className='snap-start relative cursor-pointer min-h-[250px] min-w-[120px] rounded-[30px] overflow-hidden active:scale-[.98] group'>
                                                    <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 group-hover:bg-black/50 transition-colors'>
                                                        <span className='text-[0.7rem] uppercase tracking-widest text-white/80 font-bold'>see more</span>
                                                        <span className='text-[0.7rem] uppercase tracking-widest text-white/80 font-bold'>Photos</span>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* --- FIXED BUTTONS --- */}
                                            {/* PREVIOUS BUTTON */}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); scrollGallery('left'); }}
                                                disabled={!canScrollLeft}
                                                className={`hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-[50px] h-[50px] rounded-full border-4 border-white/10 bg-blue-950/30 backdrop-blur-[20px] hover:bg-blue-500 transition-all duration-200 active:scale-[0.95]
                                                    ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
                                                aria-label="Previous gallery"
                                            >
                                                <span className='-rotate-90 flex items-center justify-center'>
                                                    <Image src={arrowIcon} alt='Previous' width={24} height={24} className="w-6 h-6" />
                                                </span>
                                            </button>

                                            {/* NEXT BUTTON */}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); scrollGallery('right'); }}
                                                disabled={!canScrollRight}
                                                className={`hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-[50px] h-[50px] rounded-full border-4 border-white/10 bg-blue-950/30 backdrop-blur-[20px] hover:bg-blue-500 transition-all duration-200 active:scale-[0.95]
                                                    ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
                                                aria-label="Next gallery"
                                            >
                                                <span className='rotate-90 flex items-center justify-center'>
                                                    <Image src={arrowIcon} alt='Next' width={24} height={24} className="w-6 h-6" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>
                    )
                )}
            </div>

            {isSortOpen && (
                <Portal>
                    <div id="sort-popup-portal">
                        <div className="fixed inset-0 " onClick={() => setIsSortOpen(false)} />
                        <div
                            ref={sortMenuRef}
                            className="absolute mt-[0px] z-[60]"
                            style={{ top: popupPos.top, left: popupPos.left }}
                        >
                            <div className='bg-white/10 backdrop-blur-[20px] rounded-[38px] p-[3px] shadow-[0px_0px_15px_rgba(0,0,0,0.4)]'>
                                <div className="relative w-[200px] bg-black/40 rounded-[35px] p-4 overflow-hidden flex flex-col gap-5 text-white">
                                    <div>
                                        <p className="text-sm text-gray-300 font-bold mb-3 uppercase tracking-wider ml-1">Sort By</p>
                                        <div className="flex flex-col gap-2">
                                            {[
                                                { label: 'Default', value: 'default' },
                                                { label: 'Name (A-Z)', value: 'name_asc' },
                                                { label: 'Popularity', value: 'popularity' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setSortOption(opt.value as SortOption);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`text-left cursor-pointer px-4 py-2 rounded-2xl text-sm font-bold transition-all ${sortOption === opt.value
                                                        ? 'bg-white text-black shadow-lg scale-[1.02]'
                                                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
});

// List Item
const SiteListItem = memo(({ site, onClick }: { site: Site, onClick: () => void }) => (
    <li className="list-none">
        <div className='bg-white/10 active:scale-[.97] active:bg-white/10 transition-all rounded-[35px] p-[3px] mb-1 transform-gpu'>
            <button onClick={onClick} className='flex w-full text-left cursor-pointer items-start rounded-[32px] bg-black/35 overflow-hidden p-2 gap-3 hover:bg-black/40 active:bg-black/40 transition-colors'>
                <div className='relative min-w-[70px] h-[70px] rounded-[24px] overflow-hidden bg-white/10'>
                    {site.imageUrl && <Image src={site.imageUrl} alt='' fill className='object-cover' sizes="80px" />}
                </div>
                <div className='flex-1 min-w-0 pr-2 '>
                    <div className='font-[600] text-white text-wrap'>{site.name}</div>
                    <div className='text-sm text-gray-300 opacity-80'>{site.category}</div>
                </div>
            </button>
        </div>
    </li>
));
SiteListItem.displayName = "SiteListItem";
