"use client";
import React from 'react';
import { Users } from 'lucide-react';

const AboutCommunity = () => {
  return (
    <section className="w-full px-6 flex justify-center pb-20">
      <div className="max-w-[1500px] w-full">
        <div className="max-w-[90vw] mx-auto grid md:grid-cols-2 gap-16 items-start mt-10 max-sm:mt-0">

          {/* Text Content */}
          <div className="relative order-2 md:order-1 max-sm:text-center">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-60"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                We Are Proud <span className="text-[#007DFF]">"Josephines"</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We are your neighbours, your friends, and your family. While our primary mandate 
                is Disaster Management, we know that a truly resilient community is one that stays connected.
              </p>
              
              <div className="p-0 bg-blue-500/0 rounded-[30px] shadow-[0px_0px_20px_rgba(0,0,0,0)]">
                <p className="text-slate-800 font-medium italic">
                  "Our goal is to cultivate a more informed, engaged, 
                  and disaster-resilient St. Joseph by integrating cultural heritage 
                  with modern risk management."
                </p>
              </div>
            </div>
          </div>
          
          {/* Image/Map Placeholder */}
          <div className="order-1 md:order-2 h-[300px] w-[100%] bg-slate-100 rounded-[50px] overflow-hidden shadow-[0px_0px_15px_rgba(0,0,0,0.1)] flex items-center justify-center border-3 border-white relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100"></div>
            <div className="text-center relative z-10 text-slate-400">
                <Users className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <span className="font-semibold tracking-wider">COMMUNITY PHOTO</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutCommunity;