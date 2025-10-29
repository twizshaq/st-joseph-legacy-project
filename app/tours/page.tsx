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
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] flex flex-row gap-6'>
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
            className="absolute top-full mt-2 bg-[#000]/10 rounded-[30px] border-[2px] border-white backdrop-blur-[10px] p-[7px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] w-[250px] flex flex-wrap z-[40] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 w-[100%]">
            {tours.map((tour) => (
              <button
                key={tour.id}
                className="flex items-center gap-[10px] p-1 hover:bg-black/10 cursor-pointer rounded-[20px]"
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
                <p className="text-wrap text-left font-[500]">{tour.name}</p>
              </button>
            ))}
            </div>
          </div>
        )}
      </div>

          {/* tour details  */}
          {/* We now check if displayTour exists before trying to render it */}
          {displayTour && (
          <div className="bg-white p-[10px] mt-[30px] gap-[20px] max-w-[92vw] flex flex-wrap shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px] overflow-hidden">

            {/* tour details - IMAGES  */}
            <div className="relative bg-red-500/0 flex h-full  rounded-l-[40px] overflow-hidden gap-[10px]">
              <div className="bg-green-500/0 flex flex-col h-full w-[200px] gap-[5px] rounded-l-[35px] justify-between">
                <div className="bg-pink-500 w-full h-[230px] rounded-[10px] rounded-tl-[35px]"></div>
                <div className="bg-blue-500 w-full h-[230px] rounded-[10px] rounded-bl-[35px] self-end"></div>
              </div>

              <div className="flex flex-col w-[150px] bg-purple-500/0 justify-between">
                <div className="bg-green-500 w-full h-[23.5%] self-end rounded-[10px] rounded-tr-[35px]"></div>
                <div className="bg-pink-500 w-full h-[23.5%] self-end rounded-[10px]"></div>
                <div className="bg-yellow-500 w-full h-[23.5%] self-end rounded-[10px]"></div>
                <div className="bg-purple-500 w-full h-[23.5%] self-end rounded-[10px] rounded-br-[35px]"></div>
              </div>
              <div className='absolute flex gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
                <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-row gap-6'>
                  <button className="cursor-pointer flex items-center py-[7px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                    <p className='font-bold text-[#fff]'>See all photos</p>
                  </button>
                </div>
              </div>
            </div>


            {/* tour details - INFO  */}
            <div className="bg-blue-500/0 w-[450px] h-full">
              <div className="flex flex-col">
                <p className="">Tour</p>
                <p className="font-[700] text-[1.5rem]">{displayTour.name}</p>
                <div className="flex gap-[5px]">
                  <p className="px-[15px] py-[3px] font-[500] bg-black/30 rounded-full text-white">{displayTour.duration} Hours</p>
                  <p className="px-[15px] py-[3px] font-[500] bg-black/30 rounded-full text-white">{displayTour.price} USD</p>
                </div>
                <div className=" bg-black/10 w-[80%] mt-[10px] mb-[10px] h-[1px]"/>
              </div>
              <div className="flex flex-col gap-[30px]"> 
                <div>
                  <p className="text-[1.25rem] font-[700]">Description</p>
                  <p className="">{displayTour.description}</p>
                </div>
                <div>
                  <p className="text-[1.25rem] font-[700]">Stops</p>
                  {displayTour.stops.map((stop) => (
                    <p key={stop.id} className=""><b>{stop.name}:</b> {stop.description}</p>
                  ))}
                </div>
              </div>
            </div>


            <div className="bg-pink-500/0 h-full relative"> {/* Added relative positioning */}
              {/* This button will now open your custom calendar */}
              <button className="cursor-pointer" onClick={() => setIsCalendarOpen(true)}>
                  <div className="flex flex-col items-start">
                      <p className="flex items-center">Select a date <span className=""><ArrowIcon className="rotate-180" color="#000" /></span></p>
                      <p className="font-[700] mt-[-5px] text-[1.125rem]">
                          {format(selectedDate, 'MMMM')} <span className="text-[#656565] font-[400]">{format(selectedDate, 'yyyy')}</span>
                      </p>
                  </div>
                  <div className="bg-red-500/0 flex gap-[20px] mt-[5px]">
                      {Array.from({ length: 7 }).map((_, i) => {
                          const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                          const day = new Date(weekStart);
                          day.setDate(weekStart.getDate() + i);

                          const isSelected = isSameDay(selectedDate, day);

                          return (
                              <div key={i} className="flex flex-col items-center">
                                  <p className="font-[500]">{format(day, 'EEE')}</p>
                                  <p className={isSelected ? "bg-[#007BFF] rounded-full py-[1px] pt-[2px] px-[4.5px] text-white" : ""}>
                                      {format(day, 'd')}
                                  </p>
                              </div>
                          );
                      })}
                  </div>
              </button>

              {/* Conditionally render your CustomCalendar */}
            <span className="absolute left-[0px] z-20">
              {isCalendarOpen && (
                  <CustomCalendar
                      selectedDate={selectedDate}
                      onChange={handleDateChange}
                      onClose={() => setIsCalendarOpen(false)}
                  />
              )}
            </span>
    

                
                
              <div className="mt-[20px] mb-[10px]">
                <div className="flex items-center gap-[10px]">
                  <input type="text" className="p-[2px] px-[15px] bg-[#EDEDED] rounded-[20px] h-[50px] w-[261px] outline-none font-[500]" placeholder="Full Name" />
                  <button className="cursor-pointer pl-[3px] bg-[#EDEDED] flex justify-center gap-[3px] items-center rounded-[20px] h-[50px] w-[80px]">
                    <span className="rotate-[0deg] opacity-[.7]"><Image src={profileIcon} alt="drop down arrow" height={22} /></span>
                    <span><ArrowIcon className="rotate-180 h-[25px] w-[25px] opacity-[.7]" color="#656565" /></span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <input type="text" className="p-[2px] px-[15px] bg-[#EDEDED] rounded-[20px] h-[50px] w-[350px] mx-[] outline-none font-[500]" placeholder="Phone Number" />
                <input type="text" className="p-[2px] px-[15px] bg-[#EDEDED] rounded-[20px] h-[50px] w-[350px] outline-none font-[500]" placeholder="Email" />
                <textarea name="" id="" placeholder="Additional Notes (Optional)" className="resize-none w-[350px] outline-none h-[100px] font-[500] p-[15px] bg-[#EDEDED] rounded-[20px]"></textarea>
              </div>
              <div className="bg-red-400/0 w-[100%] mt-[10px] flex justify-end">
                <button className='relative self-center mr-[3px] active:bg-black/30 cursor-pointer whitespace-nowrap rounded-full p-[3px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                  <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[30px] py-[10px]'>
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