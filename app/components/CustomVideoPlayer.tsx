"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
}

export const CustomVideoPlayer = ({ src, poster }: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // --- SCRUBBER LOGIC ---
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleScrub = (clientX: number) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const width = rect.width;
      let newPercent = (clickX / width) * 100;
      newPercent = Math.max(0, Math.min(100, newPercent));
      setProgress(newPercent);
      const duration = videoRef.current.duration || 1;
      videoRef.current.currentTime = (newPercent / 100) * duration;
    }
  };

  const handleScrubStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsScrubbing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    handleScrub(clientX);
  };

  const handleScrubMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isScrubbing) {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      handleScrub(clientX);
    }
  };

  const handleScrubEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsScrubbing(false);
    if (isPlaying && videoRef.current) videoRef.current.play();
  };

  // Sync Progress Loop
  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      if (videoRef.current && !isScrubbing) {
        const duration = videoRef.current.duration || 1;
        const current = videoRef.current.currentTime;
        setProgress((current / duration) * 100);
      }
      if (isPlaying) animationFrameId = requestAnimationFrame(loop);
    };
    if (isPlaying) loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isScrubbing]);

  // Controls
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (videoContainerRef.current?.requestFullscreen) {
      videoContainerRef.current.requestFullscreen();
    } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
      (videoRef.current as any).webkitEnterFullscreen();
    }
  };

  return (
    <div 
      ref={videoContainerRef} 
      className="relative aspect-video w-full bg-black rounded-[25px] overflow-hidden group video-fullscreen-wrapper"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* --- CONTROLS OVERLAY --- */}
      {/* Opacity: Hidden by default, shown on hover OR if paused */}
      <div 
        className={`absolute bottom-4 left-4 right-4 z-10 p-0 rounded-full ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          
          {/* SCRUBBER (Full Width) */}
                          <div 
                            className="relative w-full h-[20px] flex items-center cursor-pointer touch-none group/scrubber mb-[30px]"
                            ref={progressBarRef}
                            onMouseDown={handleScrubStart}
                            onTouchStart={handleScrubStart}
                            onMouseMove={handleScrubMove}
                            onTouchMove={handleScrubMove}
                            onMouseUp={handleScrubEnd}
                            onTouchEnd={handleScrubEnd}
                            onMouseLeave={() => isScrubbing && setIsScrubbing(false)}
                          >
                            {/* 1. Grey Background Track */}
                            <div 
                              className={`absolute w-full bg-white/40 rounded-full transition-[height] duration-200 ease-out 
                              ${isScrubbing ? 'h-[6px]' : 'h-[4px] group-hover/scrubber:h-[6px]'}`}
                            ></div>

                            {/* 2. Gradient Progress Fill */}
                            <div 
                              className={`absolute rounded-full bg-[linear-gradient(to_right,#4AA1FF,#007BFF)] transition-[height] duration-200 ease-out 
                              ${isScrubbing ? 'h-[6px]' : 'h-[4px] group-hover/scrubber:h-[6px]'}`}
                              style={{ 
                                width: `${progress}%`
                                // No transition on width ensures instant 60fps updates
                              }}
                            ></div>

                            {/* 3. Draggable Circle Thumb */}
                            <div 
                              className={`absolute w-[14px] h-[14px] bg-[#007BFF] rounded-full shadow-[0px_0px_13px_rgba(0,0,0,.5)] transition-transform duration-100 ease-out
                              ${isScrubbing ? 'scale-125' : 'scale-100 group-hover/scrubber:scale-125'}`}
                              style={{ 
                                left: `${progress}%`, 
                                transform: `translateX(-50%) ${isScrubbing ? 'scale(1.25)' : ''}`,
                                // No transition on left ensures instant 60fps updates
                              }}
                            ></div>
                          </div>

          {/* BUTTONS ROW */}
          <div className="flex items-center justify-between w-full mb-4">
            
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <div className='absolute left-0 whitespace-nowrap rounded-full p-[3px] -ml-[10px]'>
                <div className='bg-white/10 backdrop-blur-[3px] flex justify-center rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-95'>
                    <button 
                        className="p-2.5 bg-black/40 cursor-pointer text-white rounded-full hover:bg-black/30 transition"
                        onClick={togglePlay}
                        >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                </div>
            </div>

              {/* Mute */}
              <div className='absolute left-12 cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                <div className='bg-white/10 backdrop-blur-[3px] flex justify-center rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-95'>
                    <button 
                        className="p-2.5 bg-black/40 cursor-pointer text-white rounded-full hover:bg-black/30 transition"
                        onClick={toggleMute}
                        >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Fullscreen */}
            <div className='absolute right-[0px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[10px]'>
                <div className='bg-white/10 backdrop-blur-[3px] flex justify-center rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-95'>
                    <button 
                        className="p-2.5 bg-black/40 cursor-pointer text-white rounded-full hover:bg-black/30 transition"
                        onClick={toggleFullscreen}
                        >
                            <Maximize size={20} />
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Fullscreen Fix Styles */}
      <style jsx global>{`
        .video-fullscreen-wrapper:fullscreen { border-radius: 0px !important; }
        .video-fullscreen-wrapper:-webkit-full-screen { border-radius: 0px !important; }
      `}</style>
    </div>
</div>
  );
};