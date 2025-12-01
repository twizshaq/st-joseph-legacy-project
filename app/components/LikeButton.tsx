"use client";

import React, { useState } from 'react';
import { HeartIcon } from '@/public/icons/heart-icon'; 

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setLiked((prev) => !prev);
  };

  return (
    <div className='bg-white/10 rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
      <style jsx>{`
        /* 1. HEART BOUNCE */
        @keyframes bouncy {
            0%   { transform: scale(1); }
            40%  { transform: scale(1.2); } /* Shoot up immediately */
            80%  { transform: scale(0.9); } /* Quick snap back */
            100% { transform: scale(1); }
        }

        /* 2. CONFETTI BLAST */
        @keyframes blast-out {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            /* Moves the dot OUTWARD along its Y axis (which is rotated by the parent) */
            transform: translateY(-40px) scale(1); 
          }
        }

        .pop-animation {
          transform-origin: center center;
          animation: bouncy 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          will-change: transform;
        }

        .particle-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0px;
          height: 0px;
          pointer-events: none;
        }

        .particle-dot {
          position: absolute;
          width: 5px; /* Bigger dots */
          height: 5px; 
          border-radius: 50%;
          background-color: #FF0051;
          box-shadow: 0 0 4px rgba(255, 0, 81, 0.6); /* Glow for visibility */
          left: -2.5px; /* Center horizontally relative to line */
          top: -2.5px;  /* Center vertically relative to line */
          animation: blast-out 0.6s ease-out forwards;
        }
      `}</style>

      <button
        onClick={handleLike}
        onAnimationEnd={() => setIsAnimating(false)}
        // Added 'relative' and Removed 'overflow-hidden' so confetti can fly out!
        className='relative grid place-items-center bg-black/30 w-[100%] h-[100%] rounded-[23px] cursor-pointer group hover:bg-black/40 transition-colors duration-200'
      >
        
        {/* CONFETTI LAYER: Only renders if we are Liked AND Animating */}
        {liked && isAnimating && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none z-0">
            {/* Create 12 Particles in a circle (360 / 12 = 30 degrees each) */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="particle-wrapper" 
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                {/* The dot moves 'Up' (TranslateY -40px) relative to the rotation */}
                <div className="particle-dot" />
              </div>
            ))}
          </div>
        )}

        {/* ICON LAYER: z-10 ensures it sits on top of the particles */}
        <div className={`relative z-10 flex items-center justify-center ${isAnimating ? 'pop-animation' : ''}`}>
          <HeartIcon 
            size={35} 
            color={liked ? "#FF2655" : "#fff"} 
            fill={liked ? "#FF2655" : "none"} 
            className="transition-colors duration-300 drop-shadow-[0_0px_4px_rgba(0,0,0,0.1)]"
          />
        </div>

      </button>
    </div>
  );
}