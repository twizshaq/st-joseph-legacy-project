"use client";

import React  from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import test from '@/public/test1.png'
import loadingIcon from '@/public/loading-icon.png'
import alertIcon from '@/public/icons/alert-icon.svg'
import enlargeIcon from '@/public/icons/enlarge-icon.svg'
import Map from '@/app/components/Map';
import Link from 'next/link';
import { useRef } from 'react';
type Zoomable = { zoomIn: () => void; zoomOut: () => void };


export default function Home() {

  const mapRef = useRef<Zoomable | null>(null);
const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the map's container div

const handleZoomIn = () => {
  mapRef.current?.zoomIn();
};

const handleZoomOut = () => {
  mapRef.current?.zoomOut();
};


  const [email, setEmail] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());


  const handleJoinClick = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setShowConfetti(true);
        setJoined(true);
        setTimeout(() => setShowConfetti(false), 4000);
      } else {
        setMessage(result.error || 'An unexpected error occurred.');
        setIsError(true);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      setMessage("Could not connect to the server. Please try again.");
      setIsError(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className='flex flex-col items-center min-h-[100dvh] text-black bg-[#fff]'>
      <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[70vh] text-white gap-[20px] overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay (optional for text readability) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

      {/* Foreground Content */}
      <p className="font-black text-[3rem] text-center leading-[1.2] z-10 max-w-[90vw]">
        Discover the Untold Stories <br /> of St. Joseph
      </p>
      <p className="text-center z-10 max-w-[90vw]">
        A community project to document and protect our cultural heritage
      </p>

    </div>




                  {/* Section 1 */}
      <div className="w-[90vw] max-w-[1500px] mx-auto mt-[70px] max-sm:mt-[-50px] flex flex-col lg:flex-row items-start justify-between gap-12">
        {/* LEFT: Copy */}
        <div className="flex-1 max-w-[700px] max-sm:mt-[100px] flex flex-col">
          <h2 className="font-bold text-[2rem] max-sm:text-[1.5rem] mb-[14px] mt-[]">Preserving Our Legacy</h2>
          <p className="text-black/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          {/* Mobile-Only Collage: Appears here on smaller screens */}
          <div className="block lg:hidden relative max-w-[90vw] w-[560px] bg-red-500/0 aspect-[14/13] self-center my-12 max-sm:right-[14px]">
            {/* Colorful Gradient Glow blobs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
              <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
              <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
              <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
            </div>
            {/* Large portrait (top-right) */}
            <div className="absolute w-[41%] h-[58%] top-[2%] right-[5%] rotate-[12deg]">
              <div className="relative w-full h-full rounded-[30px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
            </div>
            {/* Left card (mid-left) */}
            <div className="absolute w-[46%] h-[42%] top-[22%] left-[8%] -rotate-[10deg]">
              <div className="relative w-full h-full rounded-[30px] border-4 border-white shadow-[0_2px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
            </div>
            {/* Bottom-right wide card */}
            <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[12%] -rotate-[2deg]">
              <div className="relative w-full h-full rounded-[30px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
            </div>
          </div>

          <h3 className="font-bold text-[1.4rem] mt-8 mb-2">About</h3>
          <p className="text-black/80">
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-black/80 mt-4">
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <p className="mt-6">With some of the popular attractions being</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Tent Bay</li>
            <li>Soup Bowl</li>
            <li>Flower Forest Botanical Gardens</li>
            <li>Andromeda Gardens</li>
            <li>Hunte&apos;s Gardens</li>
            <li>Cotton Tower Signal Station</li>
          </ul>
        </div>

        {/* RIGHT: Desktop-Only Collage */}
        <div className="hidden lg:block relative flex-1 w-full max-w-[560px] aspect-[14/13] self-center my-12 lg:my-0">
          {/* Colorful Gradient Glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
              <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
              <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
              <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
            </div>
          </div>
          {/* Large portrait (top-right) */}
          <div className="absolute w-[41%] h-[58%] top-[2%] right-[5%] rotate-[12deg]">
            <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
          </div>
          {/* Left card (mid-left) */}
          <div className="absolute w-[46%] h-[42%] top-[22%] left-[8%] -rotate-[10deg]">
            <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
          </div>
          {/* Bottom-right wide card */}
          <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[12%] -rotate-[2deg]">
            <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
          </div>
        </div>
      </div>




      {/* Mapbox */}
      <div className='bg-pink-500/0 flex flex-col items-center w-[90vw] mt-[100px]'>
        <p className='font-bold text-[2rem] text-center'>Virtual Map of St. Joseph</p>
        <p className='max-w-[700px] text-center'>consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        
        <div ref={mapContainerRef} className='relative h-[500px] max-sm:h-[400px] w-[1000px] max-w-[90vw] rounded-[60px] mt-[50px] overflow-hidden shadow-[0px_0px_15px_rgba(0,0,0,0.1)] border-4 border-white'>
          
          {/* The Map Component with the ref */}
          <Map ref={mapRef} />

          {/* Your Custom Controls */}
          <div className='absolute top-[20px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <div className='rounded-full bg-black/40 backdrop-blur-[5px] flex flex-col gap-0 p-[0px] py-[0px] w-[45px] overflow-hidden z-[40]'>
                <button 
                  onClick={handleZoomIn}
                  className='rounded-[0px] px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'
                >
                  <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                  <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                </button>
                <button 
                  onClick={handleZoomOut}
                  className='rounded-[0px] px-[12px] py-[20px] pb-[23px] active:bg-white/10'
                >
                  <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                </button>
              </div>
            </div>
          </div>
          

          {/* Your Overlay Buttons */}
          <div className='absolute bottom-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <button className='rounded-full active:bg-black/30 bg-black/40 backdrop-blur-[5px] flex flex-row text-white font-bold px-[15px] py-[10px] gap-[10px] z-[40]'>
              <Image src={alertIcon} alt="" height={25} width={25}/>
              <p className=''>Feedback</p>
            </button>
            </div>
          </div>

        <Link 
              href="/virtual-map"
              target="_blank" // This is what opens it in a new tab
              rel="noopener noreferrer" // Security best practice for new tabs
            >
          <div className='absolute top-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <div className='rounded-full active:bg-black/30 bg-black/40 backdrop-blur-[5px] p-[8px] z-[40] '>
                <Image src={enlargeIcon} alt="Open map in new tab" height={30} width={30}/>
              </div>
            {/* </Link> */}
            </div>
          </div>
        </Link>
        
        </div>
      </div>



      {/* Sites */}
      <div className="bg-green-500/0 max-w-[1500px] w-full mt-[100px] flex flex-col">
      <div className="bg-red-500/0 px-[5vw]">
          <p className="font-bold text-[2rem]">Popular Sites</p>
          <p className="max-w-[700px]">
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
      </div>
      <div className='bg-red-500/0 w-fit self-end mr-[5vw] font-bold mb-[-10px] mt-[20px]'><Link href="/all-sites">View All Sites</Link></div>
      <div className="flex flex-col w-full overflow-x-auto hide-scrollbar">
          <div className="mt-[10px] flex flex-row items-center min-h-[450px] gap-[30px] px-[4vw] overflow-y-hidden">
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[40px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                    <a href="/parris-hill-murals">
                      <p className="text-white font-bold">Explore Site</p>
                    </a>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[40px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[40px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[40px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[40px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
          </div>
      </div>
  </div>



      {/* Footer */}
      <footer className='bg-blue-900 text-white w-full mt-[100px] py-12 px-[4vw]'>
        <div className='max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10'>
          {/* Column 1: Identity & Contact */}
          <div className='flex flex-col gap-4'>
            <h3 className='font-bold text-xl'>Unveiling Our Legacy</h3>
            <p className='text-blue-200 text-sm'>A District Emergency Organization (DEO) Project.</p>
            <div>
              <h4 className='font-semibold mb-2'>Contact Us</h4>
              <p className='text-blue-200 text-sm'>stjoseph.legacy@deo.gov.bb</p>
              <p className='text-blue-200 text-sm'>(246) 123-4567</p>
            </div>
            <div>
              <div className='flex items-center gap-4 mt-3'>
                <a href="#" className='text-blue-300 hover:text-white'><Image src="/icons/instagram-icon.svg" alt="" height={35} width={35}/></a>
                <a href="#" className='text-blue-300 hover:text-white'><Image src="/icons/facebook-icon.svg" alt="" height={30} width={30}/></a>
              </div>
            </div>
          </div>

          {/* Column 3: Get Involved + Stay Connected */}
          <div className='flex flex-col-reverse items-start lg:items-center gap-[40px] lg:ml-[25px] ml-0'>
            {/* Get Involved */}
            <div className='flex flex-col gap-4 w-full'>
              <h3 className='font-bold text-xl lg:text-center'>Get Involved</h3>
              <ul className='space-y-2 text-blue-200 lg:text-center'>
                <li><a href="/volunteer" className='hover:text-[#feb47b] transition-colors'>Volunteer Sign-up</a></li>
              </ul>
              <button className='relative lg:self-center cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[180px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                <a
                href="/donate" 
                className='mt-2 bg-[linear-gradient(to_right,#ff7e5f,#feb47b)] text-white font-bold py-3 rounded-full text-center shadow-lg'
              >
                <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px]'>
                  <span className='text-white text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                    Contribute
                  </span>
                  <Image src="/icons/heart-icon.svg" alt="Loading..." width={18} height={18} className='invert' />
                </div>
              </a>
              </button>
            </div>

            {/* Stay Connected */}
            <div className='flex flex-col gap-4 items-start lg:items-center w-full'>
              <h3 className='font-bold text-xl'>Stay Connected</h3>
              <p className='text-blue-200 text-sm lg:text-center'>Subscribe to our newsletter for project updates and email blasts.</p>
              <div className="h-hit w-fit flex items-center justify-end relative mb-[0px]">
                <input
                  type="email"
                  className="border-[2px] border-white/10 backdrop-blur-[5px] text-white font-semibold rounded-[30px] py-[15px] pl-[20px] pr-[130px] max-w-[80vw] w-[350px] outline-none bg-black/20"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleJoinClick}
                  disabled={isSubmitting || !isValid}
                  className={`
                    absolute rounded-full py-[10px] px-[22px] mr-[7px] font-semibold
                    transition-colors
                    ${isSubmitting
                      ? 'bg-transparent'
                      : isValid
                        ? 'bg-[#007BFF] hover:[#002347] text-white filter shadow-[0_0_7px_rgba(0,123,255,0.5)]'
                        : 'bg-[#777]/30 text-white/30'
                    }
                    ${isSubmitting || !isValid ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {isSubmitting && (
                    <div className="absolute inset-0 flex justify-end items-center right-[10px]">
                      <Image src={loadingIcon} alt="Loading..." className="animation" width={26} height={26} />
                    </div>
                  )}
                  <span className={isSubmitting ? 'invisible' : 'visible'}>
                    Subscribe
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className='flex flex-col gap-4 text-left lg:text-right'>
            <h3 className='font-bold text-xl'>Navigate</h3>
            <ul className='space-y-2 text-blue-200'>
              <li><a href="/about" className='hover:text-[#feb47b] transition-colors'>About the Project</a></li>
              <li><a href="/map" className='hover:text-[#feb47b] transition-colors'>Virtual Map</a></li>
              <li><a href="/tours" className='hover:text-[#feb47b] transition-colors'>Guided Tours</a></li>
              <li><a href="/metrics" className='hover:text-[#feb47b] transition-colors'>Project Metrics</a></li>
              <li><a href="/faq" className='hover:text-[#feb47b] transition-colors'>FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='max-w-7xl mx-auto mt-10 pt-8 border-t border-blue-800 flex flex-col lg:flex-row lg:justify-between items-start lg:items-center text-sm text-blue-300'>
          <p>© 2025 DEO Project. All Rights Reserved.</p>
          <div className='flex gap-4 mt-4 lg:mt-0'>
            <a href="/privacy" className='hover:text-white transition-colors'>Privacy Policy</a>
            <a href="/terms" className='hover:text-white transition-colors'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};