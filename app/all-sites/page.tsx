"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import searchIcon from '@/public/icons/search-icon.svg'
import sortIcon from '@/public/icons/sort-icon.svg'


const AllSites = () => {
  const [activeDot, setActiveDot] = useState(0);

  // Replace the 2nd-4th URLs with your other video files when ready
  const videoSources = [
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
    'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  ];

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoEnded = () => {
    setActiveDot((prev) => (prev + 1) % 4);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
      v.load();
      const p = v.play();
      if (p && typeof (p as Promise<void>).then === 'function') {
        (p as Promise<void>).catch(() => {});
      }
    } catch {}
  }, [activeDot]);


  return (
    <div className='flex flex-col justify-center items-center text-black'>
      <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">

      {/* Video is the timing source. It changes to the next video only when `ended` fires. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoSources[activeDot]} type="video/mp4" />
      </video>

      {/* Dark Overlay (optional for text readability) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

      {/* Foreground Content */}
      <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">
        Explore All Sites
      </p>



        <div className='absolute bottom-[-34px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] w-[450px] max-w-[90vw]'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'>
              <Image src={searchIcon} alt="" height={25} className=''/>
            </span>
            <input type="text" name="" id="" placeholder='Search St Joseph' className='bg-black/50 backdrop-blur-[100px] rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none pr-[95px]'/>
            <button className='bg-red-500/0 flex gap-[10px] items-center justify-center absolute font-bold right-[20px] mt-[-40px] text-[#E0E0E0]'>Sort<Image src={sortIcon} alt="" height={23} className=''/></button>
          </div>
        </div>

        {/* Dots to show how long the image or video will last */}
        <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-full h-[7px] transition-all duration-300 ${i === activeDot ? 'bg-[#fff] w-[15px]' : 'bg-[#fff]/30 w-[7px]'}`}
            />
          ))}
        </div>

      {/* <div className="absolute rounded-full max-md:top-[91%] top-[93.2%] w-[458px] max-w-[90vw] bg-white/10 backdrop-blur-[3px] h-[64.5px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] z-[49]"></div>
        <div className='absolute max-md:top-[92%] top-[94%] w-[450px] max-w-[90vw] bg-red-500/0 max-sm:px-[1vw] z-[50] '>
            <span className='absolute z-10 mt-[15px] ml-[15px] fill-[#E0E0E0]'>
              <Image src={searchIcon} alt="" height={25} className=''/>
            </span>
            <input type="text" name="" id="" placeholder='Search Site' className='bg-black/30 backdrop-blur-[10px] rounded-full h-[57px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none'/>
        </div> */}
      </div>
      <div className='bg-[#eee] h-[2px] w-[450px] max-w-[70vw] mt-[70px] rounded-full'></div>
      {/* <p className='font-bold text-[1.5rem]'>All Sites Page</p> */}
    </div>
  );
};

export default AllSites;