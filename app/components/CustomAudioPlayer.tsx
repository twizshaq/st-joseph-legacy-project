"use client";

import { Play, Pause } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

export const WaveformAudioPlayer = ({ title, src }: { title: string; src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // REFS
  const progressRef = useRef(0);
  const isSeekingRef = useRef(false); // New: Prevents UI updates while audio is "thinking"
  
  // STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [barHeights, setBarHeights] = useState<number[]>([]);

  // --- 1. THE LOOP ---
  const updateAnimation = useCallback(() => {
    // Only sync UI with Audio if we are NOT dragging AND NOT currently seeking
    if (audioRef.current && !isDragging && !isSeekingRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      
      // FIX FOR DURATION: Continually check if duration has loaded
      if (total && total !== duration && Number.isFinite(total)) {
        setDuration(total);
      }

      if (total && Number.isFinite(total)) {
        const currentProgress = (current / total) * 100;
        setProgress(currentProgress);
        progressRef.current = currentProgress;
      }
    }
    animationRef.current = requestAnimationFrame(updateAnimation);
  }, [isDragging, duration]);

  // --- 2. LIFECYCLE FOR ANIMATION ---
  useEffect(() => {
    // Always run the loop if playing, even if dragging (so we can update duration)
    // But the logic inside updateAnimation handles the visual locking
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, updateAnimation]);

  // --- 3. BAR GENERATION (VISUALS) ---
  useEffect(() => {
    const totalBars = 70;
    let seed = 0;
    const seedString = src || "default"; 
    for (let i = 0; i < seedString.length; i++) {
      seed = ((seed << 5) - seed) + seedString.charCodeAt(i);
      seed |= 0; 
    }
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    const generatedHeights = Array.from({ length: totalBars }, (_, i) => {
      const structure = Math.sin(i * 0.1) * 10 + Math.sin(i * 0.5) * 5;
      const noise = seededRandom() * 10;
      return Math.max(4, Math.min(32, 10 + Math.abs(structure) + noise));
    });
    setBarHeights(generatedHeights);
  }, [src]); 

  // --- 4. RESIZE OBSERVER ---
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) setContainerWidth(entry.contentRect.width);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // --- 5. CONTROLS ---
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // --- 6. INTERACTION LOGIC ---
  const getClientX = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    return 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  };

  const calculateProgress = useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    // Important: Don't stop animation loop, just rely on isDragging guard
    const newProgress = calculateProgress(getClientX(e));
    setProgress(newProgress);
    progressRef.current = newProgress;
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        if (e.cancelable && e.type === 'touchmove') e.preventDefault(); 
        const newProgress = calculateProgress(getClientX(e));
        setProgress(newProgress);
        progressRef.current = newProgress;
      }
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        const newTime = (progressRef.current / 100) * (duration || audioRef.current?.duration || 0);
        
        if (audioRef.current && Number.isFinite(newTime)) {
          // Tell the loop to ignore updates until the audio engine catches up
          isSeekingRef.current = true; 
          audioRef.current.currentTime = newTime;
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, calculateProgress, duration]);

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine what time to show.
  // If dragging OR seeking, show the Target Time (progressRef).
  // Otherwise, show the actual Audio Time.
  const displayTime = (isDragging || isSeekingRef.current) 
    ? (progressRef.current / 100) * duration 
    : (audioRef.current?.currentTime || 0);

  return (
    <div className='w-[90vw] md:w-[400px] rounded-[33px] p-[2px] h-full bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
      <div className="w-full h-full bg-black/5 rounded-[30px] p-3 transition-all group/player select-none">
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          // Multiple handlers to ensure we catch the duration eventually
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onCanPlay={(e) => setDuration(e.currentTarget.duration)}
          // Handlers to manage the "Seeking" state
          onSeeking={() => { isSeekingRef.current = true; }}
          onSeeked={() => { isSeekingRef.current = false; }}
          // Playback state
          onEnded={() => { setIsPlaying(false); setProgress(0); }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="flex-shrink-0 cursor-pointer h-10 w-10 text-blue-600 flex items-center justify-center hover:scale-105 active:scale-[.95] transition-all">
            {isPlaying ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" className="ml-1" />}
          </button>

          <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
            <div className="flex justify-between items-baseline px-1">
              <p className="font-bold text-slate-800 text-xs tracking-wide truncate max-w-[160px]">{title}</p>
              <span className="text-[10px] font-bold text-slate-500 opacity-80">
                {formatTime(displayTime)} <span className='opacity-50'>/</span> {formatTime(duration)}
              </span>
            </div>

            <div 
              ref={containerRef}
              onMouseDown={handleInteractionStart}
              onTouchStart={handleInteractionStart}
              className="relative h-[32px] w-full cursor-pointer group/wave touch-none" // ADDED touch-none CLASS
              style={{ touchAction: 'none' }} 
            >
              {/* LAYER 1: Background Bars */}
              <div className="absolute inset-0 flex items-center gap-[2px] w-full pointer-events-none overflow-hidden">
                {barHeights.map((h, i) => (
                  <div key={`bg-${i}`} style={{ height: `${h.toFixed(2)}px` }} className="w-[2px] bg-gray-500/20 rounded-full flex-shrink-0" />
                ))}
              </div>

              {/* LAYER 2: Foreground Bars */}
              <div 
                  className="absolute left-0 top-0 h-full overflow-hidden pointer-events-none"
                  style={{ width: `${progress}%` }}
              >
                  <div className="flex items-center gap-[2px] h-full" style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}>
                      {barHeights.map((h, i) => (
                          <div key={`fg-${i}`} style={{ height: `${h.toFixed(2)}px` }} className="w-[2px] bg-blue-500 rounded-full flex-shrink-0" />
                      ))}
                  </div>
              </div>

              {/* LAYER 3: Grab Handle */}
              <div 
                className="absolute top-0 bottom-0 w-[3px] bg-blue-600 rounded-full z-10 pointer-events-none shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ 
                    left: `${progress}%`,
                    transform: 'translateX(-50%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};