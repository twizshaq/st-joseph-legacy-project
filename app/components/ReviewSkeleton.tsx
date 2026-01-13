import React from 'react';

export const ReviewSkeleton = () => {
  return (
    <div className='rounded-[43px] p-[3px] h-full bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.07)] snap-center shrink-0'>
      <div className='relative flex flex-col w-[85vw] md:w-[420px] p-5 bg-slate-50/50 rounded-[40px] animate-pulse'>
        
        {/* Header: Avatar & Info */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center gap-3 w-full'>
            
            {/* Avatar Circle */}
            <div className='w-[60px] h-[60px] rounded-full bg-slate-200 shrink-0' />
            
            <div className='flex flex-col gap-2 w-full'>
              {/* Name Bar */}
              <div className='h-4 bg-slate-200 rounded-full w-[40%]' />
              
              {/* Stars & Date Bar */}
              <div className='h-3 bg-slate-200 rounded-full w-[60%]' />
            </div>
          </div>
        </div>

        {/* Body Text Bars */}
        <div className='space-y-2 mt-1'>
          <div className='h-3 bg-slate-200 rounded-full w-full' />
          <div className='h-3 bg-slate-200 rounded-full w-[95%]' />
          <div className='h-3 bg-slate-200 rounded-full w-[90%]' />
          <div className='h-3 bg-slate-200 rounded-full w-[60%]' />
        </div>

      </div>
    </div>
  );
};