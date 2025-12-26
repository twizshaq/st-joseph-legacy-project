'use client'

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from '@/lib/supabase/client';
import ArrowIcon from '@/public/icons/arrow-icon';
import houseIcon from '@/public/icons/house-icon.svg';
import Footer from "@/app/components/FooterModal"
import TourDetailsSkeleton from "@/app/components/tours/TourDetailsSkeleton";

// Imported Refactored Components
import TourGallery from "@/app/components/tours/TourGallery";
import BookingForm from "@/app/components/tours/BookingForm";
import TourReviewsSection from "@/app/components/tours/TourReviewsSection";
import { Tour } from "@/app/types/tours";

export default function ToursPage() {
  const supabase = createClient(); 
  
  // State
  const [userSession, setUserSession] = useState<any>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 1. Auth Effect
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
    };
    initSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUserSession(session));
    return () => subscription.unsubscribe();
  }, [supabase]);

  // 2. Fetch Tours
  useEffect(() => {
    const loadTours = async () => {
      const { data } = await supabase.from('tours').select('*, stops(*), images(*), reviews(*)');
      if (data) {
        setTours(data);
        if (data.length > 0) setSelectedTour(data[0]);
      }
    };
    loadTours();
  }, [supabase]);

  const houseRules = [
    {
      icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, 
      title: "Safety First",
      description: "Cliffs can be unstable. Please stay behind designated railings and follow the guide's path."
    },
    {
      icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, 
      title: "Punctuality",
      description: "Tours depart promptly. Please arrive at the meeting point 15 minutes before your slot."
    },
    {
      icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />,
      title: "Eco-Friendly",
      description: "Help us preserve St. Joseph. Please carry out all trash and respect the local wildlife."
    },
    {
      icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, // Your original SVG
      title: "Community",
      description: "Respect the local residents. Keep noise levels moderate when passing through villages."
    }
  ];

  return (
    <div className="flex flex-col items-center overflow-x-hidden text-black" onClick={(e) => {
      if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) setIsPopupOpen(false);
    }}>
      
      {/* --- HERO SECTION --- */}
