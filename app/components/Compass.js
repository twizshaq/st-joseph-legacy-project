// components/Compass.js
"use client";

import React, { forwardRef } from 'react';

// Wrap in forwardRef to accept a ref from the parent
const Compass = forwardRef(({ directionLetter }, ref) => {
  return (
    <div className="w-[45px] h-[45px] flex items-center justify-center">

      {/* 
        The rotating dial. 
        - It now gets its ref from the parent.
        - The inline style and transition class are removed.
      */}
      <div
        ref={ref}
        className="absolute w-full h-full"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Ticks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="50" y1="8" x2="50" y2={i % 3 === 0 ? "16" : "17"} stroke="#BDC3C7" strokeWidth={i % 3 === 0 ? "3" : "2"} transform={`rotate(${i * 30}, 50, 50)`} />
          ))}
          {/* Pointers */}
          <polygon points="46,16 54,16 50,4" fill="#EF4444" />
          <polygon points="46,16 54,16 50,4" fill="#BDC3C7" transform="rotate(90, 50, 50)" />
          <polygon points="46,16 54,16 50,4" fill="#BDC3C7" transform="rotate(180, 50, 50)" />
          <polygon points="46,16 54,16 50,4" fill="#BDC3C7" transform="rotate(270, 50, 50)" />
        </svg>
      </div>

      {/* The non-rotating letter (no change) */}
      <div className="relative text-white font-bold text-[1.3rem] z-10">
        {directionLetter}
      </div>

    </div>
  );
});

Compass.displayName = 'Compass'; // for better debugging
export default Compass;