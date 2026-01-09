// hooks/useMediaViewer.ts
import { useState } from 'react';
import { MediaType } from '@/app/types/site';

export const useMediaViewer = (initial: MediaType = 'video') => {
  const [activeMedia, setActiveMedia] = useState<MediaType>(initial);
  return { activeMedia, setActiveMedia };
};