"use client";

import React from 'react';
import Link from 'next/link';
import Footer from "@/app/components/FooterModal";

// Reusable component for a Person/Role row to keep code clean
const CreditRow = ({ role, name }: { role: string, name: string }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100 last:border-0 gap-2">
    <span className="font-bold text-lg text-gray-900">{role}</span>
    <span className="text-gray-600 text-lg">{name}</span>
  </div>
);

export default function CreditsPage() {
  return (
    <div className='flex flex-col items-center min-h-[100dvh] text-black bg-[#fff] overflow-x-hidden'>

      {/* 2. Hero Text */}
      <div className="mt-[160px] mb-[60px] px-[5vw] text-center max-w-[900px]">
        <h1 className="font-black text-[3rem] md:text-[4rem] leading-[1.1] mb-6">
          The People Behind <br/> the Project
        </h1>
        <p className="text-xl text-gray-600">
          "Unveiling Our Legacy" was built to connect the community with its history. 
          This platform is the result of collaboration between the District Emergency Organisation, 
          technology partners, and the people of St. Joseph.
        </p>
      </div>

      {/* 3. Credits List Container */}
      <div className="w-[90vw] max-w-[1000px] bg-slate-50 rounded-[40px] p-8 md:p-12 shadow-sm mb-[100px]">
        
        {/* Section: Leadership */}
        <div className="mb-12">
          <h3 className="text-2xl font-black mb-6 border-b-2 border-black/10 pb-2">Project Leadership</h3>
          <CreditRow role="Project Lead" name="St. Joseph DEO" />
          <CreditRow role="Coordinator" name="Jane Doe" />
        </div>

        {/* Section: Development */}
        <div className="mb-12">
          <h3 className="text-2xl font-black mb-6 border-b-2 border-black/10 pb-2">Design & Development</h3>
          <CreditRow role="Lead Developer" name="Your Name Here" />
          <CreditRow role="UI/UX Design" name="Design Studio Name" />
          <CreditRow role="Videography" name="Production Team Name" />
        </div>

        {/* Section: Research */}
        <div>
          <h3 className="text-2xl font-black mb-6 border-b-2 border-black/10 pb-2">Research & History</h3>
          <CreditRow role="Historical Archives" name="St. Joseph Historical Society" />
          <CreditRow role="Community Liaison" name="John Smith" />
        </div>

      </div>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}