'use client'; // This is crucial! We need client-side interactivity (useState, onClick).

import Link from 'next/link';
import Image from 'next/image';
// import bellIcon from "@/public/icons/noti-icon.svg";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// --- SVG Icons for Menu/Close ---
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="3" viewBox="0 0 26 26" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg" className='flex flex-col'>
    <line x1="3" y1="13" x2="15" y2="13"></line>
    <line x1="3" y1="5" x2="21" y2="5"></line>
    <line x1="3" y1="21" x2="21" y2="21"></line>
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} stroke="#fff" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


export default function Navbar() {
  // --- State for Mobile Menu ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // --- Authentication State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userName = 'User Account';

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsMenuOpen(false); // Close menu on login
  };
  const handleLogout = () => {
    setIsLoggedIn(false); // Logout doesn't require closing the menu since it's inside
  };
  
  // Function to close menu, useful for link clicks
  const closeMenu = () => setIsMenuOpen(false);
  
  // Function to toggle menu open/close
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // --- Lock body scroll when mobile menu is open ---
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    if (isMenuOpen) {
      // Save current scroll position and lock
      const scrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      // Prevent background scrolling/bounce on mobile
      root.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.overscrollBehavior = 'contain';
    } else {
      // Restore scroll and cleanup styles
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

    // Cleanup if component unmounts while menu is open
    return () => {
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
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* =================================================================
        DESKTOP NAVIGATION (Visible on medium screens and up)
      ================================================================= */}
      <div className='fixed top-[40px] left-1/2 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[50]'>
          <div className='bg-white/10 max-sm:bg-white/0 max-sm:backdrop-blur-[0px] backdrop-blur-[3px] rounded-full p-[3px] max-sm:shadow-[0px_0px_10px_rgba(0,0,0,0)] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
      <nav
      className="
        hidden md:flex
        font-bold text-black bg-[#000]/40 rounded-full
        justify-around items-center
        py-0 px-4 backdrop-blur-[10px]
        h-[62px] pl-[30px] pr-[10px] gap-[25px]
        border-[0px] border-white/60
        z-50 text-white
      "
    >
      <Link
        href="/"
        className={`cursor-pointer whitespace-nowrap ${
          pathname === '/' ? 'text-[#007BFF]' : ''
        }`}
      >
        Home
      </Link>

      <Link
        href="/virtual-map"
        className={`cursor-pointer whitespace-nowrap ${
          pathname === '/virtual-map' ? 'text-[#007BFF]' : ''
        }`}
      >
        Virtual Map
      </Link>

      <Link
        href="/all-sites"
        className={`cursor-pointer whitespace-nowrap ${
          pathname === '/all-sites' ? 'text-[#007BFF]' : ''
        }`}
      >
        View Sites
      </Link>

      <Link
        href="/tours"
        className={`cursor-pointer whitespace-nowrap ${
          pathname === '/tours' ? 'text-[#007BFF]' : ''
        }`}
      >
        Tours
      </Link>
        
        {/* --- Separator --- */}
        <div className='bg-white/80 h-[60%] w-[2px] rounded-full'></div>

        {/* --- Conditional Authentication Section --- */}
        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            <div className='relative'>
              <div className='absolute bottom-[-7px] right-[-10px] cursor-pointer whitespace-nowrap rounded-full p-[1.5px] bg-[linear-gradient(to_right,#FF9D00,#FFC766)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
              {/* <Link href="/sign-up"> */}
                <div className='flex justify-center items-center bg-[linear-gradient(to_left,#FF9D00,#FFC766)] rounded-full w-[23px] h-[18px]'>
                  <span className='text-white text-[.8rem] text-shadow-[0px_0px_4px_rgba(0,0,0,0.3)]'>36</span>
                </div>
              {/* </Link> */}
            </div>
              <Image src="/icons/awards-icon.svg" alt="Loading..." width={34} height={34} className="w-[34px] h-[34px] min-w-[34px] min-h-[34px]"/>
            </div>
            <div className='relative'>
              <div className='absolute top-[-7px] right-[-10px] cursor-pointer whitespace-nowrap rounded-full p-[1.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
              {/* <Link href="/sign-up"> */}
                <div className='flex justify-center items-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full w-[23px] h-[18px]'>
                  <span className='text-white text-[.8rem] text-shadow-[0px_0px_4px_rgba(0,0,0,0.3)] text-[#]'>10</span>
                </div>
              {/* </Link> */}
            </div>
              <Image src="/icons/noti-icon.svg" alt="Loading..." width={35} height={35} className="w-[34px] h-[34px] min-w-[34px] min-h-[34px]"/>
            </div>
            
            <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] -mr-[0px]'>
                <Link href="/sign-up">
                  <div className='bg-white rounded-full px-[20px] py-[20px]'>
                    {/* <span className='text-white font-bold'>Sign Up</span> */}
                  </div>
                </Link>
              </div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <button onClick={handleLogin} className='cursor-pointer whitespace-nowrap hover:text-gray-600 transition-colors'>
              Login
            </button>
            <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
              <Link href="/sign-up">
                <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[8.4px]'>
                  <span className='text-white'>Sign Up</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  </div>

      {/* =================================================================
        MOBILE-ONLY ELEMENTS (Burger button and Drawer Menu)
      ================================================================= */}
      <div className="md:hidden"> {/* This container is hidden on desktop */}
        {/* --- Burger Menu Button --- */}
        <div className='fixed top-[16px] left-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[50]'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <button
              onClick={toggleMenu}
              className="z-50 p-[11px] rounded-full bg-black/40 backdrop-blur-sm text-black"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              {/* <div className='absolute -z-[60] bg-red-500 rounded-full p-[10px]'></div> */}
            </button>
          </div>
        </div>
        {isMenuOpen ? <div className='fixed bottom-0 bg-white/80 backdrop-blur-md h-[50px] w-[100vw]'/> : "" }
        {isMenuOpen ? <div className='fixed top-0 bg-white/80 backdrop-blur-md h-[50px] w-[100vw]'/> : "" }

        {/* --- Mobile Menu Panel (The "Drawer") --- */}
        <div className={`
          fixed inset-0 bg-white/80 backdrop-blur-md z-40
          flex flex-col items-center justify-center gap-8
          text-2xl font-bold text-black
          transition-transform duration-300 ease-in-out
          pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* --- Main Navigation Links --- */}
          <Link
            href="/"
            onClick={closeMenu}
            className={`${pathname === '/' ? 'text-[#007BFF]' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/virtual-map"
            onClick={closeMenu}
            className={`${pathname === '/virtual-map' ? 'text-[#007BFF]' : ''}`}
          >
            Virtual Map
          </Link>
          <Link
            href="/all-sites"
            onClick={closeMenu}
            className={`${pathname === '/all-sites' ? 'text-[#007BFF]' : ''}`}
          >
            View Sites
          </Link>
          <Link
            href="/tours"
            onClick={closeMenu}
            className={`${pathname === '/tours' ? 'text-[#007BFF]' : ''}`}
          >
            Tours
          </Link>
          
          {isLoggedIn && (
            <>
              <hr className="w-2/3 border-gray-300 my-4" />
              <div className="flex flex-col items-center gap-6">
                <Link href="/account" onClick={closeMenu} className="text-blue-600">{userName}</Link>
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

      <div className='fixed right-[13px] top-[15px] cursor-pointer whitespace-nowrap rounded-full p-[3px] z-[50]'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className='bg-black/40 backdrop-blur-sm rounded-full px-[7px] pl-[13px] py-[5px] z-[50]'>
              {isLoggedIn ? (
                <div className="flex items-center gap-[27px]">
                  <div className='relative'>
                    <div className='absolute bottom-[-4px] right-[-10px] cursor-pointer whitespace-nowrap rounded-full p-[1.5px] bg-[linear-gradient(to_right,#FF9D00,#FFC766)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
                    {/* <Link href="/sign-up"> */}
                      <div className='flex justify-center items-center bg-[linear-gradient(to_left,#FF9D00,#FFC766)] rounded-full w-[23px] h-[16px]'>
                        <span className='text-white text-[.8rem] text-shadow-[0px_0px_4px_rgba(0,0,0,0.3)] font-bold'>36</span>
                      </div>
                    {/* </Link> */}
                  </div>
                    <Image src="/icons/awards-icon.svg" alt="Loading..." width={34} height={34} className="w-[34px] h-[34px] min-w-[34px] min-h-[34px]"/>
                  </div>
                  <div className='relative'>
                    <div className='absolute top-[-4px] right-[-10px] cursor-pointer whitespace-nowrap rounded-full p-[1.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
                    {/* <Link href="/sign-up"> */}
                      <div className='flex justify-center items-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full w-[23px] h-[16px]'>
                        <span className='text-white text-[.8rem] text-shadow-[0px_0px_4px_rgba(0,0,0,0.3)] font-bold'>10</span>
                      </div>
                    {/* </Link> */}
                  </div>
                    <Image src="/icons/noti-icon.svg" alt="Loading..." width={35} height={35} className="w-[34px] h-[34px] min-w-[34px] min-h-[34px]"/>
                  </div>
                  
                  <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)]'>
                    <Link href="/account">
                      {/* <div className='flex flex-row items-center gap-[7px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full p-[2px]'> */}
                        <div className='rounded-full h-[35px] w-[35px] bg-white'></div>
                        {/* <span className='text-white'>{userName}</span> */}
                      {/* </div> */}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <button onClick={handleLogin} className='cursor-pointer whitespace-nowrap hover:text-gray-600 transition-colors pl-[13px] font-bold'>
                    Login
                  </button>
                  <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] -mr-[2px]'>
                    <Link href="/sign-up">
                      <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[6.4px]'>
                        <span className='text-white font-bold'>Sign Up</span>
                      </div>
                    </Link>
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