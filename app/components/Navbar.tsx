'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// --- IMPORTS FROM YOUR GLOBAL FOLDERS ---
import { useNavbarProfile } from '@/app/hooks/useNavbarProfile'; 
import { NavbarProps } from '@/app/types'; 
import { ProfilePopup } from './ProfilePopup'; // Assuming same folder, or '@/app/components/ProfilePopup'
import { NotificationPanel } from '@/app/components/NotificationPanel';
import LeaderboardIcon from '@/public/icons/leaderboard-icon';

// --- ICONS (Can be moved to a generic Icons file if desired) ---
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="3" viewBox="0 0 26 26" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="13" x2="15" y2="13"></line><line x1="3" y1="5" x2="21" y2="5"></line><line x1="3" y1="21" x2="21" y2="21"></line></svg>
);
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  // 1. Logic extracted to global hook
  const { user, profile, isLoading, handleLogout } = useNavbarProfile();
  
  // 2. Local UI State
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notiPos, setNotiPos] = useState<{ top: number; left: number } | null>(null);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePos, setProfilePos] = useState<{ top: number; left: number } | null>(null);

  const desktopNotiRef = useRef<HTMLButtonElement>(null);
  const mobileNotiRef = useRef<HTMLButtonElement>(null);
  const desktopProfileRef = useRef<HTMLButtonElement>(null);
  const mobileProfileRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Helper: Get position for popups
  const calculatePos = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.bottom + 10, left: rect.left };
  };

  const toggleNoti = (isMobile: boolean) => {
    if (isNotiOpen) {
      setIsNotiOpen(false);
      return;
    }
    const ref = isMobile ? mobileNotiRef.current : desktopNotiRef.current;
    if (ref) {
      setUnreadCount(0);
      const pos = calculatePos(ref);
      setNotiPos({ ...pos, left: pos.left + ref.offsetWidth / 2 });
      setIsNotiOpen(true);
      setIsProfileOpen(false);
    }
  };

  const toggleProfile = (isMobile: boolean) => {
    if (isProfileOpen) {
      setIsProfileOpen(false);
      return;
    }
    const ref = isMobile ? mobileProfileRef.current : desktopProfileRef.current;
    if (ref) {
      setProfilePos(calculatePos(ref));
      setIsProfileOpen(true);
      setIsNotiOpen(false);
    }
  };

  // Close Popups on Outside Click
  useEffect(() => {
    if (!isNotiOpen && !isProfileOpen) return;
    
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isNotiOpen && !target.closest('#noti-panel') && !target.closest('[data-noti-button]')) {
        setIsNotiOpen(false);
      }
      if (isProfileOpen && !target.closest('#profile-panel') && !target.closest('[data-profile-button]')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isNotiOpen, isProfileOpen]);

  // Lock Scroll when Menu Open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const usernameSeed = user?.user_metadata?.username || user?.email || 'User';
  const rawAvatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${usernameSeed}`;
  const profileLink = profile?.username ? `/${profile.username}` : '/profile';

  const getNavLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `relative cursor-pointer whitespace-nowrap py-1 transition-all active:scale-[.95]
      ${isActive ? 'text-white max-sm:text-slate-800' : 'opacity-[.9] hover:text-white'}
      after:content-[''] after:absolute after:left-0 after:-bottom-[0px] after:h-[3px] after:w-full after:rounded-full after:transition-all
      ${isActive ? 'after:bg-[#007BFF] after:opacity-100' : 'after:opacity-0 hover:after:opacity-40 hover:after:bg-white/40'}
    `;
  };

  // --- JSX RENDER HELPERS ---
  const renderNavLinks = (isMobile = false) => (
    <>
      <Link href="/" className={getNavLinkClass('/')} onClick={isMobile ? closeMenu : undefined}>Home</Link>
      <Link href="/virtual-map" className={getNavLinkClass('/virtual-map')} onClick={isMobile ? closeMenu : undefined}>Virtual Map</Link>
      <Link href="/all-sites" className={getNavLinkClass('/all-sites')} onClick={isMobile ? closeMenu : undefined}>Sites</Link>
      <Link href="/tours" className={getNavLinkClass('/tours')} onClick={isMobile ? closeMenu : undefined}>Tours</Link>
      <Link href="/about-us" className={getNavLinkClass('/about-us')} onClick={isMobile ? closeMenu : undefined}>The DEO</Link>
      <Link href="/team" className={getNavLinkClass('/team')} onClick={isMobile ? closeMenu : undefined}>Team</Link>
    </>
  );

  const renderAuthButtons = (isMobile = false) => {
    if (isLoading) return isMobile ? <div className="w-10 h-10" /> : <div className="flex items-center gap-3 w-[85px] justify-end"><div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" /></div>;

    if (user) {
      return (
        <div className="flex items-center gap-3">
          <Link href="/leaderboard" className={`relative ${isMobile ? 'ml-[2px]' : 'mr-[15px]'}`}>
            <LeaderboardIcon size={30} color="white" />
            {unreadCount > 0 && (
              <div className='absolute bottom-[-3px] right-[-5px] rounded-full active:scale-[.95] p-[2px] bg-gradient-to-r from-[#FF9D00] to-[#FFC766]'>
                <div className='min-w-[18px] min-h-[18px] bg-gradient-to-r from-[#FFC766] to-[#FF9D00] rounded-full flex items-center justify-center'>
                  <span className="text-white drop-shadow-[0px_0px_2px_rgba(0,0,0,0.3)] text-[10px] font-bold">{unreadCount}</span>
                </div>
              </div>
            )}
          </Link>
          
          <button
            ref={isMobile ? mobileNotiRef : desktopNotiRef}
            onClick={() => toggleNoti(isMobile)}
            data-noti-button
            className={`relative cursor-pointer w-10 h-10 flex items-center justify-center active:scale-[.95] hover:opacity-80 transition-opacity ${!isMobile && 'ml-[-10px]'}`}
          >
            <Image src="/icons/noti-icon.svg" alt="Notifications" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} className={`${isMobile ? 'h-[36px]' : 'h-[35px]'} object-contain`} />
            {unreadCount > 0 && (
              <div className='absolute top-[2px] right-[2px] rounded-full active:scale-[.95] p-[2px] bg-gradient-to-r from-[#007BFF] to-[#66B2FF]'>
                <div className='min-w-[18px] min-h-[18px] bg-gradient-to-r from-[#66B2FF] to-[#007BFF] rounded-full flex items-center justify-center'>
                  <span className="text-white text-[10px] font-bold">{unreadCount}</span>
                </div>
              </div>
            )}
          </button>

          <button 
            ref={isMobile ? mobileProfileRef : desktopProfileRef}
            onClick={() => toggleProfile(isMobile)}
            data-profile-button
            className='cursor-pointer active:scale-[.95] border-none bg-transparent p-0 outline-none'
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#007BFF] to-[#66B2FF] p-[2px] shadow-md ${isMobile && '-mr-[1px]'}`}>
              <div className='bg-white rounded-full w-full h-full overflow-hidden relative'>
                <Image
                  key={rawAvatarUrl}
                  src={rawAvatarUrl}
                  alt="User"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-5'}`}>
        <Link href="/leaderboard" className={isMobile ? 'ml-[10px]' : ''}>
          <LeaderboardIcon size={26} color="white" />
        </Link>
        <div className={`rounded-full p-[2px] bg-gradient-to-r from-[#007BFF] to-[#66B2FF] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-[.97] ${isMobile && '-mr-[2px]'}`}>
          <button onClick={onLoginClick} className='bg-gradient-to-l from-[#007BFF] to-[#66B2FF] cursor-pointer rounded-full px-[15px] py-[8.4px] font-bold text-white'>
            Login
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP NAV */}
      <div className='hidden [@media(min-width:768px)_and_(min-height:500px)]:block fixed top-[40px] left-1/2 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[100]'>
        <div className='bg-white/10 max-sm:backdrop-blur-[0px] backdrop-blur-[10px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
          <nav className="flex font-bold text-black bg-[#000]/40 rounded-full justify-around items-center py-0 px-4 h-[62px] pl-[30px] pr-[10px] gap-[25px] border-[0px] border-white/60 z-50 text-white">
            {renderNavLinks(false)}
            <div className='bg-white/80 h-[60%] w-[2px] rounded-full'></div>
            {renderAuthButtons(false)}
          </nav>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="[@media(min-width:768px)_and_(min-height:500px)]:hidden">
        <div className='fixed top-[16px] left-[10px] z-[100] rounded-full bg-white/10 p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] backdrop-blur-[4px]'>
          <button onClick={toggleMenu} className="z-50 p-[11px] rounded-full bg-black/40 active:bg-black/50 hover:bg-black/50 backdrop-blur-sm text-black">
             {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div className={`fixed inset-0 bg-white/80 backdrop-blur-md z-[99] flex flex-col items-center justify-center gap-8 text-2xl font-bold text-slate-800 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           {renderNavLinks(true)}
        </div>

        <div className='fixed right-[13px] top-[15px] z-[100] rounded-full bg-white/10 p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] backdrop-blur-[4px]'>
          <div className='bg-black/40 backdrop-blur-sm rounded-full px-[7px] pl-[10px] py-[5px] z-[50]'>
            {renderAuthButtons(true)}
          </div>
        </div>
      </div>

      {/* POPUPS */}
      {isNotiOpen && notiPos && (
        <NotificationPanel isOpen={isNotiOpen} onClose={() => setIsNotiOpen(false)} position={notiPos} />
      )}

      <ProfilePopup 
        isOpen={isProfileOpen} 
        position={profilePos} 
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => {
          handleLogout();
          closeMenu();
        }}
        profileLink={profileLink}
      />
    </>
  );
};

export default Navbar;