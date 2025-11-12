'use client'

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ArrowRight, Clock, DollarSign, Leaf, Waves, Landmark, Mountain, Trees, MapPin, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient'; // Adjust the import path as needed
import sortIcon from '@/public/icons/sort-icon.svg';
import searchIcon from '@/public/icons/search-icon.svg';
import starIcon from '@/public/icons/star-icon.svg';
import houseIcon from '@/public/icons/house-icon.svg';
import ArrowIcon from '@/public/icons/arrow-icon';
import photoIcon from "@/public/icons/photos-icon.svg"
import FacebookIcon from "@/public/icons/facebook-icon";
import profileIcon from "@/public/icons/profile-icon.svg"
import { Star } from "lucide-react"; 
import { Session } from '@supabase/supabase-js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomCalendar from "../components/CustomCalendar";
import { getDay, startOfWeek, format, isSameDay } from "date-fns";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
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
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayTour.images.length);
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

  // This effect handles the "jump" back to the start.
  if (currentImageIndex === displayTour.images.length) {
    const timer = setTimeout(() => {
      setIsTransitionEnabled(false); // Disable the transition
      setCurrentImageIndex(0);      // Jump to the first slide
    }, 500); // This duration MUST match the CSS transition time

    return () => clearTimeout(timer);
  }
  
  // This re-enables the transition after the jump is complete.
  if (!isTransitionEnabled && currentImageIndex === 0) {
      // We need a tiny delay to ensure React has updated the DOM before re-enabling the transition
      const timer = setTimeout(() => {
          setIsTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
  }

  // This interval handles the regular auto-advancing of slides.
  const interval = setInterval(() => {
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  }, 3000); // Change image every 3 seconds

  return () => clearInterval(interval);
}, [currentImageIndex, displayTour, isTransitionEnabled]);



  return (
    <div className="flex flex-col items-center text-black"
      onClick={(e) => {
      if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    }}
    >

      <div className="relative bg-red-500/0 justify-center gap-[100px] w-[1500px] max-w-[90vw] flex flex-wrap-reverse overflow-visible mb-[130px] mt-[200px] max-sm:mt-[150px] ">
      {/* Gradient Blob Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-[250px] h-[250px] bg-gradient-to-br from-pink-300/40 to-indigo-300/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Video Section */}
      <div className="flex gap-[20px] md:gap-[40px] items-center bg-transparent overflow-visible relative z-10">
  {/* Card 1: Smaller by default, scales up on medium screens */}
  <div className="bg-blue-400 max-w-[170px] min-w-[170px] h-[240px] md:max-w-[300px] md:min-w-[300px] md:h-[400px] rounded-[36px] md:rounded-[60px] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
    {/* <video
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
    </video> */}
    
  </div>
  {/* Container for the two smaller cards */}
  <div className="flex flex-col gap-[20px] md:gap-[20px]">
    {/* Card 2: Smaller by default */}
    <div className="relative bg-blue-400 max-w-[150px] min-w-[150px] h-[180px] md:max-w-[250px] md:min-w-[250px] md:h-[300px] rounded-[36px] md:rounded-[60px] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* <Image src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.portobelloinstitute.com%2Fwhat-are-the-different-types-of-tour-guide&psig=AOvVaw3JG3PXKL2ZAPakOt9_tmQf&ust=1760984237573000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCYg9vvsJADFQAAAAAdAAAAABAE" alt=""/> */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
      </video> */}
    </div>
    {/* Card 3: Smaller by default */}
    <div className="bg-blue-400 max-w-[150px] min-w-[150px] h-[120px] md:max-w-[250px] md:min-w-[250px] md:h-[200px] rounded-[36px] md:rounded-[60px] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
      </video> */}
    </div>
  </div>
