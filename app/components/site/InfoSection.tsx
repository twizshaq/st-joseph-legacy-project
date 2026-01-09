import React, { ReactNode } from 'react';

interface InfoSectionProps {
  Roots_and_Routes: ReactNode;
  sixty_Seconds_of_Secrets: ReactNode;
  // history: ReactNode;
  sidebarSlot?: ReactNode; 
}

export const InfoSection = ({ Roots_and_Routes, sidebarSlot, sixty_Seconds_of_Secrets }: InfoSectionProps) => {
  return (
    <div className='flex flex-wrap bg-blue-500/0 gap-12 max-w-[1400px] mx-auto max-sm:w-[90vw] justify-between my-20'>
      <div className='max-w-[800px] flex flex-col gap-8'>
        <section>
          <h2 className='font-bold text-[2rem] mb-4'>Roots & Routes</h2>
          <h3 className='font-bold text-[1.3rem] mb-4'>Explore the history and heritage of the Soup Bowl.</h3>
          <p className='text-[1rem] leading-relaxed text-slate-700 whitespace-pre-line'>{Roots_and_Routes}</p>
        </section>
        <section>
          <h2 className='font-bold text-[1.3rem] mb-4'>60 Seconds of Secrets</h2>
          <p className='text-lg leading-relaxed text-slate-700 whitespace-pre-line'>{sixty_Seconds_of_Secrets}</p>
        </section>
      </div>
      
      {sidebarSlot && (
        <div className='col-span-1 xl:col-span-5 flex flex-col md:flex-row xl:flex-col gap-6 bg-red-500/0'>
          {sidebarSlot}
        </div>
      )}
    </div>
  );
};