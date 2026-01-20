"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CustomVideoPlayer } from "@/app/components/CustomVideoPlayer";
import { Play } from 'lucide-react';

// --- MOCK DATA ---
const VIDEO_DATA = [
    { 
        id: 1, 
        src: "https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/soup-bowl/test1.mp4", 
        thumb: "https://images.unsplash.com/photo-1502680390469-be75c70282c0?q=80&w=600&auto=format&fit=crop", 
        title: "Surfing The Bowl",
        duration: "0:45"
    },
    { 
        id: 2, 
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 
        thumb: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop", 
        title: "Artistic Process",
        duration: "1:20"
    },
    { 
        id: 3, 
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
        thumb: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop", 
        title: "Community Impact",
        duration: "2:10"
    },
];

// Cleaned up image data for the timeline (removed absolute positioning props)
const SCRAPBOOK_IMAGES = [
    { src: "https://picsum.photos/300/400?random=1",  year: "1998", title: "First Spark" },
    { src: "https://picsum.photos/300/300?random=2",  year: "2001", title: "The Workshop" },
    { src: "https://picsum.photos/250/350?random=3",  year: "2003", title: "Early Drafts" },
    { src: "https://picsum.photos/320/280?random=4",  year: "2005", title: "Gallery Open" },
    { src: "https://picsum.photos/280/380?random=5",  year: "2007", title: "Limestone" },
    { src: "https://picsum.photos/300/300?random=6",  year: "2009", title: "Community" },
    { src: "https://picsum.photos/290/340?random=7",  year: "2011", title: "Expansion" },
    { src: "https://picsum.photos/310/290?random=8",  year: "2014", title: "Teaching" },
    { src: "https://picsum.photos/260/310?random=10", year: "2016", title: "Legacy" },
    { src: "https://picsum.photos/270/270?random=11", year: "2019", title: "Awards" },
    { src: "https://picsum.photos/280/320?random=12", year: "2021", title: "Reflections" },
    { src: "https://picsum.photos/200/200?random=13", year: "2023", title: "New Era" },
    { src: "https://picsum.photos/300/400?random=14", year: "2024", title: "Future" },
];

