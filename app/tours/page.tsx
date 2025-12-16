'use client'

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ArrowRight, Clock, DollarSign, Leaf, Waves, Landmark, Mountain, Trees, MapPin, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client'; // Adjust the import path as needed
import sortIcon from '@/public/icons/sort-icon.svg';
import searchIcon from '@/public/icons/search-icon.svg';
import starIcon from '@/public/icons/star-icon.svg';
import houseIcon from '@/public/icons/house-icon.svg';
import ArrowIcon from '@/public/icons/arrow-icon';
import photoIcon from "@/public/icons/photos-icon.svg"
import FacebookIcon from "@/public/icons/facebook-icon";
import { ProfileIcon } from "@/public/icons/profile-icon"
import { Star } from "lucide-react"; 
import { Session } from '@supabase/supabase-js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomCalendar from "../components/CustomCalendar";
import { getDay, startOfWeek, format, isSameDay } from "date-fns";
import TourDetailsSkeleton from "@/app/components/TourDetailsSkeleton"; // Adjust path as needed

// --- START: TYPE DEFINITIONS ---
// Define the shape of your data to help TypeScript
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
// --- END: TYPE DEFINITIONS ---


export default function ToursPage() {
  const supabase = createClient(); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false); // To handle loading state

  const handleBookTour = async () => {
  // 1. Basic Validation
  if (!fullName || !email || !phone || !displayTour) {
    alert("Please fill in all required fields.");
    return;
  }

  setIsBooking(true);

  try {
    // STRATEGY: Try to find the user in 2 different ways
    // 1. Check the active session (works better than getUser in client components)
    const { data: { session } } = await supabase.auth.getSession();
    
    // 2. Fallback to the React state variable if the async call missed it
    const activeUser = session?.user || userSession?.user;

    console.log("Booking User ID:", activeUser?.id || "Guest (Not Logged In)");

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          tour_id: displayTour.id,
          // Use the detected user, or NULL if guest
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
    
    // Reset form
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
  
  // State for your custom calendar
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // State for the new guest dropdown
  const [guestCount, setGuestCount] = useState(1);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  // --- Optional but Recommended: Handle clicking outside the dropdown to close it ---
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modified handler to also close the calendar upon selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // Close calendar after a date is picked
  };

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0); // 0 means no rating yet
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

      const handleAddReviewClick = () => {
        if (userSession) {
          // If user is logged in, open the review form
          setIsReviewModalOpen(true);
        } else {
          // If user is not logged in, open the login prompt
          setIsLoginModalOpen(true);
        }
      };

  const handleReviewSubmit = async () => {
    // Basic validation
    if (!reviewText || rating === 0 || !userSession || !displayTour) {
        alert('Please provide a rating and a review text.');
        return;
    }

    const { data, error } = await supabase
        .from('reviews')
        .insert({
            tour_id: displayTour.id,
            review_text: reviewText,
            rating: rating,
            // Use user's email or a name from a profiles table if you have one
            reviewer_name: userSession.user.email || 'Anonymous', 
        });

    if (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    } else {
        alert('Thank you for your review!');
        // Close modal and reset state
        setIsReviewModalOpen(false);
        setReviewText('');
        setRating(0);
        // You might want to re-fetch the reviews here to show the new one instantly
    }
};

