"use client";
import React from 'react';

const AboutHero = () => {
  return (
    <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[70vh] text-white gap-[20px] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default AboutHero;