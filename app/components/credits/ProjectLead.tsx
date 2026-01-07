"use client";
import React from 'react';
import { Lightbulb, PenTool } from 'lucide-react';

const ProjectLead = () => {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            
            {/* Content Side */}
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Lightbulb className="w-3 h-3" /> Visionary
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Anjelica Catling</h2>
                    <p className="text-slate-500 font-medium text-lg mt-1">Project Lead • Content & Research</p>
                </div>
                
                <div className="relative pl-6 border-l-4 border-blue-500">
                    <p className="text-xl text-slate-700 italic font-medium leading-relaxed">
                        &quot;We built this because we believe St. Joseph has a story worth telling 
                        and a future worth protecting.&quot;
                    </p>
                </div>
            </div>

            {/* Icon/Image Side */}
            <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border-8 border-slate-50 shadow-inner">
                <PenTool className="w-16 h-16 text-slate-300" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectLead;