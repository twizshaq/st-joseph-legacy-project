"use client";
import React from 'react';
import { Award, Handshake, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { platinumSponsors } from "@/app/types/credits";

const SponsorsOption1 = () => {
  return (
    <section className="w-full bg-white text-slate-800 py-24 px-6">
      <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-20">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-700 font-bold text-xs tracking-widest uppercase mb-4">
                  Our Community Pillars
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Partners & Sponsors</h2>
              <p className="max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed">
                  Resilience is a team effort. These organizations provide the critical resources, 
                  funding, and expertise that keep St. Joseph safe.
              </p>
          </div>

          {/* Platinum Tier */}
          <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Star className="w-5 h-5 text-yellow-500 fill-current" /> Platinum Tier
                  </h3>
                  <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {platinumSponsors.map((sponsor, idx) => (
                    //   <div key={idx} className="relative group bg-white p-8 rounded-[40px] border border-slate-200 hover:border-blue-200 hover:shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div key={idx} className='rounded-[43px] p-[2px] h-full bg-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
                        <div className='snap-center shrink-0 relative flex flex-col w-[100%] h-full p-5 bg-black/3 rounded-[40px]'>
                          {/* Decorative Top Line */}
                          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          {/* Logo Placeholder */}
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 text-slate-400 border border-slate-100 group-hover:scale-110 transition-transform">
                              <ShieldCheck className="w-8 h-8" />
                          </div>

                          <h4 className="text-xl font-bold text-slate-900 mb-2">{sponsor.name}</h4>
                          <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-2 w-fit rounded-full mb-4">{sponsor.role}</span>
                          <p className="text-sm text-slate-600 leading-relaxed">{sponsor.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
          </div>

          {/* Gold Tier */}
          <div className="mb-24">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-8">Gold & Community Partners</h3>
               <div className="flex flex-wrap gap-6 justify-center">
                  {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className="h-20 w-48 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 text-sm font-medium hover:bg-slate-100 transition-colors cursor-default">
                          [Partner Logo]
                      </div>
                  ))}
               </div>
          </div>

          {/* Minimalist CTA */}
          <div className="text-center">
             <p className="text-slate-500 mb-6 font-medium">Want to support the St. Joseph community?</p>
                <button className={`w-fit cursor-pointer group rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]`}>
                    <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white rounded-full px-8 py-3.5 flex items-center gap-3'>
                        <Handshake className="w-4 h-4" />
                        <span className='font-bold text-lg'>Become a Sponsor</span>
                    </div>
                </button>
          </div>
      </div>
    </section>
  );
};

export default SponsorsOption1;