</div>

      {/* Text and Info Section */}
      <div className="flex flex-col max-w-[600px] relative z-10">
        <div className="flex flex-col">
          <p className="font-bold text-[4rem] max-sm:text-[2.5rem] max-sm:leading-[60px] leading-[80px]">Discover St. Joseph&apos;s Hidden Wonders</p>
          <p className="text-gray-700 mt-4 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis venenatis ex, ultricies dapibus leo pulvinar sit amet. Praesent pharetra aliquet vehicula. Praesent et diam nunc. Suspendisse et magna et enim facilisis congue quis in nulla. Pellentesque quam nisl, bibendum bibendum vehicula a.</p>
        </div>
        <div className="flex mt-[20px] gap-[10px]">
          <div className="bg-[#EDEDED] px-[15px] py-[10px] rounded-[40px] border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transform hover:scale-105 duration-300">
            <p className="font-[600] text-[1rem] text-gray-800">3 Unique Tours</p>
          </div>
          <div className="bg-[#EDEDED] px-[15px] py-[10px] rounded-[40px] border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transform hover:scale-105 duration-300">
            <p className="font-[600] text-[1rem] text-gray-800">4.9 Star Ratings</p>
          </div>
        </div>
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
          {displayTour && (
          <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px] overflow-visable">

            {/* tour details - IMAGES (Responsive Grid) */}
            <div className="relative w-full h-[300px] lg:w-[370px] lg:h-auto">

                {/* Main Image */}
                <div className="relative h-full w-full rounded-[35px] overflow-hidden group">
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
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}

                  {/* Indicator Dots */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/40 rounded-full py-[5px] px-[7px] flex gap-[10px] z-10">
                    {displayTour.images.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-[8px] w-[8px] rounded-full cursor-pointer transition-colors ${
                          currentImageIndex === index ? 'bg-white' : 'bg-white/50'
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
                  <p className="px-4 py-1 font-medium bg-gray-200 rounded-full text-gray-800">{displayTour.duration} Hours</p>
                  <p className="px-4 py-1 font-medium bg-gray-200 rounded-full text-gray-800">${displayTour.price} USD</p>
                </div>
                <div className="bg-gray-200 w-full mt-4 mb-2 h-px"/>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xl font-bold">Description</p>
                  <p className="text-gray-700 mt-1">{displayTour.description}</p>
                </div>
                <div>
                  <p className="text-xl font-bold">Stops</p>
                  <div className="space-y-2 mt-1">
                    {displayTour.stops.map((stop) => (
                      <p key={stop.id} className="text-gray-700"><b>{stop.name}:</b> {stop.description}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            {/* tour details - BOOKING FORM (Responsive Inputs) */}
            {/* Stacks vertically on mobile. Inputs take full width for better usability. */}
            <div className="w-full lg:w-1/3 h-full relative flex flex-col gap-4">
              {/* Calendar and Time Picker */}
              <div>
                <button className="cursor-pointer flex w-full text-left pt-2 pb-0 rounded-[30px]" onClick={() => setIsCalendarOpen(true)}>
                  <div className="flex flex-col">
                    <p className="flex items-center text-sm">Select a date & time</p>
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
                  <input type="text" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-12 w-full outline-none font-medium" placeholder="Full Name" />
                  {/* --- START: Custom Guest Dropdown --- */}
                  <div ref={guestDropdownRef} className="relative">
                    <button 
                      onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                      className="cursor-pointer flex items-center gap-2 p-1 pr-7 pl-4 bg-[#F5F5F5] rounded-[20px] h-12 w-full sm:w-auto"
                    >
                      <Image src={profileIcon} alt="Guests icon" height={22} className="opacity-70" />
                      <span className="w-3 text-center font-[600] pr-2 text-[#000]/70 text-[1.1rem]">{guestCount}</span>
                      <div className="pr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 opacity-70 transition-transform ${isGuestDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>

                    {isGuestDropdownOpen && (
                    <div className='absolute bg-white/10 mt-[5px] backdrop-blur-[10px] rounded-[27px] p-[3px] z-[99] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                      <div className="top-full w-full bg-black/40 rounded-[25px]">
                        <p className="font-bold text-center px-2 py-1 text-white">Select Guests</p>
                        <div className="max-h-48 flex flex-col overflow-y-auto pb-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
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
                <input type="tel" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-12 w-full outline-none font-medium" placeholder="Phone Number" />
                <input type="email" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-12 w-full outline-none font-medium" placeholder="Email Address" />
                <textarea placeholder="Additional Notes (Optional)" className="resize-none w-full outline-none h-24 font-medium p-3 px-4 bg-[#F5F5F5] rounded-[20px]"></textarea>
              </div>

              {/* Book Tour Button */}
              <div className="w-full mt-0 flex justify-center lg:justify-end">
                <button className='relative self-center mr-[3px] active:bg-black/30 cursor-pointer whitespace-nowrap rounded-full p-[3px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[50px] py-[10px]'>
                  <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                    Book Tour
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

              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>

              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
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
                      absolute cursor-pointer rounded-full py-[10px] px-[22px] mr-[7px] font-semibold bg-[#007BFF] text-white filter shadow-[0_0_7px_rgba(0,123,255,0.5)]
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
                <li><a href="/about" className='hover:text-[#feb47b] transition-colors'>About the Project</a></li>
                <li><a href="/map" className='hover:text-[#feb47b] transition-colors'>Virtual Map</a></li>
                <li><a href="/tours" className='hover:text-[#feb47b] transition-colors'>Tours</a></li>
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
}