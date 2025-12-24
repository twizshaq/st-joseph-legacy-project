'use client'

import React, { useState, useRef, useEffect, useCallback } from "react"; // 1. Added useCallback
import { SlidersHorizontal, ArrowRight, Clock, DollarSign, Leaf, Waves, Landmark, Mountain, Trees, MapPin, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import ArrowIcon from '@/public/icons/arrow-icon';
import { ProfileIcon } from "@/public/icons/profile-icon"
import { Session } from '@supabase/supabase-js';
import "react-datepicker/dist/react-datepicker.css";
import CustomCalendar from "../components/CustomCalendar";
import { format } from "date-fns";
import TourDetailsSkeleton from "@/app/components/TourDetailsSkeleton";
import Footer from "@/app/components/FooterModal"
import PenIcon from "@/public/icons/pen-icon";
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { ReviewSkeleton } from "@/app/components/ReviewSkeleton";
import { ReportModal } from "@/app/components/ReportModal"; 
import houseIcon from '@/public/icons/house-icon.svg';

// --- TYPE DEFINITIONS ---
interface Image {
  id: string;
  url: string;
}

interface Stop {
  id: string;
  name: string;
  description: string;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  tour_image_url: string;
  stops: Stop[];
  images: Image[];
  reviews: Review[];
}

export default function ToursPage() {
  const supabase = createClient(); 

  // --- 1. STATE DEFINITIONS (MOVED TO TOP) ---
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  
  // Define displayTour here so it is available for the functions below
  const displayTour = selectedTour;

  const [tourReviews, setTourReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Booking State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  
  // Calendar & Guest State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal State
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isAuthAlertOpen, setAuthAlertOpen] = useState(false);
  const [reportModalState, setReportModalState] = useState<{ isOpen: boolean; reviewId: number | null }>({
    isOpen: false,
    reviewId: null
  });
  
  const popupRef = useRef<HTMLDivElement>(null);

  // --- 2. EFFECTS & CALLBACKS ---

  // User Session Effect
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Fetch Tours Effect
  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          id,
          name,
          description,
          price,
          duration,
          tour_image_url,
          stops (*),
          images (*),
          reviews (*)
        `);

      if (error) {
        console.error('Error fetching tours:', error);
      } else if (data) {
        setTours(data);
        if (data.length > 0) {
          setSelectedTour(data[0]); 
        }
      }
    };

    fetchTours();
  }, [supabase]);

  // Fetch Reviews Callback (Now works because displayTour is defined above)
  const fetchTourReviews = useCallback(async () => {
    if (!displayTour) return;

    setLoadingReviews(true);
    
    const { data, error } = await supabase
      .from('tour_reviews') 
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('tour_id', displayTour.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching tour reviews:", error);
    } else {
      setTourReviews(data || []);
    }
    setLoadingReviews(false);
  }, [supabase, displayTour]);

  // Fetch reviews when tour changes
  useEffect(() => {
    fetchTourReviews();
  }, [fetchTourReviews]);

  // --- 3. EVENT HANDLERS ---

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
    setIsPopupOpen(false);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleWriteReviewClick = () => {
    if (userSession) {
      setReviewModalOpen(true);
    } else {
      setAuthAlertOpen(true);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const previousReviews = [...tourReviews];
    setTourReviews(prev => prev.filter(r => r.id !== reviewId));

    const { error } = await supabase
      .from('tour_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userSession?.user?.id);

    if (error) {
      console.error("Error deleting:", error);
      setTourReviews(previousReviews);
      alert("Failed to delete review.");
    }
  };

  const handleReportReview = (reviewId: number) => {
    if (!userSession) {
      setAuthAlertOpen(true);
      return;
    }
    setReportModalState({ isOpen: true, reviewId });
  };

  const handleBookTour = async () => {
    if (!fullName || !email || !phone || !displayTour) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsBooking(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const activeUser = session?.user || userSession?.user;

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            tour_id: displayTour.id,
            user_id: activeUser?.id || null, 
            full_name: fullName,
            email: email,
            phone: phone,
            booking_date: selectedDate.toISOString(),
            guest_count: guestCount,
            notes: notes,
            total_price: displayTour.price * guestCount,
          },
        ]);

      if (error) throw error;

      alert("Booking successful! We will contact you shortly.");
      setFullName("");
      setPhone("");
      setEmail("");
      setNotes("");
      
    } catch (error: any) {
      console.error("Booking Error:", error.message);
      alert("Failed to book tour: " + error.message);
    } finally {
      setIsBooking(false);
    }
  };

  // Image Slider Logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  const nextImage = () => {
    if (displayTour && displayTour.images.length > 0) {
      setCurrentImageIndex((prevIndex) => {
        if (prevIndex >= displayTour.images.length) return 0;
        return prevIndex + 1;
      });
    }
  };

  const prevImage = () => {
    if (displayTour && displayTour.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? displayTour.images.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedTour]);

  useEffect(() => {
    if (!displayTour || displayTour.images.length <= 1) return;
    if (currentImageIndex === displayTour.images.length) {
      const timer = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentImageIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (!isTransitionEnabled && currentImageIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentImageIndex, displayTour, isTransitionEnabled]);

  // Touch/Swipe Logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; 

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  // Click Outside Listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [guestDropdownRef]);


  return (
    <div className="flex flex-col items-center text-black"
      onClick={(e) => {
      if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    }}
    >
      {/* Container */}
      <div className="relative w-full max-w-[1500px] px-[5vw] mx-auto mt-[150px] mb-[130px] flex flex-wrap-reverse lg:flex-nowrap items-center justify-center gap-12 lg:gap-[100px] z-10">
        
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-0 w-[250px] h-[250px] bg-gradient-to-br from-pink-300/40 to-indigo-300/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* LEFT COL */}
        <div className="w-full max-w-[550px] lg:max-w-none lg:w-1/2 flex items-center gap-4 md:gap-6 mx-auto lg:mx-0">
          <div className="w-[55%] aspect-[3/4] bg-blue-400 rounded-[45px] md:rounded-[3.5rem] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300"></div>
          <div className="w-[45%] flex flex-col gap-4 md:gap-6">
            <div className="w-full aspect-[4/5] bg-blue-400 rounded-[45px] md:rounded-[3.5rem] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300"></div>
            <div className="w-full aspect-[5/4] bg-blue-400 rounded-[40px] md:rounded-[3.5rem] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300"></div>
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="w-full lg:w-1/2 flex flex-col relative z-10">
          <div className="flex flex-col">
            <h1 className="font-bold text-[3rem] sm:text-[4rem] leading-tight sm:leading-[80px]">
              Discover St. Joseph&apos;s Hidden Wonders
            </h1>
            <p className="text-gray-700 mt-6 text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis venenatis ex, ultricies dapibus leo pulvinar sit amet. Praesent pharetra aliquet vehicula.
            </p>
          </div>
        </div>
      </div>

      {/* Tour Selector Button */}
      <div className='flex justify-center gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] relative' onClick={() => setIsPopupOpen(true)}>
        <div className='bg-white/10 active:scale-97 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] flex flex-row gap-6'>
          <button
            className="cursor-pointer flex items-center py-[10px] pl-[13px] pr-[10px] gap-[3px] justify-center rounded-full bg-[#333]/10 backdrop-blur-[5px] active:bg-[#333]/20 z-[10]"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopupOpen(true);
            }}
          >
            <p className='font-bold text-[#000]'>Select a Tour</p><span><ArrowIcon className="rotate-180" color="#000" /></span>
          </button>
        </div>
        {isPopupOpen && (
          <div
            ref={popupRef}
            className="absolute top-full mt-2 bg-[#000]/40 rounded-[30px] border-[2px] border-white backdrop-blur-[10px] p-[7px] shadow-[0px_0px_20px_rgba(0,0,0,0.2)] w-[250px] flex flex-wrap z-[40] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 w-[100%]">
            {tours.map((tour) => (
              <button
                key={tour.id}
                className="flex items-center gap-[10px] p-1 active:scale-99 active:bg-white/10 hover:bg-white/10 cursor-pointer rounded-[20px]"
                onClick={() => handleTourSelect(tour)}
              >
                <div className="relative overflow-hidden min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] border-[1.5px] border-white rounded-[17px]">
                  {tour.tour_image_url ? (
                    <Image 
                      src={tour.tour_image_url} 
                      alt={tour.name} 
                      width={50} 
                      height={50} 
                      className="object-fit h-full w-ful" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                  )}
                </div>
                <p className="text-wrap text-white text-left font-[500]">{tour.name}</p>
              </button>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Tour Details / Skeleton */}
      {!displayTour ? (
        <TourDetailsSkeleton />
      ) : (
        <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px] overflow-visable">
          
          {/* Images */}
          <div className="relative w-full h-[300px] lg:w-[370px] lg:h-auto">
            <div className="relative h-full w-full rounded-[35px] overflow-hidden group"
              onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            >
              {(() => {
                const slides = displayTour.images.length > 1 
                  ? [...displayTour.images, displayTour.images[0]] 
                  : displayTour.images;

                return (
                  <>
                    <div
                      className="flex h-full w-full"
                      style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                        transition: !isTransitionEnabled ? 'none' : 'transform 500ms ease-in-out',
                      }}
                    >
                      {slides.map((image, index) => (
                        <div key={index} className="relative w-full h-full flex-shrink-0">
                          <Image src={image.url} alt={`View ${index + 1}`} layout="fill" objectFit="cover" />
                        </div>
                      ))}
                    </div>
                    {displayTour.images.length > 1 && (
                      <>
                        <button onClick={prevImage} className="cursor-pointer absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextImage} className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/0 rounded-full py-[5px] px-[7px] flex gap-[10px] z-10">
                      {displayTour.images.map((_, index) => (
                        <div key={index} onClick={() => setCurrentImageIndex(index)}
                          className={`h-[8px] w-[8px] rounded-full cursor-pointer shadow-[0px_0px_10px_rgba(0,0,0,0.3)] transition-colors ${
                            (currentImageIndex % displayTour.images.length) === index ? 'bg-white w-[25px]' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div>
              <p className="text-gray-500">Tour</p>
              <p className="font-bold text-2xl lg:text-3xl">{displayTour.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">{displayTour.duration} Hours</p>
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">${displayTour.price} USD</p>
              </div>
              <div className="bg-gray-200/90 w-full mt-4 mb-0 h-px"/>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xl font-bold">Description</p>
                <p className="text-gray-700 mt-1">{displayTour.description}</p>
              </div>
              <div>
                <p className="text-xl font-bold mb-4">Trip Info</p>
                <div className="flex flex-col">
                  {displayTour.stops.map((stop, index) => (
                    <div key={stop.id} className="relative flex gap-4 pb-4 last:pb-0 ">
                      <div className="flex flex-col items-center bg-red-500/0">
                          <div className={`relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full border-[3px] flex-shrink-0 border-[#007BFF] shadow-[0px_0px_3px_rgba(0,140,255,0)]`}></div>
                          {index !== displayTour.stops.length - 1 && (
                            <div className="absolute top-4 bottom-0 w-[3px] bg-blue-500 shadow-[0px_0px_3px_rgba(0,140,255,0)]"></div>
                          )}
                      </div>
                      <div className="flex flex-col mt-[-4px]">
                        <p className="text-gray-800/70 font-[500] text-[.9rem] leading-tight">{stop.description}</p>
                        <p className={`font-[500] text-[1rem] text-gray-900`}>{stop.name}</p>
                      </div>
                    </div>
                  ))}
                  <p className="font-[500] text-[1rem] self-center mt-[5px] max-sm:my-[15px] px-[17px] py-[7px] cursor-pointer bg-black/5 rounded-full hover:bg-[#E0E0E0] active:bg-[#E0E0E0]">View All Stops</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="w-full lg:w-1/3 h-full relative flex flex-col gap-4">
            <div>
              <button className="cursor-pointer bg-[#F5F5F5] hover:bg-[#E0E0E0] active:bg-[#E0E0E0] flex w-full text-left p-4 rounded-[30px]" onClick={() => setIsCalendarOpen(true)}>
                <div className="flex flex-col">
                  <p className="flex items-center text-sm">Select a date & time <ArrowIcon className="rotate-180" color="#000" /></p>
                  <p className="font-bold text-lg mt-[-2px]">{format(selectedDate, 'MMMM d, yyyy')}</p>
                </div>
                <p className="absolute right-4 self-end font-[500] text-[#656565] text-[1.1rem]">{format(selectedDate, 'p')}</p>
              </button>
              <div className="absolute z-20">
                {isCalendarOpen && (
                  <CustomCalendar selectedDate={selectedDate} onChange={handleDateChange} onClose={() => setIsCalendarOpen(false)} />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center gap-3">
                <input type="text" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <div ref={guestDropdownRef} className="relative">
                  <button onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)} className="cursor-pointer flex items-center gap-2 p-1 pr-1 pl-4 bg-[#F5F5F5] hover:bg-[#E0E0E0] active:bg-[#E0E0E0] rounded-[20px] h-13 w-full sm:w-auto">
                    <ProfileIcon size={24} color="#000000a5" />
                    <span className="w-3 text-center font-[600] pr-0 text-[#000]/70 text-[1.1rem]">{guestCount}</span>
                    <div className="pr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 opacity-70 transition-transform ${isGuestDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {isGuestDropdownOpen && (
                    <div className='absolute bg-white/10 mt-[5px] backdrop-blur-[10px] rounded-[27px] p-[3px] z-[99] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                      <div className="top-full w-full bg-black/40 rounded-[25px]">
                        <p className="font-[500] text-center px-2 py-2 text-white">Select Guests</p>
                        <div className="max-h-48 flex flex-col overflow-y-auto pb-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                            <button key={number} className="block cursor-pointer text-white text-center p-2 mx-2 hover:bg-gray-100/20 active:bg-gray-100/20 active:scale-95 rounded-[17px] font-[600] transition-all" onClick={() => { setGuestCount(number); setIsGuestDropdownOpen(false); }}>
                              {number}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <input type="tel" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input type="email" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea placeholder="Additional Notes (Optional)" className="resize-none w-full outline-none h-24 font-medium p-3 px-4 bg-[#F5F5F5] rounded-[20px]" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
            </div>
            <div className="mt-0 flex justify-center bg-red-500/0">
              <button onClick={handleBookTour} disabled={isBooking} className={`active:scale-97 relative w-full self-center mr-[3px] cursor-pointer whitespace-nowrap rounded-full p-[3px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] ${isBooking ? 'opacity-50' : ''}`}>
                <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full py-[15px]'>
                  <span className='text-white font-bold text-[1.1rem]'>{isBooking ? "Processing..." : "Book Tour"}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Things to know */}
      <div className="w-[1500px] max-w-[90vw] mt-[100px]">
        <div className="flex flex-col mb-[30px]">
          <p className="font-[700] text-[1.75rem]">Things to Know</p>
          <p className="max-w-[600px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> 
        </div>
        <div className="flex justify-between gap-[30px] bg-red-500/0 max-ttk-wrap2:flex-wrap max-ttk-wrap:bg-red-500/0 max-ttk-wrap:justify-start max-sm:gap-y-[30px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-black/3 gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
              <Image src={houseIcon} alt="house icon" height={30}/>
              <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
              <p className="text-center max-w-[300px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS SECTION */}
      {displayTour && (
        <div className="relative flex flex-col items-center w-[1400px] max-w-[90vw] mt-[100px] mb-[120px]">
          <div className='w-full flex flex-col md:flex-row justify-between max-sm:items-center items-end md:items-center gap-6 mb-5 z-10'>
            <div className='flex flex-col gap-1 max-md:self-start max-sm:self-center'>
              <div className="text-[1.75rem]">
                <span className="font-[700]">Traveler Experiences - </span>
                <span className="font-[500] text-[#656565]">{displayTour.name}</span>
              </div>
              <p className='text-slate-500 font-medium max-sm:text-center'>See what others are saying about this tour.</p>
            </div>
          
            <div onClick={handleWriteReviewClick} className='cursor-pointer rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] active:scale-[.98]'>
              <button className='cursor-pointer'>
                <div className='flex gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[10px]'>
                  <span><PenIcon color='#fff'/></span>
                  <p className='text-white font-bold'>Write a Review</p>
                </div>
              </button>
            </div>
          </div>

          <div className='relative max-sm:w-[100vw] w-[90vw] max-w-[1400px] overflow-visible z-10'>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full' />
            {loadingReviews ? (
              <div className='flex overflow-x-auto pb-12 pt-4 gap-6 w-full px-4 max-sm:px-5 scroll-smooth mandatory hide-scrollbar'>
                <ReviewSkeleton /><ReviewSkeleton /><ReviewSkeleton />
              </div>
            ) : tourReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8 rounded-[40px]">
                <span className="text-4xl mb-3">🧐</span>
                <p className="text-lg font-bold text-slate-700">No Reviews Yet</p>
                <p className="text-slate-500">Be the first to share your experience on this tour!</p>
              </div>
            ) : (
              <div className='flex overflow-x-auto pb-12 pt-4 gap-6 w-full px-4 max-sm:px-5 scroll-smooth mandatory hide-scrollbar'>
                {tourReviews.map((review) => {
                  const liveProfile = review.profiles || {};
                  return (
                    <ReviewCard 
                      key={review.id}
                      currentUserId={userSession?.user?.id}
                      onDelete={handleDeleteReview}
                      onReport={handleReportReview}
                      experience={{
                        id: review.id,
                        user_id: review.user_id,
                        username: liveProfile.username || 'Anonymous',
                        user_avatar: liveProfile.avatar_url,
                        description: review.review_text,
                        upload_date: new Date(review.created_at).getTime(),
                        rating: review.rating
                      }} 
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmit={fetchTourReviews}
        user={userSession?.user || null}
        tourId={displayTour?.id} 
      />

      <ReportModal 
        isOpen={reportModalState.isOpen}
        reviewId={reportModalState.reviewId}
        user={userSession?.user || null}
        onClose={() => setReportModalState({ isOpen: false, reviewId: null })}
      />

      <AuthAlertModal
        isOpen={isAuthAlertOpen}
        onClose={() => setAuthAlertOpen(false)}
      />

      <Footer />
      
    </div> // End Main Wrapper
  );
}