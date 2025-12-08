// You can place this component in the same file, above your SoupBowl component, or in its own file.
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { experiences } from '@/public/data/experiences';
import { TiStarFullOutline } from "react-icons/ti";
import Link from 'next/link';

interface Experience {
  username: string;
  description: string;
  upload_date: number;
  // Add any other fields your experience object contains
}

export const ReviewCard = ({ experience }: { experience: Experience }) => {
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      setNeedsReadMore(el.scrollHeight > el.clientHeight);
    }
  }, [experience.description]);

  return (
    <div className='cursor-pointer rounded-[43px] p-[2px] h-full bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
      <div className='snap-center shrink-0 relative flex flex-col w-[85vw] md:w-[420px] p-5 bg-black/3 rounded-[40px]'>
        {/* Card Header: User & Media Stack */}
        <div className='flex justify-between items-start'>
          {/* User Profile */}
          <div className='flex items-center gap-3'>
            <Link href="/profile" className='relative group cursor-pointer'>
              <div className='w-[60px] h-[60px] p-[2px] rounded-full'>
                <div className='w-full h-full rounded-full overflow-hidden bg-white border-2 border-white'>
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </Link>
            <div className='flex flex-col'>
              <p className='font-bold text-slate-800 text-[1.1rem] leading-none'>{experience.username}</p>
              <div className='flex items-center gap-1.5 mt-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="flex mr-[-5px] text-amber-400 text-[1.2rem]">
                    <TiStarFullOutline />
                  </span>
                ))}
                <span className='text-xs text-slate-400 font-medium'>
                  • {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(experience.upload_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Body Text */}
        <div className='mt-[10px] mb-[0px] bg-red-500/0'>
          <p
            ref={descriptionRef}
            className={`text-slate-600 font-[500] leading-[1.6] text-[1rem] ${isExpanded ? '' : 'line-clamp-4'}`}
          >
            {experience.description}
          </p>
          {needsReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-blue-600 font-bold text-sm hover:underline decoration-2 underline-offset-4 mt-2'
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};