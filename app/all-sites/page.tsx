import React from 'react';
import Image from 'next/image';
import searchIcon from '@/public/icons/search-icon.svg'
import sortIcon from '@/public/icons/sort-icon.svg'


const AllSites = () => {
  return (
    <div className='flex flex-col justify-center items-center text-black'>
      <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
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
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
          <div className='bg-[#fff] rounded-full h-[7px] w-[15px]'></div>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
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