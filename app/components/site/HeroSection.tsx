"use client";
import Image from 'next/image';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { useMediaViewer } from '@/app/hooks/useMediaViewer';
import { SiteContent } from '@/app/types/site';

interface HeroProps {
  content: Pick<SiteContent, 'name' | 'tagline' | 'description' | 'heroMedia'>;
}

export const HeroSection = ({ content }: HeroProps) => {
  const { activeMedia, setActiveMedia } = useMediaViewer('video');
  const { heroMedia } = content;

  return (
    /* --- HERO (matches original exactly) --- */
<div className="relative flex flex-col justify-center items-center w-[100vw] max-w-[2000px] h-[100svh] text-white gap-[20px] overflow-hidden group">
  {activeMedia === 'video' && (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover animate-in fade-in duration-500"
    >
      <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
    </video>
  )}

  {activeMedia === 'image' && (
    <div className="absolute top-0 left-0 w-full h-full animate-in fade-in duration-500">
      <Image src={activeMedia[0]} alt="Hero" fill className="object-cover" priority />
    </div>
  )}

  {activeMedia === '360' && (
    <div className="absolute top-0 left-0 w-full h-full animate-in fade-in duration-500 bg-black cursor-move">
      <ReactPhotoSphereViewer
        src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/Andromeda_20250920_110344_00_008.jpg"
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
        <p className="font-black text-[3rem] max-md:text-[2rem] text-start leading-[1.1] z-10 mb-[6px] text-shadow-sm drop-shadow-sm">
          Soup Bowl
        </p>
        <p className="text-[1rem] max-md:text-[1rem] text-start leading-[1.4] z-10 max-w-[400px] opacity-90">
          Known worldwide for its powerful reef breaks, Soup Bowl is a surfer’s paradise on the rugged east coast.
        </p>
      </div>

      <div className="z-20 flex gap-2">
        {(['video', 'image', '360'] as const).map((media) => (
          <div
            key={media}
            className="bg-white/10 active:scale-[.98] backdrop-blur-[20px] w-fit h-fit rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]"
          >
            <button
              onClick={() => setActiveMedia(media)}
              className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeMedia === media
                  ? 'bg-[#007BFF]/90 text-white'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <span className="text-sm font-bold capitalize">{media === 'image' ? 'Photo' : media}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};