// src/hooks/useHeaderVideo.ts
import { useState, useRef, useEffect } from 'react';

const VIDEO_SOURCES = [
  'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
  'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4',
];

export const useHeaderVideo = () => {
  const [activeDot, setActiveDot] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoEnded = () => setActiveDot((prev) => (prev + 1) % VIDEO_SOURCES.length);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause(); 
      v.currentTime = 0; 
      v.load();
      const p = v.play();
      if (p && typeof (p as Promise<void>).then === 'function') {
        (p as Promise<void>).catch(() => {});
      }
    } catch {}
  }, [activeDot]);

  return {
    activeDot,
    videoRef,
    currentSource: VIDEO_SOURCES[activeDot],
    handleVideoEnded,
    totalDots: VIDEO_SOURCES.length
  };
};