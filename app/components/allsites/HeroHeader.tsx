// src/components/allsites/HeroHeader.tsx
import React, { useRef } from 'react';
import { useHeaderVideo } from '@/app/hooks/useHeaderVideo';

export const HeroHeader = () => {
  const { videoRef, activeDot, currentSource, handleVideoEnded, totalDots } = useHeaderVideo();
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={headerRef} className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        onEnded={handleVideoEnded} 
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/home-page-header-vid.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
      <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">
        Explore All Sites
      </p>
      
      {/* <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
        {Array.from({ length: totalDots }).map((_, i) => (
          <div 
            key={i} 
            className={`rounded-full h-[7px] transition-all duration-300 ${i === activeDot ? 'bg-[#fff] w-[15px]' : 'bg-[#fff]/30 w-[7px]'}`} 
          />
        ))}
      </div> */}
    </div>
  );
};