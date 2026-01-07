'use client'

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from '@/lib/supabase/client';
import ArrowIcon from '@/public/icons/arrow-icon';
import houseIcon from '@/public/icons/house-icon.svg';
import Footer from "@/app/components/FooterModal"
import TourDetailsSkeleton from "@/app/components/tours/TourDetailsSkeleton";
import TourGallery from "@/app/components/tours/TourGallery";
import BookingForm from "@/app/components/tours/BookingForm";
import TourReviewsSection from "@/app/components/tours/TourReviewsSection";
import { Tour } from "@/app/types/tours";

// --- Internal Component: Stop Item with Read More ---
// This handles the truncation logic cleanly
const StopItem = ({ stop, index, totalStops }: { stop: any, index: number, totalStops: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Check if text is roughly long enough to need a read more button (approx 80 chars)
  const isLongText = stop.description && stop.description.length > 80;

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <div className={`relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full border-[3px] flex-shrink-0 border-[#007BFF]`}></div>
        {index !== totalStops - 1 && <div className="absolute top-4 bottom-0 w-[3px] bg-blue-500"></div>}
      </div>
      <div className="flex flex-col mt-[-4px] w-full">
        <p className={`font-[500] text-[1rem] text-gray-900 mb-1`}>{stop.name}</p>
        
        <div className="relative">
          {/* Line clamp ensures 2 lines max when not expanded */}
          <p className={`text-gray-800/70 font-[500] text-[.9rem] leading-tight transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {stop.description}
          </p>
          
          {isLongText && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="text-[0.8rem] font-bold text-blue-600 mt-1 hover:underline focus:outline-none"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ToursPage() {
  const supabase = createClient(); 
  
  // State
  const [userSession, setUserSession] = useState<any>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  
  // Popup States
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  
  // Guest Count State (Lifted Up)
  const [guestCount, setGuestCount] = useState(1);

  const popupRef = useRef<HTMLDivElement>(null);
  const stopsModalRef = useRef<HTMLDivElement>(null);

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

  // Reset guest count to 1 when user switches tours
  useEffect(() => {
    setGuestCount(1);
  }, [selectedTour]);

  const houseRules = [
    { icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, title: "Safety First", description: "Cliffs can be unstable. Please stay behind designated railings and follow the guide's path." },
    { icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, title: "Punctuality", description: "Tours depart promptly. Please arrive at the meeting point 15 minutes before your slot." },
    { icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, title: "Eco-Friendly", description: "Help us preserve St. Joseph. Please carry out all trash and respect the local wildlife." },
    { icon: <Image src={houseIcon} alt="house icon" height={30} className="opacity-70" />, title: "Community", description: "Respect the local residents. Keep noise levels moderate when passing through villages." }
  ];

  // Logic: Only show 3 stops in the main preview
  const previewStops = selectedTour?.stops ? selectedTour.stops.slice(0, 3) : [];
  const hasMoreStops = selectedTour?.stops && selectedTour.stops.length > 3;

  // Logic: Calculate Dynamic Price
  const displayPrice = selectedTour ? (selectedTour.price * guestCount) : 0;

  return (
    <div className="flex flex-col items-center overflow-x-hidden text-black" onClick={(e) => {
      if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) setIsPopupOpen(false);
      if (isStopsModalOpen && stopsModalRef.current && !stopsModalRef.current.contains(e.target as Node)) setIsStopsModalOpen(false);
    }}>
      
      {/* --- HERO SECTION --- */}
        <section className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,123,255,0.03)_0%,rgba(250,250,250,0)_100%)] pointer-events-none" />
          <div className="relative w-full max-w-[1400px] px-6 mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1 text-center lg:text-left">
                <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.03] mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Exclusive Experiences</span>
                </div>
                <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-bold leading-[0.95] tracking-tighter text-black">
                  St. Joseph&apos;s <br /> <span className="text-black/40">Hidden Wonders.</span>
                </h1>
                <p className="mt-8 text-lg md:text-xl text-black/60 leading-relaxed max-w-[500px] mx-auto lg:mx-0">
                  Journey through the rugged beauty of Barbados. Guided expeditions through secret trails, coastal cliffs, and forgotten history.
                </p>
              </div>
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <div className="relative grid grid-cols-12 gap-4 h-[280px] sm:h-[350px] md:h-[550px]">
                  <div className="col-span-7 h-full relative rounded-[50px] md:rounded-[5rem] overflow-hidden ring-1 ring-black/5 shadow-[0px_0px_10px_rgba(0,0,0,0.3)]">
                    <div className="absolute inset-0 bg-blue-500" />
                  </div>
                  <div className="col-span-5 flex flex-col gap-4">
                    <div className="h-[60%] relative rounded-[40px] md:rounded-[5rem] overflow-hidden ring-1 ring-black/5">
                      <div className="absolute inset-0 bg-blue-500" />
                    </div>
                    <div className="h-[40%] relative rounded-[35px] md:rounded-[4.2rem] overflow-hidden bg-blue-500 shadow-[0px_0px_10px_rgba(0,0,0,0.3)]">
                      <div className="absolute inset-0 opacity-60"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* --- TOUR SELECTOR POPUP --- */}
      <div className='flex justify-center gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] relative'>
        <div className='bg-white/10 active:scale-97 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,.1)] flex flex-row gap-6'>
          <button className="cursor-pointer flex items-center py-[10px] pl-[13px] pr-[10px] gap-[3px] justify-center rounded-full bg-[#000]/5 backdrop-blur-[5px] active:bg-[#000]/10 z-[10]" onClick={(e) => { e.stopPropagation(); setIsPopupOpen(true); }}>
            <p className='font-bold text-slate-800'>Select Your Journey</p><span><ArrowIcon className="rotate-180" color="#1E293B" /></span>
          </button>
        </div>
        {isPopupOpen && (
          <div ref={popupRef} className="absolute top-full mt-2 bg-white/80 rounded-[28px] backdrop-blur-[10px] p-[2.5px] shadow-[0px_0px_20px_rgba(0,0,0,.2)] w-fit flex flex-wrap z-[40] overflow-hidden">
            <div className="flex flex-col gap-2 w-full bg-black/5 rounded-[25px] p-[5px]">
              {tours.map((t) => (
                <button key={t.id} onClick={() => { setSelectedTour(t); setIsPopupOpen(false); }} className="flex items-center gap-[10px] cursor-pointer p-1 hover:bg-black/10 pr-[10px] active:bg-black/10 active:scale-[.98] rounded-[20px]">
                  <div className="relative overflow-hidden w-[50px] h-[50px] flex-shrink-0 border-[1.5px] border-white rounded-[17px] bg-neutral-600">
                    {t.tour_image_url ? ( <Image src={t.tour_image_url} alt={t.name || "Tour"} width={50} height={50} className="object-cover h-full w-full" /> ) : ( <div className="w-full h-full flex items-center justify-center"><span className="text-[8px] text-white/50">No Img</span></div> )}
                  </div>
                  <p className="font-[600] text-[.9rem] text-left line-clamp-2">{t.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- TOUR DETAILS --- */}
      {!selectedTour ? (
        <TourDetailsSkeleton />
      ) : (
        <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px]">
          
          <TourGallery images={selectedTour.images} />

          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div>
              <p className="text-gray-500">Tour</p>
              <p className="font-bold text-2xl lg:text-3xl">{selectedTour.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">{selectedTour.duration} Hours</p>
                
                {/* --- DYNAMIC PRICE TAG --- */}
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">
                  ${displayPrice.toLocaleString()} USD
                </p>
              </div>
              <div className="bg-gray-200/90 w-full mt-4 mb-0 h-px"/>
            </div>
            <div className="flex flex-col gap-6">
              <div><p className="text-xl font-bold">Description</p><p className="text-gray-700 mt-1">{selectedTour.description}</p></div>
              <div>
                <p className="text-xl font-bold mb-4">Trip Info</p>
                <div className="flex flex-col">
                  {/* MAIN VIEW: Slice first 3 stops only */}
                  {previewStops.map((stop, index) => (
                    <div key={stop.id} className="relative flex gap-4 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                          <div className={`relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full border-[3px] flex-shrink-0 border-[#007BFF]`}></div>
                          {index !== previewStops.length - 1 && <div className="absolute top-4 bottom-0 w-[3px] bg-blue-500"></div>}
                      </div>
                      <div className="flex flex-col mt-[-4px]">
                        <p className="text-gray-800/70 font-[500] text-[.9rem] leading-tight line-clamp-2">{stop.description}</p>
                        <p className={`font-[500] text-[1rem] text-gray-900`}>{stop.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* POP OUT BUTTON (only if more than 3) */}
                  {hasMoreStops && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsStopsModalOpen(true); }}
                      className="font-[500] text-[1rem] self-center mt-[5px] max-sm:my-[15px] px-[17px] py-[7px] cursor-pointer bg-black/5 rounded-full hover:bg-[#E0E0E0] transition-colors"
                    >
                      View All Stops
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- BOOKING FORM WITH PROPS --- */}
          <BookingForm 
            tour={selectedTour} 
            user={userSession?.user} 
            guestCount={guestCount} 
            onGuestChange={setGuestCount}
          />
        </div>
      )}

      {/* --- ALL STOPS MODAL (Pop Out) --- */}
      {isStopsModalOpen && selectedTour && (
        <div className="fixed inset-0 z-50 flex z-[101] items-center justify-center p-4 bg-black/40 backdrop-blur-[6px] animate-in fade-in duration-200">
          <div ref={stopsModalRef} className="bg-white relative w-full max-w-[600px] max-h-[85vh] rounded-[45px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 pb-2 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <h2 className="text-2xl font-bold text-gray-900">All Stops</h2>
              <button onClick={() => setIsStopsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
                <ArrowIcon className="rotate-45" color="#000" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
               {selectedTour.stops.map((stop, index) => (
                 <StopItem key={stop.id} stop={stop} index={index} totalStops={selectedTour.stops.length} />
               ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button onClick={() => setIsStopsModalOpen(false)} className="w-full py-3 bg-black text-white font-bold rounded-full hover:bg-black/90 transition-opacity">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HOUSE RULES & REVIEWS & FOOTER (Unchanged) --- */}
      <div className="w-[1500px] max-w-[90vw] mt-[100px]">
        <div className="flex flex-col mb-[30px]">
          <p className="font-[700] text-[1.75rem]">Things to Know, Before you go</p>
          <p className="max-w-[600px]">Please review these details to ensure you have the best experience in the St Joseph</p> 
        </div>
        <div className="flex justify-between gap-[30px] max-ttk-wrap2:flex-wrap max-ttk-wrap:justify-start max-sm:gap-y-[30px]">
          {houseRules.map((rule, i) => (
            <div key={i} className="bg-white/10 max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-[2px] overflow-hidden transform hover:scale-105 duration-300">
              <div className="bg-black/3 gap-[3px] p-[15px] flex flex-col items-center w-[100%] h-[100%] rounded-[43px]">
                {rule.icon}
                <p className="text-[#656565] text-center font-[600] text-[1.1rem] mt-1">{rule.title}</p>
                <p className="text-center max-w-[300px] text-sm leading-relaxed text-gray-600">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TourReviewsSection tour={selectedTour} user={userSession?.user} />
      <Footer />
    </div>
  );
}