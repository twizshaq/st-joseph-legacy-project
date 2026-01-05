"use client";
import React, { useState, useEffect, useRef } from 'react';

// Data Definition
const journeyPhases = [
  {
    phase: "Phase 1: The Spark",
    year: "2024",
    content: [
      { title: "The Vision", text: "Project Lead Anjelica Catling crafted the initial proposal for the St. Joseph DEO, identifying a vital need to merge cultural pride with disaster preparedness." },
      { title: "Securing Support", text: "A strategic partnership was formed with the UWI DRRC and the Department of Emergency Management (DEM), securing the grant and resources necessary to begin the journey." }
    ]
  },
  {
    phase: "Phase 2: Community Engagement",
    year: "Nov 2024 to Ongoing",
    content: [
      { title: "Unearthing the Stories", text: "Community Roadshow in November 2025 was the initial catalyst followed by extensive research was conducted to document the \"untapped\" history of our parish." },
      { title: "Data Mapping", text: "Simultaneously, hazard and resilience data were mapped, ensuring every tour stop offers life-saving information alongside its historical narrative." }
    ]
  },
  {
    phase: "Phase 3: Digital Architecture",
    year: "July to Dec 2025",
    content: [
      { title: "Building the Platform", text: "A talented team of University of the West Indies (UWI) students joins the mission. They begin designing the website to bring the project alive." }
    ]
  },
  {
    phase: "Phase 4: The Launch",
    year: "February 2026",
    content: [
      { title: "Going Live", text: "The physical QR codes are installed, the Virtual Map is activated, and the \"Unveiling Our Legacy\" tour officially opens to the public—fostering a more informed, engaged, and resilient St. Joseph." }
    ]
  }
];

const OurJourney = () => {
  const [lineHeight, setLineHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the position of each phase row so we can change styles as the line passes
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // We start filling the line when the container reaches the middle of the screen
      const offset = windowHeight / 2;
      
      // Calculate distance: How far the top of the container is from the trigger point
      const distFromTop = offset - rect.top;
      
      // Calculate max height (don't scroll past the bottom of the container)
      const maxFill = rect.height;

      let newHeight = 0;
      
      if (distFromTop > 0) {
        newHeight = Math.min(distFromTop, maxFill);
      }

      setLineHeight(newHeight);
    };

    // Attach listener
    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full">
      <div className="mt-32 max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-lg text-slate-500 uppercase tracking-widest font-semibold">From Vision to Launch</p>
        </div>

        {/* Timeline Container - Ref attached here to measure height */}
        <div className="relative" ref={containerRef}>
          
          {/* --- STATIC BACKGROUND LINES (Gray) --- */}
          {/* Center Line (Hidden on mobile, visible on md+) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200" />
          {/* Mobile Line */}
          <div className="md:hidden absolute -left-0 top-0 bottom-0 w-px bg-slate-200 rounded-full" />

          {/* --- DYNAMIC FILL LINES (Blue) --- */}
          {/* Center Line Fill (Desktop) */}
          <div 
            className="hidden md:block absolute shadow-[0px_0px_2px_rgba(0,123,255,0)] rounded-full left-1/2 transform -translate-x-1/2 top-0 w-[2px] bg-[#007BFF] z-0 ease-linear"
            style={{ height: `${lineHeight}px` }} 
          />
          {/* Mobile Line Fill (Mobile) */}
          <div 
            className="md:hidden absolute  shadow-[0px_0px_1px_rgba(0,65,133,0)] rounded-full left-[-.5px] top-0 w-[2px] bg-[#007BFF] z-0 ease-linear"
            style={{ height: `${lineHeight}px` }} 
          />

          <div className="space-y-12 md:space-y-0">
            {journeyPhases.map((phase, idx) => {
              const isPastLine = rowRefs.current[idx]
                ? lineHeight > ((rowRefs.current[idx]?.offsetTop ?? 0) + 20)
                : false;

              return (
                <div
                  key={idx}
                  ref={(el) => {rowRefs.current[idx] = el}}
                  className={`relative flex flex-col md:flex-row items-center justify-between md:gap-8 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                
                {/* Timeline Dot */}
                {/* Added 'transition-colors' so it can interact nicely if needed, z-10 ensures it stays on top of the blue line */}
                <div className="absolute -left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#007DFF] rounded-full border-4 border-white shadow-md z-10 mt-6 md:mt-0" />

                {/* Date Side (Desktop Only) */}
                <div className={`hidden md:block w-1/2 text-center ${idx % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                  <span
                    className={`text-4xl font-black tracking-tight transition-colors duration-300 ${isPastLine ? 'text-[#007DFF]/90' : 'text-slate-200'}`}
                  >
                    {phase.year}
                  </span>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 pl-6 md:pl-0 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className={`space-y-4 ${idx % 2 !== 0 ? 'md:text-right' : ''}`}>
                     
                     {/* Mobile Date */}
                     <span className="md:hidden inline-block px-3 py-1 bg-blue-100 text-[#007DFF] text-xs font-bold rounded-full mb-2">{phase.year}</span>
                     
                     <h3 className="text-2xl font-bold text-slate-900">{phase.phase}</h3>
                     
                     {phase.content.map((item, i) => (
                       <div key={i} className={` ${idx % 2 !== 0 ? 'md:ml-auto' : ''} max-w-md`}>
                          <h4 className="font-bold text-blue-600 mb-2">{item.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurJourney;