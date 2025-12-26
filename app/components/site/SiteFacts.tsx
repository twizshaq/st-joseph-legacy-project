import React from 'react';
import Image from 'next/image';
import clockIcon from "@/public/icons/clock-icon.svg";
import camIcon from "@/public/icons/camera-icon.svg";
import ticketIcon from "@/public/icons/ticket-icon.svg";

export const SiteFacts = () => {
  return (
    <div className='relative mt-[60px] w-[1400px] max-w-[90vw] flex flex-col'>
      {/* Section Title */}
      <p className='relative z-10 font-bold text-[2rem] text-start mb-8'>Quick Facts</p>
      
      {/* Cards Container - Using Grid for better alignment */}
      <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>

        {/* Card 1: Best Time */}
        <div className='bg-[#FF8400]/10 backdrop-blur-[3px] rounded-[42px] p-[3px] active:scale-[.992] shadow-[0px_0px_10px_rgba(0,0,0,0.08)] cursor-pointer'>
          
          {/* Added 'group' here so the children know when this is hovered */}
          <div className='group relative flex flex-row items-center gap-5 p-4 bg-white/80 h-full rounded-[40px] overflow-hidden transition-all duration-300'>

            {/* Pattern Background Layer */}
            <div 
              className="absolute inset-0 opacity-[.1] z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.3] group-active:opacity-[0.3]" 
              style={{ 
                backgroundImage: 'radial-gradient(#FF8F00 1px, transparent 1px)', 
                backgroundSize: '14px 14px', 
              }} 
            />

            {/* Icon Container: Changed 'hover:scale' to 'group-hover:scale' so it pops when you hover anywhere on the card */}
            <div className='relative z-10 flex items-center justify-center w-[65px] h-[65px] bg-orange-100 rounded-[23px] group-hover:scale-110 transition-transform duration-300'>
              <span className='group-hover:rotate-12 group-active:rotate-12 transition-transform duration-300'>
                <Image src={clockIcon} alt="Clock" height={28} className='opacity-80' />
              </span>
            </div>

            <div className='relative z-10 flex flex-col'>
              <p className='text-[0.85rem] font-bold uppercase tracking-wider text-orange-600/70 mb-0.5'>Best Time</p>
              <p className='text-[1.05rem] font-[600] text-slate-800 leading-tight'>Sunrise & <br/>Late Afternoon</p>
            </div>
          </div>
        </div>

        {/* Card 2: Photo Spots */}
        <div className='bg-[#2563EB]/10 backdrop-blur-[3px] rounded-[42px] p-[3px] active:scale-[.992] shadow-[0px_0px_20px_rgba(0,0,0,.08)] cursor-pointer'>
          <div className='group relative flex flex-row items-center gap-5 p-4 bg-white/80 h-full rounded-[40px] overflow-hidden transition-all duration-300'>

            {/* Pattern Background Layer */}
            <div 
              className="absolute inset-0 opacity-[.1] z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.3] group-active:opacity-[0.3]" 
              style={{ 
                backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', 
                backgroundSize: '14px 14px', 
              }} 
            />
            
            <div className='flex items-center justify-center z-[1] w-[65px] h-[65px] bg-blue-100 rounded-[23px] group-hover:scale-110 transition-transform duration-300'>
              <span className='group-hover:rotate-12 group-active:rotate-[-12deg] transition-transform duration-300'>
                <Image src={camIcon} alt="Camera" height={28} className='opacity-80' />
              </span>
            </div>
            <div className='relative z-10 flex flex-col'>
              <p className='text-[0.85rem] font-bold uppercase tracking-wider text-blue-600/70 mb-0.5'>Photo Spots</p>
              <p className='text-[1.05rem] font-[600] text-slate-800 leading-tight'>Soup Bowl • <br/>Bathsheba Rock</p>
            </div>
          </div>
        </div>

        {/* Card 3: Entry Fee */}
        <div className='bg-[#15803d]/10 backdrop-blur-[3px] rounded-[42px] p-[3px] overflow-hidden active:scale-[.992] shadow-[0px_0px_20px_rgba(0,0,0,.09)] cursor-pointer'>
          <div className='group relative flex flex-row items-center gap-5 p-4 bg-white/80 h-full rounded-[40px] overflow-hidden transition-all duration-300'>

            {/* Pattern Background Layer */}
            <div 
              className="absolute inset-0 opacity-[.1] z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.3] group-active:opacity-[0.3]" 
              style={{ 
                backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', 
                backgroundSize: '14px 14px', 
              }} 
            />

            <div className='flex items-center justify-center z-[1] w-[65px] h-[65px] bg-green-100 rounded-[23px] group-hover:scale-110 transition-transform duration-300'>
              <span className='group-hover:rotate-12 group-active:rotate-12 transition-transform duration-300'>
                <Image src={ticketIcon} alt="Ticket" height={28} className='opacity-80' />
              </span>
            </div>
            <div className='flex flex-col self-start'>
              <p className='text-[0.85rem] font-bold uppercase tracking-wider text-green-600/70 mb-0.5'>Entry Fee</p>
              <p className='text-[1.05rem] font-[600] text-slate-800 leading-tight'>Free <br/>Public Access</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};