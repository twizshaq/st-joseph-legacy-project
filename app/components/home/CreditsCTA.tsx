/* eslint-disable */
"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CreditsCTA() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      // Initialize opacity to 0 so it's invisible by default
      el.style.setProperty('--opacity', '0');
    }
  }, []);

  // UNIFIED HANDLER: Handles Mouse, Touch, and Pen automatically
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--opacity', '1'); // Make visible
  };

  const handlePointerLeave = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--opacity', '0'); // Make invisible
  };

  return (
    <div className="w-[90vw] max-w-[1500px] mt-[100px] flex flex-col items-center text-center">
      
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-12px) rotate(var(--tw-rotate)); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-15px) rotate(var(--tw-rotate)); }
        }
        .dot-base {
          background-image: radial-gradient(rgba(102, 178, 255, 0.9) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .dot-dense {
          background-image: radial-gradient(rgba(102, 178, 255, 0.95) 1px, transparent 1px);
          background-size: 14px 14px;
          /* Opacity controlled by JS var */
          opacity: var(--opacity, 0);
          shadow: 0px 0px 5px rgba(0, 128, 255, 1);
          transition: opacity 200ms ease;
          -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,128,255,1) 35%, transparent 70%);
          mask-image: radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,128,255,1) 35%, transparent 70%);
        }
      `}</style>

      {/* Main Container */}
      <div
        ref={containerRef}
        
        // --- POINTER EVENTS (Works for Mouse & Touch) ---
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove} // Shows immediately on tap
        onPointerUp={handlePointerLeave}   // Hides on finger lift
        onPointerLeave={handlePointerLeave} // Hides on mouse exit
        
        // CRITICAL: Prevent mobile scrolling inside this box so dragging works
        // style={{ touchAction: 'none' }}

        className="relative w-[100vw] bg-white border-[0px] border-white/60 shadow-[0px_0px_30px_rgba(0,0,0,0)] overflow-hidden px-6 py-24 md:py-32"
      >
        
        {/* --- Background Texture --- */}
        <div className="absolute inset-0 z-0 dot-wrap pointer-events-none">
          <div className="absolute inset-0 dot-base opacity-[0.28]" />
          <div className="absolute inset-0 dot-dense" />
        </div>
        
        {/* Gradients */}
        {/* <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#66B2FF]/10 to-[#66B2FF]/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#66B2FF]/10 to-[#66B2FF]/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" /> */}

        {/* --- FLOATING GRAPHICS (Visible on Mobile) --- */}

        {/* 1. CODE WIDGET */}
        <div className="absolute bottom-4 right-4 md:bottom-24 md:right-32 transform rotate-[6deg] z-20 w-[140px] md:w-[180px] select-none scale-75 md:scale-100 origin-bottom-right"
             style={{ animation: 'float-medium 6s ease-in-out infinite' }}>
            <div className="bg-[#1e293b] rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden ring-1 ring-black/5">
                <div className="bg-[#0f172a] px-3 py-2 flex items-center gap-2 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="p-4 flex flex-col gap-2 opacity-90">
                    <div className="h-2 w-2/3 bg-blue-400 rounded-full opacity-50" />
                    <div className="h-2 w-3/4 bg-slate-500 rounded-full opacity-30 ml-4" />
                    <div className="h-2 w-1/2 bg-slate-500 rounded-full opacity-30 ml-4" />
                    <div className="h-2 w-3/4 bg-purple-400 rounded-full opacity-50" />
                </div>
            </div>
            <div className="absolute -z-10 inset-0 bg-indigo-500 blur-[50px] opacity-20" />
        </div>

        {/* 2. TEAM BUBBLES */}
        <div className="absolute top-6 left-2 md:top-24 md:left-40 z-20 scale-75 md:scale-100 origin-top-left"
             style={{ animation: 'float-slow 5s ease-in-out infinite 1s' }}>
             
             <div className="flex -space-x-4 items-center">
                 <div className="w-12 h-12 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-indigo-500 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="font-bold text-xs bg-indigo-200/50 w-full h-full flex items-center justify-center">dev</div>
                 </div>
                 <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center text-emerald-600 overflow-hidden z-10 transform hover:-translate-y-2 transition-transform duration-300 delay-75">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-500 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 delay-150">
                     <div className="font-bold text-lg leading-none pt-1">SH</div>
                 </div>
             </div>
             <div className="absolute -right-4 top-0 bg-red-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm rotate-12">
                 Team
             </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-30 flex flex-col items-center gap-7 pointer-events-none">
             {/* Note: pointer-events-none on the wrapper ensures clicks pass through to container, 
                 BUT we need to re-enable it for the button/links */}
            
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold tracking-widest text-blue-600/80 uppercase">Community Powered</span>
              <h2 className="font-bold text-[2.5rem] md:text-[3.5rem] leading-[0.95] text-gray-900 tracking-tight drop-shadow-sm">
                  Behind the Project
              </h2>
            </div>
            
            <p className="max-w-[650px] text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                This project wasn't built by a single person. It is the result of <span className="text-slate-800 font-bold decoration-blue-200 decoration-4 underline-offset-4 underline">collaboration</span> between community members, historians, and the St. Joseph DEO.
            </p>

            {/* Re-enable pointer events for the button */}
            <div className="pointer-events-auto">
              <Link href="/team" className="mt-8 group relative block">
                  <div className='relative cursor-pointer whitespace-nowrap rounded-full shadow-[0px_0px_20px_rgba(0,0,0,0.1)] transition-transform duration-200 transform active:scale-[.98] hover:scale-105 flex items-center'>
                    <button className={`active:scale-97 w-full cursor-pointer group rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]`}>
                      <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white rounded-full px-8 py-3.5 flex items-center gap-3'>
                          <span className='font-bold text-lg'>Meet the Team</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1 duration-300">
                              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>
                    </button>
                  </div>
              </Link>
            </div>
        </div>

      </div>
    </div>
  );
}