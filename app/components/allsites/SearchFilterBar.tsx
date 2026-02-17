// src/components/allsites/SearchFilterBar.tsx
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Portal from "@/app/components/Portal";
import searchIcon from '@/public/icons/search-icon.svg';
import sortIcon from '@/public/icons/sort-icon.svg';
import { SortOption } from '@/app/types';

interface SearchFilterBarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    resetPage: () => void;
    sortOption: SortOption;
    setSortOption: (val: SortOption) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    categories: string[];
}

export const SearchFilterBar = ({
    searchQuery,
    setSearchQuery,
    resetPage,
    sortOption,
    setSortOption,
    selectedCategory,
    setSelectedCategory,
    categories
}: SearchFilterBarProps) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

    const sortBtnRef = useRef<HTMLButtonElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    // Handle Sort Menu Positioning
    const toggleSort = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSortOpen && sortBtnRef.current) {
            const rect = sortBtnRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const popupWidth = 285;
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
        setIsSortOpen(!isSortOpen);
    };

    // Click Outside Listener
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        if (isSortOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSortOpen]);

    return (
        <>
            <div className='absolute -bottom-[34px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] w-[450px] max-w-[90vw] z-50 left-1/2 -translate-x-1/2'>
                <div className='relative bg-white/10 backdrop-blur-[10px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                    <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'>
                        <Image src={searchIcon} alt="" height={25} />
                    </span>
                    <input
                        type="text"
                        placeholder='Search St Joseph'
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            resetPage();
                        }}
                        className='bg-black/50 rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none pr-[95px]'
                    />
                    <button
                        ref={sortBtnRef}
                        type="button"
                        onClick={toggleSort}
                        className={`flex gap-[8px] py-[10px] items-center justify-center absolute font-bold right-[14px] top-[10px] text-[#E0E0E0] rounded-full transition-all cursor-pointer ${isSortOpen
                                ? 'bg-white/10 px-[10px]'
                                : 'hover:bg-white/10 hover:px-[10px]'
                            }`}
                    >
                        Sort <Image src={sortIcon} alt="" height={22} />
                    </button>
                </div>
            </div>

            {isSortOpen && (
                <Portal>
                    <div className="fixed inset-0" onClick={() => setIsSortOpen(false)} />
                    <div
                        ref={sortMenuRef}
                        className="absolute mt-[20px]"
                        style={{ top: popupPos.top, left: popupPos.left }}
                    >
                        <div className='bg-white/10 backdrop-blur-[20px] rounded-[43px] p-[3px] shadow-[0px_0px_15px_rgba(0,0,0,0.4)]'>
                            <div className="relative w-[300px] bg-black/40 rounded-[40px] p-6 overflow-hidden flex flex-col gap-5 text-white">
                                {/* Sort Options */}
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
                                                onClick={() => setSortOption(opt.value as SortOption)}
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
                                {/* Filter Options */}
                                <div>
                                    <p className="text-sm text-gray-300 font-bold mb-3 uppercase tracking-wider ml-1">Filter By Category</p>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    resetPage();
                                                }}
                                                className={`px-3 py-1.5 cursor-pointer rounded-full text-xs font-bold border transition-all ${selectedCategory === cat
                                                    ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                    : 'bg-transparent border-white/20 text-gray-300 hover:border-white/50'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
};
