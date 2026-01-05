"use client";
import React from 'react';

const CreditsHeader = () => {
  return (
    <section className="pt-32 md:pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
      <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
        The Project Team
      </span>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
        The Minds <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          Behind the Map
        </span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
        "Unveiling Our Legacy" is a community project driven by a passionate team of volunteers. 
        This project fuses local heritage with interactive technology, combining our parish’s 
        stories with essential disaster data to create an experience that is as innovative as it is essential.
      </p>
    </section>
  );
};

export default CreditsHeader;