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
  const pathname = usePathname(); // Gets the current route (e.g., "/explore")

  // Helper to check active state
  const isActive = (path: string) => pathname === path;

  // --- Styles for Desktop Items ---
  const desktopItemClass = "flex items-center hover:scale-110 bg-red-500/0 origin-left transition-transform duration-200 gap-2 p-2 rounded-xl cursor-pointer text-black font-semibold";
  const desktopActiveClass = "flex items-center hover:scale-110 bg-red-500/0 origin-left transition-transform duration-200 gap-2 p-2 rounded-xl cursor-pointer text-black font-semibold"; // Added subtle bg for active desktop

  // --- Styles for Mobile Items ---
  const mobileBaseClass = "rounded-full transition-transform duration-200 active:scale-[.9] px-3 py-[6px]";
  const mobileActiveClass = "bg-[#007BFF] text-white shadow-[0px_0px_10px_rgba(0,0,0,0.3)]";
  const mobileInactiveClass = "bg-transparent active:bg-[#333]/20 active:bg-[#333]/20";

  return (
    <>
      {/* --- Upload Modal (Managed internally) --- */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      {/* =================================================================
                          Desktop Side Nav
      ================================================================= */}
      <div className='hidden md:flex h-[100dvh] bg-red-500/0 fixed flex-col justify-center left-[10px] z-50'>
        <div className="w-fit bg-red-50/0 gap-0">
            
            {/* Explore */}
            <Link href="/explore">
                <div className={isActive('/explore') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[4px] mb-[2px]'>
                        <ExploreIcon size={24} color="black" />
                    </div>
                    <span className='font-[550] mb-[2px]'>Explore</span>
                </div>
            </Link>

            {/* Leaderboard */}
            <Link href="/leaderboard">
                <div className={isActive('/leaderboard') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[4px]'>
                        <LeaderboardIcon size={26} color="black" />
                    </div>
                    <span className='font-[550] ml-[-2px]'>Leaderboard</span>
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
                <span className='font-[550] ml-[-4px]'>Upload</span>
            </div>

            {/* Profile */}
            <Link href="/profile">
                <div className={isActive('/profile') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[7px] my-[4px]'>
                        <ProfileIcon size={21} color="black" />
                    </div>
                    <span className='font-[600]'>Profile</span>
                </div>
            </Link>

            {/* Feedback */}
            <Link href="/feedback">
                <div className={isActive('/feedback') ? desktopActiveClass : desktopItemClass}>
                    <div className='ml-[7px]'>
                        <AlertIcon size={21} color="black" />
                    </div>
                    <span className='font-[600]'>Feedback</span>
                </div>
            </Link>
        </div>
      </div>

      {/* =================================================================
                          Mobile Bottom Floating Nav
      ================================================================= */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[999] max-w-[90%] w-fit">
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className="bg-black/40 backdrop-blur-md rounded-full flex p-[4px] px-[8px] gap-[4px] items-center">
                
                {/* Explore */}
                <Link href="/explore">
                    <div className={`${mobileBaseClass} ${isActive('/explore') ? mobileActiveClass : mobileInactiveClass}`}>
                        <ExploreIcon size={28} color={isActive('/explore') ? "white" : "white"} className={isActive('/explore') ? "" : ""} />
                    </div>
                </Link>

                {/* Leaderboard */}
                <Link href="/leaderboard">
                    <div className={`${mobileBaseClass} ${isActive('/leaderboard') ? mobileActiveClass : mobileInactiveClass}`}>
                        <LeaderboardIcon size={28} color={isActive('/leaderboard') ? "white" : "white"} className={isActive('/leaderboard') ? "" : ""} />
                    </div>
                </Link>

                {/* Upload (Triggers Modal) */}
                <div 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className={`${mobileBaseClass} ${mobileInactiveClass} cursor-pointer`}
                >
                    <UploadIcon size={34} color="white" className="" />
                </div>

                {/* Profile */}
                <Link href="/profile">
                     <div className={`${mobileBaseClass} ${isActive('/profile') ? mobileActiveClass : mobileInactiveClass}`}>
                        <ProfileIcon size={24} color={isActive('/profile') ? "white" : "white"} className={isActive('/profile') ? "" : ""} />
                    </div>
                </Link>

                {/* Feedback */}
                <Link href="/feedback">
                    <div className={`${mobileBaseClass} ${isActive('/feedback') ? mobileActiveClass : mobileInactiveClass}`}>
                        <AlertIcon size={24} color={isActive('/feedback') ? "white" : "white"} className={isActive('/feedback') ? "" : " "} />
                    </div>
                </Link>

            </div>
        </div>
      </div>
    </>
  );
}