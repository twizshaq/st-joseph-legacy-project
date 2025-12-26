"use client";

import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@/public/icons/heart-icon'; 

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
}

export default function LikeButton({ isLiked, onClick }: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onClick(); // Call the parent function
  };

  return (
    <div className='bg-white/10 rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
      <style jsx>{`
        @keyframes bouncy {
            0%   { transform: scale(1); }
            40%  { transform: scale(1.2); }
            80%  { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        @keyframes blast-out {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1); }
        }
        .pop-animation {
          transform-origin: center center;
          animation: bouncy 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .particle-wrapper {
          position: absolute; top: 50%; left: 50%; width: 0px; height: 0px; pointer-events: none;
        }
        .particle-dot {
          position: absolute; width: 5px; height: 5px; border-radius: 50%;
          background-color: #FF0051; box-shadow: 0 0 4px rgba(255, 0, 81, 0.6);
          left: -2.5px; top: -2.5px; animation: blast-out 0.6s ease-out forwards;
        }
      `}</style>

      <button
        onClick={handleLike}
        onAnimationEnd={() => setIsAnimating(false)}
        className='relative grid place-items-center bg-black/30 w-[100%] h-[100%] rounded-[23px] cursor-pointer group hover:bg-black/40 transition-colors duration-200'
      >
        {isLiked && isAnimating && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none z-0">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="particle-wrapper" style={{ transform: `rotate(${i * 30}deg)` }}>
                <div className="particle-dot" />
              </div>
            ))}
          </div>
        )}
        <div className={`relative z-10 flex items-center justify-center ${isAnimating ? 'pop-animation' : ''}`}>
          <HeartIcon 
            size={35} 
            color={isLiked ? "#FF2655" : "#fff"} 
            fill={isLiked ? "#FF2655" : "none"} 
            className="transition-colors duration-300 drop-shadow-[0_0px_4px_rgba(0,0,0,0.1)]"
          />
        </div>
      </button>
    </div>
  );
}