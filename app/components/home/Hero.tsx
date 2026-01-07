import React from 'react';

export default function Hero() {
    return (
        <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[70vh] text-white gap-[20px] overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                // ADD A POSTER IMAGE HERE (Screenshot your video first frame)
                // poster="/images/hero-placeholder.jpg" 
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
            </video>
            
            {/* Dark Overlay - Optimized opacity for legibility */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
            
            <div className="relative z-10 flex flex-col items-center max-w-[90vw] animate-fade-in-up">
                <h1 className="font-black text-[3rem] text-center leading-[1.1] mb-4 drop-shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
                    St. Joseph: Unveiling Our Legacy
                </h1>
                <p className="text-center text-lg md:text-xl font-[500] text-gray-100 max-w-[600px] drop-shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
                    Discover the Beauty. Master the Risk. A journey of our parish&apos;s rich history whilst building community resilience.
                </p>
            </div>
        </div>
    );
}