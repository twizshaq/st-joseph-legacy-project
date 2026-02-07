/**
 * SearchResults Component
 *
 * This component handles the search interface and results display for the virtual map page.
 * It includes search functionality, sorting options, and detailed site views.
 * Features two main views: search/list view and detailed site view.
 */

import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Portal from "@/app/components/Portal"; // Portal component for rendering dropdown outside DOM hierarchy
import { Site, TripData } from '@/app/types/map'; // Type definitions for site data and trip data
import searchIcon from '@/public/icons/search-icon.svg'; // Search icon for input field
import sortIcon from '@/public/icons/sort-icon.svg'; // Sort icon for sorting button
import arrowIcon from "@/public/icons/arrow-icon.svg"; // Back arrow icon
import ShareIcon from "@/public/icons/share-icon"; // Share icon component
import PlayIcon from "@/public/icons/play-icon"; // Play icon for videos
import LikeButton from '@/app/components/map/LikeButton'; // Like button component
import DirectionsPopup from '@/app/components/map/DirectionsPopup'; // Directions popup component
import InfoPopup from '@/app/components/map/InfoPopup'; // Info popup component
import TripPlanner from '@/app/components/map/TripPlanner'; // Trip planning component

/**
 * Props interface for SearchResults component
 */
interface SearchResultsProps {
    sites: Site[]; // Array of all available sites
    selectedSite: Site | null; // Currently selected site for detailed view
    setSelectedSite: (s: Site | null) => void; // Function to set selected site
    mobileSearchInputRef: React.RefObject<HTMLInputElement | null>; // Ref for search input
    mobileSearchReady: boolean; // Whether search input is ready for interaction
    handleMobileSearchTap: () => void; // Handler for search input tap
    mobileSearchOpen: boolean; // Whether mobile search interface is expanded
    isLiked: boolean; // Whether current selected site is liked
    onToggleLike: () => void; // Handler for like/unlike action
    onSaveTrip: (data: TripData) => void; // Handler for saving trip data
    searchQuery?: string; // Current search query string
    onSearchChange?: (val: string) => void; // Handler for search query changes
}

const MOCK_GALLERY = [
    { type: 'image', src: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg' },
    { type: 'video', src: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg' },
];

/**
 * Main SearchResults component function
 * Handles search, sorting, and display of sites in the virtual map interface
 */
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
    onSearchChange
}: SearchResultsProps) {

    // State for trip planning modal
    const [isPlanningTrip, setIsPlanningTrip] = useState(false);

    // State for title overflow animation
    const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

    // State for sorting options
    const [sortOption, setSortOption] = useState('name-asc');

    // State for sort dropdown visibility
    const [isSortOpen, setIsSortOpen] = useState(false);

    // State for sort menu position
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

    // Refs for DOM elements
    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    /**
     * Handles header click to expand search interface
     */
    const handleHeaderClick = () => {
        if (!mobileSearchOpen) handleMobileSearchTap();
    };

    /**
     * Toggles the sort dropdown menu
     * Calculates position based on sort button location
     */
    const toggleSort = useCallback(() => {
        if (sortBtnRef.current) {
            const rect = sortBtnRef.current.getBoundingClientRect();
            setPopupPos({ top: rect.bottom, left: rect.left });
        }
        setIsSortOpen(!isSortOpen);
    }, [isSortOpen]);

    /**
     * Effect to check if site title overflows and needs scrolling animation
     */
    useEffect(() => {
        if (!selectedSite || !mobileSearchOpen) return;
        const timer = setTimeout(() => {
            if (titleRef.current && containerRef.current) {
                setIsTitleOverflowing(titleRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [selectedSite, mobileSearchOpen]);

    /**
     * Memoized sorted sites array based on current sort option
     * Sorts the sites array without mutating the original
     */
    const sortedSites = useMemo(() => {
        const sorted = [...sites];
        switch (sortOption) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'category-asc':
                return sorted.sort((a, b) => a.category.localeCompare(b.category));
            case 'category-desc':
                return sorted.sort((a, b) => b.category.localeCompare(a.category));
            default:
                return sorted;
        }
    }, [sites, sortOption]);

    // Determine if detailed view should be shown
    const showView2 = !!selectedSite;

    /**
     * Main render function for SearchResults component
     * Renders the search interface with sorting dropdown and site list/details views
     */
    return (
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
