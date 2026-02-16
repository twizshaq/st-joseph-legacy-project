"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UploadModal from '@/app/components/UploadModal'; 

// --- Icons ---
import ExploreIcon from '@/public/icons/explore-icon';
import UploadIcon from '@/public/icons/upload-icon';
import LeaderboardIcon from '@/public/icons/leaderboard-icon';
import { ProfileIcon } from '@/public/icons/profile-icon';
import { AlertIcon } from '@/public/icons/alert-icon';

export default function ProfileNav() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const pathname = usePathname(); 

  const isActive = (path: string) => pathname === path;

  const isProfileActive = () => {
    const systemRoutes = ['/explore', '/leaderboard', '/feedback', '/'];
    return pathname === '/profile' || (
      !systemRoutes.includes(pathname) && 
      pathname.split('/').length === 2 
    );
  };

  // --- Styles ---
  // 1. Desktop side nav items fill width of nav for easier click/tap targets
  const desktopItemClass = "flex items-center hover:scale-110 bg-red-500/0 origin-left transition-transform duration-200 gap-2 p-2 rounded-xl cursor-pointer text-black font-semibold w-full";
  const desktopActiveClass = "flex items-center hover:scale-110 bg-red-500/0 origin-left transition-transform duration-200 gap-2 p-2 rounded-xl cursor-pointer text-black font-semibold w-full";
  
  // 2. NEW: This class hides text by default (md/lg screens) and shows it on xl (extra large) screens
  const desktopTextClass = "hidden xl:block font-[550]";

  const mobileBaseClass = "rounded-full transition-transform duration-200 active:scale-[.9] px-3 py-[6px]";
  const mobileActiveClass = "bg-[#007BFF] text-white shadow-[0px_0px_10px_rgba(0,0,0,0.3)]";
  const mobileInactiveClass = "bg-transparent active:bg-[#333]/20 active:bg-[#333]/20";

  return (
    <>
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      {/* =================================================================
                          Desktop Side Nav
      ================================================================= */}
      <div className='hidden md:flex h-[100dvh] bg-red-500/0 fixed flex-col justify-center left-[10px] z-50 pointer-events-none w-[72px] xl:w-[220px]'>
        {/* Added pointer-events-auto to the inner wrapper so clicks work, but the full height container doesn't block content underneath if it accidentally overlaps */}
        <div className="w-full bg-red-50/0 gap-0 pointer-events-auto">
            
            {/* Explore */}
            <Link href="/explore">
                <div className={isActive('/explore') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[4px] mb-[2px]'>
                        <ExploreIcon size={24} color="black" />
                    </div>
                    {/* Apply the responsive text class */}
                    <span className={`${desktopTextClass} mb-[2px]`}>Explore</span>
                </div>
            </Link>

            {/* Leaderboard */}
            <Link href="/leaderboard">
                <div className={isActive('/leaderboard') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[4px]'>
                        <LeaderboardIcon size={26} color="black" />
                    </div>
                    <span className={`${desktopTextClass} ml-[-2px]`}>Leaderboard</span>
                </div>
            </Link>

            {/* Upload */}
            <div 
                onClick={() => setIsUploadModalOpen(true)} 
                className={desktopItemClass}
            >
                <div className='ml-[0px]'>
                    <UploadIcon size={32} color="black" />
                </div>
                <span className={`${desktopTextClass} ml-[-4px]`}>Upload</span>
            </div>

            {/* Profile */}
            <Link href="/profile">
                <div className={isActive('/profile') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[7px] my-[4px]'>
                        <ProfileIcon size={21} color="black" />
                    </div>
                    <span className={desktopTextClass}>Profile</span>
                </div>
            </Link>

            {/* Feedback */}
            <Link href="/feedback">
                <div className={isActive('/feedback') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[7px]'>
                        <AlertIcon size={21} color="black" />
                    </div>
                    <span className={desktopTextClass}>Feedback</span>
                </div>
            </Link>
        </div>
      </div>

      {/* ... Mobile Nav stays the same ... */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[999] max-w-[90%] w-fit">
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className="bg-black/40 backdrop-blur-md rounded-full flex p-[4px] px-[8px] gap-[4px] items-center">
                <Link href="/explore">
                    <div className={`${mobileBaseClass} ${isActive('/explore') ? mobileActiveClass : mobileInactiveClass}`}>
                        <ExploreIcon size={28} color={isActive('/explore') ? "white" : "white"} />
                    </div>
                </Link>
                <Link href="/leaderboard">
                    <div className={`${mobileBaseClass} ${isActive('/leaderboard') ? mobileActiveClass : mobileInactiveClass}`}>
                        <LeaderboardIcon size={28} color={isActive('/leaderboard') ? "white" : "white"} />
                    </div>
                </Link>
                <div onClick={() => setIsUploadModalOpen(true)} className={`${mobileBaseClass} ${mobileInactiveClass} cursor-pointer`}>
                    <UploadIcon size={34} color="white" />
                </div>
                <Link href="/profile">
                     <div className={`${mobileBaseClass} ${isProfileActive() ? mobileActiveClass : mobileInactiveClass}`}>
                        <ProfileIcon size={24} color="white" />
                    </div>
                </Link>
                <Link href="/feedback">
                    <div className={`${mobileBaseClass} ${isActive('/feedback') ? mobileActiveClass : mobileInactiveClass}`}>
                        <AlertIcon size={24} color={isActive('/feedback') ? "white" : "white"} />
                    </div>
                </Link>
            </div>
        </div>
      </div>
    </>
  );
}