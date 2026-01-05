"use client";
import React from 'react';
import { Code2 } from 'lucide-react';
import { digitalArchitects } from "@/app/types/credits";

const DigitalArchitects = () => {
  return (
    <section className="py-24 px-6 w-full max-w-6xl mx-auto">
      <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Digital Architects</h2>
          <p className="text-slate-600 leading-relaxed">
              This project is the result of a collaboration with a talented team of <span className="font-semibold text-blue-600">University of the West Indies (UWI)</span> students. 
              These emerging tech leaders donated their expertise to bridge the gap between 
              St. Joseph’s storied past and its digital future.
          </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {digitalArchitects.map((name, idx) => (
            <div key={idx} className='rounded-[43px] p-[2px] h-full bg-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
              <div className='snap-center shrink-0 relative flex flex-col w-[100%] p-5 bg-black/3 rounded-[40px]'>
                {/* <div key={idx} className="group relative bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 text-center">
                    <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"> */}
                        <Code2 className="w-6 h-6" />
                    {/* </div> */}
                    <h3 className="text-xl font-bold text-slate-800">{name}</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Web Design & Dev</p>
                </div>
              </div>
          ))}
      </div>
    </section>
  );
};

export default DigitalArchitects;