// Now, update your modal's submit button's onClick to use this function:
// onClick={handleReviewSubmit}


  
  // --- MODIFIED STATE HOOKS ---
  // Apply the types to your state hooks
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  // --- END MODIFIED STATE HOOKS ---

  const popupRef = useRef < HTMLDivElement > (null);

  useEffect(() => {
    const fetchTours = async () => {
      // The `data` will now be correctly typed as `Tour[]`
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
          setSelectedTour(data[0]); // Select the first tour by default
        }
      }
    };

    fetchTours();
  }, []);

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
    setIsPopupOpen(false);
  };
  
  const displayTour = selectedTour;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  // Function to go to the next image
  const nextImage = () => {
    if (displayTour && displayTour.images.length > 0) {
      setCurrentImageIndex((prevIndex) => {
        // We allow the index to go to 'displayTour.images.length'
        // which is the index of the cloned first slide.
        // The useEffect below will detect this and silently reset to 0.
        if (prevIndex >= displayTour.images.length) {
          return 0; // Fallback safety
        }
        return prevIndex + 1;
      });
    }
  };

  // Function to go to the previous image
  const prevImage = () => {
    if (displayTour && displayTour.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? displayTour.images.length - 1 : prevIndex - 1
      );
    }
  };
  // 
  useEffect(() => {
    // Reset to the first image whenever the selected tour changes
    setCurrentImageIndex(0);
  }, [selectedTour]);

  // Automatically advance images every 3 seconds when a tour is displayed and has images

    useEffect(() => {
    if (!displayTour || displayTour.images.length <= 1) return;

    // 1. Check if we have reached the "Clone" slide (which is at index === length)
    if (currentImageIndex === displayTour.images.length) {
      const timer = setTimeout(() => {
        setIsTransitionEnabled(false); // Turn off animation
        setCurrentImageIndex(0);      // Silently snap back to real first slide
      }, 500); // Wait for the slide animation to finish (must match CSS duration)

      return () => clearTimeout(timer);
    }

    // 2. Re-enable transition after the snap back
    if (!isTransitionEnabled && currentImageIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitionEnabled(true); // Turn animation back on for next click
      }, 50);
      return () => clearTimeout(timer);
    }

    // 3. Auto-advance logic
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex, displayTour, isTransitionEnabled]);


  // --- SWIPE LOGIC START ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance (px) to be considered a swipe
  const minSwipeDistance = 50; 

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
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

    if (isLeftSwipe) {
      nextImage(); // Swipe Left = Go Next
    } 
    if (isRightSwipe) {
      prevImage(); // Swipe Right = Go Prev
    }
  };
  // --- SWIPE LOGIC END ---

  return (
    <div className="flex flex-col items-center text-black"
      onClick={(e) => {
      if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    }}
    >

      {/* Container: constrained width, centered, responsive flex wrap */}
      <div className="relative w-full max-w-[1500px] px-[5vw] mx-auto mt-[150px] mb-[130px] flex flex-wrap-reverse lg:flex-nowrap items-center justify-center gap-12 lg:gap-[100px] z-10">
        
        {/* Gradient Blob Background (Kept Absolute to this container) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-0 w-[250px] h-[250px] bg-gradient-to-br from-pink-300/40 to-indigo-300/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* LEFT COL: Image/Video Cards */}
        {/* CHANGES: 
            1. max-w-[550px]: Stops it from getting huge on tablets.
            2. mx-auto: Centers it when it wraps on tablet.
            3. lg:max-w-none: Removes the limit when side-by-side on desktop.
            4. lg:mx-0: Aligns it left on desktop.
        */}
        <div className="w-full max-w-[550px] lg:max-w-none lg:w-1/2 flex items-center gap-4 md:gap-6 mx-auto lg:mx-0">
          
          {/* Large Left Card */}
          <div className="w-[55%] aspect-[3/4] bg-blue-400 rounded-[45px] md:rounded-[3.5rem] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
             {/* <video ... /> */}
          </div>

          {/* Right Column (Small Cards) */}
          <div className="w-[45%] flex flex-col gap-4 md:gap-6">
            
            {/* Top Small Card */}
            <div className="w-full aspect-[4/5] bg-blue-400 rounded-[45px] md:rounded-[3.5rem] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
               {/* <Image ... /> */}
            </div>
            
            {/* Bottom Small Card */}
            <div className="w-full aspect-[5/4] bg-blue-400 rounded-[40px] md:rounded-[3.5rem] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
               {/* <video ... /> */}
            </div>
          </div>

        </div>

        {/* RIGHT COL: Text and Info Section */}
        <div className="w-full lg:w-1/2 flex flex-col relative z-10">
          <div className="flex flex-col">
            <h1 className="font-bold text-[3rem] sm:text-[4rem] leading-tight sm:leading-[80px]">
              Discover St. Joseph&apos;s Hidden Wonders
            </h1>
            <p className="text-gray-700 mt-6 text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis venenatis ex, ultricies dapibus leo pulvinar sit amet. Praesent pharetra aliquet vehicula. Praesent et diam nunc. Suspendisse et magna et enim facilisis congue quis in nulla.
            </p>
          </div>
          
          {/* <div className="flex flex-wrap mt-8 gap-4">
            <div className="bg-[#EDEDED] px-6 py-3 rounded-[40px] border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transform hover:scale-105 duration-300">
              <p className="font-[600] text-gray-800">3 Unique Tours</p>
            </div>
            <div className="bg-[#EDEDED] px-6 py-3 rounded-[40px] border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transform hover:scale-105 duration-300">
              <p className="font-[600] text-gray-800">4.9 Star Ratings</p>
            </div>
          </div> */}
        </div>

      </div>


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
                    // Fallback background if no image exists
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

          {/* tour details - Revamped for Mobile Responsiveness */}
          {/* We now check if displayTour exists before trying to render it */}
          {!displayTour ? (
            <TourDetailsSkeleton />
          ) : (
          <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px] overflow-visable">

            {/* tour details - IMAGES (Responsive Grid) */}
            <div className="relative w-full h-[300px] lg:w-[370px] lg:h-auto">

                {/* Main Image */}
                <div className="relative h-full w-full rounded-[35px] overflow-hidden group"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  
                  {(() => {
                    // Return a block of JSX, but first prepare the slides for the infinite loop
                    const slides = displayTour.images.length > 1 
                      ? [...displayTour.images, displayTour.images[0]] // Add a clone of the first image to the end
                      : displayTour.images;

                    return (
                      <>
                        {/* This container holds the sliding images */}
                        <div
                          className="flex h-full w-full"
                          style={{
                            transform: `translateX(-${currentImageIndex * 100}%)`,
                            // The transition is turned off during the "jump" back to the start
                            transition: !isTransitionEnabled ? 'none' : 'transform 500ms ease-in-out',
                          }}
                        >
                          {/* Map over the new 'slides' array which includes the clone */}
                          {slides.map((image, index) => (
                            <div key={index} className="relative w-full h-full flex-shrink-0">
                              <Image
                                src={image.url}
                                alt={`View of ${displayTour.name} #${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className=""
                              />
                            </div>
                          ))}
                        </div>

                  {/* Navigation Arrows (only show if there's more than one image) */}
                  {displayTour.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="cursor-pointer active:scale-97 absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="cursor-pointer active:scale-97 absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}

                  {/* Indicator Dots */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/0 rounded-full py-[5px] px-[7px] flex gap-[10px] z-10">
                    {displayTour.images.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-[8px] w-[8px] rounded-full cursor-pointer shadow-[0px_0px_10px_rgba(0,0,0,0.3)] transition-colors ${
                          // --- FIX START: Use % to highlight the first dot when on the clone slide ---
                          (currentImageIndex % displayTour.images.length) === index 
                            ? 'bg-white w-[25px]' 
                            : 'bg-white/50'
                          // --- FIX END ---
                        }`}
                      />
                    ))}
                  </div>
                  </>
                );
              })()}
            </div>

              {/* <div className='absolute flex gap-[15px] right-[10px] top-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
                <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-row gap-6'>
                  <button className="cursor-pointer flex items-center py-[10px] px-[13px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                    <p className='font-[500] text-[#fff]'>See all photos</p>
                  </button>
                </div>
              </div> */}
            </div>


            {/* tour details - INFO (Flexible Width) */}
            {/* Takes full width on mobile and a specific portion on desktop. */}
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
                    {displayTour.stops
                      // Sort by created_at or a specific order column if you have one. 
                      // Currently sorting by default order.
                      .map((stop, index) => (
                      <div key={stop.id} className="relative flex gap-4 pb-4 last:pb-0 ">
                        
                        {/* VISUAL: The Timeline Line & Dots */}
                        <div className="flex flex-col items-center bg-red-500/0">
                            {/* The Circle (Dot) */}
                            <div className={`
                              relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full border-[3px] flex-shrink-0 border-[#007BFF] shadow-[0px_0px_3px_rgba(0,140,255,0)]
                            `}>
                              {/* Optional: Inner dot for the first item like the screenshot */}
                              {/* <div className="w-2 h-2 bg-black/10 rounded-full" /> */}
                            </div>

                            {/* The Vertical Line */}
                            {/* We hide the line for the last item */}
                            {index !== displayTour.stops.length - 1 && (
                              <div className="absolute top-4 bottom-0 w-[3px] bg-blue-500 shadow-[0px_0px_3px_rgba(0,140,255,0)]"></div>
                            )}
                        </div>

                        {/* TEXT: Content */}
                        <div className="flex flex-col mt-[-4px]">
                          <p className="text-gray-800/70 font-[500] text-[.9rem] leading-tight">
                            {stop.description}
                          </p>
                          <p className={`font-[500] text-[1rem] text-gray-900`}>
                            {stop.name}
                          </p>
                        </div>

                      </div>
                    ))}
                    <p className="font-[500] text-[1rem] self-center mt-[5px] max-sm:my-[15px] px-[17px] py-[7px] cursor-pointer bg-black/5 rounded-full hover:bg-[#E0E0E0] active:bg-[#E0E0E0]">View All Stops</p>
                  </div>
                </div>
              </div>
            </div>


            {/* tour details - BOOKING FORM (Responsive Inputs) */}
            {/* Stacks vertically on mobile. Inputs take full width for better usability. */}
            <div className="w-full lg:w-1/3 h-full relative flex flex-col gap-4">
              {/* Calendar and Time Picker */}
              <div>
                <button className="cursor-pointer bg-[#F5F5F5] hover:bg-[#E0E0E0] active:bg-[#E0E0E0] flex w-full text-left p-4 rounded-[30px]" onClick={() => setIsCalendarOpen(true)}>
                  <div className="flex flex-col">
                    <p className="flex items-center text-sm">Select a date & time <ArrowIcon className="rotate-180" color="#000" /></p>
                    <p className="font-bold text-lg mt-[-2px]">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <p className="absolute right-4 self-end font-[500] text-[#656565] text-[1.1rem]">{format(selectedDate, 'p')}</p>
                </button>

                {/* Conditionally render your CustomCalendar */}
                <div className="absolute z-20">
                  {isCalendarOpen && (
                    <CustomCalendar
                      selectedDate={selectedDate}
                      onChange={handleDateChange}
                      onClose={() => setIsCalendarOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Input Fields */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-3">
                  <input 
                    type="text" 
                    className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {/* --- START: Custom Guest Dropdown --- */}
                  <div ref={guestDropdownRef} className="relative">
                    <button 
                      onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                      className="cursor-pointer flex items-center gap-2 p-1 pr-1 pl-4 bg-[#F5F5F5] hover:bg-[#E0E0E0] active:bg-[#E0E0E0] rounded-[20px] h-13 w-full sm:w-auto"
                    >
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
                            <button
                              key={number}
                              className="block cursor-pointer text-white text-center p-2 mx-2 hover:bg-gray-100/20 active:bg-gray-100/20 active:scale-95 rounded-[17px] font-[600] transition-all"
                              onClick={() => {
                                setGuestCount(number);
                                setIsGuestDropdownOpen(false);
                              }}
                            >
                              {number}
                            </button>
                          ))}
                        </div>
                      </div>
                      </div>
                    )}
                  </div>
                  {/* --- END: Custom Guest Dropdown --- */}
                </div>
                <input 
                  type="tel" 
                  className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" 
                  placeholder="Phone Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input 
                  type="email" 
                  className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <textarea 
                  placeholder="Additional Notes (Optional)" 
                  className="resize-none w-full outline-none h-24 font-medium p-3 px-4 bg-[#F5F5F5] rounded-[20px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              {/* Book Tour Button */}
              <div className="mt-0 flex justify-center bg-red-500/0">
                <button 
                  onClick={handleBookTour}
                  disabled={isBooking}
                  className={`active:scale-97 relative w-full self-center mr-[3px] cursor-pointer whitespace-nowrap rounded-full p-[3px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] ${isBooking ? 'opacity-50' : ''}`}
                >
                  <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full py-[15px]'>
                    <span className='text-white font-bold text-[1.1rem]'>
                      {isBooking ? "Processing..." : "Book Tour"}
                    </span>
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
              <p className="max-w-[600px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> 
            </div>
            <div className="flex justify-between gap-[30px] bg-red-500/0 max-ttk-wrap2:flex-wrap max-ttk-wrap:bg-red-500/0 max-ttk-wrap:justify-start max-sm:gap-y-[30px]">

              <div className="bg-black/3 gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>

              <div className="bg-black/3 gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              <div className="bg-black/3 gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              <div className="bg-black/3 gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              
            </div>
          </div>

          {/* Reviews */}
          {displayTour && (
            <div className="bg-red-500/0 w-[1500px] max-w-[90vw] mt-[100px]">
              <div className="flex justify-between items-center mb-[30px]">
                <div className="text-[1.75rem]">
                    <span className="font-[700]">Reviews - </span>
                    <span className="font-[500] text-[#656565]">{displayTour.name}</span>
                </div>
                {/* This button only shows for logged-in users */}
                {userSession && (
                    <button 
                      onClick={handleAddReviewClick}
                      className="px-4 py-2 font-semibold text-white bg-[#007BFF] rounded-full shadow-md hover:bg-blue-600 transition-colors"
                  >
                      Add a Review
                  </button>
                  )}
              </div>
              <div>
              {displayTour.reviews.map((review) => (
                <div key={review.id} className="bg-[#EDEDED] w-[407px] max-sm:w-[90vw] h-fit border-white border-[2px] rounded-[40px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden mb-4">
                  <div className="flex justify-between items-start mb-[15px]">
                    <div className="bg-blue-500/0 flex items-center gap-[10px]">

                      <Link href="/profile" className='cursor-pointer whitespace-nowrap'>
                      <div className='w-11 h-11 flex items-center justify-center rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] -mr-[1px]'>
                        <div className='bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden'>
                          {/* <Image src={avatarUrl} alt="User profile picture" width={40} height={40} className="w-full h-full object-cover rounded-full" /> */}
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                    </Link>

                      <div>
                        <p className="font-[600] text-[1.1rem] text-[#656565]">{review.reviewer_name}</p>
                        <p className="font-[500] text-[.8rem] text-[#656565]">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-[0px]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Image key={i} src={starIcon} alt="star icon" height={30}/>
                    ))}
                    </div>
                  </div>
                  <p>
                    {review.review_text}
                  </p>
                </div>
                ))}
              </div>
              {isReviewModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
                    <h3 className="text-xl font-bold mb-4">Write a review for {displayTour?.name}</h3>
                    
                    {/* Star Rating Input */}
                    <div className="flex items-center gap-2 mb-4">
                        <p className="font-semibold">Your Rating:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={rating >= star ? 'currentColor' : 'none'}
                            onClick={() => setRating(star)}
                          />
                        ))}
                    </div>

                    {/* Text Area */}
                    <textarea
                      placeholder="Share your experience..."
                      className="resize-none w-full outline-none h-[120px] font-[500] p-3 bg-[#EDEDED] rounded-lg mb-4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        onClick={() => setIsReviewModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 font-semibold text-white bg-[#007BFF] rounded-lg hover:bg-blue-600"
                        onClick={() => {
                          // Add the handleReviewSubmit function here
                          alert(`Submitting review: ${reviewText} with rating ${rating}`);
                          // You will replace the alert with the actual submission logic
                        }}
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm mx-4 text-center">
                    <h3 className="text-xl font-bold mb-2">Join the Conversation!</h3>
                    <p className="text-gray-600 mb-6">Please log in or sign up to leave a review.</p>
                    
                    <div className="flex flex-col gap-3">
                      {/* Make sure you have a /login page set up in your app */}
                      <Link href="/login" className="w-full px-4 py-3 font-semibold text-white bg-[#007BFF] rounded-lg hover:bg-blue-600 transition-all">
                          Log In or Sign Up
                      </Link>
                      <button
                        className="w-full px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        onClick={() => setIsLoginModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        
        {/* FOOTER */}
        <footer className='bg-blue-900 text-white w-full mt-[100px] py-12 px-[4vw]'>
          <div className='max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* Column 1: Identity & Contact */}
            <div className='flex flex-col gap-4'>
              <h3 className='font-bold text-xl'>Unveiling Our Legacy</h3>
              <p className='text-blue-200 text-sm'>A District Emergency Organization (DEO) Project.</p>
              <div>
                <h4 className='font-semibold mb-2'>Contact Us</h4>
                <Link href="mailto:stjoseph.legacy@deo.gov.bb" className='text-blue-200 text-sm hover:underline'>stjoseph.legacy@deo.gov.bb</Link>
                <p className='text-blue-200 text-sm'>(246) 123-4567</p>
              </div>
              <div>
                <div className='flex items-center gap-4 mt-3'>
                  <Link href="https://www.instagram.com/dem.barbados" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                    <Image src="/icons/instagram-icon.svg" alt="" height={35} width={35}/>
                  </Link>
                  <Link href="https://www.facebook.com/dem246/" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                    <FacebookIcon color="#FFFFFF" height={30} width={30}/>
                  </Link>
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
                <button className='relative active:scale-97 lg:self-center cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[180px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                  <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px]'>
                    <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                      Contribute
                    </span>
                    <Image src="/icons/handheart-icon.svg" alt="Loading..." width={18} height={18} className='invert' />
                  </div>
                </button>
              </div>

              {/* Stay Connected */}
              <div className='flex flex-col gap-4 items-start lg:items-center w-full'>
                <h3 className='font-bold text-xl'>Stay Connected</h3>
                <p className='text-blue-200 text-sm lg:text-center'>Subscribe to our newsletter for project updates and email blasts.</p>
                {/* Simple input/button (non-functional here) */}
                <div className="h-hit w-fit flex items-center justify-end relative mb-[0px]">
                  <input
                    type="email"
                    className="border-[2px] border-white/10 backdrop-blur-[5px] text-white font-semibold rounded-[30px] py-[15px] pl-[20px] pr-[130px] max-w-[80vw] w-[350px] outline-none bg-black/20"
                    placeholder="Your Email"
                  />
                  <button
                    className={`
                      absolute cursor-pointer active:scale-97 rounded-full py-[10px] px-[22px] mr-[7px] font-semibold bg-[#007BFF] text-white filter shadow-[0_0_7px_rgba(0,123,255,0.5)]
                    `}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className='flex flex-col gap-4 text-left lg:text-right'>
              <h3 className='font-bold text-xl'>Navigate</h3>
              <ul className='space-y-2 text-blue-200'>
                <li><Link href="/about" className='hover:text-[#feb47b] transition-colors'>About the Project</Link></li>
                <li><Link href="/map" className='hover:text-[#feb47b] transition-colors'>Virtual Map</Link></li>
                <li><Link href="/tours" className='hover:text-[#feb47b] transition-colors'>Tours</Link></li>
                <li><Link href="/faq" className='hover:text-[#feb47b] transition-colors'>FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='max-w-7xl mx-auto mt-10 pt-8 border-t border-blue-800 flex flex-col lg:flex-row lg:justify-between items-start lg:items-center text-sm text-blue-300'>
            <p>© 2025 DEO Project. All Rights Reserved.</p>
            <div className='flex gap-4 mt-4 lg:mt-0'>
              <Link href="/privacy" className='hover:text-white transition-colors'>Privacy Policy</Link>
              <Link href="/terms" className='hover:text-white transition-colors'>Terms of Service</Link>
            </div>
          </div>
        </footer>

    </div>
  );
}