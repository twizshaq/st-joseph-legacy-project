"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Import your components
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { GalleryModal } from "@/app/components/GalleryModal";

// Import your icons and data
import vrIcon from "@/public/icons/vr-icon.svg";
import camIcon from "@/public/icons/camera-icon.svg";
import ticketIcon from "@/public/icons/ticket-icon.svg";
import clockIcon from "@/public/icons/clock-icon.svg";
import photoIcon from "@/public/icons/photos-icon.svg";
import arrowIcon from "@/public/icons/arrow-icon.svg";
import PenIcon from "@/public/icons/pen-icon";
import { stories } from '@/public/data/stories';
import { TbBulb } from "react-icons/tb";
import { TiStarFullOutline } from "react-icons/ti";

const SoupBowl = () => {
  // --- 1. ALL STATE AND REF HOOKS ARE GROUPED AT THE TOP ---
  const [user, setUser] = useState<User | null>(null);
  const [isSafetyOpen, setIsSafetyOpen] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Modal states
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isAuthAlertOpen, setAuthAlertOpen] = useState(false);

  // Quiz states
  const [quizStage, setQuizStage] = useState<'start' | 'question' | 'result'>('start');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Interaction states
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // --- 2. ALL CALLBACKS AND MEMOIZED FUNCTIONS ---
  const handleAlertClose = useCallback(() => {
    setAuthAlertOpen(false);
  }, []);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('id', { ascending: false });
    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
  }, []);

  const galleryItems = [
{ type: 'image', src: 'https://i.pinimg.com/736x/ac/c5/16/acc5165e07eba2b8db85c8a7bcb2eda6.jpg' },
{ type: 'video', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4' },
{ type: 'photo_360', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/Andromeda_20250920_110344_00_008.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/8f/bb/62/8fbb625e1c77a0d60ab0477d0551b000.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/e8/61/55/e86155c8a8e27a4eed5df56b1b0f915f.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/b2/1a/4e/b21a4edd98d5deeae826a459aeeb1b26.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/a5/71/41/a57141ad568104a6b1e49acedddd1eca.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/d8/51/26/d85126e7178f37e0f8cb5a73d495707d.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/3f/82/ac/3f82ac4cde04c3143ed4f2580d64820c.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/4c/20/00/4c20006b09ffc0b4f31278d3009f7390.jpg' },
{ type: 'image', src: 'https://i.pinimg.com/736x/ee/f1/ed/eef1ed5ee44a821046bcd209a3e1fbcc.jpg' },
];

  const goToNext = useCallback(() => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length]);

  // --- 3. ALL USEEFFECT HOOKS ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    document.body.style.overflow = galleryOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [galleryOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!galleryOpen) return;
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'ArrowLeft') goToPrevious();
      if (event.key === 'Escape') setGalleryOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryOpen, goToNext, goToPrevious]);

  // --- 4. REGULAR FUNCTIONS AND DERIVED STATE/CONSTANTS ---
  const handleWriteReviewClick = () => {
    if (user) {
      setReviewModalOpen(true);
    } else {
      setAuthAlertOpen(true);
    }
  };

  const quizData = [
  {
  q: "Best time to surf here?",
  options: ["Winter (Nov-Apr)", "Summer (Jun-Aug)"],
  answer: 0
  },
  {
  q: "Which coast is this?",
  options: ["West Coast", "East Coast"],
  answer: 1
  }
];

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === quizData[qIndex].answer) {
    setScore(s => s + 1);
    }
    if (qIndex + 1 < quizData.length) {
      setQIndex(i => i + 1);
    } else {
      setQuizStage('result');
  }};

  const restartQuiz = () => {
    setScore(0);
    setQIndex(0);
    setQuizStage('start');
  };

  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const pageCount = Math.ceil(reviews.length / reviewsPerPage);
  const pageNumbers = pageCount > 1 ? Array.from({ length: pageCount }, (_, i) => i + 1) : [];

  // --- NEARBY SITES LOGIC ---
  const [nearbySites, setNearbySites] = useState<any[]>([]);

  useEffect(() => {
    const fetchNearby = async () => {
      // 1. Define Current Site Coordinates (Soup Bowl - based on your screenshot ID:1)
      const currentLat = 13.214743;
      const currentLng = -59.523950;

      // 2. Fetch sites (excluding the current one by ID or logic)
      const { data, error } = await supabase
        .from('location_pins')
        .select('*')
        .neq('id', 1); // Assuming ID 1 is Soup Bowl. Remove this line if IDs differ.

      if (error) {
        console.error('Error fetching sites:', error);
        return;
      }

      if (data) {
        // 3. Haversine Formula to calculate distance in km
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Radius of the earth in km
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        // 4. Map distance, Map DB columns to Card props, Sort, and Slice
        const sortedSites = data
          .filter(site => site.latitude && site.longitude) // Ensure coords exist
          .map((site) => ({
            ...site,
            distance: calculateDistance(currentLat, currentLng, site.latitude, site.longitude),
            // MAPPING: Mapping your DB columns (screenshot) to the styling variables
            image_url: site.pointimage, 
            // Note: Your screenshot didn't show 'name' or 'slug' columns. 
            // If they don't exist, replace 'site.name' with 'site.description' or add the columns to Supabase.
            name: site.name || 'Unknown Site', 
            slug: site.slug || '#',
            description: site.description
          }))
          .sort((a, b) => a.distance - b.distance) // Sort closest to furthest
          .slice(0, 5); // Limit to top 5 closest sites

        setNearbySites(sortedSites);
      }
    };

    fetchNearby();
  }, []);

  return (
    <div className='flex flex-col items-center self-center min-h-[100dvh] text-black bg-red-500/0 overflow-hidden'>
      <div className="relative flex flex-col justify-center items-center w-[100vw] max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">

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

      <div className='z-0 absolute w-[1400px] max-w-[90vw] bottom-[45px]'>
        <p className="font-black text-[3rem] max-md:text-[2rem] text-start leading-[1.2] z-10 mb-[10px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]">
        Soup Bowl
        </p>
        <p className="text-[1rem] max-md:text-[1rem] text-start leading-[1.2] z-10 text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </p>


            {/* <div className='absolute flex gap-[15px] left-[0] bottom-[-80px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-row gap-6'>
                <button className="flex items-center py-[13px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={vrIcon} alt="" height={30} className=''/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Explore in AR</p>
                </button>
              </div>
            </div> */}
      </div>
      {/* Foreground Content */}
      {/* <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">
        Soup Bowl
      </p> */}

        {/* Dots to show how long the image or video will last */}
        {/* <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
          <div className='bg-[#fff] rounded-full h-[7px] w-[15px]'></div>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
        </div> */}

      {/* <div className='absolute left-[0] bottom-[-35px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <button className="flex items-center py-[13px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={vrIcon} alt="" height={30} className=''/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Explore in AR</p>
                </button>
              </div>
            </div> */}
      </div>

      {/* --- DIVIDER --- */}
      <div className='bg-[#E0E0E0] w-[691px] max-w-[80vw] h-[2px] max-sm:mt-[60px] mt-[85px] rounded-full'></div>

      <div className='relative mt-[60px] w-[1400px] max-w-[90vw] flex flex-col'>
        
        

        {/* Section Title */}
        <p className='relative z-10 font-bold text-[2rem] text-start mb-8'>Quick Facts</p>
        
        {/* Cards Container - Using Grid for better alignment */}
        <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>

          {/* Card 1: Best Time */}
          <div className='bg-[#FF8400]/10 backdrop-blur-[3px] rounded-[42px] p-[3px] active:scale-[.992] shadow-[0px_0px_10px_rgba(0,0,0,0.08)] cursor-pointer'>
            
            {/* Added 'group' here so the children know when this is hovered */}
            <div className='group relative flex flex-row items-center gap-5 p-4 bg-white/80 rounded-[40px] overflow-hidden transition-all duration-300'>

              {/* Pattern Background Layer */}
              <div 
                className="absolute inset-0 opacity-[.1] z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.3] group-active:opacity-[0.3]" 
                style={{ 
                  backgroundImage: 'radial-gradient(#FF8F00 1px, transparent 1px)', 
                  backgroundSize: '14px 14px', 
                }} 
              />

              {/* Icon Container: Changed 'hover:scale' to 'group-hover:scale' so it pops when you hover anywhere on the card */}
              <div className='relative z-10 flex items-center justify-center w-[65px] h-[65px] bg-orange-100 rounded-[23px] group-hover:scale-110 transition-transform duration-300'>
                <span className='group-hover:rotate-12 group-active:rotate-12 transition-transform duration-300'>
                  <Image src={clockIcon} alt="Clock" height={28} className='opacity-80' />
                </span>
              </div>

              <div className='relative z-10 flex flex-col'>
                <p className='text-[0.85rem] font-bold uppercase tracking-wider text-orange-600/70 mb-0.5'>Best Time</p>
                <p className='text-[1.05rem] font-[600] text-slate-800 leading-tight'>Sunrise & <br/>Late Afternoon</p>
              </div>
            </div>
          </div>

          {/* Card 2: Photo Spots */}
          <div className='bg-[#2563EB]/10 backdrop-blur-[3px] rounded-[42px] p-[3px] active:scale-[.992] shadow-[0px_0px_20px_rgba(0,0,0,.08)] cursor-pointer'>
            <div className='group relative flex flex-row items-center gap-5 p-4 bg-white/80 rounded-[40px] overflow-hidden transition-all duration-300'>

              {/* Pattern Background Layer */}
              <div 
                className="absolute inset-0 opacity-[.1] z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.3] group-active:opacity-[0.3]" 
                style={{ 
                  backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', 
                  backgroundSize: '14px 14px', 
                }} 
              />
              
              <div className='flex items-center justify-center z-[1] w-[65px] h-[65px] bg-blue-100 rounded-[23px] group-hover:scale-110 transition-transform duration-300'>
                <span className='group-hover:rotate-12 group-active:rotate-[-12deg] transition-transform duration-300'>
                  <Image src={camIcon} alt="Camera" height={28} className='opacity-80' />
                </span>
              </div>
              <div className='relative z-10 flex flex-col'>
                <p className='text-[0.85rem] font-bold uppercase tracking-wider text-blue-600/70 mb-0.5'>Photo Spots</p>
                <p className='text-[1.05rem] font-[600] text-slate-800 leading-tight'>Soup Bowl • <br/>Bathsheba Rock</p>
              </div>
            </div>
          </div>

          {/* Card 3: Entry Fee */}
          <div className='bg-[#15803d]/10 backdrop-blur-[3px] rounded-[42px] p-[3px] overflow-hidden active:scale-[.992] shadow-[0px_0px_20px_rgba(0,0,0,.09)] cursor-pointer'>
            <div className='group relative flex flex-row items-center gap-5 p-4 bg-white/80 rounded-[40px] overflow-hidden transition-all duration-300'>

              {/* Pattern Background Layer */}
              <div 
                className="absolute inset-0 opacity-[.1] z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.3] group-active:opacity-[0.3]" 
                style={{ 
                  backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', 
                  backgroundSize: '14px 14px', 
                }} 
              />


              <div className='flex items-center justify-center z-[1] w-[65px] h-[65px] bg-green-100 rounded-[23px] group-hover:scale-110 transition-transform duration-300'>
                <span className='group-hover:rotate-12 group-active:rotate-12 transition-transform duration-300'>
                  <Image src={ticketIcon} alt="Ticket" height={28} className='opacity-80' />
                </span>
              </div>
              <div className='flex flex-col'>
                <p className='text-[0.85rem] font-bold uppercase tracking-wider text-green-600/70 mb-0.5'>Entry Fee</p>
                <p className='text-[1.05rem] font-[600] text-slate-800 leading-tight'>Free <br/>Public Access</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className='flex justify-between w-[1400px] max-w-[90vw] flex-wrap gap-[50px] mt-[80px] mb-[80px] bg-blue-500/0'>
        <div className='flex flex-col max-w-[740px] bg-red-500/0'>
          <p className='font-bold text-[2rem]'>About</p>
          <p>Bathsheba sits along Barbados’ wild Atlantic east coast, framed by dramatic rock formations shaped by centuries of relentless waves and wind. The coastline is famous for its natural rock pools, formed between coral boulders at low tide, creating sheltered pockets of calm amidst the roaring surf. Beyond its striking scenery, Bathsheba is a working fishing community where locals gather for weekend picnics, seaside cricket matches, and casual “liming” under the shade of sea grape trees. On most days, you’ll see brightly painted fishing boats pulled up on the sand, drying nets draped over their sides.</p>
          <br /><br />
          <p className='font-bold text-[2rem]'>History & Cultural Significance</p>
          <p>The name “Bathsheba” is rooted in local lore — some say it recalls the biblical Bathsheba, bathing in beauty, while others link it to the area’s healing mineral-rich waters once believed to have therapeutic benefits. For generations, Bathsheba has been a cultural hub for St. Joseph parish, serving as a meeting place for fishermen, artisans, and surfers alike. The famous Soup Bowl reef break has drawn both local legends and world-class surfers, putting this small village on the international surf map.
          <br /><br />
          Bathsheba’s surroundings form part of the Scotland District, a geologically unique area in the Caribbean where ancient sedimentary rock has been uplifted and eroded into steep hillsides. This fragile landscape has inspired local conservation efforts, with the community actively involved in preserving the area’s heritage and natural beauty. Cultural events, art festivals, and surf competitions here celebrate not just sport, but the deep connection between people, land, and sea.</p>
        </div>


      <div className='flex flex-col max-md:items-center max-md:justify-center md:bg-red-500/0 max-md:w-[90vw]'>
        {/* SAFETY / DISASTER PREPAREDNESS SECTION */}
        {/* <div className='w-full h-fit rounded-[38px] p-[3px] bg-amber-500/10 shadow-[0_0px_30px_rgb(0,0,0,0.2)] overflow-hidden'> */}
        <div className='w-[450px] max-w-full max-sm:w-full mt-4 relative z-10'>
          {/* Decorative blurred blob behind the card for depth */}
          <div className='absolute top-10 left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -z-10 pointer-events-none'></div>

          <div className='rounded-[35px] active:scale-[.99] border border-amber-500/30 bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-[0_0px_20px_rgb(0,0,0,.1)]'>
            
            {/* Header button */}
            <button
              type='button'
              onClick={() => setIsSafetyOpen(v => !v)}
              aria-expanded={isSafetyOpen}
              aria-controls='safety-panel'
              className='group w-full flex items-center justify-between gap-3 px-6 py-5 cursor-pointer relative overflow-hidden'
            >
              {/* GRAPHIC 1: Subtle Hazard Stripe Background Pattern */}
              <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,#f59e0b_25%,transparent_25%,transparent_50%,#f59e0b_50%,#f59e0b_75%,transparent_75%,transparent)] bg-[length:20px_20px] pointer-events-none"></div>
              
              {/* GRAPHIC 2: Soft Gradient Glow behind content */}
              <div className="absolute left-0 top-0 w-1/3 h-full blur-[20px] bg-gradient-to-r from-amber-50/80 to-transparent pointer-events-none"></div>

              <div className='flex items-center gap-4 relative z-10'>
                {/* Animated Safety Icon */}
                <div className='relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100/0 text-amber-600 text-[1.5rem]  transition-colors duration-300'>
                  {/* Icon */}
                  <svg width='30' height='30' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'/>
                            <path d='M12 9v4' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'/>
                            <path d='M12 17h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round'/>
                        </svg>
                  {/* Pulse Ring */}
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20 animate-ping group-hover:opacity-40"></span>
                </div>
                
                <div className="flex flex-col items-start">
                    <span className='font-bold text-[1.15rem] text-slate-800 leading-tight'>Disaster Ready</span>
                    <span className='text-[0.8rem] text-slate-400 font-medium'>Safety Guidelines</span>
                </div>
              </div>

              {/* Arrow with smooth rotation */}
              <span className={`transform transition-transform duration-300 ease-in-out relative z-10 ${isSafetyOpen ? 'rotate-180' : 'rotate-0'}`}>
                <Image src={arrowIcon} alt='Back Icon' height={28} className='opacity-60 invert'/>
              </span>
            </button>

            {/* GRAPHIC 3: Gradient Separator Line */}
            <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-amber-200 to-transparent transition-opacity duration-300 ${isSafetyOpen ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Collapsible content */}
            <div
              id='safety-panel'
              className={` 
                ${isSafetyOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} 
                overflow-hidden bg-white relative
              `}
            >
              {/* GRAPHIC 4: Large Watermark/Illustration in background */}
              <svg className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-50 pointer-events-none opacity-60" viewBox="0 0 200 200" fill="currentColor">
                <path d="M45.7,166.9c-2.4-9.5-6.2-22.6-8.2-31.5C31.2,107.8,28.8,78.2,46.5,50c4.5-7.1,10.6-13.3,18.4-17.2 c17.6-8.9,39.4-6.3,55.4,3.5c16.9,10.4,28.7,27.5,35.6,46.3c10.1,27.3,7.6,58.8-9.4,83.1c-6.6,9.5-15.5,17.4-26.2,22.1 c-17.6,7.7-38.3,6-55.9-1.9C57.7,183.1,51.3,176.4,45.7,166.9z" />
              </svg>

              <div className='px-6 pb-6 pt-4 relative z-10'>
                <div className="">
                    <p className='text-[0.95rem] leading-[1.6] text-slate-600 mb-4'>
                    East coast seas are unpredictable. Avoid swimming during high swells and keep clear of cliff edges. Monitor weather advisories during hurricane season (June–Nov).
                    </p>
                    
                    <ul className='space-y-3 mb-5'>
                    <li className="flex gap-3 items-start">
                        <span className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                        <span className="text-[0.9rem] text-slate-500 font-medium">Use designated zones for photography; rocks are slippery.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                        <span className="text-[0.9rem] text-slate-500 font-medium">Park vehicles in marked areas away from soft shoulders.</span>
                    </li>
                    </ul>

                    {/* Alert Box */}
                    <div className='relative flex items-start gap-3 mt-4 bg-amber-50 border border-amber-100 p-3 rounded-[25px] overflow-hidden'>
                    {/* GRAPHIC 5: Tiny dot pattern for "Ticket/Paper" feel */}
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#fbbf24 0.5px, transparent 0.5px)', backgroundSize: '8px 8px' }}></div>
                    
                    <div className="bg-white p-1.5 rounded-full shadow-sm text-amber-500 mt-0.5 relative z-10 ring-1 ring-amber-100">
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'/>
                            <path d='M12 9v4' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'/>
                            <path d='M12 17h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round'/>
                        </svg>
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className='font-bold text-[0.85rem] text-amber-900'>Emergency Advisory</span>
                        <span className="text-[0.85rem] text-amber-800/70 leading-tight mt-1">
                            • 211 for Police <br /> • 511 for Ambulance <br /> • 311 for Fire
                        </span>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* IN-PLACE QUIZ SECTION */}
        {/* TERRAIN/MAP THEMED QUIZ SECTION */}
        <div className='shadow-[0px_0px_20px_rgba(0,0,0,0.4)] mt-[40px] rounded-[43px] w-[450px] max-w-[90vw] mb-[0px]'>
          
          {/* INNER DIV: Holds the mask, background, and padding (The visual border) */}
          <div className='w-full h-full rounded-[43px] p-[3px] [mask-image:radial-gradient(white,black)] bg-gradient-to-br from-indigo-300 via-blue-800/95 to-blue-300 overflow-hidden'>
          <div 
            className={`
              w-[450px] max-w-full max-sm:w-full rounded-[40px]
              flex flex-col justify-center items-center relative overflow-hidden
              transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
              bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-800
              ${quizStage === 'start' ? 'h-[200px]' : 'min-h-[240px] py-8'}
            `}
          >
            {/* --- GRAPHICS LAYER --- */}
            
            {/* 1. Technical Map Grid (Background Texture) */}
            <div className="absolute inset-0 opacity-[0.08]" 
              style={{ 
                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }} 
            />

            {/* 2. Glow effect (Sun/Highlight) */}
            <div className="absolute -top-[50%] left-[20%] w-[300px] h-[300px] bg-indigo-300/20 blur-[90px] rounded-full pointer-events-none" />
            
            {/* 3. TERRAIN / HILLS SILHOUETTE (Replacing Waves) */}
            <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[40px]">
              <svg className="absolute bottom-[-5px] w-full min-h-[140px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  {/* Back Hill (Depth) */}
                  <path 
                    fill="rgba(0, 0, 0, 0.15)" 
                    d="M0,280 C240,280 480,180 720,180 C960,180 1200,240 1440,240 V320 H0 Z"
                  ></path>
                  {/* Front Hill (Foreground) */}
                  <path 
                    fill="rgba(255, 255, 255, 0.08)" 
                    d="M0,320 L0,220 C250,260 500,340 750,260 C1000,180 1250,220 1440,160 V320 Z"
                  ></path>
              </svg>
            </div>

            {/* --- STAGE: START --- */}
            {quizStage === 'start' && (
              <div className="flex flex-col items-center justify-center w-full z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Explorer Badge */}
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full mb-3 border border-white/20 shadow-[0px_0px_5px_rgba(0,0,0,0.2)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Site Explorer
                  </span>
                </div>

                {/* Main Title */}
                <h3 className="text-white font-black text-2xl leading-none mb-1 text-center drop-shadow-lg tracking-tight">
                  Knowledge Check
                </h3>
                
                {/* Subtitle / Instruction */}
                <p className="text-blue-100 text-sm font-medium mb-5 text-center max-w-[85%]">
                  Complete <span className="text-white font-bold border-b-2 border-white/20">2 questions</span> on the local geography.
                </p>

                {/* Start Button */}
                <button 
                  onClick={() => setQuizStage('question')}
                  className="group cursor-pointer relative bg-white text-indigo-700 rounded-full py-3 pl-5 pr-6 font-bold text-[1rem] shadow-[0_0px_15px_rgba(0,0,0,0.2)] flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
                >
                  <span>Begin Quest</span>
                  <div className="text-[1.3rem]">
                      {/* Arrow Icon */}
                      <TbBulb/>
                  </div>
                </button>
              </div>
            )}

            {/* --- STAGE: QUESTION --- */}
            {quizStage === 'question' && (
              <div  className="w-full px-6 z-10 flex flex-col items-center gap-6 animate-in slide-in-from-right-8 fade-in duration-500">
                
                <div className="flex flex-col items-center gap-2">
                  {/* Progress Indicators (Bars instead of dots for technical feel) */}
                  {/* <div className="flex gap-1.5 mb-1">
                    {quizData.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === qIndex ? 'w-10 bg-white shadow-[0_0_10px_white]' : 'w-4 bg-white/30'}`} />
                    ))}
                  </div> */}
                  <p className="text-white font-bold text-xl md:text-2xl text-center leading-tight drop-shadow-md">
                    {quizData[qIndex].q}
                  </p>
                </div>

                {/* Options */}
                <div className="flex w-full gap-3">
                  {quizData[qIndex].options.map((opt, i) => (
                    <div key={i} className='bg-white/5 active:scale-[.98] backdrop-blur-[3px] min-h-[70px] rounded-[30px] w-[100%] px-auto p-[2.5px] shadow-[0_0px_15px_rgba(0,0,0,0.1)] cursor-pointer'>
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="
                        flex-1 py-4 px-3 
                        bg-indigo-900/50 cursor-pointer h-[100%] w-[100%] hover:bg-white text-white hover:text-indigo-800
                        rounded-[27px] font-bold text-sm leading-tight
                        transition-all duration-200
                      "
                    >
                      {opt}
                    </button>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-[20px] flex gap-1.5">
                    {quizData.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === qIndex ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-4 bg-white/30'}`} />
                    ))}
                  </div>
              </div>
            )}

            {/* --- STAGE: RESULT --- */}
          {quizStage === 'result' && (
            <div className="flex flex-col items-center justify-center w-full px-6 mt-[-30px] z-10 animate-in zoom-in fade-in duration-500">
               
              <div className='flex items-center gap-[20px]'>
               {/* Rank / Badge Icon */}
              <div className="relative mb-3">
                <div className={`rotate-6 mb-[4px] rounded-[23px] w-[100%] px-auto p-[2.5px] shadow-[0px_0px_30px_rgba(0,0,0,0)] ${score > 0 ? 'bg-gradient-to-br from-yellow-500 via-amber-500/65 to-amber-300' : 'bg-gradient-to-br from-gray-300 via-gray-500/65 to-gray-400'}`}>
                  <div className={`
                    w-13 h-13 rounded-[20px] flex items-center justify-center text-[1.3rem]
                    ${score > 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
                  `}>
                      {score === quizData.length ? '🏆' : score > 0 ? '✨' : '☁️'}
                  </div>
                </div>
                  {/* Glowing Aura behind badge */}
                  {score > 0 && <div className="absolute inset-0 bg-yellow-400/60 blur-xl -z-10 animate-pulse"></div>}
               </div>

                <div className="flex flex-col">
                  <h3 className="text-white font-black text-2xl tracking-tight uppercase drop-shadow-md">
                    {score === quizData.length ? 'Quest Complete!' : 'Completed'}
                  </h3>
                  <p className="text-indigo-100 text-sm font-medium mb-5 opacity-90">
                    You got <span className="text-white font-bold">{score}</span> out of {quizData.length} correct.
                  </p>
                </div>
              </div>

                {/* Points Card */}
              <div className='bg-white/10 backdrop-blur-[3px] active:scale-[.98] rounded-[28px] w-[100%] px-auto p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] cursor-pointer'>
                <div className="w-full bg-white/10 rounded-[25px] p-4 flex flex-row items-center justify-between shadow-[0px_0px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group">
                   {/* Shine effect passing through */}
                   <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                   
                   <div className="flex flex-col items-start">
                     <span className="text-indigo-200 text-[10px] font-[700] uppercase tracking-widest">Total Earned</span>
                     <span className="text-white text-xs opacity-70 font-[500]">Experience</span>
                   </div>

                   <div className="flex items-center gap-1">
                     <span className="text-4xl font-black text-white drop-shadow-sm leading-none">
                       +{score * 50}
                     </span>
                     <span className="text-[10px] font-bold text-yellow-900 Scottish bg-yellow-400 px-1.5 py-0.5 rounded-[8px] mb-auto mt-1">
                       PTS
                     </span>
                   </div>
                </div>
              </div>

                {/* Status Footer */}
                <div className="mt-4 mb-[-40px] flex items-center justify-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Result Recorded
                </div>
              </div>
            // </div>
          )}
          </div>
        </div>
      </div>
      </div>


      </div>

      <div className='gap-[50px] mb-[80px] bg-blue-500/0 self-center w-[1400px] max-w-[90vw]'>
        <div className='flex flex-col w-full bg-red-500/0'>
          <p className='font-bold text-[2rem] mb-8'>Local Stories</p>
          
          <div className='flex flex-wrap gap-x-20 gap-y-12'>
            {stories.map((story,index)=>(
            <div className='flex flex-col gap-5' key={index}>
              <p className='font-semibold text-xl'>{story.title}</p>
                <audio controls>
                  <source src={story.src} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
            </div>
            ))}
          </div>
        </div>
        </div>

        

      <div className='mb-[180px]'>
        <div className='flex flex-col text-center mb-[50px]'>
          <p className='font-bold text-[1.75rem]'>Photo & Video Gallery</p>
          <p className='text-[#666]'>A glimpse of the coastline, surf, and tidal pools</p>
        </div>
        <div className='relative flex flex-row justify-center items-end bg-green-500/0 min-h-[360px] sm:min-h-[420px] overflow-visible'>
          {/* Blurred color blobs behind the cards */}
          <div aria-hidden className='pointer-events-none absolute inset-0 z-0'>
            <div className='absolute left-[5%] bottom-[0px] w-[320px] h-[320px] rounded-full bg-[#60A5FA]/40 blur-[90px]'></div>
            {/* <div className='absolute right-[6%] bottom-[10px] w-[300px] h-[300px] rounded-full bg-[#F472B6]/40 blur-[90px]'></div> */}
            {/* <div className='absolute left-1/2 -translate-x-1/2 top-[-10px] w-[360px] h-[360px] rounded-full bg-[#34D399]/35 blur-[100px]'></div> */}
            {/* <div className='absolute left-[22%] top-[0px] w-[220px] h-[220px] rounded-full bg-[#F59E0B]/35 blur-[80px]'></div> */}
          </div>

          {/* Card cluster (scaled down on small screens to keep spacing visually consistent) */}
          <div className='relative w-full flex justify-center items-end z-10 origin-bottom max-sm:scale-[0.76]'>
            <div className='bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-20 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute right-[220px] bottom-[80px] rotate-[7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute left-[220px] bottom-[80px] rotate-[-7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute left-[400px] bottom-[0px] rotate-[7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute right-[400px] bottom-[0px] rotate-[-7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
          </div>
        </div>
        <div className='relative bg-green-500 flex flex-col justify-center items-center z-30'>
          <div className="w-[100vw] absolute flex justify-center">
                        <div
                          className={`
                            bg-blue-500/0 bottom-[-100px]
                            absolute w-[1100px]
                            backdrop-blur-[15px] [mask-image:linear-gradient(to_top,black_40%,transparent)] opacity-100 h-[500px]
                          `}
                        ></div>
                      </div>

                  <Portal>
                    {galleryOpen && (
                      <GalleryModal 
                        items={galleryItems} 
                        initialIndex={selectedIndex} 
                        onClose={() => setGalleryOpen(false)} 
                      />
                    )}
                  </Portal>
            <div className='absolute bottom-[-20px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <button onClick={() => setGalleryOpen(true)} className="cursor-pointer flex items-center py-[10px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={photoIcon} alt="" height={30} className=''/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Open Gallery</p>
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* --- TRAVELER EXPERIENCES SECTION --- */}
      <div className='relative flex flex-col items-center w-[1400px] max-w-[90vw] mb-[120px]'>
       
        {/* Header: Title + Add Review Button */}
        <div className='w-full flex flex-col md:flex-row justify-between max-sm:items-center items-end md:items-center gap-6 mb-5 z-10'>
          <div className='flex flex-col gap-1 max-md:self-start max-sm:self-center'>
            <p className='font-bold text-[2rem] leading-tight max-sm:text-center text-slate-800'>Traveler Experiences</p>
            <p className='text-slate-500 font-medium max-sm:text-center'>See what others are saying about the surf and scenery.</p>
          </div>
         
          <div onClick={handleWriteReviewClick} className='cursor-pointer rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-[.98]'>
                      <button className='cursor-pointer'>
                        <div className='flex gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[10px]'>
                          <span><PenIcon color='#fff'/></span>
                          <p className='text-white font-bold'>Add a Review</p>
                        </div>
                      </button>
                    </div>
        </div>
        {/* Scrolling Cards Container */}
        <div className='relative w-full overflow-visible z-10'>
         
          {/* Decorative Blur behind cards */}
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full' />
          {reviews.length === 0 ? (
          // If there are no reviews, show this message
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8 rounded-[40px]">
          <span className="text-4xl mb-3">🧐</span>
          <p className="text-lg font-bold text-slate-700">No Reviews Yet</p>
          <p className="text-slate-500">Be the first to share your experience!</p>
        </div>
      ) : (
        // Otherwise, show the list of reviews
        <div className='flex overflow-x-auto pb-12 pt-4 gap-6 w-full px-2 scroll-smooth snap-x mandatory hide-scrollbar'>
          {currentReviews.map((review) => (
            <ReviewCard key={review.id} experience={{
              username: review.reviewer_name,
              description: review.review_text,
              upload_date: new Date(review.created_at).getTime()
            }} />
          ))}
          </div>
          )}
        </div>

        {/* Custom Pagination Bar */}
        <div className='flex flex-wrap justify-center gap-3 mt-4'>
          
          {/* Previous Arrow Button */}
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Page Number Buttons */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] font-bold rounded-2xl transition-all ${
                currentPage === num 
                  ? 'bg-[#007BFF] text-white shadow-[0px_0px_15px_rgba(0,0,0,0.2)] hover:scale-[1.05]' 
                  : 'bg-white/80 border border-slate-200/80 text-slate-500 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:text-blue-600 hover:scale-[1.05]'
              }`}
            >
              {num}
            </button>
          ))}
          
          {/* Next Arrow Button */}
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onReviewSubmit={fetchReviews}
          user={user} 
        />
        <AuthAlertModal
          isOpen={isAuthAlertOpen}
          onClose={() => setAuthAlertOpen(false)}
        />
      </div>

      <div className='w-[100vw]'>
        <div className='px-[5.4vw] mb-[10px]'>
          <p className='font-bold text-[1.75rem]'>Nearby Sites</p>
          <p className='text-[#666]'>Plan your route across St. Joseph</p>
        </div>
        
        <div className="flex flex-col w-full overflow-x-auto hide-scrollbar">
          <div className="flex flex-row items-center py-[30px] bg-blue-500/0 gap-[30px] w-[100vw] overflow-y-hidden px-[5.4vw]">
            
            {/* Dynamic Map of Nearby Sites */}
            {nearbySites.map((card) => (
              <div key={card.id} className="relative flex-shrink-0 group cursor-pointer">
                {/* Background / shadow layer */}
                <div
                  className="absolute bg-cover bg-center min-h-[280px] max-h-[280px] min-w-[260px] max-w-[260px] rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                  style={{ backgroundImage: `url(${card.image_url})` }}
                >
                  <div className="rotate-[180deg] self-end">
                    <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
                  </div>
                </div>

                {/* Main card (clickable) */}
                <div
                  className="relative bg-cover bg-center min-h-[280px] max-h-[280px] min-w-[260px] max-w-[260px] rounded-[54px] flex flex-col justify-end overflow-hidden z-10 transition-transform duration-300 group-hover:scale-[1.01]"
                  style={{ backgroundImage: `url(${card.image_url})` }}
                >
                  <Link href={`/${card.slug}`} passHref>
                    <div className="absolute inset-0 bg-black/30 rounded-[50px]" />
                    <div className="relative z-30 text-center mb-[20px] px-[10px]">
                      <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                        <p className="font-bold text-[1.3rem] mb-[2px] leading-tight">{card.name}</p>
                        <p className="text-[0.9rem] px-[5px] line-clamp-2">{card.description}</p>
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
                    <div className="bg-blue-500/0 absolute w-[270px] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] opacity-100 h-[150px]"></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty State if no sites found */}
            {nearbySites.length === 0 && (
               <div className="text-gray-400 italic p-5">Loading nearby locations...</div>
            )}

          </div>
        </div>
      </div>
      
      {/* <p className='font-bold text-[1.5rem]'>Soup Bowl Page</p> */}
    </div>
  );
};

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  // This creates the portal, rendering the children into the document body.
  return ReactDOM.createPortal(children, document.body);
};


export default SoupBowl;