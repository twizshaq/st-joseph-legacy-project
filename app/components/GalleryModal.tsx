"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import vrIcon from "@/public/icons/vr-icon.svg";
import { motion, AnimatePresence } from 'framer-motion';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { ZoomIn, ZoomOut, Maximize, Loader2, Play, Pause, Volume2, VolumeX } from 'lucide-react'; // Added Loader2 icon

export const GalleryModal = ({ items, initialIndex, onClose }: { items: any[], initialIndex: number, onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // --- VIDEO STATE ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true); // Default to true since we use autoPlay
  const [isMuted, setIsMuted] = useState(true);     // Default to true for autoPlay policy

  // --- VIDEO SCRUBBER LOGIC ---
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Sync Video to Progress Bar
  const handleVideoProgress = () => {
    if (videoRef.current && !isScrubbing) {
      const duration = videoRef.current.duration || 1;
      const current = videoRef.current.currentTime;
      setProgress((current / duration) * 100);
    }
  };

  // Sync Progress Bar to Video (Click or Drag)
  const handleScrub = (clientX: number) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const width = rect.width;
      
      // Calculate percentage (clamped 0-100)
      let newPercent = (clickX / width) * 100;
      newPercent = Math.max(0, Math.min(100, newPercent));
      
      setProgress(newPercent);
      
      // Update Video Time
      const duration = videoRef.current.duration || 1;
      videoRef.current.currentTime = (newPercent / 100) * duration;
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      // 1. Update logic: Only update state if video is actually ready
      if (videoRef.current && !isScrubbing) {
        const duration = videoRef.current.duration || 1;
        const current = videoRef.current.currentTime;
        setProgress((current / duration) * 100);
      }

      // 2. Loop logic: Keep the loop alive regardless of video state,
      // as long as the Effect is active (isPlaying is true).
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying && !isScrubbing) {
      loop();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isScrubbing]);

  // Input Handlers
  const handleScrubStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Stop global swipes
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
    // Ensure video is playing if it was supposed to be
    if (isPlaying && videoRef.current) videoRef.current.play(); 
  };

  // Reset video state when slide changes
  useEffect(() => {
    setIsPlaying(true);
    setIsMuted(true); 
  }, [currentIndex]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent modal swipe/click logic
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
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

  const toggleVideoFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if we are already in fullscreen (standard browsers)
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    // 1. Try to fullscreen the CONTAINER (Desktop / Android)
    // This keeps your custom controls visible
    if (videoContainerRef.current && videoContainerRef.current.requestFullscreen) {
      videoContainerRef.current.requestFullscreen();
    } 
    // 2. iOS Fallback (iPhone)
    // Apple forces native player, so custom controls will hide here. This is unavoidable on iOS.
    else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
      (videoRef.current as any).webkitEnterFullscreen();
    }
  };
  
  

  // --- Loading State ---
  const [isContentLoading, setIsContentLoading] = useState(true);

  // --- 360 VIEWER STATE ---
  const viewerRef = useRef<any>(null);
  const handle360Ready = (instance: any) => {
    viewerRef.current = instance;
    setIsContentLoading(false); // Stop loading when 360 is ready
  };

  // --- PREVENT RELOAD ON TAB SWITCH ---
  // This is the ONE CORRECT useEffect for loading. The other one was deleted.
  const lastSrcRef = useRef<string | null>(null);

  useEffect(() => {
    const currentItem = items[currentIndex];

    // If the SRC hasn't changed, do nothing. 
    // This prevents the loader from appearing when you switch tabs or resize.
    if (lastSrcRef.current === currentItem.src) {
      return;
    }

    // It is a new item, update ref and reset state
    lastSrcRef.current = currentItem.src;
    viewerRef.current = null;
    
    // Only show loader for 360 content (Images load so fast we usually don't need it, or NextImage handles it)
    if (currentItem.type === 'photo_360') {
      setIsContentLoading(true);
    } else {
      setIsContentLoading(false);
    }
  }, [currentIndex, items]);

  // --- NAVIGATION & KEYBOARD LOGIC (Same as before) ---
  const handleNext = useCallback(() => { setCurrentIndex((prev) => (prev + 1) % items.length); }, [items.length]);
  const handlePrev = useCallback(() => { setCurrentIndex((prev) => (prev - 1 + items.length) % items.length); }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const activeThumb = thumbnailScrollRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // --- SWIPE LOGIC (Same as before) ---
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 30) handleNext();
    if (distance < -30) handlePrev();
    touchStartX.current = 0; touchEndX.current = 0;
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-[4px] h-[100dvh] w-screen touch-none flex flex-col animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex justify-end items-center p-4 md:p-6 z-50 absolute top-0 w-full pointer-events-none">
        {/* <span className="text-white/90 font-medium text-sm md:text-base ml-2 drop-shadow-md pointer-events-auto font-sans tracking-wide">
          {items[currentIndex].type === `${currentIndex + 1} / ${items.length}`}
        </span> */}
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="pointer-events-auto group rounded-full bg-white/10 hover:bg-white/20 p-2 transition-all backdrop-blur-md cursor-pointer border border-white/5">
          <svg className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 relative flex items-center justify-center w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="hidden md:flex absolute left-6 z-40 w-14 h-14 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90 hover:scale-105 cursor-pointer">
          <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          
          {/* --- CUSTOM LOADER OVERLAY --- */}
          <AnimatePresence>
            {isContentLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center"
              >
                <div className="relative flex items-center justify-center">
                  {/* Glowing Ring */}
                  <div className="absolute w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500/30 border-l-transparent animate-spin"></div>
                  {/* Inner Icon */}
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                     <span className="text-white text-xs font-bold">DEO</span>
                  </div>
                </div>
                {/* <p className="text-white/60 text-xs font-bold mt-4 tracking-widest uppercase animate-pulse">Loading Asset</p> */}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }} 
              transition={{ duration: 0.3, ease: "easeOut" }} // Smooth transition
              className="w-full h-full flex items-center justify-center pt-[50px] p-0 md:p-10"
            >
              {items[currentIndex].type === 'image' && (
                <div className="relative w-[90vw] h-full md:max-h-[85vh]">
                  <Image
                    src={items[currentIndex].src}
                    alt="Gallery Item"
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                    onLoadingComplete={() => setIsContentLoading(false)} // Stop loading
                  />
                </div>
              )}

              {items[currentIndex].type === 'video' && (
                <div ref={videoContainerRef} className="video-fullscreen-wrapper max-sm:w-full relative max-w-[95vw] rounded-4xl max-h-[80vh] aspect-video overflow-hidden bg-black group">
                    <video
                      key={currentIndex}
                      ref={videoRef}
                      src={items[currentIndex].src}
                      autoPlay
                      playsInline
                      loop
                      muted={isMuted}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={togglePlay}
                      onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0; }}
                      onLoadedData={() => setIsContentLoading(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* CUSTOM VIDEO CONTROLS LAYER */}
                    {!isContentLoading && (
                      <div 
                        className="absolute bottom-12 w-full left-1/2 -translate-x-1/2 flex gap-3 z-10 p-2 rounded-full pointer-events-auto transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()} // Stop click bubbling
                      >
                        {/* --- SCRUBBER BAR --- */}
                          <div 
                            className="relative w-full h-[20px] flex items-center cursor-pointer touch-none group/scrubber mt-[-20px]"
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

                        {/* Play/Pause */}
                        <div className='absolute left-1 whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                          <div className='bg-white/10 backdrop-blur-[3px] flex justify-center rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-95'>
                            <button 
                              className="p-2.5 bg-black/40 cursor-pointer text-white rounded-full hover:bg-black/30 transition"
                              onClick={togglePlay}
                            >
                              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                            </button>
                          </div>
                        </div>

                        {/* Mute/Unmute */}
                        <div className='absolute left-15 cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
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
                        <div className='absolute right-1 cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                          <div className='bg-white/10 backdrop-blur-[3px] flex justify-center rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-95'>
                          <button 
                            className="p-2.5 bg-black/40 cursor-pointer text-white rounded-full hover:bg-black/30 transition"
                            onClick={toggleVideoFullscreen}
                          >
                            <Maximize size={20} />
                          </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {items[currentIndex].type === 'photo_360' && (
                 <div className="w-full h-full md:max-h-[80vh] max-sm:w-[90vw] md:w-[90vw] rounded-4xl overflow-hidden relative"        
                      onTouchStart={(e) => e.stopPropagation()}
                      >

                     <ReactPhotoSphereViewer 
                        src={items[currentIndex].src} 
                        height={'100%'} 
                        width={"100%"}
                        container={""} 
                        navbar={false}
                        onReady={handle360Ready} // Stop loading in handler
                        loadingTxt=""      // Hides "Loading..." text
                        loadingImg=""  // Hides the internal spinner image
                      />
                      
                      {/* Only show controls if NOT loading */}
                      {!isContentLoading && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-3 right-3 flex flex-col-reverse gap-2 z-10 pointer-events-auto"
                        >
                          {/* <button className="p-2.5 bg-white/10 text-white rounded-full hover:bg-white/30 transition active:scale-95" onClick={() => viewerRef.current?.zoomIn()}><ZoomIn size={20} /></button>
                          <button className="p-2.5 bg-white/10 text-white rounded-full hover:bg-white/30 transition active:scale-95" onClick={() => viewerRef.current?.zoomOut()}><ZoomOut size={20} /></button> */}

                        <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                          <div className='bg-white/10 backdrop-blur-[3px] flex justify-center rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                            <div className='rounded-full bg-black/40 p-3 flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
                              <button className="text-white" onClick={() => viewerRef.current?.toggleFullscreen()}><Maximize size={20} /></button>
                            </div>
                          </div>
                        </div>


                          <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                            <div className='rounded-full bg-black/40 flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
                              <button onClick={() => viewerRef.current?.zoomIn(20)} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                                <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                                <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                              </button>
                              <button onClick={() => viewerRef.current?.zoomOut(20)} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                                <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                              </button>
                            </div>
                          </div>
                        </div>
                        </motion.div>
                      )}
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="hidden md:flex absolute right-6 z-40 w-14 h-14 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90 hover:scale-105 cursor-pointer">
          <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex-shrink-0 h-auto pb-8 pt-6 w-full z-50 pointer-events-auto flex justify-center" onClick={(e) => e.stopPropagation()}>
        <div 
          ref={thumbnailScrollRef} 
          className="flex gap-4 overflow-x-auto px-6 max-w-full hide-scrollbar snap-x items-center py-[10px]"
        >
          {items.map((item, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentIndex(index)}
              className={`
                group relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[20px] overflow-hidden snap-center cursor-pointer transition-all duration-300 border-[3px]
                ${currentIndex === index ? 'border-blue-500 opacity-100 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}
              `}
            >
              <div className="relative w-full h-full bg-zinc-800">
                <Image src={item.src} alt="thumb" fill className="object-cover" sizes="80px" />
              </div>
              {/* Type Icons */}
              {item.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3.25v13.5l12-6.75L4 3.25z"/></svg></div>}
              {item.type === 'photo_360' && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Image src={vrIcon} alt="360" width={24} height={24} /></div>}
            </button>
          ))}
        </div>
      </div>
      <style jsx global>{`
        /* Hide the default loader container */
        .psv-loader-container { display: none !important; }
        
        /* Ensure the viewer background is transparent while loading */
        .psv-container { background: transparent !important; }
        
        /* Just in case, hide the circular loader canvas */
        .psv-loader { display: none !important; }

        /* --- FULLSCREEN FIXES --- */
  
        /* 1. When the wrapper is fullscreen, force 0 border radius */
        .video-fullscreen-wrapper:fullscreen {
          border-radius: 0px !important;
        }
        
        /* 2. Vendor prefixes for mobile browsers (Android/Chrome/Safari) */
        .video-fullscreen-wrapper:-webkit-full-screen {
          border-radius: 0px !important;
        }
        .video-fullscreen-wrapper:-moz-full-screen {
          border-radius: 0px !important;
        }
        .video-fullscreen-wrapper:-ms-fullscreen {
          border-radius: 0px !important;
        }
      `}</style>
    </div>
  );
};