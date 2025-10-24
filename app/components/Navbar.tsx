'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// Supabase imports
import { createClient } from '@/lib/supabase/client'; // Adjust path if needed
import type { User } from '@supabase/supabase-js'; // Type for the user object

// --- SVG Icons ---
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="3" viewBox="0 0 26 26" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg" className='flex flex-col'>
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

// Define the types for the component's props
interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  // --- State for Mobile Menu ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // --- Real Authentication State ---
  const [user, setUser] = useState<User | null>(null);

  // --- Real Sign Out Function ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    closeMenu();
  };
  
  // --- Listen to Authentication Changes ---
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router]);


  // Function to close menu, useful for link clicks
  const closeMenu = () => setIsMenuOpen(false);
  
  // Function to toggle menu open/close
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // --- Lock body scroll when mobile menu is open ---
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      root.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.overscrollBehavior = 'contain';
    } else {
      const top = body.style.top;
      root.style.overflow = '';
      body.style.overflow = '';
      body.style.overscrollBehavior = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      if (top) {
        window.scrollTo(0, -parseInt(top));
      }
    }
    return () => {
      const top = body.style.top;
      root.style.overflow = ''; body.style.overflow = ''; body.style.overscrollBehavior = ''; body.style.position = ''; body.style.top = ''; body.style.left = ''; body.style.right = ''; body.style.width = '';
      if (top) {
        window.scrollTo(0, -parseInt(top));
      }
    };
  }, [isMenuOpen]);

  // Helper to get user's avatar URL with a fallback
  const avatarUrl = user?.user_metadata?.avatar_url || "/icons/default-avatar.svg";

  return (
    <>
      {/* =================================================================
        DESKTOP NAVIGATION
      ================================================================= */}
      <div className='fixed top-[40px] left-1/2 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[50]'>
          <div className='bg-white/10 max-sm:bg-white/0 max-sm:backdrop-blur-[0px] backdrop-blur-[10px] rounded-full p-[3px] max-sm:shadow-[0px_0px_10px_rgba(0,0,0,0)] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <nav className="hidden md:flex font-bold text-black bg-[#000]/40 rounded-full justify-around items-center py-0 px-4 backdrop-blur-[10px] h-[62px] pl-[30px] pr-[10px] gap-[25px] border-[0px] border-white/60 z-50 text-white">
              <Link href="/" className={`cursor-pointer whitespace-nowrap text-border-1 text-border-red-500 ${pathname === '/' ? 'text-[#007BFF]' : ''}`}>Home</Link>
              <Link href="/virtual-map" className={`cursor-pointer whitespace-nowrap ${pathname === '/virtual-map' ? 'text-[#007BFF]' : ''}`}>Virtual Map</Link>
              <Link href="/all-sites" className={`cursor-pointer whitespace-nowrap ${pathname === '/all-sites' ? 'text-[#007BFF]' : ''}`}>View Sites</Link>
              <Link href="/tours" className={`cursor-pointer whitespace-nowrap ${pathname === '/tours' ? 'text-[#007BFF]' : ''}`}>Tours</Link>
                
              <div className='bg-white/80 h-[60%] w-[2px] rounded-full'></div>

              {user ? (
                // --- USER IS LOGGED IN ---
                <div className="flex items-center gap-3 bg-red-500/0">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image src="/icons/noti-icon.svg" alt="Notifications" width={36} height={36} className="h-[35px] object-contain" />
                  </div>
                  <Link href="/profile" className='cursor-pointer whitespace-nowrap'>
                    <div className='w-10 h-10 flex items-center justify-center rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] -mr-[0px]'>
                      <div className='bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden'>
                        <Image src={avatarUrl} alt="User profile picture" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                // --- USER IS LOGGED OUT ---
                <div className="flex items-center gap-5">
                  <button onClick={onLoginClick} className='cursor-pointer whitespace-nowrap hover:text-gray-300 transition-colors'>
                    Login
                  </button>
                  <div className='whitespace-nowrap rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
                    <button onClick={onSignUpClick} className='cursor-pointer'>
                      <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[8.4px]'>
                        <span className='text-white'>Sign Up</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
      </div>

      {/* =================================================================
        MOBILE-ONLY ELEMENTS
      ================================================================= */}
      <div className="md:hidden">
        <div className='fixed top-[16px] left-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[50]'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <button onClick={toggleMenu} className="z-50 p-[11px] rounded-full bg-black/40 backdrop-blur-sm text-black" aria-label="Toggle menu">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {isMenuOpen ? <div className='fixed bottom-0 bg-white/80 backdrop-blur-md h-[50px] w-[100vw]'/> : null }
        {isMenuOpen ? <div className='fixed top-0 bg-white/80 backdrop-blur-md h-[50px] w-[100vw]'/> : null }

        {/* --- Mobile Menu Panel --- */}
        <div className={`fixed inset-0 bg-white/80 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8 text-2xl font-bold text-black transition-transform duration-300 ease-in-out pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <Link href="/" onClick={closeMenu} className={`${pathname === '/' ? 'text-[#007BFF]' : ''}`}>Home</Link>
          <Link href="/virtual-map" onClick={closeMenu} className={`${pathname === '/virtual-map' ? 'text-[#007BFF]' : ''}`}>Virtual Map</Link>
          <Link href="/all-sites" onClick={closeMenu} className={`${pathname === '/all-sites' ? 'text-[#007BFF]' : ''}`}>View Sites</Link>
          <Link href="/tours" onClick={closeMenu} className={`${pathname === '/tours' ? 'text-[#007BFF]' : ''}`}>Tours</Link>
        </div>

        <div className='fixed right-[13px] top-[15px] cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[50]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <div className='bg-black/40 backdrop-blur-sm rounded-full px-[7px] pl-[13px] py-[5px] z-[50]'>
                {user ? (
                  // --- USER IS LOGGED IN (MOBILE ICONS) ---
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Image src="/icons/noti-icon.svg" alt="Notifications" width={40} height={40} className="h-[36px] object-contain" />
                    </div>
                    <Link href="/profile" className='cursor-pointer whitespace-nowrap'>
                      <div className='w-10 h-10 flex items-center justify-center rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] -mr-[1px]'>
                        <div className='bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden'>
                          <Image src={avatarUrl} alt="User profile picture" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : (
                  // --- USER IS LOGGED OUT (MOBILE BUTTONS) ---
                  <div className="flex items-center gap-5">
                    <button onClick={onLoginClick} className='cursor-pointer whitespace-nowrap text-white hover:text-gray-300 transition-colors pl-[13px] font-bold'>
                      Login
                    </button>
                    <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] -mr-[2px]'>
                      <button onClick={onSignUpClick}>
                        <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[6.4px]'>
                          <span className='text-white font-bold'>Sign Up</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default Navbar;