<section className="relative w-full overflow-hidden">
  {/* Subtlest Ambient Light - Apple-style 'natural' glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,123,255,0.03)_0%,rgba(250,250,250,0)_100%)] pointer-events-none" />

  <div className="relative w-full max-w-[1400px] px-6 mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32">
    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
      
      {/* TEXT CONTENT */}
      <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1 text-center lg:text-left">
        <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.03] mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Exclusive Experiences</span>
        </div>
        
        <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-bold leading-[0.95] tracking-tighter text-black">
          St. Joseph&apos;s <br />
          <span className="text-black/40">Hidden Wonders.</span>
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-black/60 leading-relaxed max-w-[500px] mx-auto lg:mx-0">
          Journey through the rugged beauty of Barbados. Guided expeditions through secret trails, coastal cliffs, and forgotten history.
        </p>

        {/* CTA Area */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsPopupOpen(true); }}
            className="group relative flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold transition-all hover:bg-black/90 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Select Your Journey</span>
            <ArrowIcon className="relative z-10 rotate-180 group-hover:translate-x-1 transition-transform" color="#fff" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
              ))}
            </div>
            <p className="text-xs font-medium text-black/40 tracking-tight">
              <span className="text-black font-bold">500+</span> Travelers this month
            </p>
          </div>
        </div>
      </div>

      {/* REFINED IMAGE GRID */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2">
        <div className="relative grid grid-cols-12 gap-4 h-[450px] md:h-[550px]">
          {/* Main Large Image */}
          <div className="col-span-7 h-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden ring-1 ring-black/5 shadow-2xl">
            <div className="absolute inset-0 bg-blue-100 animate-pulse" />
            <Image 
              src={selectedTour?.tour_image_url || "/placeholder.jpg"} 
              alt="Coastal" 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          
          {/* Right Column Stack */}
          <div className="col-span-5 flex flex-col gap-4">
            <div className="h-[60%] relative rounded-[2rem] md:rounded-[3rem] overflow-hidden ring-1 ring-black/5 shadow-xl">
               <div className="absolute inset-0 bg-indigo-50" />
               <Image 
                src={(selectedTour?.images?.[0] as any)?.image_url || "/placeholder2.jpg"}
                alt="Trails" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="h-[40%] relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-black flex items-center justify-center group cursor-pointer">
               <div className="absolute inset-0 opacity-60">
                 <Image 
                  src={(selectedTour?.images?.[0] as any)?.image_url || "/placeholder2.jpg"}
                  alt="Detail" 
                  fill 
                  className="object-cover blur-sm group-hover:blur-none transition-all duration-500"
                />
               </div>
               <span className="relative text-white font-bold text-sm tracking-widest uppercase">+ Gallery</span>
            </div>
          </div>

          {/* Floating 'Stats' Badge - The 'Apple' touch */}
          {/* <div className="absolute -bottom-6 -left-6 hidden md:flex flex-col bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl border border-white/20">
            <span className="text-[10px] uppercase tracking-widest font-bold text-black/30 mb-1">Elevation</span>
            <span className="text-2xl font-bold text-black italic">850ft</span>
            <div className="w-12 h-1 bg-blue-500 rounded-full mt-2" />
          </div> */}
        </div>
      </div>

    </div>
  </div>
</section>

      {/* --- TOUR SELECTOR POPUP --- */}
      <div className='flex justify-center gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] relative'>
        <div className='bg-white/10 active:scale-97 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,.1)] flex flex-row gap-6'>
          <button className="cursor-pointer flex items-center py-[10px] pl-[13px] pr-[10px] gap-[3px] justify-center rounded-full bg-[#000]/5 backdrop-blur-[5px] active:bg-[#333]/20 z-[10]" onClick={(e) => { e.stopPropagation(); setIsPopupOpen(true); }}>
            <p className='font-bold text-[#000]'>Select a Tour</p><span><ArrowIcon className="rotate-180" color="#000" /></span>
          </button>
        </div>
        {isPopupOpen && (
          <div 
            ref={popupRef} 
            className="absolute top-full mt-2 bg-[#000]/40 rounded-[30px] border-[2px] border-white backdrop-blur-[10px] p-[7px] shadow-lg w-[250px] flex flex-wrap z-[40] overflow-hidden"
          >
            <div className="flex flex-col gap-2 w-full">
              {/* START OF LOOP: Define 't' here */}
              {tours.map((t) => (
                <button 
                  key={t.id} 
                  onClick={() => { setSelectedTour(t); setIsPopupOpen(false); }} 
                  className="flex items-center gap-[10px] p-1 hover:bg-white/10 rounded-[20px]"
                >
                  {/* IMAGE LOGIC */}
                  <div className="relative overflow-hidden w-[50px] h-[50px] flex-shrink-0 border-[1.5px] border-white rounded-[17px] bg-neutral-600">
                    {t.tour_image_url ? (
                      <Image 
                        src={t.tour_image_url} 
                        alt={t.name || "Tour"} 
                        width={50} 
                        height={50} 
                        className="object-cover h-full w-full" 
                      />
                    ) : (
                      // Fallback if no URL
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[8px] text-white/50">No Img</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-white font-[500] text-sm text-left line-clamp-2">
                    {t.name}
                  </p>
                </button>
              ))}
              {/* END OF LOOP */}
            </div>
          </div>
        )}
      </div>

      {/* --- TOUR DETAILS --- */}
      {!selectedTour ? (
        <TourDetailsSkeleton />
      ) : (
        <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px]">
          
          {/* 1. Component: Image Gallery */}
          <TourGallery images={selectedTour.images} />

          {/* 2. Section: Text Info (Inline or Componentize further if needed) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div>
              <p className="text-gray-500">Tour</p>
              <p className="font-bold text-2xl lg:text-3xl">{selectedTour.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">{selectedTour.duration} Hours</p>
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">${selectedTour.price} USD</p>
              </div>
              <div className="bg-gray-200/90 w-full mt-4 mb-0 h-px"/>
            </div>
            <div className="flex flex-col gap-6">
              <div><p className="text-xl font-bold">Description</p><p className="text-gray-700 mt-1">{selectedTour.description}</p></div>
              <div>
                <p className="text-xl font-bold mb-4">Trip Info</p>
                <div className="flex flex-col">
                  {selectedTour.stops.map((stop, index) => (
                    <div key={stop.id} className="relative flex gap-4 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                          <div className={`relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full border-[3px] flex-shrink-0 border-[#007BFF]`}></div>
                          {index !== selectedTour.stops.length - 1 && <div className="absolute top-4 bottom-0 w-[3px] bg-blue-500"></div>}
                      </div>
                      <div className="flex flex-col mt-[-4px]">
                        <p className="text-gray-800/70 font-[500] text-[.9rem] leading-tight">{stop.description}</p>
                        <p className={`font-[500] text-[1rem] text-gray-900`}>{stop.name}</p>
                      </div>
                    </div>
                  ))}
                  <p className="font-[500] text-[1rem] self-center mt-[5px] max-sm:my-[15px] px-[17px] py-[7px] cursor-pointer bg-black/5 rounded-full hover:bg-[#E0E0E0]">View All Stops</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Component: Booking Form */}
          <BookingForm tour={selectedTour} user={userSession?.user} />
        </div>
      )}

      {/* --- HOUSE RULES --- */}
      <div className="w-[1500px] max-w-[90vw] mt-[100px]">
        <div className="flex flex-col mb-[30px]">
          <p className="font-[700] text-[1.75rem]">Things to Know</p>
          <p className="max-w-[600px]">Essential guidelines for a safe and respectful visit.</p> 
        </div>
        
        <div className="flex justify-between gap-[30px] bg-red-500/0 max-ttk-wrap2:flex-wrap max-ttk-wrap:bg-red-500/0 max-ttk-wrap:justify-start max-sm:gap-y-[30px]">
          {/* Map over the new data array instead of [1,2,3,4] */}
          {houseRules.map((rule, i) => (
            <div key={i} className="bg-black/3 gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
              
              {/* Render the icon */}
              {rule.icon}
              
              <p className="text-[#656565] text-center font-[600] text-[1.1rem] mt-1">{rule.title}</p>
              <p className="text-center max-w-[300px] text-sm leading-relaxed text-gray-600">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- REVIEWS --- */}
      {selectedTour && <TourReviewsSection tour={selectedTour} user={userSession?.user} />}

      <Footer />
    </div>
  );
}