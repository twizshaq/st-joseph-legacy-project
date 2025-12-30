// components/Compass.tsx
"use client";

import React, { forwardRef } from 'react';

// 1. Define the type for the props this component will receive.
type CompassProps = {
  directionLetter: string;
};

// 2. Apply the types to forwardRef.
//    - The first generic, `HTMLDivElement`, is the type of the element the ref will be attached to.
//    - The second generic, `CompassProps`, is the type of the props.
const Compass = forwardRef<HTMLDivElement, CompassProps>(({ directionLetter }, ref) => {
  return (
    <div className="w-[45px] h-[45px] flex items-center justify-center cursor-pointer">
      {/* 
        The rotating dial. 
        - The `ref` is passed from the parent component (MapFull.tsx)
          and is now correctly typed.
      */}
      <div
        ref={ref}
        className="absolute w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Ticks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="50" y1="8" x2="50" y2={i % 3 === 0 ? "16" : "17"} stroke="#BDC3C7" strokeWidth={i % 3 === 0 ? "3" : "2"} transform={`rotate(${i * 30}, 50, 50)`} />
          ))}
          {/* Pointers */}
          <polygon points="46,16 54,16 50,4" fill="#FF0F53"/>
          <polygon points="46,16 54,16 50,4" fill="#BDC3C7" transform="rotate(90, 50, 50)" />
          <polygon points="46,16 54,16 50,4" fill="#BDC3C7" transform="rotate(180, 50, 50)" />
          <polygon points="46,16 54,16 50,4" fill="#BDC3C7" transform="rotate(270, 50, 50)" />
        </svg>
      </div>

      {/* The non-rotating letter. This prop is now correctly typed. */}
      <div className="relative text-white font-bold text-[1.3rem] z-10">
        {directionLetter}
      </div>
      
    </div>
  );
});

Compass.displayName = 'Compass';
export default Compass;