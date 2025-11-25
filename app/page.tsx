"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { AlertIcon } from '@/public/icons/alert-icon';
import alertIcon from '@/public/icons/alert-icon.svg';
import loadingIcon from '@/public/loading-icon.png';
import vrIcon from "@/public/icons/vr-icon.svg"
import enlargeIcon from '@/public/icons/enlarge-icon.svg';
import Map from '@/app/components/Map';
import Compass from '@/app/components/Compass';
import Link from 'next/link';
import FacebookIcon from "@/public/icons/facebook-icon";
import { createClient } from '@supabase/supabase-js';
import { Feature, Point, FeatureCollection } from 'geojson';

// --- TYPE DEFINITIONS ---
type MapControlsHandle = { 
  zoomIn: () => void; 
  zoomOut: () => void; 
  resetNorth: () => void; 
};

export type SiteCard = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  category: string;
};

export type Site = {
  id: number;
  name: string;
  category: string;
  description: string;
  coordinates: [number, number];
  imageUrl: string;
  colorhex: string;
};

interface SupabaseSiteData {
  id: number;
  name: string | null;
  category: string | null;
  description: string | null;
  longitude: string | null;
  latitude: string | null;
  pointimage: string | null;
  colorhex: string | null;
}

const getDirectionLetter = (bearing: number): string => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

