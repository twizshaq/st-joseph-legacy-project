"use client";
import React from 'react';

const AboutMission = () => {
  return (
    <section className="py-20 px-6 flex flex-col w-[100vw] max-w-[1500px]">
      <div className="max-w-4xl z-[10] mx-auto text-center mt-15">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          St. Joseph District <br /> 
          <span className="">Emergency Organisation</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-yellow-600/90 mb-6 uppercase">
          Who We Are
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          The St. Joseph DEO is one of 24 volunteer groups across Barbados, 
          serving as the community arm of the Department of Emergency Management (DEM).
        </p>
      </div>
    </section>
  );
};

export default AboutMission;