export const LocalLegend = () => {
    const [activeVideoId, setActiveVideoId] = useState(VIDEO_DATA[0].id);
    const activeVideo = VIDEO_DATA.find(v => v.id === activeVideoId) || VIDEO_DATA[0];

    // --- TIMELINE LOGIC ---
    const [lineWidth, setLineWidth] = useState(0);
    const timelineRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Start filling when the timeline section hits the middle of the viewport
            const triggerPoint = windowHeight * 0.8; 
            const distFromTop = triggerPoint - rect.top;
            
            // Max width is the scrollWidth of the container (full length of the scrolling strip)
            // However, visually we might just want to fill the viewport width or the visible container
            // Let's make the line fill based on vertical scroll, capped at 100% of the visible width
            const maxFill = rect.width; 

            let newWidth = 0;
            if (distFromTop > 0) {
                // Determine speed of fill relative to scroll
                newWidth = Math.min(distFromTop * 2, maxFill);
            }
            
            setLineWidth(newWidth);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Init
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='w-full max-w-[1700px] mx-auto mb-40 px-4'>
            
            {/* 1. Header Text */}
            <div className='max-w-[800px] mb-16 relative z-20 mx-auto text-center mt-12'>
                <p className='font-bold text-slate-800 text-3xl mb-4'>
                    Meet Local Legend - <span className='text-slate-600'>Christopher Chandler</span>
                </p>
                <p className='text-slate-700 text-lg leading-relaxed'>
                    A renowned self-taught Barbadian sculptor and “Recycle Artist” known for transforming discarded materials and limestone into vibrant art.
                </p>
            </div>

            {/* 2. MAIN STAGE (Video Player) */}
            <div className='relative w-full flex flex-col items-center justify-start pt-4'>
                <div className="relative z-40 w-full max-w-[750px] aspect-video mb-12 group">
                    {/* Artistic Borders */}
                    <div className="absolute inset-0 bg-white rotate-1 rounded-[35px] shadow-[0_0px_20px_rgb(0,0,0,.1)] scale-[1.02] transition-transform duration-500 group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-white -rotate-1 rounded-[35px] shadow-[0_0px_20px_rgb(0,0,0,.1)] scale-[1.01] transition-transform duration-500 group-hover:-rotate-2"></div>
                    
                    {/* Player */}
                    <div className="relative shadow-[0_0px_20px_rgb(0,0,0,.1)] overflow-hidden rounded-[35px] border-[6px] border-white">
                        <CustomVideoPlayer key={activeVideo.id} src={activeVideo.src} />
                    </div>
                </div>

                {/* 3. VIDEO SELECTION ROW */}
                <div className="relative z-40 flex flex-wrap justify-center gap-8 md:gap-12 mt-4 mb-24">
                    {VIDEO_DATA.filter((video) => video.id !== activeVideoId).map((video, index) => {
                            const isLeftTilted = index % 2 === 0;
                            const hoverRotation = isLeftTilted ? 'hover:rotate-2' : 'hover:-rotate-2';
                            const baseRotation = isLeftTilted ? '-rotate-2' : 'rotate-2';

                            return (
                                <button
                                    key={video.id}
                                    onClick={() => setActiveVideoId(video.id)}
                                    className={`relative group cursor-pointer transition-all duration-500 ease-out outline-none scale-100 hover:scale-105 opacity-80 hover:opacity-100 ${hoverRotation}`}
                                >
                                    <div className={`bg-white rounded-[20px] p-2 pb-6 transition-shadow duration-300 shadow-[0_0px_20px_rgb(0,0,0,.2)] ${baseRotation}`}>
                                        <div className="w-[140px] rounded-[15px] h-[90px] md:w-[160px] md:h-[100px] bg-slate-900 relative flex items-center justify-center overflow-hidden group-hover:grayscale-0 transition-all duration-500">
                                            <Image src={video.thumb} alt={video.title} fill className="object-cover" sizes="160px"/>
                                            <div className="absolute inset-0 transition-colors bg-black/40 group-hover:bg-black/10" />
                                            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all bg-black/40 border-white/50 text-white/70 group-hover:bg-white/20 group-hover:text-white">
                                               <Play size={18} fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-1 left-0 w-full text-center">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{video.title}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                    })}
                </div>
            </div>

            {/* 4. NEW: HORIZONTAL TIMELINE SECTION */}
            <div className="w-full relative mt-16" ref={timelineRef}>
                <div className="text-center mb-16">
                    <h3 className="text-2xl font-bold text-slate-800">Visual History</h3>
                    <p className="text-slate-500 text-sm tracking-widest uppercase mt-2">Scroll to explore the journey</p>
                </div>

                {/* Main Container */}
                <div 
                    ref={scrollContainerRef}
                    className="relative w-full overflow-x-auto pb-20 pt-10 px-4 md:px-12 hide-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="relative min-w-[2400px] flex items-center h-[400px]">
                        
                        {/* --- BACKGROUND LINE (Static Gray) --- */}
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 rounded-full z-0 transform -translate-y-1/2"></div>
                        
                        {/* --- ANIMATED FILL LINE (Blue) --- */}
                        {/* This width is controlled by page scroll (vertical) to animate the line horizontally */}
                        <div 
                            className="absolute left-0 top-1/2 h-[3px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full z-10 transform -translate-y-1/2 transition-all duration-100 ease-linear"
                            style={{ width: `${lineWidth}px` }}
                        >
                            {/* The glowing head of the line */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                        </div>

                        {/* --- TIMELINE ITEMS --- */}
                        {SCRAPBOOK_IMAGES.map((img, index) => {
                            // Zigzag Logic: Evens bottom, Odds top
                            const isTop = index % 2 !== 0; 
                            
                            // Check if the animated line has passed this item's center point
                            // We approximate the position based on index and spacing
                            const itemLeftPos = 50 + (index * 180); // roughly the spacing
                            const isActive = lineWidth > itemLeftPos;

                            return (
                                <div 
                                    key={index} 
                                    className={`absolute flex flex-col items-center group transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40'}`}
                                    style={{ 
                                        left: `${itemLeftPos}px`,
                                        top: '50%',
                                        transform: `translateY(-50%)`, // Centers the container on the line
                                    }}
                                >
                                    {/* The Connector Dot */}
                                    <div className={`
                                        w-4 h-4 rounded-full border-[3px] z-20 transition-colors duration-500
                                        ${isActive ? 'bg-blue-500 border-white shadow-md' : 'bg-slate-300 border-white'}
                                    `}></div>

                                    {/* The Image Card */}
                                    {/* Using `absolute` here to push it up or down relative to the dot */}
                                    <div className={`
                                        absolute w-[160px] md:w-[180px] p-2 bg-white rounded-lg shadow-lg
                                        transition-all duration-700 hover:scale-110 hover:z-50 hover:rotate-0
                                        ${isTop ? 'bottom-8 rotate-3 origin-bottom' : 'top-8 -rotate-2 origin-top'}
                                    `}>
                                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-slate-100">
                                            <Image 
                                                src={img.src} 
                                                alt={`Timeline ${index}`} 
                                                fill 
                                                className="object-cover"
                                                sizes="(max-width: 768px) 160px, 180px"
                                            />
                                        </div>
                                        <div className="mt-2 text-center">
                                            <span className={`block text-xs font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {img.year}
                                            </span>
                                            <span className="block text-[10px] text-slate-500 font-serif italic">
                                                {img.title}
                                            </span>
                                        </div>
                                        
                                        {/* Connector Line (Vertical small line to the main timeline) */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 w-px h-6 bg-slate-300 -z-10
                                            ${isTop ? '-bottom-6' : '-top-6'}
                                        `}></div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes music-bar {
                    0% { height: 30%; }
                    100% { height: 100%; }
                }
                .animate-music-bar-1 { height: 60%; animation: music-bar 0.5s ease-in-out infinite alternate; }
                .animate-music-bar-2 { height: 90%; animation: music-bar 0.7s ease-in-out infinite alternate; }
                .animate-music-bar-3 { height: 50%; animation: music-bar 0.6s ease-in-out infinite alternate; }
            `}</style>
        </div>
    );
}

export default LocalLegend;