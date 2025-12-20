"use client";

import { Play, Pause } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

export const WaveformAudioPlayer = ({ title, src }: { title: string; src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // --- 1. SEEDED WAVEFORM GENERATION ---
  // We use the 'src' (audio url) to seed the random generator.
  // This guarantees that identical audio files produce identical waveforms.
  const barHeights = React.useMemo(() => {
    const totalBars = 70;
    
    // 1. Create a hash from the audio source string
    let seed = 0;
    const seedString = src || "default"; // Fallback if src is empty
    for (let i = 0; i < seedString.length; i++) {
      seed = ((seed << 5) - seed) + seedString.charCodeAt(i);
      seed |= 0; // Convert to 32bit integer
    }

    // 2. A predictable random number generator using the seed
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: totalBars }, (_, i) => {
      // 3. Use seededRandom() instead of Math.random()
      // We keep the sine wave structure for the "musical" look
      const structure = Math.sin(i * 0.1) * 10 + Math.sin(i * 0.5) * 5;
      const noise = seededRandom() * 10;
      return Math.max(4, Math.min(32, 10 + Math.abs(structure) + noise));
    });
  }, [src]); // Only recalculate if the audio source changes

  // --- 2. RESIZE OBSERVER ---
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // --- 3. AUDIO CONTROLS ---
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (!isDragging && audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      // Fallback update for duration if metadata missed it
      if (total && total !== duration && Number.isFinite(total)) {
        setDuration(total);
      }
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  // --- 4. TOUCH / DRAG LOGIC ---
  const getClientX = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return e.touches[0].clientX;
    }
    return (e as MouseEvent).clientX;
  };

  const calculateProgress = useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    return Math.max(0, Math.min(100, (x / width) * 100));
  }, []);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = getClientX(e);
    const newProgress = calculateProgress(clientX);
    setProgress(newProgress);
    
    if (audioRef.current && duration) {
       audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const clientX = getClientX(e);
        const newProgress = calculateProgress(clientX);
        setProgress(newProgress);
        if (audioRef.current && duration) {
           audioRef.current.currentTime = (newProgress / 100) * duration;
        }
      }
    };

    const handleEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      // 'passive: false' is crucial for preventing scroll while scrubbing on touch
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, calculateProgress, duration]);

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    // Outer Container: 90vw on mobile, fixed 400px on desktop (md:)
    <div className='w-[90vw] md:w-[400px] rounded-[33px] p-[2px] h-full bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
      <div className="w-full h-full bg-black/3 rounded-[30px] p-3 transition-all group/player select-none">
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="flex-shrink-0 h-10 w-10 text-blue-600 flex cursor-pointer items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause size={23} fill="currentColor" />
            ) : (
              <Play size={23} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
            <div className="flex justify-between items-baseline px-1">
              <p className="font-bold text-slate-800 text-xs tracking-wide truncate max-w-[160px]">{title}</p>
              <span className="text-[10px] font-bold text-slate-500 font-mono opacity-80">
                {formatTime(audioRef.current?.currentTime || 0)} <span className='opacity-50'>/</span> {formatTime(duration)}
              </span>
            </div>

            <div 
              ref={containerRef}
              onMouseDown={handleInteractionStart}
              onTouchStart={handleInteractionStart}
              className="relative h-[32px] w-full cursor-pointer group/wave overflow-hidden"
              style={{ touchAction: 'none' }} // Prevents page scrolling while dragging on mobile
            >
              {/* LAYER 1: Background Gray Bars */}
              <div className="absolute inset-0 flex items-center gap-[2px] w-full pointer-events-none">
                {barHeights.map((height, index) => (
                  <div
                    key={`bg-${index}`}
                    style={{ height: `${height}px` }}
                    className="w-[2px] bg-gray-500/40 rounded-full flex-shrink-0 transition-colors duration-300 group-hover/wave:bg-gray-500/60"
                  />
                ))}
              </div>

              {/* LAYER 2: Foreground Blue Bars */}
              <div 
                  className="absolute left-0 top-0 h-full overflow-hidden pointer-events-none transition-[width] duration-100 ease-linear will-change-[width]"
                  style={{ width: `${progress}%` }}
              >
                  {/* We force this inner container to be the full width of the parent */}
                  <div 
                      className="flex items-center gap-[2px] h-full"
                      style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
                  >
                      {barHeights.map((height, index) => (
                          <div
                          key={`fg-${index}`}
                          style={{ height: `${height}px` }}
                          className="w-[2px] bg-blue-500/90 rounded-full flex-shrink-0"
                          />
                      ))}
                  </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};