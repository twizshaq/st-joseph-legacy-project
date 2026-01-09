"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { WaveformAudioPlayer } from "@/app/components/site/CustomAudioPlayer";
import arrowIcon from "@/public/icons/arrow-icon.svg"; // Ensure you have this or use an SVG
import { Story } from '@/app/types/site';

interface LocalStoriesProps {
  stories: Story[];
}

export const LocalStories = ({ stories }: LocalStoriesProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!stories || stories.length === 0) return null;

  return (
    <div className='max-w-[90vw] w-[450px] relative z-10'>
      {/* Decorative Glow behind the widget */}
      <div className='absolute top-10 right-10 w-32 h-32 bg-fuchsia-400/20 rounded-full blur-3xl -z-10 pointer-events-none'></div>

      <div className='rounded-[35px] active:scale-[.995] border border-fuchsia-500/30 bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-[0_0px_20px_rgb(0,0,0,.1)]'>
        
        {/* --- HEADER --- */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='group w-full flex items-center justify-between gap-3 px-6 py-5 cursor-pointer relative overflow-hidden'
        >
          {/* Subtle Background Pattern in Header */}
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,#d946ef_25%,transparent_25%,transparent_50%,#d946ef_50%,#d946ef_75%,transparent_75%,transparent)] bg-[length:20px_20px] pointer-events-none"></div>
          <div className="absolute left-0 top-0 w-1/3 h-full blur-[20px] bg-gradient-to-r from-fuchsia-50/80 to-transparent pointer-events-none"></div>
          
          <div className='flex items-center gap-4 relative z-10'>
            {/* Icon Circle */}
            <div className='relative flex items-center justify-center w-10 h-10 rounded-full text-fuchsia-600'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-20 animate-pulse group-hover:opacity-40"></span>
            </div>
            {/* Text Labels */}
            <div className="flex flex-col items-start">
              <span className='font-bold text-[1.15rem] text-slate-800 leading-tight'>Local Stories</span>
              <span className='text-[0.8rem] text-slate-400 font-medium'>Listen, Watch, Discover</span>
            </div>
          </div>
          
          {/* Arrow */}
          <span className={`transform transition-transform duration-300 ease-in-out relative z-10 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
             <Image src={arrowIcon} alt='Toggle' height={28} className='opacity-60 invert'/>
          </span>
        </button>

        {/* Separator Line */}
        <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-fuchsia-200 to-transparent transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* --- CONTENT AREA --- */}
        <div className={`${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white relative transition-all duration-500 ease-in-out`}>
          <div className='px-6 pb-6 pt-6 relative z-10 flex flex-col gap-8'>
            {stories.map((story) => (
              <StoryItem key={story.id} story={story} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-Component: Handles formatting different media types inside the widget ---
const StoryItem = ({ story }: { story: Story }) => {
  return (
    <div className="flex flex-col gap-3 group">
      
      {/* Title & Decoration */}
      <div className="flex items-center gap-2">
         <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
         <p className="font-bold text-slate-700 text-sm uppercase tracking-wide">{story.title}</p>
      </div>

      {/* Media Logic */}
      <div className="">
        {story.type === 'audio' && (
          <div className="">
             <WaveformAudioPlayer title={story.title} src={story.src} />
          </div>
        )}

        {story.type === 'video' && (
           <div className="relative aspect-video w-full bg-black">
              <video 
                src={story.src} 
                poster={story.thumbnail} 
                controls 
                className="w-full h-full object-cover"
              />
           </div>
        )}

        {story.type === 'image' && (
          <div className="relative aspect-[4/3] w-full">
            <Image 
              src={story.src} 
              alt={story.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Caption */}
      {story.caption && (
        <p className="text-[0.85rem] text-slate-500 leading-relaxed italic border-l-2 border-fuchsia-200 pl-3">
          {story.caption}
        </p>
      )}
    </div>
  );
};