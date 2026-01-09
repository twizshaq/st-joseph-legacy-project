import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TourImage } from '@/app/types/tours';

export default function TourGallery({ images }: { images: TourImage[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  
  // Reset when images change
  useEffect(() => { setCurrentImageIndex(0); }, [images]);

  // Infinite Loop Logic
  useEffect(() => {
    if (images.length <= 1) return;
    if (currentImageIndex === images.length) {
      setTimeout(() => { setIsTransitionEnabled(false); setCurrentImageIndex(0); }, 500);
    }
    if (!isTransitionEnabled && currentImageIndex === 0) {
      setTimeout(() => setIsTransitionEnabled(true), 50);
    }
    const interval = setInterval(() => setCurrentImageIndex(p => p + 1), 3000);
    return () => clearInterval(interval);
  }, [currentImageIndex, images.length, isTransitionEnabled]);

  const slides = images.length > 1 ? [...images, images[0]] : images;

  return (
    <div className="relative w-full h-[300px] lg:w-[100%]">
      <div className="relative h-full w-full rounded-[35px] overflow-hidden group">
        <div className="flex h-full w-full"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)`, transition: isTransitionEnabled ? 'transform 500ms ease-in-out' : 'none' }}>
          {slides.map((img, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image src={img.url} alt="Tour View" fill className="object-cover" />
            </div>
          ))}
        </div>
        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/0 rounded-full py-[5px] px-[7px] flex gap-[10px] z-10">
          {images.map((_, i) => (
            <div key={i} onClick={() => setCurrentImageIndex(i)}
              className={`h-[8px] w-[8px] rounded-full cursor-pointer shadow-sm transition-colors ${
                (currentImageIndex % images.length) === i ? 'bg-white w-[25px]' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}