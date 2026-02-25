"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { TourImage } from '@/app/types/tours'
import { useTourPage } from "@/app/hooks/useTourPage";

interface TourGalleryProps {
    images: TourImage[]
}

export function TourGallery({ images }: TourGalleryProps) {

    const {
            tours, selectedTour, setSelectedTour, userSession, isLoading,
            isSelectorOpen, setIsSelectorOpen, isStopsModalOpen, setIsStopsModalOpen
        } = useTourPage();
    const displayLocalPrice = selectedTour ? selectedTour.local_price : 0;

    const [currentIndex, setCurrentIndex] = useState(1);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.offsetWidth;
        const newIndex = Math.round(scrollLeft / width) + 1;
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    // Guard clause if no images are provided
    if (!images || images.length === 0) {
        return (
            <div className="h-[400px] w-full rounded-xl flex items-center justify-center text-gray-400">
                No images available
            </div>
        )
    }

    return (
        <div className="mb-8 h-[400px] md:h-[450px] w-full relative overflow-hidden border-white border-[3px] shadow-[0px_-10px_20px_rgba(0,0,0,0.2)] rounded-[43px]">
            {/* 
                The Scroll Container:
                - 'flex overflow-x-auto': Enables horizontal scrolling
                - 'snap-x snap-mandatory': Ensures the "swipe" effect (snaps to images)
                - 'scrollbar-hide': Custom utility or the inline [&::-webkit-scrollbar] logic to hide bars
            */}
            <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] text-[.9rem] text-white p-[2.5px] rounded-full font-medium pointer-events-none">
                <div className='bg-black/40 px-3 py-1 rounded-full'>
                    {currentIndex} / {images.length}
                </div>
            </div>

            <div className='absolute z-[20] bottom-0 rounded-b-[40px] bg-black/40 h-[160px] w-full [mask-image:linear-gradient(to_top,black_40%,transparent)]'/>

            <div className="absolute p-5 z-[20] bottom-0 rounded-b-[40px] w-full">
                                        <p className="font-bold text-white text-2xl lg:text-3xl drop-shadow-[0px_0px_5px_rgba(0,0,0,0.3)]">{selectedTour?.name}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {/* <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">{selectedTour.duration} Hours</p> */}

                                            <div className="bg-white/10 backdrop-blur-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] text-[.9rem] text-white p-[2.5px] text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">
                                                <div className='bg-black/40 px-3 py-1 rounded-full'>
                                                    ${displayLocalPrice} USD
                                                </div>
                                            </div>
                                        </div>
                                    </div>

            {/* 2. ATTACH SCROLL HANDLER */}
            <div 
                onScroll={handleScroll}
                className="flex h-full w-full rounded-[40px] overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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