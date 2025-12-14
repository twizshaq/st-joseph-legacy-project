"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FacebookIcon from "@/public/icons/facebook-icon";

const Footer = () => {
  return (
    <footer className='relative bg-blue-900 text-white w-full mt-[100px]'>
      {/* Creative Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-900 via-[#006DDE] to-blue-900 shadow-[0_0_10px_#006DDE]" />

      <div className='max-w-[1500px] mx-auto px-[4vw] py-10 flex flex-col md:flex-row justify-between items-center gap-8'>
        
        {/* Left: Branding & Tagline */}
        <div className='text-center md:text-left'>
          <h3 className='font-bold text-2xl tracking-tight'>Unveiling Our Legacy <span className="text-[#feb47b]"></span></h3>
          <p className='text-blue-300 text-sm mt-1'>Documenting. Protecting. Unveiling.</p>
        </div>

        {/* Right Group: Nav stacked over Socials */}
        <div className='flex flex-col md:flex-col-reverse items-center md:items-end gap-6 md:gap-2'>
          
          {/* Navigation Pills */}
          <nav className='flex flex-wrap justify-center md:justify-end'>
            {[
              { name: 'Home', path: '/' },
              { name: 'Virtual Map', path: '/virtual-map' },
              { name: 'All Sites', path: '/all-sites' },
              { name: 'Tours', path: '/tours' },
            ].map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className='px-4 py-2 rounded-full text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-300'
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className='flex items-center gap-2'>
            <Link href="https://www.instagram.com/dem.barbados" target="_blank" className='group'>
              <div className='p-2 rounded-full transition-colors duration-300 hover:bg-white/10'>
                <Image src="/icons/instagram-icon.svg" alt="Instagram" height={30} width={30}/>
              </div>
            </Link>
            <Link href="https://www.facebook.com/dem246/" target="_blank" className='group'>
               <div className='p-2 rounded-full transition-colors duration-300 hover:bg-white/10'>
                <FacebookIcon color="#FFFFFF" height={30} width={30} />
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom: Legal */}
      <div className='relative bg-black/10 w-full'>
        
        {/* Tapered Shadow Border */}
        <div className="w-[90vw] mx-auto h-[1px] bg-white/7 shadow-[0px_0px_6px_rgba(0,0,0,0.1)]" />

        <div className='max-w-[1500px] mx-auto px-[4vw] py-4 flex flex-col-reverse md:flex-row justify-between items-center text-xs text-blue-400'>
          <p>© 2025 DEO Project. All Rights Reserved.</p>
          <div className='flex gap-6 mb-2 md:mb-0'>
            <Link href="/privacy" className='hover:text-white transition-colors'>Privacy Policy</Link>
            <Link href="/terms" className='hover:text-white transition-colors'>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;