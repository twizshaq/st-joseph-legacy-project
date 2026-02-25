'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";

interface ProfilePopupProps {
  isOpen: boolean;
  position: { top: number; left: number } | null;
  onClose: () => void;
  onLogout: () => void;
  profileLink: string;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({
  isOpen,
  position,
  onClose,
  onLogout,
  profileLink
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside logic is handled by parent or here
  // Note: Since you handle click-outside in Navbar main, this can be purely presentational
  
  if (!isOpen || !position) return null;

  return (
    <div
      id="profile-panel"
      ref={popupRef}
      className="fixed z-[101] bg-white/10 backdrop-blur-[4px] max-sm:mt-[10px] mt-[30px] rounded-[30px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-70%)'
      }}
    >
      <div className="bg-[#000]/40 p-[5px] rounded-[27px] w-[160px] items-start justify-start">
        <Link
          href={profileLink}
          onClick={onClose}
          className="flex px-3 py-3 active:scale-[.98] active:bg-black/50 hover:bg-black/50 rounded-[20px] w-full text-white text-[1rem] font-medium transition-colors flex items-center gap-2"
        >
          <UserRound size={24} />
          Profile
        </Link>

        <button
          onClick={() => {
            onClose();
            // Add settings logic here
          }}
          className="flex px-3 py-3 active:scale-[.98] active:bg-black/50 hover:bg-black/50 rounded-[20px] w-full text-left text-white text-[1rem] font-medium transition-colors flex items-center gap-2"
        >
          <Settings size={24} />
          Settings
        </button>

        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="flex px-3 py-3 active:scale-[.98] active:bg-black/50 hover:bg-black/50 rounded-[20px] w-full text-left text-white text-[1rem] font-medium transition-colors flex items-center gap-2"
        ><LogOut size={24} />
          Sign Out
        </button>
      </div>
    </div>
  );
};