export default function Home() {
  // --- STATE AND REFS ---
  const mapRef = useRef<MapControlsHandle | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const compassDialRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null); // For throttling updates
  
  const [siteCards, setSiteCards] = useState<SiteCard[]>([]);
  const [siteCardsLoading, setSiteCardsLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [directionLetter, setDirectionLetter] = useState('N');
  const [email, setEmail] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // --- SINGLE DATA FETCHING HOOK ---
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing.");
      setSiteCardsLoading(false);
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchAllData = async () => {
      setSiteCardsLoading(true);
      try {
        // Fetch both sets of data concurrently for better performance
        const [sitesResponse, locationsResponse] = await Promise.all([
          supabase.from('location_pins').select('*'),
          supabase.rpc('get_random_locations', { p_limit: 7 })
        ]);

        // Process sites data (for map)
        if (sitesResponse.error) throw sitesResponse.error;
        const siteData: Site[] = sitesResponse.data.map((entry: SupabaseSiteData) => ({
          id: entry.id,
          name: entry.name || 'Unnamed Site',
          category: entry.category || '',
          description: entry.description || '',
          coordinates: [parseFloat(entry.longitude || '0'), parseFloat(entry.latitude || '0')] as [number, number],
          imageUrl: entry.pointimage || '',
          colorhex: entry.colorhex || '#fff',
        })).filter(site => site.id !== null && site.coordinates.length === 2);
        setSites(siteData);

        // Process locations data (for cards)
        if (locationsResponse.error) throw locationsResponse.error;
        setSiteCards(locationsResponse.data || []);

      } catch (error) {
        console.error("Failed to fetch data from Supabase:", error);
      } finally {
        setSiteCardsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- MEMOIZED GEOJSON ---
  const geojsonData = useMemo((): FeatureCollection<Point> | null => {
  // Wait until both site cards and the full site list are loaded
  if (siteCards.length === 0 || sites.length === 0) {
    return null;
  }

  // Create a set of the featured site IDs for quick lookups
  const featuredSiteIds = new Set(siteCards.map(card => card.id));

  // Filter the full list of sites to only include the featured ones
  const featuredSites = sites.filter(site => featuredSiteIds.has(site.id));

  // Now, create the GeoJSON features from this filtered list
  const features: Feature<Point>[] = featuredSites.map(site => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: site.coordinates },
    properties: { ...site }, // Pass all site properties to the marker
  }));

  return { type: 'FeatureCollection', features };
}, [siteCards, sites]);

  // --- HANDLERS ---
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetNorth = () => mapRef.current?.resetNorth();
  const handleMapRotate = useCallback((newBearing: number) => {
    if (compassDialRef.current) {
      compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      setDirectionLetter(getDirectionLetter(newBearing));
    });
  }, []);
  const handleJoinClick = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setSubmissionMessage("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      setSubmissionMessage("Configuration error. Please try again later.");
      setIsSubmitting(false);
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      // Attempt to insert the new email
      const { error } = await supabase
        .from('subscribers')
        .insert({ email: email.trim() });

      if (error) {
        // Throw the error to be caught by the catch block
        throw error;
      }

      // Success!
      setSubmissionMessage("Thank you for subscribing!");
      setEmail(""); // Clear the input field

    } catch (error: any) {
      if (error.code === '23505') { // '23505' is the code for a unique constraint violation
        setSubmissionMessage("This email is already subscribed.");
      } else {
        console.error('Subscription error:', error);
        setSubmissionMessage("An error occurred. Please try again.");
      }
    } finally {
      // This will run whether the submission succeeds or fails
      setIsSubmitting(false);
    }
  };



  return (
    <div className='flex flex-col items-center min-h-[100dvh] text-black bg-[#fff] overflow-x-hidden'>
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
          <p className="">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          {/* Mobile-Only Collage: Appears here on smaller screens */}
          <div className="block lg:hidden relative max-w-[90vw] w-[560px] bg-red-500/0 aspect-[14/13] self-center my-12 max-sm:right-[14px]">
            {/* Colorful Gradient Glow blobs */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
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
          <p className="">
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="mt-4">
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
            <div className="absolute inset-0 pointer-events-none opacity-50">
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


      {/* Mapbox Section */}
      <div className='bg-pink-500/0 flex flex-col items-center w-[90vw] mt-[200px]'>
        <p className='font-bold text-[2rem] text-center'>Virtual Map of St. Joseph</p>
        <p className='max-w-[700px] text-center'>consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        
        <div ref={mapContainerRef} className='relative h-[500px] max-sm:h-[400px] w-[1000px] max-w-[90vw] rounded-[60px] mt-[50px] overflow-hidden shadow-[0px_0px_15px_rgba(0,0,0,0.1)] border-4 border-white'>
          
          {/* MODIFIED: Pass geojsonData to the Map component */}
          <Map ref={mapRef} geojsonData={geojsonData} onRotate={handleMapRotate}/>

          {/* ... (Your custom controls and overlay buttons remain the same) */}
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

          {/* NEW: Compass Control */}
            <div className='absolute top-[130px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <button onClick={handleResetNorth} className="rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg w-[48px] h-[48px] flex items-center justify-center z-[10]" aria-label="Reset bearing to north">
                <Compass ref={compassDialRef} directionLetter={directionLetter} />
              </button>
            </div>
          </div>
          

          {/* Your Overlay Buttons */}
          <div className='absolute bottom-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <button className='rounded-full active:bg-black/30 bg-black/40 backdrop-blur-[5px] flex flex-row text-white font-bold px-[15px] py-[10px] gap-[10px] z-[40]'>
              <AlertIcon size={23} color="white" />
              <p className=''>Feedback</p>
            </button>
            </div>
          </div>

        <Link 
              href="/virtual-map"
              target="_blank"
              rel="noopener noreferrer"
            >
          <div className='absolute top-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
              <div className='rounded-full active:bg-black/30 bg-black/40 backdrop-blur-[5px] p-[8px] z-[40] '>
                <Image src={enlargeIcon} alt="Open map in new tab" height={30} width={30}/>
              </div>
            </div>
          </div>
        </Link>
        
        </div>
      </div>



      {/* Sites */}
      <div className="bg-green-500/0 max-w-[1500px] w-full mt-[100px] flex flex-col">
        <div className="bg-red-500/0 px-[5vw]">
          <p className="font-bold text-[2rem]">Featured Sites</p>
          <p className="max-w-[700px]">
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className='bg-red-500/0 w-fit self-end mr-[5vw] font-bold mb-[-10px] mt-[20px]'>
          <Link href="/all-sites">View All Sites</Link>
        </div>
        
        {/* Dynamic Site Cards Section */}
        <div className="flex flex-col px-[5vw] max-sm:px-[0vw] overflow-x-auto hide-scrollbar" >
          <div className="mt-[10px] flex flex-row items-center min-h-[450px] gap-[30px] overflow-y-hidden px-[.9vw] max-sm:px-[5vw]">
            {/* CHANGE THIS: Map over 'siteCards' instead of 'sites' */}
            {siteCardsLoading ? (
              <div className="flex items-center justify-center w-full min-h-[370px]">
                <div
                  aria-label="Loading"
                  className="animate-spin w-12 h-12 bg-blue-500 [mask-image:url('/loading-icon.png')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-image:url('/loading-icon.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
                />
              </div>
            ) : siteCards.length > 0 ? (
              siteCards.slice(0, 7).map((card) => (
                <div key={card.id} className="relative">
                  {/* 2. This is the background/shadow div. It no longer needs a key. */}
                  <div
                    className="absolute bg-cover bg-center min-h-[340px] max-h-[340px] min-w-[270px] max-w-[270px] rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <div className="rotate-[180deg] self-end">
                      <div
                        className={`
                          bg-blue-500/0
                          absolute w-[270px] top-[70px] rotate-[-180deg]
                          backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px] 
                        `}
                      ></div>
                      {/* <div
                        className={`
                          absolute w-[270px] bg-transparent top-[190px] rotate-[-180deg]
                          backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_20%,transparent)] backdrop-blur-[20px] opacity-100 h-[150px]
                        `}
                      ></div> */}
                    </div>
                  </div>

                  {/* 3. This is the main card content. It also no longer needs a key. */}
                  <div
                    className="relative bg-cover bg-center min-h-[340px] max-h-[340px] min-w-[270px] max-w-[270px] rounded-[54px] flex flex-col justify-end overflow-hidden z-10"
                    style={{ backgroundImage: `url(${card.image_url})` }}
                  >
                    <Link href={`/${card.slug}`} passHref>
                      <div className="absolute inset-0 bg-black/30 rounded-[50px]" />
                      <div className="relative z-30 text-center mb-[20px] px-[10px]">
                        <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                          <p className="font-bold text-[1.3rem] mb-[2px]">{card.name}</p>
                          <p className="text-[1rem]">{card.description}</p>
                          <div className='mt-[10px] flex justify-center items-center'>
                            <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] w-[190px] bg-white/10 shadow-[0px_0px_40px_rgba(0,0,0,0.3)] -mr-[2px]'>
                              <div className='bg-black/20 rounded-full px-[15px] py-[6.4px]'>
                                <p className='text-center font-bold text-[.85rem]'>{card.category}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="rotate-[180deg] self-end">
                      <div
                        className={`
                          bg-blue-500/0
                          absolute w-[270px]
                          backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_50%,transparent)] opacity-100 h-[250px] 
                        `}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='w-[100vw]'>
                <p className="font-bold self-center text-center">No sites found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Sponsers */}
          <div className='bg-red-500/0 w-[100vw] mt-[50px] flex flex-col items-center'>
            <div className='flex flex-col items-center'>
              <p className="font-bold text-[2rem]">Our Sponsors</p>
              <p>Generous Support provided by</p>
            </div>
            <div className='bg-green-500/0 justify-center items-center flex flex-wrap gap-[30px] h-auto max-w-[90vw] w-auto mt-[30px]'>
              <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/361112479_1004546300898262_4577794897630667019_n.jpg" alt="Loading..." width={110} height={110} className='' />
              
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
              <a href="mailto:stjoseph.legacy@deo.gov.bb" className='text-blue-200 text-sm hover:underline'>stjoseph.legacy@deo.gov.bb</a>
              <p className='text-blue-200 text-sm'>(246) 123-4567</p>
            </div>
            <div>
              <div className='flex items-center gap-4 mt-3'>
                <a href="https://www.instagram.com/dem.barbados" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                  <Image src="/icons/instagram-icon.svg" alt="" height={35} width={35}/>
                </a>
                <a href="https://www.facebook.com/dem246/" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                  <FacebookIcon color="#FFFFFF" height={30} width={30}/>
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Get Involved + Stay Connected */}
          <div className='flex flex-col-reverse items-start lg:items-center gap-[40px] lg:ml-[25px] ml-0'>
            {/* Get Involved */}
            <div className='flex flex-col gap-4 w-full'>
              <h3 className='font-bold text-xl lg:text-center'>Get Involved</h3>
              <ul className='space-y-2 text-blue-200 lg:text-center'>
                <li>
                  <Link
                    href="https://forms.gle/DKHMGcmQttoztAgr9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='hover:text-[#feb47b] transition-colors'
                  >
                    Volunteer Sign-up
                  </Link>
                </li>
              </ul>
              <button className='relative lg:self-center cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[180px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                {/* <a
                href="/donate" 
                className='mt-2 bg-[linear-gradient(to_right,#ff7e5f,#feb47b)] text-white font-bold py-3 rounded-full text-center shadow-lg'
              > */}
                <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px]'>
                  <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                    Contribute
                  </span>
                  <Image src="/icons/handheart-icon.svg" alt="Loading..." width={18} height={18} className='invert' />
                </div>
              {/* </a> */}
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
              {submissionMessage && (
                <p className={`text-sm mt-2 lg:text-center font-bold w-full ${submissionMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                  {submissionMessage}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className='flex flex-col gap-4 text-left lg:text-right'>
            <h3 className='font-bold text-xl'>Navigate</h3>
            <ul className='space-y-2 text-blue-200'>
              <li><a href="/about" className='hover:text-[#feb47b] transition-colors'>About the Project</a></li>
              <li><a href="/map" className='hover:text-[#feb47b] transition-colors'>Virtual Map</a></li>
              <li><a href="/tours" className='hover:text-[#feb47b] transition-colors'>Tours</a></li>
              {/* <li><a href="/metrics" className='hover:text-[#feb47b] transition-colors'>Project Metrics</a></li> */}
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