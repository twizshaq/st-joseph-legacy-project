"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { TourImage } from '@/app/types/tours'
import { useTourPage } from "@/app/hooks/useTourPage";
import ArrowIcon from '@/public/icons/arrow-icon';

interface TourGalleryProps {
    images: TourImage[]
}

export function TourGallery({ images }: TourGalleryProps) {
    const { selectedTour } = useTourPage();
    const displayLocalPrice = selectedTour ? selectedTour.local_price : 0;

    const [currentIndex, setCurrentIndex] = useState(1);
    
    // New State for buttons
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    
    // Ref for the scroll container
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Update button visibility logic
    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            // Check if we can scroll left (not at start)
            setCanScrollLeft(scrollLeft > 10); // buffer of 10px
            // Check if we can scroll right (not at end)
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const width = scrollContainerRef.current.offsetWidth;
            
            // Logic for the Counter (1/5)
            const newIndex = Math.round(scrollLeft / width) + 1;
            if (newIndex !== currentIndex && newIndex > 0 && newIndex <= images.length) {
                setCurrentIndex(newIndex);
            }
            
            // Update buttons
            updateScrollButtons();
        }
    };

    // Button Handlers
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ 
                left: -scrollContainerRef.current.offsetWidth, 
                behavior: 'smooth' 
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ 
                left: scrollContainerRef.current.offsetWidth, 
                behavior: 'smooth' 
            });
        }
    };

    // Initial check when images load
    useEffect(() => {
        updateScrollButtons();
    }, [images]);

    // Guard clause if no images
    if (!images || images.length === 0) {
        return (
            <div className="h-[400px] w-full rounded-xl flex items-center justify-center text-gray-400">
                No images available
            </div>
        )
    }

    return (
        <div className="mb-8 h-[400px] md:h-[450px] w-full relative overflow-hidden border-white border-[3px] shadow-[0px_-10px_20px_rgba(0,0,0,0.2)] rounded-[43px]">
            
            {/* --- Counter --- */}
            <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] text-[.9rem] text-white p-[2.5px] rounded-full font-medium pointer-events-none">
                <div className='bg-black/40 px-3 py-1 rounded-full'>
                    {currentIndex} / {images.length}
                </div>
            </div>

            {/* --- Info Overlay --- */}
            <div className='absolute z-[20] bottom-0 rounded-b-[40px] bg-black/40 h-[160px] w-full [mask-image:linear-gradient(to_top,black_40%,transparent)]'/>
            <div className="absolute p-5 z-[20] bottom-0 rounded-b-[40px] w-full">
                <p className="font-bold text-white text-2xl lg:text-3xl drop-shadow-[0px_0px_5px_rgba(0,0,0,0.3)]">
                    {selectedTour?.name}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                    <div className="bg-white/10 backdrop-blur-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] text-[.9rem] text-white p-[2.5px] font-medium rounded-full">
                        <div className='bg-black/40 px-3 py-1 rounded-full'>
                            ${displayLocalPrice} USD
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Previous Button --- */}
            <div className={`hidden md:flex absolute left-[1vw] top-1/2 -translate-y-1/2 z-50 items-center justify-center p-[2.5px] rounded-full bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition-all duration-100 active:scale-[0.93] cursor-pointer ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                    type="button"
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                    className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer hover:bg-black/50 transition-colors flex items-center justify-center'
                >
                    <span className='-rotate-90 flex mr-[2px] items-center scale-[1.1] justify-center text-white'>
                        <ArrowIcon width={30} height={30} />
                    </span>
                </button>
            </div>

            {/* --- Next Button --- */}
            <div className={`hidden md:flex absolute right-[1vw] top-1/2 -translate-y-1/2 z-50 items-center justify-center p-[2.5px] rounded-full bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition-all duration-100 active:scale-[0.93] cursor-pointer ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                    type="button"
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                    className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer hover:bg-black/50 transition-colors flex items-center justify-center'
                >
                    <span className='rotate-90 flex ml-[2px] items-center scale-[1.1] justify-center text-white'>
                        <ArrowIcon width={30} height={30} />
                    </span>
                </button>
            </div>

            {/* --- Scroll Container --- */}
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex h-full w-full overflow-hidden rounded-[40px] overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {images.map((image, index) => (
                    <div 
                        key={index} 
                        className="min-w-full flex-shrink-0 h-full relative snap-center overflow-hidden group"
                    >
                        <Image
                            src={image.url}
                            alt={`Tour View ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500"
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, 80vw"
                        />
                        <div className="absolute inset-0 bg-black/5 transition-colors pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TourGallery