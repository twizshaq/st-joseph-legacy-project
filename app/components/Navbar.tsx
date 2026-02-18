'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationPanel } from '@/app/components/NotificationPanel';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import LeaderboardIcon from '@/public/icons/leaderboard-icon';

// --- Icons ---
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="3" viewBox="0 0 26 26" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="13" x2="15" y2="13"></line>
    <line x1="3" y1="5" x2="21" y2="5"></line>
    <line x1="3" y1="21" x2="21" y2="21"></line>
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  is_private: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notiPanelPosition, setNotiPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const [unreadCount, setUnreadCount] = useState(1);

  // Data State
  const [user, setUser] = useState<User | null>(null);
  const [navbarProfile, setNavbarProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hooks & Refs
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const desktopNotiButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNotiButtonRef = useRef<HTMLButtonElement>(null);

  // ------------------------------------------------------------------
  // 1. DATA FETCHING HELPER
  // ------------------------------------------------------------------
  const fetchNavbarProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      return data;
    } catch (error) {
      console.error('Error fetching navbar profile:', error);
      return null;
    }
  }, [supabase]);

  // ------------------------------------------------------------------
  // 2. AUTH & INITIALIZATION LOGIC
  // ------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            // FIX: Fetch profile data BEFORE stopping loading
            // This prevents showing the old metadata image for a split second
            const profileData = await fetchNavbarProfile(session.user.id);
            if (profileData) setNavbarProfile(profileData);
          }
          setIsLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          if (event === 'SIGNED_OUT') {
            setUser(null);
            setNavbarProfile(null);
            router.refresh();
          }
          else if (session?.user) {
            setUser(session.user);
            // On sign in/refresh, we ensure we have the latest profile data
            const profileData = await fetchNavbarProfile(session.user.id);
            if (profileData) setNavbarProfile(profileData);
          }
          setIsLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth setup error:", err);
        if (mounted) setIsLoading(false);
      }
    };

    setupAuth();

    return () => { mounted = false; };
  }, [supabase, router, fetchNavbarProfile]);


  // ------------------------------------------------------------------
  // 3. LISTEN FOR UPDATE EVENTS
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    // Listen for "profile-updated" event from SettingsModal
    const handleUpdateEvent = () => {
      // Small delay to let DB write finish
      setTimeout(async () => {
        const data = await fetchNavbarProfile(user.id);
        if (data) setNavbarProfile(data);
      }, 500);
    };

    window.addEventListener('profile-updated', handleUpdateEvent);
    return () => window.removeEventListener('profile-updated', handleUpdateEvent);
  }, [user, fetchNavbarProfile]);


  // ------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ------------------------------------------------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clearing local state immediately gives a snappy feel
    setNavbarProfile(null);
    setUser(null);
    router.refresh();
    closeMenu();
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDesktopNotiPanel = () => {
    if (isNotiOpen) {
      setIsNotiOpen(false);
    } else if (desktopNotiButtonRef.current) {
      setUnreadCount(0);
      const rect = desktopNotiButtonRef.current.getBoundingClientRect();
      setNotiPanelPosition({ top: rect.bottom + 10, left: rect.left + rect.width / 2 });
      setIsNotiOpen(true);
    }
  };

  const toggleMobileNotiPanel = () => {
    if (isNotiOpen) {
      setIsNotiOpen(false);
    } else if (mobileNotiButtonRef.current) {
      setUnreadCount(0);
      const rect = mobileNotiButtonRef.current.getBoundingClientRect();
      setNotiPanelPosition({ top: rect.bottom + 10, left: rect.left + rect.width / 2 });
      setIsNotiOpen(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isNotiOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('#noti-panel') && !(e.target as Element).closest('[data-noti-button]')) {
        setIsNotiOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isNotiOpen]);

  // ------------------------------------------------------------------
  // IMAGE URL LOGIC
  // ------------------------------------------------------------------
  const usernameSeed = user?.user_metadata?.username || user?.email || 'User';

  // Logic: 1. DB Profile Image -> 2. Metadata (Google) -> 3. DiceBear
  const rawAvatarUrl = navbarProfile?.avatar_url
    ? navbarProfile.avatar_url
    : (user?.user_metadata?.avatar_url
        ? user.user_metadata.avatar_url
        : `https://api.dicebear.com/9.x/initials/svg?seed=${usernameSeed}`
    );

  const profileLink = navbarProfile?.username ? `/${navbarProfile.username}` : '/profile';

  const navLinkClass = (path: string) => {
  const isActive = pathname === path;
  return `relative cursor-pointer whitespace-nowrap py-1 transition-all active:scale-[.95]
    ${isActive ? 'text-white max-sm:text-slate-800' : 'opacity-[.9] hover:text-white'}
    after:content-[''] after:absolute after:left-0 after:-bottom-[0px] after:h-[3px] after:w-full after:rounded-full after:transition-all
    ${isActive ? 'after:bg-[#007BFF] after:opacity-100' : 'after:opacity-0 hover:after:opacity-40 hover:after:bg-white/40'}
  `;
};

  return (
    <>
      {/* ======================= DESKTOP NAV ======================= */}
      <div className='hidden [@media(min-width:768px)_and_(min-height:500px)]:block fixed top-[40px] left-1/2 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[100]'>
        <div className='bg-white/10  max-sm:backdrop-blur-[0px] backdrop-blur-[10px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] '>
          <nav className="hidden [@media(min-width:768px)_and_(min-height:500px)]:flex font-bold text-black bg-[#000]/40 rounded-full justify-around items-center py-0 px-4 h-[62px] pl-[30px] pr-[10px] gap-[25px] border-[0px] border-white/60 z-50 text-white">
            <Link href="/" className={navLinkClass('/')}>Home</Link>
            <Link href="/virtual-map" className={navLinkClass('/virtual-map')}>Virtual Map </Link>
            <Link href="/all-sites" className={navLinkClass('/all-sites')}>Sites</Link>
            <Link href="/tours" className={navLinkClass('/tours')}>Tours</Link>
            <Link href="/about-us" className={navLinkClass('/about-us')}>The DEO</Link>
            <Link href="/team" className={navLinkClass('/team')}>Team</Link>

            <div className='bg-white/80 h-[60%] w-[2px] rounded-full'></div>

            {isLoading ? (
               <div className="flex items-center gap-3 w-[85px] justify-end">
                 <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
               </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/leaderboard" className='relative mr-[15px]'>
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
                  ref={desktopNotiButtonRef}
                  onClick={toggleDesktopNotiPanel}
                  data-noti-button
                  className="relative cursor-pointer w-10 h-10 flex items-center justify-center active:scale-[.95] hover:opacity-80 transition-opacity ml-[-10px]"
                >
                  <Image src="/icons/noti-icon.svg" alt="Notifications" width={36} height={36} className="h-[35px] object-contain" />
                  {unreadCount > 0 && (
                    <div className='absolute top-[2px] right-[2px] rounded-full active:scale-[.95] p-[2px] bg-gradient-to-r from-[#007BFF] to-[#66B2FF]'>
                      <div className='min-w-[18px] min-h-[18px] bg-gradient-to-r from-[#66B2FF] to-[#007BFF] rounded-full flex items-center justify-center'>
                        <span className="text-white text-[10px] font-bold">{unreadCount}</span>
                      </div>
                    </div>
                  )}
                </button>
                <Link href={profileLink} className='cursor-pointer active:scale-[.95]'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#007BFF] to-[#66B2FF] p-[2px] shadow-md'>
                    <div className='bg-white rounded-full w-full h-full overflow-hidden relative'>
                      {/*
                         UPDATED:
                         1. referrerPolicy added as requested.
                         2. key added to force cache clear on update.
                      */}
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
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* <button onClick={onLoginClick} className='active:scale-[.95] transition-colors'>Login</button> */}
                <Link href="/leaderboard">
                  <LeaderboardIcon size={26} color="white" />
                </Link>
                {/* <LeaderboardIcon size={26} color="white" /> */}
                <div className='rounded-full p-[2px] bg-gradient-to-r from-[#007BFF] to-[#66B2FF] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-[.97]'>
                  <button onClick={onLoginClick} className='bg-gradient-to-l from-[#007BFF] to-[#66B2FF] cursor-pointer rounded-full px-[15px] py-[8.4px]'>Login</button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* ======================= MOBILE NAV ======================= */}
      <div className="[@media(min-width:768px)_and_(min-height:500px)]:hidden">
        <div className='fixed top-[16px] left-[10px] z-[100] rounded-full bg-white/10 p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] backdrop-blur-[3px]'>
          <button onClick={toggleMenu} className="z-50 p-[11px] rounded-full bg-black/40 backdrop-blur-sm text-black">
             {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div className={`fixed inset-0 bg-white/80 backdrop-blur-md z-[99] flex flex-col items-center justify-center gap-8 text-2xl font-bold text-slate-800 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <Link href="/" className={navLinkClass('/')} onClick={closeMenu}>Home</Link>
            <Link href="/virtual-map" className={navLinkClass('/virtual-map')} onClick={closeMenu}>Virtual Map</Link>
            <Link href="/all-sites" className={navLinkClass('/all-sites')} onClick={closeMenu}>View Sites</Link>
            <Link href="/tours" className={navLinkClass('/tours')} onClick={closeMenu}>Tours</Link>
            <Link href="/about-us" className={navLinkClass('/about-us')}>The DEO</Link>
            <Link href="/team" className={navLinkClass('/team')} onClick={closeMenu}>Team</Link>
        </div>

        <div className='fixed right-[13px] top-[15px] z-[100] rounded-full bg-white/10 p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] backdrop-blur-[3px]'>
          <div className='bg-black/40 backdrop-blur-sm rounded-full px-[7px] pl-[10px] py-[5px] z-[50]'>
            {isLoading ? (
              <div className="w-10 h-10" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/leaderboard" className='relative ml-[2px]'>
                    <LeaderboardIcon size={30} color="white" />
                    {unreadCount > 0 && (
                     <div className='absolute bottom-[-3px] right-[-5px] rounded-full active:scale-[.95] p-[2px] bg-gradient-to-r from-[#FF9D00] to-[#FFC766]'>
                      <div className='min-w-[18px] min-h-[18px] bg-gradient-to-r from-[#FFC766] to-[#FF9D00] rounded-full flex items-center justify-center'>
                        <span className="text-white drop-shadow-[0px_0px_2px_rgba(0,0,0,0.3)] text-[10px] font-bold">{unreadCount}</span>
                      </div>
                    </div>
                  )}
                  </Link>
                <button ref={mobileNotiButtonRef} onClick={toggleMobileNotiPanel} data-noti-button className="relative w-10 h-10 flex items-center justify-center active:scale-[.95]">
                  <Image src="/icons/noti-icon.svg" alt="Notifications" width={40} height={40} className="h-[36px] object-contain" />
                  {unreadCount > 0 && (
                     <div className='absolute top-[2px] right-[2px] rounded-full active:scale-[.95] p-[2px] bg-gradient-to-r from-[#007BFF] to-[#66B2FF]'>
                      <div className='min-w-[18px] min-h-[18px] bg-gradient-to-r from-[#66B2FF] to-[#007BFF] rounded-full flex items-center justify-center'>
                        <span className="text-white text-[10px] drop-shadow-[0px_0px_2px_rgba(0,0,0,0.3)] font-bold">{unreadCount}</span>
                      </div>
                    </div>
                  )}
                </button>
                <Link href={profileLink} onClick={closeMenu}>
                   <div className='w-10 h-10 active:scale-[.95] rounded-full bg-gradient-to-r from-[#007BFF] to-[#66B2FF] p-[2px] shadow-md -mr-[1px]'>
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
                </Link>
              </div>
            ) : (
               <div className="flex items-center gap-4">
                 {/* <button onClick={onLoginClick} className='text-white pl-[13px] font-bold'>Login</button> */}
                  <Link href="/leaderboard" className='ml-[10px]'>
                    <LeaderboardIcon size={26} color="white" />
                  </Link>
                 <div className='rounded-full p-[2px] bg-gradient-to-r from-[#007BFF] to-[#66B2FF] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-[.97] -mr-[2px]'>
                   <button onClick={onLoginClick} className='bg-gradient-to-l from-[#007BFF] to-[#66B2FF] rounded-full px-[15px] py-[6.4px] text-white font-bold'>Login</button>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {isNotiOpen && notiPanelPosition && (
        <NotificationPanel isOpen={isNotiOpen} onClose={() => setIsNotiOpen(false)} position={notiPanelPosition} />
      )}
    </>
  );
}

export default Navbar;
