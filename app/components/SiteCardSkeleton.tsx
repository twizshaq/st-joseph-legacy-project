import React from 'react';

export const SiteCardSkeleton = () => {
  return (
    <div className='rounded-[57px] p-[3px] h-full bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.07)] snap-center shrink-0'>
      <div
        className="
          relative bg-black/4 min-h-[300px] max-h-[300px] min-w-[260px] max-w-[260px] 
          rounded-[54px] flex flex-col justify-end p-4 overflow-hidden 
          animate-pulse
        "
      >
        {/* Simulating the Category Pill (Center) */}
        <div className='absolute bottom-[35px] left-0 right-0 mx-auto w-[120px] h-[30px] bg-slate-200 rounded-full z-20' />

        {/* Simulating the Text (Title & Desc) */}
        <div className="w-full flex flex-col items-center gap-3 mb-[40px] z-10">
          {/* Title Line */}
          <div className="h-5 bg-slate-300 rounded-full w-[70%]" />
          {/* Description Lines */}
          <div className="h-3 bg-slate-200 rounded-full w-[90%]" />
          <div className="h-3 bg-slate-200/0 rounded-full w-[50%]" />
        </div>

        {/* Background Overlay Hint */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-transparent" /> */}
      </div>
    </div>
  );
};