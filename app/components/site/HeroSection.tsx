"use client";
import Image from 'next/image';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { useMediaViewer } from '@/app/hooks/useMediaViewer';
import { SiteContent } from '@/app/types/site';

interface HeroProps {
  // We pick the specific parts of the data we need
  content: Pick<SiteContent, 'name' | 'tagline' | 'heroMedia'>;
}

export const HeroSection = ({ content }: HeroProps) => {
  const { activeMedia, setActiveMedia } = useMediaViewer('video');
  
  // Destructure the dynamic data
  const { name, tagline, heroMedia } = content;

  // Helper to determine which buttons to show (only show 360 if url exists)
  const availableMedia = [
    { type: 'video', url: heroMedia.video },
    { type: 'image', url: heroMedia.image },
    { type: '360', url: heroMedia.photo360 }
  ].filter(item => item.url); // Only keep items that have a URL string

  return (
    <div className="relative flex flex-col justify-center items-center w-[100vw] max-w-[2000px] h-[100svh] text-white gap-[20px] overflow-hidden group">
      
      {/* --- DYNAMIC VIDEO --- */}
      {activeMedia === 'video' && heroMedia.video && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover animate-in fade-in duration-500"
        >
          {/* Use the dynamic variable */}
          <source src={heroMedia.video} type="video/mp4" />
        </video>
      )}

      {/* --- DYNAMIC IMAGE --- */}
      {activeMedia === 'image' && heroMedia.image && (
        <div className="absolute top-0 left-0 w-full h-full animate-in fade-in duration-500">
           {/* Fixed: Use heroMedia.image instead of activeMedia[0] */}
          <Image 
            src={heroMedia.image} 
            alt={name} 
            fill 
            className="object-cover" 
            priority 
          />
        </div>
      )}

      {/* --- DYNAMIC 360 VIEWER --- */}
      {activeMedia === '360' && heroMedia.photo360 && (
        <div className="absolute top-0 left-0 w-full h-full animate-in fade-in duration-500 bg-black cursor-move">
          <ReactPhotoSphereViewer
            src={heroMedia.photo360}
            height={'100%'}
            width={'100%'}
            container={''}
            defaultZoomLvl={0}
            navbar={false}
          />
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 pointer-events-none to-black/30" />

      <div className="absolute bottom-0 w-[1400px] max-w-[90vw] h-full pointer-events-none flex flex-col justify-end pb-[45px]">
        <div className="w-full flex flex-col md:flex-row max-sm:mb-[-20px] items-end md:justify-between relative pointer-events-auto">
          
          <div className="z-10 mb-6 md:mb-0 self-start">
            {/* DYNAMIC TITLE */}
            <h1 className="font-black text-[3rem] max-md:text-[2rem] text-start leading-[1.1] z-10 mb-[6px] text-shadow-sm drop-shadow-sm">
              {name}
            </h1>
            
            {/* DYNAMIC TAGLINE / DESCRIPTION */}
            <p className="text-[1rem] max-md:text-[1rem] text-start leading-[1.4] z-10 max-w-[400px] opacity-90">
              {tagline}
            </p>
          </div>

          {/* DYNAMIC BUTTONS */}
          <div className="z-20 flex gap-2">
            {availableMedia.map((media) => (
              <div
                key={media.type}
                className="bg-white/10 active:scale-[.98] backdrop-blur-[20px] w-fit h-fit rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]"
              >
                <button
                  onClick={() => setActiveMedia(media.type as any)}
                  className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-colors ${
                    activeMedia === media.type
                      ? 'bg-[#007BFF]/90 text-white'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  <span className="text-sm font-bold capitalize">
                    {media.type === 'image' ? 'Photo' : media.type}
                  </span>
                </button>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};