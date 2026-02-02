import React from 'react'
import Image from 'next/image'
import { TourImage } from '@/app/types/tours'

interface TourGalleryProps {
    images: TourImage[]
}

export function TourGallery({ images }: TourGalleryProps) {
    // Guard clause if no images are provided
    if (!images || images.length === 0) {
        return 
        <div className="h-[400px] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">No images available</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[300px] md:h-[400px] w-full">
            {/* Main Large Image (First Image) */}
            <div className="md:col-span-2 h-full relative rounded-[40px] overflow-hidden group">
                <Image
                    src={images[0].url}
                    alt="Main Tour View"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Side Stack (Next 2 Images) */}
            <div className="hidden md:flex flex-col gap-4 h-full">

                {/* Top Right Image */}
                <div className="flex-1 relative rounded-[40px] overflow-hidden group">
                    {images[1] ? (
                        <Image
                            src={images[1].url}
                            alt="Tour Detail View"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Bottom Right Image */}
                <div className="flex-1 relative rounded-[40px] overflow-hidden group">
                    {images[2] ? (
                        <Image
                            src={images[2].url}
                            alt="Tour Detail View"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        // Fallback if 3rd image is missing
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}

                    {/* Optional: "View All" Overlay if there are more than 3 images */}
                    {images.length > 3 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors z-10">
                            <span className="text-white font-bold text-lg">
                                +{images.length - 3} more
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                </div>
            </div>
        </div>
    )
}

export default TourGallery
