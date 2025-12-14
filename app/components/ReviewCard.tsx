import React, { useState, useEffect, useRef } from 'react';
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import Link from 'next/link';
import Image from 'next/image';

interface Experience {
  username: string;
  description: string;
  upload_date: number;
  user_avatar?: string | null;
  rating: number;
}

export const ReviewCard = ({ experience }: { experience: Experience }) => {
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback: If no specific avatar is in the DB, generate a unique one based on the name
  const avatarUrl = experience.user_avatar 
    ? experience.user_avatar 
    : `https://api.dicebear.com/9.x/initials/svg?seed=${experience.username}`;

  useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      setNeedsReadMore(el.scrollHeight > el.clientHeight);
    }
  }, [experience.description]);

  return (
    <div className='rounded-[43px] p-[2px] h-full bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
      <div className='snap-center shrink-0 relative flex flex-col w-[85vw] md:w-[420px] min-h-[180px] p-5 bg-black/3 rounded-[40px]'>
        
        {/* Card Header: User & Media Stack */}
        <div className='flex justify-between items-start'>
          
          {/* User Profile */}
          <div className='flex items-center gap-3'>
            <Link href={`/profile/${experience.username}`} className='relative group cursor-pointer'>
              
              {/* --- NAVBAR STYLE RING APPLIED HERE --- */}
              <div className='w-[50px] h-[50px] rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <div className='relative w-full h-full rounded-full overflow-hidden bg-white'>
                  <Image 
                    src={avatarUrl} 
                    alt={experience.username}
                    fill
                    className="object-cover"
                    unoptimized // Helps if there are domain config issues, but try to fix next.config.js first
                  />
                </div>
              </div>

            </Link>
            <div className='flex flex-col'>
              <p className='font-bold text-slate-800 text-[1.1rem] leading-none capitalize'>{experience.username}</p>
              {/* 3. DYNAMIC STAR LOGIC */}
              <div className='flex items-center gap-0.5 mt-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="flex text-[1.2rem]">
                    {/* If index is less than rating, show YELLOW FULL star. Else show GRAY EMPTY star. */}
                    {i < experience.rating ? (
                      <span className="text-amber-400"><TiStarFullOutline /></span>
                    ) : (
                      <span className="text-slate-300"><TiStarOutline /></span>
                    )}
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
        <div className='mt-[10px] mb-[0px]'>
          <p
            ref={descriptionRef}
            className={`text-slate-600 font-[500] leading-[1.6] text-[1rem] ${isExpanded ? '' : 'line-clamp-2'}`}
          >
            {experience.description}
          </p>
          {needsReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-blue-600 cursor-pointer font-bold text-sm hover:underline decoration-2 underline-offset-4 mt-2'
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};